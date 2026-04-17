import Link from "next/link";
import { app } from "./wii";

export function HomeView() {
  return (
    <section className="wi_page">
      <div className="wi_hero">
        <span className="wi_tag">Nueva base profesional</span>
        <h1>{app}: rapido, limpio y sin parpadeo de tema</h1>
        <p>
          Ya dejamos activa la base de estilos globales + locales, el sistema
          <strong> widev</strong> modular y el guardado de tema en localStorage.
          Desde aqui puedes seguir con login, creador y paneles.
        </p>

        <div className="wi_btns">
          <Link href="/crear" className="wi_btn primary">
            Crear mensaje
          </Link>
          <Link href="/ejemplos" className="wi_btn secondary">
            Ver ejemplos
          </Link>
        </div>

        <div className="wi_grid">
          <article className="wi_card">
            <strong>CSS estable</strong>
            <p>Tokens por tema + clases base para mantener orden y velocidad.</p>
          </article>
          <article className="wi_card">
            <strong>Theme sin flash</strong>
            <p>Inicializacion inline antes de hidratar para evitar parpadeo.</p>
          </article>
          <article className="wi_card">
            <strong>widev modular</strong>
            <p>Local, tema, vista, formato y generales separados por archivo.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
