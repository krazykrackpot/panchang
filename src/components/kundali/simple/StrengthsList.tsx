'use client';

import { useState } from 'react';
import type { EvaluatedYoga } from '@/lib/kundali/yoga-engine/types';
import { getYogaPlainName } from '@/lib/constants/yoga-plain-names';
import { tl } from '@/lib/utils/trilingual';
import { ChevronDown } from 'lucide-react';
import RarityBadge from '../RarityBadge';

interface Props {
  evaluatedYogas: EvaluatedYoga[] | undefined;
  locale: string;
}

const STRENGTH_ORDER: Record<string, number> = { Strong: 0, Moderate: 1, Weak: 2 };

/** Keep first 2 sentences but don't strip technical terms — they appear in proper names */
function simplifyDescription(desc: string): string {
  return desc
    .split('.').slice(0, 2).join('.')
    .replace(/\s{2,}/g, ' ')
    .trim() + '.';
}

const STRENGTH_BARS: Record<string, number> = { Strong: 5, Moderate: 3, Weak: 2 };
const STRENGTH_LABEL_EN: Record<string, string> = { Strong: 'Very Strong', Moderate: 'Moderate', Weak: 'Emerging' };
const STRENGTH_LABEL_HI: Record<string, string> = { Strong: 'अत्यन्त प्रबल', Moderate: 'मध्यम', Weak: 'उभरता' };

function StrengthMeter({ strength, locale }: { strength: string; locale: string }) {
  const filled = STRENGTH_BARS[strength] ?? 2;
  const isHi = locale === 'hi' || locale === 'sa';
  const label = (isHi ? STRENGTH_LABEL_HI : STRENGTH_LABEL_EN)[strength] ?? strength;
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 w-3 rounded-full ${i < filled ? 'bg-gold-primary' : 'bg-white/10'}`}
        />
      ))}
      <span className="text-[10px] text-text-secondary ml-1.5">{label}</span>
    </div>
  );
}

function StrengthRow({ yoga, locale }: { yoga: EvaluatedYoga; locale: string }) {
  const [open, setOpen] = useState(false);
  const plainName = getYogaPlainName(yoga.id, tl(yoga.description, 'en'), locale);
  const isHi = locale === 'hi' || locale === 'sa';

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center gap-3 py-2.5 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <p className="text-text-primary text-sm font-medium truncate min-w-0">{plainName}</p>
            <RarityBadge yogaId={yoga.id} locale={locale} compact />
          </div>
          <StrengthMeter strength={yoga.strength} locale={locale} />
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-secondary shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mb-2 text-xs text-text-secondary leading-relaxed bg-white/[0.03] rounded-lg px-3 py-2.5">
          <p className="text-text-primary mb-1">{simplifyDescription(tl(yoga.description, locale))}</p>
          <p className="text-gold-dark/60 text-[10px] mt-1">
            {isHi ? 'शास्त्रीय नाम' : 'Classical name'}: {tl(yoga.name, 'en')}
          </p>
        </div>
      )}
    </div>
  );
}

export default function StrengthsList({ evaluatedYogas, locale }: Props) {
  const isHi = locale === 'hi' || locale === 'sa';
  const auspicious = (evaluatedYogas ?? [])
    .filter((y) => y.present && y.isAuspicious)
    .sort((a, b) => (STRENGTH_ORDER[a.strength] ?? 2) - (STRENGTH_ORDER[b.strength] ?? 2))
    .slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
      <h3 className="text-gold-light font-semibold text-sm mb-1">
        {isHi ? 'आपकी शक्तियाँ' : 'Your Strengths'}
      </h3>
      <p className="text-text-secondary text-xs mb-3">
        {isHi ? 'आपकी कुंडली में स्वाभाविक प्रतिभाएँ' : 'What your chart says you\u2019re naturally good at'}
      </p>

      {auspicious.length === 0 ? (
        <p className="text-text-secondary text-sm">
          {isHi
            ? 'आपकी शक्तियाँ ग्रह स्थिति से आती हैं, शास्त्रीय योग संयोजनों से नहीं।'
            : 'Your strengths come from planetary placements rather than classical yoga combinations.'}
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
