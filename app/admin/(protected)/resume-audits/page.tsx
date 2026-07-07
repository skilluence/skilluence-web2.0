export const dynamic = 'force-dynamic';
import db from "@/lib/db";
import styles from "@/app/admin/admin.module.css";
import AuditTable from "./AuditTable";

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

export default async function ResumeAuditsPage() {
  const rows = (await db
    .prepare("SELECT id, resume_filename, overall_score, match_summary, category_scores, strengths, gaps, recommended_fixes, missing_keywords, created_at FROM resume_audits ORDER BY created_at DESC")
    .all()) as AuditRow[];

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Resume Audits</h1>
          <p className={styles.pageSub}>
            {rows.length} total audit{rows.length !== 1 ? "s" : ""} — click Details to expand
          </p>
        </div>
        <a
          href="/api/admin/export/resume-audits"
          className={`${styles.btn} ${styles.btnDark}`}
        >
          Export to Excel
        </a>
      </div>

      <div className={styles.card}>
        <AuditTable rows={rows} />
      </div>
    </>
  );
}
