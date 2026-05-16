"use client";

import React, { useEffect, useRef, useState } from "react";

type ChildProps = {
  className?: string;
  ref?: React.Ref<HTMLElement>;
};

interface ShowiProps {
  children: React.ReactElement<ChildProps>;
  className?: string; // Clase a agregar cuando sea visible (por defecto 'visible')
  threshold?: number; // Qué % del elemento debe verse para animar (0.15 = 15%)
  isStats?: boolean;  // Activa el contador de números (busca .hstat_n dentro del hijo)
}

/**
 * Showi: Componente Pro para animaciones de entrada y contadores.
 * Clona el hijo y le inyecta la clase directamente — sin divs extra.
 * Compatible con Grid, Flex y cualquier layout.
 */
export default function Showi({
  children,
  className = "visible",
  threshold = 0.15,
  isStats = false,
}: ShowiProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

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
  }, [threshold, isStats]); // eslint-disable-line react-hooks/exhaustive-deps

  return React.cloneElement(children, {
    ref,
    className: [children.props.className, !isStats && isVisible ? className : ""]
      .filter(Boolean)
      .join(" "),
  });
}
