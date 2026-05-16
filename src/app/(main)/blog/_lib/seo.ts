import { Post } from "./blogData";

/**
 * Genera el Schema JSON-LD para Google (Article)
 * Ayuda a que tus posts salgan con foto y autor en los resultados.
 */
export function generarSchemaPost(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titulo,
    "image": [post.imagen, post.imagenTop].filter(Boolean),
    "datePublished": post.creado,
    "dateModified": post.actualizado,
    "author": [{
        "@type": "Person",
        "name": post.autor,
        "url": "https://amorwii.com"
      }],
    "description": post.resumen,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://amorwii.com/blog/${post.slug}`
    }
  };
}

/**
 * Genera los metadatos dinámicos para Next.js
 */
export function generarMetaPost(post: Post) {
  return {
    title: `${post.titulo} | AmorWii`,
    description: post.resumen,
    keywords: post.keywords,
    openGraph: {
      title: post.titulo,
      description: post.resumen,
      url: `https://amorwii.com/blog/${post.slug}`,
      images: [{ url: post.imagenTop || post.imagen }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.titulo,
      description: post.resumen,
      images: [post.imagenTop || post.imagen],
    }
  };
}
