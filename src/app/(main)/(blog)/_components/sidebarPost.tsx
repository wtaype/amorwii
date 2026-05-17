"use client";

import React from "react";
import Link from "next/link";
import { Post } from "../_lib/blogData";
import SharePost from "./SharePost";

interface SidebarProps {
  post: Post;
}

/**
 * SIDEBAR DEL POST (Pro)
 * Muestra información del autor, botones de compartir y enlaces de interés.
 */
export default function SidebarPost({ post }: SidebarProps) {
  return (
    <aside className="po_sidebar po_fade po_visible">
      
      {/* CARD: AUTOR */}
      <div className="po_side_card">
        <h3 className="po_side_title">
          <i className="fa-solid fa-user-nib"></i> Autor
        </h3>
        <div className="po_autor_box">
          <div className="po_autor_av">
             <i className="fa-solid fa-circle-user"></i>
          </div>
          <div className="po_autor_info">
            <strong>{post.autor}</strong>
            <span>Editor en AmorWii</span>
          </div>
        </div>
      </div>

      {/* CARD: DETALLES EXTRA */}
      <div className="po_side_card">
        <h3 className="po_side_title">
          <i className="fa-solid fa-circle-info"></i> Detalles
        </h3>
        <ul className="po_info_list">
          <li>
            <i className="fa-solid fa-folder-open"></i>
            <span>Categoría: <strong>{post.categoria}</strong></span>
          </li>
          <li>
            <i className="fa-solid fa-clock"></i>
            <span>Lectura: <strong>{post.tiempoLectura}</strong></span>
          </li>
          <li>
            <i className="fa-solid fa-tags"></i>
            <span>Etiquetas: <strong>{post.tags?.length || 0}</strong></span>
          </li>
        </ul>
      </div>

      {/* CARD: COMPARTIR (Full) */}
      <div className="po_side_card">
        <h3 className="po_side_title">
          <i className="fa-solid fa-share-nodes"></i> Compartir
        </h3>
        <p style={{ fontSize: 'var(--fz_s4)', color: 'var(--tx3)', marginBottom: '1vh' }}>
          Si esta historia te gustó, ayúdanos a llegar a más personas.
        </p>
        <SharePost titulo={post.titulo} slug={post.slug} />
      </div>

      {/* CARD: ADMIN ACTIONS (Solo visual por ahora) */}
      <div className="po_side_card po_admin_card">
        <h3 className="po_side_title">
          <i className="fa-solid fa-screwdriver-wrench"></i> Administración
        </h3>
        <div className="po_admin_actions">
          <Link href={`/nuevo?edit=${post.slug}`} className="po_admin_btn_edit">
            <i className="fa-solid fa-edit"></i> Editar Historia
          </Link>
        </div>
      </div>

    </aside>
  );
}
