export const WI_TEMA_KEY = "amorwii:witema";

export const WI_TEMAS = [
  { nombre: "Cielo", color: "#0EBEFF" },
  { nombre: "Dulce", color: "#FF5C69" },
  { nombre: "Paz", color: "#29C72E" },
  { nombre: "Oro", color: "#FFDA34" },
  { nombre: "Mora", color: "#7000FF" },
  { nombre: "Futuro", color: "#21273B" },
] as const;

export type WiTema = (typeof WI_TEMAS)[number]["nombre"];

export const FALLBACK_TEMA: WiTema = "Dulce";
