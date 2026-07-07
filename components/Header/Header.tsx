"use client";

import { type MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { serviceDetails } from "@/lib/services";
import styles from "./Header.module.css";

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const scrollToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") {
      return;
    }

    event.preventDefault();
    closeMenu();
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header className={`${styles["site-header"]}${isScrolled ? " " + styles["is-scrolled"] : ""}`}>
      <Link className={styles["brand"]} href="/" aria-label="Skilluence home">
        <img src="/logo-authentic-scaled.png" alt="Skilluence" />
      </Link>
      <nav className={styles["desktop-nav"]} aria-label="Primary navigation">
        <Link href="/">Home</Link>
        <div className={styles["services-menu"]}>
          <button type="button" className={styles["services-trigger"]}>
            Our Services
            <ChevronDown size={14} aria-hidden="true" />
          </button>
          <div className={styles["services-dropdown"]}>
            {serviceDetails.map((service) => (
              <Link
                key={service.slug}
                href={`/our-services/${service.slug}`}
                className={styles["service-link"]}
              >
                {service.title}
              </Link>
            ))}
          </div>
        </div>
        <Link href="/career">Career</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/contact">Contact Us</Link>
      </nav>
      <div className={styles["header-actions"]}>
        <Link className={styles["header-cta"]} href="/#contact" onClick={scrollToContact}>
          Get in Touch
        </Link>
        <button
          type="button"
          className={styles["mobile-toggle"]}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div className={`${styles["mobile-panel"]}${isMenuOpen ? " " + styles["is-open"] : ""}`}>
        <Link href="/" onClick={closeMenu}>Home</Link>
        <details className={styles["mobile-services"]}>
          <summary>
            Our Services
            <ChevronDown size={14} aria-hidden="true" />
          </summary>
          <div>
            {serviceDetails.map((service) => (
              <Link
                key={service.slug}
                href={`/our-services/${service.slug}`}
                onClick={closeMenu}
              >
                {service.title}
              </Link>
            ))}
          </div>
        </details>
        <Link href="/career" onClick={closeMenu}>Career</Link>
        <Link href="/blog" onClick={closeMenu}>Blog</Link>
        <Link href="/contact" onClick={closeMenu}>Contact Us</Link>
        <Link href="/#contact" onClick={scrollToContact}>Get in Touch</Link>
      </div>
    </header>
  );
}
