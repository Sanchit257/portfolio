"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";

/**
 * The hero photo is an orange duotone. Over it, a scope lens follows the cursor
 * and shows the untreated photo through the glass.
 */
export function OperatorCard() {
  const card = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = card.current;
    if (!el || e.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--ly", `${e.clientY - rect.top}px`);
    el.dataset.scoped = "true";
  };

  return (
    <div
      ref={card}
      className="operator"
      onPointerMove={onMove}
      onPointerLeave={() => {
        if (card.current) card.current.dataset.scoped = "false";
      }}
    >
      <div className="operator-duo">
        <Image
          src="/profile-photo.png"
          alt="Sanchit Kaushik"
          fill
          priority
          sizes="(max-width: 900px) 70vw, 46vw"
          className="operator-img"
        />
      </div>
      <div className="operator-scope" aria-hidden>
        <Image
          src="/profile-photo.png"
          alt=""
          fill
          sizes="(max-width: 900px) 70vw, 46vw"
          className="operator-img-true"
        />
      </div>
      <div className="operator-lens" aria-hidden>
        <span>IDENTITY CONFIRMED</span>
      </div>
      <div className="operator-glint" aria-hidden />
    </div>
  );
}
