"use client";

import { useEffect, useRef } from "react";

type Ember = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number };

/** Sparks rising over every page. requestAnimationFrame pauses it in hidden tabs. */
export function Embers() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = width * dpr;
      el.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const make = (scatter: boolean): Ember => {
      const max = 140 + Math.random() * 220;
      return {
        x: Math.random() * width,
        y: scatter ? Math.random() * height : height + 8,
        vx: 0.15 + Math.random() * 0.5,
        vy: -(0.4 + Math.random() * 1.3),
        r: 0.5 + Math.random() * 1.5,
        life: scatter ? Math.random() * max : 0,
        max,
      };
    };
    const embers = Array.from({ length: width < 700 ? 22 : 54 }, () => make(true));

    let raf = 0;
    let t = 0;
    const frame = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      embers.forEach((ember, i) => {
        ember.life += 1;
        ember.x += ember.vx + Math.sin(t + i) * 0.35;
        ember.y += ember.vy;
        const left = 1 - ember.life / ember.max;
        if (left <= 0 || ember.y < -10) {
          embers[i] = make(false);
          return;
        }
        ctx.fillStyle = `rgba(255, ${90 + Math.round(90 * left)}, 20, ${left * 0.9})`;
        ctx.beginPath();
        ctx.ellipse(ember.x, ember.y, ember.r * 2.2, ember.r * 0.8, -0.9, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvas} className="embers" aria-hidden />;
}
