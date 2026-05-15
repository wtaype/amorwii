import type { ReactNode } from "react";
import { WiFooter } from "./footer";
import { WiHeader } from "./header";
import { LoginView } from "./login";
import { WiTemaPicker } from "./widev/witema-picker";
import { WiSmart } from "./widev/wismart";

export function PrincipalShell({ children }: { children: ReactNode }) {
  return (
    <div className="wi_shell">
      <a href="#wiMain" className="wi_skip">Ir al contenido</a>
      <WiHeader />
      <main id="wiMain" className="wi_main">{children}</main>
      <WiFooter />
      <WiSmart><WiTemaPicker /></WiSmart>
      <LoginView />
    </div>
  );
}
