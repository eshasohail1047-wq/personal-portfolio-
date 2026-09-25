"use client";

/**
 * Hero stage visual — vertical light beams, orbit badge, floating chips.
 * Matches the Dribbble Launch reference motion language.
 */
export default function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hv-beams">
        <span className="hv-beam hv-beam-a" />
        <span className="hv-beam hv-beam-b" />
        <span className="hv-beam hv-beam-c" />
        <span className="hv-beam hv-beam-d" />
        <span className="hv-beam hv-beam-e" />
      </div>

      <div className="hv-orbit">
        <div className="hv-orbit-ring">
          <svg viewBox="0 0 200 200" className="hv-orbit-svg">
            <defs>
              <path
                id="hv-circle"
                d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
              />
            </defs>
            <text className="hv-orbit-text">
              <textPath href="#hv-circle" startOffset="0%">
                AI + CODE · SHIP FAST · BUILD REAL · AI + CODE · SHIP FAST ·
              </textPath>
            </text>
          </svg>
        </div>
        <div className="hv-orbit-core">
          <span>ES</span>
        </div>
      </div>

      <div className="hv-stat hv-stat-l">
        <strong>10+</strong>
        <span>Stack tools</span>
      </div>
      <div className="hv-stat hv-stat-r">
        <strong>3</strong>
        <span>Shipped builds</span>
      </div>

      <span className="hv-spark hv-spark-1" />
      <span className="hv-spark hv-spark-2" />
      <span className="hv-spark hv-spark-3" />
      <span className="hv-spark hv-spark-4" />
    </div>
  );
}
