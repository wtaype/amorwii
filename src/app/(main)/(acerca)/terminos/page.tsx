import React from 'react';
import Showi from "@/components/Showi";
import { app, by } from "@/app/wii";
import "../acercas.css";

import { seopages } from "@/app/seopages";

export const metadata = seopages.terminos;

export default function TerminosPage() {
  const anio = new Date().getFullYear();

  const SECCIONES = [
    {
      ico: 'fa-user-shield', color: '#0EBEFF', num: '01',
      tit: 'Uso de la Plataforma',
      body: (
        <>
          <p>{app} es una plataforma digital gratuita dedicada a la creación de detalles románticos. Al usar nuestra aplicación, te comprometes a:</p>
          <ul className="tm_list">
            <li><i className="fas fa-check"></i> Respetar los derechos de autor de las plantillas y música.</li>
            <li><i className="fas fa-check"></i> No utilizar el creador para difundir contenido ofensivo, violento o ilegal.</li>
            <li><i className="fas fa-check"></i> Mantener un lenguaje respetuoso en los mensajes que generes.</li>
            <li><i className="fas fa-check"></i> No intentar acceder sin autorización a sistemas internos o datos de otros usuarios.</li>
          </ul>
        </>
      )
    },
    {
      ico: 'fa-bullhorn', color: '#FF5C69', num: '02',
      tit: 'Publicidad (Google AdSense)',
      body: (
        <>
          <p>{app} muestra anuncios publicitarios de <strong>Google AdSense</strong> para financiar el mantenimiento y desarrollo de la plataforma gratuita. Al usar nuestro sitio:</p>
          <ul className="tm_list">
            <li><i className="fas fa-check"></i> Google utiliza cookies para mostrar anuncios basados en tus visitas previas.</li>
            <li><i className="fas fa-check"></i> El uso de cookies de publicidad permite a Google y a sus socios mostrar anuncios basados en las visitas de los usuarios a sus sitios.</li>
            <li><i className="fas fa-check"></i> Puedes inhabilitar la publicidad personalizada en <a href="https://adssettings.google.com" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.</li>
          </ul>
          <div className="tm_alert">
            <i className="fas fa-info-circle"></i>
            <p>Los ingresos por publicidad nos permiten mantener {app} completamente gratuito. Gracias por tu comprensión.</p>
          </div>
        </>
      )
    },
    {
      ico: 'fa-copyright', color: '#7000FF', num: '03',
      tit: 'Propiedad Intelectual',
      body: (
        <>
          <p>{app} es un proyecto desarrollado por <strong>{by}</strong>. Todos los derechos reservados {anio}.</p>
          <ul className="tm_list">
            <li><i className="fas fa-check"></i> El diseño, código fuente y la arquitectura de la app son propiedad exclusiva del autor.</li>
            <li><i className="fas fa-check"></i> El contenido que tú generas (mensajes personales) sigue siendo de tu propiedad exclusiva.</li>
            <li><i className="fas fa-check"></i> No está permitida la reproducción total o parcial del sitio sin autorización expresa.</li>
          </ul>
        </>
      )
    },
    {
      ico: 'fa-gavel', color: '#29C72E', num: '04',
      tit: 'Jurisdicción',
      body: (
        <p>Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa será sometida a los tribunales competentes de Lima, Perú.</p>
      )
    }
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
            <div className="ac_hero_badge"><i className="fas fa-file-contract"></i> Transparencia Legal</div>
            <h1 className="ac_hero_tit">Términos y<br /><span className="ac_grad">Condiciones</span></h1>
            <p className="ac_hero_sub">
              Al usar {app}, aceptas estas reglas que aseguran que nuestra comunidad
              siga siendo <strong>un espacio seguro y lleno de amor para todos.</strong>
            </p>
            <div className="tm_hero_chips">
              <span className="tm_chip"><i className="fas fa-shield-halved"></i> Uso justo</span>
              <span className="tm_chip"><i className="fas fa-heart"></i> 100% Gratis</span>
              <span className="tm_chip"><i className="fas fa-lock"></i> Tu privacidad importa</span>
            </div>
          </div>
        </Showi>
      </section>

      {/* ══ SECCIONES ══ */}
      <section className="ac_sec">
        <Showi>
          <div className="ac_sec_head">
            <div className="ac_sec_badge"><i className="fas fa-list-check"></i> Contenido</div>
            <h2 className="ac_sec_tit">Lo que debes <span className="ac_grad">saber</span></h2>
            <p className="ac_sec_sub">Lee nuestras políticas de forma clara y sencilla</p>
          </div>
        </Showi>
        <div className="tm_secs_grid">
          {SECCIONES.map((s, i) => (
            <Showi key={i}>
              <div className="tm_sec_card">
                <div className="tm_sec_header">
                  <div className="tm_sec_ico" style={{ color: s.color }}>
                    <i className={`fas ${s.ico}`}></i>
                  </div>
                  <div>
                    <span className="tm_sec_num">{s.num}</span>
                    <h2 className="tm_sec_tit">{s.tit}</h2>
                  </div>
                </div>
                <div className="tm_sec_body">{s.body}</div>
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
              <span className="ac_cta_emoji">⚖️</span>
              <h2>¿Preguntas legales?</h2>
              <p>Estamos aquí para resolver cualquier duda sobre nuestros términos.</p>
              <div className="ac_cta_btns">
                <a href="mailto:wilder.taype@hotmail.com" className="ac_btn_p ac_btn_lg">
                  <i className="fas fa-envelope"></i> Contacto Legal
                </a>
              </div>
            </div>
          </div>
        </Showi>
      </section>
    </div>
  );
}
