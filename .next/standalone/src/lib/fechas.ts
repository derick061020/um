/**
 * Utilidades de fecha para el calendario de cobranza.
 *
 * Regla de negocio (Mujeres Unidas):
 *   se captura el LUNES de entrega del crédito y el sistema genera
 *   automáticamente los 12 sábados de abono. El crédito vence el sábado 12.
 *
 * Todas las fechas "de calendario" se manejan a mediodía UTC para que el
 * cambio de horario o la zona del servidor nunca corra un día.
 */

export const DIA = { DOMINGO: 0, LUNES: 1, MARTES: 2, MIERCOLES: 3, JUEVES: 4, VIERNES: 5, SABADO: 6 } as const;

const MS_DIA = 86_400_000;

/** Convierte "2026-08-17" en un Date a las 00:00 UTC. */
export function parseFecha(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) throw new Error(`Fecha inválida: "${iso}". Se espera AAAA-MM-DD.`);
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (Number.isNaN(d.getTime())) throw new Error(`Fecha inválida: "${iso}".`);
  return d;
}

/** Devuelve "2026-08-17" a partir de un Date. */
export function fechaISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function sumarDias(d: Date, dias: number): Date {
  return new Date(d.getTime() + dias * MS_DIA);
}

export function diaSemana(d: Date): number {
  return d.getUTCDay();
}

export function esLunes(d: Date): boolean {
  return diaSemana(d) === DIA.LUNES;
}

export function esSabado(d: Date): boolean {
  return diaSemana(d) === DIA.SABADO;
}

/** Hoy, normalizado a fecha de calendario (00:00 UTC). */
export function hoy(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
}

/**
 * Primer sábado de cobro a partir de la fecha de entrega.
 * Si se entrega en lunes, el primer abono cae 5 días después (mismo semana).
 * Si por excepción se entrega otro día, se toma el siguiente sábado.
 */
export function primerSabado(entrega: Date): Date {
  const dow = diaSemana(entrega);
  const faltan = (DIA.SABADO - dow + 7) % 7;
  return sumarDias(entrega, faltan === 0 ? 7 : faltan);
}

/**
 * Sábado de cobro vigente: hoy mismo si hoy es sábado, o el siguiente.
 * Es el día que abren por defecto la cobranza y el corte del día.
 */
export function sabadoDeCobro(referencia: Date = hoy()): Date {
  return sumarDias(referencia, (DIA.SABADO - diaSemana(referencia) + 7) % 7);
}

export type FilaCalendario = {
  semana: number;
  fecha: Date;
  iso: string;
};

/**
 * Genera el calendario completo de abonos.
 * @param entrega  lunes de entrega
 * @param semanas  normalmente 12
 */
export function generarCalendario(entrega: Date, semanas = 12): FilaCalendario[] {
  if (semanas < 1 || semanas > 104) throw new Error("El número de semanas debe estar entre 1 y 104.");
  const inicio = primerSabado(entrega);
  const filas: FilaCalendario[] = [];
  for (let i = 0; i < semanas; i++) {
    const fecha = sumarDias(inicio, i * 7);
    filas.push({ semana: i + 1, fecha, iso: fechaISO(fecha) });
  }
  return filas;
}

/** Sábado de vencimiento (última semana). */
export function fechaVencimiento(entrega: Date, semanas = 12): Date {
  const cal = generarCalendario(entrega, semanas);
  return cal[cal.length - 1].fecha;
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** "sábado 22 de agosto de 2026" */
export function fechaLarga(d: Date): string {
  return `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

/** "22/08/26" — formato del tarjetón impreso */
export function fechaCorta(d: Date): string {
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(2);
  return `${dd}/${mm}/${yy}`;
}

/** "22 AGO" — encabezado de columna del tarjetón */
export function fechaColumna(d: Date): string {
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${dd} ${MESES[d.getUTCMonth()].slice(0, 3).toUpperCase()}`;
}

export function diasEntre(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_DIA);
}
