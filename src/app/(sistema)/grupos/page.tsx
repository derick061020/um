import Link from "next/link";

import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { puede } from "@/lib/rbac";
import { pesos } from "@/lib/dinero";
import { Titulo, Tarjeta, Insignia, Vacio } from "@/components/ui";
import { FormularioAccion } from "@/components/FormularioAccion";
import { Campo, Selector, AreaTexto } from "@/components/campos";
import { crearGrupo } from "./acciones";
import { BotonArchivar } from "./boton-archivar";

export const metadata = { title: "Grupos" };

export default async function PaginaGrupos() {
  const sesion = await exigirPermiso("grupos.ver");
  const puedeCrear = puede(sesion.usuario.rol, "grupos.crear");
  const puedeEditar = puede(sesion.usuario.rol, "grupos.editar");

  const [grupos, supervisores, encargadas] = await Promise.all([
    db.grupo.findMany({
      orderBy: [{ activo: "desc" }, { nombre: "asc" }],
      include: {
        supervisor: { select: { nombre: true } },
        encargada: { select: { nombre: true } },
        _count: { select: { clientas: true } },
        creditos: {
          where: { estado: "ACTIVO" },
          select: { montoTotal: true, abonos: { select: { montoPagado: true } } },
        },
      },
    }),
    db.usuario.findMany({
      where: { rol: { in: ["SUPERVISOR", "PRINCIPAL"] }, activo: true },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true },
    }),
    db.usuario.findMany({
      where: { rol: "ENCARGADA", activo: true },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true },
    }),
  ]);

  return (
    <>
      <Titulo sub="Cada grupo reúne a las clientas que cobran el mismo día. Ejemplos: VIRI 1, CHIHUAHUA 1.">
        Grupos
      </Titulo>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Tarjeta titulo={`${grupos.length} ${grupos.length === 1 ? "grupo" : "grupos"}`}>
          {grupos.length === 0 ? (
            <Vacio>Todavía no hay grupos. Crea el primero con el formulario de la derecha.</Vacio>
          ) : (
            <div className="scroll-suave overflow-x-auto">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Supervisor</th>
                    <th>Encargada</th>
                    <th className="text-right">Clientas</th>
                    <th className="text-right">Cartera activa</th>
                    {puedeEditar ? <th /> : null}
                  </tr>
                </thead>
                <tbody>
                  {grupos.map((g) => {
                    const saldo = g.creditos.reduce((s, c) => {
                      const pagado = c.abonos.reduce((x, a) => x + a.montoPagado, 0);
                      return s + Math.max(0, c.montoTotal - pagado);
                    }, 0);
                    return (
                      <tr key={g.id} className={g.activo ? "" : "opacity-55"}>
                        <td>
                          <Link
                            href={`/clientas?grupo=${g.id}`}
                            className="font-semibold text-patrimonio hover:underline"
                          >
                            {g.nombre}
                          </Link>
                          <p className="text-xs text-tinta/50">
                            {g.plaza ?? "Sin plaza"}
                            {g.activo ? "" : " · archivado"}
                          </p>
                        </td>
                        <td className="text-sm">{g.supervisor?.nombre ?? <span className="text-tinta/35">—</span>}</td>
                        <td className="text-sm">{g.encargada?.nombre ?? <span className="text-tinta/35">—</span>}</td>
                        <td className="text-right tabular-nums">{g._count.clientas}</td>
                        <td className="text-right tabular-nums font-medium text-patrimonio">{pesos(saldo)}</td>
                        {puedeEditar ? (
                          <td className="text-right">
                            <BotonArchivar id={g.id} activo={g.activo} />
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Tarjeta>

        {puedeCrear ? (
          <Tarjeta titulo="Nuevo grupo">
            <div className="p-5">
              <FormularioAccion accion={crearGrupo} textoBoton="Crear grupo">
                <div className="space-y-4">
                  <Campo
                    etiqueta="Nombre del grupo"
                    nombre="nombre"
                    requerido
                    placeholder="VIRI 1"
                    ayuda="Se guarda en mayúsculas."
                  />
                  <Campo etiqueta="Plaza o zona" nombre="plaza" placeholder="Mazatlán" />
                  <Selector
                    etiqueta="Supervisor"
                    nombre="supervisorId"
                    opciones={supervisores.map((u) => ({ valor: u.id, texto: u.nombre }))}
                    ayuda={
                      sesion.usuario.rol === "SUPERVISOR"
                        ? "Si lo dejas vacío, el grupo queda a tu cargo."
                        : undefined
                    }
                  />
                  <Selector
                    etiqueta="Encargada"
                    nombre="encargadaId"
                    opciones={encargadas.map((u) => ({ valor: u.id, texto: u.nombre }))}
                    ayuda="Verá el total a cobrar del día de este grupo."
                  />
                  <AreaTexto etiqueta="Notas" nombre="notas" />
                </div>
              </FormularioAccion>
            </div>
          </Tarjeta>
        ) : null}
      </div>
    </>
  );
}
