"use client";

import { useTranslations } from "next-intl";
import { CATEGORY_COLORS } from "@/data/categoryColors";
import { CATEGORY_IDS } from "@/data/categories";
import { EMPLOYMENT_TYPE_IDS } from "@/data/employmentTypes";
import { EXPERIENCE_LEVEL_IDS } from "@/data/experienceLevels";
import { LANGUAGE_CODES } from "@/data/languages";
import { WORK_FORMAT_IDS } from "@/data/workFormats";
import { countActiveJobFilters, EMPTY_JOB_FILTERS, type JobFilters } from "@/lib/filterJobs";
import { FiltersPanel, type FilterDimension } from "@/components/shared/FiltersPanel";
import type { CategoryId } from "@/types/category";
import type { EmploymentType, ExperienceLevel, WorkFormat } from "@/types/job";
import type { LanguageCode } from "@/types/language";

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
}

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

// Тонка обгортка над generic FiltersPanel (кнопка-іконка з бейджем +
// absolute-панель, клік-поза/Escape — уся ця логіка живе там один раз).
// Цей файл лише знає, ЩО саме фільтрується у вакансій: категорія/тип
// зайнятості/формат/досвід/мова (chips) + зарплата від (number) + дата
// розміщення (select). Дзеркало CandidateFiltersPanel — та сама структура,
// інший набір вимірів (порівняй minSalary/postedWithinDays там із
// maxSalary/availableWithinDays тут — напрямки різні, бо ролі протилежні).
export function JobFiltersPanel({ filters, onFiltersChange }: JobFiltersPanelProps) {
  const t = useTranslations("jobs");
  const tCategories = useTranslations("categories");
  const tEmploymentType = useTranslations("employmentType");
  const tWorkFormat = useTranslations("workFormat");
  const tExperienceLevel = useTranslations("experienceLevel");
  const tLanguages = useTranslations("languages");

  const {
    categories = [],
    employmentTypes = [],
    workFormats = [],
    experienceLevels = [],
    languages = [],
    minSalary = null,
    postedWithinDays = null,
  } = filters;

  const dimensions: FilterDimension[] = [
    {
      kind: "chips",
      key: "categories",
      legend: t("categoryFilterLabel"),
      selected: categories,
      onChange: (next) => onFiltersChange({ ...filters, categories: next as CategoryId[] }),
      options: CATEGORY_IDS.map((id) => ({
        value: id,
        label: tCategories(id),
        colorClassName: CATEGORY_COLORS[id],
      })),
    },
    {
      kind: "chips",
      key: "employmentTypes",
      legend: t("employmentTypeLabel"),
      selected: employmentTypes,
      onChange: (next) => onFiltersChange({ ...filters, employmentTypes: next as EmploymentType[] }),
      options: EMPLOYMENT_TYPE_IDS.map((id) => ({ value: id, label: tEmploymentType(id) })),
    },
    {
      kind: "chips",
      key: "workFormats",
      legend: t("workFormatLabel"),
      selected: workFormats,
      onChange: (next) => onFiltersChange({ ...filters, workFormats: next as WorkFormat[] }),
      options: WORK_FORMAT_IDS.map((id) => ({ value: id, label: tWorkFormat(id) })),
    },
    {
      kind: "chips",
      key: "experienceLevels",
      legend: t("experienceLabel"),
      selected: experienceLevels,
      onChange: (next) => onFiltersChange({ ...filters, experienceLevels: next as ExperienceLevel[] }),
      options: EXPERIENCE_LEVEL_IDS.map((id) => ({ value: id, label: tExperienceLevel(id) })),
    },
    {
      kind: "chips",
      key: "languages",
      legend: t("languageFilterLabel"),
      selected: languages,
      onChange: (next) => onFiltersChange({ ...filters, languages: next as LanguageCode[] }),
      options: LANGUAGE_CODES.map((code) => ({ value: code, label: tLanguages(code) })),
    },
    {
      kind: "number",
      key: "minSalary",
      legend: t("minSalaryLabel"),
      value: minSalary,
      onChange: (next) => onFiltersChange({ ...filters, minSalary: next }),
      placeholder: t("minSalaryPlaceholder"),
    },
    {
      kind: "select",
      key: "postedWithinDays",
      legend: t("postedWithinLabel"),
      value: daysToPostedWithinOption(postedWithinDays),
      onChange: (next) =>
        onFiltersChange({
          ...filters,
          postedWithinDays: POSTED_WITHIN_DAYS[next as PostedWithinOption],
        }),
      options: [
        { value: "any", label: t("postedWithinAny") },
        { value: "1", label: t("postedWithin1") },
        { value: "7", label: t("postedWithin7") },
        { value: "30", label: t("postedWithin30") },
      ],
    },
  ];

  return (
    <FiltersPanel
      toggleLabel={t("filtersToggle")}
      resetLabel={t("resetFilters")}
      activeCount={countActiveJobFilters(filters)}
      onReset={() => onFiltersChange(EMPTY_JOB_FILTERS)}
      dimensions={dimensions}
    />
  );
}
