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
}

// Батько сітки (категорії, картки партнерів/вакансій): анімує дітей
// (StaggerItem) послідовно, з невеликою затримкою одна за одною, коли
// сітка потрапляє у в'юпорт. Самі картки (JobCard/PartnerCard) не
// торкаємось — обгортка живе на рівень вище й не заважає їхньому React.memo.
export function StaggerContainer({ children, className }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
      className={className}
    >
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
