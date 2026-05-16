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
};

export default function SorpresaView({ data }: { data: SorpresaData }) {
    const [started, setStarted] = useState(false);
    
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
