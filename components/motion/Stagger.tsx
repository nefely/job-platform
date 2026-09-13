"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * true (за замовчуванням) — анімація прив'язана до скролу (whileInView +
   * once: true): підходить для статичних секцій головної сторінки, що
   * з'являються один раз і більше не змінюються.
   * false — анімація завжди програється при кожній зміні дітей (звичайний
   * `animate`, без прив'язки до в'юпорта). Обов'язково для списків, вміст
   * яких може змінюватись у часі (фільтри): з `once: true` нові елементи,
   * додані ПІСЛЯ першого спрацювання, назавжди застрягали б у "hidden"
   * (opacity: 0) — реально в DOM і в CSS-гріді, просто невидимі.
   */
  viewportTriggered?: boolean;
}

// Батько сітки (категорії, картки партнерів/вакансій): анімує дітей
// (StaggerItem) послідовно, з невеликою затримкою одна за одною. Самі
// картки (JobCard/PartnerCard) не торкаємось — обгортка живе на рівень
// вище й не заважає їхньому React.memo.
export function StaggerContainer({
  children,
  className,
  viewportTriggered = true,
}: StaggerContainerProps) {
  const triggerProps = viewportTriggered
    ? { whileInView: "show" as const, viewport: { once: true, margin: "-60px" } }
    : { animate: "show" as const };

  return (
    <motion.div initial="hidden" variants={containerVariants} className={className} {...triggerProps}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: StaggerContainerProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
