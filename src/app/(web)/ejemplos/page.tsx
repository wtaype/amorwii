import type { Metadata } from "next";
import Link from "next/link";
import { app } from "@/smiles/wii";
import { plantillas } from "@/smiles/plantillas";

export const metadata: Metadata = {
  title: `Ejemplos de Mensajes`,
  description: `Inspírate con ejemplos reales de mensajes de amor creados con ${app}. Dedicatorias, declaraciones, cartas y más.`,
};

export default function EjemplosPage() {
  const items = Object.values(plantillas);
  return (
    <section className="wi_page">
      <div className="wi_hero">
        <span className="wi_tag"><i className="fas fa-sparkles" aria-hidden="true"></i> Ejemplos</span>
        <h1>Inspírate con Ejemplos Reales</h1>
        <p>Mensajes listos para <strong>personalizar</strong>. Haz clic en uno para crear el tuyo.</p>
      </div>
      <div className="wi_grid">
        {items.map((pl) => (
          <Link key={pl.id} href={`/crear?plantilla=${pl.id}`} className="wi_card">
            <div style={{ display: "flex", alignItems: "center", gap: "1vh", marginBottom: "0.5vh" }}>
              <span style={{ fontSize: "var(--fz_l1)" }}>{pl.emoji}</span>
              <span style={{ fontSize: "var(--fz_s4)", color: pl.color, fontWeight: 700, background: `${pl.color}1a`, padding: "0.3vh 1vh", borderRadius: "50px" }}>
                {pl.id}
              </span>
            </div>
            <p style={{ fontStyle: "italic", lineHeight: 1.6 }}>&ldquo;{pl.ejemplo}&rdquo;</p>
            <span style={{ fontSize: "var(--fz_s4)", color: "var(--mco)", fontWeight: 600 }}>
              <i className="fas fa-eye" aria-hidden="true"></i> Crear similar
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
