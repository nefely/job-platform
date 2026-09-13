import type { CategoryId } from "@/types/category";

// Прості inline SVG-іконки (без сторонньої бібліотеки іконок) — по одній
// на категорію, той самий stroke-стиль (2px, round), що й решта іконок у
// проєкті (фільтри, мобільне меню). Використовуються в CategoryGrid.
export const CATEGORY_ICONS: Record<CategoryId, React.ReactNode> = {
  construction: (
    <>
      <path d="M3 21h18" />
      <path d="M12 3 3 10h18L12 3Z" />
      <path d="M6 10v11M18 10v11" />
      <path d="M9 15h6" />
    </>
  ),
  manufacturing: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  logistics: (
    <>
      <rect x="1" y="7" width="13" height="9" rx="1" />
      <path d="M14 10h4l3 3v3h-3" />
      <circle cx="6" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </>
  ),
  hospitality: (
    <>
      <path d="M2 20v-6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6" />
      <path d="M2 14h20" />
      <circle cx="7" cy="8" r="2" />
    </>
  ),
  it: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <path d="M2 20h20" />
    </>
  ),
  drivers: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 3v7M4.2 16.5 10 13M19.8 16.5 14 13" />
    </>
  ),
  other: (
    <>
      <circle cx="5" cy="5" r="1.4" />
      <circle cx="12" cy="5" r="1.4" />
      <circle cx="19" cy="5" r="1.4" />
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
      <circle cx="5" cy="19" r="1.4" />
      <circle cx="12" cy="19" r="1.4" />
      <circle cx="19" cy="19" r="1.4" />
    </>
  ),
};
