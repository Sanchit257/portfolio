"use client";

import { useEffect, useState } from "react";
import TargetCursor from "@/components/TargetCursor";
import {
  brightenToNeon,
  getActiveSectionId,
  SECTION_LINE_COLORS,
  DEFAULT_LINE,
} from "@/lib/section-theme";

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, select, label, .cursor-target";

export function TargetCursorProvider() {
  const [cursorColor, setCursorColor] = useState(() =>
    brightenToNeon(DEFAULT_LINE),
  );

  useEffect(() => {
    const update = () => {
      const id = getActiveSectionId();
      setCursorColor(brightenToNeon(SECTION_LINE_COLORS[id] ?? DEFAULT_LINE));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const retry = window.setInterval(update, 400);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearInterval(retry);
    };
  }, []);

  return (
    <TargetCursor
      targetSelector={INTERACTIVE_SELECTOR}
      spinDuration={2}
      hideDefaultCursor
      parallaxOn
      cursorColor={cursorColor}
      cursorColorOnTarget={cursorColor}
    />
  );
}
