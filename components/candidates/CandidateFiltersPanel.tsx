"use client";

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
import { FiltersPanel, type FilterDimension } from "@/components/shared/FiltersPanel";
import type { CategoryId } from "@/types/category";
import type { EmploymentType, ExperienceLevel, WorkFormat } from "@/types/job";
import type { LanguageCode } from "@/types/language";
import type { LocationCode } from "@/types/location";

interface CandidateFiltersPanelProps {
  filters: CandidateFilters;
  onFiltersChange: (filters: CandidateFilters) => void;
}

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

// Тонка обгортка над generic FiltersPanel — дзеркало JobFiltersPanel, інший
// набір вимірів: категорія/локація/бажана зайнятість/формат/досвід/мова
// (chips) + бюджет "не дорожче ніж" (number, maxSalary — протилежний
// напрямок до minSalary у вакансій, бо тут роботодавець обирає кандидата)
// + готовність почати (select).
export function CandidateFiltersPanel({ filters, onFiltersChange }: CandidateFiltersPanelProps) {
  const t = useTranslations("candidates");
  const tCategories = useTranslations("categories");
  const tLocations = useTranslations("locations");
  const tEmploymentType = useTranslations("employmentType");
  const tWorkFormat = useTranslations("workFormat");
  const tExperienceLevel = useTranslations("experienceLevel");
  const tLanguages = useTranslations("languages");

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
      key: "locationCodes",
      legend: t("locationFilterLabel"),
      selected: locationCodes,
      onChange: (next) => onFiltersChange({ ...filters, locationCodes: next as LocationCode[] }),
      options: LOCATION_CODES.map((code) => ({ value: code, label: tLocations(code) })),
    },
    {
      kind: "chips",
      key: "employmentTypes",
      legend: t("employmentTypeLabel"),
      selected: employmentTypes,
      onChange: (next) =>
        onFiltersChange({ ...filters, employmentTypes: next as EmploymentType[] }),
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
      onChange: (next) =>
        onFiltersChange({ ...filters, experienceLevels: next as ExperienceLevel[] }),
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
      key: "maxSalary",
      legend: t("maxSalaryLabel"),
      value: maxSalary,
      onChange: (next) => onFiltersChange({ ...filters, maxSalary: next }),
      placeholder: t("maxSalaryPlaceholder"),
    },
    {
      kind: "select",
      key: "availableWithinDays",
      legend: t("availableWithinLabel"),
      value: daysToAvailableWithinOption(availableWithinDays),
      onChange: (next) =>
        onFiltersChange({
          ...filters,
          availableWithinDays: AVAILABLE_WITHIN_DAYS[next as AvailableWithinOption],
        }),
      options: [
        { value: "any", label: t("availableWithinAny") },
        { value: "7", label: t("availableWithin7") },
        { value: "14", label: t("availableWithin14") },
        { value: "30", label: t("availableWithin30") },
      ],
    },
  ];

  return (
    <FiltersPanel
      toggleLabel={t("filtersToggle")}
      resetLabel={t("resetFilters")}
      activeCount={countActiveCandidateFilters(filters)}
      onReset={() => onFiltersChange(EMPTY_CANDIDATE_FILTERS)}
      dimensions={dimensions}
    />
  );
}
