export const dynamic = 'force-dynamic';
import Link from "next/link";
import { TrendingUp, ShieldCheck, MonitorSmartphone, Banknote, PartyPopper, Clock } from "lucide-react";
import SiteFooter from "@/components/footer/Footer";
import CareerOpenings from "@/components/CareerOpenings";
import db from "@/lib/db";
import styles from "./page.module.css";

interface JobListing {
  id: number;
  title: string;
  department: string;
  shift: string;
  description: string;
  location: string;
  schedule: string;
  experience: string;
  icon: string;
  active: number | boolean;
}

export const metadata = {
  title: "Careers at Skilluence | Join Our Team",
  description:
    "Join the Skilluence team and help international students build careers in the U.S. Explore open roles and find your place with us.",
};

const values = [
  {
    icon: TrendingUp,
    title: "Growth Budget",
    text: "Annual stipend for books, online courses, and professional certifications. Because we practise what we preach.",
  },
  {
    icon: ShieldCheck,
    title: "Health & Wellness",
    text: "Comprehensive health insurance and mental health support for you and your family.",
  },
  {
    icon: MonitorSmartphone,
    title: "Remote-First",
    text: "We set you up for success wherever you work with a dedicated equipment and setup allowance.",
  },
  {
    icon: Banknote,
    title: "Competitive Pay",
    text: "Compensation benchmarked to the top of our industry — because great people deserve great salaries.",
  },
  {
    icon: PartyPopper,
    title: "Team Offsites",
    text: "Quarterly retreats to bond, brainstorm, and recharge as a team.",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    text: "We measure outcomes, not hours. Manage your schedule around your life, not the other way around.",
  },
];


export default async function CareerPage() {
  const jobs = (await db
    .prepare("SELECT id, title, department, shift, description, location, schedule, experience, icon, active FROM job_listings WHERE active ORDER BY created_at DESC")
    .all()) as JobListing[];

  return (
    <main>

      {/* Hero */}
      <section className={styles["career-hero"]}>
        <div className={styles["career-hero-inner"]}>
          <div className={styles["career-kicker"]}>
            <span>Join Our Team</span>
            <span>Skilluence Careers</span>
          </div>
          <div className={styles["career-hero-layout"]}>
            <div className={styles["career-hero-main"]}>
              <p className="eyebrow">Career Detail</p>
              <h1>Help students build careers that change their lives.</h1>
              <p>
                We are a growing team of career advisors, recruiters, and coaches on
                a mission to place international talent into meaningful U.S. careers.
                If that mission resonates with you, we want to hear from you.
              </p>
              <div className={styles["career-hero-actions"]}>
                <Link href="#openings">See Open Roles</Link>
                <Link href="/contact">Book a Consultation</Link>
              </div>
            </div>
            <aside className={styles["career-hero-snapshot"]}>
              <span>We are</span>
              <strong>US-Based</strong>
              <p>
                Located at 5900 Balcones Drive STE 100 Austin TX 78731. A focused team helping international talent build meaningful careers
                in the United States through coaching, placement, and strategy.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={`section ${styles["values-section"]}`}>
        <div className={styles["values-heading"]}>
          <p className="eyebrow">Benefits and Perks</p>
          <h2>Life at Skilluence.</h2>
          <p>Everything you need to do your best work and live your best life.</p>
        </div>
        <div className={styles["values-grid"]}>
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} className={styles["value-card"]}>
                <div className={styles["value-icon"]}>
                  <Icon size={22} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Open roles */}
      <section className={`section ${styles["openings-section"]}`} id="openings">
        <div className="section-heading">
          <p className="eyebrow">Open Positions</p>
          <h2>Current roles we are hiring for.</h2>
          <p>
            Each role is a direct contribution to our placement mission.
            We hire for attitude, accountability, and alignment with our values.
          </p>
        </div>
        <CareerOpenings jobs={jobs} />
      </section>

      <SiteFooter />
    </main>
  );
}
