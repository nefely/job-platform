import type { AppLocale, LocalizedText } from "@/types/i18n";

// Єдина точка, де jsonb-поле { uk, en, pl } перетворюється на рядок для
// показу/пошуку за поточною локаллю.
export function pickLocalized(value: LocalizedText, locale: AppLocale): string {
  return value[locale];
}
