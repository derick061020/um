import "server-only";

import { degrees, rgb, type PDFPage } from "pdf-lib";

import { cargarRecursos, nuevoDocumento, type RecursosMarca } from "@/lib/pdf/recursos";
import { fechaColumna } from "@/lib/fechas";
import { pesosCompacto } from "@/lib/dinero";

// Paleta institucional (manual de identidad visual).
const PATRIMONIO = rgb(0x16 / 255, 0x40 / 255, 0x2e / 255);
const CRECIMIENTO = rgb(0x2f / 255, 0x6b / 255, 0x50 / 255);
const NIEBLA = rgb(0xe8 / 255, 0xec / 255, 0xea / 255);
const SALVIA = rgb(0xaf / 255, 0xc7 / 255, 0xb9 / 255);
const TINTA = rgb(0x25 / 255, 0x2a / 255, 0x27 / 255);

// Carta horizontal: la tarjeta ocupa la hoja completa para que las 12
// columnas queden lo bastante anchas como para escribir a mano.
const ANCHO = 792;
const ALTO = 612;
const MARGEN = 38;

export type DatosTarjeton = {
  nombre: string;
  abonos: { semana: number; fecha: Date; montoEsperado: number }[];
};

/**
 * Tarjetón de control "limpio": únicamente el nombre de la clienta y las
 * 12 columnas de abono con el importe escrito en vertical.
 * Sin domicilios y sin el total del crédito impreso arriba.
 */
export async function generarTarjeton(tarjetas: DatosTarjeton[]): Promise<Uint8Array> {
  const doc = await nuevoDocumento("Tarjetón de control · Mujeres Unidas");
  const recursos = await cargarRecursos(doc);

  for (const tarjeta of tarjetas) {
    const pagina = doc.addPage([ANCHO, ALTO]);
    dibujarTarjeton(pagina, recursos, tarjeta);
  }

  return doc.save();
}

