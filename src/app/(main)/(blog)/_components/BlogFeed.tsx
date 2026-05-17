"use client";

import React, { useState, useMemo } from "react";
import { Post } from "../_lib/blogData";
import { TarjetaBlog } from "../blog/blog";

interface BlogFeedProps {
  initialPosts: Post[];
}

/**
 * BLOG FEED (Componente de Cliente)
 * Gestiona la búsqueda y el filtrado por categorías de forma instantánea.
 */
export default function BlogFeed({ initialPosts }: BlogFeedProps) {
  const [busqueda, setBusqueda] = useState("");
  const [catActiva, setCatActiva] = useState("Todas");

  // Obtener categorías únicas de los posts
  const categorias = useMemo(() => {
    const sets = new Set(initialPosts.map(p => p.categoria));
    return ["Todas", ...Array.from(sets)];
  }, [initialPosts]);

  // Filtrado inteligente
  const postsFiltrados = useMemo(() => {
    return initialPosts.filter(p => {
      const cumpleCat = catActiva === "Todas" || p.categoria === catActiva;
      const cumpleBusq = p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return cumpleCat && cumpleBusq;
    });
  }, [initialPosts, busqueda, catActiva]);

  return (
    <>
      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bl_bar">
        <div className="bl_cats">
          {categorias.map(cat => (
            <button
              key={cat}
              className={`bl_cat_btn ${catActiva === cat ? "active" : ""}`}
              onClick={() => setCatActiva(cat)}
            >
              <i className="fa-solid fa-paw"></i>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        <div className="bl_bar_right">
          <div className="bl_search_inner">
            <i className="fa-solid fa-search bl_search_ico"></i>
            <input
              id="bl_search_inp"
              type="text"
              placeholder="Buscar historias..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button className="bl_search_close" onClick={() => setBusqueda("")}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="bl_result_bar">
        {busqueda || catActiva !== "Todas" ? (
          <p>Mostrando <strong>{postsFiltrados.length}</strong> historias {catActiva !== "Todas" && <>en <em>{catActiva}</em></>}</p>
        ) : (
          <p>Total de historias: <strong>{initialPosts.length}</strong></p>
        )}
      </div>

      <main className="bl_grid">
        {postsFiltrados.length > 0 ? (
          postsFiltrados.map((post) => (
            <TarjetaBlog key={post.id} post={post} />
          ))
        ) : (
          <div className="bl_empty dpvc">
            <i className="fa-solid fa-magnifying-glass"></i>
            <h3>No se encontraron historias</h3>
            <p>Prueba con otros términos o categorías.</p>
          </div>
        )}
      </main>
    </>
  );
}
