import Link from "next/link";
import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { puede } from "@/lib/rbac";
import { pesos } from "@/lib/dinero";
import { fechaCorta, hoy } from "@/lib/fechas";
import { actualizarVencidos, resumirCredito } from "@/lib/creditos";
import { Titulo, Tarjeta, Insignia, Vacio } from "@/components/ui";

export const metadata = { title: "Créditos" };

const TONO = { ACTIVO: "verde", LIQUIDADO: "neutro", VENCIDO: "rojo", CANCELADO: "neutro" } as const;

export default async function PaginaCreditos({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; grupo?: string }>;
}) {
  const sesion = await exigirPermiso("creditos.ver");
  const { estado = "ACTIVO", grupo = "" } = await searchParams;

  await actualizarVencidos();

  const where: Prisma.CreditoWhereInput = {
    ...(estado && estado !== "TODOS" ? { estado: estado as Prisma.EnumEstadoCreditoFilter["equals"] } : {}),
    ...(grupo ? { grupoId: grupo } : {}),
  };

  const [creditos, grupos] = await Promise.all([
    db.credito.findMany({
      where,
      orderBy: [{ fechaVencimiento: "asc" }],
      take: 300,
      include: {
        cliente: { select: { id: true, nombre: true } },
        grupo: { select: { nombre: true } },
        abonos: { select: { montoEsperado: true, montoPagado: true, fechaProgramada: true, estado: true } },
      },
    }),
    db.grupo.findMany({ where: { activo: true }, orderBy: { nombre: "asc" }, select: { id: true, nombre: true } }),
  ]);

  const referencia = hoy();
  const puedeCrear = puede(sesion.usuario.rol, "creditos.crear");

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Titulo sub="Cada crédito trae su calendario de sábados y su tarjetón imprimible.">Créditos</Titulo>
        {puedeCrear ? (
          <Link href="/creditos/nuevo" className="btn-primario">
            Nuevo crédito
          </Link>
        ) : null}
      </div>

      <form className="mb-5 flex flex-wrap gap-3" action="/creditos">
        <select name="estado" defaultValue={estado} className="campo w-48" aria-label="Estado">
          {["ACTIVO", "VENCIDO", "LIQUIDADO", "CANCELADO", "TODOS"].map((e) => (
            <option key={e} value={e}>
              {e === "TODOS" ? "Todos los estados" : e}
            </option>
          ))}
        </select>
        <select name="grupo" defaultValue={grupo} className="campo w-56" aria-label="Grupo">
          <option value="">Todos los grupos</option>
          {grupos.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-secundario">
          Filtrar
        </button>
      </form>

      <Tarjeta titulo={`${creditos.length} ${creditos.length === 1 ? "crédito" : "créditos"}`}>
        {creditos.length === 0 ? (
          <Vacio>No hay créditos con esos filtros.</Vacio>
        ) : (
          <div className="scroll-suave overflow-x-auto">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Clienta</th>
                  <th>Grupo</th>
                  <th>Entrega</th>
                  <th>Vence</th>
                  <th className="text-right">A pagar</th>
                  <th className="text-right">Saldo</th>
                  <th>Avance</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {creditos.map((c) => {
                  const r = resumirCredito(c, c.abonos, referencia);
                  return (
                    <tr key={c.id}>
                      <td className="tabular-nums text-xs text-tinta/50">
                        {String(c.folio).padStart(4, "0")}
                      </td>
                      <td>
                        <Link
                          href={`/creditos/${c.id}`}
                          className="font-medium text-patrimonio hover:underline"
                        >
                          {c.cliente.nombre}
                        </Link>
                      </td>
                      <td className="text-sm text-tinta/65">{c.grupo?.nombre ?? "—"}</td>
                      <td className="whitespace-nowrap text-sm">{fechaCorta(c.fechaEntrega)}</td>
                      <td className="whitespace-nowrap text-sm">{fechaCorta(c.fechaVencimiento)}</td>
                      <td className="text-right tabular-nums">{pesos(c.montoTotal)}</td>
                      <td className="text-right tabular-nums font-medium">{pesos(r.saldo)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Insignia tono={TONO[c.estado]}>{c.estado}</Insignia>
                          <span className="whitespace-nowrap text-xs text-tinta/55">
                            {r.abonosPagados}/{c.numSemanas}
                          </span>
                          {r.atrasoCentavos > 0 ? (
                            <span className="whitespace-nowrap text-xs font-semibold text-riesgo">
                              −{pesos(r.atrasoCentavos)}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="text-right">
                        <a
                          href={`/api/tarjeton/${c.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-fantasma px-2.5 py-1.5 text-xs"
                        >
                          Tarjetón
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Tarjeta>
    </>
  );
}
