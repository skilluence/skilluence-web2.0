import SiteFooter from "@/components/footer/Footer";
import ResumeAuditClient from "./ResumeAuditClient";
import styles from "./page.module.css";

export const metadata = {
  title: "Free Resume Audit | Skilluence",
  description:
    "Upload your resume and a job description to get an AI-powered resume match score and practical improvement recommendations.",
};

export default function ResumeAuditPage() {
  return (
    <main>
      <section className={styles["audit-hero"]}>
        <div className={styles["audit-hero-inner"]}>
          <div className={styles["audit-kicker"]}>
            <span>Free Resume Audit</span>
            <span>AI Match Score</span>
          </div>
          <div className={styles["audit-hero-layout"]}>
            <div className={styles["audit-hero-main"]}>
              <p className="eyebrow">Resume scoring</p>
              <h1>See how well your resume matches the role.</h1>
              <p>
                Upload your resume and the job description. We will compare
                role alignment, skills match, ATS readiness, and impact clarity
                using a Groq-powered analysis.
              </p>
            </div>
            <aside className={styles["audit-hero-snapshot"]}>
              <span>What you get</span>
              <strong>Score + fixes</strong>
              <p>
                Get a clear score, missing keywords, strengths, gaps, and
                action steps before you apply.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <ResumeAuditClient />
      <SiteFooter />
    </main>
  );
}
