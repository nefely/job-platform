"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAsync } from "@/hooks/useAsync";
import { filterJobs, type CategoryFilterValue } from "@/lib/filterJobs";
import { fetchJobsByPartnerId } from "@/lib/mockApi/jobs";
import type { AppLocale } from "@/types/i18n";
import { RetryBlock } from "@/components/shared/RetryBlock";
import { CategoryFilter } from "./CategoryFilter";
import { JobList } from "./JobList";
import { JobListSkeleton } from "./JobListSkeleton";
import { JobSearchInput } from "./JobSearchInput";

interface PartnerJobsBoardProps {
  partnerId: string;
  initialCategory: CategoryFilterValue;
}

export function PartnerJobsBoard({ partnerId, initialCategory }: PartnerJobsBoardProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("jobs");
  const tPartner = useTranslations("partner");

  const fetchFn = useCallback(
    (signal: AbortSignal) => fetchJobsByPartnerId(partnerId, { signal }),
    [partnerId],
  );
  const { state, retry } = useAsync(fetchFn, [partnerId]);

  const [category, setCategory] = useState<CategoryFilterValue>(initialCategory);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Стабільні callback-и: JobSearchInput/CategoryFilter (обидва memo) не
  // ре-рендеряться через активність цього компонента.
  const handleDebouncedQueryChange = useCallback((value: string) => {
    setDebouncedQuery(value);
  }, []);
  const handleCategoryChange = useCallback((value: CategoryFilterValue) => {
    setCategory(value);
  }, []);

  const filteredJobs = useMemo(() => {
    const jobs = state.status === "success" ? state.data : [];
    return filterJobs(jobs, debouncedQuery, category, locale);
  }, [state, debouncedQuery, category, locale]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h2 className="text-xl font-bold tracking-tight">{tPartner("jobsTitle")}</h2>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="sm:flex-1">
          <JobSearchInput onDebouncedChange={handleDebouncedQueryChange} />
        </div>
        <CategoryFilter value={category} onChange={handleCategoryChange} />
      </div>

      {state.status === "success" && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {tPartner("resultsCount", { count: filteredJobs.length })}
        </p>
      )}

      <div className="mt-4">
        {state.status === "loading" && <JobListSkeleton />}
        {state.status === "error" && (
          <RetryBlock title={t("errorTitle")} message={state.error} onRetry={retry} />
        )}
        {state.status === "success" && <JobList jobs={filteredJobs} />}
      </div>
    </div>
  );
}
