export const dynamic = 'force-dynamic';
import db from "@/lib/db";
import styles from "@/app/admin/admin.module.css";
import AdminJobPostingsManager from "@/components/AdminJobPostingsManager";

interface JobListing {
  id: number;
  title: string;
  department: string;
  shift: string;
  description: string;
  location: string;
  schedule: string;
  experience: string;
  icon: string;
  active: number | boolean;
  created_at: string;
  updated_at: string;
}

export default async function JobPostingsPage() {
  const jobPostings = (await db
    .prepare(
      "SELECT id, title, department, shift, description, location, schedule, experience, icon, active, created_at, updated_at FROM job_listings ORDER BY created_at DESC"
    )
    .all()) as JobListing[];

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Job Postings</h1>
          <p className={styles.pageSub}>Manage the roles shown on the career page.</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Open Roles</h2>
        </div>
        <AdminJobPostingsManager initialJobs={jobPostings} />
      </div>
    </>
  );
}
