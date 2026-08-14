import type { Cliente } from "@prisma/client";

import { FormularioAccion, type EstadoAccion } from "@/components/FormularioAccion";
import { Campo, Selector, AreaTexto, Rejilla, Seccion } from "@/components/campos";

/**
 * Formulario compartido por el alta y la edición de clientas.
 * El bloque del aval es parte del expediente: sin aval no se entrega crédito.
 */
export function FormularioClienta({
  accion,
  grupos,
  clienta,
  textoBoton,
}: {
  accion: (estado: EstadoAccion, form: FormData) => Promise<EstadoAccion>;
  grupos: { id: string; nombre: string }[];
  clienta?: Cliente;
  textoBoton: string;
}) {
  return (
    <FormularioAccion accion={accion} textoBoton={textoBoton} limpiarAlExito={false}>
      {clienta ? <input type="hidden" name="id" value={clienta.id} /> : null}

      <Seccion titulo="Datos de la clienta">
        <div className="space-y-4">
          <Rejilla>
            <Campo
              etiqueta="Nombre completo"
              nombre="nombre"
              requerido
              valor={clienta?.nombre}
              autoFocus={!clienta}
            />
            <Campo
              etiqueta="Teléfono"
              nombre="telefono"
              inputMode="tel"
              valor={clienta?.telefono}
              placeholder="6691234567"
            />
          </Rejilla>
          <Campo etiqueta="Domicilio" nombre="domicilio" valor={clienta?.domicilio} placeholder="Calle y número" />
          <Rejilla cols={3}>
            <Campo etiqueta="Colonia" nombre="colonia" valor={clienta?.colonia} />
            <Campo etiqueta="Ciudad" nombre="ciudad" valor={clienta?.ciudad} />
            <Campo
              etiqueta="CURP"
              nombre="curp"
              valor={clienta?.curp}
              maxLength={18}
              ayuda="Opcional, 18 caracteres."
            />
          </Rejilla>
          <Selector
            etiqueta="Grupo"
            nombre="grupoId"
            valor={clienta?.grupoId}
            opciones={grupos.map((g) => ({ valor: g.id, texto: g.nombre }))}
            vacio="— Sin grupo —"
          />
        </div>
      </Seccion>

      <Seccion titulo="Aval">
        <div className="space-y-4">
          <Rejilla>
            <Campo etiqueta="Nombre del aval" nombre="avalNombre" valor={clienta?.avalNombre} />
            <Campo
              etiqueta="Teléfono del aval"
              nombre="avalTelefono"
              inputMode="tel"
              valor={clienta?.avalTelefono}
            />
          </Rejilla>
          <Rejilla>
            <Campo
              etiqueta="Parentesco"
              nombre="avalParentesco"
              valor={clienta?.avalParentesco}
              placeholder="Esposo, hermana, vecina…"
            />
            <Campo etiqueta="Domicilio del aval" nombre="avalDomicilio" valor={clienta?.avalDomicilio} />
          </Rejilla>
          <Rejilla>
            <Campo etiqueta="Colonia del aval" nombre="avalColonia" valor={clienta?.avalColonia} />
            <Campo etiqueta="Ciudad del aval" nombre="avalCiudad" valor={clienta?.avalCiudad} />
          </Rejilla>
        </div>
      </Seccion>

      <Seccion titulo="Observaciones">
        <AreaTexto etiqueta="Notas internas" nombre="notas" valor={clienta?.notas} />
      </Seccion>
    </FormularioAccion>
  );
}
