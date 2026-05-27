// src/lib/kundali/health-diagnosis/elements/digestive.ts
//
// Task B3 — Digestive System element scorer.
//
// Classical sources: BPHS-24, Sarvartha-Chintamani-4, Charaka-Sutra, Ashtanga-Hridayam
//
// Primary indicators (per spec §4.3):
//   Sun       — jatharagni (digestive fire) [Charaka-Sutra]
//   Mars      — pitta-agni / acid
//   Mercury   — intestinal absorption
//   Jupiter   — liver and pancreas
//   Moon      — stomach fluids, mucous lining
//   5th house — stomach / upper GI [BPHS-12]
//   6th house — intestines / lower GI / disease [BPHS-24]
//
// Score direction: HIGH RESILIENCE = LOW VULNERABILITY = GOOD prognosis.
//
// Weight vector axes (names must match weights.ts exactly):
//   sunShadbala         0.20
//   marsShadbala        0.15
//   mercuryShadbala     0.10
//   fifthHouseBhavabala 0.15
//   sixthHouseBhavabala 0.15
//   yogaSignatures      0.15
//   moonShadbala        0.10

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

const CATALOG_META = ELEMENT_CATALOG['digestive'];
const WEIGHTS = weightVectorForElement('digestive');

const DIGESTIVE_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('digestive'))
  .map(s => s.id);

// ─── Planet ID constants (0-based) ────────────────────────────────────────────
const SUN_ID     = 0; // jatharagni
const MOON_ID    = 1; // stomach fluids
const MARS_ID    = 2; // pitta-agni
const MERCURY_ID = 3; // intestinal absorption

// ─── Main scorer ─────────────────────────────────────────────────────────────

export function scoreDigestive(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    // ── 1. Resolve axis values ────────────────────────────────────────────────

    const sunStrength     = strength.planets[SUN_ID]?.overall ?? 0;
    const marsStrength    = strength.planets[MARS_ID]?.overall ?? 0;
    const mercuryStrength = strength.planets[MERCURY_ID]?.overall ?? 0;
    const moonStrength    = strength.planets[MOON_ID]?.overall ?? 0;

    const fifthHouseBhavabala = strength.houses[5]?.bhavabala ?? 0;
    const sixthHouseBhavabala = strength.houses[6]?.bhavabala ?? 0;

    // yogaSignatures — aggregate from matched digestive signatures
    const yogaSignatureScore =
      DIGESTIVE_SIGNATURE_IDS.length > 0
        ? DIGESTIVE_SIGNATURE_IDS.reduce(
            (acc, id) => acc + (signatures[id] ? 100 : 0),
            0,
          ) / DIGESTIVE_SIGNATURE_IDS.length
        : 0;

    // ── 2. Weighted resilience sum ────────────────────────────────────────────

    const resilience =
      sunStrength           * w(WEIGHTS, 'sunShadbala',          'digestive') +
      marsStrength          * w(WEIGHTS, 'marsShadbala',         'digestive') +
      mercuryStrength       * w(WEIGHTS, 'mercuryShadbala',      'digestive') +
      fifthHouseBhavabala   * w(WEIGHTS, 'fifthHouseBhavabala',  'digestive') +
      sixthHouseBhavabala   * w(WEIGHTS, 'sixthHouseBhavabala',  'digestive') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'digestive') +
      moonStrength          * w(WEIGHTS, 'moonShadbala',         'digestive');

    // ── 3. Convert to vulnerability + rating ──────────────────────────────────

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    // ── 4. Factors array ──────────────────────────────────────────────────────

    const mercuryCombust = strength.planets[MERCURY_ID]?.isCombust ?? false;

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Sun Strength (Jatharagni / Digestive Fire)', hi: 'सूर्य बल (जठराग्नि)' },
        verdict: sunStrength >= 50 ? 'positive' : sunStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sunStrength)}/100`,
      },
      {
        label:   { en: 'Mars Strength (Pitta-Agni / Acid)', hi: 'मंगल बल (पित्ताग्नि)' },
        verdict: marsStrength >= 50 ? 'positive' : marsStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(marsStrength)}/100`,
      },
      {
        label:   { en: 'Mercury Combust (Malabsorption Signal)', hi: 'बुध दग्ध (पाचन संकेत)' },
        verdict: mercuryCombust ? 'negative' : 'positive',
        value:   mercuryCombust ? 'Combust (absorption impaired)' : `Not combust (${Math.round(mercuryStrength)}/100)`,
      },
      {
        label:   { en: '5th House Bhavabala (Stomach / Upper GI)', hi: 'पंचम भावबल (उदर / आमाशय)' },
        verdict: fifthHouseBhavabala >= 50 ? 'positive' : fifthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(fifthHouseBhavabala)}/100`,
      },
      {
        label:   { en: '6th House Bhavabala (Intestines / Disease)', hi: 'षष्ठ भावबल (आंत / रोग)' },
        verdict: sixthHouseBhavabala >= 50 ? 'positive' : sixthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sixthHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Moon Strength (Stomach Fluids)', hi: 'चंद्र बल (पाचन द्रव)' },
        verdict: moonStrength >= 50 ? 'positive' : moonStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(moonStrength)}/100`,
      },
    ];

    // ── 5. Classical signatures ───────────────────────────────────────────────
    const classicalSignatures: ClassicalSignature[] = DIGESTIVE_SIGNATURE_IDS
      .filter(id => signatures[id] === true)
      .map(id => ({
        id,
        name:   SIGNATURE_REGISTRY[id].name,
        source: SIGNATURE_REGISTRY[id].source,
      }));

    // ── 6. Assemble NatalElement ──────────────────────────────────────────────

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
    console.error('[health-diagnosis/digestive] scoreDigestive failed:', err);
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
