'use client';

import type { Locale } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Dasha lord to planet key mapping
// ---------------------------------------------------------------------------
const DASHA_PLANET_FESTIVALS: Record<string, string[]> = {
  sun: ['makar-sankranti', 'chhath-puja', 'ratha-saptami'],
  moon: ['karva-chauth', 'sharad-purnima'],
  mars: ['hanuman-jayanti'],
  mercury: ['budh-purnima'],
  jupiter: ['guru-purnima'],
  venus: ['vasant-panchami'],
  saturn: ['maha-shivaratri', 'pradosham', 'pradosham-shukla', 'pradosham-krishna'],
  rahu: ['nag-panchami'],
  ketu: ['ganesh-chaturthi', 'sankashti-chaturthi-shukla'],
};

// ---------------------------------------------------------------------------
// Tithi number extraction from festival slug/category
// ---------------------------------------------------------------------------
const TITHI_CATEGORY_MAP: Record<string, number> = {
  chaturthi: 4,
  panchami: 5,
  shashthi: 6,
  saptami: 7,
  ashtami: 8,
  navami: 9,
  dashami: 10,
  ekadashi: 11,
  dwadashi: 12,
  trayodashi: 13,
  purnima: 15,
  amavasya: 30,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface RelevanceMatch {
  type: 'birth-tithi' | 'janma-nakshatra' | 'dasha-festival';
  label: { en: string; hi: string };
}

export interface PersonalRelevanceData {
  birthNakshatra: number;  // 1-27, 0 = not set
  birthRashi: number;      // 1-12, 0 = not set
  birthTithi?: number;     // 1-30, optional
  currentDashaPlanet?: string; // e.g. 'jupiter', 'saturn'
}

// ---------------------------------------------------------------------------
// Matching logic
// ---------------------------------------------------------------------------
export function computeRelevance(
  festivalSlug: string | undefined,
  festivalCategory: string,
  festivalNakshatra?: number,
  personalData?: PersonalRelevanceData | null,
): RelevanceMatch[] {
  if (!personalData || (!personalData.birthNakshatra && !personalData.birthRashi)) return [];

  const matches: RelevanceMatch[] = [];

  // 1. Birth tithi match
  if (personalData.birthTithi && personalData.birthTithi > 0) {
    const festivalTithi = TITHI_CATEGORY_MAP[festivalCategory];
    if (festivalTithi && festivalTithi === personalData.birthTithi) {
      matches.push({
        type: 'birth-tithi',
        label: {
          en: 'Birth Tithi match',
          hi: 'जन्म तिथि मेल',
        },
      });
    }
  }

  // 2. Janma Nakshatra match (if festival has associated nakshatra)
  if (personalData.birthNakshatra > 0 && festivalNakshatra && festivalNakshatra === personalData.birthNakshatra) {
    matches.push({
      type: 'janma-nakshatra',
      label: {
        en: 'Janma Nakshatra',
        hi: 'जन्म नक्षत्र',
      },
    });
  }

  // 3. Dasha lord festival match
  if (personalData.currentDashaPlanet) {
    const planet = personalData.currentDashaPlanet.toLowerCase();
    const relevantFestivals = DASHA_PLANET_FESTIVALS[planet] || [];
    if (festivalSlug && relevantFestivals.includes(festivalSlug)) {
      const planetLabel = planet.charAt(0).toUpperCase() + planet.slice(1);
      const planetLabelHi: Record<string, string> = {
        sun: 'सूर्य', moon: 'चन्द्र', mars: 'मंगल', mercury: 'बुध',
        jupiter: 'गुरु', venus: 'शुक्र', saturn: 'शनि', rahu: 'राहु', ketu: 'केतु',
      };
      matches.push({
        type: 'dasha-festival',
        label: {
          en: `Active in your ${planetLabel} Dasha`,
          hi: `आपकी ${planetLabelHi[planet] || planetLabel} दशा में सक्रिय`,
        },
      });
    }
  }

  return matches;
}

// ---------------------------------------------------------------------------
// Badge Component
// ---------------------------------------------------------------------------
interface PersonalRelevanceBadgeProps {
  matches: RelevanceMatch[];
  locale: Locale;
}

export default function PersonalRelevanceBadge({ matches, locale }: PersonalRelevanceBadgeProps) {
  if (matches.length === 0) return null;

  const isHi = locale !== 'en';
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  // Show the first (most important) match as a badge
  const primary = matches[0];

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 font-bold shrink-0 whitespace-nowrap"
      style={bodyFont}
      title={matches.map(m => (isHi ? m.label.hi : m.label.en)).join(' | ')}
    >
      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 fill-current" aria-hidden="true">
        <path d="M6 0l1.76 3.57L12 4.14 8.88 7.13l.74 4.31L6 9.27 2.38 11.44l.74-4.31L0 4.14l4.24-.57z" />
      </svg>
      {isHi ? primary.label.hi : primary.label.en}
    </span>
  );
}
