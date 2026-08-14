import Link from "next/link";

import { exigirSesion } from "@/lib/auth";
import { puede, ETIQUETA_ROL, type Permiso } from "@/lib/rbac";
import { Marca } from "@/components/Marca";
import { salir } from "./acciones";
import { NavPrincipal } from "./nav";

const MENU: { href: string; texto: string; permiso: Permiso }[] = [
  { href: "/panel", texto: "Panel", permiso: "reportes.ver" },
  { href: "/corte", texto: "Cobro del día", permiso: "corte.dia" },
  { href: "/cobranza", texto: "Cobranza", permiso: "cobranza.ver" },
  { href: "/clientas", texto: "Clientas", permiso: "clientas.ver" },
  { href: "/creditos", texto: "Créditos", permiso: "creditos.ver" },
  { href: "/grupos", texto: "Grupos", permiso: "grupos.ver" },
  { href: "/usuarios", texto: "Usuarios", permiso: "usuarios.ver" },
  { href: "/bitacora", texto: "Bitácora", permiso: "auditoria.ver" },
];

export default async function LayoutSistema({ children }: { children: React.ReactNode }) {
  const { usuario } = await exigirSesion();
  const menu = MENU.filter((m) => puede(usuario.rol, m.permiso));

  const iniciales = usuario.nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-niebla bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="shrink-0" aria-label="Inicio">
            <Marca ancho={104} prioridad />
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-patrimonio">{usuario.nombre}</p>
              <p className="text-xs text-tinta/55">{ETIQUETA_ROL[usuario.rol]}</p>
            </div>
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-patrimonio text-sm font-bold text-white"
              aria-hidden
            >
              {iniciales}
            </div>
            <form action={salir}>
              <button type="submit" className="btn-fantasma px-3 py-2 text-xs">
                Salir
              </button>
            </form>
          </div>
        </div>

        {menu.length > 1 ? <NavPrincipal items={menu.map(({ href, texto }) => ({ href, texto }))} /> : null}
      </header>

      <main className="marca-agua mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>

      <footer className="border-t border-niebla px-4 py-6 text-center text-xs text-tinta/40">
        Mujeres Unidas · Sistema interno de control de crédito
      </footer>
    </div>
  );
}
