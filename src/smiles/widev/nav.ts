import type { WiIconoName } from "./icono";

export type WiNavItem = {
  href: string;
  label: string;
  icon: WiIconoName;
};

export const NAV_PUBLICA: WiNavItem[] = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/crear", label: "Crear", icon: "plus" },
  { href: "/ejemplos", label: "Ejemplos", icon: "sparkles" },
  { href: "/acerca", label: "Acerca", icon: "info" },
];

export const NAV_ACCIONES: WiNavItem[] = [
  { href: "/ejemplos", label: "Descubre", icon: "gauge" },
  { href: "/login?modo=reg", label: "Registrar", icon: "userPlus" },
  { href: "/login", label: "Login", icon: "login" },
];

export function esRutaActiva(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.split("?")[0]);
}
