import { CAMPAIGN } from "@/lib/content";
import { SectionHead } from "./SectionHead";

export function Campaign() {
  return (
    <section id="experience" className="section section-campaign">
      <div className="wrap">
        <SectionHead num="03" code="CAMPAIGN" plain="Experience" />

        <ol className="acts">
          {CAMPAIGN.map((act, n) => (
            <li key={act.title} className="act" data-fx data-active={act.active}>
              <div className="act-rail" aria-hidden>
                <span>{String(CAMPAIGN.length - n).padStart(2, "0")}</span>
              </div>
              <div className="act-card">
                <div className="act-head">
                  <div>
                    <h3>{act.title}</h3>
                    <p className="act-place">{act.place}</p>
                  </div>
                  <div className="act-status">
                    <b>{act.active ? "Active" : "Complete"}</b>
                    <span>{act.period}</span>
                  </div>
                </div>

                {act.link && (
                  <a href={act.link.href} target="_blank" rel="noreferrer" className="act-link">
                    {act.link.label}
                  </a>
                )}

                <p className="act-sub">Objectives</p>
                <ul className="objectives">
                  {act.objectives.map((objective, i) => (
                    <li key={objective} style={{ "--i": i } as React.CSSProperties}>
                      <svg viewBox="0 0 20 20" aria-hidden>
                        <rect x="1.5" y="1.5" width="17" height="17" />
                        <path d="M5 10.5l3.4 3.4L15.2 6.5" pathLength={1} />
                      </svg>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>

                <ul className="tags">
                  {act.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
