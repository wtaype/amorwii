import { supabase } from "@/lib/supabase";
import { cache } from "react";
import { unstable_cache } from "next/cache";

/**
 * INTERFAZ POST
 * Refleja exactamente la estructura de la tabla 'blog' en Supabase (camelCase)
 */
export interface Post {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  contenidoMD?: string;    // Markdown fuente (Opcional en listas)
  categoria: string;
  tags: string[];
  imagen: string | null;         // Miniatura
  imagenTop: string | null;      // Banner superior
  metaSEO: Record<string, any>;  // Metadatos SEO (JSONB)
  vistas: number;
  likes: number;
  pin: boolean;
  activo: boolean;
  autor: string;
  userId: string | null;
  email: string | null;
  usuario: string | null;
  lecturaTM: string | null;
  creado: string;
  actualizado: string;
}

/**
 * TRAER POSTS (Modo Súper Veloz 0ms)
 * Solo trae los campos esenciales para las tarjetas.
 * EXCLUYE: contenido, contenidoMD, buscador tsvector.
 */
export const traerPosts = cache(async () => {
  try {
    const { data, error } = await supabase
      .from('blog')
      .select('id, "userId", usuario, slug, autor, email, likes, vistas, titulo, descripcion, categoria, tags, imagen, "imagenTop", "metaSEO", "lecturaTM", activo, pin, creado, actualizado')
      .eq('activo', true)
      .order('creado', { ascending: false });

    if (error) {
      console.error("Error al traer posts:", error.message);
      return [];
    }
    return data as Post[];
  } catch (err) {
    console.error("Error crítico en traerPosts:", err);
    return [];
  }
});

/**
 * TRAER POSTS CON CACHÉ DE BORDE (Next.js unstable_cache)
 * Almacena el listado en la caché de borde para una respuesta instantánea de 0ms.
 * Revalida de forma automática por tag 'blog' o cada 1 hora.
 */
export const traerPostsConCache = unstable_cache(
  async () => traerPosts(),
  ["blog-posts-list"],
  {
    revalidate: 3600,
    tags: ["blog"],
  }
);

/**
 * TRAER POST POR SLUG (Detalle Completo)
 * Trae TODO incluyendo el contenido HTML.
 * EXCLUYE: buscador tsvector.
 */
export const traerPost = cache(async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('blog')
      .select('id, "userId", usuario, slug, autor, email, likes, vistas, titulo, descripcion, "contenidoMD", categoria, tags, imagen, "imagenTop", "metaSEO", "lecturaTM", activo, pin, creado, actualizado')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`Error al traer post ${slug}:`, error.message);
      return null;
    }
    return data as Post | null;
  } catch (err) {
    console.error(`Error crítico en traerPost (${slug}):`, err);
    return null;
  }
});

/**
 * INCREMENTAR VISTAS (RPC)
 */
export async function sumarVista(slug: string) {
  try {
    await supabase.rpc('incrementar_vistas_blog', { post_slug: slug });
  } catch (err) {
    console.warn("No se pudo incrementar vistas:", err);
  }
}

/**
 * INCREMENTAR LIKES (RPC)
 */
export async function sumarLike(slug: string) {
  try {
    await supabase.rpc('incrementar_likes_blog', { post_slug: slug });
  } catch (err) {
    console.warn("No se pudo incrementar likes:", err);
  }
}
