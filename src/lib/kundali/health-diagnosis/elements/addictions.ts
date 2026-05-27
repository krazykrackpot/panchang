// src/lib/kundali/health-diagnosis/elements/addictions.ts
//
// Task B18 — Addictions / Substance Vulnerability element scorer.
//
// Classical sources: Saravali, Sarvartha-Chintamani
//
// Primary indicators (per spec §4.18):
//   Rahu      — primary addiction karaka [Saravali]
//   Moon      — emotional / sentiment-driven addiction
//   Mars      — impulsive addiction
//   Venus     — pleasure-seeking addictions
//   12th house — foreign substances, escapism [BPHS-12]
//   6th house  — vices
//   8th house  — hidden addictions
//
// Weight vector axes (names must match weights.ts exactly):
//   rahuPlacement        0.25  (inverted)
//   moonShadbala         0.15
//   marsShadbala         0.10
//   venusShadbala        0.10
//   twelfthHouseBhavabala 0.15
//   sixthHouseBhavabala  0.10
//   eighthHouseBhavabala 0.05
//   yogaSignatures       0.10

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

const CATALOG_META = ELEMENT_CATALOG['addictions'];
const WEIGHTS = weightVectorForElement('addictions');

const ADDICTIONS_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('addictions'))
  .map(s => s.id);

const MOON_ID  = 1; // emotional addiction
const MARS_ID  = 2; // impulsive addiction
const VENUS_ID = 5; // pleasure-seeking

export function scoreAddictions(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const moonStrength  = strength.planets[MOON_ID]?.overall ?? 0;
    const marsStrength  = strength.planets[MARS_ID]?.overall ?? 0;
    const venusStrength = strength.planets[VENUS_ID]?.overall ?? 0;

    const twelfthHouseBhavabala = strength.houses[12]?.bhavabala ?? 0;
    const sixthHouseBhavabala   = strength.houses[6]?.bhavabala ?? 0;
    const eighthHouseBhavabala  = strength.houses[8]?.bhavabala ?? 0;

    // rahuPlacement — inverted: prominent Rahu = more addiction vulnerability
    const rahuPlacementScore  = strength.derived.rahuPlacementScore;
    const rahuResilienceScore = Math.max(0, 100 - rahuPlacementScore);

    const yogaSignatureScore =
      ADDICTIONS_SIGNATURE_IDS.length > 0
        ? ADDICTIONS_SIGNATURE_IDS.reduce(
            (acc, id) => acc + (signatures[id] ? 100 : 0),
            0,
          ) / ADDICTIONS_SIGNATURE_IDS.length
        : 0;

    const resilience =
      rahuResilienceScore   * w(WEIGHTS, 'rahuPlacement',        'addictions') +
      moonStrength          * w(WEIGHTS, 'moonShadbala',         'addictions') +
      marsStrength          * w(WEIGHTS, 'marsShadbala',         'addictions') +
      venusStrength         * w(WEIGHTS, 'venusShadbala',        'addictions') +
      twelfthHouseBhavabala * w(WEIGHTS, 'twelfthHouseBhavabala', 'addictions') +
      sixthHouseBhavabala   * w(WEIGHTS, 'sixthHouseBhavabala',  'addictions') +
      eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala', 'addictions') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'addictions');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const rahuHouse = strength.derived.rahuHouse;

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Rahu Placement (Primary Addiction Karaka)', hi: 'राहु स्थान (व्यसन कारक)' },
        verdict: rahuPlacementScore <= 40 ? 'positive' : rahuPlacementScore <= 60 ? 'neutral' : 'negative',
        value:   rahuHouse !== undefined ? `House ${rahuHouse} (risk score: ${rahuPlacementScore})` : 'Unknown',
      },
      {
        label:   { en: 'Moon Strength (Emotional Addiction Risk)', hi: 'चंद्र बल (भावनात्मक व्यसन)' },
        verdict: moonStrength >= 50 ? 'positive' : moonStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(moonStrength)}/100`,
      },
      {
        label:   { en: '12th House Bhavabala (Escapism / Substances)', hi: 'द्वादश भावबल (पलायनवाद / नशा)' },
        verdict: twelfthHouseBhavabala >= 50 ? 'positive' : twelfthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(twelfthHouseBhavabala)}/100`,
      },
      {
        label:   { en: '6th House Bhavabala (Vices)', hi: 'षष्ठ भावबल (व्यसन / दुर्गुण)' },
        verdict: sixthHouseBhavabala >= 50 ? 'positive' : sixthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sixthHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Venus Strength (Pleasure-Seeking)', hi: 'शुक्र बल (भोगवृत्ति)' },
        verdict: venusStrength >= 50 ? 'positive' : venusStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(venusStrength)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = ADDICTIONS_SIGNATURE_IDS
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
    console.error('[health-diagnosis/addictions] scoreAddictions failed:', err);
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
