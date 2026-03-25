'use client';

export default function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <div className="gold-divider flex-1 max-w-xs" />
      <div className="mx-4 text-gold-primary text-lg">&#10043;</div>
      <div className="gold-divider flex-1 max-w-xs" />
    </div>
  );
}
