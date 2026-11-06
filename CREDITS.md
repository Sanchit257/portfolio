# Credits

## Cinematic intro

The intro is an **unofficial tribute** to the look of military-shooter mission intros. It is not affiliated with or endorsed by Activision or any game studio. It uses no third-party logos, music, voice lines, models, textures or trademarked art.

| Asset | Path | Source | License |
|---|---|---|---|
| Intro video, desktop (MP4, WebM) | `public/intro/intro-desktop.*` | Original. Rendered in Blender from `intro/blender/build_scene.py` | Same as this repo |
| Intro video, mobile cut (MP4, WebM) | `public/intro/intro-mobile.*` | Original. Same render, cut and cropped by `intro/build.py` | Same as this repo |
| Poster stills | `public/intro/poster*.jpg` | Original. A frame from the same render | Same as this repo |
| 3D scene: street, buildings, helicopter, rain, steam, lights | generated at render time | Original. Built entirely from Blender primitives and procedural shaders in the script. No imported models, textures or HDRIs. The helicopter is a generic stylised design, not modelled on a real airframe or game asset | Same as this repo |
| Heartbeat, breathing, wind, footsteps, door, rotor, sub-boom | `src/components/intro/introAudio.ts` | Original. Synthesized live with the Web Audio API. No audio files ship | Same as this repo |
| HUD (reticle, timer, boot log, counters, glitch text) | `src/components/intro/` | Original HTML/CSS/SVG | Same as this repo |

## Tools and libraries

| Name | Used for | License |
|---|---|---|
| [Blender](https://www.blender.org/) 5.2 | Rendering the intro offline | GPL-2.0-or-later (the tool only; rendered output belongs to its author) |
| [FFmpeg](https://ffmpeg.org/) with libx264 / libvpx-vp9 | Encoding the intro offline | LGPL/GPL (the tool only; nothing from it ships) |
| [GSAP](https://gsap.com/) 3 | HUD timeline, loaded only when the intro plays | [Standard "no charge" license](https://gsap.com/standard-license) |
| Big Shoulders Stencil, Barlow Semi Condensed, Share Tech Mono, Special Elite | Site and HUD typography (already used by the site, via `next/font/google`) | SIL Open Font License 1.1 |

To rebuild the intro, see `intro/build.py` (`npm run intro:render`). The storyboard is in `docs/intro-storyboard.md`.
