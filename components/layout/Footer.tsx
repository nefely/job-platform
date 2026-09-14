import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HashScrollLink } from "./HashScrollLink";
import { Logo } from "./Logo";

const columnLinkClassName =
  "text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="flex items-center">
              <Logo className="h-[42px] w-auto shrink-0" title={tNav("logo")} />
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("tagline")}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">{t("aboutTitle")}</p>
            <HashScrollLink href="/#about" className={columnLinkClassName}>
              {t("aboutLink")}
            </HashScrollLink>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">{t("candidatesTitle")}</p>
            <Link href="/jobs" className={columnLinkClassName}>
              {t("findJobLink")}
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">{t("employersTitle")}</p>
            <Link href="/candidates" className={columnLinkClassName}>
              {t("findEmployeeLink")}
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:text-gray-400">
          <p>{t("rights", { year })}</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-900 dark:hover:text-white">{t("privacy")}</span>
            <span className="hover:text-gray-900 dark:hover:text-white">{t("terms")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
