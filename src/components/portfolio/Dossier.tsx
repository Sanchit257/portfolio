import Image from "next/image";
import { Download, Mail } from "lucide-react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL, ROLE_LINE } from "@/lib/content";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { SectionHead } from "./SectionHead";

function Redact({ children, n }: { children: React.ReactNode; n: number }) {
  return (
    <span className="redact" style={{ "--i": n } as React.CSSProperties}>
      {children}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="file-field">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function Dossier() {
  return (
    <section id="about" className="section section-dossier">
      <div className="wrap">
        <SectionHead num="01" code="DOSSIER" plain="About me" />

        <div className="folder" data-fx>
          <p className="folder-tab">Personnel file / S. Kaushik</p>
          <article className="file-page">
            <div className="file-stamp" aria-hidden>
              Cleared for duty
            </div>

            <div className="file-left">
              <div className="file-photo">
                <svg className="file-clip" viewBox="0 0 28 72" aria-hidden>
                  <path
                    d="M8 16v38a7 7 0 0 0 14 0V12a10 10 0 0 0-20 0v44a12 12 0 0 0 24 0V22"
                    fill="none"
                    stroke="#55574f"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
                <Image
                  src="/profile-photo.png"
                  alt="Sanchit Kaushik"
                  width={320}
                  height={320}
                />
                <p>S. Kaushik</p>
              </div>
              <div className="file-patch">
                <Image src="/cyber-avatar.png" alt="" width={1024} height={682} />
                <span>Unit patch: White Hat</span>
              </div>
            </div>

            <div className="file-body">
              <dl className="file-fields">
                <Field label="Name">Sanchit Kaushik</Field>
                <Field label="Callsign">White Hat</Field>
                <Field label="Assignment">{ROLE_LINE}</Field>
                <Field label="Location">Cypress, CA, United States of America</Field>
                <Field label="Education">BS Computer Science, CSULB</Field>
                <Field label="Record">GPA: 3.5 | Since 2024</Field>
                <Field label="Shell">ZSH // BASH</Field>
              </dl>

              <h3 className="file-h">Summary of service</h3>
              <p className="file-text">
                I am Sanchit Kaushik, a full-time{" "}
                <Redact n={0}>Computer Science student</Redact> with a focus and
                passion in <Redact n={1}>Cybersecurity</Redact> at{" "}
                <Redact n={2}>California State University, Long Beach</Redact>.
              </p>
              <p className="file-text">
                My journey involves <Redact n={3}>maintaining networks</Redact>,{" "}
                <Redact n={4}>analyzing network attacks</Redact>, mastering{" "}
                <Redact n={5}>scripting for automation</Redact>,{" "}
                <Redact n={6}>homelabbing</Redact>, and building{" "}
                <Redact n={7}>scalable websites in the cloud</Redact>. I am a
                firm believer in life-long learning, so I am constantly picking
                up new things everyday, while refreshing things from the past as
                well.
              </p>

              <div className="file-links">
                <a href={RESUME_URL} target="_blank" rel="noreferrer">
                  <Download aria-hidden /> Download resume
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                  <GithubIcon /> GitHub
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                  <LinkedinIcon /> LinkedIn
                </a>
                <a href={`mailto:${EMAIL}`}>
                  <Mail aria-hidden /> Email
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
