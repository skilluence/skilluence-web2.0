"use client";

import * as React from "react";
import { motion } from "framer-motion";
import styles from "./TestimonialsSection.module.css";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Skilluence completely changed my job search strategy. Instead of randomly applying, everything became structured. I started getting interviews within the first week, and landed a Data Analyst role much faster than expected.",
    name: "Ankit Sharma",
    role: "Data Analyst",
  },
  {
    quote:
      "I had strong technical skills but no interview traction. Skilluence fixed my resume, guided me through interviews, and helped me stay compliant with OPT. The process felt clear and stress-free.",
    name: "Rohit Verma",
    role: "Software Engineer",
  },
  {
    quote:
      "What stood out was their private portal and targeted approach. I wasn't just applying everywhere. I was getting relevant interviews, and that made a huge difference.",
    name: "Neha Patel",
    role: "Business Analyst",
  },
  {
    quote:
      "I was worried about sponsorship and long-term stability. Skilluence connected me with H1B-eligible opportunities and kept me informed at every step. Very transparent process.",
    name: "Sandeep Reddy",
    role: "Cloud Engineer",
  },
  {
    quote:
      "The interview prep and resume optimization were spot on. I finally understood what recruiters were actually looking for. I converted an interview into an offer within weeks.",
    name: "Pooja Mehta",
    role: "Data Scientist",
  },
  {
    quote:
      "I had experience but was struggling to explain it in interviews. Their mock sessions and guidance helped me build confidence. The results followed naturally.",
    name: "Karthik Iyer",
    role: "QA Automation",
  },
  {
    quote:
      "Skilluence helped me transition into cybersecurity with a clear roadmap. The structured applications and interview support saved me months of effort.",
    name: "Aishwarya Kulkarni",
    role: "Cybersecurity Analyst",
  },
  {
    quote:
      "I liked that they focused on quality over quantity. Every interview I got was relevant to my profile. That alone made the investment worth it.",
    name: "Abhishek Singh",
    role: "Machine Learning Engineer",
  },
  {
    quote:
      "I was from a non-tech background and wasn't sure how to position myself. Skilluence helped reframe my experience and target the right roles. I finally got traction.",
    name: "Rakesh Jain",
    role: "Supply Chain Analyst",
  },
  {
    quote:
      "The biggest relief was knowing someone had my back during OPT. From applications to interviews, everything was handled professionally.",
    name: "Shruti Deshpande",
    role: "Financial Analyst",
  },
  {
    quote:
      "I tried applying on my own for months with no luck. Once I joined Skilluence, interviews started coming consistently. That momentum changed everything.",
    name: "Nikhil Agarwal",
    role: "Full Stack Developer",
  },
  {
    quote:
      "They understand the US hiring market very well. The resume tweaks and application strategy were exactly what recruiters wanted to see.",
    name: "Harsha Rao",
    role: "DevOps Engineer",
  },
  {
    quote:
      "I appreciated how personalized the process was. They didn't push random roles, only positions that matched my profile and goals.",
    name: "Priya Nair",
    role: "UX Designer",
  },
  {
    quote:
      "The communication and follow-ups were excellent. I always knew what stage I was in and what was coming next. Very professional team.",
    name: "Vinay Kumar",
    role: "Systems Analyst",
  },
];

const featured = testimonials[0];

const columns = [
  testimonials.slice(1, 5),
  testimonials.slice(5, 10),
  testimonials.slice(10, 14),
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialsColumn({
  items,
  duration,
  hidden,
}: {
  items: Testimonial[];
  duration: number;
  hidden?: "mobile" | "tablet";
}) {
  const colClass = [
    styles["testimonial-column"],
    hidden === "mobile" ? styles["is-hidden-mobile"] : "",
    hidden === "tablet" ? styles["is-hidden-tablet"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={colClass}>
      <ul
        className={styles["testimonial-track"]}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[0, 1].map((set) => (
          <React.Fragment key={set}>
            {items.map((item) => (
              <motion.li
                key={`${set}-${item.name}`}
                aria-hidden={set === 1}
                tabIndex={set === 1 ? -1 : 0}
                whileHover={{ y: -6, scale: 1.02 }}
                whileFocus={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 360, damping: 24 }}
                className={styles["testimonial-story-card"]}
              >
                <blockquote>
                  <p>{item.quote}</p>
                  <footer>
                    <span className={styles["testimonial-avatar"]} aria-hidden="true">
                      {initials(item.name)}
                    </span>
                    <span>
                      <cite>{item.name}</cite>
                      <small>{item.role}</small>
                    </span>
                  </footer>
                </blockquote>
              </motion.li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className={styles["success-stories-section"]} aria-labelledby="success-stories-heading">
      <motion.div
        className={styles["success-stories-inner"]}
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles["success-stories-heading"]}>
          <p className="eyebrow">Real Success Stories</p>
          <h2 id="success-stories-heading">
            Proof that our system <em>works.</em>
          </h2>
          <p>
            Practical career support, clearer positioning, and focused placement
            strategy for students who need momentum.
          </p>
        </div>

        <figure className={styles["featured-quote"]}>
          <blockquote>
            <p>“{featured.quote}”</p>
          </blockquote>
          <figcaption>
            <span className={styles["testimonial-avatar"]} aria-hidden="true">
              {initials(featured.name)}
            </span>
            <span>
              <cite>{featured.name}</cite>
              <small>{featured.role}</small>
            </span>
          </figcaption>
        </figure>

        <div className={styles["testimonial-marquee"]} aria-label="Scrolling success stories">
          <TestimonialsColumn items={columns[0]} duration={18} />
          <TestimonialsColumn items={columns[1]} duration={23} hidden="tablet" />
          <TestimonialsColumn items={columns[2]} duration={20} hidden="mobile" />
        </div>
      </motion.div>
    </section>
  );
}
