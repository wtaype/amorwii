/**
 * Convierte una fecha ISO a un formato humano legible en español.
 * Ejemplo: "2026-05-16" -> "16 de mayo de 2026"
 */
export function fechaHumana(iso: string) {
    if (!iso) return "";
    const fecha = new Date(iso);
    return fecha.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/**
 * Devuelve el tiempo transcurrido de forma relativa.
 * Ejemplo: "Hace 2 días", "Ayer", "Hoy".
 */
export function haceTiempo(iso: string) {
    if (!iso) return "";
    const fecha = new Date(iso);
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (dias === 0) return "Hoy";
    if (dias === 1) return "Ayer";
    if (dias < 30) return `Hace ${dias} días`;
    
    return fechaHumana(iso);
}

/**
 * Obtiene solo el año de una fecha (útil para el footer).
 */
export function obtenerAnio(iso: string) {
    if (!iso) return new Date().getFullYear();
    return new Date(iso).getFullYear();
}
