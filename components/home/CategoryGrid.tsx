import { getTranslations } from "next-intl/server";
import { CATEGORY_COLORS } from "@/data/categoryColors";
import { CATEGORY_ICONS } from "@/data/categoryIcons";
import { CATEGORY_IDS } from "@/data/categories";
import { Link } from "@/i18n/navigation";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

export async function CategoryGrid() {
  const t = await getTranslations("home");
  const tCategories = await getTranslations("categories");
  const tDescriptions = await getTranslations("categoryDescriptions");

  return (
    <section id="categories" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight">{t("categoriesTitle")}</h2>
      <p className="mt-1 text-gray-600 dark:text-gray-300">{t("categoriesSubtitle")}</p>

      <StaggerContainer className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_IDS.map((categoryId) => (
          <StaggerItem key={categoryId}>
            <Link
              href={`/jobs?category=${categoryId}`}
              className="flex h-full flex-col gap-3 rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-900"
            >
              <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${CATEGORY_COLORS[categoryId]}`}
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
                  {CATEGORY_ICONS[categoryId]}
                </svg>
              </span>
              <div>
                <p className="font-semibold">{tCategories(categoryId)}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {tDescriptions(categoryId)}
                </p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
