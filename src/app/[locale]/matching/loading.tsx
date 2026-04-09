import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-10 w-64 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="p-6 rounded-xl border border-gold-primary/10 bg-bg-secondary/20 space-y-4">
            <Skeleton className="h-5 w-32" />
            {[1, 2, 3].map(j => <Skeleton key={j} className="h-12 rounded-lg" />)}
          </div>
        ))}
      </div>
      <Skeleton className="h-12 w-48 mx-auto rounded-xl" />
    </div>
  );
}
