import type { Metadata, Viewport } from "next";
import { Poppins, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Witema from "@/components/Witema";
import Mensaje from "@/components/Mensaje";
import Notificacion from "@/components/Notificacion";
import * as wii from "@/app/wii";
import { createSupabaseServer } from "@/lib/supabaseServer";
import type { SmileNuevo } from "@/lib/tipos";

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AmorWii | Mensajes de Amor Personalizados",
  description: "Crea mensajes de amor personalizados para San Valentín, aniversarios y fechas especiales.",
  icons: {
    icon: "/favicon.ico",
  },
};

const THEMES = [
  { name: "Cielo", color: "#0EBEFF" },
  { name: "Dulce", color: "#FF5C69" },
  { name: "Paz", color: "#29C72E" },
  { name: "Oro", color: "#FFDA34" },
  { name: "Mora", color: "#7000FF" },
  { name: "Futuro", color: "#21273B" },
];

const defaultThemeColor = THEMES.find(t => t.name === wii.color)?.color || "#FF5C69";

export const viewport: Viewport = {
  themeColor: defaultThemeColor,
};

const themeScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('wiTema');
      if (savedTheme) {
        var parts = savedTheme.split('|');
        var name = parts[0];
        var color = parts[1];
        document.documentElement.setAttribute('data-theme', name);
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = color;
      } else {
        document.documentElement.setAttribute('data-theme', '${wii.color}');
      }
    } catch (e) {}
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ── Leer perfil en el servidor — cero parpadeo en el Header ────────────────
  let perfilInicial: SmileNuevo | null = null;
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      const { data } = await supabase
        .from("smiles")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();
      perfilInicial = data ?? null;
    }
  } catch { /* sin sesión activa — OK */ }
  return (
    <html lang="es" className={`${poppins.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
          integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Mensaje />
        <Notificacion />
        <Header perfilInicial={perfilInicial} />
        <div id="wimain">
          {children}
        </div>
        <Footer />
        <Witema themes={THEMES} />
      </body>
    </html>
  );
}
