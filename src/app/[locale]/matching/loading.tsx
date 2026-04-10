import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-10 w-64 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="p-6 rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] space-y-4">
            <Skeleton className="h-5 w-32" />
            {[1, 2, 3].map(j => <Skeleton key={j} className="h-12 rounded-lg" />)}
          </div>
        ))}
      </div>
      <Skeleton className="h-12 w-48 mx-auto rounded-xl" />
    </div>
  );
}
