# Despliegue por FTP en hosting compartido

Guía para dejar el sistema funcionando en un hosting compartido de Hostinger,
subiendo archivos por FTP. **No hace falta VPS, ni Docker, ni ejecutar comandos
en el servidor**: la base de datos viaja ya creada dentro del paquete.

---

## Qué necesita el hosting

| Requisito | Detalle |
|---|---|
| **PHP 8.3** | Se elige en hPanel → *Avanzado → Configuración PHP*. El sistema está compilado para **8.3.30**. |
| Extensiones | `pdo_sqlite`, `mbstring`, `openssl`, `fileinfo`, `gd`. Vienen activas por omisión en Hostinger. |
| Espacio | Unos 60 MB, más lo que crezcan los documentos escaneados. |
| HTTPS | Gratuito en hPanel. **Indispensable**: sin él la cámara del escáner no abre. |

No necesita MySQL. La base es **un solo archivo SQLite** que va dentro del
paquete.

---

## Paso 1 — Armar el paquete

En tu computadora, dentro de la carpeta del proyecto:

```bash
bash scripts/empaquetar-ftp.sh
```

Deja una carpeta `paquete-ftp/` con exactamente dos cosas:

```
paquete-ftp/
├── public_html/     ← lo único que verá internet
└── um-crm/          ← la aplicación y la base de datos (privado)
```

Antes de subir, abre `paquete-ftp/um-crm/.env` y cambia una línea:

```ini
APP_URL=https://crm.tudominio.com     ← pon tu dominio real
```

> El script genera una `APP_KEY` nueva cada vez. **No la cambies después de
> tener datos**: es la que cifra las sesiones.

---

## Paso 2 — Subir por FTP

Conéctate con FileZilla (los datos están en hPanel → *Archivos → Cuentas FTP*).

En el servidor verás una ruta parecida a
`/domains/tudominio.com/`. Dentro va así:

```
/domains/tudominio.com/
├── public_html/     ← sube AQUÍ el contenido de paquete-ftp/public_html/
└── um-crm/          ← sube AQUÍ la carpeta paquete-ftp/um-crm/ completa
```

**`um-crm` va al lado de `public_html`, nunca dentro.** Esa es toda la
seguridad del sistema: la base de datos, el `.env` y los documentos escaneados
quedan fuera del alcance de internet. Si los pones dentro de `public_html`,
cualquiera podría descargar la base de datos con las clientas.

> Son unos 7,000 archivos: la subida tarda. En FileZilla usa 4–8 conexiones
> simultáneas (*Transferencia → Número máximo de transferencias*) y déjalo
> trabajar.

---

## Paso 3 — Permisos de escritura

En FileZilla, clic derecho sobre estas dos carpetas → *Permisos de archivo* →
**755**, marcando *Recursar en subdirectorios*:

- `um-crm/storage`
- `um-crm/bootstrap/cache`

Y sobre el archivo `um-crm/database/database.sqlite` → **644**.

Si el sistema muestra una pantalla en blanco o un error 500, casi siempre es
esto.

---

## Paso 4 — PHP 8.3 y HTTPS

1. hPanel → *Avanzado → Configuración PHP* → elige **PHP 8.3**.
2. hPanel → *Seguridad → SSL* → instala el certificado gratuito del dominio y
   activa **Forzar HTTPS**.

Espera a que el candado aparezca en el navegador antes de seguir.

---

## Paso 5 — Entrar y asegurar

Abre `https://crm.tudominio.com`. Debe salir la pantalla de acceso.

Entra con:

| Usuario | Rol | Contraseña inicial |
|---|---|---|
| `direccion` | Principal | `Cambiar123` |
| `viridiana` | Supervisor | `Cambiar123` |
| `capturista` | Capturista | `Cambiar123` |
| `encargada` | Encargada | `Cambiar123` |

**Lo primero, sin excepción:** entra como `direccion`, ve a *Usuarios* y cambia
las cuatro contraseñas. `Cambiar123` está escrita en este documento, o sea que
es pública.

Después crea los grupos reales en *Grupos* y empieza a dar de alta clientas.

---

## Respaldos

Todo el sistema son **dos cosas**:

| Qué | Dónde |
|---|---|
| La base de datos completa | `um-crm/database/database.sqlite` |
| Los documentos escaneados | `um-crm/storage/app/private/documentos/` |

Respaldar es descargar esas dos rutas por FTP. Hazlo **cada semana, después del
corte del sábado**, y guarda la copia en otro lado (tu computadora, un disco,
Drive). Un respaldo que vive en el mismo servidor no protege contra perder el
servidor.

Restaurar es subir el archivo de vuelta, encima del que está.

> Hostinger también tiene respaldos automáticos en hPanel → *Archivos →
> Copias de seguridad*. Actívalos, pero no dependas solo de ellos.

---

## Actualizar el sistema más adelante

1. Descarga primero `database.sqlite` y la carpeta de documentos (respaldo).
2. Vuelve a correr `bash scripts/empaquetar-ftp.sh` en tu computadora.
3. Sube **solo** `um-crm/app`, `um-crm/resources`, `um-crm/routes`,
   `um-crm/config`, `um-crm/vendor` y `public_html`.
4. **No subas** `um-crm/database/database.sqlite` ni `um-crm/.env`: son los del
   servidor, con los datos y la clave reales.
5. Borra el contenido de `um-crm/bootstrap/cache/` y de
   `um-crm/storage/framework/views/` para que se regenere.

---

## Problemas comunes

**Pantalla en blanco o error 500.** Permisos: `um-crm/storage` y
`um-crm/bootstrap/cache` en 755. Si sigue, mira el detalle en
`um-crm/storage/logs/laravel.log` (descárgalo por FTP).

**"The stream or file could not be opened".** Lo mismo: falta permiso de
escritura en `storage`.

**Sale el listado de archivos en vez del sistema.** Subiste el contenido de
`public_html` a la carpeta equivocada, o falta el `.htaccess` (es un archivo
oculto: en FileZilla activa *Servidor → Forzar mostrar archivos ocultos*).

**La cámara no abre en la tablet.** Estás entrando por `http://` o por IP. Tiene
que ser `https://` con el dominio. No es un fallo del sistema: los navegadores
solo permiten la cámara en sitios seguros.

**"Database is locked" al cobrar.** SQLite no admite muchas escrituras a la vez.
Con un puñado de personas capturando no pasa; si llegara a pasar seguido, es la
señal de que la operación ya creció y conviene un servidor propio.

**Error de versión de PHP.** Comprueba en hPanel que quedó en 8.3. El paquete se
compiló para 8.3.30 y no corre en 8.1 ni 8.2.

---

## Lo que este montaje sí y no da

**Sí:** el sistema completo funcionando en tu hosting actual, sin renta extra,
con HTTPS, respaldos por FTP y los documentos fuera del alcance de internet.

**No:** SQLite es un archivo, no un servidor de base de datos. Aguanta bien la
operación de Mujeres Unidas (unas cuantas personas capturando a la vez), pero no
está pensado para decenas de usuarios simultáneos. Si algún día la operación
crece a varias plazas capturando al mismo tiempo, el camino es mover la base a
MySQL o pasar a un servidor propio. El código no cambia: solo el `.env`.
