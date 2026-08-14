import Link from "next/link";

import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { pesos } from "@/lib/dinero";
import { fechaISO, fechaLarga, hoy, sabadoDeCobro } from "@/lib/fechas";
import { actualizarVencidos } from "@/lib/creditos";
import { Titulo, Tarjeta, Vacio } from "@/components/ui";

export const metadata = { title: "Panel" };

export default async function PaginaPanel() {
  const sesion = await exigirPermiso("reportes.ver");
  await actualizarVencidos();

  const referencia = hoy();
  const sabado = sabadoDeCobro(referencia);

  const [abonosSabado, activos, vencidos, atrasados, clientas, ultimos] = await Promise.all([
    db.abono.findMany({
      where: { fechaProgramada: sabado, credito: { estado: { in: ["ACTIVO", "VENCIDO"] } } },
      select: { montoEsperado: true, montoPagado: true },
    }),
    db.credito.findMany({
      where: { estado: "ACTIVO" },
      select: { montoTotal: true, abonos: { select: { montoPagado: true } } },
    }),
    db.credito.count({ where: { estado: "VENCIDO" } }),
    db.abono.findMany({
      where: {
        fechaProgramada: { lt: referencia },
        estado: { not: "PAGADO" },
        credito: { estado: { in: ["ACTIVO", "VENCIDO"] } },
      },
      select: { montoEsperado: true, montoPagado: true },
    }),
    db.cliente.count({ where: { activo: true } }),
    db.pago.findMany({
      where: { anulado: false },
      orderBy: { creadoEn: "desc" },
      take: 8,
      include: {
        registradoPor: { select: { nombre: true } },
        credito: { select: { id: true, cliente: { select: { nombre: true } } } },
      },
    }),
  ]);

  const esperadoSabado = abonosSabado.reduce((s, a) => s + a.montoEsperado, 0);
  const cobradoSabado = abonosSabado.reduce((s, a) => s + a.montoPagado, 0);
  const carteraActiva = activos.reduce((s, c) => {
    const pagado = c.abonos.reduce((x, a) => x + a.montoPagado, 0);
    return s + Math.max(0, c.montoTotal - pagado);
  }, 0);
  const atrasoTotal = atrasados.reduce((s, a) => s + (a.montoEsperado - a.montoPagado), 0);

  return (
    <>
      <Titulo sub={`Hola, ${sesion.usuario.nombre.split(" ")[0]}. Esto es lo que hay al ${fechaLarga(referencia)}.`}>
        Panel general
      </Titulo>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Indicador
          etiqueta="A cobrar el sábado"
          valor={pesos(esperadoSabado)}
          nota={`${fechaLarga(sabado).replace(/^\w/, (c) => c.toUpperCase())} · cobrado ${pesos(cobradoSabado)}`}
          href={`/cobranza?fecha=${fechaISO(sabado)}`}
        />
        <Indicador etiqueta="Cartera activa" valor={pesos(carteraActiva)} nota={`${activos.length} créditos vigentes`} href="/creditos" />
        <Indicador
          etiqueta="Atraso acumulado"
          valor={pesos(atrasoTotal)}
          tono={atrasoTotal > 0 ? "rojo" : "verde"}
          nota={`${vencidos} crédito(s) vencido(s)`}
          href="/creditos?estado=VENCIDO"
        />
        <Indicador etiqueta="Clientas activas" valor={String(clientas)} nota="Con expediente abierto" href="/clientas" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Tarjeta
          titulo="Últimos abonos capturados"
          accion={
            <Link href="/cobranza" className="btn-fantasma px-3 py-1.5 text-xs">
              Ir a cobranza
            </Link>
          }
        >
          {ultimos.length === 0 ? (
            <Vacio>Todavía no se ha capturado ningún abono.</Vacio>
          ) : (
            <ul className="divide-y divide-niebla">
              {ultimos.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/creditos/${p.credito.id}`}
                      className="truncate text-sm font-medium text-patrimonio hover:underline"
                    >
                      {p.credito.cliente.nombre}
                    </Link>
                    <p className="truncate text-xs text-tinta/50">
                      {p.registradoPor?.nombre ?? "—"} · {fechaLarga(p.fecha).replace(/ de \d{4}$/, "")}
                    </p>
                  </div>
                  <span className="shrink-0 tabular-nums font-medium text-crecimiento">{pesos(p.monto)}</span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta titulo="Accesos rápidos">
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <Acceso href="/clientas/nueva" texto="Dar de alta una clienta" />
            <Acceso href="/creditos/nuevo" texto="Registrar un crédito" />
            <Acceso href="/cobranza" texto="Capturar la cobranza" />
            <Acceso href="/grupos" texto="Administrar grupos" />
            <Acceso href="/corte" texto="Ver el cobro del día" />
            <Acceso href="/usuarios" texto="Usuarios del sistema" />
          </div>
        </Tarjeta>
      </div>
    </>
  );
}

function Indicador({
  etiqueta,
  valor,
  nota,
  href,
  tono = "neutro",
}: {
  etiqueta: string;
  valor: string;
  nota?: string;
  href?: string;
  tono?: "neutro" | "verde" | "rojo";
}) {
  const color = { neutro: "text-patrimonio", verde: "text-crecimiento", rojo: "text-riesgo" }[tono];
  const contenido = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-patrimonio/60">{etiqueta}</p>
      <p className={`mt-1 font-display text-3xl tabular-nums ${color}`}>{valor}</p>
      {nota ? <p className="mt-1 text-xs text-tinta/50">{nota}</p> : null}
    </>
  );

  return href ? (
    <Link href={href} className="tarjeta block px-5 py-4 transition hover:border-salvia hover:shadow">
      {contenido}
    </Link>
  ) : (
    <div className="tarjeta px-5 py-4">{contenido}</div>
  );
}

function Acceso({ href, texto }: { href: string; texto: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-niebla px-4 py-3 text-sm font-medium text-patrimonio transition hover:border-salvia hover:bg-marfil"
    >
      {texto}
    </Link>
  );
}
