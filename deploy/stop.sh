#!/usr/bin/env bash
set -euo pipefail

SERVICE_UNIT="bizkit-fe.service"

if systemctl is-active --quiet "$SERVICE_UNIT"; then
  systemctl stop "$SERVICE_UNIT"
fi

exit 0