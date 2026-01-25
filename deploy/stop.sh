#!/usr/bin/env bash
set -euo pipefail

if systemctl is-active --quiet bizkit-fe; then
  sudo systemctl stop bizkit-fe
else
fi