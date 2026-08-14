"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { exigirPermisoAccion } from "@/lib/auth";
import { auditar } from "@/lib/auditoria";
import { anularUltimoPago, marcarAbonoCompleto, registrarPago } from "@/lib/creditos";
import { Importe } from "@/lib/validaciones";
import { pesos } from "@/lib/dinero";
import type { EstadoAccion } from "@/components/FormularioAccion";

function revalidar(creditoId: string, clienteId: string) {
  revalidatePath("/cobranza");
  revalidatePath("/corte");
  revalidatePath("/panel");
  revalidatePath(`/creditos/${creditoId}`);
  revalidatePath(`/clientas/${clienteId}`);
}

async function contexto(abonoId: string) {
  return db.abono.findUnique({
    where: { id: abonoId },
    select: {
      id: true,
      semana: true,
      montoEsperado: true,
      montoPagado: true,
      creditoId: true,
      credito: { select: { folio: true, clienteId: true, cliente: { select: { nombre: true } } } },
    },
  });
}

/** Botón de un toque: deja el abono de la semana como pagado completo. */
export async function marcarAbono(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("cobranza.marcar");
    const abonoId = String(form.get("abonoId") ?? "");

    const ctx = await contexto(abonoId);
    if (!ctx) return { error: "No se encontró el abono." };
    if (ctx.montoPagado >= ctx.montoEsperado) return { exito: "Este abono ya estaba pagado." };

    await marcarAbonoCompleto({ abonoId, registradoPorId: sesion.usuario.id });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "abono.marcar",
      entidad: "Abono",
      entidadId: abonoId,
      detalle: {
        credito: ctx.credito.folio,
        clienta: ctx.credito.cliente.nombre,
        semana: ctx.semana,
        monto: ctx.montoEsperado - ctx.montoPagado,
      },
    });

    revalidar(ctx.creditoId, ctx.credito.clienteId);
    return { exito: `Semana ${ctx.semana} de ${ctx.credito.cliente.nombre}: pagada.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo marcar el abono." };
  }
}

/** Abono incompleto: la clienta deja una parte. */
export async function abonoParcial(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("cobranza.marcar");
    const abonoId = String(form.get("abonoId") ?? "");

    const monto = Importe.safeParse(String(form.get("monto") ?? ""));
    if (!monto.success) return { error: monto.error.issues[0]!.message };

    const ctx = await contexto(abonoId);
    if (!ctx) return { error: "No se encontró el abono." };

    const falta = ctx.montoEsperado - ctx.montoPagado;
    if (falta <= 0) return { error: "Este abono ya está cubierto." };
    if (monto.data > falta) {
      return { error: `El abono de la semana ${ctx.semana} solo tiene pendiente ${pesos(falta)}.` };
    }

    await registrarPago({
      abonoId,
      monto: monto.data,
      nota: String(form.get("nota") ?? "") || null,
      registradoPorId: sesion.usuario.id,
    });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "abono.parcial",
      entidad: "Abono",
      entidadId: abonoId,
      detalle: {
        credito: ctx.credito.folio,
        clienta: ctx.credito.cliente.nombre,
        semana: ctx.semana,
        monto: monto.data,
      },
    });

    revalidar(ctx.creditoId, ctx.credito.clienteId);
    return { exito: `Se registró ${pesos(monto.data)} en la semana ${ctx.semana}.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo registrar el abono." };
  }
}

/** Corrección de captura: cancela el último movimiento del abono. */
export async function anularAbono(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("cobranza.anular");
    const abonoId = String(form.get("abonoId") ?? "");

    const ctx = await contexto(abonoId);
    if (!ctx) return { error: "No se encontró el abono." };

    await anularUltimoPago({ abonoId, registradoPorId: sesion.usuario.id });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "abono.anular",
      entidad: "Abono",
      entidadId: abonoId,
      detalle: { credito: ctx.credito.folio, semana: ctx.semana },
    });

    revalidar(ctx.creditoId, ctx.credito.clienteId);
    return { exito: `Se anuló el último movimiento de la semana ${ctx.semana}.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo anular el movimiento." };
  }
}
