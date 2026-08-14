import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { puede, ETIQUETA_ROL, DESCRIPCION_ROL } from "@/lib/rbac";
import { Titulo, Tarjeta, Insignia, Vacio } from "@/components/ui";
import { FormularioAccion } from "@/components/FormularioAccion";
import { Campo, Selector, Rejilla } from "@/components/campos";
import { crearUsuario } from "./acciones";
import { AccionesUsuario } from "./acciones-fila";

export const metadata = { title: "Usuarios" };

export default async function PaginaUsuarios() {
  const sesion = await exigirPermiso("usuarios.ver");
  const puedeCrear = puede(sesion.usuario.rol, "usuarios.crear");
  const puedeEditar = puede(sesion.usuario.rol, "usuarios.editar");

  const usuarios = await db.usuario.findMany({
    orderBy: [{ activo: "desc" }, { rol: "asc" }, { nombre: "asc" }],
    select: {
      id: true,
      nombre: true,
      usuario: true,
      rol: true,
      activo: true,
      telefono: true,
      creadoEn: true,
      creadoPor: { select: { nombre: true } },
    },
  });

  return (
    <>
      <Titulo sub="Cada persona entra con su propio usuario. Todos los movimientos quedan firmados con su nombre.">
        Usuarios del sistema
      </Titulo>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Tarjeta titulo={`${usuarios.length} ${usuarios.length === 1 ? "cuenta" : "cuentas"}`}>
          {usuarios.length === 0 ? (
            <Vacio>Todavía no hay usuarios registrados.</Vacio>
          ) : (
            <div className="scroll-suave overflow-x-auto">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    {puedeEditar ? <th className="text-right">Acciones</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <p className="font-medium text-patrimonio">{u.nombre}</p>
                        {u.telefono ? <p className="text-xs text-tinta/50">{u.telefono}</p> : null}
                      </td>
                      <td className="font-mono text-xs text-tinta/70">{u.usuario}</td>
                      <td>
                        <Insignia tono={u.rol === "PRINCIPAL" ? "tinta" : "verde"}>
                          {ETIQUETA_ROL[u.rol]}
                        </Insignia>
                      </td>
                      <td>
                        {u.activo ? (
                          <Insignia tono="verde">Activa</Insignia>
                        ) : (
                          <Insignia tono="rojo">Inactiva</Insignia>
                        )}
                      </td>
                      {puedeEditar ? (
                        <td className="text-right">
                          <AccionesUsuario
                            id={u.id}
                            nombre={u.nombre}
                            activo={u.activo}
                            esYo={u.id === sesion.usuario.id}
                          />
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Tarjeta>

        {puedeCrear ? (
          <Tarjeta titulo="Nuevo usuario">
            <div className="p-5">
              <FormularioAccion accion={crearUsuario} textoBoton="Crear usuario">
                <div className="space-y-4">
                  <Campo etiqueta="Nombre completo" nombre="nombre" requerido />
                  <Rejilla>
                    <Campo
                      etiqueta="Usuario"
                      nombre="usuario"
                      requerido
                      ayuda="Sin espacios ni acentos."
                      placeholder="viridiana"
                    />
                    <Campo etiqueta="Teléfono" nombre="telefono" inputMode="tel" placeholder="6691234567" />
                  </Rejilla>
                  <Campo
                    etiqueta="Contraseña"
                    nombre="password"
                    tipo="password"
                    requerido
                    ayuda="Mínimo 8 caracteres. La persona puede cambiarla después."
                  />
                  <Selector
                    etiqueta="Rol"
                    nombre="rol"
                    requerido
                    opciones={(["SUPERVISOR", "CAPTURISTA", "ENCARGADA", "PRINCIPAL"] as const).map((r) => ({
                      valor: r,
                      texto: ETIQUETA_ROL[r],
                    }))}
                  />
                </div>
              </FormularioAccion>

              <dl className="mt-7 space-y-3 border-t border-niebla pt-5">
                {(["PRINCIPAL", "SUPERVISOR", "CAPTURISTA", "ENCARGADA"] as const).map((r) => (
                  <div key={r}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-patrimonio/70">
                      {ETIQUETA_ROL[r]}
                    </dt>
                    <dd className="text-xs leading-relaxed text-tinta/55">{DESCRIPCION_ROL[r]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Tarjeta>
        ) : null}
      </div>
    </>
  );
}
