import Link from "next/link";

import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { puede } from "@/lib/rbac";
import { pesos } from "@/lib/dinero";
import { fechaISO, fechaLarga, parseFecha, sumarDias, esSabado, sabadoDeCobro } from "@/lib/fechas";
import { actualizarVencidos } from "@/lib/creditos";
import { Titulo, Tarjeta, Insignia, Vacio, Aviso } from "@/components/ui";
import { AccionesAbono } from "./fila";

export const metadata = { title: "Cobranza" };

export default async function PaginaCobranza({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string; grupo?: string }>;
}) {
  const sesion = await exigirPermiso("cobranza.ver");
  const { fecha: fechaParam, grupo = "" } = await searchParams;

  await actualizarVencidos();

  const referencia = fechaParam ? parseFecha(fechaParam) : sabadoDeCobro();
  const iso = fechaISO(referencia);
  const puedeAnular = puede(sesion.usuario.rol, "cobranza.anular");

  const filtroGrupo = grupo ? { credito: { grupoId: grupo } } : {};

  const [abonosDelDia, atrasados, grupos] = await Promise.all([
    db.abono.findMany({
      where: {
        fechaProgramada: referencia,
        credito: { estado: { in: ["ACTIVO", "VENCIDO"] }, ...(grupo ? { grupoId: grupo } : {}) },
      },
      orderBy: [{ credito: { grupo: { nombre: "asc" } } }, { credito: { cliente: { nombre: "asc" } } }],
      include: {
        credito: {
          select: {
            id: true,
            folio: true,
            numSemanas: true,
            cliente: { select: { id: true, nombre: true } },
            grupo: { select: { id: true, nombre: true } },
          },
        },
      },
    }),
    db.abono.findMany({
      where: {
        fechaProgramada: { lt: referencia },
        estado: { not: "PAGADO" },
        credito: { estado: { in: ["ACTIVO", "VENCIDO"] }, ...(grupo ? { grupoId: grupo } : {}) },
        ...filtroGrupo,
      },
      orderBy: [{ fechaProgramada: "asc" }],
      take: 200,
      include: {
        credito: {
          select: {
            id: true,
            folio: true,
            cliente: { select: { id: true, nombre: true } },
            grupo: { select: { nombre: true } },
          },
        },
      },
    }),
    db.grupo.findMany({ where: { activo: true }, orderBy: { nombre: "asc" }, select: { id: true, nombre: true } }),
  ]);

  const esperado = abonosDelDia.reduce((s, a) => s + a.montoEsperado, 0);
  const cobrado = abonosDelDia.reduce((s, a) => s + a.montoPagado, 0);
  const faltante = Math.max(0, esperado - cobrado);
  const atrasoTotal = atrasados.reduce((s, a) => s + (a.montoEsperado - a.montoPagado), 0);

  const sabadoAnterior = fechaISO(sumarDias(referencia, -7));
  const sabadoSiguiente = fechaISO(sumarDias(referencia, 7));

  return (
    <>
      <Titulo sub={fechaLarga(referencia)}>Cobranza del día</Titulo>

      {!esSabado(referencia) ? (
        <div className="mb-5">
          <Aviso tono="info">
            La fecha seleccionada no es sábado. Los abonos siempre se programan en sábado.
          </Aviso>
        </div>
      ) : null}

      <form className="mb-6 flex flex-wrap items-end gap-3" action="/cobranza">
        <div>
          <label className="etiqueta" htmlFor="fecha">
            Fecha
          </label>
          <input id="fecha" type="date" name="fecha" defaultValue={iso} className="campo w-48" />
        </div>
        <div>
          <label className="etiqueta" htmlFor="grupo">
            Grupo
          </label>
          <select id="grupo" name="grupo" defaultValue={grupo} className="campo w-56">
            <option value="">Todos los grupos</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-secundario">
          Ver
        </button>
        <div className="flex gap-2">
          <Link
            href={`/cobranza?fecha=${sabadoAnterior}${grupo ? `&grupo=${grupo}` : ""}`}
            className="btn-fantasma px-3 py-3 text-xs"
          >
            ← Sábado anterior
          </Link>
          <Link
            href={`/cobranza?fecha=${sabadoSiguiente}${grupo ? `&grupo=${grupo}` : ""}`}
            className="btn-fantasma px-3 py-3 text-xs"
          >
            Sábado siguiente →
          </Link>
        </div>
      </form>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Indicador etiqueta="Total a cobrar" valor={pesos(esperado)} destacado />
        <Indicador etiqueta="Cobrado" valor={pesos(cobrado)} tono="verde" />
        <Indicador etiqueta="Falta" valor={pesos(faltante)} tono={faltante > 0 ? "rojo" : "verde"} />
      </div>

      <Tarjeta
        titulo={`Abonos programados (${abonosDelDia.length})`}
        accion={
          grupo ? (
            <a
              href={`/api/tarjeton/${grupo}?grupo=1`}
              target="_blank"
              rel="noreferrer"
              className="btn-fantasma px-3 py-1.5 text-xs"
            >
              Imprimir tarjetones del grupo
            </a>
          ) : null
        }
      >
        {abonosDelDia.length === 0 ? (
          <Vacio>No hay abonos programados para esta fecha.</Vacio>
        ) : (
          <div className="scroll-suave overflow-x-auto">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Clienta</th>
                  <th>Grupo</th>
                  <th>Semana</th>
                  <th className="text-right">Abono</th>
                  <th className="text-right">Pagado</th>
                  <th className="text-right">Captura</th>
                </tr>
              </thead>
              <tbody>
                {abonosDelDia.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link
                        href={`/creditos/${a.credito.id}`}
                        className="font-medium text-patrimonio hover:underline"
                      >
                        {a.credito.cliente.nombre}
                      </Link>
                    </td>
                    <td className="text-sm text-tinta/65">{a.credito.grupo?.nombre ?? "—"}</td>
                    <td className="whitespace-nowrap text-sm tabular-nums">
                      {a.semana} / {a.credito.numSemanas}
                    </td>
                    <td className="text-right tabular-nums">{pesos(a.montoEsperado)}</td>
                    <td className="text-right tabular-nums">{pesos(a.montoPagado)}</td>
                    <td>
                      <AccionesAbono
                        abonoId={a.id}
                        falta={pesos(a.montoEsperado - a.montoPagado)}
                        estado={a.estado}
                        puedeAnular={puedeAnular}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Tarjeta>

      {atrasados.length > 0 ? (
        <div className="mt-6">
          <Tarjeta
            titulo={`Atrasos de semanas anteriores (${atrasados.length})`}
            accion={<Insignia tono="rojo">{pesos(atrasoTotal)}</Insignia>}
          >
            <div className="scroll-suave overflow-x-auto">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Clienta</th>
                    <th>Grupo</th>
                    <th>Semana</th>
                    <th>Debía</th>
                    <th className="text-right">Falta</th>
                    <th className="text-right">Captura</th>
                  </tr>
                </thead>
                <tbody>
                  {atrasados.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <Link
                          href={`/creditos/${a.credito.id}`}
                          className="font-medium text-patrimonio hover:underline"
                        >
                          {a.credito.cliente.nombre}
                        </Link>
                      </td>
                      <td className="text-sm text-tinta/65">{a.credito.grupo?.nombre ?? "—"}</td>
                      <td className="text-sm tabular-nums">{a.semana}</td>
                      <td className="whitespace-nowrap text-sm text-tinta/65">
                        {fechaLarga(a.fechaProgramada).replace(/ de \d{4}$/, "")}
                      </td>
                      <td className="text-right tabular-nums font-medium text-riesgo">
                        {pesos(a.montoEsperado - a.montoPagado)}
                      </td>
                      <td>
                        <AccionesAbono
                          abonoId={a.id}
                          falta={pesos(a.montoEsperado - a.montoPagado)}
                          estado={a.estado}
                          puedeAnular={puedeAnular}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tarjeta>
        </div>
      ) : null}
    </>
  );
}

function Indicador({
  etiqueta,
  valor,
  tono = "neutro",
  destacado,
}: {
  etiqueta: string;
  valor: string;
  tono?: "neutro" | "verde" | "rojo";
  destacado?: boolean;
}) {
  const color = { neutro: "text-patrimonio", verde: "text-crecimiento", rojo: "text-riesgo" }[tono];
  return (
    <div className={`tarjeta px-5 py-4 ${destacado ? "border-patrimonio/25 bg-white" : ""}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-patrimonio/60">{etiqueta}</p>
      <p className={`mt-1 font-display text-3xl tabular-nums ${color}`}>{valor}</p>
    </div>
  );
}
