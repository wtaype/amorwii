import React from 'react';
import Showi from "@/components/Showi";
import { app } from "@/app/wii";
import "../acercas.css";

export const metadata = {
  title: `Feedback | ${app}`,
  description: `Ayúdanos a mejorar ${app}. Envía tus sugerencias, ideas o reporta errores.`,
};

export default function FeedbackPage() {
  const CANALES = [
    {
      ico: 'fa-github', color: '#24292e', bg: '#24292e', txt: '#fff',
      tit: 'GitHub Issues',
      desc: 'Reporta errores técnicos o solicita funciones directamente en nuestro repositorio.',
      url: 'https://github.com/wtaype',
      cta: 'Abrir un Issue'
    },
    {
      ico: 'fa-envelope', color: '#ff6b8a', bg: 'var(--wb)', txt: 'var(--tx)',
      tit: 'Correo Directo',
      desc: 'Escríbenos con tus comentarios, sugerencias o cualquier duda que tengas.',
      url: 'mailto:wilder.taype@hotmail.com',
      cta: 'Enviar correo'
    },
  ];

  const CATS = [
    { ico: 'fa-bug', color: '#FF5C69', tit: 'Reportar un error', desc: 'Algo no funciona como debería en el creador o plantillas.' },
    { ico: 'fa-lightbulb', color: '#ffd700', tit: 'Sugerir una idea', desc: 'Tienes una función en mente que mejoraría la experiencia.' },
    { ico: 'fa-palette', color: '#0EBEFF', tit: 'Nueva Plantilla', desc: 'Danos ideas para nuevos diseños románticos.' },
    { ico: 'fa-star', color: '#29C72E', tit: 'Dejar una opinión', desc: 'Cuéntanos qué te parece la plataforma y cómo la usas.' },
  ];

  return (
    <div className="ac_wrap">
      {/* ══ HERO ══ */}
      <section className="ac_hero">
        <div className="ac_hero_orb ac_orb1"></div>
        <div className="ac_hero_orb ac_orb2"></div>
        <div className="ac_hero_orb ac_orb3"></div>
        <Showi>
          <div className="ac_hero_body">
            <div className="ac_hero_badge"><i className="fas fa-heart-pulse"></i> Tu opinión construye {app}</div>
            <h1 className="ac_hero_tit">Feedback &<br /><span className="ac_grad">Mejoras</span></h1>
            <p className="ac_hero_sub">
              {app} crece gracias a personas creativas como tú. Ayúdanos a crear 
              <strong> el mejor taller de mensajes de amor del mundo.</strong>
            </p>
            <div className="tm_hero_chips">
              <span className="tm_chip"><i className="fas fa-bolt"></i> Respuesta rápida</span>
              <span className="tm_chip"><i className="fas fa-heart"></i> Con amor</span>
              <span className="tm_chip"><i className="fas fa-lock"></i> Confidencial</span>
            </div>
          </div>
        </Showi>
      </section>

      {/* ══ CANALES ══ */}
      <section className="ac_sec">
        <Showi>
          <div className="ac_sec_head">
            <div className="ac_sec_badge"><i className="fas fa-comments"></i> Canales</div>
            <h2 className="ac_sec_tit">¿Cómo quieres <span className="ac_grad">ayudarnos?</span></h2>
            <p className="ac_sec_sub">Elige el canal que más te acomode para enviarnos tu feedback</p>
          </div>
        </Showi>
        <div className="fb_canales">
          {CANALES.map((c, i) => (
            <Showi key={i}>
              <a href={c.url} target="_blank" rel="noopener" className="fb_canal">
                <div className="fb_canal_ico" style={{ background: c.bg, color: c.txt }}><i className={`fab ${c.ico}`}></i></div>
                <div className="fb_canal_info">
                  <strong>{c.tit}</strong>
                  <span>{c.desc}</span>
                </div>
                <div className="fb_canal_cta" style={{ color: c.color }}>{c.cta} <i className="fas fa-arrow-right"></i></div>
              </a>
            </Showi>
          ))}
        </div>
      </section>

      {/* ══ CATEGORÍAS ══ */}
      <section className="ac_sec ac_sec_alt">
        <Showi>
          <div className="ac_sec_head">
            <div className="ac_sec_badge"><i className="fas fa-layer-group"></i> Categorías</div>
            <h2 className="ac_sec_tit">¿Sobre qué es tu <span className="ac_grad">mensaje?</span></h2>
            <p className="ac_sec_sub">Cuéntanos qué tipo de feedback tienes para nosotros</p>
          </div>
        </Showi>
        <div className="ac_feat_grid">
          {CATS.map((c, i) => (
            <Showi key={i}>
              <div className="ac_feat_card" style={{ borderColor: c.color }}>
                <div className="ac_feat_ico" style={{ color: c.color }}><i className={`fas ${c.ico}`}></i></div>
                <h3>{c.tit}</h3>
                <p>{c.desc}</p>
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
              <span className="ac_cta_emoji">💬</span>
              <h2>¡Gracias por ayudarnos a crecer!</h2>
              <p>Cada mensaje que recibimos nos motiva a seguir construyendo {app} con mucha pasión.</p>
              <div className="ac_cta_btns">
                <a href="mailto:wilder.taype@hotmail.com" className="ac_btn_p ac_btn_lg">
                  <i className="fas fa-envelope"></i> Enviar correo
                </a>
              </div>
            </div>
          </div>
        </Showi>
      </section>
    </div>
  );
}
