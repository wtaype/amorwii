import React from "react";
export const revalidate = 3600; // Revalidar cada hora

import { notFound } from "next/navigation";
import { traerPost, traerPosts } from "../(main)/(blog)/_lib/blogData";
import { generarMetaPost, generarSchemaPost } from "../(main)/(blog)/_lib/seo";
import PostViewer from "../(main)/(blog)/_components/post";
import MainLayout from "../(main)/layout";

import { createSupabaseServer } from "@/lib/supabaseServer";
import SorpresaView from "../(sorpresas)/sorpresas";

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
 * Detecta si el slug es un post o una sorpresa para entregar el SEO idóneo.
 */
export async function generateMetadata({ params }: UniversalPageProps) {
  const { slug } = await params;

  // 1. Intentar traer post del blog
  const post = await traerPost(slug);
  if (post) {
    return generarMetaPost(post);
  }

  // 2. Intentar traer sorpresa de Supabase
  try {
    const sb = await createSupabaseServer();
    const { data: sorpresa } = await sb
      .from("Sorpresas")
      .select("de, para, msg")
      .eq("slug", slug)
      .maybeSingle();

    if (sorpresa) {
      return {
        title: `Regalo especial para ${sorpresa.para || "ti"} 🎁 | AmorWii`,
        description: `Alguien especial te ha enviado un mensaje de amor personalizado. ¡Haz clic para abrirlo!`,
        robots: { index: false, follow: false }, // Privacidad para sorpresas
        openGraph: {
          title: `Regalo especial para ${sorpresa.para || "ti"} 🎁`,
          description: `Alguien especial te ha enviado un mensaje de amor personalizado. ¡Haz clic para abrirlo!`,
          type: "website",
        }
      };
    }
  } catch (err) {
    console.warn("Error al buscar metadatos de Sorpresa:", err);
  }

  return {
    title: "Página no encontrada | AmorWii",
    robots: { index: false, follow: false }
  };
}

/**
 * EL CEREBRO — DESPACHADOR UNIVERSAL
 * Resuelve amorwii.com/[slug] cargando dinámicamente el contenido y su layout exacto.
 */
export default async function UniversalPage({ params }: UniversalPageProps) {
  const { slug } = await params;

  // Ejecutamos las búsquedas de forma paralela (máxima velocidad)
  const busquedaBlog = traerPost(slug);
  
  const busquedaSorpresa = (async () => {
    try {
      const sb = await createSupabaseServer();
      const { data } = await sb
        .from("Sorpresas")
        .select("id,slug,de,para,msg,plantilla,fondo,efectoId,musicUrl,fotos,activo")
        .eq("slug", slug)
        .maybeSingle();
      return data;
    } catch (err) {
      console.error("Error al buscar sorpresa:", err);
      return null;
    }
  })();

  // Esperamos ambos resultados
  const [post, sorpresa] = await Promise.all([busquedaBlog, busquedaSorpresa]);

  // CASO A: ES UN POST DE BLOG
  if (post) {
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

  // CASO B: ES UNA SORPRESA PERSONALIZADA
  if (sorpresa) {
    const FALLBACK = { de: "", para: "", msg: "", plantilla: "Amor1", fondo: "1", efectoId: "corazones", musicUrl: "", fotos: [] as string[], activo: false };
    return <SorpresaView data={sorpresa ?? FALLBACK} />;
  }

  // CASO C: NO EXISTE EN NINGÚN MUNDO
  notFound();
}
