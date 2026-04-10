import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <Skeleton className="h-10 w-80 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
      <div className="space-y-4 mt-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-6 rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
            <Skeleton className="h-5 w-48 mb-3" />
            <SkeletonText lines={3} />
          </div>
        ))}
      </div>
    </div>
  );
}
