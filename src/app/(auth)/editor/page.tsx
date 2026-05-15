import type { Metadata } from "next";
import { PlantillaView } from "@/smiles/plantilla";

export const metadata: Metadata = {
  title: "Panel Editor",
  robots: { index: false, follow: false },
};

export default function EditorPage() {
  return (
    <PlantillaView
      etiqueta="Editor"
      titulo="Panel Editor"
      descripcion="Herramientas de gestión de contenido para editores."
    >
      <div className="wi_btns">
        <span className="wi_btn primary">
          <i className="fas fa-pen-to-square" aria-hidden="true"></i> Panel Editor en construcción
        </span>
      </div>
    </PlantillaView>
  );
}
