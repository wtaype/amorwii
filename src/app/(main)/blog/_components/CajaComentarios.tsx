"use client";

import React, { useEffect } from "react";

interface ComentariosProps {
  id: string;
  slug: string;
  titulo: string;
}

/**
 * CAJA DE COMENTARIOS (Disqus)
 * Integra el sistema de comentarios de WiiHope (SuperWii).
 */
export default function CajaComentarios({ id, slug, titulo }: ComentariosProps) {
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : "";

  useEffect(() => {
    const d = document;
    const s = d.createElement("script");
    
    // Configuración de Disqus
    const dCfg = function (this: any) {
      this.page.url = url;
      this.page.identifier = id || slug;
      this.page.title = titulo;
    };

    if ((window as any).DISQUS) {
      // Si ya está cargado, lo reseteamos para el nuevo post
      (window as any).DISQUS.reset({
        reload: true,
        config: dCfg
      });
    } else {
      // Si no, lo cargamos por primera vez
      (window as any).disqus_config = dCfg;
      s.src = "https://superwii.disqus.com/embed.js";
      s.setAttribute("data-timestamp", (+new Date()).toString());
      (d.head || d.body).appendChild(s);
    }
  }, [id, slug, titulo, url]);

  return (
    <div className="po_comments po_fade po_visible">
      <div className="po_comments_title">
        <i className="fa-solid fa-comments"></i> Conversación
      </div>
      
      {/* Contenedor de Disqus */}
      <div id="disqus_thread"></div>
      
      <noscript>
        Por favor activa JavaScript para ver los <a href="https://disqus.com/?ref_noscript">comentarios.</a>
      </noscript>
    </div>
  );
}
