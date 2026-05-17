import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createSupabaseServerStatic } from "@/lib/supabaseServerStatic";

/**
 * RESOLVER SORPRESA SIN AUTH CACHEADO
 * Diseñado específicamente para amorwii.com/ver/[slug]
 * Busca sorpresas públicas/anónimas (conAuth === false).
 */
export const resolverSorpresaSinAuth = cache(async (slug: string) => {
  return traerSorpresaPublicaConCache(slug);
});

// Caché para sorpresas públicas/anónimas (revalida cada 30 segundos)
const traerSorpresaPublicaConCache = unstable_cache(
  async (slug: string) => {
    try {
      const sb = createSupabaseServerStatic();
      const { data } = await sb
        .from("sorpresas") // 🟢 Apunta a la tabla de sorpresas anónimas
        .select("id,slug,de,para,msg,plantilla,fondo,efectoId,musicUrl,fotos,activo,vistas,nps,feedback,expira,creado")
        .eq("slug", slug)
        .maybeSingle();
      return data;
    } catch (err) {
      console.error("Error al traer sorpresa pública en resolver:", err);
      return null;
    }
  },
  ["sorpresa-publica-slug"],
  { revalidate: 30, tags: ["sorpresas-publicas"] }
);
