"use client";

import type { CSSProperties } from "react";

export type ServiceCard = {
  title: string;
  body: string;
  tag?: string;
  techs?: readonly string[];
};

type Props = {
  services: readonly ServiceCard[];
};

const ICONS = [
  "/services/fullstack.png",
  "/services/frontend.png",
  "/services/backend.png",
  "/services/interactive.png",
] as const;

/**
 * Marketing Lab "Our Process": each row is a sticky 4-column grid.
 * Only one column holds a card, so scrolling locks cards into a row
 * left to right. Card faces follow the What I Do reference.
 */
export default function ServicesStack({ services }: Props) {
  return (
    <div className="svc-process" style={{ ["--svc-n" as string]: services.length }}>
      {services.map((service, index) => {
        const num = String(index + 1).padStart(2, "0");
        const icon = ICONS[index] ?? ICONS[0];
        return (
          <div
            key={service.title}
            className="svc-process-row"
            style={
              {
                ["--svc-i"]: index,
                zIndex: index + 1,
              } as CSSProperties
            }
          >
            <div className="svc-process-grid">
              {services.map((slot, col) =>
                col === index ? (
                  <article key={slot.title} className="svc-do-face">
                    <div className="svc-do-card-top">
                      <span className="svc-do-num">{num}</span>
                      <span className="svc-do-tag">{service.tag ?? "Service"}</span>
                    </div>

                    <div className="svc-do-icon">
                      <span className="svc-do-orbit" aria-hidden="true" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={icon}
                        alt=""
                        className="svc-do-icon-img"
                        width={220}
                        height={220}
                        decoding="async"
                      />
                    </div>

                    <h3 className="svc-do-card-title">{service.title}</h3>
                    <span className="svc-do-rule" aria-hidden="true" />
                    <p className="svc-do-card-body">{service.body}</p>

                    <div className="svc-do-card-foot">
                      <p className="svc-do-techs">
                        {(service.techs ?? []).join(" · ")}
                      </p>
                      <a
                        href="#contact"
                        className="svc-do-go"
                        aria-label={`Start a ${service.title} project`}
                      >
                        →
                      </a>
                    </div>
                  </article>
                ) : (
                  <div key={slot.title} className="svc-process-ghost" aria-hidden="true" />
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
