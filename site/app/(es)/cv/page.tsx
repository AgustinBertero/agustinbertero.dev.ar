import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: { absolute: "CV — Agustin Bertero" },
  description:
    "Currículum de Agustin Bertero, Full Stack Developer (Laravel, React, TypeScript). Versión pública sin teléfono.",
  alternates: {
    canonical: "/cv/",
    languages: { es: "/cv/", en: "/en/cv/", "x-default": "/cv/" },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    url: "/cv/",
    title: "CV — Agustin Bertero",
    description:
      "Currículum de Agustin Bertero, Full Stack Developer (Laravel, React, TypeScript). Versión pública sin teléfono.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Agustin Bertero, Full Stack Developer — CV público",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: "https://portfolio.bertium.net/cv/",
  inLanguage: "es-AR",
  mainEntity: {
    "@type": "Person",
    name: profile.name,
    jobTitle: "Full Stack Developer",
    url: "https://portfolio.bertium.net/",
    email: profile.email,
    sameAs: [profile.linkedin, profile.github],
  },
};

export default function CvPage() {
  const locale = "es" as const;

  return (
    <main className="cv">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
          <span
            dangerouslySetInnerHTML={{
              __html: `<!--email_off-->${profile.email}<!--/email_off-->`,
            }}
          />{" "}
          · <a className="cv__link" href="https://linkedin.com/in/agustinbertero">linkedin.com/in/agustinbertero</a>{" "}
          · <a className="cv__link" href="https://github.com/AgustinBertero">github.com/AgustinBertero</a>{" "}
          · <a className="cv__link" href="https://portfolio.bertium.net/">portfolio.bertium.net</a>
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
              <strong>{group.label[locale]}:</strong> {group.items[locale]}
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
        <h2>Proyectos</h2>
        <ul className="cv__projects">
          <li>
            <strong>Helpdesk con triage por IA</strong> — Laravel, Inertia, React, TypeScript,
            PostgreSQL y DeepSeek. Clasificación, resumen y respuesta sugerida con RAG y fallback
            por reglas.{" "}
            <a className="cv__link" href="https://portfolio.bertium.net/helpdesk/">Demo</a>{" "}
            ·{" "}
            <a className="cv__link" href="https://portfolio.bertium.net/projects/helpdesk/">Caso</a>
          </li>
          <li>
            <strong>Gestión de expedientes para un estudio jurídico</strong> — Laravel, React,
            TypeScript y PostgreSQL. Documentos cifrados, roles, auditoría y acceso privado.{" "}
            <a className="cv__link" href="https://portfolio.bertium.net/projects/legal-cases/">Caso</a>
          </li>
          <li>
            <strong>Portfolio</strong> — Next.js, TypeScript y Tailwind, export estático servido
            con Docker y Cloudflare Tunnel.{" "}
            <a className="cv__link" href="https://portfolio.bertium.net/">Demo</a>{" "}
            ·{" "}
            <a className="cv__link" href="https://github.com/AgustinBertero/agustinbertero.dev.ar">Código</a>
          </li>
        </ul>
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
