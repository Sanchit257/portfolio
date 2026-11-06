#!/usr/bin/env python3
"""Render the intro in headless Blender and encode it for the web.

    npm run intro:render              # render frames + encode everything
    npm run intro:encode              # re-encode from existing frames
    python3 intro/build.py --preview  # quick half-res, low-sample pass

Tool paths come from intro/config.local.json (falling back to
intro/config.example.json). BLENDER_BIN and FFMPEG_BIN override both.

Outputs in public/intro/:
    intro-desktop.mp4 / .webm   1280x720, 8.0 s, desktop cut
    intro-mobile.mp4  / .webm   540x960 centre crop, 5.0 s mobile cut
    poster.jpg / poster-mobile.jpg  still from the door beat
"""

import argparse
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INTRO = os.path.join(ROOT, "intro")
BUILD = os.path.join(INTRO, "build")
FRAMES = os.path.join(BUILD, "frames")
PUBLIC = os.path.join(ROOT, "public", "intro")
FPS = 24

# Size budgets in bytes, and the CRF ladder tried until a file fits.
BUDGET = {"desktop": 3_500_000, "mobile": 1_500_000}
X264_CRF = [24, 26, 28, 30, 32, 34]
VP9_CRF = [34, 37, 40, 43, 46, 50]

# Mobile cut, in seconds of the full video. Keep in sync with
# src/components/intro/cues.ts (MOBILE_SEGMENTS).
MOBILE_SEGMENTS = [(0.0, 2.6), (3.8, 5.4), (7.2, 8.0)]
POSTER_TIME = 5.15  # door open, cabin lit

GRADE = "curves=all='0/0 0.1/0.06 0.5/0.5 1/1',eq=saturation=0.95:gamma=1.02"


def load_config():
    cfg = {}
    for name in ("config.example.json", "config.local.json"):
        path = os.path.join(INTRO, name)
        if os.path.exists(path):
            with open(path) as f:
                cfg.update(json.load(f))
    cfg["blender"] = os.environ.get("BLENDER_BIN", cfg.get("blender"))
    cfg["ffmpeg"] = os.environ.get("FFMPEG_BIN", cfg.get("ffmpeg", "ffmpeg"))
    for tool in ("blender", "ffmpeg"):
        found = shutil.which(cfg[tool]) or (os.path.exists(cfg[tool]) and cfg[tool])
        if not found:
            sys.exit(f"{tool} not found at '{cfg[tool]}'. Set it in intro/config.local.json.")
        cfg[tool] = found
    return cfg


def run(cmd):
    print("$", " ".join(cmd[:6]), "..." if len(cmd) > 6 else "")
    subprocess.run(cmd, check=True)


def render(cfg, preview):
    if os.path.isdir(FRAMES):
        shutil.rmtree(FRAMES)
    run([
        cfg["blender"], "-b", "--factory-startup", "--python-exit-code", "1",
        "-P", os.path.join(INTRO, "blender", "build_scene.py"), "--",
        "--out", FRAMES,
        "--scale", str(50 if preview else cfg.get("renderScale", 100)),
        "--samples", str(8 if preview else cfg.get("samples", 24)),
    ])


def encode(cfg, out, vf, codec, budget):
    """Encode with the lowest CRF on the ladder whose file fits the budget."""
    ladder = X264_CRF if codec == "h264" else VP9_CRF
    for crf in ladder:
        cmd = [cfg["ffmpeg"], "-v", "error", "-y", "-framerate", str(FPS),
               "-i", os.path.join(FRAMES, "%04d.png"), "-vf", vf, "-an"]
        if codec == "h264":
            cmd += ["-c:v", "libx264", "-preset", "veryslow", "-crf", str(crf),
                    "-pix_fmt", "yuv420p", "-profile:v", "high",
                    "-movflags", "+faststart"]
        else:
            cmd += ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", str(crf),
                    "-row-mt", "1", "-deadline", "good", "-cpu-used", "1",
                    "-pix_fmt", "yuv420p"]
        cmd.append(out)
        run(cmd)
        size = os.path.getsize(out)
        print(f"  {os.path.basename(out)} crf {crf}: {size / 1e6:.2f} MB")
        if size <= budget:
            return size
    print(f"  warning: {out} is still over budget at the highest CRF")
    return size


def poster(cfg, out, vf):
    frame = round(POSTER_TIME * FPS) + 1
    run([cfg["ffmpeg"], "-v", "error", "-y",
         "-i", os.path.join(FRAMES, f"{frame:04d}.png"),
         "-vf", vf, "-q:v", "5", out])
    print(f"  {os.path.basename(out)}: {os.path.getsize(out) / 1e3:.0f} KB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--skip-render", action="store_true")
    ap.add_argument("--preview", action="store_true")
    args = ap.parse_args()
    cfg = load_config()
    os.makedirs(PUBLIC, exist_ok=True)

    if not args.skip_render:
        render(cfg, args.preview)

    desktop = f"{GRADE},scale=1280:720:flags=lanczos,fade=t=in:st=0:d=0.8"
    pick = "+".join(f"between(t,{a},{b - 0.001})" for a, b in MOBILE_SEGMENTS)
    mobile = (f"select='{pick}',setpts=N/{FPS}/TB,{GRADE},"
              "crop=ih*9/16:ih,scale=540:960:flags=lanczos,fade=t=in:st=0:d=0.8")

    for codec, ext in (("h264", "mp4"), ("vp9", "webm")):
        encode(cfg, os.path.join(PUBLIC, f"intro-desktop.{ext}"), desktop, codec, BUDGET["desktop"])
        encode(cfg, os.path.join(PUBLIC, f"intro-mobile.{ext}"), mobile, codec, BUDGET["mobile"])

    poster(cfg, os.path.join(PUBLIC, "poster.jpg"), f"{GRADE},scale=1280:720:flags=lanczos")
    poster(cfg, os.path.join(PUBLIC, "poster-mobile.jpg"),
           f"{GRADE},crop=ih*9/16:ih,scale=540:960:flags=lanczos")


if __name__ == "__main__":
    main()
