import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import type { AppLocale } from "@/types/i18n";

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{t("subtitle")}</p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
