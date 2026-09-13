"use client";

import { memo } from "react";
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
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export const JobList = memo(JobListComponent);
