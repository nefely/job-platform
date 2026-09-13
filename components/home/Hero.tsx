import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { InteractiveDots } from "./InteractiveDots";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
      <InteractiveDots />

      {/* relative: разом з absolute-позиціонованим InteractiveDots вище
          обидва стають "positioned"-елементами, тож порядок у DOM (крапки
          першими) визначає стек — контент лишається зверху. Без relative
          тут absolute-фон малювався б поверх звичайного статичного вмісту
          незалежно від порядку в розмітці. */}
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <FadeIn>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-300">
            {t("subtitle")}
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="rounded-full bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              {t("ctaFindJob")}
            </Link>
            <Link
              href="/#for-employers"
              className="rounded-full border border-gray-300 px-6 py-3 text-center text-sm font-semibold transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
            >
              {t("ctaFindEmployee")}
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
