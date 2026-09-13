"use client";

import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATEGORY_COLORS } from "@/data/categoryColors";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import type { AppLocale } from "@/types/i18n";
import type { Partner } from "@/types/partner";

interface PartnerCardProps {
  partner: Partner;
}

function PartnerCardComponent({ partner }: PartnerCardProps) {
  const locale = useLocale() as AppLocale;
  const tLocations = useTranslations("locations");
  const tCategories = useTranslations("categories");

  return (
    <Link
      href={`/partners/${partner.slug}`}
      className="block rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-900"
    >
      <p className="font-semibold">{pickLocalized(partner.name, locale)}</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {tLocations(partner.locationCode)}
      </p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {pickLocalized(partner.summary, locale)}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {partner.categories.map((categoryId) => (
          <span
            key={categoryId}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[categoryId]}`}
          >
            {tCategories(categoryId)}
          </span>
        ))}
      </div>
    </Link>
  );
}

// React.memo: як і JobCard — картка не повинна ре-рендеритись через
// активність фільтра в батьківському компоненті, якщо сам partner не змінився.
export const PartnerCard = memo(PartnerCardComponent);
