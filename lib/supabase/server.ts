import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase client for use in Server Components (e.g. resolving a partner by
// slug before notFound()). This app has no auth, so cookie writes are just
// harmless no-ops here — kept only to mirror the shared-project convention
// from portfolio/task-manager/src/lib/supabase/server.js.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` is called from a Server Component during rendering,
            // where cookies can't be written. Safe to ignore — this app has
            // no session to keep in sync.
          }
        },
      },
    },
  );
}
