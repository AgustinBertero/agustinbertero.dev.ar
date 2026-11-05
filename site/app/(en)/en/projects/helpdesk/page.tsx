import type { Metadata } from "next";
import Link from "next/link";

const repo = "https://github.com/AgustinBertero/agustinbertero.dev.ar/tree/main/projects/helpdesk";
const demo = "/helpdesk/";

export const metadata: Metadata = {
  title: "Helpdesk with AI triage — case study",
  description:
    "Case study of an AI-triaged helpdesk: Laravel, React, TypeScript, PostgreSQL, a job queue, lexical RAG and DeepSeek with a rule-based fallback.",
  alternates: {
    canonical: "/en/projects/helpdesk/",
    languages: {
      es: "/projects/helpdesk/",
      en: "/en/projects/helpdesk/",
      "x-default": "/projects/helpdesk/",
    },
  },
  openGraph: {
    type: "article",
    url: "/en/projects/helpdesk/",
    title: "Helpdesk with AI triage — case study",
    description:
      "An MVP that classifies tickets, summarises threads and drafts replies from a knowledge base. Public demo and open code.",
    images: [
      {
        url: "/projects/helpdesk/og.png",
        width: 1200,
        height: 630,
        alt: "Helpdesk board with tickets and AI triage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/projects/helpdesk/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Helpdesk with AI triage",
  description:
    "Helpdesk MVP with asynchronous AI triage, thread summaries and knowledge-base-grounded suggested replies.",
  url: "https://portfolio.bertium.net/en/projects/helpdesk/",
  author: { "@type": "Person", name: "Agustin Bertero" },
  keywords: ["Laravel", "React", "TypeScript", "PostgreSQL", "RAG", "DeepSeek"],
};

export default function HelpdeskCasePage() {
  return (
    <main id="main" className="case shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="case__back mono" aria-label="Back">
        <Link className="link" href="/en/">
          ← Back to portfolio
        </Link>
      </nav>

      <header className="case__hero">
        <div>
          <p className="case__kicker mono">Project 01 · Live</p>
          <h1 className="case__title">Helpdesk with AI triage</h1>
          <p className="case__lede">
            A ticket system that classifies, prioritises and summarises every
            request before anyone opens it. The person still decides; the model
            handles the first pass.
          </p>
          <div className="case__actions">
            <a className="btn btn--fill" href={demo}>
              Open demo <span className="btn-ref">↗</span>
            </a>
            <a className="link" href={repo} target="_blank" rel="noreferrer noopener">
              View code
            </a>
          </div>
        </div>
        <table className="facts case__facts">
          <tbody>
            <tr>
              <th scope="row">Role</th>
              <td>Design, backend, frontend and infrastructure</td>
            </tr>
            <tr>
              <th scope="row">Stack</th>
              <td>Laravel 12 · Inertia · React 19 · TypeScript</td>
            </tr>
            <tr>
              <th scope="row">AI</th>
              <td>DeepSeek · lexical RAG · rule-based fallback</td>
            </tr>
            <tr>
              <th scope="row">Data</th>
              <td>PostgreSQL · database queue</td>
            </tr>
            <tr>
              <th scope="row">Demo</th>
              <td>Public, no login, synthetic data</td>
            </tr>
          </tbody>
        </table>
      </header>

      <figure className="case__shot">
        <img
          src="/projects/helpdesk/overview.png"
          alt="Helpdesk queue with ticket list, filters and a new ticket form"
          width={1280}
          height={800}
          loading="eager"
        />
        <figcaption className="mono">
          Helpdesk queue: filters, ticket state and AI triage status.
        </figcaption>
      </figure>

      <section className="case__section" aria-labelledby="problem">
        <div className="case__section-head">
          <span className="mono">01</span>
          <h2 id="problem">The problem</h2>
        </div>
        <div className="case__prose">
          <p>
            In support, the first minutes of every ticket go into deciding what it
            is, how urgent it is and whether the answer already exists in the
            knowledge base. With long threads, that decision is repeated before
            anyone can help.
          </p>
          <p>
            The goal was not to replace the agent: it was to move that first pass to
            a background job and give the person a better-informed decision.
          </p>
        </div>
      </section>

      <section className="case__section" aria-labelledby="what">
        <div className="case__section-head">
          <span className="mono">02</span>
          <h2 id="what">What it does</h2>
        </div>
        <div className="case__prose">
          <ul className="case__list">
            <li>Ticket queue with search and status, priority and triage filters.</li>
            <li>Ticket detail with the full thread and a triage panel.</li>
            <li>Category and priority classification, summary and suggested reply.</li>
            <li>Citations to the knowledge-base articles used as context.</li>
            <li>A test ticket form to watch the queue and triage live.</li>
          </ul>
        </div>
      </section>

      <section className="case__section" aria-labelledby="how">
        <div className="case__section-head">
          <span className="mono">03</span>
          <h2 id="how">How triage works</h2>
        </div>
        <div className="case__prose">
          <ol className="case__steps">
            <li>The ticket and its messages enter a queue job.</li>
            <li>A lexical retriever scores articles by title, tags and body, and returns the top three.</li>
            <li>The prompt contains the thread and those articles; the model returns strict JSON.</li>
            <li>The server validates category, priority and citations before saving the result.</li>
            <li>If the API key is missing, the provider fails or the JSON is invalid, the rule fallback runs.</li>
          </ol>
          <p>
            The model is instructed not to invent policies, prices, addresses or
            timelines that are not in the knowledge base. The suggested reply is a
            draft: the agent reviews it before sending.
          </p>
        </div>
      </section>

      <figure className="case__shot">
        <img
          src="/projects/helpdesk/ticket.png"
          alt="Ticket detail with message thread and AI triage panel showing summary, suggested reply and cited articles"
          width={1280}
          height={800}
          loading="lazy"
        />
        <figcaption className="mono">
          Ticket detail: thread, summary, suggested reply and knowledge base.
        </figcaption>
      </figure>

      <section className="case__section" aria-labelledby="architecture">
        <div className="case__section-head">
          <span className="mono">04</span>
          <h2 id="architecture">Architecture</h2>
        </div>
        <div className="case__prose">
          <p>
            Laravel serves the app and validates everything server-side. Inertia and
            React render the board without duplicating auth, CSRF or CORS.
            PostgreSQL stores tickets, messages, articles, sessions, cache and jobs;
            a separate worker processes the queue.
          </p>
          <p>
            The web and worker containers share the same image. The gateway
            publishes the demo under <code>/helpdesk/</code>, applies CSP and limits
            the triage endpoint with a dedicated rate-limit zone.
          </p>
        </div>
      </section>

      <section className="case__section" aria-labelledby="decisions">
        <div className="case__section-head">
          <span className="mono">05</span>
          <h2 id="decisions">Decisions</h2>
        </div>
        <div className="case__prose">
          <ul className="case__list">
            <li><strong>Laravel + Inertia:</strong> one deployable, server-side validation and sessions, and React without a duplicated API.</li>
            <li><strong>Database queue:</strong> one worker and a small volume do not justify Redis for this demo.</li>
            <li><strong>Lexical RAG:</strong> the knowledge base is small and avoids a second paid API; the retriever is isolated so it can move to embeddings later.</li>
            <li><strong>Rule fallback:</strong> the demo must still explain itself if the key is missing or the provider is down.</li>
            <li><strong>Public demo:</strong> no registration, synthetic data, rate limiting and a nightly reset.</li>
          </ul>
        </div>
      </section>

      <section className="case__section" aria-labelledby="limits">
        <div className="case__section-head">
          <span className="mono">06</span>
          <h2 id="limits">Limits and next step</h2>
        </div>
        <div className="case__prose">
          <ul className="case__list">
            <li>The lexical retriever misses paraphrases; pgvector is the next step.</li>
            <li>No accounts, roles, attachments or email ingestion: this is an MVP, not a production helpdesk.</li>
            <li>The suggested reply always needs human review.</li>
            <li>The demo resets nightly and must not be used with real data.</li>
          </ul>
        </div>
      </section>

      <section className="case__closing" aria-labelledby="closing">
        <div>
          <p className="case__kicker mono">Public demo</p>
          <h2 id="closing">Try it with synthetic data.</h2>
          <p>
            Open a ticket, watch it enter the queue and see triage appear in the
            background. No account required.
          </p>
        </div>
        <div className="case__actions">
          <a className="btn btn--fill" href={demo}>
            Open helpdesk <span className="btn-ref">↗</span>
          </a>
          <a className="link" href={repo} target="_blank" rel="noreferrer noopener">
            View code
          </a>
        </div>
      </section>
    </main>
  );
}
