# Mujeres Unidas · Sistema de control de crédito

CRM de crédito grupal para Mujeres Unidas: grupos, clientas con aval, créditos de
12 abonos semanales en sábado, cobranza del día, tarjetón imprimible y expediente
digital escaneado con la cámara de la tablet.

La interfaz sigue el manual de identidad visual de la marca (Verde Patrimonio,
DM Serif Display / DM Sans, marca de agua del monograma).

---

## 1. Tecnologías

| Capa | Herramienta | Por qué |
|---|---|---|
| Aplicación | Next.js 16 (App Router) + React 19 + TypeScript | Una sola base de código para servidor y navegador; funciona igual en PC y tablet |
| Estilos | Tailwind CSS v4 con la paleta y tipografía del manual | Cambios visuales rápidos sin perder consistencia |
| Base de datos | PostgreSQL 16 + Prisma | Datos íntegros, respaldo con `pg_dump`, portable a cualquier servidor |
| PDF | pdf-lib + fuentes DM | El tarjetón se genera en el servidor, sin depender de servicios externos |
| Imágenes | sharp | Endereza y comprime los escaneos antes de guardarlos |
| Sesiones | Cookie firmada (JWT) + registro en base de datos | Se puede cerrar la sesión de una persona desde el sistema |

Todo corre en el propio servidor. No hay servicios de terceros de pago ni APIs externas.

---

## 2. Puesta en marcha local

Requisitos: **Node.js 22+**, **Docker** (para PostgreSQL).

```bash
cp .env.example .env          # y genera un AUTH_SECRET propio
openssl rand -base64 48       # pégalo en AUTH_SECRET

npm install
npm run db:up                 # levanta PostgreSQL en el puerto 5433
npm run db:push               # crea las tablas
npm run seed                  # cuentas de prueba y datos de ejemplo

npm run dev                   # http://localhost:3000
```

Para comprobar que todo está bien antes de subirlo al servidor:

```bash
npm run pruebas               # 30 pruebas de fechas, importes y ciclo del crédito
npm run typecheck             # revisa los tipos
```

Y para probar **el mismo build que corre en producción**, no el de desarrollo:

```bash
npm run build
npm start                     # http://localhost:3000
```

> En `npm start` la cámara del escáner no abre si entras desde otro dispositivo
> por IP: los navegadores solo la permiten en `localhost` o en `https://`. Es
> normal, en el servidor con dominio y certificado funciona.

### Cuentas que crea el `seed`

Contraseña de todas: `Cambiar123` (cámbialas antes de producción).

| Rol | Usuario |
|---|---|
| Principal | `direccion` |
| Supervisor | `viridiana` |
| Capturista | `capturista` |
| Encargada | `encargada` |

---

## 3. Los cuatro roles

La matriz de permisos está en [`src/lib/rbac.ts`](src/lib/rbac.ts). Las pantallas y
las acciones preguntan por permiso, nunca por rol, para que agregar un rol nuevo
no obligue a tocar el resto del sistema.

| Rol | Qué puede hacer |
|---|---|
| **Principal** | Todo. Es la única que crea usuarios y cambia contraseñas. Ve la bitácora. |
| **Supervisor** | Crea y administra grupos (VIRI 1, CHIHUAHUA 1…), clientas, créditos y cobranza. Puede anular movimientos. |
| **Capturista** | Da de alta clientas y avales, consulta historial, registra créditos, marca los abonos del sábado y escanea documentos. No anula. |
| **Encargada** | Solo la pantalla `/corte`: el total a cobrar del día. No ve nombres, domicilios ni importes por clienta. |

Cada persona entra con su propio usuario y **todo movimiento queda firmado** con su
nombre en la bitácora (`/bitacora`).

---

## 4. Reglas de negocio

### Calendario automático de abonos

Se captura **solo el lunes de entrega**. El sistema genera los 12 sábados:

- primer abono = lunes de entrega + 5 días (el sábado de esa misma semana);
- los siguientes, cada 7 días;
- **vencimiento = sábado de la semana 12**.

Al capturar el crédito, la pantalla muestra los 12 sábados y la fecha de
vencimiento **antes de guardar**, para confirmarla con la clienta enfrente.

El número de semanas es configurable (`UM_SEMANAS`, por defecto 12) por si más
adelante manejan plazos distintos.

La lógica está aislada en [`src/lib/fechas.ts`](src/lib/fechas.ts) y trabaja siempre
en UTC, para que el horario de verano nunca corra un día.

### Importes

Todos los importes se guardan en **centavos (enteros)**. El abono semanal se
reparte en partes iguales y el sobrante del redondeo se carga al último abono,
de modo que la suma de los 12 abonos siempre cuadre exactamente con el total.

### Estados

- **Abono**: `PENDIENTE` → `PARCIAL` → `PAGADO`.
- **Crédito**: `ACTIVO` → `LIQUIDADO` al cubrirse el total, o `VENCIDO` si pasa la
  fecha de vencimiento sin liquidar. `CANCELADO` solo si no tiene ningún abono.

---

## 5. Tarjetón de control (PDF)

`/api/tarjeton/<id-del-credito>` genera el tarjetón en carta horizontal:

- logotipo UM y el **nombre de la clienta**;
- **12 columnas**, una por semana, con el número de semana y el sábado que le toca;
- el **abono impreso en vertical** dentro de cada columna;
- **sin domicilios y sin el total del crédito impreso arriba**.

