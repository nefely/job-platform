"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Job } from "@/types/job";
import { JobCard } from "./JobCard";

interface JobListProps {
  jobs: Job[];
}

function JobListComponent({ jobs }: JobListProps) {
  const t = useTranslations("jobs");

  if (jobs.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">{t("emptyState")}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* На відміну від StaggerContainer (одноразова поява при скролі),
          тут AnimatePresence+layout навмисно реагує на КОЖНУ зміну jobs —
          пошук/фільтри — щоб картки, які зникають/з'являються, анімувались,
          а не миттєво стрибали. JobCard лишається немодифікованим
          (React.memo), огортка суто в JobList. */}
      <AnimatePresence mode="popLayout">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <JobCard job={job} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export const JobList = memo(JobListComponent);
