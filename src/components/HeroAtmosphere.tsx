"use client";

import { useEffect, useState } from "react";

const TECH = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Next.js",
  "Tailwind CSS",
] as const;

const CODE_LINES = [
  { t: "const", c: "kw" },
  { t: " build", c: "fn" },
  { t: " = ", c: "op" },
  { t: "async", c: "kw" },
  { t: " () => {", c: "op" },
  { t: "\n", c: "op" },
  { t: "  const", c: "kw" },
  { t: " ui", c: "var" },
  { t: " = ", c: "op" },
  { t: "await", c: "kw" },
  { t: " craft", c: "fn" },
  { t: "(", c: "op" },
  { t: '"idea"', c: "str" },
  { t: ");", c: "op" },
  { t: "\n", c: "op" },
  { t: "  return", c: "kw" },
  { t: " (", c: "op" },
  { t: "\n", c: "op" },
  { t: "    <", c: "tag" },
  { t: "App", c: "comp" },
  { t: " live", c: "attr" },
  { t: "={", c: "op" },
  { t: "ui", c: "var" },
  { t: "} />", c: "tag" },
  { t: "\n", c: "op" },
  { t: "  );", c: "op" },
  { t: "\n", c: "op" },
  { t: "};", c: "op" },
  { t: "\n\n", c: "op" },
  { t: "build", c: "fn" },
  { t: "();", c: "op" },
  { t: " ", c: "op" },
  { t: "// ship it", c: "cmt" },
] as const;

/** Full-bleed hero photo + typing on laptop screen + floating glass cards. */
export default function HeroAtmosphere() {
  const [chars, setChars] = useState(0);
  const [reduced, setReduced] = useState(false);

  const fullLen = CODE_LINES.reduce((n, p) => n + p.t.length, 0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (reduced) {
      setChars(fullLen);
      return;
    }
    let i = 0;
    let timer = 0;
    const tick = () => {
      i += 1;
      if (i > fullLen + 18) i = 0;
      setChars(Math.min(i, fullLen));
      timer = window.setTimeout(tick, i > fullLen ? 900 : 38);
    };
    timer = window.setTimeout(tick, 400);
    return () => window.clearTimeout(timer);
  }, [reduced, fullLen]);

  let remaining = chars;
  const visible: { t: string; c: string }[] = [];
  for (const part of CODE_LINES) {
    if (remaining <= 0) break;
    const slice = part.t.slice(0, remaining);
    visible.push({ t: slice, c: part.c });
    remaining -= slice.length;
  }

  return (
    <div className="hero-stage" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-stage-photo"
        src="/hero/hero-coding-girl.jpg"
        alt=""
      />

      <div className="hero-stage-scrim" />
      <div className="hero-stage-glow hero-stage-glow-a" />
      <div className="hero-stage-glow hero-stage-glow-b" />

      {/* Typing overlay — laptop screen region on full-bleed photo */}
      <div className="hero-screen-overlay">
        <div className="hero-screen-glow" />
        <pre className="hero-screen-code">
          {visible.map((p, idx) => (
            <span key={idx} className={`hc-${p.c}`}>
              {p.t}
            </span>
          ))}
          {!reduced ? <span className="hero-screen-cursor">▋</span> : null}
        </pre>
      </div>

      <div className="hero-glass hero-glass-tech">
        <div className="hero-glass-head">
          <span className="hero-glass-ico" aria-hidden="true">
            &lt;/&gt;
          </span>
          <span>Technologies I Love</span>
        </div>
        <ul className="hero-glass-list">
          {TECH.map((t) => (
            <li key={t}>
              <span className="hero-glass-dot" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="hero-glass hero-glass-build">
        <div className="hero-glass-head">
          <span className="hero-glass-ico hero-glass-ico-star" aria-hidden="true">
            ✦
          </span>
          <span>Building Digital Experiences</span>
        </div>
        <p className="hero-glass-tags">
          Clean Code <span>/</span> Modern UI <span>/</span> Fast Performance
        </p>
      </div>
    </div>
  );
}
