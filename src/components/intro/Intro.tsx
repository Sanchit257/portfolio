"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { sfxEnabled, subscribeSfx, toggleSfx } from "@/lib/sfx";
import {
  CUES,
  HANDOFF_MS,
  MOBILE_QUERY,
  PREROLL,
  SOURCES,
  STALL_LIMIT,
  STILL_HOLD,
  type Variant,
} from "./cues";
import { startIntroAudio, type IntroAudio } from "./introAudio";

/**
 * Cinematic intro: a pre-rendered Blender clip with an HTML HUD on top,
 * scrubbed by GSAP to the video's timecode. Plays once a session.
 *
 * The <script> in app/layout.tsx decides before first paint whether it runs
 * (html.intro) and whether it is the static version (html.intro-still, for
 * reduced motion or Save-Data). Any key or click skips, except M (sound) and
 * Tab. ESC skips and the HUD opens the pause menu.
 * Storyboard: docs/intro-storyboard.md. Assets: intro/, CREDITS.md.
 */

const KEEP = "[data-intro-keep]";
const PASS_KEYS = new Set(["m", "tab", "shift", "control", "alt", "meta", "capslock"]);
const GYRO = ["X", "Y", "Z"] as const;
const LOG = ["LINK ........ OK", "OPTICS ...... OK", "BIOMETRICS .. 72 BPM", "COMMS ....... ENCRYPTED"];

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
const missionClock = (s: number) =>
  `${pad(s / 60)}:${pad(s % 60)}:${pad((s % 1) * 100)}`;

type Timeline = { time: (t: number) => unknown; revert: () => unknown; kill: () => unknown };

/**
 * Whether this page view gets the intro, read once from the classes the boot
 * script set. Kept outside React so Strict Mode's mount, unmount, mount in
 * development replays the setup instead of ending the intro.
 */
let session: { active: boolean; still: boolean } | null = null;

