# Despliegue sin Docker (Node.js y PostgreSQL directos)

Alternativa a `DESPLIEGUE-HOSTINGER.md` para quien prefiere no usar Docker. Se
instala Node.js y PostgreSQL directamente en el servidor y el sistema queda
corriendo como servicio con `systemd`.

Sigue haciendo falta un **VPS**. Lea primero la sección de abajo si lo que tiene
es un hosting compartido con FTP.

---

## Por qué no sirve el hosting compartido con FTP

El FTP sirve para subir archivos que el servidor *lee*: HTML, imágenes, PHP. Este
sistema no es eso. Es un **programa que tiene que estar corriendo todo el tiempo**,
escuchando peticiones y hablando con una base de datos.

Comprobado sobre este proyecto:

- **0 páginas estáticas.** Las 17 rutas se generan en el servidor en cada
  petición.
- **11 páginas consultan PostgreSQL** para dibujarse (clientas, créditos,
  cobranza, corte, bitácora…).
- **7 archivos de acciones de servidor** procesan los formularios: el acceso, el
  alta de clientas, el registro de abonos.
- El tarjetón en PDF y los documentos escaneados se generan y se sirven con
  código de servidor, comprobando permisos.

Un hosting compartido de Hostinger ofrece PHP y MySQL. No corre Node.js como
servicio permanente y no tiene PostgreSQL. Si sube estos archivos por FTP, no se
abre nada: el navegador recibiría el código fuente o un error, nunca el sistema.

No es un defecto del programa ni algo que se arregle compilando distinto. Un
sistema con sesiones, contraseñas cifradas, permisos por rol y expedientes con
documentos **necesita** un servidor propio.

> Lo que sí se aprovecha del plan actual: **el dominio**. Se apunta al VPS y sigue
> funcionando igual, no se pierde ni hay que comprarlo de nuevo.

Hace falta un **VPS KVM 1** de Hostinger (≈ 5 USD al mes, prepagado al año, sin
renta mensual), que es exactamente lo que ya viene presupuestado en `ENTREGA.md`.

---

## 1. Preparar el servidor

Entra como `root` por SSH e instala Node.js 22 y PostgreSQL 16:

```bash
apt update && apt upgrade -y
apt install -y curl git ufw nginx

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs postgresql postgresql-contrib

node -v      # debe decir v22.x
psql --version
```

Firewall: solo SSH, HTTP y HTTPS.

```bash
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp
ufw --force enable
```

---

## 2. Crear la base de datos

```bash
CLAVE="$(openssl rand -base64 24 | tr -d '/+=')"
echo "Guarda esta contraseña: $CLAVE"

sudo -u postgres psql <<SQL
CREATE USER um WITH PASSWORD '$CLAVE';
CREATE DATABASE um_crm OWNER um;
GRANT ALL PRIVILEGES ON DATABASE um_crm TO um;
SQL
```

PostgreSQL ya escucha solo en `localhost` de forma predeterminada. Confírmalo:

```bash
ss -lntp | grep 5432     # debe decir 127.0.0.1:5432, nunca 0.0.0.0:5432
```

---

## 3. Instalar el sistema

```bash
mkdir -p /opt && cd /opt
git clone https://github.com/derick061020/um.git um-crm
cd um-crm
npm ci
```

Crea el `.env`:

```bash
cp .env.example .env
echo "AUTH_SECRET=$(openssl rand -base64 48)"
nano .env
```

Déjalo así, con **la contraseña del paso 2** y el secreto recién generado:

```ini
DATABASE_URL="postgresql://um:LA_CLAVE_DEL_PASO_2@localhost:5432/um_crm?schema=public"
AUTH_SECRET="EL_SECRETO_GENERADO"
STORAGE_DIR="/var/um-archivos"
UM_NOMBRE="MUJERES UNIDAS"
UM_SEMANAS=12
```

```bash
chmod 600 .env
mkdir -p /var/um-archivos
```

