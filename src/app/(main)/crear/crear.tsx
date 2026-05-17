"use client";

import { useState, useEffect } from "react";
import imageCompression from 'browser-image-compression';
import Link from "next/link";
import Showi from "@/components/Showi";
import Witip from "@/components/Witip";
import { supabase } from "@/lib/supabase";
import { linkweb } from "@/app/wii";
import { PhonePreview } from "./_components/preview";
import { optimizarImagen } from "./_lib/imgOptimizador";
import { Mensaje } from "@/components/Mensaje";
import "./crear.css";

// Slugs reservados — rutas del sistema que no pueden usarse como link personalizado
const RESERVADAS = new Set([
    "crear", "login", "registro", "logout", "bienvenida", "perfil",
    "blog", "descubre", "ejemplos", "plantillas", "acerca", "contacto",
    "privacidad", "terminos", "admin", "api", "ver", "404", "500",
]);

// ─── Tipos ────────────────────────────────────────
export type FormState = {
    de: string; para: string; msg: string;
    efectoId: string; fondo: string;
    musicaUrl: string; slug: string;
    plantilla: string;
    fotos: string[]; // Fotos subidas localmente (blob urls en UI)
    urlsExternas: string[]; // Links de imágenes externas (ej: imgur)
    pin: string; // PIN de 4 dígitos para proteger
};

