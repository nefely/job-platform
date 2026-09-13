import { getTranslations } from "next-intl/server";
import { CATEGORY_IDS } from "@/data/categories";
import { DEFAULT_PARTNER_SLUG } from "@/data/constants";
import { Link } from "@/i18n/navigation";

export async function CategoryGrid() {
  const t = await getTranslations("home");
  const tCategories = await getTranslations("categories");

  return (
    <section id="categories" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight">{t("categoriesTitle")}</h2>
      <p className="mt-1 text-gray-600 dark:text-gray-300">{t("categoriesSubtitle")}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {CATEGORY_IDS.map((categoryId) => (
          <Link
            key={categoryId}
            href={{
              pathname: "/partners/[slug]",
              params: { slug: DEFAULT_PARTNER_SLUG },
              query: { category: categoryId },
            }}
            className="rounded-xl border border-gray-200 px-4 py-4 text-sm font-medium transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-900"
          >
            {tCategories(categoryId)}
          </Link>
        ))}
      </div>
    </section>
  );
}
