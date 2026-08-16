"use client";

import Image from "next/image";
import { Briefcase, ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";

const activities = [
  {
    title: "BeachHacks",
    logo: "/beachhacks-logo.png",
    roles: [
      {
        title: "Sponsorship and Logistics Committee",
        period: "Sep 2025 - Mar 2026",
        skills: "Hackathon organizer and Funds Overseer",
      },
    ],
    color: "var(--color-neon-cyan)",
  },
  {
    title: "Dreams for schools",
    logo: "/dreams-for-schools-logo.png",
    roles: [
      {
        title: "Program Instructor",
        period: "Aug 2024 - Aug 2025",
        skills: "Taught STEM activities to elementary school students",
      },
    ],
    color: "var(--color-neon-pink)",
  },
];

export function Activities() {
  return (
    <section
      id="activities"
      className="py-28 md:py-32 relative overflow-hidden bg-transparent border-t-2 border-[var(--color-neon-pink)]"
    >
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--color-neon-pink)]/10 blur-[200px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <Reveal className="text-center mb-16 md:mb-24" y={30}>
          <div className="inline-block bg-[var(--color-neon-pink)] text-white px-7 py-2.5 cyber-clip-reverse font-[family-name:var(--font-display)] font-black uppercase tracking-widest text-base mb-6 shadow-[0_0_25px_rgba(255,0,60,0.6)] animate-pulse">
            OFF-GRID OPS
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-display)] font-black text-white tracking-tighter uppercase relative select-none">
            <span
              className="absolute left-[50%] top-[4px] -translate-x-[50%] text-transparent opacity-50 w-full whitespace-nowrap hidden md:block"
              style={{ WebkitTextStroke: "2px var(--color-neon-pink)" }}
            >
              EXTRA-CURRICULAR ACTIVITIES
            </span>
            EXTRA-CURRICULAR ACTIVITIES
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {activities.map((org, n) => (
            <Reveal
              key={org.title}
              y={40}
              delay={n * 0.1}
              className="relative z-10 w-full"
            >
              <div className="cyber-clip bg-black/60 border border-[var(--color-outline)] p-9 md:p-12 hover:bg-[var(--color-surface-container-high)] transition-all duration-300 relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity cyber-clip" />

                <div className="w-20 h-20 mb-6 bg-white rounded-sm flex items-center justify-center overflow-hidden border border-[var(--color-outline)]">
                  <Image
                    src={org.logo}
                    alt={`${org.title} logo`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-1.5"
                    unoptimized
                  />
                </div>

                <h3 className="text-3xl md:text-4xl font-[family-name:var(--font-display)] font-black text-white tracking-wider uppercase mb-8 pb-4 border-b border-dashed border-[var(--color-outline)] text-center md:text-left">
                  {org.title}
                </h3>

                <div className="flex flex-col gap-10">
                  {org.roles.map((role) => (
                    <div key={role.title} className="relative pl-1 md:pl-2">
                      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                        <div
                          className="bg-[var(--color-surface-container-highest)] inline-flex items-center gap-2 px-5 py-1.5 cyber-clip-reverse w-auto overflow-hidden self-start shadow-[0_0_15px_rgba(255,0,60,0.3)] border"
                          style={{ borderColor: `${org.color}80` }}
                        >
                          <Briefcase
                            className="w-4 h-4 shrink-0"
                            style={{ color: org.color }}
                          />
                          <span
                            className="font-mono text-sm md:text-base font-bold uppercase tracking-widest"
                            style={{ color: org.color }}
                          >
                            {role.title}
                          </span>
                        </div>
                        <p className="font-mono text-sm text-[var(--color-outline)] tracking-widest uppercase md:ml-auto shrink-0">
                          {role.period}
                        </p>
                      </div>

                      <p
                        className="text-[var(--color-on-surface-variant)] leading-relaxed font-[family-name:var(--font-body)] border-l-2 p-4 bg-[var(--color-surface-container-low)] text-base flex items-start gap-2"
                        style={{ borderColor: org.color }}
                      >
                        <ChevronRight
                          className="w-4 h-4 mt-1 shrink-0"
                          style={{ color: org.color }}
                        />
                        <span className="flex-1">{role.skills}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
