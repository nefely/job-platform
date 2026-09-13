"use client";

import { useTranslations } from "next-intl";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const arrowButtonClassName =
  "flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-900";

// Свідомо просто: стрілки Prev/Next (SVG, 42×42 — той самий розмір, що й
// решта кнопок-іконок у проєкті) + "Сторінка X з Y" замість пронумерованих
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
        aria-label={t("paginationPrev")}
        title={t("paginationPrev")}
        className={arrowButtonClassName}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <span className="text-gray-600 dark:text-gray-400">
        {t("paginationStatus", { page, total: totalPages })}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t("paginationNext")}
        title={t("paginationNext")}
        className={arrowButtonClassName}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
}
