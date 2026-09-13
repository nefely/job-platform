"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CATEGORY_COLORS } from "@/data/categoryColors";
import { CATEGORY_IDS } from "@/data/categories";
import { EMPLOYMENT_TYPE_IDS } from "@/data/employmentTypes";
import { EXPERIENCE_LEVEL_IDS } from "@/data/experienceLevels";
import { LANGUAGE_CODES } from "@/data/languages";
import { WORK_FORMAT_IDS } from "@/data/workFormats";
import { countActiveJobFilters, EMPTY_JOB_FILTERS, type JobFilters } from "@/lib/filterJobs";
import { FilterChipGroup } from "./FilterChipGroup";

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

const inputClassName =
  "rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-normal focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100";

export function JobFiltersPanel({ filters, onFiltersChange }: JobFiltersPanelProps) {
  const t = useTranslations("jobs");
  const tCategories = useTranslations("categories");
  const tEmploymentType = useTranslations("employmentType");
  const tWorkFormat = useTranslations("workFormat");
  const tExperienceLevel = useTranslations("experienceLevel");
  const tLanguages = useTranslations("languages");
  const [isExpanded, setIsExpanded] = useState(false);

  const activeCount = countActiveJobFilters(filters);
  const {
    categories = [],
    employmentTypes = [],
    workFormats = [],
    experienceLevels = [],
    languages = [],
    minSalary = null,
  } = filters;

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-label={t("filtersToggle")}
          title={t("filtersToggle")}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          {activeCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white dark:bg-white dark:text-gray-900">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onFiltersChange(EMPTY_JOB_FILTERS)}
            className="text-sm font-medium text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
          >
            {t("resetFilters")}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-3 flex flex-col gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <FilterChipGroup
            legend={t("categoryFilterLabel")}
            selected={categories}
            onChange={(next) => onFiltersChange({ ...filters, categories: next })}
            options={CATEGORY_IDS.map((id) => ({
              value: id,
              label: tCategories(id),
              colorClassName: CATEGORY_COLORS[id],
            }))}
          />

          <FilterChipGroup
            legend={t("employmentTypeLabel")}
            selected={employmentTypes}
            onChange={(next) => onFiltersChange({ ...filters, employmentTypes: next })}
            options={EMPLOYMENT_TYPE_IDS.map((id) => ({ value: id, label: tEmploymentType(id) }))}
          />

          <FilterChipGroup
            legend={t("workFormatLabel")}
            selected={workFormats}
            onChange={(next) => onFiltersChange({ ...filters, workFormats: next })}
            options={WORK_FORMAT_IDS.map((id) => ({ value: id, label: tWorkFormat(id) }))}
          />

          <FilterChipGroup
            legend={t("experienceLabel")}
            selected={experienceLevels}
            onChange={(next) => onFiltersChange({ ...filters, experienceLevels: next })}
            options={EXPERIENCE_LEVEL_IDS.map((id) => ({ value: id, label: tExperienceLevel(id) }))}
          />

          <FilterChipGroup
            legend={t("languageFilterLabel")}
            selected={languages}
            onChange={(next) => onFiltersChange({ ...filters, languages: next })}
            options={LANGUAGE_CODES.map((code) => ({ value: code, label: tLanguages(code) }))}
          />

          <label className="flex max-w-xs flex-col gap-1 text-sm font-medium">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t("minSalaryLabel")}
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={minSalary ?? ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  minSalary: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              placeholder={t("minSalaryPlaceholder")}
              className={inputClassName}
            />
          </label>
        </div>
      )}
    </div>
  );
}
