"use client";

import Image from "next/image";
import { GithubIcon } from "./BrandIcons";
import { Reveal } from "./Reveal";

const projects = [
  {
    title: "Enterprise Active Directory Lab",
    tech: "Active Directory, Microsoft Azure",
    date: "August 2026",
    desc: [
      "Automated Active Directory user and group provisioning with PowerShell, replacing manual ADUC workflows with repeatable, scalable account-management scripts.",
      "Troubleshot account lockouts and GPO/RDP access issues by analyzing Active Directory logs, PowerShell/CMD diagnostics, and configuration settings to identify and resolve root causes.",
      "Configured and enforced Group Policy controls for password policies and endpoint restrictions across domain-joined clients, while deploying and troubleshooting the environment on Microsoft Azure infrastructure.",
    ],
    status: "OPERATIONAL",
    color: "var(--color-neon-pink)",
    showAccessData: true,
    githubUrl: "https://github.com/Sanchit257/AD-lab",
  },
  {
    title: "CEO Account Takeover",
    tech: "Wazuh GitHub",
    date: "July 2026",
    desc: [
      "Triaged and investigated simulated CEO account-takeover activity in Wazuh, analyzing authentication, account, file, and process events to distinguish relevant security activity from routine alerts.",
      "Developed and validated custom Wazuh detection rules for suspicious logins, administrator creation, sensitive file access, downloads, and process execution, troubleshooting detection and telemetry issues through repeatable attack simulations.",
      "Correlated endpoint events into an incident timeline using Python and FastAPI, enabling systematic investigation from initial authentication activity through post-compromise actions and supporting evidence-based incident reporting.",
    ],
    status: "OPERATIONAL",
    color: "var(--color-neon-cyan)",
    showAccessData: true,
    githubUrl: "https://github.com/Sanchit257/account-takeover-of-ceo",
  },
  {
    title: "Virtualized Pentesting and Threat Detection",
    tech: "Splunk, Burp, nmap",
    date: "July 2026",
    desc: [
      "Built and operated an isolated 4-VM cyber range to simulate realistic attacker and defender workflows across segmented virtualized infrastructure.",
      "Conducted reconnaissance and simulated web/remote exploitation against vulnerable systems, tracing attack activity across the environment to evaluate detection and response capabilities.",
      "Investigated attack telemetry using Suricata IDS and Splunk, correlating alerts into an incident timeline, documenting IOCs, identifying root causes, and developing remediation recommendations.",
    ],
    status: "OPERATIONAL",
    color: "var(--color-neon-pink)",
    showAccessData: true,
    githubUrl: "https://github.com/Sanchit257/cyber_range",
  },
  {
    title: "Self-Hosted Minecraft Server",
    tech: "Linux, Cable Management, Troubleshooting",
    date: "June 2026",
    desc: [
      "Engineered & Deployed Dedicated Linux Infrastructure: Hosted a dedicated Minecraft server environment on Ubuntu Linux using Crafty Controller, managing system background services (systemctl), background process isolation, and resource allocation.",
      "Configured Zero-Trust Network Tunneling: Implemented secure WAN connectivity and automated port forwarding via Playit.gg, enabling low-latency remote user access without exposing local network infrastructure to direct public inbound routes.",
      "Automated System Resiliency & Power Management: Authored system-level service configurations and power policy overrides to guarantee high availability, enabling automated boot-time initialization, auto-recovery upon host restarts, and continuous 24/7 server uptime.",
    ],
    status: "OPERATIONAL",
    color: "var(--color-neon-cyan)",
    showAccessData: false,
    githubUrl: undefined,
  },
];

export function Projects() {
  return (
    <section
      id="projects"
      className="py-28 md:py-32 relative overflow-hidden bg-transparent"
    >
      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <Reveal
          className="text-left mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6"
          y={30}
        >
          <div>
            <div className="inline-flex items-center justify-center bg-[var(--color-neon-yellow)] text-black px-5 py-1.5 cyber-clip font-[family-name:var(--font-display)] font-bold uppercase tracking-widest text-sm mb-5 shadow-[0_0_15px_rgba(252,238,10,0.6)]">
              SECURITY ARCHITECTURES
            </div>
            <h2 className="text-6xl lg:text-8xl font-[family-name:var(--font-display)] font-black text-white tracking-tighter uppercase relative">
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px var(--color-neon-cyan)" }}
              >
                PROJECTS
              </span>
            </h2>
          </div>
          <div className="hidden md:block w-32 h-2 bg-gradient-to-r from-[var(--color-neon-cyan)] to-transparent cyber-clip mb-4" />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, n) => {
            const isRed = n % 2 === 0;

            return (
              <Reveal
                key={project.title}
                delay={n * 0.1}
                y={40}
                className="relative group flex flex-col min-h-[440px]"
              >
                <div
                  className={`absolute inset-0 bg-[var(--color-surface-container-low)] ${isRed ? "cyber-clip" : "cyber-clip-reverse"} group-hover:bg-[var(--color-surface-container-high)] transition-all duration-300`}
                />
                <div
                  className={`absolute inset-[-2px] border-2 bg-transparent pointer-events-none ${isRed ? "cyber-clip border-[var(--color-neon-pink)]" : "cyber-clip-reverse border-[var(--color-neon-cyan)]"} opacity-50 group-hover:opacity-100 transition-opacity`}
                />

                <div className="relative z-10 p-9 md:p-11 flex flex-col h-full flex-1">
                  <div className="flex justify-between items-start mb-8 border-b border-dashed border-[var(--color-outline)] pb-6 gap-4">
                    <div
                      className={`w-16 h-16 bg-black flex items-center justify-center border shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0 overflow-hidden ${isRed ? "cyber-clip-reverse" : "cyber-clip"}`}
                      style={{ borderColor: project.color }}
                    >
                      <Image
                        src={
                          isRed
                            ? "/project-icon-red-v2.png"
                            : "/project-icon-blue-v2.png"
                        }
                        alt=""
                        width={56}
                        height={56}
                        className="w-12 h-12 object-contain"
                        unoptimized
                      />
                    </div>
                    <div
                      className="px-4 py-1.5 bg-black text-white text-xs uppercase tracking-wider font-bold border-b-2 text-right"
                      style={{ borderColor: project.color }}
                    >
                      {project.date} // {project.tech}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3
                      className="text-3xl md:text-4xl font-[family-name:var(--font-display)] font-black text-white mb-6 uppercase tracking-wider"
                      style={{ textShadow: `0 0 10px ${project.color}` }}
                    >
                      {project.title}
                    </h3>

                    <div className="space-y-4 mb-10 flex-1">
                      {project.desc.map((line) => (
                        <div
                          key={line.slice(0, 40)}
                          className="flex items-start gap-3 text-base font-[family-name:var(--font-body)] text-[var(--color-on-surface-variant)] leading-relaxed bg-black/40 p-4 border-l-2"
                          style={{ borderColor: project.color }}
                        >
                          <p>{line}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-[var(--color-outline)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 animate-ping"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-sm font-mono uppercase tracking-widest text-white font-bold">
                          {project.status}
                        </span>
                      </div>
                      {project.showAccessData && project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center px-6 py-3.5 bg-[var(--color-surface-container-highest)] border border-[var(--color-outline)] text-white hover:bg-white hover:text-black transition-all duration-300 cyber-clip uppercase font-bold text-sm"
                        >
                          Access Data <GithubIcon className="w-4 h-4 ml-2" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
