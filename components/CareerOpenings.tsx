"use client";

import { useState } from "react";
import {
  MapPin,
  Clock,
  Briefcase,
  BrainCircuit,
  BarChart3,
  Code,
  Database,
  Users,
  Handshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ApplyModal from "./ApplyModal";
import styles from "@/app/career/page.module.css";

const iconMap: Record<string, LucideIcon> = {
  BrainCircuit,
  BarChart3,
  Code,
  Database,
  Users,
  Handshake,
  Briefcase,
};

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
}

interface CareerOpeningsProps {
  jobs: JobListing[];
}

export default function CareerOpenings({ jobs }: CareerOpeningsProps) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const handleApply = (jobTitle: string) => {
    setSelectedJob(jobTitle);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  return (
    <>
      <div className={styles["openings-grid"]}>
        {jobs.length === 0 ? (
          <div className={styles["job-card"]}>
            <p>No job postings are available right now.</p>
          </div>
        ) : (
          jobs.map((job) => {
            const JobIcon = iconMap[job.icon] ?? Briefcase;

            return (
              <article key={job.id} className={styles["job-card"]}>
                <div className={styles["job-card-top"]}>
                  <div className={styles["job-icon"]}>
                    <JobIcon size={22} />
                  </div>
                  <div className={styles["job-badges"]}>
                    <span className={styles["job-dept"]}>{job.department}</span>
                    <span className={styles["job-shift"]}>{job.shift}</span>
                  </div>
                </div>

                <h3 className={styles["job-title"]}>{job.title}</h3>
                <p className={styles["job-description"]}>{job.description}</p>

                <ul className={styles["job-meta"]}>
                  <li>
                    <MapPin size={14} aria-hidden="true" />
                    {job.location}
                  </li>
                  <li>
                    <Clock size={14} aria-hidden="true" />
                    {job.schedule}
                  </li>
                  <li>
                    <Briefcase size={14} aria-hidden="true" />
                    {job.experience}
                  </li>
                </ul>

                <button
                  className={styles["job-apply-btn"]}
                  onClick={() => handleApply(job.title)}
                >
                  Apply Now
                </button>
              </article>
            );
          })
        )}
      </div>
      {selectedJob && <ApplyModal jobTitle={selectedJob} onClose={closeModal} />}
    </>
  );
}
