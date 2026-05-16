import React from 'react';
import { CrearForm } from './crear';
import { app } from '@/app/wii';

export const metadata = {
  title: `Crear Mensaje de Amor | ${app}`,
  description: 'Personaliza tu mensaje de amor con música, efectos y diseños únicos.',
};

export default function CrearPage() {
  return (
    <CrearForm />
  );
}
