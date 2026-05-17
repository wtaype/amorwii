import { traerPosts } from "@/app/(main)/(blog)/_lib/blogData";

export default async function sitemap() {
  const baseUrl = "https://amorwii.com";

  // 1. Páginas estáticas principales con su configuración SEO
  const staticPages = [
    { route: "", changefreq: "daily", priority: 1.0 },          // Home
    { route: "/crear", changefreq: "weekly", priority: 0.9 },     // Crear dedicatoria
    { route: "/blog", changefreq: "daily", priority: 0.9 },       // Blog de historias
    { route: "/plantillas", changefreq: "weekly", priority: 0.8 }, // Selección de plantillas
    { route: "/ejemplos", changefreq: "weekly", priority: 0.8 },   // Ejemplos de cartas
    { route: "/acerca", changefreq: "monthly", priority: 0.6 },    // Acerca de nosotros
    { route: "/contacto", changefreq: "monthly", priority: 0.5 },  // Formulario de contacto
    { route: "/terminos", changefreq: "monthly", priority: 0.5 },  // Políticas y legal
    { route: "/privacidad", changefreq: "monthly", priority: 0.5 },
    { route: "/cookies", changefreq: "monthly", priority: 0.5 },
  ].map((page) => ({
    url: `${baseUrl}${page.route}`,
    lastModified: new Date(),
    changeFrequency: page.changefreq as "daily" | "weekly" | "monthly",
    priority: page.priority,
  }));

  // 2. Cargar dinámicamente los artículos de blog de la base de datos
  let blogPages: { url: string; lastModified: Date; changeFrequency: "weekly"; priority: number }[] = [];
  try {
    const posts = await traerPosts();
    if (Array.isArray(posts)) {
      blogPages = posts.map((post) => {
        // Usar la fecha de actualización si existe, sino la de creación
        const fecha = post.actualizado || post.creado;
        return {
          url: `${baseUrl}/${post.slug}`,
          lastModified: fecha ? new Date(fecha) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      });
    }
  } catch (error) {
    console.error("Error al generar sitemap dinámico para posts:", error);
  }

  // Combinamos y retornamos todas las páginas indexables
  return [...staticPages, ...blogPages];
}
