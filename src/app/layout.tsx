import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({
  variable: "--fuente-sans",
  display: "swap",
  src: [
    { path: "../../assets/fonts/DMSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../assets/fonts/DMSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../assets/fonts/DMSans-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const serifDisplay = localFont({
  variable: "--fuente-serif-display",
  display: "swap",
  src: [{ path: "../../assets/fonts/DMSerifDisplay-Regular.ttf", weight: "400", style: "normal" }],
});

const serifText = localFont({
  variable: "--fuente-serif-text",
  display: "swap",
  src: [{ path: "../../assets/fonts/DMSerifText-Regular.ttf", weight: "400", style: "normal" }],
});

export const metadata: Metadata = {
  title: {
    default: "Mujeres Unidas · Control de crédito",
    template: "%s · Mujeres Unidas",
  },
  description: "Sistema de control de crédito grupal de Mujeres Unidas.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/brand/um-principal.png", apple: "/brand/um-principal.png" },
};

export const viewport: Viewport = {
  themeColor: "#16402E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${sans.variable} ${serifDisplay.variable} ${serifText.variable}`}>
      <body>{children}</body>
    </html>
  );
}
