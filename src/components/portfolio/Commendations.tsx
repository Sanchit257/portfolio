import Image from "next/image";
import { Download, Lock } from "lucide-react";
import { CERTS } from "@/lib/content";
import { SectionHead } from "./SectionHead";

export function Commendations() {
  return (
    <section id="certifications" className="section section-medals">
      <div className="wrap">
        <SectionHead num="04" code="COMMENDATIONS" plain="Certifications" />

        <div className="medals">
          {CERTS.map((cert) => (
            <article key={cert.title} className="medal" data-fx data-earned={cert.earned}>
              <div className="medal-foil" aria-hidden />
              <div className="medal-plate">
                <Image
                  src={cert.image}
                  alt={`${cert.title} badge`}
                  width={280}
                  height={176}
                  className={cert.earned ? undefined : "is-locked"}
                />
                {!cert.earned && (
                  <span className="medal-lock">
                    <Lock aria-hidden /> In progress
                  </span>
                )}
              </div>
              <p className="medal-state">
                {cert.earned ? "Unlocked / Verified" : "Challenge in progress"}
              </p>
              <h3>{cert.title}</h3>
              <p className="medal-code">{cert.issuer}</p>
              {cert.certificateUrl ? (
                <a
                  href={cert.certificateUrl}
                  download={cert.certificateName ?? true}
                  className="btn-ghost medal-link"
                >
                  <Download aria-hidden /> View certificate
                </a>
              ) : (
                <div className="hazard" aria-hidden />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
