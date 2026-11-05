# agustinbertero.dev.ar

Portfolio de Agustin Bertero: una página de presentación en `/` y cada proyecto en su propia subruta (`/helpdesk/`, `/uptime/`…). Es un monorepo que corre en Docker en un mini PC Linux propio y sale a internet por Cloudflare Tunnel.

Repo: `github.com/AgustinBertero/portfolio` (ajustar si cambia). Servidor: clon en `/srv/portfolio`, proyecto compose `portfolio`.

## Cómo trabajar

- Conmigo, en español. Código, commits, comentarios y README, en inglés. La landing es bilingüe (es/en).
- Antes de tocar un proyecto, leé su `README.md` y su `Makefile`.
- Cambios chicos y verificables. Commits con Conventional Commits y el slug como scope: `feat(helpdesk): add ticket triage`.
- Algo está terminado cuando `make ci` pasa, funciona bajo su subruta, el README está al día y la tarjeta de la landing coincide.
- Si lo que te pido choca con este archivo, preguntá antes de seguir.

## Skills de este repo

| Cuándo | Skill |
|---|---|
| Crear, renombrar o mover un proyecto, o un fallo que solo aparece bajo la subruta | `nuevo-proyecto` |
| Tocar `infra/`, Dockerfiles, `compose.yaml`, workflows o cualquier cosa que llega a producción | `deploy-homelab` |
| El proyecto guarda o procesa datos de personas: login, formularios, logs, IA, cookies, analítica | `gdpr-review` |
| Escribir o actualizar un README | `readme-portfolio` |

Si están instaladas, usá también Laravel Boost (dentro de cada proyecto Laravel), `react-best-practices`, `frontend-design` y `webapp-testing`.

## Estructura

```
.
├── AGENTS.md
├── .opencode/skills/          # skills de este repo
├── .github/workflows/         # un workflow por proyecto: <slug>.yml, site.yml
├── env/                       # NO va a git: infra.env y un <slug>.env por proyecto
├── site/                      # landing → /
│   └── content/               # profile.md (datos del perfil) y projects.ts (tarjetas)
├── projects/
│   └── <slug>/                # cada proyecto → /<slug>/
│       ├── README.md
│       ├── Makefile           # up, down, test, lint, ci, demo-reset
│       ├── Dockerfile
│       ├── compose.yaml       # producción (imagen de GHCR)
│       ├── compose.dev.yaml   # desarrollo local
│       ├── .env.example
│       └── docs/              # capturas, demo.gif, privacy-review.md
└── infra/
    ├── compose.yaml           # gateway + cloudflared + include de site y proyectos
    ├── compose.local.yaml     # probar el stack completo en local
    ├── gateway/               # Nginx: conf.d/, snippets/, projects/<slug>.conf
    ├── scripts/               # pull-deploy.sh, demo-reset.sh
    ├── systemd/               # timers de deploy y reset de demos
    ├── ansible/               # provisión del mini PC
    └── terraform/             # Cloudflare: DNS, túnel, Access, WAF
```

## Reglas que no se rompen

1. **El servidor también aloja servicios de clientes.** Solo se toca el proyecto compose `portfolio` y `/srv/portfolio`. Nada de `docker system prune` ni de borrar contenedores, redes o volúmenes ajenos.
2. **Secretos solo en `env/`**, fuera de git. En el repo, `.env.example` con valores ficticios. Si encontrás un secreto en el código o en el historial, avisá antes de seguir.
3. **Demos con datos sintéticos.** Nunca datos ni código de clientes de Sysprovider o Neuraweb.
4. **Sin puertos publicados al host en producción.** Todo entra por cloudflared → gateway.
5. **SSRF:** ninguna función que descargue URLs enviadas por el usuario sin las protecciones de `deploy-homelab`. El servidor está en una red doméstica.
6. **Nada inventado:** ni datos del perfil, ni métricas, ni clientes. La única fuente del perfil es `site/content/profile.md`.
7. **`main` llega a producción sola** (el servidor hace pull cada 5 minutos). Solo se mergea con CI en verde.

## Subrutas

- `/` → landing (`site/`). `/<slug>/` → proyecto.
- El gateway quita el prefijo `/<slug>` y envía `X-Forwarded-Prefix: /<slug>`; la app genera sus URLs con el prefijo. Next.js es la excepción (usa `basePath`). Detalle por stack en `nuevo-proyecto`.
- Slugs reservados: `en`, `api`, `admin`, `assets`, `static`, `health`, `_next`, `cdn-cgi`.

### Limitación conocida: mismo origen

Todos los proyectos comparten origen, así que una subruta no es una frontera de seguridad: un script de un proyecto puede leer otro. Para reducir el riesgo:

- cookies con nombre propio (`<slug>_session`), `Path=/<slug>`, `HttpOnly`, `Secure` y `SameSite=Lax`;
- claves de `localStorage` y `sessionStorage` con prefijo `<slug>:`;
- CSP por proyecto en el gateway, con `frame-ancestors 'none'` y sin `unsafe-eval`;
- nunca renderizar HTML enviado por usuarios sin sanitizar;
- ningún service worker con scope `/`.

Si un proyecto necesita aislamiento real (subidas públicas de archivos, HTML de terceros, autenticación delicada), va a un subdominio `<slug>.agustinbertero.dev.ar`.

## Proyectos

| Slug | Proyecto | Stack previsto | Estado |
|---|---|---|---|
| `helpdesk` | Helpdesk con triage por IA | Laravel + React/TS + LLM | planned |
| `legal-cases` | SaaS de expedientes para estudios jurídicos | Laravel + Inertia/React + TS | planned |
| `uptime` | Monitor de uptime, SSL, DNS y dominios | Laravel + React/TS | planned |
| `odoo-sync` | Conector Odoo ↔ WooCommerce/PrestaShop | Laravel + colas | planned |
| `log-forensics` | Analizador de logs con enfoque forense | Node/TS + React | planned |

Estados: `planned` (no aparece en la landing) → `wip` (aparece como "en desarrollo") → `live` (demo funcionando, README completo y `gdpr-review` hecho si aplica).

## Landing (`site/`)

- Next.js + TypeScript + Tailwind con `output: 'export'` y `trailingSlash: true`, servida como estático por nginx-unprivileged.
- Rutas `/` (es) y `/en/` (en), con metadatos y Open Graph por idioma.
- Secciones: hero (nombre, rol, CTA a proyectos, LinkedIn, GitHub, email), proyectos (desde `site/content/projects.ts`), experiencia, stack, sobre mí (abogado especializado en cibercrimen como diferencial) y contacto.
- Contacto sin formulario: `mailto:` y LinkedIn.
- CV descargable solo en versión pública, sin teléfono.
- Sin cookies ni scripts de terceros; fuentes self-hosted. Si hace falta analítica, Umami self-hosted sin cookies.
- Objetivos: WCAG 2.2 AA, Lighthouse ≥ 95 en las cuatro categorías y contenido legible sin JavaScript.
