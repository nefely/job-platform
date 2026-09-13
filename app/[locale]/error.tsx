"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RetryBlock } from "@/components/shared/RetryBlock";

// Ловить будь-яку необроблену помилку в дереві під [locale] — включно з
// resolveJobById/resolvePartnerBySlug (server-side резолвери /jobs/[id] і
// /partners/[slug]), які самі нічого не ловлять і просто кидають Error, якщо
// Supabase падає по-справжньому. Без цього файлу користувач бачив би
// дефолтну непричесану сторінку помилки Next.js. Рендериться всередині
// layout.tsx (NextIntlClientProvider/ThemeProvider лишаються активними),
// тому useTranslations тут працює як завжди.
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("pageError");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <RetryBlock title={t("title")} message={t("text")} onRetry={reset} />
      <Link
        href="/"
        className="text-sm font-medium text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline dark:text-gray-300 dark:hover:text-white"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
