import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { CategoryId } from "@/types/category";
import type { Candidate, CandidateLanguage } from "@/types/candidate";
import type { Currency, EmploymentType, ExperienceLevel, WorkFormat } from "@/types/job";
import type { AppLocale } from "@/types/i18n";
import type { LocationCode } from "@/types/location";

const CANDIDATE_COLUMNS =
  "id, slug, name, avatar_url, categories, headline, profile_locale, location_code, desired_employment_types, desired_work_formats, experience_level, languages, skills, about, salary_expectation_from, currency, available_from, updated_at";

// Used only by app/[locale]/candidates/[slug]/page.tsx to decide
// notFound(). Direct Supabase call, no artificial delay/failure — mirrors
// lib/partners/resolvePartnerBySlug.ts (server-side route resolution, not
// the async-handling feature the brief grades).
export async function resolveCandidateBySlug(slug: string): Promise<Candidate | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_platform_candidates")
    .select(CANDIDATE_COLUMNS)
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
    name: data.name,
    avatarUrl: data.avatar_url ?? undefined,
    categories: data.categories as CategoryId[],
    headline: data.headline,
    profileLocale: data.profile_locale as AppLocale,
    locationCode: data.location_code as LocationCode,
    desiredEmploymentTypes: data.desired_employment_types as EmploymentType[],
    desiredWorkFormats: data.desired_work_formats as WorkFormat[],
    experienceLevel: data.experience_level as ExperienceLevel,
    languages: data.languages as CandidateLanguage[],
    skills: data.skills as string[],
    about: data.about ?? undefined,
    salaryExpectationFrom: data.salary_expectation_from ?? undefined,
    currency: (data.currency as Currency | null) ?? undefined,
    availableFrom: data.available_from ?? undefined,
    updatedAt: data.updated_at,
  };
}
