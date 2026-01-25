#!/usr/bin/env bash
set -euo pipefail

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REV_DIR="$(cd "${HOOK_DIR}/.." && pwd)"

echo "[start-fe] HOOK_DIR=${HOOK_DIR}"
echo "[start-fe] REV_DIR=${REV_DIR}"

if [[ -f "${HOOK_DIR}/env.sh" ]]; then
  source "${HOOK_DIR}/env.sh"
else
  echo "[start-fe] env.sh not found in ${HOOK_DIR}" >&2
  exit 11
fi

: "${RELEASE_ID:?RELEASE_ID is required}"
: "${ARCHIVE_URL:?ARCHIVE_URL is required}"

ARTIFACT_DIR="/home/ubuntu/artifact/fe"
TAR_PATH="${ARTIFACT_DIR}/bizkit-fe-${RELEASE_ID}.tar.gz"

sudo mkdir -p "${ARTIFACT_DIR}"

if command -v curl >/dev/null 2>&1; then
  curl -fsSL "${ARCHIVE_URL}" -o "/tmp/bizkit-fe-${RELEASE_ID}.tar.gz"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "/tmp/bizkit-fe-${RELEASE_ID}.tar.gz" "${ARCHIVE_URL}"
else
  echo "[start-fe] neither curl nor wget is installed" >&2
  exit 10
fi

sudo mv "/tmp/bizkit-fe-${RELEASE_ID}.tar.gz" "${TAR_PATH}"
sudo chmod 0644 "${TAR_PATH}"
ls -al "${TAR_PATH}" || true

chmod +x "/home/ubuntu/deploy-fe.sh"
exec "/home/ubuntu/deploy-fe.sh" "${RELEASE_ID}"