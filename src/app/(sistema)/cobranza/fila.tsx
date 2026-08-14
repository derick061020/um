"use client";

import { useActionState, useState } from "react";

import { marcarAbono, abonoParcial, anularAbono } from "./acciones";
import type { EstadoAccion } from "@/components/FormularioAccion";
import { Insignia } from "@/components/ui";

type Props = {
  abonoId: string;
  /** Lo que falta por cubrir, ya formateado en pesos. */
  falta: string;
  estado: "PENDIENTE" | "PARCIAL" | "PAGADO";
  puedeAnular: boolean;
};

const TONO = { PAGADO: "verde", PARCIAL: "oro", PENDIENTE: "neutro" } as const;
const TEXTO = { PAGADO: "Pagado", PARCIAL: "Parcial", PENDIENTE: "Pendiente" } as const;

/** Controles de captura de un abono: pagó completo, parcial o anular. */
export function AccionesAbono({ abonoId, falta, estado, puedeAnular }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [estMarcar, marcar] = useActionState<EstadoAccion, FormData>(marcarAbono, {});
  const [estParcial, parcial] = useActionState<EstadoAccion, FormData>(abonoParcial, {});
  const [estAnular, anular] = useActionState<EstadoAccion, FormData>(anularAbono, {});

  const error = estMarcar.error ?? estParcial.error ?? estAnular.error;
  const cubierto = estado === "PAGADO";

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <Insignia tono={TONO[estado]}>{TEXTO[estado]}</Insignia>

        {!cubierto ? (
          <>
            <form action={marcar}>
              <input type="hidden" name="abonoId" value={abonoId} />
              <button type="submit" className="btn-primario px-3 py-2 text-xs">
                Pagó {falta}
              </button>
            </form>
            <button
              type="button"
              className="btn-fantasma px-2.5 py-2 text-xs"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
            >
              Parcial
            </button>
          </>
        ) : null}

        {puedeAnular && estado !== "PENDIENTE" ? (
          <form
            action={anular}
            onSubmit={(e) => {
              if (!confirm("¿Anular el último movimiento de este abono?")) e.preventDefault();
            }}
          >
            <input type="hidden" name="abonoId" value={abonoId} />
            <button type="submit" className="btn-fantasma px-2.5 py-2 text-xs text-riesgo">
              Anular
            </button>
          </form>
        ) : null}
      </div>

      {abierto && !cubierto ? (
        <form action={parcial} className="flex items-center gap-2">
          <input type="hidden" name="abonoId" value={abonoId} />
          <input
            name="monto"
            inputMode="decimal"
            className="campo w-28 px-2.5 py-2 text-sm"
            placeholder="Monto"
            required
            aria-label="Monto del abono parcial"
          />
          <button type="submit" className="btn-secundario px-3 py-2 text-xs">
            Registrar
          </button>
        </form>
      ) : null}

      {error ? <p className="max-w-64 text-right text-xs text-riesgo">{error}</p> : null}
    </div>
  );
}
