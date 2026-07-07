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
import { Search, Users } from "lucide-react";
import Link from "next/link";
import styles from "./HeroSection.module.css";

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

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // 0 at page top → 1 once the hero has fully scrolled past
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // distant layers lag behind the scroll the most, foreground stays near-pinned
  const skyY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 150]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 84]);
  const frontY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 28]);

  const rise = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className={styles["hero"]} id="top" ref={heroRef}>
      <div className={styles["hero-bg"]} aria-hidden="true">
        <motion.div
          className={styles["hero-layer"]}
          style={{ y: skyY, backgroundImage: "url(/hero-sky.svg)" }}
        />
        <motion.div
          className={styles["hero-layer"]}
          style={{ y: midY, backgroundImage: "url(/hero-mid.svg)" }}
        />
        <motion.div
          className={styles["hero-layer"]}
          style={{ y: frontY, backgroundImage: "url(/hero-front.svg)" }}
        />
      </div>
      <div className={styles["hero-scrim"]} aria-hidden="true" />

      <div className={styles["hero-inner"]}>
        <motion.p className={styles["hero-eyebrow"]} {...rise(0.1)}>
          <span aria-hidden="true" />
          US Tech Career Placement
        </motion.p>

        <motion.h1 className={styles["hero-title"]} {...rise(0.22)}>
          Great work starts
          <br />
          with the <em>right match.</em>
        </motion.h1>

        <motion.p className={styles["hero-sub"]} {...rise(0.36)}>
          Whether you&apos;re chasing your next role or your next great hire,
          we connect skilled candidates with the companies that need them.
        </motion.p>

        <motion.div className={styles["hero-actions"]} {...rise(0.5)}>
          <MotionLink
            href="/career"
            whileTap={{ scale: 0.96 }}
            className={styles["hero-primary"]}
          >
            <Search aria-hidden="true" size={18} />
            Find a job
          </MotionLink>
          <MotionLink
            href="/contact"
            whileTap={{ scale: 0.96 }}
            className={styles["hero-secondary"]}
          >
            <Users aria-hidden="true" size={18} />
            Hire talent
          </MotionLink>
        </motion.div>
      </div>

      <motion.dl className={styles["hero-stats"]} {...rise(0.68)}>
        <div>
          <dt>placement success rate</dt>
          <dd><CountUp value={90} suffix="%" /></dd>
        </div>
        <div>
          <dt>of dedicated placement support</dt>
          <dd><CountUp value={90} suffix=" days" /></dd>
        </div>
        <div>
          <dt>specialized tech roles covered</dt>
          <dd><CountUp value={13} suffix="+" /></dd>
        </div>
      </motion.dl>
    </section>
  );
}
