"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MobileNavProps {
  children: ReactNode;
  toggleLabel: string;
}

// Тримає лише стан відкрито/закрито — сам список посилань рендериться
// сервером (Header.tsx) і передається як children, щоб не дублювати JSX.
export function MobileNav({ children, toggleLabel }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Клік/тап поза меню або Escape — закриває його.
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={toggleLabel}
        className="relative flex h-10.5 w-10.5 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <span
          className={`h-0.5 w-5 bg-current transition-transform duration-200 ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-5 bg-current transition-opacity duration-200 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-0.5 w-5 bg-current transition-transform duration-200 ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-x-0 top-full z-20 flex flex-col items-center gap-3 border-b border-gray-200 bg-white p-5 text-center shadow-lg dark:border-gray-800 dark:bg-gray-950"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
