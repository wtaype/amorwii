// ── CLIENTE SUPABASE (Browser) ───────────────────────────────────────────────
// Para componentes "use client" — auth, queries, inserts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
