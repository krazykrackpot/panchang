import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <Skeleton className="h-10 w-64 mx-auto" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
      </div>
    </div>
  );
}
