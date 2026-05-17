"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import WiTip from "./WiTip";
import ModalBlog from "./ModalBlog";

interface MarkdownProProps {
  contenido: string;
}

/**
 * Función para generar IDs amigables para los H2 y H3 (SEO y Anclas)
 */
const crearId = (texto: string) => {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
};

export default function MarkdownPro({ contenido }: MarkdownProProps) {
  if (!contenido) return null;

  // Declaramos los componentes fuera del JSX y los forzamos como 'any' 
  // para que TypeScript no llore por nuestras etiquetas inventadas (<witip>, <modal>)
  const customComponents: any = {
    // 1. Títulos con IDs para el Índice (SEO)
    h2: ({ node, children, ...props }: any) => {
      const id = crearId(children?.toString() || "");
      return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ node, children, ...props }: any) => {
      const id = crearId(children?.toString() || "");
      return <h3 id={id} {...props}>{children}</h3>;
    },

    // 2. Imágenes con Lazy Loading
    img: ({ node, src, alt, ...props }: any) => (
      <img src={src} alt={alt || "Imagen del blog"} loading="lazy" {...props} />
    ),

    // 3. Enlaces Inteligentes (Links externos vs Youtube)
    a: ({ node, href, children, ...props }: any) => {
      if (!href) return <a {...props}>{children}</a>;

      // Si es un link de YouTube, lo convertimos en un hermoso botón rojo
      if (href.includes("youtube.com/watch?v=") || href.includes("youtu.be/")) {
        const videoId = href.split("v=")[1]?.split("&")[0] || href.split("youtu.be/")[1]?.split("?")[0];
        return (
          <button
            type="button"
            className="po_yt_btn"
            onClick={() => window.open(href, '_blank')}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              padding: "10px 20px",
              color: "var(--tx)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "bold",
              margin: "10px 0"
            }}
          >
            <i className="fab fa-youtube" style={{ color: "#fe0149", fontSize: "1.4em" }}></i>
            {children || "Ver Video en YouTube"}
          </button>
        );
      }

      // Si es otro enlace externo, lo abrimos en pestaña nueva por seguridad
      const isExternal = href.startsWith("http") && !href.includes("amorwii.com");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },

    // 4. Componentes Customizados (gracias a rehype-raw)
    witip: ({ node, ...props }: any) => <WiTip tipo={props.tipo}>{props.children}</WiTip>,
    modal: ({ node, ...props }: any) => <ModalBlog titulo={props.titulo}>{props.children}</ModalBlog>
  };

  return (
    <div className="po_contenido">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]} // Permite leer HTML dentro del Markdown
        components={customComponents}
      >
        {contenido}
      </ReactMarkdown>
    </div>
  );
}