// ─── Hook de lógica de creación ───────────────────
function useCreator() {
    const [loading, setLoading] = useState(false);
    const [urlCorta, setUrlCorta] = useState("");
    const [archivosFotos, setArchivosFotos] = useState<File[]>([]);
    const [isAuth, setIsAuth] = useState(false);
    const [authUser, setAuthUser] = useState<any>(null);
    const [userPlan, setUserPlan] = useState<string>("free");
    const [form, setFormState] = useState<FormState>({
        de: "", para: "", msg: "",
        efectoId: "corazones", fondo: "1",
        musicaUrl: "", slug: "",
        plantilla: "Amor1",
        fotos: [],
        urlsExternas: [""], // Start with only 1 external link input
        pin: "",
    });

    // Detectar sesión activa y su plan correspondiente en smiles en tiempo real
    useEffect(() => {
        // Función auxiliar para traer y establecer el plan del usuario
        const actualizarPlanUsuario = async (email: string) => {
            try {
                const { data: smile } = await supabase
                    .from("smiles")
                    .select("plan")
                    .eq("email", email)
                    .maybeSingle();
                if (smile?.plan) {
                    setUserPlan(smile.plan.toLowerCase()); // 'free', 'pro', 'vip'
                } else {
                    setUserPlan("free");
                }
            } catch (e) {
                console.warn("No se pudo obtener el plan del usuario:", e);
                setUserPlan("free");
            }
        };

        // Escuchar el estado de autenticación en tiempo real
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const user = session?.user || null;
            const hasUser = !!user;

            setIsAuth(hasUser);
            setAuthUser(user);

            if (hasUser && user?.email) {
                await actualizarPlanUsuario(user.email);
            } else {
                setUserPlan("free");
            }
        });

        // Limpieza: desuscribirse cuando el componente se desmonte
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleUploadFoto = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const compressedFile = await optimizarImagen(file);
        if (!compressedFile) return;

        // Seguridad: Si no es PRO, solo permitimos slots 0 y 1
        if (index >= 2 && !isAuth) {
            alert("👑 Esta opción es para usuarios PRO. ¡Inicia sesión o regístrate para usar más fotos!");
            return;
        }

        const previewUrl = URL.createObjectURL(compressedFile);

        setFormState(prev => {
            const nuevasFotos = [...prev.fotos];
            nuevasFotos[index] = previewUrl;
            return { ...prev, fotos: nuevasFotos };
        });

        setArchivosFotos(prev => {
            const nuevosArchivos = [...prev];
            nuevosArchivos[index] = compressedFile;
            return nuevosArchivos;
        });
    };

    const setField = (field: keyof FormState, value: any) => {
        setFormState((prev) => {
            const next = { ...prev, [field]: value };
            if (field === "para") {
                const autoSlug = value.toLowerCase().replace(/[^a-z0-9_]+/g, "").slice(0, 10).trim();
                if (autoSlug) {
                    next.slug = autoSlug;
                }
            }
            return next;
        });
    };

    const [base, setBase] = useState(linkweb);

    // Evitar error de hidratación con window.location
    useEffect(() => {
        setBase(window.location.origin);
    }, []);

    // Real-time Long URL generation
    const params = new URLSearchParams();
    if (form.de) params.append("de", form.de);
    if (form.para) params.append("para", form.para);
    if (form.msg) params.append("msg", form.msg);
    if (form.efectoId) params.append("e", form.efectoId);
    if (form.fondo) params.append("f", form.fondo);
    if (form.musicaUrl) params.append("m", form.musicaUrl);

    const queryString = `${form.plantilla}&${params.toString()}`;
    const urlLargaRealtime = `${base}/?${queryString}`;

    const guardar = async () => {
        setLoading(true);
        try {
            const slug = form.slug.trim();

            // Validar PIN si se especificó y el usuario está autenticado (Premium)
            const pinFinal = isAuth ? form.pin.trim() : "";
            if (pinFinal && (pinFinal.length !== 4 || isNaN(Number(pinFinal)))) {
                throw new Error("El PIN de seguridad debe contener exactamente 4 números.");
            }

            // SEGURIDAD: Validar límites antes de subir nada
            if (!isAuth) {
                // Solo permitimos máximo 2 archivos en el plan gratis
                const totalArchivos = archivosFotos.filter(Boolean).length;
                if (totalArchivos > 2) {
                    throw new Error("Límite excedido: Solo puedes subir 2 fotos en el plan gratis.");
                }
            }

            // Subir fotos a Storage en paralelo
            const urlsFotos: string[] = await Promise.all(
                archivosFotos.map(async (file, i) => {
                    if (!file) return null;
                    const path = `${Date.now()}-${i}.webp`;
                    const { data, error } = await supabase.storage
                        .from("fotos").upload(path, file, { contentType: "image/webp", upsert: true });
                    if (error) throw error;
                    return supabase.storage.from("fotos").getPublicUrl(data.path).data.publicUrl;
                })
            ).then(results => results.filter((url): url is string => url !== null));

            // 1. Validar slug único en la tabla correspondiente
            let slugFinal = slug || form.para.toLowerCase().replace(/[^a-z0-9_]+/g, "");

            // Validar longitud y caracteres permitidos del slug elegido por el usuario
            if (slugFinal.length > 10) {
                throw new Error("El enlace personalizado no puede superar los 10 caracteres.");
            }
            if (/[^a-z0-9_]/.test(slugFinal)) {
                throw new Error("El enlace personalizado solo puede contener letras, números y guión bajo (_). No se permiten guiones medios (-) ni otros caracteres especiales.");
            }

            const targetTable = isAuth ? "detalles" : "sorpresas";

            const { data: existing, error: checkError } = await supabase
                .from(targetTable)
                .select("slug")
                .eq("slug", slugFinal);

            if (checkError) {
                throw new Error("Error de validación al verificar el enlace: " + checkError.message);
            }

            if (existing && existing.length > 0) {
                if (isAuth) {
                    // Premium/Auth: Le alertamos de forma elegante para que elija otro
                    throw new Error(`El enlace personalizado "${slugFinal}" ya está en uso. Por favor, elige otro nombre.`);
                } else {
                    // Gratis/Anon: Auto-incrementamos en silencio
                    const { data: similar } = await supabase
                        .from("sorpresas")
                        .select("slug")
                        .like("slug", `${slugFinal}%`);
                    if (similar && similar.length > 0) {
                        const nums = similar.map((r: { slug: string }) => {
                            const n = parseInt(r.slug.replace(slugFinal, ""), 10);
                            return isNaN(n) ? 0 : n;
                        });
                        slugFinal = `${slugFinal}${Math.max(...nums) + 1}`;
                    }
                }
            }

            const fotosFinales = [...urlsFotos, ...form.urlsExternas.filter(u => u.trim() !== "")];

            // 2. Inserción dividida según tipo de sorpresa (Opción B)
            let insertError;

            if (isAuth) {
                // PREMIUM: Insertar en la tabla 'detalles'
                const { error } = await supabase.from("detalles").insert({
                    slug: slugFinal,
                    de: form.de,
                    para: form.para,
                    msg: form.msg,
                    plantilla: form.plantilla,
                    fondo: form.fondo,
                    efectoId: form.efectoId,
                    musicUrl: form.musicaUrl,
                    fotos: fotosFinales,
                    userId: authUser ? authUser.id : null,
                    email: authUser ? authUser.email : null,
                    usuario: authUser ? (authUser.user_metadata?.nombre || authUser.user_metadata?.usuario || null) : null,
                    activo: true,
                    plan: userPlan || "free",
                    pin: pinFinal || null,
                    creado: new Date().toISOString(),
                    actualizado: new Date().toISOString()
                });
                insertError = error;
            } else {
                // ANÓNIMO/GRATIS: Insertar en la tabla 'sorpresas'
                const { error } = await supabase.from("sorpresas").insert({
                    slug: slugFinal,
                    de: form.de,
                    para: form.para,
                    msg: form.msg,
                    plantilla: form.plantilla,
                    fondo: form.fondo,
                    efectoId: form.efectoId,
                    musicUrl: form.musicaUrl,
                    fotos: fotosFinales,
                    activo: true,
                    expira: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    creado: new Date().toISOString(),
                    actualizado: new Date().toISOString()
                });
                insertError = error;
            }

            if (insertError) {
                console.log("================= ERROR SUPABASE =================");
                console.log(JSON.stringify(insertError, null, 2));
                console.log("==================================================");
                throw new Error("Supabase rechazó el guardado: " + insertError.message);
            }

            // Generación de URL Corta según UX Limpio
            const url = isAuth
                ? `${window.location.origin}/${slugFinal}` // Con Auth -> amorwii.com/deysi
                : `${window.location.origin}/ver/${slugFinal}`; // Sin Auth -> amorwii.com/ver/deysi

            setUrlCorta(url);
            copiar(url);
            Mensaje("¡Dedicatoria guardada y link copiado! ✨", "success");
        } catch (e: any) {
            console.error("Error guardando:", e);
            Mensaje(e.message || "Error al guardar. Revisa la consola.", "error");
        } finally {
            setLoading(false);
        }
    };

    const copiar = (texto: string) => {
        if (!texto) return;
        navigator.clipboard.writeText(texto);
    };

    return { form, setField, loading, urlLarga: urlLargaRealtime, urlCorta, guardar, copiar, handleUploadFoto, archivosFotos, isAuth, userPlan };
}

