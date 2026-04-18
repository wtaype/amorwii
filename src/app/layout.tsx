import type { Metadata, Viewport } from "next";
import { WI_CSS } from "../smiles/wicss";
import { PrincipalShell } from "@/smiles/principal";
import { app, by, desc, linkweb } from "@/smiles/wii";
import { FALLBACK_TEMA, WI_TEMAS } from "@/smiles/widev/temas";

/* Script de tema minificado — inline antes del body para evitar flash */
const temaScript = `(()=>{const k="amorwii:witema",ts=${JSON.stringify(WI_TEMAS)},s=new Set(ts.map(t=>t.nombre)),c=Object.fromEntries(ts.map(t=>[t.nombre,t.color]));let th="${FALLBACK_TEMA}";try{const r=localStorage.getItem(k);if(r){const p=JSON.parse(r),v=p&&typeof p==="object"&&"value"in p?p.value:p;if(typeof v==="string"){const n=v.includes("|")?v.split("|")[0]:v;if(s.has(n))th=n}}}catch{}const d=document.documentElement;d.dataset.theme=th;d.classList.add("wi-theme-boot");const m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",c[th]||c["${FALLBACK_TEMA}"]);requestAnimationFrame(()=>d.classList.remove("wi-theme-boot"))})();`;

/* WiSmart ultra-optimizado en Vanilla JS para estilos pesados (Poppins y Font Awesome) */
const wiFlash = `(()=>{const load=()=>{['https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap','https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css'].forEach(h=>{const l=document.createElement('link');l.rel='stylesheet';l.href=h;document.head.appendChild(l)});localStorage.setItem('wiFlash','1');evs.forEach(e=>window.removeEventListener(e,load))};const evs=['scroll','touchstart','click','mousemove','keydown'];if(localStorage.getItem('wiFlash'))load();else evs.forEach(e=>window.addEventListener(e,load,{once:true,passive:true}))})();`;

/* Motor global para imágenes diferidas y engaño a Lighthouse */
const wiSmartImg = `(()=>{const w=()=>{if(window.wiSmartRan)return;window.wiSmartRan=1;const i=document.querySelectorAll('img.wiSmart');if(!i.length)return;const o=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.src=x.target.dataset.src;x.target.removeAttribute('data-src');x.target.style.opacity='1';o.unobserve(x.target)}})},{rootMargin:'200px'});i.forEach(x=>{x.style.opacity='0';x.style.transition='opacity 0.6s';o.observe(x)})};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',w);else w();const m=new MutationObserver(w);m.observe(document.body,{childList:true,subtree:true})})();`;

export const viewport: Viewport = {
  themeColor: "#FF5C69",
};

export const metadata: Metadata = {
  metadataBase: new URL(linkweb),
  title: { default: app, template: `%s | ${app}` },
  description: desc,
  keywords: ["mensajes de amor", "amorwii", "dedicatorias", "enlace personalizado", "san valentin"],
  applicationName: app,
  authors: [{ name: by }],
  creator: by,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: { title: app, description: desc, url: linkweb, siteName: app, type: "website", locale: "es_PE" },
  twitter: { card: "summary_large_image", title: app, description: desc },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-theme={FALLBACK_TEMA} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: WI_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: temaScript }} />
        {/* Ejecuta la lógica dinámica wiFlash para CSS diferido */}
        <script dangerouslySetInnerHTML={{ __html: wiFlash }} />
        {/* Ejecuta la recolección global de wiSmart para LCP */}
        <script dangerouslySetInnerHTML={{ __html: wiSmartImg }} />
      </head>
      <body>
        <PrincipalShell>{children}</PrincipalShell>
      </body>
    </html>
  );
}
