"use client";

import React, { useState, useEffect } from "react";

interface ShareProps {
  titulo: string;
  slug: string;
}

/**
 * COMPONENTE DE COMPARTIR
 * Muestra los botones de redes sociales para cada post.
 */
export default function SharePost({ titulo, slug }: ShareProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const url = mounted ? `${window.location.origin}/${slug}` : "";
  const txt = encodeURIComponent(`${titulo} - AmorWii`);
  const encodedUrl = encodeURIComponent(url);

  const redes = [
    {
      id: "whatsapp",
      ico: "fa-brands fa-whatsapp",
      color: "#25D366",
      link: `https://wa.me/?text=${txt}%20${encodedUrl}`,
      label: "WhatsApp"
    },
    {
      id: "facebook",
      ico: "fa-brands fa-facebook",
      color: "#1877F2",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Facebook"
    },
    {
      id: "twitter",
      ico: "fa-brands fa-x-twitter",
      color: "#000000",
      link: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${txt}`,
      label: "Twitter"
    },
    {
      id: "telegram",
      ico: "fa-brands fa-telegram",
      color: "#0088cc",
      link: `https://t.me/share/url?url=${encodedUrl}&text=${txt}`,
      label: "Telegram"
    }
  ];

  return (
    <div className="po_share_btns">
      {redes.map((r) => (
        <a
          key={r.id}
          href={r.link}
          target="_blank"
          rel="noopener noreferrer"
          className="po_share_btn"
          style={{ "--sc": r.color } as React.CSSProperties}
          title={r.label}
        >
          <i className={r.ico}></i>
        </a>
      ))}
    </div>
  );
}
