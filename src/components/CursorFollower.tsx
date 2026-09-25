"use client";

import { useEffect, useRef } from "react";

/**
 * Productive cursor: blend-inverts text under it, magnets to links,
 * and gently pushes nearby heading characters.
 */
export default function CursorFollower() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let enabled = fine.matches && !reduced.matches;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let magnetX = 0;
    let magnetY = 0;
    let raf = 0;
    let visible = false;

    const BODY_CHARS = "h1.hero-mq-name, .hero-mq-name, .hero-mq-bio";
    const INTERACTIVE =
      "a, button, [role='button'], input, textarea, select, label, .framora-link, .btn-hero-primary, .btn-hero-secondary, .framora-cta";

    const setVisible = (v: boolean) => {
      visible = v;
      root.classList.toggle("is-on", v && enabled);
    };

    const wrapTextNode = (node: Text) => {
      const value = node.nodeValue ?? "";
      if (!value.length) return;
      const frag = document.createDocumentFragment();
      [...value].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "cursor-ch";
        span.textContent = ch === " " ? "\u00A0" : ch;
        frag.appendChild(span);
      });
      node.parentNode?.replaceChild(frag, node);
    };

    const splitElement = (el: HTMLElement) => {
      if (el.dataset.cursorSplit === "1") return;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const texts: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) {
        if (n.nodeValue && n.nodeValue.length) texts.push(n as Text);
      }
      texts.forEach(wrapTextNode);
      el.dataset.cursorSplit = "1";
      el.classList.add("cursor-text");
    };

    const splitTextNodes = () => {
      document.querySelectorAll<HTMLElement>(BODY_CHARS).forEach(splitElement);
    };

    const pushChars = () => {
      document.querySelectorAll<HTMLElement>(".cursor-ch").forEach((ch) => {
        const rect = ch.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(mx - cx, my - cy);
        const radius = 88;
        if (dist < radius) {
          const force = (1 - dist / radius) * 10;
          const angle = Math.atan2(cy - my, cx - mx);
          const tx = Math.cos(angle) * force;
          const ty = Math.sin(angle) * force;
          ch.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
          ch.style.color = "";
          ch.classList.add("is-near");
        } else if (ch.classList.contains("is-near")) {
          ch.style.transform = "";
          ch.classList.remove("is-near");
        }
      });
    };

    const findMagnet = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return null;
      return el.closest(INTERACTIVE) as HTMLElement | null;
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) setVisible(true);

      const target = findMagnet(e.target);
      root.classList.toggle("is-hover", Boolean(target));
      root.classList.toggle("is-text", Boolean((e.target as Element)?.closest?.(".cursor-text, p, span, li")));

      if (target) {
        const r = target.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        magnetX = (cx - mx) * 0.22;
        magnetY = (cy - my) * 0.22;
      } else {
        magnetX = 0;
        magnetY = 0;
      }
    };

    const onDown = () => root.classList.add("is-down");
    const onUp = () => root.classList.remove("is-down");

    const tick = () => {
      if (enabled) {
        const tx = mx + magnetX;
        const ty = my + magnetY;
        dx += (tx - dx) * 0.9;
        dy += (ty - dy) * 0.9;
        rx += (tx - rx) * 0.26;
        ry += (ty - ry) * 0.26;
        dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        pushChars();
      }
      raf = window.requestAnimationFrame(tick);
    };

    const sync = () => {
      enabled = fine.matches && !reduced.matches;
      if (!enabled) {
        setVisible(false);
        document.querySelectorAll<HTMLElement>(".cursor-ch").forEach((ch) => {
          ch.style.transform = "";
          ch.classList.remove("is-near");
        });
      } else {
        splitTextNodes();
      }
      document.documentElement.classList.toggle("has-pro-cursor", enabled);
    };

    sync();
    // Re-split after intro reveals hero content
    const splitTimer = window.setTimeout(splitTextNodes, 1200);
    const splitTimer2 = window.setTimeout(splitTextNodes, 3500);

    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", () => setVisible(false));
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(splitTimer);
      window.clearTimeout(splitTimer2);
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("has-pro-cursor");
    };
  }, []);

  return (
    <div ref={rootRef} className="pro-cursor" aria-hidden="true">
      <span ref={ringRef} className="pro-cursor-ring" />
      <span ref={dotRef} className="pro-cursor-dot" />
    </div>
  );
}
