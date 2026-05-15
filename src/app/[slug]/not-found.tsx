import type { Metadata } from "next";
import Link from "next/link";
import { app } from "@/smiles/wii";

export const metadata: Metadata = {
  title: `Mensaje no encontrado | ${app}`,
  description: "El mensaje que buscas no existe o fue eliminado.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="dpvc" style={{ minHeight: "80vh", gap: "2vh" }}>
      <span style={{ fontSize: "8vh" }}>💔</span>
      <h1 style={{ fontSize: "var(--fz_l2)", color: "var(--tx)" }}>Mensaje no encontrado</h1>
      <p style={{ color: "var(--tx3)", fontSize: "var(--fz_m2)" }}>
        El enlace es inválido o el mensaje fue eliminado
      </p>
      <div style={{ display: "flex", gap: "1.5vh", marginTop: "2vh", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/crear" className="wi_btn primary">
          <i className="fas fa-plus" aria-hidden="true"></i> Crear mensaje
        </Link>
        <Link href="/" className="wi_btn secondary">
          <i className="fas fa-house" aria-hidden="true"></i> Ir al inicio
        </Link>
      </div>
    </div>
  );
}
