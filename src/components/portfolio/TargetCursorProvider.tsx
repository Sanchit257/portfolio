"use client";

import TargetCursor from "@/components/TargetCursor";

const INTERACTIVE_SELECTOR =
  "a, button, input, textarea, select, label, .cursor-target";

export function TargetCursorProvider() {
  return (
    <TargetCursor
      targetSelector={INTERACTIVE_SELECTOR}
      spinDuration={2}
      hideDefaultCursor
      parallaxOn
      cursorColor="#ffffff"
      cursorColorOnTarget="#00f0ff"
    />
  );
}
