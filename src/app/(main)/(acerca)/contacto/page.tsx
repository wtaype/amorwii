import React from 'react';
import Link from 'next/link';
import Showi from "@/components/Showi";
import { app } from "@/app/wii";
import "../acercas.css";

export const metadata = {
  title: `Contacto | ${app}`,
  description: `¿Tienes dudas o sugerencias? Escríbenos y conecta con el equipo de ${app}.`,
};

export default function ContactoPage() {
  const INFO = [
    { ico: 'fa-envelope', color: '#0EBEFF', label: 'Email', value: 'wilder.taype@hotmail.com' },
    { ico: 'fa-map-marker-alt', color: '#FF5C69', label: 'Ubicación', value: 'Lima, Perú' },
    { ico: 'fa-clock', color: '#29C72E', label: 'Respuesta', value: '24/7 Disponible' },
  ];

  const FAQ = [
    { q: '¿Es gratis crear mensajes?', r: 'Sí, AmorWii es 100% gratuito. Puedes crear y compartir todos los detalles que desees.' },
    { q: '¿Puedo sugerir una nueva plantilla?', r: '¡Claro! Nos encanta recibir ideas. Escríbenos y nuestro equipo de diseño la evaluará.' },
    { q: '¿Cómo comparto mi AmorWii?', r: 'Una vez creado, obtendrás un enlace único o un código QR que puedes enviar por cualquier red social.' },
  ];

  return (
    <div className="ac_wrap ct_wrap">
      {/* ══ HERO ══ */}
      <section className="ac_hero ct_hero">
        <div className="ac_hero_orb ac_orb1"></div>
        <div className="ac_hero_orb ac_orb2"></div>
        <div className="ac_hero_orb ac_orb3"></div>
        <Showi>
          <div className="ac_hero_body">
            <div className="ac_hero_badge"><i className="fas fa-paper-plane"></i> Estamos para ti</div>
            <h1 className="ac_hero_tit">Hablemos de<br /><span className="ac_grad">Amor 💬</span></h1>
            <p className="ac_hero_sub">
              ¿Tienes una sugerencia, una idea para una plantilla o algún problema técnico?
              <strong>Tu mensaje es muy importante para nosotros.</strong>
            </p>
            <div className="tm_hero_chips">
              <span className="tm_chip"><i className="fas fa-clock"></i> Respuesta rápida</span>
              <span className="tm_chip"><i className="fas fa-lock"></i> 100% Confidencial</span>
              <span className="tm_chip"><i className="fas fa-heart"></i> Con cariño</span>
            </div>
          </div>
        </Showi>
      </section>

      {/* ══ GRID: INFO + FAQ ══ */}
      <section className="ac_sec ct_sec">
        <div className="ct_grid">
          
          {/* Tarjetas de Información */}
          <div className="ct_info_wrap">
            <Showi>
              <div className="ct_info_card">
                <h3><i className="fas fa-address-card"></i> Canales Directos</h3>
                <div className="ct_info_items">
                  {INFO.map((it, i) => (
                    <div key={i} className="ct_info_item">
                      <div className="ct_info_ico" style={{ color: it.color }}>
                        <i className={`fas ${it.ico}`}></i>
                      </div>
                      <div className="ct_info_data">
                        <span className="ct_info_label">{it.label}</span>
                        <span className="ct_info_value">{it.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Showi>

            <Showi>
              <div className="ct_info_card">
                <h3><i className="fas fa-share-nodes"></i> Redes y Portafolio</h3>
                <div className="ct_redes">
                  <a href="https://github.com/wtaype" target="_blank" rel="noopener" className="ct_red">
                    <i className="fab fa-github"></i><span>GitHub</span>
                  </a>
                  <a href="https://wtaype.github.io/" target="_blank" rel="noopener" className="ct_red">
                    <i className="fas fa-globe"></i><span>Portfolio</span>
                  </a>
                </div>
              </div>
            </Showi>
          </div>

          {/* FAQ Corto */}
          <Showi>
            <div className="ct_faq_wrap">
              <div className="ac_sec_head" style={{ textAlign: 'left', marginBottom: '4vh' }}>
                <div className="ac_sec_badge"><i className="fas fa-circle-question"></i> Ayuda rápida</div>
                <h2 className="ac_sec_tit">Preguntas <span className="ac_grad">frecuentes</span></h2>
              </div>
              <div className="tm_secs_grid" style={{ gridTemplateColumns: '1fr' }}>
                {FAQ.map((f, i) => (
                  <div key={i} className="tm_sec_card">
                    <div className="tm_sec_header">
                      <div className="tm_sec_ico"><i className="fas fa-quote-left"></i></div>
                      <h2 className="tm_sec_tit" style={{ fontSize: '1.2rem' }}>{f.q}</h2>
                    </div>
                    <div className="tm_sec_body">
                      <p>{f.r}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Showi>

        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="ac_cta_sec">
        <Showi>
          <div className="ac_cta_wrap">
            <div className="ac_hero_orb ac_orb1"></div>
            <div className="ac_hero_orb ac_orb2"></div>
            <div className="ac_cta_glow"></div>
            <div className="ac_cta_inner">
              <span className="ac_cta_emoji">📩</span>
              <h2>¿Prefieres el correo directo?</h2>
              <p>Haz clic abajo para enviarnos un email directamente.</p>
              <div className="ac_cta_btns">
                <a href="mailto:wilder.taype@hotmail.com" className="ac_btn_p ac_btn_lg">
                  <i className="fas fa-envelope"></i> Enviar email
                </a>
              </div>
            </div>
          </div>
        </Showi>
      </section>
    </div>
  );
}
