"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "./detalles.css";

export type DetallesData = {
    id: string;
    slug: string;
    de: string;
    para: string;
    msg: string;
    plantilla: string;
    fondo: string;
    efectoId: string;
    musicUrl: string;
    fotos: string[];
    activo: boolean;
    pin?: string | null;
    vistas: number;
    respuesta?: string | null;
    nps?: number | null;
    feedback?: string | null;
};

export default function DetallesView({ data: initialData }: { data: DetallesData }) {
    const [data, setData] = useState<DetallesData>(initialData);
    const [started, setStarted] = useState(false);
    const [inputPin, setInputPin] = useState("");
    const [pinValidado, setPinValidado] = useState(false);
    const [errorPin, setErrorPin] = useState(false);

    // Estados para la respuesta interactiva (NPS & Feedback)
    const [npsSelected, setNpsSelected] = useState<number | null>(null);
    const [respuestaTxt, setRespuestaTxt] = useState("");
    const [enviandoFeedback, setEnviandoFeedback] = useState(false);
    const [feedbackEnviado, setFeedbackEnviado] = useState(false);

    // Incrementar el contador de vistas al abrir la sorpresa
    useEffect(() => {
        const registrarVista = async () => {
            try {
                // Incremento de vistas atómico silencioso
                await supabase
                    .from("detalles")
                    .update({ vistas: (data.vistas || 0) + 1 })
                    .eq("id", data.id);
            } catch (err) {
                console.warn("No se pudo registrar la vista:", err);
            }
        };

        // Si no tiene PIN, o si ya validó el PIN, registramos la vista
        if (!data.pin || pinValidado) {
            registrarVista();
        }
    }, [pinValidado, data.id, data.pin]);

    if (!data.activo) {
        return (
            <div className="so_error">
                <h1>Esta sorpresa ya no está disponible 💔</h1>
            </div>
        );
    }

    const getBg = () => {
        switch (data.fondo) {
            case "2": return "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)";
            case "3": return "linear-gradient(to top, #ff0844 0%, #ffb199 100%)";
            default: return "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)";
        }
    };

    const handleValidarPin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputPin === data.pin) {
            setPinValidado(true);
            setErrorPin(false);
        } else {
            setErrorPin(true);
            setInputPin("");
            // Vibrar la tarjeta visual de error
            setTimeout(() => setErrorPin(false), 800);
        }
    };

    // Registrar calificación NPS y comentario de respuesta
    const handleEnviarFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (npsSelected === null && !respuestaTxt.trim()) return;

        setEnviandoFeedback(true);
        try {
            const { error } = await supabase
                .from("detalles")
                .update({
                    nps: npsSelected,
                    respuesta: respuestaTxt.trim() || null,
                    feedback: respuestaTxt.trim() ? `Respuesta Premium: ${respuestaTxt.trim()}` : null,
                    actualizado: new Date().toISOString()
                })
                .eq("id", data.id);

            if (error) throw error;
            setFeedbackEnviado(true);
        } catch (err: any) {
            console.error("Error al guardar respuesta:", err);
            alert("No se pudo enviar tu respuesta. Intenta de nuevo.");
        } finally {
            setEnviandoFeedback(false);
        }
    };

    // 🔒 CASO: Requiere PIN de seguridad y aún no se ha validado
    if (data.pin && !pinValidado) {
        return (
            <div className="de_premium_wrap" style={{ background: getBg() }}>
                <form className={`de_premium_card ${errorPin ? "de_shake" : ""}`} onSubmit={handleValidarPin}>
                    <div className="de_start_container">
                        <div className="de_lock_icon">🔒</div>
                        <h2>Dedicatoria Privada</h2>
                        <p className="de_lock_info">
                            Esta sorpresa es súper especial, romántica y segura. Ingresa el PIN de 4 números para abrir tu regalo:
                        </p>
                        
                        <div className="de_pin_input_row">
                            <input
                                type="password"
                                maxLength={4}
                                placeholder="••••"
                                value={inputPin}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, ""); // Solo números
                                    setInputPin(val);
                                }}
                                autoFocus
                            />
                        </div>

                        {errorPin && (
                            <p style={{ color: "#FF5C69", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "2.5vh" }}>
                                ❌ PIN incorrecto. Intenta de nuevo.
                            </p>
                        )}

                        <button type="submit" className="de_btn_premium">
                            <i className="fas fa-heart" /> Validar y Abrir
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // CASO: Pantalla de inicio antes de disparar animaciones y música
    if (!started) {
        return (
            <div className="de_premium_wrap" style={{ background: getBg() }}>
                <div className="de_premium_card">
                    <div className="de_start_container">
                        <div className="de_lock_icon" style={{ animationDelay: '0.2s' }}>🎁</div>
                        <h2>¡Tienes una sorpresa premium!</h2>
                        <p className="de_lock_info">
                            Prepárate para vivir un momento inolvidable. Te recomiendo activar tu volumen antes de continuar.
                        </p>
                        <button className="de_btn_premium" onClick={() => setStarted(true)}>
                            <i className="fas fa-gift" /> Descubrir Dedicatoria
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="de_premium_wrap" style={{ background: getBg() }}>
            {data.musicUrl && (
                <audio autoPlay loop src={data.musicUrl} style={{ display: 'none' }} />
            )}

            <div className="de_premium_card de_content_wrapper">
                <div className="de_icon_flair">
                    {data.efectoId === 'estrellas' ? '⭐' : '❤️'}
                </div>

                <h1 className="de_premium_para">¡Para {data.para}!</h1>

                <div className="de_message_box">
                    <p>{data.msg}</p>
                </div>

                {data.fotos && data.fotos.length > 0 && (
                    <div className="de_fotos_grid">
                        {data.fotos.map((f, i) => (
                            <div key={i} className="de_foto_item">
                                <img src={f} alt="Recuerdo de amor" />
                            </div>
                        ))}
                    </div>
                )}

                {data.de && (
                    <div className="de_signature">
                        Con todo mi amor,
                        <span>{data.de}</span>
                    </div>
                )}

                {/* 🆕 SECCIÓN DE INTERACCIÓN: RESPUESTA & NPS */}
                <div className="de_feedback_section">
                    <h3>¿Te gustó esta sorpresa? Dejale una respuesta</h3>
                    
                    {feedbackEnviado ? (
                        <div className="de_feedback_success">
                            <i className="fas fa-check-circle" />
                            <p>¡Respuesta enviada con éxito! Eres increíble. ✨</p>
                        </div>
                    ) : (
                        <form onSubmit={handleEnviarFeedback} className="de_comment_box">
                            {/* NPS Calificación de 1 a 10 */}
                            <div className="de_nps_scale">
                                {[...Array(10)].map((_, idx) => {
                                    const val = idx + 1;
                                    return (
                                        <button
                                            key={val}
                                            type="button"
                                            className={`de_nps_btn ${npsSelected === val ? "selected" : ""}`}
                                            onClick={() => setNpsSelected(val)}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="de_nps_labels">
                                <span>No me gustó 💔</span>
                                <span>¡Me encantó! 😍</span>
                            </div>

                            {/* Caja de Comentario */}
                            <textarea
                                placeholder="Escribe un mensaje de respuesta o reacción aquí..."
                                value={respuestaTxt}
                                onChange={(e) => setRespuestaTxt(e.target.value)}
                            />

                            <button type="submit" className="de_submit_feedback_btn" disabled={enviandoFeedback}>
                                {enviandoFeedback ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin" /> Guardando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane" /> Enviar Respuesta
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Efecto de partículas de amor elevándose */}
            <div className="de_particles">
                {[...Array(15)].map((_, i) => (
                    <div key={i} className="de_particle" 
                         style={{ 
                             left: `${Math.random() * 100}%`, 
                             fontSize: `${Math.random() * 1.5 + 1}rem`,
                             animationDuration: `${Math.random() * 4 + 3}s`,
                             animationDelay: `${Math.random() * 3}s`
                         }}>
                        {data.efectoId === 'estrellas' ? '✨' : '❤️'}
                    </div>
                ))}
            </div>
        </div>
    );
}
