#!/usr/bin/env bash
set -euo pipefail

UBUNTU_USER="${UBUNTU_USER:-ubuntu}"
UBUNTU_HOME="/home/${UBUNTU_USER}"
UBUNTU_UID="$(id -u "${UBUNTU_USER}")"
USER_RUNTIME_DIR="/run/user/${UBUNTU_UID}"

CONTAINER_NAME="${CONTAINER_NAME:-bizkit-fe}"
UNIT_NAME="container-${CONTAINER_NAME}.service"
URL="${URL:-http://127.0.0.1:3000/}"

TRIES="${TRIES:-10}"
SLEEP_SEC="${SLEEP_SEC:-1}"
TIMEOUT_SEC="${TIMEOUT_SEC:-2}"

for cmd in podman runuser systemctl curl; do
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "[validate-fe-container] missing command: ${cmd}" >&2
    exit 2
  fi
done

if [[ ! -d "${USER_RUNTIME_DIR}" ]]; then
  echo "[validate-fe-container] user runtime dir not found: ${USER_RUNTIME_DIR}" >&2
  exit 3
fi

as_ubuntu() {
  runuser -u "${UBUNTU_USER}" -- env \
    HOME="${UBUNTU_HOME}" \
    XDG_RUNTIME_DIR="${USER_RUNTIME_DIR}" \
    DBUS_SESSION_BUS_ADDRESS="unix:path=${USER_RUNTIME_DIR}/bus" \
    "$@"
}

echo "[validate-fe-container] checking container=${CONTAINER_NAME}"

for i in $(seq 1 "${TRIES}"); do
  if ! as_ubuntu systemctl --user is-active --quiet "${UNIT_NAME}"; then
    echo "[validate-fe-container] unit not active: ${UNIT_NAME} (try=${i})"
    sleep "${SLEEP_SEC}"
    continue
  fi

  if ! as_ubuntu podman ps --format "{{.Names}}" | grep -Fxq "${CONTAINER_NAME}"; then
    echo "[validate-fe-container] container not running (try=${i})"
    sleep "${SLEEP_SEC}"
    continue
  fi

  HTTP_CODE="$(curl -fsSL -o /dev/null -w "%{http_code}" --max-time "${TIMEOUT_SEC}" "${URL}" 2>/dev/null || echo "0")"
  echo "[validate-fe-container] HTTP_CODE=${HTTP_CODE} (try=${i}/${TRIES})"
  if [[ "${HTTP_CODE}" =~ ^[23][0-9]{2}$ ]]; then
    echo "[validate-fe-container] FE validated OK (HTTP=${HTTP_CODE})"
    exit 0
  fi

  sleep "${SLEEP_SEC}"
done

echo "[validate-fe-container] FAILED"
as_ubuntu systemctl --user status "${UNIT_NAME}" --no-pager || true
as_ubuntu podman ps -a || true
as_ubuntu podman logs --tail 200 "${CONTAINER_NAME}" || true
exit 1
