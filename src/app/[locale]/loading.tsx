export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center" aria-label="Loading...">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-gold-primary/20" />
          {/* Spinning arc */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-primary animate-spin" />
          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-pulse" />
          </div>
        </div>
        <p className="text-text-secondary text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
