"use client";

import React, { useState } from "react";

interface ModalBlogProps {
  titulo: string;
  children: React.ReactNode;
}

export default function ModalBlog({ titulo, children }: ModalBlogProps) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div style={{ margin: "25px 0" }}>
      {/* Botón que parece un banner */}
      <button 
        onClick={() => setAbierto(true)}
        style={{
          width: "100%",
          background: "linear-gradient(135deg, rgba(255, 92, 105, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
          border: "1px solid rgba(255, 92, 105, 0.3)",
          borderRadius: "16px",
          padding: "15px 20px",
          color: "var(--tx)",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "1rem",
          transition: "all 0.3s ease",
          boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
        }}
      >
        <span><i className="fa-solid fa-eye" style={{ color: "#FF5C69", marginRight: "10px" }}></i> {titulo || "Ver contenido oculto"}</span>
        <i className="fa-solid fa-chevron-right" style={{ opacity: 0.5 }}></i>
      </button>

      {/* Modal flotante */}
      {abierto && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }} onClick={() => setAbierto(false)}>
          <div style={{
            background: "var(--bg)",
            border: "1px solid var(--brd)",
            borderRadius: "24px",
            padding: "30px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            position: "relative",
            animation: "so_pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }} onClick={e => e.stopPropagation()}>
            
            <button 
              onClick={() => setAbierto(false)}
              style={{
                position: "absolute",
                top: "15px", right: "20px",
                background: "transparent",
                border: "none",
                color: "var(--tx)",
                fontSize: "1.5rem",
                cursor: "pointer",
                opacity: 0.5
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "var(--tx)", borderBottom: "1px solid var(--brd)", paddingBottom: "10px" }}>
              {titulo}
            </h3>
            
            <div style={{ color: "var(--tx)", lineHeight: "1.6", opacity: 0.9 }}>
              {children}
            </div>
            
            <button 
              onClick={() => setAbierto(false)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--brd)",
                borderRadius: "12px",
                padding: "12px",
                color: "var(--tx)",
                marginTop: "25px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
