// src/lib/kundali/health-diagnosis/signatures.ts
//
// Signature Detectors Registry
//
// A centralised map of classical Jyotish yoga / dosha signature detectors for
// use by per-element health scorers. Detectors are pure functions of KundaliData
// — no side effects. Two source groups:
//
//   1. Adapted from DISEASE_PATTERNS in @/lib/medical/constants (8 patterns).
//   2. Additional signatures defined here: kemadruma, pisaca,
//      mars_rahu_accident, saturn_rahu_malignancy, nervous_system_vata (alias).
//
// Canonical import rule (CLAUDE.md "NEVER Duplicate Logic or Constants"):
//   SIGN_LORD is NOT imported here — it is not needed directly in this file.
//   computeBodyMap (used by the DISEASE_PATTERNS adapter) internally uses
//   @/lib/medical/constants#SIGN_LORD, which is left in place pending Phase E
//   migration. Any future use of a house-lord lookup in this file MUST import
//   SIGN_LORDS from @/lib/constants/dignities (not @/lib/medical/constants).

import type { KundaliData } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import { DISEASE_PATTERNS, NATURAL_BENEFICS } from '@/lib/kundali/health-diagnosis/legacy/constants';
import { computeBodyMap } from '@/lib/kundali/health-diagnosis/legacy/body-map';
import { detectAllYogas } from '@/lib/kundali/yogas-complete';
import type { ElementId } from './types';
import { PLANET_IDS } from '@/lib/constants/grahas';

// ─── Public types ────────────────────────────────────────────────────────────

export interface SignatureDef {
  id: string;
  name: LocaleText;
  /** Classical citation, e.g. 'BPHS-24', 'Saravali-5'. */
  source: string;
  /**
   * Element ids this signature contributes to.
   * NOTE: saturn_rahu_malignancy affects ONLY 'cancer' — never 'chronic'.
   * This is intentional per spec §4.21 (opt-in cancer element only).
   */
  elementsAffected: ElementId[];
  /**
   * Score direction for the yogaSignatureContribution helper in scoring-utils.ts.
   *
   *   'risk'       — a match LOWERS resilience (0 when matched, 100 when absent).
   *   'protective' — a match RAISES resilience (100 when matched, 0 when absent).
   *
   * All currently-registered signatures are risk signals (per BPHS, Saravali, etc.
   * — they represent pathological yogas/patterns, not beneficial ones).
   */
  direction: 'risk' | 'protective';
  detect: (k: KundaliData) => boolean;
}

// ─── Registry ────────────────────────────────────────────────────────────────

export const SIGNATURE_REGISTRY: Record<string, SignatureDef> = {};

// ── Helper ────────────────────────────────────────────────────────────────────

/** Returns the house number for a planet by ID, or undefined if not found. */
function planetHouse(k: KundaliData, pid: number): number | undefined {
  return k.planets.find(p => p.planet.id === pid)?.house;
}

// ── Adapt the 8 existing disease patterns from medical/constants.ts ──────────

for (const dp of DISEASE_PATTERNS) {
  SIGNATURE_REGISTRY[dp.id] = {
    id: dp.id,
    // hi falls back to en until full i18n strings land in Phase D
    name: { en: dp.name, hi: dp.name },
    source: 'BPHS-24',
    elementsAffected: mapPatternToElements(dp.id),
    // All DISEASE_PATTERNS are pathological risk indicators — a match lowers resilience.
    direction: 'risk',
    detect: (k: KundaliData) => {
      // Build the DiseasePatternCtx that DISEASE_PATTERNS.detect() expects,
      // re-using computeBodyMap the same way disease-profile.ts does.
      const bm = computeBodyMap(k);
      const planetHouseMap = new Map<number, number>();
      const planetSignMap = new Map<number, number>();
      const combustMap = new Map<number, boolean>();
      const debilMap = new Map<number, boolean>();
      const retroMap = new Map<number, boolean>();
      for (const p of k.planets) {
        planetHouseMap.set(p.planet.id, p.house);
        planetSignMap.set(p.planet.id, p.sign);
        combustMap.set(p.planet.id, p.isCombust);
        debilMap.set(p.planet.id, p.isDebilitated);
        retroMap.set(p.planet.id, p.isRetrograde);
      }
      try {
        return dp.detect({
          houseVulnerability: bm.map(r => r.vulnerability),
          planetHouse: planetHouseMap,
          planetSign: planetSignMap,
          planetCombust: combustMap,
          planetDebilitated: debilMap,
          planetRetrograde: retroMap,
          lagnaSign: k.ascendant.sign,
        });
      } catch (err) {
        console.error('[health-diagnosis/signatures] detect failed for', dp.id, err);
        return false;
      }
    },
  };
}

