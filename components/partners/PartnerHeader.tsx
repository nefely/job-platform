import { getLocale, getTranslations } from "next-intl/server";
import { CATEGORY_COLORS } from "@/data/categoryColors";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import type { AppLocale } from "@/types/i18n";
import type { Partner } from "@/types/partner";

interface PartnerHeaderProps {
  partner: Partner;
}

export async function PartnerHeader({ partner }: PartnerHeaderProps) {
  const locale = (await getLocale()) as AppLocale;
  const tLocations = await getTranslations("locations");
  const tCategories = await getTranslations("categories");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {tLocations(partner.locationCode)}
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">
        {pickLocalized(partner.name, locale)}
      </h1>
      <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
        {pickLocalized(partner.summary, locale)}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {partner.categories.map((categoryId) => (
          <span
            key={categoryId}
            className={`rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[categoryId]}`}
          >
            {tCategories(categoryId)}
          </span>
        ))}
      </div>
    </div>
  );
}
