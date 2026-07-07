export const dynamic = "force-dynamic";
import db from "@/lib/db";
import styles from "@/app/admin/admin.module.css";
import Link from "next/link";

interface Submission {
  id: number;
  source: string;
  name: string;
  email: string;
  service: string | null;
  subject: string | null;
  created_at: string;
}

interface Audit {
  id: number;
  resume_filename: string;
  overall_score: number;
  created_at: string;
}

function scoreClass(score: number) {
  if (score >= 70) return styles.scoreHigh;
  if (score >= 45) return styles.scoreMid;
  return styles.scoreLow;
}

export default async function AdminDashboard() {
  const totalConsultations = (
    (await db
      .prepare("SELECT COUNT(*) as c FROM contact_submissions WHERE source = 'consultation'")
      .get()) as { c: number }
  ).c;

  const totalMessages = (
    (await db
      .prepare("SELECT COUNT(*) as c FROM contact_submissions WHERE source = 'contact'")
      .get()) as { c: number }
  ).c;

  const totalAudits = (
    (await db.prepare("SELECT COUNT(*) as c FROM resume_audits").get()) as { c: number }
  ).c;

  const avgScore = (
    (await db
      .prepare("SELECT ROUND(AVG(overall_score), 1) as avg FROM resume_audits")
      .get()) as { avg: number | null }
  ).avg;

  const recentSubmissions = (await db
    .prepare(
      "SELECT id, source, name, email, service, subject, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 8"
    )
    .all()) as Submission[];

  const recentAudits = (await db
    .prepare(
      "SELECT id, resume_filename, overall_score, created_at FROM resume_audits ORDER BY created_at DESC LIMIT 8"
    )
    .all()) as Audit[];

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSub}>Overview of all site activity</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Consultations</p>
          <p className={styles.statValue}>{totalConsultations}</p>
          <p className={styles.statSub}>Callback requests</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Contact Messages</p>
          <p className={styles.statValue}>{totalMessages}</p>
          <p className={styles.statSub}>Contact form submissions</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Resume Audits</p>
          <p className={styles.statValue}>{totalAudits}</p>
          <p className={styles.statSub}>Total audits run</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Avg Resume Score</p>
          <p className={styles.statValue}>{avgScore ?? "\u2014"}</p>
          <p className={styles.statSub}>Out of 100</p>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Form Submissions</h2>
          <Link href="/admin/submissions" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}>
            View all
          </Link>
        </div>
        <div className={styles.tableWrap}>
          {recentSubmissions.length === 0 ? (
            <p className={styles.empty}>No submissions yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service / Subject</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className={`${styles.badge} ${row.source === "consultation" ? styles.badgeBlue : styles.badgeGreen}`}>
                        {row.source}
                      </span>
                    </td>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>
                      <span className={styles.truncate}>
                        {row.service ?? row.subject ?? "\u2014"}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap", color: "#94a3b8" }}>
                      {new Date(row.created_at).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Audits */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Resume Audits</h2>
          <Link href="/admin/resume-audits" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}>
            View all
          </Link>
        </div>
        <div className={styles.tableWrap}>
          {recentAudits.length === 0 ? (
            <p className={styles.empty}>No audits yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Resume File</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentAudits.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className={`${styles.scoreCircle} ${scoreClass(row.overall_score)}`}>
                        {row.overall_score}
                      </span>
                    </td>
                    <td>
                      <span className={styles.truncate}>{row.resume_filename}</span>
                    </td>
                    <td style={{ whiteSpace: "nowrap", color: "#94a3b8" }}>
                      {new Date(row.created_at).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
