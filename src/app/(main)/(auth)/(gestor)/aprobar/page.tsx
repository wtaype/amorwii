import { Suspense } from "react";
import AprobarConsole from "./aprobar";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import "../gestor.css";

export const metadata = {
  title: "Consola de Aprobación de Editores - AmorWii",
  description: "Portal administrativo para moderar las solicitudes de Creadores a Editores."
};

export default async function AprobarPage() {
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

  // 4. Guardia de Seguridad Absoluta por Rol: Solo admin y gestor entran aquí
  if (!perfil || (perfil.rol !== "admin" && perfil.rol !== "gestor")) {
    redirect("/"); // Si no es admin ni gestor, lo regresamos al index
  }

  // 5. Cargar todas las solicitudes de la base de datos ordenadas por fecha de creación descendente
  const { data: solicitudes } = await sb
    .from("solicitudes")
    .select("*")
    .order("creado", { ascending: false });

  return (
    <Suspense fallback={
      <div className="gestor_container" style={{ minHeight: "60vh" }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "3rem", color: "#FF5C69" }}></i>
          <h3 style={{ color: "#4a5568" }}>Cargando Consola de Moderación...</h3>
        </div>
      </div>
    }>
      <AprobarConsole solicitudesIniciales={solicitudes || []} perfil={perfil} />
    </Suspense>
  );
}
