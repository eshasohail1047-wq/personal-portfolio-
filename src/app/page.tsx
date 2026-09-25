"use client";

import { useCallback, useEffect, useState } from "react";
import ContactForm from "@/components/ContactForm";
import CursorFollower from "@/components/CursorFollower";
import FaqStack from "@/components/FaqStack";
import FloatingNav, { NAV_LINKS } from "@/components/FloatingNav";
import GradientBlobs from "@/components/GradientBlobs";
import HelloIntro from "@/components/HelloIntro";
import HeroAtmosphere from "@/components/HeroAtmosphere";
import ProcessStack, { type ProcessStep } from "@/components/ProcessStack";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ServicesStack from "@/components/ServicesStack";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";

const WHATSAPP =
  "https://wa.me/923707133664?text=Hi%20Esha%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20work%20with%20you.";

const HERO_TICKER = [
  "Clean Code",
  "Modern UI",
  "Fast Performance",
  "User Focused",
  "Full Stack",
  "Ship Ready",
] as const;

const SERVICES = [
  {
    title: "Full-stack Development",
    tag: "Full Stack",
    body: "Complete web applications with a smooth frontend, backend, and database.",
    techs: ["Next.js", "PHP", "MySQL"],
  },
  {
    title: "Frontend & UI",
    tag: "Frontend",
    body: "Clean, responsive interfaces with sharp interactions and purposeful motion.",
    techs: ["React", "Next.js", "UI"],
  },
  {
    title: "Backend & Database",
    tag: "Backend",
    body: "Structured APIs, authentication, data that stays, and reliable application logic.",
    techs: ["PHP", "MySQL", "APIs"],
  },
  {
    title: "Interactive Experiences",
    tag: "Interactive",
    body: "Engaging interactive builds with animation, game logic, and real-time feedback.",
    techs: ["Godot", "C#", "Interaction"],
  },
] as const;

type ProjectKind = "Web Application" | "Game";

const PROJECTS: {
  title: string;
  kind: ProjectKind;
  oneLiner: string;
  problem?: string;
  approach?: string;
  detail?: string;
  stack: string[];
  github?: string;
  live?: string;
  image: string;
  art: string;
}[] = [
  {
    title: "Smart Route Planner",
    kind: "Web Application",
    oneLiner: "Find the shortest — and the faster — path across a live map.",
    problem:
      "People need both the shortest line and the route that actually gets them there sooner.",
    approach: "Leaflet map that compares shortest vs fastest paths in the browser.",
    stack: ["HTML", "CSS", "JavaScript", "Leaflet"],
    github: "https://github.com/eshasohail1047-wq/Shortest-and-fastest-route-planner-",
    live: "https://shortest-and-fastest-route-planner.vercel.app",
    image: "/projects/route-planner.jpg",
    art: "linear-gradient(135deg, #7c5cff, #3d1a8a 50%, #dff26a)",
  },
  {
    title: "Smart Nutrition Planner",
    kind: "Web Application",
    oneLiner: "A meal plan that remembers you — not a static PDF of macros.",
    detail: "PHP and MySQL app that stores personal meal plans.",
    stack: ["HTML", "CSS", "PHP", "MySQL"],
    image: "/projects/nutrition-planner.jpg",
    art: "linear-gradient(135deg, #c4b5fd, #5b2fd6 45%, #9ae66e)",
  },
  {
    title: "Zombie Arena",
    kind: "Game",
    oneLiner: "A Godot arena where you last as long as your aim and nerve.",
    detail: "Real-time arena built with Godot + C#.",
    stack: ["Godot", "C#"],
    image: "/projects/zombie-arena.jpg",
    art: "linear-gradient(135deg, #dff26a, #6d28d9 48%, #a78bfa)",
  },
];

const SKILLS = [
  { name: "HTML", mark: "5", line: "The bones of every page." },
  { name: "CSS", mark: "#", line: "Layout, type, and motion." },
  { name: "JavaScript", mark: "JS", line: "The behavior people feel." },
  { name: "React", mark: "R", line: "Interfaces that stay in sync." },
  { name: "Next.js", mark: "N", line: "Products that ship on the web." },
  { name: "PHP", mark: "P", line: "Server logic that holds up." },
  { name: "MySQL", mark: "QL", line: "Data the product remembers." },
  { name: "Leaflet", mark: "L", line: "Maps that stay honest." },
  { name: "Godot", mark: "G", line: "Play, tension, real-time." },
  { name: "C#", mark: "C#", line: "Game logic inside Godot." },
] as const;

