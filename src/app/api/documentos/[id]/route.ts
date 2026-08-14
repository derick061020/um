import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sesionActual } from "@/lib/auth";
import { puede } from "@/lib/rbac";
import { leerArchivo } from "@/lib/almacenamiento";

/**
 * Sirve un escaneo del expediente. Los archivos no viven en /public:
 * siempre pasan por esta ruta para que exijan sesión y permiso.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const sesion = await sesionActual();
  if (!sesion) return new NextResponse("No autorizado", { status: 401 });
  if (!puede(sesion.usuario.rol, "documentos.ver")) {
    return new NextResponse("Sin permiso", { status: 403 });
  }

  const { id } = await ctx.params;
  const doc = await db.documento.findUnique({
    where: { id },
    select: { archivo: true, mime: true, tipo: true, clienteId: true },
  });
  if (!doc) return new NextResponse("No encontrado", { status: 404 });

  try {
    const contenido = await leerArchivo(doc.archivo);
    return new NextResponse(new Uint8Array(contenido), {
      headers: {
        "Content-Type": doc.mime,
        "Content-Length": String(contenido.byteLength),
        "Content-Disposition": `inline; filename="${doc.tipo.toLowerCase()}.jpg"`,
        // Privado: el navegador puede cachearlo, ningún proxy compartido.
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (e) {
    console.error("[documentos] no se pudo leer el archivo:", doc.archivo, e);
    return new NextResponse("El archivo no está disponible", { status: 410 });
  }
}
