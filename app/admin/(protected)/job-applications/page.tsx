export const dynamic = 'force-dynamic';
import db from "@/lib/db";
import styles from "@/app/admin/admin.module.css";
import Link from "next/link";

interface JobApplication {
  id: number;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  resume_filename: string;
  resume_path: string;
  created_at: string;
}

export default async function JobApplicationsPage() {
  const rows = (await db
    .prepare("SELECT id, job_title, name, email, phone, resume_filename, resume_path, created_at FROM job_applications ORDER BY created_at DESC")
    .all()) as JobApplication[];

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Job Applications</h1>
          <p className={styles.pageSub}>{rows.length} total application{rows.length !== 1 ? "s" : ""}</p>
        </div>
        <a
          href="/api/admin/export/job-applications"
          className={`${styles.btn} ${styles.btnDark}`}
        >
          Export to Excel
        </a>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          {rows.length === 0 ? (
            <p className={styles.empty}>No job applications found.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job Title</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Resume</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ color: "#94a3b8" }}>{row.id}</td>
                    <td>{row.job_title}</td>
                    <td style={{ fontWeight: 600 }}>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.phone}</td>
                    <td>
                      <a
                        href={`/api/admin/job-application/${row.id}/resume`}
                        className={styles.link}
                        download
                      >
                        {row.resume_filename}
                      </a>
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
