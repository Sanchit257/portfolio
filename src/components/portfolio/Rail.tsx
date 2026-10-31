"use client";

import { useEffect, useRef, type ReactNode } from "react";

const SMOOTHING_MS = 110;
const WHEEL_SPEED = 1.6;

/** True when an element under the pointer can still scroll vertically itself. */
function canScrollInner(from: Element | null, stop: Element, dy: number) {
  for (let el = from; el && el !== stop; el = el.parentElement) {
    if (el.scrollHeight <= el.clientHeight + 1) continue;
    const { overflowY } = getComputedStyle(el);
    if (overflowY !== "auto" && overflowY !== "scroll") continue;
    const room = dy > 0 ? el.scrollHeight - el.clientHeight - el.scrollTop : el.scrollTop;
    if (room > 1) return true;
  }
  return false;
}

/** The page as one sideways track: wheel and keys glide it, touch and trackpads scroll it natively. */
export function Rail({ children }: { children: ReactNode }) {
  const rail = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let target = el.scrollLeft;
    let pos = target;
    let last = 0;
    let raf = 0;
    let gliding = false;

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      pos += (target - pos) * (1 - Math.exp(-dt / SMOOTHING_MS));
      if (Math.abs(target - pos) < 0.5) {
        el.scrollLeft = target;
        gliding = false;
        el.style.scrollSnapType = "";
        return;
      }
      el.scrollLeft = pos;
      raf = requestAnimationFrame(frame);
    };

    const glide = (x: number) => {
      target = Math.max(0, Math.min(x, el.scrollWidth - el.clientWidth));
      if (reduced) {
        el.scrollLeft = target;
        return;
      }
      if (gliding) return;
      gliding = true;
      pos = el.scrollLeft;
      last = performance.now();
      el.style.scrollSnapType = "none";
      raf = requestAnimationFrame(frame);
    };

    const panelFor = (hash: string) => {
      const panel = hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
      return panel && panel.parentElement === el ? panel : null;
    };
    const activePanel = () => {
      const probe = el.clientWidth * 0.4;
      return Array.from(el.children).findLast((p) => p.getBoundingClientRect().left <= probe) ?? null;
    };

    for (const panel of el.children) panel.setAttribute("tabindex", "-1");

    const initial = panelFor(location.hash);
    if (initial) {
      el.scrollLeft = initial.offsetLeft;
      target = el.scrollLeft;
    }

    // Native scrolling (touch, trackpad, focus moving between panels) resets the glide target.
    const onScroll = () => {
      if (!gliding) target = el.scrollLeft;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || root.classList.contains("intro")) return;
      const over = e.target as Element | null;
      if (over?.closest?.("dialog")) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientWidth : 1;
      const dy = e.deltaY * unit;
      if (canScrollInner(over, el, dy)) return;
      e.preventDefault();
      glide(target + dy * WHEEL_SPEED);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (root.classList.contains("intro") || document.querySelector("dialog[open]")) return;
      const on = e.target as Element | null;
      if (on?.closest?.("input, textarea, select")) return;
      const page = el.clientWidth;
      let next: number | undefined;
      switch (e.key) {
        case "ArrowRight":
          next = target + page * 0.6;
          break;
        case "ArrowLeft":
          next = target - page * 0.6;
          break;
        case "ArrowDown":
        case "ArrowUp": {
          const dir = e.key === "ArrowDown" ? 1 : -1;
          if (!canScrollInner(activePanel(), el, dir)) {
            next = target + dir * page * 0.6;
          }
          break;
        }
        case "PageDown":
          next = target + page * 0.9;
          break;
        case "PageUp":
          next = target - page * 0.9;
          break;
        case " ":
          if (!on?.closest?.("a, button, summary")) {
            next = target + (e.shiftKey ? -page : page) * 0.9;
          }
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = el.scrollWidth;
          break;
      }
      if (next === undefined) return;
      e.preventDefault();
      glide(next);
    };

    const onClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      const panel = link ? panelFor(link.hash) : null;
      if (!link || !panel) return;
      e.preventDefault();
      history.pushState(null, "", link.hash);
      glide(panel.offsetLeft);
      panel.focus({ preventScroll: true });
    };

    const onHistory = () => glide(panelFor(location.hash)?.offsetLeft ?? 0);
    const onGo = (e: Event) => glide((e as CustomEvent<number>).detail);

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onHistory);
    window.addEventListener("rail:go", onGo);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onHistory);
      window.removeEventListener("rail:go", onGo);
    };
  }, []);

  return (
    <main ref={rail} id="rail" className="rail">
      {children}
    </main>
  );
}
