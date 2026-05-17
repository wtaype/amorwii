import Link from "next/link";
import Image from "next/image";
import { app } from "@/app/wii";
import Showi from "@/components/Showi";
import AnimarRoles from "@/components/AnimarRoles";
import Contadores from "@/components/Contadores";
import "./inicio.css";

const ROLES = ['Mensajes de Amor 💕', 'San Valentín 💌', 'Aniversarios 🥂', 'Declaraciones ❤️', 'Cartas de Amor ✉️'];
const STATS: [number, string][] = [[1200, 'Mensajes creados'], [8, 'Plantillas únicas'], [100, '% Gratis']];

const EJ = [
  { tipo: 'Amor', e: '💕', x: 'var(--Dulce, #FF5C69)', de: 'Lovewi', para: 'Alguien especial', msg: 'Eres mi todo, mi razón de sonreír cada día 💕' },
  { tipo: 'Declaracion', e: '🥺', x: 'var(--Mora, #7000FF)', de: 'Martin', para: 'Catalina', msg: 'Me gustas mucho y hoy decidí ser valiente. ¿Me darías la oportunidad de hacerte feliz? ❤️' },
  { tipo: 'Carta', e: '✉️', x: 'var(--Cielo, #0EBEFF)', de: 'Gabriel', para: 'Alejandra', msg: 'Querida mía, escribo estas líneas porque hay sentimientos que necesitan más que una frase ✉️' },
  { tipo: 'Aniversario', e: '🥂', x: 'var(--Oro, #FFDA34)', de: 'Roberto', para: 'Elena', msg: 'Un año más juntos y cada día te elijo de nuevo. Feliz aniversario mi amor 🥂' },
  { tipo: 'Sorpresa', e: '🎁', x: 'var(--Paz, #29C72E)', de: 'Sofía', para: 'Mamá', msg: 'Gracias por ser mi mayor inspiración. Te amo con todo mi corazón mamá hermosa 🌸' },
  { tipo: 'Cumpleaños', e: '🎂', x: 'var(--Dulce, #FF5C69)', de: 'Camila', para: 'Sebastián', msg: 'Hoy cumples años y quiero que sepas que eres lo mejor que me pasó en la vida. ¡Feliz cumple amor! 🎉' },
];

const PASOS = [
  { n: '01', e: '🎨', tit: 'Elige tu plantilla', desc: 'Explora 8 diseños únicos pensados para cada momento especial — amor, declaración, carta o aniversario.', tag: 'Diseño' },
  { n: '02', e: '✍️', tit: 'Personaliza tu mensaje', desc: 'Escribe el nombre de quien amas, tu dedicatoria del corazón y elige una canción de YouTube para hacer llorar.', tag: 'Creación' },
  { n: '03', e: '🔗', tit: 'Obtén tu enlace secreto', desc: 'Te generamos un link único y un código QR listo para compartir. Solo quien lo reciba podrá verlo.', tag: 'Privacidad' },
  { n: '04', e: '📲', tit: 'Envíalo y enamóralos', desc: 'Compártelo por WhatsApp, Telegram o Instagram. Ver la reacción de tu persona... no tiene precio. 💌', tag: 'Impacto' },
];

const TESTI = [
  { msg: '"Perfecta para sorprender a mi novia en San Valentín. Ella lloró de emoción 😭💕"', autor: 'Carlos M.', ini: 'C', color: '#FF5C69', cat: '💌 San Valentín', stars: 5 },
  { msg: '"Usé AmorWii para mi aniversario y fue un éxito total. Los diseños son preciosos 🎉"', autor: 'Ana R.', ini: 'A', color: '#7000FF', cat: '🥂 Aniversario', stars: 5 },
  { msg: '"La música de fondo hizo que mi carta fuera mil veces más romántica. 10/10 🥺"', autor: 'Lucía F.', ini: 'L', color: '#0EBEFF', cat: '💙 Declaración', stars: 5 },
  { msg: '"Me salvó la vida cuando olvidé comprar una tarjeta física jajaja. Quedó genial!"', autor: 'David P.', ini: 'D', color: '#29C72E', cat: '🎯 Casual', stars: 5 },
  { msg: '"100% gratis y sin límites. He creado varios mensajes y siempre queda increíble 💙"', autor: 'Miguel S.', ini: 'M', color: '#FFDA34', cat: '⭐ Frecuente', stars: 4 },
  { msg: '"No esperaba que fuera tan fácil y bonito. Mi novia preguntó si lo había hecho un diseñador 😂"', autor: 'Rodrigo V.', ini: 'R', color: '#FF5C69', cat: '🎨 Diseño', stars: 5 },
];

