import type { CategoryFilterValue } from "@/lib/filterJobs";
import type { Partner } from "@/types/partner";

// Чиста функція: фільтр партнерів за категорією (яку партнер представляє).
// Той самий підхід, що й filterJobs — лише filter, без map/clone, тож
// PartnerCard (React.memo) не ре-рендериться для партнерів, чия картка не
// змінилась.
export function filterPartnersByCategory(
  partners: Partner[],
  category: CategoryFilterValue,
): Partner[] {
  if (category === "all") {
    return partners;
  }
  return partners.filter((partner) => partner.categories.includes(category));
}
