import { getTranslations } from "next-intl/server";
import { DEFAULT_PARTNER_SLUG } from "@/data/constants";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";

const linkClassName =
  "text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white";

export async function Header() {
  const t = await getTranslations("nav");

  const navLinks = (
    <>
      <Link href={{ pathname: "/", hash: "partners" }} className={linkClassName}>
        {t("partners")}
      </Link>
      <Link
        href={{ pathname: "/partners/[slug]", params: { slug: DEFAULT_PARTNER_SLUG } }}
        className={linkClassName}
      >
        {t("findJob")}
      </Link>
      <Link href={{ pathname: "/", hash: "for-employers" }} className={linkClassName}>
        {t("findEmployee")}
      </Link>
      <Link href={{ pathname: "/", hash: "about" }} className={linkClassName}>
        {t("about")}
      </Link>
      <Link href="/contact" className={linkClassName}>
        {t("contact")}
      </Link>
    </>
  );

  return (
    <header className="relative border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {t("logo")}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label={t("logo")}>
          {navLinks}
        </nav>

        <div className="flex items-center gap-3">
          {/* md:hidden wrapper (MobileNav) and md:block here are mutually
              exclusive at every width, so the switcher never renders twice. */}
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <MobileNav toggleLabel={t("logo")}>
            <div className="flex flex-col gap-3">{navLinks}</div>
            <div className="mt-3">
              <LocaleSwitcher />
            </div>
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
