// Абстрактна ілюстрація для секції "Про нас" — навмисно не фото: на сайті
// свідомо немає жодних растрових зображень, лише inline SVG (DotBackground,
// GlowDots, CATEGORY_ICONS). Мережа вузлів різних кольорів (ті самі відтінки,
// що й CATEGORY_COLORS) навколо центрального — платформа, що з'єднує
// кандидатів і роботодавців різних напрямків по містах Європи.
export function AboutIllustration() {
  return (
    <svg viewBox="0 0 320 320" fill="none" className="h-full w-full" aria-hidden="true">
      <circle
        cx="160"
        cy="160"
        r="140"
        className="stroke-gray-200 dark:stroke-gray-800"
        strokeWidth="1"
      />
      <circle
        cx="160"
        cy="160"
        r="100"
        className="stroke-gray-200 dark:stroke-gray-800"
        strokeWidth="1"
      />

      <g className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="1.5">
        <line x1="160" y1="160" x2="80" y2="70" />
        <line x1="160" y1="160" x2="230" y2="60" />
        <line x1="160" y1="160" x2="270" y2="150" />
        <line x1="160" y1="160" x2="250" y2="250" />
        <line x1="160" y1="160" x2="150" y2="280" />
        <line x1="160" y1="160" x2="60" y2="240" />
        <line x1="160" y1="160" x2="50" y2="150" />
      </g>

      <circle cx="160" cy="160" r="16" className="fill-gray-900 dark:fill-white" />

      <circle cx="80" cy="70" r="9" className="fill-orange-400" />
      <circle cx="230" cy="60" r="7" className="fill-indigo-400" />
      <circle cx="270" cy="150" r="8" className="fill-violet-400" />
      <circle cx="250" cy="250" r="7" className="fill-pink-400" />
      <circle cx="150" cy="280" r="9" className="fill-cyan-400" />
      <circle cx="60" cy="240" r="7" className="fill-blue-400" />
      <circle cx="50" cy="150" r="8" className="fill-slate-400" />
    </svg>
  );
}
