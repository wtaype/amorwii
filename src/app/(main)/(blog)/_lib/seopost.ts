import { Post } from "./blogData";
import * as wii from "@/app/wii";

/**
 * Genera el Schema JSON-LD para Google (Article)
 * Ayuda a que tus posts salgan con foto y autor en los resultados.
 */
export function generarSchemaPost(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.titulo,
    "image": [post.imagen, post.imagenTop].filter(Boolean),
    "datePublished": post.creado,
    "dateModified": post.actualizado,
    "author": [{
      "@type": "Person",
      "name": post.autor,
      "url": wii.linkme
    }],
    "publisher": {
      "@type": "Organization",
      "name": wii.app,
      "logo": {
        "@type": "ImageObject",
        "url": `${wii.linkweb}/poster.webp`
      }
    },
    "description": post.descripcion,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${wii.linkweb}/${post.slug}`
    }
  };
}

/**
 * Genera los metadatos dinámicos para Next.js
 */
export function generarMetaPost(post: Post) {
  const url = `${wii.linkweb}/${post.slug}`;
  const image = post.imagenTop || post.imagen;
  const altText = post.metaSEO?.altTop || post.metaSEO?.alt || post.titulo;

  return {
    title: `${post.titulo} | ${wii.app}`,
    description: post.descripcion,
    keywords: post.metaSEO?.keywords || "",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.titulo,
      description: post.descripcion,
      url: url,
      siteName: wii.app,
      locale: "es_ES",
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: altText
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


