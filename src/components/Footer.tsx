"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as wii from '@/app/wii';

export default function Footer() {
  const [showCookies, setShowCookies] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Revisamos al instante si ya hay decisión (sin el delay de 800ms de WiiHope)
    if (!localStorage.getItem('cookies')) {
      // Pequeño delay de 50ms para permitir que la animación CSS 'cookiess_show' actúe
      setTimeout(() => setShowCookies(true), 50);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookies', 'true');
    setShowCookies(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem('cookies', 'false');
    setShowCookies(false);
  };

  const REDES = [
    { tit: 'YouTube', ico: 'fab fa-youtube', url: 'https://www.youtube.com/@wiihope', bg: '#ff0000' },
    { tit: 'Facebook', ico: 'fab fa-facebook-f', url: 'https://www.facebook.com/wiihopee', bg: '#1877F2' },
    { tit: 'Instagram', ico: 'fab fa-instagram', url: 'https://www.instagram.com/WiiHopee', bg: 'linear-gradient(45deg,#f58529,#dd2a7b,#515bd4)' },
    { tit: 'TikTok', ico: 'fab fa-tiktok', url: 'https://www.tiktok.com/@wiihope', bg: '#000' },
  ];

  return (
    <>
      <footer className="foo">
        <div className="foo_inner">
          <div className="foo_left">
            <div className="foo_brand">
              <Link href="/" className="foo_app">{wii.app}</Link>
              <span className="foo_ver">{wii.version}</span>
            </div>
            <div className="foo_links">
              <Link href="/terminos" className="foo_link nv_item"><i className="fas fa-file-contract"></i> Términos</Link>
              <Link href="/cookies" className="foo_link nv_item"><i className="fas fa-cookie-bite"></i> Cookies</Link>
              <Link href="/privacidad" className="foo_link nv_item"><i className="fas fa-lock"></i> Privacidad</Link>
              <Link href="/feedback" className="foo_link nv_item"><i className="fas fa-comment-dots"></i> Feedback</Link>
              <Link href="/contacto" className="foo_link nv_item"><i className="fas fa-envelope"></i> Contacto</Link>
              {REDES.map((r, i) => (
                <a key={i} href={r.url} className="redsscc" target="_blank" rel="noopener noreferrer" title={r.tit} style={{ "--rb": r.bg } as React.CSSProperties}>
                  <i className={r.ico}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="foo_right">
            <span>Creado con <i className="fas fa-heart" style={{ color: "var(--mco)" }}></i> by <a href={wii.linkme} target="_blank" rel="noreferrer"><strong>{wii.by}</strong></a> {wii.lanzamiento} - {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* BANNER COOKIES */}
      {mounted && (!showCookies && localStorage.getItem('cookies') ? null : (
        <div className={`cookiess ${showCookies ? 'cookiess_show' : ''}`} role="dialog" aria-live="polite" aria-label="Consentimiento de Cookies">
          <p className="cookiess_txt">
            <i className="fas fa-cookie-bite cookiess_ico"></i>
            Usamos cookies para mejorar tu experiencia y mostrarte anuncios relevantes
            <Link href="/cookies" className="cookiess_link nv_item" style={{ display: 'inline-flex', padding: '0.3vh 0.8vw', marginLeft: '1vh' }}>más info.</Link>
          </p>
          <div className="cookiess_btns">
            <button onClick={handleAcceptCookies} className="cookiess_aceptar">
              <i className="fas fa-check"></i> Aceptar
            </button>
            <button onClick={handleRejectCookies} className="cookiess_rechazar">Rechazar</button>
          </div>
        </div>
      ))}
    </>
  );
}
