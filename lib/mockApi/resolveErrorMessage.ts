import { SIMULATED_FAILURE_MESSAGE, UNKNOWN_ERROR_MESSAGE } from "./simulateRequest";

// Вужчий тип, ніж повний Translator useTranslations("common") (який приймає
// об'єднання ВСІХ ключів namespace "common") — і саме тому сумісний із ним:
// параметр функції перевіряється контраваріантно, тож функція, що приймає
// лише ці два літерали, є підтипом функції, що приймає весь union ключів.
type Translator = (key: "simulatedErrorMessage" | "unknownErrorMessage") => string;

// state.error зі useAsync — або один з двох стабільних (не локалізованих)
// маркерів вище, або сире повідомлення реальної помилки (напр. від
// Supabase) — його локалізувати нема як, лишаємо як є. tCommon —
// useTranslations("common") у виклика.
export function resolveErrorMessage(error: string, tCommon: Translator): string {
  if (error === SIMULATED_FAILURE_MESSAGE) return tCommon("simulatedErrorMessage");
  if (error === UNKNOWN_ERROR_MESSAGE) return tCommon("unknownErrorMessage");
  return error;
}
