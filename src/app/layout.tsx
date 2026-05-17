// Root Layout — Mínimo y universal
// Solo lo que CUALQUIER página necesita: HTML skeleton + iconos

import * as wii from "@/app/wii";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Script síncrono bloqueante para aplicar el tema de forma instantánea y prevenir destellos (FOUC)
  const themeScript = `(function(){try{var t=localStorage.getItem('wiTema');if(t){var p=t.split('|');document.documentElement.setAttribute('data-theme',p[0]);var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=p[1]}else{document.documentElement.setAttribute('data-theme','${wii.color}')}}catch(e){}})();`;

  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* FontAwesome 7 — disponible para todas las rutas */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
          integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
