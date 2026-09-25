"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import SectionHeading from "@/components/SectionHeading";

const SKILLS = [
  {
    name: "HTML",
    mark: "</>",
    line: "The bones of every page.",
    top: "8%",
    left: "6%",
    dur: "7.2s",
    delay: "0s",
    fx: "10px",
    fy: "-18px",
  },
  {
    name: "CSS",
    mark: "#",
    line: "Layout, type, and motion.",
    top: "2%",
    left: "38%",
    dur: "8.4s",
    delay: "0.4s",
    fx: "-12px",
    fy: "-14px",
  },
  {
    name: "JavaScript",
    mark: "JS",
    line: "The behavior people feel.",
    top: "10%",
    left: "70%",
    dur: "6.9s",
    delay: "0.8s",
    fx: "14px",
    fy: "-16px",
  },
  {
    name: "React",
    mark: "⚛",
    line: "Interfaces that stay in sync.",
    top: "36%",
    left: "14%",
    dur: "7.8s",
    delay: "0.2s",
    fx: "-8px",
    fy: "-20px",
  },
  {
    name: "Next.js",
    mark: "N",
    line: "Products that ship on the web.",
    top: "32%",
    left: "52%",
    dur: "8.6s",
    delay: "0.55s",
    fx: "9px",
    fy: "-12px",
  },
  {
    name: "PHP",
    mark: "P",
    line: "Server logic that holds up.",
    top: "38%",
    left: "78%",
    dur: "7.1s",
    delay: "0.9s",
    fx: "-11px",
    fy: "-15px",
  },
  {
    name: "MySQL",
    mark: "DB",
    line: "Data the product remembers.",
    top: "64%",
    left: "8%",
    dur: "8.9s",
    delay: "0.25s",
    fx: "8px",
    fy: "-13px",
  },
  {
    name: "Leaflet",
    mark: "◎",
    line: "Maps that stay honest.",
    top: "60%",
    left: "40%",
    dur: "6.6s",
    delay: "0.65s",
    fx: "-7px",
    fy: "-19px",
  },
  {
    name: "Godot",
    mark: "▶",
    line: "Play, tension, real-time.",
    top: "66%",
    left: "64%",
    dur: "8s",
    delay: "1s",
    fx: "11px",
    fy: "-14px",
  },
  {
    name: "C#",
    mark: "C#",
    line: "Game logic inside Godot.",
    top: "74%",
    left: "84%",
    dur: "7.5s",
    delay: "0.35s",
    fx: "-9px",
    fy: "-11px",
  },
] as const;

export default function SkillsSection() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !fine) return;

    const onMove = (e: PointerEvent) => {
      const rect = field.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      field.style.setProperty("--mx", String(x));
      field.style.setProperty("--my", String(y));
    };

    const onLeave = () => {
      field.style.setProperty("--mx", "0");
      field.style.setProperty("--my", "0");
    };

    field.addEventListener("pointermove", onMove);
    field.addEventListener("pointerleave", onLeave);
    return () => {
      field.removeEventListener("pointermove", onMove);
      field.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section id="skills" className="section-pad section-skills">
      <div className="section-inner">
        <SectionHeading
          kicker="Stack"
          accent="skills"
          lead={
            <p className="skills-lead">
              A floating constellation of tools I reach for when an idea needs
              to ship.
            </p>
          }
        >
          My Skills
        </SectionHeading>

        <div ref={fieldRef} className="skills-orbit" aria-label="Skills constellation">
          <div className="skills-orbit-core" aria-hidden="true">
            <span className="skills-orbit-ring" />
            <span className="skills-orbit-ring skills-orbit-ring-b" />
            <span className="skills-orbit-hub">Stack</span>
          </div>

          {SKILLS.map((skill, i) => (
            <article
              key={skill.name}
              className="skill-float"
              style={
                {
                  top: skill.top,
                  left: skill.left,
                  ["--float-dur"]: skill.dur,
                  ["--float-delay"]: skill.delay,
                  ["--fx"]: skill.fx,
                  ["--fy"]: skill.fy,
                  ["--i"]: i,
                } as CSSProperties
              }
            >
              <span className="skill-float-mark">{skill.mark}</span>
              <div className="skill-float-copy">
                <h3 className="skill-float-name">{skill.name}</h3>
                <p className="skill-float-line">{skill.line}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile-friendly strip */}
        <div className="skills-strip" aria-hidden="true">
          <div className="skills-strip-track">
            {[...SKILLS, ...SKILLS].map((skill, i) => (
              <span key={`${skill.name}-${i}`} className="skills-strip-chip">
                <em>{skill.mark}</em>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
