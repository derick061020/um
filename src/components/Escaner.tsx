"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { subirDocumento } from "@/app/(sistema)/clientas/[id]/documentos";
import { opcionesDocumento } from "@/lib/documentos";
import { Aviso } from "@/components/ui";

type Estado = "inactivo" | "camara" | "revision" | "guardando";

const CALIDAD = 0.9;

/**
 * Escáner de documentos con la cámara de la tablet.
 *
 * Requiere contexto seguro (HTTPS o localhost) para acceder a la cámara;
 * si el navegador la niega, cae automáticamente al selector de archivo,
 * que en Android/iPad abre la cámara del sistema.
 */
export function Escaner({ clienteId }: { clienteId: string }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lienzoRef = useRef<HTMLCanvasElement>(null);
  const flujoRef = useRef<MediaStream | null>(null);

  const [estado, setEstado] = useState<Estado>("inactivo");
  const [tipo, setTipo] = useState("INE_FRENTE");
  const [captura, setCaptura] = useState<{ url: string; blob: Blob } | null>(null);
  const [realce, setRealce] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const opciones = opcionesDocumento();

  const detenerCamara = useCallback(() => {
    flujoRef.current?.getTracks().forEach((t) => t.stop());
    flujoRef.current = null;
  }, []);

  useEffect(() => detenerCamara, [detenerCamara]);

  async function abrirCamara() {
    setError(null);
    setOk(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Este navegador no permite abrir la cámara desde la página. Usa el botón “Elegir archivo”, que abre la cámara del sistema.",
      );
      return;
    }
    try {
      const flujo = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 2560 },
          height: { ideal: 1440 },
        },
        audio: false,
      });
      flujoRef.current = flujo;
      setEstado("camara");
      // El <video> se monta junto con el estado, por eso se asigna después.
      queueMicrotask(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = flujo;
          void videoRef.current.play();
        }
      });
    } catch (e) {
      const nombre = e instanceof DOMException ? e.name : "";
      setError(
        nombre === "NotAllowedError"
          ? "No diste permiso para usar la cámara. Actívalo en el candado de la barra de direcciones."
          : nombre === "NotFoundError"
            ? "No se encontró ninguna cámara en este dispositivo."
            : "No se pudo abrir la cámara. Usa “Elegir archivo” como alternativa.",
      );
    }
  }

  function cerrarCamara() {
    detenerCamara();
    setEstado("inactivo");
  }

  /** Aplica un realce de documento: escala de grises + más contraste. */
  function realzar(ctx: CanvasRenderingContext2D, ancho: number, alto: number) {
    const img = ctx.getImageData(0, 0, ancho, alto);
    const d = img.data;
    const contraste = 1.45;
    const centro = 128;
    for (let i = 0; i < d.length; i += 4) {
      const gris = 0.299 * d[i]! + 0.587 * d[i + 1]! + 0.114 * d[i + 2]!;
      const v = Math.max(0, Math.min(255, (gris - centro) * contraste + centro + 8));
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
    }
    ctx.putImageData(img, 0, 0);
  }

  async function capturar() {
    const video = videoRef.current;
    const lienzo = lienzoRef.current;
    if (!video || !lienzo || !video.videoWidth) return;

    lienzo.width = video.videoWidth;
    lienzo.height = video.videoHeight;
    const ctx = lienzo.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, lienzo.width, lienzo.height);
    if (realce) realzar(ctx, lienzo.width, lienzo.height);

    const blob = await new Promise<Blob | null>((r) => lienzo.toBlob(r, "image/jpeg", CALIDAD));
    if (!blob) {
      setError("No se pudo capturar la imagen. Intenta de nuevo.");
      return;
    }
    detenerCamara();
    setCaptura({ url: URL.createObjectURL(blob), blob });
    setEstado("revision");
  }

  function desdeArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    setOk(null);
    setCaptura({ url: URL.createObjectURL(f), blob: f });
    setEstado("revision");
    e.target.value = "";
  }

  function descartar() {
    if (captura) URL.revokeObjectURL(captura.url);
    setCaptura(null);
    setEstado("inactivo");
  }

  async function guardar() {
    if (!captura) return;
    setEstado("guardando");
    setError(null);

    const datos = new FormData();
    datos.set("clienteId", clienteId);
    datos.set("tipo", tipo);
    datos.set("archivo", new File([captura.blob], "escaneo.jpg", { type: "image/jpeg" }));

    try {
      const r = await subirDocumento({}, datos);
      if (r.error) {
        setError(r.error);
        setEstado("revision");
        return;
      }
      URL.revokeObjectURL(captura.url);
      setCaptura(null);
      setEstado("inactivo");
      setOk(r.exito ?? "Documento guardado.");
      router.refresh();
    } catch {
      setError("Se perdió la conexión al guardar. Revisa la red e intenta otra vez.");
      setEstado("revision");
    }
  }

  return (
    <div className="p-5">
      {error ? (
        <div className="mb-4">
          <Aviso tono="error">{error}</Aviso>
        </div>
      ) : null}
      {ok ? (
        <div className="mb-4">
          <Aviso tono="exito">{ok}</Aviso>
        </div>
      ) : null}

      <div className="mb-4">
        <label className="etiqueta" htmlFor="tipo-doc">
          Tipo de documento
        </label>
        <select
          id="tipo-doc"
          className="campo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          disabled={estado === "guardando"}
        >
          {opciones.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
      </div>

      {estado === "inactivo" ? (
        <div className="space-y-3">
          <button type="button" className="btn-primario w-full" onClick={abrirCamara}>
            Abrir cámara
          </button>
          <label className="btn-secundario w-full cursor-pointer">
            Elegir archivo o foto
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={desdeArchivo} />
          </label>
          <p className="ayuda">
            Coloca el documento sobre una superficie plana, sin sombras, y llena el recuadro.
          </p>
        </div>
      ) : null}

      {estado === "camara" ? (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg bg-tinta">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="block max-h-[60vh] w-full object-contain"
            />
            {/* Guía de encuadre */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-5 rounded-md border-2 border-dashed border-white/60"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-tinta/70">
            <input
              type="checkbox"
              checked={realce}
              onChange={(e) => setRealce(e.target.checked)}
              className="h-4 w-4 accent-[#16402E]"
            />
            Realzar el documento (blanco y negro con más contraste)
          </label>

          <div className="flex gap-3">
            <button type="button" className="btn-primario flex-1" onClick={capturar}>
              Capturar
            </button>
            <button type="button" className="btn-secundario" onClick={cerrarCamara}>
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      {estado === "revision" || estado === "guardando" ? (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={captura?.url}
            alt="Vista previa del documento capturado"
            className="max-h-[60vh] w-full rounded-lg border border-niebla object-contain"
          />
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-primario flex-1"
              onClick={guardar}
              disabled={estado === "guardando"}
            >
              {estado === "guardando" ? "Guardando…" : "Guardar en el expediente"}
            </button>
            <button
              type="button"
              className="btn-secundario"
              onClick={descartar}
              disabled={estado === "guardando"}
            >
              Repetir
            </button>
          </div>
        </div>
      ) : null}

      <canvas ref={lienzoRef} className="hidden" />
    </div>
  );
}
