import Image from "next/image";
import { SIDE_OPS } from "@/lib/content";
import { SectionHead } from "./SectionHead";

export function SideOps() {
  return (
    <section id="activities" className="section section-sideops">
      <div className="wrap">
        <SectionHead num="06" code="SIDE OPS" plain="Extra-curricular activities" align="right" />

        <div className="tags-rack">
          {SIDE_OPS.map((op, n) => (
            <article
              key={op.title}
              className="dogtag-hang"
              data-fx
              style={{ "--i": n } as React.CSSProperties}
            >
              <div className="chain" aria-hidden />
              <div className="dogtag">
                <span className="dogtag-hole" aria-hidden />
                <div className="dogtag-logo">
                  <Image src={op.logo} alt={`${op.title} logo`} width={72} height={72} />
                </div>
                <h3>{op.title}</h3>
                <p className="dogtag-role">{op.role}</p>
                <p className="dogtag-period">{op.period}</p>
                <p className="dogtag-detail">{op.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
