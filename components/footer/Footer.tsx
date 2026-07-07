import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./Footer.module.css";

const quicklinks = [
  { label: "Home", href: "/" },
  { label: "Why Choose Us", href: "/#why" },
  { label: "Contact Us", href: "/contact" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Blog", href: "/blog" },
];

const exploreMore = [
  { label: "Our Services", href: "/#programs" },
  { label: "Careers at Skilluence", href: "/career" },
  { label: "Interview Prep", href: "/#process" },
  { label: "Resume Audit", href: "/contact" },
];

export default function SiteFooter() {
  return (
    <footer className={styles["footer"]}>
      <div className={styles["footer-inner"]}>
        <div className={styles["footer-grid"]}>

          {/* Brand column */}
          <div className={styles["footer-brand"]}>
            <img src="/logo-authentic-scaled.png" alt="Skilluence" />
            <p>
              Skilluence is skill plus influence — the belief that a thriving
              career is rooted in capability, strategy, and the right
              opportunity.
            </p>
            <div className={styles["footer-social"]}>
              <a href="https://www.linkedin.com/company/skilluence/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/skilluence/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://wa.me/13463638799" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.122 1.523 5.855L.057 23.882l6.162-1.615A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.371l-.36-.214-3.724.976.997-3.63-.234-.373A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quicklinks */}
          <div className={styles["footer-col"]}>
            <h4>Quicklinks</h4>
            <ul>
              {quicklinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <ArrowUpRight size={14} aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore More */}
          <div className={styles["footer-col"]}>
            <h4>Explore More</h4>
            <ul>
              {exploreMore.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <ArrowUpRight size={14} aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles["footer-col"]}>
            <h4>Contact Info</h4>
            <div className={styles["footer-contact-items"]}>
              <div className={styles["footer-contact-item"]}>
                <span className={styles["footer-contact-label"]}>Inquiry</span>
                <Link href="tel:+13463638799">+1 (346) 363 8799</Link>
              </div>
              <div className={styles["footer-contact-item"]}>
                <span className={styles["footer-contact-label"]}>Email</span>
                <Link href="mailto:contact@skilluence.com">contact@skilluence.com</Link>
              </div>
              <div className={styles["footer-contact-item"]}>
                <span className={styles["footer-contact-label"]}>Location</span>
                <span>5900 Balcones Drive STE 100 Austin TX 78731</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className={styles["footer-bottom"]}>
        <p>
          © Copyright 2026. All rights reserved.{" "}
          <Link href="/">Skilluence</Link>. <em>All careers on course.</em>
        </p>
      </div>
    </footer>
  );
}
