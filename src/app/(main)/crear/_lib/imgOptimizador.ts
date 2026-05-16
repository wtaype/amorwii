import imageCompression from 'browser-image-compression';

/**
 * Comprime una imagen para optimizar su peso antes de subirla a Supabase.
 * Devuelve el archivo comprimido en formato WebP.
 */
export async function optimizarImagen(file: File): Promise<File | null> {
    if (file.size > 5 * 1024 * 1024) {
        alert("La imagen es muy pesada (Máx 5MB para optimizar).");
        return null;
    }

    try {
        const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.15, // ~150KB
            maxWidthOrHeight: 1080,
            useWebWorker: true,
            fileType: 'image/webp',
        });

        console.log(`Original: ${(file.size / 1024).toFixed(2)} KB`);
        console.log(`Comprimida: ${(compressedFile.size / 1024).toFixed(2)} KB`);

        return compressedFile;
    } catch (error) {
        console.error("Error comprimiendo imagen:", error);
        alert("Hubo un error al procesar la imagen.");
        return null;
    }
}
