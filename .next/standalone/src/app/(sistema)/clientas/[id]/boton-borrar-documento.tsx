"use client";

import { useActionState } from "react";

import { borrarDocumento } from "./documentos";
import type { EstadoAccion } from "@/components/FormularioAccion";

export function BotonBorrarDocumento({ id }: { id: string }) {
  const [estado, accion] = useActionState<EstadoAccion, FormData>(borrarDocumento, {});

  return (
    <form
      action={accion}
      onSubmit={(e) => {
        if (!confirm("¿Eliminar este documento del expediente?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="shrink-0 rounded px-1.5 py-1 text-[11px] font-semibold text-riesgo hover:bg-riesgo/10"
        title={estado.error ?? "Eliminar documento"}
      >
        Borrar
      </button>
    </form>
  );
}
