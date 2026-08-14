import "server-only";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { ipCliente } from "@/lib/auth";

type Registro = {
  usuarioId?: string | null;
  accion: string;
  entidad: string;
  entidadId?: string | null;
  detalle?: unknown;
};

/**
 * Bitácora de movimientos. Nunca debe tumbar la operación:
 * si falla el registro, se anota en consola y la acción continúa.
 */
export async function auditar(r: Registro): Promise<void> {
  try {
    const h = await headers();
    await db.auditoria.create({
      data: {
        usuarioId: r.usuarioId ?? null,
        accion: r.accion,
        entidad: r.entidad,
        entidadId: r.entidadId ?? null,
        detalle: (r.detalle ?? null) as never,
        ip: ipCliente(h),
      },
    });
  } catch (e) {
    console.error("[auditoría] no se pudo registrar:", r.accion, e);
  }
}
