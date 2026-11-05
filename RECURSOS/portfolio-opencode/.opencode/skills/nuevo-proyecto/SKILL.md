---
name: nuevo-proyecto
description: Crea un proyecto nuevo del portfolio en projects/<slug>/ y lo publica en agustinbertero.dev.ar/<slug>/ (estructura, base path según el stack, gateway Nginx, compose, CI, tarjeta en la landing y verificación bajo la subruta). Usar al crear, renombrar o mover un proyecto, y cuando algo falla solo al servirse bajo su subruta (assets 404, redirecciones sin prefijo, cookies que no persisten).
---

# Nuevo proyecto del portfolio

Cada proyecto vive en `projects/<slug>/` y se publica en `https://agustinbertero.dev.ar/<slug>/`. Seguí los pasos en orden y no des nada por terminado sin el paso 9.

Las plantillas del proyecto están en `templates/` junto a este archivo. Las de infraestructura general (gateway, compose raíz, scripts) están en la skill `deploy-homelab`.

## 1. Slug

- kebab-case, corto, en inglés y ASCII: `helpdesk`, `legal-cases`, `odoo-sync`.
- No reservado: `en`, `api`, `admin`, `assets`, `static`, `health`, `_next`, `cdn-cgi`.
- Que no exista ya en la tabla de proyectos de `AGENTS.md`.
- En las plantillas, `<slug_>` es el slug con `_` en lugar de `-` (`odoo_sync`), porque Nginx no acepta guiones en nombres de variables.

## 2. Estructura

```
projects/<slug>/
├── README.md            # skill readme-portfolio
├── Makefile             # up, down, test, lint, ci, demo-reset
├── Dockerfile           # imagen de producción: escucha en 8080, usuario no root
├── compose.yaml         # producción: templates/compose.project.yaml
├── compose.dev.yaml     # local: build desde el código, puertos solo en 127.0.0.1
├── .env.example         # todas las variables, con valores ficticios
└── docs/                # screenshot.png, demo.gif, architecture.md, privacy-review.md
```

`make ci` corre lint y tests dentro de Docker, igual en local que en GitHub Actions.

Imágenes base recomendadas (fijá la versión al crearlas):
- Laravel: `serversideup/php`, variante `fpm-nginx` (no root, puerto 8080), o FrankenPHP.
- Estáticos (SPA): `nginxinc/nginx-unprivileged`.
- Node y Next.js: `node:<lts>-alpine` con `USER node` y `PORT=8080`.

## 3. Base path según el stack

| Stack | Gateway | Qué configurar en la app |
|---|---|---|
| Laravel (Blade o Inertia + React) | quita el prefijo | `.env` y proxies de confianza (abajo) |
| SPA con Vite + React | quita el prefijo | `base`, `basename` y fallback a `index.html` |
| Next.js | **no** quita el prefijo | `basePath` y `trailingSlash: true` |
| API Node bajo `/<slug>/api/` | quita `/<slug>/api` | rutas desde `/`; URLs absolutas a partir de `X-Forwarded-Prefix` |

### Laravel

`.env` de producción:

```dotenv
APP_URL=https://agustinbertero.dev.ar/<slug>
ASSET_URL=https://agustinbertero.dev.ar/<slug>
SESSION_COOKIE=<slug_>_session
SESSION_PATH=/<slug>
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
```

`bootstrap/app.php`: confiar en el gateway, incluido el prefijo. La app solo es alcanzable desde el gateway por una red interna; por eso `at: '*'`.

```php
use Illuminate\Http\Request;

->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(
        at: '*',
        headers: Request::HEADER_X_FORWARDED_FOR
            | Request::HEADER_X_FORWARDED_HOST
            | Request::HEADER_X_FORWARDED_PORT
            | Request::HEADER_X_FORWARDED_PROTO
            | Request::HEADER_X_FORWARDED_PREFIX,
    );
})
```

Con eso, `route()`, `url()`, `redirect()`, `@vite` e Inertia generan URLs con `/<slug>`. En consola y colas (por ejemplo, links en mails), Laravel toma el prefijo de `APP_URL`.

- Usá siempre `route()` o `url()`; nunca rutas escritas a mano como `'/login'` en Blade o JS.
- Con Ziggy, generá las rutas con `php artisan ziggy:generate` en vez de `@routes`: `@routes` inserta un script inline que la CSP bloquea.
- En local a través del gateway: `APP_URL=http://localhost:8080/<slug>` y `SESSION_SECURE_COOKIE=false`.

### SPA con Vite + React

```ts
// vite.config.ts
export default defineConfig({ base: '/<slug>/', plugins: [react()] })

// router
createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })

// llamadas a la API propia
fetch(`${import.meta.env.BASE_URL}api/tickets`)
```

Nginx dentro de la imagen (el gateway ya quitó el prefijo):

```nginx
server {
    listen 8080;
    root /usr/share/nginx/html;
    location / { try_files $uri $uri/ /index.html; }
    location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
}
```

Claves de `localStorage` siempre con prefijo `<slug>:`.

