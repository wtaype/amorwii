import React from 'react';
import Link from 'next/link';
import Showi from "@/components/Showi";
import { app, version } from "@/app/wii";
import "../acercas.css";

export const metadata = {
  title: `Descubre ${app} | Cómo funciona la magia`,
  description: `Explora todas las funciones de ${app} y aprende cómo crear el detalle perfecto.`,
};

export default function DescubrePage() {
  return (
    <div className="dc_wrap">
      <Showi>
        <div className="dc_hero">
          <div className="dc_badge"><i className="fas fa-wand-magic-sparkles"></i> Potencial Ilimitado</div>
          <h1 className="dc_title">Inspira, Conecta y <span className="dc_grad">Ama</span></h1>
          <p className="dc_desc">Descubre todas las herramientas que {app} pone a tu alcance para transformar tus sentimientos en experiencias digitales inolvidables.</p>
        </div>
      </Showi>
      
      <div className="dc_bento">
        {/* Carta 1: El Creador */}
        <Showi>
          <div className="dc_card dc_c_large">
            <div className="dc_icon"><i className="fas fa-pen-fancy"></i></div>
            <div className="dc_info">
              <h3>Taller de Mensajes Románticos</h3>
              <p>Nuestro potente creador te permite personalizar cada detalle. Desde el nombre de esa persona especial hasta la música que sonará de fondo mientras lee tu declaración.</p>
            </div>
            <div className="dc_visual">
              <div className="dc_graph">
                <div className="dc_bar"></div><div className="dc_bar"></div><div className="dc_bar"></div><div className="dc_bar"></div><div className="dc_bar"></div>
              </div>
            </div>
          </div>
        </Showi>

        {/* Carta 2: Galería */}
        <Showi>
          <div className="dc_card">
            <div className="dc_icon" style={{ color: '#ff6b8a', background: 'rgba(255,107,138,0.1)' }}><i className="fas fa-palette"></i></div>
            <div className="dc_info">
              <h3>Galería de Estilos</h3>
              <p>Cientos de plantillas diseñadas profesionalmente para cada ocasión: Aniversarios, San Valentín o disculpas sinceras.</p>
            </div>
            <div className="dc_visual">
              <div className="dc_apps">
                <div className="dc_app"><i className="fas fa-heart"></i></div>
                <div className="dc_app"><i className="fas fa-envelope"></i></div>
                <div className="dc_app"><i className="fas fa-star"></i></div>
                <div className="dc_app"><i className="fas fa-music"></i></div>
              </div>
            </div>
          </div>
        </Showi>

        {/* Carta 3: Compartir */}
        <Showi>
          <div className="dc_card">
            <div className="dc_icon" style={{ color: '#7000FF', background: 'rgba(112,0,255,0.1)' }}><i className="fas fa-share-nodes"></i></div>
            <div className="dc_info">
              <h3>Envío sin Límites</h3>
              <p>Genera enlaces cortos y elegantes. Comparte por WhatsApp, redes sociales o utiliza nuestros exclusivos Códigos QR.</p>
            </div>
            <div className="dc_visual">
              <div className="dc_blocks">
                <div className="dc_block"></div>
                <div className="dc_block"></div>
                <div className="dc_block"></div>
              </div>
            </div>
          </div>
        </Showi>

        {/* Carta 4: Efectos */}
        <Showi>
          <div className="dc_card dc_c_large">
            <div className="dc_icon" style={{ color: '#0EBEFF', background: 'rgba(14,190,255,0.1)' }}><i className="fas fa-wind"></i></div>
            <div className="dc_info">
              <h3>Efectos Visuales Mágicos</h3>
              <p>Haz que tu mensaje cobre vida con corazones flotantes, estrellas brillantes o pétalos de flores que reaccionan al toque del usuario.</p>
            </div>
            <div className="dc_visual">
              <div className="dc_colors">
                <div className="dc_color"></div><div className="dc_color"></div><div className="dc_color"></div><div className="dc_color"></div>
              </div>
            </div>
          </div>
        </Showi>

        {/* Carta 5: Adsense Support */}
        <Showi>
          <div className="dc_card">
            <div className="dc_icon" style={{ color: '#29C72E', background: 'rgba(41,199,46,0.1)' }}><i className="fas fa-shield-heart"></i></div>
            <div className="dc_info">
              <h3>Gratis y Accesible</h3>
              <p>Mantenemos {app} gratuito gracias a la publicidad no invasiva de Google Adsense, permitiéndonos llegar a todo el mundo.</p>
            </div>
            <div className="dc_visual">
              <div className="dc_pay">
                <div className="dc_pay_top"></div>
                <div className="dc_pay_bot"><div></div><div></div></div>
              </div>
            </div>
          </div>
        </Showi>

        {/* Carta 6: Inspiración */}
        <Showi>
          <div className="dc_card dc_c_large">
            <div className="dc_icon" style={{ color: '#FF8C00', background: 'rgba(255,140,0,0.1)' }}><i className="fas fa-lightbulb"></i></div>
            <div className="dc_info">
              <h3>Inspiración Constante</h3>
              <p>¿No sabes qué escribir? Nuestra sección de ejemplos te brinda ideas de mensajes reales para que nunca te falten las palabras correctas.</p>
            </div>
            <div className="dc_visual">
              <div className="dc_form">
                <div></div><div></div><div></div><div></div>
              </div>
            </div>
          </div>
        </Showi>
      </div>

      <Showi>
        <div className="dc_cta">
          <Link href="/crear" className="dc_cta_btn">
            <i className="fas fa-heart"></i> Empezar mi experiencia
          </Link>
        </div>
      </Showi>
    </div>
  );
}
