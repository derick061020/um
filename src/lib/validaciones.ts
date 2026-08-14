import { z } from "zod";

const texto = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres.`)
    .transform((v) => (v === "" ? null : v))
    .nullable();

export const NombrePersona = z
  .string()
  .trim()
  .min(3, "El nombre debe tener al menos 3 letras.")
  .max(120, "El nombre es demasiado largo.");

export const Telefono = z
  .string()
  .trim()
  .transform((v) => v.replace(/[^\d]/g, ""))
  .refine((v) => v === "" || v.length === 10, "El teléfono debe tener 10 dígitos.")
  .transform((v) => (v === "" ? null : v))
  .nullable();

export const Importe = z
  .string()
  .trim()
  .transform((v) => v.replace(/[$,\s]/g, ""))
  .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), "Escribe un importe válido, por ejemplo 3000 o 3000.50")
  .transform((v) => Math.round(Number(v) * 100))
  .refine((c) => c > 0, "El importe debe ser mayor a cero.");

export const FechaISO = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha válida.");

export const NuevoUsuario = z.object({
  nombre: NombrePersona,
  usuario: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "El usuario debe tener al menos 3 caracteres.")
    .max(40)
    .regex(/^[a-z0-9._-]+$/, "Solo letras, números, punto, guion y guion bajo."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(200),
  rol: z.enum(["PRINCIPAL", "SUPERVISOR", "CAPTURISTA", "ENCARGADA"]),
  telefono: Telefono,
});

export const NuevoGrupo = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Escribe el nombre del grupo.")
    .max(60)
    .transform((v) => v.toUpperCase()),
  plaza: texto(80),
  supervisorId: texto(40),
  encargadaId: texto(40),
  notas: texto(500),
});

export const NuevaClienta = z.object({
  nombre: NombrePersona,
  telefono: Telefono,
  domicilio: texto(200),
  colonia: texto(120),
  ciudad: texto(120),
  curp: z
    .string()
    .trim()
    .toUpperCase()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine(
      (v) => v === null || /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(v),
      "La CURP no tiene el formato correcto (18 caracteres).",
    ),
  grupoId: texto(40),
  notas: texto(500),

  avalNombre: texto(120),
  avalTelefono: Telefono,
  avalParentesco: texto(60),
  avalDomicilio: texto(200),
  avalColonia: texto(120),
  avalCiudad: texto(120),
});

export const NuevoCredito = z
  .object({
    clienteId: z.string().trim().min(1, "Selecciona la clienta."),
    grupoId: texto(40),
    montoPrestado: Importe,
    montoTotal: Importe,
    numSemanas: z.coerce.number().int().min(1, "Mínimo 1 semana.").max(52, "Máximo 52 semanas."),
    fechaEntrega: FechaISO,
    notas: texto(500),
  })
  .refine((d) => d.montoTotal >= d.montoPrestado, {
    message: "El total a pagar no puede ser menor al monto prestado.",
    path: ["montoTotal"],
  });

export const RegistroPago = z.object({
  abonoId: z.string().trim().min(1),
  monto: Importe,
  fecha: FechaISO.optional(),
  nota: texto(200),
});

/** Toma el primer mensaje de error de un ZodError, listo para mostrar. */
export function primerError(e: z.ZodError): string {
  return e.issues[0]?.message ?? "Revisa los datos capturados.";
}

/** Convierte un FormData en objeto plano (los campos vacíos quedan como ""). */
export function objetoDeFormulario(form: FormData): Record<string, string> {
  const o: Record<string, string> = {};
  for (const [k, v] of form.entries()) {
    if (typeof v === "string") o[k] = v;
  }
  return o;
}