### Next.js

```ts
// next.config.ts
const nextConfig = { basePath: '/<slug>', trailingSlash: true, output: 'standalone' }
```

`trailingSlash: true` es obligatorio: sin él, Next redirige `/<slug>/` a `/<slug>` y el gateway de vuelta, en bucle. `Link`, el router y `next/image` aplican el `basePath` solos; los `fetch` a rutas propias no, así que usá una constante con el prefijo. En el gateway, usá la variante Next.js de la plantilla. Next usa scripts inline: su CSP necesita `script-src 'self' 'unsafe-inline'` o nonces generados en middleware.

## 4. Gateway

Copiá `templates/gateway-project.conf` a `infra/gateway/projects/<slug>.conf` y reemplazá `<slug>` y `<slug_>`.

- Ajustá la CSP a lo que el proyecto realmente usa (por ejemplo, `connect-src` si el navegador llama a una API externa). Nunca `unsafe-eval`.
- Endpoints caros (IA, login, exportaciones) van con la zona `ai`, como en el bloque comentado de la plantilla.

## 5. Compose y entorno

1. Copiá `templates/compose.project.yaml` a `projects/<slug>/compose.yaml`.
2. En `infra/compose.yaml`, añadí `- ../projects/<slug>/compose.yaml` a `include` y `- <slug>_edge` a `services.gateway.networks`.
3. Si la app necesita salir a internet (API de IA, SMTP), activá la red `<slug>_egress` solo en el servicio que la necesita. La base de datos, nunca.
4. Creá `env/<slug>.env` en el servidor a partir de `.env.example` (`chmod 600`). Nunca lo commitees.

## 6. CI

Copiá `templates/workflow.yml` a `.github/workflows/<slug>.yml`. Corre `make ci` en cada PR y, en `main`, publica `ghcr.io/agustinbertero/portfolio-<slug>:latest` y la etiqueta con el SHA del commit.

## 7. Landing y registro

- Añadí el proyecto a `site/content/projects.ts` con estado `wip`: slug, título y resumen en es/en, stack, enlace a la demo (`/<slug>/`) y al código.
- Añadí o actualizá su fila en la tabla de proyectos de `AGENTS.md`.

## 8. Demo

- Solo datos sintéticos (factories y seeders).
- Usuario demo con las credenciales visibles en el login de la demo y en el README.
- Un comando que deje la demo como recién instalada (en Laravel, `php artisan demo:reset --force`) y su línea en `infra/scripts/demo-reset.sh`.
- Aviso visible: "Demo pública: no introduzcas datos reales. Se reinicia cada noche."
- Sin envío de emails reales: driver `log` o Mailpit.
- Si usa IA: tope de gasto configurado en el proveedor y zona `ai` en el gateway.

## 9. Verificación bajo la subruta

Probalo en local con el stack completo (skill `deploy-homelab`, sección "Probar en local") y repetí contra producción después del deploy.

```bash
BASE=http://localhost:8080/<slug>        # después: https://agustinbertero.dev.ar/<slug>

curl -sI "$BASE" | grep -iE '^(HTTP|location)'                     # 301 → /<slug>/
curl -s -o /dev/null -w '%{http_code}\n' "$BASE/"                  # 200
curl -s "$BASE/" | grep -oE '(src|href|action)="/[^"]*"' | grep -v '"/<slug>/'
                                                                   # vacío, salvo enlaces a la landing
curl -s -o /dev/null -w '%{http_code}\n' "$BASE/<ruta-interna>"    # 200, o 302 a login con prefijo
curl -sI "$BASE/<ruta-protegida>" | grep -i '^location'            # contiene /<slug>/
curl -s -D - -o /dev/null "$BASE/login" | grep -i '^set-cookie'
                                                                   # <slug_>_session; path=/<slug>; httponly; samesite=lax (+ secure en prod)
curl -s -o /dev/null -w '%{http_code}\n' "$BASE/no-existe"         # 404 de la app, no de la landing
curl -sI "$BASE/" | grep -i '^content-security-policy'
```

En el navegador, o con la skill `webapp-testing`: login y logout, recargar en una ruta profunda, y consola sin errores de CSP ni 404.

## 10. Cierre

- README con la skill `readme-portfolio`.
- Si guarda datos de personas: skill `gdpr-review` y `docs/privacy-review.md` sin hallazgos altos abiertos.
- Recién entonces, estado `live` en `site/content/projects.ts` y en `AGENTS.md`.

## Renombrar un slug

1. Buscá el slug viejo en todo el repo (`grep -rn "<viejo>" --exclude-dir=node_modules --exclude-dir=vendor`) y reemplazalo en todos los puntos de arriba.
2. Mantené la URL vieja funcionando con una redirección en `infra/gateway/projects/<nuevo>.conf`:
   ```nginx
   location /<viejo>/ { rewrite ^/<viejo>/(.*)$ /<nuevo>/$1 permanent; }
   ```
3. Las sesiones abiertas de la demo se pierden (cambian el nombre y el path de la cookie). Es aceptable.
