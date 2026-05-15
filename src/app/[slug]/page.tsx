export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <h1>Perfil de @{slug}</h1>
      <p>Esta es la vista pública que verán tus visitantes.</p>
    </div>
  );
}