"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./page.module.css";

const MotionLink = motion(Link);

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduceMotion) {
      ref.current.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest)}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, reduceMotion]);

  return <span ref={ref}>{reduceMotion ? `${value}${suffix}` : `0${suffix}`}</span>;
}

const ease = [0.16, 1, 0.3, 1] as const;

const rise = (delay: number, reduceMotion: boolean) =>
  reduceMotion
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

  const bgY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 80]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.6], [0.7, 0]);

  return (
    <section className={styles["career-hero"]} ref={heroRef}>
      <motion.div
        className={styles["career-hero-bg-layers"]}
        style={{ y: bgY }}
        aria-hidden="true"
      >
        <div className={styles["career-hero-glow-1"]} />
        <div className={styles["career-hero-glow-2"]} />
      </motion.div>
      <motion.div
        className={styles["career-hero-grid"]}
        style={{ opacity: gridOpacity }}
        aria-hidden="true"
      />

      <div className={styles["career-hero-inner"]}>
        <motion.div {...rise(0.1, reduceMotion)}>
          <div className={styles["career-kicker"]}>
            <span>Join Our Team</span>
            <span>Skilluence Careers</span>
          </div>
        </motion.div>

        <div className={styles["career-hero-layout"]}>
          <motion.div className={styles["career-hero-main"]} {...rise(0.22, reduceMotion)}>
            <p className="eyebrow">Career Detail</p>
            <h1>Help students build careers that <em>change their lives.</em></h1>
            <p>
              We are a growing team of career advisors, recruiters, and coaches on
              a mission to place international talent into meaningful U.S. careers.
              If that mission resonates with you, we want to hear from you.
            </p>
            <div className={styles["career-hero-actions"]}>
              <MotionLink href="#openings" whileTap={{ scale: 0.96 }}>
                See Open Roles
                <ArrowUpRight size={16} aria-hidden="true" />
              </MotionLink>
              <MotionLink href="/contact" whileTap={{ scale: 0.96 }}>
                Book a Consultation
              </MotionLink>
            </div>
          </motion.div>

          <motion.aside className={styles["career-hero-snapshot"]} {...rise(0.38, reduceMotion)}>
            <div className={styles["snapshot-dot"]} />
            <span>We are</span>
            <strong>US-Based</strong>
            <p>
              Located at 5900 Balcones Drive STE 100 Austin TX 78731. A focused team helping international talent build meaningful careers
              in the United States through coaching, placement, and strategy.
            </p>
          </motion.aside>
        </div>

        <motion.dl className={styles["career-hero-stats"]} {...rise(0.56, reduceMotion)}>
          <div>
            <dt>Team Members</dt>
            <dd><CountUp value={40} suffix="+" /></dd>
          </div>
          <div>
            <dt>Students Placed</dt>
            <dd><CountUp value={500} suffix="+" /></dd>
          </div>
          <div>
            <dt>Open Roles</dt>
            <dd><CountUp value={13} /></dd>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}