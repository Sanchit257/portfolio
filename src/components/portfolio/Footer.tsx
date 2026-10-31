import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <nav aria-label="Legal">
        <Link href="/privacy-policy">Privacy Policy</Link>
        <span aria-hidden>|</span>
        <Link href="/disclaimer">Disclaimer</Link>
      </nav>
      <p>
        Unofficial tribute styling. Not affiliated with or endorsed by Activision
        or the Call of Duty franchise.
      </p>
    </footer>
  );
}
