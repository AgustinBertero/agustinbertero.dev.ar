import Link from "next/link";
import { copy } from "@/content/copy";
import type { Locale } from "@/content/profile";
import { projects, projectText } from "@/content/projects";

export function Exhibits({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const p = c.projects;

  return (
    <>
      {projects.map((project) => {
        const statusLabel =
          project.status === "live" ? p.statusLive : p.statusWip;
        const stamp = project.status === "live" ? p.statusLive : p.statusWip;

        return (
          <article key={project.slug} className="exhibit" id={`project-${project.slug}`}>
            <div className="exhibit__tag mono">
              <span>
                {p.exhibit} {project.num}
              </span>
              <span className="status">{statusLabel}</span>
            </div>

            <div>
              <h3 className="exhibit__title">{project.title[locale]}</h3>
              <p className="exhibit__summary">{project.summary[locale]}</p>
              <div className="exhibit__links">
                {project.caseStudy ? (
                  <Link className="link" href={locale === "en" ? `/en${project.caseStudy}` : project.caseStudy}>
                    {p.caseStudy}
                  </Link>
                ) : null}
                {project.demo ? (
                  <a className="link" href={project.demo}>
                    {p.demo}
                  </a>
                ) : null}
                {project.repo ? (
                  <a
                    className="link"
                    href={project.repo}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {p.repo}
                  </a>
                ) : (
                  <span className="pending">{p.pending}</span>
                )}
              </div>
              <p className="stamp" aria-hidden="true">
                {stamp}
              </p>
            </div>

            <table className="facts">
              <tbody>
                {project.rows.map((row) => (
                  <tr key={row.label[locale]}>
                    <th scope="row">{row.label[locale]}</th>
                    <td>{row.value[locale]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        );
      })}
      <p className="mono" style={{ marginTop: "1.25rem", color: "var(--color-ink-soft)" }}>
        {projectText.exhibit[locale]} 01–{projects[projects.length - 1].num} ·{" "}
        {locale === "es"
          ? "Cada proyecto se publica cuando la demo funciona."
          : "Each project ships when its demo works."}
      </p>
    </>
  );
}
