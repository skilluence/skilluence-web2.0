import { notFound } from "next/navigation";
import Link from "next/link";
import ScrollFAQAccordion from "@/components/FAQAccordion/FAQAccordion";
import { getServiceBySlug, serviceDetails } from "@/lib/services";
import styles from "./page.module.css";
import SiteFooter from "@/components/footer/Footer";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return serviceDetails.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Skilluence",
    };
  }

  return {
    title: `${service.title} | Skilluence`,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <section className={styles["service-detail-hero"]}>
        <div>
          <div className={styles["service-detail-kicker"]}>
            <span>Our Services</span>
            <span>Skilluence Career Support</span>
          </div>
          <div className={styles["service-detail-hero-layout"]}>
            <div className={styles["service-detail-hero-main"]}>
            <p className="eyebrow">Service Detail</p>
            <h1>{service.title}</h1>
            <p>{service.summary}</p>
            <div className={styles["service-detail-actions"]}>
              <Link href="/contact">Schedule a Consultation</Link>
              <Link href="/#programs">View All Services</Link>
            </div>
            </div>

            <aside className={styles["service-detail-snapshot"]} aria-label="Service snapshot">
              <span>Built for</span>
              <strong>International talent</strong>
              <p>
                Focused support across positioning, preparation, documentation,
                and recruiter-ready presentation.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles["service-detail-body"]}>
        <div className={styles["service-detail-content"]}>
          <p className="eyebrow">Service Overview</p>
          <h2>{service.title}</h2>
          {(service.description ?? [
            "This page is ready for the full service-specific content. Add the detailed positioning, process, outcomes, eligibility notes, and FAQs for this service here.",
          ]).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <div className={styles["service-process"]}>
            <p className="eyebrow">How It Works</p>
            <h2>Step-by-step support</h2>
            <div className={styles["service-process-grid"]}>
              {(service.steps ?? [
                {
                  title: "Details coming next",
                  text: "Add the step-by-step process for this service here.",
                },
              ]).map((step, index) => (
                <article key={step.title} className={styles["service-process-card"]}>
                  <span>STEP {String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

      </section>

      {service.faqs && (
        <section className={`section ${styles["service-detail-faq"]}`}>
          <ScrollFAQAccordion
            data={service.faqs.map((faq, index) => ({
              id: index + 1,
              question: faq.question,
              answer: faq.answer,
              icon: String(index + 1).padStart(2, "0"),
              iconPosition: index % 2 === 0 ? "left" : "right",
            }))}
            eyebrow="FAQs"
            title="Your Questions Answered"
            description="Review the common questions for this service or open any item manually."
          />
        </section>
      )}
      <SiteFooter />
    </main>
  );
}
