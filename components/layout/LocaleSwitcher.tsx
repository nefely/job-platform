"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<(typeof routing.locales)[number], string> = {
  uk: "UA",
  en: "EN",
  pl: "PL",
};

export function LocaleSwitcher() {
  const activeLocale = useLocale();
  // usePathname() returns the internal (unlocalized) pathname template, e.g.
  // "/partners/[slug]" rather than "/partners/euro-logistics" — the real
  // params come from next/navigation's useParams() so the switcher can
  // rebuild a valid href for dynamic routes too.
  const pathname = usePathname();
  const routeParams = useParams<{ slug?: string }>();
  const t = useTranslations("nav");

  const href =
    pathname === "/partners/[slug]"
      ? ({ pathname, params: { slug: routeParams.slug ?? "" } } as const)
      : pathname;

  return (
    <div
      role="group"
      aria-label={t("languageLabel")}
      className="flex items-center gap-1 rounded-full border border-gray-200 p-1 text-xs font-medium dark:border-gray-700"
    >
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;

        return (
          <Link
            key={locale}
            href={href}
            locale={locale}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-full px-2 py-1 transition-colors ${
              isActive
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            {LOCALE_LABELS[locale]}
          </Link>
        );
      })}
    </div>
  );
}
