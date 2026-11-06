// The HUD's GSAP timeline. It is built paused and scrubbed every frame to the
// intro clock (see Intro.tsx), so it follows the video's timecode rather than
// wall time. Loaded with a dynamic import, so visitors who don't get the
// intro never download GSAP.

import { gsap } from "gsap";
import type { Cues } from "./cues";
import { PREROLL } from "./cues";

export function buildHudTimeline(root: HTMLElement, cues: Cues) {
  const q = gsap.utils.selector(root);
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  const P = PREROLL;

  // Beat 0: only a blinking cursor in the dark.
  tl.fromTo(q(".ih-cursor"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1 }, P);
  tl.fromTo(q(".intro-scan"), { top: "0%", autoAlpha: 0.9 },
    { top: "100%", duration: 0.5, ease: "none" }, 0.4);
  tl.set(q(".intro-scan"), { autoAlpha: 0 }, 0.9);

  // Beat 1: HUD power-on. Brackets snap in, the reticle draws itself.
  tl.from(q(".ih-brackets span"), {
    autoAlpha: 0, scale: 1.6, duration: 0.3, stagger: 0.04, ease: "back.out(2)",
  }, P);
  tl.fromTo(q(".ih-ring"), { strokeDashoffset: 380 },
    { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, P + 0.15);
  tl.from(q(".ih-tick"), { autoAlpha: 0, duration: 0.05, stagger: 0.05 }, P + 0.45);
  tl.from(q(".ih-dot"), { scale: 0, transformOrigin: "50% 50%", duration: 0.25 }, P + 0.7);
  tl.from(q(".ih-timer"), { autoAlpha: 0, y: -8, duration: 0.3 }, P + 0.1);
  q(".ih-log li").forEach((li, i) => {
    const t = i < 4 ? P + 0.2 + i * 0.25 : cues.lock + 0.1;
    tl.set(li, { autoAlpha: 1 }, t);
    tl.fromTo(li, { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.22, ease: "steps(14)" }, t);
  });

  // Beat 2: identity. The name glitches in, then locks.
  tl.set(q(".ih-id"), { autoAlpha: 1 }, cues.name);
  tl.set(q(".ih-name"), { attr: { "data-glitch": "on" } }, cues.name);
  tl.set(q(".ih-name"), { attr: { "data-glitch": "off" } }, cues.name + 0.8);
  tl.set(q(".ih-name"), { attr: { "data-glitch": "on" } }, cues.name + 1.2);
  tl.set(q(".ih-name"), { attr: { "data-glitch": "off" } }, cues.name + 1.3);
  tl.fromTo(q(".ih-sub"), { clipPath: "inset(0 100% 0 0)" },
    { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "steps(30)" }, cues.name + 0.5);
  tl.from(q(".ih-stab"), { autoAlpha: 0, x: 24, duration: 0.4 }, cues.name + 0.2);

  // Beat 3: the door opens and the reticle locks on.
  tl.to(q(".ih-reticle"), { scale: 0.62, duration: 0.5, ease: "power2.inOut" }, cues.lock - 0.5);
  tl.set(q(".ih-stab"), { attr: { "data-locked": "true" } }, cues.lock);
  tl.set(q(".ih-reticle"), { attr: { "data-locked": "true" } }, cues.lock);

  // Beat 4: rotor spin-up.
  tl.set(q(".ih-timer"), { attr: { "data-hot": "true" } }, cues.rotor);
  tl.from(q(".ih-rpm"), { autoAlpha: 0, y: 12, duration: 0.3 }, cues.rotor);
  tl.to(q(".ih-reticle"), { scale: 1.15, autoAlpha: 0.4, duration: cues.flash - cues.rotor,
    ease: "power1.in" }, cues.rotor);
  const deployAt = Math.max(cues.rotor + 0.2, cues.flash - 0.8);
  tl.fromTo(q(".ih-deploy"), { autoAlpha: 0, scale: 1.3 },
    { autoAlpha: 1, scale: 1, duration: 0.15, ease: "power4.out" }, deployAt);
  tl.to(q(".ih-deploy"), { autoAlpha: 0.25, duration: 0.08, repeat: 3, yoyo: true,
    ease: "steps(1)" }, deployAt + 0.2);

  // Beat 5: flash and hand-off.
  tl.fromTo(q(".intro-flash"), { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.2, ease: "power2.in" }, cues.flash);
  tl.to(q(".intro-hud"), { autoAlpha: 0, duration: 0.15 }, cues.flash + 0.1);
  tl.to(q(".intro-flash"), { autoAlpha: 0, duration: cues.end - cues.flash - 0.2,
    ease: "power1.out" }, cues.flash + 0.2);

  return tl;
}
