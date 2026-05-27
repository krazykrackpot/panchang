// src/lib/kundali/health-diagnosis/elements/mental.ts
//
// Task B2 — Mental Health / Cognitive Stability element scorer.
//
// Classical sources: BPHS-4, Saravali-5, Charaka (manasika roga)
//
// Primary indicators (per spec §4.2):
//   Moon      — manas karaka (single most important)
//   Mercury   — cognition, nervous signal transmission
//   Jupiter   — wisdom, optimism
//   4th house — chitta / settledness of mind
//   5th house — buddhi / discernment
//   Aspects on Moon — Saturn=depression, Mars=irritability, Rahu=anxiety
//
// Score direction: HIGH RESILIENCE = LOW VULNERABILITY = GOOD prognosis.
//   vulnerabilityScore = 100 - weightedResilienceSum
//
// Weight vector axes (names must match weights.ts exactly):
//   moonShadbala         0.25
//   moonPakshaBala       0.10
//   mercuryShadbala      0.10
//   aspectsOnMoon        0.15  (inverted: higher malefic aspects = lower resilience)
//   fourthHouseBhavabala 0.10
//   kemadrumaFlag        0.10  (inverted: kemadruma present = lower resilience)
//   yogaSignatures       0.10
//   fifthHouseBhavabala  0.10

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
  yogaSignatureContribution,
} from '../scoring-utils';

// ─── Module-level statics ─────────────────────────────────────────────────────

const CATALOG_META = ELEMENT_CATALOG['mental'];
const WEIGHTS = weightVectorForElement('mental');

// kemadruma is excluded here because it is handled separately via the dedicated
// kemadrumaFlag / kemadrumaResilienceScore axis below. Including it would
// double-count kemadruma and pull in opposite directions on the same scorer.
const MENTAL_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('mental') && s.id !== 'kemadruma')
  .map(s => s.id);

// ─── Planet ID constants (0-based, per KundaliData convention) ────────────────
const MOON_ID    = 1; // manas karaka
const MERCURY_ID = 3; // cognition

// ─── Main scorer ─────────────────────────────────────────────────────────────

/**
 * Score the Mental Health element for a native's birth chart.
 *
 * Axis note for aspectsOnMoon: the weight vector spec says "higher malefic
 * aspects = more vulnerable." We therefore invert this axis:
 *   axisScore = max(0, 100 - (maleficAspects * 20))
 * Each malefic aspect removes 20 points from resilience. Three malefic
 * aspects fully exhaust the resilience contribution of this axis.
 *
 * Axis note for kemadrumaFlag: binary (0 or 100 from signatures).
 * Kemadruma = 100 means the yoga IS present → high vulnerability contribution.
 * We invert: kemadruma present → axisScore = 0; absent → axisScore = 100.
 */
export function scoreMental(
  _k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    // ── 1. Resolve axis values ────────────────────────────────────────────────

    // moonShadbala — Moon's overall strength (0-100)
    const moonStrength = strength.planets[MOON_ID]?.overall ?? 0;

    // moonPakshaBala — pre-computed in collectStrengthInputs (0-100)
    const moonPakshaBala = strength.derived.moonPakshaBala;

    // mercuryShadbala — Mercury's overall strength (0-100)
    const mercuryStrength = strength.planets[MERCURY_ID]?.overall ?? 0;

    // aspectsOnMoon — invert: more malefic aspects = less resilience
    // Each malefic aspect removes 20 pts; clamped at 0
    const maleficAspects = strength.derived.aspectsOnMoon.malefic;
    const aspectResilienceScore = Math.max(0, 100 - maleficAspects * 20);

    // fourthHouseBhavabala — chitta / settledness (0-100)
    const fourthHouseBhavabala = strength.houses[4]?.bhavabala ?? 0;

    // fifthHouseBhavabala — buddhi (0-100)
    const fifthHouseBhavabala = strength.houses[5]?.bhavabala ?? 0;

    // kemadrumaFlag — invert: kemadruma present → contributes 0 to resilience
    const kemadrumaPresent = signatures['kemadruma'] === true;
    const kemadrumaResilienceScore = kemadrumaPresent ? 0 : 100;

    // yogaSignatures — average of all matched mental signatures
    const yogaSignatureScore = yogaSignatureContribution(
      MENTAL_SIGNATURE_IDS, signatures,
    );

    // ── 2. Weighted resilience sum ────────────────────────────────────────────

    const resilience =
      moonStrength            * w(WEIGHTS, 'moonShadbala',         'mental') +
      moonPakshaBala          * w(WEIGHTS, 'moonPakshaBala',       'mental') +
      mercuryStrength         * w(WEIGHTS, 'mercuryShadbala',      'mental') +
      aspectResilienceScore   * w(WEIGHTS, 'aspectsOnMoon',        'mental') +
      fourthHouseBhavabala    * w(WEIGHTS, 'fourthHouseBhavabala', 'mental') +
      kemadrumaResilienceScore * w(WEIGHTS, 'kemadrumaFlag',       'mental') +
      yogaSignatureScore      * w(WEIGHTS, 'yogaSignatures',       'mental') +
      fifthHouseBhavabala     * w(WEIGHTS, 'fifthHouseBhavabala',  'mental');

    // ── 3. Convert to vulnerability + rating ──────────────────────────────────

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    // ── 4. Factors array ──────────────────────────────────────────────────────

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Moon Strength (Manas Karaka)', hi: 'चंद्र बल (मानस कारक)' },
        verdict: moonStrength >= 50 ? 'positive' : moonStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(moonStrength)}/100`,
      },
      {
        label:   { en: 'Moon Paksha Bala (Waxing/Waning)', hi: 'चंद्र पक्ष बल' },
        verdict: moonPakshaBala >= 60 ? 'positive' : moonPakshaBala >= 30 ? 'neutral' : 'negative',
        value:   `${Math.round(moonPakshaBala)}/100`,
      },
      {
        label:   { en: 'Mercury Strength (Cognition)', hi: 'बुध बल (बुद्धि)' },
        verdict: mercuryStrength >= 50 ? 'positive' : mercuryStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(mercuryStrength)}/100`,
      },
      {
        label:   { en: 'Malefic Aspects on Moon', hi: 'चंद्र पर पाप दृष्टि' },
        verdict: maleficAspects === 0 ? 'positive' : maleficAspects <= 1 ? 'neutral' : 'negative',
        value:   `${maleficAspects} malefic aspect${maleficAspects !== 1 ? 's' : ''}`,
      },
      {
        label:   { en: '4th House Bhavabala (Chitta / Mind)', hi: 'चतुर्थ भावबल (चित्त)' },
        verdict: fourthHouseBhavabala >= 50 ? 'positive' : fourthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(fourthHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Kemadruma Yoga (Mental Isolation)', hi: 'केमद्रुम योग (मानसिक एकाकीपन)' },
        verdict: kemadrumaPresent ? 'negative' : 'positive',
        value:   kemadrumaPresent ? 'Present' : 'Absent',
      },
    ];

    // ── 5. Classical signatures ───────────────────────────────────────────────
    const classicalSignatures: ClassicalSignature[] = MENTAL_SIGNATURE_IDS
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
    console.error('[health-diagnosis/mental] scoreMental failed:', err);
    // Return a safe neutral result rather than propagating
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
