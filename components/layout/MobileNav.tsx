"use client";

import { useState, type ReactNode } from "react";

interface MobileNavProps {
  children: ReactNode;
  toggleLabel: string;
}

// Тримає лише стан відкрито/закрито — сам список посилань рендериться
// сервером (Header.tsx) і передається як children, щоб не дублювати JSX.
export function MobileNav({ children, toggleLabel }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={toggleLabel}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <span className="h-0.5 w-5 bg-current" />
        <span className="h-0.5 w-5 bg-current" />
        <span className="h-0.5 w-5 bg-current" />
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-20 flex justify-center px-4 pt-2">
          <div className="flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-lg dark:border-gray-800 dark:bg-gray-950">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
