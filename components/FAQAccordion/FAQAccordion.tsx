"use client";

import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./FAQAccordion.module.css";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon?: string;
  iconPosition?: "left" | "right";
}

interface ScrollFAQAccordionProps {
  data: FAQItem[];
  className?: string;
  questionClassName?: string;
  answerClassName?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export default function ScrollFAQAccordion({
  data,
  className,
  questionClassName,
  answerClassName,
  eyebrow = "Questions",
  title = "Common things students ask before starting.",
  description = "Discover quick and clear answers about our placement, support, and career guidance programs.",
}: ScrollFAQAccordionProps) {
  const defaultValue = data[0]?.id.toString();

  return (
    <div className={cn(styles["scroll-faq"], className)}>
      <div className={styles["scroll-faq-heading"]}>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className={styles["scroll-faq-card"]}>
        <Accordion.Root
          type="single"
          collapsible
          defaultValue={defaultValue}
          className={styles["scroll-faq-list"]}
        >
          {data.map((item) => (
            <Accordion.Item
              value={item.id.toString()}
              key={item.id}
              className={styles["scroll-faq-item"]}
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className={cn(styles["scroll-faq-trigger"], questionClassName)}
                >
                  <span>{item.question}</span>
                  <ChevronDown aria-hidden="true" />
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content
                className={cn(styles["scroll-faq-content"], answerClassName)}
              >
                <p>{item.answer}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        <p className={styles["scroll-faq-support"]}>
          Can't find what you're looking for?{" "}
          <Link href="/contact">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
}
