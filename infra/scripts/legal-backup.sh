#!/usr/bin/env bash
# Offsite backup for the private legal case app.
# Requires env/legal-backup.env with RESTIC_REPOSITORY, RESTIC_PASSWORD and the
# S3/R2 credentials. The document volume is already encrypted; restic adds a
# second encryption layer and retention.
set -euo pipefail

REPO_DIR="${REPO_DIR:-/srv/portfolio}"
ENV_FILE="${ENV_FILE:-$REPO_DIR/env/legal-backup.env}"
COMPOSE_FILES=(-f "$REPO_DIR/infra/compose.yaml")
if [[ -f "$REPO_DIR/infra/compose.local.yaml" ]]; then
    COMPOSE_FILES+=(-f "$REPO_DIR/infra/compose.local.yaml")
fi

if [[ ! -f "$ENV_FILE" ]]; then
    echo "legal-backup: missing $ENV_FILE" >&2
    exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

: "${RESTIC_REPOSITORY:?RESTIC_REPOSITORY is required}"
: "${RESTIC_PASSWORD:?RESTIC_PASSWORD is required}"
: "${AWS_ACCESS_KEY_ID:?AWS_ACCESS_KEY_ID is required}"
: "${AWS_SECRET_ACCESS_KEY:?AWS_SECRET_ACCESS_KEY is required}"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

docker compose "${COMPOSE_FILES[@]}" exec -T legal-db \
    pg_dump -U "${POSTGRES_USER:-legal}" -d "${POSTGRES_DB:-legal}" -Fc > "$tmp/legal-db.dump"

docker run --rm -v portfolio_legal_storage:/data:ro -v "$tmp":/backup:ro alpine:3.22 \
    tar -czf /backup/legal-docs.tar.gz -C /data .

restic backup "$tmp" --tag legal-cases
restic forget --tag legal-cases --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune

echo "legal-backup: ok"
