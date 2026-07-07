"use client";

import { Fragment, useState } from "react";
import styles from "@/app/admin/admin.module.css";

interface CategoryScore {
  label: string;
  score: number;
  note: string;
}

interface AuditRow {
  id: number;
  resume_filename: string;
  overall_score: number;
  match_summary: string;
  category_scores: string;
  strengths: string;
  gaps: string;
  recommended_fixes: string;
  missing_keywords: string;
  created_at: string;
}

function scoreClass(score: number) {
  if (score >= 70) return styles.scoreHigh;
  if (score >= 45) return styles.scoreMid;
  return styles.scoreLow;
}

function safeJson<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export default function AuditTable({ rows }: { rows: AuditRow[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function toggle(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (rows.length === 0) {
    return <p className={styles.empty}>No resume audits yet.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Score</th>
            <th>Resume File</th>
            <th>Match Summary</th>
            <th>Date</th>
            <th>PDF</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isExpanded = expandedId === row.id;
            const categories = safeJson<CategoryScore[]>(row.category_scores, []);
            const strengths = safeJson<string[]>(row.strengths, []);
            const gaps = safeJson<string[]>(row.gaps, []);
            const fixes = safeJson<string[]>(row.recommended_fixes, []);
            const keywords = safeJson<string[]>(row.missing_keywords, []);

            return (
              <Fragment key={row.id}>
                <tr>
                  <td style={{ color: "#94a3b8" }}>{row.id}</td>
                  <td>
                    <span className={`${styles.scoreCircle} ${scoreClass(row.overall_score)}`}>
                      {row.overall_score}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    <span className={styles.truncate}>{row.resume_filename}</span>
                  </td>
                  <td>
                    <span className={styles.truncate}>{row.match_summary}</span>
                  </td>
                  <td style={{ whiteSpace: "nowrap", color: "#94a3b8" }}>
                    {new Date(row.created_at).toLocaleDateString("en-US")}
                  </td>
                  <td>
                    <a
                      href={`/api/admin/resume/${row.id}`}
                      className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                      download
                    >
                      Download
                    </a>
                  </td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                      onClick={() => toggle(row.id)}
                    >
                      {isExpanded ? "Collapse" : "Details"}
                    </button>
                  </td>
                </tr>

                {isExpanded && (
                  <tr key={`${row.id}-expand`} className={styles.expandRow}>
                    <td colSpan={7}>
                      <div className={styles.expandInner}>
                        {/* Category scores */}
                        <div className={styles.expandSection} style={{ gridColumn: "1 / -1" }}>
                          <h4>Category Scores</h4>
                          <div className={styles.expandCategories}>
                            {categories.map((c) => (
                              <div key={c.label} className={styles.expandCategoryCard}>
                                <p className={styles.expandCategoryLabel}>{c.label}</p>
                                <p className={styles.expandCategoryScore}>{c.score}%</p>
                                <p className={styles.expandCategoryNote}>{c.note}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={styles.expandSection}>
                          <h4>Strengths</h4>
                          <ul>
                            {strengths.map((s) => <li key={s}>{s}</li>)}
                          </ul>
                        </div>

                        <div className={styles.expandSection}>
                          <h4>Gaps</h4>
                          <ul>
                            {gaps.map((g) => <li key={g}>{g}</li>)}
                          </ul>
                        </div>

                        <div className={styles.expandSection}>
                          <h4>Recommended Fixes</h4>
                          <ul>
                            {fixes.map((f) => <li key={f}>{f}</li>)}
                          </ul>
                        </div>

                        <div className={styles.expandSection}>
                          <h4>Missing Keywords</h4>
                          <ul>
                            {keywords.map((k) => <li key={k}>{k}</li>)}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
