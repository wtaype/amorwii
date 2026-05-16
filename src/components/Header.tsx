"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as wii from "@/app/wii";
import ModalesLogin from "@/components/ModalesLogin";
import Login from "@/app/(main)/login/login";
import { supabase } from "@/lib/supabase";
import type { SmileNuevo } from "@/lib/tipos";

// ── NAV CONFIG — Agregar items: solo agrega un objeto al array ───────────────
const COMUN = [
  { href: "/crear", page: "crear", ico: "fa-plus-circle", txt: "Crear" },
  { href: "/blog", page: "blog", ico: "fa-book", txt: "Blog" },
  { href: "/chat", page: "chat", ico: "fa-comments", txt: "Ideas" },
  { href: "/enviar-qr", page: "enviar-qr", ico: "fa-qrcode", txt: "Enviar QR" },
  { href: "/plantillas", page: "plantillas", ico: "fa-palette", txt: "Plantillas" },
  { href: "/ejemplos", page: "ejemplos", ico: "fa-heart", txt: "Ejemplos" },
  { href: "/acerca", page: "acerca", ico: "fa-info-circle", txt: "Acerca" },
];

const NAV: Record<string, { nvLeft: any[]; nvRight: any[] }> = {
  todos: {
    nvLeft: [
      { href: "/", page: "inicio", ico: "fa-house", txt: "Inicio" },
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
      { href: "/", page: "inicio", ico: "fa-house", txt: "Dashboard" },
      ...COMUN,
    ],
    nvRight: [
      // { href: '/word', page: 'word', ico: 'fa-rocket', txt: 'Planificar' },
      { href: '/nuevo', page: 'nuevo', ico: 'fa-plus', txt: 'Nuevo Post' },
      { href: '/notas', page: 'notas', ico: 'fa-note-sticky', txt: 'Notas' },
      { href: '/mensajes', page: 'mensajes', ico: 'fa-comments', txt: 'Mensajes' },
      { isPerfil: true },
      { isSalir: true },
    ],
  },
};

// ── RENDER ITEM ──────────────────────────────────────────────────────────────
function Item({ item, pathname, onClick, perfil, signOut }: { item: any; pathname: string; onClick?: () => void; perfil?: any; signOut?: () => void }) {
  if (item.isBtn) return (
    <button className={item.cls} onClick={onClick}>
      <i className={`fas ${item.ico}`} /> <span>{item.txt}</span>
    </button>
  );
  if (item.isPerfil) return (
    <Link href="/perfil" className={`nv_item${pathname === "/perfil" ? " active" : ""}`}>
      <img src={perfil?.avatar || "/smile.avif"} alt={perfil?.nombre || "Perfil"} />
      <span>{perfil?.nombre?.split(' ')[0] || "Perfil"}</span>
    </Link>
  );
  if (item.isSalir) return (
    <button className="nv_item bt_salir" onClick={signOut}><i className="fa-solid fa-sign-out-alt" /> <span>Salir</span></button>
  );
  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
  return (
    <Link href={item.href} className={`nv_item${active ? " active" : ""}`}>
      <i className={`fas ${item.ico}`} /> <span>{item.txt}</span>
    </Link>
  );
}

// ── HEADER ───────────────────────────────────────────────────────────────────
export default function Header({ perfilInicial = null }: { perfilInicial?: SmileNuevo | null }) {
  const pathname = usePathname();
  const [modalTxt, setModalTxt] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<SmileNuevo | null>(perfilInicial);

  // Solo escucha cambios de auth en tiempo real — no consulta al cargar
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setPerfil(null);
      } else if (event === "SIGNED_IN" && session?.user?.email) {
        const { data } = await supabase
          .from("smiles")
          .select("*")
          .eq("email", session.user.email)
          .maybeSingle();
        setPerfil(data ?? null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); };

  const rol = perfil?.rol || "todos";
  const cfg = NAV[rol] ?? NAV.todos;

  const items = (arr: any[]) => arr.map((item, i) => (
    <Item key={i} item={item} pathname={pathname} perfil={perfil} signOut={signOut} onClick={() => {
      if (item.isBtn) setModalTxt(item.txt);
      if (document.body.classList.contains("movil_open")) cerrar();
    }} />
  ));

  // Drawer: toggle body.movil_open
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

      {/* ── MOBILE DRAWER ── */}
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
