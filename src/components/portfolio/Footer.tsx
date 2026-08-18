import Link from "next/link";

const linkClass =
  "font-mono text-xs tracking-widest uppercase text-[var(--color-on-surface-variant)] hover:text-[var(--color-neon-cyan)] transition-colors";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--color-outline)]/40 py-4 pb-16 text-center">
      <div className="flex items-center justify-center gap-4">
        <Link href="/privacy-policy" className={linkClass}>
          Privacy Policy
        </Link>
        <span className="text-[var(--color-outline)]" aria-hidden>
          |
        </span>
        <Link href="/disclaimer" className={linkClass}>
          Disclaimer
        </Link>
      </div>
    </footer>
  );
}
