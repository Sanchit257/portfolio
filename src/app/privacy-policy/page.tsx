import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/portfolio/Footer";
import { WavesBackground } from "@/components/portfolio/WavesBackground";

export const metadata: Metadata = {
  title: "Privacy Policy — Sanchit Kaushik",
  description: "Privacy policy for Sanchit Kaushik's portfolio website.",
};

const sections = [
  {
    title: "1. Information You Provide",
    body: "This website is a personal portfolio used for showcasing work. The only personal information collected is what you voluntarily enter into the contact form (your email address and message text). This data is processed through FormSubmit strictly to transmit your message directly to my inbox so I can respond to your inquiry. It is not stored in a database or used for marketing purposes.",
  },
  {
    title: "2. Automated Data Collection",
    body: "This website does not use tracking cookies or analytics software. However, because the site is hosted on Vercel, their servers automatically log standard, temporary technical data (such as your IP address) to ensure website security, reliability, and network stability.",
  },
  {
    title: "3. Third-Party Services",
    body: "Your data is handled exclusively by Vercel (for website hosting) and FormSubmit (for form delivery) to make this website function. Your information is never sold, rented, or shared with any other external third parties.",
  },
];

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>

        <div className="space-y-10 font-[family-name:var(--font-body)] text-base md:text-lg leading-relaxed">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-[family-name:var(--font-display)] font-bold text-white text-xl mb-4">
                {section.title}
              </h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
