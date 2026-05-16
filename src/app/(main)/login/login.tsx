"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { sanName, sanEmail, sanUser, validar, msgError } from "@/lib/seguridad";
import type { SmileNuevo } from "@/lib/tipos";
import * as wii from "@/app/wii";
import { Mensaje } from "@/components/Mensaje";
import Wispin from "@/components/Wispin";
import Witip from "@/components/Witip";

// ── CONFIG ───────────────────────────────────────────────────────────────────
export const LCFG = { modal: 'si', link: 'si', restablecer: 'si', login: 'si', registrar: 'si', google: 'si' };
const irPagina = "crear"; // Página a la que redirige al entrar (sin slash)

type Vista = "login" | "registrar" | "recuperar" | "completar";
type TipData = { msg: string; tipo: "error" | "success" };
type CampoProps = { ico: string; tipo?: string; id: string; place: string; value: string; onChange: (v: string) => void; onBlur?: () => void; tip?: TipData; ojo?: boolean; };

// ── CAMPO INPUT CON WITIP ────────────────────────────────────────────────────
function Campo({ ico, tipo = "text", id, place, value, onChange, onBlur, tip, ojo }: CampoProps) {
    const [ver, setVer] = useState(false);
    return (
        <Witip show={!!tip} msg={tip?.msg || ""} tipo={tip?.tipo || "error"}>
            <div className="wilg_grupo">
                <i className={`fas fa-${ico}`} />
                <input type={ojo && ver ? "text" : tipo} id={id} placeholder={place} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} autoComplete="off" />
                {ojo && <i className={`fas fa-eye${ver ? "-slash" : ""} wilg_ojo`} onClick={() => setVer(!ver)} />}
            </div>
        </Witip>
    );
}

