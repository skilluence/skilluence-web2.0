"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Users, Sparkles } from "lucide-react";
import styles from "./page.module.css";

const MotionLink = motion(Link);

const ease = [0.16, 1, 0.3, 1] as const;

const rise = (delay: number, reduce: boolean) =>
  reduce
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 26 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, delay, ease },
      };

export function CareerHero() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60]);

  return (
    <section className={styles["career-hero"]} ref={heroRef}>
      <motion.div className={styles["career-hero-bg"]} style={{ y: bgY }} aria-hidden="true">
        <div className={styles["hero-glow-g"]} />
        <div className={styles["hero-glow-b"]} />
        <div className={styles["hero-grid"]} />
      </motion.div>

      <div className={styles["hero-inner"]}>
        <motion.div className={styles["hero-content"]} {...rise(0.1, reduceMotion)}>
          <div className={styles["hero-badge"]}>
            <Sparkles size={12} aria-hidden="true" />
            Join Our Team
          </div>
          <h1>
            Help students build careers that <em>change their lives.</em>
          </h1>
          <p>
            We are a growing team of career advisors, recruiters, and coaches on
            a mission to place international talent into meaningful U.S. careers.
            If that mission resonates with you, we want to hear from you.
          </p>
          <div className={styles["hero-actions"]}>
            <MotionLink href="#openings" whileTap={{ scale: 0.96 }}>
              See Open Roles
              <ArrowUpRight size={16} aria-hidden="true" />
            </MotionLink>
            <MotionLink href="/contact" whileTap={{ scale: 0.96 }}>
              <Users size={16} aria-hidden="true" />
              Book a Consultation
            </MotionLink>
          </div>
        </motion.div>

        <motion.div className={styles["hero-visual"]} {...rise(0.3, reduceMotion)}>
          <div className={styles["hero-card-stack"]}>
            <div className={styles["hero-card"]}>
              <div className={styles["hcard-dot"]} />
              <div className={styles["hcard-lines"]}>
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className={styles["hero-card"]}>
              <div className={styles["hcard-tag"]}>US-Based Team</div>
              <p className={styles["hcard-loc"]}>5900 Balcones Dr, Austin TX</p>
              <div className={styles["hcard-pills"]}>
                <span>40+ Members</span>
                <span>500+ Placed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className={styles["hero-scrim"]} aria-hidden="true" />
    </section>
  );
}