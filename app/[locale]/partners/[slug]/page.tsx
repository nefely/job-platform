import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PartnerHeader } from "@/components/partners/PartnerHeader";
import { PartnerJobsBoard } from "@/components/partners/PartnerJobsBoard";
import { CATEGORY_IDS } from "@/data/categories";
import { resolvePartnerBySlug } from "@/lib/partners/resolvePartnerBySlug";
import type { CategoryFilterValue } from "@/lib/filterJobs";
import type { CategoryId } from "@/types/category";
import type { AppLocale } from "@/types/i18n";

function toCategoryFilterValue(rawCategory: string | undefined): CategoryFilterValue {
  if (rawCategory && CATEGORY_IDS.includes(rawCategory as CategoryId)) {
    return rawCategory as CategoryId;
  }
  return "all";
}

export default async function PartnerPage({
  params,
  searchParams,
}: PageProps<"/[locale]/partners/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale as AppLocale);

  const { category } = await searchParams;
  const rawCategory = Array.isArray(category) ? category[0] : category;

  const partner = await resolvePartnerBySlug(slug);

  if (!partner) {
    notFound();
  }

  return (
    <>
      <PartnerHeader partner={partner} />
      <PartnerJobsBoard
        partnerId={partner.id}
        initialCategory={toCategoryFilterValue(rawCategory)}
      />
    </>
  );
}
