/**
 * Sudarshana Chakra Engine
 *
 * Generates the triple-reference chart data (Lagna / Chandra / Surya)
 * and interpretive text for any given age.
 *
 * Each year, one house from each reference point is "activated":
 *   Year 1 → 1st house, Year 2 → 2nd house, ... Year 13 → 1st house again (cycle of 12)
 *
 * The activated sign = starting sign + (age % 12) offset.
 *
 * Reference: BPHS Ch.22 (Sudarshana Chakra Dasha)
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { SudarsanaDashaEntry } from '@/lib/kundali/additional-dashas';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS, GRAHA_ABBREVIATIONS } from '@/lib/constants/grahas';
import type { LocaleText } from '@/types/panchang';
import {
  type DetailedRingAnalysis,
  type EnhancedInterpretation,
  EDUCATIONAL_NOTE,
  buildDetailedRingAnalysis,
  buildConvergenceNote,
  buildYearDelta,
  deriveFocusAreas,
  buildEnhancedCombined,
  buildMonthlySubPeriods,
  buildDashaContext,
  buildCycleContext,
} from './sudarshana-interpretation';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SudarshanaData {
  /** Birth year extracted from kundali */
  birthYear: number;
  /** Current age of native (can be overridden via slider) */
  currentAge: number;
  /** The three ring definitions */
  lagnaRing: RingData;
  chandraRing: RingData;
  suryaRing: RingData;
  /** Per-age interpretation (enhanced with detailed analysis) */
  interpretation: EnhancedInterpretation;
  /** Educational context for the chart */
  educationalNote: string;
  /** Full 120-year dasha entries (from kundali or computed here) */
  dashaEntries: SudarsanaDashaEntry[];
}

export interface RingData {
  label: string; // 'Lagna' | 'Chandra' | 'Surya'
  startSign: number; // 1-12, the sign of the reference point
  segments: RingSegment[];
  activatedIndex: number; // which segment (0-11) is active for selected age
}

export interface RingSegment {
  houseNumber: number; // 1-12 from reference
  signId: number; // 1-12 rashi
  signName: LocaleText;
  planets: { id: number; abbr: string; name: LocaleText }[];
}

export interface AgeInterpretation {
  age: number;
  lagna: HouseTheme;
  chandra: HouseTheme;
  surya: HouseTheme;
  combined: string; // summary interpretation
}

export interface HouseTheme {
  house: number;
  signId: number;
  signName: LocaleText;
  theme: string;
}

// ─── House themes (English) ─────────────────────────────────────────────────

const HOUSE_THEMES: Record<number, string> = {
  1: 'Self, personality, new beginnings',
  2: 'Wealth, family, speech',
  3: 'Courage, siblings, short journeys',
  4: 'Home, mother, comfort, vehicles',
  5: 'Children, intelligence, creativity',
  6: 'Health, enemies, service',
  7: 'Marriage, partnerships, business',
  8: 'Transformation, longevity, hidden matters',
  9: 'Fortune, dharma, higher learning',
  10: 'Career, status, public life',
  11: 'Gains, social circle, aspirations',
  12: 'Expenses, moksha, foreign lands',
};

// ─── Engine ─────────────────────────────────────────────────────────────────

