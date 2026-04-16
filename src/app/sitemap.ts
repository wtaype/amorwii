import type { MetadataRoute } from "next";
import { linkweb } from "@/smiles/wii";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${linkweb}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${linkweb}/crear`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${linkweb}/ejemplos`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${linkweb}/acerca`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${linkweb}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
