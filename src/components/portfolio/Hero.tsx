"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Activity } from "lucide-react";

function TelemetryFeed() {
  const stamp = () =>
    new Date()
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .toLowerCase();

  const lines = [
    "[system] > Initializing packet inspection engine... [OK]",
    "[network] > Detecting active nodes on subnet 192.168.1.0/24",
    "[security] > Brute-force attempt blocked from IP: 45.122.3.10",
    "[firewall] > Updating iptables: Dropping unauthorized SSH",
    "[monitor] > High traffic volume detected on interface eth0",
    "[system] > Memory integrity check: 0 errors found",
    "[vulnerability] > Running Nmap scan... 42% complete",
    "[tunnel] > Data Bridge connection established via secure WS",
    "[auth] > Successful login: user 'rohit' from local terminal",
    "[kernel] > Monitoring system entropy for crypto ops",
    "[threat_intel] > Synchronizing global threat signatures... [DONE]",
    "[heartbeat] > Node status: 0 packets dropped | Latency: 12ms",
  ];

  const [feed, setFeed] = useState([
    `[${stamp()}] [system] > Initializing packet inspection... [OK]`,
    `[${stamp()}] [network] > Detecting active nodes on subnet...`,
    `[${stamp()}] [security] > Firewall rules synchronized.`,
  ]);
  const last = useRef(-1);

  useEffect(() => {
    const id = setInterval(() => {
      let next: number;
      do {
        next = Math.floor(Math.random() * lines.length);
      } while (next === last.current);
      last.current = next;
      setFeed((prev) => [...prev, `[${stamp()}] ${lines[next]}`].slice(-5));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-black/40 border border-[#00ff41]/20 p-5 rounded-sm font-mono text-xs md:text-sm leading-relaxed shadow-[inset_0_0_20px_rgba(0,255,65,0.05)] mt-4">
      <div className="flex items-center gap-2 mb-3 text-[#00ff41]/60 font-bold border-b border-[#00ff41]/10 pb-1">
        <Activity size={16} /> LIVE_TELEMETRY_FEED
      </div>
      <div className="space-y-1.5">
        {feed.map((line, i) => (
          <div
            key={`${line}-${i}`}
            className={`${
              i === feed.length - 1 ? "text-[#00ff41]" : "text-[#00ff41]/40"
            } transition-all duration-500`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] w-full flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="z-10 w-full max-w-[90rem] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-16 lg:gap-20 mt-16 md:mt-0">
        <div className="flex-1 text-left flex flex-col items-start relative pb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 font-mono text-sm md:text-base tracking-widest text-[var(--color-neon-yellow)] uppercase flex items-center gap-4 bg-black/50 p-2.5 cyber-clip backdrop-blur-md border border-[var(--color-neon-yellow)]/50"
          >
            <span className="w-2.5 h-2.5 bg-[var(--color-neon-yellow)] animate-ping" />
            CYBER_SEC_ENGINEER // V4.0
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative font-[family-name:var(--font-display)] font-black text-7xl md:text-[5.5rem] lg:text-[8rem] leading-[0.9] uppercase tracking-tighter"
          >
            <div className="flex flex-col">
              <div
                className="glitch text-glow-pink text-[var(--color-neon-pink)]"
                data-text="SANCHIT"
              >
                SANCHIT
              </div>
              <div
                className="glitch text-glow-cyan text-[var(--color-neon-cyan)] ml-8 md:ml-16"
                data-text="KAUSHIK"
              >
                KAUSHIK
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-[var(--color-on-surface-variant)] max-w-2xl font-mono mt-8 bg-black/60 p-5 border-l-4 border-[var(--color-neon-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.1)]"
          >
            IT Specialist & Consultant | Software Developer | Cybersecurity
            Enthusiast
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 flex flex-wrap gap-6"
          >
            <a
              href="#projects"
              className="cyber-clip px-8 md:px-12 py-4 md:py-5 bg-[var(--color-neon-yellow)] text-black font-[family-name:var(--font-display)] font-black text-base md:text-xl tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(252,238,10,0.6)]"
            >
              PROJECTS
            </a>
            <a
              href="#contact"
              className="cyber-clip-reverse px-8 md:px-12 py-4 md:py-5 bg-transparent border-2 border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] font-[family-name:var(--font-display)] font-black text-base md:text-xl tracking-widest uppercase hover:bg-[var(--color-neon-cyan)] hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all"
            >
              CONTACT
            </a>
            <a
              href="https://docs.google.com/document/d/1oNGmw424dvk0vCn397BmEJdtBgCNMYr2MjYfGfRhaiM/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="cyber-clip px-8 md:px-12 py-4 md:py-5 bg-[var(--color-neon-pink)] text-white font-[family-name:var(--font-display)] font-black text-base md:text-xl tracking-widest uppercase hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(255,0,60,0.6)]"
            >
              RESUME
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative max-w-[360px] md:max-w-[480px] w-full aspect-[4/5] flex items-center justify-center"
        >
          <div className="absolute inset-0 cyber-clip bg-[var(--color-neon-pink)]/20 shadow-[0_0_30px_rgba(255,0,60,0.4)] animate-pulse" />
          <div className="absolute inset-2 cyber-clip-reverse border-2 border-[var(--color-neon-cyan)] z-10" />
          <div className="absolute inset-4 cyber-clip overflow-hidden bg-[var(--color-surface-container-high)] z-20">
            <Image
              src="/profile-photo.png"
              alt="Sanchit Kaushik"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 360px, 480px"
              priority
              unoptimized
            />
          </div>
          <div className="absolute top-10 -left-6 bg-black border border-[var(--color-neon-pink)] px-4 py-1.5 z-30 font-mono text-[var(--color-neon-pink)] text-sm tracking-widest uppercase">
            RHCSA // VALID
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-neon-pink)]/20 to-transparent pointer-events-none mix-blend-screen" />
    </section>
  );
}

export { TelemetryFeed };
