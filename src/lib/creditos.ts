import type { Abono, Credito, EstadoAbono, Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { generarCalendario, hoy, parseFecha } from "@/lib/fechas";
import { repartirAbonos } from "@/lib/dinero";

export type DatosCredito = {
  clienteId: string;
  grupoId?: string | null;
  montoPrestado: number; // centavos
  montoTotal: number; // centavos — lo que la clienta termina pagando
  numSemanas: number;
  fechaEntregaISO: string; // lunes
  notas?: string | null;
  capturadoPorId: string;
};

/**
 * Da de alta el crédito y su calendario completo en una sola transacción.
 * El calendario se deriva de la fecha de entrega: 12 sábados consecutivos,
 * el primero cinco días después del lunes de entrega.
 */
export async function crearCredito(datos: DatosCredito): Promise<Credito> {
  const entrega = parseFecha(datos.fechaEntregaISO);
  const calendario = generarCalendario(entrega, datos.numSemanas);
  const montos = repartirAbonos(datos.montoTotal, datos.numSemanas);
  const abonoSemanal = montos[0]!;

  return db.$transaction(async (tx) => {
    const credito = await tx.credito.create({
      data: {
        clienteId: datos.clienteId,
        grupoId: datos.grupoId ?? null,
        montoPrestado: datos.montoPrestado,
        montoTotal: datos.montoTotal,
        abonoSemanal,
        numSemanas: datos.numSemanas,
        fechaEntrega: entrega,
        fechaPrimerAbono: calendario[0]!.fecha,
        fechaVencimiento: calendario[calendario.length - 1]!.fecha,
        notas: datos.notas ?? null,
        capturadoPorId: datos.capturadoPorId,
      },
    });

    await tx.abono.createMany({
      data: calendario.map((fila, i) => ({
        creditoId: credito.id,
        semana: fila.semana,
        fechaProgramada: fila.fecha,
        montoEsperado: montos[i]!,
      })),
    });

    return credito;
  });
}

/**
 * Registra un pago contra un abono concreto y deja el abono y el crédito
 * con el estado que corresponde. Devuelve el abono actualizado.
 */
export async function registrarPago(opciones: {
  abonoId: string;
  monto: number; // centavos
  fechaISO?: string;
  nota?: string | null;
  registradoPorId: string;
}): Promise<Abono> {
  const { abonoId, monto, nota, registradoPorId } = opciones;
  if (monto <= 0) throw new Error("El monto del abono debe ser mayor a cero.");
  const fecha = opciones.fechaISO ? parseFecha(opciones.fechaISO) : hoy();

  return db.$transaction(async (tx) => {
    const abono = await tx.abono.findUnique({ where: { id: abonoId } });
    if (!abono) throw new Error("No se encontró el abono.");

    await tx.pago.create({
      data: {
        creditoId: abono.creditoId,
        abonoId: abono.id,
        monto,
        fecha,
        nota: nota ?? null,
        registradoPorId,
      },
    });

    const pagado = abono.montoPagado + monto;
    const actualizado = await tx.abono.update({
      where: { id: abono.id },
      data: {
        montoPagado: pagado,
        estado: estadoDeAbono(pagado, abono.montoEsperado),
        pagadoEn: pagado >= abono.montoEsperado ? new Date() : abono.pagadoEn,
      },
    });

    await refrescarCredito(tx, abono.creditoId);
    return actualizado;
  });
}

/** Deja el abono exactamente en "pagado completo" (botón de un toque del sábado). */
export async function marcarAbonoCompleto(opciones: {
  abonoId: string;
  fechaISO?: string;
  registradoPorId: string;
}): Promise<Abono> {
  const abono = await db.abono.findUnique({ where: { id: opciones.abonoId } });
  if (!abono) throw new Error("No se encontró el abono.");
  const falta = abono.montoEsperado - abono.montoPagado;
  if (falta <= 0) return abono;
  return registrarPago({ ...opciones, monto: falta, nota: "Abono completo" });
}

/** Cancela el último movimiento de un abono (corrección de captura). */
export async function anularUltimoPago(opciones: {
  abonoId: string;
  registradoPorId: string;
}): Promise<Abono> {
  return db.$transaction(async (tx) => {
    const abono = await tx.abono.findUnique({ where: { id: opciones.abonoId } });
    if (!abono) throw new Error("No se encontró el abono.");

    const ultimo = await tx.pago.findFirst({
      where: { abonoId: abono.id, anulado: false },
      orderBy: { creadoEn: "desc" },
    });
    if (!ultimo) throw new Error("Este abono no tiene movimientos que anular.");

    await tx.pago.update({
      where: { id: ultimo.id },
      data: { anulado: true, nota: `${ultimo.nota ?? ""} (anulado)`.trim() },
    });

    const pagado = Math.max(0, abono.montoPagado - ultimo.monto);
    const actualizado = await tx.abono.update({
      where: { id: abono.id },
      data: {
        montoPagado: pagado,
        estado: estadoDeAbono(pagado, abono.montoEsperado),
        pagadoEn: pagado >= abono.montoEsperado ? abono.pagadoEn : null,
      },
    });

    await refrescarCredito(tx, abono.creditoId);
    return actualizado;
  });
}

export function estadoDeAbono(pagado: number, esperado: number): EstadoAbono {
  if (pagado <= 0) return "PENDIENTE";
  if (pagado >= esperado) return "PAGADO";
  return "PARCIAL";
}

/** Recalcula si el crédito quedó liquidado o vencido tras un movimiento. */
async function refrescarCredito(tx: Prisma.TransactionClient, creditoId: string): Promise<void> {
  const credito = await tx.credito.findUnique({
    where: { id: creditoId },
    include: { abonos: { select: { montoPagado: true } } },
  });
  if (!credito || credito.estado === "CANCELADO") return;

  const pagado = credito.abonos.reduce((s, a) => s + a.montoPagado, 0);
  const liquidado = pagado >= credito.montoTotal;
  const vencido = !liquidado && credito.fechaVencimiento < hoy();

  const estado = liquidado ? "LIQUIDADO" : vencido ? "VENCIDO" : "ACTIVO";
  if (estado !== credito.estado) {
    await tx.credito.update({
      where: { id: creditoId },
      data: { estado, liquidadoEn: liquidado ? new Date() : null },
    });
  }
}

// ---------------------------------------------------------------------------
// Consultas de apoyo
// ---------------------------------------------------------------------------

export type ResumenCredito = {
  totalPagado: number;
  saldo: number;
  abonosPagados: number;
  abonosPendientes: number;
  atrasoCentavos: number;
  semanasAtrasadas: number;
};

export function resumirCredito(
  credito: Pick<Credito, "montoTotal">,
  abonos: Pick<Abono, "montoEsperado" | "montoPagado" | "fechaProgramada" | "estado">[],
  referencia: Date = hoy(),
): ResumenCredito {
  const totalPagado = abonos.reduce((s, a) => s + a.montoPagado, 0);
  const vencidos = abonos.filter((a) => a.fechaProgramada <= referencia);
  const esperadoALaFecha = vencidos.reduce((s, a) => s + a.montoEsperado, 0);
  const pagadoDeVencidos = vencidos.reduce((s, a) => s + a.montoPagado, 0);

  return {
    totalPagado,
    saldo: Math.max(0, credito.montoTotal - totalPagado),
    abonosPagados: abonos.filter((a) => a.estado === "PAGADO").length,
    abonosPendientes: abonos.filter((a) => a.estado !== "PAGADO").length,
    atrasoCentavos: Math.max(0, esperadoALaFecha - pagadoDeVencidos),
    semanasAtrasadas: vencidos.filter((a) => a.estado !== "PAGADO").length,
  };
}

/**
 * Marca como VENCIDOS los créditos que pasaron su fecha de vencimiento
 * sin liquidar. Se ejecuta al abrir el panel, no requiere tarea programada.
 */
export async function actualizarVencidos(): Promise<number> {
  const { count } = await db.credito.updateMany({
    where: { estado: "ACTIVO", fechaVencimiento: { lt: hoy() } },
    data: { estado: "VENCIDO" },
  });
  return count;
}
