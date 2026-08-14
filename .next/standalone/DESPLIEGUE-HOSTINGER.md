# Despliegue en Hostinger

Guía de principio a fin para dejar el sistema funcionando en un servidor de
Hostinger, con dominio propio y HTTPS. Todo se copia y se pega tal cual.

---

## Paso 0 — Confirma qué contrataste (esto es decisivo)

Hostinger vende dos cosas muy distintas y **solo una sirve para este sistema**:

| | Hosting compartido (Premium/Business) | **VPS (KVM 1, KVM 2…)** |
|---|---|---|
| Acceso SSH | Sí, pero sin `root` | Sí, con `root` |
| Corre PHP | Sí | Sí |
| Corre **Node.js** como servicio permanente | **No** | Sí |
| **PostgreSQL** | **No** (solo MySQL) | Sí |
| Docker | **No** | Sí |
| **¿Sirve para este CRM?** | **No** | **Sí** |

Este sistema es Next.js (Node.js) + PostgreSQL. En el hosting compartido **no se
puede instalar**, por más que tengas SSH: no hay dónde dejar corriendo el proceso
de Node ni existe PostgreSQL. No es una limitación del sistema, es del plan.

Entra por SSH y ejecútalo para salir de dudas:

```bash
[ "$(id -u)" = "0" ] && echo "Eres root → es VPS" || echo "No eres root"
command -v docker >/dev/null && echo "Docker disponible → VPS" || echo "Sin Docker"
uname -a
```

- **Dice "es VPS" / hay Docker** → sigue con el Paso 1.
- **No eres root y no hay Docker** → tienes hosting compartido. En hPanel entra a
  **VPS → Comprar**, o pide a soporte el cambio al plan **KVM 1** (≈ 5 USD/mes
  prepagado al año). Es el plan que ya viene presupuestado en `ENTREGA.md`.

> El dominio que ya tengas en Hostinger se puede seguir usando: solo se apunta al
> VPS en el Paso 1. No se pierde nada.

---

## Paso 1 — Apuntar el dominio al servidor

En hPanel, copia la **IP del VPS** (aparece en el panel del VPS).

Ve a **Dominios → DNS / Nameservers** y crea dos registros:

| Tipo | Nombre | Apunta a | TTL |
|---|---|---|---|
| `A` | `crm` | la IP del VPS | 3600 |
| `A` | `@` | la IP del VPS | 3600 |

El segundo solo si quieres que el dominio raíz también abra el sistema.

Comprueba desde tu computadora (tarda de 5 minutos a 1 hora en propagarse):

```bash
dig +short crm.tudominio.com
```

Debe responder la IP del VPS. **No sigas hasta que responda**, porque el
certificado HTTPS del Paso 5 se emite validando ese DNS.

---

## Paso 2 — Entrar y preparar el servidor

```bash
ssh root@LA_IP_DEL_VPS
```

Con el servidor recién creado, ejecuta el instalador incluido en el proyecto. Deja
listo Docker, el firewall y Caddy:

```bash
apt update && apt install -y git
git clone https://github.com/derick061020/um.git /opt/um-crm
cd /opt/um-crm
bash scripts/instalar-servidor.sh
```

Si prefieres hacerlo a mano, el script es corto y se lee de arriba abajo: instala
Docker, abre solo los puertos 22/80/443 con `ufw` e instala Caddy.

---

## Paso 3 — Configurar los secretos

```bash
cd /opt/um-crm
cp .env.example .env
```

Genera una contraseña de base de datos y un secreto de sesión **nuevos**:

```bash
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=')"
echo "AUTH_SECRET=$(openssl rand -base64 48)"
```

Edita el archivo con `nano .env` y deja estos valores:

```ini
POSTGRES_USER=um
POSTGRES_PASSWORD=<la que generaste arriba>
POSTGRES_DB=um_crm
POSTGRES_PORT=5433

# Ojo: dentro de Docker el host es "db", no localhost.
DATABASE_URL="postgresql://um:<la misma contraseña>@db:5432/um_crm?schema=public"

AUTH_SECRET="<el secreto de 48 bytes que generaste>"

STORAGE_DIR="/data/archivos"

UM_NOMBRE="MUJERES UNIDAS"
UM_SEMANAS=12
```

Guarda con `Ctrl+O`, `Enter`, `Ctrl+X`. Protege el archivo:

```bash
chmod 600 .env
```

