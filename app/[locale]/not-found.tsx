import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start gap-4 px-4 py-24 text-center sm:px-6">
      <div className="mx-auto flex w-full flex-col items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-gray-600 dark:text-gray-300">{t("text")}</p>
        <Link
          href="/"
          className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
