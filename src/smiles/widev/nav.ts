export type WiNavItem = {
  href: string;
  label: string;
  icon: string; // clase FA: "fa-heart", "fa-plus", etc
};

export const NAV_PUBLICA: WiNavItem[] = [
  { href: "/", label: "Inicio", icon: "fa-house" },
  { href: "/crear", label: "Crear", icon: "fa-circle-plus" },
  { href: "/plantillas", label: "Plantillas", icon: "fa-layer-group" },
  { href: "/ejemplos", label: "Ejemplos", icon: "fa-wand-magic-sparkles" },
  { href: "/acerca", label: "Acerca", icon: "fa-circle-info" },
];

export const NAV_ACCIONES: WiNavItem[] = [
  { href: "/descubre", label: "Descubre", icon: "fa-gauge" },
  { href: "/login?modo=reg", label: "Registrar", icon: "fa-user-plus" },
  { href: "/login", label: "Login", icon: "fa-sign-in-alt" },
];

export function esRutaActiva(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.split("?")[0]);
}
