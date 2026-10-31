import { CONSULTING_URL, RESUME_URL, SCOREBOARD } from "@/lib/content";

export function Scoreboard() {
  return (
    <section className="scoreboard" aria-labelledby="score-title">
      <div className="wrap">
        <div className="score-card" data-fx>
          <p className="score-kicker">Mission complete</p>
          <h2 id="score-title">Match summary</h2>
          <dl className="score-grid">
            {SCOREBOARD.map((row, i) => (
              <div key={row.label} style={{ "--i": i } as React.CSSProperties}>
                <dd>{row.value}</dd>
                <dt>{row.label}</dt>
              </div>
            ))}
          </dl>
          <div className="score-actions">
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-tracer">
              Resume
            </a>
            <a href={CONSULTING_URL} target="_blank" rel="noreferrer" className="btn-ghost">
              My free consulting service
            </a>
            <a href="#hero" className="btn-ghost">
              Play again
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
