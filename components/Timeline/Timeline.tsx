"use client";

import React from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, FileCheck2, Handshake, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./Timeline.module.css";

export interface TimelineItem {
  number: string;
  title: string;
  text: string;
  bullets?: string[];
  date?: string;
  status?: "completed" | "current" | "upcoming";
  category?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const timelineIcons = [FileCheck2, BriefcaseBusiness, MessageSquareText, Handshake];

export function Timeline({ items, className }: TimelineProps) {
  if (!items || items.length === 0) {
    return (
      <div className={cn(styles["timeline-empty"], className)}>
        <p>No timeline items to display</p>
      </div>
    );
  }

  return (
    <section
      className={cn(styles["animated-timeline"], className)}
      role="list"
      aria-label="Skilluence placement process timeline"
    >
      <div className={styles["animated-timeline-track"]} aria-hidden="true" />
      <motion.div
        className={styles["animated-timeline-progress"]}
        initial={{ scaleY: 0 }}
        whileInView={{
          scaleY: 1,
          transition: { duration: 1.1, ease: "easeOut", delay: 0.15 },
        }}
        viewport={{ once: true }}
        aria-hidden="true"
      />

      <div className={styles["animated-timeline-list"]}>
        {items.map((item, index) => {
          const status = item.status || (index < 2 ? "completed" : index === 2 ? "current" : "upcoming");
          const IconComponent = timelineIcons[index] ?? FileCheck2;
          const progressValue = Math.round(((index + 1) / items.length) * 100);

          return (
            <motion.div
              key={item.title}
              className={styles["animated-timeline-item"]}
              initial={{ opacity: 0, y: 36, scale: 0.98 }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              viewport={{ once: true, margin: "-30px" }}
              role="listitem"
              aria-label={`Timeline item ${index + 1}: ${item.title}`}
            >
              <div className={styles["timeline-node"]}>
                <IconComponent aria-hidden="true" />
              </div>

              <motion.article
                className={styles["timeline-card"]}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles["timeline-card-header"]}>
                  <div>
                    <span className={styles["timeline-step"]}>{item.number}</span>
                    <h3>{item.title}</h3>
                    {(item.category || item.date) && (
                      <div className={styles["timeline-meta"]}>
                        {item.category && <span>{item.category}</span>}
                        {item.category && item.date && <i aria-hidden="true" />}
                        {item.date && <time dateTime={item.date}>{item.date}</time>}
                      </div>
                    )}
                  </div>
                  <span className={styles["timeline-status"]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                <p>{item.text}</p>

                {item.bullets && item.bullets.length > 0 && (
                  <ul>
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}

                <div
                  className={styles["timeline-progress-shell"]}
                  role="progressbar"
                  aria-valuenow={progressValue}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progress for ${item.title}`}
                >
                  <motion.div
                    className={styles["timeline-progress-bar"]}
                    initial={{ width: 0 }}
                    whileInView={{
                      width: `${progressValue}%`,
                    }}
                    transition={{
                      duration: 1,
                      delay: index * 0.16 + 0.4,
                      ease: "easeOut",
                    }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.article>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
