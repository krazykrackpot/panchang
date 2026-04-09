import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-10 w-64 mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 rounded-lg" />)}
      </div>
      <Skeleton className="h-12 w-40 mx-auto rounded-xl" />
    </div>
  );
}
