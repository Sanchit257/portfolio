import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/portfolio/Footer";
import { WavesBackground } from "@/components/portfolio/WavesBackground";

export const metadata: Metadata = {
  title: "Disclaimer — Sanchit Kaushik",
  description:
    "Disclaimer regarding external links and consulting services on Sanchit Kaushik's portfolio website.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen text-[var(--color-on-surface-variant)] relative bg-transparent">
      <WavesBackground />
      <main className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 py-24 md:py-32">
        <Link
          href="/"
          className="inline-block mb-10 font-mono text-xs tracking-widest uppercase text-[var(--color-neon-cyan)] hover:text-white transition-colors"
        >
          ← Back to portfolio
        </Link>

        <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-display)] font-black text-white uppercase tracking-tight mb-12">
          Disclaimer
        </h1>

        <p className="font-[family-name:var(--font-body)] text-base md:text-lg leading-relaxed">
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