export function generateSudarshana(
  kundali: KundaliData,
  selectedAge: number,
): SudarshanaData {
  const birthYear = parseInt(kundali.birthData.date.slice(0, 4), 10);
  const ascSign = kundali.ascendant.sign;
  const moonSign = kundali.planets.find(p => p.planet.id === 1)?.sign ?? 1;
  const sunSign = kundali.planets.find(p => p.planet.id === 0)?.sign ?? 1;

  // Use precomputed dasha entries if available, otherwise build them
  const dashaEntries: SudarsanaDashaEntry[] = kundali.sudarsanaDasha ?? buildEntries(ascSign, moonSign, sunSign, birthYear);

  const activatedIndex = selectedAge % 12; // 0-11

  // Build ring data
  const lagnaRing = buildRing('Lagna', ascSign, activatedIndex, kundali.planets);
  const chandraRing = buildRing('Chandra', moonSign, activatedIndex, kundali.planets);
  const suryaRing = buildRing('Surya', sunSign, activatedIndex, kundali.planets);

  // Enhanced interpretation for the selected age
  const activatedHouse = (selectedAge % 12) + 1; // 1-indexed house from reference

  const lagnaAnalysis = buildDetailedRingAnalysis('Lagna', ascSign, activatedHouse, kundali.planets);
  const chandraAnalysis = buildDetailedRingAnalysis('Chandra', moonSign, activatedHouse, kundali.planets);
  const suryaAnalysis = buildDetailedRingAnalysis('Surya', sunSign, activatedHouse, kundali.planets);

  const combined = buildEnhancedCombined(lagnaAnalysis, chandraAnalysis, suryaAnalysis, selectedAge);
  const convergenceNote = buildConvergenceNote(lagnaAnalysis, chandraAnalysis, suryaAnalysis);
  const yearDelta = buildYearDelta(selectedAge, lagnaAnalysis, chandraAnalysis, suryaAnalysis);
  const focusAreas = deriveFocusAreas(lagnaAnalysis, chandraAnalysis, suryaAnalysis);
  const monthlySubPeriods = buildMonthlySubPeriods(lagnaAnalysis);
  const dashaContext = buildDashaContext(kundali.dashas ?? [], birthYear, selectedAge);
  const cycleContext = buildCycleContext(selectedAge);

  return {
    birthYear,
    currentAge: selectedAge,
    lagnaRing,
    chandraRing,
    suryaRing,
    interpretation: {
      age: selectedAge,
      lagna: lagnaAnalysis,
      chandra: chandraAnalysis,
      surya: suryaAnalysis,
      combined,
      convergenceNote,
      yearDelta,
      focusAreas,
      monthlySubPeriods,
      dashaContext,
      cycleContext,
    },
    educationalNote: EDUCATIONAL_NOTE,
    dashaEntries,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildRing(
  label: string,
  startSign: number,
  activatedIndex: number,
  planets: PlanetPosition[],
): RingData {
  const segments: RingSegment[] = [];

  for (let i = 0; i < 12; i++) {
    const signId = ((startSign - 1 + i) % 12) + 1;
    const rashi = RASHIS[signId - 1];

    // Find planets in this sign
    const planetsInSign = planets
      .filter(p => p.sign === signId)
      .map(p => ({
        id: p.planet.id,
        abbr: GRAHA_ABBREVIATIONS[p.planet.id] ?? '??',
        name: p.planet.name,
      }));

    segments.push({
      houseNumber: i + 1,
      signId,
      signName: rashi.name,
      planets: planetsInSign,
    });
  }

  return { label, startSign, segments, activatedIndex };
}

function makeTheme(house: number, signId: number): HouseTheme {
  const rashi = RASHIS[(signId - 1 + 12) % 12]; // safety wrap
  return {
    house,
    signId,
    signName: rashi.name,
    theme: HOUSE_THEMES[house] ?? 'Mixed influences',
  };
}

function buildCombinedInterpretation(
  lagna: HouseTheme,
  chandra: HouseTheme,
  surya: HouseTheme,
  age: number,
): string {
  // Build a readable summary from the three activated houses
  const parts: string[] = [];

  // Highlight dominant themes
  const houses = [lagna.house, chandra.house, surya.house];
  const kendraCoverage = houses.filter(h => [1, 4, 7, 10].includes(h)).length;
  const trikonaCoverage = houses.filter(h => [1, 5, 9].includes(h)).length;
  const dusthanaCoverage = houses.filter(h => [6, 8, 12].includes(h)).length;

  if (kendraCoverage >= 2) {
    parts.push('Strong kendra activation — period of stability, achievement, and public recognition.');
  }
  if (trikonaCoverage >= 2) {
    parts.push('Trikona houses active — auspicious for fortune, dharma, and creative expression.');
  }
  if (dusthanaCoverage >= 2) {
    parts.push('Multiple dusthana houses active — period of challenges requiring patience and inner work.');
  }

  // Per-ring theme brief
  parts.push(`Lagna (${ordinal(lagna.house)} house): ${lagna.theme}.`);
  parts.push(`Chandra (${ordinal(chandra.house)} house): ${chandra.theme}.`);
  parts.push(`Surya (${ordinal(surya.house)} house): ${surya.theme}.`);

  return parts.join(' ');
}

function buildEntries(
  ascSign: number,
  moonSign: number,
  sunSign: number,
  birthYear: number,
): SudarsanaDashaEntry[] {
  const entries: SudarsanaDashaEntry[] = [];
  for (let age = 0; age < 120; age++) {
    const offset = age % 12;
    entries.push({
      year: birthYear + age,
      age,
      lagnaHouse: offset + 1,
      lagnaSign: ((ascSign - 1 + offset) % 12) + 1,
      moonHouse: offset + 1,
      moonSign: ((moonSign - 1 + offset) % 12) + 1,
      sunHouse: offset + 1,
      sunSign: ((sunSign - 1 + offset) % 12) + 1,
    });
  }
  return entries;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
