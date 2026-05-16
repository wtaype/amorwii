"use client";

import { useState, useEffect } from "react";
import imageCompression from 'browser-image-compression';
import Link from "next/link";
import Showi from "@/components/Showi";
import Witip from "@/components/Witip";
import { supabase } from "@/lib/supabase";
import { linkweb } from "@/app/wii";
import "./crear.css";

// Slugs reservados — rutas del sistema que no pueden usarse como link personalizado
const RESERVADAS = new Set([
    "crear", "login", "registro", "logout", "bienvenida", "perfil",
    "blog", "descubre", "ejemplos", "plantillas", "acerca", "contacto",
    "privacidad", "terminos", "admin", "api", "ver", "404", "500",
]);

// ─── Tipos ────────────────────────────────────────
type FormState = {
    de: string; para: string; msg: string;
    efectoId: string; fondo: string;
    musicaUrl: string; slug: string;
    plantilla: string;
    fotos: string[];
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

        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen es muy pesada (Máx 5MB para optimizar).");
            return;
        }

        try {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 0.15, // ~150KB
                maxWidthOrHeight: 1080,
                useWebWorker: true,
                fileType: 'image/webp',
            });

            console.log(`Original: ${(file.size / 1024).toFixed(2)} KB`);
            console.log(`Comprimida: ${(compressedFile.size / 1024).toFixed(2)} KB`);

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
        } catch (error) {
            console.error("Error comprimiendo imagen:", error);
            alert("Hubo un error al procesar la imagen.");
        }
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

            // Subir fotos a Storage en paralelo
            const urlsFotos: string[] = await Promise.all(
                archivosFotos.filter(Boolean).map(async (file, i) => {
                    const path = `${Date.now()}-${i}.webp`;
                    const { data, error } = await supabase.storage
                        .from("fotos").upload(path, file, { contentType: "image/webp", upsert: true });
                    if (error) throw error;
                    return supabase.storage.from("fotos").getPublicUrl(data.path).data.publicUrl;
                })
            );

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

            // Insertar en tabla Sorpresas
            const { error: insertError } = await supabase.from("Sorpresas").insert({
                slug: slugFinal,
                de: form.de, para: form.para, msg: form.msg,
                plantilla: form.plantilla, fondo: form.fondo,
                efectoId: form.efectoId, musicUrl: form.musicaUrl,
                fotos: urlsFotos, 
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
    { id: "Amor1", name: "Amor Clásico" },
    { id: "Amor2", name: "Amor Moderno" },
    { id: "Amor3", name: "Amor Minimal" },
    { id: "Cumple1", name: "Cumpleaños" },
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

function CardMensaje({ form, setField }: { form: FormState; setField: (f: keyof FormState, v: string) => void }) {
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
                        onChange={(e) => setField("plantilla", e.target.value)}
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

function CardFotos({ form, handleUploadFoto }: { form: FormState; handleUploadFoto: (i: number, e: any) => void }) {
    const triggerInput = (i: number) => {
        document.getElementById(`foto-upload-${i}`)?.click();
    };

    return (
        <div className="cr_sec">
            <h3 className="cr_stit"><i className="fas fa-camera-retro" /> Fotos y Recuerdos</h3>
            <div className="cr_fotos_grid">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`cr_foto_slot ${i > 1 ? "premium" : ""} ${form.fotos[i] ? "has_foto" : ""}`}
                        onClick={() => triggerInput(i)}
                    >
                        {i > 1 && <div className="cr_premium_badge"><i className="fas fa-crown" /></div>}

                        {form.fotos[i] ? (
                            <img src={form.fotos[i]} alt={`Foto ${i + 1}`} className="cr_foto_preview" />
                        ) : (
                            <div className="cr_foto_add">
                                <i className="fas fa-plus" /><span>{i > 1 ? "Pro" : "Subir"}</span>
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
                ))}
            </div>
            <p className="cr_info_txt"><i className="fas fa-bolt" /> 2 fotos gratis. Optimizadas en tu navegador para ser súper rápidas.</p>
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

// ─── Vista Previa ─────────────────────────────────
function PhonePreview({ form }: { form: FormState }) {
    const getPhoneBg = () => {
        switch (form.fondo) {
            case "2": return "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)";
            case "3": return "linear-gradient(to top, #ff0844 0%, #ffb199 100%)";
            default: return "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)";
        }
    };

    return (
        <div className="cr_prev">
            <div className="cr_prev_cab">
                <h3><i className="fas fa-eye" /> Vista previa</h3>
            </div>
            <div className="cr_marco" style={{ background: getPhoneBg() }}>
                <div className="cr_mini">
                    <div className="pv_cor"><i className="far fa-heart" /></div>
                    <h2 className="pv_nom">Para {form.para || "Sofía"}</h2>
                    <p className="pv_msg">"{form.msg || "Cada día que pasa me doy cuenta de lo afortunado que soy de tenerte a mi lado. Esta pequeña sorpresa es solo un reflejo de lo mucho que te amo."}"</p>
                    {form.de && <p className="pv_de">De: <span>{form.de}</span></p>}
                    <div className="pv_music">
                        <i className="fas fa-play" />
                    </div>
                    <span className="pv_music_lbl">{form.musicaUrl ? "MÚSICA SELECCIONADA" : "SIN MÚSICA"}</span>
                </div>
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
                    <Showi><CardMensaje form={form} setField={setField} /></Showi>
                    <Showi><CardFotos form={form} handleUploadFoto={creator.handleUploadFoto} /></Showi>
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

