"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAsync } from "@/hooks/useAsync";
import { filterCandidates, type CandidateFilters } from "@/lib/filterCandidates";
import { fetchCandidates } from "@/lib/mockApi/candidates";
import { resolveErrorMessage } from "@/lib/mockApi/resolveErrorMessage";
import { Pagination } from "@/components/shared/Pagination";
import { RetryBlock } from "@/components/shared/RetryBlock";
import { CandidateFiltersPanel } from "./CandidateFiltersPanel";
import { CandidateList } from "./CandidateList";
import { CandidateListSkeleton } from "./CandidateListSkeleton";
import { CandidateSearchInput } from "./CandidateSearchInput";

const PAGE_SIZE = 12;

// "Знайти працівника" — той самий пошук+фільтр+skeleton/retry+пагінація, що
// й AllJobsBoard, але над кандидатами (fetchCandidates) замість вакансій.
export function CandidatesBoard() {
  const t = useTranslations("candidates");
  const tCommon = useTranslations("common");

  const fetchFn = useCallback((signal: AbortSignal) => fetchCandidates({ signal }), []);
  const { state, retry } = useAsync(fetchFn, []);

  const [filters, setFilters] = useState<CandidateFilters>({});
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleDebouncedQueryChange = useCallback((value: string) => {
    setDebouncedQuery(value);
  }, []);
  const handleFiltersChange = useCallback((next: CandidateFilters) => {
    setFilters(next);
  }, []);

  const filteredCandidates = useMemo(() => {
    const candidates = state.status === "success" ? state.data : [];
    return filterCandidates(candidates, debouncedQuery, filters);
  }, [state, debouncedQuery, filters]);

  // Нові пошук/фільтри завжди повертають на 1-шу сторінку — той самий
  // підхід, що й AllJobsBoard ("коригування стану під час рендеру" замість
  // setState в ефекті).
  const resetKey = `${debouncedQuery}|${JSON.stringify(filters)}`;
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedCandidates = useMemo(
    () => filteredCandidates.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredCandidates, safePage],
  );

  const listTopRef = useRef<HTMLDivElement>(null);
  const handlePageChange = useCallback((next: number) => {
    setPage(next);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="py-8">
      {/* Сторінка дає лише h1 (заголовок); картки кандидатів — h3. Без цього
          h2 скрін-рідери бачили б стрибок рівнів (axe: heading-order). */}
      <h2 className="sr-only">{t("listHeading")}</h2>
      <div className="relative flex flex-wrap items-start gap-x-3 gap-y-1">
        <div className="flex-1">
          <CandidateSearchInput onDebouncedChange={handleDebouncedQueryChange} />
        </div>
        <CandidateFiltersPanel filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {state.status === "success" && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {t("resultsCount", { count: filteredCandidates.length })}
        </p>
      )}

      <div ref={listTopRef} className="mt-4 scroll-mt-4">
        {state.status === "loading" && <CandidateListSkeleton />}
        {state.status === "error" && (
          <RetryBlock
            title={t("errorTitle")}
            message={resolveErrorMessage(state.error, tCommon)}
            onRetry={retry}
          />
        )}
        {state.status === "success" && (
          <>
            <CandidateList candidates={pagedCandidates} />
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              namespace="candidates"
            />
          </>
        )}
      </div>
    </div>
  );
}
