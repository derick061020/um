# Entrega — Sistema de control de crédito Mujeres Unidas

Documento de cierre: qué quedó hecho de cada punto solicitado, qué cuesta el
dominio y el hosting, cómo se entregan el código y la base de datos, y en qué
plazo y con qué garantía.

---

## 1. Los siete puntos solicitados

### ✅ 1. Cuatro roles

| Rol | Alcance implementado |
|---|---|
| **Principal** | Crea usuarios, asigna rol, cambia contraseñas, desactiva cuentas. Ve toda la operación y la bitácora. |
| **Supervisor** | Crea y administra grupos (VIRI 1, CHIHUAHUA 1…), asigna supervisor y encargada a cada grupo, ve clientas, créditos, cobranza y reportes. Puede anular movimientos mal capturados. |
| **Capturista** | Da de alta clientas con **nombre, aval y domicilio del aval**, consulta el **historial** de crédito y puntualidad, registra créditos y **marca los abonos del sábado**. |
| **Encargada** | Pantalla única con el **total a cobrar del día** (ej. $1,000). No ve nombres, domicilios ni importes por clienta. |

El sistema no pregunta por rol sino por permiso, así que si mañana quieren un
quinto rol (por ejemplo "auditor de solo lectura") se agrega en un archivo sin
tocar el resto.

Cada persona entra con su propio usuario y **todo movimiento queda firmado** con
su nombre, fecha y hora en la bitácora.

### ✅ 2. Fechas automáticas

Se captura **solo el lunes de entrega**. El sistema:

- calcula el primer abono al sábado siguiente (lunes + 5 días);
- genera los 12 sábados consecutivos;
- fija el **vencimiento en el sábado 12**;
- **muestra el calendario completo antes de guardar**, para confirmar la fecha de
  vencimiento con la clienta enfrente.

Ejemplo verificado: entrega lunes **17/08/2026** → primer abono sábado
**22/08/2026** → vence sábado **07/11/2026**.

El plazo de 12 semanas es configurable por si más adelante manejan otros plazos.

### ✅ 3. Tarjetón PDF limpio

Se imprime desde el sistema con un botón. Lleva **únicamente**:

- el logotipo UM;
- el **nombre de la clienta**;
- **12 columnas** con el número de semana y el sábado que le toca;
- el **abono impreso en vertical** dentro de cada columna.

**Sin domicilios y sin la cantidad del crédito arriba.**

También se puede imprimir el juego completo de un grupo, un tarjetón por hoja,
para llevar toda la ruta del sábado en un solo PDF.

> Cuando me pasen el tarjetón físico actual, ajusto medidas, márgenes y anchos de
> columna para que quede idéntico al que ya usan. Los valores están al inicio de un
> solo archivo, es un cambio de minutos.

### ✅ 4. Dominio y hosting — ver sección 2 de este documento

### ✅ 5. Código fuente y base de datos — ver sección 3

### ✅ 6. Plazo y garantía — ver sección 4

### ✅ 7. Escanear documentos con la cámara de la tablet

En la ficha de cada clienta hay un bloque **"Escanear documento"**:

1. se elige el tipo (INE frente y reverso, comprobante de domicilio, INE del aval,
   comprobante del aval, pagaré, contrato u otro);
2. **Abrir cámara** usa la cámara trasera de la tablet, con recuadro de guía;
3. un realce opcional lo pasa a blanco y negro con más contraste, para que se lea;
4. al guardar, la imagen se endereza, se optimiza y **se archiva en el expediente
   de esa clienta**.

El expediente marca en pantalla **qué documentos obligatorios faltan**, así nadie
entrega un crédito con papeles incompletos.

Los archivos **no** quedan expuestos en internet: se sirven por una ruta que exige
sesión y permiso, y quien no tiene permiso recibe un rechazo (probado).

---

## 2. Dominio y hosting

### Qué queda a nombre de Mujeres Unidas

- El **dominio .com** se registra directamente en la cuenta de Mujeres Unidas, con
  su correo y sus datos como titular. No queda a mi nombre en ningún momento.
- El **servidor** se contrata también en su cuenta, pagado por año, **sin renta
  mensual**.
- Yo solo recibo accesos para instalar y configurar; al cerrar el proyecto se
  cambian las contraseñas y quedan únicamente en sus manos.

### Costo real (referencias de agosto 2026)

Dominio `.com` — el precio es del registrador, no mío:

| Registrador | Primer año | **Renovación anual** |
|---|---|---|
| Cloudflare (a precio de costo) | ≈ 10.44 USD | **≈ 10.44 USD** (≈ $195 MXN) |
| Porkbun | ≈ 11.00 USD | **≈ 11.00 USD** (≈ $205 MXN) |
| Namecheap | promoción ~1–10 USD | **≈ 18.48 USD** (≈ $345 MXN) |

> Aviso importante: el precio mayorista de los `.com` sube el **1 de noviembre de
> 2026** (de 10.26 a 10.97 USD), así que las renovaciones subirán alrededor de
> 0.70 USD al año. Recomiendo **Cloudflare**, que cobra a precio de costo y no
> mete promociones que luego se disparan en la renovación.

