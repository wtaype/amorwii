export const Saludar = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Buenos dias";
  if (hour >= 12 && hour < 18) return "Buenas tardes";
  return "Buenas noches";
};

export const Capit = (value = "") =>
  value.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());

export const NombreApellido = (full = "") => {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return Capit(full);
  return `${Capit(parts[0])} ${Capit(parts[parts.length - 1])}`;
};

export const fechaHoy = () =>
  new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
