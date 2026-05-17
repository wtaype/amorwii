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
    // Buscamos etiquetas h2 y h3 que tengan un ID (generado por conversorMd)
    const regex = /<(h2|h3) id="([^"]+)">([^<]+)<\/\1>/g;
    const matches = [];
    let match;

    while ((match = regex.exec(contenido)) !== null) {
      matches.push({
        nivel: match[1] === "h2" ? 2 : 3,
        id: match[2],
        texto: match[3],
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
