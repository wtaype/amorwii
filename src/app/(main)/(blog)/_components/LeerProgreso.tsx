"use client";

import React, { useEffect, useState } from "react";

/**
 * BARRA DE PROGRESO DE LECTURA
 * Muestra cuánto falta para terminar de leer el post.
 */
export default function LeerProgreso() {
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const calcularProgreso = () => {
      const scrollActual = window.scrollY;
      const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (alturaTotal > 0) {
        const porcentaje = (scrollActual / alturaTotal) * 100;
        setProgreso(porcentaje);
      }
    };

    window.addEventListener("scroll", calcularProgreso);
    return () => window.removeEventListener("scroll", calcularProgreso);
  }, []);

  return (
    <div 
      className="po_progress_bar" 
      style={{ width: `${progreso}%` }}
    ></div>
  );
}
