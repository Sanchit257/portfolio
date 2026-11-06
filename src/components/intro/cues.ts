// Timecodes for the cinematic intro, in seconds on the intro's own clock.
// The clock runs PREROLL seconds of black (HTML only, while the video
// buffers), then follows video.currentTime, so the HUD and audio stay locked
// to the picture even if playback stalls. Storyboard: docs/intro-storyboard.md

export const PREROLL = 1.2;

/** If the video still hasn't moved this long after the pre-roll, show the still. */
export const STALL_LIMIT = 2.5;

/** How long the reduced-motion / fallback still holds before handing off. */
export const STILL_HOLD = 2.0;

/** Hand-off fade from the intro layer to the hero, in ms. */
export const HANDOFF_MS = 450;

export type Variant = "desktop" | "mobile";

export type Cues = {
  /** Video length. */
  video: number;
  /** Operator name glitches in. */
  name: number;
  /** Door is open: STABILIZING becomes LOCKED. */
  lock: number;
  /** Rotor spin-up readout starts. */
  rotor: number;
  /** Orange-white flash before the cut. */
  flash: number;
  /** Intro ends and the hero takes over. */
  end: number;
};

// Desktop: 8.0 s video. Beats 1-5 as storyboarded.
const DESKTOP: Cues = {
  video: 8.0,
  name: 2.4,
  lock: 5.6,
  rotor: 6.6,
  flash: 8.4,
  end: 9.2,
};

// Mobile: 5.0 s cut built by intro/build.py from MOBILE_SEGMENTS
// [(0, 2.6), (3.8, 5.4), (7.2, 8.0)] of the full video.
const MOBILE: Cues = {
  video: 5.0,
  name: 2.4,
  lock: 4.2,
  rotor: 5.4,
  flash: 5.85,
  end: 6.2,
};

export const CUES: Record<Variant, Cues> = { desktop: DESKTOP, mobile: MOBILE };

export const SOURCES: Record<Variant, { webm: string; mp4: string }> = {
  desktop: { webm: "/intro/intro-desktop.webm", mp4: "/intro/intro-desktop.mp4" },
  mobile: { webm: "/intro/intro-mobile.webm", mp4: "/intro/intro-mobile.mp4" },
};

/** Portrait phones get the shorter 9:16 cut. Landscape phones keep 16:9. */
export const MOBILE_QUERY = "(max-width: 768px) and (orientation: portrait)";
