import Link from 'next/link';

export default function Home() {
  return (
    <main className="main-container">
      <div className="hero-section">
        <h1 className="title">Bienvenido a AmorWii ❤️</h1>
        <p className="subtitle">Dios te ama mi amigo siempre!</p>
        <div className="button-group">
          <Link href="/contacto" className="btn-primary">Ir a Contacto</Link>
        </div>
      </div>
    </main>
  );
}
