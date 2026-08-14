import Image from "next/image";

type Props = {
  variante?: "principal" | "invertido" | "monocromatico";
  ancho?: number;
  className?: string;
  prioridad?: boolean;
};

const ARCHIVOS = {
  principal: "/brand/um-principal.png",
  invertido: "/brand/um-invertido.png",
  monocromatico: "/brand/um-monocromatico.png",
} as const;

/**
 * Logotipo institucional. El manual pide conservar proporción y al menos 1M
 * de aire alrededor, así que el componente nunca deforma ni recorta.
 */
export function Marca({ variante = "principal", ancho = 140, className, prioridad }: Props) {
  return (
    <Image
      src={ARCHIVOS[variante]}
      alt="Mujeres Unidas"
      width={ancho}
      height={Math.round(ancho * 0.62)}
      className={className}
      style={{ width: ancho, height: "auto" }}
      priority={prioridad}
    />
  );
}
