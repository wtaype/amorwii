import { supabaseServer } from "./supabase/server";
import type { Mensaje } from "./supabase/types";

/** Buscar mensaje público por slug (SSR) */
export async function buscarPorSlug(slug: string): Promise<Mensaje | null> {
  const supa = await supabaseServer();
  const { data } = await supa
    .from("mensajes")
    .select("*")
    .eq("slug", slug)
    .eq("publico", true)
    .single();
  return data;
}

/** Incrementar vistas (fire-and-forget) */
export async function registrarVista(id: string) {
  const supa = await supabaseServer();
  try {
    await supa.rpc("incrementar_vistas", { mensaje_id: id } as never);
  } catch {
    // ignorar error (fire and forget)
  }
}

/** Mensajes públicos recientes para sitemap */
export async function mensajesPublicos(limite = 50) {
  const supa = await supabaseServer();
  const { data } = await supa
    .from("mensajes")
    .select("slug, updated_at")
    .eq("publico", true)
    .order("created_at", { ascending: false })
    .limit(limite);
  return (data ?? []) as { slug: string; updated_at: string }[];
}

/** Verificar si un slug ya existe */
export async function slugExiste(slug: string): Promise<boolean> {
  const supa = await supabaseServer();
  const { count } = await supa
    .from("mensajes")
    .select("id", { count: "exact", head: true })
    .eq("slug", slug);
  return (count ?? 0) > 0;
}
