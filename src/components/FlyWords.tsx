"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div";
};

/**
 * Marketing Lab–style: words fly in from scattered offsets, then settle.
 * Plays once when the heading enters the viewport.
 */
export default function FlyWords({
  children,
  className = "",
  as: Tag = "span",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.classList.add("is-settled");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-settled");
          io.unobserve(el);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} className={`fly-words ${className}`.trim()}>
      {decorate(children, { i: 0 }).nodes}
    </Tag>
  );
}

function decorate(
  node: ReactNode,
  counter: { i: number }
): { nodes: ReactNode } {
  if (node == null || typeof node === "boolean") {
    return { nodes: node };
  }

  if (typeof node === "string" || typeof node === "number") {
    const text = String(node);
    const parts = text.split(/(\s+)/);
    return {
      nodes: parts.map((part, idx) => {
        if (!part || /^\s+$/.test(part)) {
          return <span key={`s-${counter.i}-${idx}`}>{part}</span>;
        }
        const i = counter.i++;
        const ox = (((i * 47) % 11) - 5) * 28;
        const oy = (((i * 31) % 9) - 4) * 34;
        const rot = (((i * 19) % 7) - 3) * 8;
        return (
          <span
            key={`w-${i}`}
            className="fly-word"
            style={
              {
                ["--fly-ox"]: `${ox}px`,
                ["--fly-oy"]: `${oy}px`,
                ["--fly-rot"]: `${rot}deg`,
                ["--fly-i"]: i,
              } as CSSProperties
            }
          >
            {part}
          </span>
        );
      }),
    };
  }

  if (Array.isArray(node)) {
    return {
      nodes: Children.map(node, (child) => decorate(child, counter).nodes),
    };
  }

  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode; className?: string }>;
    const inner = decorate(el.props.children, counter).nodes;
    return {
      nodes: cloneElement(el, { ...el.props }, inner),
    };
  }

  return { nodes: node };
}
