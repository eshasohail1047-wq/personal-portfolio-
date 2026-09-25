"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type FaqItem = {
  q: string;
  a: string;
};

type Props = {
  faqs: readonly FaqItem[];
};

/**
 * Left intro + right 3D fanned glass deck.
 * 2D hit strips open each card on hover — 3D transforms never steal the cursor.
 */
export default function FaqStack({ faqs }: Props) {
  const [open, setOpen] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="faq-exact">
      <div className="faq-exact-left">
        <div className="faq-exact-badge">
          <span className="faq-exact-spark" aria-hidden="true">
            ✦
          </span>
          FAQ
          <span className="faq-exact-badge-line" aria-hidden="true" />
        </div>

        <h2 className="faq-exact-title">
          Got any
          <span className="faq-exact-title-em">questions?</span>
        </h2>

        <p className="faq-exact-copy">
          Here are a few things you might be wondering about. Feel free to
          explore!
        </p>

        <svg
          className="faq-exact-squiggle"
          viewBox="0 0 180 48"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 28 C 28 8, 48 42, 72 22 S 110 6, 132 28 S 158 40, 172 20"
            stroke="url(#faqSquiggle)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M164 14 L176 20 L164 28"
            stroke="url(#faqSquiggle)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="faqSquiggle" x1="0" y1="0" x2="180" y2="0">
              <stop stopColor="#c084fc" />
              <stop offset="1" stopColor="#fb923c" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="faq-exact-right">
        <div
          className="faq-exact-hits"
          aria-hidden="true"
          onMouseLeave={() => setOpen(0)}
        >
          {faqs.map((item, index) => {
            const depth = faqs.length - 1 - index;
            return (
              <div
                key={`hit-${item.q}`}
                className={`faq-exact-hit${open === index ? " is-on" : ""}`}
                style={
                  {
                    ["--i"]: index,
                    ["--depth"]: depth,
                  } as CSSProperties
                }
                onMouseEnter={() => setOpen(index)}
              />
            );
          })}
        </div>

        <div
          className={`faq-exact-deck${open >= 0 ? " is-held" : ""}`}
          role="list"
        >
          {faqs.map((item, index) => {
            const num = String(index + 1).padStart(2, "0");
            const isOpen = open === index;
            const depth = faqs.length - 1 - index;

            return (
              <article
                key={item.q}
                role="listitem"
                className={`faq-exact-card${isOpen ? " is-open" : ""}`}
                style={
                  {
                    ["--i"]: index,
                    ["--depth"]: depth,
                    zIndex: isOpen ? 30 : faqs.length - index,
                  } as CSSProperties
                }
                onMouseEnter={() => setOpen(index)}
              >
                <button
                  type="button"
                  className="faq-exact-card-btn"
                  aria-expanded={isOpen}
                  onFocus={() => setOpen(index)}
                  onClick={() => setOpen(index)}
                >
                  <span className="faq-exact-mini">{num}</span>
                  <span className="faq-exact-q">{item.q}</span>
                  <span className="faq-exact-plus" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                  <span className="faq-exact-ghost" aria-hidden="true">
                    {num}
                  </span>
                  {isOpen ? (
                    <span className="faq-exact-underline" aria-hidden="true" />
                  ) : null}
                </button>

                <div
                  className="faq-exact-answer"
                  hidden={!isOpen}
                  aria-hidden={!isOpen}
                >
                  <p>{item.a}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
