"use client";

import { useEffect, useRef } from "react";

type WiVistaOptions = {
  threshold?: number;
  rootMargin?: string;
  className?: string;
  once?: boolean;
};

export function activarWiVista(selector: string, opts: WiVistaOptions = {}) {
  const {
    threshold = 0.12,
    rootMargin = "20px 0px -10% 0px",
    className = "wi_visible",
    once = true,
  } = opts;

  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (!nodes.length) return () => undefined;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const node = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          node.classList.add(className);
          if (once) observer.unobserve(node);
        } else if (!once) {
          node.classList.remove(className);
        }
      });
    },
    { threshold, rootMargin }
  );

  nodes.forEach((node) => observer.observe(node));
  return () => observer.disconnect();
}

export function usarWiVista<T extends HTMLElement>(opts: WiVistaOptions = {}) {
  const ref = useRef<T | null>(null);
  const {
    threshold = 0.12,
    rootMargin = "20px 0px -10% 0px",
    className = "wi_visible",
    once = true,
  } = opts;

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add(className);
            if (once) observer.unobserve(node);
          } else if (!once) {
            node.classList.remove(className);
          }
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [className, once, rootMargin, threshold]);

  return ref;
}

export function activarWiSmart(selector: string = "img.wiSmart") {
  const wiSmartImages = document.querySelectorAll<HTMLImageElement>(selector);
  if (!wiSmartImages.length) return () => undefined;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          img.style.opacity = "1";
        }
        obs.unobserve(img);
      }
    });
  }, { rootMargin: "150px" });

  wiSmartImages.forEach((img) => {
    img.style.opacity = "0";
    img.style.transition = "opacity 0.6s ease";
    observer.observe(img);
  });

  return () => observer.disconnect();
}
