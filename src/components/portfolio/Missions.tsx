"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { MISSIONS } from "@/lib/content";
import { playSfx } from "@/lib/sfx";
import { GithubIcon } from "./BrandIcons";
import { SectionHead } from "./SectionHead";

const ROUTE = MISSIONS.slice()
  .reverse()
  .map((m, i) => `${i === 0 ? "M" : "L"}${m.x} ${m.y}`)
  .join(" ");

export function Missions() {
  const [selected, setSelected] = useState(MISSIONS[0].id);

  const select = (id: string) => {
    setSelected(id);
    playSfx("select");
  };

  // The loadout's "Field-tested" links jump here and pick their mission.
  useEffect(() => {
    const onSelect = (e: Event) => setSelected((e as CustomEvent<string>).detail);
    window.addEventListener("mission:select", onSelect);
    return () => window.removeEventListener("mission:select", onSelect);
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const forward = e.key === "ArrowRight" || e.key === "ArrowDown";
    const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (!forward && !back) return;
    e.preventDefault();
    const at = MISSIONS.findIndex((m) => m.id === selected);
    const next = MISSIONS[(at + (forward ? 1 : -1) + MISSIONS.length) % MISSIONS.length].id;
    select(next);
    e.currentTarget.querySelector<HTMLElement>(`#pin-${next}`)?.focus();
  };

  return (
    <section id="projects" className="section section-missions">
      <div className="wrap wrap-wide">
        <SectionHead num="04" code="MISSIONS" plain="Projects" align="right" />

        <div className="ops">
          <div className="map" data-fx>
            <div className="map-topo" aria-hidden />
            <div className="map-grid" aria-hidden />
            <svg className="map-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <path d={ROUTE} pathLength={1} />
            </svg>
            <div className="map-scan" aria-hidden />
            <div className="map-pins" role="tablist" aria-label="Projects" aria-orientation="vertical" onKeyDown={onKeyDown}>
              {MISSIONS.map((mission, i) => (
                <button
                  key={mission.id}
                  id={`pin-${mission.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected === mission.id}
                  aria-controls={`brief-${mission.id}`}
                  aria-label={`Operation ${mission.op}: ${mission.title}`}
                  tabIndex={selected === mission.id ? 0 : -1}
                  className="pin"
                  style={{ "--x": `${mission.x}%`, "--y": `${mission.y}%`, "--i": i } as React.CSSProperties}
                  onClick={() => select(mission.id)}
                >
                  <span className="pin-mark" aria-hidden>
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="pin-label">
                    <b>{`OP ${String(i + 1).padStart(2, "0")}`}</b>
                    {mission.op}
                  </span>
                </button>
              ))}
            </div>
            <p className="map-note" aria-hidden>Select an operation</p>
          </div>

          <div className="briefs">
            {MISSIONS.map((mission) => (
              <article
                key={mission.id}
                id={`brief-${mission.id}`}
                role="tabpanel"
                aria-labelledby={`pin-${mission.id}`}
                hidden={selected !== mission.id}
                className="brief"
              >
                <p className="brief-op">Operation {mission.op}</p>
                <h3>{mission.title}</h3>
                <dl className="brief-meta">
                  <div>
                    <dt>Date</dt>
                    <dd>{mission.date}</dd>
                  </div>
                  <div>
                    <dt>Assets</dt>
                    <dd>{mission.tech}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd className="is-green">Operational</dd>
                  </div>
                </dl>
                <ol className="brief-steps">
                  {mission.desc.map((line, i) => (
                    <li key={line.slice(0, 32)} style={{ "--i": i } as React.CSSProperties}>
                      {line}
                    </li>
                  ))}
                </ol>
                {mission.githubUrl && (
                  <a href={mission.githubUrl} target="_blank" rel="noreferrer" className="btn-tracer brief-link">
                    <GithubIcon /> Access data
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
