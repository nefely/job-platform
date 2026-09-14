import { createClient } from "@/lib/supabase/client";
import type { CategoryId } from "@/types/category";
import type { Candidate, CandidateLanguage } from "@/types/candidate";
import type { Currency, EmploymentType, ExperienceLevel, WorkFormat } from "@/types/job";
import type { AppLocale } from "@/types/i18n";
import type { LocationCode } from "@/types/location";
import { ApiError, simulateRequest, type SimulateRequestOptions } from "./simulateRequest";

const CANDIDATE_COLUMNS =
  "id, slug, name, avatar_url, categories, headline, profile_locale, location_code, desired_employment_types, desired_work_formats, experience_level, languages, skills, about, salary_expectation_from, currency, available_from, updated_at";

interface CandidateRow {
  id: string;
  slug: string;
  name: string;
  avatar_url: string | null;
  categories: string[];
  headline: string;
  profile_locale: string;
  location_code: string;
  desired_employment_types: string[];
  desired_work_formats: string[];
  experience_level: string;
  languages: CandidateLanguage[];
  skills: string[];
  about: string | null;
  salary_expectation_from: number | null;
  currency: string | null;
  available_from: string | null;
  updated_at: string;
}

function mapCandidateRow(row: CandidateRow): Candidate {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    avatarUrl: row.avatar_url ?? undefined,
    categories: row.categories as CategoryId[],
    headline: row.headline,
    profileLocale: row.profile_locale as AppLocale,
    locationCode: row.location_code as LocationCode,
    desiredEmploymentTypes: row.desired_employment_types as EmploymentType[],
    desiredWorkFormats: row.desired_work_formats as WorkFormat[],
    experienceLevel: row.experience_level as ExperienceLevel,
    languages: row.languages,
    skills: row.skills,
    about: row.about ?? undefined,
    salaryExpectationFrom: row.salary_expectation_from ?? undefined,
    currency: (row.currency as Currency | null) ?? undefined,
    availableFrom: row.available_from ?? undefined,
    updatedAt: row.updated_at,
  };
}

export function fetchCandidates(options: SimulateRequestOptions = {}): Promise<Candidate[]> {
  return simulateRequest(async () => {
    const { data, error } = await createClient()
      .from("job_platform_candidates")
      .select(CANDIDATE_COLUMNS)
      .order("updated_at", { ascending: false });

    if (error) {
      throw new ApiError(error.message);
    }

    return (data as CandidateRow[]).map(mapCandidateRow);
  }, options);
}

export function fetchCandidateBySlug(
  slug: string,
  options: SimulateRequestOptions = {},
): Promise<Candidate | null> {
  return simulateRequest(async () => {
    const { data, error } = await createClient()
      .from("job_platform_candidates")
      .select(CANDIDATE_COLUMNS)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new ApiError(error.message);
    }

    return data ? mapCandidateRow(data as CandidateRow) : null;
  }, options);
}
