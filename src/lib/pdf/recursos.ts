import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, type PDFFont, type PDFImage } from "pdf-lib";

/**
 * Fuentes y logotipo del manual de marca, leídos de /public para que el
 * empaquetado standalone los tenga disponibles en el servidor.
 */
const RAIZ = () => process.cwd();

const cache = new Map<string, Buffer>();

async function leer(...partes: string[]): Promise<Buffer> {
  const ruta = join(RAIZ(), "public", ...partes);
  const enCache = cache.get(ruta);
  if (enCache) return enCache;
  const datos = await readFile(ruta);
  cache.set(ruta, datos);
  return datos;
}

export type RecursosMarca = {
  serif: PDFFont;
  serifTexto: PDFFont;
  sans: PDFFont;
  sansMedia: PDFFont;
  sansNegrita: PDFFont;
  logo: PDFImage;
};

export async function cargarRecursos(doc: PDFDocument): Promise<RecursosMarca> {
  doc.registerFontkit(fontkit);

  const [display, serifTexto, regular, media, negrita, logo] = await Promise.all([
    leer("fonts", "DMSerifDisplay-Regular.ttf"),
    leer("fonts", "DMSerifText-Regular.ttf"),
    leer("fonts", "DMSans-Regular.ttf"),
    leer("fonts", "DMSans-Medium.ttf"),
    leer("fonts", "DMSans-Bold.ttf"),
    leer("brand", "um-principal.png"),
  ]);

  return {
    serif: await doc.embedFont(display, { subset: true }),
    serifTexto: await doc.embedFont(serifTexto, { subset: true }),
    sans: await doc.embedFont(regular, { subset: true }),
    sansMedia: await doc.embedFont(media, { subset: true }),
    sansNegrita: await doc.embedFont(negrita, { subset: true }),
    logo: await doc.embedPng(logo),
  };
}

export async function nuevoDocumento(titulo: string): Promise<PDFDocument> {
  const doc = await PDFDocument.create();
  doc.setTitle(titulo);
  doc.setAuthor("Mujeres Unidas");
  doc.setCreator("Sistema de control de crédito · Mujeres Unidas");
  doc.setProducer("Mujeres Unidas");
  return doc;
}
