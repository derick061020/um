"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { exigirPermisoAccion } from "@/lib/auth";
import { auditar } from "@/lib/auditoria";
import { crearCredito } from "@/lib/creditos";
import { NuevoCredito, objetoDeFormulario, primerError } from "@/lib/validaciones";
import { fechaISO, parseFecha, primerSabado, fechaVencimiento } from "@/lib/fechas";
import type { EstadoAccion } from "@/components/FormularioAccion";

export async function registrarCredito(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  let destino: string | null = null;

  try {
    const sesion = await exigirPermisoAccion("creditos.crear");
    const datos = NuevoCredito.safeParse(objetoDeFormulario(form));
    if (!datos.success) return { error: primerError(datos.error) };

    const clienta = await db.cliente.findUnique({
      where: { id: datos.data.clienteId },
      select: { id: true, nombre: true, grupoId: true, avalNombre: true },
    });
    if (!clienta) return { error: "No se encontró la clienta." };

    const abierto = await db.credito.findFirst({
      where: { clienteId: clienta.id, estado: { in: ["ACTIVO", "VENCIDO"] } },
      select: { folio: true },
    });
    if (abierto) {
      return {
        error: `${clienta.nombre} todavía tiene el crédito ${String(abierto.folio).padStart(4, "0")} sin liquidar.`,
      };
    }

    const credito = await crearCredito({
      clienteId: clienta.id,
      grupoId: datos.data.grupoId ?? clienta.grupoId,
      montoPrestado: datos.data.montoPrestado,
      montoTotal: datos.data.montoTotal,
      numSemanas: datos.data.numSemanas,
      fechaEntregaISO: datos.data.fechaEntrega,
      notas: datos.data.notas,
      capturadoPorId: sesion.usuario.id,
    });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "credito.crear",
      entidad: "Credito",
      entidadId: credito.id,
      detalle: {
        folio: credito.folio,
        clienta: clienta.nombre,
        montoTotal: credito.montoTotal,
        semanas: credito.numSemanas,
        vence: fechaISO(credito.fechaVencimiento),
      },
    });

    revalidatePath("/creditos");
    revalidatePath(`/clientas/${clienta.id}`);
    destino = `/creditos/${credito.id}`;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo registrar el crédito." };
  }

  redirect(destino);
}

export async function cancelarCredito(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("creditos.editar");
    const id = String(form.get("id") ?? "");

    const credito = await db.credito.findUnique({
      where: { id },
      include: { abonos: { select: { montoPagado: true } } },
    });
    if (!credito) return { error: "No se encontró el crédito." };

    const pagado = credito.abonos.reduce((s, a) => s + a.montoPagado, 0);
    if (pagado > 0) {
      return { error: "Este crédito ya tiene abonos registrados; no se puede cancelar." };
    }

    await db.credito.update({ where: { id }, data: { estado: "CANCELADO" } });
    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "credito.cancelar",
      entidad: "Credito",
      entidadId: id,
      detalle: { folio: credito.folio },
    });

    revalidatePath(`/creditos/${id}`);
    revalidatePath("/creditos");
    return { exito: "Crédito cancelado." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo cancelar el crédito." };
  }
}

/** Vista previa del calendario, usada por el formulario de alta. */
export async function previsualizarCalendario(entregaISO: string, semanas: number) {
  const entrega = parseFecha(entregaISO);
  return {
    primerSabado: fechaISO(primerSabado(entrega)),
    vencimiento: fechaISO(fechaVencimiento(entrega, semanas)),
  };
}
