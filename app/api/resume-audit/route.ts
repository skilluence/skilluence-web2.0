import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const UPLOADS_ROOT = process.env.VERCEL ? "/tmp" : process.cwd();
const UPLOADS_DIR = path.join(UPLOADS_ROOT, "uploads", "resumes");

export const runtime = "nodejs";

function cleanInput(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 18000) : "";
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

async function extractFileText(file: File | null): Promise<string> {
  if (!file) return "";

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();

  if (file.type === "application/pdf" || fileName.endsWith(".pdf")) {
    try {
      // Import lib file directly — avoids pdf-parse's test-fixture loader which
      // crashes in Next.js because those test files aren't included in the bundle.
      const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default as (
        dataBuffer: Buffer
      ) => Promise<{ text: string }>;
      const parsed = await pdfParse(buffer);
      return cleanInput(parsed.text);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Invalid PDF") || msg.includes("Bad XRef")) {
        throw new Error("The PDF appears to be corrupted or password-protected.");
      }
      throw new Error(
        "Could not extract text from the PDF. Make sure it is a text-based PDF (not a scanned image)."
      );
    }
  }

  if (
    file.type.startsWith("text/") ||
    fileName.endsWith(".txt") ||
    fileName.endsWith(".md")
  ) {
    return cleanInput(buffer.toString("utf8"));
  }

  throw new Error("Only PDF, TXT, and MD files are supported.");
}

async function saveResumeToDisk(file: File): Promise<{ savedPath: string; savedName: string }> {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  const safeName = sanitizeFilename(file.name);
  const savedName = `${Date.now()}-${safeName}`;
  const savedPath = path.join("uploads", "resumes", savedName);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOADS_ROOT, savedPath), buffer);
  return { savedPath, savedName };
}

interface AuditResult {
  overallScore: number;
  matchSummary: string;
  categoryScores: { label: string; score: number; note: string }[];
  strengths: string[];
  gaps: string[];
  recommendedFixes: string[];
  missingKeywords: string[];
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured. Add it to .env.local." },
      { status: 500 }
    );
  }

  let resumeText = "";
  let jobDescriptionText = "";
  let resumeFile: File | null = null;

  try {
    const formData = await request.formData();
    resumeFile = formData.get("resume") as File | null;
    resumeText = await extractFileText(resumeFile);
    const jobFile = formData.get("jobDescription") as File | null;
    jobDescriptionText = jobFile
      ? await extractFileText(jobFile)
      : cleanInput(formData.get("jobDescriptionText"));
  } catch (caught) {
    return NextResponse.json(
      {
        error:
          caught instanceof Error
            ? caught.message
            : "Could not read the uploaded files.",
      },
      { status: 400 }
    );
  }

  if (!resumeText || resumeText.length < 80) {
    return NextResponse.json(
      { error: "Resume text is too short or could not be read. Please check the file." },
      { status: 400 }
    );
  }

  if (!jobDescriptionText || jobDescriptionText.length < 50) {
    return NextResponse.json(
      { error: "Job description text is too short. Please provide more detail." },
      { status: 400 }
    );
  }

  const prompt = `You are an expert U.S. recruiting strategist and ATS resume auditor.
Score the resume against the job description and return only valid JSON.

JSON shape:
{
  "overallScore": number,
  "matchSummary": string,
  "categoryScores": [
    { "label": "Role alignment", "score": number, "note": string },
    { "label": "Skills match", "score": number, "note": string },
    { "label": "ATS readiness", "score": number, "note": string },
    { "label": "Impact clarity", "score": number, "note": string }
  ],
  "strengths": string[],
  "gaps": string[],
  "recommendedFixes": string[],
  "missingKeywords": string[]
}

Rules:
- Scores must be integers between 0 and 100.
- Be specific and practical.
- Keep every array to 3-6 items.
- Do not include markdown fences or any text outside the JSON.

Resume:
${resumeText}

Job description:
${jobDescriptionText}`;

  let groqResponse: Response;
  try {
    groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a resume scoring API. Return strict JSON only, without markdown fences.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });
  } catch (caught) {
    return NextResponse.json(
      {
        error: "Could not reach the Groq API. Check your internet connection.",
        detail: caught instanceof Error ? caught.message : String(caught),
      },
      { status: 502 }
    );
  }

  if (!groqResponse.ok) {
    const errorText = await groqResponse.text();
    return NextResponse.json(
      {
        error: `Groq API error (${groqResponse.status}).`,
        detail: errorText.slice(0, 500),
      },
      { status: 502 }
    );
  }

  const groqData = await groqResponse.json();
  const content = groqData?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    return NextResponse.json(
      { error: "Groq returned an unexpected response format." },
      { status: 502 }
    );
  }

  let audit: AuditResult;
  try {
    audit = JSON.parse(content) as AuditResult;
  } catch {
    return NextResponse.json(
      { error: "Could not parse Groq audit result as JSON.", raw: content.slice(0, 1000) },
      { status: 502 }
    );
  }

  // Save resume PDF to disk and persist analysis to DB
  const { default: db } = await import("@/lib/db");
  let savedPath = "";
  let savedFilename = resumeFile?.name ?? "unknown";
  let resumeContentType = resumeFile?.type || "application/octet-stream";
  let resumeBlob: Buffer | null = null;

  if (resumeFile) {
    resumeBlob = Buffer.from(await resumeFile.arrayBuffer());

    try {
      const saved = await saveResumeToDisk(resumeFile);
      savedPath = saved.savedPath;
      savedFilename = resumeFile.name;
    } catch {
      // Ignore disk write failures; we still want to keep the DB audit.
    }
  }

  try {
    await db.prepare(`
      INSERT INTO resume_audits
        (resume_filename, resume_path, resume_content_type, resume_blob, job_description, overall_score, match_summary,
         category_scores, strengths, gaps, recommended_fixes, missing_keywords)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      savedFilename,
      savedPath,
      resumeContentType,
      resumeBlob,
      jobDescriptionText.slice(0, 4000),
      Math.round(audit.overallScore),
      audit.matchSummary,
      JSON.stringify(audit.categoryScores),
      JSON.stringify(audit.strengths),
      JSON.stringify(audit.gaps),
      JSON.stringify(audit.recommendedFixes),
      JSON.stringify(audit.missingKeywords),
    );
  } catch (dbErr) {
    console.error("[resume-audit] DB insert failed:", dbErr);
  }

  return NextResponse.json(audit);
}
