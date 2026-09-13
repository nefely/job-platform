"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAsync } from "@/hooks/useAsync";
import { filterPartnersByCategory } from "@/lib/filterPartners";
import type { CategoryFilterValue } from "@/lib/filterJobs";
import { fetchPartners } from "@/lib/mockApi/partners";
import { RetryBlock } from "@/components/shared/RetryBlock";
import { CategoryFilter } from "./CategoryFilter";
import { FeaturedPartnersSkeleton } from "@/components/home/FeaturedPartnersSkeleton";
import { PartnerCard } from "./PartnerCard";

interface PartnersIndexBoardProps {
  initialCategory: CategoryFilterValue;
}

export function PartnersIndexBoard({ initialCategory }: PartnersIndexBoardProps) {
  const tIndex = useTranslations("partnersIndex");

  const fetchFn = useCallback((signal: AbortSignal) => fetchPartners({ signal }), []);
  const { state, retry } = useAsync(fetchFn, []);

  const [category, setCategory] = useState<CategoryFilterValue>(initialCategory);
  const handleCategoryChange = useCallback((value: CategoryFilterValue) => {
    setCategory(value);
  }, []);

  const filteredPartners = useMemo(() => {
    const partners = state.status === "success" ? state.data : [];
    return filterPartnersByCategory(partners, category);
  }, [state, category]);

  return (
    <div className="py-8">
      <div className="flex justify-end">
        <CategoryFilter value={category} onChange={handleCategoryChange} />
      </div>

      <div className="mt-4">
        {state.status === "loading" && <FeaturedPartnersSkeleton />}
        {state.status === "error" && (
          <RetryBlock title={tIndex("errorTitle")} message={state.error} onRetry={retry} />
        )}
        {state.status === "success" && filteredPartners.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">{tIndex("emptyState")}</p>
        )}
        {state.status === "success" && filteredPartners.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
