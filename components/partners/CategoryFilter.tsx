"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { CATEGORY_IDS } from "@/data/categories";
import type { CategoryFilterValue } from "@/lib/filterJobs";

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

function CategoryFilterComponent({ value, onChange }: CategoryFilterProps) {
  const t = useTranslations("jobs");
  const tCategories = useTranslations("categories");

  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      <span className="sr-only">{t("categoryFilterLabel")}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CategoryFilterValue)}
        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-normal focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100"
      >
        <option value="all">{t("allCategories")}</option>
        {CATEGORY_IDS.map((categoryId) => (
          <option key={categoryId} value={categoryId}>
            {tCategories(categoryId)}
          </option>
        ))}
      </select>
    </label>
  );
}

// memo: список CATEGORY_IDS і onChange (стабільний useCallback у батька) не
// змінюються між рендерами — компонент ре-рендериться лише коли реально
// змінюється обране значення.
export const CategoryFilter = memo(CategoryFilterComponent);