const BUILD_STEPS: readonly ProcessStep[] = [
  {
    num: "01",
    title: "Hear the idea",
    body: "You tell me what people should be able to do. I don’t start in Figma — I start with the job.",
  },
  {
    num: "02",
    title: "Draw the route",
    body: "Screens, data, motion. Same instinct as a map: shortest path that still feels right.",
  },
  {
    num: "03",
    title: "Build the real thing",
    body: "Web when it needs a product. PHP and MySQL when it needs memory. Godot when it needs to play.",
  },
  {
    num: "04",
    title: "Hand it over",
    body: "You get something you can open, click, and show — not a moodboard.",
  },
];

const FAQS = [
  {
    q: "What kind of work do you create?",
    a: "Full stack web apps, interfaces, PHP/MySQL backends, and interactive Godot builds. If the idea needs a screen people can use, I can take it from sketch to shipped.",
  },
  {
    q: "Do you design only, or do you build too?",
    a: "Both. I design interfaces and ship the real product — Route Planner and Nutrition Planner are web builds; Zombie Arena is Godot / C#.",
  },
  {
    q: "What services do you offer?",
    a: "Full stack apps, frontend UI, PHP/MySQL backends, and interactive game / Godot work. Start with the idea; I’ll map the route.",
  },
  {
    q: "How do I start a project?",
    a: "Use the form at the bottom, or tap Let’s Collaborate to message me on WhatsApp. A short note about the idea is enough.",
  },
  {
    q: "Are you available for hire?",
    a: "Yes. I’m taking on product work — web, data, and interactive pieces. If it is still in your head, write anyway.",
  },
] as const;

