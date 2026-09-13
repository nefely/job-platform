import type { CategoryId } from "@/types/category";

// Кольорова таксономія категорій — використовується і на бейджах
// (PartnerCard, JobCard), і на чіпах фільтра категорій (JobFiltersPanel),
// щоб один і той самий колір скрізь означав одну й ту саму категорію.
export const CATEGORY_COLORS: Record<CategoryId, string> = {
  construction:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  manufacturing:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  logistics:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  hospitality: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  it: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  drivers: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  other: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};
