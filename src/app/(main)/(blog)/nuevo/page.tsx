import { Suspense } from "react";
import NuevoBlog from "./nuevo";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import "./nuevo.css";

export const metadata = {
  title: "Nuevo Post - AmorWii",
  description: "Crea contenido increíble para la comunidad."
};

export default async function NuevoPostPage() {
  // 1. Crear el cliente de Supabase en el servidor leyendo las cookies de petición
  const sb = await createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();

  // 2. Si no hay sesión iniciada, redirigir instantáneamente a login
  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={
      <div className="nu_wrap dpvc" style={{ minHeight: "60vh", gap: "2vh" }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "3rem", color: "var(--mco)" }}></i>
        <h3>Cargando editor inteligente...</h3>
      </div>
    }>
      <NuevoBlog />
    </Suspense>
  );
}
