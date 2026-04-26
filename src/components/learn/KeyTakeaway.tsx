'use client';

import { CheckCircle, Sparkles } from 'lucide-react';

interface KeyTakeawayProps {
  points: string[];
  locale: string;
}

const LABELS = {
  en: 'Key Takeaway',
  hi: 'मुख्य बिन्दु',
  ta: 'முக்கிய கருத்து',
  bn: 'মূল বিষয়',
} as const;

export default function KeyTakeaway({ points, locale }: KeyTakeawayProps) {
  const title = LABELS[locale as keyof typeof LABELS] ?? LABELS.en;

  return (
    <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
          {title}
        </h4>
      </div>
      <ul className="space-y-2">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-text-primary leading-relaxed">
            <CheckCircle className="w-4 h-4 text-emerald-500/70 flex-shrink-0 mt-0.5" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