// ─── Constantes ──────────────────────────────────
const PLANTILLAS = [
    { id: "Amor1", name: "Amor Clásico", pro: false },
    { id: "Amor2", name: "Amor Moderno", pro: false },
    { id: "Amor3", name: "Amor Minimal", pro: false },
    { id: "Cumple1", name: "Cumpleaños 🎂 (PRO)", pro: true },
];

const SMART_MSGS = [
    { label: "✨ Romántico", template: "Solo quería decirte que te amo muchísimo. Eres lo mejor que me ha pasado en la vida." },
    { label: "💖 Tierno", template: "Gracias por estar a mi lado y hacerme tan feliz cada día. Eres mi persona favorita en el mundo." },
    { label: "🌙 Sueño", template: "Cada momento contigo es un regalo del cielo. No puedo esperar a seguir creando más recuerdos hermosos a tu lado." },
];

const MUSICAS = [
    { n: 'Flores Amarillas', u: 'https://raw.githubusercontent.com/geluksee/nice/main/FloresAmarillas.mp3' },
    { n: 'You Are Somebody', u: 'https://raw.githubusercontent.com/geluksee/hopeee/main/You%20are%20Somebody%20Else%20by%20Flora%20Cash.mp3' },
    { n: 'I Surrender', u: 'https://raw.githubusercontent.com/geluksee/hopeee/main/I%20Surrender%20-%20Hillsong%20Worship.mp3' },
];

// ─── Componentes del Formulario (Lovewi Design) ───