También se puede imprimir el juego completo de un grupo, un tarjetón por hoja:
`/api/tarjeton/<id-del-grupo>?grupo=1` (botón "Imprimir tarjetones del grupo" en
la pantalla de cobranza cuando hay un grupo filtrado).

El diseño vive en [`src/lib/pdf/tarjeton.ts`](src/lib/pdf/tarjeton.ts); los
tamaños, márgenes y colores están al inicio del archivo por si hay que ajustarlo
al tarjetón físico.

---

## 6. Escáner de documentos con la tablet

En la ficha de cada clienta, el bloque **"Escanear documento"**:

1. se elige el tipo (INE frente/reverso, comprobante de domicilio, INE del aval,
   pagaré, contrato…);
2. **Abrir cámara** usa la cámara trasera de la tablet con una guía de encuadre;
3. el realce opcional convierte la foto a blanco y negro con más contraste para
   que el documento se lea bien;
4. al guardar, la imagen se endereza (EXIF), se limita a 2200 px y se comprime a
   JPEG antes de archivarse en el expediente de esa clienta.

Si el navegador no da acceso a la cámara, el botón **"Elegir archivo o foto"**
abre la cámara del sistema como alternativa.

> **Importante:** los navegadores solo permiten abrir la cámara desde la página en
> `localhost` o sobre **HTTPS**. El despliegue incluye certificado gratuito de
> Let's Encrypt, así que en producción funciona; si se prueba por IP sin HTTPS,
> solo servirá la opción "Elegir archivo".

Los archivos **no** se guardan en la carpeta pública: viven en `STORAGE_DIR` y se
sirven por `/api/documentos/<id>`, que exige sesión y permiso.

El expediente marca en rojo qué documentos obligatorios faltan (INE frente, INE
reverso y comprobante de domicilio).

---

## 7. Despliegue en el servidor

Dos guías completas, según prefieras:

- **[`DESPLIEGUE-HOSTINGER.md`](DESPLIEGUE-HOSTINGER.md)** — con Docker (recomendada).
- **[`DESPLIEGUE-SIN-DOCKER.md`](DESPLIEGUE-SIN-DOCKER.md)** — Node.js y PostgreSQL
  instalados directos, con `systemd` y Nginx.

Resumen de la primera:

```bash
# en el servidor, dentro de /opt/um-crm
bash scripts/instalar-servidor.sh   # Docker, firewall y Caddy
cp .env.example .env                # AUTH_SECRET nuevo y contraseña de Postgres fuerte
docker compose --profile prod up -d --build
docker compose exec app npx prisma migrate deploy
docker compose exec app npx tsx prisma/seed.ts
```

Hace falta un **VPS** (Node.js + PostgreSQL). El hosting compartido no sirve:
no corre Node como servicio ni tiene PostgreSQL.

Después se pone Nginx (o Caddy) delante para el dominio y el certificado HTTPS.
Ejemplo mínimo con Caddy, que saca el certificado solo:

```
crm.mujeresunidas.com {
    reverse_proxy 127.0.0.1:3000
}
```

Los escaneos quedan en el volumen `um_archivos` y la base en `um_pgdata`.

---

## 8. Respaldos

```bash
npm run respaldo            # o: bash scripts/respaldo.sh /ruta/destino
```

Genera dos archivos con fecha: el volcado de la base (`.sql.gz`) y los documentos
escaneados (`.tar.gz`), y conserva los últimos 30 de cada tipo.

Para dejarlo automático a las 2 de la mañana:

```cron
0 2 * * * cd /opt/um-crm && bash scripts/respaldo.sh >> /var/log/um-respaldo.log 2>&1
```

Restaurar la base:

```bash
gunzip -c respaldos/um_crm_2026-08-14_0200.sql.gz | docker exec -i um_crm_db psql -U um -d um_crm
```

---

## 9. Estructura del proyecto

```
prisma/schema.prisma        modelo de datos completo
prisma/seed.ts              datos de arranque

src/lib/
  fechas.ts                 calendario de sábados (regla de los 12 abonos)
  dinero.ts                 importes en centavos y reparto de abonos
  creditos.ts               alta de crédito, pagos, anulaciones, estados
  rbac.ts                   matriz de permisos de los 4 roles
  auth.ts                   sesiones, contraseñas, guardas de permiso
  auditoria.ts              bitácora de movimientos
  almacenamiento.ts         guardado seguro de los escaneos
  documentos.ts             catálogo de tipos de documento
  pdf/tarjeton.ts           diseño del tarjetón

src/app/(sistema)/          pantallas con sesión iniciada
  panel/  corte/  cobranza/  clientas/  creditos/  grupos/  usuarios/  bitacora/
src/app/entrar/             acceso al sistema
src/app/api/                tarjetón PDF y documentos escaneados

brand/                      manual de identidad y logotipos originales
```

---

## 10. Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Compilar y ejecutar en producción |
| `npm run typecheck` | Revisión de tipos |
| `npm run db:up` / `db:down` | Levantar y bajar PostgreSQL |
| `npm run db:push` | Aplicar el esquema en desarrollo |
| `npm run db:deploy` | Aplicar migraciones en producción |
| `npm run db:studio` | Explorador visual de la base de datos |
| `npm run seed` | Datos de arranque |
| `npm run respaldo` | Respaldo de base y archivos |
