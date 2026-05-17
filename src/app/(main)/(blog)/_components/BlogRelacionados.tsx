import React from "react";
import { supabase } from "@/lib/supabase";
import { Post } from "../_lib/blogData";
import { TarjetaBlog } from "../blog/blog";

interface RelacionadosProps {
  slugActual: string;
  categoria: string;
}

/**
 * HISTORIAS RELACIONADAS (Server Component)
 * Busca otras historias de la misma categoría para fomentar la lectura.
 */
export default async function BlogRelacionados({ slugActual, categoria }: RelacionadosProps) {
  // Buscamos 4 historias de la misma categoría, excluyendo la actual
  const { data: posts, error } = await supabase
    .from("blog")
    .select('id, slug, titulo, descripcion, categoria, tags, imagen, "imagenTop", "metaSEO", vistas, likes, pin, activo, autor, "userId", "lecturaTM", creado, actualizado')
    .eq("categoria", categoria)
    .eq("activo", true)
    .neq("slug", slugActual)
    .limit(4);

  if (error || !posts || posts.length === 0) return null;

  return (
    <section className="bl_rel_wrap po_fade po_visible" style={{ marginTop: '4vh' }}>
      <h2 className="bl_hero_tit" style={{ fontSize: 'var(--fz_l1)', textAlign: 'left', marginBottom: '2vh' }}>
        Historias <span className="bl_grad">relacionadas</span>
      </h2>

      <div className="bl_grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {posts.map((post: Post) => (
          <TarjetaBlog key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
