#!/usr/bin/env bash
# Prepara un VPS recién creado (Ubuntu 22.04 / 24.04) para correr el sistema:
# Docker, firewall y Caddy. No toca la base de datos ni el .env; de eso se
# encarga el Paso 3 de DESPLIEGUE-HOSTINGER.md.
#
#   bash scripts/instalar-servidor.sh
#
# Se puede volver a ejecutar sin problema: si algo ya está instalado, lo salta.

set -euo pipefail

if [[ "$(id -u)" != "0" ]]; then
  echo "Este script necesita root. Entra con: ssh root@TU_IP" >&2
  exit 1
fi

if ! grep -qiE 'ubuntu|debian' /etc/os-release; then
  echo "Aviso: pensado para Ubuntu/Debian. Continúa bajo tu propio riesgo." >&2
fi

echo "→ Actualizando el sistema…"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq ca-certificates curl gnupg git ufw

# ---------- Docker ----------
if command -v docker >/dev/null 2>&1; then
  echo "→ Docker ya está instalado, se salta."
else
  echo "→ Instalando Docker…"
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
fi

# ---------- Firewall ----------
echo "→ Configurando el firewall (solo SSH, HTTP y HTTPS)…"
ufw allow 22/tcp   >/dev/null
ufw allow 80/tcp   >/dev/null
ufw allow 443/tcp  >/dev/null
ufw --force enable >/dev/null
ufw status numbered

# ---------- Caddy (HTTPS automático) ----------
if command -v caddy >/dev/null 2>&1; then
  echo "→ Caddy ya está instalado, se salta."
else
  echo "→ Instalando Caddy…"
  apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -qq
  apt-get install -y -qq caddy
  systemctl enable --now caddy
fi

# ---------- Intercambio, para que no muera la compilación ----------
if [[ "$(swapon --show --noheadings | wc -l)" -eq 0 ]]; then
  echo "→ Creando 2 GB de intercambio…"
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

cat <<'FIN'

────────────────────────────────────────────────────────────
✓ Servidor listo.

Sigue con el Paso 3 de DESPLIEGUE-HOSTINGER.md:

  cd /opt/um-crm
  cp .env.example .env
  echo "POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=')"
  echo "AUTH_SECRET=$(openssl rand -base64 48)"
  nano .env          # pega los dos valores y ajusta DATABASE_URL
  chmod 600 .env

  docker compose --profile prod up -d --build
  docker compose exec app npx prisma migrate deploy
  docker compose exec app npx tsx prisma/seed.ts

Y después el dominio en /etc/caddy/Caddyfile (Paso 5).
────────────────────────────────────────────────────────────
FIN
