"use client";

export const SECTION_LINE_COLORS: Record<string, string> = {
  hero: "#530000",
  about: "#0a3600",
  skills: "#1a5c73",
  experience: "#3a0a53",
  projects: "#1a5c73",
  certifications: "#534d00",
  activities: "#53001a",
  contact: "#530000",
};

export const SECTION_ORDER = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "certifications",
  "activities",
  "contact",
] as const;

export const DEFAULT_LINE = SECTION_LINE_COLORS.hero;

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const to = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** Scale a muted section color to a visible neon of the same hue. */
export function brightenToNeon(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const max = Math.max(r, g, b, 1);
  const scale = 255 / max;
  return rgbToHex({ r: r * scale, g: g * scale, b: b * scale });
}

export function getActiveSectionId(): string {
  const vh = window.innerHeight;
  const viewTop = vh * 0.15;
  const viewBottom = vh * 0.75;
  let bestId = "hero";
  let bestVisible = 0;
  let found = false;

  for (const id of SECTION_ORDER) {
    const el = document.getElementById(id);
    if (!el) continue;
    found = true;
    const rect = el.getBoundingClientRect();
    const visible =
      Math.min(rect.bottom, viewBottom) - Math.max(rect.top, viewTop);
    if (visible > bestVisible) {
      bestVisible = visible;
      bestId = id;
    }
  }

  return found ? bestId : "hero";
}
