"use client";

import {
  Download,
  Mail,
  MapPin,
  Shield,
  Terminal,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import { TelemetryFeed } from "./Hero";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { Reveal } from "./Reveal";

const RESUME_URL =
  "https://docs.google.com/document/d/1oNGmw424dvk0vCn397BmEJdtBgCNMYr2MjYfGfRhaiM/edit?usp=sharing";

export function About() {
  return (
    <section
      id="about"
      className="py-28 md:py-32 relative overflow-hidden bg-transparent border-t-2 border-[var(--color-neon-pink)]"
    >

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[90rem]">
        <Reveal className="mb-16 md:mb-20 text-center" y={20}>
          <div className="inline-flex items-center justify-center bg-[var(--color-neon-pink)] text-black px-5 py-1.5 cyber-clip font-[family-name:var(--font-display)] font-bold uppercase tracking-widest text-sm mb-5 shadow-[0_0_15px_rgba(255,0,60,0.4)]">
            USER_PROFILE: DEPLOYED
          </div>
          <h2 className="text-6xl lg:text-8xl font-[family-name:var(--font-display)] font-black text-white tracking-tighter uppercase">
            ABOUT.
            <span className="text-[var(--color-neon-pink)]">ME</span>
          </h2>
        </Reveal>

        <Reveal y={30} className="w-full flex flex-col lg:flex-row border border-[#00ff41] bg-black/80 rounded-sm shadow-[0_0_30px_rgba(0,255,65,0.15)] overflow-hidden">
          <div className="lg:w-1/3 flex flex-col items-center justify-center p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-[#00ff41]/50 relative">
            <div className="absolute inset-0 bg-[#00ff41]/5 blur-3xl rounded-full pointer-events-none" />

            <div className="relative w-56 h-56 mb-8">
              <div className="absolute inset-0 bg-[#00ff41] blur-md opacity-20 animate-pulse pointer-events-none" />
              <div
                className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black"
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <Image
                  src="/cyber-avatar.png"
                  alt="Sanchit Kaushik cyber avatar"
                  width={224}
                  height={224}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div
                className="absolute inset-0 border-2 border-[#00ff41] pointer-events-none"
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  boxShadow: "inset 0 0 20px #00ff41",
                }}
              />
            </div>

            <div className="flex items-center gap-2 mb-8 bg-[#002200] px-5 py-1.5 border border-[#00ff41]/30 rounded-full">
              <span className="w-2.5 h-2.5 bg-[#00ff41] rounded-full animate-ping shadow-[0_0_10px_#00ff41]" />
              <span className="text-[#00ff41] font-mono text-sm font-bold tracking-widest">
                ONLINE
              </span>
            </div>

            <h3 className="text-4xl font-mono font-bold text-white mb-6 text-center">
              IT Specialist
            </h3>

            <div className="flex flex-col gap-4 text-left w-full max-w-[320px]">
              <div className="flex items-center gap-3 text-[#00ff41] font-mono text-base">
                <MapPin className="w-5 h-5 shrink-0" />
                <span>Cypress, CA, United States of America</span>
              </div>
              <div className="flex items-center gap-3 text-[#00ff41] font-mono text-base">
                <Shield className="w-5 h-5 shrink-0" />
                <span>
                  IT Specialist & Consultant | Software Developer |
                  Cybersecurity Enthusiast
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#00ff41] font-mono text-base mt-2">
                <Terminal className="w-5 h-5 shrink-0" />
                <span>&gt;_ Shell: ZSH // BASH</span>
              </div>
            </div>

            <div className="flex gap-4 mt-8 mb-10 w-full justify-center">
              <a
                href="https://github.com/Sanchit257"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="w-14 h-14 flex items-center justify-center border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors rounded-sm shadow-[0_0_10px_rgba(0,255,65,0.2)]"
              >
                <GithubIcon className="w-6 h-6" />
              </a>
              <a
                href="http://www.linkedin.com/in/sanchitka"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="w-14 h-14 flex items-center justify-center border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors rounded-sm shadow-[0_0_10px_rgba(0,255,65,0.2)]"
              >
                <LinkedinIcon className="w-6 h-6" />
              </a>
              <a
                href="mailto:sk010us@gmail.com"
                aria-label="Email Contact"
                className="w-14 h-14 flex items-center justify-center border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors rounded-sm shadow-[0_0_10px_rgba(0,255,65,0.2)]"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>

            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 border border-[#00ff41] text-[#00ff41] font-mono tracking-widest text-base hover:bg-[#00ff41] hover:text-black transition-all hover:shadow-[0_0_20px_#00ff41] group"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              DOWNLOAD RESUME
            </a>
          </div>

          <div className="lg:w-2/3 flex flex-col font-mono relative bg-black">
            <div className="flex items-center justify-between px-6 md:px-8 py-4 bg-[#111111] border-b border-[#00ff41]/50">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="text-[var(--color-on-surface-variant)] text-sm tracking-widest select-none">
                ROOT@IDENTITY:~
              </div>
              <div className="w-5 h-5 text-[#00ff41]">
                <Terminal className="w-full h-full" />
              </div>
            </div>

            <div
              className="pt-5 pb-10 px-6 lg:pt-8 lg:pb-14 lg:px-14 flex-1 flex flex-col gap-10 overflow-y-auto overflow-x-hidden text-base"
              style={{ maxHeight: "860px" }}
            >
              <div className="flex flex-col gap-4 relative">
                <div className="flex items-start gap-2 text-base md:text-lg">
                  <span className="text-[#00ff41] font-bold">➜</span>
                  <span className="text-[#2094f3] font-bold">~</span>
                  <span className="text-white font-bold ml-1">
                    whoami --verbose
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed max-w-3xl pl-4 md:pl-6 pt-2 text-base md:text-lg">
                  I am Sanchit Kaushik, a full-time{" "}
                  <span className="text-[#00ff41] font-bold">
                    Computer Science student
                  </span>{" "}
                  with a focus and passion in{" "}
                  <span className="text-[#00ff41] font-bold">Cybersecurity</span>{" "}
                  at California State University, Long Beach.
                  <br />
                  <br />
                  My journey involves maintaining networks, analyzing network
                  attacks, mastering scripting for automation, homelabbing, and
                  building scalable websites in the cloud. I am a firm believer
                  in life-long learning, so I am constantly picking up new
                  things everyday, while refreshing things from the past as
                  well.
                </p>
              </div>

              <div className="flex flex-col gap-4 relative">
                <div className="flex items-start gap-2 text-base md:text-lg">
                  <span className="text-[#00ff41] font-bold">➜</span>
                  <span className="text-[#2094f3] font-bold">~</span>
                  <span className="text-white font-bold ml-1">
                    ls -la ./education/
                  </span>
                </div>
                <div className="pl-4 md:pl-6 pt-2 max-w-md">
                  <Reveal
                    y={24}
                    delay={0.05}
                    className="border border-[#00ff41]/50 bg-black p-5 rounded-sm flex gap-3 items-start group hover:bg-[#002200] transition-colors"
                  >
                    <GraduationCap className="w-7 h-7 text-[#00ff41] shrink-0" />
                    <div>
                      <div className="text-[#00ff41] font-bold text-base mb-1 line-clamp-1">
                        BS_CS.deg
                      </div>
                      <div className="text-sm text-gray-400">CSULB</div>
                      <div className="text-sm text-[#2094f3] mt-2">
                        GPA: 3.5 | Since 2024
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>

              <TelemetryFeed />

              <div className="flex items-center gap-2 mt-4 text-base md:text-lg">
                <span className="text-[#00ff41] font-bold">➜</span>
                <span className="text-[#2094f3] font-bold">~</span>
                <span className="w-2.5 h-5 bg-[#00ff41] ml-2 animate-blink" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
