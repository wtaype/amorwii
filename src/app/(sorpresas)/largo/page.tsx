"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import SorpresaView, { type SorpresaData } from "../sorpresas";

function LargoContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<SorpresaData | null>(null);

  useEffect(() => {
    const p = searchParams;
    const PLANTILLAS_IDS = ["Amor1", "Amor2", "Cumple1"];
    const keys = Array.from(p.keys());
    
    const pl = keys.find(k => PLANTILLAS_IDS.includes(k));
    if (pl) {
      const dec = (k: string) => decodeURIComponent((p.get(k) || "").replace(/\+/g, " "));
      setData({
        de: dec("de"),
        para: dec("para"),
        msg: dec("msg"),
        plantilla: pl,
        fondo: p.get("f") || "1",
        efectoId: p.get("e") || "corazones",
        musicUrl: p.get("m") || "",
        fotos: [],
        activo: true
      });
    }
  }, [searchParams]);

  if (!data) return <div style={{ height: '100vh', background: '#111' }} />;

  return <SorpresaView data={data} />;
}

export default function LargoPage() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', background: '#111' }} />}>
            <LargoContent />
        </Suspense>
    );
}
