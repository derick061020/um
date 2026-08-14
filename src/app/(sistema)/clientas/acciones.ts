"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { exigirPermisoAccion } from "@/lib/auth";
import { auditar } from "@/lib/auditoria";
import { NuevaClienta, objetoDeFormulario, primerError } from "@/lib/validaciones";
import type { EstadoAccion } from "@/components/FormularioAccion";

export async function crearClienta(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  let destino: string | null = null;

  try {
    const sesion = await exigirPermisoAccion("clientas.crear");
    const datos = NuevaClienta.safeParse(objetoDeFormulario(form));
    if (!datos.success) return { error: primerError(datos.error) };

    const clienta = await db.cliente.create({
      data: { ...datos.data, capturadoPorId: sesion.usuario.id },
    });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "clienta.crear",
      entidad: "Cliente",
      entidadId: clienta.id,
      detalle: { folio: clienta.folio, nombre: clienta.nombre },
    });

    revalidatePath("/clientas");
    destino = `/clientas/${clienta.id}`;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo guardar la clienta." };
  }

  redirect(destino);
}

export async function actualizarClienta(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("clientas.editar");
    const id = String(form.get("id") ?? "");
    const datos = NuevaClienta.safeParse(objetoDeFormulario(form));
    if (!datos.success) return { error: primerError(datos.error) };

    const anterior = await db.cliente.findUnique({ where: { id } });
    if (!anterior) return { error: "No se encontró la clienta." };

    await db.cliente.update({ where: { id }, data: datos.data });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "clienta.editar",
      entidad: "Cliente",
      entidadId: id,
      detalle: { folio: anterior.folio },
    });

    revalidatePath(`/clientas/${id}`);
    revalidatePath("/clientas");
    return { exito: "Datos actualizados." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo actualizar la clienta." };
  }
}
