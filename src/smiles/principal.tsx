import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { WiHeader } from "./header";
import { WiSmart } from "./widev/wismart";

const WiFooter = dynamic(() => import("./footer").then((m) => m.WiFooter));
const WiTemaPicker = dynamic(() => import("./widev/witema-picker").then((m) => m.WiTemaPicker));

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
      <WiSmart>
        <WiFooter />
        <WiTemaPicker />
      </WiSmart>
    </div>
  );
}
