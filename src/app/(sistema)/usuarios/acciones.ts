"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { exigirPermisoAccion, hashPassword } from "@/lib/auth";
import { auditar } from "@/lib/auditoria";
import { NuevoUsuario, objetoDeFormulario, primerError } from "@/lib/validaciones";
import { ETIQUETA_ROL } from "@/lib/rbac";
import type { EstadoAccion } from "@/components/FormularioAccion";

export async function crearUsuario(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("usuarios.crear");
    const datos = NuevoUsuario.safeParse(objetoDeFormulario(form));
    if (!datos.success) return { error: primerError(datos.error) };

    const existe = await db.usuario.findUnique({ where: { usuario: datos.data.usuario } });
    if (existe) return { error: `El usuario "${datos.data.usuario}" ya está ocupado.` };

    const creado = await db.usuario.create({
      data: {
        nombre: datos.data.nombre,
        usuario: datos.data.usuario,
        passwordHash: await hashPassword(datos.data.password),
        rol: datos.data.rol,
        telefono: datos.data.telefono,
        creadoPorId: sesion.usuario.id,
      },
    });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "usuario.crear",
      entidad: "Usuario",
      entidadId: creado.id,
      detalle: { usuario: creado.usuario, rol: creado.rol },
    });

    revalidatePath("/usuarios");
    return { exito: `Se creó ${creado.nombre} como ${ETIQUETA_ROL[creado.rol]}.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo crear el usuario." };
  }
}

export async function cambiarEstadoUsuario(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("usuarios.editar");
    const id = String(form.get("id") ?? "");
    const objetivo = await db.usuario.findUnique({ where: { id } });
    if (!objetivo) return { error: "No se encontró el usuario." };

    if (objetivo.id === sesion.usuario.id) {
      return { error: "No puedes desactivar tu propia cuenta." };
    }
    if (objetivo.rol === "PRINCIPAL" && objetivo.activo) {
      const principalesActivos = await db.usuario.count({ where: { rol: "PRINCIPAL", activo: true } });
      if (principalesActivos <= 1) {
        return { error: "Debe quedar al menos una cuenta Principal activa." };
      }
    }

    const activo = !objetivo.activo;
    await db.usuario.update({ where: { id }, data: { activo } });
    if (!activo) await db.sesion.deleteMany({ where: { usuarioId: id } });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: activo ? "usuario.activar" : "usuario.desactivar",
      entidad: "Usuario",
      entidadId: id,
    });

    revalidatePath("/usuarios");
    return { exito: `${objetivo.nombre} quedó ${activo ? "activa" : "desactivada"}.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo actualizar el usuario." };
  }
}

export async function restablecerPassword(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("usuarios.editar");
    const id = String(form.get("id") ?? "");
    const nueva = String(form.get("password") ?? "");
    if (nueva.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

    const objetivo = await db.usuario.findUnique({ where: { id } });
    if (!objetivo) return { error: "No se encontró el usuario." };

    await db.usuario.update({ where: { id }, data: { passwordHash: await hashPassword(nueva) } });
    await db.sesion.deleteMany({ where: { usuarioId: id } }); // se cierran sus sesiones abiertas

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "usuario.password",
      entidad: "Usuario",
      entidadId: id,
    });

    revalidatePath("/usuarios");
    return { exito: `Se cambió la contraseña de ${objetivo.nombre}.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo cambiar la contraseña." };
  }
}
