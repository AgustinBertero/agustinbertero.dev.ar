# Infrastructure

The portfolio runs on `server1.bertium.net` (mini PC, `192.168.1.135`, Tailscale `100.89.98.70`) and is published through Cloudflare in two hops:

```
Browser
  └── Cloudflare edge (*.dev.ar / *.bertium.net)
        └── Cloudflare Tunnel "portfolio" (systemd)
              └── 127.0.0.1:8080 gateway (nginx-unprivileged)
                    └── site-web:8080 (static Next.js export)
```

## dev.ar

`agustinbertero.dev.ar` is managed at https://dev.ar/dashboard. The space allows **one** record and no NS delegation, so it is not a Cloudflare zone.

- Mode: **DNS** (not HTTP redirect).
- Type: **CNAME**.
- Value: `portfolio.bertium.net` (no `https://`, no trailing slash).
- Clear any redirect before saving; the panel does not allow both.

Cloudflare serves `agustinbertero.dev.ar` with the `*.dev.ar` certificate and follows the CNAME to the `portfolio` tunnel. The tunnel ingress also lists `agustinbertero.dev.ar`, so the request reaches the same gateway even though the DNS name lives in the dev.ar zone.

If the CNAME route is not desired, the fallback is dev.ar **Redirección** to `https://portfolio.bertium.net/`; the URL in the browser changes.

## Cloudflare Tunnel

- Tunnel: `portfolio` (`75ea8abd-db17-4f6c-b817-386c4f105439`).
- Config: `/etc/cloudflared/portfolio.yml` (tracked in `infra/cloudflared/portfolio.yml`).
- Service: `cloudflared-portfolio.service` (tracked in `infra/systemd/`).
- Credentials: `/root/.cloudflared/75ea8abd-db17-4f6c-b817-386c4f105439.json`, never committed.
- Public hostnames: `portfolio.bertium.net` and `agustinbertero.dev.ar` → `http://127.0.0.1:8080`.
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

The deploy user needs Docker access and write access to `/srv/portfolio`. The timer is optional until the first CI image exists; the current image was built locally on server1.

## Secrets

- Cloudflare tunnel credentials: `/root/.cloudflared/*.json` (mode 600).
- `env/infra.env` with `TUNNEL_TOKEN` is only needed if the compose `cloudflared` service is used instead of the systemd tunnel. It is git-ignored.
