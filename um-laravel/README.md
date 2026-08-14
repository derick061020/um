# Mujeres Unidas · Sistema de control de crédito (Laravel)

CRM de crédito grupal: clientas, grupos, créditos, cobranza del sábado, corte
del día, expedientes con documentos escaneados, tarjetón en PDF y bitácora.

Escrito en **Laravel 13 + PHP 8.3 + SQLite**, para poder correr en un **hosting
compartido con FTP**, sin VPS, sin Docker y sin servidor de base de datos.

---

## 1. Puesta en marcha local

Requisitos: PHP 8.3+ con `pdo_sqlite`, y Composer.

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

Abre `http://localhost:8000` y entra con `direccion` / `Cambiar123`.

### Cuentas que crea el seed

Contraseña de todas: `Cambiar123` (cámbialas antes de producción).

| Rol | Usuario | Alcance |
|---|---|---|
| Principal | `direccion` | Todo. Crea usuarios y ve la bitácora. |
| Supervisor | `viridiana` | Grupos, clientas, créditos, cobranza, reportes. Puede anular. |
| Capturista | `capturista` | Alta de clientas y créditos, historial, marca abonos. |
| Encargada | `encargada` | Solo el total a cobrar del día. |

En local el seed agrega además 2 grupos y 5 clientas con crédito, para tener
algo que mirar. **En producción (`APP_ENV=production`) crea solo las cuatro
cuentas**, salvo que se pida con `SEED_DEMO=1`.

---

## 2. Pruebas

```bash
php artisan test
```

Cubren las reglas que no pueden fallar: el calendario de los 12 sábados, el
manejo de importes en centavos y el ciclo completo del crédito (parcial →
pagado → atraso → liquidado). Son las mismas comprobaciones que traía la
versión anterior del sistema.

---

## 3. Reglas de negocio

### Calendario automático

Se captura **solo el lunes de entrega**. El sistema:

- calcula el primer abono al **sábado siguiente** (lunes + 5 días);
- genera los **12 sábados** consecutivos;
- fija el **vencimiento en el sábado 12**;
- **muestra el calendario completo antes de guardar**, para confirmarlo con la
  clienta enfrente.

Si por excepción se entrega en sábado, el primer abono se va al sábado
siguiente (7 días), nunca el mismo día.

Las fechas se manejan en UTC a las 00:00, para que el horario de verano o la
zona del servidor nunca corran un día.

### Importes

Todo se guarda en **centavos** (enteros). El total se reparte en abonos parejos
y **el redondeo sobrante se carga al último abono**, de modo que la suma cuadre
exactamente con el total.

### Estados

- **Abono**: `PENDIENTE` → `PARCIAL` → `PAGADO`.
- **Crédito**: `ACTIVO`, `VENCIDO` (pasó el sábado 12 sin liquidar),
  `LIQUIDADO`, `CANCELADO`.

Los vencidos se recalculan al abrir el panel, así no hace falta una tarea
programada (que en hosting compartido no siempre existe).

### Otras reglas

- Una clienta **no puede tener dos créditos abiertos** a la vez.
- El **aval es obligatorio**: nombre y domicilio.
- Anular un pago **no lo borra**: lo marca como anulado, para no perder rastro.
- El sistema **no se puede quedar sin una cuenta Principal activa**.

---

## 4. Permisos

Las pantallas y los controladores preguntan siempre por **permiso**, nunca por
rol (`app/Support/Rbac.php`). Agregar un quinto rol es tocar un solo archivo.

Cada permiso se registra como Gate, así que en las vistas se usa
`@can('creditos.crear')` y en las rutas `->middleware('puede:creditos.crear')`.

---

## 5. Documentos escaneados

En la ficha de la clienta, **Abrir cámara** usa la cámara trasera de la tablet.
La foto se recorta, se limita a 1600 px y, opcionalmente, se pasa a blanco y
negro con más contraste para que se lea. Todo el procesado ocurre **en el
navegador**; al servidor llega la imagen final.

Los archivos se guardan en `storage/app/private/documentos/`, **fuera de la
carpeta pública**, y se sirven por una ruta que exige sesión y permiso.

El expediente marca en pantalla qué documentos obligatorios faltan (INE frente,
INE reverso y comprobante de domicilio).

> La cámara solo abre en `https://` o en `localhost`. Es una regla de los
> navegadores, no del sistema.

---

## 6. Despliegue

**Hosting compartido por FTP: [`DESPLIEGUE-FTP.md`](DESPLIEGUE-FTP.md).**

```bash
bash scripts/empaquetar-ftp.sh
```

Deja `paquete-ftp/` con `public_html/` (lo público) y `um-crm/` (la aplicación,
la base y los documentos). La base va **ya migrada y con las cuatro cuentas**,
así que no hay que ejecutar nada en el servidor.

---

## 7. Estructura

```
app/
├── Support/          Fechas, Dinero, Rbac, Documentos  (lógica pura, sin base)
├── Services/         CreditoService (alta, cobro, anulación), Bitacora
├── Models/           Usuario, Grupo, Cliente, Credito, Abono, Pago, Documento, Auditoria
└── Http/
    ├── Controllers/  una por pantalla
    └── Middleware/   ExigirPermiso
resources/views/      Blade, una carpeta por pantalla + pdf/tarjeton
public/css/um.css     hoja de estilo única, sin compilación
database/migrations/  el esquema completo en una migración
scripts/              empaquetar-ftp.sh
```

No hay Vite, ni npm, ni paso de compilación: el CSS se sube tal cual.

---

## 8. Comandos

| Comando | Para qué |
|---|---|
| `php artisan serve` | Levantar en local |
| `php artisan test` | Las pruebas de negocio |
| `php artisan migrate --seed` | Crear tablas y datos de arranque |
| `php artisan migrate:fresh --seed` | Empezar de cero |
| `bash scripts/empaquetar-ftp.sh` | Armar el paquete para subir |
