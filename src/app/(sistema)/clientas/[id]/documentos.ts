"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { z } from "zod";

import { db } from "@/lib/db";
import { exigirPermisoAccion } from "@/lib/auth";
import { auditar } from "@/lib/auditoria";
import { borrarArchivo, guardarArchivo } from "@/lib/almacenamiento";
import { ETIQUETA_DOCUMENTO, TIPOS_DOCUMENTO } from "@/lib/documentos";
import type { EstadoAccion } from "@/components/FormularioAccion";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB por captura
const LADO_MAX = 2200; // suficiente para leer una INE, ligero para respaldar

const Entrada = z.object({
  clienteId: z.string().trim().min(1),
  tipo: z.enum(TIPOS_DOCUMENTO),
  descripcion: z.string().trim().max(200).optional(),
});

export async function subirDocumento(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("documentos.subir");

    const datos = Entrada.safeParse({
      clienteId: form.get("clienteId"),
      tipo: form.get("tipo"),
      descripcion: form.get("descripcion") ?? undefined,
    });
    if (!datos.success) return { error: "Selecciona el tipo de documento." };

    const archivo = form.get("archivo");
    if (!(archivo instanceof File) || archivo.size === 0) {
      return { error: "No se recibió ninguna imagen. Toma la foto o elige un archivo." };
    }
    if (archivo.size > MAX_BYTES) {
      return { error: "La imagen pesa más de 10 MB. Vuelve a tomarla con menos resolución." };
    }
    if (!archivo.type.startsWith("image/")) {
      return { error: "Solo se aceptan imágenes (JPG o PNG)." };
    }

    const cliente = await db.cliente.findUnique({ where: { id: datos.data.clienteId } });
    if (!cliente) return { error: "No se encontró la clienta." };

    // Normaliza: respeta la orientación EXIF, limita el tamaño y comprime a JPEG.
    const original = Buffer.from(await archivo.arrayBuffer());
    const imagen = sharp(original).rotate();
    const meta = await imagen.metadata();
    const procesada = await imagen
      .resize({ width: LADO_MAX, height: LADO_MAX, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    const guardado = await guardarArchivo(cliente.id, "jpg", procesada.data);

    const doc = await db.documento.create({
      data: {
        clienteId: cliente.id,
        tipo: datos.data.tipo,
        descripcion: datos.data.descripcion || null,
        archivo: guardado.relativa,
        mime: "image/jpeg",
        bytes: guardado.bytes,
        ancho: procesada.info.width,
        alto: procesada.info.height,
        subidoPorId: sesion.usuario.id,
      },
    });

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "documento.subir",
      entidad: "Documento",
      entidadId: doc.id,
      detalle: { clienteId: cliente.id, tipo: doc.tipo, origen: meta.format ?? "desconocido" },
    });

    revalidatePath(`/clientas/${cliente.id}`);
    return { exito: `Se guardó "${ETIQUETA_DOCUMENTO[datos.data.tipo]}".` };
  } catch (e) {
    console.error("[documentos] error al subir:", e);
    return { error: e instanceof Error ? e.message : "No se pudo guardar el documento." };
  }
}

export async function borrarDocumento(_prev: EstadoAccion, form: FormData): Promise<EstadoAccion> {
  try {
    const sesion = await exigirPermisoAccion("documentos.subir");
    const id = String(form.get("id") ?? "");

    const doc = await db.documento.findUnique({ where: { id } });
    if (!doc) return { error: "No se encontró el documento." };

    await db.documento.delete({ where: { id } });
    await borrarArchivo(doc.archivo);

    await auditar({
      usuarioId: sesion.usuario.id,
      accion: "documento.borrar",
      entidad: "Documento",
      entidadId: id,
      detalle: { clienteId: doc.clienteId, tipo: doc.tipo },
    });

    revalidatePath(`/clientas/${doc.clienteId}`);
    return { exito: "Documento eliminado." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo eliminar el documento." };
  }
}
