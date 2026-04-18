"use client";

import Link from "next/link";
import { app } from "./wii";
import { useEffect, useRef, useState } from "react";
import { activarWiVista } from "./widev/wivista";

const ROLES = ['Mensajes de Amor 💕', 'San Valentín 💌', 'Aniversarios 🥂', 'Declaraciones ❤️', 'Cartas de Amor ✉️'];
const STATS = [[1200, 'Mensajes Creados'], [8, 'Plantillas Únicas'], [6, 'Categorías']];
const EJ = [
  { tipo: 'Amor', e: '💕', x: 'var(--Dulce, #FF5C69)', de: 'Lovewi', para: 'Alguien especial', msg: 'Eres mi todo, mi razón de sonreír cada día 💕' },
  { tipo: 'Declaracion', e: '🥺', x: 'var(--Mora, #7000FF)', de: 'Martin', para: 'Catalina', msg: 'Me gustas mucho y hoy decidí ser valiente. ¿Me darías la oportunidad de hacerte feliz? ❤️' },
  { tipo: 'Carta', e: '✉️', x: 'var(--Cielo, #0EBEFF)', de: 'Gabriel', para: 'Alejandra', msg: 'Querida mía, escribo estas líneas porque hay sentimientos que necesitan más que una frase ✉️' },
  { tipo: 'Aniversario', e: '🥂', x: 'var(--Oro, #FFDA34)', de: 'Roberto', para: 'Elena', msg: 'Un año más juntos y cada día te elijo de nuevo. Feliz aniversario mi amor 🥂' },
];
const PASOS = [
  ['fa-palette', 'Elige tu Plantilla', 'Selecciona entre 8 plantillas diseñadas para cada ocasión especial'],
  ['fa-pen-fancy', 'Personaliza', 'Escribe nombres, tu mensaje especial y agrega música si deseas'],
  ['fa-share-nodes', 'Comparte', 'Obtén tu enlace único y envíalo por WhatsApp, Telegram o redes'],
];
const TESTI = [
  ['Perfecta para sorprender a mi novia en San Valentín. Ella lloró de emoción 💕', 'Carlos M.', 'San Valentín', '⭐⭐⭐⭐⭐'],
  ['Usé ' + app + ' para mi aniversario y fue un éxito total. Los diseños son preciosos 🎉', 'Ana R.', 'Aniversario', '⭐⭐⭐⭐⭐'],
  ['Lo mejor es que es gratis y sin límites. He creado varios mensajes increíbles 💙', 'Miguel S.', 'Usuario frecuente', '⭐⭐⭐⭐'],
];
const FEATS = [
  ['fa-heart', 'Personalizados', 'Dedicatorias únicas para San Valentín, aniversarios y fechas especiales'],
  ['fa-mobile-screen', 'Responsive', 'Perfecto en móvil, tablet y escritorio. Comparte en cualquier plataforma'],
  ['fa-lock', 'Privado y Seguro', 'Sin registro obligatorio, sin publicidad molesta'],
  ['fa-music', 'Con Música', 'Añade tu canción favorita para hacerlo aún más emotivo'],
  ['fa-cloud', 'En la Nube', 'Crea cuenta gratis y accede desde cualquier dispositivo'],
];
const FAQS = [
  ['¿Es gratis crear mensajes?', 'Sí, 100% gratis y sin límites. Crea todos los mensajes que quieras sin costo alguno.'],
  ['¿Necesito registrarme?', 'No es obligatorio. Puedes crear mensajes sin cuenta. Con registro puedes guardar y gestionar tus mensajes.'],
  ['¿Cómo comparto mi mensaje?', 'Al crear tu mensaje obtienes un enlace único que puedes enviar por WhatsApp, Telegram o cualquier red social.'],
  ['¿Se puede agregar música?', 'Sí, puedes elegir canciones de fondo para hacer tu mensaje aún más especial y emotivo.'],
  ['¿Mis mensajes son privados?', 'Totalmente. Solo las personas con tu enlace pueden ver el mensaje que creaste.'],
];

