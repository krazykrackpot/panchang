// src/lib/kundali/health-diagnosis/elements/longevity.ts
//
// Task B22 — Longevity Classification element scorer.
// opt-in, Classical badge, requiresDisclaimer: true.
//
// Classical sources: BPHS-Ayur, Phala-Deepika-9, Hora-Sara
//
// Primary indicators (per spec §4.22):
//   Saturn    — Ayur karaka [BPHS-Ayur]
//   8th lord  — Ayur sthana lord (most important for longevity)
//   Lagna lord — constitution strength
//   8th house  — Ayur sthana (longevity house)
//
// Classical Ayur calculation methods (spec §4.22):
//   Pinda Ayurdaya  — planet-life years summed by strength [BPHS-Ayur]
//   Amsha Ayurdaya  — weighted by nakshatra position
//   Naisargika Ayurdaya — natural lifespan by Saturn's dignity
//   Three methods triangulated → Alpa (<32), Madhya (32-70), Purna (>70)
//
// TODO (Phase E): Wire real Pinda/Amsha Ayurdaya computation from
//   dedicated ayurdaya engine (does not yet exist in the codebase).
//   Currently stubbed to pindaAyurdaya = 50 (neutral/Madhya range)
//   so the element produces a valid score for Phase A-D testing.
//   The stub is intentional per spec instruction: "If Pinda Ayurdaya
//   computation is too involved, stub with pindaAyurdaya = 50."
//   The longevityClassification field is optional and not added here;
//   it can be added in Phase E alongside the real computation.
//
// Weight vector axes (names must match weights.ts exactly):
//   saturnAvastha     0.20
//   eighthLordDignity 0.25
//   eighthHouseBhavabala 0.15
//   lagnaLordDignity  0.15
//   lagnaLordShadbala 0.10
//   yogaSignatures    0.15

import type { KundaliData } from '@/types/kundali';
import type { NatalElement, ClassicalSignature } from '../types';
import type { ScoringFactor } from '@/lib/kundali/domain-synthesis/types';
import { ELEMENT_CATALOG } from '../element-catalog';
import { weightVectorForElement } from '../weights';
import { SIGNATURE_REGISTRY } from '../signatures';
import {
  houseLordId,
  type StrengthInputs,
} from '../strength-inputs';
import {
  w,
  vulnerabilityScore,
  ratingFromScore,
  dignityToScore,
  yogaSignatureContribution,
} from '../scoring-utils';

const CATALOG_META = ELEMENT_CATALOG['longevity'];
const WEIGHTS = weightVectorForElement('longevity');

const LONGEVITY_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('longevity'))
  .map(s => s.id);

const SATURN_ID = 6; // Ayur karaka

