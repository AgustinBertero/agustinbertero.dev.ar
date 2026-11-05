#!/usr/bin/env bash
# infra/scripts/demo-reset.sh — deja las demos públicas como recién instaladas (cada noche).
# Una línea "reset" por proyecto con datos de demo; la añade la skill nuevo-proyecto.
# shellcheck disable=SC2329  # las funciones se usan al añadir la primera línea "reset"
set -euo pipefail

REPO_DIR="${REPO_DIR:-/srv/portfolio}"
compose() { docker compose -f "$REPO_DIR/infra/compose.yaml" "$@"; }

status=0
reset() {
    local service="$1"
    shift
    if ! compose exec -T "$service" "$@"; then
        echo "demo-reset: falló $service" >&2
        status=1
    fi
}

# reset helpdesk-web php artisan demo:reset --force

exit "$status"
