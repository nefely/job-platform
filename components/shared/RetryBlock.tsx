"use client";

import { useTranslations } from "next-intl";

interface RetryBlockProps {
  title?: string;
  message: string;
  onRetry: () => void;
}

export function RetryBlock({ title, message, onRetry }: RetryBlockProps) {
  const t = useTranslations("common");

  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
    >
      {title && <p className="font-medium">{title}</p>}
      <p className="text-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900"
      >
        {t("retry")}
      </button>
    </div>
  );
}
