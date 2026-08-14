-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('PRINCIPAL', 'SUPERVISOR', 'CAPTURISTA', 'ENCARGADA');

-- CreateEnum
CREATE TYPE "EstadoCredito" AS ENUM ('ACTIVO', 'LIQUIDADO', 'VENCIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoAbono" AS ENUM ('PENDIENTE', 'PARCIAL', 'PAGADO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('INE_FRENTE', 'INE_REVERSO', 'COMPROBANTE_DOMICILIO', 'INE_AVAL_FRENTE', 'INE_AVAL_REVERSO', 'COMPROBANTE_AVAL', 'PAGARE', 'CONTRATO', 'OTRO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "telefono" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "creadoPorId" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sesion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "creadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agente" TEXT,
    "ip" TEXT,

    CONSTRAINT "Sesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "plaza" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,
    "supervisorId" TEXT,
    "encargadaId" TEXT,
    "creadoPorId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "folio" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "domicilio" TEXT,
    "colonia" TEXT,
    "ciudad" TEXT,
    "curp" TEXT,
    "avalNombre" TEXT,
    "avalTelefono" TEXT,
    "avalParentesco" TEXT,
    "avalDomicilio" TEXT,
    "avalColonia" TEXT,
    "avalCiudad" TEXT,
    "grupoId" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,
    "capturadoPorId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credito" (
    "id" TEXT NOT NULL,
    "folio" SERIAL NOT NULL,
    "clienteId" TEXT NOT NULL,
    "grupoId" TEXT,
    "montoPrestado" INTEGER NOT NULL,
    "montoTotal" INTEGER NOT NULL,
    "abonoSemanal" INTEGER NOT NULL,
    "numSemanas" INTEGER NOT NULL DEFAULT 12,
    "fechaEntrega" DATE NOT NULL,
    "fechaPrimerAbono" DATE NOT NULL,
    "fechaVencimiento" DATE NOT NULL,
    "estado" "EstadoCredito" NOT NULL DEFAULT 'ACTIVO',
    "liquidadoEn" TIMESTAMP(3),
    "notas" TEXT,
    "capturadoPorId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abono" (
    "id" TEXT NOT NULL,
    "creditoId" TEXT NOT NULL,
    "semana" INTEGER NOT NULL,
    "fechaProgramada" DATE NOT NULL,
    "montoEsperado" INTEGER NOT NULL,
    "montoPagado" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoAbono" NOT NULL DEFAULT 'PENDIENTE',
    "pagadoEn" TIMESTAMP(3),

    CONSTRAINT "Abono_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "creditoId" TEXT NOT NULL,
    "abonoId" TEXT,
    "monto" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "nota" TEXT,
    "anulado" BOOLEAN NOT NULL DEFAULT false,
    "registradoPorId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tipo" "TipoDocumento" NOT NULL DEFAULT 'OTRO',
    "descripcion" TEXT,
    "archivo" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "ancho" INTEGER,
    "alto" INTEGER,
    "subidoPorId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT,
    "detalle" JSONB,
    "ip" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "Usuario"("usuario");

-- CreateIndex
CREATE INDEX "Usuario_rol_activo_idx" ON "Usuario"("rol", "activo");

-- CreateIndex
CREATE INDEX "Sesion_usuarioId_idx" ON "Sesion"("usuarioId");

-- CreateIndex
CREATE INDEX "Sesion_expiraEn_idx" ON "Sesion"("expiraEn");

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_nombre_key" ON "Grupo"("nombre");

-- CreateIndex
CREATE INDEX "Grupo_activo_idx" ON "Grupo"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_folio_key" ON "Cliente"("folio");

-- CreateIndex
CREATE INDEX "Cliente_grupoId_activo_idx" ON "Cliente"("grupoId", "activo");

-- CreateIndex
CREATE INDEX "Cliente_nombre_idx" ON "Cliente"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Credito_folio_key" ON "Credito"("folio");

-- CreateIndex
CREATE INDEX "Credito_grupoId_estado_idx" ON "Credito"("grupoId", "estado");

-- CreateIndex
CREATE INDEX "Credito_clienteId_idx" ON "Credito"("clienteId");

-- CreateIndex
CREATE INDEX "Credito_estado_fechaVencimiento_idx" ON "Credito"("estado", "fechaVencimiento");

-- CreateIndex
CREATE INDEX "Abono_fechaProgramada_estado_idx" ON "Abono"("fechaProgramada", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "Abono_creditoId_semana_key" ON "Abono"("creditoId", "semana");

-- CreateIndex
CREATE INDEX "Pago_fecha_anulado_idx" ON "Pago"("fecha", "anulado");

-- CreateIndex
CREATE INDEX "Pago_creditoId_idx" ON "Pago"("creditoId");

-- CreateIndex
CREATE INDEX "Documento_clienteId_tipo_idx" ON "Documento"("clienteId", "tipo");

-- CreateIndex
CREATE INDEX "Auditoria_creadoEn_idx" ON "Auditoria"("creadoEn");

-- CreateIndex
CREATE INDEX "Auditoria_entidad_entidadId_idx" ON "Auditoria"("entidad", "entidadId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_encargadaId_fkey" FOREIGN KEY ("encargadaId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_capturadoPorId_fkey" FOREIGN KEY ("capturadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credito" ADD CONSTRAINT "Credito_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credito" ADD CONSTRAINT "Credito_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credito" ADD CONSTRAINT "Credito_capturadoPorId_fkey" FOREIGN KEY ("capturadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abono" ADD CONSTRAINT "Abono_creditoId_fkey" FOREIGN KEY ("creditoId") REFERENCES "Credito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_creditoId_fkey" FOREIGN KEY ("creditoId") REFERENCES "Credito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_abonoId_fkey" FOREIGN KEY ("abonoId") REFERENCES "Abono"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_subidoPorId_fkey" FOREIGN KEY ("subidoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

