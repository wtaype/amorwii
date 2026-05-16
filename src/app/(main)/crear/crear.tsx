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
};

// ─── Hook de lógica de creación ───────────────────
function useCreator() {
    const [loading, setLoading] = useState(false);
    const [urlCorta, setUrlCorta] = useState("");
    const [archivosFotos, setArchivosFotos] = useState<File[]>([]);
    const [isAuth, setIsAuth] = useState(false);
    const [authUser, setAuthUser] = useState<any>(null);
    const [form, setFormState] = useState<FormState>({
        de: "", para: "", msg: "",
        efectoId: "corazones", fondo: "1",
        musicaUrl: "", slug: "",
        plantilla: "Amor1",
        fotos: [],
        urlsExternas: [""], // Start with only 1 external link input
    });

    // Detectar sesión activa
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setIsAuth(!!data.user);
            setAuthUser(data.user);
        });
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

    const setField = (field: keyof FormState, value: string) => {
        setFormState((prev) => {
            const next = { ...prev, [field]: value };
            if (field === "para") {
                const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
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

            // SEGURIDAD: Validar límites antes de subir nada
            if (!isAuth) {
                // Solo permitimos máximo 2 archivos en el plan gratis
                const totalArchivos = archivosFotos.filter(Boolean).length;
                if (totalArchivos > 2) {
                    throw new Error("Límite excedido: Solo puedes subir 2 fotos en el plan gratis.");
                }
            }

            // Subir fotos a Storage en paralelo (Solo ocurre aquí, al presionar GUARDAR)
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

            // Validar slug único
            let slugFinal = slug || form.para.toLowerCase().replace(/[^a-z0-9]+/g, "");
            const { data: existing } = await supabase
                .from("Sorpresas").select("slug").like("slug", `${slugFinal}%`);
            if (existing && existing.length > 0) {
                const nums = existing.map((r: { slug: string }) => {
                    const n = parseInt(r.slug.replace(slugFinal, ""), 10);
                    return isNaN(n) ? 0 : n;
                });
                slugFinal = `${slugFinal}${Math.max(...nums) + 1}`;
            }

            // 3. Insertar en tabla Sorpresas (Juntamos fotos subidas + links externos llenos)
            const fotosFinales = [...urlsFotos, ...form.urlsExternas.filter(u => u.trim() !== "")];

            const { error: insertError } = await supabase.from("Sorpresas").insert({
                slug: slugFinal,
                de: form.de, para: form.para, msg: form.msg,
                plantilla: form.plantilla, fondo: form.fondo,
                efectoId: form.efectoId, musicUrl: form.musicaUrl,
                fotos: fotosFinales,
                userId: authUser ? authUser.id : null,
                email: authUser ? authUser.email : null,
                usuario: authUser ? (authUser.user_metadata?.nombre || authUser.user_metadata?.usuario || null) : null,
                activo: true,
                creado: new Date().toISOString(),
                actualizado: new Date().toISOString(),
                expira: isAuth ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });

            if (insertError) {
                console.log("================= ERROR SUPABASE =================");
                console.log(JSON.stringify(insertError, null, 2));
                console.log("==================================================");
                throw new Error("Supabase rechazó el guardado: " + insertError.message + " | Código: " + insertError.code);
            }

            // URL corta según auth: con auth → /deysi, sin auth → /?ver=deysi
            const url = isAuth
                ? `${window.location.origin}/${slugFinal}`
                : `${window.location.origin}/?ver=${slugFinal}`;
            setUrlCorta(url);
            copiar(url);
            alert("¡Sorpresa guardada y link copiado! ✨");
        } catch (e: any) {
            console.error("Error guardando:", e);
            alert(e.message || "Error al guardar. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    const copiar = (texto: string) => {
        if (!texto) return;
        navigator.clipboard.writeText(texto);
    };

    return { form, setField, loading, urlLarga: urlLargaRealtime, urlCorta, guardar, copiar, handleUploadFoto, archivosFotos, isAuth };
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
    form: FormState; setField: (f: keyof FormState, v: string) => void;
    guardar: () => void; loading: boolean; urlLarga: string; urlCorta: string;
    copiar: (t: string) => void; isAuth: boolean;
}) {
    const slug = form.slug.trim();
    const reservada = RESERVADAS.has(slug);
    const prefijo = isAuth ? "" : "?ver=";
    const urlCortaPreview = slug ? `amorwii.com/${prefijo}${slug}` : `amorwii.com/${prefijo}...`;

    return (
        <div className="cr_sec">
            <h3 className="cr_stit">
                <i className="fas fa-link" aria-hidden="true" /> Enlaces
            </h3>

            <div className="cr_url_row">
                <label><i className="fas fa-link" /> Largo (sin BD):</label>
                <div className="cr_url_box">
                    <span className="cr_pre">amorwii.com/</span>
                    <input readOnly value={urlLarga.replace(/https?:\/\/[^/]+\//, "")} placeholder="..." />
                    <button type="button" className="cr_ubtn" onClick={() => copiar(urlLarga)} title="Copiar"><i className="fas fa-copy" /></button>
                    <Link href={urlLarga || "#"} target="_blank" className={`cr_ubtn ${!urlLarga ? "disabled" : ""}`} title="Abrir"><i className="fas fa-external-link-alt" /></Link>
                </div>
            </div>

            <div className="cr_url_row">
                <label>
                    <i className="fas fa-bolt" /> Personalizado
                    {isAuth
                        ? <span className="cr_badge_auth"> ✨ Con tu cuenta</span>
                        : <span className="cr_badge_anon"> · 30 días</span>}
                    :
                </label>
                <div className="cr_url_box cr_url_corta">
                    <span className="cr_pre" style={{ background: "transparent" }}>
                        amorwii.com/{!isAuth && <span style={{ opacity: 0.6, fontSize: "0.85em" }}>?ver=</span>}
                    </span>
                    <Witip show={reservada} msg="¡Nombre reservado!" tipo="mco">
                        <input
                            value={form.slug}
                            onChange={(e) => setField("slug", e.target.value)}
                            placeholder={`ej: ${form.para || "deysi"}`}
                            className={reservada ? "cr_inp_error" : ""}
                        />
                    </Witip>
                    <button type="button" className="cr_ubtn" onClick={() => copiar(urlCorta || urlCortaPreview)} title="Copiar"><i className="fas fa-copy" /></button>
                    {urlCorta && <Link href={urlCorta} target="_blank" className="cr_ubtn" title="Abrir"><i className="fas fa-external-link-alt" /></Link>}
                </div>
                {reservada && <p className="cr_slug_error">⚠️ "{slug}" está reservado. Prueba con otro nombre.</p>}
            </div>

            <div className="cr_save">
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

