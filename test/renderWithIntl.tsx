import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import messages from "@/messages/en.json";

// Мінімальна обгортка NextIntlClientProvider для компонентів, що
// використовують useTranslations() — реальні messages/en.json, щоб тексти
// в тестах не розходились із продакшн-контентом.
export function renderWithIntl(ui: ReactElement, options?: RenderOptions) {
  return render(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        {children}
      </NextIntlClientProvider>
    ),
    ...options,
  });
}
