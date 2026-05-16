import React from "react";
export const revalidate = 3600; // Revalidar cada hora
import { notFound } from "next/navigation";
import { traerPost } from "../_lib/blogData";
import { generarMetaPost, generarSchemaPost } from "../_lib/seo";
import PostViewer from "./post";
import BlogRelacionados from "../_components/BlogRelacionados";

interface PostPageProps {
  params: { slug: string };
}

/**
 * PÁGINA DEL POST (Server Component)
 * Conecta los datos con el visor y añade historias relacionadas.
 */
export async function generateMetadata({ params }: PostPageProps) {
  const post = await traerPost(params.slug);
  if (!post) return { title: "Post no encontrado | AmorWii" };
  return generarMetaPost(post);
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await traerPost(params.slug);

  if (!post) notFound();

  const schema = generarSchemaPost(post);

  return (
    <div className="po_col_main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Visor Principal */}
      <PostViewer post={post} />

      {/* Historias Relacionadas (Debajo del post) */}
      <div className="po_wrap">
         <BlogRelacionados slugActual={post.slug} categoria={post.categoria} />
      </div>
    </div>
  );
}
