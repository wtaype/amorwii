"use client";

import { useState, useEffect, ReactNode } from "react";

/**
 * WiSmart - Componente para carga diferida de elementos no críticos 
 * (espera interacciones del usuario o caché).
 */
export function WiSmart({ children, delay = 0, fallback = null }: { children: ReactNode, delay?: number, fallback?: ReactNode }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("wiSmart")) {
      const timer = setTimeout(() => setActive(true), delay);
      return () => clearTimeout(timer);
    }

    const handler = () => {
      localStorage.setItem("wiSmart", "1");
      setTimeout(() => setActive(true), delay);
      cleanup();
    };

    const events = ["touchstart", "scroll", "click", "mousemove", "keydown"];

    const cleanup = () => {
      events.forEach((event) =>
        document.removeEventListener(event, handler)
      );
    };

    events.forEach((event) =>
      document.addEventListener(event, handler, { once: true, passive: true })
    );

    return cleanup;
  }, [delay]);

  if (!active) return <>{fallback}</>;

  return <>{children}</>;
}
