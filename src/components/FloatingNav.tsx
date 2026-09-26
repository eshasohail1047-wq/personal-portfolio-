"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const NAV_LINKS = [
  { label: "Home", href: "/#top", id: "top" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "Projects", href: "/#projects", id: "projects" },
  { label: "FAQ", href: "/#faq", id: "faq" },
] as const;

const WHATSAPP =
  "https://wa.me/923707133664?text=Hi%20Esha%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20work%20with%20you.";

type FloatingNavProps = {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
};

export default function FloatingNav({
  menuOpen,
  onMenuToggle,
  onMenuClose,
}: FloatingNavProps) {
  const pathname = usePathname();
  const [active, setActive] = useState("top");
  /** Fixed only on hero — hide once the hero scrolls away. */
  const [onHero, setOnHero] = useState(true);

  useEffect(() => {
    if (pathname !== "/") {
      setOnHero(false);
      return;
    }

    const hero = document.getElementById("top");
    if (!hero) return;

    const sync = () => {
      const visible = hero.getBoundingClientRect().bottom > 72;
      setOnHero(visible);
      if (!visible) onMenuClose();
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [pathname, onMenuClose]);

  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = NAV_LINKS.map((l) => l.id);
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.08, 0.2, 0.4] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <header
        className={`framora-nav framora-nav--static${onHero ? "" : " is-hero-left"}`}
        aria-hidden={!onHero}
      >
        <div className="framora-nav-inner">
          <a href="/#top" className="framora-logo" onClick={onMenuClose}>
            <span className="framora-logo-mark" aria-hidden="true">
              <svg
                viewBox="0 0 40 40"
                className="framora-logo-svg"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="esRing"
                    x1="4"
                    y1="6"
                    x2="36"
                    y2="34"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#c084fc" />
                    <stop offset="0.5" stopColor="#e879f9" />
                    <stop offset="1" stopColor="#fb923c" />
                  </linearGradient>
                  <linearGradient
                    id="esGlyph"
                    x1="12"
                    y1="10"
                    x2="28"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#f5f3ff" />
                    <stop offset="1" stopColor="#e9d5ff" />
                  </linearGradient>
                </defs>
                <circle
                  cx="20"
                  cy="20"
                  r="15.5"
                  stroke="url(#esRing)"
                  strokeWidth="1.6"
                  opacity="0.95"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="11.25"
                  fill="rgba(192,132,252,0.12)"
                />
                <path
                  d="M14.2 12.4h11.2c.55 0 1 .45 1 1v1.15c0 .55-.45 1-1 1H17.1v3.05h6.6c.55 0 1 .45 1 1v1.1c0 .55-.45 1-1 1h-6.6v3.15h8.3c.55 0 1 .45 1 1V27.1c0 .55-.45 1-1 1H14.2c-.55 0-1-.45-1-1V13.4c0-.55.45-1 1-1Z"
                  fill="url(#esGlyph)"
                />
              </svg>
            </span>
            <span className="framora-logo-text">Esha</span>
          </a>

          <nav className="framora-pill" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`framora-link${active === link.id ? " is-active" : ""}`}
                tabIndex={onHero ? 0 : -1}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="framora-end">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="framora-cta"
              tabIndex={onHero ? 0 : -1}
            >
              Let&apos;s Collaborate
              <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              className="framora-menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={onMenuToggle}
              tabIndex={onHero ? 0 : -1}
            >
              <span className="framora-menu-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-nav${menuOpen ? " is-open" : ""}`}
        onClick={onMenuClose}
        hidden={!onHero && !menuOpen}
      >
        <div
          className="mobile-nav-panel"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="mobile-nav-list">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                onClick={onMenuClose}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="framora-cta mobile-nav-cta"
            onClick={onMenuClose}
          >
            Let&apos;s Collaborate ↗
          </a>
        </div>
      </div>
    </>
  );
}
