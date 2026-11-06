// Synthesized sound effects, so no audio files ship with the site. Off until
// the visitor turns them on, and the choice lasts only for the page view.

let enabled = false;
let ctx: AudioContext | null = null;
const listeners = new Set<() => void>();

export const sfxEnabled = () => enabled;

export function subscribeSfx(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function toggleSfx() {
  enabled = !enabled;
  listeners.forEach((listener) => listener());
  // The intro has its own soundtrack, so skip the confirmation chime there.
  if (enabled && !document.documentElement.classList.contains("intro")) playSfx("xp");
}

function tone(
  audio: AudioContext,
  freq: number,
  start: number,
  length: number,
  volume: number,
  type: OscillatorType = "square",
) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audio.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audio.currentTime + start + length,
  );
  osc.connect(gain).connect(audio.destination);
  osc.start(audio.currentTime + start);
  osc.stop(audio.currentTime + start + length);
}

export function playSfx(kind: "hit" | "xp" | "select") {
  if (!enabled) return;
  ctx ??= new AudioContext();
  if (kind === "hit") {
    tone(ctx, 1900, 0, 0.05, 0.05);
    tone(ctx, 2600, 0.012, 0.05, 0.035);
  } else if (kind === "select") {
    tone(ctx, 620, 0, 0.05, 0.04, "triangle");
  } else {
    tone(ctx, 520, 0, 0.09, 0.04, "triangle");
    tone(ctx, 780, 0.09, 0.09, 0.04, "triangle");
    tone(ctx, 1040, 0.18, 0.16, 0.04, "triangle");
  }
}
