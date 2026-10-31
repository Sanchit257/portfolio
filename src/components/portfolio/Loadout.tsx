"use client";

import { useState, type KeyboardEvent } from "react";
import { HOME_LAB, LOADOUT, type LoadoutItem } from "@/lib/content";
import { playSfx } from "@/lib/sfx";
import { SectionHead } from "./SectionHead";

function Blueprint({ slot }: { slot: string }) {
  return (
    <svg viewBox="0 0 240 240" className="bp" aria-hidden>
      <circle cx="120" cy="120" r="112" className="bp-faint" pathLength={1} />
      <circle cx="120" cy="120" r="84" className="bp-faint" pathLength={1} />
      {slot === "primary" && (
        <>
          <path d="M120 44 176 66v50c0 38-24 64-56 80-32-16-56-42-56-80V66Z" className="bp-line" pathLength={1} />
          <circle cx="120" cy="116" r="28" className="bp-line" pathLength={1} />
          <circle cx="120" cy="116" r="9" className="bp-hot" pathLength={1} />
          <path d="M120 74v26M120 132v26M78 116h26M136 116h26" className="bp-line" pathLength={1} />
        </>
      )}
      {slot === "secondary" && (
        <>
          <path d="M50 68h140a8 8 0 0 1 8 8v88a8 8 0 0 1-8 8H50a8 8 0 0 1-8-8V76a8 8 0 0 1 8-8Z" className="bp-line" pathLength={1} />
          <path d="M42 90h156" className="bp-line" pathLength={1} />
          <path d="M66 112l22 18-22 18" className="bp-hot" pathLength={1} />
          <path d="M100 150h46" className="bp-hot" pathLength={1} />
          <path d="M84 196h72M120 172v24" className="bp-line" pathLength={1} />
        </>
      )}
      {slot === "equipment" && (
        <>
          <path d="M60 52h120v40H60ZM60 100h120v40H60ZM60 148h120v40H60Z" className="bp-line" pathLength={1} />
          <path d="M76 72h34M76 120h34M76 168h34" className="bp-line" pathLength={1} />
          <circle cx="160" cy="72" r="6" className="bp-hot" pathLength={1} />
          <circle cx="160" cy="120" r="6" className="bp-hot" pathLength={1} />
          <circle cx="160" cy="168" r="6" className="bp-hot" pathLength={1} />
          <path d="M120 188v22M92 210h56" className="bp-line" pathLength={1} />
        </>
      )}
    </svg>
  );
}

function Attachment({ item, n, side }: { item: LoadoutItem; n: number; side: "l" | "r" }) {
  const style = { "--i": n } as React.CSSProperties;

  if (!item.lab) {
    return (
      <li className="att" data-side={side} style={style}>
        <span className="att-name">{item.name}</span>
      </li>
    );
  }
  return (
    <li className="att att-linked" data-side={side} style={style}>
      <a href="#projects">
        <span className="att-name">{item.name}</span>
        <small>Field-tested: {HOME_LAB.title}</small>
      </a>
    </li>
  );
}

export function Loadout() {
  const [tab, setTab] = useState(LOADOUT[0].id);

  const select = (id: string) => {
    setTab(id);
    playSfx("select");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const at = LOADOUT.findIndex((s) => s.id === tab);
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = LOADOUT[(at + step + LOADOUT.length) % LOADOUT.length].id;
    select(next);
    e.currentTarget.querySelector<HTMLElement>(`#slot-${next}`)?.focus();
  };

  return (
    <section id="skills" className="section section-loadout">
      <div className="bg-word" aria-hidden>ARSENAL</div>
      <div className="wrap">
        <SectionHead num="05" code="LOADOUT" plain="Skills" align="right" />

        <div className="slots" role="tablist" aria-label="Skill categories" onKeyDown={onKeyDown} data-fx>
          {LOADOUT.map((slot, i) => (
            <button
              key={slot.id}
              id={`slot-${slot.id}`}
              type="button"
              role="tab"
              aria-selected={tab === slot.id}
              aria-controls={`panel-${slot.id}`}
              tabIndex={tab === slot.id ? 0 : -1}
              className="slot"
              onClick={() => select(slot.id)}
            >
              <span className="slot-key">{i + 1}</span>
              <span className="slot-name">{slot.slot}</span>
              <span className="slot-plain">{slot.title}</span>
            </button>
          ))}
        </div>

        {LOADOUT.map((slot) => {
          const half = Math.ceil(slot.items.length / 2);
          const left = slot.items.slice(0, half);
          const right = slot.items.slice(half);
          return (
            <div
              key={slot.id}
              id={`panel-${slot.id}`}
              role="tabpanel"
              aria-labelledby={`slot-${slot.id}`}
              hidden={tab !== slot.id}
              className="bench"
            >
              <svg className="leaders" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                {left.map((_, i) => {
                  const y = ((i + 0.5) / left.length) * 100;
                  return (
                    <path
                      key={i}
                      pathLength={1}
                      style={{ "--i": i } as React.CSSProperties}
                      d={`M33 ${y} L36 ${y} L42 ${44 + (i / Math.max(left.length - 1, 1)) * 12}`}
                    />
                  );
                })}
                {right.map((_, i) => {
                  const y = ((i + 0.5) / right.length) * 100;
                  return (
                    <path
                      key={i}
                      pathLength={1}
                      style={{ "--i": i + half } as React.CSSProperties}
                      d={`M67 ${y} L64 ${y} L58 ${44 + (i / Math.max(right.length - 1, 1)) * 12}`}
                    />
                  );
                })}
              </svg>
              <ul className="att-col" style={{ "--rows": left.length } as React.CSSProperties}>
                {left.map((item, i) => (
                  <Attachment key={item.name} item={item} n={i} side="l" />
                ))}
              </ul>
              <div className="bench-core">
                <Blueprint slot={slot.id} />
                <p>{slot.title}</p>
              </div>
              <ul className="att-col" style={{ "--rows": right.length } as React.CSSProperties}>
                {right.map((item, i) => (
                  <Attachment key={item.name} item={item} n={i + half} side="r" />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
