'use client';

import { useState } from 'react';
import type { EvaluatedYoga } from '@/lib/kundali/yoga-engine/types';
import { getYogaPlainName } from '@/lib/constants/yoga-plain-names';
import { tl } from '@/lib/utils/trilingual';
import { ChevronDown } from 'lucide-react';

interface Props {
  evaluatedYogas: EvaluatedYoga[] | undefined;
  locale: string;
}

const STRENGTH_ORDER: Record<string, number> = { Strong: 0, Moderate: 1, Weak: 2 };

/** Strip house numbers, lord references, and heavy jargon from descriptions */
function simplifyDescription(desc: string): string {
  return desc
    .split('.').slice(0, 2).join('.') // First 2 sentences max
    .replace(/\b\d+(st|nd|rd|th)\s*(house|lord|bhava)/gi, '')
    .replace(/\b(lagna|kendra|trikona|dusthana|upachaya)\s*(lord)?/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim() + '.';
}
const STRENGTH_BARS: Record<string, number> = { Strong: 5, Moderate: 3, Weak: 2 };
const STRENGTH_LABEL: Record<string, string> = { Strong: 'Very Strong', Moderate: 'Moderate', Weak: 'Emerging' };

function StrengthMeter({ strength }: { strength: string }) {
  const filled = STRENGTH_BARS[strength] ?? 2;
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 w-3 rounded-full ${i < filled ? 'bg-gold-primary' : 'bg-white/10'}`}
        />
      ))}
      <span className="text-[10px] text-text-secondary ml-1.5">{STRENGTH_LABEL[strength] ?? strength}</span>
    </div>
  );
}

function StrengthRow({ yoga, locale }: { yoga: EvaluatedYoga; locale: string }) {
  const [open, setOpen] = useState(false);
  const plainName = getYogaPlainName(yoga.id, tl(yoga.description, 'en'), locale);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center gap-3 py-2.5 group"
      >
        <div className="text-lg leading-none">
          {yoga.strength === 'Strong' ? '🔥' : yoga.strength === 'Moderate' ? '✨' : '🌱'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-sm font-medium truncate">{plainName}</p>
          <StrengthMeter strength={yoga.strength} />
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-secondary shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="ml-10 mb-2 text-xs text-text-secondary leading-relaxed bg-white/[0.03] rounded-lg px-3 py-2.5">
          <p className="text-text-primary mb-1">{simplifyDescription(tl(yoga.description, locale))}</p>
          <p className="text-gold-dark/60 text-[10px] mt-1">Classical name: {tl(yoga.name, 'en')}</p>
        </div>
      )}
    </div>
  );
}

export default function StrengthsList({ evaluatedYogas, locale }: Props) {
  const auspicious = (evaluatedYogas ?? [])
    .filter((y) => y.present && y.isAuspicious)
    .sort((a, b) => (STRENGTH_ORDER[a.strength] ?? 2) - (STRENGTH_ORDER[b.strength] ?? 2))
    .slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
      <h3 className="text-gold-light font-semibold text-sm mb-1">Your Strengths</h3>
      <p className="text-text-secondary text-xs mb-3">What your chart says you&rsquo;re naturally good at</p>

      {auspicious.length === 0 ? (
        <p className="text-text-secondary text-sm">
          Your strengths come from planetary placements rather than classical yoga combinations.
        </p>
      ) : (
        <div className="divide-y divide-white/5">
          {auspicious.map((yoga) => (
            <StrengthRow key={yoga.id} yoga={yoga} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
