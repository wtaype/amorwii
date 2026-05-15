import type { MetadataRoute } from "next";
import { linkweb } from "@/smiles/wii";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/smile/", "/perfil/", "/editor/", "/admin/", "/api/"],
        crawlDelay: 1,
      },
    ],
    sitemap: `${linkweb}/sitemap.xml`,
  };
}
