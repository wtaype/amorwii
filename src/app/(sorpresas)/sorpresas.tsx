"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import "./sorpresas.css";

export type SorpresaData = {
    de: string;
    para: string;
    msg: string;
    plantilla: string;
    fondo: string;
    efectoId: string;
    musicUrl: string;
    fotos: string[];
    activo: boolean;
    pin?: string | null; // Nuevo campo PIN de 4 números
    id: string;
    vistas: number;
    likes: number;
    nps?: number[] | null;
    feedbacks?: string[] | null;
};

export default function SorpresaView({ data }: { data: SorpresaData }) {
    const [started, setStarted] = useState(false);
    const [inputPin, setInputPin] = useState("");
    const [pinValidado, setPinValidado] = useState(false);
    const [errorPin, setErrorPin] = useState(false);

    // Estados para la respuesta interactiva (NPS & Feedback)
    const [npsSelected, setNpsSelected] = useState<number | null>(null);
    const [feedbackTxt, setFeedbackTxt] = useState("");
    const [enviandoFeedback, setEnviandoFeedback] = useState(false);
    const [feedbackEnviado, setFeedbackEnviado] = useState(false);

    // Estados para Optimistic UI (Likes)
    const [optimisticLikes, setOptimisticLikes] = useState(data.likes || 0);
    const [liked, setLiked] = useState(false);

    // Incrementar el contador de vistas al abrir la sorpresa
    useEffect(() => {
        const registrarVista = async () => {
            try {
                if (started && data.id) {
                    await supabase.rpc('incrementar_vistas_sorpresas', { sorpresa_id: data.id });
                }
            } catch { /* silencioso */ }
        };

        if (!data.pin || pinValidado) {
            registrarVista();
        }
    }, [started, pinValidado, data.id, data.pin]);

    // Si la sorpresa no está activa
    if (!data.activo && data.para !== "") {
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
            // Pequeña vibración visual de error
            setTimeout(() => setErrorPin(false), 800);
        }
    };

    // Registrar calificación NPS y comentario de respuesta de forma atómica vía RPC
    const handleEnviarFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (npsSelected === null && !feedbackTxt.trim()) return;

        setEnviandoFeedback(true);
        try {
            const { error } = await supabase.rpc("agregar_feedback_sorpresa", {
                p_id: data.id,
                p_nps: npsSelected,
                p_feedback: feedbackTxt.trim() || null
            });

            if (error) throw error;
            setFeedbackEnviado(true);
        } catch (err: any) {
            console.error("Error al guardar respuesta:", err);
            alert("No se pudo enviar tu respuesta. Intenta de nuevo.");
        } finally {
            setEnviandoFeedback(false);
        }
    };

    // Incrementar Likes (Optimistic UI)
    const handleLike = async () => {
        if (liked) return;
        
        setLiked(true);
        setOptimisticLikes(prev => prev + 1);
        
        try {
            await supabase.rpc('incrementar_likes_sorpresas', { sorpresa_id: data.id });
        } catch (err) {
            console.warn("No se pudo registrar el like:", err);
            setLiked(false);
            setOptimisticLikes(prev => prev - 1);
        }
    };

    // 🔒 CASO: Requiere PIN de seguridad y aún no se ha validado
    if (data.pin && !pinValidado) {
        return (
            <div className="so_start_wrap" style={{ background: getBg() }}>
                <form className={`so_pin_card ${errorPin ? "so_shake" : ""}`} onSubmit={handleValidarPin} style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderRadius: "24px",
                    padding: "4vh 3vw",
                    maxWidth: "380px",
                    width: "90%",
                    textAlign: "center",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <div style={{ fontSize: "3rem", marginBottom: "2vh" }}>🔒</div>
                    <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1vh" }}>Dedicatoria Protegida</h2>
                    <p style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "3vh" }}>
                        Esta sorpresa es súper especial y privada. Escribe el PIN de 4 dígitos para abrirla:
                    </p>

                    <input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={inputPin}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, ""); // Solo números
                            setInputPin(val);
                        }}
                        style={{
                            background: "rgba(255, 255, 255, 0.2)",
                            border: "2px solid rgba(255, 255, 255, 0.4)",
                            borderRadius: "16px",
                            padding: "1.5vh 0",
                            fontSize: "2.2rem",
                            textAlign: "center",
                            letterSpacing: "0.5em",
                            width: "180px",
                            color: "#fff",
                            fontWeight: "bold",
                            outline: "none",
                            marginBottom: "3vh",
                            transition: "all 0.3s ease"
                        }}
                        autoFocus
                    />

                    {errorPin && (
                        <p style={{ color: "#FF5C69", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "2vh" }}>
                            ❌ PIN incorrecto. Intenta de nuevo.
                        </p>
                    )}

                    <button type="submit" className="so_btn_start" style={{ width: "100%", padding: "1.8vh" }}>
                        Validar y Abrir 🎁
                    </button>
                </form>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="so_start_wrap" style={{ background: getBg() }}>
                <button className="so_btn_start" onClick={() => setStarted(true)}>
                    Abrir Sorpresa 🎁
                </button>
            </div>
        );
    }

    return (
        <div className="so_wrap" style={{ background: getBg() }}>
            {data.musicUrl && (
                <audio autoPlay loop src={data.musicUrl} style={{ display: 'none' }} />
            )}

            <div className="so_content">
                <div className="so_anim_icon">
                    {data.efectoId === 'estrellas' ? '⭐' : '❤️'}
                </div>

                <h1 className="so_para">¡Para {data.para}!</h1>

                <div className="so_msg_box">
                    <p>{data.msg}</p>
                </div>

                {data.fotos && data.fotos.length > 0 && (
                    <div className="so_fotos">
                        {data.fotos.map((f, i) => (
                            <img key={i} src={f} alt="Recuerdo" className="so_img" />
                        ))}
                    </div>
                )}

                {data.de && (
                    <div className="so_de">
                        Con cariño, <span>{data.de}</span>
                    </div>
                )}

                {/* 💖 SECCIÓN DE LIKES (Optimistic UI) */}
                <div style={{ textAlign: "center", marginBottom: "3vh", marginTop: "2vh" }}>
                    <button 
                        onClick={handleLike}
                        disabled={liked}
                        style={{
                            background: liked ? "rgba(255, 92, 105, 0.15)" : "rgba(255,255,255,0.05)",
                            border: liked ? "1px solid rgba(255, 92, 105, 0.5)" : "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "20px",
                            padding: "1vh 4vw",
                            color: liked ? "#FF5C69" : "#fff",
                            cursor: liked ? "default" : "pointer",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            transition: "all 0.3s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            boxShadow: liked ? "0 4px 15px rgba(255, 92, 105, 0.2)" : "none"
                        }}
                    >
                        <i className={`fa-heart ${liked ? "fas so_shake" : "far"}`} style={{ color: liked ? "#FF5C69" : "inherit" }} />
                        {optimisticLikes} {optimisticLikes === 1 ? "Me gusta" : "Me gustas"}
                    </button>
                </div>

                {/* 🆕 SECCIÓN DE INTERACCIÓN: RESPUESTA & NPS */}
                <div style={{
                    borderTop: "1px solid rgba(255,255,255,0.2)",
                    paddingTop: "3vh",
                    textAlign: "center"
                }}>
                    {feedbackEnviado ? (
                        <div style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            borderRadius: "16px",
                            padding: "2vh",
                            color: "#fff"
                        }}>
                            <i className="fas fa-check-circle" style={{ fontSize: "2rem", color: "#4CAF50", marginBottom: "1vh" }} />
                            <p style={{ margin: 0, fontWeight: "bold" }}>¡Enviado con éxito! ✨</p>
                        </div>
                    ) : (
                        <form onSubmit={handleEnviarFeedback} style={{ display: "flex", flexDirection: "column", gap: "1.5vh", alignItems: "center" }}>
                            <p style={{ fontSize: "0.95rem", opacity: 0.9, marginBottom: "0", color: "#fff" }}>
                                ¿Te gustó esta sorpresa?
                            </p>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                                {[...Array(10)].map((_, idx) => {
                                    const val = idx + 1;
                                    return (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => setNpsSelected(val)}
                                            style={{
                                                width: "36px", height: "36px",
                                                borderRadius: "10px",
                                                border: npsSelected === val ? "2px solid #FFD700" : "1px solid rgba(255,255,255,0.25)",
                                                background: npsSelected === val ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.1)",
                                                color: "#fff",
                                                fontWeight: 700,
                                                fontSize: "0.9rem",
                                                cursor: "pointer",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "380px", fontSize: "0.75rem", opacity: 0.7, color: "#fff" }}>
                                <span>No me gustó 💔</span>
                                <span>¡Me encantó! 😍</span>
                            </div>
                            <textarea
                                placeholder="Escribe un comentario (opcional)..."
                                value={feedbackTxt}
                                onChange={(e) => setFeedbackTxt(e.target.value)}
                                style={{
                                    width: "100%", maxWidth: "380px",
                                    background: "rgba(255,255,255,0.1)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    borderRadius: "14px",
                                    padding: "1.5vh",
                                    color: "#fff",
                                    fontSize: "0.9rem",
                                    resize: "vertical",
                                    minHeight: "60px",
                                    outline: "none",
                                    fontFamily: "inherit"
                                }}
                            />
                            <button
                                type="submit"
                                disabled={enviandoFeedback}
                                style={{
                                    background: "rgba(255,255,255,0.15)",
                                    border: "1px solid rgba(255,255,255,0.3)",
                                    color: "#fff",
                                    borderRadius: "12px",
                                    padding: "1.2vh 3vw",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                {enviandoFeedback ? <><i className="fas fa-spinner fa-spin" /> Enviando...</> : <><i className="fas fa-paper-plane" /> Enviar</>}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Efecto de partículas simplificado */}
            <div className="so_particles">
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={`particle p_${data.efectoId}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 3 + 2}s`,
                            animationDelay: `${Math.random() * 2}s`
                        }}>
                        {data.efectoId === 'estrellas' ? '✨' : '❤️'}
                    </div>
                ))}
            </div>
        </div>
    );
}
