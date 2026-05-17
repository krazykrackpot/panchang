'use client';

import type { EvaluatedYoga } from '@/lib/kundali/yoga-engine/types';
import { getDoshaGentleText } from '@/lib/constants/dosha-gentle-text';
import { tl } from '@/lib/utils/trilingual';

interface Props {
  evaluatedYogas: EvaluatedYoga[] | undefined;
  locale: string;
}

export default function GrowthAreas({ evaluatedYogas, locale }: Props) {
  const doshas = (evaluatedYogas ?? [])
    .filter((y) => y.present && !y.isAuspicious)
    .slice(0, 3);

  if (doshas.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
        <h3 className="text-gold-light font-semibold text-sm mb-3">Growth Areas</h3>
        <p className="text-text-secondary text-sm">
          Your chart shows a smooth path ahead. No significant growth patterns require attention at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
      <h3 className="text-gold-light font-semibold text-sm mb-3">Growth Areas</h3>
      <div className="space-y-3">
        {doshas.map((yoga) => {
          const gentle = getDoshaGentleText(yoga.id, locale);
          const title = gentle?.title ?? tl(yoga.name, locale);
          const body = gentle?.body ?? tl(yoga.description, locale).split('.')[0] + '. This pattern offers an opportunity for conscious growth.';

          return (
            <div
              key={yoga.id}
              className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3.5"
            >
              <p className="text-amber-400 font-medium text-sm">{title}</p>
              <p className="text-text-primary text-sm mt-1 leading-relaxed">{body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
