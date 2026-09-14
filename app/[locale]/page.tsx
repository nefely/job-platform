import { getTranslations, setRequestLocale } from "next-intl/server";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EmployerCtaSection } from "@/components/home/EmployerCtaSection";
import { FeaturedPartnersSection } from "@/components/home/FeaturedPartnersSection";
import { Hero } from "@/components/home/Hero";
import { PremiumCtaSection } from "@/components/home/PremiumCtaSection";
import type { AppLocale } from "@/types/i18n";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  // The [locale] segment is already validated in app/[locale]/layout.tsx
  // (notFound() there for anything outside routing.locales), so this cast
  // just narrows the string param for next-intl's typed setRequestLocale.
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("home");

  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedPartnersSection />
      <EmployerCtaSection />
      <PremiumCtaSection />
      <section id="about" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">{t("aboutTitle")}</h2>
        <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">{t("aboutText")}</p>
      </section>
    </>
  );
}
