import { createClient } from "@supabase/supabase-js";

/**
 * CLIENTE SUPABASE SERVIDOR ESTÁTICO (Sin Cookies)
 * Diseñado especialmente para ser usado dentro de funciones cacheadas con unstable_cache().
 * Al no usar headers ni cookies de la petición HTTP, evita el error "Route used cookies() inside a function cached with unstable_cache()"
 * permitiendo una velocidad de entrega instantánea de 0ms.
 */
export function createSupabaseServerStatic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
