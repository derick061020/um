import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sesionActual } from "@/lib/auth";
import { puede } from "@/lib/rbac";
import { generarTarjeton } from "@/lib/pdf/tarjeton";

/**
 * Tarjetón de un crédito. `?id=` es el crédito; con `?grupo=1` el mismo
 * identificador se interpreta como grupo y se imprime un tarjetón por
 * cada crédito activo, uno por hoja.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const sesion = await sesionActual();
  if (!sesion) return new NextResponse("No autorizado", { status: 401 });
  if (!puede(sesion.usuario.rol, "creditos.tarjeton")) {
    return new NextResponse("Sin permiso", { status: 403 });
  }

  const { id } = await ctx.params;
  const porGrupo = new URL(req.url).searchParams.get("grupo") === "1";

  const creditos = await db.credito.findMany({
    where: porGrupo ? { grupoId: id, estado: { in: ["ACTIVO", "VENCIDO"] } } : { id },
    orderBy: porGrupo ? { cliente: { nombre: "asc" } } : undefined,
    select: {
      folio: true,
      cliente: { select: { nombre: true } },
      abonos: {
        orderBy: { semana: "asc" },
        select: { semana: true, fechaProgramada: true, montoEsperado: true },
      },
    },
  });

  if (creditos.length === 0) {
    return new NextResponse("No se encontró el crédito", { status: 404 });
  }

  const pdf = await generarTarjeton(
    creditos.map((c) => ({
      nombre: c.cliente.nombre,
      abonos: c.abonos.map((a) => ({
        semana: a.semana,
        fecha: a.fechaProgramada,
        montoEsperado: a.montoEsperado,
      })),
    })),
  );

  const nombre = porGrupo
    ? `tarjetones-grupo.pdf`
    : `tarjeton-${String(creditos[0]!.folio).padStart(4, "0")}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${nombre}"`,
      "Cache-Control": "no-store",
    },
  });
}
