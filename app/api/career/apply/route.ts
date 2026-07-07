import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobTitle = formData.get("jobTitle");
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const resume = formData.get("resume") as File;

    if (!jobTitle || typeof jobTitle !== "string" || !jobTitle.trim()) {
      return NextResponse.json({ error: "Job title is required." }, { status: 400 });
    }

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !resume) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const buffer = Buffer.from(await resume.arrayBuffer());
    const safeName = sanitizeFilename(resume.name);
    const uniqueName = `${Date.now()}-${safeName}`;

    await db.prepare(`
      INSERT INTO job_applications (job_title, name, email, phone, resume_filename, resume_path, resume_content_type, resume_blob)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      jobTitle,
      name.trim(),
      email.trim(),
      phone.trim(),
      resume.name,
      uniqueName,
      resume.type || "application/octet-stream",
      buffer,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing job application:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}