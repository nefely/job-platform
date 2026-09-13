import { createBrowserClient } from "@supabase/ssr";

// Браузерний Supabase-клієнт для 'use client'-компонентів. Той самий
// спільний Supabase-проєкт, що й portfolio/task-manager (див.
// lib/supabase/server.ts і .env.local).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
