"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/content";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { SectionHead } from "./SectionHead";

const FORM_ACTION = `https://formsubmit.co/${EMAIL}`;
const COOLDOWN_MS = 5 * 60 * 1000;
const STORAGE_KEY = "portfolio-contact-last-submit";
const BARS = 44;

const channels = [
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: LinkedinIcon, label: "LinkedIn", value: "sanchitka", href: LINKEDIN_URL },
  { icon: GithubIcon, label: "GitHub", value: "Sanchit257", href: GITHUB_URL },
  { icon: MapPin, label: "Location", value: "Cypress, CA, United States of America", href: undefined },
];

type Status = "idle" | "sending" | "success" | "error" | "cooldown";

function getCooldownRemainingMs(): number {
  const last = localStorage.getItem(STORAGE_KEY);
  if (!last) return 0;
  return Math.max(0, COOLDOWN_MS - (Date.now() - Number(last)));
}

function formatCooldown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** Radio signal meter that spikes with every keystroke in the form. */
function Waveform({ pulse }: { pulse: number }) {
  const bars = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pulse) return;
    const nodes = bars.current?.children;
    if (!nodes) return;
    const center = (pulse * 7) % BARS;
    for (let i = 0; i < nodes.length; i += 1) {
      const distance = Math.abs(i - center);
      const height = Math.max(0.08, 1 - distance / 9) * (0.55 + Math.random() * 0.45);
      (nodes[i] as HTMLElement).style.setProperty("--h", height.toFixed(2));
    }
    const timer = window.setTimeout(() => {
      for (let i = 0; i < nodes.length; i += 1) {
        (nodes[i] as HTMLElement).style.setProperty("--h", "0.08");
      }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [pulse]);

  return (
    <div ref={bars} className="wave" aria-hidden>
      {Array.from({ length: BARS }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}

export function Comms() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldownMs, setCooldownMs] = useState(0);
  const [pulse, setPulse] = useState(0);
  const nextInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("submitted") === "1") {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
        setStatus("success");
        window.history.replaceState({}, "", `${window.location.pathname}#contact`);
      }
      setCooldownMs(getCooldownRemainingMs());
    };
    const first = window.setTimeout(sync, 0);
    const timer = window.setInterval(() => setCooldownMs(getCooldownRemainingMs()), 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
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

    if (nextInput.current) {
      nextInput.current.value = `${window.location.origin}/?submitted=1#contact`;
    }
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setStatus("sending");
    setErrorMessage("");
  }

  const isSubmitDisabled = status === "sending" || cooldownMs > 0;

  return (
    <section id="contact" className="section section-comms">
      <div className="wrap">
        <SectionHead num="07" code="COMMS" plain="Contact" />

        <div className="radio-grid">
          <ul className="channels" data-fx>
            {channels.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <>
                  <Icon aria-hidden />
                  <span>
                    <small>{item.label}</small>
                    <b>{item.value}</b>
                  </span>
                </>
              );
              return (
                <li key={item.label} style={{ "--i": i } as React.CSSProperties}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                    >
                      {content}
                    </a>
                  ) : (
                    <div>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="radio" data-fx>
            <div className="radio-top" aria-hidden>
              <span className="radio-led" />
              <span>Channel open</span>
              <span className="radio-freq">Signal</span>
            </div>
            <Waveform pulse={pulse} />

            <form
              action={FORM_ACTION}
              method="POST"
              onSubmit={handleSubmit}
              onInput={() => setPulse((p) => p + 1)}
              className="radio-form"
            >
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_subject" value="Portfolio contact form" />
              <input ref={nextInput} type="hidden" name="_next" defaultValue="" />
              <input
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />

              <div className="field">
                <label htmlFor="name">Callsign (your name)</label>
                <input type="text" id="name" name="name" required autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="email">Return frequency (your email)</label>
                <input type="email" id="email" name="email" required autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} required />
              </div>

              <div aria-live="polite">
                {status === "success" && (
                  <p className="radio-msg is-green">Transmission received. Message sent.</p>
                )}
                {cooldownMs > 0 && (
                  <p className="radio-msg">
                    Please wait before submitting again. You can resubmit in{" "}
                    {formatCooldown(cooldownMs)}.
                  </p>
                )}
                {status === "error" && <p className="radio-msg is-red">{errorMessage}</p>}
              </div>

              <button type="submit" disabled={isSubmitDisabled} className="btn-tracer radio-send">
                {status === "sending"
                  ? "Redirecting to captcha..."
                  : cooldownMs > 0
                    ? `Wait ${formatCooldown(cooldownMs)}`
                    : "Transmit message"}
                <Send aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
