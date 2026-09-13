"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { EMPLOYMENT_TYPE_IDS } from "@/data/employmentTypes";
import { EXPERIENCE_LEVEL_IDS } from "@/data/experienceLevels";
import { LANGUAGE_CODES } from "@/data/languages";
import { WORK_FORMAT_IDS } from "@/data/workFormats";
import type { CategoryFilterValue, JobAdvancedFilters } from "@/lib/filterJobs";
import { CategoryFilter } from "./CategoryFilter";

interface JobFiltersPanelProps {
  category: CategoryFilterValue;
  onCategoryChange: (value: CategoryFilterValue) => void;
  advancedFilters: JobAdvancedFilters;
  onAdvancedFiltersChange: (filters: JobAdvancedFilters) => void;
}

const selectClassName =
  "rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-normal focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100";

function JobFiltersPanelComponent({
  category,
  onCategoryChange,
  advancedFilters,
  onAdvancedFiltersChange,
}: JobFiltersPanelProps) {
  const t = useTranslations("jobs");
  const tEmploymentType = useTranslations("employmentType");
  const tWorkFormat = useTranslations("workFormat");
  const tExperienceLevel = useTranslations("experienceLevel");
  const tLanguages = useTranslations("languages");
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    employmentType = "all",
    workFormat = "all",
    experienceLevel = "all",
    language = "all",
    minSalary = null,
  } = advancedFilters;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <CategoryFilter value={category} onChange={onCategoryChange} />
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          className="self-start rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
        >
          {t("filtersToggle")}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-5 dark:border-gray-800">
          <label className="flex flex-col gap-1 text-sm font-medium">
            <span className="sr-only">{t("employmentTypeLabel")}</span>
            <select
              value={employmentType}
              onChange={(e) =>
                onAdvancedFiltersChange({
                  ...advancedFilters,
                  employmentType: e.target.value as JobAdvancedFilters["employmentType"],
                })
              }
              className={selectClassName}
            >
              <option value="all">{t("allEmploymentTypes")}</option>
              {EMPLOYMENT_TYPE_IDS.map((id) => (
                <option key={id} value={id}>
                  {tEmploymentType(id)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            <span className="sr-only">{t("workFormatLabel")}</span>
            <select
              value={workFormat}
              onChange={(e) =>
                onAdvancedFiltersChange({
                  ...advancedFilters,
                  workFormat: e.target.value as JobAdvancedFilters["workFormat"],
                })
              }
              className={selectClassName}
            >
              <option value="all">{t("allWorkFormats")}</option>
              {WORK_FORMAT_IDS.map((id) => (
                <option key={id} value={id}>
                  {tWorkFormat(id)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            <span className="sr-only">{t("experienceLabel")}</span>
            <select
              value={experienceLevel}
              onChange={(e) =>
                onAdvancedFiltersChange({
                  ...advancedFilters,
                  experienceLevel: e.target.value as JobAdvancedFilters["experienceLevel"],
                })
              }
              className={selectClassName}
            >
              <option value="all">{t("allExperienceLevels")}</option>
              {EXPERIENCE_LEVEL_IDS.map((id) => (
                <option key={id} value={id}>
                  {tExperienceLevel(id)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            <span className="sr-only">{t("languageFilterLabel")}</span>
            <select
              value={language}
              onChange={(e) =>
                onAdvancedFiltersChange({
                  ...advancedFilters,
                  language: e.target.value as JobAdvancedFilters["language"],
                })
              }
              className={selectClassName}
            >
              <option value="all">{t("allLanguages")}</option>
              {LANGUAGE_CODES.map((code) => (
                <option key={code} value={code}>
                  {tLanguages(code)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            <span className="sr-only">{t("minSalaryLabel")}</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={minSalary ?? ""}
              onChange={(e) =>
                onAdvancedFiltersChange({
                  ...advancedFilters,
                  minSalary: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              placeholder={`${t("minSalaryLabel")} (${t("minSalaryPlaceholder")})`}
              className={selectClassName}
            />
          </label>
        </div>
      )}
    </div>
  );
}

export const JobFiltersPanel = memo(JobFiltersPanelComponent);
