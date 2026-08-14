import Link from "next/link";

import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { pesos } from "@/lib/dinero";
import { fechaISO, fechaLarga, parseFecha, sabadoDeCobro } from "@/lib/fechas";
import { Tarjeta } from "@/components/ui";

export const metadata = { title: "Cobro del día" };

/**
 * Pantalla de la Encargada: únicamente el total a cobrar del día.
 * No muestra nombres de clientas, domicilios ni importes individuales.
 */
export default async function PaginaCorte({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>;
}) {
  const sesion = await exigirPermiso("corte.dia");
  const { fecha } = await searchParams;
  // Por omisión muestra el sábado de cobro vigente: entre semana permite
  // preparar el efectivo del día, y el mismo sábado es el total en curso.
  const referencia = fecha ? parseFecha(fecha) : sabadoDeCobro();

  // Si la encargada tiene grupos asignados, solo ve el cobro de esos grupos.
  const misGrupos =
    sesion.usuario.rol === "ENCARGADA"
      ? await db.grupo.findMany({
          where: { encargadaId: sesion.usuario.id },
          select: { id: true, nombre: true },
        })
      : [];

  const filtroGrupo = misGrupos.length > 0 ? { grupoId: { in: misGrupos.map((g) => g.id) } } : {};

  const abonos = await db.abono.findMany({
    where: {
      fechaProgramada: referencia,
      credito: { estado: { in: ["ACTIVO", "VENCIDO"] }, ...filtroGrupo },
    },
    select: {
      montoEsperado: true,
      montoPagado: true,
      credito: { select: { grupo: { select: { id: true, nombre: true } } } },
    },
  });

  const esperado = abonos.reduce((s, a) => s + a.montoEsperado, 0);
  const cobrado = abonos.reduce((s, a) => s + a.montoPagado, 0);
  const falta = Math.max(0, esperado - cobrado);

  // Desglose por grupo, sin datos personales.
  const porGrupo = new Map<string, { nombre: string; esperado: number; cobrado: number }>();
  for (const a of abonos) {
    const clave = a.credito.grupo?.id ?? "sin-grupo";
    const actual = porGrupo.get(clave) ?? {
      nombre: a.credito.grupo?.nombre ?? "Sin grupo",
      esperado: 0,
      cobrado: 0,
    };
    actual.esperado += a.montoEsperado;
    actual.cobrado += a.montoPagado;
    porGrupo.set(clave, actual);
  }
  const grupos = [...porGrupo.values()].sort((a, b) => b.esperado - a.esperado);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="tarjeta overflow-hidden">
        <div className="bg-patrimonio px-8 py-12 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-salvia">Total a cobrar</p>
          <p className="mt-3 font-display text-6xl leading-none text-white tabular-nums sm:text-7xl">
            {pesos(esperado)}
          </p>
          <p className="mt-4 font-serif text-base text-salvia">{fechaLarga(referencia)}</p>
        </div>

        <div className="grid grid-cols-2 divide-x divide-niebla border-b border-niebla">
          <div className="px-6 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-patrimonio/60">Cobrado</p>
            <p className="mt-1 font-display text-2xl text-crecimiento tabular-nums">{pesos(cobrado)}</p>
          </div>
          <div className="px-6 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-patrimonio/60">Falta</p>
            <p
              className={`mt-1 font-display text-2xl tabular-nums ${
                falta > 0 ? "text-riesgo" : "text-crecimiento"
              }`}
            >
              {pesos(falta)}
            </p>
          </div>
        </div>

        <form className="flex items-end gap-3 px-6 py-5" action="/corte">
          <div className="flex-1">
            <label className="etiqueta" htmlFor="fecha">
              Consultar otro día
            </label>
            <input
              id="fecha"
              type="date"
              name="fecha"
              defaultValue={fechaISO(referencia)}
              className="campo"
            />
          </div>
          <button type="submit" className="btn-secundario">
            Ver
          </button>
        </form>
      </div>

      {grupos.length > 1 ? (
        <div className="mt-6">
          <Tarjeta titulo="Por grupo">
            <ul className="divide-y divide-niebla">
              {grupos.map((g) => (
                <li key={g.nombre} className="flex items-center justify-between px-5 py-3.5">
                  <span className="font-medium text-patrimonio">{g.nombre}</span>
                  <span className="tabular-nums text-tinta/70">
                    {pesos(g.cobrado)} <span className="text-tinta/35">de</span> {pesos(g.esperado)}
                  </span>
                </li>
              ))}
            </ul>
          </Tarjeta>
        </div>
      ) : null}

      {abonos.length === 0 ? (
        <p className="mt-6 text-center text-sm text-tinta/55">
          No hay cobros programados para este día.
          {misGrupos.length === 0 && sesion.usuario.rol === "ENCARGADA" ? (
            <>
              <br />
              Pide a tu supervisor que te asigne un grupo.
            </>
          ) : null}
        </p>
      ) : null}

      {sesion.usuario.rol !== "ENCARGADA" ? (
        <p className="mt-6 text-center text-sm">
          <Link href="/cobranza" className="text-patrimonio underline">
            Ir a la captura de cobranza
          </Link>
        </p>
      ) : null}
    </div>
  );
}
