import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * API ROUTE: REVALIDACIÓN DE CACHÉ BAJO DEMANDA
 * Permite purgar la caché de rutas específicas (ej: '/' para todo, o '/[slug]') desde el cliente.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "/";

  try {
    revalidatePath(path, "layout");
    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
