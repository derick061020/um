/**
 * Los importes viven en CENTAVOS (enteros) en toda la aplicación.
 * Se convierten a pesos únicamente al mostrar o al leer un formulario.
 */

export function aCentavos(valor: string | number): number {
  if (typeof valor === "number") {
    if (!Number.isFinite(valor)) throw new Error("Importe inválido.");
    return Math.round(valor * 100);
  }
  const limpio = valor.replace(/[$,\s]/g, "").trim();
  if (limpio === "") throw new Error("Importe vacío.");
  if (!/^-?\d+(\.\d{1,2})?$/.test(limpio)) throw new Error(`Importe inválido: "${valor}".`);
  return Math.round(Number(limpio) * 100);
}

export function aPesos(centavos: number): number {
  return centavos / 100;
}

const NF = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

/** "$1,000.00" */
export function pesos(centavos: number): string {
  return NF.format(centavos / 100);
}

/** "1,000" — sin símbolo ni decimales cuando son cerrados (para el tarjetón) */
export function pesosCompacto(centavos: number): string {
  const v = centavos / 100;
  return Number.isInteger(v)
    ? new Intl.NumberFormat("es-MX").format(v)
    : new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2 }).format(v);
}

/**
 * Reparte el total en `n` abonos iguales; el redondeo sobrante se carga
 * al último abono para que la suma cuadre exactamente con el total.
 */
export function repartirAbonos(totalCentavos: number, n: number): number[] {
  if (n < 1) throw new Error("Número de abonos inválido.");
  const base = Math.floor(totalCentavos / n);
  const abonos = Array<number>(n).fill(base);
  abonos[n - 1] += totalCentavos - base * n;
  return abonos;
}
