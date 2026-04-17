"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { app } from "./wii";
import { cx } from "./widev/clase";
import { WiIcono } from "./widev/icono";
import { esRutaActiva, NAV_ACCIONES, NAV_PUBLICA } from "./widev/nav";
import { useBodyClass, useCerrarConEscape } from "./widev/movil";

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
            <WiIcono name="heart" />
            <span>{app}</span>
          </Link>

          <nav className="winav" aria-label="Navegacion principal">
            {NAV_PUBLICA.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx("nv_item", esRutaActiva(pathname, item.href) && "active")}
              >
                <WiIcono name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="nv_right" role="group" aria-label="Acciones de usuario">
          <Link href={NAV_ACCIONES[0].href} className={cx("nv_item", esRutaActiva(pathname, "/ejemplos") && "active")}>
            <WiIcono name={NAV_ACCIONES[0].icon} />
            <span>{NAV_ACCIONES[0].label}</span>
          </Link>
          <Link href={NAV_ACCIONES[1].href} className="bt_auth">
            <WiIcono name={NAV_ACCIONES[1].icon} />
            <span>{NAV_ACCIONES[1].label}</span>
          </Link>
          <Link href={NAV_ACCIONES[2].href} className="bt_auth login">
            <WiIcono name={NAV_ACCIONES[2].icon} />
            <span>{NAV_ACCIONES[2].label}</span>
          </Link>
        </div>
        <button
          type="button"
          className="wimenu dpn"
          aria-label="Abrir menu de navegacion"
          onClick={() => setOpen(true)}
        >
          <WiIcono name="menu" />
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
          <WiIcono name="close" />
        </button>
        <div className="movil_logo">
          <WiIcono name="heart" />
          <span>{app}</span>
        </div>
        <div className="movil_nav">
          {NAV_PUBLICA.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cx("nv_item", esRutaActiva(pathname, item.href) && "active")}
              onClick={() => setOpen(false)}
            >
              <WiIcono name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="movil_divider" />
          <Link href={NAV_ACCIONES[0].href} className="nv_item" onClick={() => setOpen(false)}>
            <WiIcono name={NAV_ACCIONES[0].icon} />
            <span>{NAV_ACCIONES[0].label}</span>
          </Link>
          <Link href={NAV_ACCIONES[1].href} className="bt_auth registrar" onClick={() => setOpen(false)}>
            <WiIcono name={NAV_ACCIONES[1].icon} />
            <span>{NAV_ACCIONES[1].label}</span>
          </Link>
          <Link href={NAV_ACCIONES[2].href} className="bt_auth login" onClick={() => setOpen(false)}>
            <WiIcono name={NAV_ACCIONES[2].icon} />
            <span>{NAV_ACCIONES[2].label}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
