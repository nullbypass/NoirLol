#!/usr/bin/env sh
set -eu
if ! command -v docker >/dev/null 2>&1; then echo "Docker no está instalado."; exit 1; fi
if [ ! -f .env ]; then
  cp .env.example .env
  JWT=$(openssl rand -hex 48 2>/dev/null || head -c 64 /dev/urandom | base64)
  IP=$(openssl rand -hex 48 2>/dev/null || head -c 64 /dev/urandom | base64)
  sed -i "s/change-this-to-a-long-random-secret/$JWT/" .env
  sed -i "s/change-this-too/$IP/" .env
fi
docker compose up -d --build
printf '\nActivo en http://127.0.0.1:3000\n'
