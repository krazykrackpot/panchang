// src/lib/kundali/health-diagnosis/elements/chronic.ts
//
// Task B14 — Chronic / Hidden Disease element scorer.
//
// Classical sources: BPHS-24, Saravali-5, Phala-Deepika-9
//
// Primary indicators (per spec §4.14):
//   Saturn    — chronicity karaka [BPHS-4]
//   Rahu      — mysterious / undiagnosable diseases
//   8th house — gupta roga sthana (hidden disease house) [BPHS-24]
//   12th house — hospitalisation
//   8th lord  — Ayur sthana lord
//
// NOTE: Saturn-Rahu malignancy interpretation is deliberately NOT included here.
// That lives in element 4.21 (cancer, opt-in). This element uses the chronicity
// axis only — per spec §4.14 boundary note.
//
// Weight vector axes (names must match weights.ts exactly):
//   eighthHouseBhavabala  0.25
//   eighthLordDignity     0.20
//   saturnShadbala        0.20
//   rahuPlacement         0.15  (inverted)
//   twelfthHouseBhavabala 0.10
//   yogaSignatures        0.10

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
} from '../scoring-utils';

const CATALOG_META = ELEMENT_CATALOG['chronic'];
const WEIGHTS = weightVectorForElement('chronic');

const CHRONIC_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('chronic'))
  .map(s => s.id);

const SATURN_ID = 6; // chronicity karaka

export function scoreChronic(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const saturnStrength = strength.planets[SATURN_ID]?.overall ?? 0;

    const eighthHouseBhavabala  = strength.houses[8]?.bhavabala ?? 0;
    const twelfthHouseBhavabala = strength.houses[12]?.bhavabala ?? 0;

    const eighthLordId = houseLordId(k, 8);
    const eighthLordDignityScore =
      eighthLordId !== undefined
        ? dignityToScore(strength.planets[eighthLordId]?.dignity ?? 'unknown')
        : 0;

    // rahuPlacement — inverted: prominent Rahu = more chronic/undiagnosable risk
    const rahuPlacementScore  = strength.derived.rahuPlacementScore;
    const rahuResilienceScore = Math.max(0, 100 - rahuPlacementScore);

    const yogaSignatureScore =
      CHRONIC_SIGNATURE_IDS.length > 0
        ? CHRONIC_SIGNATURE_IDS.reduce(
            (acc, id) => acc + (signatures[id] ? 100 : 0),
            0,
          ) / CHRONIC_SIGNATURE_IDS.length
        : 0;

    const resilience =
      eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala',  'chronic') +
      eighthLordDignityScore * w(WEIGHTS, 'eighthLordDignity',    'chronic') +
      saturnStrength        * w(WEIGHTS, 'saturnShadbala',        'chronic') +
      rahuResilienceScore   * w(WEIGHTS, 'rahuPlacement',         'chronic') +
      twelfthHouseBhavabala * w(WEIGHTS, 'twelfthHouseBhavabala', 'chronic') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',        'chronic');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const rahuHouse = strength.derived.rahuHouse;

    const factors: ScoringFactor[] = [
      {
        label:   { en: '8th House Bhavabala (Gupta Roga Sthana)', hi: 'अष्टम भावबल (गुप्त रोग स्थान)' },
        verdict: eighthHouseBhavabala >= 50 ? 'positive' : eighthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(eighthHouseBhavabala)}/100`,
      },
      {
        label:   { en: '8th Lord Dignity (Hidden Disease Lord)', hi: 'अष्टमेश गरिमा' },
        verdict: eighthLordDignityScore >= 65 ? 'positive' : eighthLordDignityScore >= 40 ? 'neutral' : 'negative',
        value:   eighthLordId !== undefined
          ? `${strength.planets[eighthLordId]?.dignity ?? 'unknown'} (${Math.round(eighthLordDignityScore)}/100)`
          : 'unknown',
      },
      {
        label:   { en: 'Saturn Strength (Chronicity Karaka)', hi: 'शनि बल (दीर्घकालिकता कारक)' },
        verdict: saturnStrength >= 50 ? 'positive' : saturnStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(saturnStrength)}/100`,
      },
      {
        label:   { en: 'Rahu Placement (Undiagnosable Diseases)', hi: 'राहु स्थान (अव्यक्त रोग)' },
        verdict: rahuPlacementScore <= 40 ? 'positive' : rahuPlacementScore <= 60 ? 'neutral' : 'negative',
        value:   rahuHouse !== undefined ? `House ${rahuHouse} (score: ${rahuPlacementScore})` : 'Unknown',
      },
      {
        label:   { en: '12th House Bhavabala (Hospitalisation)', hi: 'द्वादश भावबल (चिकित्सालय)' },
        verdict: twelfthHouseBhavabala >= 50 ? 'positive' : twelfthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(twelfthHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = CHRONIC_SIGNATURE_IDS
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
    console.error('[health-diagnosis/chronic] scoreChronic failed:', err);
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
