"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import styles from "./FeatureShowcase.module.css";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

/* ── Widget 1: ATS resume score ── */
function ResumeScoreWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const scoreRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(reduceMotion ? 92 : 41);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      if (scoreRef.current) scoreRef.current.textContent = "92";
      setProgress(92);
      return;
    }
    const controls = animate(41, 92, {
      duration: 1.8,
      delay: 0.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (scoreRef.current) scoreRef.current.textContent = `${Math.round(v)}`;
        setProgress(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion]);

  const checks = ["Keywords matched to role", "Recruiter-readable layout", "Sponsorship positioned clearly"];

  return (
    <div className={styles["widget"]} ref={ref}>
      <div className={styles["score-row"]}>
        <span className={styles["score-value"]}>
          <span ref={scoreRef}>{reduceMotion ? 92 : 41}</span>
          <small>/100</small>
        </span>
        <span className={styles["score-label"]}>ATS score</span>
      </div>
      <div className={styles["score-bar"]} role="img" aria-label="ATS score rising from 41 to 92">
        <span style={{ width: `${progress}%` }} />
      </div>
      <ul className={styles["score-checks"]}>
        {checks.map((item, i) => (
          <motion.li
            key={item}
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7 + i * 0.35, duration: 0.45 }}
          >
            <Check size={13} aria-hidden="true" />
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ── Widget 2: live application timeline ── */
function ApplicationTimelineWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  const events = [
    { time: "9:02 AM", label: "Sponsor-friendly role identified" },
    { time: "9:24 AM", label: "Resume tailored to the posting" },
    { time: "9:31 AM", label: "Application submitted" },
    { time: "2:47 PM", label: "Recruiter follow-up sent", live: true },
  ];

  return (
    <div className={styles["widget"]} ref={ref}>
      <ol className={styles["timeline"]}>
        {events.map((event, i) => (
          <motion.li
            key={event.time}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.4, duration: 0.5 }}
            className={event.live ? styles["is-live"] : undefined}
          >
            <span className={styles["timeline-dot"]} aria-hidden="true" />
            <span className={styles["timeline-time"]}>{event.time}</span>
            <span className={styles["timeline-label"]}>{event.label}</span>
          </motion.li>
        ))}
      </ol>
      <p className={styles["widget-note"]}>Example day from an active placement plan</p>
    </div>
  );
}

/* ── Widget 3: support level selector ── */
const supportModes = [
  {
    id: "self",
    label: "Self-guided",
    text: "Optimized resume and a target-company list. You run the search, we set you up to win.",
  },
  {
    id: "coached",
    label: "Coached",
    text: "Weekly check-ins, mock interviews, and application strategy alongside your own outreach.",
  },
  {
    id: "full",
    label: "Full placement",
    text: "We run the search end to end — targeting, applications, recruiter introductions, and offer support.",
  },
];

function SupportModeWidget() {
  const [mode, setMode] = useState(supportModes[2]);

  return (
    <div className={styles["widget"]}>
      <div className={styles["mode-switch"]} role="tablist" aria-label="Support level">
        {supportModes.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={mode.id === option.id}
            className={mode.id === option.id ? styles["is-active"] : undefined}
            onClick={() => setMode(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className={styles["mode-text"]}>{mode.text}</p>
    </div>
  );
}

/* ── Widget 4: 90-day path ── */
function PlacementPathWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  const milestones = [
    { day: "Day 1", label: "Profile rebuilt" },
    { day: "Day 14", label: "Targeted applications live" },
    { day: "Day 45", label: "Interview loops" },
    { day: "Day 90", label: "Offer & sponsorship guidance" },
  ];

  return (
    <div className={styles["widget"]} ref={ref}>
      <div className={styles["path-track"]}>
        <motion.span
          className={styles["path-fill"]}
          initial={reduceMotion ? { width: "100%" } : { width: "0%" }}
          animate={inView ? { width: "100%" } : {}}
          transition={{ duration: 2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        />
        {milestones.map((m, i) => (
          <span
            key={m.day}
            className={styles["path-node"]}
            style={{ left: `${(i / (milestones.length - 1)) * 100}%` }}
            aria-hidden="true"
          />
        ))}
      </div>
      <ul className={styles["path-labels"]}>
        {milestones.map((m) => (
          <li key={m.day}>
            <strong>{m.day}</strong>
            <span>{m.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Section ── */
const features = [
  {
    title: "Resume that clears the filters",
    text: "Every profile is rebuilt against real ATS criteria before a single application goes out.",
    widget: <ResumeScoreWidget />,
  },
  {
    title: "Applications, run like operations",
    text: "Targeted roles, tailored submissions, and recruiter follow-ups on a daily cadence.",
    widget: <ApplicationTimelineWidget />,
  },
  {
    title: "Support that matches your situation",
    text: "Choose how much of the search you hand over — the framework stays the same.",
    widget: <SupportModeWidget />,
  },
  {
    title: "A 90-day path with checkpoints",
    text: "Structured milestones from profile repair to offer negotiation, reviewed every week.",
    widget: <PlacementPathWidget />,
  },
];

export default function FeatureShowcase() {
  return (
    <section className={styles["showcase"]} aria-labelledby="feature-showcase-heading">
      <div className={styles["showcase-inner"]}>
        <div className={styles["showcase-heading"]}>
          <h2 id="feature-showcase-heading">
            The system behind <em>every placement.</em>
          </h2>
          <p>
            Not advice — working infrastructure. This is what runs underneath
            your job search from day one.
          </p>
        </div>

        <div className={styles["showcase-grid"]}>
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              className={styles["feature-card"]}
              {...reveal}
              transition={{ duration: 0.7, delay: (i % 2) * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              {feature.widget}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
