"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Post, sumarVista, sumarLike } from "../_lib/blogData";
import { fechaHumana } from "../_lib/formatoFechas";
import SharePost from "../_components/SharePost";
import SidebarPost from "../_components/sidebarPost";
import CajaComentarios from "../_components/CajaComentarios";
import LeerProgreso from "../_components/LeerProgreso";
import TablaDeContenidos from "../_components/TablaDeContenidos";
import "./post.css";

interface PostViewerProps {
  post: Post;
}

/**
 * VISOR DE POST (Versión Élite Pro)
 * Incluye barra de progreso, índice dinámico, contenido, sidebar y comentarios.
 */
export default function PostViewer({ post }: PostViewerProps) {
  
  // Sumar vista al entrar
  useEffect(() => {
    sumarVista(post.slug);
  }, [post.slug]);

  return (
    <>
      <LeerProgreso />

      <article className="po_wrap">
        <div className="po_layout">
          
          <div className="po_col_main">
            
            <div className="po_content po_fade po_visible">
              {/* Hero Imagen */}
              <div className="po_hero">
                <img 
                  src={post.imagenTop || post.imagen} 
                  alt={post.imagenAlt || post.titulo} 
                  className="po_hero_img"
                />
                <div className="po_hero_over">
                  <Link href="/blog" className="po_back">
                    <i className="fa-solid fa-chevron-left"></i> Volver
                  </Link>
                  <div className="po_hero_badges">
                    <span className="po_cat_badge">{post.categoria}</span>
                    {post.pin && <span className="po_dest_badge"><i className="fa-solid fa-star"></i> Destacado</span>}
                  </div>
                </div>
              </div>

              {/* Header */}
              <header className="po_header">
                <h1 className="po_titulo">{post.titulo}</h1>
                <p className="po_resumen">{post.resumen}</p>
                
                <div className="po_meta">
                  <span title="Autor"><i className="fa-solid fa-pen-nib"></i> {post.autor}</span>
                  <span title="Fecha"><i className="fa-solid fa-calendar-day"></i> {fechaHumana(post.creado)}</span>
                  <span title="Lectura estimada"><i className="fa-solid fa-clock"></i> {post.tiempoLectura}</span>
                  <span title="Vistas"><i className="fa-solid fa-eye"></i> {post.vistas}</span>
                </div>
              </header>

              {/* ÍNDICE DINÁMICO (Se muestra solo si hay varios títulos) */}
              <TablaDeContenidos contenido={post.contenido} />

              {/* Contenido HTML */}
              <main 
                className="po_contenido" 
                dangerouslySetInnerHTML={{ __html: post.contenido }} 
              />

              {/* Footer */}
              <footer className="po_footer_info">
                {post.tags && post.tags.length > 0 && (
                  <div className="po_tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="po_tag">#{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="po_share">
                  <span>
                    <button 
                      className="po_like_btn" 
                      onClick={async (e) => {
                        const btn = e.currentTarget;
                        if (localStorage.getItem(`like_${post.slug}`)) return;
                        await sumarLike(post.slug);
                        localStorage.setItem(`like_${post.slug}`, "true");
                        btn.classList.add("active");
                      }}
                    >
                      <i className="fa-solid fa-heart"></i> Me gusta
                    </button>
                    ¡Comparte esperanza!
                  </span>
                  <SharePost titulo={post.titulo} slug={post.slug} />
                </div>
              </footer>
            </div>

          {/* CAJA DE COMENTARIOS (Disqus SuperWii) */}
          <CajaComentarios id={post.id} slug={post.slug} titulo={post.titulo} />
          </div>

          {/* SIDEBAR PRO */}
          <SidebarPost post={post} />

        </div>
      </article>
    </>
  );
}
