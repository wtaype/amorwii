import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Contacto | AmorWii',
  description: 'Página de contacto de AmorWii',
};

export default function ContactoPage() {
  return (
    <main style={{ padding: '3rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ff4d4d' }}>
        📞 Contáctanos
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>
        ¡Bienvenido a la página de contacto de AmorWii! <br />
        Acabas de crear esta ruta simplemente agregando una carpeta y un archivo. Así de poderosa es la magia del App Router de Next.js.
      </p>

      <div style={{ padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px solid #ddd' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Escríbenos</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Tu nombre"
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <textarea
            placeholder="Tu mensaje"
            rows={4}
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
          />
          <button
            type="button"
            style={{
              padding: '1rem',
              backgroundColor: '#ff4d4d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Enviar Mensaje
          </button>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link href="/" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
