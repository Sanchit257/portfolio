// The intro's soundtrack, synthesized with Web Audio so no audio files ship
// with the site (same approach as src/lib/sfx.ts). It only starts after the
// visitor turns sound on, which always happens inside a click or key press,
// so the AudioContext is allowed to run.

import type { Cues } from "./cues";
import { PREROLL } from "./cues";

export type IntroAudio = { stop: () => void };

/**
 * Start the soundtrack at intro time `now` (seconds on the intro clock).
 * Events already in the past are skipped. Beds fade in from where we are.
 */
export function startIntroAudio(cues: Cues, now: number): IntroAudio | null {
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const t0 = ctx.currentTime + 0.03;
  /** Convert intro time to AudioContext time. */
  const at = (t: number) => t0 + (t - now);
  const future = (t: number) => t >= now - 0.02;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, t0);
  master.gain.linearRampToValueAtTime(0.9, t0 + 0.25);
  const comp = ctx.createDynamicsCompressor();
  master.connect(comp).connect(ctx.destination);

  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const noiseSource = (start: number, stop: number) => {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;
    src.start(Math.max(start, ctx.currentTime));
    src.stop(stop);
    return src;
  };

  const thump = (t: number, freq: number, vol: number, len = 0.2) => {
    if (!future(t)) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(freq, at(t));
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, at(t) + len);
    g.gain.setValueAtTime(0.0001, at(t));
    g.gain.exponentialRampToValueAtTime(vol, at(t) + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at(t) + len);
    osc.connect(g).connect(master);
    osc.start(at(t));
    osc.stop(at(t) + len + 0.05);
  };

  const heartbeat = (t: number, vol = 0.9) => {
    thump(t, 62, vol, 0.22);
    thump(t + 0.26, 52, vol * 0.6, 0.2);
  };

  const breath = (t: number, len: number, inhale: boolean, vol = 0.16) => {
    if (!future(t)) return;
    const src = noiseSource(at(t), at(t) + len + 0.1);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(inhale ? 700 : 1100, at(t));
    bp.frequency.linearRampToValueAtTime(inhale ? 1300 : 500, at(t) + len);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at(t));
    g.gain.linearRampToValueAtTime(vol, at(t) + len * 0.45);
    g.gain.linearRampToValueAtTime(0.0001, at(t) + len);
    src.connect(bp).connect(g).connect(master);
  };

  const chirp = (t: number) => {
    if (!future(t)) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(380, at(t));
    osc.frequency.exponentialRampToValueAtTime(1500, at(t) + 0.22);
    g.gain.setValueAtTime(0.0001, at(t));
    g.gain.exponentialRampToValueAtTime(0.05, at(t) + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, at(t) + 0.3);
    osc.connect(g).connect(master);
    osc.start(at(t));
    osc.stop(at(t) + 0.35);
  };

  const sweep = (t: number, len: number, from: number, to: number, vol: number) => {
    if (!future(t)) return;
    const src = noiseSource(at(t), at(t) + len + 0.05);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 4;
    bp.frequency.setValueAtTime(from, at(t));
    bp.frequency.exponentialRampToValueAtTime(to, at(t) + len);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at(t));
    g.gain.linearRampToValueAtTime(vol, at(t) + 0.05);
    g.gain.linearRampToValueAtTime(0.0001, at(t) + len);
    src.connect(bp).connect(g).connect(master);
  };

  const end = at(cues.end) + 0.8;

  // Wind bed: low-passed noise with a slow gust LFO, from the HUD power-on.
  {
    const src = noiseSource(at(Math.max(now, PREROLL)), end);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.35;
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start(ctx.currentTime);
    lfo.stop(end);
    const g = ctx.createGain();
    const from = Math.max(now, PREROLL);
    g.gain.setValueAtTime(0.0001, at(from));
    g.gain.linearRampToValueAtTime(0.22, at(Math.max(from + 0.6, PREROLL + 1)));
    g.gain.setValueAtTime(0.22, at(cues.rotor));
    g.gain.linearRampToValueAtTime(0.08, at(cues.flash));
    src.connect(lp).connect(g).connect(master);
  }

  // Beat 0: two heartbeats and a breath in the dark.
  heartbeat(0.15);
  heartbeat(0.95);
  breath(0.35, 0.9, true);
  // Beat 1: HUD power-on.
  chirp(PREROLL + 0.05);
  breath(PREROLL + 0.4, 1.0, false, 0.12);
  // Beat 2: walking in. Breathing and footfalls under the wind.
  for (let t = cues.name; t < cues.lock - 0.6; t += 0.5) thump(t, 85, 0.25, 0.12);
  for (let t = cues.name + 0.2; t < cues.lock - 0.6; t += 1.6) {
    breath(t, 0.7, true, 0.09);
    breath(t + 0.75, 0.8, false, 0.08);
  }
  // Beat 3: the door slides and clunks home.
  sweep(cues.lock - 0.4, 0.75, 2400, 600, 0.12);
  thump(cues.lock + 0.35, 140, 0.4, 0.15);
  // Beat 4: rotor spin-up. Chopped noise whose chop rate climbs, plus a sub pulse.
  if (cues.flash > now) {
    const from = Math.max(now, cues.rotor - 0.3);
    const src = noiseSource(at(from), end);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 260;
    bp.Q.value = 0.9;
    const chop = ctx.createGain();
    chop.gain.value = 0.5;
    const lfo = ctx.createOscillator();
    lfo.type = "triangle";
    const depth = ctx.createGain();
    depth.gain.value = 0.5;
    lfo.frequency.setValueAtTime(3, at(from));
    lfo.frequency.exponentialRampToValueAtTime(19, at(cues.flash));
    lfo.connect(depth).connect(chop.gain);
    lfo.start(at(from));
    lfo.stop(end);
    const sub = ctx.createOscillator();
    sub.frequency.value = 44;
    const subGain = ctx.createGain();
    subGain.gain.value = 0;
    depth.connect(subGain.gain);
    sub.connect(subGain);
    sub.start(at(from));
    sub.stop(end);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at(from));
    g.gain.exponentialRampToValueAtTime(0.7, at(cues.flash));
    g.gain.linearRampToValueAtTime(0.0001, at(cues.flash) + 0.35);
    src.connect(bp).connect(chop).connect(g).connect(master);
    subGain.connect(g);
    // The heart speeds up under the rotor.
    for (let t = cues.rotor, gap = 0.62; t < cues.flash - 0.2; t += gap, gap *= 0.9) {
      heartbeat(t, 0.7);
    }
  }
  // Beat 5: everything ducks into one sub boom.
  thump(cues.flash, 48, 1.0, 1.3);

  let stopped = false;
  const timer = window.setTimeout(() => ctx.close(), (end - ctx.currentTime + 0.5) * 1000);
  return {
    stop() {
      if (stopped) return;
      stopped = true;
      window.clearTimeout(timer);
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 0.25);
      window.setTimeout(() => ctx.close(), 400);
    },
  };
}