/** Map a DISEASE_PATTERNS id to the ElementIds it influences. */
function mapPatternToElements(id: string): ElementId[] {
  switch (id) {
    case 'cardiac_risk':       return ['cardiac'];
    case 'anxiety_mental':     return ['mental', 'psychiatric'];
    case 'chronic_digestive':  return ['digestive', 'chronic'];
    case 'urogenital':         return ['reproductive'];
    case 'chronic_hidden':     return ['chronic'];
    case 'nervous_system':     return ['nervous'];
    case 'respiratory':        return ['respiratory'];
    case 'eye_sleep':          return ['eyes', 'sleep'];
    default:                   return [];
  }
}

// ── Additional signatures not in medical/constants.ts ────────────────────────

/**
 * nervous_system_vata — alias for nervous_system.
 * The alias preserves the Ayurvedic naming convention used by element scorers
 * that look up by this id, while the underlying detection logic is shared.
 */
SIGNATURE_REGISTRY['nervous_system_vata'] = {
  ...SIGNATURE_REGISTRY['nervous_system'],
  id: 'nervous_system_vata',
};

/**
 * Kemadruma Yoga — delegated to the canonical detectAllYogas() engine in
 * yogas-complete.ts, which checks the three BPHS cancellation conditions:
 *   1. Moon in kendra (1/4/7/10) from lagna cancels it
 *   2. Any planet conjunct Moon (same house) cancels it
 *   3. Jupiter aspecting Moon (houses 1/5/7/9 from Jupiter) cancels it
 *
 * The previous local detector was missing all three cancellation conditions,
 * creating a third divergent implementation. Delegates here per CLAUDE.md Rule S
 * ("canonical BPHS tables must be defined ONCE and cross-checked against ALL
 * consumers").
 */
SIGNATURE_REGISTRY['kemadruma'] = {
  id: 'kemadruma',
  name: { en: 'Kemadruma Yoga', hi: 'केमद्रुम योग' },
  source: 'BPHS-Kemadruma',
  elementsAffected: ['mental', 'psychiatric'],
  direction: 'risk',
  detect: (k: KundaliData) => {
    try {
      // Map KundaliData PlanetPosition[] → yogas-complete PlanetData[]
      const planetData = k.planets.map(p => ({
        id: p.planet.id,
        longitude: p.longitude,
        house: p.house,
        sign: p.sign,
        speed: p.speed,
        isRetrograde: p.isRetrograde,
        isExalted: p.isExalted,
        isDebilitated: p.isDebilitated,
        isOwnSign: p.isOwnSign,
        navamshaSign: p.navamshaSign,
        isPushkarNavamsha: p.isPushkarNavamsha,
      }));
      const yogas = detectAllYogas(planetData, k.ascendant.sign);
      return yogas.find(y => y.id === 'kemadruma')?.present ?? false;
    } catch (err) {
      console.error('[health-diagnosis/signatures] kemadruma delegation failed:', err);
      return false;
    }
  },
};

/**
 * Pisaca Yoga — Moon conjunct Rahu (same sign) with no benefic aspecting Moon.
 * Classical indicator of severe psychiatric / possession vulnerability (Saravali).
 * Benefics checked: Mercury (3), Jupiter (4), Venus (5).
 * Aspect houses checked: 1st, 5th, 7th, 9th from Moon (standard full aspect + trines).
 */
SIGNATURE_REGISTRY['pisaca'] = {
  id: 'pisaca',
  name: { en: 'Pisaca Yoga', hi: 'पिशाच योग' },
  source: 'Saravali',
  elementsAffected: ['psychiatric'],
  direction: 'risk',
  detect: (k: KundaliData) => {
    const moon = k.planets.find(p => p.planet.id === PLANET_IDS.MOON);
    const rahu = k.planets.find(p => p.planet.id === PLANET_IDS.RAHU);
    if (!moon || !rahu) return false;
    // Moon and Rahu must be in the same sign
    if (moon.sign !== rahu.sign) return false;
    // No natural benefic aspecting Moon (aspect houses: same house + 5th, 7th, 9th from Moon)
    const moonHouse = moon.house;
    const aspectHouses = [
      moonHouse,
      ((moonHouse - 1 + 4) % 12) + 1,  // 5th from Moon
      ((moonHouse - 1 + 6) % 12) + 1,  // 7th from Moon
      ((moonHouse - 1 + 8) % 12) + 1,  // 9th from Moon
    ];
    // N2 audit fix: import NATURAL_BENEFICS from legacy/constants instead of inline magic
    // numbers [3, 4, 5]. Canonical source: NATURAL_BENEFICS = {1,3,4,5} (Moon/Mercury/Jupiter/Venus).
    // Moon is excluded here because Moon cannot "aspect itself" (we're checking what aspects Moon).
    const hasBeneficAspect = k.planets.some(
      p => p.planet.id !== PLANET_IDS.MOON && NATURAL_BENEFICS.has(p.planet.id) && aspectHouses.includes(p.house),
    );
    return !hasBeneficAspect;
  },
};

