"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { Reveal } from "./Reveal";

const FORM_ACTION = "https://formsubmit.co/sk010us@gmail.com";
const COOLDOWN_MS = 5 * 60 * 1000;
const STORAGE_KEY = "portfolio-contact-last-submit";

const contacts = [
  {
    icon: Mail,
    label: "EMAIL PROTOCOL",
    value: "sk010us@gmail.com",
    href: "mailto:sk010us@gmail.com",
    color: "var(--color-neon-pink)",
  },
  {
    icon: LinkedinIcon,
    label: "LINKED_IN NODE",
    value: "sanchitka",
    href: "http://www.linkedin.com/in/sanchitka",
    color: "var(--color-neon-cyan)",
  },
  {
    icon: GithubIcon,
    label: "GITHUB REPO",
    value: "Sanchit257",
    href: "https://github.com/Sanchit257",
    color: "var(--color-neon-yellow)",
  },
  {
    icon: MapPin,
    label: "PHYSICAL NODE",
    value: "Cypress, CA, United States of America",
    href: undefined,
    color: "var(--color-neon-purple)",
  },
];

type Status = "idle" | "sending" | "success" | "error" | "cooldown";

function getCooldownRemainingMs(): number {
  if (typeof window === "undefined") return 0;
  const last = localStorage.getItem(STORAGE_KEY);
  if (!last) return 0;
  const elapsed = Date.now() - Number(last);
  return Math.max(0, COOLDOWN_MS - elapsed);
}

