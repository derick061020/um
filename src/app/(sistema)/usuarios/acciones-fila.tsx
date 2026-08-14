"use client";

import { useActionState, useState } from "react";

import { cambiarEstadoUsuario, restablecerPassword } from "./acciones";
import type { EstadoAccion } from "@/components/FormularioAccion";

export function AccionesUsuario({
  id,
  nombre,
  activo,
  esYo,
}: {
  id: string;
  nombre: string;
  activo: boolean;
  esYo: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const [estadoAlta, cambiar] = useActionState<EstadoAccion, FormData>(cambiarEstadoUsuario, {});
  const [estadoPass, reset] = useActionState<EstadoAccion, FormData>(restablecerPassword, {});

  const mensaje = estadoAlta.error ?? estadoPass.error ?? estadoAlta.exito ?? estadoPass.exito;
  const esError = Boolean(estadoAlta.error ?? estadoPass.error);

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex justify-end gap-1">
        <button
          type="button"
          className="btn-fantasma px-2.5 py-1.5 text-xs"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
        >
          Contraseña
        </button>
        {!esYo ? (
          <form action={cambiar}>
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className={`${activo ? "btn-peligro" : "btn-secundario"} px-2.5 py-1.5 text-xs`}
            >
              {activo ? "Desactivar" : "Activar"}
            </button>
          </form>
        ) : null}
      </div>

      {abierto ? (
        <form action={reset} className="flex items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <input
            name="password"
            type="password"
            className="campo w-44 px-2.5 py-1.5 text-sm"
            placeholder={`Nueva para ${nombre.split(" ")[0]}`}
            minLength={8}
            required
          />
          <button type="submit" className="btn-secundario px-2.5 py-1.5 text-xs">
            Cambiar
          </button>
        </form>
      ) : null}

      {mensaje ? (
        <p className={`text-xs ${esError ? "text-riesgo" : "text-crecimiento"}`}>{mensaje}</p>
      ) : null}
    </div>
  );
}
