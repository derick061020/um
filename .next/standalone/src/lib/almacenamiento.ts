import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join, normalize, resolve, sep } from "node:path";

/**
 * Los escaneos se guardan en disco (fuera del código) y solo se sirven a
 * través de una ruta autenticada. En base de datos únicamente vive la ruta
 * relativa, para que mover la carpeta no rompa el expediente.
 */
export function carpetaBase(): string {
  return resolve(/* turbopackIgnore: true */ process.env.STORAGE_DIR ?? "./storage/archivos");
}

/** Resuelve una ruta relativa impidiendo salir de la carpeta base. */
export function rutaAbsoluta(relativa: string): string {
  const base = carpetaBase();
  const destino = resolve(base, normalize(relativa).replace(/^(\.\.(\/|\\|$))+/, ""));
  if (destino !== base && !destino.startsWith(base + sep)) {
    throw new Error("Ruta de archivo no permitida.");
  }
  return destino;
}

export type ArchivoGuardado = {
  relativa: string;
  bytes: number;
  sha256: string;
};

export async function guardarArchivo(
  clienteId: string,
  extension: string,
  contenido: Buffer,
): Promise<ArchivoGuardado> {
  const ext = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  const relativa = join(clienteId, `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`);
  const destino = rutaAbsoluta(relativa);

  await mkdir(dirname(destino), { recursive: true });
  await writeFile(destino, contenido);

  return {
    relativa,
    bytes: contenido.byteLength,
    sha256: createHash("sha256").update(contenido).digest("hex"),
  };
}

export async function leerArchivo(relativa: string): Promise<Buffer> {
  return readFile(rutaAbsoluta(relativa));
}

export async function borrarArchivo(relativa: string): Promise<void> {
  try {
    await unlink(rutaAbsoluta(relativa));
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") throw e;
  }
}
