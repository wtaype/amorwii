import React from "react";
import "./blog.css";
import { traerPosts } from "../_lib/blogData";
import BlogFeed from "../_components/BlogFeed";

export const metadata = {
  title: "Blog de Historias | AmorWii",
  description: "Descubre historias inspiradoras sobre amor, fe y esperanza en nuestro blog.",
};

/**
 * PÁGINA PRINCIPAL DEL BLOG (Versión Pro)
 * Ahora usa el componente BlogFeed para búsqueda y filtros instantáneos.
 */
export default async function BlogPage() {
  // Traemos los posts desde el servidor (Supabase)
  const posts = await traerPosts();

  return (
    <div className="bl_wrap">
      {/* Hero Section */}
      <header className="bl_hero po_fade po_visible">
        <h1 className="bl_hero_tit">
          Historias que <span className="bl_grad">inspiran</span>
        </h1>
        <p className="bl_hero_sub">
          Un espacio dedicado al amor, la fe y los milagros cotidianos.
        </p>
      </header>

      {/* Componente de Cliente para Búsqueda y Grid */}
      <BlogFeed initialPosts={posts} />
    </div>
  );
}
