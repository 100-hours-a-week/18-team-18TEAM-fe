#!/usr/bin/env bash
set -euo pipefail

curl -fsS --max-time 2 "http://127.0.0.1:3000/" >/dev/null
systemctl is-active --quiet bizkit-fe.service
echo "[deploy][fe] validate OK"
