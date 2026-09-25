"use client";

import { useState } from "react";

const SERVICES = [
  {
    title: "Full Stack Apps",
    mark: "01",
    body: "From UI to database — maps, planners, and product features that work in the browser.",
  },
  {
    title: "Frontend UI",
    mark: "02",
    body: "Responsive layouts, sharp interactions, and interfaces that stay readable on any screen.",
  },
  {
    title: "Backend & Data",
    mark: "03",
    body: "PHP, MySQL, and structured logic so your product remembers users and stays reliable.",
  },
  {
    title: "Games & Interactive",
    mark: "04",
    body: "Godot and C# builds when the idea needs motion, tension, and real-time feedback.",
  },
] as const;

export default function HelpSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="services"
      className="relative border-t border-[var(--border)] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Services
        </p>
        <h2 className="mb-3 max-w-[12ch] font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
          Where I can help
        </h2>
        <p className="mb-10 max-w-lg text-[var(--muted)]">
          Tap a lane to open what I actually ship — expand, highlight, and swap
          focus without leaving the page.
        </p>

        <ul className="flex flex-col gap-3">
          {SERVICES.map((service, index) => {
            const isOpen = open === index;
            return (
              <li key={service.title}>
                <button
                  type="button"
                  className={`help-item${isOpen ? " is-open" : ""}`}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <div className="flex items-center gap-4">
                    <span className="help-mark">{service.mark}</span>
                    <span className="flex-1 text-left text-lg font-semibold tracking-tight sm:text-xl">
                      {service.title}
                    </span>
                    <span
                      className="text-sm text-[var(--accent)]"
                      aria-hidden="true"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                  <div className="help-body">
                    <div className="help-body-inner">
                      <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                        {service.body}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
