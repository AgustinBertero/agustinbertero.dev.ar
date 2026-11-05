import type { ReactNode } from "react";
import type { SectionCopy } from "@/content/copy";

export function Section({
  section,
  children,
}: {
  section: SectionCopy;
  children: ReactNode;
}) {
  return (
    <section id={section.id} className="section shell" data-section={section.id}>
      <div className="section__head">
        <span className="section__folio">{section.num}</span>
        <h2 className="section__title">{section.name}</h2>
        <p className="section__note">{section.note}</p>
      </div>
      <div data-reveal>{children}</div>
    </section>
  );
}
