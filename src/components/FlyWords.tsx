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

const EM_CLASS_RE = /(^|\s)(sec-head-em|faq-exact-title-em)(\s|$)/;

/**
 * Marketing Lab–style: words fly in from scattered offsets, then settle.
 * Replays whenever the heading re-enters the viewport.
 * Even words stay white; odd words (or em spans) get the brand gradient.
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
          // Restart transition: clear, reflow, then settle again
          el.classList.remove("is-settled");
          void el.offsetWidth;
          el.classList.add("is-settled");
        } else {
          el.classList.remove("is-settled");
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const emphasizeOnly = containsEm(children);
  const wordCount = countWords(children);

  return (
    <Tag ref={ref as never} className={`fly-words ${className}`.trim()}>
      {
        decorate(children, { i: 0 }, { emphasizeOnly, wordCount, forceAccent: false })
          .nodes
      }
    </Tag>
  );
}

function containsEm(node: ReactNode): boolean {
  if (node == null || typeof node === "boolean") return false;
  if (typeof node === "string" || typeof node === "number") return false;
  if (Array.isArray(node)) return node.some(containsEm);
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode; className?: string }>;
    if (typeof el.props.className === "string" && EM_CLASS_RE.test(el.props.className)) {
      return true;
    }
    return containsEm(el.props.children);
  }
  return false;
}

function countWords(node: ReactNode): number {
  if (node == null || typeof node === "boolean") return 0;
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
      .split(/(\s+)/)
      .filter((p) => p && !/^\s+$/.test(p)).length;
  }
  if (Array.isArray(node)) {
    return node.reduce<number>((n, child) => n + countWords(child), 0);
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return countWords(el.props.children);
  }
  return 0;
}

function decorate(
  node: ReactNode,
  counter: { i: number },
  opts: { emphasizeOnly: boolean; wordCount: number; forceAccent: boolean }
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
        const ox = (((i * 47) % 11) - 5) * 12;
        const oy = (((i * 31) % 9) - 4) * 14;
        const rot = (((i * 19) % 7) - 3) * 4;
        const accent =
          opts.forceAccent ||
          opts.wordCount === 1 ||
          (!opts.emphasizeOnly && i % 2 === 1);
        return (
          <span
            key={`w-${i}`}
            className={`fly-word ${accent ? "fly-word--accent" : "fly-word--plain"}`}
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
      nodes: Children.map(node, (child) => decorate(child, counter, opts).nodes),
    };
  }

  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode; className?: string }>;
    const isEm =
      typeof el.props.className === "string" &&
      EM_CLASS_RE.test(el.props.className);
    const inner = decorate(el.props.children, counter, {
      ...opts,
      forceAccent: opts.forceAccent || isEm,
    }).nodes;
    return {
      nodes: cloneElement(el, { ...el.props }, inner),
    };
  }

  return { nodes: node };
}
