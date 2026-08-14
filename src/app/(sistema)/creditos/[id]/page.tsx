import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { puede } from "@/lib/rbac";
import { pesos } from "@/lib/dinero";
import { fechaCorta, fechaLarga, hoy } from "@/lib/fechas";
import { resumirCredito } from "@/lib/creditos";
import { Titulo, Tarjeta, Dato, Insignia, Migas } from "@/components/ui";
import { AccionesAbono } from "../../cobranza/fila";
import { BotonCancelar } from "./boton-cancelar";

const TONO = { ACTIVO: "verde", LIQUIDADO: "neutro", VENCIDO: "rojo", CANCELADO: "neutro" } as const;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await db.credito.findUnique({ where: { id }, select: { folio: true } });
  return { title: c ? `Crédito ${String(c.folio).padStart(4, "0")}` : "Crédito" };
}

export default async function FichaCredito({ params }: { params: Promise<{ id: string }> }) {
  const sesion = await exigirPermiso("creditos.ver");
  const { id } = await params;

  const credito = await db.credito.findUnique({
    where: { id },
    include: {
      cliente: { select: { id: true, nombre: true, telefono: true, avalNombre: true } },
      grupo: { select: { id: true, nombre: true } },
      capturadoPor: { select: { nombre: true } },
      abonos: { orderBy: { semana: "asc" } },
      pagos: {
        orderBy: { creadoEn: "desc" },
        take: 30,
        include: { registradoPor: { select: { nombre: true } } },
      },
    },
  });
  if (!credito) notFound();

  const referencia = hoy();
  const resumen = resumirCredito(credito, credito.abonos, referencia);
  const puedeMarcar = puede(sesion.usuario.rol, "cobranza.marcar");
  const puedeAnular = puede(sesion.usuario.rol, "cobranza.anular");
  const puedeCancelar = puede(sesion.usuario.rol, "creditos.editar") && resumen.totalPagado === 0;

  return (
    <>
      <Migas
        items={[
          { href: "/creditos", texto: "Créditos" },
          { texto: `Folio ${String(credito.folio).padStart(4, "0")}` },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <Titulo
          sub={
            <>
              <Link href={`/clientas/${credito.cliente.id}`} className="text-patrimonio underline">
                Ver expediente de la clienta
              </Link>
              {credito.grupo ? ` · Grupo ${credito.grupo.nombre}` : ""}
              {credito.capturadoPor ? ` · Capturó ${credito.capturadoPor.nombre}` : ""}
            </>
          }
        >
          {credito.cliente.nombre}
        </Titulo>

        <div className="flex flex-wrap gap-2">
          <a
            href={`/api/tarjeton/${credito.id}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primario"
          >
            Imprimir tarjetón
          </a>
          {puedeCancelar ? <BotonCancelar id={credito.id} /> : null}
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Indicador etiqueta="Prestado" valor={pesos(credito.montoPrestado)} />
        <Indicador etiqueta="Total a pagar" valor={pesos(credito.montoTotal)} />
        <Indicador etiqueta="Pagado" valor={pesos(resumen.totalPagado)} tono="verde" />
        <Indicador
          etiqueta="Saldo"
          valor={pesos(resumen.saldo)}
          tono={resumen.atrasoCentavos > 0 ? "rojo" : "neutro"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Tarjeta
          titulo={`Calendario de abonos (${resumen.abonosPagados}/${credito.numSemanas})`}
          accion={<Insignia tono={TONO[credito.estado]}>{credito.estado}</Insignia>}
        >
          <div className="scroll-suave overflow-x-auto">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Semana</th>
                  <th>Sábado</th>
                  <th className="text-right">Abono</th>
                  <th className="text-right">Pagado</th>
                  <th className="text-right">{puedeMarcar ? "Captura" : "Estado"}</th>
                </tr>
              </thead>
              <tbody>
                {credito.abonos.map((a) => {
                  const vencido = a.fechaProgramada <= referencia && a.estado !== "PAGADO";
                  return (
                    <tr key={a.id} className={vencido ? "bg-riesgo/[0.03]" : ""}>
                      <td className="tabular-nums font-medium text-patrimonio">
                        {String(a.semana).padStart(2, "0")}
                      </td>
                      <td className="whitespace-nowrap text-sm">{fechaCorta(a.fechaProgramada)}</td>
                      <td className="text-right tabular-nums">{pesos(a.montoEsperado)}</td>
                      <td className="text-right tabular-nums">{pesos(a.montoPagado)}</td>
                      <td>
                        {puedeMarcar && credito.estado !== "CANCELADO" ? (
                          <AccionesAbono
                            abonoId={a.id}
                            falta={pesos(a.montoEsperado - a.montoPagado)}
                            estado={a.estado}
                            puedeAnular={puedeAnular}
                          />
                        ) : (
                          <div className="text-right">
                            <Insignia
                              tono={a.estado === "PAGADO" ? "verde" : a.estado === "PARCIAL" ? "oro" : "neutro"}
                            >
                              {a.estado}
                            </Insignia>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Tarjeta>

        <div className="space-y-6">
          <Tarjeta titulo="Datos del crédito">
            <dl className="space-y-4 p-5">
              <Dato etiqueta="Folio" valor={String(credito.folio).padStart(4, "0")} />
              <Dato etiqueta="Entrega" valor={fechaLarga(credito.fechaEntrega)} />
              <Dato etiqueta="Primer abono" valor={fechaLarga(credito.fechaPrimerAbono)} />
              <Dato etiqueta="Vence" valor={fechaLarga(credito.fechaVencimiento)} />
              <Dato etiqueta="Abono semanal" valor={pesos(credito.abonoSemanal)} />
              <Dato etiqueta="Aval" valor={credito.cliente.avalNombre} />
              {resumen.atrasoCentavos > 0 ? (
                <Dato
                  etiqueta="Atraso a la fecha"
                  valor={
                    <span className="font-semibold text-riesgo">
                      {pesos(resumen.atrasoCentavos)} · {resumen.semanasAtrasadas} semana(s)
                    </span>
                  }
                />
              ) : null}
              <Dato etiqueta="Notas" valor={credito.notas} />
            </dl>
          </Tarjeta>

          <Tarjeta titulo="Últimos movimientos">
            {credito.pagos.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-tinta/50">Sin movimientos.</p>
            ) : (
              <ul className="divide-y divide-niebla">
                {credito.pagos.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium tabular-nums ${
                          p.anulado ? "text-tinta/35 line-through" : "text-patrimonio"
                        }`}
                      >
                        {pesos(p.monto)}
                      </p>
                      <p className="truncate text-xs text-tinta/50">
                        {fechaCorta(p.fecha)}
                        {p.registradoPor ? ` · ${p.registradoPor.nombre}` : ""}
                      </p>
                    </div>
                    {p.anulado ? <Insignia tono="rojo">Anulado</Insignia> : null}
                  </li>
                ))}
              </ul>
            )}
          </Tarjeta>
        </div>
      </div>
    </>
  );
}

function Indicador({
  etiqueta,
  valor,
  tono = "neutro",
}: {
  etiqueta: string;
  valor: string;
  tono?: "neutro" | "verde" | "rojo";
}) {
  const color = { neutro: "text-patrimonio", verde: "text-crecimiento", rojo: "text-riesgo" }[tono];
  return (
    <div className="tarjeta px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-patrimonio/60">{etiqueta}</p>
      <p className={`mt-1 font-display text-2xl tabular-nums ${color}`}>{valor}</p>
    </div>
  );
}
