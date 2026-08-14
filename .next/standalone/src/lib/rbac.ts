import type { Rol } from "@prisma/client";

/**
 * Matriz de permisos. Un permiso es una capacidad concreta del sistema;
 * las pantallas y las server actions preguntan siempre por el permiso,
 * nunca por el rol, para que agregar un rol nuevo no obligue a tocar la app.
 */
export const PERMISOS = [
  "usuarios.ver",
  "usuarios.crear",
  "usuarios.editar",

  "grupos.ver",
  "grupos.crear",
  "grupos.editar",

  "clientas.ver",
  "clientas.crear",
  "clientas.editar",
  "clientas.historial",

  "creditos.ver",
  "creditos.crear",
  "creditos.editar",
  "creditos.tarjeton",

  "cobranza.ver",
  "cobranza.marcar",
  "cobranza.anular",

  "documentos.ver",
  "documentos.subir",

  "corte.dia", // total a cobrar del día
  "reportes.ver",
  "auditoria.ver",
] as const;

export type Permiso = (typeof PERMISOS)[number];

const MATRIZ: Record<Rol, Permiso[]> = {
  // Dirección: hace todo, y es la única que da de alta usuarios.
  PRINCIPAL: [...PERMISOS],

  // Supervisor: arma y administra los grupos (VIRI 1, CHIHUAHUA 1...) y su cartera.
  SUPERVISOR: [
    "grupos.ver", "grupos.crear", "grupos.editar",
    "clientas.ver", "clientas.crear", "clientas.editar", "clientas.historial",
    "creditos.ver", "creditos.crear", "creditos.editar", "creditos.tarjeton",
    "cobranza.ver", "cobranza.marcar", "cobranza.anular",
    "documentos.ver", "documentos.subir",
    "corte.dia", "reportes.ver",
    "usuarios.ver",
  ],

  // Capturista: alta de clienta y aval, consulta de historial y marcado de abonos del sábado.
  CAPTURISTA: [
    "grupos.ver",
    "clientas.ver", "clientas.crear", "clientas.editar", "clientas.historial",
    "creditos.ver", "creditos.crear", "creditos.tarjeton",
    "cobranza.ver", "cobranza.marcar",
    "documentos.ver", "documentos.subir",
  ],

  // Encargada: únicamente el total a cobrar del día.
  ENCARGADA: ["corte.dia"],
};

export function permisosDe(rol: Rol): readonly Permiso[] {
  return MATRIZ[rol];
}

export function puede(rol: Rol, permiso: Permiso): boolean {
  return MATRIZ[rol].includes(permiso);
}

export function puedeAlguno(rol: Rol, permisos: Permiso[]): boolean {
  return permisos.some((p) => puede(rol, p));
}

export const ETIQUETA_ROL: Record<Rol, string> = {
  PRINCIPAL: "Principal",
  SUPERVISOR: "Supervisor",
  CAPTURISTA: "Capturista",
  ENCARGADA: "Encargada",
};

export const DESCRIPCION_ROL: Record<Rol, string> = {
  PRINCIPAL: "Dirección. Crea usuarios y ve toda la operación.",
  SUPERVISOR: "Crea y administra grupos, clientas, créditos y cobranza.",
  CAPTURISTA: "Da de alta clientas y avales, consulta historial y marca los abonos del sábado.",
  ENCARGADA: "Solo consulta el total a cobrar del día.",
};

/** Pantalla de inicio según el rol. */
export function rutaInicio(rol: Rol): string {
  if (rol === "ENCARGADA") return "/corte";
  if (rol === "CAPTURISTA") return "/cobranza";
  return "/panel";
}
