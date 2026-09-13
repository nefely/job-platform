"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Проста поява "знизу-вгору + прозорість" при попаданні елемента у
// в'юпорт. `once: true` — анімується лише один раз за сесію (не тригериться
// повторно при скролі назад-вперед). Server-рендерений children (Hero,
// секції на головній) можна передавати сюди без проблем — client-обгортка
// не заважає серверному рендерингу самого вмісту.
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
