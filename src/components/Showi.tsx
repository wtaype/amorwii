"use client";

import React, { useEffect, useRef } from "react";

interface ShowiProps {
  children: React.ReactNode;
  className?: string; // Clase a agregar cuando sea visible (por defecto 'visible')
  threshold?: number; // Qué % del elemento debe verse para animar (0.15 = 15%)
  isStats?: boolean;  // Activa el contador de números (busca .hstat_n dentro del hijo)
}

/**
 * Showi: Componente Pro para animaciones de entrada y contadores.
 * Funciona perfectamente con Server Components (RSC) mediante manipulación del DOM
 * sin requerir un div envoltura.
 */
export default function Showi({
  children,
  className = "visible",
  threshold = 0.15,
  isStats = false,
}: ShowiProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Al ser children un Server Component opaco, no podemos usar cloneElement.
    // Usamos el DOM hermano para aplicar las clases directamente.
    const el = ref.current?.nextElementSibling as HTMLElement;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animación regular
          if (!isStats && className) {
            el.classList.add(...className.split(" "));
          }

          // Animar contadores si isStats está activo
          if (isStats) {
            el.querySelectorAll(".hstat_n").forEach((node) => {
              const n = node as HTMLElement;
              const target = parseInt(n.getAttribute("data-target") || "0", 10);
              const step = Math.ceil(target / 40);
              let current = 0;
              const iv = setInterval(() => {
                current = Math.min(current + step, target);
                n.textContent = current < target ? String(Math.floor(current)) : target + "+";
                if (current >= target) clearInterval(iv);
              }, 30);
            });
          }

          observer.unobserve(el); // Solo una vez
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, isStats, className]);

  return (
    <>
      <span ref={ref} style={{ display: "none" }} />
      {children}
    </>
  );
}
