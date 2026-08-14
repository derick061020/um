"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { entrar, type EstadoLogin } from "./acciones";
import { Aviso } from "@/components/ui";

function Boton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primario w-full" disabled={pending}>
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}

export function FormularioEntrar() {
  const [estado, accion] = useActionState<EstadoLogin, FormData>(entrar, {});

  return (
    <form action={accion} className="mt-8 space-y-4">
      {estado.error ? <Aviso tono="error">{estado.error}</Aviso> : null}

      <div>
        <label className="etiqueta" htmlFor="usuario">
          Usuario
        </label>
        <input
          id="usuario"
          name="usuario"
          className="campo"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          autoFocus
        />
      </div>

      <div>
        <label className="etiqueta" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="campo"
          autoComplete="current-password"
          required
        />
      </div>

      <Boton />
    </form>
  );
}
