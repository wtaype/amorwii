import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/** Refresh session en cada request — usado por middleware.ts */
export async function updateSession(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const supa = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          for (const { name, value, options } of cookiesToSet) {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const { data: { user } } = await supa.auth.getUser();

  // Rutas protegidas — redirigir a login si no hay sesión
  const path = req.nextUrl.pathname;
  const protegidas = ["/smile", "/perfil", "/editor", "/admin"];
  const esProtegida = protegidas.some((r) => path.startsWith(r));

  if (esProtegida && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}
