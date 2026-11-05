#!/usr/bin/env bash
# infra/scripts/pull-deploy.sh — deploy por pull: trae la config del repo y las imágenes nuevas de GHCR.
# Solo opera sobre el proyecto compose "portfolio"; nunca toca contenedores de clientes.
set -euo pipefail

REPO_DIR="${REPO_DIR:-/srv/portfolio}"
compose() { docker compose -f "$REPO_DIR/infra/compose.yaml" "$@"; }

cd "$REPO_DIR"
before="$(git rev-parse HEAD)"
git pull --ff-only --quiet
after="$(git rev-parse HEAD)"

compose pull --quiet
compose up -d --remove-orphans

# Los archivos del gateway están montados: si cambiaron, validar y recargar sin cortar el servicio.
if [[ "$before" != "$after" ]] && git diff --name-only "$before" "$after" -- infra/gateway | grep -q .; then
    compose exec -T gateway nginx -t
    compose exec -T gateway nginx -s reload
fi
