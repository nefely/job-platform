interface LogoProps {
  className?: string;
  title?: string;
}

// Повний lockup "VV Work": іконка-знак + напис в одному inline SVG (не
// растр — узгоджено з рештою сайту: DotBackground, GlowDots, CATEGORY_ICONS
// теж inline). Напис "VV Work" — частина того самого графічного елемента,
// не окремий DOM-текст поруч, тож немає розсинхрону шрифт/трекінг між
// SVG-знаком і рештою.
//
// Знак: пробували строкований VV/W-зигзаг (з вузлами й без) — на реальному
// рендері він губився й читався як щось середнє між метеликом і зубом,
// а не як бренд-знак. Тому знак — це просто жирна літера "W" самим
// шрифтом сайту (system font-rendering дає куди чистіші пропорції/вигини,
// ніж hand-drawn path), у тому ж бейджі, що й раніше.
//
// viewBox навмисно вдвічі більший за типовий розмір рендеру (42px), щоб
// координати лишались круглими числами при промальовуванні деталей; SVG
// сам по собі растрові домовленості про retina не потребує — масштабується
// без втрати чіткості на будь-якій щільності екрана.
export function Logo({ className, title = "VV Work" }: LogoProps) {
  return (
    <svg viewBox="0 0 300 84" role="img" aria-label={title} className={className}>
      <title>{title}</title>

      <rect width="84" height="84" rx="23" className="fill-gray-900 dark:fill-white" />

      <text
        x="42"
        y="44"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="52"
        fontWeight="800"
        style={{ fontFamily: "var(--font-sans, ui-sans-serif, system-ui, sans-serif)" }}
        className="fill-white dark:fill-gray-900"
      >
        W
      </text>

      <text
        x="102"
        y="42"
        dominantBaseline="central"
        fontSize="44"
        fontWeight="700"
        letterSpacing="-1.3"
        style={{ fontFamily: "var(--font-sans, ui-sans-serif, system-ui, sans-serif)" }}
        className="fill-gray-900 dark:fill-white"
      >
        VV Work
      </text>
    </svg>
  );
}
