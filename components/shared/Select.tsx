"use client";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  label: string; // sr-only — доступний label для скрінрідерів
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  className?: string;
}

// Generic, стилізований <select> (як зразок — FilterChipGroup для чіпів):
// власна SVG-стрілка замість нативної (appearance-none), 42px висота, як і
// решта інпутів/кнопок у проєкті. Конкретні фільтри (категорія тощо) —
// тонкі обгортки над цим компонентом з власними options/переклад.
export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  className,
}: SelectProps<T>) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium ${className ?? ""}`}>
      <span className="sr-only">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="h-10.5 w-full appearance-none rounded-lg border border-gray-300 py-2.5 pr-9 pl-4 text-sm font-normal focus:border-gray-900 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:focus:border-gray-100"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* appearance-none прибирає нативну стрілку в усіх браузерах —
            замінюємо власною SVG, pointer-events-none щоб клік проходив
            крізь неї до select. */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </label>
  );
}
