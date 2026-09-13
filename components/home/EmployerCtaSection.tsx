import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DotBackground } from "./DotBackground";
import { GlowDots } from "./GlowDots";

export async function EmployerCtaSection() {
  const t = await getTranslations("home");

  return (
    <section id="for-employers" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 px-6 py-10 dark:border-gray-800 sm:px-10">
        <DotBackground />
        <GlowDots />

        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("employerTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">{t("employerText")}</p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {t("employerCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
