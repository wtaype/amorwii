import React from 'react';
import { CrearForm } from './crear';
import { seopages } from '@/app/seopages';

export const metadata = seopages.crear;

export default function CrearPage() {
  return (
    <CrearForm />
  );
}
