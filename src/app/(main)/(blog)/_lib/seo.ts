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
    "description": post.descripcion,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://amorwii.com/${post.slug}`
    }
  };
}

/**
 * Genera los metadatos dinámicos para Next.js
 */
export function generarMetaPost(post: Post) {
  const url = `https://amorwii.com/${post.slug}`;
  const image = post.imagenTop || post.imagen;

  return {
    title: `${post.titulo} | AmorWii`,
    description: post.descripcion,
    keywords: post.metaSEO?.keywords || "",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.titulo,
      description: post.descripcion,
      url: url,
      siteName: "AmorWii",
      locale: "es_ES",
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: post.titulo
      }],
      type: 'article',
      publishedTime: post.creado,
      authors: [post.autor],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.titulo,
      description: post.descripcion,
      images: [image],
      creator: "@wilder.taype",
    }
  };
}

