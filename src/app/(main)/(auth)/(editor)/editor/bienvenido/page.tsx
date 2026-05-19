import { Suspense } from "react";
import BienvenidoConsole from "./bienvenido";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import "../../editor.css";

export const metadata = {
  title: "Panel del Editor - AmorWii",
  description: "Bienvenido al portal oficial de redactores de AmorWii."
};

export default async function EditorBienvenidoPage() {
  // 1. Crear el cliente de Supabase en el servidor leyendo cookies
  const sb = await createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();

  // 2. Si no hay sesión, redirección HTTP 307 instantánea a login
  if (!user) {
    redirect("/login");
  }

  // 3. Obtener el perfil del usuario para validar su rol
  const { data: perfil } = await sb
    .from("smiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // 4. Guardia de Seguridad Absoluta por Rol: Solo editores, gestores o administradores entran aquí
  if (!perfil || (perfil.rol !== "editor" && perfil.rol !== "gestor" && perfil.rol !== "admin")) {
    redirect("/"); // Si no posee el rol adecuado, lo regresamos a la raíz
  }

  return (
    <Suspense fallback={
      <div className="editor_container" style={{ minHeight: "60vh" }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "3rem", color: "#FF5C69" }}></i>
          <h3 style={{ color: "#4a5568" }}>Cargando Panel del Editor...</h3>
        </div>
      </div>
    }>
      <BienvenidoConsole perfil={perfil} />
    </Suspense>
  );
}
