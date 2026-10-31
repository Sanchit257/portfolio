"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { RANKS, RESUME_URL, SECTIONS } from "@/lib/content";
import { playSfx, sfxEnabled, subscribeSfx, toggleSfx } from "@/lib/sfx";

const PX_PER_DEG = 5;
const DEG_PER_SECTION = 45;
const MAG_SIZE = 30;

const TICKS = Array.from({ length: 81 }, (_, i) => i * 5 - 20);

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return Boolean(el?.closest?.("input, textarea, select"));
}

export function Hud() {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState(0);
  const [toast, setToast] = useState<{ key: number; label: string; rank: string } | null>(null);
  const [nvg, setNvg] = useState(false);
  const sound = useSyncExternalStore(subscribeSfx, sfxEnabled, () => false);

  const strip = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLSpanElement>(null);
  const ammo = useRef<HTMLSpanElement>(null);
  const mag = useRef<HTMLDivElement>(null);
  const player = useRef<SVGGElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const pause = useRef<HTMLDialogElement>(null);
  const seen = useRef(new Set<number>([0]));

  // One rAF-throttled scroll pass drives the compass, radar, ammo and XP bar.
  useEffect(() => {
    const root = document.documentElement;
    const rail = document.getElementById("rail");
    const els = SECTIONS.map((s) => document.getElementById(s.id));
    let queued = false;
    let current = -1;

    const update = () => {
      queued = false;
      const probe = window.innerWidth * 0.4;
      let idx = 0;
      let frac = 0;
      els.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.left <= probe) {
          idx = i;
          frac = Math.min(1, (probe - rect.left) / Math.max(rect.width, 1));
        }
      });

      const deg = DEG_PER_SECTION * (idx + frac);
      const max = rail ? rail.scrollWidth - rail.clientWidth : 0;
      const progress = rail && max > 0 ? Math.min(1, rail.scrollLeft / max) : 0;
      const rounds = Math.round(MAG_SIZE * (1 - progress));

      if (strip.current) {
        strip.current.style.transform = `translate3d(${(-(deg + 20) * PX_PER_DEG).toFixed(1)}px, 0, 0)`;
      }
      if (heading.current) {
        heading.current.textContent = `${String(Math.round(deg) % 360).padStart(3, "0")}°`;
      }
      if (ammo.current) ammo.current.textContent = String(rounds);
      if (mag.current) mag.current.style.setProperty("--rounds", String(rounds));
      if (player.current) player.current.style.transform = `rotate(${deg}deg)`;
      root.style.setProperty("--scroll", progress.toFixed(4));
      if (hud.current) hud.current.dataset.empty = rounds === 0 ? "true" : "false";

      if (idx !== current) {
        current = idx;
        setActive(idx);
        if (!seen.current.has(idx)) {
          seen.current.add(idx);
          const count = seen.current.size - 1;
          setVisited(count);
          setToast({
            key: idx,
            label: SECTIONS[idx].code,
            rank: RANKS[Math.min(count, RANKS.length - 1)],
          });
          playSfx("xp");
        }
      }
    };

    const request = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    update();
    rail?.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      rail?.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2100);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggleNvg = useCallback(() => {
    setNvg((on) => {
      document.documentElement.classList.toggle("nvg", !on);
      return !on;
    });
    playSfx("select");
  }, []);

  const reload = useCallback(() => {
    document.documentElement.classList.add("reloading");
    window.setTimeout(
      () => document.documentElement.classList.remove("reloading"),
      700,
    );
    window.dispatchEvent(new CustomEvent("rail:go", { detail: 0 }));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const key = e.key.toLowerCase();
      if (key === "escape") {
        if (!pause.current?.open) {
          pause.current?.showModal();
          playSfx("select");
        }
      } else if (key === "n") {
        toggleNvg();
      } else if (key === "m") {
        toggleSfx();
      } else if (key === "r") {
        reload();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reload, toggleNvg]);

  const pastHero = active > 0;

  return (
    <div ref={hud} className="hud" data-past={pastHero}>
      <header className="hud-top">
        <a href="#hero" className="hud-mark" aria-label="Sanchit Kaushik, back to top">
          SK<span>{"//"}</span>
        </a>

        <div className="compass" aria-hidden>
          <div className="compass-window">
            <div ref={strip} className="compass-strip">
              {TICKS.map((deg) => {
                const section = SECTIONS[deg / DEG_PER_SECTION];
                const major = deg % 15 === 0;
                return (
                  <span
                    key={deg}
                    className={major ? "tick tick-major" : "tick"}
                    style={{ left: (deg + 20) * PX_PER_DEG }}
                  >
                    {section ? (
                      <a
                        href={`#${section.id}`}
                        tabIndex={-1}
                        className={
                          deg / DEG_PER_SECTION === active ? "wp wp-on" : "wp"
                        }
                      >
                        {section.code}
                      </a>
                    ) : major ? (
                      <em>{((deg % 360) + 360) % 360}</em>
                    ) : null}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="compass-needle" />
          <span ref={heading} className="compass-read">
            000°
          </span>
        </div>

        <button
          type="button"
          className="hud-menu"
          onClick={() => {
            pause.current?.showModal();
            playSfx("select");
          }}
        >
          <kbd>ESC</kbd> Menu
        </button>
      </header>

      <div className="radar" aria-hidden>
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="58" className="radar-disc" />
          <circle cx="60" cy="60" r="38" className="radar-ring" />
          <circle cx="60" cy="60" r="19" className="radar-ring" />
          <path d="M60 2v116M2 60h116" className="radar-ring" />
          <path d="M60 60 L60 2 A58 58 0 0 1 101 19 Z" className="radar-sweep" />
          {SECTIONS.map((section, i) => {
            const angle = (i * DEG_PER_SECTION * Math.PI) / 180;
            const x = (60 + Math.sin(angle) * 44).toFixed(2);
            const y = (60 - Math.cos(angle) * 44).toFixed(2);
            return (
              <a key={section.id} href={`#${section.id}`} tabIndex={-1}>
                <title>{section.code}</title>
                <circle
                  cx={x}
                  cy={y}
                  r={i === active ? 5 : 3}
                  className={
                    i === active
                      ? "radar-blip radar-blip-on"
                      : i <= visited
                        ? "radar-blip radar-blip-seen"
                        : "radar-blip"
                  }
                />
              </a>
            );
          })}
          <g ref={player} className="radar-player">
            <path d="M60 50 L66 68 L60 64 L54 68 Z" />
          </g>
        </svg>
        <p>
          SECTOR {String(active + 1).padStart(2, "0")}/{SECTIONS.length}
        </p>
      </div>

      <div className="ammo">
        <div className="ammo-read">
          <span ref={ammo}>{MAG_SIZE}</span>
          <small>/ {MAG_SIZE}</small>
        </div>
        <div ref={mag} className="ammo-mag" aria-hidden />
        <button type="button" className="ammo-reload" onClick={reload}>
          <kbd>R</kbd> Reload to top
        </button>
      </div>

      <div className="xpbar" aria-hidden>
        <div className="xpbar-fill" />
        <p>
          <b>{RANKS[Math.min(visited, RANKS.length - 1)]}</b>
          <span>{visited * 100} XP</span>
        </p>
      </div>

      <div className="toast-slot" aria-hidden>
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.key}
              className="xp-toast"
              initial={{ opacity: 0, scale: 1.7, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <strong>+100 XP</strong>
              <span>{toast.label} discovered</span>
              <small>Rank up: {toast.rank}</small>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <dialog ref={pause} className="pause" aria-label="Site menu">
        <div className="pause-inner">
          <p className="pause-title">Paused</p>
          <nav aria-label="Sections">
            <ul>
              {SECTIONS.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => pause.current?.close()}
                    className={i === active ? "is-here" : undefined}
                  >
                    <span>{section.code}</span>
                    <small>{section.plain}</small>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="pause-side">
            <button type="button" onClick={toggleNvg} aria-pressed={nvg}>
              <kbd>N</kbd> Night vision <em>{nvg ? "On" : "Off"}</em>
            </button>
            <button type="button" onClick={toggleSfx} aria-pressed={sound}>
              <kbd>M</kbd> Sound <em>{sound ? "On" : "Off"}</em>
            </button>
            <a href={RESUME_URL} target="_blank" rel="noreferrer">
              Download resume
            </a>
            <button type="button" className="pause-resume" onClick={() => pause.current?.close()}>
              Resume
            </button>
            <p>↑ ↑ ↓ ↓ ← → ← → B A</p>
          </div>
        </div>
      </dialog>
    </div>
  );
}
