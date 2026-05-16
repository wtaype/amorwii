import { Plantillas } from './plantillas';
import { titulo, app } from '@/app/wii';

export const metadata = {
  title: `Plantillas | ${app}`,
  description: `Elige una plantilla romántica en ${titulo}`,
};

export default function PlantillasPage() {
  return <Plantillas />;
}
