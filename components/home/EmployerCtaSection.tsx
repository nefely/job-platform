import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function EmployerCtaSection() {
  const t = await getTranslations("home");

  return (
    <section id="for-employers" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl bg-gray-900 px-6 py-10 text-white dark:bg-white dark:text-gray-900 sm:px-10">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("employerTitle")}
        </h2>
        <p className="mt-3 max-w-2xl text-gray-300 dark:text-gray-600">
          {t("employerText")}
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
        >
          {t("employerCta")}
        </Link>
      </div>
    </section>
  );
}
