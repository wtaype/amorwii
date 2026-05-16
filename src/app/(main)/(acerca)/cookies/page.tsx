import React from 'react';
import Showi from "@/components/Showi";
import { app } from "@/app/wii";
import "../acercas.css";

export const metadata = {
  title: `Política de Cookies | ${app}`,
  description: `Te explicamos qué cookies usamos en ${app} y cómo puedes gestionarlas.`,
};

export default function CookiesPage() {
  const anio = new Date().getFullYear();

  const TIPOS = [
    {
      ico: 'fa-shield-halved', color: '#0EBEFF', tag: 'Esencial',
      tit: 'Cookies de Sesión',
      desc: 'Necesarias para que AmorWii funcione correctamente.',
      items: ['Mantiene tu progreso en el creador de mensajes.', 'Recuerda si ya has visto ciertos avisos.', 'No pueden desactivarse sin afectar el funcionamiento de la app.'],
    },
    {
      ico: 'fa-hard-drive', color: '#29C72E', tag: 'Funcional',
      tit: 'Almacenamiento Local',
      desc: 'Almacenamiento en el navegador para una experiencia ultrarrápida.',
      items: ['Guarda tus plantillas favoritas localmente.', 'Recuerda tu tema visual preferido (Claro/Oscuro).', 'Acelera la carga de recursos multimedia.'],
    },
    {
      ico: 'fa-bullhorn', color: '#FF5C69', tag: 'Publicidad',
      tit: 'Google AdSense',
      desc: 'Usamos anuncios para mantener AmorWii gratuito para todos.',
      items: ['Google utiliza cookies para personalizar anuncios.', 'Basadas en tus intereses y navegación previa.', 'Puedes desactivarlas en la configuración de anuncios de Google.'],
    },
  ];

  const PASOS = [
    { ico: 'fa-chrome', color: '#0EBEFF', tit: 'Chrome / Edge', desc: 'Configuración → Privacidad y seguridad → Cookies y otros datos de sitios' },
    { ico: 'fa-firefox-browser', color: '#FF5C69', tit: 'Firefox', desc: 'Opciones → Privacidad y seguridad → Cookies y datos del sitio' },
    { ico: 'fa-safari', color: '#29C72E', tit: 'Safari', desc: 'Preferencias → Privacidad → Gestionar datos de sitios web' },
  ];

  return (
    <div className="ac_wrap tm_wrap">
      {/* ══ HERO ══ */}
      <section className="ac_hero">
        <div className="ac_hero_orb ac_orb1"></div>
        <div className="ac_hero_orb ac_orb2"></div>
        <div className="ac_hero_orb ac_orb3"></div>
        <Showi>
          <div className="ac_hero_body">
            <div className="ac_hero_badge"><i className="fas fa-cookie-bite"></i> Transparencia total</div>
            <h1 className="ac_hero_tit">Política de<br /><span className="ac_grad">Cookies</span></h1>
            <p className="ac_hero_sub">
              En {app}, te explicamos de forma sencilla qué cookies utilizamos y
              cómo puedes <strong>tener el control total sobre ellas.</strong>
            </p>
            <div className="tm_hero_chips">
              <span className="tm_chip"><i className="fas fa-cookie-bite"></i> 3 tipos de cookies</span>
              <span className="tm_chip"><i className="fas fa-user-shield"></i> Tú decides</span>
              <span className="tm_chip"><i className="fas fa-heart"></i> Sin sorpresas</span>
            </div>
            <div className="tm_last_upd">
              <i className="fas fa-calendar-check"></i>
              Última actualización: Mayo {anio}
            </div>
          </div>
        </Showi>
      </section>

      {/* ══ TIPOS ══ */}
      <section className="ac_sec">
        <Showi>
          <div className="ac_sec_head">
            <div className="ac_sec_badge"><i className="fas fa-list-check"></i> Detalles</div>
            <h2 className="ac_sec_tit">¿Qué cookies <span className="ac_grad">usamos?</span></h2>
            <p className="ac_sec_sub">Cada cookie tiene un propósito específico para mejorar tu experiencia</p>
          </div>
        </Showi>
        <div className="ck_grid">
          {TIPOS.map((t, i) => (
            <Showi key={i}>
              <div className="ck_card">
                <div className="ck_card_top">
                  <div className="tm_sec_ico" style={{ color: t.color }}><i className={`fas ${t.ico}`}></i></div>
                  <span className="ck_tag" style={{ color: t.color }}>{t.tag}</span>
                </div>
                <h3 className="ck_tit">{t.tit}</h3>
                <p className="ck_desc">{t.desc}</p>
                <ul className="tm_list">
                  {t.items.map((item, idx) => (
                    <li key={idx}><i className="fas fa-check"></i> {item}</li>
                  ))}
                </ul>
              </div>
            </Showi>
          ))}
        </div>
      </section>

      {/* ══ CONTROL ══ */}
      <section className="ac_sec ac_sec_alt">
        <Showi>
          <div className="ac_sec_head">
            <div className="ac_sec_badge"><i className="fas fa-sliders"></i> Control</div>
            <h2 className="ac_sec_tit">Cómo <span className="ac_grad">gestionar</span> tus cookies</h2>
            <p className="ac_sec_sub">Puedes borrar o bloquear cookies desde tu navegador en cualquier momento</p>
          </div>
        </Showi>
        <div className="ac_feat_grid">
          {PASOS.map((p, i) => (
            <Showi key={i}>
              <div className="ac_feat_card" style={{ borderColor: p.color }}>
                <div className="ac_feat_ico" style={{ color: p.color }}><i className={`fab ${p.ico}`}></i></div>
                <h3>{p.tit}</h3>
                <p>{p.desc}</p>
              </div>
            </Showi>
          ))}
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="ac_cta_sec">
        <Showi>
          <div className="ac_cta_wrap">
            <div className="ac_hero_orb ac_orb1"></div>
            <div className="ac_hero_orb ac_orb2"></div>
            <div className="ac_cta_glow"></div>
            <div className="ac_cta_inner">
              <span className="ac_cta_emoji">🍪</span>
              <h2>¿Dudas sobre tus cookies?</h2>
              <p>Estamos para ayudarte a entender mejor cómo funciona la plataforma.</p>
              <div className="ac_cta_btns">
                <a href="mailto:wilder.taype@hotmail.com" className="ac_btn_p ac_btn_lg">
                  <i className="fas fa-envelope"></i> Contactar Soporte
                </a>
              </div>
            </div>
          </div>
        </Showi>
      </section>
    </div>
  );
}
