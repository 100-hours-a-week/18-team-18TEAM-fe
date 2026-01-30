#!/usr/bin/env bash
set -euo pipefail

if systemctl is-active --quiet "${secrets.FE_SERVICE_UNIT}"; then
  systemctl stop "${secrets.FE_SERVICE_UNIT}"
fi

exit 0