/**
 * Mars-Rahu Accident Pattern — Mars and Rahu conjunct in the 4th or 8th house.
 * Classical indicator of accident / injury proneness (Sarvartha-Chintamani).
 * Houses 4 and 8 are the primary accident/death significators in Jyotish.
 */
SIGNATURE_REGISTRY['mars_rahu_accident'] = {
  id: 'mars_rahu_accident',
  name: { en: 'Mars-Rahu Accident Pattern', hi: 'मंगल-राहु दुर्घटना योग' },
  source: 'Sarvartha-Chintamani',
  elementsAffected: ['accidents'],
  direction: 'risk',
  detect: (k: KundaliData) => {
    // L1 audit fix: use named consts instead of magic numbers — prevents C1/C2-class swaps.
    const MARS_ID = PLANET_IDS.MARS;
    const RAHU_ID = PLANET_IDS.RAHU;
    const marsH = planetHouse(k, MARS_ID);
    const rahuH = planetHouse(k, RAHU_ID);
    if (marsH == null || rahuH == null) return false;
    // Conjunction in 4th or 8th (primary accident houses per Sarvartha-Chintamani)
    if (marsH === rahuH && (marsH === 4 || marsH === 8)) return true;
    // M5 audit fix: extend to the Mars-Rahu opposition axis (1/7 axis).
    // Mars in 1st, Rahu in 7th (or vice versa) is also a classical accident pattern
    // per Sarvartha-Chintamani — strong 7th-house mutual influence between these malefics.
    // houseOffset between two 1-based houses in mutual 7th: |marsH - rahuH| === 6.
    if (Math.abs(marsH - rahuH) === 6) return true;
    return false;
  },
};

/**
 * Saturn-Rahu Malignancy Diathesis — Saturn and Rahu in the same sign or in
 * mutual 7th (opposition, within 0° orb on sign boundary).
 *
 * elementsAffected: ['cancer'] ONLY.
 * Per spec §4.21 this signature is gated to the opt-in cancer element and must
 * NOT bleed into 'chronic'. The chronic element has its own chronic_hidden
 * detector above.
 *
 * Sources: Saravali-5, Bhrigu-Samhita.
 */
SIGNATURE_REGISTRY['saturn_rahu_malignancy'] = {
  id: 'saturn_rahu_malignancy',
  name: { en: 'Saturn-Rahu Malignancy Diathesis', hi: 'शनि-राहु कर्क योग' },
  source: 'Saravali-5, Bhrigu-Samhita',
  elementsAffected: ['cancer'],  // opt-in element ONLY — NOT 'chronic'
  direction: 'risk',
  detect: (k: KundaliData) => {
    const sat = k.planets.find(p => p.planet.id === PLANET_IDS.SATURN);
    const rahu = k.planets.find(p => p.planet.id === PLANET_IDS.RAHU);
    if (!sat || !rahu) return false;
    // Same sign: conjunction
    if (sat.sign === rahu.sign) return true;
    // Mutual 7th aspect: signs exactly 6 apart (e.g. sign 1 and sign 7)
    const signDiff = Math.abs(((sat.sign - rahu.sign + 12) % 12));
    return signDiff === 6;
  },
};

// ─── Main detection function ──────────────────────────────────────────────────

/**
 * Runs all registered detectors against a KundaliData and returns a boolean
 * map keyed by signature id.
 *
 * Error policy: a throwing detector logs with console.error and returns false
 * — never propagates. All catches are tagged with '[health-diagnosis/signatures]'.
 */
export function detectAllSignatures(k: KundaliData): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const id of Object.keys(SIGNATURE_REGISTRY)) {
    try {
      out[id] = SIGNATURE_REGISTRY[id].detect(k);
    } catch (err) {
      console.error(`[health-diagnosis/signatures] ${id} threw:`, err);
      out[id] = false;
    }
  }
  return out;
}
