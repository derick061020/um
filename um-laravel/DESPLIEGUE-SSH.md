# Despliegue con Git por SSH

La forma recomendada si tu hosting tiene acceso SSH: se clona el repositorio en
el servidor y a partir de ahí cada actualización es `git pull` y un comando.

Más limpio que el FTP: no subes 7,000 archivos cada vez, y no hay riesgo de
dejar una carpeta a medias.

> ¿Solo tienes FTP? Entonces usa [`DESPLIEGUE-FTP.md`](DESPLIEGUE-FTP.md).

---

## Paso 1 — Datos de acceso

En hPanel: **Avanzado → Acceso SSH**. Ahí están el **host** (una IP), el
**puerto** (en Hostinger suele ser `65002`) y el **usuario** (`uXXXXXXXXX`).
Actívalo si aparece apagado.

```bash
ssh -p 65002 uXXXXXXXXX@123.45.67.89
```

Para no escribir la contraseña cada vez, copia tu llave:

```bash
ssh-copy-id -p 65002 uXXXXXXXXX@123.45.67.89
```

---

## Paso 2 — Clonar el sistema

Ya dentro del servidor:

```bash
cd ~
git clone https://github.com/derick061020/um.git um
```

El repositorio trae dos versiones del sistema; la que se usa aquí es la de
Laravel:

```bash
cd ~/um/um-laravel
```

> Queda en `~/um`, **fuera** de `public_html`. Eso es lo que mantiene la base de
> datos, el `.env` y los documentos escaneados fuera del alcance de internet.

---

## Paso 3 — Desplegar

Un solo comando. Indícale dónde está la raíz web de tu dominio:

```bash
bash scripts/desplegar.sh ~/domains/tudominio.com/public_html
```

El script hace todo:

- busca un PHP 8.3 o superior (en hosting compartido el `php` de la consola no
  siempre es el mismo que usa el sitio, así que lo detecta);
- instala las dependencias de producción con Composer, y si Composer no está,
  lo descarga;
- crea el `.env` con una `APP_KEY` nueva;
- crea la base SQLite, aplica las migraciones y da de alta **solo las cuatro
  cuentas de rol**;
- ajusta los permisos de escritura;
- copia la carpeta pública a `public_html` y le deja apuntada la ruta de la
  aplicación.

Cuando termine, falta **un** ajuste. Abre el `.env` y pon tu dominio real:

```bash
nano ~/um/um-laravel/.env
```

```ini
APP_URL=https://crm.tudominio.com
```

Guarda con `Ctrl+O`, `Enter`, `Ctrl+X`.

---

## Paso 4 — PHP 8.3 y HTTPS

1. hPanel → **Avanzado → Configuración PHP** → elige **PHP 8.3**.
   El sistema está compilado para 8.3.30 y no corre en 8.1 ni 8.2.
2. hPanel → **Seguridad → SSL** → instala el certificado gratuito y activa
   **Forzar HTTPS**.

Espera al candado en el navegador antes de seguir. **Sin HTTPS la cámara del
escáner no abre**: es una regla de los navegadores, no del sistema.

> Si necesitas probar antes de tener el certificado, pon `FORCE_HTTPS=false` en
> el `.env`. Acuérdate de volver a ponerlo en `true` después.

---

## Paso 5 — Entrar y asegurar

Abre `https://crm.tudominio.com`.

| Usuario | Rol | Contraseña inicial |
|---|---|---|
| `direccion` | Principal | `Cambiar123` |
| `viridiana` | Supervisor | `Cambiar123` |
| `capturista` | Capturista | `Cambiar123` |
| `encargada` | Encargada | `Cambiar123` |

**Lo primero:** entra como `direccion` → *Usuarios* → cambia las cuatro
contraseñas. `Cambiar123` está escrita en este documento, o sea que es pública.

Luego crea los grupos reales en *Grupos* y empieza a dar de alta clientas.

---

## Actualizar más adelante

Dos comandos:

```bash
cd ~/um && git pull
cd um-laravel && bash scripts/desplegar.sh ~/domains/tudominio.com/public_html
```

El script es **idempotente**: se puede correr las veces que haga falta.
Comprobado que al reejecutarlo:

- **no toca el `.env`** ni la `APP_KEY` (si cambiara, se cerrarían todas las
  sesiones);
- **no toca la base de datos** con los datos reales;
- **hace un respaldo automático** de la base antes de migrar, en
  `~/um/um-laravel/respaldos/`.

---

## Respaldos

Todo el sistema son dos cosas:

| Qué | Dónde |
|---|---|
| La base completa | `~/um/um-laravel/database/database.sqlite` |
| Los documentos escaneados | `~/um/um-laravel/storage/app/private/documentos/` |

Descárgalos a tu computadora **cada semana, después del corte del sábado**:

```bash
scp -P 65002 uXXXXXXXXX@123.45.67.89:~/um/um-laravel/database/database.sqlite ./respaldo-um/
scp -P 65002 -r uXXXXXXXXX@123.45.67.89:~/um/um-laravel/storage/app/private/documentos ./respaldo-um/
```

Un respaldo que vive en el mismo servidor no protege contra perder el servidor.

Si tu plan admite tareas programadas (hPanel → **Avanzado → Trabajos cron**),
puedes dejar una copia diaria:

```cron
0 2 * * * cp ~/um/um-laravel/database/database.sqlite ~/respaldos/um-$(date +\%Y\%m\%d).sqlite
```

---

## Problemas comunes

**`git: command not found`.** Tu plan de hosting no incluye Git. Usa entonces
[`DESPLIEGUE-FTP.md`](DESPLIEGUE-FTP.md), que no necesita nada instalado en el
servidor.

**El script dice que no encuentra PHP 8.3.** Cámbialo en hPanel → *Configuración
PHP*. Si el sitio ya está en 8.3 pero la consola no, prueba a ejecutarlo con la
ruta completa:

```bash
/opt/alt/php83/usr/bin/php -v
```

**Error 500 o pantalla en blanco.** Mira el detalle:

```bash
tail -30 ~/um/um-laravel/storage/logs/laravel.log
```

Casi siempre son permisos: vuelve a correr el script, que los reajusta.

**"No se encontró la aplicación".** El `public_html` que le pasaste al script no
es el del dominio. Comprueba la ruta real con `ls ~/domains/`.

**"Database is locked" al cobrar.** SQLite no admite muchas escrituras a la vez.
Con un puñado de personas capturando no pasa; si empezara a ser frecuente, es la
señal de que la operación creció y conviene mover la base a MySQL (solo cambia
el `.env`) o pasar a un servidor propio.
