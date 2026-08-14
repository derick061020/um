import { db } from "@/lib/db";
import { exigirPermiso } from "@/lib/auth";
import { Titulo, Tarjeta, Migas } from "@/components/ui";
import { FormularioClienta } from "@/components/FormularioClienta";
import { crearClienta } from "../acciones";

export const metadata = { title: "Nueva clienta" };

export default async function PaginaNuevaClienta() {
  await exigirPermiso("clientas.crear");
  const grupos = await db.grupo.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });

  return (
    <>
      <Migas items={[{ href: "/clientas", texto: "Clientas" }, { texto: "Nueva" }]} />
      <Titulo sub="Captura los datos de la clienta y de su aval. Después podrás registrarle el crédito y escanear sus documentos.">
        Nueva clienta
      </Titulo>

      <Tarjeta className="max-w-3xl">
        <div className="p-6">
          <FormularioClienta accion={crearClienta} grupos={grupos} textoBoton="Guardar clienta" />
        </div>
      </Tarjeta>
    </>
  );
}