function CardMensaje({ form, setField, isAuth }: { form: FormState; setField: (f: keyof FormState, v: string) => void, isAuth: boolean }) {
    return (
        <div className="cr_sec">
            <div className="cr_stit_row">
                <h3 className="cr_stit">
                    <i className="fas fa-pen-nib" aria-hidden="true" /> Prepara el detalle
                </h3>
                <div className="cr_sel_plantilla">
                    <span>Plantilla:</span>
                    <select
                        value={form.plantilla}
                        onChange={(e) => {
                            const val = e.target.value;
                            const isProTemplate = PLANTILLAS.find(p => p.id === val)?.pro;
                            if (isProTemplate && !isAuth) {
                                alert("👑 Esta plantilla es exclusiva para usuarios PRO. ¡Regístrate para usarla!");
                                return;
                            }
                            setField("plantilla", val);
                        }}
                    >
                        {PLANTILLAS.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="cr_form">
                <div className="cr_row">
                    <div className="cr_campo">
                        <label>Su nombre</label>
                        <Witip show={!form.para} msg="¡Necesario!" tipo="mco">
                            <div className="cr_inp">
                                <i className="fas fa-heart" />
                                <input
                                    placeholder="Ej: Sofía"
                                    value={form.para}
                                    onChange={(e) => setField("para", e.target.value)}
                                />
                            </div>
                        </Witip>
                    </div>
                    <div className="cr_campo">
                        <label>Tu nombre <small>(Opcional)</small></label>
                        <Witip show={!form.de && !!form.para} msg="¿De quién es?" tipo="mco">
                            <div className="cr_inp">
                                <i className="fas fa-user" />
                                <input
                                    placeholder="Ej: Mateo"
                                    value={form.de}
                                    onChange={(e) => setField("de", e.target.value)}
                                />
                            </div>
                        </Witip>
                    </div>
                </div>
                <div className="cr_campo">
                    <label>Tu mensaje de amor</label>
                    <div className="cr_smart_msgs">
                        {SMART_MSGS.map((m, i) => (
                            <button
                                key={i}
                                type="button"
                                className="cr_sbtn"
                                onClick={() => setField("msg", m.template)}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                    <textarea
                        placeholder="Escribe algo desde el corazón..."
                        value={form.msg}
                        onChange={(e) => setField("msg", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

function CardFotos({ form, handleUploadFoto, setField, isAuth }: { form: FormState; handleUploadFoto: (i: number, e: any) => void, setField: (f: keyof FormState, v: any) => void, isAuth: boolean }) {
    const triggerInput = (i: number) => {
        document.getElementById(`foto-upload-${i}`)?.click();
    };

    const handleExternalUrlChange = (index: number, value: string) => {
        const nuevasUrls = [...form.urlsExternas];
        nuevasUrls[index] = value;
        setField("urlsExternas", nuevasUrls);
    };

    const addExternalUrl = () => {
        if (form.urlsExternas.length >= 20) return; // Límite de seguridad
        setField("urlsExternas", [...form.urlsExternas, ""]);
    };

    return (
        <div className="cr_sec">
            <h3 className="cr_stit"><i className="fas fa-camera-retro" /> Fotos y Recuerdos</h3>

            <p className="cr_info_txt" style={{ marginBottom: "1.2vh" }}>
                <i className="fas fa-cloud-upload-alt" /> Sube tus fotos (2 Gratis + 3 Pro):
            </p>

            <div className="cr_fotos_flex">
                {[0, 1, 2, 3, 4].map((i) => {
                    const isPro = i >= 2;
                    return (
                        <div
                            key={i}
                            className={`cr_foto_slot ${form.fotos[i] ? "has_foto" : ""} ${isPro ? "cr_pro_slot" : ""}`}
                            onClick={() => {
                                if (isPro && !isAuth) {
                                    alert("👑 Esta opción es para usuarios PRO. ¡Inicia sesión o regístrate para usar más fotos!");
                                    return;
                                }
                                triggerInput(i);
                            }}
                        >
                            {isPro && (
                                <div className="cr_pro_badge" title="Función PRO">
                                    <i className="fas fa-star" />
                                </div>
                            )}

                            {form.fotos[i] ? (
                                <img src={form.fotos[i]} alt={`Foto ${i + 1}`} className="cr_foto_preview" />
                            ) : (
                                <div className="cr_foto_add">
                                    <i className={isPro ? "fas fa-lock" : "fas fa-plus"} />
                                    <span>{isPro ? "Pro" : "Subir"}</span>
                                </div>
                            )}
                            <input
                                id={`foto-upload-${i}`}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => handleUploadFoto(i, e)}
                            />
                        </div>
                    );
                })}
            </div>

            <p className="cr_info_txt" style={{ margin: "2.5vh 0 1vh 0" }}>
                <i className="fas fa-link" /> O usa links externos (Pinterest, Imgur, etc):
            </p>

            <div className="cr_ext_links">
                {form.urlsExternas.map((url, i) => (
                    <div className="cr_ext_row" key={i}>
                        <div className="cr_inp">
                            <i className="fas fa-image" />
                            <input
                                placeholder={`Link de imagen externa ${i + 1}`}
                                value={url}
                                onChange={(e) => handleExternalUrlChange(i, e.target.value)}
                            />
                        </div>
                        {i === form.urlsExternas.length - 1 && (
                            <button
                                type="button"
                                className="cr_add_btn"
                                onClick={addExternalUrl}
                                title="Agregar otro link"
                            >
                                <i className="fas fa-plus" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const EFECTOS = [
    { id: "corazones", icon: "heart", label: "Corazones" },
    { id: "flores", icon: "fan", label: "Flores" },
    { id: "estrellas", icon: "star", label: "Estrellas" },
    { id: "brillos", icon: "sparkles", label: "Brillos" },
];

const FONDOS = [
    { id: "1", cls: "cr_bg1" },
    { id: "2", cls: "cr_bg2" },
    { id: "3", cls: "cr_bg3" },
];

function CardDiseno({ form, setField }: { form: FormState; setField: (f: keyof FormState, v: string) => void }) {
    return (
        <div className="cr_sec">
            <h3 className="cr_stit">
                <i className="fas fa-wand-magic-sparkles" aria-hidden="true" /> Diseño y Efectos
            </h3>
            <div className="cr_diseno_grid">
                <div className="cr_campo">
                    <label>Selecciona una Imagen / Fondo</label>
                    <div className="cr_chips">
                        {FONDOS.map(({ id, cls }) => (
                            <label key={id} className="cr_chip cr_chip_img">
                                <input
                                    type="radio"
                                    name="fondo"
                                    value={id}
                                    checked={form.fondo === id}
                                    onChange={() => setField("fondo", id)}
                                />
                                <span className={cls} />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="cr_campo">
                    <label>¿Qué quieres que flote?</label>
                    <div className="cr_chips">
                        {EFECTOS.map(({ id, icon, label }) => (
                            <label key={id} className="cr_chip">
                                <input
                                    type="radio"
                                    name="efecto"
                                    value={id}
                                    checked={form.efectoId === id}
                                    onChange={() => setField("efectoId", id)}
                                />
                                <span><i className={`fas fa-${icon}`} /> {label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CardMusica({ form, setField }: { form: FormState; setField: (f: keyof FormState, v: string) => void }) {
    return (
        <div className="cr_sec">
            <h3 className="cr_stit">
                <i className="fas fa-music" aria-hidden="true" /> Enlace de música
            </h3>
            <div className="cr_campo">
                <div className="cr_smart_msgs">
                    {MUSICAS.map((m, i) => (
                        <button key={i} type="button" className="cr_sbtn" onClick={() => setField("musicaUrl", m.u)}>
                            <i className="fas fa-play-circle" style={{ marginRight: '4px' }} /> {m.n}
                        </button>
                    ))}
                </div>
                <div className="cr_inp">
                    <i className="fas fa-link" style={{ color: "var(--tx3)" }} />
                    <input
                        placeholder="Link MP3 o YouTube..."
                        value={form.musicaUrl}
                        onChange={(e) => setField("musicaUrl", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

function CardLinks({ form, setField, guardar, loading, urlLarga, urlCorta, copiar, isAuth }: {
    form: FormState; setField: (f: keyof FormState, v: any) => void;
    guardar: () => void; loading: boolean; urlLarga: string; urlCorta: string;
    copiar: (t: string) => void; isAuth: boolean;
}) {
    const slug = form.slug.trim();
    const reservada = RESERVADAS.has(slug);

    // Nueva estructura de URL limpia según UX especificado
    const prefijo = isAuth ? "" : "ver/";
    const urlCortaPreview = slug ? `amorwii.com/${prefijo}${slug}` : `amorwii.com/${prefijo}...`;

    return (
        <div className="cr_sec">
            <h3 className="cr_stit">
                <i className="fas fa-link" aria-hidden="true" /> Enlaces y Seguridad
            </h3>

            <div className="cr_url_row">
                <label><i className="fas fa-link" /> Enlace Largo (Local - sin BD):</label>
                <div className="cr_url_box">
                    <span className="cr_pre">amorwii.com/</span>
                    <input readOnly value={urlLarga.replace(/https?:\/\/[^/]+\//, "")} placeholder="..." />
                    <button type="button" className="cr_ubtn" onClick={() => copiar(urlLarga)} title="Copiar"><i className="fas fa-copy" /></button>
                    <Link href={urlLarga || "#"} target="_blank" className={`cr_ubtn ${!urlLarga ? "disabled" : ""}`} title="Abrir"><i className="fas fa-external-link-alt" /></Link>
                </div>
            </div>

            <div className="cr_url_row">
                <label>
                    <i className="fas fa-bolt" /> Enlace Personalizado:
                    {isAuth
                        ? <span className="cr_badge_auth"> ✨ smile</span>
                        : <span className="cr_badge_anon"> · Expira en 30 días</span>}
                </label>
                <div className="cr_url_box cr_url_corta">
                    <span className="cr_pre" style={{ background: "transparent" }}>
                        amorwii.com/{prefijo}
                    </span>
                    <Witip show={reservada} msg="¡Nombre reservado!" tipo="mco">
                        <input
                            value={form.slug}
                            onChange={(e) => {
                                const originalVal = e.target.value;
                                let val = originalVal.toLowerCase();

                                // Verificar si contiene caracteres no permitidos
                                if (/[^a-z0-9_]/.test(val)) {
                                    Mensaje("Solo se permiten letras, números y guión bajo (_). ¡Sin guiones medios ni otros símbolos! ⚠️", "warning");
                                    val = val.replace(/[^a-z0-9_]+/g, "");
                                }

                                // Verificar si supera los 10 caracteres
                                if (val.length > 10) {
                                    Mensaje("El enlace personalizado no puede superar los 10 caracteres. ⚠️", "warning");
                                    val = val.slice(0, 10);
                                }

                                setField("slug", val);
                            }}
                            placeholder={`ej: ${form.para || "deysi"}`}
                            className={reservada ? "cr_inp_error" : ""}
                        />
                    </Witip>
                    <button type="button" className="cr_ubtn" onClick={() => copiar(urlCorta || urlCortaPreview)} title="Copiar"><i className="fas fa-copy" /></button>
                    {urlCorta && <Link href={urlCorta} target="_blank" className="cr_ubtn" title="Abrir"><i className="fas fa-external-link-alt" /></Link>}
                </div>
                {reservada && <p className="cr_slug_error">⚠️ "{slug}" está reservado. Prueba con otro nombre.</p>}
            </div>

            {/* 🆕 SECCIÓN DE PIN DE SEGURIDAD PREMIUM - Solo visible para usuarios autenticados */}
            {isAuth && (
                <div className="cr_url_row" style={{ marginTop: "2vh" }}>
                    <label>
                        <i className="fas fa-lock" /> PIN de Seguridad <small>(Opcional - 4 números)</small>:
                    </label>
                    <div className="cr_inp" style={{ maxWidth: "200px", marginTop: "0.5vh" }}>
                        <i className="fas fa-key" style={{ color: "var(--tx3)" }} />
                        <input
                            type="text"
                            maxLength={4}
                            placeholder="Ej: 0712"
                            value={form.pin}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, ""); // Solo permitir números
                                setField("pin", val);
                            }}
                            style={{ letterSpacing: form.pin ? "0.3em" : "normal", fontWeight: form.pin ? "bold" : "normal" }}
                        />
                    </div>
                    <p className="cr_info_txt" style={{ fontSize: "0.8em", marginTop: "0.5vh", opacity: 0.8 }}>
                        Si configuras un PIN, tu pareja deberá escribirlo para abrir la dedicatoria. ¡Perfecto para fechas especiales!
                    </p>
                </div>
            )}

            <div className="cr_save" style={{ marginTop: "3vh" }}>
                <Witip show={!form.para.trim()} msg="¡Falta su nombre!" tipo="mco">
                    <button
                        type="button"
                        className="cr_gbtn cr_gbtn_pub"
                        onClick={guardar}
                        disabled={loading || !form.para.trim() || reservada}
                    >
                        {loading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-wand-magic-sparkles" />}
                        {loading ? " Guardando..." : " Generar y Guardar"}
                    </button>
                </Witip>
            </div>
        </div>
    );
}

// ─── Componente principal ─────────────────────────
export function CrearForm() {
    const creator = useCreator();
    const { form, setField } = creator;

    return (
        <section className="crear_wrap">
            <Showi>
                <div className="cr_intro">
                    <h1>Personaliza tu Sorpresa</h1>
                </div>
            </Showi>

            <div className="crear">
                <div className="cr_izq">
                    <Showi><CardMensaje form={form} setField={setField} isAuth={creator.isAuth} /></Showi>
                    <Showi><CardFotos form={form} handleUploadFoto={creator.handleUploadFoto} setField={setField} isAuth={creator.isAuth} /></Showi>
                    <Showi><CardMusica form={form} setField={setField} /></Showi>
                    <Showi><CardDiseno form={form} setField={setField} /></Showi>
                    <Showi><CardLinks {...creator} /></Showi>
                </div>

                <div className="cr_der">
                    <PhonePreview form={form} />
                </div>
            </div>
        </section>
    );
}

