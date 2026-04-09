'use client';

import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  status: 'not_started' | 'in_progress' | 'mastered';
  size?: number; // px, default 16
}

export default function ProgressIndicator({ status, size = 16 }: ProgressIndicatorProps) {
  if (status === 'mastered') {
    return (
      <div
        className="rounded-full bg-emerald-500 flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <CheckCircle className="text-[#0a0e27]" style={{ width: size * 0.65, height: size * 0.65 }} />
      </div>
    );
  }

  if (status === 'in_progress') {
    return (
      <div
        className="rounded-full border-2 border-gold-primary shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  // not_started
  return (
    <div
      className="rounded-full border border-white/15 shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
