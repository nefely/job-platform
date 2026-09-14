import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { DotBackground } from "./DotBackground";
import { GlowDots } from "./GlowDots";

// Тизер-CTA без реального пейволу/акаунтів за ним (тих ще немає — див.
// [[next-feature-accounts-applications]]) — переваги нижче або вже
// реалізовані як окрема "звичайна" функціональність (пошук кандидатів),
// або описують, що з'явиться разом із фічею акаунтів. Дія на CTA — та сама
// контекстно вбудована ContactForm, що й на /jobs/[id] і /candidates/[slug],
// а не посилання на неіснуючу сторінку "Premium".
export async function PremiumCtaSection() {
  const t = await getTranslations("premium");

  const benefits = [
    t("benefit1"),
    t("benefit2"),
    t("benefit3"),
    t("benefit4"),
    t("benefit5"),
  ];

  return (
    <section id="premium" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 px-6 py-10 dark:border-gray-800 sm:px-10">
        <DotBackground />
        <GlowDots />

        <div className="relative grid gap-10 sm:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-gray-900">
              Premium
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h2>
            <p className="mt-3 max-w-xl text-gray-600 dark:text-gray-300">{t("subtitle")}</p>

            <ul className="mt-6 flex flex-col gap-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-900 dark:text-white"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white/70 p-6 backdrop-blur dark:border-gray-800 dark:bg-gray-950/70">
            <h3 className="font-semibold">{t("formTitle")}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t("formSubtitle")}</p>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
