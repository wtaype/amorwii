import type { MetadataRoute } from "next";
import { linkweb } from "@/smiles/wii";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/crear", "/acerca", "/ejemplos", "/login"],
        disallow: ["/admin", "/gestor", "/smile"],
      },
    ],
    sitemap: `${linkweb}/sitemap.xml`,
    host: linkweb,
  };
}
