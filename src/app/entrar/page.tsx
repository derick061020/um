import { redirect } from "next/navigation";

import { sesionActual } from "@/lib/auth";
import { rutaInicio } from "@/lib/rbac";
import { Marca } from "@/components/Marca";
import { FormularioEntrar } from "./formulario";

export const metadata = { title: "Entrar" };

export default async function PaginaEntrar() {
  const sesion = await sesionActual();
  if (sesion) redirect(rutaInicio(sesion.usuario.rol));

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Lado editorial — verde patrimonio con la curva del lenguaje gráfico. */}
      <aside className="relative hidden overflow-hidden bg-patrimonio px-14 py-16 lg:flex lg:flex-col lg:justify-between">
        <Marca variante="invertido" ancho={170} prioridad />
        <div className="relative z-10 max-w-md">
          <p className="font-display text-4xl leading-tight text-white">
            Crédito que impulsa
          </p>
          <p className="mt-4 font-serif text-lg text-salvia">
            Confianza, unión y crecimiento.
          </p>
          <p className="mt-8 text-sm leading-relaxed text-white/60">
            Control de grupos, clientas, avales y cobranza semanal. Cada movimiento queda
            registrado con la persona que lo capturó.
          </p>
        </div>
        <p className="relative z-10 text-xs uppercase tracking-[0.2em] text-white/35">
          Mujeres Unidas · Sistema interno
        </p>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-24 h-[34rem] w-[34rem] rounded-full bg-crecimiento/40 blur-[2px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full border-[3rem] border-crecimiento/25"
        />
      </aside>

      <section className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <div className="mb-9 lg:hidden">
            <Marca ancho={150} prioridad />
          </div>
          <h1 className="font-display text-3xl text-patrimonio">Entrar al sistema</h1>
          <p className="mt-1.5 text-sm text-tinta/60">
            Usa el usuario y la contraseña que te dio la dirección.
          </p>
          <FormularioEntrar />
        </div>
      </section>
    </main>
  );
}
