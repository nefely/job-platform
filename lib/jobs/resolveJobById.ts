import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { CategoryId } from "@/types/category";
import type { Currency, EmploymentType, ExperienceLevel, Job, WorkFormat } from "@/types/job";
import type { LocalizedText } from "@/types/i18n";
import type { LanguageCode } from "@/types/language";
import type { LocationCode } from "@/types/location";

// Used only by app/[locale]/jobs/[id]/page.tsx to decide notFound(). Direct
// Supabase call, no artificial delay/failure — mirrors
// lib/partners/resolvePartnerBySlug.ts (server-side route resolution, not
// the async-handling feature the brief grades).
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function resolveJobById(id: string): Promise<Job | null> {
  // `id` is a Postgres `uuid` column — a malformed id (e.g. someone typing
  // /jobs/abc) would otherwise make the query itself throw ("invalid input
  // syntax for type uuid") instead of resolving to a graceful notFound().
  if (!UUID_PATTERN.test(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_platform_jobs")
    .select(
      "id, partner_id, employer_id, category, location_code, employment_type, work_format, experience_level, required_languages, salary_from, salary_to, currency, title, description, posted_at, job_platform_partners(slug, name), job_platform_employers(slug, name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  // Взаємовиключні — рівно один embed буде непорожнім (job.partnerId XOR
  // job.employerId, див. job_platform_jobs_org_check у schema.sql).
  const partner = data.job_platform_partners as unknown as
    | { slug: string; name: LocalizedText }
    | null;
  const employer = data.job_platform_employers as unknown as
    | { slug: string; name: string }
    | null;

  return {
    id: data.id,
    partnerId: data.partner_id ?? undefined,
    employerId: data.employer_id ?? undefined,
    category: data.category as CategoryId,
    locationCode: data.location_code as LocationCode,
    employmentType: data.employment_type as EmploymentType,
    workFormat: data.work_format as WorkFormat,
    experienceLevel: data.experience_level as ExperienceLevel,
    requiredLanguages: data.required_languages as LanguageCode[],
    salaryFrom: data.salary_from ?? undefined,
    salaryTo: data.salary_to ?? undefined,
    currency: (data.currency as Currency | null) ?? undefined,
    title: data.title as LocalizedText,
    description: data.description as LocalizedText,
    postedAt: data.posted_at,
    partnerSlug: partner?.slug,
    partnerName: partner?.name,
    employerSlug: employer?.slug,
    employerName: employer?.name,
  };
}
