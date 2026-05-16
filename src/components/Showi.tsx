"use client";

import React, { useEffect, useRef, useState } from "react";

interface ShowiProps {
  children: React.ReactElement; // Tiene que ser un único elemento (div, Link, etc.)
  className?: string; // Clase a agregar (por defecto 'visible')
  threshold?: number; // Cuánto debe verse antes de animar
  isStats?: boolean; // Propiedad especial para animar los números (hstat_n)
}

/**
 * Showi: Componente Pro para animaciones de entrada y contadores.
 * NO genera un div extra. Clona el elemento hijo y le inyecta la clase directamente.
 */
export default function Showi({ children, className = "visible", threshold = 0.15, isStats = false }: ShowiProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          if (ref.current) {
            // Lógica para animar contadores de estadísticas si isStats es true
            if (isStats) {
              ref.current.querySelectorAll('.hstat_n').forEach((el) => {
                const node = el as HTMLElement;
                const t = parseInt(node.getAttribute('data-target') || '0', 10);
                const step = Math.ceil(t / 40);
                let c = 0;
                const iv = setInterval(() => {
                  c = Math.min(c + step, t);
                  node.textContent = c < t ? Math.floor(c).toString() : t + '+';
                  if (c >= t) clearInterval(iv);
                }, 30);
              });
            }
            observer.unobserve(ref.current); // Solo una vez
          }
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, isStats]);

  // Clonamos el elemento original pasándole la referencia y concatenando la nueva clase
  return React.cloneElement(children, {
    // @ts-expect-error ignoramos tipado estricto del ref para máxima compatibilidad
    ref: ref,
    className: `${children.props.className || ""} ${isVisible && !isStats ? className : ""}`.trim()
  });
}
