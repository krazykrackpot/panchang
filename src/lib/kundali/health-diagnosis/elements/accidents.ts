// src/lib/kundali/health-diagnosis/elements/accidents.ts
//
// Task B15 — Accidents / Injuries element scorer.
//
// Classical sources: BPHS-24, Phala-Deepika-9
//
// Primary indicators (per spec §4.15):
//   Mars      — accident karaka [BPHS-4]
//   Rahu      — vehicular / electric accidents
//   8th house — sudden trauma house
//   4th house — vehicles
//
// Weight vector axes (names must match weights.ts exactly):
//   marsShadbala         0.30
//   rahuPlacement        0.20  (inverted)
//   eighthHouseBhavabala 0.20
//   fourthHouseBhavabala 0.10
//   yogaSignatures       0.20

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

const CATALOG_META = ELEMENT_CATALOG['accidents'];
const WEIGHTS = weightVectorForElement('accidents');

const ACCIDENTS_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('accidents'))
  .map(s => s.id);

const MARS_ID = 2; // accident karaka

export function scoreAccidents(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const marsStrength = strength.planets[MARS_ID]?.overall ?? 0;

    const eighthHouseBhavabala = strength.houses[8]?.bhavabala ?? 0;
    const fourthHouseBhavabala = strength.houses[4]?.bhavabala ?? 0;

    // rahuPlacement — inverted: more prominent Rahu = more accident risk
    const rahuPlacementScore  = strength.derived.rahuPlacementScore;
    const rahuResilienceScore = Math.max(0, 100 - rahuPlacementScore);

    const yogaSignatureScore =
      ACCIDENTS_SIGNATURE_IDS.length > 0
        ? ACCIDENTS_SIGNATURE_IDS.reduce(
            (acc, id) => acc + (signatures[id] ? 100 : 0),
            0,
          ) / ACCIDENTS_SIGNATURE_IDS.length
        : 0;

    const resilience =
      marsStrength          * w(WEIGHTS, 'marsShadbala',         'accidents') +
      rahuResilienceScore   * w(WEIGHTS, 'rahuPlacement',        'accidents') +
      eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala', 'accidents') +
      fourthHouseBhavabala  * w(WEIGHTS, 'fourthHouseBhavabala', 'accidents') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'accidents');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const marsDignity    = strength.planets[MARS_ID]?.dignity ?? 'unknown';
    const marsRetrograde = strength.planets[MARS_ID]?.isRetrograde ?? false;
    const rahuHouse      = strength.derived.rahuHouse;

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Mars Strength (Accident Karaka)', hi: 'मंगल बल (दुर्घटना कारक)' },
        verdict: marsStrength >= 50 ? 'positive' : marsStrength >= 25 ? 'neutral' : 'negative',
        value:   marsRetrograde
          ? `${marsDignity} (${Math.round(marsStrength)}/100, retrograde)`
          : `${marsDignity} (${Math.round(marsStrength)}/100)`,
      },
      {
        label:   { en: 'Rahu Placement (Vehicular / Electric Accidents)', hi: 'राहु स्थान (वाहन दुर्घटना)' },
        verdict: rahuPlacementScore <= 40 ? 'positive' : rahuPlacementScore <= 60 ? 'neutral' : 'negative',
        value:   rahuHouse !== undefined ? `House ${rahuHouse} (risk score: ${rahuPlacementScore})` : 'Unknown',
      },
      {
        label:   { en: '8th House Bhavabala (Sudden Trauma)', hi: 'अष्टम भावबल (आकस्मिक चोट)' },
        verdict: eighthHouseBhavabala >= 50 ? 'positive' : eighthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(eighthHouseBhavabala)}/100`,
      },
      {
        label:   { en: '4th House Bhavabala (Vehicles)', hi: 'चतुर्थ भावबल (वाहन)' },
        verdict: fourthHouseBhavabala >= 50 ? 'positive' : fourthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(fourthHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = ACCIDENTS_SIGNATURE_IDS
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
    console.error('[health-diagnosis/accidents] scoreAccidents failed:', err);
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
