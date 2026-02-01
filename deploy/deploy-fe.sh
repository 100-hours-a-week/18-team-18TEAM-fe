#!/usr/bin/env bash
set -euo pipefail

APP_HOME=/home/ubuntu

SERVICE_UNIT="bizkit-fe.service"
HEALTH_CHECK_URL="http://127.0.0.1:3000/"

ARTIFACT_DIR="${APP_HOME}/artifact/fe" #임시 저장
RELEASES_DIR="${ARTIFACT_DIR}/releases" #버전별 관리
CURRENT_LINK="${ARTIFACT_DIR}/current"
BACKUP_DIR="${APP_HOME}/backup/fe" #백업

CURRENT_FILE="${ARTIFACT_DIR}/.current_version"

RELEASE_ID="${1:-}"
TAR_PATH="${ARTIFACT_DIR}/bizkit-fe-${RELEASE_ID}.tar.gz"

# 검증
if [[ -z "${RELEASE_ID}" ]]; then
  echo "[deploy-fe] missing RELEASE_ID. usage: deploy-fe.sh <version>" >&2
  exit 2
fi

if [[ ! -f "${TAR_PATH}" ]]; then
  echo "[deploy-fe] artifact tar not found: ${TAR_PATH}" >&2
  exit 3
fi

sudo mkdir -p "${BACKUP_DIR}" "${RELEASES_DIR}"

#백업
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
fi

# 새 버전
TARGET_DIR="${RELEASES_DIR}/${RELEASE_ID}"

echo "[deploy-fe] Extracting artifact to ${TARGET_DIR}"
sudo rm -rf "${TARGET_DIR}"
sudo mkdir -p "${TARGET_DIR}"
sudo tar -xzf "${TAR_PATH}" -C "${TARGET_DIR}"

mkdir -p "${TARGET_DIR}/.next/standalone/public"
cp -a "${TARGET_DIR}/public/." "${TARGET_DIR}/.next/standalone/public/"

mkdir -p "${TARGET_DIR}/.next/standalone/.next/static"
cp -a "${TARGET_DIR}/.next/static/." "${TARGET_DIR}/.next/standalone/.next/static/"

sudo chown -R ubuntu:ubuntu "${RELEASES_DIR}"

# symblolic 정상 작동
echo "[deploy-fe] Updating symlink: ${CURRENT_LINK} -> ${TARGET_DIR}"
sudo ln -sfn "${TARGET_DIR}" "${CURRENT_LINK}"

# systemd 재시작
echo "[deploy-fe] Restarting ${SERVICE_UNIT}"
sudo systemctl daemon-reload
sudo systemctl restart "${SERVICE_UNIT}"

#헬스체크 성공
ok=0
for i in $(seq 1 30); do
  if curl -fsSL --max-time 2 "${HEALTH_CHECK_URL}" >/dev/null; then
    ok=1
    break
  fi
  sleep 1
done

if [[ "${ok}" -eq 1 ]]; then
  echo "${RELEASE_ID}" | sudo tee "${CURRENT_FILE}" >/dev/null
  echo "[deploy-fe] SUCCESS version=${RELEASE_ID}"

  echo "[deploy-fe] remove all tarballs"
  sudo rm -f "${ARTIFACT_DIR}"/bizkit-fe-*.tar.gz || true

  KEEP_N=2

  echo "[deploy-fe] Cleanup: keep latest ${KEEP_N} releases, remove older ones"

  mapfile -t all_releases < <(ls -1 "${RELEASES_DIR}" 2>/dev/null | sort -V || true)

  if (( ${#all_releases[@]} > KEEP_N )); then
    del_count=$(( ${#all_releases[@]} - KEEP_N ))
    for rel in "${all_releases[@]:0:del_count}"; do
      # current, prev가 가리키는 버전은 실수로 지우지 않도록 방어
      if [[ "${rel}" == "${RELEASE_ID}" || ( -n "${PREV_ID}" && "${rel}" == "${PREV_ID}") ]]; then
        continue
      fi
      echo "[deploy-fe] remove old release dir: ${RELEASES_DIR}/${rel}"
      sudo rm -rf "${RELEASES_DIR:?}/${rel}"
    done
  fi  
  exit 0
fi

# 실패 시, 롤백
echo "[deploy-fe] FAILED healthcheck. try rollback to prev=${PREV_ID}" >&2

if [[ -n "${PREV_ID}" && -d "${RELEASES_DIR}/${PREV_ID}" ]]; then
  PREV_DIR="${RELEASES_DIR}/${PREV_ID}"

  echo "[deploy-fe] rollback symlink -> ${PREV_DIR}"
  sudo ln -sfn "${PREV_DIR}" "${CURRENT_LINK}"
  sudo systemctl restart "${SERVICE_UNIT}"

  if curl -fsSL --max-time 2 "${HEALTH_CHECK_URL}" >/dev/null; then
    echo "[deploy-fe] ROLLBACK OK -> ${PREV_ID}" >&2
  else
    echo "[deploy-fe] ROLLBACK ALSO FAILED" >&2
  fi
else
  echo "[deploy-fe] no previous version to rollback to" >&2
fi

exit 1