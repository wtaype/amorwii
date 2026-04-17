import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "../smiles/wi.css";
import { PrincipalShell } from "@/smiles/principal";
import { app, by, desc, linkweb } from "@/smiles/wii";
import { FALLBACK_TEMA, WI_TEMAS } from "@/smiles/widev/temas";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const themeInitScript = `
(() => {
  const key = "amorwii:witema";
  const temas = ${JSON.stringify(WI_TEMAS)};
  const temaSet = new Set(temas.map(t => t.nombre));
  const colorMap = Object.fromEntries(temas.map(t => [t.nombre, t.color]));
  let theme = "${FALLBACK_TEMA}";
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      const value = parsed && typeof parsed === "object" && "value" in parsed ? parsed.value : parsed;
      if (typeof value === "string") {
        const onlyName = value.includes("|") ? value.split("|")[0] : value;
        if (temaSet.has(onlyName)) theme = onlyName;
      }
    }
  } catch {}
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.add("wi-theme-boot");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", colorMap[theme] || colorMap["${FALLBACK_TEMA}"]);
  requestAnimationFrame(() => root.classList.remove("wi-theme-boot"));
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(linkweb),
  title: {
    default: app,
    template: `%s | ${app}`,
  },
  description: desc,
  keywords: ["mensajes de amor", "amorwii", "dedicatorias", "enlace personalizado", "san valentin"],
  applicationName: app,
  authors: [{ name: by }],
  creator: by,
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: app,
    description: desc,
    url: linkweb,
    siteName: app,
    type: "website",
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: app,
    description: desc,
  },
};

export const viewport: Viewport = {
  themeColor: "#FF5C69",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-theme={FALLBACK_TEMA}
      suppressHydrationWarning
      className={`${poppins.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <PrincipalShell>{children}</PrincipalShell>
      </body>
    </html>
  );
}
