'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, MinusCircle, Info } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
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
  const [showLagnaNote, setShowLagnaNote] = useState(false);

  if (factors.length === 0) return null;

  const hasLagnaFactor = factors.some(f => f.factor === 'Lagna');

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
                  {f.factor === 'Lagna' && (
                    <button
                      onClick={() => setShowLagnaNote(v => !v)}
                      className="text-[#8a8478] hover:text-gold-light transition-colors"
                      aria-label="Lagna information"
                      title="What is Lagna?"
                    >
                      <Info size={12} />
                    </button>
                  )}
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

      {hasLagnaFactor && showLagnaNote && (
        <div className="mt-3 p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/15 text-xs text-text-secondary leading-relaxed">
          <span className="font-semibold text-gold-light">
            {locale === 'hi' ? 'लग्न क्या है?' : 'What is Lagna?'}
          </span>{' '}
          {locale === 'hi'
            ? 'लग्न आपकी गतिविधि के आरम्भ में पूर्वी क्षितिज पर उदित राशि है। उचित और बलवान लग्न लघु अशुभ कारकों की क्षतिपूर्ति कर सकता है।'
            : 'Lagna is the zodiac sign rising at the start of your activity. A strong, appropriate lagna can compensate for minor inauspicious factors.'}{' '}
          <Link href="/learn/lagna" className="text-gold-light underline hover:text-gold-primary">
            {locale === 'hi' ? 'और जानें →' : 'Learn more →'}
          </Link>
        </div>
      )}
    </div>
  );
}
