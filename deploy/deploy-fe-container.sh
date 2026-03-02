#!/usr/bin/env bash
set -euo pipefail

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "${HOOK_DIR}/env.sh" ]]; then
  # shellcheck disable=SC1091
  source "${HOOK_DIR}/env.sh"
fi

APP_HOME="/home/ubuntu"
STATE_DIR="${APP_HOME}/artifact/fe-container"
CURRENT_RELEASE_FILE="${STATE_DIR}/.current_release"
CURRENT_IMAGE_FILE="${STATE_DIR}/.current_image"

UBUNTU_USER="${UBUNTU_USER:-ubuntu}"
UBUNTU_HOME="/home/${UBUNTU_USER}"
UBUNTU_UID="$(id -u "${UBUNTU_USER}")"
USER_RUNTIME_DIR="/run/user/${UBUNTU_UID}"

CONTAINER_NAME="${CONTAINER_NAME:-bizkit-fe}"
UNIT_NAME="container-${CONTAINER_NAME}.service"
HEALTH_CHECK_URL="${HEALTH_CHECK_URL:-http://127.0.0.1:3000/}"
CONTAINER_PORT="${CONTAINER_PORT:-3000}"
HOST_PORT="${HOST_PORT:-3000}"
PODMAN_NETWORK="${PODMAN_NETWORK:-podman}"
REDIS_URL="${REDIS_URL:-}"

: "${RELEASE_ID:?RELEASE_ID is required}"
: "${APP_STAGE:?APP_STAGE is required}"
: "${IMAGE_URI:?IMAGE_URI is required}"
: "${REDIS_URL:?REDIS_URL is required}"

NETWORK_ARGS=()
if [[ "${APP_STAGE}" == "dev" || "${APP_STAGE}" == "development" ]]; then
  NETWORK_ARGS=(--network "${PODMAN_NETWORK}")
fi

for cmd in podman aws curl runuser systemctl; do
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "[deploy-fe-container] missing command: ${cmd}" >&2
    exit 2
  fi
done

if [[ ! -d "${USER_RUNTIME_DIR}" ]]; then
  echo "[deploy-fe-container] user runtime dir not found: ${USER_RUNTIME_DIR}" >&2
  echo "[deploy-fe-container] check linger: loginctl show-user ${UBUNTU_USER} | grep Linger" >&2
  exit 3
fi

as_ubuntu() {
  runuser -u "${UBUNTU_USER}" -- env \
    HOME="${UBUNTU_HOME}" \
    XDG_RUNTIME_DIR="${USER_RUNTIME_DIR}" \
    DBUS_SESSION_BUS_ADDRESS="unix:path=${USER_RUNTIME_DIR}/bus" \
    "$@"
}

install -d -m 0755 -o "${UBUNTU_USER}" -g "${UBUNTU_USER}" "${STATE_DIR}"

PREV_RELEASE_ID=""
PREV_IMAGE_URI=""
if [[ -f "${CURRENT_RELEASE_FILE}" ]]; then
  PREV_RELEASE_ID="$(tr -d '\r' < "${CURRENT_RELEASE_FILE}" | xargs || true)"
fi
if [[ -f "${CURRENT_IMAGE_FILE}" ]]; then
  PREV_IMAGE_URI="$(tr -d '\r' < "${CURRENT_IMAGE_FILE}" | xargs || true)"
fi

REGISTRY="${IMAGE_URI%%/*}"
if [[ ! "${REGISTRY}" =~ \.ecr\.[a-z0-9-]+\.amazonaws\.com$ ]]; then
  echo "[deploy-fe-container] invalid ECR registry in IMAGE_URI=${IMAGE_URI}" >&2
  exit 4
fi
AWS_REGION="$(echo "${REGISTRY}" | sed -E 's#^.*\.ecr\.([a-z0-9-]+)\.amazonaws\.com$#\1#')"

echo "[deploy-fe-container] release=${RELEASE_ID} stage=${APP_STAGE}"
echo "[deploy-fe-container] image=${IMAGE_URI}"
echo "[deploy-fe-container] previous_release=${PREV_RELEASE_ID:-none}"
echo "[deploy-fe-container] previous_image=${PREV_IMAGE_URI:-none}"
echo "[deploy-fe-container] systemd_unit=${UNIT_NAME}"

as_ubuntu bash -lc "aws ecr get-login-password --region '${AWS_REGION}' | podman login --username AWS --password-stdin '${REGISTRY}'"

as_ubuntu podman pull "${IMAGE_URI}"
as_ubuntu systemctl --user disable --now "${UNIT_NAME}" >/dev/null 2>&1 || true

as_ubuntu podman create \
  --name "${CONTAINER_NAME}" \
  --replace \
  "${NETWORK_ARGS[@]}" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  -e "REDIS_URL=${REDIS_URL}" \
  "${IMAGE_URI}"

as_ubuntu bash -lc "mkdir -p '${UBUNTU_HOME}/.config/systemd/user' && cd '${UBUNTU_HOME}/.config/systemd/user' && podman generate systemd --new --name '${CONTAINER_NAME}' --files --restart-policy always"

as_ubuntu systemctl --user daemon-reload
as_ubuntu systemctl --user enable --now "${UNIT_NAME}"

ok=0
for i in $(seq 1 30); do
  if curl -fsSL --max-time 2 "${HEALTH_CHECK_URL}" >/dev/null; then
    ok=1
    break
  fi
  sleep 1
done

if [[ "${ok}" -eq 1 ]]; then
  echo "${RELEASE_ID}" > "${CURRENT_RELEASE_FILE}" && chown "${UBUNTU_USER}:${UBUNTU_USER}" "${CURRENT_RELEASE_FILE}"
  echo "${IMAGE_URI}" > "${CURRENT_IMAGE_FILE}" && chown "${UBUNTU_USER}:${UBUNTU_USER}" "${CURRENT_IMAGE_FILE}"
  echo "[deploy-fe-container] SUCCESS release=${RELEASE_ID}"
  exit 0
fi

echo "[deploy-fe-container] FAILED healthcheck. rollback start." >&2
as_ubuntu podman logs --tail 200 "${CONTAINER_NAME}" || true

as_ubuntu systemctl --user disable --now "${UNIT_NAME}" >/dev/null 2>&1 || true
as_ubuntu podman rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

if [[ -n "${PREV_IMAGE_URI}" ]]; then
  echo "[deploy-fe-container] rollback image=${PREV_IMAGE_URI}" >&2
  as_ubuntu podman pull "${PREV_IMAGE_URI}"
  as_ubuntu podman create \
    --name "${CONTAINER_NAME}" \
    --replace \
    "${NETWORK_ARGS[@]}" \
    -p "${HOST_PORT}:${CONTAINER_PORT}" \
    -e "REDIS_URL=${REDIS_URL}" \
    "${PREV_IMAGE_URI}"

  as_ubuntu bash -lc "cd '${UBUNTU_HOME}/.config/systemd/user' && podman generate systemd --new --name '${CONTAINER_NAME}' --files --restart-policy always"
  as_ubuntu systemctl --user daemon-reload
  as_ubuntu systemctl --user enable --now "${UNIT_NAME}"

  for i in $(seq 1 20); do
    if curl -fsSL --max-time 2 "${HEALTH_CHECK_URL}" >/dev/null; then
      echo "[deploy-fe-container] ROLLBACK OK release=${PREV_RELEASE_ID:-unknown}" >&2
      exit 1
    fi
    sleep 1
  done
fi

echo "[deploy-fe-container] ROLLBACK FAILED" >&2
exit 1
