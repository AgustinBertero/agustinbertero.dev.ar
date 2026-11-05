#!/usr/bin/env bash
# infra/scripts/pull-deploy.sh — deploy por pull: trae la config del repo y las imágenes nuevas de GHCR.
# Solo opera sobre el proyecto compose "portfolio"; nunca toca contenedores de clientes.
set -euo pipefail

REPO_DIR="${REPO_DIR:-/srv/portfolio}"
COMPOSE_FILES=(-f "$REPO_DIR/infra/compose.yaml")
# On server1 the gateway is published on loopback and Cloudflare runs as a systemd
# tunnel, so the local override is part of production here.
if [[ -f "$REPO_DIR/infra/compose.local.yaml" ]]; then
    COMPOSE_FILES+=(-f "$REPO_DIR/infra/compose.local.yaml")
fi
compose() { docker compose "${COMPOSE_FILES[@]}" "$@"; }

cd "$REPO_DIR"
before="$(git rev-parse HEAD)"
git pull --ff-only --quiet
after="$(git rev-parse HEAD)"

compose pull --quiet --ignore-pull-failures
compose up -d --remove-orphans

# Los archivos del gateway están montados: si cambiaron, validar y recargar sin cortar el servicio.
if [[ "$before" != "$after" ]] && git diff --name-only "$before" "$after" -- infra/gateway | grep -q .; then
    compose exec -T gateway nginx -t
    compose exec -T gateway nginx -s reload
fi
