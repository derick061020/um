import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { Rol, Usuario } from "@prisma/client";

import { db } from "@/lib/db";
import { puede, rutaInicio, type Permiso } from "@/lib/rbac";

const COOKIE = "um_sesion";
const DIAS_SESION = 30;

function secreto(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "Falta AUTH_SECRET (mínimo 32 caracteres). Genera uno con: openssl rand -base64 48",
    );
  }
  return new TextEncoder().encode(s);
}

export async function hashPassword(plano: string): Promise<string> {
  return bcrypt.hash(plano, 12);
}

export async function verificarPassword(plano: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plano, hash);
}

export type SesionActiva = {
  sesionId: string;
  usuario: Pick<Usuario, "id" | "nombre" | "usuario" | "rol" | "activo">;
};

/** Crea la sesión en base de datos y deja la cookie firmada. */
export async function iniciarSesion(usuarioId: string): Promise<void> {
  const h = await headers();
  const expiraEn = new Date(Date.now() + DIAS_SESION * 86_400_000);

  const sesion = await db.sesion.create({
    data: {
      usuarioId,
      expiraEn,
      agente: h.get("user-agent")?.slice(0, 250) ?? null,
      ip: ipCliente(h),
    },
  });

  const token = await new SignJWT({ sid: sesion.id, uid: usuarioId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiraEn)
    .sign(secreto());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiraEn,
  });
}

export async function cerrarSesion(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secreto());
      await db.sesion.deleteMany({ where: { id: String(payload.sid) } });
    } catch {
      // token inválido o vencido: basta con borrar la cookie
    }
  }
  jar.delete(COOKIE);
}

/** Sesión actual, o null si no hay. No redirige. */
export async function sesionActual(): Promise<SesionActiva | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  let sid: string;
  try {
    const { payload } = await jwtVerify(token, secreto());
    sid = String(payload.sid);
  } catch {
    return null;
  }

  const sesion = await db.sesion.findUnique({
    where: { id: sid },
    select: {
      id: true,
      expiraEn: true,
      usuario: { select: { id: true, nombre: true, usuario: true, rol: true, activo: true } },
    },
  });

  if (!sesion || sesion.expiraEn < new Date() || !sesion.usuario.activo) return null;
  return { sesionId: sesion.id, usuario: sesion.usuario };
}

/** Exige sesión: si no hay, manda al login. */
export async function exigirSesion(): Promise<SesionActiva> {
  const s = await sesionActual();
  if (!s) redirect("/entrar");
  return s;
}

/**
 * Exige sesión y permiso. Si el usuario está autenticado pero no tiene el
 * permiso, lo devuelve a su pantalla de inicio en vez de mostrarle un error.
 */
export async function exigirPermiso(permiso: Permiso): Promise<SesionActiva> {
  const s = await exigirSesion();
  if (!puede(s.usuario.rol, permiso)) redirect(rutaInicio(s.usuario.rol));
  return s;
}

/** Igual que exigirPermiso, pero lanza — para usar dentro de server actions. */
export async function exigirPermisoAccion(permiso: Permiso): Promise<SesionActiva> {
  const s = await sesionActual();
  if (!s) throw new Error("Tu sesión expiró. Vuelve a entrar.");
  if (!puede(s.usuario.rol, permiso)) throw new Error("No tienes permiso para esta acción.");
  return s;
}

export function tieneRol(s: SesionActiva, ...roles: Rol[]): boolean {
  return roles.includes(s.usuario.rol);
}

export function ipCliente(h: Headers): string | null {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim().slice(0, 64);
  return h.get("x-real-ip")?.slice(0, 64) ?? null;
}

/** Limpia sesiones vencidas. Se llama de vez en cuando desde el login. */
export async function limpiarSesionesVencidas(): Promise<void> {
  await db.sesion.deleteMany({ where: { expiraEn: { lt: new Date() } } });
}
