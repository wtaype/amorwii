"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "../_lib/blogData";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { fechaHumana } from "../_lib/formatoFechas";
import { adRight } from "../wiad";

interface SidebarProps {
  post: Post;
}

interface MiniPost {
  id: string;
  slug: string;
  titulo: string;
  creado: string;
  vistas: number;
  likes: number;
  imagen: string | null;
  lecturaTM: string | null;
  categoria: string;
}

/**
 * SIDEBAR DEL POST (WiiHope Style)
 * Muestra herramientas administrativas primero (solo para dueños),
 * listas dinámicas inteligentes con la estructura exactas de wiihope,
 * y anuncios sticky flotantes sin títulos redundantes.
 */
export default function SidebarPost({ post }: SidebarProps) {
  const { user, perfil } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOwner(false);
      return;
    }
    const esAdminOGestor = perfil?.rol === "admin" || perfil?.rol === "gestor";
    const ownsByUid = user.id === post.userId;
    const ownsByEmail = user.email === post.email;

    setIsOwner(!!(esAdminOGestor || ownsByUid || ownsByEmail));
  }, [user, perfil, post]);

  // Estados dinámicos para los widgets
  const [topPosts, setTopPosts] = useState<MiniPost[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<MiniPost[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    // 1. Obtener Top 7 Historias populares
    async function fetchTop() {
      try {
        const cached = sessionStorage.getItem("amorwii_top_posts");
        if (cached) {
          setTopPosts(JSON.parse(cached));
          setLoadingTop(false);
          return;
        }

        const { data } = await supabase
          .from("blog")
          .select("id, slug, titulo, creado, vistas, likes, imagen, lecturaTM, categoria")
          .eq("activo", true)
          .order("vistas", { ascending: false })
          .limit(7);

        if (data) {
          // Filtrar el post actual para evitar la autorecomendación redundante
          const filtered = data.filter((p) => p.slug !== post.slug).slice(0, 6);
          setTopPosts(filtered);
          sessionStorage.setItem("amorwii_top_posts", JSON.stringify(filtered));
        }
      } catch (e) {
        console.warn("Error al cargar historias populares:", e);
      } finally {
        setLoadingTop(false);
      }
    }

    // 2. Obtener Historias recomendadas de la categoría
    async function fetchRelated() {
      try {
        const cacheKey = `amorwii_related_${post.categoria}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const posts = JSON.parse(cached) as MiniPost[];
          setRelatedPosts(posts.filter((p) => p.slug !== post.slug).slice(0, 3));
          setLoadingRelated(false);
          return;
        }

        const { data } = await supabase
          .from("blog")
          .select("id, slug, titulo, creado, vistas, likes, imagen, lecturaTM, categoria")
          .eq("activo", true)
          .eq("categoria", post.categoria)
          .order("creado", { ascending: false })
          .limit(4);

        if (data) {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
          setRelatedPosts(data.filter((p) => p.slug !== post.slug).slice(0, 3));
        }
      } catch (e) {
        console.warn("Error al cargar historias relacionadas:", e);
      } finally {
        setLoadingRelated(false);
      }
    }

    fetchTop();
    fetchRelated();
  }, [post.categoria, post.slug]);

  return (
    <aside className="po_sidebar po_fade po_visible">

      {/* WIDGET 1: ADMINISTRACIÓN (Se muestra de primero, SOLO cuando es dueño o admin) */}
      {isOwner && (
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
      )}

      {/* WIDGET 2: ULTIMAS / TOP HISTORIAS (Estructura WiiHope) */}
      <div className="po_side_card">
        <h3 className="po_side_title">
          <i className="fa-solid fa-clock" style={{ color: "#fbc02d" }}></i> Últimas historias
        </h3>
        {loadingTop ? (
          <div style={{ padding: "1.5vh 0", color: "var(--tx3)", fontSize: "var(--fz_s4)" }}>
            Cargando historias populares...
          </div>
        ) : topPosts.length > 0 ? (
          <div className="po_relacionados">
            {topPosts.map((p) => (
              <Link key={p.id} href={`/${p.slug}`} className="po_rel_card">
                <div className="po_rel_img">
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.titulo} loading="lazy" />
                  ) : (
                    <div className="po_mini_placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--bg4)' }}>
                      <i className="fa-solid fa-heart" style={{ color: 'var(--mco)' }}></i>
                    </div>
                  )}
                </div>
                <div className="po_rel_info">
                  <span className="po_rel_cat">
                    <i className="fa-solid fa-paw"></i> {p.categoria}
                  </span>
                  <strong>{p.titulo}</strong>
                  <span className="po_rel_meta">
                    <i className="fa-solid fa-calendar"></i> {fechaHumana(p.creado)} ·
                    <i className="fa-solid fa-eye"></i> {p.vistas || 0} ·
                    <i className="fa-solid fa-heart" style={{ color: "#fe0149" }}></i> {p.likes || 0}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "var(--fz_s4)", color: "var(--tx3)" }}>No hay historias populares aún.</p>
        )}
      </div>

      {/* WIDGET 3: MÁS HISTORIAS DE LA CATEGORÍA (Estructura WiiHope) */}
      <div className="po_side_card">
        <h3 className="po_side_title">
          <i className="fa-solid fa-heart" style={{ color: "#fe0149" }}></i> Más historias de {post.categoria}
        </h3>
        {loadingRelated ? (
          <div style={{ padding: "1.5vh 0", color: "var(--tx3)", fontSize: "var(--fz_s4)" }}>
            Cargando recomendaciones...
          </div>
        ) : relatedPosts.length > 0 ? (
          <div className="po_relacionados">
            {relatedPosts.map((p) => (
              <Link key={p.id} href={`/${p.slug}`} className="po_rel_card">
                <div className="po_rel_img">
                  {p.imagen ? (
                    <img src={p.imagen} alt={p.titulo} loading="lazy" />
                  ) : (
                    <div className="po_mini_placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--bg4)' }}>
                      <i className="fa-solid fa-heart" style={{ color: 'var(--mco)' }}></i>
                    </div>
                  )}
                </div>
                <div className="po_rel_info">
                  <span className="po_rel_cat">
                    <i className="fa-solid fa-paw"></i> {p.categoria}
                  </span>
                  <strong>{p.titulo}</strong>
                  <span className="po_rel_meta">
                    <i className="fa-solid fa-calendar"></i> {fechaHumana(p.creado)} ·
                    <i className="fa-solid fa-eye"></i> {p.vistas || 0} ·
                    <i className="fa-solid fa-heart" style={{ color: "#fe0149" }}></i> {p.likes || 0}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "var(--fz_s4)", color: "var(--tx3)" }}>No hay más historias en esta categoría.</p>
        )}
      </div>

      {/* WIDGET 4: ANUNCIO STICKY (wiad.ts - adRight sin texto de Patrocinado) */}
      <div className="po_ad_sticky">
        <div className="wi_ad_fallback" dangerouslySetInnerHTML={{ __html: adRight }} />
      </div>

    </aside>
  );
}
