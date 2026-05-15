"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as wii from "@/app/wii";
import ModalesLogin from "@/components/ModalesLogin";
import Login from "@/app/(main)/login/login";

// ── NAV CONFIG — Agregar items: solo agrega un objeto al array ───────────────
const COMUN = [
  { href: "/contacto", page: "contacto", ico: "fa-envelope", txt: "Contacto" },
];

const NAV: Record<string, { nvLeft: any[]; nvRight: any[] }> = {
  todos: {
    nvLeft: [
      { href: "/", page: "inicio", ico: "fa-house", txt: "Inicio" },
      { href: "/crear", page: "crear", ico: "fa-plus-circle", txt: "Crear" },
      { href: "/ejemplos", page: "ejemplos", ico: "fa-heart", txt: "Ejemplos" },
      ...COMUN,
    ],
    nvRight: [
      { isBtn: true, cls: "bt_auth", ico: "fa-gauge", txt: "Descubre" },
      { isBtn: true, cls: "bt_auth", ico: "fa-user-plus", txt: "Registrar" },
      { isBtn: true, cls: "bt_auth", ico: "fa-sign-in-alt", txt: "Login" },
    ],

  },
  smile: {
    nvLeft: [
      { href: "/", page: "inicio", ico: "fa-house", txt: "Inicio" },
      { href: "/crear", page: "crear", ico: "fa-plus-circle", txt: "Crear" },
      { href: "/plantillas", page: "plantillas", ico: "fa-palette", txt: "Plantillas" },
      ...COMUN,
    ],
    nvRight: [
      { isPerfil: true },
      { isSalir: true },
    ],
  },
};

// ── RENDER ITEM ──────────────────────────────────────────────────────────────
function Item({ item, pathname, onClick }: { item: any; pathname: string; onClick?: () => void }) {
  if (item.isBtn) return (
    <button className={item.cls} onClick={onClick}>
      <i className={`fas ${item.ico}`} /> <span>{item.txt}</span>
    </button>
  );
  if (item.isPerfil) return (
    <Link href="/perfil" className={`nv_item${pathname === "/perfil" ? " active" : ""}`}>
      <i className="fa-solid fa-user-circle" /> <span>Perfil</span>
    </Link>
  );
  if (item.isSalir) return (
    <button className="nv_item bt_salir"><i className="fa-solid fa-sign-out-alt" /> <span>Salir</span></button>
  );
  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
  return (
    <Link href={item.href} className={`nv_item${active ? " active" : ""}`}>
      <i className={`fas ${item.ico}`} /> <span>{item.txt}</span>
    </Link>
  );
}

// ── HEADER ───────────────────────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();
  const [modalTxt, setModalTxt] = useState<string | null>(null);

  const rol = "todos"; // TODO: Supabase Auth → user?.rol ?? "todos"
  const cfg = NAV[rol] ?? NAV.todos;

  const items = (arr: any[]) => arr.map((item, i) => (
    <Item key={i} item={item} pathname={pathname} onClick={() => {
      if (item.isBtn) setModalTxt(item.txt);
      if (document.body.classList.contains("movil_open")) cerrar();
    }} />
  ));

  // Drawer: toggle body.movil_open (mismo patrón que WiiHope)
  const abrir = () => document.body.classList.add("movil_open");
  const cerrar = () => document.body.classList.remove("movil_open");

  return (
    <>
      <header className="wiheader">
        <div className="nv_left">
          <Link href="/" className="wilogo"><i className={`fa-solid ${wii.icon}`} /> {wii.app}</Link>
          <nav className="winav">{items(cfg.nvLeft)}</nav>
        </div>
        <div className="nv_right">{items(cfg.nvRight)}</div>
        <div className="wimenu dpn" role="button" tabIndex={0} aria-label="Abrir menú" onClick={abrir}>
          <i className="fas fa-bars" />
        </div>
      </header>

      {/* ── MOBILE DRAWER — mismo HTML que WiiHope ── */}
      <div className="movil_overlay" onClick={cerrar} />
      <nav className="movil_drawer" role="navigation" aria-label="Menú móvil">
        <button className="movil_close" onClick={cerrar} aria-label="Cerrar"><i className="fas fa-times" /></button>
        <div className="movil_logo"><i className={`fa-solid ${wii.icon}`} /> {wii.app}</div>
        <div className="movil_nav">
          {items(cfg.nvLeft)}
          {items(cfg.nvRight)}
        </div>
      </nav>

      {/* ── MODALES ── */}
      <ModalesLogin isOpen={!!modalTxt} onClose={() => setModalTxt(null)} className={`wilg_mod ${modalTxt === "Registrar" ? "wilg_mod_reg" : ""}`}>
        {modalTxt === "Login" && <Login vistaInicial="login" isModal={true} />}
        {modalTxt === "Registrar" && <Login vistaInicial="registrar" isModal={true} />}
        {modalTxt === "Descubre" && (
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: 'var(--wb)', borderRadius: '1vh' }}>
            <i className="fas fa-gauge" style={{ fontSize: '3rem', color: 'var(--mco)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Descubre AmorWii</h2>
            <p style={{ color: 'var(--tx2)', marginBottom: '1.5rem' }}>Explora las increíbles sorpresas creadas por otros Smiles y encuentra inspiración.</p>
            <button className="wilg_btn" onClick={() => setModalTxt(null)}>Cerrar</button>
          </div>
        )}
      </ModalesLogin>
    </>
  );
}
