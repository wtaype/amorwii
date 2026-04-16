import { getls, savels } from "./local";
import { FALLBACK_TEMA, WI_TEMA_KEY, WI_TEMAS, type WiTema } from "./temas";

const TEMA_SET = new Set<WiTema>(WI_TEMAS.map((t) => t.nombre));

function normalizarTema(value: unknown): WiTema {
  if (typeof value !== "string") return FALLBACK_TEMA;
  const onlyName = value.includes("|") ? value.split("|")[0] : value;
  if (TEMA_SET.has(onlyName as WiTema)) {
    return onlyName as WiTema;
  }
  return FALLBACK_TEMA;
}

function updateThemeColor(tema: WiTema) {
  if (typeof document === "undefined") return;
  const color = WI_TEMAS.find((t) => t.nombre === tema)?.color ?? "#FF5C69";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", color);
}

export function temaActual(): WiTema {
  return normalizarTema(getls<string>(WI_TEMA_KEY));
}

export function aplicarTema(tema: WiTema) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = tema;
  updateThemeColor(tema);
}

export function cambiarTema(tema: WiTema) {
  const safe = normalizarTema(tema);
  savels(WI_TEMA_KEY, safe, 24 * 365 * 5);
  aplicarTema(safe);
}

export function iniciarTema(): WiTema {
  const tema = temaActual();
  aplicarTema(tema);
  return tema;
}
