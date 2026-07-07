"use client";

import { useMemo, useState } from "react";
import styles from "@/app/admin/admin.module.css";

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
}

const iconOptions = [
  "Briefcase",
  "BrainCircuit",
  "BarChart3",
  "Code",
  "Database",
  "Users",
  "Handshake",
];

const defaultFormState = {
  title: "",
  department: "",
  shift: "",
  description: "",
  location: "",
  schedule: "",
  experience: "",
  icon: "Briefcase",
  active: true,
};

export default function AdminJobPostingsManager({ initialJobs }: { initialJobs: JobListing[] }) {
  const [jobs, setJobs] = useState<JobListing[]>(initialJobs);
  const [formState, setFormState] = useState({ ...defaultFormState });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditing = selectedId !== null;

  const toggleActiveLabel = useMemo(
    () => (formState.active ? "Active" : "Inactive"),
    [formState.active]
  );

  const resetForm = () => {
    setSelectedId(null);
    setFormState({ ...defaultFormState });
    setStatus(null);
  };

  const handleInput = (field: string, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const submitForm = async () => {
    setSaving(true);
    setStatus(null);

    try {
      const payload = {
        ...formState,
        active: formState.active,
      };

      const url = selectedId
        ? `/api/admin/job-listings/${selectedId}`
        : "/api/admin/job-listings";
      const method = selectedId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Unable to save job posting.");
      }

      const updatedJobs = await fetch("/api/admin/job-listings").then((res) => res.json());
      setJobs(updatedJobs ?? []);
      setStatus(selectedId ? "Job updated successfully." : "Job created successfully.");
      resetForm();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  };

  const editJob = (job: JobListing) => {
    setSelectedId(job.id);
    setFormState({
      title: job.title,
      department: job.department,
      shift: job.shift,
      description: job.description,
      location: job.location,
      schedule: job.schedule,
      experience: job.experience,
      icon: job.icon || "Briefcase",
      active: Boolean(job.active),
    });
    setStatus(null);
  };

  const deleteJob = async (id: number) => {
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/admin/job-listings/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Unable to delete job posting.");
      }
      setJobs((current) => current.filter((job) => job.id !== id));
      if (selectedId === id) resetForm();
      setStatus("Job deleted successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{isEditing ? "Edit Job Posting" : "Create Job Posting"}</h3>
        <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`} type="button" onClick={resetForm}>
          New Posting
        </button>
      </div>
      <div className={styles.card} style={{ padding: "24px" }}>
        <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <label>
              Title
              <input
                className={styles.inputField}
                value={formState.title}
                onChange={(event) => handleInput("title", event.target.value)}
              />
            </label>
            <label>
              Department
              <input
                className={styles.inputField}
                value={formState.department}
                onChange={(event) => handleInput("department", event.target.value)}
              />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <label>
              Shift
              <input
                className={styles.inputField}
                value={formState.shift}
                onChange={(event) => handleInput("shift", event.target.value)}
              />
            </label>
            <label>
              Location
              <input
                className={styles.inputField}
                value={formState.location}
                onChange={(event) => handleInput("location", event.target.value)}
              />
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <label>
              Schedule
              <input
                className={styles.inputField}
                value={formState.schedule}
                onChange={(event) => handleInput("schedule", event.target.value)}
              />
            </label>
            <label>
              Experience
              <input
                className={styles.inputField}
                value={formState.experience}
                onChange={(event) => handleInput("experience", event.target.value)}
              />
            </label>
          </div>
          <label>
            Icon
            <select
              className={styles.inputField}
              value={formState.icon}
              onChange={(event) => handleInput("icon", event.target.value)}
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </label>
          <label>
            Description
            <textarea
              className={styles.textareaField}
              rows={5}
              value={formState.description}
              onChange={(event) => handleInput("description", event.target.value)}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              checked={formState.active}
              onChange={(event) => handleInput("active", event.target.checked)}
            />
            <span>{toggleActiveLabel}</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDark}`}
            onClick={submitForm}
            disabled={saving}
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create job"}
          </button>
          {isEditing && (
            <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={resetForm} disabled={saving}>
              Cancel
            </button>
          )}
        </div>
        {status && <p style={{ marginTop: 12, color: "#334155" }}>{status}</p>}
      </div>

      <div className={styles.tableWrap}>
        {jobs.length === 0 ? (
          <p className={styles.empty}>No job postings found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.location}</td>
                  <td>{job.schedule}</td>
                  <td>{job.active ? "Active" : "Inactive"}</td>
                  <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                      onClick={() => editJob(job)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                      onClick={() => deleteJob(job.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
