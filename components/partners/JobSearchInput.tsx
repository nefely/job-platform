"use client";

import { memo, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface JobSearchInputProps {
  initialValue?: string;
  onDebouncedChange: (value: string) => void;
  delay?: number;
}

function JobSearchInputComponent({
  initialValue = "",
  onDebouncedChange,
  delay = 300,
}: JobSearchInputProps) {
  const t = useTranslations("jobs");
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebouncedValue(value, delay);

  useEffect(() => {
    onDebouncedChange(debouncedValue);
    // Викликається лише коли debouncedValue дійсно змінився (раз на паузу
    // в наборі), не на кожен keystroke.
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

// memo: онDebouncedChange — стабільний useCallback у батька, тож цей
// компонент не ре-рендериться через активність батька; кожен ре-рендер від
// клавіші лишається тут і не каскадує в PartnerJobsBoard на кожен символ.
export const JobSearchInput = memo(JobSearchInputComponent);
