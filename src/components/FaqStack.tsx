"use client";

import { useState, type CSSProperties } from "react";
import FlyWords from "@/components/FlyWords";

export type FaqItem = {
  q: string;
  a: string;
};

type Props = {
  faqs: readonly FaqItem[];
};

/**
 * Left: badge, heading, copy, squiggle — sticky.
 * Right: simple sticky cards. Questions stay readable; hover shows the answer.
 */
export default function FaqStack({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq-exact">
      <aside className="faq-exact-left">
        <div className="faq-exact-badge">
          <span className="faq-exact-spark" aria-hidden="true">
            ✦
          </span>
          FAQ
          <span className="faq-exact-badge-line" aria-hidden="true" />
        </div>

        <FlyWords as="h2" className="faq-exact-title">
          Got any
          <span className="faq-exact-title-em">questions?</span>
        </FlyWords>

        <p className="faq-exact-copy">
          Straight answers about process, timeline, and how we start. Hover a
          card to read more.
        </p>

        <span className="faq-qmark" aria-hidden="true">
          ?
        </span>

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
      </aside>

      <div
        className="faq-exact-right faq-stack"
        role="list"
        onMouseLeave={() => setOpen(null)}
      >
        {faqs.map((item, index) => {
          const num = String(index + 1).padStart(2, "0");
          const isOpen = open === index;

          return (
            <article
              key={item.q}
              role="listitem"
              className={`faq-stack-card${isOpen ? " is-open" : ""}`}
              style={
                {
                  ["--stack-i"]: index,
                  ["--stack-z"]: index + 1,
                } as CSSProperties
              }
              onMouseEnter={() => setOpen(index)}
            >
              <div className="faq-stack-inner">
                <button
                  type="button"
                  className="faq-exact-card-btn"
                  aria-expanded={isOpen}
                  onFocus={() => setOpen(index)}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="faq-exact-mini">{num}</span>
                  <span className="faq-exact-q">{item.q}</span>
                  <span className="faq-exact-plus" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div className="faq-exact-answer" hidden={!isOpen}>
                  <p>{item.a}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
