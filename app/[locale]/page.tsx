import Image from "next/image";
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
      <EmployerCtaSection />
      <section id="about" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid items-center gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t("aboutTitle")}</h2>
            <div className="mt-3 flex max-w-xl flex-col gap-4 text-gray-600 dark:text-gray-300">
              <p>{t("aboutText")}</p>
              <p>{t("aboutText2")}</p>
              <p>{t("aboutText3")}</p>
            </div>
          </div>
          <div className="mx-auto w-full max-w-xs sm:max-w-none">
            <Image
              src="/vv-work-about-illustration.svg"
              alt=""
              width={760}
              height={520}
              unoptimized
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>
      <FeaturedPartnersSection />
      <PremiumCtaSection />
      
    </>
  );
}
