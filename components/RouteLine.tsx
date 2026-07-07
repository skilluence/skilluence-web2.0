"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import styles from "@/app/page.module.css";

const WAYPOINTS = [
  { cx: 230, cy: 358 },
  { cx: 560, cy: 258 },
  { cx: 880, cy: 150 },
];

export default function RouteLine() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles["why-route"]} aria-hidden="true">
      <svg viewBox="0 0 1180 480" fill="none" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="routeGrad" x1="0" y1="480" x2="1180" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#17754a" stopOpacity="0.3" />
            <stop offset="1" stopColor="#149d4a" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <circle cx="30" cy="434" r="7" fill="#149d4a" />
        <circle cx="30" cy="434" r="13" fill="none" stroke="#149d4a" strokeOpacity="0.35" strokeWidth="2" />
        <motion.path
          d="M30 434 C140 434 150 388 230 358 C340 316 430 296 560 258 C690 220 770 186 880 150 C965 122 1045 96 1130 74"
          stroke="url(#routeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
        {WAYPOINTS.map((point, i) => (
          <motion.g
            key={point.cx}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: 0.5 + i * 0.45, duration: 0.4 }}
            style={{ transformOrigin: `${point.cx}px ${point.cy}px` }}
          >
            <circle cx={point.cx} cy={point.cy} r="8" fill="var(--paper)" stroke="#149d4a" strokeWidth="2" />
            <circle cx={point.cx} cy={point.cy} r="3" fill="#149d4a" />
          </motion.g>
        ))}
      </svg>
      <span className={styles["why-route-start"]}>Day 1</span>
      <span className={styles["why-route-end"]}>
        <MapPin size={13} aria-hidden="true" />
        Day 90
      </span>
    </div>
  );
}
