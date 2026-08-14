import type { TipoDocumento } from "@prisma/client";

/** Orden en que se pide el expediente en ventanilla. */
export const TIPOS_DOCUMENTO = [
  "INE_FRENTE",
  "INE_REVERSO",
  "COMPROBANTE_DOMICILIO",
  "INE_AVAL_FRENTE",
  "INE_AVAL_REVERSO",
  "COMPROBANTE_AVAL",
  "PAGARE",
  "CONTRATO",
  "OTRO",
] as const satisfies readonly TipoDocumento[];

export const ETIQUETA_DOCUMENTO: Record<TipoDocumento, string> = {
  INE_FRENTE: "INE — frente",
  INE_REVERSO: "INE — reverso",
  COMPROBANTE_DOMICILIO: "Comprobante de domicilio",
  INE_AVAL_FRENTE: "INE del aval — frente",
  INE_AVAL_REVERSO: "INE del aval — reverso",
  COMPROBANTE_AVAL: "Comprobante del aval",
  PAGARE: "Pagaré",
  CONTRATO: "Contrato",
  OTRO: "Otro documento",
};

/** Documentos mínimos para considerar completo el expediente. */
export const DOCUMENTOS_OBLIGATORIOS = [
  "INE_FRENTE",
  "INE_REVERSO",
  "COMPROBANTE_DOMICILIO",
] as const satisfies readonly TipoDocumento[];

export function opcionesDocumento() {
  return TIPOS_DOCUMENTO.map((t) => ({ valor: t, texto: ETIQUETA_DOCUMENTO[t] }));
}

export function pesoLegible(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
