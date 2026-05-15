import type { MetadataRoute } from "next";
import { linkweb } from "@/smiles/wii";
import { mensajesPublicos } from "@/lib/mensajes";

const RUTAS_PUBLICAS = [
  { path: "/", prio: 1.0, freq: "daily" as const },
  { path: "/crear", prio: 0.9, freq: "weekly" as const },
  { path: "/plantillas", prio: 0.9, freq: "weekly" as const },
  { path: "/ejemplos", prio: 0.8, freq: "weekly" as const },
  { path: "/enviar", prio: 0.7, freq: "weekly" as const },
  { path: "/descubre", prio: 0.7, freq: "monthly" as const },
  { path: "/acerca", prio: 0.5, freq: "monthly" as const },
  { path: "/contacto", prio: 0.4, freq: "monthly" as const },
  { path: "/feedback", prio: 0.4, freq: "monthly" as const },
  { path: "/terminos", prio: 0.3, freq: "yearly" as const },
  { path: "/privacidad", prio: 0.3, freq: "yearly" as const },
  { path: "/cookies", prio: 0.3, freq: "yearly" as const },
  { path: "/login", prio: 0.4, freq: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Rutas estáticas
  const staticRoutes: MetadataRoute.Sitemap = RUTAS_PUBLICAS.map((r) => ({
    url: `${linkweb}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.freq,
    priority: r.prio,
  }));

  // Mensajes públicos populares (dinámico)
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const mensajes = await mensajesPublicos(100);
    dynamicRoutes = mensajes.map((m) => ({
      url: `${linkweb}/${m.slug}`,
      lastModified: new Date(m.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Supabase not connected yet — return static only
  }

  return [...staticRoutes, ...dynamicRoutes];
}
