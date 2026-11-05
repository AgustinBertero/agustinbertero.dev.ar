import type { Metadata } from "next";
import Link from "next/link";

const repo = "https://github.com/AgustinBertero/agustinbertero.dev.ar/tree/main/projects/legal-cases";

export const metadata: Metadata = {
  title: "Legal case management — case study",
  description:
    "Case study of a private law-firm app: clients, cases, deadlines, encrypted documents, roles and audit with Laravel, Inertia and React.",
  alternates: {
    canonical: "/en/projects/legal-cases/",
    languages: {
      es: "/projects/legal-cases/",
      en: "/en/projects/legal-cases/",
      "x-default": "/projects/legal-cases/",
    },
  },
  openGraph: {
    type: "article",
    url: "/en/projects/legal-cases/",
    title: "Legal case management — case study",
    description:
      "A private app for a law firm's daily work: cases, deadlines and encrypted documents. Screenshots use synthetic data.",
    images: [
      {
        url: "/projects/legal-cases/og.png",
        width: 1200,
        height: 630,
        alt: "Legal case management dashboard with deadlines and tasks",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/projects/legal-cases/og.png"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Estudio — legal case management",
  description:
    "Private app for clients, cases, deadlines, tasks and encrypted documents in a law firm.",
  url: "https://portfolio.bertium.net/en/projects/legal-cases/",
  author: { "@type": "Person", name: "Agustin Bertero" },
  keywords: ["Laravel", "Inertia", "React", "TypeScript", "PostgreSQL", "legal tech"],
};

export default function LegalCasesPage() {
  return (
    <main id="main" className="case shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="case__back mono" aria-label="Back">
        <Link className="link" href="/en/">← Back to portfolio</Link>
      </nav>

      <header className="case__hero">
        <div>
          <p className="case__kicker mono">Project 02 · Private product</p>
          <h1 className="case__title">Legal case management for a law firm</h1>
          <p className="case__lede">
            Clients, cases, deadlines, tasks and documents on one desk. Private access,
            roles, audit and encrypted files. Screenshots use synthetic data; there is no
            public demo.
          </p>
          <div className="case__actions">
            <a className="link" href={repo} target="_blank" rel="noreferrer noopener">View code</a>
            <span className="mono">Firm-only access</span>
          </div>
        </div>
        <table className="facts case__facts">
          <tbody>
            <tr><th scope="row">Role</th><td>Product, backend, frontend, infrastructure and privacy</td></tr>
            <tr><th scope="row">Stack</th><td>Laravel 12 · Inertia · React 19 · TypeScript</td></tr>
            <tr><th scope="row">Data</th><td>PostgreSQL · documents encrypted at rest</td></tr>
            <tr><th scope="row">Access</th><td>Private · no public sign-up</td></tr>
            <tr><th scope="row">Status</th><td>MVP in use, iterating</td></tr>
          </tbody>
        </table>
      </header>

      <figure className="case__shot">
        <img src="/projects/legal-cases/overview.png" alt="App dashboard with deadlines, tasks and recent cases" width={1440} height={1677} loading="eager" />
        <figcaption className="mono">Dashboard: what is due, what is open and what changed. Synthetic data.</figcaption>
      </figure>

      <section className="case__section" aria-labelledby="problem">
        <div className="case__section-head"><span className="mono">01</span><h2 id="problem">The problem</h2></div>
        <div className="case__prose">
          <p>
            In a small firm, a case lives across a folder, a deadline spreadsheet, email and
            the memory of whoever carries it. When a new matter arrives, the first questions
            are always the same: what is it, what is due and which document is missing.
          </p>
          <p>
            This MVP puts that work on one private desk. It is not a SaaS for thousands of
            firms: it solves one firm's day-to-day work with real data, without turning the
            client into an experiment.
          </p>
        </div>
      </section>

      <section className="case__section" aria-labelledby="what">
        <div className="case__section-head"><span className="mono">02</span><h2 id="what">What it does</h2></div>
        <div className="case__prose">
          <ul className="case__list">
            <li>Clients with tax id, contact details and case history.</li>
            <li>Cases with caption, number, court, matter, parties and status.</li>
            <li>Deadlines with date, type, assignee and one-click completion.</li>
            <li>Tasks with or without a case, assignable to each person in the firm.</li>
            <li>Case documents encrypted before storage and audited on download.</li>
            <li>Owner, lawyer and assistant roles; users and audit are owner-only.</li>
          </ul>
        </div>
      </section>

      <figure className="case__shot">
        <img src="/projects/legal-cases/case.png" alt="Case detail with summary, deadlines, documents, notes and client data" width={1440} height={1611} loading="lazy" />
        <figcaption className="mono">Case: summary, deadlines, documents, notes and client data.</figcaption>
      </figure>

      <section className="case__section" aria-labelledby="architecture">
        <div className="case__section-head"><span className="mono">03</span><h2 id="architecture">Architecture</h2></div>
        <div className="case__prose">
          <p>
            Laravel serves the app and owns validation, sessions, roles and audit. Inertia
            and React render the desk without a duplicated API. PostgreSQL stores the work;
            a private volume stores encrypted documents.
          </p>
          <p>
            The gateway publishes the private hostname and Cloudflare Tunnel connects it
            without opening ports. Cloudflare Access is the second barrier before login. The
            app is not linked from the portfolio and responds <code>noindex</code>.
          </p>
        </div>
      </section>

      <section className="case__section" aria-labelledby="decisions">
        <div className="case__section-head"><span className="mono">04</span><h2 id="decisions">Decisions</h2></div>
        <div className="case__prose">
          <ul className="case__list">
            <li><strong>One firm, not multi-tenant.</strong> Less surface and a data model that is easy to reason about; multi-firm isolation is a later phase.</li>
            <li><strong>No public sign-up.</strong> The owner creates accounts; every change is audited.</li>
            <li><strong>Documents encrypted with the app key.</strong> The original name is never the storage path; download goes through an authenticated route.</li>
            <li><strong>Explicit roles.</strong> Assistants cannot delete; lawyers cannot manage users; the owner sees the audit log.</li>
            <li><strong>Access behind Cloudflare Access.</strong> The app is private before the login screen.</li>
          </ul>
        </div>
      </section>

      <section className="case__section" aria-labelledby="limits">
        <div className="case__section-head"><span className="mono">05</span><h2 id="limits">Limits and next step</h2></div>
        <div className="case__prose">
          <ul className="case__list">
            <li>No in-app TOTP: Access is the second factor for now.</li>
            <li>No billing, client portal, email reminders or court integrations.</li>
            <li>Parties are a text field, not a structured table.</li>
            <li>Offsite backups: the volume is encrypted; restic/R2 still needs credentials and a restore test.</li>
            <li>The app does not replace professional judgement or a legal-compliance review.</li>
          </ul>
        </div>
      </section>

      <figure className="case__shot">
        <img src="/projects/legal-cases/clients.png" alt="Client list with contact details and case counts" width={1440} height={1000} loading="lazy" />
        <figcaption className="mono">Clients: the entry point to every case. Synthetic data.</figcaption>
      </figure>

      <section className="case__closing" aria-labelledby="closing">
        <div>
          <p className="case__kicker mono">Private case</p>
          <h2 id="closing">Software for real work, not the shop window.</h2>
          <p>
            The code shows the model, permissions, audit and encryption. If you want to see
            it in an interview, we can walk through it with synthetic data.
          </p>
        </div>
        <div className="case__actions">
          <a className="link" href={repo} target="_blank" rel="noreferrer noopener">View code</a>
        </div>
      </section>
    </main>
  );
}
