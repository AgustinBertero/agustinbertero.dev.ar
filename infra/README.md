# Infrastructure

The portfolio runs on `server1.bertium.net` (mini PC, `192.168.1.135`, Tailscale `100.89.98.70`) and is published through Cloudflare in two hops:

```
Browser
  └── Cloudflare edge (portfolio.bertium.net)
        └── Cloudflare Tunnel "portfolio" (systemd)
              └── 127.0.0.1:8080 gateway (nginx-unprivileged)
                    └── site-web:8080 (static Next.js export)
```

## Public domains

- **Canonical:** `https://portfolio.bertium.net/`.
- **Alias:** `https://agustinbertero.dev.ar/`, configured in the dev.ar panel as an **HTTP redirect** to `https://portfolio.bertium.net/`.

dev.ar allows one A/CNAME record and does not delegate the zone. A CNAME to a proxied hostname in another Cloudflare account returns **1014 (CNAME Cross-User Banned)**. Cloudflare for SaaS would solve it, but the account is asked to enable a paid plan, so the alias uses the redirect instead. Do not switch dev.ar back to DNS/CNAME unless the custom-hostname path is enabled.

## Helpdesk demo

- **Demo:** `https://portfolio.bertium.net/helpdesk/` (gateway → `helpdesk-web:8080`).
- **Case study:** `https://portfolio.bertium.net/projects/helpdesk/` (static portfolio route).
- **Services:** `helpdesk-web`, `helpdesk-worker`, `helpdesk-db` from `projects/helpdesk/compose.yaml`.
- **Secrets:** `env/helpdesk.env` (mode 600, owned by `deploy`), including `APP_KEY`, Postgres password and `DEEPSEEK_API_KEY`.
- **Migrations/seed:** `docker compose ... exec -T helpdesk-web php artisan migrate --seed --force`.
- **Nightly reset:** `portfolio-demo-reset.timer` runs `infra/scripts/demo-reset.sh`, which executes `php artisan demo:reset --force`.
- **Rate limit:** the gateway applies the `ai` zone to `POST /helpdesk/tickets/{id}/triage`.

## Cloudflare Tunnel

- Tunnel: `portfolio` (`75ea8abd-db17-4f6c-b817-386c4f105439`).
- Config: `/etc/cloudflared/portfolio.yml` (tracked in `infra/cloudflared/portfolio.yml`).
- Service: `cloudflared-portfolio.service` (tracked in `infra/systemd/`).
- Credentials: `/root/.cloudflared/75ea8abd-db17-4f6c-b817-386c4f105439.json`, never committed.
- Public hostnames: `portfolio.bertium.net` (and `agustinbertero.dev.ar`, ready if the alias ever moves back to DNS) → `http://127.0.0.1:8080`.
- The tunnel is managed with a local config file, not a dashboard token, so `cloudflared tunnel list` and the config on disk are the source of truth.

## Compose

```bash
cd /srv/portfolio
docker build -t ghcr.io/agustinbertero/portfolio-site:latest site
docker compose -f infra/compose.yaml -f infra/compose.local.yaml up -d
```

`infra/compose.local.yaml` is the server override here: it publishes the gateway on `127.0.0.1:8080` and disables the compose `cloudflared` service, because the tunnel runs under systemd. Do not publish port 8080 on a public interface.

## Updates

`.github/workflows/site.yml` builds and pushes the image to GHCR on every push to `main`. `infra/systemd/portfolio-deploy.timer` runs `infra/scripts/pull-deploy.sh` every five minutes, pulls the repo and images, recreates changed containers and reloads the gateway if its config changed.

The deploy user needs Docker access and write access to `/srv/portfolio`.

## Secrets

- Cloudflare tunnel credentials: `/root/.cloudflared/*.json` (mode 600).
- `env/infra.env` with `TUNNEL_TOKEN` is only needed if the compose `cloudflared` service is used instead of the systemd tunnel. It is git-ignored.
