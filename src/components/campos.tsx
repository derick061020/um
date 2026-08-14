import type { ReactNode } from "react";

export function Campo({
  etiqueta,
  nombre,
  tipo = "text",
  requerido,
  ayuda,
  valor,
  placeholder,
  inputMode,
  autoFocus,
  maxLength,
  alCambiar,
}: {
  etiqueta: string;
  nombre: string;
  tipo?: string;
  requerido?: boolean;
  ayuda?: ReactNode;
  valor?: string | number | null;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel";
  autoFocus?: boolean;
  maxLength?: number;
  /** Solo se pasa desde componentes de cliente. */
  alCambiar?: (valor: string) => void;
}) {
  return (
    <div>
      <label className="etiqueta" htmlFor={nombre}>
        {etiqueta}
        {requerido ? <span className="ml-1 text-oro">*</span> : null}
      </label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        className="campo"
        required={requerido}
        defaultValue={valor ?? undefined}
        placeholder={placeholder}
        inputMode={inputMode}
        autoFocus={autoFocus}
        maxLength={maxLength}
        onChange={alCambiar ? (e) => alCambiar(e.target.value) : undefined}
      />
      {ayuda ? <p className="ayuda">{ayuda}</p> : null}
    </div>
  );
}

export function Selector({
  etiqueta,
  nombre,
  opciones,
  requerido,
  ayuda,
  valor,
  vacio = "— Selecciona —",
}: {
  etiqueta: string;
  nombre: string;
  opciones: { valor: string; texto: string }[];
  requerido?: boolean;
  ayuda?: ReactNode;
  valor?: string | null;
  vacio?: string | null;
}) {
  return (
    <div>
      <label className="etiqueta" htmlFor={nombre}>
        {etiqueta}
        {requerido ? <span className="ml-1 text-oro">*</span> : null}
      </label>
      <select id={nombre} name={nombre} className="campo" required={requerido} defaultValue={valor ?? ""}>
        {vacio !== null ? <option value="">{vacio}</option> : null}
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
      {ayuda ? <p className="ayuda">{ayuda}</p> : null}
    </div>
  );
}

export function AreaTexto({
  etiqueta,
  nombre,
  ayuda,
  valor,
  filas = 3,
}: {
  etiqueta: string;
  nombre: string;
  ayuda?: ReactNode;
  valor?: string | null;
  filas?: number;
}) {
  return (
    <div>
      <label className="etiqueta" htmlFor={nombre}>
        {etiqueta}
      </label>
      <textarea id={nombre} name={nombre} rows={filas} className="campo" defaultValue={valor ?? undefined} />
      {ayuda ? <p className="ayuda">{ayuda}</p> : null}
    </div>
  );
}

export function Rejilla({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  const clases = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" }[cols];
  return <div className={`grid grid-cols-1 gap-4 ${clases}`}>{children}</div>;
}

export function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <fieldset className="mt-6 first:mt-0">
      <legend className="mb-3 font-serif text-base text-patrimonio">{titulo}</legend>
      {children}
    </fieldset>
  );
}
