import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { puede } from "@/lib/rbac";
import { pesos } from "@/lib/dinero";
import { fechaCorta, fechaLarga, hoy } from "@/lib/fechas";
import { resumirCredito } from "@/lib/creditos";
import { DOCUMENTOS_OBLIGATORIOS, ETIQUETA_DOCUMENTO, pesoLegible } from "@/lib/documentos";
import { Titulo, Tarjeta, Dato, Insignia, Vacio, Migas } from "@/components/ui";
import { FormularioClienta } from "@/components/FormularioClienta";
import { Escaner } from "@/components/Escaner";
import { actualizarClienta } from "../acciones";
import { BotonBorrarDocumento } from "./boton-borrar-documento";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await db.cliente.findUnique({ where: { id }, select: { nombre: true } });
  return { title: c?.nombre ?? "Clienta" };
}

const TONO_CREDITO = {
  ACTIVO: "verde",
  LIQUIDADO: "neutro",
  VENCIDO: "rojo",
  CANCELADO: "neutro",
} as const;

export default async function FichaClienta({ params }: { params: Promise<{ id: string }> }) {
  const sesion = await exigirPermiso("clientas.ver");
  const { id } = await params;

  const clienta = await db.cliente.findUnique({
    where: { id },
    include: {
      grupo: { select: { id: true, nombre: true } },
      capturadoPor: { select: { nombre: true } },
      creditos: {
        orderBy: { creadoEn: "desc" },
        include: { abonos: { orderBy: { semana: "asc" } } },
      },
      documentos: {
        orderBy: { creadoEn: "desc" },
        include: { subidoPor: { select: { nombre: true } } },
      },
    },
  });
  if (!clienta) notFound();

  const grupos = await db.grupo.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  const puedeEditar = puede(sesion.usuario.rol, "clientas.editar");
  const puedeCrearCredito = puede(sesion.usuario.rol, "creditos.crear");
  const puedeSubir = puede(sesion.usuario.rol, "documentos.subir");
  const hoyRef = hoy();

  const tiposPresentes = new Set(clienta.documentos.map((d) => d.tipo));
  const faltantes = DOCUMENTOS_OBLIGATORIOS.filter((t) => !tiposPresentes.has(t));

  // Historial de pago acumulado de todos los créditos cerrados y vigentes.
  const historial = clienta.creditos.map((c) => ({
    credito: c,
    resumen: resumirCredito(c, c.abonos, hoyRef),
  }));
  const puntualidad = (() => {
    const abonos = clienta.creditos.flatMap((c) => c.abonos).filter((a) => a.fechaProgramada <= hoyRef);
    if (abonos.length === 0) return null;
    const pagados = abonos.filter((a) => a.estado === "PAGADO").length;
    return Math.round((pagados / abonos.length) * 100);
  })();

  return (
    <>
      <Migas items={[{ href: "/clientas", texto: "Clientas" }, { texto: clienta.nombre }]} />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <Titulo
          sub={
            <>
              Folio {String(clienta.folio).padStart(4, "0")}
              {clienta.grupo ? ` · Grupo ${clienta.grupo.nombre}` : " · Sin grupo"}
              {clienta.capturadoPor ? ` · Capturó ${clienta.capturadoPor.nombre}` : ""}
            </>
          }
        >
          {clienta.nombre}
        </Titulo>
        {puedeCrearCredito ? (
          <Link href={`/creditos/nuevo?clienta=${clienta.id}`} className="btn-primario">
            Registrar crédito
          </Link>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_23rem]">
        <div className="space-y-6">
          <Tarjeta titulo="Datos generales">
            <dl className="grid gap-5 p-5 sm:grid-cols-2">
              <Dato etiqueta="Teléfono" valor={clienta.telefono} />
              <Dato etiqueta="CURP" valor={clienta.curp} />
              <div className="sm:col-span-2">
                <Dato
                  etiqueta="Domicilio"
                  valor={[clienta.domicilio, clienta.colonia, clienta.ciudad].filter(Boolean).join(", ")}
                />
              </div>
              <div className="sm:col-span-2">
                <Dato etiqueta="Notas" valor={clienta.notas} />
              </div>
            </dl>
          </Tarjeta>

          <Tarjeta titulo="Aval">
            {clienta.avalNombre ? (
              <dl className="grid gap-5 p-5 sm:grid-cols-2">
                <Dato etiqueta="Nombre" valor={clienta.avalNombre} />
                <Dato etiqueta="Teléfono" valor={clienta.avalTelefono} />
                <Dato etiqueta="Parentesco" valor={clienta.avalParentesco} />
                <div className="sm:col-span-2">
                  <Dato
                    etiqueta="Domicilio del aval"
                    valor={[clienta.avalDomicilio, clienta.avalColonia, clienta.avalCiudad]
                      .filter(Boolean)
                      .join(", ")}
                  />
                </div>
              </dl>
            ) : (
              <Vacio>Esta clienta todavía no tiene aval registrado.</Vacio>
            )}
          </Tarjeta>

          <Tarjeta
            titulo="Historial de créditos"
            accion={
              puntualidad !== null ? (
                <Insignia tono={puntualidad >= 90 ? "verde" : puntualidad >= 70 ? "oro" : "rojo"}>
                  {puntualidad}% de puntualidad
                </Insignia>
              ) : null
            }
          >
            {historial.length === 0 ? (
              <Vacio
                accion={
                  puedeCrearCredito ? (
                    <Link href={`/creditos/nuevo?clienta=${clienta.id}`} className="btn-secundario">
                      Registrar el primer crédito
                    </Link>
                  ) : null
                }
              >
                Sin créditos registrados.
              </Vacio>
            ) : (
              <div className="scroll-suave overflow-x-auto">
                <table className="tabla">
                  <thead>
                    <tr>
                      <th>Folio</th>
                      <th>Entrega</th>
                      <th>Vence</th>
                      <th className="text-right">Prestado</th>
                      <th className="text-right">A pagar</th>
                      <th className="text-right">Saldo</th>
                      <th>Avance</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map(({ credito, resumen }) => (
                      <tr key={credito.id}>
                        <td className="tabular-nums text-xs text-tinta/50">
                          {String(credito.folio).padStart(4, "0")}
                        </td>
                        <td className="whitespace-nowrap text-sm">{fechaCorta(credito.fechaEntrega)}</td>
                        <td className="whitespace-nowrap text-sm">{fechaCorta(credito.fechaVencimiento)}</td>
                        <td className="text-right tabular-nums">{pesos(credito.montoPrestado)}</td>
                        <td className="text-right tabular-nums">{pesos(credito.montoTotal)}</td>
                        <td className="text-right tabular-nums font-medium">{pesos(resumen.saldo)}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Insignia tono={TONO_CREDITO[credito.estado]}>{credito.estado}</Insignia>
                            <span className="whitespace-nowrap text-xs text-tinta/55">
                              {resumen.abonosPagados}/{credito.numSemanas}
                            </span>
                          </div>
                        </td>
                        <td className="text-right">
                          <Link href={`/creditos/${credito.id}`} className="btn-fantasma px-2.5 py-1.5 text-xs">
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Tarjeta>

          <Tarjeta
            titulo="Expediente digital"
            accion={
              faltantes.length > 0 ? (
                <Insignia tono="oro">Faltan {faltantes.length}</Insignia>
              ) : (
                <Insignia tono="verde">Completo</Insignia>
              )
            }
          >
            {faltantes.length > 0 ? (
              <p className="border-b border-niebla bg-marfil/60 px-5 py-3 text-xs text-tinta/65">
                Pendiente de escanear: {faltantes.map((t) => ETIQUETA_DOCUMENTO[t]).join(", ")}.
              </p>
            ) : null}

            {clienta.documentos.length === 0 ? (
              <Vacio>Todavía no hay documentos escaneados.</Vacio>
            ) : (
              <ul className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                {clienta.documentos.map((d) => (
                  <li key={d.id} className="overflow-hidden rounded-lg border border-niebla">
                    <a href={`/api/documentos/${d.id}`} target="_blank" rel="noreferrer" className="block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/documentos/${d.id}`}
                        alt={ETIQUETA_DOCUMENTO[d.tipo]}
                        className="h-40 w-full bg-niebla object-cover"
                        loading="lazy"
                      />
                    </a>
                    <div className="flex items-start justify-between gap-2 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-patrimonio">
                          {ETIQUETA_DOCUMENTO[d.tipo]}
                        </p>
                        <p className="truncate text-[11px] text-tinta/50">
                          {fechaCorta(d.creadoEn)} · {pesoLegible(d.bytes)}
                          {d.subidoPor ? ` · ${d.subidoPor.nombre.split(" ")[0]}` : ""}
                        </p>
                      </div>
                      {puedeSubir ? <BotonBorrarDocumento id={d.id} /> : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Tarjeta>

          {puedeEditar ? (
            <details className="tarjeta group">
              <summary className="cursor-pointer list-none px-5 py-3.5 font-serif text-lg text-patrimonio">
                Editar datos de la clienta
                <span className="ml-2 text-xs font-sans text-tinta/45 group-open:hidden">(abrir)</span>
              </summary>
              <div className="border-t border-niebla p-5">
                <FormularioClienta
                  accion={actualizarClienta}
                  grupos={grupos}
                  clienta={clienta}
                  textoBoton="Guardar cambios"
                />
              </div>
            </details>
          ) : null}
        </div>

        <div className="space-y-6">
          {puedeSubir ? (
            <Tarjeta titulo="Escanear documento">
              <Escaner clienteId={clienta.id} />
            </Tarjeta>
          ) : null}

          <Tarjeta titulo="Resumen">
            <dl className="space-y-4 p-5">
              <Dato etiqueta="Créditos totales" valor={clienta.creditos.length} />
              <Dato
                etiqueta="Prestado histórico"
                valor={pesos(clienta.creditos.reduce((s, c) => s + c.montoPrestado, 0))}
              />
              <Dato
                etiqueta="Pagado histórico"
                valor={pesos(historial.reduce((s, h) => s + h.resumen.totalPagado, 0))}
              />
              <Dato
                etiqueta="Saldo vigente"
                valor={pesos(
                  historial
                    .filter((h) => h.credito.estado === "ACTIVO" || h.credito.estado === "VENCIDO")
                    .reduce((s, h) => s + h.resumen.saldo, 0),
                )}
              />
              <Dato etiqueta="Alta" valor={fechaLarga(clienta.creadoEn)} />
            </dl>
          </Tarjeta>
        </div>
      </div>
    </>
  );
}
