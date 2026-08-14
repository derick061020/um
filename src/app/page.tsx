import { redirect } from "next/navigation";

import { sesionActual } from "@/lib/auth";
import { rutaInicio } from "@/lib/rbac";

export default async function Raiz() {
  const sesion = await sesionActual();
  redirect(sesion ? rutaInicio(sesion.usuario.rol) : "/entrar");
}
