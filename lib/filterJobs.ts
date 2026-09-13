import { pickLocalized } from "@/lib/i18n/pickLocalized";
import type { CategoryId } from "@/types/category";
import type { AppLocale } from "@/types/i18n";
import type { EmploymentType, ExperienceLevel, Job, WorkFormat } from "@/types/job";
import type { LanguageCode } from "@/types/language";

export type CategoryFilterValue = CategoryId | "all";

export interface JobAdvancedFilters {
  employmentType?: EmploymentType | "all";
  workFormat?: WorkFormat | "all";
  experienceLevel?: ExperienceLevel | "all";
  language?: LanguageCode | "all";
  /** Вакансія проходить, якщо (salaryFrom ?? salaryTo) >= minSalary. Вакансії
   * без жодної вказаної зарплати виключаються, якщо поріг заданий. */
  minSalary?: number | null;
}

// Чиста функція: пошук за локалізованою назвою (case-insensitive substring)
// + категорія + опційні додаткові виміри (тип зайнятості, формат роботи,
// досвід, мова, мінімальна зарплата). Використовує лише
// Array.prototype.filter (без map/clone), тож job-об'єкти, що пройшли
// фільтр, зберігають referential identity — це дозволяє JobCard
// (React.memo) не ре-рендеритись, якщо його job не змінився.
export function filterJobs(
  jobs: Job[],
  query: string,
  category: CategoryFilterValue,
  locale: AppLocale,
  filters: JobAdvancedFilters = {},
): Job[] {
  const normalizedQuery = query.trim().toLowerCase();
  const {
    employmentType = "all",
    workFormat = "all",
    experienceLevel = "all",
    language = "all",
    minSalary = null,
  } = filters;

  return jobs.filter((job) => {
    const matchesCategory = category === "all" || job.category === category;
    const matchesQuery =
      normalizedQuery === "" ||
      pickLocalized(job.title, locale).toLowerCase().includes(normalizedQuery);
    const matchesEmploymentType = employmentType === "all" || job.employmentType === employmentType;
    const matchesWorkFormat = workFormat === "all" || job.workFormat === workFormat;
    const matchesExperience = experienceLevel === "all" || job.experienceLevel === experienceLevel;
    const matchesLanguage = language === "all" || job.requiredLanguages.includes(language);
    const matchesSalary =
      minSalary == null || (job.salaryFrom ?? job.salaryTo ?? -Infinity) >= minSalary;

    return (
      matchesCategory &&
      matchesQuery &&
      matchesEmploymentType &&
      matchesWorkFormat &&
      matchesExperience &&
      matchesLanguage &&
      matchesSalary
    );
  });
}
