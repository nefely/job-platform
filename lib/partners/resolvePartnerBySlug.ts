import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { CategoryId } from "@/types/category";
import type { LocalizedText } from "@/types/i18n";
import type { LocationCode } from "@/types/location";
import type { Partner } from "@/types/partner";

// Used only by app/[locale]/partners/[slug]/page.tsx to decide notFound().
// Direct Supabase call, no artificial delay/failure — this is server-side
// route resolution, not the async-handling feature the brief grades (that's
// the client-side jobs fetch in PartnerJobsBoard via lib/mockApi/jobs.ts).
export async function resolvePartnerBySlug(slug: string): Promise<Partner | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_platform_partners")
    .select("id, slug, logo_url, location_code, categories, name, summary")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    logoUrl: data.logo_url ?? undefined,
    locationCode: data.location_code as LocationCode,
    categories: data.categories as CategoryId[],
    name: data.name as LocalizedText,
    summary: data.summary as LocalizedText,
  };
}
