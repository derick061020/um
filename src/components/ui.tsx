import Link from "next/link";
import type { ReactNode } from "react";

export function Titulo({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl leading-tight text-patrimonio sm:text-4xl">{children}</h1>
      {sub ? <p className="mt-1.5 max-w-2xl text-sm text-tinta/65">{sub}</p> : null}
    </div>
  );
}

export function Tarjeta({
  titulo,
  accion,
  children,
  className = "",
}: {
  titulo?: ReactNode;
  accion?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`tarjeta ${className}`}>
      {titulo ? (
        <header className="flex items-center justify-between gap-3 border-b border-niebla px-5 py-3.5">
          <h2 className="font-serif text-lg text-patrimonio">{titulo}</h2>
          {accion}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function Dato({ etiqueta, valor }: { etiqueta: string; valor: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-patrimonio/60">{etiqueta}</dt>
      <dd className="mt-0.5 text-sm text-tinta">{valor || <span className="text-tinta/35">—</span>}</dd>
    </div>
  );
}

const TONOS = {
  verde: "bg-crecimiento/10 text-crecimiento",
  oro: "bg-oro/20 text-[#7a6122]",
  rojo: "bg-riesgo/10 text-riesgo",
  neutro: "bg-niebla text-tinta/70",
  tinta: "bg-patrimonio text-white",
} as const;

export function Insignia({
  children,
  tono = "neutro",
}: {
  children: ReactNode;
  tono?: keyof typeof TONOS;
}) {
  return <span className={`insignia ${TONOS[tono]}`}>{children}</span>;
}

export function Vacio({ children, accion }: { children: ReactNode; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <p className="max-w-sm text-sm text-tinta/55">{children}</p>
      {accion}
    </div>
  );
}

export function Aviso({
  tono = "info",
  children,
}: {
  tono?: "info" | "error" | "exito";
  children: ReactNode;
}) {
  const estilos = {
    info: "border-salvia bg-salvia/20 text-patrimonio",
    error: "border-riesgo/30 bg-riesgo/5 text-riesgo",
    exito: "border-crecimiento/30 bg-crecimiento/5 text-crecimiento",
  }[tono];
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${estilos}`} role={tono === "error" ? "alert" : undefined}>
      {children}
    </div>
  );
}

export function Migas({ items }: { items: { href?: string; texto: string }[] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-tinta/55">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 ? <span aria-hidden>/</span> : null}
          {it.href ? (
            <Link href={it.href} className="hover:text-patrimonio hover:underline">
              {it.texto}
            </Link>
          ) : (
            <span className="text-tinta/80">{it.texto}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
