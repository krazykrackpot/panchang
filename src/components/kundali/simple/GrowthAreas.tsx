'use client';

import { useState } from 'react';
import type { EvaluatedYoga } from '@/lib/kundali/yoga-engine/types';
import { getDoshaGentleText } from '@/lib/constants/dosha-gentle-text';
import { tl } from '@/lib/utils/trilingual';
import { ChevronDown } from 'lucide-react';

interface Props {
  evaluatedYogas: EvaluatedYoga[] | undefined;
  locale: string;
}

function GrowthRow({ yoga, locale }: { yoga: EvaluatedYoga; locale: string }) {
  const [open, setOpen] = useState(false);
  const isHi = locale === 'hi' || locale === 'sa';
  const gentle = getDoshaGentleText(yoga.id, locale);
  const title = gentle?.title ?? tl(yoga.name, locale);
  const body = gentle?.body ?? tl(yoga.description, locale).split('.')[0] + '.';

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center gap-3 py-2.5 group"
      >
        <div className="flex-1 min-w-0">
          <p className="text-amber-300 text-sm font-medium">{title}</p>
          <p className="text-text-secondary text-xs mt-0.5">
            {isHi ? 'और जानें' : 'Tap to learn more'}
          </p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-secondary shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mb-2 text-sm text-text-primary leading-relaxed bg-amber-500/[0.04] border border-amber-500/10 rounded-lg px-3 py-2.5">
          <p>{body}</p>
        </div>
      )}
    </div>
  );
}

export default function GrowthAreas({ evaluatedYogas, locale }: Props) {
  const isHi = locale === 'hi' || locale === 'sa';
  const doshas = (evaluatedYogas ?? [])
    .filter((y) => y.present && !y.isAuspicious)
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
      <h3 className="text-gold-light font-semibold text-sm mb-1">
        {isHi ? 'विकास के क्षेत्र' : 'Growth Areas'}
      </h3>
      <p className="text-text-secondary text-xs mb-3">
        {isHi ? 'ध्यान देने योग्य प्रवृत्तियाँ — भविष्यवाणी नहीं' : 'Patterns to be aware of \u2014 not predictions, just tendencies'}
      </p>

      {doshas.length === 0 ? (
        <p className="text-text-secondary text-sm">
          {isHi
            ? 'कोई विशेष विकास प्रवृत्ति नहीं मिली। आपकी कुंडली सुगम मार्ग दिखाती है।'
            : 'No significant growth patterns found. Your chart shows a smooth path ahead.'}
        </p>
      ) : (
        <div className="divide-y divide-white/5">
          {doshas.map((yoga) => (
            <GrowthRow key={yoga.id} yoga={yoga} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
