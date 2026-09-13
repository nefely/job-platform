"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CATEGORY_COLORS } from "@/data/categoryColors";
import { CATEGORY_IDS } from "@/data/categories";
import { EMPLOYMENT_TYPE_IDS } from "@/data/employmentTypes";
import { EXPERIENCE_LEVEL_IDS } from "@/data/experienceLevels";
import { LANGUAGE_CODES } from "@/data/languages";
import { WORK_FORMAT_IDS } from "@/data/workFormats";
import { countActiveJobFilters, EMPTY_JOB_FILTERS, type JobFilters } from "@/lib/filterJobs";
import { Select } from "@/components/shared/Select";
import { FilterChipGroup } from "./FilterChipGroup";

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

const inputClassName =
  "h-10.5 rounded-lg border border-gray-300 px-4 text-sm font-normal focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100";

// "Дата розміщення" — односелект (не масив, як інші виміри): "за тиждень"
// і так включає "за добу", мультивибір тут не мав би сенсу.
type PostedWithinOption = "any" | "1" | "7" | "30";

const POSTED_WITHIN_DAYS: Record<PostedWithinOption, number | null> = {
  any: null,
  "1": 1,
  "7": 7,
  "30": 30,
};

function daysToPostedWithinOption(days: number | null | undefined): PostedWithinOption {
  if (days === 1 || days === 7 || days === 30) return String(days) as PostedWithinOption;
  return "any";
}

// Кнопка-іконка (42×42, як інпут пошуку) стоїть в одному рядку з пошуком —
// рендериться батьком (AllJobsBoard/PartnerJobsBoard) поруч із
// JobSearchInput у спільному relative flex-wrap-рядку. Розкривна панель із
// чіпами позиціонується absolute на всю ширину ТОГО рядка (inset-x-0
// відносно найближчого relative-предка), а не лише колонки кнопки.
// "Скинути все" — звичайний (не absolute) елемент рядка з basis-full: у
// flex-wrap-рядку він завжди переносить сам себе на новий рядок (незалежно
// від вільного місця) і притискається до правого краю через text-right —
// тож не впливає на ширину інпута пошуку.
export function JobFiltersPanel({ filters, onFiltersChange }: JobFiltersPanelProps) {
  const t = useTranslations("jobs");
  const tCategories = useTranslations("categories");
  const tEmploymentType = useTranslations("employmentType");
  const tWorkFormat = useTranslations("workFormat");
  const tExperienceLevel = useTranslations("experienceLevel");
  const tLanguages = useTranslations("languages");
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Клік/тап поза панеллю або Escape — закриває її (той самий підхід, що й
  // у MobileNav).
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

  const activeCount = countActiveJobFilters(filters);
  const {
    categories = [],
    employmentTypes = [],
    workFormats = [],
    experienceLevels = [],
    languages = [],
    minSalary = null,
    postedWithinDays = null,
  } = filters;
  const postedWithinValue = daysToPostedWithinOption(postedWithinDays);

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
          onClick={() => onFiltersChange(EMPTY_JOB_FILTERS)}
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

          <div className="flex max-w-xs flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t("postedWithinLabel")}
            </span>
            <Select
              label={t("postedWithinLabel")}
              value={postedWithinValue}
              onChange={(next: PostedWithinOption) =>
                onFiltersChange({ ...filters, postedWithinDays: POSTED_WITHIN_DAYS[next] })
              }
              options={[
                { value: "any", label: t("postedWithinAny") },
                { value: "1", label: t("postedWithin1") },
                { value: "7", label: t("postedWithin7") },
                { value: "30", label: t("postedWithin30") },
              ]}
            />
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
