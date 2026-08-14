import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { Titulo, Tarjeta, Vacio, Insignia } from "@/components/ui";

export const metadata = { title: "Bitácora" };

const FORMATO = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Mazatlan",
});

const ETIQUETA_ACCION: Record<string, string> = {
  "sesion.iniciar": "Entró al sistema",
  "sesion.fallida": "Intento de acceso fallido",
  "usuario.crear": "Creó un usuario",
  "usuario.activar": "Activó un usuario",
  "usuario.desactivar": "Desactivó un usuario",
  "usuario.password": "Cambió una contraseña",
  "grupo.crear": "Creó un grupo",
  "grupo.editar": "Editó un grupo",
  "grupo.archivar": "Archivó un grupo",
  "grupo.reactivar": "Reactivó un grupo",
  "clienta.crear": "Dio de alta una clienta",
  "clienta.editar": "Editó una clienta",
  "credito.crear": "Registró un crédito",
  "credito.cancelar": "Canceló un crédito",
  "abono.marcar": "Marcó un abono pagado",
  "abono.parcial": "Registró un abono parcial",
  "abono.anular": "Anuló un movimiento",
  "documento.subir": "Escaneó un documento",
  "documento.borrar": "Borró un documento",
};

export default async function PaginaBitacora({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  await exigirPermiso("auditoria.ver");
  const { pagina = "1" } = await searchParams;
  const p = Math.max(1, Number(pagina) || 1);
  const porPagina = 60;

  const [movimientos, total] = await Promise.all([
    db.auditoria.findMany({
      orderBy: { creadoEn: "desc" },
      skip: (p - 1) * porPagina,
      take: porPagina,
      include: { usuario: { select: { nombre: true, usuario: true } } },
    }),
    db.auditoria.count(),
  ]);

  const paginas = Math.max(1, Math.ceil(total / porPagina));

  return (
    <>
      <Titulo sub="Registro de todo lo que se captura en el sistema, con la persona responsable y la hora.">
        Bitácora
      </Titulo>

      <Tarjeta titulo={`${total} movimiento(s)`}>
        {movimientos.length === 0 ? (
          <Vacio>Todavía no hay movimientos registrados.</Vacio>
        ) : (
          <div className="scroll-suave overflow-x-auto">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((m) => (
                  <tr key={m.id}>
                    <td className="whitespace-nowrap text-xs text-tinta/60">{FORMATO.format(m.creadoEn)}</td>
                    <td className="text-sm">
                      {m.usuario ? (
                        <>
                          <span className="font-medium text-patrimonio">{m.usuario.nombre}</span>
                          <span className="ml-1.5 text-xs text-tinta/45">@{m.usuario.usuario}</span>
                        </>
                      ) : (
                        <span className="text-tinta/35">—</span>
                      )}
                    </td>
                    <td className="text-sm">
                      {m.accion === "sesion.fallida" ? (
                        <Insignia tono="rojo">{ETIQUETA_ACCION[m.accion]}</Insignia>
                      ) : (
                        (ETIQUETA_ACCION[m.accion] ?? m.accion)
                      )}
                    </td>
                    <td className="max-w-md truncate font-mono text-[11px] text-tinta/50">
                      {m.detalle ? JSON.stringify(m.detalle) : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Tarjeta>

      {paginas > 1 ? (
        <nav className="mt-5 flex items-center justify-center gap-3 text-sm">
          {p > 1 ? (
            <a href={`/bitacora?pagina=${p - 1}`} className="btn-secundario px-3 py-2 text-xs">
              ← Anterior
            </a>
          ) : null}
          <span className="text-tinta/55">
            Página {p} de {paginas}
          </span>
          {p < paginas ? (
            <a href={`/bitacora?pagina=${p + 1}`} className="btn-secundario px-3 py-2 text-xs">
              Siguiente →
            </a>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
