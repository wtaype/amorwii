import { createSupabaseServer } from "@/lib/supabaseServer";
import Saludo from "@/components/Saludo";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Bienvenida | AmorWii",
  description: "Tu dashboard personal en AmorWii",
};

export default async function BienvenidaPage() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: perfil } = await supabase
    .from("smiles")
    .select("*")
    .eq("email", user.email || "")
    .maybeSingle();

  if (!perfil) redirect("/login");

  return (
    <div style={{ padding: '40px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="wilg_bienvenida" style={{
        padding: '25px',
        background: 'var(--wb)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        border: '1px solid var(--wbor)'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: 'var(--fz_h2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {perfil.avatar ? (
            <img src={perfil.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          ) : (
            <img src="/smile.avif" alt="Smile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          )}
          <Saludo nombre={perfil.nombre} />
        </h2>
        <p style={{ margin: '0 0 20px 0', color: 'var(--ws)', lineHeight: '1.5' }}>
          Qué alegría verte de nuevo. Tu cuenta como <strong>{perfil.rol}</strong> está <strong>{perfil.estado}</strong> y activa. ¿Qué magia vamos a crear hoy?
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href={`/${perfil.usuario}`} className="wilg_btn" style={{ padding: '10px 20px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
            <i className="fas fa-user-circle" /> Mi perfil
          </a>
          <a href="/crear" className="wilg_btn" style={{ background: 'var(--wt)', color: '#fff', padding: '10px 20px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
            <i className="fas fa-plus" /> Crear Mensaje
          </a>
        </div>
      </div>
    </div>
  );
}
