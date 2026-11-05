---
name: deploy-homelab
description: Reglas y plantillas para llevar el portfolio a producción en el mini PC (Docker + Cloudflare Tunnel) que también aloja servicios de clientes. Cubre gateway Nginx, compose seguro, aislamiento de redes, imágenes en GHCR, deploy por pull con systemd, secretos, reset de demos y protección contra abuso y SSRF. Usar al tocar infra/, Dockerfiles, compose.yaml, workflows de GitHub Actions o cualquier cosa que llegue a producción, y al diagnosticar una demo caída.
---

# Despliegue en el mini PC

## Contexto

- Mini PC Linux en casa, con Docker. **También aloja servicios de clientes.**
- Repo clonado en `/srv/portfolio`, usuario `deploy` (en el grupo `docker`), proyecto compose `portfolio`.
- Entrada única: Cloudflare (DNS, WAF, Access) → Tunnel → `cloudflared` → `gateway` (Nginx) → proyectos.
- El repo es público. Las imágenes se publican en GHCR y el servidor las descarga; nadie entra al servidor desde internet.

```
Internet ─► Cloudflare ─► Tunnel ─► cloudflared ─(edge)─► gateway
                                    gateway ─(site_edge)───► site-web
                                    gateway ─(<slug>_edge)─► <slug>-web ─(<slug>_backend)─► <slug>-db
```

## Reglas

**Convivencia con clientes**

1. Todo comando de Docker lleva `-f infra/compose.yaml` (proyecto `portfolio`). Nunca `docker system prune`, ni borrar contenedores, redes o volúmenes que no sean del portfolio.
2. Nada fuera de `/srv/portfolio` sin pedírmelo. Los cambios del host van en `infra/ansible/`.

**Exposición**

3. Sin `ports:` en producción. Solo `compose.local.yaml` publica el gateway, y en `127.0.0.1`.
4. Nunca montar `/var/run/docker.sock` en servicios del portfolio.
5. Paneles de administración (Portainer, Horizon, Telescope, Adminer, `/admin` de cualquier app) solo detrás de Cloudflare Access; nunca públicos. `APP_DEBUG=false` en producción.

**Contenedores**

6. Usuario no root, `no-new-privileges`, `cap_drop: [ALL]` (salvo bases de datos, que cambian de usuario al arrancar), `read_only: true` cuando la imagen lo permita, límites de CPU y RAM, y rotación de logs. Si alguna no se puede aplicar, dejalo comentado con el motivo.
7. Redes por proyecto: `<slug>_edge` (interna, gateway ↔ web), `<slug>_backend` (interna, web ↔ db/redis) y `<slug>_egress` solo si la app necesita salir a internet. Los proyectos no se ven entre sí.
8. Imágenes de terceros con versión fijada (mejor aún, con digest). Las plantillas traen etiquetas flotantes marcadas para fijar al copiarlas.

**Secretos y CI**

9. Secretos solo en `/srv/portfolio/env/*.env` (archivos `chmod 600`, carpeta `chmod 700`). En el repo, `.env.example` con valores ficticios. Respaldá `env/` cifrado (gestor de contraseñas o `age`), nunca en el repo.
10. GitHub Actions solo con runners de GitHub. **Nunca runners self-hosted**: con el repo público, un PR desde un fork podría ejecutar código en el servidor.
11. `main` protegida y 2FA en GitHub: lo que entra a `main` llega al servidor en 5 minutos como mucho.

**Abuso y SSRF**

12. Rate limit en el gateway: zona `perip` para todo y zona `ai` para endpoints caros. Además, reglas de rate limiting y WAF en Cloudflare.
13. APIs de IA: tope de gasto en el proveedor, proveedores sin retención ni entrenamiento con los datos, y nunca datos reales.
14. Sin subidas de archivos abiertas. Si hacen falta: tamaño máximo, tipo validado por contenido, guardadas fuera del webroot y servidas con `Content-Disposition: attachment`.
15. **Cualquier función que descargue una URL enviada por el usuario** (monitor, escáner, webhooks, vistas previas):
    - solo `http` y `https`, puertos 80 y 443;
    - resolver el DNS y rechazar si **alguna** IP es privada, loopback, link-local, CGNAT, multicast o de metadatos: `0.0.0.0/8`, `10.0.0.0/8`, `100.64.0.0/10`, `127.0.0.0/8`, `169.254.0.0/16`, `172.16.0.0/12`, `192.168.0.0/16`, `224.0.0.0/4`, `::1/128`, `fc00::/7`, `fe80::/10`, y las IPv4 mapeadas en IPv6;
    - conectar a la IP ya validada (evita DNS rebinding) y repetir la validación en cada redirección, con un máximo de 3;
    - timeout corto y tamaño máximo de respuesta;
    - en la demo pública, mejor una lista de dominios de ejemplo permitidos.

    El servidor está en la red de casa: sin esto, la demo sirve para escanear el router y los servicios de clientes.

## Plantillas

En `templates/` junto a este archivo:

