"use client";

import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <section
      id="experience"
      className="py-28 md:py-32 relative overflow-hidden bg-transparent border-t-2 border-[var(--color-neon-purple)]"
    >
      <div className="container mx-auto px-6 md:px-8 max-w-6xl relative z-10">
        <Reveal className="text-center mb-16 md:mb-24 relative" y={30}>
          <div className="inline-flex items-center justify-center bg-[var(--color-neon-purple)] text-white px-5 py-1.5 cyber-clip font-[family-name:var(--font-display)] font-bold uppercase tracking-widest text-sm mb-5 shadow-[0_0_15px_rgba(176,38,255,0.6)]">
            FIELD DEPLOYMENT
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-[5.5rem] font-[family-name:var(--font-display)] font-black text-white tracking-tighter uppercase">
            COMBAT{" "}
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px var(--color-neon-purple)" }}
            >
              TRAINING
            </span>
          </h2>
        </Reveal>

        <div className="relative px-4 md:px-0 max-w-5xl mx-auto">
          <div className="absolute left-[15px] md:left-[39px] top-6 bottom-6 w-1 bg-[var(--color-outline)]">
            <div className="absolute top-0 w-full h-1/2 bg-[var(--color-neon-cyan)] animate-pulse shadow-[0_0_10px_var(--color-neon-cyan)]" />
          </div>

          <Reveal x={-20} y={0} className="relative pl-12 md:pl-24 mb-16">
            <div className="absolute left-[-2px] md:left-[22px] top-[40px] w-10 h-10 bg-black border-2 border-[var(--color-neon-cyan)] flex items-center justify-center z-10 cyber-clip -translate-y-1/2">
              <div className="w-3.5 h-3.5 bg-[var(--color-neon-cyan)] shadow-[0_0_10px_var(--color-neon-cyan)]" />
            </div>

            <div className="cyber-clip-reverse bg-[var(--color-surface-container-low)] p-9 md:p-14 border-l-4 border-[var(--color-neon-cyan)] hover:bg-[var(--color-surface-container-high)] transition-all duration-500 group relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--color-neon-cyan)] to-transparent opacity-20 group-hover:opacity-50 transition-opacity" />

              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 relative z-10 border-b border-[var(--color-outline)] pb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] font-black text-white tracking-widest uppercase mb-2">
                    IT Consultant @ EZ IT Consulting
                  </h3>
                  <p className="text-[var(--color-neon-cyan)] font-mono text-sm font-bold bg-black inline-block px-2.5 py-1">
                    Cypress, CA
                  </p>
                </div>
                <div className="bg-[var(--color-neon-purple)] text-white px-5 py-2.5 cyber-clip flex items-center justify-center min-w-[130px] shadow-[0_0_10px_rgba(176,38,255,0.4)]">
                  <span className="text-sm font-bold tracking-wider uppercase">
                    August 2026 - Current
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-base font-mono text-[var(--color-on-surface-variant)] mb-8 leading-relaxed relative z-10">
                <p>
                  &gt;{" "}
                  <a
                    href="https://ez-it-consulting.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-neon-cyan)] hover:text-white underline underline-offset-4 decoration-[var(--color-neon-cyan)]/60"
                  >
                    Free IT consulting service — ez-it-consulting.vercel.app
                  </a>
                </p>
                <p>
                  &gt; Diagnose technical problems by gathering information
                  about the issue, identifying symptoms, and narrowing down
                  potential causes.
                </p>
                <p>
                  &gt; Troubleshoot hardware, operating system, software, and
                  connectivity problems using a structured, step-by-step
                  approach.
                </p>
                <p>
                  &gt; Review wireless network configurations for common
                  security weaknesses.
                </p>
                <p>
                  &gt; Review systems for outdated operating systems,
                  applications, and network-device firmware.
                </p>
                <p>
                  &gt; Configure stronger Wi-Fi passwords and secure
                  administrative credentials.
                </p>
                <p>
                  &gt; Recommend practical improvements such as stronger
                  authentication, firmware updates, network segmentation, and
                  disabling unnecessary services when appropriate.
                </p>
              </div>

              <div className="pt-6 flex flex-wrap gap-3 relative z-10 items-center w-full">
                <span className="text-sm font-[family-name:var(--font-display)] font-black uppercase text-black bg-[var(--color-neon-cyan)] hover:bg-white transition-colors cyber-clip px-4 py-2 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                  IT Support
                </span>
                <span className="text-sm font-[family-name:var(--font-display)] font-black uppercase text-black bg-[var(--color-neon-yellow)] hover:bg-white transition-colors cyber-clip px-4 py-2 shadow-[0_0_10px_rgba(252,238,10,0.3)]">
                  Networking
                </span>
                <span className="text-sm font-[family-name:var(--font-display)] font-black uppercase text-black bg-[var(--color-neon-pink)] hover:bg-white transition-colors cyber-clip px-4 py-2 shadow-[0_0_10px_rgba(255,0,60,0.3)]">
                  Security
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal x={-20} y={0} className="relative pl-12 md:pl-24 mb-12">
            <div className="absolute left-[-2px] md:left-[22px] top-[40px] w-10 h-10 bg-black border-2 border-[var(--color-neon-cyan)] flex items-center justify-center z-10 cyber-clip -translate-y-1/2">
              <div className="w-3.5 h-3.5 bg-[var(--color-neon-cyan)] shadow-[0_0_10px_var(--color-neon-cyan)]" />
            </div>

            <div className="cyber-clip-reverse bg-[var(--color-surface-container-low)] p-9 md:p-14 border-l-4 border-[var(--color-neon-cyan)] hover:bg-[var(--color-surface-container-high)] transition-all duration-500 group relative">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--color-neon-cyan)] to-transparent opacity-20 group-hover:opacity-50 transition-opacity" />

              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 relative z-10 border-b border-[var(--color-outline)] pb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] font-black text-white tracking-widest uppercase mb-2">
                    AWS x DxHub Summer Camp
                  </h3>
                  <p className="text-[var(--color-neon-cyan)] font-mono text-sm font-bold bg-black inline-block px-2.5 py-1">
                    California PolyTechnic University, San Luis Obispo
                  </p>
                </div>
                <div className="bg-[var(--color-neon-purple)] text-white px-5 py-2.5 cyber-clip flex items-center justify-center min-w-[130px] shadow-[0_0_10px_rgba(176,38,255,0.4)]">
                  <span className="text-sm font-bold tracking-wider uppercase">
                    June 2026 - July 2026
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-base font-mono text-[var(--color-on-surface-variant)] mb-8 leading-relaxed relative z-10">
                <p>
                  &gt; Led stakeholder discovery calls with the Dean of CSU
                  Bakersfield to identify student advising pain points and
                  translate them into technical project requirements
                </p>
                <p>
                  &gt; Developed a 100% scalable full-stack web application on
                  AWS that dynamically generates block schedules and
                  prerequisite maps for incoming students
                </p>
                <p>
                  &gt; Built a RAG pipeline for CSUB faculty enabling
                  personalized, AI-driven course guidance for over 1,000
                  incoming freshmen each year
                </p>
                <p>
                  &gt; Collaborated cross-functionally with university
                  leadership, faculty, and engineers to deliver a
                  production-ready solution within a compressed timeline
                </p>
                <p>
                  &gt; Gained hands-on experience with AWS cloud infrastructure,
                  full-stack development, and AI-driven application design in a
                  real-world client engagement
                </p>
              </div>

              <div className="pt-6 flex flex-wrap gap-3 relative z-10 items-center w-full">
                <span className="text-sm font-[family-name:var(--font-display)] font-black uppercase text-black bg-[var(--color-neon-cyan)] hover:bg-white transition-colors cyber-clip px-4 py-2 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                  AWS
                </span>
                <span className="text-sm font-[family-name:var(--font-display)] font-black uppercase text-black bg-[var(--color-neon-yellow)] hover:bg-white transition-colors cyber-clip px-4 py-2 shadow-[0_0_10px_rgba(252,238,10,0.3)]">
                  Full-Stack Web Dev
                </span>
                <span className="text-sm font-[family-name:var(--font-display)] font-black uppercase text-black bg-[var(--color-neon-pink)] hover:bg-white transition-colors cyber-clip px-4 py-2 shadow-[0_0_10px_rgba(255,0,60,0.3)]">
                  AI-Engineering
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
