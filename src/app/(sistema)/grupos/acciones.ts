"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { exigirPermisoAccion } from "@/lib/auth";
import { auditar } from "@/lib/auditoria";
import { NuevoGrupo, objetoDeFormulario, primerError } from "@/lib/validaciones";
import type { EstadoAccion } from "@/components/FormularioAccion";

export async function crearGrupo(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("grupos.crear");
    const datos = NuevoGrupo.safeParse(objetoDeFormulario(form));
    if (!datos.success) return { error: primerError(datos.error) };

    const existe = await db.grupo.findUnique({ where: { nombre: datos.data.nombre } });
    if (existe) return { error: `Ya existe el grupo "${datos.data.nombre}".` };

    // Si quien crea es supervisor y no eligió a nadie, el grupo queda a su cargo.
    const supervisorId =
      datos.data.supervisorId ?? (sesion.usuario.rol === "SUPERVISOR" ? sesion.usuario.id : null);

    const grupo = await db.grupo.create({
      data: {
        nombre: datos.data.nombre,
        plaza: datos.data.plaza,
        notas: datos.data.notas,
        supervisorId,
        encargadaId: datos.data.encargadaId,
        creadoPorId: sesion.usuario.id,
      },
    });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "grupo.crear",
      entidad: "Grupo",
      entidadId: grupo.id,
      detalle: { nombre: grupo.nombre },
    });

    revalidatePath("/grupos");
    return { exito: `Se creó el grupo ${grupo.nombre}.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo crear el grupo." };
  }
}

export async function actualizarGrupo(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("grupos.editar");
    const id = String(form.get("id") ?? "");
    const datos = NuevoGrupo.safeParse(objetoDeFormulario(form));
    if (!datos.success) return { error: primerError(datos.error) };

    const grupo = await db.grupo.findUnique({ where: { id } });
    if (!grupo) return { error: "No se encontró el grupo." };

    const choque = await db.grupo.findUnique({ where: { nombre: datos.data.nombre } });
    if (choque && choque.id !== id) return { error: `Ya existe el grupo "${datos.data.nombre}".` };

    await db.grupo.update({
      where: { id },
      data: {
        nombre: datos.data.nombre,
        plaza: datos.data.plaza,
        notas: datos.data.notas,
        supervisorId: datos.data.supervisorId,
        encargadaId: datos.data.encargadaId,
      },
    });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "grupo.editar",
      entidad: "Grupo",
      entidadId: id,
    });

    revalidatePath("/grupos");
    return { exito: "Grupo actualizado." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo actualizar el grupo." };
  }
}

export async function cambiarEstadoGrupo(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("grupos.editar");
    const id = String(form.get("id") ?? "");
    const grupo = await db.grupo.findUnique({ where: { id } });
    if (!grupo) return { error: "No se encontró el grupo." };

    if (grupo.activo) {
      const activos = await db.credito.count({ where: { grupoId: id, estado: "ACTIVO" } });
      if (activos > 0) {
        return { error: `No se puede archivar: el grupo tiene ${activos} crédito(s) activo(s).` };
      }
    }

    await db.grupo.update({ where: { id }, data: { activo: !grupo.activo } });
    await auditar({
      usuarioId: sesion.usuario.id,
      accion: grupo.activo ? "grupo.archivar" : "grupo.reactivar",
      entidad: "Grupo",
      entidadId: id,
    });

    revalidatePath("/grupos");
    return { exito: `El grupo ${grupo.nombre} quedó ${grupo.activo ? "archivado" : "activo"}.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo cambiar el estado del grupo." };
  }
}
