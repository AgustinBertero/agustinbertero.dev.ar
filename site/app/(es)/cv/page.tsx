import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "CV — Agustin Bertero",
  description:
    "Currículum de Agustin Bertero, Full Stack Developer. Versión pública sin teléfono.",
  alternates: { canonical: "/cv/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    url: "/cv/",
    title: "CV — Agustin Bertero",
    description:
      "Currículum de Agustin Bertero, Full Stack Developer. Versión pública sin teléfono.",
  },
};

export default function CvPage() {
  const locale = "es" as const;

  return (
    <main className="cv">
      <div className="cv__bar mono">
        <Link href="/" className="link">
          Volver al portfolio
        </Link>
        <span>Versión pública · sin teléfono</span>
        <a className="link" href="/cv/agustin-bertero-cv.pdf" download>
          Descargar PDF
        </a>
      </div>

      <header className="cv__head">
        <h1>{profile.name}</h1>
        <p className="cv__role">{profile.role[locale]}</p>
        <p className="cv__contact">
          {profile.email} · linkedin.com/in/agustinbertero · github.com/AgustinBertero ·{" "}
          {profile.site}
        </p>
        <p className="cv__contact">
          {profile.location[locale]} · {profile.nationality[locale]}
        </p>
      </header>

      <section>
        <h2>Perfil</h2>
        <p>{profile.summary[locale]}</p>
        <p>{profile.differential[locale]}</p>
      </section>

      <section>
        <h2>Habilidades técnicas</h2>
        <ul className="cv__skills">
          {profile.stack.map((group) => (
            <li key={group.label[locale]}>
              <strong>{group.label[locale]}:</strong> {group.items}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Experiencia profesional</h2>
        {profile.experience.map((job) => (
          <article key={job.company + job.period[locale]} className="cv__job">
            <div className="cv__job-head">
              <h3>{job.role[locale]}</h3>
              <span>{job.period[locale]}</span>
            </div>
            <p className="cv__job-org">
              {job.company} · {job.place[locale]} · {job.mode[locale]}
            </p>
            <ul>
              {job.bullets[locale].map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2>Formación</h2>
        <ul className="cv__plain">
          {profile.education.map((item) => (
            <li key={item.title[locale]}>
              <strong>{item.title[locale]}</strong> · {item.org[locale]} · {item.period}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Certificaciones</h2>
        <ul className="cv__plain">
          {profile.certifications.map((item) => (
            <li key={item.title[locale]}>
              <strong>{item.title[locale]}</strong> · {item.org} · {item.period}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Idiomas</h2>
        <p>
          {profile.languages
            .map((item) => `${item.label[locale]}: ${item.level[locale]}`)
            .join(" · ")}
        </p>
      </section>
    </main>
  );
}
