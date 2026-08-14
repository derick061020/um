#!/usr/bin/env bash
# Despliegue y actualización por SSH en un hosting compartido.
#
# Se ejecuta EN EL SERVIDOR, desde la carpeta de la aplicación, indicando
# dónde está la raíz web del dominio:
#
#     cd ~/um/um-laravel
#     bash scripts/desplegar.sh ~/domains/tudominio.com/public_html
#
# Si no se indica, se asume public_html al lado de la aplicación.
#
# Es idempotente: la primera vez instala y las siguientes actualiza. Nunca
# toca el .env ni la base de datos que ya existen en el servidor.

set -euo pipefail

cd "$(dirname "$0")/.."
APP="$(pwd)"
PUBLICO="${1:-$(cd "$APP/.." && pwd)/public_html}"

echo "→ Aplicación: $APP"
echo "→ Carpeta pública: $PUBLICO"

# --- PHP correcto ------------------------------------------------------------
# En hosting compartido el `php` de la consola no siempre es el mismo que usa
# el sitio. Se busca uno 8.3 o superior antes que nada.
elegir_php() {
    for c in /usr/bin/php8.3 /opt/alt/php83/usr/bin/php /usr/local/bin/php8.3 php8.3 php; do
        if command -v "$c" >/dev/null 2>&1; then
            v="$("$c" -r 'echo PHP_MAJOR_VERSION*100+PHP_MINOR_VERSION;' 2>/dev/null || echo 0)"
            if [ "$v" -ge 803 ] 2>/dev/null; then
                echo "$c"
                return 0
            fi
        fi
    done
    return 1
}

if ! PHP="$(elegir_php)"; then
    echo "✗ No se encontró PHP 8.3 o superior." >&2
    echo "  En hPanel: Avanzado → Configuración PHP → elige 8.3." >&2
    echo "  Versiones vistas: $(command -v php && php -v | head -1)" >&2
    exit 1
fi

echo "→ PHP: $PHP ($("$PHP" -r 'echo PHP_VERSION;'))"

# --- Composer ----------------------------------------------------------------
if command -v composer >/dev/null 2>&1; then
    COMPOSER="composer"
elif [ -f "$APP/composer.phar" ]; then
    COMPOSER="$PHP $APP/composer.phar"
else
    echo "→ Composer no está instalado; se descarga en la carpeta del proyecto…"
    curl -sS https://getcomposer.org/installer | "$PHP" -- --install-dir="$APP" --quiet
    COMPOSER="$PHP $APP/composer.phar"
fi

echo "→ Instalando dependencias de producción…"
$COMPOSER install --no-dev --optimize-autoloader --no-interaction --quiet

# --- .env --------------------------------------------------------------------
if [ ! -f "$APP/.env" ]; then
    echo "→ Creando .env (primera instalación)…"
    cp "$APP/.env.example" "$APP/.env"

    "$PHP" artisan key:generate --force --quiet

    # Ajustes propios de producción.
    sed -i "s|^APP_ENV=.*|APP_ENV=production|"       "$APP/.env"
    sed -i "s|^APP_DEBUG=.*|APP_DEBUG=false|"        "$APP/.env"
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=sqlite|" "$APP/.env"
    grep -q '^APP_TIMEZONE='  "$APP/.env" || echo 'APP_TIMEZONE=America/Mazatlan' >> "$APP/.env"
    grep -q '^FORCE_HTTPS='   "$APP/.env" || echo 'FORCE_HTTPS=true'              >> "$APP/.env"
    grep -q '^UM_NOMBRE='     "$APP/.env" || echo 'UM_NOMBRE="MUJERES UNIDAS"'    >> "$APP/.env"
    grep -q '^UM_SEMANAS='    "$APP/.env" || echo 'UM_SEMANAS=12'                 >> "$APP/.env"

    NUEVO_ENV=1
else
    echo "→ Ya existe .env: no se toca."
    NUEVO_ENV=0
fi

chmod 600 "$APP/.env"

# --- Base de datos -----------------------------------------------------------
BASE="$APP/database/database.sqlite"

if [ ! -f "$BASE" ]; then
    echo "→ Creando la base de datos…"
    touch "$BASE"
    BASE_NUEVA=1
else
    echo "→ Respaldando la base antes de migrar…"
    mkdir -p "$APP/respaldos"
    cp "$BASE" "$APP/respaldos/database-$(date +%Y%m%d-%H%M).sqlite"
    BASE_NUEVA=0
fi

chmod 644 "$BASE"

echo "→ Aplicando migraciones…"
"$PHP" artisan migrate --force

if [ "$BASE_NUEVA" = "1" ]; then
    echo "→ Creando las cuatro cuentas de rol…"
    "$PHP" artisan db:seed --force
fi

# --- Permisos ----------------------------------------------------------------
echo "→ Ajustando permisos de escritura…"
mkdir -p "$APP/storage/app/private/documentos" \
         "$APP/storage/framework/"{cache/data,sessions,views} \
         "$APP/storage/logs" \
         "$APP/bootstrap/cache"
chmod -R 755 "$APP/storage" "$APP/bootstrap/cache"

# --- Carpeta pública ---------------------------------------------------------
echo "→ Publicando la carpeta pública…"
mkdir -p "$PUBLICO"
cp -r "$APP/public/." "$PUBLICO/"

# index.php lee esta ruta, así la aplicación puede vivir donde sea (por
# ejemplo en ~/um/um-laravel) y aun así fuera del alcance de internet.
cat > "$PUBLICO/ruta-app.php" <<PHPRUTA
<?php

// Generado por scripts/desplegar.sh — no editar a mano.
return '$APP';
PHPRUTA

# Red de seguridad, por si esta carpeta acabara dentro de public_html.
cat > "$APP/.htaccess" <<'HT'
# Esta carpeta NO debe ser accesible desde internet.
Require all denied
HT

# --- Caché -------------------------------------------------------------------
echo "→ Limpiando cachés…"
"$PHP" artisan config:clear --quiet
"$PHP" artisan view:clear --quiet
"$PHP" artisan route:clear --quiet

# --- Resumen -----------------------------------------------------------------
echo
echo "────────────────────────────────────────────────────────────"
if [ "$NUEVO_ENV" = "1" ]; then
    echo "✓ Instalado por primera vez."
    echo
    echo "  FALTA UN PASO: edita el .env y pon tu dominio real."
    echo "      nano $APP/.env"
    echo "      APP_URL=https://crm.tudominio.com"
    echo
    echo "  Después entra con  direccion / Cambiar123  y cambia"
    echo "  las cuatro contraseñas desde Usuarios."
else
    echo "✓ Actualizado."
    echo "  La base y el .env del servidor quedaron intactos."
    echo "  Respaldo de la base en: respaldos/"
fi
echo "────────────────────────────────────────────────────────────"
