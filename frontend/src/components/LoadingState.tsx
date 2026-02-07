import { Skeleton } from './ui/skeleton';

export const LoadingCard = () => (
  <div className="space-y-3">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex gap-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const LoadingEventsList = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);

export const LoadingTable = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton className="h-12 w-full" />
      </div>
    ))}
  </div>
);
