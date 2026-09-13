import { createClient } from "@/lib/supabase/client";
import type { CategoryId } from "@/types/category";
import type { Currency, EmploymentType, Job } from "@/types/job";
import type { LocalizedText } from "@/types/i18n";
import type { LocationCode } from "@/types/location";
import { ApiError, simulateRequest, type SimulateRequestOptions } from "./simulateRequest";

interface JobRow {
  id: string;
  partner_id: string;
  category: string;
  location_code: string;
  employment_type: string;
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
    partnerId: row.partner_id,
    category: row.category as CategoryId,
    locationCode: row.location_code as LocationCode,
    employmentType: row.employment_type as EmploymentType,
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
      .select(
        "id, partner_id, category, location_code, employment_type, salary_from, salary_to, currency, title, description, posted_at",
      )
      .eq("partner_id", partnerId)
      .order("posted_at", { ascending: false });

    if (error) {
      throw new ApiError(error.message);
    }

    return (data as JobRow[]).map(mapJobRow);
  }, options);
}
