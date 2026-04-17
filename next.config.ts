import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compresión gzip/brotli automática de todos los assets
  compress: true,

  // SWC compiler optimizations
  compiler: {
    // Elimina todos los console.log/warn/error en producción
    removeConsole: true,
  },

  // Headers de caché para assets estáticos (Vercel los aplica automáticamente)
  async headers() {
    return [
      {
        // Fonts, imágenes, JS y CSS → caché 1 año (immutable porque Next les pone hash)
        source: "/:all*(woff2|woff|ttf|otf|png|jpg|jpeg|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Chunks JS/CSS de Next.js → caché 1 año (tienen hash en el nombre)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
