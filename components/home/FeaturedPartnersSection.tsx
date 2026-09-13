"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { fetchPartners } from "@/lib/mockApi/partners";
import { useAsync } from "@/hooks/useAsync";
import { Link } from "@/i18n/navigation";
import { RetryBlock } from "@/components/shared/RetryBlock";
import { PartnerCard } from "@/components/partners/PartnerCard";
import { FeaturedPartnersSkeleton } from "./FeaturedPartnersSkeleton";

export function FeaturedPartnersSection() {
  const t = useTranslations("home");
  const tJobs = useTranslations("jobs");

  const fetchFn = useCallback((signal: AbortSignal) => fetchPartners({ signal }), []);
  const { state, retry } = useAsync(fetchFn, []);

  return (
    <section id="partners" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("partnersTitle")}</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-300">{t("partnersSubtitle")}</p>
        </div>
        <Link
          href="/partners"
          className="shrink-0 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          {t("viewAllPartners")}
        </Link>
      </div>

      <div className="mt-6">
        {state.status === "loading" && <FeaturedPartnersSkeleton />}

        {state.status === "error" && (
          <RetryBlock title={tJobs("errorTitle")} message={state.error} onRetry={retry} />
        )}

        {state.status === "success" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.data.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
