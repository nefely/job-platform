"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATEGORY_COLORS } from "@/data/categoryColors";
import type { Candidate } from "@/types/candidate";

interface CandidateCardProps {
  candidate: Candidate;
}

function CandidateCardComponent({ candidate }: CandidateCardProps) {
  const t = useTranslations("candidates");
  const tCategories = useTranslations("categories");
  const tLocations = useTranslations("locations");
  const tEmploymentType = useTranslations("employmentType");
  const tWorkFormat = useTranslations("workFormat");
  const tLanguages = useTranslations("languages");
  const tLanguageLevels = useTranslations("languageLevels");

  const salaryText =
    candidate.salaryExpectationFrom && candidate.currency
      ? `${t("salaryExpectationLabel")} ${candidate.salaryExpectationFrom}+ ${candidate.currency}`
      : t("salaryNotSpecified");

  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 p-4 dark:border-gray-800 dark:bg-gray-950/70">
      <div className="flex flex-wrap gap-1.5">
        {candidate.categories.map((category) => (
          <span
            key={category}
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
          >
            {tCategories(category)}
          </span>
        ))}
      </div>

      <h3 className="mt-2 font-semibold">
        <Link href={`/candidates/${candidate.slug}`} className="hover:underline">
          {candidate.name}
        </Link>
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{candidate.headline}</p>

      {candidate.about && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{candidate.about}</p>
      )}

      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex gap-1">
          <dt className="font-medium">{t("locationFilterLabel")}:</dt>
          <dd>{tLocations(candidate.locationCode)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("employmentTypeLabel")}:</dt>
          <dd>{candidate.desiredEmploymentTypes.map((t2) => tEmploymentType(t2)).join(", ")}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("workFormatLabel")}:</dt>
          <dd>{candidate.desiredWorkFormats.map((f) => tWorkFormat(f)).join(", ")}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{salaryText}</dt>
        </div>
        {candidate.availableFrom && (
          <div className="flex gap-1">
            <dt className="font-medium">{t("availableFromLabel")}:</dt>
            <dd>{candidate.availableFrom}</dd>
          </div>
        )}
      </dl>

      {candidate.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {candidate.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        {candidate.languages
          .map((l) => `${tLanguages(l.code)} (${tLanguageLevels(l.level)})`)
          .join(" · ")}
      </p>
    </article>
  );
}

// React.memo: filterCandidates (Array.prototype.filter, без map/clone)
// зберігає referential identity candidate-об'єктів, що пройшли фільтр —
// картка не ре-рендериться, якщо саме її candidate не змінився (як і JobCard).
export const CandidateCard = memo(CandidateCardComponent);
