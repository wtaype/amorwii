import { PlantillaView } from "@/smiles/plantilla";

export default function AdminPage() {
  return (
    <PlantillaView
      etiqueta="Admin"
      titulo="Panel Admin"
      descripcion="Zona privada para gestion global. Luego conectamos control de rol con Supabase."
    />
  );
}
