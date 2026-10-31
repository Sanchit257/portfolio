import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/portfolio/Footer";

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
    <div className="legal-page">
      <main className="wrap max-w-3xl py-24 md:py-32">
        <Link href="/" className="legal-back">
          ← Back to portfolio
        </Link>
        <h1 className="legal-title">Privacy Policy</h1>
        <div className="space-y-10 text-lg leading-relaxed">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="legal-heading">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
