import Link from "next/link";
import { copy as copyByLocale } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/profile";

export function Cover({ locale }: { locale: Locale }) {
  const c = copyByLocale[locale];
  const cover = c.cover;

  return (
    <section className="cover shell" aria-label={cover.kicker}>
      <header className="cover__head">
        <span className="mono">{c.head.file}</span>
        <span className="mono">{c.head.descriptor}</span>
        <span className="mono" style={{ display: "flex", gap: "0.75rem" }}>
          {c.head.location}
          <Link href={c.langSwitch.href} className="link link--toggle" aria-label={c.langSwitch.aria}>
            {c.langSwitch.label}
          </Link>
        </span>
      </header>

      <div className="cover__body">
        <div>
          <p className="kicker">{cover.kicker}</p>
          <h1 className="cover__name" aria-label={profile.name}>
            {cover.nameLines.map((line) => (
              <span key={line}>{line}</span>
            ))}{" "}
          </h1>
          <p className="cover__role">
            <b>{cover.roleLead}</b> {cover.roleRest}
          </p>
          <div className="cover__actions">
            <a className="btn btn--fill" href="#projects">
              {cover.primary}
              <span className="btn-ref">{cover.primaryRef}</span>
            </a>
            <a className="btn" href="/cv/agustin-bertero-cv.pdf" download>
              {cover.secondary}
              <span className="btn-ref">{cover.secondaryRef}</span>
            </a>
          </div>
        </div>

        <div className="cover__meta">
          <h2 className="mono">{cover.metaTitle}</h2>
          <table className="facts">
            <tbody>
              {cover.facts.map((fact) => (
                <tr key={fact.label}>
                  <th scope="row">{fact.label}</th>
                  <td>{fact.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="seal" aria-hidden="true">
            <span>
              {cover.sealTop}
              <strong>{cover.sealStrong}</strong>
              {cover.sealBottom}
            </span>
          </p>
        </div>
      </div>

      <nav className="cover__index" aria-label={c.a11y.index}>
        {c.sections.slice(0, 3).map((section) => (
          <a
            key={section.id}
            className="index-row"
            href={`#${section.id}`}
            data-index-link={section.id}
          >
            <span className="num">{section.num}</span>
            <span className="name">{section.name}</span>
            <span className="dot-leader" aria-hidden="true" />
            <span className="folio">{section.folio}</span>
          </a>
        ))}
      </nav>

      <footer className="cover__foot mono">
        <span>{cover.foot.site}</span>
        <span>{cover.foot.revision}</span>
        <span>{cover.foot.folio}</span>
      </footer>
    </section>
  );
}
