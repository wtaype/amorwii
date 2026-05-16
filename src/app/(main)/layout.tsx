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
  title: "AmorWii | Mensajes de Amor Personalizados",
  description: "Crea mensajes de amor personalizados para San Valentín, aniversarios y fechas especiales.",
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true }, // Sobreescribe el root (privado por defecto)
};

export const viewport: Viewport = {
  themeColor: THEMES.find(t => t.name === wii.color)?.color || "#FF5C69",
};

const themeScript = `(function(){try{var t=localStorage.getItem('wiTema');if(t){var p=t.split('|');document.documentElement.setAttribute('data-theme',p[0]);var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=p[1]}else{document.documentElement.setAttribute('data-theme','${wii.color}')}}catch(e){}})();`;

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
    <div className={`${poppins.variable} ${outfit.variable}`}>
      <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      <Mensaje />
      <Notificacion />
      <Header perfilInicial={perfilInicial} />
      <main id="wimain">{children}</main>
      <Footer />
      <Witema themes={THEMES} />
    </div>
  );
}
