import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * HOOK REUTILIZABLE ÉLITE DE TIEMPO REAL (CDC WebSockets)
 * 1. Carga las estadísticas de likes/vistas del post en 0ms desde sessionStorage.
 * 2. Realiza un SELECT rápido a Supabase en segundo plano para obtener la verdad absoluta.
 * 3. Se conecta a Supabase Realtime usando la clave primaria ID (100% confiable y compatible con RLS/Replicación).
 * 4. Actualiza el DOM y el caché local al instante al detectar cualquier interacción.
 */
export function usePostStats(postId: string, slug: string, initialVistas: number, initialLikes: number) {
  const [vistas, setVistas] = useState<number | null>(null);
  const [likes, setLikes] = useState<number | null>(null);

  useEffect(() => {
    // 1. Cargar desde sessionStorage en 0ms para carga instantánea
    const cachedVistas = sessionStorage.getItem(`amorwii_vistas_${slug}`);
    const cachedLikes = sessionStorage.getItem(`amorwii_likes_${slug}`);
    
    setVistas(cachedVistas ? Number(cachedVistas) : initialVistas);
    setLikes(cachedLikes ? Number(cachedLikes) : initialLikes);

    // 2. Consulta rápida de Supabase al montarse para sincronizar con el estado real de la BD
    supabase
      .from("blog")
      .select("likes, vistas")
      .eq("id", postId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          if (typeof data.likes === "number") {
            setLikes(data.likes);
            sessionStorage.setItem(`amorwii_likes_${slug}`, String(data.likes));
          }
          if (typeof data.vistas === "number") {
            setVistas(data.vistas);
            sessionStorage.setItem(`amorwii_vistas_${slug}`, String(data.vistas));
          }
        }
      });

    // 3. Suscribirse a los cambios en tiempo real en Supabase para este ID de registro único
    const canal = supabase
      .channel(`stats_realtime_${postId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "blog",
          filter: `id=eq.${postId}`,
        },
        (payload) => {
          // ⚡ ¡Supabase nos envía los nuevos valores de la base de datos al instante!
          const { likes: nuevosLikes, vistas: nuevasVistas } = payload.new;
          
          if (typeof nuevosLikes === "number") {
            setLikes(nuevosLikes);
            sessionStorage.setItem(`amorwii_likes_${slug}`, String(nuevosLikes));
          }
          if (typeof nuevasVistas === "number") {
            setVistas(nuevasVistas);
            sessionStorage.setItem(`amorwii_vistas_${slug}`, String(nuevasVistas));
          }
        }
      )
      .subscribe();

    // 4. Limpieza de canal al desmontar el componente
    return () => {
      supabase.removeChannel(canal);
    };
  }, [postId, slug, initialVistas, initialLikes]);

  return { vistas, likes, setLikes };
}
