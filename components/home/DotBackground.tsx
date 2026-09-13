// Hero-фон: проста статична сітка крапок (repeating radial-gradient —
// сам тайлиться на будь-яку ширину/висоту секції, без потреби рахувати
// кількість колонок/рядків вручну).
export function DotBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 text-gray-300 dark:text-gray-700"
      style={{
        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  );
}
