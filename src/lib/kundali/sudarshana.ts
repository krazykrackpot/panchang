/**
 * Sudarshana Chakra Dasha Engine
 *
 * Implements the Sudarshana Chakra system as described in BPHS Chapter 22
 * (Sudarshana Chakra Dasha Adhyaya) and elaborated in Jataka Parijata Ch.18.
 *
 * ─── Core Concept ────────────────────────────────────────────────────
 *
 * The Sudarshana Chakra ("auspicious vision wheel") uses THREE concurrent
 * reference points to analyse each year of life:
 *
 *   1. Lagna (Ascendant) — represents the physical body, health, and
 *      outward circumstances. The Lagna sign becomes house 1 of this ring.
 *
 *   2. Chandra (Moon) — represents the mind, emotions, and psychological
 *      experience. The Moon sign becomes house 1 of this ring.
 *
 *   3. Surya (Sun) — represents the soul, authority, and core identity.
 *      The Sun sign becomes house 1 of this ring.
 *
 * ─── Year-Mapping Logic ──────────────────────────────────────────────
 *
 * Each year of life activates one house from each ring in a 12-year cycle:
 *
 *   Age 0 (birth year) → house 1 from each reference
 *   Age 1             → house 2 from each reference
 *   ...
 *   Age 11            → house 12 from each reference
 *   Age 12            → house 1 again (new cycle)
 *   Age 13            → house 2 again
 *   ...and so on for 120 years (10 complete cycles)
 *
 * The activated SIGN for a ring = (startSign - 1 + age % 12) mod 12 + 1.
 *
 * ─── Interpretation ──────────────────────────────────────────────────
 *
 * When all three rings activate the same house type (e.g., all kendras),
 * the effect is strongly amplified. When they diverge, the native
 * experiences mixed influences. The interpretation combines:
 *   - House theme (bhava significations)
 *   - Planets occupying the activated sign in each ring
 *   - Convergence analysis (how aligned the three perspectives are)
 *   - Monthly sub-periods within each year
 *
 * ─── Output ──────────────────────────────────────────────────────────
 *
 * Produces a SudarshanaData structure containing:
 *   - Three ring definitions with all 12 segments and planetary occupants
 *   - Enhanced interpretation for the selected age
 *   - 120-year dasha entry table
 *   - Educational context note for the UI
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

/** Top-level data structure returned by generateSudarshana().
 *  Contains all three rings, interpretation for the selected age,
 *  and the full 120-year dasha entry timeline. */
