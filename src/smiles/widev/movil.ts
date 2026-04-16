"use client";

import { useEffect } from "react";

export function useBodyClass(clase: string, activo: boolean) {
  useEffect(() => {
    document.body.classList.toggle(clase, activo);
    return () => document.body.classList.remove(clase);
  }, [clase, activo]);
}

export function useCerrarConEscape(activo: boolean, onClose: () => void) {
  useEffect(() => {
    if (!activo) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activo, onClose]);
}
