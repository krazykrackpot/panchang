'use client';

import type { EvaluatedYoga } from '@/lib/kundali/yoga-engine/types';
import { getYogaPlainName } from '@/lib/constants/yoga-plain-names';
import { tl } from '@/lib/utils/trilingual';

interface Props {
  evaluatedYogas: EvaluatedYoga[] | undefined;
  locale: string;
}

const STRENGTH_ORDER: Record<string, number> = { Strong: 0, Moderate: 1, Weak: 2 };

export default function StrengthsList({ evaluatedYogas, locale }: Props) {
  const auspicious = (evaluatedYogas ?? [])
    .filter((y) => y.present && y.isAuspicious)
    .sort((a, b) => (STRENGTH_ORDER[a.strength] ?? 2) - (STRENGTH_ORDER[b.strength] ?? 2))
    .slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
      <h3 className="text-gold-light font-semibold text-sm mb-3">Your Strengths</h3>

      {auspicious.length === 0 ? (
        <p className="text-text-secondary text-sm">
          Your chart&rsquo;s strengths emerge through planetary placements and house lords rather than classical yogas.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {auspicious.map((yoga) => {
            const plainName = getYogaPlainName(yoga.id, tl(yoga.description, 'en'), locale);
            const firstSentence = tl(yoga.description, locale).split('.')[0] + '.';

            return (
              <li key={yoga.id} className="text-sm leading-relaxed">
                <span className="text-gold-light mr-1.5">{'\u2726'}</span>
                <span className="text-gold-light font-medium">{plainName}</span>
                <span className="text-text-secondary"> &mdash; </span>
                <span className="text-text-primary">{firstSentence}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
