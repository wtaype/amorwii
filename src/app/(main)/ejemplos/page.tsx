import { Ejemplos } from './ejemplos';
import { titulo, app } from '@/app/wii';

export const metadata = {
  title: `Ejemplos de Amor | ${app}`,
  description: `Inspiración y ejemplos de mensajes románticos en ${titulo}`,
};

export default function EjemplosPage() {
  return <Ejemplos />;
}
