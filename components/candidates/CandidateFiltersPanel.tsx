"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CATEGORY_COLORS } from "@/data/categoryColors";
import { CATEGORY_IDS } from "@/data/categories";
import { EMPLOYMENT_TYPE_IDS } from "@/data/employmentTypes";
import { EXPERIENCE_LEVEL_IDS } from "@/data/experienceLevels";
import { LANGUAGE_CODES } from "@/data/languages";
import { LOCATION_CODES } from "@/data/locations";
import { WORK_FORMAT_IDS } from "@/data/workFormats";
import {
  countActiveCandidateFilters,
  EMPTY_CANDIDATE_FILTERS,
  type CandidateFilters,
} from "@/lib/filterCandidates";
import { Select } from "@/components/shared/Select";
import { FilterChipGroup } from "@/components/partners/FilterChipGroup";

interface CandidateFiltersPanelProps {
  filters: CandidateFilters;
  onFiltersChange: (filters: CandidateFilters) => void;
}

const inputClassName =
  "h-10.5 rounded-lg border border-gray-300 px-4 text-sm font-normal focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100";

// "Готовність почати" — односелект (не масив, як інші виміри): "протягом
// місяця" і так включає "протягом тижня", мультивибір тут не мав би сенсу.
// Той самий підхід, що й postedWithinDays у JobFiltersPanel.
type AvailableWithinOption = "any" | "7" | "14" | "30";

const AVAILABLE_WITHIN_DAYS: Record<AvailableWithinOption, number | null> = {
  any: null,
  "7": 7,
  "14": 14,
  "30": 30,
};

function daysToAvailableWithinOption(days: number | null | undefined): AvailableWithinOption {
  if (days === 7 || days === 14 || days === 30) return String(days) as AvailableWithinOption;
  return "any";
}

// Дзеркало JobFiltersPanel (той самий UX: кнопка-іконка з бейджем кількості
// активних фільтрів + absolute-панель із чіпами), але для кандидатів:
// категорія/локація/бажана зайнятість/формат/досвід/мова + бюджет
// (maxSalary — "не дорожче ніж") + готовність почати.
export function CandidateFiltersPanel({ filters, onFiltersChange }: CandidateFiltersPanelProps) {
  const t = useTranslations("candidates");
  const tCategories = useTranslations("categories");
  const tLocations = useTranslations("locations");
  const tEmploymentType = useTranslations("employmentType");
  const tWorkFormat = useTranslations("workFormat");
  const tExperienceLevel = useTranslations("experienceLevel");
  const tLanguages = useTranslations("languages");
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExpanded) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const activeCount = countActiveCandidateFilters(filters);
  const {
    categories = [],
    locationCodes = [],
    employmentTypes = [],
    workFormats = [],
    experienceLevels = [],
    languages = [],
    maxSalary = null,
    availableWithinDays = null,
  } = filters;
  const availableWithinValue = daysToAvailableWithinOption(availableWithinDays);

  return (
    <div ref={containerRef} className="contents">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-label={t("filtersToggle")}
        title={t("filtersToggle")}
        className="relative flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-900 transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900/60"
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
          onClick={() => onFiltersChange(EMPTY_CANDIDATE_FILTERS)}
          className="basis-full text-right text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
        >
          {t("resetFilters")}
        </button>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-x-0 top-full z-20 mt-2 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-950"
          >
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
            legend={t("locationFilterLabel")}
            selected={locationCodes}
            onChange={(next) => onFiltersChange({ ...filters, locationCodes: next })}
            options={LOCATION_CODES.map((code) => ({ value: code, label: tLocations(code) }))}
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
              {t("maxSalaryLabel")}
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={maxSalary ?? ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  maxSalary: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              placeholder={t("maxSalaryPlaceholder")}
              className={inputClassName}
            />
          </label>

          <div className="flex max-w-xs flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t("availableWithinLabel")}
            </span>
            <Select
              label={t("availableWithinLabel")}
              value={availableWithinValue}
              onChange={(next: AvailableWithinOption) =>
                onFiltersChange({ ...filters, availableWithinDays: AVAILABLE_WITHIN_DAYS[next] })
              }
              options={[
                { value: "any", label: t("availableWithinAny") },
                { value: "7", label: t("availableWithin7") },
                { value: "14", label: t("availableWithin14") },
                { value: "30", label: t("availableWithin30") },
              ]}
            />
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
