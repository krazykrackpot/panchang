import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-10 w-72 mx-auto" />
      <Skeleton className="h-6 w-96 mx-auto" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
