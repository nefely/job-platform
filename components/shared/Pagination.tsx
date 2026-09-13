"use client";

import { useTranslations } from "next-intl";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Свідомо просто: Prev/Next + "Сторінка X з Y" замість пронумерованих
// кнопок — коректно працює при будь-якій кількості сторінок, без ризику
// переповнення рядка чи edge-case'ів з "..." (без сторонніх UI-кітів).
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations("jobs");

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label={t("paginationLabel")}
      className="mt-6 flex items-center justify-center gap-4 text-sm"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-gray-300 px-4 py-2 font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-900"
      >
        {t("paginationPrev")}
      </button>
      <span className="text-gray-600 dark:text-gray-400">
        {t("paginationStatus", { page, total: totalPages })}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border border-gray-300 px-4 py-2 font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-900"
      >
        {t("paginationNext")}
      </button>
    </nav>
  );
}
