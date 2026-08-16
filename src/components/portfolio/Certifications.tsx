"use client";

import Image from "next/image";
import { BadgeCheck, Download } from "lucide-react";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Reveal } from "./Reveal";

const certifications = [
  {
    title: "CompTIA Network+",
    issuer: "(N10-009)",
    date: "VERIFIED",
    type: "CERTIFIED",
    color: "var(--color-neon-cyan)",
    image: "/comptia-network-plus.png",
    certificateUrl: "/CompTIA-Network-Plus-Certificate.pdf",
    certificateName: "CompTIA-Network-Plus-Certificate.pdf",
  },
  {
    title: "Cisco Certified Network Associate",
    issuer: "(200-301)(IN PROGRESS)",
    date: "IN PROGRESS",
    type: "IN PROGRESS",
    color: "var(--color-neon-pink)",
    image: "/ccna-badge.png",
    certificateUrl: null,
    certificateName: null,
  },
];

export function Certifications() {
  return (
    <section
      id="certifications"
      className="py-28 md:py-32 relative overflow-hidden bg-transparent border-t border-dashed border-[var(--color-neon-cyan)]"
    >
      <h2
        className="absolute top-[20%] left-[-2%] text-[20vw] font-[family-name:var(--font-display)] font-black text-transparent opacity-20 pointer-events-none tracking-tighter"
        style={{
          WebkitTextStroke: "2px var(--color-surface-container-highest)",
        }}
      >
        CREDENTIALS
      </h2>

      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <Reveal
          className="text-right mb-16 md:mb-24 flex flex-col items-end"
          y={30}
        >
          <div className="inline-block bg-[var(--color-neon-yellow)] text-black px-5 py-1.5 cyber-clip-reverse font-[family-name:var(--font-display)] font-bold uppercase tracking-widest text-sm mb-5 shadow-[0_0_15px_rgba(252,238,10,0.6)] animate-pulse">
            VERIFIED CLEARANCES
          </div>
          <h2 className="text-6xl lg:text-8xl font-[family-name:var(--font-display)] font-black text-white tracking-tighter uppercase">
            CERTIF
            <span className="text-[var(--color-neon-yellow)]">ICATES</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {certifications.map((cert, n) => (
            <Reveal
              key={cert.title}
              delay={n * 0.1}
              y={30}
              className="relative group h-full flex flex-col"
            >
              <div className="absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-transparent via-[var(--color-outline)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="cyber-clip bg-[var(--color-surface-container-low)] border border-[var(--color-outline)] p-9 hover:bg-[var(--color-surface-container-high)] hover:border-[var(--color-neon-yellow)] transition-all duration-300 flex-1 flex flex-col relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-2xl" />

                {cert.image ? (
                  <div className="w-full h-44 mb-8 bg-white/95 border border-[var(--color-outline)] flex items-center justify-center overflow-hidden group-hover:border-white transition-colors">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      width={280}
                      height={176}
                      className="h-full w-auto object-contain p-3"
                      unoptimized
                    />
                  </div>
                ) : (
                  <ImagePlaceholder
                    label="CERTIFICATE IMAGE"
                    className="w-full h-44 mb-8 group-hover:border-white text-sm"
                  />
                )}

                <div
                  className="w-14 h-14 flex items-center justify-center mb-6 bg-black border"
                  style={{ borderColor: cert.color }}
                >
                  <BadgeCheck
                    className="w-7 h-7"
                    style={{ color: cert.color }}
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] font-black text-white mb-2 uppercase tracking-wide">
                  {cert.title}
                </h3>
                <p className="font-mono text-[var(--color-on-surface-variant)] text-base mb-6 pb-6 border-b border-dashed border-[var(--color-outline)]">
                  {cert.issuer}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                  <span className="font-mono text-sm uppercase tracking-widest text-[#00ff41] font-bold px-2.5 py-1 bg-black border border-[#00ff41]/50">
                    {cert.date}
                  </span>
                  <span
                    className="text-sm font-bold truncate max-w-[120px]"
                    style={{ color: cert.color }}
                  >
                    {cert.type}
                  </span>
                </div>

                {cert.certificateUrl && (
                  <a
                    href={cert.certificateUrl}
                    download={cert.certificateName ?? true}
                    className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 border border-[var(--color-neon-yellow)] text-[var(--color-neon-yellow)] font-mono tracking-widest text-sm uppercase hover:bg-[var(--color-neon-yellow)] hover:text-black transition-all shadow-[0_0_15px_rgba(252,238,10,0.25)]"
                  >
                    <Download className="w-4 h-4" />
                    View Certificate
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
