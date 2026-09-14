import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CATEGORY_COLORS } from "@/data/categoryColors";
import type { Candidate } from "@/types/candidate";

interface CandidateDetailViewProps {
  candidate: Candidate;
}

export async function CandidateDetailView({ candidate }: CandidateDetailViewProps) {
  const t = await getTranslations("candidates");
  const tCategories = await getTranslations("categories");
  const tLocations = await getTranslations("locations");
  const tEmploymentType = await getTranslations("employmentType");
  const tWorkFormat = await getTranslations("workFormat");
  const tExperienceLevel = await getTranslations("experienceLevel");
  const tLanguages = await getTranslations("languages");
  const tLanguageLevels = await getTranslations("languageLevels");

  const salaryText =
    candidate.salaryExpectationFrom && candidate.currency
      ? `${candidate.salaryExpectationFrom}+ ${candidate.currency}`
      : t("salaryNotSpecified");

  return (
    <div>
      <Link
        href="/candidates"
        className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        {t("backLink")}
      </Link>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {candidate.categories.map((category) => (
          <span
            key={category}
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
          >
            {tCategories(category)}
          </span>
        ))}
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight">{candidate.name}</h1>
      <p className="mt-1 text-gray-600 dark:text-gray-300">{candidate.headline}</p>

      <dl className="mt-4 flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex gap-1">
          <dt className="font-medium">{t("locationFilterLabel")}:</dt>
          <dd>{tLocations(candidate.locationCode)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("employmentTypeLabel")}:</dt>
          <dd>{candidate.desiredEmploymentTypes.map((v) => tEmploymentType(v)).join(", ")}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("workFormatLabel")}:</dt>
          <dd>{candidate.desiredWorkFormats.map((v) => tWorkFormat(v)).join(", ")}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("experienceLabel")}:</dt>
          <dd>{tExperienceLevel(candidate.experienceLevel)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="font-medium">{t("salaryExpectationLabel")}:</dt>
          <dd>{salaryText}</dd>
        </div>
        {candidate.availableFrom && (
          <div className="flex gap-1">
            <dt className="font-medium">{t("availableFromLabel")}:</dt>
            <dd>{candidate.availableFrom}</dd>
          </div>
        )}
        {candidate.languages.length > 0 && (
          <div className="flex gap-1">
            <dt className="font-medium">{t("languagesLabel")}:</dt>
            <dd>
              {candidate.languages
                .map((l) => `${tLanguages(l.code)} (${tLanguageLevels(l.level)})`)
                .join(", ")}
            </dd>
          </div>
        )}
      </dl>

      {candidate.skills.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("skillsLabel")}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-gray-300 px-2.5 py-0.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {candidate.about && (
        <p className="mt-6 whitespace-pre-line text-gray-700 dark:text-gray-300">
          {candidate.about}
        </p>
      )}
    </div>
  );
}
