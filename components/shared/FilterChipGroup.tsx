"use client";

interface FilterChipOption<T extends string> {
  value: T;
  label: string;
  /** Tailwind bg/text classes for the SELECTED state, e.g. category colors.
   * Falls back to a neutral dark/light highlight when omitted. */
  colorClassName?: string;
}

interface FilterChipGroupProps<T extends string> {
  legend: string;
  options: FilterChipOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
}

const baseChipClassName = "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors";
const inactiveChipClassName =
  "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800";
const activeDefaultClassName =
  "border-transparent bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900";

// Мультиселект-чіпи: клік на чіп додає/прибирає значення з масиву `selected`.
// Generic, ресурсно-нейтральний примітив — використовується всередині
// FiltersPanel для будь-якого "chips"-виміру (категорія, тип зайнятості,
// формат роботи, досвід, мова — і для вакансій, і для кандидатів).
export function FilterChipGroup<T extends string>({
  legend,
  options,
  selected,
  onChange,
}: FilterChipGroupProps<T>) {
  function toggle(value: T) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggle(option.value)}
              className={`${baseChipClassName} ${
                isActive ? (option.colorClassName ?? activeDefaultClassName) : inactiveChipClassName
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
