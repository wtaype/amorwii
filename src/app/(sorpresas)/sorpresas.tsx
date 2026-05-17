"use client";

import { useEffect, useState } from "react";
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
};

export default function SorpresaView({ data }: { data: SorpresaData }) {
    const [started, setStarted] = useState(false);
    const [inputPin, setInputPin] = useState("");
    const [pinValidado, setPinValidado] = useState(false);
    const [errorPin, setErrorPin] = useState(false);
    
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
