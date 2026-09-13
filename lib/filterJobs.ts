import { pickLocalized } from "@/lib/i18n/pickLocalized";
import type { CategoryId } from "@/types/category";
import type { AppLocale } from "@/types/i18n";
import type { Job } from "@/types/job";

export type CategoryFilterValue = CategoryId | "all";

// Чиста функція: пошук за локалізованою назвою (case-insensitive substring)
// + фільтр за категорією. Використовує лише Array.prototype.filter (без
// map/clone), тож job-об'єкти, що пройшли фільтр, зберігають referential
// identity — це дозволяє JobCard (React.memo) не ре-рендеритись, якщо його
// job не змінився.
export function filterJobs(
  jobs: Job[],
  query: string,
  category: CategoryFilterValue,
  locale: AppLocale,
): Job[] {
  const normalizedQuery = query.trim().toLowerCase();

  return jobs.filter((job) => {
    const matchesCategory = category === "all" || job.category === category;
    const matchesQuery =
      normalizedQuery === "" ||
      pickLocalized(job.title, locale).toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}
