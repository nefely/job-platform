import { getTranslations, setRequestLocale } from "next-intl/server";
import { CandidatesBoard } from "@/components/candidates/CandidatesBoard";
import type { AppLocale } from "@/types/i18n";

export default async function CandidatesPage({ params }: PageProps<"/[locale]/candidates">) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("candidates");

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("pageTitle")}</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{t("pageSubtitle")}</p>
      <CandidatesBoard />
    </div>
  );
}