// ── LOGIN COMPONENT ─────────────────────────────────────────────────────────
export default function Login({ vistaInicial = "login", isModal = false, cfg = LCFG }: { vistaInicial?: Vista; isModal?: boolean; cfg?: typeof LCFG }) {
    const router = useRouter();
    const [vista, setVista] = useState<Vista>(vistaInicial);
    const [cargando, setCargando] = useState(false);
    const [tips, setTips] = useState<Record<string, TipData>>({});

    const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
    const [regEmail, setRegEmail] = useState(""); const [regUsuario, setRegUsuario] = useState("");
    const [regNombre, setRegNombre] = useState(""); const [regApellidos, setRegApellidos] = useState("");
    const [regPassword, setRegPassword] = useState(""); const [regPassword1, setRegPassword1] = useState("");
    const [regTerminos, setRegTerminos] = useState(false);
    const [usuarioOk, setUsuarioOk] = useState(false); const [emailOk, setEmailOk] = useState(false);
    const [recEmail, setRecEmail] = useState("");

    const limpiarTips = () => setTips({});
    const setTip = (c: string, m: string, t: "error" | "success" = "error") => setTips(p => ({ ...p, [c]: { msg: m, tipo: t } }));
    const limpiarTip = (c: string) => setTips(p => { const n = { ...p }; delete n[c]; return n; });
    const cambiarVista = (v: Vista) => { limpiarTips(); setVista(v); };

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                try {
                    const { data, error } = await supabase.from("smiles").select("nombre").eq("id", session.user.id).maybeSingle();
                    if (data) {
                        // Si ya existe, el Header se encarga o lo hacemos aquí si no es modal
                        if (!isModal) entrar(data);
                    } else if (session.user.app_metadata?.provider === "google") {
                        // New user from Google
                        if (session.user.email) setRegEmail(session.user.email);
                        if (session.user.user_metadata?.full_name) {
                            const parts = session.user.user_metadata.full_name.split(' ');
                            setRegNombre(parts[0]);
                            if (parts.length > 1) setRegApellidos(parts.slice(1).join(' '));
                        }
                        cambiarVista("completar");
                    }
                } catch (e) {
                    console.error("Error al verificar perfil:", e);
                }
            }
        });
        return () => authListener.subscription.unsubscribe();
    }, [router]);

    const verificarUsuario = async (u: string) => {
        if (u.length < 4) return;
        if (u.includes("@")) { setTip("regUsuario", "No puede contener @"); setUsuarioOk(false); return; }
        try {
            const { data, error } = await supabase.from("smiles").select("usuario").eq("usuario", u).maybeSingle();
            if (error && error.code !== "PGRST116") throw error;
            if (data) { setTip("regUsuario", "Usuario no disponible <i class='fa-solid fa-times-circle'></i>"); setUsuarioOk(false); }
            else { setTip("regUsuario", "Usuario disponible <i class='fa-solid fa-check-circle'></i>", "success"); setUsuarioOk(true); }
        } catch (e) { setTip("regUsuario", "Usuario disponible <i class='fa-solid fa-check-circle'></i>", "success"); setUsuarioOk(true); }
    };

    const verificarEmail = async (e: string) => {
        const r = validar.email(e); if (r !== true) { setTip("regEmail", r); return; }
        try {
            const { data, error } = await supabase.from("smiles").select("email").eq("email", e).maybeSingle();
            if (error && error.code !== "PGRST116") throw error;
            if (data) { setTip("regEmail", "Email ya registrado <i class='fa-solid fa-times-circle'></i>"); setEmailOk(false); }
            else { setTip("regEmail", "Email disponible <i class='fa-solid fa-check-circle'></i>", "success"); setEmailOk(true); }
        } catch (err) { setTip("regEmail", "Email disponible <i class='fa-solid fa-check-circle'></i>", "success"); setEmailOk(true); }
    };

    const hacerLogin = async () => {
        if (cargando || !email || !password) return;
        setCargando(true); limpiarTips();
        try {
            let em = sanEmail(email);
            if (!em.includes("@")) {
                const { data } = await supabase.from("smiles").select("email").eq("usuario", em).maybeSingle();
                if (!data) throw new Error("Usuario no encontrado"); em = data.email;
            }
            const { error } = await supabase.auth.signInWithPassword({ email: em, password });
            if (error) throw error;
            const { data: wi } = await supabase.from("smiles").select("*").eq("email", em).maybeSingle();
            entrar(wi);
        } catch (e: any) { Mensaje(msgError(e), "error"); } finally { setCargando(false); }
    };

    const entrar = (wi: any) => {
        Mensaje(`¡Bienvenido, ${wi?.nombre || "Smile"}! 💖`, "success");
        if (wi?.tema) localStorage.wiTema = wi.tema;
        router.push("/" + irPagina);
        if (isModal) router.refresh();
    };

    const hacerRegistro = async () => {
        if (cargando) return;
        const fallo = [[!regTerminos, "Acepta los términos"], [!usuarioOk, "Verifica el usuario"], [!emailOk, "Verifica el email"]].find(([c]) => c);
        if (fallo) { Mensaje(fallo[1] as string, "warning"); return; }
        const r1 = validar.password(regPassword); if (r1 !== true) { setTip("regPassword", r1); return; }
        const r2 = validar.passConf(regPassword1, regPassword); if (r2 !== true) { setTip("regPassword1", r2); return; }

        setCargando(true); limpiarTips();
        try {
            const { error: authError } = await supabase.auth.signUp({ email: sanEmail(regEmail), password: regPassword });
            if (authError) throw authError;
            const nuevoSmile: SmileNuevo = {
                usuario: sanUser(regUsuario), email: sanEmail(regEmail), nombre: sanName(regNombre).trim(), apellidos: sanName(regApellidos).trim(),
                avatar: "", bio: "", estado: "activo", plan: "free", rol: "smile", segmento: "creador",
                tema: localStorage.getItem("wiTema") || "Dulce|#FF5C69", terminos: true, verificado: false, registradoPor: "correo",
            };
            const { error: dbError } = await supabase.from("smiles").insert(nuevoSmile);
            if (dbError) throw dbError;
            entrar(nuevoSmile);
        } catch (e: any) { Mensaje(msgError(e), "error"); } finally { setCargando(false); }
    };

    const hacerCompletar = async () => {
        if (cargando) return;
        const fallo = [[!regTerminos, "Acepta los términos"], [!usuarioOk, "Verifica el usuario"]].find(([c]) => c);
        if (fallo) { Mensaje(fallo[1] as string, "warning"); return; }

        setCargando(true); limpiarTips();
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error("No hay sesión activa");

            const nuevoSmile: SmileNuevo = {
                usuario: sanUser(regUsuario), email: sanEmail(regEmail), nombre: sanName(regNombre).trim(), apellidos: sanName(regApellidos).trim(),
                avatar: userData.user.user_metadata?.avatar_url || "", bio: "", estado: "activo", plan: "free", rol: "smile", segmento: "creador",
                tema: localStorage.getItem("wiTema") || "Dulce|#FF5C69", terminos: true, verificado: false, registradoPor: "google",
            };

            const { error: dbError } = await supabase.from("smiles").insert(nuevoSmile);
            if (dbError) throw dbError;
            entrar(nuevoSmile);
        } catch (e: any) { Mensaje(msgError(e), "error"); } finally { setCargando(false); }
    };

    const loginGoogle = async () => {
        if (cargando) return; setCargando(true);
        const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/login` } });
        if (error) { Mensaje(msgError(error), "error"); setCargando(false); }
    };

    const hacerRecuperar = async () => {
        if (cargando || !recEmail) return;
        setCargando(true); limpiarTips();
        try {
            let em = sanEmail(recEmail);
            if (!em.includes("@")) {
                const { data } = await supabase.from("smiles").select("email").eq("usuario", em).maybeSingle();
                if (!data) throw new Error("Usuario no encontrado"); em = data.email;
            }
            const { error } = await supabase.auth.resetPasswordForEmail(em);
            if (error) throw error;
            Mensaje("Email enviado, revisa tu bandeja", "success"); setTimeout(() => cambiarVista("login"), 3000);
        } catch (e: any) { Mensaje(msgError(e), "error"); } finally { setCargando(false); }
    };

    // ── RENDER ─────────────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (vista === "login") hacerLogin();
        else if (vista === "registrar") hacerRegistro();
        else if (vista === "recuperar") hacerRecuperar();
        else if (vista === "completar") hacerCompletar();
    };

    // ── BOTON GOOGLE REUTILIZABLE ──
    const BtnGoogle = () => cfg.google === 'si' ? (
        <>
            <button type="button" className="wilg_btn_google" onClick={loginGoogle} disabled={cargando}>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" /> Continuar con Google
            </button>
            <div className="wilg_or"><span>o usa tu email</span></div>
        </>
    ) : null;

    const content = (
        <form id="liForm" onSubmit={handleSubmit}>

            {vista === "login" && <>
                <div className="wilg_head"><div className="wilg_logo"><img src="/smile.avif" alt={wii.app} /></div><h2>Bienvenido</h2><p>Inicia sesión en tu cuenta</p></div>
                <BtnGoogle />
                <Campo ico="envelope" id="email" place="Email o usuario" tip={tips.email} value={email} onChange={v => setEmail(sanEmail(v))} />
                <Campo ico="lock" tipo="password" id="password" place="Contraseña" ojo tip={tips.password} value={password} onChange={setPassword} onBlur={() => { }} />
                <Wispin type="submit" className={`wilg_btn${!password ? " inactivo" : ""}`} ico="fa-sign-in-alt" textoCarga="Iniciando..." cargando={cargando}>Iniciar Sesión</Wispin>
                {cfg.link === 'si' && (
                    <div className="wilg_links">
                        {cfg.restablecer === 'si' && <span className="wilg_rec" onClick={() => cambiarVista("recuperar")}><i className="fas fa-key" /> ¿Olvidaste tu contraseña?</span>}
                        {cfg.registrar === 'si' && <span className="wilg_reg" onClick={() => cambiarVista("registrar")}>Crear cuenta <i className="fas fa-arrow-right" /></span>}
                    </div>
                )}
            </>}

            {vista === "registrar" && <>
                <div className="wilg_head"><div className="wilg_logo"><img src="/smile.avif" alt={wii.app} /></div><h2>Crear Cuenta</h2><p>Únete a la comunidad</p></div>
                <BtnGoogle />
                <div className="wilg_grid">
                    <Campo ico="envelope" id="regEmail" place="Email" tip={tips.regEmail} value={regEmail} onChange={v => setRegEmail(sanEmail(v))} onBlur={() => verificarEmail(regEmail)} />
                    <Campo ico="user" id="regUsuario" place="Usuario" tip={tips.regUsuario} value={regUsuario} onChange={v => setRegUsuario(sanUser(v))} onBlur={() => verificarUsuario(regUsuario)} />
                    <Campo ico="user-tie" id="regNombre" place="Nombre" tip={tips.regNombre} value={regNombre} onChange={v => setRegNombre(sanName(v))} onBlur={() => { const r = validar.nombre(regNombre); if (r !== true) setTip("regNombre", r); else limpiarTip("regNombre"); }} />
                    <Campo ico="user-tie" id="regApellidos" place="Apellidos" tip={tips.regApellidos} value={regApellidos} onChange={v => setRegApellidos(sanName(v))} onBlur={() => { const r = validar.apellidos(regApellidos); if (r !== true) setTip("regApellidos", r); else limpiarTip("regApellidos"); }} />
                    <Campo ico="lock" tipo="password" id="regPassword" place="Contraseña" ojo tip={tips.regPassword} value={regPassword} onChange={setRegPassword} onBlur={() => { const r = validar.password(regPassword); if (r !== true) setTip("regPassword", r); else limpiarTip("regPassword"); }} />
                    <Campo ico="lock" tipo="password" id="regPassword1" place="Confirmar" ojo tip={tips.regPassword1} value={regPassword1} onChange={setRegPassword1} onBlur={() => { const r = validar.passConf(regPassword1, regPassword); if (r !== true) setTip("regPassword1", r); else limpiarTip("regPassword1"); }} />
                </div>
                <div className="wilg_check">
                    <label><input type="checkbox" checked={regTerminos} onChange={e => setRegTerminos(e.target.checked)} /><span>Acepto los <a href="/terminos" target="_blank">términos</a></span></label>
                </div>
                <Wispin type="submit" className={`wilg_btn${!regTerminos ? " inactivo" : ""}`} ico="fa-user-plus" textoCarga="Registrando..." cargando={cargando}>Registrarme</Wispin>
                {cfg.link === 'si' && cfg.login === 'si' && (
                    <div className="wilg_links"><span className="wilg_log" onClick={() => cambiarVista("login")}><i className="fas fa-arrow-left" /> Ya tengo cuenta</span></div>
                )}
            </>}

            {vista === "recuperar" && <>
                <div className="wilg_head"><div className="wilg_logo wilg_logo_sm"><img src="/smile.avif" alt={wii.app} /></div><h2>Recuperar</h2><p>Te enviaremos un enlace a tu email</p></div>
                <Campo ico="envelope" id="recEmail" place="Email o usuario" tip={tips.recEmail} value={recEmail} onChange={v => setRecEmail(sanEmail(v))} />
                <Wispin type="submit" className="wilg_btn" ico="fa-paper-plane" textoCarga="Enviando..." cargando={cargando}>Enviar enlace</Wispin>
                {cfg.link === 'si' && cfg.login === 'si' && (
                    <div className="wilg_links"><span className="wilg_log" onClick={() => cambiarVista("login")}><i className="fas fa-arrow-left" /> Volver</span></div>
                )}
            </>}

            {vista === "completar" && <>
                <div className="wilg_head"><div className="wilg_logo"><img src="/smile.avif" alt={wii.app} /></div><h2>¡Casi listo!</h2><p>Elige tu usuario para AmorWii</p></div>
                <Campo ico="user" id="regUsuario" place="Usuario (ej. pablito)" tip={tips.regUsuario} value={regUsuario} onChange={v => setRegUsuario(sanUser(v))} onBlur={() => verificarUsuario(regUsuario)} />
                <div className="wilg_check">
                    <label><input type="checkbox" checked={regTerminos} onChange={e => setRegTerminos(e.target.checked)} /><span>Acepto los <a href="/terminos" target="_blank">términos</a></span></label>
                </div>
                <Wispin type="submit" className={`wilg_btn${!regTerminos ? " inactivo" : ""}`} ico="fa-check" textoCarga="Guardando..." cargando={cargando}>Completar Perfil</Wispin>
            </>}

        </form>
    );

    return isModal ? content : (
        <div className="wilg_wrap">
            <div className="wilg_card">
                {content}
            </div>
        </div>
    );
}
