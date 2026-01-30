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

# 파일 저장 경로/파일명 정의
ARTIFACT_DIR="/home/ubuntu/artifact/fe"
TAR_PATH="${ARTIFACT_DIR}/bizkit-fe-${RELEASE_ID}.tar.gz"

TMP_TAR="/tmp/bizkit-fe-${RELEASE_ID}.tar.gz"

# TMP 삭제
cleanup() {
  if [[ -f "${TMP_TAR}" ]]; then
    sudo rm -f "${TMP_TAR}" || true
  fi
}
trap cleanup EXIT

sudo mkdir -p "${ARTIFACT_DIR}"

# presigned url로 tar.gz 다운로드 /tmp으로 임시 파일 저장
if command -v curl >/dev/null 2>&1; then
  curl -fsSL "${ARCHIVE_URL}" -o "${TMP_TAR}"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "${TMP_TAR}" "${ARCHIVE_URL}"
else
  echo "[start-fe] neither curl nor wget is installed" >&2
  exit 10
fi

# 실행 위치로 이동 및 권한 정리
sudo mv "${TMP_TAR}" "${TAR_PATH}"
sudo chmod 0644 "${TAR_PATH}"
ls -al "${TAR_PATH}" || true

# 배포 스크립트 deploy-fe.sh 실행
chmod +x "${HOOK_DIR}/deploy-fe.sh"
exec "${HOOK_DIR}/deploy-fe.sh" "${RELEASE_ID}"