Servidor (VPS), pagado por año y sin renta mensual:

| Proveedor | Plan | Costo | **Renovación anual** |
|---|---|---|---|
| Hostinger | KVM 1 (1 vCPU, 4 GB) | ≈ 4.99 USD/mes prepagado | **≈ 60 USD** (≈ $1,120 MXN) |
| Hetzner | CX22 (2 vCPU, 4 GB) | ≈ 4.35 EUR/mes | **≈ 47–55 USD** (≈ $880–1,030 MXN) |
| Contabo | Cloud VPS (4 vCPU, 8 GB) | ≈ 4.95 USD/mes | **≈ 60 USD** (≈ $1,120 MXN) |

**Total del primer año: ≈ 70–75 USD (≈ $1,300–1,400 MXN)** entre dominio y
servidor. **La renovación al año siguiente es prácticamente la misma cifra**, más
el ajuste de Verisign mencionado arriba. No hay licencias, no hay suscripciones de
software, no hay cobros por usuario: el sistema es suyo.

El certificado **HTTPS es gratuito** (Let's Encrypt) y se renueva solo. Es
indispensable, no es un lujo: los navegadores **solo permiten abrir la cámara de
la tablet en sitios con HTTPS**, así que sin él el escaneo del punto 7 no
funcionaría desde la página.

> Nota técnica, para que no haya sorpresas: el sistema necesita un servidor con
> Node.js y PostgreSQL, no el hosting compartido de $30 dólares al año que solo
> corre PHP. Por eso el rango de arriba. Sigue siendo **pago anual, sin renta
> mensual**, como se pidió.

### Lo que incluye mi trabajo de instalación

Compra y configuración del dominio, contratación y endurecimiento del servidor,
instalación del sistema, certificado HTTPS, respaldos automáticos diarios y
capacitación al equipo.

---

## 3. Código fuente y base de datos

Al cierre del proyecto se entrega:

1. **Todo el código fuente**, sin partes ocultas ni componentes que dependan de
   mí. Se entrega en un repositorio (GitHub privado de Mujeres Unidas o archivo
   comprimido, como prefieran).
2. **La base de datos completa**, en respaldo `pg_dump` restaurable en cualquier
   servidor PostgreSQL.
3. **Los documentos escaneados**, en su respaldo comprimido.
4. **Los accesos** del dominio, el servidor y la base de datos, con contraseñas
   cambiadas a las que ustedes definan.
5. **La documentación** (`README.md`): cómo instalarlo, cómo respaldarlo, cómo
   restaurarlo y qué hace cada archivo, en español.
6. **Las pruebas automáticas** de las reglas de negocio (`npm run pruebas`), para
   que cualquier programador que toque el sistema después de mí pueda comprobar en
   segundos que no rompió el cálculo de fechas ni de abonos.

No hay dependencia hacia mí: cualquier desarrollador de Next.js y PostgreSQL puede
continuarlo. Se usaron tecnologías estándar y gratuitas, a propósito.

El respaldo se ejecuta con un comando (`npm run respaldo`) y queda programado
automáticamente a diario en el servidor, conservando los últimos 30 respaldos.

---

## 4. Plazo de entrega y garantía

### Estado actual

El sistema **ya está construido y funcionando**: los 4 roles con sus permisos, el
calendario automático de 12 sábados, la cobranza del día, el tarjetón PDF, el
escáner con cámara y el expediente digital. Verificado con 30 pruebas automáticas
de las reglas de negocio y pruebas de acceso por rol.

### Lo que falta para el arranque en producción

| Etapa | Días hábiles |
|---|---|
| Ajuste del tarjetón al físico actual y detalles visuales | 2 |
| Dominio, servidor, HTTPS, respaldos automáticos | 2 |
| Carga de los grupos y clientas actuales | 2 |
| Capacitación al equipo (dirección, supervisor, capturistas, encargadas) | 1 |
| Acompañamiento del primer sábado real de cobranza | 1 |
| **Entrega formal** | **8 días hábiles** |

### Después de la entrega

- **15 días naturales de ajustes incluidos.** Todo lo que salga del uso real
  —campos que hacen falta, textos, orden de las pantallas, medidas del tarjetón—
  se ajusta sin costo extra.
- **90 días de garantía por errores (bugs).** Si algo del sistema no hace lo que
  se acordó en este documento, se corrige sin costo y sin límite de veces. La
  garantía cubre defectos del sistema; no cubre funciones nuevas que no estén en
  esta lista, ni fallas del proveedor de hosting, ni errores de captura del
  personal.
- **Soporte posterior**, si lo quieren, se cotiza aparte. **No es obligatorio y el
  sistema no deja de funcionar sin él**: es suyo.

---

## 5. Cuentas de arranque

El sistema se entrega con una cuenta por rol para la capacitación. **Las cuatro
contraseñas deben cambiarse el primer día**, y desde la cuenta Principal se dan de
alta las personas reales del equipo.

| Rol | Usuario de arranque |
|---|---|
| Principal | `direccion` |
| Supervisor | `viridiana` |
| Capturista | `capturista` |
| Encargada | `encargada` |
