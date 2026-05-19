"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalBlogProps {
  titulo: string;
  children?: React.ReactNode;
  tipo?: "normal" | "youtube" | "video" | "documento" | "imagen";
  src?: string; // Soportará URLs de youtube, nativas, imágenes o PDFs
}

// Lógica de extracción de video ID de YouTube centralizada
const obtenerYoutubeId = (url?: string): string => {
  if (!url) return "";
  if (url.length === 11 && !url.includes("/") && !url.includes("?")) {
    return url; // Ya es un ID crudo
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

export default function ModalBlog({ titulo, children, tipo = "normal", src }: ModalBlogProps) {
  const [abierto, setAbierto] = useState(false);
  const [montado, setMontado] = useState(false);
  const isMedia = tipo === "youtube" || tipo === "video";

  // Asegurar que el portal solo se monte en el cliente tras la hidratación inicial
  useEffect(() => {
    setMontado(true);
  }, []);

  const renderTrigger = () => {
    switch (tipo) {
      case "youtube":
      case "video":
        return (
          <button type="button" onClick={() => setAbierto(true)} className="po_yt_btn">
            <i className={tipo === "youtube" ? "fab fa-youtube" : "fa-solid fa-circle-play"} style={{ color: "#fe0149" }}></i>
            {titulo || (tipo === "youtube" ? "Ver Video" : "Reproducir Video")}
          </button>
        );
      case "documento":
        return (
          <button type="button" onClick={() => setAbierto(true)} className="po_doc_btn">
            <i className="fa-solid fa-file-pdf" style={{ color: "#00a8e6" }}></i>
            {titulo || "Ver Documento"}
          </button>
        );
      case "imagen":
        return (
          <button type="button" onClick={() => setAbierto(true)} className="po_img_btn">
            <i className="fa-solid fa-image" style={{ color: "#7000FF" }}></i>
            {titulo || "Ver Imagen"}
          </button>
        );
      default:
        return (
          <button type="button" onClick={() => setAbierto(true)} className="po_normal_btn">
            <span><i className="fa-solid fa-eye" style={{ color: "#FF5C69", marginRight: "10px" }}></i> {titulo || "Ver contenido oculto"}</span>
            <i className="fa-solid fa-chevron-right" style={{ opacity: 0.5 }}></i>
          </button>
        );
    }
  };

  const videoId = tipo === "youtube" ? obtenerYoutubeId(src) : "";

  return (
    <span className={tipo === "normal" ? "po_modal_wrap" : "po_modal_wrap_inline"}>
      {renderTrigger()}

      {abierto && montado && createPortal(
        <div className="po_modal_overlay" onClick={() => setAbierto(false)}>
          <div className={isMedia ? "po_modal_dialog_media" : "po_modal_dialog"} onClick={e => e.stopPropagation()}>
            
            <button onClick={() => setAbierto(false)} className={isMedia ? "po_modal_close_media" : "po_modal_close"}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            {tipo === "youtube" && videoId && (
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={titulo}
                style={{ border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            )}

            {tipo === "video" && src && (
              <video src={src} controls autoPlay style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
            )}

            {!isMedia && (
              <>
                <h3 style={{ marginTop: 0, marginBottom: "20px", color: "var(--tx)", borderBottom: "1px solid var(--brd)", paddingBottom: "10px" }}>
                  {titulo}
                </h3>
                <div style={{ color: "var(--tx)", lineHeight: "1.6", opacity: 0.9 }}>
                  {children}
                </div>
                <button onClick={() => setAbierto(false)} className="po_modal_btn_close">
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </span>
  );
}
