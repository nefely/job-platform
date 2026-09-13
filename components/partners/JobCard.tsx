"use client";

import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import type { AppLocale } from "@/types/i18n";
import type { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
}

function JobCardComponent({ job }: JobCardProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("jobs");
  const tLocations = useTranslations("locations");
  const tEmploymentType = useTranslations("employmentType");

  const salaryText =
    job.salaryFrom && job.salaryTo && job.currency
      ? `${job.salaryFrom}–${job.salaryTo} ${job.currency}`
      : t("salaryNotSpecified");

  return (
    <article className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <h3 className="font-semibold">{pickLocalized(job.title, locale)}</h3>
      {job.partnerSlug && job.partnerName && (
        <Link
          href={`/partners/${job.partnerSlug}`}
          className="mt-0.5 inline-block text-sm text-gray-500 hover:underline dark:text-gray-400"
        >
          {pickLocalized(job.partnerName, locale)}
        </Link>
      )}
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {pickLocalized(job.description, locale)}
      </p>
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex gap-1">
          <dt className="font-medium">{t("locationLabel")}:</dt>
          <dd>{tLocations(job.locationCode)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("employmentTypeLabel")}:</dt>
          <dd>{tEmploymentType(job.employmentType)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("salaryLabel")}:</dt>
          <dd>{salaryText}</dd>
        </div>
      </dl>
    </article>
  );
}

// React.memo: filterJobs (Array.prototype.filter, без map/clone) зберігає
// referential identity job-об'єктів, що пройшли фільтр — картка не
// ре-рендериться, якщо саме її job не змінився.
export const JobCard = memo(JobCardComponent);
