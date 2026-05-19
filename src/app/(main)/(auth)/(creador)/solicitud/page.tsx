import { Suspense } from "react";
import SolicitudForm from "./solicitud";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import "../creador.css";

export const metadata = {
  title: "Quiero ser Editor - AmorWii",
  description: "Postúlate para redactar blogs y planificar ideas románticas en AmorWii."
};

export default async function SolicitudPage() {
  // 1. Crear el cliente de Supabase en el servidor leyendo cookies
  const sb = await createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();

  // 2. Si no hay sesión, redirección HTTP 307 instantánea a login
  if (!user) {
    redirect("/login");
  }

  // 3. Obtener el perfil del usuario para validar su rol y precargar el formulario
  const { data: perfil } = await sb
    .from("smiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // 4. Redirecciones inteligentes si ya tiene privilegios superiores
  if (perfil) {
    if (perfil.rol === "editor") {
      redirect("/editor/bienvenido");
    } else if (perfil.rol === "admin" || perfil.rol === "gestor") {
      redirect("/aprobar");
    }
  }

  return (
    <Suspense fallback={
      <div className="creador_container" style={{ minHeight: "60vh" }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "3rem", color: "#FF5C69" }}></i>
          <h3 style={{ color: "#4a5568" }}>Cargando portal de postulación...</h3>
        </div>
      </div>
    }>
      <SolicitudForm perfil={perfil} />
    </Suspense>
  );
}
