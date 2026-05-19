"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Post, sumarVista, sumarLike } from "../_lib/blogData";
import { fechaHumana } from "../_lib/formatoFechas";
import { usePostStats } from "../_lib/usePostStats";
import SharePost from "../_components/SharePost";
import SidebarPost from "../_components/sidebarPost";
import CajaComentarios from "../_components/CajaComentarios";
import LeerProgreso from "../_components/LeerProgreso";
import TablaDeContenidos from "../_components/TablaDeContenidos";
import MarkdownPro from "../_components/MarkdownPro";
import "./post.css";

interface PostViewerProps {
  post: Post;
}

/**
 * VISOR DE POST (Versión Élite Pro)
 * Incluye barra de progreso, índice dinámico, contenido, sidebar y comentarios.
 */
export default function PostViewer({ post }: PostViewerProps) {

  // Hook de tiempo real Élite para likes y vistas sincronizados en 0ms y en vivo
  const { vistas, likes, setLikes } = usePostStats(post.id, post.slug, post.vistas, post.likes);
  const [liked, setLiked] = useState(false);

  // Comprobar si ya le dio like y sumar vista
  useEffect(() => {
    sumarVista(post.slug);
    if (localStorage.getItem(`like_${post.slug}`)) {
      setLiked(true);
    }
  }, [post.slug]);

  const handleLike = async () => {
    if (liked) return;

    setLiked(true);
    const nuevoLikes = (likes || 0) + 1;
    setLikes(nuevoLikes);
    sessionStorage.setItem(`amorwii_likes_${post.slug}`, String(nuevoLikes));
    localStorage.setItem(`like_${post.slug}`, "true");

    await sumarLike(post.slug);
  };

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
                  src={post.imagenTop || post.imagen || ""}
                  alt={post.metaSEO?.alt || post.titulo}
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
                <p className="po_resumen">{post.descripcion}</p>

                <div className="po_meta">
                  <span title="Autor"><i className="fa-solid fa-user-pen"></i> {post.autor}</span>
                  <span title="Fecha"><i className="fa-solid fa-calendar-check"></i> {fechaHumana(post.creado)}</span>
                  <span title="Lectura"><i className="fa-solid fa-hourglass-half"></i> {post.lecturaTM}</span>
                  <span title="Vistas"><i className="fa-solid fa-eye"></i> {vistas !== null ? vistas : ""}</span>
                  <span
                    title={liked ? "¡Ya te gusta!" : "Dar me gusta"}
                    onClick={handleLike}
                    style={{ cursor: liked ? "default" : "pointer" }}
                    className={liked ? "liked" : ""}
                  >
                    <i className="fa-solid fa-heart" style={{ color: liked ? "var(--mco)" : undefined }}></i> {likes !== null ? likes : ""}
                  </span>
                </div>
              </header>

              {/* ÍNDICE DINÁMICO (Se muestra solo si hay varios títulos) */}
              <TablaDeContenidos contenido={post.contenidoMD || ""} />

              {/* Contenido Renderizado por AST (MarkdownPro) */}
              <MarkdownPro contenido={post.contenidoMD || ""} />

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
                      className={`po_like_btn ${liked ? "active" : ""}`}
                      onClick={handleLike}
                      disabled={liked}
                    >
                      <i className="fa-solid fa-heart"></i> {likes !== null ? `${likes} ${likes === 1 ? "Me gusta" : "Me gustas"}` : "Me gusta"}
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
