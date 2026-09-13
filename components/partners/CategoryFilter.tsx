"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { CATEGORY_IDS } from "@/data/categories";
import type { CategoryFilterValue } from "@/lib/filterJobs";
import { Select } from "@/components/shared/Select";

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

function CategoryFilterComponent({ value, onChange }: CategoryFilterProps) {
  const t = useTranslations("jobs");
  const tCategories = useTranslations("categories");

  return (
    <Select
      label={t("categoryFilterLabel")}
      value={value}
      onChange={onChange}
      options={[
        { value: "all" as CategoryFilterValue, label: t("allCategories") },
        ...CATEGORY_IDS.map((id) => ({ value: id as CategoryFilterValue, label: tCategories(id) })),
      ]}
    />
  );
}

// memo: список CATEGORY_IDS і onChange (стабільний useCallback у батька) не
// змінюються між рендерами — компонент ре-рендериться лише коли реально
// змінюється обране значення.
export const CategoryFilter = memo(CategoryFilterComponent);
