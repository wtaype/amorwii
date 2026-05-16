import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const PLANTILLAS = new Set(["Amor1", "Amor2", "Cumple1"]);

  // 1. Reescribir URLs especiales antes del auth
  if (pathname === "/") {
    const ver = searchParams.get("ver");
    if (ver) {
      return NextResponse.rewrite(new URL(`/ver/${ver}`, request.url));
    }
    const keys = [...searchParams.keys()];
    if (keys.some(k => PLANTILLAS.has(k))) {
      const url = new URL("/largo", request.url);
      url.search = request.nextUrl.search;
      return NextResponse.rewrite(url);
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith('/bienvenida') || request.nextUrl.pathname.startsWith('/perfil');

  if (isAuthRoute && !user) {
    // Si no hay usuario y es ruta privada, rebote a /
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
