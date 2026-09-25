"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const NAV_LINKS = [
  { label: "Home", href: "/#top", id: "top" },
  { label: "About", href: "/#about", id: "about" },
  { label: "How I Build", href: "/#how-i-build", id: "how-i-build" },
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
      <header className="framora-nav">
        <div className="framora-nav-inner">
          <a href="/#top" className="framora-logo" onClick={onMenuClose}>
            <span className="framora-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 40 40" className="framora-logo-svg" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="36"
                  height="36"
                  rx="11"
                  fill="url(#esFill)"
                />
                <text
                  x="20"
                  y="26.5"
                  textAnchor="middle"
                  fill="#1a0a14"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fontWeight="700"
                  fontSize="15"
                  letterSpacing="-0.5"
                >
                  ES
                </text>
                <defs>
                  <linearGradient id="esFill" x1="4" y1="4" x2="36" y2="36">
                    <stop stopColor="#fdba74" />
                    <stop offset="0.55" stopColor="#e879f9" />
                    <stop offset="1" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
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
