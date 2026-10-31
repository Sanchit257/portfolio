"use client";

import { useEffect, useRef } from "react";
import { playSfx } from "@/lib/sfx";

const INTERACTIVE = "a, button, label, [role='tab'], summary";
const TEXT_ENTRY = "input, textarea, select";
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const REDUCED = "(prefers-reduced-motion: reduce)";

function spawn(className: string, x: number, y: number, vars?: Record<string, string>) {
  const el = document.createElement("span");
  el.className = className;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.setAttribute("aria-hidden", "true");
  if (vars) {
    for (const [key, value] of Object.entries(vars)) {
      el.style.setProperty(key, value);
    }
  }
  el.addEventListener("animationend", () => el.remove(), { once: true });
  document.body.appendChild(el);
}

/** Page-wide effects: scroll reveals, the reticle, hitmarkers, casings, UAV. */
export function Fx() {
  const reticle = useRef<HTMLDivElement>(null);

  // Scroll reveals. Sections stay server-rendered and just opt in with data-fx.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-fx]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Reticle: bloom opens with mouse speed and tightens over anything clickable.
  useEffect(() => {
    const node = reticle.current;
    const root = document.documentElement;
    if (!node || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    root.classList.add("has-reticle");

    let x = -100;
    let y = -100;
    let last = { x, y };
    let bloom = 0;
    let kick = 0;
    let raf = 0;

    const frame = () => {
      const speed = Math.hypot(x - last.x, y - last.y);
      last = { x, y };
      bloom += (Math.min(speed * 0.55, 22) - bloom) * 0.16;
      kick *= 0.82;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      node.style.setProperty("--gap", `${(bloom + kick).toFixed(1)}px`);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as Element | null;
      node.dataset.state = !target?.closest
        ? ""
        : target.closest(TEXT_ENTRY)
          ? "hidden"
          : target.closest(INTERACTIVE)
            ? "ads"
            : "";
    };
    const onDown = () => {
      kick = 14;
    };
    const onLeave = () => {
      node.dataset.state = "hidden";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-reticle");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Clicks land a hitmarker and kick a spent casing off to the right.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.(TEXT_ENTRY) || target?.closest?.("dialog")) return;
      const onTarget = Boolean(target?.closest?.(INTERACTIVE));
      playSfx(onTarget ? "hit" : "select");
      if (matchMedia(REDUCED).matches) return;
      spawn(onTarget ? "hitmarker hitmarker-hot" : "hitmarker", e.clientX, e.clientY);
      spawn("casing", e.clientX, e.clientY, {
        "--dx": `${40 + Math.random() * 70}px`,
        "--dy": `${-(50 + Math.random() * 50)}px`,
        "--spin": `${360 + Math.random() * 720}deg`,
      });
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  // Konami code calls in a UAV sweep that paints every link on the page.
  useEffect(() => {
    const root = document.documentElement;
    let progress = 0;
    let timer = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress < KONAMI.length) return;
      progress = 0;
      root.classList.add("uav");
      playSfx("xp");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.classList.remove("uav"), 7000);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div ref={reticle} className="reticle" data-state="hidden" aria-hidden>
        <i />
        <i />
        <i />
        <i />
        <b />
      </div>
      <div className="uav-sweep" aria-hidden>
        <p>UAV ONLINE</p>
      </div>
      <div className="nvg-layer" aria-hidden />
    </>
  );
}
