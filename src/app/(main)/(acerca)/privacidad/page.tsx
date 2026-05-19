import React from 'react';
import Showi from "@/components/Showi";
import { app, by } from "@/app/wii";
import "../acercas.css";

import { seopages } from "@/app/seopages";

export const metadata = seopages.privacidad;

export default function PrivacidadPage() {
  const anio = new Date().getFullYear();

  const SECCIONES = [
    {
      ico: 'fa-database', color: '#0EBEFF', num: '01',
      tit: 'Información que Recopilamos',
      body: (
        <>
          <p>{app} recopila únicamente la información necesaria para brindarte la mejor experiencia creativa:</p>
          <ul className="tm_list">
            <li><i className="fas fa-check"></i> <strong>Datos de sesión:</strong> Preferencias temporales como la última plantilla elegida (sessionStorage).</li>
            <li><i className="fas fa-check"></i> <strong>Contenido de mensajes:</strong> El texto que escribes para tus detalles se codifica en la URL o se procesa localmente.</li>
            <li><i className="fas fa-check"></i> <strong>Datos técnicos:</strong> Tipo de dispositivo y navegador para asegurar que las plantillas se vean perfectas.</li>
          </ul>
        </>
      )
    },
    {
      ico: 'fa-bullhorn', color: '#FF5C69', num: '02',
      tit: 'Publicidad y Google AdSense',
      body: (
        <>
          <p>Utilizamos <strong>Google AdSense</strong> para mostrar anuncios. Este servicio externo puede:</p>
          <ul className="tm_list">
            <li><i className="fas fa-check"></i> Usar cookies para mostrar anuncios basados en tus visitas a este y otros sitios web.</li>
            <li><i className="fas fa-check"></i> Recopilar datos de navegación de forma anónima para mejorar la relevancia publicitaria.</li>
          </ul>
          <p>Puedes gestionar tus preferencias en la <a href="https://adssettings.google.com" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.</p>
        </>
      )
    },
    {
      ico: 'fa-shield-halved', color: '#29C72E', num: '03',
      tit: 'Seguridad y Cifrado',
      body: (
        <>
          <p>Toda la comunicación en {app} está protegida por cifrado SSL (HTTPS), asegurando que tu conexión sea privada y segura.</p>
          <ul className="tm_list">
            <li><i className="fas fa-check"></i> No almacenamos mensajes privados en bases de datos permanentes a menos que explícitamente lo solicites.</li>
            <li><i className="fas fa-check"></i> Implementamos medidas técnicas para evitar el acceso no autorizado a nuestra plataforma.</li>
          </ul>
        </>
      )
    },
    {
      ico: 'fa-user-lock', color: '#7000FF', num: '04',
      tit: 'Tus Derechos',
      body: (
        <p>Tienes derecho a acceder, rectificar o solicitar la eliminación de cualquier dato que hayamos recopilado. Para ello, puedes contactarnos directamente por correo electrónico.</p>
      )
    }
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
            <div className="ac_hero_badge"><i className="fas fa-lock"></i> Tu privacidad es prioridad</div>
            <h1 className="ac_hero_tit">Política de<br /><span className="ac_grad">Privacidad</span></h1>
            <p className="ac_hero_sub">
              En {app}, respetamos tu espacio y tus sentimientos. Esta política explica
              cómo manejamos la información para mantener <strong>tu experiencia segura y privada.</strong>
            </p>
            <div className="tm_hero_chips">
              <span className="tm_chip"><i className="fas fa-ban"></i> Sin venta de datos</span>
              <span className="tm_chip"><i className="fas fa-shield-halved"></i> 100% Seguro</span>
              <span className="tm_chip"><i className="fas fa-eye-slash"></i> Sin rastreo invasivo</span>
            </div>
            <div className="tm_last_upd">
              <i className="fas fa-calendar-check"></i>
              Última actualización: Mayo {anio}
            </div>
          </div>
        </Showi>
      </section>

      {/* ══ SECCIONES ══ */}
      <section className="ac_sec">
        <Showi>
          <div className="ac_sec_head">
            <div className="ac_sec_badge"><i className="fas fa-shield-halved"></i> Compromiso</div>
            <h2 className="ac_sec_tit">Tu información, <span className="ac_grad">tu control</span></h2>
            <p className="ac_sec_sub">Transparencia total en el manejo de tus datos digitales</p>
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
              <span className="ac_cta_emoji">🔒</span>
              <h2>¿Dudas sobre privacidad?</h2>
              <p>Escríbenos y te responderemos a la brevedad posible.</p>
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
