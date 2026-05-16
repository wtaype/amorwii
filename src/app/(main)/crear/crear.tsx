"use client";

import { useState } from "react";
import Link from "next/link";
import Showi from "@/components/Showi";
import Witip from "@/components/Witip";
import { linkweb } from "@/app/wii";
import "./crear.css";

// ─── Tipos ────────────────────────────────────────
type FormState = {
    de: string; para: string; msg: string;
    efecto: string; fondoId: string;
    musicaUrl: string; slug: string;
};

// ─── Hook de lógica de creación ───────────────────
function useCreator() {
    const [loading, setLoading] = useState(false);
    const [urlLarga, setUrlLarga] = useState("");
    const [urlCorta, setUrlCorta] = useState("");
    const [form, setFormState] = useState<FormState>({
        de: "", para: "", msg: "",
        efecto: "corazones", fondoId: "1",
        musicaUrl: "", slug: "",
    });

    const setField = (field: keyof FormState, value: string) =>
        setFormState((prev) => ({ ...prev, [field]: value }));

    const guardar = async () => {
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 700));
            const params = new URLSearchParams();
            if (form.de) params.append("de", form.de);
            if (form.para) params.append("para", form.para);
            if (form.msg) params.append("msg", form.msg);
            if (form.efecto) params.append("e", form.efecto);
            if (form.fondoId) params.append("f", form.fondoId);
            if (form.musicaUrl) params.append("m", form.musicaUrl);
            const base = typeof window !== "undefined" ? window.location.origin : linkweb;
            const url = `${base}/?${params.toString()}`;
            setUrlLarga(url);
            setUrlCorta(form.slug ? `https://amw.li/${form.slug}` : "");
            copiar(url);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const copiar = (texto: string) => {
        if (!texto) return;
        navigator.clipboard.writeText(texto);
    };

    return { form, setField, loading, urlLarga, urlCorta, guardar, copiar };
}

// ─── Componentes del Formulario (Lovewi Design) ───

function CardMensaje({ form, setField }: { form: FormState; setField: (f: keyof FormState, v: string) => void }) {
    return (
        <div className="cr_sec">
            <h3 className="cr_stit">
                <i className="fas fa-pen-nib" aria-hidden="true" /> Prepara el detalle
            </h3>
            <div className="cr_form">
                <div className="cr_row">
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
                </div>
                <div className="cr_campo">
                    <label>Tu mensaje de amor</label>
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
            <div className="cr_form">
                <div className="cr_campo">
                    <label>¿Qué quieres que flote?</label>
                    <div className="cr_chips">
                        {EFECTOS.map(({ id, icon, label }) => (
                            <label key={id} className="cr_chip">
                                <input
                                    type="radio"
                                    name="efecto"
                                    value={id}
                                    checked={form.efecto === id}
                                    onChange={() => setField("efecto", id)}
                                />
                                <span><i className={`fas fa-${icon}`} /> {label}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="cr_campo">
                    <label>Selecciona una Imagen / Fondo</label>
                    <div className="cr_chips">
                        {FONDOS.map(({ id, cls }) => (
                            <label key={id} className="cr_chip cr_chip_img">
                                <input
                                    type="radio"
                                    name="fondo"
                                    value={id}
                                    checked={form.fondoId === id}
                                    onChange={() => setField("fondoId", id)}
                                />
                                <span className={cls} />
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
                <div className="cr_inp">
                    <i className="fab fa-youtube" style={{ color: "var(--tx3)" }} />
                    <input
                        placeholder="Enlace de YouTube..."
                        value={form.musicaUrl}
                        onChange={(e) => setField("musicaUrl", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

function CardLinks({ form, setField, guardar, loading, urlLarga, urlCorta, copiar }: {
    form: FormState; setField: (f: keyof FormState, v: string) => void;
    guardar: () => void; loading: boolean; urlLarga: string; urlCorta: string; copiar: (t: string) => void;
}) {
    return (
        <div className="cr_sec">
            <h3 className="cr_stit">
                <i className="fas fa-link" aria-hidden="true" /> Enlaces
            </h3>

            <div className="cr_url_row">
                <label><i className="fas fa-link" /> Largo:</label>
                <div className="cr_url_box">
                    <span className="cr_pre">amorwii.com/</span>
                    <input readOnly value={urlLarga ? urlLarga.replace(/https?:\/\/[^/]+\/\?/, "") : ""} placeholder="..." />
                    <button type="button" className="cr_ubtn" onClick={() => copiar(urlLarga)} title="Copiar"><i className="fas fa-copy" /></button>
                    <Link href={urlLarga || "#"} target="_blank" className={`cr_ubtn ${!urlLarga ? "disabled" : ""}`} title="Abrir"><i className="fas fa-external-link-alt" /></Link>
                </div>
            </div>

            <div className="cr_url_row">
                <label><i className="fas fa-bolt" /> Corto:</label>
                <div className="cr_url_box cr_url_corta">
                    <span className="cr_pre" style={{ background: 'transparent' }}>amw.li/</span>
                    <input value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="para-sofia" />
                    <button type="button" className="cr_ubtn" onClick={() => copiar(urlCorta)} title="Copiar"><i className="fas fa-copy" /></button>
                    <Link href={urlCorta || "#"} target="_blank" className={`cr_ubtn ${!urlCorta ? "disabled" : ""}`} title="Abrir"><i className="fas fa-external-link-alt" /></Link>
                </div>
            </div>

            <div className="cr_save">
                <Witip show={!form.para.trim()} msg="¡Falta su nombre!" tipo="mco">
                    <button type="button" className="cr_gbtn cr_gbtn_pub" onClick={guardar} disabled={loading || !form.para.trim()}>
                        {loading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-wand-magic-sparkles" />}
                        {loading ? " Generando..." : " Generar y Copiar Links"}
                    </button>
                </Witip>
            </div>
        </div>
    );
}

// ─── Vista Previa ─────────────────────────────────
function PhonePreview({ form }: { form: FormState }) {
    const getPhoneBg = () => {
        switch (form.fondoId) {
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
                    <Showi><CardDiseno form={form} setField={setField} /></Showi>
                    <Showi><CardMusica form={form} setField={setField} /></Showi>
                    <Showi><CardLinks {...creator} /></Showi>
                </div>

                <div className="cr_der">
                    <PhonePreview form={form} />
                </div>
            </div>
        </section>
    );
}
