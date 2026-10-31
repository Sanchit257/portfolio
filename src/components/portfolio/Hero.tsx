import { CONSULTING_URL, RESUME_URL, ROLE_LINE, SECTIONS } from "@/lib/content";
import { MenuList } from "./MenuList";
import { OperatorCard } from "./OperatorCard";

export function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg" aria-hidden>
        <div className="hero-topo" />
        <div className="hero-smoke" />
      </div>
      <OperatorCard />

      <div className="hero-content">
        <p className="hero-eyebrow hero-a" style={{ "--i": 0 } as React.CSSProperties}>
          <i aria-hidden /> Operator / Callsign White Hat
        </p>

        <h1 className="hero-name">
          <span className="hero-a-name" style={{ "--i": 1 } as React.CSSProperties}>
            Sanchit
          </span>
          <span className="hero-a-name" style={{ "--i": 2 } as React.CSSProperties}>
            Kaushik
          </span>
        </h1>

        <p className="hero-role hero-a" style={{ "--i": 4 } as React.CSSProperties}>
          {ROLE_LINE}
        </p>

        <MenuList sections={SECTIONS.slice(1)} />

        <div className="hero-cta hero-a" style={{ "--i": 12 } as React.CSSProperties}>
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-tracer">
            Resume
          </a>
          <a href={CONSULTING_URL} target="_blank" rel="noreferrer" className="btn-ghost">
            My free consulting service
          </a>
          <p className="hero-cue">
            Scroll or swipe <span aria-hidden>▸▸▸</span>
          </p>
        </div>
      </div>

      <p className="hero-hints hero-a" style={{ "--i": 14 } as React.CSSProperties}>
        <span><kbd>N</kbd> Night vision</span>
        <span><kbd>M</kbd> Sound</span>
        <span><kbd>ESC</kbd> Menu</span>
      </p>
    </section>
  );
}