| Plantilla | Destino |
|---|---|
| `infra/compose.yaml` | `infra/compose.yaml` |
| `infra/compose.local.yaml` | `infra/compose.local.yaml` |
| `infra/gateway/conf.d/default.conf` | `infra/gateway/conf.d/default.conf` |
| `infra/gateway/snippets/*.conf` | `infra/gateway/snippets/` |
| `infra/scripts/*.sh` | `infra/scripts/` (con `chmod +x`) |
| `infra/systemd/*` | `infra/systemd/` (se instalan en `/etc/systemd/system/`) |
| `site/compose.yaml` | `site/compose.yaml` |

Las plantillas de cada proyecto (gateway, compose y workflow) están en la skill `nuevo-proyecto`. La landing usa ese mismo workflow con `site` como slug.

Detalles que importan:

- La subred de `edge` en `infra/compose.yaml` y `set_real_ip_from` en `default.conf` deben coincidir. Elegí una subred que no usen las redes de los clientes (`docker network ls` y `docker network inspect`).
- El gateway monta **carpetas**, no archivos sueltos: `git pull` reemplaza los archivos y un bind mount de archivo seguiría viendo la versión vieja.
- `add_header` no se hereda si una `location` define el suyo; por eso cada `location` incluye `snippets/security-headers.conf`.
- `proxy_pass` con variable más `resolver` hace que un proyecto caído no impida arrancar el gateway.
- `X-Forwarded-Proto` se calcula a partir de `CF-Connecting-IP`: si la petición vino por Cloudflare, es `https`. Por eso "Always Use HTTPS" tiene que estar activo en Cloudflare.

## Primera instalación

1. Usuario `deploy` en el grupo `docker`. Equivale a root: protegé esa cuenta.
2. `git clone https://github.com/AgustinBertero/portfolio /srv/portfolio`
3. `mkdir -m 700 /srv/portfolio/env`, y dentro `infra.env` con `TUNNEL_TOKEN=...` y un `<slug>.env` por proyecto (`chmod 600`).
4. En Cloudflare Zero Trust: un túnel con el hostname público `agustinbertero.dev.ar` → `http://gateway:8080`. Activá "Always Use HTTPS".
5. Aplicaciones de Cloudflare Access para todo lo administrativo (por ejemplo, `admin.agustinbertero.dev.ar` y `agustinbertero.dev.ar/<slug>/admin`). SSH al servidor por `cloudflared access`, sin puertos abiertos.
6. Paquetes de GHCR públicos, o `docker login ghcr.io` en el servidor con un token de solo lectura (`read:packages`).
7. `sudo cp infra/systemd/* /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable --now portfolio-deploy.timer portfolio-demo-reset.timer`

Cuando lo pases a código: Ansible para el host (paquetes, usuario, Docker, unidades systemd, actualizaciones automáticas) y Terraform con el provider de Cloudflare para DNS, túnel, Access y WAF.

## Flujo de cambios

PR → CI en verde → merge a `main` → GitHub Actions publica la imagen en GHCR → el timer (cada 5 minutos) hace `git pull`, `compose pull` y `compose up -d`. Si cambió `infra/gateway/`, valida con `nginx -t` y recarga.

**Rollback:** `git revert` del commit y dejar que CI publique de nuevo. En una emergencia:

```bash
sudo systemctl stop portfolio-deploy.timer
docker tag ghcr.io/agustinbertero/portfolio-<slug>:<sha-bueno> ghcr.io/agustinbertero/portfolio-<slug>:latest
docker compose -f infra/compose.yaml up -d <slug>-web
# cuando main esté arreglado:
sudo systemctl start portfolio-deploy.timer
```

## Probar en local

```bash
mkdir -p env && touch env/infra.env
cp projects/<slug>/.env.example env/<slug>.env      # APP_URL=http://localhost:8080/<slug>
docker build -t ghcr.io/agustinbertero/portfolio-site:latest site
docker build -t ghcr.io/agustinbertero/portfolio-<slug>:latest projects/<slug>
docker compose -f infra/compose.yaml -f infra/compose.local.yaml up -d
# abrir http://localhost:8080/<slug>/
```

Cada proyecto incluido en `infra/compose.yaml` necesita su `env/<slug>.env`. Las imágenes construidas en local tienen la misma etiqueta que las de GHCR, así que compose las usa sin descargar nada. `cloudflared` no arranca en local (perfil `tunnel`).

## Diagnóstico

```bash
systemctl status portfolio-deploy.timer portfolio-deploy.service
journalctl -u portfolio-deploy -n 50 --no-pager
docker compose -f infra/compose.yaml ps
docker compose -f infra/compose.yaml logs --tail 100 <servicio>
docker compose -f infra/compose.yaml exec gateway nginx -t
curl -sI https://agustinbertero.dev.ar/health
```

## Cortes en casa

- SAI para el mini PC y el router.
- `restart: unless-stopped` en todo, Docker habilitado al arranque y `OnBootSec` en el timer.
- Las demos no necesitan backup: se reconstruyen desde los seeders. Lo que hay que respaldar es `env/`, cifrado.
- Cada README tiene GIF y capturas, para que el proyecto se entienda aunque la demo esté caída.