> **Nunca** dejes el `AUTH_SECRET` de ejemplo. Con él, cualquiera podría firmar
> una sesión válida y entrar como dirección.

---

## Paso 4 — Levantar el sistema

```bash
cd /opt/um-crm
docker compose --profile prod up -d --build
```

La primera compilación tarda entre 3 y 8 minutos. Cuando termine, crea las tablas
y las cuentas:

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npx tsx prisma/seed.ts
```

El `seed` crea **solo las cuatro cuentas de rol** (detecta que es producción y no
mete clientas de ejemplo):

| Usuario | Rol | Contraseña inicial |
|---|---|---|
| `direccion` | Principal | `Cambiar123` |
| `viridiana` | Supervisor | `Cambiar123` |
| `capturista` | Capturista | `Cambiar123` |
| `encargada` | Encargada | `Cambiar123` |

Verifica que responde:

```bash
curl -I http://127.0.0.1:3000
```

Debe contestar `200` o `307`. Si no, mira el registro con
`docker compose logs -f app`.

---

## Paso 5 — Dominio y HTTPS

Edita la configuración de Caddy:

```bash
nano /etc/caddy/Caddyfile
```

Borra todo y deja **solo** esto, con tu dominio real:

```
crm.tudominio.com {
    reverse_proxy 127.0.0.1:3000
    request_body {
        max_size 12MB
    }
}
```

El `max_size` es necesario: los escaneos de la tablet se suben por ahí y con el
límite por omisión se rechazarían.

```bash
systemctl reload caddy
systemctl status caddy --no-pager
```

Caddy pide el certificado a Let's Encrypt solo, en unos segundos. Abre
`https://crm.tudominio.com` y debe aparecer la pantalla de acceso con el candado.

> El HTTPS no es opcional: los navegadores **solo permiten abrir la cámara de la
> tablet en sitios seguros**. Sin certificado, el escáner de documentos no
> funciona.

---

## Paso 6 — Asegurar antes de entregar

1. Entra como `direccion` y **cambia las cuatro contraseñas** desde
   *Usuarios* (`Cambiar123` es pública, está en este documento).
2. Desactiva las cuentas que no se vayan a usar.
3. Cambia la contraseña de `root` del VPS y entrégala a Mujeres Unidas.

Comprueba que la base de datos **no** quedó expuesta a internet — desde tu
computadora, no desde el servidor:

```bash
nc -zv LA_IP_DEL_VPS 5433
```

Debe decir *connection refused* o quedarse esperando. Si conecta, algo se
configuró mal en `docker-compose.yml`.

---

## Paso 7 — Respaldos automáticos

```bash
crontab -e
```

Agrega la línea (respaldo diario a las 2 de la mañana):

```cron
0 2 * * * cd /opt/um-crm && bash scripts/respaldo.sh /opt/respaldos >> /var/log/um-respaldo.log 2>&1
```

Pruébalo una vez a mano para confirmar que corre:

```bash
cd /opt/um-crm && bash scripts/respaldo.sh /opt/respaldos
```

Guarda la base y los documentos escaneados, y conserva los últimos 30 de cada
tipo. **Descarga una copia fuera del servidor de vez en cuando**, un respaldo que
vive en la misma máquina no protege contra la pérdida de la máquina:

```bash
# desde tu computadora
scp root@LA_IP_DEL_VPS:/opt/respaldos/\*.gz ./respaldos-um/
```

---

## Actualizar el sistema más adelante

```bash
cd /opt/um-crm
bash scripts/respaldo.sh /opt/respaldos     # primero el respaldo, siempre
git pull
docker compose --profile prod up -d --build
docker compose exec app npx prisma migrate deploy
```

---

## Problemas comunes

**La compilación se queda congelada o muere.** El KVM 1 tiene 4 GB; si se queda
sin memoria, agrega intercambio:

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

**Caddy no consigue el certificado.** Casi siempre es DNS: confirma con
`dig +short crm.tudominio.com` que apunta al VPS y que los puertos 80 y 443 están
abiertos (`ufw status`).

**`prisma migrate deploy` falla diciendo que la base ya tiene tablas.** Pasa si
antes se usó `db push`. Márcala como aplicada:

```bash
docker compose exec app npx prisma migrate resolve --applied 0_init
```

**La cámara no abre en la tablet.** Es que estás entrando por `http://` o por IP.
Tiene que ser `https://` con el dominio.

**Ver qué está pasando:**

```bash
docker compose ps
docker compose logs -f app
journalctl -u caddy -f
```
