"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type ServiceCard = {
  title: string;
  body: string;
};

type Props = {
  services: readonly ServiceCard[];
};

/**
 * Sticky stack — each card slides up over the previous one while scrolling
 * (Instagram reel / achievements-style pile).
 */
export default function ServicesStack({ services }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>(".svc-stack-card")];
    if (!cards.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onScroll = () => {
      const pinBase = 110;
      cards.forEach((card, i) => {
        const pin = pinBase + i * 14;
        const next = cards[i + 1];
        if (!next) {
          card.style.setProperty("--stack-scale", "1");
          card.style.setProperty("--stack-dim", "0");
          return;
        }
        const nr = next.getBoundingClientRect();
        const cover = Math.min(1, Math.max(0, (pin + 100 - nr.top) / 180));
        card.style.setProperty("--stack-scale", String(1 - cover * 0.085));
        card.style.setProperty("--stack-dim", String(cover * 0.4));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [services]);

  return (
    <div ref={rootRef} className="svc-stack">
      {services.map((service, index) => {
        const num = String(index + 1).padStart(2, "0");
        return (
          <article
            key={service.title}
            className="svc-stack-card"
            style={
              {
                ["--stack-i"]: index,
                ["--stack-z"]: index + 1,
                ["--stack-top"]: `${110 + index * 14}px`,
              } as CSSProperties
            }
          >
            <div className="svc-stack-inner">
              <div className="svc-stack-top">
                <span className="svc-stack-num">{num}</span>
                <span className="svc-stack-tag">Service</span>
              </div>
              <h3 className="svc-stack-title">{service.title}</h3>
              <p className="svc-stack-body">{service.body}</p>
              <div className="svc-stack-bar" aria-hidden="true" />
            </div>
          </article>
        );
      })}
    </div>
  );
}
