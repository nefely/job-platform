import { createClient } from "@/lib/supabase/client";
import type { CategoryId } from "@/types/category";
import type { LocalizedText } from "@/types/i18n";
import type { LocationCode } from "@/types/location";
import type { Partner } from "@/types/partner";
import { ApiError, simulateRequest, type SimulateRequestOptions } from "./simulateRequest";

interface PartnerRow {
  id: string;
  slug: string;
  logo_url: string | null;
  location_code: string;
  categories: string[];
  name: LocalizedText;
  summary: LocalizedText;
}

function mapPartnerRow(row: PartnerRow): Partner {
  return {
    id: row.id,
    slug: row.slug,
    logoUrl: row.logo_url ?? undefined,
    locationCode: row.location_code as LocationCode,
    categories: row.categories as CategoryId[],
    name: row.name,
    summary: row.summary,
  };
}

export function fetchPartners(options: SimulateRequestOptions = {}): Promise<Partner[]> {
  return simulateRequest(async () => {
    const { data, error } = await createClient()
      .from("job_platform_partners")
      .select("id, slug, logo_url, location_code, categories, name, summary")
      .order("name->>uk");

    if (error) {
      throw new ApiError(error.message);
    }

    return (data as PartnerRow[]).map(mapPartnerRow);
  }, options);
}

export function fetchPartnerBySlug(
  slug: string,
  options: SimulateRequestOptions = {},
): Promise<Partner | null> {
  return simulateRequest(async () => {
    const { data, error } = await createClient()
      .from("job_platform_partners")
      .select("id, slug, logo_url, location_code, categories, name, summary")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new ApiError(error.message);
    }

    return data ? mapPartnerRow(data as PartnerRow) : null;
  }, options);
}
