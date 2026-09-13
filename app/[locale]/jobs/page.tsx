import { getTranslations, setRequestLocale } from "next-intl/server";
import { AllJobsBoard } from "@/components/partners/AllJobsBoard";
import { CATEGORY_IDS } from "@/data/categories";
import type { CategoryFilterValue } from "@/lib/filterJobs";
import type { CategoryId } from "@/types/category";
import type { AppLocale } from "@/types/i18n";

function toCategoryFilterValue(rawCategory: string | undefined): CategoryFilterValue {
  if (rawCategory && CATEGORY_IDS.includes(rawCategory as CategoryId)) {
    return rawCategory as CategoryId;
  }
  return "all";
}

export default async function JobsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/jobs">) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const { category } = await searchParams;
  const rawCategory = Array.isArray(category) ? category[0] : category;

  const t = await getTranslations("jobs");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("pageTitle")}</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{t("pageSubtitle")}</p>
      <AllJobsBoard initialCategory={toCategoryFilterValue(rawCategory)} />
    </div>
  );
}
