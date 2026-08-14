#!/usr/bin/env bash
# Arma el paquete listo para subir por FTP a un hosting compartido.
#
#   bash scripts/empaquetar-ftp.sh
#
# Produce la carpeta paquete-ftp/ con dos subcarpetas que se suben tal cual:
#
#   public_html/   -> el contenido de public/ (lo único que ve internet)
#   um-crm/        -> el resto de la aplicación, FUERA de la carpeta pública
#
# La base de datos va dentro ya migrada y con las cuatro cuentas creadas,
# así no hace falta ejecutar ningún comando en el servidor.

set -euo pipefail

cd "$(dirname "$0")/.."
RAIZ="$(pwd)"
DESTINO="$RAIZ/paquete-ftp"

echo "→ Limpiando el paquete anterior…"
rm -rf "$DESTINO"
mkdir -p "$DESTINO/public_html" "$DESTINO/um-crm"

# --- Dependencias solo de producción ----------------------------------------
echo "→ Instalando dependencias de producción (sin herramientas de desarrollo)…"
composer install --no-dev --optimize-autoloader --no-interaction --quiet

# --- Base de datos limpia, ya migrada y con las cuatro cuentas ---------------
echo "→ Preparando la base de datos…"
BASE_TMP="$RAIZ/database/paquete.sqlite"
rm -f "$BASE_TMP"
touch "$BASE_TMP"

DB_DATABASE="$BASE_TMP" APP_ENV=production php artisan migrate --force --quiet
DB_DATABASE="$BASE_TMP" APP_ENV=production php artisan db:seed --force --quiet

# --- Aplicación (todo menos public/) ----------------------------------------
echo "→ Copiando la aplicación…"
for carpeta in app bootstrap config database resources routes storage vendor; do
    cp -r "$RAIZ/$carpeta" "$DESTINO/um-crm/"
done
cp "$RAIZ/artisan" "$RAIZ/composer.json" "$RAIZ/composer.lock" "$DESTINO/um-crm/"

# La base recién preparada, y sin la de desarrollo.
rm -f "$DESTINO/um-crm/database/database.sqlite" "$DESTINO/um-crm/database/paquete.sqlite"
cp "$BASE_TMP" "$DESTINO/um-crm/database/database.sqlite"
rm -f "$BASE_TMP"

# Caché y registros vacíos: lo que se generó aquí no sirve en el servidor.
rm -rf "$DESTINO/um-crm/bootstrap/cache"/*.php
find "$DESTINO/um-crm/storage" -type f \( -name '*.log' -o -name '*.php' \) -delete 2>/dev/null || true
rm -rf "$DESTINO/um-crm/storage/framework/sessions"/* \
       "$DESTINO/um-crm/storage/framework/views"/* \
       "$DESTINO/um-crm/storage/framework/cache/data"/* 2>/dev/null || true

# Carpeta de los documentos escaneados.
mkdir -p "$DESTINO/um-crm/storage/app/private/documentos"

# Red de seguridad: si por error la carpeta acabara dentro de public_html,
# Apache no serviría nada de aquí.
cat > "$DESTINO/um-crm/.htaccess" <<'HT'
# Esta carpeta NO debe ser accesible desde internet.
Require all denied
HT

# --- Carpeta pública ---------------------------------------------------------
echo "→ Copiando la carpeta pública…"
cp -r "$RAIZ/public/." "$DESTINO/public_html/"

# index.php detecta solo si la aplicación está arriba o en ../um-crm,
# así que no hay nada que parchear aquí.

# --- .env de producción ------------------------------------------------------
echo "→ Generando el .env de producción…"
CLAVE="base64:$(head -c 32 /dev/urandom | base64)"

cat > "$DESTINO/um-crm/.env" <<ENV
APP_NAME="Mujeres Unidas"
APP_ENV=production
APP_KEY=$CLAVE
APP_DEBUG=false

# CÁMBIALO por la dirección real del sistema.
APP_URL=https://crm.tudominio.com

# Ponlo en false SOLO mientras el certificado HTTPS todavía no está activo.
# Con false la cámara del escáner no funcionará: es una regla del navegador.
FORCE_HTTPS=true

APP_LOCALE=es
APP_FALLBACK_LOCALE=es
APP_TIMEZONE=America/Mazatlan

LOG_CHANNEL=stack
LOG_LEVEL=warning

# La base es un solo archivo, dentro de esta misma carpeta.
DB_CONNECTION=sqlite

SESSION_DRIVER=file
SESSION_LIFETIME=480
CACHE_STORE=file
QUEUE_CONNECTION=sync

# Datos de la institución (salen en el PDF del tarjetón)
UM_NOMBRE="MUJERES UNIDAS"
UM_SEMANAS=12
ENV

# --- Resumen -----------------------------------------------------------------
TAM=$(du -sh "$DESTINO" | cut -f1)
ARCHIVOS=$(find "$DESTINO" -type f | wc -l)

cat <<FIN

────────────────────────────────────────────────────────────
✓ Paquete listo en:  paquete-ftp/

    public_html/   → súbelo al public_html de tu dominio
    um-crm/        → súbelo AL LADO de public_html (no dentro)

  Tamaño: $TAM  ·  $ARCHIVOS archivos
  Clave de aplicación generada nueva.
  Base de datos ya migrada, con las cuatro cuentas de rol.

  Antes de subir, edita um-crm/.env y pon tu APP_URL real.
  Después de subir, permisos de escritura (755) en:
      um-crm/storage  y  um-crm/bootstrap/cache

  Los detalles están en DESPLIEGUE-FTP.md
────────────────────────────────────────────────────────────
FIN
