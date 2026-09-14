"use client";

import { memo, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface CandidateSearchInputProps {
  initialValue?: string;
  onDebouncedChange: (value: string) => void;
  delay?: number;
}

function CandidateSearchInputComponent({
  initialValue = "",
  onDebouncedChange,
  delay = 300,
}: CandidateSearchInputProps) {
  const t = useTranslations("candidates");
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebouncedValue(value, delay);

  useEffect(() => {
    onDebouncedChange(debouncedValue);
    // Той самий підхід, що й JobSearchInput: спрацьовує лише коли
    // debouncedValue дійсно змінився (раз на паузу в наборі).
  }, [debouncedValue, onDebouncedChange]);

  return (
    <label className="flex w-full flex-col gap-1 text-sm font-medium">
      <span className="sr-only">{t("searchLabel")}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("searchPlaceholder")}
        className="h-10.5 w-full rounded-lg border border-gray-300 px-4 text-sm font-normal focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100"
      />
    </label>
  );
}

// memo: onDebouncedChange — стабільний useCallback у батька (CandidatesBoard),
// тож цей компонент не ре-рендериться через активність батька; ре-рендер від
// кожного символу лишається тут і не каскадує далі (як і JobSearchInput).
export const CandidateSearchInput = memo(CandidateSearchInputComponent);
