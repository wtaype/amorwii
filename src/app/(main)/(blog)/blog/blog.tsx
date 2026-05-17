"use client";

import React from "react";
import Link from "next/link";
import { Post } from "../_lib/blogData";
import { haceTiempo } from "../_lib/formatoFechas";

/**
 * TARJETA BLOG
 * Componente visual para cada historia en la lista.
 * Usa las clases definidas en blog.css
 */
export function TarjetaBlog({ post }: { post: Post }) {
  return (
    <Link href={`/${post.slug}`} className="bl_card po_fade po_visible">
      <div className="bl_card_img">
        <img
          src={post.imagen}
          alt={post.imagenAlt || post.titulo}
          loading="lazy"
        />
        <div className="bl_card_over">
          <span className="bl_card_cat">
            <i className="fa-solid fa-paw"></i> {post.categoria}
          </span>
          {post.pin && (
            <div className="bl_card_dest">
              <i className="fa-solid fa-thumbtack"></i>
            </div>
          )}
        </div>
      </div>

      <div className="bl_card_body">
        <h3 className="bl_card_tit">{post.titulo}</h3>
        <p className="bl_card_res">{post.resumen}</p>

        <div className="bl_card_footer">
          <div className="bl_card_meta">
            <span><i className="fa-solid fa-calendar-day"></i> {haceTiempo(post.creado)}</span>
            <span><i className="fa-solid fa-eye"></i> {post.vistas || 0}</span>
          </div>
          <div className="bl_card_leer">
            Leer más <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * ESQUELETO BLOG
 * Efecto shimmer para cuando los datos están cargando.
 */
export function EsqueletoBlog() {
  return (
    <div className="bl_card_sk">
      <div className="bl_sk_img shimmer"></div>
      <div className="bl_sk_body">
        <div className="bl_sk_cat shimmer"></div>
        <div className="bl_sk_tit shimmer"></div>
        <div className="bl_sk_t2 shimmer"></div>
        <div className="bl_sk_p shimmer"></div>
        <div className="bl_sk_p2 shimmer"></div>
        <div className="bl_sk_foot shimmer"></div>
      </div>
    </div>
  );
}
