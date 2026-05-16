import { createSupabaseServer } from "@/lib/supabaseServer";
import SorpresaView from "../sorpresas";

const FALLBACK = { de: "", para: "", msg: "", plantilla: "Amor1", fondo: "1", efectoId: "corazones", musicUrl: "", fotos: [] as string[], activo: false };

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const sb = await createSupabaseServer();

    const { data } = await sb
        .from("Sorpresas")
        .select("id,slug,de,para,msg,plantilla,fondo,efectoId,musicUrl,fotos,activo")
        .eq("slug", slug)
        .single();

    return <SorpresaView data={data ?? FALLBACK} />;
}
