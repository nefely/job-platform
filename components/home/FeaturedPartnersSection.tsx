"use client";

import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { fetchPartners } from "@/lib/mockApi/partners";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import { useAsync } from "@/hooks/useAsync";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/types/i18n";
import { RetryBlock } from "@/components/shared/RetryBlock";
import { FeaturedPartnersSkeleton } from "./FeaturedPartnersSkeleton";

export function FeaturedPartnersSection() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("home");
  const tJobs = useTranslations("jobs");
  const tLocations = useTranslations("locations");

  const fetchFn = useCallback((signal: AbortSignal) => fetchPartners({ signal }), []);
  const { state, retry } = useAsync(fetchFn, []);

  return (
    <section id="partners" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight">{t("partnersTitle")}</h2>
      <p className="mt-1 text-gray-600 dark:text-gray-300">{t("partnersSubtitle")}</p>

      <div className="mt-6">
        {state.status === "loading" && <FeaturedPartnersSkeleton />}

        {state.status === "error" && (
          <RetryBlock title={tJobs("errorTitle")} message={state.error} onRetry={retry} />
        )}

        {state.status === "success" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.data.map((partner) => (
              <Link
                key={partner.id}
                href={{ pathname: "/partners/[slug]", params: { slug: partner.slug } }}
                className="rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-900"
              >
                <p className="font-semibold">{pickLocalized(partner.name, locale)}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tLocations(partner.locationCode)}
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {pickLocalized(partner.summary, locale)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
