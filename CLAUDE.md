# CLAUDE.md — portfolio.bertium.net

## Stack

- Landing: Next.js 16 + TypeScript + Tailwind 4, `output: 'export'`, `trailingSlash: true`.
- Static output served by `nginxinc/nginx-unprivileged` inside Docker; the gateway proxies `/` to `site-web:8080`.
- No database, no cookies, no third-party scripts. Fonts are self-hosted in `site/public/fonts/`.

## Commands

All commands run from `site/`:

```bash
make install     # npm ci
make dev         # next dev
make build       # next build -> out/
make typecheck   # tsc --noEmit
make test        # build + scripts/smoke.mjs
make ci          # install + typecheck + test
make up          # docker compose -f compose.dev.yaml up --build -d (127.0.0.1:8080)
make down
```

## Structure

- `site/app/(es)/` → `/`, `/cv/` and `/error/`; `site/app/(en)/en/` → `/en/`. Two root layouts carry `lang` and metadata. Nginx serves `/error/index.html` for 404s, so the error page stays styled and declares `lang="es"`.
- `site/content/profile.ts` is the only source of profile facts (ES/EN). `site/content/projects.ts` drives the project cards. `site/content/copy.ts` holds UI copy and section text.
- `site/components/` holds the cover, sections, exhibits and the small motion client component.
- `site/app/globals.css` is the design system: tokens, cover, sections, CV, print and responsive rules. `DESIGN.md` at the repo root documents it.
- `site/public/cv/agustin-bertero-cv.pdf` is generated from `/cv/`; see “CV” below.

## Tests

`make test` runs the static smoke suite (`site/scripts/smoke.mjs`): required routes, `lang` and alternates, metadata/JSON-LD, no `tel:` or phone pattern, no third-party script/style, PDF size, and internal links resolving to files. Add a check before changing behavior; keep it passing before every commit.

## Deploy

- Public URL: `https://portfolio.bertium.net/`. The `agustinbertero.dev.ar` space in dev.ar is an HTTP redirect to it (dev.ar does not allow a cross-account CNAME to Cloudflare).
- CI: `.github/workflows/site.yml` runs `make ci` and publishes `ghcr.io/agustinbertero/portfolio-site:latest` and `:<sha>`.
- Server: `infra/scripts/pull-deploy.sh` (systemd timer every 5 min) pulls the repo and images, then runs `docker compose -f infra/compose.yaml -f infra/compose.local.yaml up -d`.
- Never publish ports in production; only `infra/compose.local.yaml` binds `127.0.0.1:8080`.
- `infra/compose.yaml` expects `env/infra.env` with `TUNNEL_TOKEN=...` (git-ignored, mode 600). It is the only production secret.
- Infrastructure is IaC only. Do not make manual changes on the server.

## CV

The PDF is a print of `/cv/` (public version, no phone). Regenerate after editing the CV route:

```bash
make build
python3 -m http.server 8099 --directory out &
CHROME=/home/agustin/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome
$CHROME --headless --no-pdf-header-footer \
  --print-to-pdf=public/cv/agustin-bertero-cv.pdf http://localhost:8099/cv/
make build   # include the new PDF in out/
```

## Do not touch

- `RECURSOS/` is source material; never publish from it directly and never copy the full CV with phone.
- Never publish the phone number, invent metrics, clients or testimonials, or add analytics/cookies.
- Do not add a third font, accent color, shadow, gradient or rounded corner; the design system is the case-file world in `DESIGN.md`.
- `main` deploys automatically. Do not merge without `make ci` green.
