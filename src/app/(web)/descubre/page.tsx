import type { Metadata } from "next";
import Link from "next/link";
import { app } from "@/smiles/wii";

export const metadata: Metadata = {
  title: `Descubre ${app}`,
  description: `Explora todo lo que ${app} tiene para ti: plantillas de amor, QR cards, mensajes personalizados, música y más. 100% gratis.`,
};

const FEATURES = [
  { ico: "fa-heart", t: "8 Plantillas Únicas", d: "Amor, amistad, aniversario, carta, declaración, saludo y más" },
  { ico: "fa-palette", t: "Diseños Profesionales", d: "Cada plantilla con colores, animaciones y tipografía premium" },
  { ico: "fa-music", t: "Música de Fondo", d: "Añade canciones para hacer tu mensaje aún más emotivo" },
  { ico: "fa-link", t: "Enlaces Únicos", d: "Cada mensaje tiene su propia URL personalizada para compartir" },
  { ico: "fa-qrcode", t: "QR Cards", d: "Genera tarjetas QR con tu fondo personalizado para imprimir" },
  { ico: "fa-share-nodes", t: "Compartir Fácil", d: "Envía por WhatsApp, Telegram o copia el enlace al instante" },
  { ico: "fa-mobile-screen", t: "100% Responsive", d: "Perfecto en móvil, tablet y escritorio" },
  { ico: "fa-lock", t: "Privado y Seguro", d: "Solo quien tiene tu enlace puede ver el mensaje" },
];

export default function DescubrePage() {
  return (
    <section className="wi_page">
      <div className="wi_hero">
        <span className="wi_tag"><i className="fas fa-gauge" aria-hidden="true"></i> Descubre</span>
        <h1>Todo lo que {app} puede hacer por ti</h1>
        <p>Una plataforma <strong>gratuita</strong> para expresar tus sentimientos de forma única y especial.</p>
        <div className="wi_btns">
          <Link href="/crear" className="wi_btn primary"><i className="fas fa-wand-magic-sparkles" aria-hidden="true"></i> Crear Mensaje</Link>
          <Link href="/plantillas" className="wi_btn secondary"><i className="fas fa-layer-group" aria-hidden="true"></i> Ver Plantillas</Link>
        </div>
      </div>
      <div className="wi_grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="wi_card">
            <div style={{ fontSize: "var(--fz_l2)", color: "var(--mco)" }}>
              <i className={`fas ${f.ico}`} aria-hidden="true"></i>
            </div>
            <strong>{f.t}</strong>
            <p>{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
