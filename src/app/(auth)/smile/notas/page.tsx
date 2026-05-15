import type { Metadata } from "next";
import { PlantillaView } from "@/smiles/plantilla";

export const metadata: Metadata = {
  title: "Mis Notas",
  robots: { index: false, follow: false },
};

export default function NotasPage() {
  return (
    <PlantillaView
      etiqueta="Notas"
      titulo="Mis Notas"
      descripcion="Tus notas personales privadas. Solo tú puedes verlas."
    >
      <div className="wi_btns">
        <span className="wi_btn primary">
          <i className="fas fa-sticky-note" aria-hidden="true"></i> Notas en construcción
        </span>
      </div>
    </PlantillaView>
  );
}
