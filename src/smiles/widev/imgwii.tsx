"use client";

import { useEffect, useRef, useState } from "react";

interface ImgWiiProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export function ImgWii({ src, alt, className = "", style, ...props }: ImgWiiProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Modo interacción: Si ya hubo interacción antes, cargar de inmediato
    if (localStorage.getItem("imgwii") === "1") {
      setLoaded(true);
      return;
    }

    const loadImages = () => {
      setLoaded(true);
      localStorage.setItem("imgwii", "1");
      evs.forEach((e) => window.removeEventListener(e, loadImages));
    };

    const evs = ["scroll", "touchstart", "click", "mousemove", "keydown"];

    // Si aún no hay interacción, empezar a escuchar
    evs.forEach((e) => window.addEventListener(e, loadImages, { once: true, passive: true }));

    // Fallback de seguridad: Si pasan 3.5s sin interactuar, se carga sola (para no dejarla invisible siempre)
    const timeout = setTimeout(loadImages, 3500);

    return () => {
      evs.forEach((e) => window.removeEventListener(e, loadImages));
      clearTimeout(timeout);
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={loaded ? src : undefined}
      data-src={src} // Útil para debugging
      alt={alt || ""}
      className={`wi_imgwii ${className}`}
      style={{
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.6s ease",
        ...style,
      }}
      {...props}
    />
  );
}
