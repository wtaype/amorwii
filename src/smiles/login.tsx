"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { cerrarTodos, abrirModal, iniciarModales } from "./widev/modales";
import "@/app/login/login.css";

export type VistaAuth = "login" | "registrar" | "recuperar";

export interface LoginConfig {
  db?: string;
  pagina?: string;
  showLinks?: boolean;
  allowReset?: boolean;
  allowLogin?: boolean;
  allowReg?: boolean;
}

const CFG: LoginConfig = {
  db: "smiles",
  pagina: "rol",
  showLinks: true,
  allowReset: true,
  allowLogin: true,
  allowReg: true,
};

export const MODAL_ID = "wilg_modal";

export function abrirLogin(vista: VistaAuth = "login") {
  const el = document.getElementById(MODAL_ID);
  if (el) {
    el.dataset.vista = vista;
    abrirModal(MODAL_ID);
  }
}

function EyeToggle({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(false);
  const toggle = () => {
    const el = document.getElementById(targetId) as HTMLInputElement | null;
    if (el) { el.type = visible ? "password" : "text"; setVisible(!visible); }
  };
  return (
    <i
      className={`fas ${visible ? "fa-eye-slash" : "fa-eye"} wilg_ojo`}
      onClick={toggle}
      aria-hidden="true"
    />
  );
}

export function LoginView() {
  const [vista, setVista] = useState<VistaAuth>("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    iniciarModales();
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    const obs = new MutationObserver(() => {
      if (modal.classList.contains("active")) {
        setVista((modal.dataset.vista as VistaAuth) || "login");
        setLoading(false);
      }
    });
    obs.observe(modal, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const ir = (v: VistaAuth) => setVista(v);

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (vista === "recuperar") { alert("Enlace enviado."); ir("login"); return; }
      alert(vista === "registrar" ? "Cuenta creada (demo)." : "Ingreso correcto (demo).");
      cerrarTodos();
    }, 650);
  };

  const isReg = vista === "registrar";

  return (
    <div
      id={MODAL_ID}
      className={`wiModal wilg_mod${isReg ? " wilg_mod_reg" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Acceso"
    >
      <div className="modalBody">
        <button type="button" className="modalX" onClick={cerrarTodos} aria-label="Cerrar">
          <i className="fas fa-times" />
        </button>

        <form id="wilg_form" onSubmit={onSubmit}>
          {/* ── LOGO ── */}
          <div className="wilg_head">
            <div className="wilg_logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/smile.avif" alt="AmorWii" />
            </div>

            {vista === "login" && <><h2>Bienvenido</h2><p>Inicia sesión en tu cuenta</p></>}
            {vista === "registrar" && <><h2>Crear Cuenta</h2><p>Únete a la comunidad</p></>}
            {vista === "recuperar" && <><h2>Recuperar</h2><p>Te enviaremos un enlace a tu email</p></>}
          </div>

          {/* ── LOGIN ── */}
          {vista === "login" && CFG.allowLogin && (
            <>
              <div className="wilg_grupo">
                <i className="fas fa-envelope" aria-hidden="true" />
                <input id="wilg_email" name="email" type="text" placeholder="Email o usuario" required />
              </div>
              <div className="wilg_grupo">
                <i className="fas fa-lock" aria-hidden="true" />
                <input id="wilg_pw" name="password" type="password" placeholder="Contraseña" minLength={6} required />
                <EyeToggle targetId="wilg_pw" />
              </div>
              <button className="wilg_btn" type="submit" disabled={loading}>
                <i className="fas fa-sign-in-alt" /> {loading ? "Ingresando..." : "Iniciar Sesión"}
              </button>
              <div className="wilg_links">
                {CFG.allowReset && <span onClick={() => ir("recuperar")}><i className="fas fa-key" /> ¿Olvidaste tu contraseña?</span>}
                {CFG.allowReg && CFG.showLinks && <span onClick={() => ir("registrar")}>Crear cuenta <i className="fas fa-arrow-right" /></span>}
              </div>
            </>
          )}

          {/* ── REGISTRO ── */}
          {vista === "registrar" && CFG.allowReg && (
            <>
              <div className="wilg_grid">
                <div className="wilg_grupo">
                  <i className="fas fa-envelope" />
                  <input id="rg_email" name="email" type="email" placeholder="Email" required />
                </div>
                <div className="wilg_grupo">
                  <i className="fas fa-user" />
                  <input id="rg_user" name="usuario" type="text" placeholder="Usuario" required />
                </div>
                <div className="wilg_grupo">
                  <i className="fas fa-user-tie" />
                  <input id="rg_nom" name="nombre" type="text" placeholder="Nombre" required />
                </div>
                <div className="wilg_grupo">
                  <i className="fas fa-user-tie" />
                  <input id="rg_ape" name="apellidos" type="text" placeholder="Apellidos" required />
                </div>
                <div className="wilg_grupo">
                  <i className="fas fa-lock" />
                  <input id="rg_pw" name="password" type="password" placeholder="Contraseña" minLength={6} required />
                  <EyeToggle targetId="rg_pw" />
                </div>
                <div className="wilg_grupo">
                  <i className="fas fa-lock" />
                  <input id="rg_pw2" name="password2" type="password" placeholder="Confirmar" minLength={6} required />
                  <EyeToggle targetId="rg_pw2" />
                </div>
              </div>
              <div className="wilg_check">
                <label>
                  <input type="checkbox" required />
                  Acepto los <a href="/acerca/terminos" target="_blank">términos y condiciones</a>
                </label>
              </div>
              <button className="wilg_btn" type="submit" disabled={loading}>
                <i className="fas fa-user-plus" /> {loading ? "Creando..." : "Registrarme"}
              </button>
              {CFG.showLinks && CFG.allowLogin && (
                <div className="wilg_links">
                  <span onClick={() => ir("login")}><i className="fas fa-arrow-left" /> Ya tengo cuenta</span>
                </div>
              )}
            </>
          )}

          {/* ── RECUPERAR ── */}
          {vista === "recuperar" && CFG.allowReset && (
            <>
              <div className="wilg_grupo">
                <i className="fas fa-envelope" />
                <input id="rc_email" name="email" type="text" placeholder="Email o usuario" required />
              </div>
              <button className="wilg_btn" type="submit" disabled={loading}>
                <i className="fas fa-paper-plane" /> {loading ? "Enviando..." : "Enviar enlace"}
              </button>
              {CFG.showLinks && CFG.allowLogin && (
                <div className="wilg_links">
                  <span onClick={() => ir("login")}><i className="fas fa-arrow-left" /> Volver</span>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}
