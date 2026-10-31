"use client";

import { useEffect } from "react";

const DURATION_MS = 3400;

/** Satellite-zoom cold open. Shown once a session; any key or click skips it. */
export function ColdOpen() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("intro")) return;

    const end = () => {
      root.classList.remove("intro");
      try {
        sessionStorage.setItem("sk-intro", "1");
      } catch {}
      window.clearTimeout(timer);
      window.removeEventListener("keydown", end);
      window.removeEventListener("pointerdown", end);
    };
    const timer = window.setTimeout(end, DURATION_MS);
    window.addEventListener("keydown", end);
    window.addEventListener("pointerdown", end);
    return end;
  }, []);

  return (
    <div className="cold-open" aria-hidden>
      <div className="cold-topo" />
      <div className="cold-grid" />
      <div className="cold-lock">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="cold-lines">
        <p style={{ "--n": 24, "--d": "0.2s" } as React.CSSProperties}>
          OPERATOR: SANCHIT KAUSHIK
        </p>
        <p style={{ "--n": 18, "--d": "1s" } as React.CSSProperties}>
          CYPRESS, CALIFORNIA
        </p>
        <p style={{ "--n": 19, "--d": "1.7s" } as React.CSSProperties}>
          33.82°N / 118.04°W
        </p>
      </div>
      <p className="cold-skip">[ ANY KEY ] SKIP</p>
    </div>
  );
}
