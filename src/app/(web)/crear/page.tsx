import type { Metadata } from "next";
import { app } from "@/smiles/wii";
import { CrearForm } from "@/smiles/crear/crear";

export const metadata: Metadata = {
  title: `Crear Mensaje de Amor | ${app}`,
  description: `Crea tu mensaje de amor personalizado con ${app}. Elige plantilla, escribe tu dedicatoria y comparte un enlace único. 100% gratis.`,
};

export default function CrearPage() {
  return <CrearForm />;
}
