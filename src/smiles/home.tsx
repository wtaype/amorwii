import Link from "next/link";
import { app } from "./wii";
import s from "../app/page.module.css";

export function HomeView() {
  return (
    <section className={s.wi_page}>
      <div className={s.wi_hero}>
        <span className={s.wi_tag}>Nueva base profesional</span>
        <h1>{app}: rapido, limpio y sin parpadeo de tema</h1>
        <p>
          Ya dejamos activa la base de estilos globales + locales, el sistema
          <strong> widev</strong> modular y el guardado de tema en localStorage.
          Desde aqui puedes seguir con login, creador y paneles.
        </p>

        <div className={s.wi_btns}>
          <Link href="/crear" className={`${s.wi_btn} ${s.primary}`}>
            Crear mensaje
          </Link>
          <Link href="/ejemplos" className={`${s.wi_btn} ${s.secondary}`}>
            Ver ejemplos
          </Link>
        </div>

        <div className={s.wi_grid}>
          <article className={s.wi_card}>
            <strong>CSS estable</strong>
            <p>Tokens por tema + clases base para mantener orden y velocidad.</p>
          </article>
          <article className={s.wi_card}>
            <strong>Theme sin flash</strong>
            <p>Inicializacion inline antes de hidratar para evitar parpadeo.</p>
          </article>
          <article className={s.wi_card}>
            <strong>widev modular</strong>
            <p>Local, tema, vista, formato y generales separados por archivo.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
