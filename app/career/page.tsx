export const dynamic = 'force-dynamic';
import Link from "next/link";
import { TrendingUp, ShieldCheck, MonitorSmartphone, Banknote, PartyPopper, Clock, ArrowUpRight, MapPin, Briefcase, Users } from "lucide-react";
import SiteFooter from "@/components/footer/Footer";
import CareerOpenings from "@/components/CareerOpenings";
import db from "@/lib/db";
import { CareerHero } from "./CareerHero";
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
      <CareerHero />

      <section className={`section ${styles["values-section"]}`}>
        <div className={styles["values-heading"]}>
          <p className="eyebrow">Benefits and Perks</p>
          <h2>Life at <em>Skilluence.</em></h2>
          <p>Everything you need to do your best work and live your best life.</p>
        </div>
        <div className={styles["values-grid"]}>
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} className={styles["value-card"]}>
                <div className={styles["value-icon-wrap"]}>
                  <Icon size={20} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={`section ${styles["openings-section"]}`} id="openings">
        <div className={styles["openings-heading"]}>
          <p className="eyebrow">Open Positions</p>
          <h2>Current roles we are <em>hiring for.</em></h2>
          <p>
            Each role is a direct contribution to our placement mission.
            We hire for attitude, accountability, and alignment with our values.
          </p>
        </div>
        <CareerOpenings jobs={jobs} />

        {jobs.length > 0 && (
          <div className={styles["openings-cta"]}>
            <p>Don&apos;t see the right fit?</p>
            <Link href="/contact">
              Send us your resume
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}