export function HomeView() {
  const [roleIndex, setRoleIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Efecto Rotador de Roles
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 2500);

    // 2. Efectos Visuales al Scroll usando activarWiVista de Amorwii
    const cleanups = ['.ej_item', '.paso', '.test_card', '.feat_card', '.faq_item'].map((selector) => {
      return activarWiVista(selector, { className: 'visible' });
    });

    // 3. Efecto Odometer (Contadores Reactivos) - Observer manual custom
    const sf = statsRef.current;
    let obs: IntersectionObserver | null = null;

    if (sf) {
      obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const els = sf.querySelectorAll('.hstat_n');
          els.forEach((el) => {
            const elNode = el as HTMLElement;
            const t = parseInt(elNode.getAttribute('data-target') || '0', 10);
            const s = Math.ceil(t / 40);
            let c = 0;
            const iv = setInterval(() => {
              c = Math.min(c + s, t);
              elNode.textContent = c < t ? Math.floor(c).toString() : t + "+";
              if (c >= t) clearInterval(iv);
            }, 30);
          });
          obs?.unobserve(sf);
        }
      });
      obs.observe(sf);
    }

    return () => {
      clearInterval(interval);
      obs?.disconnect();
      cleanups.forEach((c) => c());
    };
  }, []);

  const renderSectionHeader = (ico: string, title: string) => (
    <div className="sec_head">
      <h2><i className={"fas " + ico}></i> {title}</h2>
      <div className="sec_line"></div>
    </div>
  );

  return (
    <div className="inicio" ref={containerRef}>
      <section className="hero">
        <div className="hero_txt">
          <div className="hero_badge"><i className="fas fa-heart"></i> {app} 2026</div>
          <h1>Expresa tus <span className="gradiente">Sentimientos</span><br />con Mensajes <span className="gradiente">Únicos</span></h1>
          <div className="hero_roles">
            {ROLES.map((r, i) => (
              <span key={i} className={"role " + (i === roleIndex ? "active" : "")}>{r}</span>
            ))}
          </div>
          <p className="hero_sub">Crea dedicatorias personalizadas para tu pareja, amor o persona especial. Comparte en segundos 💌</p>
          <div className="hero_btns">
            <Link href="/crear" className="btn_pri"><i className="fas fa-wand-magic-sparkles"></i><span>Crear Mensaje Gratis</span></Link>
            <Link href="#ejemplos" className="btn_sec"><i className="fas fa-images"></i><span>Ver Ejemplos</span></Link>
          </div>
          <div className="hero_stats" ref={statsRef}>
            {STATS.map(([n, l], i) => (
              <div key={i} className="hstat">
                <div className="hstat_n" data-target={n.toString()}>0</div>
                <div className="hstat_l">{l.toString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero_visual">
          <img src="/amor.webp" alt={app + " Home"} width={600} height={600} loading="lazy" />
          <div className="hero_deco">
            <i className="fas fa-heart"></i><i className="fas fa-heart"></i><i className="fas fa-heart"></i>
          </div>
        </div>
      </section>

      <section className="sec_ej" id="ejemplos">
        {renderSectionHeader('fa-sparkles', 'Inspírate con Ejemplos Reales')}
        <p className="sec_desc">Mensajes listos para personalizar. Haz clic en uno para verlo en acción</p>
        <div className="ej_grid">
          {EJ.map((e, i) => (
            <Link key={i} href={"/ejemplos/" + e.tipo.toLowerCase()} className="ej_item" style={{ '--x': e.x } as React.CSSProperties}>
              <div className="ej_top"><span>{e.e}</span><span className="ej_tag">{e.tipo}</span></div>
              <p>"{e.msg}"</p>
              <div className="ej_meta">
                <span><i className="fas fa-user"></i> {e.de}</span>
                <span><i className="fas fa-heart"></i> {e.para}</span>
              </div>
              <span className="ej_ver"><i className="fas fa-eye"></i> Ver demostración</span>
            </Link>
          ))}
        </div>
        <div className="sec_cta">
          <Link href="/ejemplos" className="btn_sec wi_nav"><i className="fas fa-th-large"></i><span>Ver Todos los Ejemplos</span></Link>
        </div>
      </section>

      <section className="sec_test">
        <div className="test_bg">
          <div className="test_inner">
            <div className="test_left">
              <img src="/smile.avif" alt={app} width={120} height={120} className="test_img" loading="lazy" />
              <h2><i className="fas fa-comments"></i> Lo que dicen nuestros usuarios</h2>
              <p>Miles de personas ya expresaron sus sentimientos con <strong>{app}</strong></p>
            </div>
            <div className="test_right">
              {TESTI.map((testi, i) => (
                <div key={i} className="test_card">
                  <div className="test_stars">{testi[3]}</div>
                  <p>"{testi[0]}"</p>
                  <div className="test_a"><strong>{testi[1]}</strong><span>{testi[2]}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec_dual">
        <div className="dual_grid">
          <div className="dual_left">
            {renderSectionHeader('fa-lightbulb', '¿Cómo funciona?')}
            <div className="pasos_list">
              {PASOS.map((paso, i) => (
                <div key={i} className="paso">
                  <div className="paso_n">{i + 1}</div>
                  <div>
                    <h3>{paso[1]}</h3>
                    <p>{paso[2]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dual_right">
            {renderSectionHeader('fa-circle-question', 'Preguntas Frecuentes')}
            <div className="faq_list">
              {FAQS.map((faq, i) => (
                <details key={i} className="faq_item">
                  <summary><span>{faq[0]}</span><i className="fas fa-chevron-down"></i></summary>
                  <p>{faq[1]}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sec_feat">
        {renderSectionHeader('fa-sparkles', "¿Por qué elegir " + app + "?")}
        <div className="feat_grid">
          {FEATS.map((feat, i) => (
            <div key={i} className="feat_card">
              <div className="feat_ico"><i className={"fas " + feat[0]}></i></div>
              <h3>{feat[1]}</h3>
              <p>{feat[2]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta_final">
        <i className="fas fa-heart cta_ico"></i>
        <h2>¿Listo para crear tu mensaje perfecto?</h2>
        <p>Únete a miles de personas que expresan sus sentimientos con <strong>{app}</strong></p>
        <Link href="/crear" className="cta_btn wi_nav"><i className="fas fa-wand-magic-sparkles"></i> Crear Mensaje - Gratis</Link>
        <div className="cta_tags">
          <span><i className="fas fa-check"></i> Sin registro</span>
          <span><i className="fas fa-check"></i> 100% gratis</span>
          <span><i className="fas fa-check"></i> Ilimitado</span>
        </div>
      </section>
    </div>
  );
}
