import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uk", "en", "pl"],
  defaultLocale: "uk",
  pathnames: {
    "/": "/",
    "/partners/[slug]": "/partners/[slug]",
    "/contact": {
      uk: "/контакти",
      en: "/contact",
      pl: "/kontakt",
    },
  },
});

export type AppLocale = (typeof routing.locales)[number];
