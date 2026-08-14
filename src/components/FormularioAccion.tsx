"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Aviso } from "@/components/ui";

export type EstadoAccion = { error?: string; exito?: string };

function Boton({ texto, variante }: { texto: string; variante: "primario" | "secundario" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={variante === "primario" ? "btn-primario" : "btn-secundario"}
      disabled={pending}
    >
      {pending ? "Guardando…" : texto}
    </button>
  );
}

/**
 * Envoltura de formulario para server actions: muestra el error o el aviso de
 * éxito, deshabilita el botón mientras guarda y limpia los campos al terminar.
 */
export function FormularioAccion({
  accion,
  children,
  textoBoton = "Guardar",
  variante = "primario",
  limpiarAlExito = true,
  pie,
  className = "",
}: {
  accion: (estado: EstadoAccion, form: FormData) => Promise<EstadoAccion>;
  children: ReactNode;
  textoBoton?: string;
  variante?: "primario" | "secundario";
  limpiarAlExito?: boolean;
  pie?: ReactNode;
  className?: string;
}) {
  const [estado, despachar] = useActionState<EstadoAccion, FormData>(accion, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado.exito && limpiarAlExito) ref.current?.reset();
  }, [estado.exito, limpiarAlExito]);

  return (
    <form ref={ref} action={despachar} className={className}>
      {estado.error ? (
        <div className="mb-4">
          <Aviso tono="error">{estado.error}</Aviso>
        </div>
      ) : null}
      {estado.exito ? (
        <div className="mb-4">
          <Aviso tono="exito">{estado.exito}</Aviso>
        </div>
      ) : null}

      {children}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Boton texto={textoBoton} variante={variante} />
        {pie}
      </div>
    </form>
  );
}
