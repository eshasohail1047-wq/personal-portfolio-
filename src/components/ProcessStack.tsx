"use client";

import { useEffect, useRef } from "react";
import SectionHeading from "@/components/SectionHeading";

export type ProcessStep = {
  num: string;
  title: string;
  body: string;
};

type Props = {
  steps: readonly ProcessStep[];
};

/** Card spots as % of the flight canvas — zigzag like the reel. */
const SPOTS = [
  { left: "4%", top: "6%", unlock: 0.14 },
  { left: "48%", top: "28%", unlock: 0.38 },
  { left: "6%", top: "52%", unlock: 0.62 },
  { left: "42%", top: "74%", unlock: 0.86 },
] as const;

const PATH_D =
  "M 18 10 C 28 14, 55 18, 68 30 C 78 38, 72 48, 28 56 C 12 60, 18 72, 62 82 C 78 88, 85 92, 88 96";

const CYCLE_MS = 9000;
const HOLD_MS = 1400;

function PlaneIcon() {
  return (
    <svg viewBox="0 0 48 48" className="proc-plane-svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M44.5 23.2 6.8 6.4c-1.2-.5-2.4.7-1.8 1.9l6.8 14.1c.2.4.2.9 0 1.3L5 37.8c-.6 1.2.6 2.4 1.8 1.9l37.7-16.8c1.1-.5 1.1-2.1 0-2.7Z"
      />
      <path
        fill="rgba(26,10,20,0.35)"
        d="M18.2 22.4h12.6c.6 0 .9.7.5 1.1l-4.4 4.1c-.3.3-.8.3-1.1 0l-4.4-4.1c-.4-.4-.1-1.1.5-1.1Z"
      />
    </svg>
  );
}

/**
 * About = process flight: plane flies the path on a loop;
 * cards light purple/orange when the plane reaches them.
 * Short bio sits in free space (not over cards).
 */
export default function ProcessStack({ steps }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const path = pathRef.current;
    const plane = planeRef.current;
    if (!stage || !path || !plane) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      cardRefs.current.forEach((c) => c?.classList.add("is-lit"));
      plane.style.opacity = "0";
      stage.style.setProperty("--flight-progress", "1");
      return;
    }

    let raf = 0;
    let start = performance.now();
    let holding = false;
    let holdUntil = 0;

    const apply = (progress: number) => {
      const len = path.getTotalLength();
      const dist = progress * len;
      const pt = path.getPointAtLength(dist);
      const ahead = path.getPointAtLength(Math.min(len, dist + 0.8));
      const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;

      plane.style.left = `${pt.x}%`;
      plane.style.top = `${pt.y}%`;
      plane.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      stage.style.setProperty("--flight-progress", String(progress));

      SPOTS.forEach((spot, i) => {
        const card = cardRefs.current[i];
        if (!card) return;
        card.classList.toggle("is-lit", progress >= spot.unlock - 0.02);
      });
    };

    const tick = (now: number) => {
      if (holding) {
        if (now >= holdUntil) {
          holding = false;
          start = now;
          cardRefs.current.forEach((c) => c?.classList.remove("is-lit"));
          apply(0);
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - start;
      let t = elapsed / CYCLE_MS;
      if (t >= 1) {
        apply(1);
        holding = true;
        holdUntil = now + HOLD_MS;
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = t * t * (3 - 2 * t);
      apply(progress);
      raf = requestAnimationFrame(tick);
    };

    apply(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [steps]);

  return (
    <div className="proc-flight-page">
      <header className="proc-flight-intro">
        <SectionHeading
          accent="about"
          lead={
            <p className="process-lead">
              Watch the plane fly the route — each stop lights when it arrives.
            </p>
          }
        >
          About
        </SectionHeading>

        <aside className="about-bio-glass" aria-label="About Esha">
          <p className="about-bio-kicker">Esha Sohail</p>
          <p className="about-bio-text">
            AI-Powered Full Stack Developer. Sketch to shipped product — clean
            code, clear interface. AI speeds me up; taste decides what ships.
          </p>
          <p className="about-bio-sign">— Esha</p>
        </aside>
      </header>

      <div className="proc-build-head">
        <p className="proc-build-kicker">Process</p>
        <h3 className="proc-build-title">How I Build</h3>
      </div>

      <div
        ref={stageRef}
        className="proc-flight-stage proc-flight-stage--auto"
        aria-label="How I build flight path"
      >
        <svg
          className="proc-flight-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="proc-flight-path-base"
            d={PATH_D}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={pathRef}
            className="proc-flight-path-draw"
            d={PATH_D}
            fill="none"
            pathLength={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div ref={planeRef} className="proc-plane" aria-hidden="true">
          <PlaneIcon />
        </div>

        {steps.slice(0, 4).map((step, index) => {
          const spot = SPOTS[index] ?? SPOTS[0];
          return (
            <article
              key={step.num}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="proc-flight-card"
              style={{ left: spot.left, top: spot.top }}
            >
              <span className="proc-flight-num">{step.num}</span>
              <h2 className="proc-flight-title">{step.title}</h2>
              <p className="proc-flight-body">{step.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
