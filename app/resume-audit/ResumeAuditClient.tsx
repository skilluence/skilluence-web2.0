"use client";

import { useState } from "react";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import styles from "./page.module.css";

type CategoryScore = {
  label: string;
  score: number;
  note: string;
};

type AuditResult = {
  overallScore: number;
  matchSummary: string;
  categoryScores: CategoryScore[];
  strengths: string[];
  gaps: string[];
  recommendedFixes: string[];
  missingKeywords: string[];
};

function isSupportedFile(file: File) {
  return (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "text/markdown" ||
    [".pdf", ".txt", ".md"].some((ext) => file.name.toLowerCase().endsWith(ext))
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className={styles["result-list"]}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ResumeAuditClient() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [jobFile, setJobFile] = useState<File | null>(null);
  const [jobName, setJobName] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleResumeFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!isSupportedFile(file)) {
      setError("Please upload a PDF, TXT, or MD file.");
      return;
    }
    setResumeFile(file);
    setResumeName(file.name);
  }

  function handleJobFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!isSupportedFile(file)) {
      setError("Please upload a PDF, TXT, or MD file.");
      return;
    }
    setJobFile(file);
    setJobName(file.name);
    setJobDescriptionText(""); // clear pasted text when a file is chosen
  }

  function handleJobTextChange(value: string) {
    setJobDescriptionText(value);
    // clear the uploaded job file when user pastes/types text
    if (jobFile) {
      setJobFile(null);
      setJobName("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }
    if (!jobFile && !jobDescriptionText.trim()) {
      setError("Please upload a job description file or paste the job description text.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      if (jobFile) {
        formData.append("jobDescription", jobFile);
      } else {
        formData.append("jobDescriptionText", jobDescriptionText.trim());
      }

      const response = await fetch("/api/resume-audit", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      let data: unknown;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `The audit service returned a non-JSON response (${response.status}). Check the Vercel function logs for /api/resume-audit.`
        );
      }

      if (!response.ok) {
        const message =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Resume audit failed. Please try again.";
        throw new Error(message);
      }

      setResult(data as AuditResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Resume audit failed.");
    } finally {
      setIsLoading(false);
    }
  }

  const jobReady = Boolean(jobFile || jobDescriptionText.trim());

  return (
    <section className={styles["audit-body"]}>
      <div className={styles["audit-heading"]}>
        <p className="eyebrow">Upload Materials</p>
        <h2>Resume and job description audit.</h2>
        <p>
          Upload your resume and the job description. PDF, TXT, and MD files
          are supported.
        </p>
      </div>

      <div className={styles["audit-grid"]}>
        <form className={styles["audit-form"]} onSubmit={handleSubmit}>
          <div className={styles["upload-grid"]}>
            <label className={styles["upload-card"]}>
              <UploadCloud size={26} />
              <span>Upload Resume</span>
              <small>{resumeName || "PDF, TXT, or MD accepted"}</small>
              <input
                type="file"
                accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                onChange={(e) => handleResumeFile(e.target.files?.[0])}
              />
            </label>

            <label className={styles["upload-card"]}>
              <FileText size={26} />
              <span>Upload Job Description</span>
              <small>{jobName || "PDF, TXT, or MD accepted"}</small>
              <input
                type="file"
                accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                onChange={(e) => handleJobFile(e.target.files?.[0])}
              />
            </label>
          </div>

          <div className={styles["upload-status-grid"]}>
            <div
              className={styles["upload-status"]}
              data-ready={resumeFile ? "true" : "false"}
            >
              <span>Resume</span>
              <strong>{resumeFile ? "Ready for scoring" : "Waiting for upload"}</strong>
            </div>
            <div
              className={styles["upload-status"]}
              data-ready={jobReady ? "true" : "false"}
            >
              <span>Job description</span>
              <strong>{jobReady ? "Ready for scoring" : "Waiting for upload"}</strong>
            </div>
          </div>

          <label>
            Or paste job description
            <textarea
              value={jobDescriptionText}
              onChange={(e) => handleJobTextChange(e.target.value)}
              placeholder="Paste the job description here if you do not want to upload a file..."
              rows={8}
            />
          </label>

          {error && <p className={styles["audit-error"]}>{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className={styles["spinner"]} size={18} /> Scoring Resume
              </>
            ) : (
              "Score My Resume"
            )}
          </button>
        </form>

        <aside className={styles["audit-result"]}>
          {result ? (
            <>
              <div className={styles["score-ring"]}>
                <strong>{Math.round(result.overallScore)}</strong>
                <span>/100</span>
              </div>
              <h2>Resume match score</h2>
              <p>{result.matchSummary}</p>

              <div className={styles["category-grid"]}>
                {result.categoryScores?.map((category) => (
                  <div key={category.label} className={styles["category-card"]}>
                    <span>{category.label}</span>
                    <strong>{Math.round(category.score)}%</strong>
                    <p>{category.note}</p>
                  </div>
                ))}
              </div>

              <ResultList title="Strengths" items={result.strengths} />
              <ResultList title="Gaps" items={result.gaps} />
              <ResultList title="Recommended fixes" items={result.recommendedFixes} />
              <ResultList title="Missing keywords" items={result.missingKeywords} />
            </>
          ) : (
            <div className={styles["empty-result"]}>
              <span>AI Audit</span>
              <h2>Your score will appear here.</h2>
              <p>
                Upload both documents, then run the audit to receive a
                role-specific score and improvement plan.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
