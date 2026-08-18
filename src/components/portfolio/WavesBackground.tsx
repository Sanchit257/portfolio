"use client";

import { useEffect, useRef, useState } from "react";
import Waves from "@/components/Waves";

/** Dark muted line colors (same density as Background Studio red). */
const SECTION_LINE_COLORS: Record<string, string> = {
  hero: "#530000",
  about: "#0a3600",
  skills: "#1a5c73",
  experience: "#3a0a53",
  projects: "#1a5c73",
  certifications: "#534d00",
  activities: "#53001a",
  contact: "#530000",
};

const SECTION_ORDER = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "certifications",
  "activities",
  "contact",
] as const;

const DEFAULT_LINE = SECTION_LINE_COLORS.hero;
/** Higher = snappier fade; lower = softer blend while scrolling. */
const LERP_SPEED = 0.08;

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const to = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function nearlyEqual(a: Rgb, b: Rgb, eps = 0.4) {
  return (
    Math.abs(a.r - b.r) < eps &&
    Math.abs(a.g - b.g) < eps &&
    Math.abs(a.b - b.b) < eps
  );
}

/** Blend section colors by how much of each is in view. */
function blendFromRatios(ratios: Map<string, number>): Rgb {
  let r = 0;
  let g = 0;
  let b = 0;
  let weight = 0;

  for (const id of SECTION_ORDER) {
    const w = ratios.get(id) ?? 0;
    if (w <= 0) continue;
    const c = hexToRgb(SECTION_LINE_COLORS[id] ?? DEFAULT_LINE);
    r += c.r * w;
    g += c.g * w;
    b += c.b * w;
    weight += w;
  }

  if (weight <= 0) return hexToRgb(DEFAULT_LINE);
  return { r: r / weight, g: g / weight, b: b / weight };
}

export function WavesBackground() {
  const [lineColor, setLineColor] = useState(DEFAULT_LINE);
  const displayRef = useRef(hexToRgb(DEFAULT_LINE));
  const targetRef = useRef(hexToRgb(DEFAULT_LINE));
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let retryId = 0;

    const tick = () => {
      const cur = displayRef.current;
      const target = targetRef.current;

      if (nearlyEqual(cur, target)) {
        displayRef.current = target;
        setLineColor(rgbToHex(target));
        animRef.current = null;
        return;
      }

      displayRef.current = {
        r: cur.r + (target.r - cur.r) * LERP_SPEED,
        g: cur.g + (target.g - cur.g) * LERP_SPEED,
        b: cur.b + (target.b - cur.b) * LERP_SPEED,
      };
      setLineColor(rgbToHex(displayRef.current));
      animRef.current = requestAnimationFrame(tick);
    };

    const ensureAnimating = () => {
      if (animRef.current == null) {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    const attach = () => {
      if (cancelled) return;
      const elements = SECTION_ORDER.map((id) =>
        document.getElementById(id),
      ).filter((el): el is HTMLElement => el != null);

      if (elements.length === 0) {
        retryId = window.setTimeout(attach, 100);
        return;
      }

      const ratios = new Map<string, number>();

      const updateTarget = () => {
        targetRef.current = blendFromRatios(ratios);
        ensureAnimating();
      };

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios.set(entry.target.id, entry.intersectionRatio);
          }
          updateTarget();
        },
        {
          threshold: Array.from({ length: 21 }, (_, i) => i / 20),
          rootMargin: "-15% 0px -25% 0px",
        },
      );

      for (const el of elements) observer.observe(el);
    };

    attach();

    return () => {
      cancelled = true;
      window.clearTimeout(retryId);
      observer?.disconnect();
      if (animRef.current != null) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ backgroundColor: "#120f17" }}
      aria-hidden
    >
      <Waves
        lineColor={lineColor}
        backgroundColor="transparent"
        waveSpeedX={0.03}
        waveSpeedY={0.03}
        waveAmpX={55}
        waveAmpY={40}
        friction={0.87}
        tension={0.07}
        maxCursorMove={300}
        xGap={14}
        yGap={36}
        className="w-full h-full"
      />
    </div>
  );
}