export interface SudarshanaData {
  /** Birth year extracted from kundali */
  birthYear: number;
  /** Current age of native (can be overridden via slider) */
  currentAge: number;
  /** The three ring definitions — one each for Lagna, Moon, and Sun */
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

/** One of the three concentric rings in the Sudarshana Chakra.
 *  Each ring has 12 segments (one per house counted from its reference sign)
 *  and tracks which segment is "activated" for the selected age. */
export interface RingData {
  label: string; // 'Lagna' | 'Chandra' | 'Surya'
  startSign: number; // 1-12, the rashi where the reference point falls
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
// Classical bhava significations per BPHS Ch.11-12 (Bhava Svarupa).
// Used to annotate the activated house for each ring in the interpretation.

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

/**
 * Main entry point: generates the complete Sudarshana Chakra data for a
 * given kundali and selected age (which may differ from the native's
 * current age when the user drags an age slider).
 *
 * Pipeline:
 *   1. Extract the three reference signs (Lagna, Moon, Sun) from the kundali
 *   2. Build or reuse the 120-year dasha entry table
 *   3. Compute the activated house index for the selected age (age mod 12)
 *   4. Construct three RingData objects with planetary occupancy per sign
 *   5. Build enhanced interpretation (detailed ring analysis, convergence,
 *      monthly sub-periods, Vimshottari dasha overlay, cycle context)
 *   6. Return the assembled SudarshanaData
 */
export function generateSudarshana(
  kundali: KundaliData,
  selectedAge: number,
): SudarshanaData {
  const birthYear = parseInt(kundali.birthData.date.slice(0, 4), 10);
  const ascSign = kundali.ascendant.sign; // Lagna reference sign (1-12)
  const moonSign = kundali.planets.find(p => p.planet.id === 1)?.sign ?? 1; // Chandra reference
  const sunSign = kundali.planets.find(p => p.planet.id === 0)?.sign ?? 1; // Surya reference

  // Use precomputed dasha entries if available, otherwise build them
  const dashaEntries: SudarsanaDashaEntry[] = kundali.sudarsanaDasha ?? buildEntries(ascSign, moonSign, sunSign, birthYear);

  // The 12-year cycle: age 0 → index 0 (house 1), age 11 → index 11 (house 12),
  // age 12 → index 0 again (house 1, second cycle)
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

/**
 * Constructs a single ring (Lagna, Chandra, or Surya) with 12 segments.
 *
 * Each segment corresponds to one house counted from the reference sign:
 *   segment[0] = house 1 = startSign itself
 *   segment[1] = house 2 = startSign + 1
 *   ...
 *   segment[11] = house 12 = startSign + 11 (mod 12)
 *
 * Planets are distributed into segments by matching their natal sign
 * against each segment's signId. This is a whole-sign house system
 * (not Placidus or any cusp-based system), consistent with classical
 * Vedic practice per BPHS Ch.6 and the Sudarshana method.
 */
function buildRing(
  label: string,
  startSign: number,
  activatedIndex: number,
  planets: PlanetPosition[],
): RingData {
  const segments: RingSegment[] = [];

  for (let i = 0; i < 12; i++) {
    // Map house offset i to the actual rashi (sign) ID (1-12, wrapping)
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

/** Creates a HouseTheme object for a given house and sign, used in
 *  per-age interpretation. The safety wrap `(signId - 1 + 12) % 12`
 *  ensures the index stays within [0,11] even with unexpected input. */
function makeTheme(house: number, signId: number): HouseTheme {
  const rashi = RASHIS[(signId - 1 + 12) % 12]; // safety wrap
  return {
    house,
    signId,
    signName: rashi.name,
    theme: HOUSE_THEMES[house] ?? 'Mixed influences',
  };
}

/**
 * Builds a combined prose interpretation from the three activated houses.
 *
 * The heuristic checks for "convergence patterns" — when 2+ of the three
 * rings activate houses of the same category (kendra, trikona, dusthana),
 * the effect is amplified:
 *
 *   - Kendra convergence (houses 1,4,7,10): stability, achievement, visibility
 *   - Trikona convergence (houses 1,5,9): fortune, dharma, creative expression
 *   - Dusthana convergence (houses 6,8,12): challenges, karmic testing
 *
 * Per BPHS Ch.22, simultaneous activation of similar house types across
 * all three charts (Lagna, Chandra, Surya) magnifies the year's theme.
 */
function buildCombinedInterpretation(
  lagna: HouseTheme,
  chandra: HouseTheme,
  surya: HouseTheme,
  age: number,
): string {
  // Build a readable summary from the three activated houses
  const parts: string[] = [];

  // Classify the activated houses to detect convergence patterns
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

/**
 * Builds the full 120-year Sudarshana Dasha entry table.
 *
 * 120 years = 10 complete cycles of 12 houses. For each year:
 *   - offset = age mod 12 (which house in the current cycle)
 *   - The activated sign for each ring = (referenceSign - 1 + offset) mod 12 + 1
 *
 * This table is used for both the timeline view and historical navigation.
 * When the kundali already has precomputed entries (kundali.sudarsanaDasha),
 * this function is not called — see generateSudarshana() above.
 */
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

/** Formats a number with its English ordinal suffix (1st, 2nd, 3rd, 4th...). */
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
