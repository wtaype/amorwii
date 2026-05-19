// (main) Layout — Experiencia pública completa
// SEO, tema, header, footer — solo para rutas de /crear, /, /blog, etc.
import { Poppins, Outfit } from "next/font/google";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Witema from "@/components/Witema";
import Mensaje from "@/components/Mensaje";
import Notificacion from "@/components/Notificacion";
import { createSupabaseServer } from "@/lib/supabaseServer";
import type { SmileNuevo } from "@/lib/tipos";
import * as wii from "@/app/wii";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

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

const THEMES = [
  { name: "Cielo", color: "#0EBEFF" },
  { name: "Dulce", color: "#FF5C69" },
  { name: "Paz", color: "#29C72E" },
  { name: "Oro", color: "#FFDA34" },
  { name: "Mora", color: "#7000FF" },
  { name: "Futuro", color: "#21273B" },
];

export const metadata: Metadata = {
  metadataBase: new URL(wii.linkweb),
  title: {
    default: wii.titulo,
    template: `%s | ${wii.app}`
  },
  description: wii.descri,
  keywords: wii.keywii,
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: wii.titulo,
    description: wii.descri,
    url: "./",
    siteName: wii.app,
    locale: "es_ES",
    type: "website",
    images: [{
      url: "/poster.webp",
      width: 1200,
      height: 630,
      alt: `${wii.app} — Comparte hermosos mensajes de amor`
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: wii.titulo,
    description: wii.descri,
    images: ["/poster.webp"],
    creator: "@wilder.taype"
  },
  other: {
    "google-adsense-account": "ca-pub-1362457560630815",
  }
};

export const viewport: Viewport = {
  themeColor: THEMES.find(t => t.name === wii.color)?.color || "#FF5C69",
};

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // Perfil del usuario en servidor — cero parpadeo en Header
  let perfilInicial: SmileNuevo | null = null;
  try {
    const sb = await createSupabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    if (user?.email) {
      const { data } = await sb.from("smiles").select("*").eq("email", user.email).maybeSingle();
      perfilInicial = data ?? null;
    }
  } catch { /* sin sesión activa */ }

  return (
    <AuthProvider>
      <div className={`${poppins.variable} ${outfit.variable}`}>
        <Mensaje />
        <Notificacion />
        <Header perfilInicial={perfilInicial} />
        <main id="wimain">{children}</main>
        <Footer />
        <Witema themes={THEMES} />
      </div>
    </AuthProvider>
  );
}
