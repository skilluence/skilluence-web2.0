"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";
import styles from "@/app/contact/page.module.css";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error ?? "Submission failed.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not send message. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <form className={styles["contact-form"]} onSubmit={handleSubmit} noValidate>
        <div className={styles["form-row"]}>
          <label>
            Name
            <input type="text" name="name" placeholder="Enter your name" required />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" placeholder="Enter phone number" />
          </label>
        </div>

        <label>
          Email
          <input type="email" name="email" placeholder="Enter email address" required />
        </label>

        <label>
          Service Interest
          <select name="service" defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            <option>Job Placement</option>
            <option>Resume Writing and LinkedIn Optimization</option>
            <option>Interview Coaching</option>
            <option>Mock Interview Services</option>
            <option>W2 Employment</option>
            <option>C2C</option>
          </select>
        </label>

        <label>
          Message
          <textarea name="message" placeholder="Tell us what support you need" rows={5} />
        </label>

        {status === "error" && (
          <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>{errorMsg}</p>
        )}

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? (
            "Sending..."
          ) : (
            <>
              Send Message <Send size={16} />
            </>
          )}
        </button>
      </form>

      {status === "success" && (
        <div
          className={styles["success-modal-backdrop"]}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
        >
          <div className={styles["success-modal"]}>
            <button
              type="button"
              className={styles["success-modal-close"]}
              aria-label="Close success message"
              onClick={() => setStatus("idle")}
            >
              <X size={18} />
            </button>
            <p className="eyebrow">Submission received</p>
            <h3 id="contact-success-title">Form submission successful</h3>
            <p>
              Thank you for reaching out. A Skilluence advisor will contact you
              within one business day.
            </p>
            <button type="button" onClick={() => setStatus("idle")}>
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}
