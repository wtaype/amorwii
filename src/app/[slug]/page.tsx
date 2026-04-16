import type { Metadata } from "next";
import { PlantillaView } from "@/smiles/plantilla";
import { app } from "@/smiles/wii";

type SlugProps = {
  params: Promise<{ slug: string }>;
};

function normalizarSlug(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, " ").trim();
}

export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
  const { slug } = await params;
  const titulo = normalizarSlug(slug);
  return {
    title: `${titulo} | ${app}`,
    description: `Mensaje compartido: ${titulo}`,
  };
}

export default async function SlugPage({ params }: SlugProps) {
  const { slug } = await params;
  const titulo = normalizarSlug(slug);

  return (
    <PlantillaView
      etiqueta="Mensaje"
      titulo={titulo || "Sin titulo"}
      descripcion="Este slug ya esta listo para conectarse con lectura real desde Supabase."
    />
  );
}
