"use client";

import { useActionState } from "react";

import { cambiarEstadoGrupo } from "./acciones";
import type { EstadoAccion } from "@/components/FormularioAccion";

export function BotonArchivar({ id, activo }: { id: string; activo: boolean }) {
  const [estado, accion] = useActionState<EstadoAccion, FormData>(cambiarEstadoGrupo, {});

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={accion}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className="btn-fantasma px-2.5 py-1.5 text-xs">
          {activo ? "Archivar" : "Reactivar"}
        </button>
      </form>
      {estado.error ? <p className="max-w-52 text-right text-xs text-riesgo">{estado.error}</p> : null}
    </div>
  );
}
