import { Cover } from "@/components/Cover";
import { Exhibits } from "@/components/Exhibits";
import { Findings } from "@/components/Findings";
import { Foot } from "@/components/Foot";
import { Notice } from "@/components/Notice";
import { Record } from "@/components/Record";
import { Section } from "@/components/Section";
import { Statement } from "@/components/Statement";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/profile";

export function Landing({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [exhibits, record, findings, statement, notice] = c.sections;

  return (
    <>
      <a className="skip-link" href="#main">
        {c.a11y.skip}
      </a>
      <span id="top" />
      <Cover locale={locale} />
      <main id="main" aria-label={c.a11y.main}>
        <Section section={exhibits}>
          <Exhibits locale={locale} />
        </Section>
        <Section section={record}>
          <Record locale={locale} />
        </Section>
        <Section section={findings}>
          <Findings locale={locale} />
        </Section>
        <Section section={statement}>
          <Statement locale={locale} />
        </Section>
        <Section section={notice}>
          <Notice locale={locale} />
        </Section>
      </main>
      <Foot locale={locale} />
    </>
  );
}
