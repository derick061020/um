"use client";

import { useActionState } from "react";

import { cancelarCredito } from "../acciones";
import type { EstadoAccion } from "@/components/FormularioAccion";

export function BotonCancelar({ id }: { id: string }) {
  const [estado, accion] = useActionState<EstadoAccion, FormData>(cancelarCredito, {});

  return (
    <div className="flex flex-col items-end gap-1">
      <form
        action={accion}
        onSubmit={(e) => {
          if (!confirm("¿Cancelar este crédito? Solo se puede si no tiene abonos registrados.")) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button type="submit" className="btn-peligro">
          Cancelar crédito
        </button>
      </form>
      {estado.error ? <p className="max-w-64 text-right text-xs text-riesgo">{estado.error}</p> : null}
    </div>
  );
}
