import { getTranslations } from "next-intl/server";
import { DEFAULT_PARTNER_SLUG } from "@/data/constants";
import { Link } from "@/i18n/navigation";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-300">
        {t("subtitle")}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={{ pathname: "/partners/[slug]", params: { slug: DEFAULT_PARTNER_SLUG } }}
          className="rounded-full bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {t("ctaFindJob")}
        </Link>
        <Link
          href={{ pathname: "/", hash: "for-employers" }}
          className="rounded-full border border-gray-300 px-6 py-3 text-center text-sm font-semibold transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
        >
          {t("ctaFindEmployee")}
        </Link>
      </div>
    </section>
  );
}
