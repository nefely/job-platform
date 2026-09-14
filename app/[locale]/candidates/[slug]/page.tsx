import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { CandidateDetailView } from "@/components/candidates/CandidateDetailView";
import { resolveCandidateBySlug } from "@/lib/candidates/resolveCandidateBySlug";
import type { AppLocale } from "@/types/i18n";

export default async function CandidateDetailPage({
  params,
}: PageProps<"/[locale]/candidates/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale as AppLocale);

  const candidate = await resolveCandidateBySlug(slug);

  if (!candidate) {
    notFound();
  }

  const t = await getTranslations("candidates");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <CandidateDetailView candidate={candidate} />

      <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
        <h2 className="text-xl font-bold tracking-tight">{t("contactTitle")}</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-300">{t("contactSubtitle")}</p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
