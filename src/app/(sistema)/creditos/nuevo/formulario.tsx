"use client";

import { useMemo, useState } from "react";

import { registrarCredito } from "../acciones";
import { FormularioAccion } from "@/components/FormularioAccion";
import { Campo, Selector, AreaTexto, Rejilla, Seccion } from "@/components/campos";
import { Aviso } from "@/components/ui";
import { generarCalendario, parseFecha, esLunes, fechaLarga, fechaCorta } from "@/lib/fechas";
import { aCentavos, pesos, repartirAbonos } from "@/lib/dinero";

type Opcion = { valor: string; texto: string };

/**
 * Alta de crédito. La captura es solo el LUNES de entrega: el calendario de
 * los 12 sábados se arma solo y se ve antes de guardar, para que la capturista
 * confirme la fecha de vencimiento con la clienta enfrente.
 */
export function FormularioCredito({
  clientas,
  grupos,
  clientaInicial,
  semanasPorDefecto,
}: {
  clientas: Opcion[];
  grupos: Opcion[];
  clientaInicial?: string;
  semanasPorDefecto: number;
}) {
  const [entrega, setEntrega] = useState("");
  const [semanas, setSemanas] = useState(semanasPorDefecto);
  const [total, setTotal] = useState("");

  const calendario = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entrega)) return null;
    try {
      const d = parseFecha(entrega);
      return { lunes: d, filas: generarCalendario(d, semanas), esLunes: esLunes(d) };
    } catch {
      return null;
    }
  }, [entrega, semanas]);

  const montos = useMemo(() => {
    try {
      const centavos = aCentavos(total);
      if (centavos <= 0) return null;
      return repartirAbonos(centavos, semanas);
    } catch {
      return null;
    }
  }, [total, semanas]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="tarjeta">
        <div className="p-6">
          <FormularioAccion accion={registrarCredito} textoBoton="Registrar crédito" limpiarAlExito={false}>
            <Seccion titulo="Clienta">
              <div className="space-y-4">
                <Selector
                  etiqueta="Clienta"
                  nombre="clienteId"
                  requerido
                  opciones={clientas}
                  valor={clientaInicial}
                  vacio="— Selecciona la clienta —"
                />
                <Selector
                  etiqueta="Grupo"
                  nombre="grupoId"
                  opciones={grupos}
                  vacio="— El grupo de la clienta —"
                  ayuda="Déjalo vacío para usar el grupo que ya tiene asignado."
                />
              </div>
            </Seccion>

            <Seccion titulo="Importes">
              <Rejilla cols={3}>
                <Campo
                  etiqueta="Monto prestado"
                  nombre="montoPrestado"
                  requerido
                  inputMode="decimal"
                  placeholder="3000"
                />
                <Campo
                  etiqueta="Total a pagar"
                  nombre="montoTotal"
                  requerido
                  inputMode="decimal"
                  placeholder="3600"
                  ayuda="Capital más interés."
                  alCambiar={setTotal}
                />
                <Campo
                  etiqueta="Semanas"
                  nombre="numSemanas"
                  requerido
                  tipo="number"
                  inputMode="numeric"
                  valor={semanasPorDefecto}
                  alCambiar={(v) => setSemanas(Number(v) || 0)}
                />
              </Rejilla>

              {montos ? (
                <p className="mt-3 rounded-lg bg-marfil px-4 py-3 text-sm text-patrimonio">
                  Abono semanal: <strong className="font-semibold">{pesos(montos[0]!)}</strong>
                  {montos[montos.length - 1] !== montos[0] ? (
                    <span className="text-tinta/60">
                      {" "}
                      (el último abono queda en {pesos(montos[montos.length - 1]!)} para cuadrar el total)
                    </span>
                  ) : null}
                </p>
              ) : null}
            </Seccion>

            <Seccion titulo="Fechas">
              <Campo
                etiqueta="Fecha de entrega (lunes)"
                nombre="fechaEntrega"
                tipo="date"
                requerido
                ayuda="Captura el lunes de entrega; el sistema arma solo los sábados de abono."
                alCambiar={setEntrega}
              />

              {calendario && !calendario.esLunes ? (
                <div className="mt-3">
                  <Aviso tono="info">
                    La fecha que elegiste es {fechaLarga(calendario.lunes)}, no un lunes. El primer abono se
                    programará el sábado siguiente.
                  </Aviso>
                </div>
              ) : null}
            </Seccion>

            <Seccion titulo="Observaciones">
              <AreaTexto etiqueta="Notas" nombre="notas" />
            </Seccion>
          </FormularioAccion>
        </div>
      </div>

      <aside className="tarjeta h-fit lg:sticky lg:top-32">
        <header className="border-b border-niebla px-5 py-3.5">
          <h2 className="font-serif text-lg text-patrimonio">Calendario de abonos</h2>
        </header>

        {!calendario ? (
          <p className="px-5 py-10 text-center text-sm text-tinta/50">
            Elige la fecha de entrega para ver los {semanasPorDefecto} sábados.
          </p>
        ) : (
          <>
            <ol className="max-h-[26rem] overflow-y-auto scroll-suave">
              {calendario.filas.map((f, i) => {
                const ultimo = i === calendario.filas.length - 1;
                return (
                  <li
                    key={f.iso}
                    className={`flex items-center justify-between gap-3 border-b border-niebla/70 px-5 py-2.5 text-sm last:border-b-0 ${
                      ultimo ? "bg-oro/10 font-semibold text-patrimonio" : ""
                    }`}
                  >
                    <span className="tabular-nums text-tinta/50">
                      {String(f.semana).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{fechaCorta(f.fecha)}</span>
                    <span className="tabular-nums">{montos ? pesos(montos[i]!) : "—"}</span>
                  </li>
                );
              })}
            </ol>
            <div className="border-t border-niebla bg-marfil px-5 py-4 text-sm">
              <p className="text-tinta/60">Vence el</p>
              <p className="font-serif text-base text-patrimonio">
                {fechaLarga(calendario.filas[calendario.filas.length - 1]!.fecha)}
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
