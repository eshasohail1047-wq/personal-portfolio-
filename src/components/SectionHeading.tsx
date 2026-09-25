import type { ReactNode } from "react";
import FlyWords from "@/components/FlyWords";

export type SectionAccent =
  | "about"
  | "services"
  | "projects"
  | "skills"
  | "testimonials"
  | "faq"
  | "contact"
  | "process";

type Props = {
  kicker?: string;
  accent: SectionAccent;
  children: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  lead?: ReactNode;
};

export default function SectionHeading({
  kicker,
  accent,
  children,
  as: Tag = "h2",
  className = "",
  lead,
}: Props) {
  return (
    <header className={`sec-head sec-head--${accent} ${className}`.trim()}>
      {kicker ? <p className="sec-head-kicker">{kicker}</p> : null}
      <FlyWords as={Tag} className="sec-head-title">
        {children}
      </FlyWords>
      {lead ? <div className="sec-head-lead">{lead}</div> : null}
    </header>
  );
}
