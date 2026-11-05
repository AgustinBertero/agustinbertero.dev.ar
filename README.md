# Agustin Bertero — portfolio and projects

Personal site and a small monorepo of projects I use to keep the full stack honest: the UI, the API, the database and the server that runs them.

**Live portfolio:** https://portfolio.bertium.net/

## Projects

| Project | What it is | Live |
|---|---|---|
| `site/` | Bilingual portfolio built as a printed technical dossier. Next.js static export, no cookies, no third-party scripts. | https://portfolio.bertium.net/ |
| `projects/helpdesk/` | Public helpdesk demo with AI triage, thread summaries and knowledge-base-grounded replies. Laravel + Inertia + React + PostgreSQL + DeepSeek. | https://portfolio.bertium.net/helpdesk/ |
| `projects/legal-cases/` | Private legal case management for a law firm: clients, cases, deadlines, encrypted documents, roles and audit. No public demo. | Case study: https://portfolio.bertium.net/projects/legal-cases/ |

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind 4, Inertia.
- **Backend:** Laravel 12, PHP 8.3, PostgreSQL 17.
- **Infrastructure:** Docker, nginx-unprivileged, Nginx gateway, Cloudflare Tunnel, GitHub Actions, GHCR.
- **Design:** Archivo + Courier Prime, paper/ink/institution blue/stamp red, 1px rules, no shadows or gradients. See `DESIGN.md`.

## Layout

```
site/                     portfolio (static export)
projects/helpdesk/        public AI triage demo
projects/legal-cases/     private legal case app
infra/                    gateway, compose, Cloudflare tunnel, systemd, backups
env/                      server-only secrets (git-ignored)
```

## Docs

- `PRODUCT.md` — product truth and constraints.
- `DESIGN.md` — design system and visual contract.
- `CLAUDE.md` — how to work in this repo.
- `infra/README.md` — deployment, tunnel, subdomains and backups.
- Each project has its own README.

## Run

Each app is independent. See the README in `site/`, `projects/helpdesk/` or `projects/legal-cases/`; the common loop is `make ci` before a commit and `make up` for a local compose stack.

The legal app holds real client data by design. Do not expose `casos.bertium.net` without Cloudflare Access, and back up `APP_KEY` separately from the database: it is what makes encrypted documents readable.
