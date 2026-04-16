import type { ReactNode } from "react";

type PlantillaProps = {
  etiqueta: string;
  titulo: string;
  descripcion: string;
  children?: ReactNode;
};

export function PlantillaView({
  etiqueta,
  titulo,
  descripcion,
  children,
}: PlantillaProps) {
  return (
    <section className="wi_page wi_fadeUp wi_visible">
      <div className="wi_hero">
        <span className="wi_tag">{etiqueta}</span>
        <h1>{titulo}</h1>
        <p>{descripcion}</p>
        {children}
      </div>
    </section>
  );
}
