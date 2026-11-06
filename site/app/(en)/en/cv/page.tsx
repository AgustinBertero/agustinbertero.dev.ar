import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: { absolute: "CV — Agustin Bertero" },
  description:
    "Agustin Bertero's CV: Full Stack Developer (Laravel, React, TypeScript). Public version without a phone number.",
  alternates: {
    canonical: "/en/cv/",
    languages: { es: "/cv/", en: "/en/cv/", "x-default": "/cv/" },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    url: "/en/cv/",
    title: "CV — Agustin Bertero",
    description:
      "Full Stack Developer (Laravel, React, TypeScript). Public version without a phone number.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Agustin Bertero, Full Stack Developer — public CV",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: "https://portfolio.bertium.net/en/cv/",
  inLanguage: "en",
  mainEntity: {
    "@type": "Person",
    name: profile.name,
    jobTitle: "Full Stack Developer",
    url: "https://portfolio.bertium.net/en/",
    email: profile.email,
    sameAs: [profile.linkedin, profile.github],
  },
};

export default function CvPage() {
  const locale = "en" as const;

  return (
    <main className="cv">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="cv__bar mono">
        <Link href="/en/" className="link">
          Back to portfolio
        </Link>
        <span>Public version · no phone</span>
        <a className="link" href="/cv/agustin-bertero-cv-en.pdf" download>
          Download PDF
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
        <h2>Profile</h2>
        <p>{profile.summary[locale]}</p>
        <p>{profile.differential[locale]}</p>
      </section>

      <section>
        <h2>Technical skills</h2>
        <ul className="cv__skills">
          {profile.stack.map((group) => (
            <li key={group.label[locale]}>
              <strong>{group.label[locale]}:</strong> {group.items[locale]}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Professional experience</h2>
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
        <h2>Projects</h2>
        <ul className="cv__projects">
          <li>
            <strong>Helpdesk with AI triage</strong> — Laravel, Inertia, React, TypeScript,
            PostgreSQL and DeepSeek. Classification, summaries and suggested replies with RAG and
            a rule-based fallback.{" "}
            <a className="cv__link" href="https://portfolio.bertium.net/helpdesk/">Demo</a>{" "}
            ·{" "}
            <a className="cv__link" href="https://portfolio.bertium.net/projects/helpdesk/">Case study</a>
          </li>
          <li>
            <strong>Legal case management for a law firm</strong> — Laravel, React, TypeScript and
            PostgreSQL. Encrypted documents, roles, audit trail and private access.{" "}
            <a className="cv__link" href="https://portfolio.bertium.net/en/projects/legal-cases/">Case study</a>
          </li>
          <li>
            <strong>Portfolio</strong> — Next.js, TypeScript and Tailwind, static export served with
            Docker and Cloudflare Tunnel.{" "}
            <a className="cv__link" href="https://portfolio.bertium.net/">Live</a>{" "}
            ·{" "}
            <a className="cv__link" href="https://github.com/AgustinBertero/agustinbertero.dev.ar">Code</a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Education</h2>
        <ul className="cv__plain">
          {profile.education.map((item) => (
            <li key={item.title[locale]}>
              <strong>{item.title[locale]}</strong> · {item.org[locale]} · {item.period}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Certifications</h2>
        <ul className="cv__plain">
          {profile.certifications.map((item) => (
            <li key={item.title[locale]}>
              <strong>{item.title[locale]}</strong> · {item.org} · {item.period}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Languages</h2>
        <p>
          {profile.languages
            .map((item) => `${item.label[locale]}: ${item.level[locale]}`)
            .join(" · ")}
        </p>
      </section>
    </main>
  );
}
