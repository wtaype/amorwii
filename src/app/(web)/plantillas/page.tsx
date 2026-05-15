import type { Metadata } from "next";
import Link from "next/link";
import { app } from "@/smiles/wii";
import { plantillas } from "@/smiles/plantillas";

export const metadata: Metadata = {
  title: `Plantillas de Mensajes`,
  description: `Descubre las ${Object.keys(plantillas).length} plantillas de ${app}: amor, amistad, aniversario, carta, declaración y más. Cada una con diseño único y música opcional.`,
};

export default function PlantillasPage() {
  const items = Object.values(plantillas);
  return (
    <section className="wi_page">
      <div className="wi_hero">
        <span className="wi_tag"><i className="fas fa-layer-group" aria-hidden="true"></i> Plantillas</span>
        <h1>Elige tu Plantilla Perfecta</h1>
        <p>Cada plantilla tiene un diseño <strong>único</strong>, colores y música opcional para hacer tu mensaje inolvidable.</p>
      </div>
      <div className="wi_grid">
        {items.map((pl) => (
          <Link key={pl.id} href={`/crear?plantilla=${pl.id}`} className="wi_card" style={{ borderTop: `3px solid ${pl.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1vh" }}>
              <span style={{ fontSize: "var(--fz_l2)" }}>{pl.emoji}</span>
              <strong>{pl.id}</strong>
            </div>
            <p>{pl.descripcion}</p>
            <span style={{ fontSize: "var(--fz_s4)", color: pl.color, fontWeight: 600 }}>
              <i className={`fas ${pl.icono}`} aria-hidden="true"></i> {pl.categoria}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
