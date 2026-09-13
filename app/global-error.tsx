"use client";

import { useEffect } from "react";

// Найкрайніший фолбек: спрацьовує лише якщо впаде сам app/[locale]/layout.tsx
// (єдиний layout у проєкті, він же й визначає <html>/<body>) — тобто раніше,
// ніж стає доступний NextIntlClientProvider/ThemeProvider. Тому тут навмисно
// без next-intl і без Tailwind dark:-класів (немає гарантії, що глобальний
// CSS взагалі підвантажився) — простий інлайновий стиль, англійською.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: "6rem 1.5rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ marginTop: "0.5rem", color: "#555" }}>Please try again.</p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            borderRadius: "9999px",
            border: "none",
            background: "#111",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
