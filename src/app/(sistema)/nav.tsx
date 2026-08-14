"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavPrincipal({ items }: { items: { href: string; texto: string }[] }) {
  const ruta = usePathname();

  return (
    <nav className="scroll-suave overflow-x-auto border-t border-niebla/70">
      <ul className="mx-auto flex max-w-7xl gap-1 px-2 sm:px-4">
        {items.map((it) => {
          const activo = ruta === it.href || ruta.startsWith(`${it.href}/`);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={activo ? "page" : undefined}
                className={`block whitespace-nowrap border-b-2 px-3.5 py-3 text-sm font-medium transition ${
                  activo
                    ? "border-oro text-patrimonio"
                    : "border-transparent text-tinta/60 hover:text-patrimonio"
                }`}
              >
                {it.texto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
