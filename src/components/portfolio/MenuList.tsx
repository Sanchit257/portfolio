"use client";

import type { KeyboardEvent } from "react";
import { playSfx } from "@/lib/sfx";

type Item = { id: string; code: string; plain: string; intel: string };

/** Game-style main menu. Up and down arrows move between entries. */
export function MenuList({ sections }: { sections: readonly Item[] }) {
  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(e.currentTarget.querySelectorAll("a"));
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (at === -1) return;
    e.preventDefault();
    const step = e.key === "ArrowDown" ? 1 : -1;
    links[(at + step + links.length) % links.length].focus();
    playSfx("select");
  };

  return (
    <nav aria-label="Sections">
      <ul className="menu" onKeyDown={onKeyDown}>
        {sections.map((section, i) => (
          <li
            key={section.id}
            className="hero-a"
            style={{ "--i": 5 + i } as React.CSSProperties}
          >
            <a href={`#${section.id}`} onMouseEnter={() => playSfx("select")}>
              <span className="menu-code">{section.code}</span>
              <span className="menu-plain">{section.plain}</span>
              <span className="menu-intel">{section.intel}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
