"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { app } from "./wii";
import { cx } from "./widev/clase";
import { esRutaActiva, NAV_PUBLICA } from "./widev/nav";
import { useBodyClass, useCerrarConEscape } from "./widev/movil";
import { abrirLogin } from "./login";

export function WiHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useBodyClass("movil_open", open);
  useCerrarConEscape(open, () => setOpen(false));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="wiheader">
        <div className="nv_left">
          <Link href="/" className="wilogo" aria-label="Ir al inicio">
            <i className="fas fa-heart" aria-hidden="true"></i>
            <span>{app}</span>
          </Link>

          <nav className="winav" aria-label="Navegacion principal">
            {NAV_PUBLICA.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx("nv_item", esRutaActiva(pathname, item.href) && "active")}
              >
                <i className={`fas ${item.icon}`} aria-hidden="true"></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="nv_right" role="group" aria-label="Acciones de usuario">
          <Link href="/descubre" className={cx("nv_item", esRutaActiva(pathname, "/descubre") && "active")}>
            <i className="fas fa-gauge" aria-hidden="true" />
            <span>Descubre</span>
          </Link>
          <button type="button" className="bt_auth" onClick={() => abrirLogin("registrar")}>
            <i className="fas fa-user-plus" aria-hidden="true" />
            <span>Registrar</span>
          </button>
          <button type="button" className="bt_auth login" onClick={() => abrirLogin("login")}>
            <i className="fas fa-sign-in-alt" aria-hidden="true" />
            <span>Login</span>
          </button>
        </div>
        <button
          type="button"
          className="wimenu dpn"
          aria-label="Abrir menu de navegacion"
          onClick={() => setOpen(true)}
        >
          <i className="fas fa-bars" aria-hidden="true"></i>
        </button>
      </header>

      <div className="movil_overlay" aria-hidden={!open} onClick={() => setOpen(false)} />
      <nav className="movil_drawer" role="dialog" aria-modal="true" aria-label="Menu movil" aria-hidden={!open}>
        <button
          type="button"
          className="movil_close"
          aria-label="Cerrar menu"
          onClick={() => setOpen(false)}
        >
          <i className="fas fa-xmark" aria-hidden="true"></i>
        </button>
        <div className="movil_logo">
          <i className="fas fa-heart" aria-hidden="true"></i>
          <span> {app}</span>
        </div>
        <div className="movil_nav">
          {NAV_PUBLICA.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cx("nv_item", esRutaActiva(pathname, item.href) && "active")}
              onClick={() => setOpen(false)}
            >
              <i className={`fas ${item.icon}`} aria-hidden="true"></i>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="movil_divider" />
          <Link href="/descubre" className="nv_item" onClick={() => setOpen(false)}>
            <i className="fas fa-gauge" aria-hidden="true" />
            <span>Descubre</span>
          </Link>
          <button type="button" className="bt_auth registrar" onClick={() => { setOpen(false); abrirLogin("registrar"); }}>
            <i className="fas fa-user-plus" aria-hidden="true" />
            <span>Registrar</span>
          </button>
          <button type="button" className="bt_auth login" onClick={() => { setOpen(false); abrirLogin("login"); }}>
            <i className="fas fa-sign-in-alt" aria-hidden="true" />
            <span>Login</span>
          </button>
        </div>
      </nav>
    </>
  );
}