function formatCooldown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldownMs, setCooldownMs] = useState(0);
  const [nextUrl, setNextUrl] = useState("");

  useEffect(() => {
    setNextUrl(`${window.location.origin}/?submitted=1#contact`);

    const params = new URLSearchParams(window.location.search);
    if (params.get("submitted") === "1") {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
      setStatus("success");
      window.history.replaceState({}, "", `${window.location.pathname}#contact`);
    }

    setCooldownMs(getCooldownRemainingMs());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldownMs(getCooldownRemainingMs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const remaining = getCooldownRemainingMs();
    if (remaining > 0) {
      e.preventDefault();
      setCooldownMs(remaining);
      setStatus("cooldown");
      setErrorMessage("");
      return;
    }

    if (!name || !email || !message) {
      e.preventDefault();
      setStatus("error");
      setErrorMessage("All fields are required.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setStatus("sending");
    setErrorMessage("");
  }

  const isSubmitDisabled = status === "sending" || cooldownMs > 0;

  return (
    <section
      id="contact"
      className="py-28 md:py-32 relative overflow-hidden bg-transparent pb-36"
    >
      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <Reveal className="text-center mb-16 md:mb-24" y={30}>
          <div className="inline-block bg-[#00ff41] text-black px-7 py-2.5 cyber-clip font-[family-name:var(--font-display)] font-black uppercase tracking-widest text-base mb-6 shadow-[0_0_20px_rgba(0,255,65,0.6)] animate-pulse">
            COMMUNICATION PROTOCOL
          </div>
          <h2 className="text-6xl lg:text-8xl font-[family-name:var(--font-display)] font-black text-white tracking-tighter uppercase mb-5 relative">
            SECURE{" "}
            <span className="text-glow-pink text-[var(--color-neon-pink)]">
              TRANSMISSION
            </span>
          </h2>
          <p className="text-[var(--color-on-surface-variant)] max-w-2xl mx-auto font-mono text-base tracking-widest px-4 border-l-2 border-r-2 border-[var(--color-neon-cyan)] py-2.5">
            INITIALIZE CONNECTION // WAITING FOR INPUT
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <Reveal x={-40} y={0} className="flex flex-col gap-6 relative">
            <div className="absolute -left-10 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-neon-pink)] via-transparent to-[var(--color-neon-cyan)] hidden lg:block opacity-50" />

            {contacts.map((item) => {
              const Icon = item.icon;
              const className =
                "cyber-clip bg-[var(--color-surface-container-low)] p-7 group flex items-start gap-5 hover:bg-[var(--color-surface-container-high)] border border-[var(--color-outline)] transition-all duration-300 relative overflow-hidden text-left w-full";

              const content = (
                <>
                  <div
                    className="absolute inset-x-0 bottom-0 h-1 cyber-clip opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: item.color,
                      filter: `drop-shadow(0 0 10px ${item.color})`,
                    }}
                  />
                  <div
                    className="w-14 h-14 cyber-clip-reverse bg-black border flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform"
                    style={{ borderColor: item.color, color: item.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-1 group-hover:text-white transition-colors">
                      {item.label}
                    </h3>
                    <p
                      className="font-[family-name:var(--font-display)] font-bold text-white text-xl group-hover:tracking-wider transition-all"
                      style={{ textShadow: `0 0 10px ${item.color}` }}
                    >
                      {item.value}
                    </p>
                  </div>
                </>
              );

              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={
                      item.href.startsWith("mailto:") ? undefined : "noreferrer"
                    }
                    className={className}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div key={item.label} className={className}>
                  {content}
                </div>
              );
            })}
          </Reveal>

          <Reveal
            x={40}
            y={0}
            className="cyber-clip-reverse bg-[var(--color-surface-container-highest)] p-1 border-2 border-[var(--color-outline)] hover:border-[var(--color-neon-cyan)] transition-colors relative"
          >
            <div className="absolute top-2 right-2 flex gap-1 z-20">
              <span className="w-2.5 h-2.5 bg-[var(--color-neon-pink)] cyber-clip animate-ping shadow-[0_0_10px_var(--color-neon-pink)]" />
              <span className="w-2.5 h-2.5 bg-white cyber-clip" />
            </div>

            <form
              action={FORM_ACTION}
              method="POST"
              onSubmit={handleSubmit}
              className="bg-black/90 p-9 md:p-10 flex flex-col gap-7 relative z-10 cyber-clip-reverse h-full"
            >
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_subject" value="Portfolio contact form" />
              {nextUrl ? (
                <input type="hidden" name="_next" value={nextUrl} />
              ) : null}
              <input
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />

              <div className="flex flex-col gap-2 relative group">
                <label
                  htmlFor="name"
                  className="font-mono text-sm font-bold text-[var(--color-neon-cyan)] uppercase tracking-widest"
                >
                  // IDENTIFIER
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-transparent border-b-2 border-[var(--color-outline)] text-white p-3.5 font-[family-name:var(--font-display)] focus:outline-none focus:border-[var(--color-neon-cyan)] focus:bg-[var(--color-neon-cyan)]/10 transition-all text-xl placeholder:text-white/20"
                  placeholder="ENTER ALIAS"
                />
              </div>

              <div className="flex flex-col gap-2 relative group">
                <label
                  htmlFor="email"
                  className="font-mono text-sm font-bold text-[var(--color-neon-pink)] uppercase tracking-widest"
                >
                  // RETURN_ADDRESS
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b-2 border-[var(--color-outline)] text-white p-3.5 font-[family-name:var(--font-display)] focus:outline-none focus:border-[var(--color-neon-pink)] focus:bg-[var(--color-neon-pink)]/10 transition-all text-xl placeholder:text-white/20"
                  placeholder="ENTER SECURE EMAIL"
                />
              </div>

              <div className="flex flex-col gap-2 relative group flex-1">
                <label
                  htmlFor="message"
                  className="font-mono text-sm font-bold text-[var(--color-neon-yellow)] uppercase tracking-widest"
                >
                  // PAYLOAD_DATA
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full h-full min-h-[160px] bg-transparent border-2 border-[var(--color-outline)] text-white p-5 font-[family-name:var(--font-display)] focus:outline-none focus:border-[var(--color-neon-yellow)] focus:bg-[var(--color-neon-yellow)]/10 transition-all text-xl resize-none placeholder:text-white/20 cyber-clip"
                  placeholder="DRAFT ENCRYPTED MESSAGE HERE..."
                />
              </div>

              {status === "success" && (
                <p className="font-mono text-sm text-[#00ff41] tracking-widest">
                  TRANSMISSION SUCCESSFUL // MESSAGE SENT
                </p>
              )}
              {cooldownMs > 0 && (
                <p className="font-mono text-sm text-[var(--color-neon-yellow)] tracking-widest">
                  Please wait before submitting again. You can resubmit in{" "}
                  {formatCooldown(cooldownMs)}.
                </p>
              )}
              {status === "error" && (
                <p className="font-mono text-sm text-[var(--color-neon-pink)] tracking-widest">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="group w-full cyber-clip bg-[var(--color-neon-cyan)] hover:bg-white text-black font-[family-name:var(--font-display)] font-black text-2xl py-5 flex items-center justify-center gap-3 transition-all duration-300 mt-4 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending"
                  ? "REDIRECTING TO CAPTCHA..."
                  : cooldownMs > 0
                    ? `WAIT ${formatCooldown(cooldownMs)}`
                    : "EXECUTE"}{" "}
                <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
