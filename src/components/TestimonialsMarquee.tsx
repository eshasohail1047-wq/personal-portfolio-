const TESTIMONIALS = [
  {
    name: "Hassan K.",
    context: "Used Smart Route Planner",
    quote:
      "Comparing shortest vs fastest on a live map finally made sense. I picked the route that actually got me there sooner.",
  },
  {
    name: "Nadia F.",
    context: "Tried Smart Nutrition Planner",
    quote:
      "My meal plan stayed saved when I came back. Feels like a real product, not a one-off macro calculator.",
  },
  {
    name: "Omar T.",
    context: "Playtested Zombie Arena",
    quote:
      "Tight arena loop — die, laugh, jump back in. Aim and nerve matter more than fancy menus.",
  },
  {
    name: "Fatima Z.",
    context: "Web / full-stack collab",
    quote:
      "Esha ships the whole stack: UI that reads clean and a backend that still remembers users next week.",
  },
  {
    name: "Rayan L.",
    context: "AI-powered build",
    quote:
      "She turns vague AI ideas into something you can click. Fast iteration without losing the product feel.",
  },
  {
    name: "Mehreen A.",
    context: "Tried Smart Route Planner",
    quote:
      "Leaflet paths that stay honest. I showed it to my team and we stopped arguing about which line was ‘faster.’",
  },
] as const;

export default function TestimonialsMarquee() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="quotes-marquee" aria-label="Client and user reviews">
      <div className="quotes-marquee-track">
        {loop.map((t, i) => (
          <blockquote
            key={`${t.name}-${i}`}
            className="quote-card quote-card--marquee"
            aria-hidden={i >= TESTIMONIALS.length ? true : undefined}
          >
            <p className="quote-text">“{t.quote}”</p>
            <footer className="quote-foot">
              <p className="quote-name">{t.name}</p>
              <p className="quote-ctx">{t.context}</p>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
