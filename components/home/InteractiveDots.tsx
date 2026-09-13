"use client";

import { useCallback, useRef } from "react";

// Фонова сітка крапок для Hero: базовий шар — тьмяний, статичний;
// другий, яскравіший шар — той самий патерн, але "проявляється" лише
// навколо курсора через CSS mask (radial-gradient), центр якого слідує за
// мишею через --mx/--my custom properties. Це навмисно без canvas і без
// React-стану на кожен рух миші — властивості виставляються напряму на
// DOM-вузол (element.style.setProperty), тож рух миші не викликає
// ре-рендерів React.
export function InteractiveDots() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 text-gray-300 dark:text-gray-700"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="absolute inset-0 text-gray-500 dark:text-gray-200"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(circle 200px at var(--mx, 50%) var(--my, 50%), black, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle 200px at var(--mx, 50%) var(--my, 50%), black, transparent 100%)",
        }}
      />
    </div>
  );
}
