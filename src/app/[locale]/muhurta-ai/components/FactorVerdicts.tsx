'use client';

import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import type { FactorVerdict } from '@/types/muhurta-ai';

interface FactorVerdictsProps {
  factors: FactorVerdict[];
  locale: string;
}

const VERDICT_ICON = {
  good: CheckCircle2,
  bad: XCircle,
  neutral: MinusCircle,
} as const;

const VERDICT_ICON_COLOUR = {
  good: 'text-emerald-400',
  bad: 'text-red-400',
  neutral: 'text-text-secondary',
} as const;

const VERDICT_ROW_STYLE = {
  good: 'bg-emerald-500/8 border-emerald-500/15',
  bad: 'bg-red-500/8 border-red-500/15',
  neutral: 'bg-white/[0.02] border-white/5',
} as const;

export default function FactorVerdicts({
  factors,
  locale,
}: FactorVerdictsProps) {
  if (factors.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 sm:p-6">
      <h3 className="text-xs text-gold-dark font-bold uppercase tracking-widest mb-4">
        {locale === 'hi' ? 'पंचांग कारक विश्लेषण' : 'Panchanga Factor Analysis'}
      </h3>

      <div className="space-y-2">
        {factors.map((f, i) => {
          const Icon = VERDICT_ICON[f.verdict];
          return (
            <div
              key={i}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${VERDICT_ROW_STYLE[f.verdict]}`}
            >
              <Icon
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${VERDICT_ICON_COLOUR[f.verdict]}`}
              />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-gold-dark text-xs font-semibold uppercase tracking-wider">
                    {f.factor}
                  </span>
                  <span className="text-text-primary text-sm font-medium">
                    {f.value}
                  </span>
                </div>
                <p className="text-text-secondary text-sm mt-0.5">
                  {f.reason}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