function dibujarTarjeton(pagina: PDFPage, r: RecursosMarca, datos: DatosTarjeton): void {
  const anchoUtil = ANCHO - MARGEN * 2;

  // --- Marco exterior de la tarjeta -----------------------------------------
  pagina.drawRectangle({
    x: MARGEN - 10,
    y: MARGEN - 10,
    width: anchoUtil + 20,
    height: ALTO - (MARGEN - 10) * 2,
    borderColor: SALVIA,
    borderWidth: 1,
  });

  // --- Encabezado: logotipo y nombre de la clienta ---------------------------
  const altoLogo = 40;
  const escala = altoLogo / r.logo.height;
  pagina.drawImage(r.logo, {
    x: MARGEN,
    y: ALTO - MARGEN - altoLogo,
    width: r.logo.width * escala,
    height: altoLogo,
  });

  pagina.drawText("TARJETA DE CONTROL", {
    x: ANCHO - MARGEN - r.sansMedia.widthOfTextAtSize("TARJETA DE CONTROL", 9),
    y: ALTO - MARGEN - 22,
    size: 9,
    font: r.sansMedia,
    color: PATRIMONIO,
    opacity: 0.55,
  });

  const yNombre = ALTO - MARGEN - altoLogo - 46;

  pagina.drawText("NOMBRE", {
    x: MARGEN,
    y: yNombre + 26,
    size: 8.5,
    font: r.sansMedia,
    color: PATRIMONIO,
    opacity: 0.6,
  });

  const nombre = datos.nombre.toUpperCase();
  const tamNombre = ajustarTamano(nombre, r.serif.widthOfTextAtSize.bind(r.serif), anchoUtil, 26, 14);
  pagina.drawText(nombre, {
    x: MARGEN,
    y: yNombre,
    size: tamNombre,
    font: r.serif,
    color: PATRIMONIO,
  });

  pagina.drawLine({
    start: { x: MARGEN, y: yNombre - 10 },
    end: { x: ANCHO - MARGEN, y: yNombre - 10 },
    thickness: 1,
    color: PATRIMONIO,
    opacity: 0.35,
  });

  // --- Rejilla de 12 columnas ------------------------------------------------
  const columnas = datos.abonos.length;
  const rejillaArriba = yNombre - 34;
  const rejillaAbajo = MARGEN + 26;
  const altoRejilla = rejillaArriba - rejillaAbajo;
  const altoCabecera = 34;
  const anchoColumna = anchoUtil / columnas;
  const cuerpoArriba = rejillaArriba - altoCabecera;
  const altoCuerpo = cuerpoArriba - rejillaAbajo;

  // Banda de cabecera
  pagina.drawRectangle({
    x: MARGEN,
    y: cuerpoArriba,
    width: anchoUtil,
    height: altoCabecera,
    color: NIEBLA,
  });

  // Borde exterior de la rejilla
  pagina.drawRectangle({
    x: MARGEN,
    y: rejillaAbajo,
    width: anchoUtil,
    height: altoRejilla,
    borderColor: PATRIMONIO,
    borderWidth: 1,
    opacity: 0,
    borderOpacity: 0.6,
  });

  // Separador cabecera / cuerpo
  pagina.drawLine({
    start: { x: MARGEN, y: cuerpoArriba },
    end: { x: ANCHO - MARGEN, y: cuerpoArriba },
    thickness: 1,
    color: PATRIMONIO,
    opacity: 0.6,
  });

  datos.abonos.forEach((abono, i) => {
    const x = MARGEN + anchoColumna * i;
    const centro = x + anchoColumna / 2;

    // Línea divisoria entre columnas
    if (i > 0) {
      pagina.drawLine({
        start: { x, y: rejillaAbajo },
        end: { x, y: rejillaArriba },
        thickness: 0.75,
        color: PATRIMONIO,
        opacity: 0.28,
      });
    }

    // Cabecera: número de semana y sábado que le toca
    const semana = String(abono.semana).padStart(2, "0");
    pagina.drawText(semana, {
      x: centro - r.sansNegrita.widthOfTextAtSize(semana, 11) / 2,
      y: cuerpoArriba + altoCabecera - 15,
      size: 11,
      font: r.sansNegrita,
      color: PATRIMONIO,
    });

    const fecha = fechaColumna(abono.fecha);
    pagina.drawText(fecha, {
      x: centro - r.sans.widthOfTextAtSize(fecha, 7.5) / 2,
      y: cuerpoArriba + 8,
      size: 7.5,
      font: r.sans,
      color: TINTA,
      opacity: 0.6,
    });

    // Cuerpo: el abono impreso en vertical, de abajo hacia arriba.
    const importe = pesosCompacto(abono.montoEsperado);
    const tam = ajustarTamano(
      importe,
      r.serifTexto.widthOfTextAtSize.bind(r.serifTexto),
      altoCuerpo - 40,
      30,
      13,
    );
    const anchoTexto = r.serifTexto.widthOfTextAtSize(importe, tam);

    pagina.drawText(importe, {
      x: centro + tam * 0.34,
      y: rejillaAbajo + (altoCuerpo - anchoTexto) / 2,
      size: tam,
      font: r.serifTexto,
      color: CRECIMIENTO,
      rotate: degrees(90),
    });
  });

  // Pie discreto: sin importes ni domicilios, solo la firma institucional.
  pagina.drawText("MUJERES UNIDAS", {
    x: MARGEN,
    y: MARGEN - 2,
    size: 7,
    font: r.sansMedia,
    color: PATRIMONIO,
    opacity: 0.35,
  });
}

/** Reduce el tamaño de letra hasta que el texto quepa en el ancho dado. */
function ajustarTamano(
  texto: string,
  medir: (t: string, tam: number) => number,
  disponible: number,
  maximo: number,
  minimo: number,
): number {
  let tam = maximo;
  while (tam > minimo && medir(texto, tam) > disponible) tam -= 0.5;
  return tam;
}
