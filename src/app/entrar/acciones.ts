"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/lib/db";
import { iniciarSesion, limpiarSesionesVencidas, verificarPassword } from "@/lib/auth";
import { auditar } from "@/lib/auditoria";
import { rutaInicio } from "@/lib/rbac";

const Entrada = z.object({
  usuario: z.string().trim().min(1, "Escribe tu usuario.").max(60),
  password: z.string().min(1, "Escribe tu contraseña.").max(200),
});

export type EstadoLogin = { error?: string };

export async function entrar(_prev: EstadoLogin, form: FormData): Promise<EstadoLogin> {
  const datos = Entrada.safeParse({
    usuario: form.get("usuario"),
    password: form.get("password"),
  });
  if (!datos.success) {
    return { error: datos.error.issues[0]!.message };
  }

  const { usuario, password } = datos.data;
  const cuenta = await db.usuario.findUnique({
    where: { usuario: usuario.toLowerCase() },
  });

  // Mensaje idéntico en ambos casos para no revelar qué usuarios existen.
  const generico = "Usuario o contraseña incorrectos.";
  if (!cuenta) {
    // Comparación falsa para que el tiempo de respuesta no delate la cuenta.
    await verificarPassword(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv");
    return { error: generico };
  }
  if (!(await verificarPassword(password, cuenta.passwordHash))) {
    await auditar({ usuarioId: cuenta.id, accion: "sesion.fallida", entidad: "Usuario", entidadId: cuenta.id });
    return { error: generico };
  }
  if (!cuenta.activo) {
    return { error: "Tu cuenta está desactivada. Habla con la dirección." };
  }

  await limpiarSesionesVencidas();
  await iniciarSesion(cuenta.id);
  await auditar({ usuarioId: cuenta.id, accion: "sesion.iniciar", entidad: "Usuario", entidadId: cuenta.id });

  redirect(rutaInicio(cuenta.rol));
}
