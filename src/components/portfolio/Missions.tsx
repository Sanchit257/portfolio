"use client";

import { useState } from "react";
import { GITHUB_URL, HOME_LAB } from "@/lib/content";
import { playSfx } from "@/lib/sfx";
import { GithubIcon } from "./BrandIcons";
import { SectionHead } from "./SectionHead";

const ROUTE = HOME_LAB.sites.slice()
  .reverse()
  .map((site, i) => `${i === 0 ? "M" : "L"}${site.x} ${site.y}`)
  .join(" ");

export function Missions() {
  const [selected, setSelected] = useState(HOME_LAB.sites[0].id);

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
            <div className="map-pins">
              {HOME_LAB.sites.map((site, i) => (
                <button
                  key={site.id}
                  type="button"
                  aria-pressed={selected === site.id}
                  aria-label={`Highlight ${site.label}`}
                  className="pin"
                  style={{ "--x": `${site.x}%`, "--y": `${site.y}%`, "--i": i } as React.CSSProperties}
                  onClick={() => {
                    setSelected(site.id);
                    playSfx("select");
                  }}
                >
                  <span className="pin-mark" aria-hidden>
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="pin-label">
                    <b>{`SITE ${String(i + 1).padStart(2, "0")}`}</b>
                    {site.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="map-note" aria-hidden>Select a site</p>
          </div>

          <article className="brief">
            <p className="brief-op">Active operation</p>
            <h3>{HOME_LAB.title}</h3>
            <dl className="brief-meta">
              <div>
                <dt>Date</dt>
                <dd>{HOME_LAB.date}</dd>
              </div>
              <div>
                <dt>Assets</dt>
                <dd>{HOME_LAB.tech}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd className="is-green">Operational</dd>
              </div>
            </dl>
            <ol className="brief-steps">
              {HOME_LAB.sites.map((site, i) => (
                <li
                  key={site.id}
                  data-on={selected === site.id}
                  style={{ "--i": i } as React.CSSProperties}
                  onMouseEnter={() => setSelected(site.id)}
                >
                  {site.text}
                </li>
              ))}
            </ol>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn-tracer brief-link">
              <GithubIcon /> Access data
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
