export const dynamic = 'force-dynamic';
import db from "@/lib/db";
import styles from "@/app/admin/admin.module.css";
import Link from "next/link";

interface Submission {
  id: number;
  source: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  subject: string | null;
  message: string | null;
  created_at: string;
}

type Source = "all" | "contact" | "consultation";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;
  const filter: Source =
    source === "contact" || source === "consultation" ? source : "all";

  const rows =
    filter === "all"
      ? ((await db
          .prepare("SELECT * FROM contact_submissions ORDER BY created_at DESC")
          .all()) as Submission[])
      : ((await db
          .prepare(
            "SELECT * FROM contact_submissions WHERE source = ? ORDER BY created_at DESC"
          )
          .all(filter)) as Submission[]);

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Form Submissions</h1>
          <p className={styles.pageSub}>{rows.length} total record{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <a
          href="/api/admin/export/submissions"
          className={`${styles.btn} ${styles.btnDark}`}
        >
          Export to Excel
        </a>
      </div>

      <div className={styles.card}>
        <div className={styles.filterRow}>
          {(["all", "consultation", "contact"] as const).map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/admin/submissions" : `/admin/submissions?source=${s}`}
              className={`${styles.filterBtn} ${filter === s ? styles.filterBtnActive : ""}`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </Link>
          ))}
        </div>

        <div className={styles.tableWrap}>
          {rows.length === 0 ? (
            <p className={styles.empty}>No submissions found.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Source</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Service / Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ color: "#94a3b8" }}>{row.id}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          row.source === "consultation"
                            ? styles.badgeBlue
                            : styles.badgeGreen
                        }`}
                      >
                        {row.source}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.phone ?? "—"}</td>
                    <td>
                      <span className={styles.truncate}>
                        {row.service ?? row.subject ?? "—"}
                      </span>
                    </td>
                    <td>
                      <span className={styles.truncate}>{row.message ?? "—"}</span>
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
