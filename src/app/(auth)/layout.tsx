import type { ReactNode } from "react";
import { PrincipalShell } from "@/smiles/principal";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <PrincipalShell>
      <section>{children}</section>
    </PrincipalShell>
  );
}
