import { createClient } from "@/lib/supabase/client";
import type { CategoryId } from "@/types/category";
import type { Currency, EmploymentType, ExperienceLevel, Job, WorkFormat } from "@/types/job";
import type { LocalizedText } from "@/types/i18n";
import type { LanguageCode } from "@/types/language";
import type { LocationCode } from "@/types/location";
import { ApiError, simulateRequest, type SimulateRequestOptions } from "./simulateRequest";

const JOB_COLUMNS =
  "id, partner_id, employer_id, category, location_code, employment_type, work_format, experience_level, required_languages, salary_from, salary_to, currency, title, description, posted_at";

interface JobRow {
  id: string;
  // Взаємовиключні — вакансія належить АБО партнеру, АБО прямому
  // роботодавцю (не всі роботодавці є партнерами). Рівно одне заповнене.
  partner_id: string | null;
  employer_id: string | null;
  category: string;
  location_code: string;
  employment_type: string;
  work_format: string;
  experience_level: string;
  required_languages: string[];
  salary_from: number | null;
  salary_to: number | null;
  currency: string | null;
  title: LocalizedText;
  description: LocalizedText;
  posted_at: string;
}

function mapJobRow(row: JobRow): Job {
  return {
    id: row.id,
    partnerId: row.partner_id ?? undefined,
    employerId: row.employer_id ?? undefined,
    category: row.category as CategoryId,
    locationCode: row.location_code as LocationCode,
    employmentType: row.employment_type as EmploymentType,
    workFormat: row.work_format as WorkFormat,
    experienceLevel: row.experience_level as ExperienceLevel,
    requiredLanguages: row.required_languages as LanguageCode[],
    salaryFrom: row.salary_from ?? undefined,
    salaryTo: row.salary_to ?? undefined,
    currency: (row.currency as Currency | null) ?? undefined,
    title: row.title,
    description: row.description,
    postedAt: row.posted_at,
  };
}

export function fetchJobsByPartnerId(
  partnerId: string,
  options: SimulateRequestOptions = {},
): Promise<Job[]> {
  return simulateRequest(async () => {
    const { data, error } = await createClient()
      .from("job_platform_jobs")
      .select(JOB_COLUMNS)
      .eq("partner_id", partnerId)
      .order("posted_at", { ascending: false });

    if (error) {
      throw new ApiError(error.message);
    }

    return (data as JobRow[]).map(mapJobRow);
  }, options);
}

interface JobRowWithOrg extends JobRow {
  job_platform_partners: { slug: string; name: LocalizedText } | null;
  job_platform_employers: { slug: string; name: string } | null;
}

// Агрегований список усіх вакансій (усіх партнерів і прямих роботодавців
// разом) — це і є "Знайти роботу": кандидат шукає роботу передусім за
// посадою/категорією, а не за конкретною компанією. PostgREST embedded
// select через FK job_platform_jobs.partner_id/employer_id — обидва
// nullable, тож для кожного рядка рівно один embed буде непорожнім (див.
// job_platform_jobs_org_check у schema.sql).
export function fetchAllJobs(options: SimulateRequestOptions = {}): Promise<Job[]> {
  return simulateRequest(async () => {
    const { data, error } = await createClient()
      .from("job_platform_jobs")
      .select(
        `${JOB_COLUMNS}, job_platform_partners(slug, name), job_platform_employers(slug, name)`,
      )
      .order("posted_at", { ascending: false });

    if (error) {
      throw new ApiError(error.message);
    }

    return (data as unknown as JobRowWithOrg[]).map((row) => ({
      ...mapJobRow(row),
      partnerSlug: row.job_platform_partners?.slug,
      partnerName: row.job_platform_partners?.name,
      employerSlug: row.job_platform_employers?.slug,
      employerName: row.job_platform_employers?.name,
    }));
  }, options);
}
