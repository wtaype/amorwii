import type { Metadata } from "next";
import Link from "next/link";
import { app, linkweb } from "@/smiles/wii";

export const metadata: Metadata = {
  title: `Enlace Listo | ${app}`,
  description: `Tu mensaje de amor está listo para compartir. Copia el enlace secreto o descarga el código QR con ${app}.`,
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EnviarPage({ searchParams }: Props) {
  const params = await searchParams;
  const slug = typeof params.slug === "string" ? params.slug : "";

  if (!slug) {
    return (
      <p style={{ textAlign: "center", color: "var(--tx3)", padding: "4vh" }}>
        No se encontró ningún mensaje. <Link href="/crear" style={{ color: "var(--mco)", fontWeight: 700 }}>Crea uno aquí</Link>.
      </p>
    );
  }

  const url = slug.startsWith("ver/") ? `${linkweb}/${slug}` : `${linkweb}/${slug}`;

  return (
    <section className="wi_page">
      <div className="wi_hero">
        <span className="wi_tag"><i className="fas fa-paper-plane" aria-hidden="true"></i> Enviar</span>
        <h1>Tu mensaje esta listo</h1>
        <p>Comparte este enlace por WhatsApp, Telegram o donde prefieras.</p>
        <div className="cr_url_box" style={{ maxWidth: 720, margin: "2vh auto 0" }}>
          <input readOnly value={url} />
          <Link href={url} target="_blank" rel="noreferrer" className="cr_ubtn">
            <i className="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </Link>
        </div>
        <div className="wi_btns">
          <Link href={`https://wa.me/?text=${encodeURIComponent(`Mensaje especial: ${url}`)}`} target="_blank" className="wi_btn primary">
            <i className="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp
          </Link>
          <Link href="/crear" className="wi_btn secondary">
            <i className="fas fa-plus" aria-hidden="true"></i> Crear otro
          </Link>
        </div>
      </div>
    </section>
  );
}
