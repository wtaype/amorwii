import type { Metadata } from "next";
import { PlantillaView } from "@/smiles/plantilla";
import { supabaseServer } from "@/lib/supabase/server";
import { linkweb } from "@/smiles/wii";

export const metadata: Metadata = {
  title: "Mi Panel",
  robots: { index: false, follow: false },
};

export default async function SmilePage() {
  const supa = await supabaseServer();
  const { data: { user } } = await supa.auth.getUser();

  let mensajes: any[] = [];
  if (user) {
    const { data } = await supa
      .from("mensajes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    mensajes = data || [];
  }

  return (
    <PlantillaView
      etiqueta="Dashboard"
      titulo="Mis Mensajes"
      descripcion="Aquí podrás ver, editar y gestionar todos tus mensajes guardados."
    >
      <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
        {mensajes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", background: "#f8f9fa", borderRadius: "12px" }}>
            <p>Aún no has creado ningún mensaje vinculado a tu cuenta.</p>
            <a href="/crear" style={{ color: "#ff6b8a", fontWeight: "bold", textDecoration: "none" }}>Crear mi primer mensaje</a>
          </div>
        ) : (
          mensajes.map((msg) => (
            <div key={msg.id} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: "0 0 0.5rem 0" }}>{msg.emoji} Para: {msg.para || "Alguien especial"}</h4>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>Plantilla: {msg.plantilla}</p>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: "#999" }}>{new Date(msg.created_at).toLocaleDateString()}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <a href={`/${msg.slug}`} target="_blank" rel="noreferrer" style={{ background: "#ff6b8a", color: "#fff", padding: "0.5rem 1rem", borderRadius: "50px", textDecoration: "none", fontSize: "0.9rem" }}>
                  Ver
                </a>
                <a href={`/enviar?slug=${msg.slug}`} style={{ background: "#333", color: "#fff", padding: "0.5rem 1rem", borderRadius: "50px", textDecoration: "none", fontSize: "0.9rem" }}>
                  Compartir
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </PlantillaView>
  );
}

