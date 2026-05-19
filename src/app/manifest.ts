import { MetadataRoute } from 'next';
import * as wii from '@/app/wii';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: wii.app,
    short_name: wii.app,
    description: wii.descri,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF5C69',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
