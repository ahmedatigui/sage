import { Skeleton } from '@/components/ui/skeleton';

export function ResponseSkeleton() {
  return (
    <div className="flex flex-col space-y-3 gap-4 p-4 mt-8">
      <div className="flex gap-2 overflow-x-auto">
        <Skeleton className="h-[5rem] w-[25%] rounded-xl" />
        <Skeleton className="h-[5rem] w-[25%] rounded-xl" />
        <Skeleton className="h-[5rem] w-[25%] rounded-xl" />
        <Skeleton className="h-[5rem] w-[25%] rounded-xl" />
        <Skeleton className="h-[5rem] w-[25%] rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-[25%] mb-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[69%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[47%]" />
      </div>
    </div>
  );
}
