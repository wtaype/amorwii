import React from "react";
export const revalidate = 3600; // Revalidar cada hora

import { notFound } from "next/navigation";
import { traerPosts } from "../(main)/(blog)/_lib/blogData";
import { generarMetaPost, generarSchemaPost } from "../(main)/(blog)/_lib/seopost";
import PostViewer from "../(main)/(blog)/_components/post";
import MainLayout from "../(main)/layout";
import DetallesView from "../(sorpresas)/detalles";
import { resolverSlug } from "./_lib/resolver";

interface UniversalPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * GENERAR RUTAS ESTÁTICAS (SSG)
 * Pre-renderiza todos los posts del blog en tiempo de compilación.
 */
export async function generateStaticParams() {
  try {
    const posts = await traerPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (err) {
    console.error("Error en generateStaticParams del Despachador:", err);
    return [];
  }
}

/**
 * GENERACIÓN DE METADATOS DINÁMICOS
 * Detecta si el slug es un post o un detalle premium para entregar el SEO idóneo.
 */
export async function generateMetadata({ params }: UniversalPageProps) {
  const { slug } = await params;
  const result = await resolverSlug(slug);

  if (result?.tipo === "blog") {
    return generarMetaPost(result.data);
  }

  if (result?.tipo === "sorpresa") {
    const sorpresa = result.data;
    return {
      title: `Mensaje de amor para ${sorpresa.para || "ti"} 💖 | AmorWii`,
      description: `¡Sorpresa! Alguien especial te ha enviado un mensaje de amor súper premium y privado. ¡Haz clic para verlo!`,
      openGraph: {
        title: `Mensaje especial para ${sorpresa.para || "ti"} 🎁`,
        description: `¡Sorpresa! Alguien especial te ha enviado un mensaje de amor súper premium y privado. ¡Haz clic para verlo!`,
        type: "website",
      }
    };
  }

  return {
    title: "Página no encontrada | AmorWii"
  };
}

/**
 * EL CEREBRO — DESPACHADOR UNIVERSAL
 * Resuelve amorwii.com/[slug] cargando dinámicamente el contenido y su layout exacto.
 */
export default async function UniversalPage({ params }: UniversalPageProps) {
  const { slug } = await params;
  const result = await resolverSlug(slug);

  if (!result) {
    notFound();
  }

  // CASO A: ES UN POST DE BLOG
  if (result.tipo === "blog") {
    const post = result.data;
    const schema = generarSchemaPost(post);
    return (
      <MainLayout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <PostViewer post={post} />
      </MainLayout>
    );
  }

  // CASO B: ES UNA SORPRESA PREMIUM (TABLA DETALLES)
  if (result.tipo === "sorpresa") {
    const sorpresa = result.data;
    const FALLBACK = { id: "", slug: "", de: "", para: "", msg: "", plantilla: "Amor1", fondo: "1", efectoId: "corazones", musicUrl: "", fotos: [] as string[], activo: false, vistas: 0, likes: 0, respuestas: [] as string[], nps: [] as number[], feedbacks: [] as string[] };
    return <DetallesView data={sorpresa ?? FALLBACK} />;
  }

  notFound();
}