Compila, crea las tablas y las cuentas:

```bash
npm run build
npx prisma migrate deploy
NODE_ENV=production npx tsx prisma/seed.ts
```

El `seed` crea solo las cuatro cuentas (`direccion`, `viridiana`, `capturista`,
`encargada`), todas con `Cambiar123`.

Prueba que arranca:

```bash
npm start          # Ctrl+C para salir
```

En otra terminal: `curl -I http://127.0.0.1:3000/entrar` debe contestar `200`.

---

## 4. Dejarlo corriendo siempre (systemd)

```bash
nano /etc/systemd/system/um-crm.service
```

```ini
[Unit]
Description=UM-CRM · Mujeres Unidas
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/um-crm
EnvironmentFile=/opt/um-crm/.env
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now um-crm
systemctl status um-crm --no-pager
```

Con esto el sistema se levanta solo si el servidor se reinicia o si el proceso
se cae. Para ver qué pasa: `journalctl -u um-crm -f`.

---

## 5. Dominio y HTTPS

Apunta un registro `A` de tu dominio (por ejemplo `crm.tudominio.com`) a la IP del
VPS desde el panel de Hostinger, y espera a que `dig +short crm.tudominio.com`
responda esa IP.

```bash
nano /etc/nginx/sites-available/um-crm
```

```nginx
server {
    listen 80;
    server_name crm.tudominio.com;

    # Los escaneos de la tablet pesan; sin esto se rechazarían.
    client_max_body_size 12M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/um-crm /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Certificado gratuito, que se renueva solo:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d crm.tudominio.com
```

Abre `https://crm.tudominio.com`. **El HTTPS no es opcional**: los navegadores
solo permiten abrir la cámara de la tablet en sitios seguros, así que sin
certificado el escáner de documentos no funciona.

---

## 6. Respaldos

Sin Docker, el respaldo se hace con `pg_dump` directo:

```bash
nano /opt/respaldo-um.sh
```

```bash
#!/usr/bin/env bash
set -euo pipefail
FECHA="$(date +%Y-%m-%d_%H%M)"
DESTINO=/opt/respaldos
mkdir -p "$DESTINO"

sudo -u postgres pg_dump um_crm --clean --if-exists | gzip > "$DESTINO/um_crm_$FECHA.sql.gz"
tar -czf "$DESTINO/um_archivos_$FECHA.tar.gz" -C /var um-archivos

# Conserva los últimos 30 de cada tipo.
find "$DESTINO" -name 'um_crm_*.sql.gz'      -printf '%T@ %p\n' | sort -rn | tail -n +31 | cut -d' ' -f2- | xargs -r rm -f
find "$DESTINO" -name 'um_archivos_*.tar.gz' -printf '%T@ %p\n' | sort -rn | tail -n +31 | cut -d' ' -f2- | xargs -r rm -f
```

```bash
chmod +x /opt/respaldo-um.sh
/opt/respaldo-um.sh          # pruébalo una vez
crontab -e
```

```cron
0 2 * * * /opt/respaldo-um.sh >> /var/log/um-respaldo.log 2>&1
```

Descarga copias fuera del servidor cada tanto: un respaldo que vive en la misma
máquina no protege contra perder la máquina.

```bash
# desde tu computadora
scp root@LA_IP:/opt/respaldos/\*.gz ./respaldos-um/
```

---

## 7. Antes de entregar

1. Entra como `direccion` y **cambia las cuatro contraseñas** (`Cambiar123` es
   pública, está en este documento).
2. Comprueba desde tu computadora que la base no quedó expuesta:
   `nc -zv LA_IP 5432` debe rechazar la conexión.
3. Cambia la contraseña de `root` y entrégala a Mujeres Unidas.

---

## Actualizar más adelante

```bash
cd /opt/um-crm
/opt/respaldo-um.sh          # primero el respaldo, siempre
git pull
npm ci
npm run build
npx prisma migrate deploy
systemctl restart um-crm
```
