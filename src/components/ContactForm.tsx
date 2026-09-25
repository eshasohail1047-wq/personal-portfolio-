"use client";

import { useState, type FormEvent } from "react";

const KINDS = [
  "Web app",
  "Frontend UI",
  "Backend / data",
  "Game",
  "Not sure yet",
] as const;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState<string>(KINDS[0]);
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = `Hi Esha, I'm ${name} (${email}). I need help with: ${kind}. ${message}`;
    const url = `https://wa.me/923707133664?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={onSubmit} className="contact-form grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="contact-field-label">Name</span>
          <input
            className="field"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="contact-field-label">Email</span>
          <input
            className="field"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm">
        <span className="contact-field-label">Project type</span>
        <select
          className="field"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          {KINDS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm">
        <span className="contact-field-label">Message</span>
        <textarea
          className="field min-h-32 resize-y"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="A short note about the idea is enough."
        />
      </label>

      <button type="submit" className="btn-grad contact-submit w-fit">
        Send via WhatsApp
      </button>
    </form>
  );
}
