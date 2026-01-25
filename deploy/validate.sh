#!/usr/bin/env bash
set -euo pipefail

SERVICE="bizkit-fe.service"
URL="http://127.0.0.1:3000/"

echo "[validate] checking FE..."

for i in $(seq 1 5); do
  if ! systemctl is-active --quiet "$SERVICE"; then
    echo "[validate] $SERVICE not active yet (try=$i)"
    sleep 1
    continue
  fi

  if curl -fsS --max-time 2 "$URL" >/dev/null; then
    echo "[validate] OK"
    exit 0
  fi
  echo "[validate] HTTP failed (try=$i)"
  sleep 1
done

echo "[validate] FAILED"
exit 1