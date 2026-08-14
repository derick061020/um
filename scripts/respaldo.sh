#!/usr/bin/env bash
# Respaldo completo del sistema: base de datos + documentos escaneados.
#
#   bash scripts/respaldo.sh              -> guarda en ./respaldos
#   bash scripts/respaldo.sh /ruta/destino
#
# Programarlo a diario en el servidor:
#   0 2 * * * cd /opt/um-crm && bash scripts/respaldo.sh >> /var/log/um-respaldo.log 2>&1

set -euo pipefail

DESTINO="${1:-./respaldos}"
FECHA="$(date +%Y-%m-%d_%H%M)"
CONTENEDOR="${CONTENEDOR_DB:-um_crm_db}"

# Carga las variables del .env sin ejecutarlo.
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source <(grep -E '^[A-Z_]+=' .env)
  set +a
fi

USUARIO="${POSTGRES_USER:-um}"
BASE="${POSTGRES_DB:-um_crm}"
ARCHIVOS="${STORAGE_DIR:-./storage/archivos}"

mkdir -p "$DESTINO"

echo "→ Respaldando la base de datos ($BASE)…"
docker exec -t "$CONTENEDOR" pg_dump -U "$USUARIO" -d "$BASE" --clean --if-exists \
  | gzip > "$DESTINO/um_crm_$FECHA.sql.gz"

if [[ -d "$ARCHIVOS" ]]; then
  echo "→ Respaldando los documentos escaneados…"
  tar -czf "$DESTINO/um_archivos_$FECHA.tar.gz" -C "$(dirname "$ARCHIVOS")" "$(basename "$ARCHIVOS")"
else
  echo "  (no se encontró la carpeta de archivos: $ARCHIVOS)"
fi

# Conserva los últimos 30 respaldos de cada tipo.
find "$DESTINO" -name 'um_crm_*.sql.gz' -type f -printf '%T@ %p\n' \
  | sort -rn | tail -n +31 | cut -d' ' -f2- | xargs -r rm -f
find "$DESTINO" -name 'um_archivos_*.tar.gz' -type f -printf '%T@ %p\n' \
  | sort -rn | tail -n +31 | cut -d' ' -f2- | xargs -r rm -f

echo "✓ Respaldo terminado en $DESTINO"
ls -lh "$DESTINO" | tail -4
