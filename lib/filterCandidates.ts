import type { CategoryId } from "@/types/category";
import type { Candidate } from "@/types/candidate";
import type { EmploymentType, ExperienceLevel, WorkFormat } from "@/types/job";
import type { LanguageCode } from "@/types/language";
import type { LocationCode } from "@/types/location";

// На відміну від filterJobs, тут немає параметра locale: name/headline
// кандидата НЕ LocalizedText (див. types/candidate.ts) — це вже звичайний
// рядок однією мовою (profileLocale), тому pickLocalized тут не потрібен.
export interface CandidateFilters {
  categories?: CategoryId[];
  locationCodes?: LocationCode[];
  employmentTypes?: EmploymentType[];
  workFormats?: WorkFormat[];
  experienceLevels?: ExperienceLevel[];
  languages?: LanguageCode[];
  /** Кандидат проходить, якщо його очікувана зарплата <= maxSalary (це
   * фільтр з боку роботодавця — "у межах бюджету"). Кандидати без вказаної
   * очікуваної зарплати виключаються, якщо поріг заданий — дзеркально до
   * minSalary у filterJobs. */
  maxSalary?: number | null;
  /** Лише кандидати, готові почати не пізніше ніж через N днів. Односелект,
   * як postedWithinDays у filterJobs. */
  availableWithinDays?: number | null;
}

export const EMPTY_CANDIDATE_FILTERS: CandidateFilters = {};

export function countActiveCandidateFilters(filters: CandidateFilters): number {
  return (
    (filters.categories?.length ?? 0) +
    (filters.locationCodes?.length ?? 0) +
    (filters.employmentTypes?.length ?? 0) +
    (filters.workFormats?.length ?? 0) +
    (filters.experienceLevels?.length ?? 0) +
    (filters.languages?.length ?? 0) +
    (filters.maxSalary != null ? 1 : 0) +
    (filters.availableWithinDays != null ? 1 : 0)
  );
}

// Чиста функція: пошук за ім'ям/посадою (case-insensitive substring) +
// мультиселект-фільтри за категорією/локацією/типом зайнятості/форматом
// роботи/досвідом/мовою/зарплатним бюджетом. Лише Array.prototype.filter
// (без map/clone) — кандидати, що пройшли фільтр, зберігають referential
// identity, як і filterJobs (React.memo-дружньо для CandidateCard).
export function filterCandidates(
  candidates: Candidate[],
  query: string,
  filters: CandidateFilters = {},
): Candidate[] {
  const normalizedQuery = query.trim().toLowerCase();
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

  return candidates.filter((candidate) => {
    const matchesQuery =
      normalizedQuery === "" ||
      candidate.name.toLowerCase().includes(normalizedQuery) ||
      candidate.headline.toLowerCase().includes(normalizedQuery);
    const matchesCategory =
      categories.length === 0 || candidate.categories.some((c) => categories.includes(c));
    const matchesLocation =
      locationCodes.length === 0 || locationCodes.includes(candidate.locationCode);
    const matchesEmploymentType =
      employmentTypes.length === 0 ||
      candidate.desiredEmploymentTypes.some((t) => employmentTypes.includes(t));
    const matchesWorkFormat =
      workFormats.length === 0 || candidate.desiredWorkFormats.some((f) => workFormats.includes(f));
    const matchesExperience =
      experienceLevels.length === 0 || experienceLevels.includes(candidate.experienceLevel);
    const matchesLanguage =
      languages.length === 0 || candidate.languages.some((l) => languages.includes(l.code));
    const matchesSalary =
      maxSalary == null || (candidate.salaryExpectationFrom ?? Infinity) <= maxSalary;
    const matchesAvailability =
      availableWithinDays == null ||
      (candidate.availableFrom != null &&
        new Date(candidate.availableFrom).getTime() - Date.now() <=
          availableWithinDays * 24 * 60 * 60 * 1000);

    return (
      matchesQuery &&
      matchesCategory &&
      matchesLocation &&
      matchesEmploymentType &&
      matchesWorkFormat &&
      matchesExperience &&
      matchesLanguage &&
      matchesSalary &&
      matchesAvailability
    );
  });
}
