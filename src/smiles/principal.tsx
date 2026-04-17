import type { ReactNode } from "react";
import { WiFooter } from "./footer";
import { WiHeader } from "./header";
import { WiTemaPicker } from "./widev/witema-picker";
import { WiSmart } from "./widev/wismart";

export function PrincipalShell({ children }: { children: ReactNode }) {
  return (
    <div className="wi_shell">
      <a href="#wiMain" className="wi_skip">
        Ir al contenido
      </a>
      <WiHeader />
      <main id="wiMain" className="wi_main">
        {children}
      </main>
      <WiFooter />
      {/* Componentes no críticos (Fuente y Tema) — se cargan diferidamente (interacción o caché) */}
      <WiSmart>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <WiTemaPicker />
      </WiSmart>
    </div>
  );
}
