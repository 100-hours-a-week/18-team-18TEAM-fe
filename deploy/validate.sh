#!/usr/bin/env bash
set -euo pipefail

SERVICE="bizkit-fe.service"
URL="http://127.0.0.1:3000/"

TRIES="${TRIES:-5}"
SLEEP_SEC="${SLEEP_SEC:-1}"
TIMEOUT_SEC="${TIMEOUT_SEC:-2}"

echo "[validate] checking FE..."

for i in $(seq 1 "${TRIES}"); do
  if ! systemctl is-active --quiet "$SERVICE"; then
    echo "[validate] $SERVICE not active yet (try=$i)"
    sleep "${SLEEP_SEC}"
    continue
  fi

  HTTP_CODE="$(curl -fsSL -o /dev/null -w "%{http_code}" --max-time "${TIMEOUT_SEC}" "${URL}" 2>/dev/null || echo "0")"
  echo "[validate] HTTP_CODE=${HTTP_CODE} (try=${i}/${TRIES})"
  if [[ "${HTTP_CODE}" =~ ^[23][0-9]{2}$ ]]; then
    echo "[validate] FE validated OK (HTTP=${HTTP_CODE})"
    exit 0
  fi

  sleep "${SLEEP_SEC}"
done

echo "[validate] FAILED"
exit 1