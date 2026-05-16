import { supabase } from "@/lib/supabase";
import { cache } from "react";

/**
 * INTERFAZ POST
 * Refleja exactamente la estructura de la tabla 'blog' en Supabase (camelCase)
 */
export interface Post {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  keywords: string;
  contenido: string;      // HTML renderizado
  contenidoMd: string;    // Markdown fuente
  categoria: string;
  tags: string[];
  imagen: string;         // Miniatura
  imagenTop: string;      // Banner superior
  imagenAlt: string;
  vistas: number;
  likes: number;
  pin: boolean;
  activo: boolean;
  autor: string;
  usuario: string;
  email: string;
  tiempoLectura: string;
  creado: string;
  actualizado: string;
}

/**
 * TRAER POSTS
 * Obtiene la lista de posts activos ordenados por fecha de creación.
 * Usa cache() de React para evitar múltiples peticiones en un mismo render.
 */
export const traerPosts = cache(async () => {
  try {
    const { data, error } = await supabase
      .from('blog')
      .select('*')
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
 * TRAER POST POR SLUG
 * Obtiene un único post basado en su slug (URL amigable).
 */
export const traerPost = cache(async (slug: string) => {
  try {
    const { data, error } = await supabase
      .from('blog')
      .select('*')
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
 * INCREMENTAR VISTAS
 * Llama a la función RPC de Supabase para sumar 1 vista de forma atómica.
 */
export async function sumarVista(slug: string) {
  try {
    await supabase.rpc('increment_vistas', { post_slug: slug });
  } catch (err) {
    console.warn("No se pudo incrementar vistas:", err);
  }
}

/**
 * INCREMENTAR LIKES
 * Llama a la función RPC de Supabase para sumar 1 like de forma atómica.
 */
export async function sumarLike(slug: string) {
  try {
    await supabase.rpc('increment_likes', { post_slug: slug });
  } catch (err) {
    console.warn("No se pudo incrementar likes:", err);
  }
}
