"use client";

import React, { useEffect, useState } from "react";

interface ItemIndice {
  id: string;
  texto: string;
  nivel: number;
}

/**
 * TABLA DE CONTENIDOS (Índice Dinámico)
 * Escanea el contenido del post en busca de títulos para crear un índice clicable.
 */
export default function TablaDeContenidos({ contenido }: { contenido: string }) {
  const [items, setItems] = useState<ItemIndice[]>([]);

  useEffect(() => {
    // Buscamos cabeceras ## y ### en el Markdown
    const regex = /^(#{2,3})\s+(.+)$/gm;
    const matches = [];
    let match;

    const crearId = (texto: string) => {
      return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 50);
    };

    while ((match = regex.exec(contenido)) !== null) {
      const nivel = match[1].length; // 2 o 3
      const texto = match[2].trim();
      matches.push({
        nivel,
        id: crearId(texto),
        texto,
      });
    }

    setItems(matches);
  }, [contenido]);

  if (items.length < 2) return null; // No mostrar si hay pocos títulos

  return (
    <nav className="po_toc_box po_fade po_visible">
      <h3 className="po_toc_title">
        <i className="fa-solid fa-list-ul"></i> Contenido de esta historia
      </h3>
      <ul className="po_toc">
        {items.map((item, i) => (
          <li 
            key={i} 
            style={{ paddingLeft: item.nivel === 3 ? "2vh" : "0" }}
          >
            <a href={`#${item.id}`} className="po_toc_link">
              {item.nivel === 3 && <i className="fa-solid fa-angle-right" style={{ fontSize: '0.8em', marginRight: '0.5vh', opacity: 0.5 }}></i>}
              {item.texto}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
