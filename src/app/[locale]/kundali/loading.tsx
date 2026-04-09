import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-10 w-72 mx-auto" />
      <Skeleton className="h-4 w-48 mx-auto" />
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 rounded-lg" />)}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
