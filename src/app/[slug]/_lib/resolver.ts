import { cache } from "react";
import { unstable_cache } from "next/cache";
import { traerPost } from "../../(main)/(blog)/_lib/blogData";
import { createSupabaseServerStatic } from "@/lib/supabaseServerStatic";

/**
 * RESOLVER SLUG CACHEADO
 * Diseñado específicamente para amorwii.com/[slug]
 * 1. Intenta resolver posts del blog.
 * 2. Intenta resolver sorpresas registradas (conAuth === true).
 */
export const resolverSlug = cache(async (slug: string) => {
  // 1. Buscar en blog
  const post = await traerPostConCache(slug);
  if (post) {
    return { tipo: "blog" as const, data: post };
  }

  // 2. Buscar en sorpresas registradas (Premium - tabla detalles)
  const sorpresa = await traerSorpresaRegistradaConCache(slug);
  if (sorpresa) {
    return { tipo: "sorpresa" as const, data: sorpresa };
  }

  return null;
});

// Caché para posts de blog
const traerPostConCache = unstable_cache(
  async (slug: string) => traerPost(slug),
  ["blog-post-slug"],
  { revalidate: 3600, tags: ["blog"] }
);

// Caché para sorpresas registradas/premium (tabla detalles)
const traerSorpresaRegistradaConCache = unstable_cache(
  async (slug: string) => {
    try {
      const sb = createSupabaseServerStatic();
      const { data } = await sb
        .from("detalles") // 🟢 Apunta a la nueva tabla premium 'detalles'
        .select("id,slug,de,para,msg,plantilla,fondo,efectoId,musicUrl,fotos,userId,email,usuario,activo,plan,pin,vistas,likes,respuestas,nps,feedbacks")
        .eq("slug", slug)
        .maybeSingle();
      return data;
    } catch (err) {
      console.error("Error al traer detalle premium en resolver:", err);
      return null;
    }
  },
  ["sorpresa-registrada-slug"],
  { revalidate: 30, tags: ["sorpresas-registradas"] }
);
