"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PlantillaView } from "./plantilla";
import { abrirModal, cerrarTodos, iniciarModales } from "./widev/modales";

type VistaAuth = "login" | "registrar" | "recuperar";

function modoAVista(modo: string | null): VistaAuth {
  if (modo === "reg" || modo === "registrar") return "registrar";
  if (modo === "rec" || modo === "recuperar") return "recuperar";
  return "login";
}

export function LoginView() {
  const searchParams = useSearchParams();
  const modo = searchParams.get("modo");
  const [loading, setLoading] = useState(false);
  const [aviso, setAviso] = useState("");
  const [vista, setVista] = useState<VistaAuth>("login");

  useEffect(() => {
    iniciarModales();
    const nextVista = modoAVista(modo);
    setVista(nextVista);
    setAviso("");
    const t = window.setTimeout(() => abrirModal("wilg_modal"), 45);
    return () => window.clearTimeout(t);
  }, [modo]);

  const abrirAuth = (nextVista: VistaAuth) => {
    setVista(nextVista);
    setAviso("");
    window.setTimeout(() => abrirModal("wilg_modal"), 15);
  };

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setLoading(true);

    const actual = vista;
    setTimeout(() => {
      setLoading(false);
      if (actual === "recuperar") {
        setAviso("Te enviamos un enlace de recuperacion.");
        setVista("login");
        return;
      }
      if (actual === "registrar") {
        setAviso("Cuenta creada (demo UI).");
      } else {
        setAviso("Ingreso correcto (demo UI).");
      }
      cerrarTodos();
    }, 650);
  };

  return (
    <PlantillaView
      etiqueta="Acceso"
      titulo="Login, registro y recuperar"
      descripcion="Base reusable en modal (widev) para login, registrar y olvidar contrasena."
    >
      <div className="wilg_acciones">
        <button className="wi_btn primary" type="button" onClick={() => abrirAuth("login")}>
          Entrar
        </button>
        <button className="wi_btn secondary" type="button" onClick={() => abrirAuth("registrar")}>
          Crear cuenta
        </button>
      </div>

      {aviso && <p className="wilg_aviso">{aviso}</p>}

      <div
        id="wilg_modal"
        className={`wiModal wilg_mod ${vista === "registrar" ? "wilg_mod_reg" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Acceso de usuario"
      >
        <div className="modalBody">
          <button type="button" className="modalX" aria-label="Cerrar modal">
            ×
          </button>

          <form id="liForm" className="wilg_form" onSubmit={onSubmit}>
            {vista === "login" && (
              <>
                <div className="wilg_head">
                  <h2>Bienvenido</h2>
                  <p>Inicia sesion en tu cuenta</p>
                </div>
                <div className="wilg_grupo">
                  <label htmlFor="email">Correo o usuario</label>
                  <input id="email" name="email" type="text" placeholder="correo@ejemplo.com" required />
                </div>
                <div className="wilg_grupo">
                  <label htmlFor="password">Contrasena</label>
                  <input id="password" name="password" type="password" placeholder="Tu contrasena" minLength={6} required />
                </div>
                <button className="wilg_btn" type="submit" disabled={loading}>
                  {loading ? "Ingresando..." : "Iniciar sesion"}
                </button>
                <div className="wilg_links">
                  <button type="button" className="wilg_link" onClick={() => setVista("recuperar")}>
                    Olvide mi contrasena
                  </button>
                  <button type="button" className="wilg_link" onClick={() => setVista("registrar")}>
                    Crear cuenta
                  </button>
                </div>
              </>
            )}

            {vista === "registrar" && (
              <>
                <div className="wilg_head">
                  <h2>Crear cuenta</h2>
                  <p>Unete en segundos</p>
                </div>
                <div className="wilg_grid">
                  <div className="wilg_grupo">
                    <label htmlFor="regEmail">Email</label>
                    <input id="regEmail" name="regEmail" type="email" placeholder="correo@ejemplo.com" required />
                  </div>
                  <div className="wilg_grupo">
                    <label htmlFor="regUsuario">Usuario</label>
                    <input id="regUsuario" name="regUsuario" type="text" placeholder="tu_usuario" required />
                  </div>
                  <div className="wilg_grupo">
                    <label htmlFor="regNombre">Nombre</label>
                    <input id="regNombre" name="regNombre" type="text" placeholder="Tu nombre" required />
                  </div>
                  <div className="wilg_grupo">
                    <label htmlFor="regApellidos">Apellidos</label>
                    <input id="regApellidos" name="regApellidos" type="text" placeholder="Tus apellidos" required />
                  </div>
                </div>
                <div className="wilg_grupo">
                  <label htmlFor="regPassword">Contrasena</label>
                  <input id="regPassword" name="regPassword" type="password" placeholder="Minimo 6 caracteres" minLength={6} required />
                </div>
                <div className="wilg_grupo">
                  <label htmlFor="regPassword1">Confirmar contrasena</label>
                  <input id="regPassword1" name="regPassword1" type="password" placeholder="Repite tu contrasena" minLength={6} required />
                </div>
                <button className="wilg_btn" type="submit" disabled={loading}>
                  {loading ? "Creando..." : "Registrarme"}
                </button>
                <div className="wilg_links">
                  <button type="button" className="wilg_link" onClick={() => setVista("login")}>
                    Ya tengo cuenta
                  </button>
                </div>
              </>
            )}

            {vista === "recuperar" && (
              <>
                <div className="wilg_head">
                  <h2>Recuperar acceso</h2>
                  <p>Te enviaremos un enlace por email</p>
                </div>
                <div className="wilg_grupo">
                  <label htmlFor="recEmail">Email o usuario</label>
                  <input id="recEmail" name="recEmail" type="text" placeholder="correo@ejemplo.com" required />
                </div>
                <button className="wilg_btn" type="submit" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar enlace"}
                </button>
                <div className="wilg_links">
                  <button type="button" className="wilg_link" onClick={() => setVista("login")}>
                    Volver al login
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </PlantillaView>
  );
}
