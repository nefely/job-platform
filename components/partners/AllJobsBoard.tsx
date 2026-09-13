"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAsync } from "@/hooks/useAsync";
import { filterJobs, type CategoryFilterValue } from "@/lib/filterJobs";
import { fetchAllJobs } from "@/lib/mockApi/jobs";
import type { AppLocale } from "@/types/i18n";
import { RetryBlock } from "@/components/shared/RetryBlock";
import { CategoryFilter } from "./CategoryFilter";
import { JobList } from "./JobList";
import { JobListSkeleton } from "./JobListSkeleton";
import { JobSearchInput } from "./JobSearchInput";

interface AllJobsBoardProps {
  initialCategory: CategoryFilterValue;
}

// "Знайти роботу" — той самий пошук+фільтр+skeleton/retry, що й
// PartnerJobsBoard, але над агрегованим списком вакансій усіх партнерів
// (fetchAllJobs), а не одного. JobCard сам показує назву партнера, коли
// job.partnerName присутній.
export function AllJobsBoard({ initialCategory }: AllJobsBoardProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("jobs");

  const fetchFn = useCallback((signal: AbortSignal) => fetchAllJobs({ signal }), []);
  const { state, retry } = useAsync(fetchFn, []);

  const [category, setCategory] = useState<CategoryFilterValue>(initialCategory);
  const [debouncedQuery, setDebouncedQuery] = useState("");

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
    <div className="py-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:flex-1">
          <JobSearchInput onDebouncedChange={handleDebouncedQueryChange} />
        </div>
        <CategoryFilter value={category} onChange={handleCategoryChange} />
      </div>

      {state.status === "success" && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {t("resultsCount", { count: filteredJobs.length })}
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
