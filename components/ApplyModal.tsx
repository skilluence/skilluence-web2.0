"use client";

import { useEffect, useRef, useState } from "react";
import { X, Paperclip } from "lucide-react";
import styles from "./ApplyModal.module.css";

interface ApplyModalProps {
  jobTitle: string;
  onClose: () => void;
}

export default function ApplyModal({ jobTitle, onClose }: ApplyModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("jobTitle", jobTitle);

    try {
      const response = await fetch("/api/career/apply", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("An error occurred while submitting your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles["modal-backdrop"]} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles["modal"]} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles["modal-header"]}>
          <div>
            <p className={styles["modal-label"]}>Applying for</p>
            <h3 id="modal-title">{jobTitle}</h3>
          </div>
          <button className={styles["modal-close"]} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form className={styles["modal-form"]} onSubmit={handleSubmit}>
          <div className={styles["form-row"]}>
            <div className={styles["form-field"]}>
              <label htmlFor="apply-name">Full Name</label>
              <input id="apply-name" type="text" name="name" placeholder="Your full name" required />
            </div>
            <div className={styles["form-field"]}>
              <label htmlFor="apply-email">Email Address</label>
              <input id="apply-email" type="email" name="email" placeholder="your@email.com" required />
            </div>
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="apply-phone">Phone Number</label>
            <input id="apply-phone" type="tel" name="phone" placeholder="+1 (000) 000-0000" required />
          </div>
          <div className={styles["form-field"]}>
            <label htmlFor="apply-resume">Resume / CV</label>
            <label htmlFor="apply-resume" className={styles["file-upload"]}>
              <Paperclip size={16} aria-hidden="true" />
              <span>{fileName ?? "Upload your resume (PDF, DOC, DOCX)"}</span>
              <input
                id="apply-resume"
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                required
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
          </div>
          <button type="submit" className={styles["submit-btn"]} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
