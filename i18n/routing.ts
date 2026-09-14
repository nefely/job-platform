import { defineRouting } from "next-intl/routing";

// Без localized pathnames навмисно: кириличні шляхи (напр. /контакти)
// завжди percent-encode'яться браузером у копії лінка/логах/адресному
// рядку (%D0%BA%D0%BE...) — це властивість кирилиці в URL, а не баг.
// Один і той самий шлях для всіх локалей (/contact, /jobs, /partners)
// простіший і зрозуміліший при копіюванні/поширенні посилань.
export const routing = defineRouting({
  locales: ["uk", "en", "pl"],
  defaultLocale: "en",
});

export type AppLocale = (typeof routing.locales)[number];
