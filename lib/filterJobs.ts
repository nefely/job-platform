import { pickLocalized } from "@/lib/i18n/pickLocalized";
import type { CategoryId } from "@/types/category";
import type { AppLocale } from "@/types/i18n";
import type { EmploymentType, ExperienceLevel, Job, WorkFormat } from "@/types/job";
import type { LanguageCode } from "@/types/language";

// Досі використовується окремо для /partners (PartnersIndexBoard,
// CategoryFilter, lib/filterPartners.ts) — там категорія лишається
// single-select, це не стосується фільтрів вакансій нижче.
export type CategoryFilterValue = CategoryId | "all";

// Мультиселект по кожному виміру: порожній масив/undefined = фільтр на цей
// вимір не застосовується (показуємо все). Це стандартна семантика для
// панелі фільтрів — "нічого не обрано" означає "без обмежень", а не
// "нічого не показувати".
export interface JobFilters {
  categories?: CategoryId[];
  employmentTypes?: EmploymentType[];
  workFormats?: WorkFormat[];
  experienceLevels?: ExperienceLevel[];
  languages?: LanguageCode[];
  /** Вакансія проходить, якщо (salaryFrom ?? salaryTo) >= minSalary. Вакансії
   * без жодної вказаної зарплати виключаються, якщо поріг заданий. */
  minSalary?: number | null;
  /** Показувати лише вакансії, опубліковані не пізніше ніж N днів тому.
   * Односелект (не масив, на відміну від інших вимірів) — "за тиждень" і
   * так включає "за добу", мультивибір тут не має сенсу. */
  postedWithinDays?: number | null;
}

export const EMPTY_JOB_FILTERS: JobFilters = {};

export function countActiveJobFilters(filters: JobFilters): number {
  return (
    (filters.categories?.length ?? 0) +
    (filters.employmentTypes?.length ?? 0) +
    (filters.workFormats?.length ?? 0) +
    (filters.experienceLevels?.length ?? 0) +
    (filters.languages?.length ?? 0) +
    (filters.minSalary != null ? 1 : 0) +
    (filters.postedWithinDays != null ? 1 : 0)
  );
}

// Чиста функція: пошук за локалізованою назвою (case-insensitive substring)
// + мультиселект-фільтри за категорією/типом зайнятості/форматом
// роботи/досвідом/мовою/мінімальною зарплатою. Використовує лише
// Array.prototype.filter (без map/clone), тож job-об'єкти, що пройшли
// фільтр, зберігають referential identity — це дозволяє JobCard
// (React.memo) не ре-рендеритись, якщо його job не змінився.
export function filterJobs(
  jobs: Job[],
  query: string,
  locale: AppLocale,
  filters: JobFilters = {},
): Job[] {
  const normalizedQuery = query.trim().toLowerCase();
  const {
    categories = [],
    employmentTypes = [],
    workFormats = [],
    experienceLevels = [],
    languages = [],
    minSalary = null,
    postedWithinDays = null,
  } = filters;

  return jobs.filter((job) => {
    const matchesQuery =
      normalizedQuery === "" ||
      pickLocalized(job.title, locale).toLowerCase().includes(normalizedQuery);
    const matchesCategory = categories.length === 0 || categories.includes(job.category);
    const matchesEmploymentType =
      employmentTypes.length === 0 || employmentTypes.includes(job.employmentType);
    const matchesWorkFormat = workFormats.length === 0 || workFormats.includes(job.workFormat);
    const matchesExperience =
      experienceLevels.length === 0 || experienceLevels.includes(job.experienceLevel);
    const matchesLanguage =
      languages.length === 0 || job.requiredLanguages.some((code) => languages.includes(code));
    const matchesSalary =
      minSalary == null || (job.salaryFrom ?? job.salaryTo ?? -Infinity) >= minSalary;
    const matchesPostedWithin =
      postedWithinDays == null ||
      Date.now() - new Date(job.postedAt).getTime() <= postedWithinDays * 24 * 60 * 60 * 1000;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesEmploymentType &&
      matchesWorkFormat &&
      matchesExperience &&
      matchesLanguage &&
      matchesSalary &&
      matchesPostedWithin
    );
  });
}
