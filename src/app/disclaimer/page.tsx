import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/portfolio/Footer";

export const metadata: Metadata = {
  title: "Disclaimer — Sanchit Kaushik",
  description:
    "Disclaimer regarding external links and consulting services on Sanchit Kaushik's portfolio website.",
};

export default function DisclaimerPage() {
  return (
    <div className="legal-page">
      <main className="wrap max-w-3xl py-24 md:py-32">
        <Link href="/" className="legal-back">
          ← Back to portfolio
        </Link>
        <h1 className="legal-title">Disclaimer</h1>
        <p className="text-lg leading-relaxed">
          Links to my consulting services and all content on this site are
          provided for informational and educational purposes only. Services are
          provided free of charge, &quot;as is,&quot; without any express or
          implied warranties.
        </p>
      </main>
      <Footer />
    </div>
  );
}