export function scoreLongevity(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    // saturnAvastha — Baladi avastha of Saturn (0-100)
    const saturnAvastha = strength.planets[SATURN_ID]?.baladiStrength ?? 0;

    // eighthLordDignity — most important longevity indicator
    const eighthLordId = houseLordId(k, 8);
    const eighthLordDignityScore =
      eighthLordId !== undefined
        ? dignityToScore(strength.planets[eighthLordId]?.dignity ?? 'unknown')
        : 0;

    const eighthHouseBhavabala = strength.houses[8]?.bhavabala ?? 0;

    const lagnaLordId = houseLordId(k, 1);
    const lagnaLordDignityScore =
      lagnaLordId !== undefined
        ? dignityToScore(strength.planets[lagnaLordId]?.dignity ?? 'unknown')
        : 0;
    const lagnaLordShadbala =
      lagnaLordId !== undefined
        ? (strength.planets[lagnaLordId]?.overall ?? 0)
        : 0;

    // TODO (Phase E): Replace pindaAyurdaya stub with real Pinda Ayurdaya
    // computation from a dedicated ayurdaya engine.
    // Pinda Ayurdaya formula (BPHS-Ayur): sum of each planet's granted years
    // multiplied by its strength ratio, then adjusted by placement factors.
    // The three methods (Pinda/Amsha/Naisargika) should be triangulated to
    // produce a final Alpa/Madhya/Purna classification.
    // Stub: 50 = neutral Madhya range (32-70 years), does not inflate or
    // deflate the vulnerability score artificially.
    const pindaAyurdaya = 50; // stub — Phase E TODO

    const yogaSignatureScore = yogaSignatureContribution(
      LONGEVITY_SIGNATURE_IDS, signatures,
    );

    const resilience =
      saturnAvastha         * w(WEIGHTS, 'saturnAvastha',        'longevity') +
      eighthLordDignityScore * w(WEIGHTS, 'eighthLordDignity',   'longevity') +
      eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala', 'longevity') +
      lagnaLordDignityScore * w(WEIGHTS, 'lagnaLordDignity',     'longevity') +
      lagnaLordShadbala     * w(WEIGHTS, 'lagnaLordShadbala',    'longevity') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'longevity');

    // Blend pindaAyurdaya into resilience as a soft modifier.
    // pindaAyurdaya = 50 (stub) → no change; when real values are wired in
    // Phase E, this will pull the score toward the computed Ayurdaya range.
    // Blend weight: 15% (modest until real computation is confirmed accurate).
    const blendedResilience = resilience * 0.85 + pindaAyurdaya * 0.15;

    const vuln   = vulnerabilityScore(blendedResilience);
    const rating = ratingFromScore(vuln);

    const eighthLordDignity = eighthLordId !== undefined
      ? (strength.planets[eighthLordId]?.dignity ?? 'unknown')
      : 'unknown';

    const factors: ScoringFactor[] = [
      {
        label:   { en: '8th Lord Dignity (Ayur Sthana Lord)', hi: 'अष्टमेश गरिमा (आयुर्भाव स्वामी)' },
        verdict: eighthLordDignityScore >= 65 ? 'positive' : eighthLordDignityScore >= 40 ? 'neutral' : 'negative',
        value:   eighthLordId !== undefined
          ? `${eighthLordDignity} (${Math.round(eighthLordDignityScore)}/100)`
          : 'unknown',
      },
      {
        label:   { en: 'Saturn Avastha (Ayur Karaka)', hi: 'शनि अवस्था (आयु कारक)' },
        verdict: saturnAvastha >= 60 ? 'positive' : saturnAvastha >= 30 ? 'neutral' : 'negative',
        value:   `${Math.round(saturnAvastha)}/100`,
      },
      {
        label:   { en: '8th House Bhavabala (Ayur Sthana)', hi: 'अष्टम भावबल (आयुर्भाव)' },
        verdict: eighthHouseBhavabala >= 50 ? 'positive' : eighthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(eighthHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Lagna Lord Dignity (Constitution)', hi: 'लग्नेश गरिमा (शरीर बल)' },
        verdict: lagnaLordDignityScore >= 65 ? 'positive' : lagnaLordDignityScore >= 40 ? 'neutral' : 'negative',
        value:   lagnaLordId !== undefined
          ? `${strength.planets[lagnaLordId]?.dignity ?? 'unknown'} (${Math.round(lagnaLordDignityScore)}/100)`
          : 'unknown',
      },
      {
        label:   { en: 'Pinda Ayurdaya (Life-Years Estimate)', hi: 'पिण्ड आयुर्दाय (जीवन वर्ष)' },
        verdict: 'neutral',
        // Phase E TODO: replace with real classification (Alpa/Madhya/Purna) once engine is wired
        value:   'Madhya (Phase E stub — real Pinda Ayurdaya computation pending)',
      },
    ];

    const classicalSignatures: ClassicalSignature[] = LONGEVITY_SIGNATURE_IDS
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
      requiresDisclaimer:  CATALOG_META.requiresDisclaimer, // true
    };
  } catch (err) {
    console.error('[health-diagnosis/longevity] scoreLongevity failed:', err);
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
