import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { Titulo, Migas, Aviso } from "@/components/ui";
import { FormularioCredito } from "./formulario";

export const metadata = { title: "Nuevo crédito" };

const SEMANAS_POR_DEFECTO = Number(process.env.UM_SEMANAS ?? 12) || 12;

export default async function PaginaNuevoCredito({
  searchParams,
}: {
  searchParams: Promise<{ clienta?: string }>;
}) {
  await exigirPermiso("creditos.crear");
  const { clienta } = await searchParams;

  const [clientas, grupos] = await Promise.all([
    db.cliente.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, folio: true, grupo: { select: { nombre: true } } },
    }),
    db.grupo.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true },
    }),
  ]);

  return (
    <>
      <Migas items={[{ href: "/creditos", texto: "Créditos" }, { texto: "Nuevo" }]} />
      <Titulo sub="Captura el lunes de entrega y el sistema genera los sábados de abono con su fecha de vencimiento.">
        Nuevo crédito
      </Titulo>

      {clientas.length === 0 ? (
        <Aviso tono="info">
          Todavía no hay clientas dadas de alta. Registra primero a la clienta y su aval.
        </Aviso>
      ) : (
        <FormularioCredito
          clientas={clientas.map((c) => ({
            valor: c.id,
            texto: `${c.nombre}${c.grupo ? ` — ${c.grupo.nombre}` : ""}`,
          }))}
          grupos={grupos.map((g) => ({ valor: g.id, texto: g.nombre }))}
          clientaInicial={clienta}
          semanasPorDefecto={SEMANAS_POR_DEFECTO}
        />
      )}
    </>
  );
}
