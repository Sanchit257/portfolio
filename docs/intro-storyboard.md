# Cinematic intro — storyboard

Status: **approved 2026-11-06** (camera stays outside for the rotor wide shot)

This replaces `ColdOpen.tsx`. It's an unofficial tribute in the style of a military-shooter mission intro. Every visual is built from primitives in Blender and every sound is synthesized in the browser, so there are no third-party logos, music, voices or models.

## Shape

| | Desktop | Mobile (≤ 768px wide) | Reduced motion / Save-Data |
|---|---|---|---|
| Length | ~9.2 s (1.2 s HTML pre-roll + 8.0 s video) | ~6.2 s (pre-roll + 5.0 s cut) | ~2.0 s static |
| Video | 1280×720, 24 fps, H.264 + VP9 WebM | 540×960 portrait centre-crop, shorter cut | none (poster still) |
| Budget | ≤ 3.5 MB each | ≤ 1.5 MB each | poster ≤ 120 KB |

- It plays once per session, using the existing `sk-intro` sessionStorage key. The existing rules still apply: no intro on deep links (hash, query or non-root path).
- **Skip** is available from the first frame. A click, tap, Enter or Space anywhere skips, and so does the `SKIP ▸` button. **ESC** skips and opens the pause menu. **M** toggles sound without skipping.
- Sound is **off by default**. A `SOUND [M]` toggle in the corner turns it on and shares state with the pause menu's *M Sound* control.
- The HUD is HTML/CSS layered over the video. A GSAP timeline is keyed to `video.currentTime`, so the HUD stays in sync if the video stalls or buffers.
- The page underneath renders and hydrates normally. If the video hasn't started 2.5 s after the pre-roll, or it errors, the intro falls back to the poster version and ends.

## Beats

Times are from page load. `V+` is the video timecode.

### 0 · Black — 0.0 → 1.2 s (HTML only, while the video buffers)
- **Picture:** Pure black with faint film grain. A thin horizontal scanline flickers once.
- **HUD:** Nothing yet, just a blinking cursor bottom-left.
- **Audio:** Two heartbeats (low "lub-dub" thumps) and one slow inhale with a filtered-noise exhale.

### 1 · HUD power-on — 1.2 → 2.4 s (V+0.0 → 1.2)
- **Picture:** The video fades up from black. A rain-soaked street fills the frame, lit by sodium streetlights and one flickering orange (`--tracer`) sign. Lightning lights up the skyline for 2 frames.
- **HUD:** The corner brackets snap in, then the reticle draws itself (circle → ticks → centre dot). A boot log types out in Share Tech Mono:
  ```
  > LINK ........ OK
  > OPTICS ...... OK
  > BIOMETRICS .. 72 BPM
  > COMMS ....... ENCRYPTED
  ```
  The mission timer starts at `00:00:00` and counts up.
- **Audio:** A HUD power-on chirp (rising triangle tone), and wind fades in.

### 2 · Street dolly — 2.4 → 5.0 s (V+1.2 → 3.8)
- **Picture:** Low camera, slow forward dolly down the centre line. Puddles reflect the lights, and steam rises from a grate. Rain streaks move through the frame. A helicopter sits in the intersection ahead with its rotor slowly windmilling and red anti-collision beacons blinking.
- **HUD:** Glitch text for the operator name: **SANCHIT KAUSHIK** flickers through RGB-split, misaligned frames before locking. Beneath it: `CALLSIGN WHITE HAT · CYPRESS, CA · 33.82°N / 118.04°W`. The `STABILIZING` counters (gyro X/Y/Z values, settling from jittery to `0.00`) run on the right edge, plus a range readout counting down to the helicopter (`RNG 142m → 8m`).
- **Audio:** Breathing continues under the wind, and footstep-like low thuds play in time with a slight camera bob.

### 3 · Door opens — 5.0 → 6.6 s (V+3.8 → 5.4)
- **Picture:** The camera arrives at the helicopter's flank. The side door slides open on its rail, and warm red-orange cabin light spills out onto the wet street. The camera pushes into the doorway.
- **HUD:** The reticle tightens onto the doorway and `STABILIZING` changes to `LOCKED` in `--green`. The boot log adds `> EXFIL ....... READY`.
- **Audio:** Metallic door slide (filtered noise sweep plus a clunk).

### 4 · Rotor spin-up — 6.6 → 8.4 s (V+5.4 → 7.2)
- **Picture:** Cut to a low wide angle under the tail boom. The main rotor accelerates from visible blades to a motion-blurred disc, and the rain gets swept outward by rotor wash. Camera shake builds.
- **HUD:** The timer flicks to orange. A spinning rotor-RPM bar fills, then `DEPLOYING` flashes centre-screen.
- **Audio:** Rotor thump rate ramps up (amplitude-modulated noise plus a low pulse) as wind gives way to wash. Heartbeat speeds up.

### 5 · Cut to hero — 8.4 → 9.2 s (V+7.2 → 8.0)
- **Picture:** The rotor wash fills the frame and goes to an orange-white flash, then a hard cut.
- **Handoff:** The intro layer fades out over ~400 ms with a slight scale-down. The intro HUD corners collapse into the site HUD, `html.intro` is removed, and the hero's existing staggered entrance (`hero-a`) plays.
- **Audio:** Everything ducks to a single sub-boom, then silence.

## Mobile cut (~6.2 s)
Same pre-roll. The video is beats 1 → 2 (shortened) → 3 → 5. The rotor beat is cut and replaced by a 0.4 s rotor flash. The camera keeps the subject centred so the 9:16 centre-crop works. The HUD is simplified: reticle, timer, name glitch and a two-line log.

## Reduced motion / Save-Data (~2 s)
A static poster frame from the door beat, with the HUD text shown without animation: name, location and `LOCKED`. No reticle motion, glitch or counters. It fades to the hero after ~2 s, or right away on any input. This replaces today's behaviour, which skips the intro completely when reduced motion is on.

## Look
- **Grade:** Crushed blacks near `#0b0d0a`, olive/teal shadows, sodium-amber highlights, with `--tracer #ff6a13` as the only saturated accent. Light vignette and grain.
- **HUD colours:** `--bone` text, `--tracer` reticle/timer, `--green` for locked/OK states, `--red` for the beacons and warnings, with `--dim` for secondary readouts.
- **Helicopter:** An original stylised utility helicopter made from Blender primitives (bevelled box cabin, tapered tail boom, skids, 4-blade main rotor, tail rotor). It isn't modelled on any real airframe or game asset.

## Decisions
- The camera stays outside for the rotor shot. It does not board the cabin.
- All audio is synthesized in the browser (`src/components/intro/introAudio.ts`). No audio files ship.
- The video starts muted right away. `SOUND [M]` turns audio on, and any other click or key skips.
- Landscape phones get the 16:9 desktop cut, since a 9:16 crop would be zoomed in heavily there.
