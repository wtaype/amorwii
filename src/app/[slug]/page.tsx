import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buscarPorSlug } from "@/lib/mensajes";
import { app, linkweb } from "@/smiles/wii";
import { porCarpeta } from "@/smiles/plantillas";
import { VisorPlantilla } from "@/smiles/plantillas/visor";

type SlugProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
  const { slug } = await params;
  const mensaje = await buscarPorSlug(slug);

  if (!mensaje) {
    return { title: `Mensaje no encontrado | ${app}` };
  }

  const pl = porCarpeta(mensaje.plantilla);
  const titulo = mensaje.para ? `${pl.emoji} Para ${mensaje.para}` : `${pl.emoji} Mensaje de Amor`;
  const desc = mensaje.msg
    ? mensaje.msg.substring(0, 140)
    : `Mensaje de ${mensaje.de || "alguien especial"} creado con ${app}`;

  return {
    title: titulo,
    description: desc,
    openGraph: {
      title: titulo,
      description: desc,
      url: `${linkweb}/${slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: titulo, description: desc },
    robots: { index: true, follow: true },
  };
}

export default async function SlugPage({ params }: SlugProps) {
  const { slug } = await params;
  const mensaje = await buscarPorSlug(slug);

  if (!mensaje) {
    notFound();
  }

  /* Renderizado del mensaje usando el VisorBase de plantillas */
  return <VisorPlantilla mensaje={mensaje} />;
}
