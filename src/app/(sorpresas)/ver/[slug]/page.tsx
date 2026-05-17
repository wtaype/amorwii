import { notFound } from "next/navigation";
import SorpresaView from "../../sorpresas";
import { resolverSorpresaSinAuth } from "./_lib/resolver";

interface VerPageProps {
  params: Promise<{ slug: string }>;
}

const FALLBACK = { id: "", de: "", para: "", msg: "", plantilla: "Amor1", fondo: "1", efectoId: "corazones", musicUrl: "", fotos: [] as string[], activo: false, vistas: 0, likes: 0, nps: [] as number[], feedbacks: [] as string[] };

/**
 * METADATOS LIMPIOS Y SENCILLOS PARA SORPRESAS PÚBLICAS
 */
export async function generateMetadata({ params }: VerPageProps) {
  const { slug } = await params;
  const sorpresa = await resolverSorpresaSinAuth(slug);

  if (sorpresa) {
    return {
      title: `Regalo especial para ${sorpresa.para || "ti"} 🎁 | AmorWii`,
      description: `Alguien especial te ha enviado un mensaje de amor personalizado. ¡Haz clic para abrirlo!`,
      openGraph: {
        title: `Regalo especial para ${sorpresa.para || "ti"} 🎁`,
        description: `Alguien especial te ha enviado un mensaje de amor personalizado. ¡Haz clic para abrirlo!`,
        type: "website",
      }
    };
  }

  return {
    title: "Regalo especial | AmorWii"
  };
}

export default async function VerPage({ params }: VerPageProps) {
  const { slug } = await params;
  const sorpresa = await resolverSorpresaSinAuth(slug);

  if (!sorpresa) {
    notFound();
  }

  return <SorpresaView data={sorpresa ?? FALLBACK} />;
}
