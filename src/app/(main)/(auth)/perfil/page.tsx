import { createSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Perfil from "./perfil"; // Importamos el componente que acabamos de crear

export const metadata = {
  title: "Mi Perfil | AmorWii",
  description: "Configura tu perfil en AmorWii",
};

export default async function PerfilPage() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: perfil } = await supabase
    .from("smiles")
    .select("*")
    .eq("email", user.email || "")
    .maybeSingle();

  if (!perfil) {
    redirect("/login");
  }

  return (
    <div>
      <Perfil perfilInicial={perfil} />
    </div>
  );
}
