"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAsync } from "@/hooks/useAsync";
import { filterJobs, type CategoryFilterValue, type JobFilters } from "@/lib/filterJobs";
import { fetchAllJobs } from "@/lib/mockApi/jobs";
import { resolveErrorMessage } from "@/lib/mockApi/resolveErrorMessage";
import type { AppLocale } from "@/types/i18n";
import { Pagination } from "@/components/shared/Pagination";
import { RetryBlock } from "@/components/shared/RetryBlock";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { JobList } from "./JobList";
import { JobListSkeleton } from "./JobListSkeleton";
import { JobSearchInput } from "./JobSearchInput";

interface AllJobsBoardProps {
  initialCategory: CategoryFilterValue;
}

const PAGE_SIZE = 12;

// "Знайти роботу" — той самий пошук+фільтр+skeleton/retry, що й
// PartnerJobsBoard, але над агрегованим списком вакансій усіх партнерів
// (fetchAllJobs), а не одного. JobCard сам показує назву партнера, коли
// job.partnerName присутній.
export function AllJobsBoard({ initialCategory }: AllJobsBoardProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("jobs");
  const tCommon = useTranslations("common");

  const fetchFn = useCallback((signal: AbortSignal) => fetchAllJobs({ signal }), []);
  const { state, retry } = useAsync(fetchFn, []);

  const [filters, setFilters] = useState<JobFilters>(() =>
    initialCategory === "all" ? {} : { categories: [initialCategory] },
  );

  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleDebouncedQueryChange = useCallback((value: string) => {
    setDebouncedQuery(value);
  }, []);
  const handleFiltersChange = useCallback((next: JobFilters) => {
    setFilters(next);
  }, []);

  const filteredJobs = useMemo(() => {
    const jobs = state.status === "success" ? state.data : [];
    return filterJobs(jobs, debouncedQuery, locale, filters);
  }, [state, debouncedQuery, locale, filters]);

  // Нові пошук/фільтри завжди повертають на 1-шу сторінку — інакше можна
  // лишитись на сторінці, якої після звуження результатів уже нема.
  // "Коригування стану під час рендеру" (react.dev) замість setState в
  // ефекті (react-hooks/set-state-in-effect) — той самий підхід, що й
  // requestKey у useAsync.ts.
  const resetKey = `${debouncedQuery}|${JSON.stringify(filters)}`;
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  // Захист від застарілої сторінки (напр. якщо filteredJobs зменшився між
  // рендерами до того, як спрацював ефект вище) — ніколи не сплайсимо поза
  // межами масиву.
  const safePage = Math.min(page, totalPages);
  const pagedJobs = useMemo(
    () => filteredJobs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredJobs, safePage],
  );

  const listTopRef = useRef<HTMLDivElement>(null);
  const handlePageChange = useCallback((next: number) => {
    setPage(next);
    // Без цього після переходу на нову сторінку користувач лишався б
    // прокрученим униз, до кнопок пагінації, і бачив хвіст попередньої
    // сторінки замість першої вакансії нової.
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="py-8">
      <div className="relative flex flex-wrap items-start gap-x-3 gap-y-1">
        <div className="flex-1">
          <JobSearchInput onDebouncedChange={handleDebouncedQueryChange} />
        </div>
        <JobFiltersPanel filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {state.status === "success" && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {t("resultsCount", { count: filteredJobs.length })}
        </p>
      )}

      <div ref={listTopRef} className="mt-4 scroll-mt-4">
        {state.status === "loading" && <JobListSkeleton />}
        {state.status === "error" && (
          <RetryBlock
            title={t("errorTitle")}
            message={resolveErrorMessage(state.error, tCommon)}
            onRetry={retry}
          />
        )}
        {state.status === "success" && (
          <>
            <JobList jobs={pagedJobs} />
            <Pagination page={safePage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}
