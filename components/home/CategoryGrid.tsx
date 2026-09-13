import { getTranslations } from "next-intl/server";
import { CATEGORY_COLORS } from "@/data/categoryColors";
import { CATEGORY_IDS } from "@/data/categories";
import { Link } from "@/i18n/navigation";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";

export async function CategoryGrid() {
  const t = await getTranslations("home");
  const tCategories = await getTranslations("categories");

  return (
    <section id="categories" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight">{t("categoriesTitle")}</h2>
      <p className="mt-1 text-gray-600 dark:text-gray-300">{t("categoriesSubtitle")}</p>

      <StaggerContainer className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {CATEGORY_IDS.map((categoryId) => (
          <StaggerItem key={categoryId}>
            <Link
              href={`/jobs?category=${categoryId}`}
              className={`block rounded-xl border border-transparent px-4 py-4 text-sm font-medium transition-opacity hover:opacity-80 ${CATEGORY_COLORS[categoryId]}`}
            >
              {tCategories(categoryId)}
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
