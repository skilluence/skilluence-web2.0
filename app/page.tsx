import ContactForm from "@/components/ContactForm";
import ScrollFAQAccordion from "@/components/FAQAccordion/FAQAccordion";
import FeatureShowcase from "@/components/FeatureShowcase/FeatureShowcase";
import HeroSection from "@/components/HeroSection/HeroSection";
import { LogoCloud } from "@/components/ui/logo-cloud-3";
import StudentStruggleCards from "@/components/StudentCards/StudentCards";
import TestimonialsSection from "@/components/TestimonialsSection/TestimonialsSection";
import { Timeline } from "@/components/Timeline/Timeline";
import { serviceDetails } from "@/lib/services";
import { BadgeCheck, Check, FileSearch, Landmark, Minus, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";
import SiteFooter from "@/components/footer/Footer";

const services = [
  {
    title: "Develop & Training",
    text: "Skill-building sessions to enhance technical knowledge, workplace confidence, and career readiness.",
    icon: "growth",
  },
  {
    title: "Job Placement",
    text: "Assistance in finding the right job through employer connections, application support, and placement planning.",
    icon: "briefcase",
  },
  {
    title: "Job Counselling",
    text: "Career guidance based on individual interests, strengths, target roles, and job market opportunities.",
    icon: "compass",
  },
  {
    title: "Test & Interview",
    text: "Practice tests, mock interviews, and feedback loops to improve confidence and selection success.",
    icon: "chat",
  },
];

const steps = [
  {
    number: "STEP 01",
    title: "Resume & Profile Optimization",
    text: "Transform your resume into an ATS-friendly powerhouse and make your LinkedIn profile recruiter-ready.",
    bullets: [
      "ATS-optimized resume tailored to target roles",
      "LinkedIn headline and profile optimization",
      "Skills gap analysis and recommendations",
    ],
  },
  {
    number: "STEP 02",
    title: "Strategic Job Application",
    text: "No more sending 100 applications into the void. We create a targeted plan around sponsor-friendly companies.",
    bullets: [
      "Personalized daily application plan",
      "Curated list of OPT-friendly companies",
      "Recruiter outreach templates and weekly check-ins",
    ],
  },
  {
    number: "STEP 03",
    title: "Interview Preparation",
    text: "Build confidence through live mock interviews, technical practice, and realtime feedback.",
    bullets: [
      "1-on-1 mock interviews with industry professionals",
      "Behavioral and technical interview prep",
      "Salary negotiation and follow-up coaching",
    ],
  },
  {
    number: "STEP 04",
    title: "Job Placement Support",
    text: "We stay involved until you have a strong path to an offer letter.",
    bullets: [
      "Direct introductions to hiring managers",
      "Access to hidden job openings",
      "Offer negotiation and H1B sponsorship guidance",
    ],
  },
];

const differentiators = [
  {
    title: "Built for OPT and STEM OPT",
    text: "Our process is designed for international students who need practical role targeting, sponsorship awareness, and faster recruiter access.",
  },
  {
    title: "OPT-Friendly Recruiter Network",
    text: "We focus on employers and hiring teams that understand international talent and have a verified history of hiring.",
  },
  {
    title: "90-Day Placement Framework",
    text: "A structured path combines profile repair, targeted applications, interview coaching, and placement support.",
  },
];

const comparisonRows = [
  { feature: "1:1 Real-time Project Training", solo: "no", consultancy: "yes", skilluence: "yes" },
  { feature: "GitHub Portfolio", solo: "yes", consultancy: "partial", skilluence: "yes" },
  { feature: "1:1 Expert Mentoring", solo: "no", consultancy: "partial", skilluence: "yes" },
  { feature: "1:1 Interview Prep", solo: "partial", consultancy: "partial", skilluence: "yes" },
  { feature: "Market & Culture Insight", solo: "no", consultancy: "partial", skilluence: "yes" },
  { feature: "1:1 Career Coaching", solo: "no", consultancy: "partial", skilluence: "yes" },
  { feature: "Peer Community", solo: "no", consultancy: "partial", skilluence: "yes" },
  { feature: "Q&A Sessions", solo: "no", consultancy: "partial", skilluence: "yes" },
  { feature: "Resume & LinkedIn", solo: "partial", consultancy: "partial", skilluence: "yes" },
  { feature: "Job Application Help", solo: "no", consultancy: "yes", skilluence: "yes" },
  { feature: "Industry-Infused Resume", solo: "no", consultancy: "partial", skilluence: "yes" },
] as const;

const industries = [
  "Software Developer",
  "Frontend Developer",
  "Web Developer",
  "Data Analyst",
  "Business Intelligence Analyst",
  "Cyber Security Analyst",
  "DevOps Engineer",
  "Solutions Architect",
  "IT Project Manager",
  "Database Administrator",
  "System Administrator",
  "Network Engineer",
  "QA Tester",
];

const faqs = [
  {
    id: 1,
    question: "Is this only for tech students?",
    answer:
      "No. We work with OPT students in business, engineering, healthcare, marketing, finance, and more.",
    icon: "01",
    iconPosition: "left" as const,
  },
  {
    id: 2,
    question: "What if I've already used 6 months of my OPT?",
    answer:
      "We specialize in urgent placements. Our accelerated program can still help.",
    icon: "02",
    iconPosition: "right" as const,
  },
  {
    id: 3,
    question: "Do you guarantee a job?",
    answer:
      "We guarantee 90 days of dedicated placement support. Our 90% success rate speaks for itself.",
    icon: "03",
    iconPosition: "left" as const,
  },
  {
    id: 4,
    question: "How much does it cost?",
    answer: "Book a free consultation to discuss pricing and payment plans.",
    icon: "04",
    iconPosition: "right" as const,
  },
];

function ComparisonIcon({ value }: { value: "yes" | "partial" | "no" }) {
  if (value === "yes") {
    return (
      <span className={`${styles["comparison-icon"]} ${styles["is-yes"]}`} aria-label="Comprehensive solution">
        <Check size={14} />
      </span>
    );
  }

  if (value === "partial") {
    return (
      <span className={`${styles["comparison-icon"]} ${styles["is-partial"]}`} aria-label="Some level of service">
        <Minus size={14} />
      </span>
    );
  }

  return (
    <span className={`${styles["comparison-icon"]} ${styles["is-no"]}`} aria-label="Disadvantage in most areas">
      <X size={14} />
    </span>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <LogoCloud />
      <FeatureShowcase />

      <section className={styles["direct-path"]}>
        <div>
          <p className="eyebrow">Why You Are Not Getting Placed</p>
          <h2>You may be qualified, but your job search is working <em>against you.</em></h2>
          <p>
            Most international students do not fail because they lack talent.
            They fail because their resume, applications, interview strategy,
            and sponsorship positioning are not built for how U.S. hiring
            actually works.
          </p>
          <div className={styles["direct-path-actions"]}>
            <Link className={styles["direct-path-cta"]} href="/contact">Book Free Consultation</Link>
            <Link className={styles["direct-path-ghost"]} href="/#process">See how it works</Link>
          </div>
        </div>
        <div className={styles["placement-panel"]}>
          <p className={styles["placement-panel-title"]}>The five patterns we see in every stalled search</p>
          <ul className={styles["placement-mistakes"]} aria-label="Common placement mistakes">
            <li><span aria-hidden="true">01</span>Applying randomly instead of targeting sponsor-friendly employers.<X aria-hidden="true" size={15} /></li>
            <li><span aria-hidden="true">02</span>Using an academic resume that does not pass recruiter or ATS filters.<X aria-hidden="true" size={15} /></li>
            <li><span aria-hidden="true">03</span>Hiding OPT, STEM OPT, or H1B details instead of positioning them clearly.<X aria-hidden="true" size={15} /></li>
            <li><span aria-hidden="true">04</span>Waiting too long to start outreach, follow-ups, and interview preparation.<X aria-hidden="true" size={15} /></li>
            <li><span aria-hidden="true">05</span>Sending applications without a role-specific LinkedIn and skills strategy.<X aria-hidden="true" size={15} /></li>
          </ul>
          <p className={styles["placement-panel-note"]}>
            <Check aria-hidden="true" size={15} />
            Every one of these is fixable — it&apos;s exactly what the 90-day framework corrects.
          </p>
        </div>
      </section>

      <StudentStruggleCards />

      <section className={`section ${styles["why-section"]}`} id="why">
        <div className="section-heading">
          <p className="eyebrow">Why choose us?</p>
          <h2>Embark on <em>career success</em> with Skilluence.</h2>
        </div>
        <div className={styles["why-grid"]}>
          {differentiators.map((item) => (
            <article className={styles["why-card"]} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles["comparison-section"]}>
        <div className={styles["comparison-heading"]}>
          <p className="eyebrow">Program Comparison</p>
          <h2>Program features, <em>compared.</em></h2>
          <p>
            See how Skilluence compares with solo job search and traditional
            consultancy models across the support international students need most.
          </p>
        </div>

        <div className={styles["comparison-card"]}>
          <div className={styles["comparison-table-wrap"]}>
            <table className={styles["comparison-table"]}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Solo Effort</th>
                  <th>Consultancies</th>
                  <th>Skilluence</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td><ComparisonIcon value={row.solo} /></td>
                    <td><ComparisonIcon value={row.consultancy} /></td>
                    <td><ComparisonIcon value={row.skilluence} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles["comparison-legend"]}>
            <span><ComparisonIcon value="partial" /> Some level of service</span>
            <span><ComparisonIcon value="yes" /> Comprehensive solution</span>
            <span><ComparisonIcon value="no" /> Disadvantage in most areas</span>
          </div>
        </div>
      </section>

      <section className={`section ${styles["industry-section"]}`}>
        <div className="section-heading">
          <p className="eyebrow">Service Areas</p>
          <h2>Our specialized <em>industries.</em></h2>
          <p>
            Our expertise spans key technology roles essential to today's
            digital workforce. We empower talent with the right skills and
            connect them to meaningful career opportunities.
          </p>
        </div>
        <div className={styles["industry-cloud"]}>
          {industries.map((role) => (
            <Link href="/contact" key={role}>{role}</Link>
          ))}
        </div>
      </section>

      <section className={`section ${styles["programs"]}`} id="programs">
        <div className="section-heading">
          <p className="eyebrow">Our Services</p>
          <h2>Comprehensive career solutions for <em>every stage.</em></h2>
        </div>
        <div className={styles["program-grid"]}>
          {serviceDetails.map((solution, index) => (
            <article className={styles["program-card"]} key={solution.title}>
              <span>0{index + 1}</span>
              <h3>{solution.title}</h3>
              <p>{solution.text}</p>
              <Link href={`/our-services/${solution.slug}`} prefetch>Discuss this service</Link>
            </article>
          ))}
        </div>
      </section>

      <section className={`section ${styles["process"]}`} id="process">
        <div className="section-heading">
          <p className="eyebrow">Why People Choose Us</p>
          <h2>How it <em>works.</em></h2>
        </div>
        <Timeline items={steps} />
      </section>

      <TestimonialsSection />

      <section className={`section ${styles["faq-section"]}`}>
        <ScrollFAQAccordion data={faqs} />
      </section>

      <section className={`section ${styles["trust-section"]}`} aria-label="Compliance and sponsorship safeguards">
        <div className={styles["trust-grid"]}>
          <article className={styles["trust-card"]}>
            <ShieldCheck aria-hidden="true" />
            <h3>OPT & STEM OPT aligned</h3>
            <p>Work-authorization timelines and reporting rules are tracked for every candidate.</p>
          </article>
          <article className={styles["trust-card"]}>
            <BadgeCheck aria-hidden="true" />
            <h3>E-Verify employers</h3>
            <p>Placement targeting prioritizes companies enrolled in E-Verify.</p>
          </article>
          <article className={styles["trust-card"]}>
            <FileSearch aria-hidden="true" />
            <h3>Sponsor verification</h3>
            <p>Target employers are screened for a verified history of visa sponsorship.</p>
          </article>
          <article className={styles["trust-card"]}>
            <Landmark aria-hidden="true" />
            <h3>H-1B guidance</h3>
            <p>Offer-stage support covers sponsorship conversations and filing timelines.</p>
          </article>
        </div>
      </section>

      <section className={styles["consultation-section"]} id="contact">
        <div className={styles["consultation-layout"]}>
          <div className={styles["consultation-copy"]}>
            <p className="eyebrow">Schedule a Consultation</p>
            <h2>Ready to land the job of <em>your dreams?</em></h2>
            <p>
              Share where you are now, what role you want next, and whether you
              need training, placement, documentation, or interview preparation.
            </p>
            <ul>
              <li>Get clarity on your current profile and target roles.</li>
              <li>Understand what support fits your OPT or career timeline.</li>
              <li>Walk away with practical next steps for your job search.</li>
            </ul>
          </div>

          <div className={styles["consultation-panel"]}>
            <ContactForm />
            <p className={styles["consultation-reassurance"]}>
              Free consultation · No payment until you choose a plan
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
