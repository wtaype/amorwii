import type { Metadata } from "next";
import { PlantillaView } from "@/smiles/plantilla";

export const metadata: Metadata = {
  title: "Mis Mensajes",
  robots: { index: false, follow: false },
};

export default function MensajesPage() {
  return (
    <PlantillaView
      etiqueta="Chat"
      titulo="Mis Mensajes"
      descripcion="Tu chat interno estilo WhatsApp. Envía y guarda mensajes privados."
    >
      <div className="wi_btns">
        <span className="wi_btn primary">
          <i className="fas fa-comment-dots" aria-hidden="true"></i> Chat en construcción
        </span>
      </div>
    </PlantillaView>
  );
}
