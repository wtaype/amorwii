"use client";
import { useState, useEffect } from "react";

export type TipoMsg = "success" | "error" | "warning" | "info";

export const Mensaje = (msg: string, tipo: TipoMsg = "success") => {
  if (typeof window !== "undefined") {
    document.dispatchEvent(new CustomEvent("wiMensaje", { detail: { msg, tipo } }));
  }
};

export default function MensajeContainer() {
  const [msg, setMsg] = useState("");
  const [tipo, setTipo] = useState<TipoMsg>("success");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handler = (e: any) => {
      setMsg(e.detail.msg);
      setTipo(e.detail.tipo);
      setVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setVisible(false), 3000);
    };
    document.addEventListener("wiMensaje", handler);
    return () => document.removeEventListener("wiMensaje", handler);
  }, []);

  if (!visible) return null;
  
  const ico = { success: 'fa-circle-check', error: 'fa-circle-exclamation', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' }[tipo];
  
  return (
    <div className="alert-box" style={{
      position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
      padding: '15px 20px', borderRadius: '8px', background: `var(--wb)`,
      color: `var(--${tipo})`, borderLeft: `4px solid var(--${tipo})`, boxShadow: '0 4px 12px rgba(0,0,0,.1)',
      zIndex: 10500, display: 'flex', alignItems: 'center', gap: '10px', minWidth: '300px', maxWidth: '90%',
      animation: 'liEntrar 0.3s cubic-bezier(.4,0,.2,1)'
    }}>
      <i className={`fas ${ico}`} style={{ fontSize: '1.4rem' }} />
      <span style={{ fontSize: 'var(--fz_m2)', fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: msg }} />
    </div>
  );
}
