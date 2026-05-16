// Root Layout — Mínimo y universal
// Solo lo que CUALQUIER página necesita: HTML skeleton + fuentes + iconos
import type { Metadata } from "next";
import { Poppins, Outfit } from "next/font/google";
import "@/app/(main)/globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// Meta base mínima — las rutas de (main) sobreescriben con metadata completa
export const metadata: Metadata = {
  robots: { index: false, follow: false }, // por defecto privado; (main) lo sobreescribe
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${poppins.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        {/* FontAwesome 7 — disponible para todas las rutas */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
          integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