const FEATS = [
  { e: '🎨', tit: '8 Plantillas Únicas', desc: 'Cada diseño fue creado para un momento especial — amor, declaración, carta o aniversario.', big: false },
  { e: '🎵', tit: 'Música de Fondo', desc: 'Añade cualquier canción de YouTube. Tu mensaje sonará literalmente increíble.', big: false },
  { e: '🔐', tit: 'Enlace Secreto', desc: 'Tu mensaje es invisible para Google. Solo quien recibe tu link puede leerlo.', big: true },
  { e: '📲', tit: 'Funciona en Móvil', desc: 'Perfecto en cualquier celular. Se comparte y se ve igual de bonito en la pantalla del destinatario.', big: false },
  { e: '⚡', tit: '100% Gratis', desc: 'Sin suscripción, sin tarjeta, sin truco. Crea mensajes ilimitados hoy mismo.', big: false },
  { e: '🖼️', tit: 'Con Imagen Opcional', desc: 'Puedes añadir una foto tuya o de los dos para hacerlo aún más personal y emotivo.', big: false },
];

const BENEFICIOS = [
  { e: '🆓', tit: '100% Gratis vs. Pago', desc: 'Otras plataformas cobran por diseños premium o por más de 1 mensaje. Aquí todo es gratis, siempre.' },
  { e: '🎵', tit: 'Música Real vs. Sin audio', desc: 'La mayoría no tiene música. Nosotros la integramos directamente desde YouTube con un clic.' },
  { e: '🔒', tit: 'Privado vs. Público', desc: 'En redes sociales tu mensaje queda expuesto. Aquí solo quien tiene el link secreto puede leerlo.' },
  { e: '📱', tit: 'Mobile-First vs. Solo Web', desc: 'Diseñado desde cero para móvil. Tu pareja lo abre en su celular y se ve espectacular.' },
  { e: '⚡', tit: 'Sin registro obligatorio vs. Formularios', desc: 'Crea y comparte en menos de 60 segundos. Sin email, sin contraseña, sin rodeos.' },
  { e: '🎨', tit: 'Plantillas únicas vs. Genéricas', desc: 'Nuestros diseños son exclusivos y temáticos. Nada de fondos blancos aburridos con texto negro.' },
];

