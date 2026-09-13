"use client";

import { useEffect, useRef } from "react";

const MOVE_DURATION_MS = 4000;

// Автономне "світло" без миші: періодично обирає нову випадкову точку (у
// відсотках 0–100, без getBoundingClientRect/ResizeObserver — тому немає
// жодного виміру контейнера, який ламав layout минулого разу) і плавно
// їде до неї. Яскравіший шар тієї ж крапкової сітки проявляється лише
// навколо цієї точки через CSS mask. Проста rAF-петля пише два CSS
// custom properties (--gx/--gy) напряму на DOM-вузол — жодного React-стану
// й ре-рендерів на кадр, Hero.tsx лишається без змін (цей компонент —
// звичайний absolute-сиблінг, як і DotBackground).
export function GlowDots() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;
    let from = { x: Math.random() * 100, y: Math.random() * 100 };
    let to = { x: Math.random() * 100, y: Math.random() * 100 };
    let start = performance.now();

    function pickNextTarget() {
      from = to;
      to = { x: Math.random() * 100, y: Math.random() * 100 };
      start = performance.now();
    }

    function tick(now: number) {
      const t = Math.min((now - start) / MOVE_DURATION_MS, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const x = from.x + (to.x - from.x) * eased;
      const y = from.y + (to.y - from.y) * eased;
      el!.style.setProperty("--gx", `${x}%`);
      el!.style.setProperty("--gy", `${y}%`);

      if (t >= 1) pickNextTarget();
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 text-gray-500 dark:text-gray-200"
      style={{
        backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(circle 180px at var(--gx, 50%) var(--gy, 50%), black, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(circle 180px at var(--gx, 50%) var(--gy, 50%), black, transparent 100%)",
      }}
    />
  );
}
