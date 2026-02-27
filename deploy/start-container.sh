#!/usr/bin/env bash
set -euo pipefail

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[start-fe-container] HOOK_DIR=${HOOK_DIR}"

if [[ -f "${HOOK_DIR}/env.sh" ]]; then
  # shellcheck disable=SC1091
  source "${HOOK_DIR}/env.sh"
else
  echo "[start-fe-container] env.sh not found in ${HOOK_DIR}" >&2
  exit 11
fi

: "${RELEASE_ID:?RELEASE_ID is required}"
: "${APP_STAGE:?APP_STAGE is required}"
: "${IMAGE_URI:?IMAGE_URI is required}"

chmod +x "${HOOK_DIR}/deploy-fe-container.sh"
exec "${HOOK_DIR}/deploy-fe-container.sh"
