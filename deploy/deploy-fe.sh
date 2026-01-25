#!/usr/bin/env bash
set -euo pipefail

APP_HOME=/home/ubuntu

SERVICE_UNIT="bizkit-fe.service"
ENV_FILE="${APP_HOME}/.env-fe"

ARTIFACT_DIR="${APP_HOME}/artifact/fe"
RELEASES_DIR="${ARTIFACT_DIR}/releases"
CURRENT_LINK="${ARTIFACT_DIR}/current"
BACKUP_DIR="${APP_HOME}/backup/fe"

CURRENT_FILE="${ARTIFACT_DIR}/.current_version"

RELEASE_ID="${1:-}"
TAR_PATH="${ARTIFACT_DIR}/bizkit-fe-${RELEASE_ID}.tar.gz"


HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/}"


# backup
if [[ -z "${RELEASE_ID}" ]]; then
  echo "[deploy-fe] missing RELEASE_ID. usage: deploy-fe.sh <version>" >&2
  exit 2
fi

if [[ ! -f "${TAR_PATH}" ]]; then
  echo "[deploy-fe] artifact tar not found: ${TAR_PATH}" >&2
  exit 3
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "[deploy-fe] env not found: ${ENV_FILE}" >&2
  exit 4
fi

sudo mkdir -p "${BACKUP_DIR}" "${RELEASES_DIR}"


PREV_ID=""
if [[ -f "${CURRENT_FILE}" ]]; then
  PREV_ID="$(cat "${CURRENT_FILE}" | tr -d '\r' | xargs || true)"
fi

if [[ -n "${PREV_ID}" && -d "${RELEASES_DIR}/${PREV_ID}" ]]; then
  echo "[deploy-fe] backup prev=${PREV_ID} -> ${BACKUP_DIR}"

  PREV_TAR="${ARTIFACT_DIR}/bizkit-fe-${PREV_ID}.tar.gz"

  if [[ -f "${PREV_TAR}" ]]; then
    cp -f "${PREV_TAR}" "${BACKUP_DIR}/bizkit-fe-${PREV_ID}.tar.gz"
  fi

  if [[ -f "${ENV_FILE}" ]]; then
    cp -f "${ENV_FILE}" "${BACKUP_DIR}/bizkit-fe-${PREV_ID}.env"
  fi
fi


TARGET_DIR="${RELEASES_DIR}/${RELEASE_ID}"

echo "[deploy-fe] Extracting artifact to ${TARGET_DIR}"
sudo rm -rf "${TARGET_DIR}"
sudo mkdir -p "${TARGET_DIR}"
sudo tar -xzf "${TAR_PATH}" -C "${TARGET_DIR}"

sudo chown -R ubuntu:ubuntu "${RELEASES_DIR}"

echo "[deploy-fe] Updating symlink: ${CURRENT_LINK} -> ${TARGET_DIR}"
sudo ln -sfn "${TARGET_DIR}" "${CURRENT_LINK}"

echo "[deploy-fe] Restarting ${SERVICE_UNIT}"
sudo systemctl daemon-reload
sudo systemctl restart "${SERVICE_UNIT}"

ok=0
for i in $(seq 1 30); do
  if curl -fsS --max-time 2 "${HEALTH_URL}" >/dev/null; then
    ok=1
    break
  fi
  sleep 1
done

if [[ "${ok}" -eq 1 ]]; then
  echo "${RELEASE_ID}" | sudo tee "${CURRENT_FILE}" >/dev/null
  echo "[deploy-fe] SUCCESS version=${RELEASE_ID}"
  exit 0
fi

echo "[deploy-fe] FAILED healthcheck. try rollback to prev=${PREV_ID}" >&2

if [[ -n "${PREV_ID}" && -d "${RELEASES_DIR}/${PREV_ID}" ]]; then
  PREV_DIR="${RELEASES_DIR}/${PREV_ID}"
  echo "[deploy-fe] rollback symlink -> ${PREV_DIR}"
  sudo ln -sfn "${PREV_DIR}" "${CURRENT_LINK}"
  sudo systemctl restart "${SERVICE_UNIT}"

  if curl -fsS --max-time 2 "${HEALTH_URL}" >/dev/null; then
    echo "[deploy-fe] ROLLBACK OK -> ${PREV_ID}" >&2
  else
    echo "[deploy-fe] ROLLBACK ALSO FAILED" >&2
  fi
else
  echo "[deploy-fe] no previous version to rollback to" >&2
fi

exit 1