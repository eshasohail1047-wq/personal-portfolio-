"use client";

import { useEffect, useRef, useState } from "react";

const WORD = "HELLO";
const START_DELAY_MS = 150;
const TYPE_MS = 145;
const HOLD_MS = 1000;
const SWEEP_MS = 1800;
const FADE_MS = 400;
const TICK_GAIN = 0.6;

type Phase = "typing" | "hold" | "sweep" | "fade" | "done";

type HelloIntroProps = {
  onComplete: () => void;
};

function createAudioContext(): AudioContext | null {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    return new AC();
  } catch {
    return null;
  }
}

/** Crisp keyboard click — noise burst + sharp transient. */
function buildClickBuffer(ctx: AudioContext): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * 0.06);
  const buf = ctx.createBuffer(1, len, sr);
  const data = buf.getChannelData(0);

  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const attack = t < 0.01 ? t / 0.01 : 1;
    const env = Math.exp(-t * 90) * attack;
    const noise = (Math.random() * 2 - 1) * 0.9;
    const ping = Math.sin(2 * Math.PI * (1600 + Math.random() * 500) * t) * 0.5;
    data[i] = (noise * 0.75 + ping * 0.5) * env;
  }
  return buf;
}

function playBufferClick(ctx: AudioContext, buffer: AudioBuffer, rate = 1) {
  if (ctx.state !== "running") return false;
  try {
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    src.buffer = buffer;
    src.playbackRate.value = rate;

    filter.type = "bandpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.7;

    const t = ctx.currentTime;
    gain.gain.setValueAtTime(TICK_GAIN, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.075);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
    src.stop(t + 0.085);
    return true;
  } catch {
    return false;
  }
}

export default function HelloIntro({ onComplete }: HelloIntroProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const audioRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const visibleRef = useRef(0);
  const playedRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let cancelled = false;
    let resumeLoop: number | null = null;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setPhase("done");
      onComplete();
      if (resumeLoop != null) window.clearInterval(resumeLoop);
      void audioRef.current?.close().catch(() => undefined);
      audioRef.current = null;
    };

    if (reduced) {
      setVisibleCount(WORD.length);
      setPhase("sweep");
      timers.push(window.setTimeout(finish, 100));
      return () => {
        cancelled = true;
        timers.forEach((id) => window.clearTimeout(id));
      };
    }

    // Audio setup — NEVER blocks HELLO start
    const ctx = createAudioContext();
    audioRef.current = ctx;
    if (ctx) {
      bufferRef.current = buildClickBuffer(ctx);
      // Fire-and-forget — do NOT await (resume can hang until gesture)
      void ctx.resume().catch(() => undefined);
      resumeLoop = window.setInterval(() => {
        if (cancelled || !audioRef.current) return;
        if (audioRef.current.state === "suspended") {
          void audioRef.current.resume().catch(() => undefined);
        }
      }, 80);
    }

    const tickForIndex = (letterIndex: number) => {
      const audio = audioRef.current;
      const buffer = bufferRef.current;
      if (!audio || !buffer) return;
      const rate = 0.9 + Math.random() * 0.25;
      if (playBufferClick(audio, buffer, rate)) {
        playedRef.current = Math.max(playedRef.current, letterIndex + 1);
      }
    };

    const catchUpTicks = () => {
      const audio = audioRef.current;
      const buffer = bufferRef.current;
      if (!audio || !buffer || audio.state !== "running") return;
      for (let i = playedRef.current; i < visibleRef.current; i++) {
        const idx = i;
        window.setTimeout(() => {
          if (cancelled) return;
          playBufferClick(audio, buffer, 0.95 + Math.random() * 0.15);
        }, (idx - playedRef.current) * 40);
      }
      playedRef.current = visibleRef.current;
    };

    const unlockAudio = () => {
      const audio = audioRef.current;
      if (!audio) return;
      void audio.resume().then(catchUpTicks).catch(() => undefined);
    };

    window.addEventListener("pointerdown", unlockAudio, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchstart", unlockAudio, {
      capture: true,
      passive: true,
    });
    window.addEventListener("keydown", unlockAudio, { capture: true });

    // HELLO always auto-starts — no audio / gesture gate
    const startTyping = () => {
      if (cancelled) return;

      for (let i = 0; i < WORD.length; i++) {
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            visibleRef.current = i + 1;
            setVisibleCount(i + 1);
            tickForIndex(i);
          }, TYPE_MS * (i + 1)),
        );
      }

      const typedAt = TYPE_MS * WORD.length;

      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setPhase("hold");
        }, typedAt),
      );
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setPhase("sweep");
        }, typedAt + HOLD_MS),
      );
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setPhase("fade");
        }, typedAt + HOLD_MS + SWEEP_MS),
      );
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          finish();
        }, typedAt + HOLD_MS + SWEEP_MS + FADE_MS),
      );
    };

    timers.push(window.setTimeout(startTyping, START_DELAY_MS));

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      if (resumeLoop != null) window.clearInterval(resumeLoop);
      window.removeEventListener("pointerdown", unlockAudio, true);
      window.removeEventListener("touchstart", unlockAudio, true);
      window.removeEventListener("keydown", unlockAudio, true);
      void audioRef.current?.close().catch(() => undefined);
      audioRef.current = null;
    };
  }, [onComplete]);

  if (phase === "done") return null;

  const sweeping = phase === "sweep" || phase === "fade";
  const showWord = phase === "typing" || phase === "hold";

  return (
    <div
      className={[
        "hello-overlay",
        phase === "hold" ? "is-hold" : "",
        sweeping ? "is-sweeping" : "",
        phase === "fade" ? "is-fading" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div className="hello-silk" aria-hidden="true">
        <div className="hello-silk-glow" />
        <div className="hello-silk-fold hello-silk-fold-a" />
        <div className="hello-silk-fold hello-silk-fold-b" />
        <div className="hello-silk-fold hello-silk-fold-c" />
        <div className="hello-silk-fold hello-silk-fold-d" />
        <div className="hello-silk-sheen" />
        <div className="hello-silk-particles">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="hello-stage">
        {showWord ? (
          <p className="hello-word" aria-label="Hello">
            {WORD.split("").map((letter, i) => (
              <span
                key={`${letter}-${i}`}
                className={`hello-letter${i < visibleCount ? " is-typed" : ""}`}
              >
                {letter}
              </span>
            ))}
            <span
              className={`hello-caret${visibleCount >= WORD.length ? " is-done" : ""}`}
            />
          </p>
        ) : null}
      </div>
    </div>
  );
}
