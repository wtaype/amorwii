// ── CLIENTE SUPABASE SERVIDOR ────────────────────────────────────────────────
// Para Server Components y layouts — lee la sesión desde las cookies
// de la request HTTP sin ningún round-trip de red adicional.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
      },
    }
  );
}
