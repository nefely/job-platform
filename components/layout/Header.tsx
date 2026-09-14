import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";

const linkClassName =
  "text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white";

export async function Header() {
  const t = await getTranslations("nav");

  const navLinks = (
    <>
      <Link href="/jobs" className={linkClassName}>
        {t("findJob")}
      </Link>
      <Link href="/partners" className={linkClassName}>
        {t("partners")}
      </Link>
      <Link href="/candidates" className={linkClassName}>
        {t("findEmployee")}
      </Link>
      <Link href="/#about" className={linkClassName}>
        {t("about")}
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
              exclusive at every width, so these never render twice. */}
          <div className="hidden items-center gap-3 md:flex">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          <MobileNav toggleLabel={t("logo")}>
            <div className="flex flex-col items-center gap-3">{navLinks}</div>
            <div className="mt-3 flex items-center gap-3">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
