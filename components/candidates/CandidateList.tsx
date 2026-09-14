"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Candidate } from "@/types/candidate";
import { CandidateCard } from "./CandidateCard";

interface CandidateListProps {
  candidates: Candidate[];
}

function CandidateListComponent({ candidates }: CandidateListProps) {
  const t = useTranslations("candidates");

  if (candidates.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">{t("emptyState")}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Той самий підхід, що й JobList: AnimatePresence+layout реагує на
          КОЖНУ зміну candidates (пошук/фільтри), а не лише перший рендер —
          картки плавно з'являються/зникають під час фільтрації.
          CandidateCard лишається немодифікованим (React.memo). */}
      <AnimatePresence mode="popLayout">
        {candidates.map((candidate) => (
          <motion.div
            key={candidate.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <CandidateCard candidate={candidate} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export const CandidateList = memo(CandidateListComponent);