export function Intro() {
  const layer = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const sound = useSyncExternalStore(subscribeSfx, sfxEnabled, () => false);

  useEffect(() => {
    const root = document.documentElement;
    const layerEl = layer.current;
    const videoEl = video.current;
    session ??= {
      active: root.classList.contains("intro"),
      still: root.classList.contains("intro-still"),
    };
    if (!layerEl || !videoEl || !session.active) return;
    const el: HTMLDivElement = layerEl;
    const vid: HTMLVideoElement = videoEl;
    const intro = session;
    root.classList.add("intro");
    if (intro.still) root.classList.add("intro-still");

    const variant: Variant = matchMedia(MOBILE_QUERY).matches ? "mobile" : "desktop";
    const cues = CUES[variant];
    el.dataset.variant = variant;

    const $ = <T extends HTMLElement>(sel: string) => el.querySelector<T>(sel);
    const timerEl = $("[data-timer]");
    const rangeEl = $("[data-range]");
    const rpmEl = $("[data-rpm]");
    const rpmBar = $(".ih-rpm i");
    const gyroEls = GYRO.map((axis) => $(`[data-gyro="${axis}"]`));

    let still = root.classList.contains("intro-still");
    let done = false;
    let playRequested = false;
    let raf = 0;
    let holdTimer = 0;
    let audio: IntroAudio | null = null;
    let tl: Timeline | null = null;
    const startedAt = performance.now();
    const elapsed = () => (performance.now() - startedAt) / 1000;

    /** Intro clock: wall time during the black pre-roll, then the video's own time. */
    const now = () =>
      playRequested ? PREROLL + vid.currentTime : Math.min(elapsed(), PREROLL);

    const readouts = (t: number) => {
      if (timerEl) timerEl.textContent = missionClock(Math.max(0, t - PREROLL - 0.1));
      const settle = 1 - clamp((t - cues.name) / (cues.lock - cues.name));
      gyroEls.forEach((g, i) => {
        if (g) g.textContent = (3.2 * settle * Math.sin(t * (11 + i * 4) + i * 2)).toFixed(2);
      });
      const approach = clamp((t - cues.name) / (cues.lock - cues.name));
      if (rangeEl) rangeEl.textContent = String(Math.round(142 - 134 * (1 - (1 - approach) ** 2)));
      const rpm = clamp((t - cues.rotor) / (cues.flash - cues.rotor));
      if (rpmEl) rpmEl.textContent = `${Math.round(rpm * 100)}%`;
      rpmBar?.style.setProperty("--rpm", rpm.toFixed(3));
    };

    const stopAudio = () => {
      audio?.stop();
      audio = null;
    };

    /** Stop everything this run started. Safe to call more than once. */
    const teardown = () => {
      done = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
      stopAudio();
      unsubscribe();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      vid.removeEventListener("ended", finish);
      vid.removeEventListener("error", goStill);
    };

    /** The intro is over: hand off to the hero and don't play again this session. */
    function finish() {
      if (done) return;
      teardown();
      intro.active = false;
      try {
        sessionStorage.setItem("sk-intro", "1");
      } catch {}
      // Keep the layer up just long enough to fade over the hero's entrance.
      el.dataset.leaving = "true";
      root.classList.remove("intro", "intro-still");
      window.setTimeout(() => {
        delete el.dataset.leaving;
        vid.pause();
        vid.removeAttribute("src");
        vid.load();
        tl?.kill();
      }, HANDOFF_MS);
    }

    /** Static poster + HUD text: reduced motion, Save-Data, or a video that won't play. */
    function goStill() {
      if (done) return;
      still = true;
      cancelAnimationFrame(raf);
      stopAudio();
      tl?.revert();
      tl = null;
      vid.pause();
      root.classList.add("intro-still");
      el.dataset.ready = "true";
      readouts(cues.lock + 0.2);
      window.clearTimeout(holdTimer);
      holdTimer = window.setTimeout(finish, STILL_HOLD * 1000);
    }

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const wall = elapsed();
      if (!playRequested && wall >= PREROLL) {
        playRequested = true;
        vid.play().catch(goStill);
      }
      if (playRequested && vid.currentTime < 0.05 && wall > PREROLL + STALL_LIMIT) {
        goStill();
        return;
      }
      const t = now();
      tl?.time(t);
      readouts(t);
      // Hard cap so a video that stalls mid-way can never trap the visitor.
      if (t >= cues.end || wall > cues.end + 6) finish();
    };

    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (PASS_KEYS.has(key)) return;
      const onControl = (e.target as Element | null)?.closest?.(KEEP);
      if (onControl && (key === "enter" || key === " ")) return;
      finish();
    }

    function onPointer(e: PointerEvent) {
      if ((e.target as Element | null)?.closest?.(KEEP)) return;
      finish();
    }

    // Sound is only ever switched on from a click or key press, so the
    // AudioContext created here is allowed to start.
    const unsubscribe = subscribeSfx(() => {
      if (done || still) return;
      if (sfxEnabled() && !audio) audio = startIntroAudio(cues, now());
      else if (!sfxEnabled()) stopAudio();
    });

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);

    if (still) {
      goStill();
    } else {
      const src = SOURCES[variant];
      vid.muted = true;
      vid.src = vid.canPlayType('video/webm; codecs="vp9"') === "probably" ? src.webm : src.mp4;
      vid.load();
      vid.addEventListener("ended", finish);
      vid.addEventListener("error", goStill);
      raf = requestAnimationFrame(tick);
      import("./hudTimeline")
        .then(({ buildHudTimeline }) => {
          if (done || still) return;
          const hud = $(".intro-layer-inner");
          if (!hud) return;
          tl = buildHudTimeline(hud, cues);
          tl.time(now());
          el.dataset.ready = "true";
        })
        .catch(() => {
          // Without GSAP the HUD still shows, just without its animation.
          el.dataset.ready = "true";
        });
    }

    return () => {
      if (done) return;
      // Unmounted mid-intro (Strict Mode, or navigating away): undo this run
      // and release the page. A remount re-adds the classes and starts over.
      teardown();
      tl?.revert();
      vid.pause();
      vid.removeAttribute("src");
      root.classList.remove("intro", "intro-still");
    };
  }, []);

  return (
    <div ref={layer} className="intro-layer" role="dialog" aria-label="Intro">
      <div className="intro-layer-inner">
        <video ref={video} className="intro-video" muted playsInline preload="none" aria-hidden />
        <div className="intro-poster" aria-hidden />
        <div className="intro-fx" aria-hidden>
          <span className="intro-scan" />
        </div>
        <p className="ih-cursor" aria-hidden>
          _
        </p>

        <div className="intro-hud" aria-hidden>
          <div className="ih-brackets">
            <span />
            <span />
            <span />
            <span />
          </div>

          <svg className="ih-reticle" viewBox="-100 -100 200 200">
            <circle r="60" className="ih-ring" />
            <path className="ih-tick" d="M0 -78V-66" />
            <path className="ih-tick" d="M78 0H66" />
            <path className="ih-tick" d="M0 78V66" />
            <path className="ih-tick" d="M-78 0H-66" />
            <path className="ih-arc" d="M-30 -24A38 38 0 0 1 30 -24" />
            <path className="ih-arc" d="M30 24A38 38 0 0 1 -30 24" />
            <circle r="2.6" className="ih-dot" />
          </svg>

          <div className="ih-timer">
            <small>Mission time</small>
            <b data-timer>00:00:00</b>
          </div>

          <ol className="ih-log">
            {LOG.map((line) => (
              <li key={line}>&gt; {line}</li>
            ))}
            <li>&gt; EXFIL ....... READY</li>
          </ol>

          <div className="ih-id">
            <p className="ih-name" data-text="SANCHIT KAUSHIK" data-glitch="off">
              SANCHIT KAUSHIK
            </p>
            <p className="ih-sub">CALLSIGN WHITE HAT · CYPRESS, CA · 33.82°N / 118.04°W</p>
          </div>

          <div className="ih-stab">
            <p className="ih-stab-label">
              <span className="ih-stab-a">Stabilizing</span>
              <span className="ih-stab-b">Locked</span>
            </p>
            <dl>
              {GYRO.map((axis) => (
                <div key={axis}>
                  <dt>{axis}</dt>
                  <dd data-gyro={axis}>0.00</dd>
                </div>
              ))}
            </dl>
            <p className="ih-range">
              RNG <b data-range>142</b>m
            </p>
          </div>

          <div className="ih-rpm">
            <span>Rotor</span>
            <i />
            <em data-rpm>0%</em>
          </div>

          <p className="ih-deploy">Deploying</p>
        </div>

        <div className="intro-flash" aria-hidden />
      </div>

      <div className="intro-controls">
        <button type="button" data-intro-keep onClick={toggleSfx} aria-pressed={sound}>
          <kbd>M</kbd> Sound <em>{sound ? "On" : "Off"}</em>
        </button>
        <button type="button" className="intro-skip">
          Skip <span aria-hidden>▸</span> <kbd>Any key</kbd>
        </button>
      </div>
      <p className="sr-only" role="status">
        Intro playing. Press any key or select Skip to go straight to the site.
      </p>
    </div>
  );
}
