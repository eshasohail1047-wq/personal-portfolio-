"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/** Real stack from site skills — premium cluster, not a logo row */
const TECH = [
  { name: "HTML", mark: "</>", ox: "-145%", oy: "-110%", rot: -22, size: "lg" },
  { name: "CSS", mark: "#", ox: "130%", oy: "-125%", rot: 18, size: "md" },
  { name: "JavaScript", mark: "JS", ox: "-160%", oy: "35%", rot: -10, size: "lg" },
  { name: "React", mark: "⚛", ox: "150%", oy: "25%", rot: 26, size: "lg" },
  { name: "Next.js", mark: "N", ox: "-100%", oy: "135%", rot: -14, size: "md" },
  { name: "PHP", mark: "P", ox: "115%", oy: "140%", rot: 12, size: "sm" },
  { name: "MySQL", mark: "DB", ox: "-175%", oy: "-55%", rot: 20, size: "md" },
  { name: "Leaflet", mark: "◎", ox: "165%", oy: "-60%", rot: -24, size: "sm" },
  { name: "Godot", mark: "▶", ox: "-55%", oy: "155%", rot: 14, size: "md" },
  { name: "C#", mark: "C#", ox: "90%", oy: "-145%", rot: -16, size: "sm" },
] as const;

const LAND = [
  { top: "10%", left: "16%" },
  { top: "4%", left: "48%" },
  { top: "14%", left: "74%" },
  { top: "36%", left: "8%" },
  { top: "32%", left: "40%" },
  { top: "40%", left: "68%" },
  { top: "60%", left: "18%" },
  { top: "56%", left: "52%" },
  { top: "70%", left: "76%" },
  { top: "74%", left: "38%" },
] as const;

export default function AboutTechStack() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.classList.add("is-gathered", "is-reduced");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add("is-gathered");
          io.unobserve(root);
        }
      },
      { threshold: 0.28, rootMargin: "0px 0px -6% 0px" }
    );

    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="about-stack" aria-label="Technology stack">
      <div className="about-stack-aura" aria-hidden="true" />
      <div className="about-stack-ring about-stack-ring-a" aria-hidden="true" />
      <div className="about-stack-ring about-stack-ring-b" aria-hidden="true" />
      <div className="about-stack-hub" aria-hidden="true">
        <span>Stack</span>
      </div>
      <div className="about-stack-field">
        {TECH.map((tech, i) => {
          const land = LAND[i] ?? LAND[0];
          return (
            <span
              key={tech.name}
              className={`about-stack-chip about-stack-chip--${tech.size}`}
              style={
                {
                  top: land.top,
                  left: land.left,
                  ["--ox"]: tech.ox,
                  ["--oy"]: tech.oy,
                  ["--rot"]: `${tech.rot}deg`,
                  ["--i"]: i,
                  ["--float-dur"]: `${5.4 + (i % 5) * 0.65}s`,
                  ["--float-delay"]: `${0.12 * i}s`,
                  ["--pulse-delay"]: `${0.2 * i}s`,
                } as CSSProperties
              }
            >
              <em className="about-stack-mark">{tech.mark}</em>
              <span className="about-stack-name">{tech.name}</span>
              <span className="about-stack-glow" aria-hidden="true" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
