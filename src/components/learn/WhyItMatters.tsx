'use client';

import { HelpCircle } from 'lucide-react';
import type { ReactNode } from 'react';

interface WhyItMattersProps {
  children: ReactNode;
  locale?: string;
}

const LABELS = {
  en: 'Why this matters',
  hi: 'यह क्यों महत्वपूर्ण है',
  ta: 'ஏன் முக்கியம்',
  bn: 'এটি কেন গুরুত্বপূর্ণ',
} as const;

export default function WhyItMatters({ children, locale = 'en' }: WhyItMattersProps) {
  const title = LABELS[locale as keyof typeof LABELS] ?? LABELS.en;

  return (
    <div className="rounded-xl bg-amber-500/5 border-l-4 border-amber-500/30 px-5 py-4 my-5">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
          {title}
        </span>
      </div>
      <div className="text-sm text-text-primary/85 italic leading-relaxed">
        {children}
      </div>
    </div>
  );
}
