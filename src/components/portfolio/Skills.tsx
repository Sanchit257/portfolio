"use client";

import type { ReactNode } from "react";
import { Crosshair, Code2, Terminal } from "lucide-react";
import { Reveal } from "./Reveal";

const cyber = [
  "Networking Fundamentals",
  "Nmap",
  "Wireshark",
  "Tcpdump",
  "Cable Management",
  "Troubleshooting",
  "Virtualization",
  "Documentation",
  "Network Traffic Analysis",
];

const programming = [
  "Python",
  "JavaScript",
  "C/C++",
  "HTML5",
  "SQL",
  "JAVA",
  "BASH",
  "React",
];

const tools = [
  "GitHub/Git",
  "AWS",
  "Docker",
  "Linux",
  "Splunk",
  "Burp Suite",
  "Active Directory",
  "MS Azure",
  "MS & Google Suite",
];

export function Skills() {
  return (
    <section
      id="skills"
      className="py-28 md:py-32 relative overflow-hidden bg-transparent border-t-4 border-dashed border-[var(--color-outline)]"
    >
      <div className="absolute left-[-5%] top-[50%] -translate-y-1/2 font-[family-name:var(--font-display)] font-black text-[15vw] text-white opacity-[0.03] select-none pointer-events-none rotate-90 md:rotate-0 tracking-tighter">
        ARSENAL
      </div>

      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <Reveal className="text-right mb-16 md:mb-24" y={30}>
          <div className="inline-flex items-center justify-center bg-[var(--color-neon-cyan)] text-black px-5 py-1.5 cyber-clip font-[family-name:var(--font-display)] font-bold uppercase tracking-widest text-sm mb-5 shadow-[0_0_15px_rgba(0,240,255,0.6)]">
            WEAPONRY LOADOUT
          </div>
          <h2 className="text-6xl lg:text-8xl font-[family-name:var(--font-display)] font-black text-white tracking-tighter uppercase">
            <span className="text-[var(--color-neon-cyan)]">SKILLS</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <SkillCard
            title="Cyber"
            items={cyber}
            color="pink"
            icon={<Crosshair className="w-6 h-6" />}
            clip="reverse"
            delay={0}
          />
          <SkillCard
            title="PROGRAMMING Languages"
            items={programming}
            color="yellow"
            icon={<Code2 className="w-6 h-6" />}
            clip="normal"
            delay={0.1}
          />
          <SkillCard
            title="Tools"
            items={tools}
            color="cyan"
            icon={<Terminal className="w-6 h-6" />}
            clip="reverse"
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
}

function SkillCard({
  title,
  items,
  color,
  icon,
  clip,
  delay,
}: {
  title: string;
  items: string[];
  color: "pink" | "yellow" | "cyan";
  icon: ReactNode;
  clip: "normal" | "reverse";
  delay: number;
}) {
  const border =
    color === "pink"
      ? "border-[var(--color-neon-pink)] hover:bg-[var(--color-neon-pink)]/10"
      : color === "yellow"
        ? "border-[var(--color-neon-yellow)] hover:bg-[var(--color-neon-yellow)]/10"
        : "border-[var(--color-neon-cyan)] hover:bg-[var(--color-neon-cyan)]/10";

  const badge =
    color === "pink"
      ? "bg-[var(--color-neon-pink)]"
      : color === "yellow"
        ? "bg-[var(--color-neon-yellow)]"
        : "bg-[var(--color-neon-cyan)]";

  const hoverText =
    color === "pink"
      ? "group-hover:text-[var(--color-neon-pink)]"
      : color === "yellow"
        ? "group-hover:text-[var(--color-neon-yellow)]"
        : "group-hover:text-[var(--color-neon-cyan)]";

  const dot =
    color === "pink"
      ? "bg-[var(--color-neon-pink)]"
      : color === "yellow"
        ? "bg-[var(--color-neon-yellow)]"
        : "bg-[var(--color-neon-cyan)]";

  return (
    <Reveal
      delay={delay}
      y={40}
      className={`p-9 md:p-10 ${clip === "reverse" ? "cyber-clip-reverse" : "cyber-clip"} bg-[var(--color-surface-container-low)] border-2 ${border} transition-all duration-300 relative group min-h-[380px]`}
    >
      <div
        className={`absolute top-4 left-4 w-14 h-14 ${badge} ${clip === "normal" ? "cyber-clip-reverse" : "cyber-clip"} flex items-center justify-center text-black group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3
        className={`text-2xl md:text-3xl font-[family-name:var(--font-display)] font-black text-white tracking-widest uppercase mt-16 mb-8 text-right ${hoverText}`}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <div
            key={item}
            className="font-mono text-base text-[var(--color-on-surface-variant)] flex items-center justify-between border-b border-[var(--color-outline)] pb-1.5 group/skill"
          >
            <span className="group-hover/skill:text-white transition-colors">
              {item}
            </span>
            <span
              className={`w-2 h-2 ${dot} opacity-0 group-hover/skill:opacity-100 transition-opacity`}
            />
          </div>
        ))}
      </div>
    </Reveal>
  );
}
