import type { CategoryId } from "@/types/category";

// Фіксована таксономія з брифу. Лейбли — в messages/*.json (namespace "categories"),
// щоб не дублювати переклад у БД для сталого набору значень.
export const CATEGORY_IDS: CategoryId[] = [
  "construction",
  "manufacturing",
  "logistics",
  "hospitality",
  "it",
  "drivers",
  "other",
];