export default function Home() {
  return (
    <div className="inicio">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero_txt">
          <div className="hero_badge"><i className="fas fa-heart"></i> {app} 2026</div>
          <h1>Expresa tus <span className="gradiente">Sentimientos</span><br />con Mensajes <span className="gradiente">Únicos</span></h1>
          
          {/* Componente Cliente aislado para la animación rotatoria */}
          <AnimarRoles roles={ROLES} />
          
          <p className="hero_sub">Crea dedicatorias personalizadas con música, diseño y tu enlace secreto. Comparte en segundos 💌</p>
          <div className="hero_btns">
            <Link href="/crear" className="btn_pri"><i className="fas fa-wand-magic-sparkles"></i><span>Crear Mensaje Gratis</span></Link>
            <Link href="#como" className="btn_sec"><i className="fas fa-play"></i><span>¿Cómo funciona?</span></Link>
          </div>
          
          {/* Componente Cliente aislado para los contadores */}
          <Contadores stats={STATS} />
        </div>

        <div className="hero_visual">
          <div className="hero_img_wrap">
            <Image 
              src="/amor.webp" 
              alt="AmorWii Home" 
              width={520} 
              height={520} 
              className="hero_img" 
              priority 
            />
            <div className="hf_btn hf_top_l"><i className="fas fa-music"></i> Música de fondo</div>
            <div className="hf_btn hf_top_r"><i className="fas fa-link"></i> Enlace secreto</div>
            <div className="hf_btn hf_bot_l"><i className="fas fa-palette"></i> 8 Plantillas</div>
            <div className="hf_btn hf_bot_r"><i className="fas fa-lock"></i> 100% Privado</div>
          </div>
          <div className="hero_deco" aria-hidden="true">
            <span>💕</span><span>💌</span><span>❤️</span><span>✨</span><span>🥂</span>
          </div>
        </div>
      </section>

      {/* ── EJEMPLOS ── */}
      <section className="sec_ej" id="ejemplos">
        <div className="sec_head"><h2><i className="fas fa-sparkles"></i> Inspírate con Ejemplos</h2><div className="sec_line"></div></div>
        <p className="sec_desc">Mensajes reales listos para personalizar. Haz clic para verlo en acción ✨</p>
        <div className="ej_grid">
          {EJ.map((e, i) => (
            <Showi key={i}>
              <Link href={"/ejemplos/" + e.tipo.toLowerCase()} className="ej_item" style={{ '--x': e.x } as React.CSSProperties}>
                <div className="ej_top"><span>{e.e}</span><span className="ej_tag">{e.tipo}</span></div>
                <p>"{e.msg}"</p>
                <div className="ej_meta">
                  <span><i className="fas fa-user"></i> {e.de}</span>
                  <span><i className="fas fa-heart"></i> {e.para}</span>
                </div>
                <span className="ej_ver"><i className="fas fa-eye"></i> Ver mensaje</span>
              </Link>
            </Showi>
          ))}
        </div>
        <div className="sec_cta">
          <Link href="/ejemplos" className="btn_sec wi_nav"><i className="fas fa-th-large"></i><span>Ver Todos los Ejemplos</span></Link>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="sec_como" id="como">
        <div className="sec_head"><h2><i className="fas fa-route"></i> Tu viaje hacia el mensaje perfecto</h2><div className="sec_line"></div></div>
        <p className="sec_desc">4 pasos simples para crear algo que tu pareja recordará para siempre 💌</p>
        <div className="journey_grid">
          {PASOS.map((paso, i) => (
            <div key={i} className="paso_wrap">
              <Showi>
                <div className="paso">
                  <div className="paso_num">{paso.n}</div>
                  <div className="paso_card">
                    <div className="paso_top">
                      <span className="paso_emoji">{paso.e}</span>
                      <span className="paso_tag">{paso.tag}</span>
                    </div>
                    <h3>{paso.tit}</h3>
                    <p>{paso.desc}</p>
                  </div>
                </div>
              </Showi>
              {i < PASOS.length - 1 && (
                <div className="paso_arrow">
                  <i className="fas fa-arrow-right paso_arrow_h"></i>
                  <i className="fas fa-arrow-down paso_arrow_v"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="sec_test">
        <div className="sec_head"><h2>💬 Lo que dicen quienes lo usaron</h2><div className="sec_line"></div></div>
        <p className="sec_desc">Reseñas reales de personas que se atrevieron a expresar lo que sentían 💕</p>
        <div className="test_wall">
          {TESTI.map((t, i) => (
            <Showi key={i}>
              <div className="test_card">
                <div className="test_stars">{'⭐'.repeat(t.stars)}</div>
                <p>{t.msg}</p>
                <div className="test_footer">
                  <div className="test_avatar" style={{ background: t.color }}>{t.ini}</div>
                  <div className="test_info">
                    <strong>{t.autor} <i className="fas fa-circle-check" style={{ color: '#4CAF50', fontSize: '0.9em' }}></i></strong>
                    <span>{t.cat}</span>
                  </div>
                </div>
              </div>
            </Showi>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="sec_feat">
        <div className="sec_head"><h2><i className="fas fa-sparkles"></i> ¿Por qué elegir {app}?</h2><div className="sec_line"></div></div>
        <p className="sec_desc">Todo lo que necesitas para crear un mensaje que deje sin palabras 💫</p>
        <div className="feat_grid">
          {FEATS.map((f, i) => (
            <Showi key={i}>
              <div className={"feat_card" + (f.big ? " feat_big" : "")}>
                <span className="feat_emoji">{f.e}</span>
                <h3>{f.tit}</h3>
                <p>{f.desc}</p>
              </div>
            </Showi>
          ))}
        </div>
      </section>

      {/* ── BENEFICIOS ── */}
      <section className="sec_ben">
        <div className="sec_head"><h2><i className="fas fa-trophy"></i> {app} vs. el resto</h2><div className="sec_line"></div></div>
        <p className="sec_desc">¿Por qué miles de personas nos eligen a nosotros? Aquí la respuesta honesta 🏆</p>
        <div className="ben_grid">
          {BENEFICIOS.map((b, i) => (
            <Showi key={i}>
              <div className="ben_card">
                <span className="ben_emoji">{b.e}</span>
                <div className="ben_content">
                  <h3>{b.tit}</h3>
                  <p>{b.desc}</p>
                </div>
                <div className="ben_check"><i className="fas fa-check"></i></div>
              </div>
            </Showi>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="cta_final">
        <Showi>
          <div className="cta_final_inner">
            <div className="cta_emojis" aria-hidden="true">💕 💌 ❤️ ✨ 💕</div>
            <h2>¿Listo para crear tu mensaje?</h2>
            <p>Únete a miles de personas que ya se atrevieron a decir lo que sienten con <strong>{app}</strong> 💌</p>
            <Link href="/crear" className="cta_btn wi_nav"><i className="fas fa-wand-magic-sparkles"></i> Crear Mensaje - Es Gratis</Link>
            <div className="cta_tags">
              <span>✅ Sin registro</span>
              <span>🆓 100% gratis</span>
              <span>♾️ Ilimitado</span>
              <span>🔒 Privado</span>
            </div>
          </div>
        </Showi>
      </section>

    </div>
  );
}
