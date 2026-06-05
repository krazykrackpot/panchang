import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-10 w-72 mx-auto" />
      <Skeleton className="h-6 w-96 mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <Skeleton className="h-14 w-48 mx-auto rounded-xl" />
    </div>
  );
}
