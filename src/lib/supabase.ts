// ── CLIENTE SUPABASE (Browser) ───────────────────────────────────────────────
// Para componentes "use client" — auth, queries, inserts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
