import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import SiteFooter from "@/components/footer/Footer";
import ContactForm from "@/components/ContactForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Contact Skilluence | Career Placement Support",
  description:
    "Contact Skilluence for career placement, OPT support, resume optimization, interview coaching, and consultation requests.",
};

const contactDetails = [
  {
    icon: Phone,
    label: "Inquiry",
    value: "+1 (346) 363 8799",
    href: "tel:+13463638799",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@skilluence.com",
    href: "mailto:contact@skilluence.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "5900 Balcones Drive STE 100 Austin TX 78731",
    href: "https://www.google.com/maps/search/?api=1&query=5900%20Balcones%20Drive%20STE%20100%20Austin%20TX%2078731",
  },
];

export default function ContactPage() {
  return (
    <main>
      <section className={styles["contact-hero"]}>
        <div className={styles["contact-hero-inner"]}>
          <div className={styles["contact-kicker"]}>
            <span>Contact Us</span>
            <span>Skilluence Support</span>
          </div>
          <div className={styles["contact-hero-layout"]}>
            <div className={styles["contact-hero-main"]}>
              <p className="eyebrow">Start the conversation</p>
              <h1>Tell us where you are in your career journey.</h1>
              <p>
                Reach out for placement support, resume strategy, interview
                coaching, OPT guidance, or service questions. Our team will
                help you choose the right next step.
              </p>
              <div className={styles["contact-hero-actions"]}>
                <Link href="tel:+13463638799">Call Skilluence</Link>
                <Link href="mailto:contact@skilluence.com">Email Us</Link>
              </div>
            </div>
            <aside className={styles["contact-hero-snapshot"]}>
              <span>Response Focus</span>
              <strong>Career clarity</strong>
              <p>
                Share your current status, target role, and timeline. We will
                help route your request to the right advisor.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles["contact-body"]}>
        <div className={styles["contact-intro"]}>
          <p className="eyebrow">Contact Details</p>
          <h2>Connect with the Skilluence team.</h2>
          <p>
            Use the form or reach us directly. Include your visa status, target
            role, and preferred callback time so we can respond with useful
            guidance.
          </p>
        </div>

        <div className={styles["contact-grid"]}>
          <div className={styles["details-card"]}>
            {contactDetails.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles["detail-item"]}
                  target={item.label === "Location" ? "_blank" : undefined}
                  rel={item.label === "Location" ? "noopener noreferrer" : undefined}
                >
                  <span className={styles["detail-icon"]}>
                    <Icon size={20} />
                  </span>
                  <span>
                    <small>{item.label}</small>
                    <strong>{item.value}</strong>
                  </span>
                </Link>
              );
            })}
          </div>

          <ContactForm />
        </div>
      </section>

      <section className={styles["map-section"]} aria-label="Skilluence office location map">
        <div className={styles["map-copy"]}>
          <p className="eyebrow">Visit Us</p>
          <h2>Austin, Texas office location.</h2>
        </div>
        <div className={styles["map-frame"]}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.327174800033!2d-97.7548379!3d30.341650299999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644cae2f96fffff%3A0x893fa7795b7d5f91!2sGenesis%20Business%20Solutions%20LLC%2C%205900%20Balcones%20Dr%20Suit%20100%2C%20Austin%2C%20TX%2078731%2C%20USA!5e0!3m2!1sen!2sin!4v1777653391065!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Skilluence office map"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
