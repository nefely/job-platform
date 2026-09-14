"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FilterChipGroup } from "./FilterChipGroup";
import { Select } from "./Select";

const inputClassName =
  "h-10.5 rounded-lg border border-gray-300 px-4 text-sm font-normal focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100";

// Один "вимір" фільтрації — мультиселект-чіпи, число (напр. зарплата) або
// односелект (напр. "дата розміщення"). Ресурсно-нейтральний: конкретний
// сенс (яке поле JobFilters/CandidateFilters він міняє) знає лише виклик,
// що будує масив dimensions (JobFiltersPanel/CandidateFiltersPanel) —
// FiltersPanel лише рендерить те, що йому дали.
export type FilterDimension =
  | {
      kind: "chips";
      key: string;
      legend: string;
      selected: string[];
      onChange: (next: string[]) => void;
      options: { value: string; label: string; colorClassName?: string }[];
    }
  | {
      kind: "number";
      key: string;
      legend: string;
      value: number | null;
      onChange: (next: number | null) => void;
      placeholder: string;
    }
  | {
      kind: "select";
      key: string;
      legend: string;
      value: string;
      onChange: (next: string) => void;
      options: { value: string; label: string }[];
    };

interface FiltersPanelProps {
  toggleLabel: string;
  resetLabel: string;
  activeCount: number;
  onReset: () => void;
  dimensions: FilterDimension[];
}

// Спільна оболонка для JobFiltersPanel і CandidateFiltersPanel: кнопка-іконка
// (42×42, як інпут пошуку) з бейджем кількості активних фільтрів + absolute-
// панель із вимірами, що розкривається/закривається (клік поза панеллю,
// Escape). Рендериться батьком (AllJobsBoard/PartnerJobsBoard/
// CandidatesBoard) поруч із інпутом пошуку у спільному relative flex-wrap-
// рядку — className="contents" на кореневому div змушує кнопку/reset/панель
// поводитись як прямі flex-діти ТОГО рядка, а не одного вкладеного блока.
// "Скинути все" — basis-full: завжди переносить себе на новий рядок і
// притискається праворуч, не впливаючи на ширину інпута пошуку.
//
// Сам компонент не знає, ЩО саме фільтрується (Job чи Candidate) — це
// свідомий вибір: два ресурси мають різні виміри (minSalary vs maxSalary,
// postedWithinDays vs availableWithinDays, кандидати мають ще й локацію),
// тож спільна абстракція — вихідний масив dimensions, а не спільний тип
// фільтрів.
export function FiltersPanel({
  toggleLabel,
  resetLabel,
  activeCount,
  onReset,
  dimensions,
}: FiltersPanelProps) {
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

  return (
    <div ref={containerRef} className="contents">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-label={toggleLabel}
        title={toggleLabel}
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
          onClick={onReset}
          className="basis-full text-right text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
        >
          {resetLabel}
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
            {dimensions.map((dimension) => {
              if (dimension.kind === "chips") {
                return (
                  <FilterChipGroup
                    key={dimension.key}
                    legend={dimension.legend}
                    selected={dimension.selected}
                    onChange={dimension.onChange}
                    options={dimension.options}
                  />
                );
              }

              if (dimension.kind === "number") {
                return (
                  <label key={dimension.key} className="flex max-w-xs flex-col gap-1 text-sm font-medium">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {dimension.legend}
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={dimension.value ?? ""}
                      onChange={(e) =>
                        dimension.onChange(e.target.value === "" ? null : Number(e.target.value))
                      }
                      placeholder={dimension.placeholder}
                      className={inputClassName}
                    />
                  </label>
                );
              }

              return (
                <div key={dimension.key} className="flex max-w-xs flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {dimension.legend}
                  </span>
                  <Select
                    label={dimension.legend}
                    value={dimension.value}
                    onChange={dimension.onChange}
                    options={dimension.options}
                  />
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
