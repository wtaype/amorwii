import type { ReactNode } from "react";
import { PrincipalShell } from "@/smiles/principal";

export default function WebLayout({ children }: { children: ReactNode }) {
  return <PrincipalShell>{children}</PrincipalShell>;
}
