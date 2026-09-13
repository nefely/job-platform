import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import type { AppLocale } from "@/types/i18n";
import type { Job } from "@/types/job";

interface JobDetailViewProps {
  job: Job;
}

export async function JobDetailView({ job }: JobDetailViewProps) {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("jobs");
  const tLocations = await getTranslations("locations");
  const tEmploymentType = await getTranslations("employmentType");
  const tWorkFormat = await getTranslations("workFormat");
  const tExperienceLevel = await getTranslations("experienceLevel");
  const tLanguages = await getTranslations("languages");

  const salaryText =
    job.salaryFrom && job.salaryTo && job.currency
      ? `${job.salaryFrom}–${job.salaryTo} ${job.currency}`
      : t("salaryNotSpecified");

  const postedDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(job.postedAt),
  );

  return (
    <div>
      <Link
        href="/jobs"
        className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        {t("backLink")}
      </Link>

      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        {pickLocalized(job.title, locale)}
      </h1>

      {job.partnerSlug && job.partnerName && (
        <Link
          href={`/partners/${job.partnerSlug}`}
          className="mt-1 inline-block text-gray-600 hover:underline dark:text-gray-300"
        >
          {pickLocalized(job.partnerName, locale)}
        </Link>
      )}

      <dl className="mt-4 flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex gap-1">
          <dt className="font-medium">{t("locationLabel")}:</dt>
          <dd>{tLocations(job.locationCode)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("employmentTypeLabel")}:</dt>
          <dd>{tEmploymentType(job.employmentType)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("workFormatLabel")}:</dt>
          <dd>{tWorkFormat(job.workFormat)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("experienceLabel")}:</dt>
          <dd>{tExperienceLevel(job.experienceLevel)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("salaryLabel")}:</dt>
          <dd>{salaryText}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("postedLabel")}:</dt>
          <dd>{postedDate}</dd>
        </div>
        {job.requiredLanguages.length > 0 && (
          <div className="flex gap-1">
            <dt className="font-medium">{t("languagesLabel")}:</dt>
            <dd>{job.requiredLanguages.map((code) => tLanguages(code)).join(", ")}</dd>
          </div>
        )}
      </dl>

      <p className="mt-6 whitespace-pre-line text-gray-700 dark:text-gray-300">
        {pickLocalized(job.description, locale)}
      </p>
    </div>
  );
}
