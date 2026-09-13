interface SkeletonLineProps {
  className?: string;
}

export function SkeletonLine({ className = "" }: SkeletonLineProps) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
      aria-hidden="true"
    />
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 p-4 dark:border-gray-800 ${className}`}
      aria-hidden="true"
    >
      <SkeletonLine className="mb-3 h-5 w-2/3" />
      <SkeletonLine className="mb-2 h-4 w-1/3" />
      <SkeletonLine className="h-4 w-1/2" />
    </div>
  );
}
