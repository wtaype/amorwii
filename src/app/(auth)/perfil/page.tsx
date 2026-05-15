import type { Metadata } from "next";
import { PlantillaView } from "@/smiles/plantilla";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mi Perfil",
  robots: { index: false, follow: false },
};

export default async function PerfilPage() {
  const supa = await supabaseServer();
  const { data: { user } } = await supa.auth.getUser();

  if (!user) {
    return <div>No estás autenticado</div>;
  }

  return (
    <PlantillaView
      etiqueta="Perfil"
      titulo="Mi Perfil"
      descripcion="Gestiona tu cuenta y detalles personales."
    >
      <div style={{ marginTop: "2rem", textAlign: "left", maxWidth: "400px", margin: "2rem auto", background: "#f8f9fa", padding: "2rem", borderRadius: "12px" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>Email</label>
          <input type="text" readOnly value={user.email} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #ccc", background: "#eee" }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>ID de Usuario</label>
          <input type="text" readOnly value={user.id} style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #ccc", background: "#eee", fontSize: "0.8rem" }} />
        </div>
        <div style={{ marginTop: "2rem" }}>
          <form action="/auth/signout" method="post">
            <button type="submit" style={{ width: "100%", background: "#333", color: "white", border: "none", padding: "1rem", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>
    </PlantillaView>
  );
}

