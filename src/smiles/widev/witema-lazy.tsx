"use client";

import dynamic from "next/dynamic";

/** WiTemaPicker cargado lazy en cliente — no bloquea FCP ni hidratación inicial */
const WiTemaPicker = dynamic(
  () => import("./witema-picker").then((m) => m.WiTemaPicker),
  { ssr: false }
);

export function WiTemaPickerLazy() {
  return <WiTemaPicker />;
}
