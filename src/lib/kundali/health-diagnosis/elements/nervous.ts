// src/lib/kundali/health-diagnosis/elements/nervous.ts
//
// Task B6 — Nervous System element scorer.
//
// Classical sources: BPHS-24, Saravali-5, Charaka-Vatavyadhi
//
// Primary indicators (per spec §4.6):
//   Mercury   — nervous signal karaka [Saravali]
//   Saturn    — Vata aggravation, degeneration
//   Rahu      — uncontrolled nervous responses
//   1st house — overall nervous tone
//   3rd house — peripheral nerves (arms)
//
// Weight vector axes (names must match weights.ts exactly):
//   mercuryShadbala     0.25
//   saturnShadbala      0.20
//   rahuPlacement       0.15  (inverted: higher rahuPlacementScore = more vulnerable)
//   lagnaHouseBhavabala 0.10
//   thirdHouseBhavabala 0.10
//   yogaSignatures      0.10
//   moonShadbala        0.10
//
// NOTE: rahuPlacement axis is inverted — rahuPlacementScore is high when Rahu
// is in a strongly influential house (lagna or dusthana), which increases risk.
// Inversion: axisScore = max(0, 100 - rahuPlacementScore)

import type { KundaliData } from '@/types/kundali';
import type { NatalElement, ClassicalSignature } from '../types';
import type { ScoringFactor } from '@/lib/kundali/domain-synthesis/types';
import { ELEMENT_CATALOG } from '../element-catalog';
import { weightVectorForElement } from '../weights';
import { SIGNATURE_REGISTRY } from '../signatures';
import type { StrengthInputs } from '../strength-inputs';
import {
  w,
  vulnerabilityScore,
  ratingFromScore,
} from '../scoring-utils';

// ─── Module-level statics ─────────────────────────────────────────────────────

const CATALOG_META = ELEMENT_CATALOG['nervous'];
const WEIGHTS = weightVectorForElement('nervous');

const NERVOUS_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('nervous'))
  .map(s => s.id);

// ─── Planet ID constants (0-based) ────────────────────────────────────────────
const MOON_ID    = 1; // moon-combust nervous linkage
const MERCURY_ID = 3; // nervous signal karaka
const SATURN_ID  = 6; // Vata aggravation

// ─── Main scorer ─────────────────────────────────────────────────────────────

export function scoreNervous(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const mercuryStrength = strength.planets[MERCURY_ID]?.overall ?? 0;
    const saturnStrength  = strength.planets[SATURN_ID]?.overall ?? 0;
    const moonStrength    = strength.planets[MOON_ID]?.overall ?? 0;

    const lagnaHouseBhavabala = strength.houses[1]?.bhavabala ?? 0;
    const thirdHouseBhavabala = strength.houses[3]?.bhavabala ?? 0;

    // rahuPlacement — invert: higher placement score = more influence = more risk
    const rahuPlacementScore = strength.derived.rahuPlacementScore;
    const rahuResilienceScore = Math.max(0, 100 - rahuPlacementScore);

    const yogaSignatureScore =
      NERVOUS_SIGNATURE_IDS.length > 0
        ? NERVOUS_SIGNATURE_IDS.reduce(
            (acc, id) => acc + (signatures[id] ? 100 : 0),
            0,
          ) / NERVOUS_SIGNATURE_IDS.length
        : 0;

    const resilience =
      mercuryStrength     * w(WEIGHTS, 'mercuryShadbala',     'nervous') +
      saturnStrength      * w(WEIGHTS, 'saturnShadbala',      'nervous') +
      rahuResilienceScore * w(WEIGHTS, 'rahuPlacement',       'nervous') +
      lagnaHouseBhavabala * w(WEIGHTS, 'lagnaHouseBhavabala', 'nervous') +
      thirdHouseBhavabala * w(WEIGHTS, 'thirdHouseBhavabala', 'nervous') +
      yogaSignatureScore  * w(WEIGHTS, 'yogaSignatures',      'nervous') +
      moonStrength        * w(WEIGHTS, 'moonShadbala',        'nervous');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const rahuHouse = strength.derived.rahuHouse;

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Mercury Strength (Nervous Signal Karaka)', hi: 'बुध बल (तंत्रिका संकेत)' },
        verdict: mercuryStrength >= 50 ? 'positive' : mercuryStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(mercuryStrength)}/100`,
      },
      {
        label:   { en: 'Saturn Strength (Vata Aggravation)', hi: 'शनि बल (वात वृद्धि)' },
        verdict: saturnStrength >= 50 ? 'positive' : saturnStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(saturnStrength)}/100`,
      },
      {
        label:   { en: 'Rahu Placement (Uncontrolled Nerve Responses)', hi: 'राहु स्थान (अनियंत्रित तंत्रिका)' },
        verdict: rahuPlacementScore <= 40 ? 'positive' : rahuPlacementScore <= 60 ? 'neutral' : 'negative',
        value:   rahuHouse !== undefined ? `House ${rahuHouse} (score: ${rahuPlacementScore})` : 'Unknown',
      },
      {
        label:   { en: '1st House Bhavabala (Nervous Tone)', hi: 'प्रथम भावबल (तंत्रिका स्वर)' },
        verdict: lagnaHouseBhavabala >= 50 ? 'positive' : lagnaHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(lagnaHouseBhavabala)}/100`,
      },
      {
        label:   { en: '3rd House Bhavabala (Peripheral Nerves)', hi: 'तृतीय भावबल (परिधीय तंत्रिका)' },
        verdict: thirdHouseBhavabala >= 50 ? 'positive' : thirdHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(thirdHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Moon Strength (Nervous System Linkage)', hi: 'चंद्र बल (तंत्रिका तंत्र)' },
        verdict: moonStrength >= 50 ? 'positive' : moonStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(moonStrength)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = NERVOUS_SIGNATURE_IDS
      .filter(id => signatures[id] === true)
      .map(id => ({
        id,
        name:   SIGNATURE_REGISTRY[id].name,
        source: SIGNATURE_REGISTRY[id].source,
      }));

    return {
      id:                  CATALOG_META.id,
      name:                CATALOG_META.name,
      category:            CATALOG_META.category,
      badge:               CATALOG_META.badge,
      natalScore:          Math.round(vuln),
      rating,
      factors,
      classicalSignatures,
      requiresDisclaimer:  CATALOG_META.requiresDisclaimer,
    };
  } catch (err) {
    console.error('[health-diagnosis/nervous] scoreNervous failed:', err);
    return {
      id:                  CATALOG_META.id,
      name:                CATALOG_META.name,
      category:            CATALOG_META.category,
      badge:               CATALOG_META.badge,
      natalScore:          50,
      rating:              'madhyama',
      factors:             [],
      classicalSignatures: [],
      requiresDisclaimer:  CATALOG_META.requiresDisclaimer,
    };
  }
}
