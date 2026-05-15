import { HomeView } from "@/smiles/home";
import { PrincipalShell } from "@/smiles/principal";
import { VisorPlantilla } from "@/smiles/plantillas/visor";
import { obtener, nombres } from "@/smiles/plantillas";
import type { Mensaje } from "@/lib/supabase/types";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  
  // Soporte para "Link Largo" (Sin base de datos, todo en la URL como Lovewi)
  const keys = Object.keys(params);
  if (keys.length > 0) {
    const n = keys[0]; // Ej: "Amor", "Aniversario"
    
    // Verificamos si la primera key es el nombre de una plantilla válida
    if (nombres().includes(n)) {
      const pl = obtener(n);
      
      const dec = (k: string) => typeof params[k] === "string" ? decodeURIComponent(params[k] as string) : "";
      
      const mensaje: Mensaje = {
        id: "local",
        slug: "local",
        plantilla: pl.carpeta,
        nombre: n,
        de: dec("de"),
        para: dec("para"),
        msg: dec("msg"),
        musica: params.musica ? decodeURIComponent(params.musica as string) : pl.musicaDefault,
        emoji: pl.emoji,
        img: "",
        vistas: 0,
        publico: true,
        user_id: null,
        email: "",
        usuario: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return <VisorPlantilla mensaje={mensaje} />;
    }
  }

  return (
    <PrincipalShell>
      <HomeView />
    </PrincipalShell>
  );
}