export default function HomePage() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  const [filter, setFilter] = useState<"All" | ProjectKind>("All");

  useEffect(() => {
    // Safety: never leave hero invisible if intro stalls
    const failSafe = window.setTimeout(() => setReady(true), 4500);
    return () => window.clearTimeout(failSafe);
  }, []);

  const finishIntro = useCallback(() => setReady(true), []);

  const filtered =
    filter === "All"
      ? PROJECTS
      : PROJECTS.filter((project) => project.kind === filter);

  return (
    <div className="site-shell">
      <CursorFollower />
      <GradientBlobs />
      <HelloIntro onComplete={finishIntro} />

      <FloatingNav
        menuOpen={menuOpen}
        onMenuToggle={toggleMenu}
        onMenuClose={closeMenu}
      />

      <main className="relative z-10">
        {/* HERO — full-bleed photo; left copy + small floating glass cards + slim ticker */}
        <section id="top" className={`hero-mq${ready ? " is-ready" : ""}`}>
          <HeroAtmosphere />

          <div className="hero-mq-body">
            <div className="hero-mq-copy">
              <p className="hero-mq-tag">
                SOFTWARE ENGINEER{" "}
                <span className="hero-mq-tag-x">×</span> CREATIVE THINKER
              </p>
              <h1 className="hero-mq-name">
                Esha <span>Sohail</span>
              </h1>
              <p className="hero-mq-bio">
                I build modern, user-friendly web applications that turn ideas
                into real digital experiences.
              </p>
              <div className="hero-mq-actions">
                <a href="#projects" className="btn-hero-primary">
                  View My Work
                  <span aria-hidden="true">→</span>
                </a>
                <a href="#about" className="btn-hero-play">
                  <span className="btn-hero-play-ico" aria-hidden="true">
                    ▶
                  </span>
                  Watch Intro
                </a>
              </div>
            </div>
          </div>

          <div className="hero-ticker" aria-hidden="true">
            <div className="hero-ticker-track">
              {[...HERO_TICKER, ...HERO_TICKER].map((text, i) => (
                <span key={`${text}-${i}`} className="hero-ticker-item">
                  {text}
                  <span className="hero-ticker-dot" />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT — process flight + short bio glass (former How I Build) */}
        <section id="about" className="section-pad section-process">
          <div className="section-inner process-wrap">
            <ProcessStack steps={BUILD_STEPS} />
          </div>
        </section>

        {/* SERVICES — sticky stacking cards */}
        <section id="services" className="section-pad section-services">
          <div className="section-inner services-wrap">
            <SectionHeading
              className="services-head"
              accent="services"
              lead={
                <p className="services-lead">
                  Scroll — each card locks into the row, left to right.
                </p>
              }
            >
              Our Services
            </SectionHeading>
            <ServicesStack services={SERVICES} />
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section-pad">
          <div className="section-inner">
            <SectionHeading kicker="Work" accent="projects">
              Recent Projects
            </SectionHeading>

            <div className="filter-row">
              {(["All", "Web Application", "Game"] as const).map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className={`filter-chip${filter === chip ? " is-active" : ""}`}
                  onClick={() => setFilter(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="projects-grid">
              {filtered.map((project, i) => (
                <Reveal
                  key={project.title}
                  delay={i * 70}
                  as="article"
                  className="project-card"
                >
                  <div className="project-card-inner">
                    <div
                      className="project-art"
                      style={{ ["--art" as string]: project.art }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt=""
                        className="project-art-img"
                      />
                      <span className="project-art-kind">{project.kind}</span>
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-line">{project.oneLiner}</p>
                    {project.problem ? (
                      <p className="project-detail">
                        <span>Problem: </span>
                        {project.problem}
                      </p>
                    ) : null}
                    {project.approach ? (
                      <p className="project-detail">
                        <span>Approach: </span>
                        {project.approach}
                      </p>
                    ) : null}
                    {project.detail ? (
                      <p className="project-detail">{project.detail}</p>
                    ) : null}
                    <div className="project-stack">
                      {project.stack.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                    <div className="project-actions">
                      {project.live ? (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-lime btn-sm"
                        >
                          Live
                        </a>
                      ) : null}
                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ghost btn-sm"
                        >
                          GitHub
                        </a>
                      ) : (
                        <a href="#contact" className="btn-ghost btn-sm">
                          Ask demo
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="section-pad">
          <div className="section-inner">
            <SectionHeading kicker="Voices" accent="testimonials">
              What people <span className="sec-head-em">say</span>
            </SectionHeading>
            <TestimonialsMarquee />
          </div>
        </section>

        {/* FAQ — sticky stacking questions */}
        <section id="faq" className="section-pad section-faq">
          <div className="section-inner faq-wrap">
            <FaqStack faqs={FAQS} />
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section-pad section-contact">
          <div className="contact-ambient" aria-hidden="true">
            <span className="contact-ambient-orb contact-ambient-orb--a" />
            <span className="contact-ambient-orb contact-ambient-orb--b" />
          </div>
          <div className="section-inner contact-grid">
            <Reveal className="contact-copy">
              <SectionHeading
                kicker="Contact"
                accent="contact"
                lead={
                  <p className="contact-lede">
                    A short note is enough. Submit the form and WhatsApp opens
                    with your hello already written.
                  </p>
                }
              >
                Have a project in mind
              </SectionHeading>
              <div className="contact-links">
                <a href="mailto:eshasohail1047@gmail.com">
                  eshasohail1047@gmail.com
                </a>
                <a
                  href="https://github.com/eshasohail1047-wq"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/eshasohail1047-wq
                </a>
                <a href={WHATSAPP} target="_blank" rel="noreferrer">
                  WhatsApp +92 370 7133664
                </a>
              </div>
            </Reveal>
            <Reveal delay={120} className="contact-panel">
              <div className="contact-card">
                <div className="contact-card-glow" aria-hidden="true" />
                <h3 className="contact-card-title">Request a proposal</h3>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div className="footer-brand-block">
                <p className="footer-brand">
                  <span className="site-brand-mark" aria-hidden="true">
                    ✦
                  </span>
                  Esha Sohail
                </p>
                <p className="footer-tag">
                  AI-powered full stack developer. Clean code. Clear
                  interface. Building products that ship fast and feel
                  considered.
                </p>
              </div>
              <div className="footer-cols">
                <nav aria-label="Footer">
                  <p className="footer-col-label">Navigate</p>
                  {NAV_LINKS.map((link) => (
                    <a key={link.id} href={link.href}>
                      {link.label}
                    </a>
                  ))}
                  <a href="/#contact">Contact</a>
                </nav>
                <div>
                  <p className="footer-col-label">Contact</p>
                  <a href="mailto:eshasohail1047@gmail.com">
                    eshasohail1047@gmail.com
                  </a>
                  <a href={WHATSAPP} target="_blank" rel="noreferrer">
                    WhatsApp +92 370 7133664
                  </a>
                </div>
                <div>
                  <p className="footer-col-label">Social</p>
                  <a
                    href="https://github.com/eshasohail1047-wq"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
            <p className="footer-giant" aria-hidden="true">
              ESHA
            </p>
            <div className="footer-bottom">
              <p className="footer-copy">
                © {new Date().getFullYear()} Esha Sohail. All rights reserved.
              </p>
              <a href="/#top" className="footer-top-link">
                Back to top
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
