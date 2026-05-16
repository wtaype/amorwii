import React from 'react';
import Link from 'next/link';
import Showi from "@/components/Showi";
import { app, version, by } from "@/app/wii";
import "../acercas.css";

export const metadata = {
  title: `Acerca de ${app} | Conectando Corazones`,
  description: `Conoce la historia de ${app}, la plataforma líder en mensajes de amor personalizados.`,
};

export default function AcercaPage() {
  const anio = new Date().getFullYear();

  return (
    <div className="ac_wrap">
      {/* ══ HERO ══ */}
      <section className="ac_hero">
        <div className="ac_hero_orb ac_orb1"></div>
        <div className="ac_hero_orb ac_orb2"></div>
        <div className="ac_hero_orb ac_orb3"></div>
        <Showi>
          <div className="ac_hero_body">
            <div className="ac_hero_badge">
              <i className="fas fa-heart"></i> Un rincón para el romance en tu mundo digital
            </div>
            <h1 className="ac_hero_tit">{app}</h1>
            <p className="ac_hero_sub">
              Crea momentos inolvidables, envía detalles románticos y encuentra la 
              inspiración perfecta para esa persona especial. <strong>Inspira, Comparte, Ama.</strong>
            </p>
            <div className="ac_hero_stats">
              <div className="ac_stat">
                <i className="fas fa-infinity" style={{ color: '#ff6b8a' }}></i>
                <strong>∞</strong>
                <span>Amor Infinito</span>
              </div>
              <div className="ac_stat">
                <i className="fas fa-certificate" style={{ color: '#ffd700' }}></i>
                <strong>100%</strong>
                <span>Gratis y Premium</span>
              </div>
              <div className="ac_stat">
                <i className="fas fa-bolt" style={{ color: '#0EBEFF' }}></i>
                <strong>Fast</strong>
                <span>Envío al Instante</span>
              </div>
              <div className="ac_stat">
                <i className="fas fa-users" style={{ color: '#7000FF' }}></i>
                <strong>1M+</strong>
                <span>Vidas Enamoradas</span>
              </div>
            </div>
            <div className="ac_hero_btns">
              <Link href="/crear" className="ac_btn_p">
                <i className="fas fa-wand-magic-sparkles"></i> Crear Mensaje
              </Link>
              <Link href="/plantillas" className="ac_btn_s">
                <i className="fas fa-palette"></i> Ver Plantillas
              </Link>
            </div>
          </div>
        </Showi>
      </section>

      {/* ══ COUNTER BAND ══ */}
      <div className="ac_counter_band">
        <div className="ac_counter_item">
          <span className="ac_counter_num">100</span><span>%</span>
          <p>Libre de Costo</p>
        </div>
        <div className="ac_counter_sep"></div>
        <div className="ac_counter_item">
          <span className="ac_counter_num">99</span><span>%</span>
          <p>Satisfacción</p>
        </div>
        <div className="ac_counter_sep"></div>
        <div className="ac_counter_item">
          <span>∞</span>
          <p>Dulzura y Pasión</p>
        </div>
        <div className="ac_counter_sep"></div>
        <div className="ac_counter_item">
          <span className="ac_counter_num">{anio}</span>
          <p>A la Vanguardia</p>
        </div>
      </div>

      {/* ══ NUESTRA HISTORIA ══ */}
      <section className="ac_sec">
        <Showi>
          <div className="ac_sec_head">
            <div className="ac_sec_badge"><i className="fas fa-heart"></i> Acerca de nosotros</div>
            <h2 className="ac_sec_tit">El propósito de <span className="ac_grad">{app}</span></h2>
          </div>
        </Showi>
        <Showi>
          <div className="ac_historia">
            <p><strong>{app}</strong> es una plataforma diseñada para que expresar tus sentimientos sea más fácil, creativo y emocionante que nunca. Nuestro propósito es acortar distancias y fortalecer vínculos a través de detalles digitales que tocan el alma.</p>
            
            <p>Creemos que un mensaje enviado en el momento justo puede cambiar el día de alguien. Por eso, hemos creado un ecosistema de plantillas interactivas, música y efectos visuales que transforman una simple frase en una experiencia romántica completa.</p>
            
            <p>Este proyecto nació de la idea de modernizar las clásicas cartas de amor. Queríamos algo que fuera instantáneo como un chat, pero especial como un regalo hecho a mano. El resultado es {app}, una herramienta donde tú eres el autor y nosotros ponemos la magia visual.</p>

            <p>Desarrollada con pasión y tecnología de punta, esta app busca ser el aliado perfecto para aniversarios, San Valentín, o simplemente para decir "te quiero" un martes cualquiera.</p>
            
            <p>Si estás aquí, es porque crees en el poder de los detalles. ¡Gracias por confiar en nosotros para tus momentos más especiales!</p>

            <div className="ac_firma">
              <strong>Con amor, {by}</strong>
              <span>Creador de {app}</span>
            </div>
          </div>
        </Showi>
      </section>

      {/* ══ BENEFICIOS ══ */}
      <section className="ac_sec ac_sec_alt">
        <Showi>
          <div className="ac_sec_head">
            <div className="ac_sec_badge"><i className="fas fa-star"></i> ¿Por qué {app}?</div>
            <h2 className="ac_sec_tit">Detalles que marcan <span className="ac_grad">la diferencia</span></h2>
            <p className="ac_sec_sub">Diseñado para que cada envío sea una sorpresa inolvidable</p>
          </div>
        </Showi>
        <div className="ac_feat_grid">
          <Showi>
            <div className="ac_feat_card ac_color_dulce">
              <div className="ac_feat_ico"><i className="fas fa-magic"></i></div>
              <h3>Personalización Total</h3>
              <p>Elige fondos, efectos flotantes y música de fondo para que tu mensaje sea único y personal.</p>
            </div>
          </Showi>
          <Showi>
            <div className="ac_feat_card ac_color_cielo">
              <div className="ac_feat_ico"><i className="fas fa-palette"></i></div>
              <h3>Diseños Premium</h3>
              <p>Disfruta de plantillas visualmente impactantes optimizadas para verse increíbles en cualquier pantalla.</p>
            </div>
          </Showi>
          <Showi>
            <div className="ac_feat_card ac_color_paz">
              <div className="ac_feat_ico"><i className="fas fa-share-nodes"></i></div>
              <h3>Envío Universal</h3>
              <p>Comparte tus creaciones por WhatsApp, Messenger o mediante un Código QR exclusivo de forma instantánea.</p>
            </div>
          </Showi>
          <Showi>
            <div className="ac_feat_card ac_color_mora">
              <div className="ac_feat_ico"><i className="fas fa-shield-heart"></i></div>
              <h3>Privacidad y Rapidez</h3>
              <p>Tus mensajes se procesan con la mayor velocidad, asegurando que lleguen a su destino sin esperas.</p>
            </div>
          </Showi>
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
              <span className="ac_cta_emoji">💖</span>
              <h2>¿Listo para sorprender?<br />Crea tu mensaje hoy</h2>
              <p>Únete a miles de personas que ya están enviando amor digital.</p>
              <div className="ac_cta_btns">
                <Link href="/crear" className="ac_btn_p ac_btn_lg">
                  <i className="fas fa-wand-magic-sparkles"></i> Empezar a crear
                </Link>
                <Link href="/ejemplos" className="ac_btn_s ac_btn_lg">
                  <i className="fas fa-lightbulb"></i> Ver ejemplos
                </Link>
              </div>
            </div>
          </div>
        </Showi>
      </section>
    </div>
  );
}
