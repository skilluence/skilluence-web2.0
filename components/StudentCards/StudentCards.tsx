"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  AlarmClock,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  SearchX,
  ShieldAlert,
  UserRoundX,
} from "lucide-react";
import styles from "./StudentCards.module.css";

/* ── mini visuals (decorative, aria-hidden) ── */

function ScatterViz() {
  const reduceMotion = useReducedMotion();
  const cells = Array.from({ length: 21 });
  const targeted = 10;

  return (
    <div className={styles["viz-scatter"]} aria-hidden="true">
      {cells.map((_, i) => (
        <motion.span
          key={i}
          className={i === targeted ? styles["is-hit"] : undefined}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 + (i % 7) * 0.06 + Math.floor(i / 7) * 0.1, duration: 0.35 }}
        >
          {i === targeted ? "✓" : "×"}
        </motion.span>
      ))}
      <p>Untargeted applications rarely land — one researched match does.</p>
    </div>
  );
}

function MissingSupportViz() {
  const missing = ["Career services", "Referral network", "Insider guidance"];
  return (
    <ul className={styles["viz-missing"]} aria-hidden="true">
      {missing.map((item) => (
        <li key={item}>
          <span />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ResumeGapViz() {
  return (
    <div className={styles["viz-resume"]} aria-hidden="true">
      <span className={styles["viz-line-wide"]} />
      <span />
      <span className={styles["viz-line-gap"]} />
      <span />
      <span className={styles["viz-line-gap"]} />
    </div>
  );
}

function SkillChipsViz() {
  return (
    <div className={styles["viz-skills"]} aria-hidden="true">
      <span className={styles["is-present"]}>Python</span>
      <span>Cloud</span>
      <span className={styles["is-present"]}>SQL</span>
      <span>CI/CD</span>
    </div>
  );
}

function SponsorToggleViz() {
  return (
    <div className={styles["viz-toggle"]} aria-hidden="true">
      <span className={styles["viz-toggle-label"]}>H-1B sponsorship</span>
      <span className={styles["viz-toggle-switch"]}>
        <i />
      </span>
    </div>
  );
}

function BrandMismatchViz() {
  const rows = [
    { channel: "Resume", says: "Data Analyst" },
    { channel: "LinkedIn", says: "Software Engineer" },
    { channel: "Outreach", says: "BI Consultant" },
  ];
  return (
    <ul className={styles["viz-brand"]} aria-hidden="true">
      {rows.map((row) => (
        <li key={row.channel}>
          <span>{row.channel}</span>
          <strong>{row.says}</strong>
        </li>
      ))}
    </ul>
  );
}

function OptClockViz() {
  const reduceMotion = useReducedMotion();
  const months = 12;
  const used = 8;

  return (
    <div className={styles["viz-clock"]} aria-hidden="true">
      <div className={styles["viz-clock-track"]}>
        {Array.from({ length: months }).map((_, i) => (
          <motion.span
            key={i}
            className={i < used ? styles["is-used"] : styles["is-left"]}
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.09, duration: 0.3 }}
          />
        ))}
      </div>
      <div className={styles["viz-clock-labels"]}>
        <span>OPT clock</span>
        <span>month 8 of 12</span>
      </div>
    </div>
  );
}

/* ── cards ── */

const struggleCards = [
  {
    id: 4,
    label: "Strategy",
    title: "Wrong Strategy",
    body: "Applying to 100+ jobs on Indeed without a plan wastes your precious OPT time. Most students target every opening the same way, skip recruiter follow-ups, and never build a sponsor-friendly company list.",
    icon: SearchX,
    span: "large",
    tone: "dark",
    visual: <ScatterViz />,
  },
  {
    id: 5,
    label: "Support",
    title: "Limited Resources",
    body: "Without career services or professional guidance, you're competing blind against candidates who have insider help.",
    icon: BriefcaseBusiness,
    span: "tall",
    visual: <MissingSupportViz />,
  },
  {
    id: 2,
    label: "Resume",
    title: "Resume Gaps",
    body: "Your academic resume doesn't translate to industry standards. Recruiters see outdated formats and skip your application.",
    icon: FileText,
    span: "standard",
    visual: <ResumeGapViz />,
  },
  {
    id: 3,
    label: "Skills",
    title: "Missing Skills",
    body: "Your degree is strong, but your resume doesn't highlight the skills employers are actually searching for.",
    icon: GraduationCap,
    span: "standard",
    visual: <SkillChipsViz />,
  },
  {
    id: 6,
    label: "Sponsorship",
    title: "Employer Hesitation",
    body: 'Recruiters see your OPT timeline and think: "Too risky. Not enough time." You never get the interview.',
    icon: ShieldAlert,
    span: "standard",
    visual: <SponsorToggleViz />,
  },
  {
    id: 7,
    label: "Positioning",
    title: "Weak Personal Branding",
    body: "Your resume, LinkedIn, and outreach do not tell one clear story. Recruiters should understand your role.",
    icon: UserRoundX,
    span: "standard",
    visual: <BrandMismatchViz />,
  },
  {
    id: 1,
    label: "Timing",
    title: "Time Pressure",
    body: "You need to start applying 3-4 months before graduation, but most students don't know this until it's too late.",
    icon: AlarmClock,
    span: "wide",
    tone: "tint",
    visual: <OptClockViz />,
  },
];

export default function StudentStruggleCards() {
  return (
    <section className={styles["student-struggle-bento"]} id="why-students-fail">
      <div className={styles["struggle-bento-bg"]} aria-hidden="true" />
      <div className={styles["struggle-bento-inner"]}>
        <div className={styles["struggle-bento-heading"]}>
          <div>
            <p className="eyebrow">Why Most Students Fail</p>
            <h2>Why OPT students <em>struggle</em> to find jobs</h2>
          </div>
        </div>

        <div className={styles["struggle-bento-grid"]}>
          {struggleCards.map((card, index) => {
            const Icon = card.icon;
            const cardClass = [
              styles["struggle-bento-card"],
              card.span === "large" ? styles["is-large"] : "",
              card.span === "tall" ? styles["is-tall"] : "",
              card.span === "wide" ? styles["is-wide"] : "",
              card.tone === "dark" ? styles["is-dark"] : "",
              card.tone === "tint" ? styles["is-tint"] : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <motion.article
                className={cardClass}
                key={card.id}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.48, delay: index * 0.06, ease: "easeOut" }}
              >
                <div className={styles["struggle-bento-top"]}>
                  <div className={styles["struggle-bento-icon"]}>
                    <Icon aria-hidden="true" />
                  </div>
                  <span>{card.label}</span>
                </div>
                <div className={styles["struggle-bento-body"]}>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
                {card.visual}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
