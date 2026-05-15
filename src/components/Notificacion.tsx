"use client";
import { useState, useEffect } from "react";

type TipoNotif = "success" | "error" | "warning" | "info";
type Notif = { id: number; msg: string; tipo: TipoNotif; anim: boolean };

export const Notificacion = (msg: string, tipo: TipoNotif = "error", tiempo = 3000) => {
  if (typeof window !== "undefined") {
    document.dispatchEvent(new CustomEvent("wiNotif", { detail: { msg, tipo, tiempo } }));
  }
};

export default function NotificacionContainer() {
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      const { msg, tipo, tiempo } = e.detail;
      const id = Date.now() + Math.random();
      setNotifs(p => [...p, { id, msg, tipo, anim: true }]);
      
      setTimeout(() => {
        setNotifs(p => p.map(n => n.id === id ? { ...n, anim: false } : n));
        setTimeout(() => setNotifs(p => p.filter(n => n.id !== id)), 300);
      }, tiempo);
    };
    document.addEventListener("wiNotif", handler);
    return () => document.removeEventListener("wiNotif", handler);
  }, []);

  if (notifs.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
      {notifs.map(n => {
        const ico = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' }[n.tipo];
        return (
          <div key={n.id} style={{
            background: 'var(--wb)', borderLeft: `4px solid var(--${n.tipo})`, boxShadow: '0 4px 12px rgba(0,0,0,.1)',
            borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '.5rem',
            opacity: n.anim ? 1 : 0, transform: `translateX(${n.anim ? 0 : '20px'})`, transition: 'all .3s ease'
          }}>
            <i className={`fas ${ico}`} style={{ color: `var(--${n.tipo})`, fontSize: '1.2rem' }} />
            <span style={{ flex: 1, color: 'var(--tx)', fontSize: 'var(--fz_m1)', fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: n.msg }} />
            <button onClick={() => setNotifs(p => p.filter(x => x.id !== n.id))} 
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--tx2)' }}>&times;</button>
          </div>
        );
      })}
    </div>
  );
}
