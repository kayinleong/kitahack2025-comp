import { Suspense } from "react";
import JobList from "@/components/job-list";
import JobFilters from "@/components/job-filters";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsPage({
  searchParams,
}: {
  searchParams?: {
    remote?: string;
    minSalary?: string;
    maxSalary?: string;
  };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Next Opportunity</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <JobFilters />
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={<JobListSkeleton />}>
            <JobList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function JobListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex flex-wrap gap-2 mt-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
    </div>
  );
}
