// src/lib/kundali/health-diagnosis/elements/psychiatric.ts
//
// Task B17 — Psychiatric / Severe Mental Illness element scorer.
// requiresDisclaimer: true — test must assert this.
//
// Classical sources: Saravali-5, Sarvartha-Chintamani, Charaka-Unmada
//
// Primary indicators (per spec §4.17):
//   Moon      — afflicted Moon [BPHS-4]
//   Rahu      — delusions / paranoia
//   Mercury   — cognitive break (debilitated + combust)
//   4th house — chitta
//   5th house — buddhi-bhrama
//   12th house — subconscious imbalance
//
// Weight vector axes (names must match weights.ts exactly):
//   moonShadbala          0.20
//   rahuPlacement         0.20  (inverted)
//   mercuryShadbala       0.15
//   fourthHouseBhavabala  0.10
//   fifthHouseBhavabala   0.10
//   twelfthHouseBhavabala 0.10
//   yogaSignatures        0.15

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

const CATALOG_META = ELEMENT_CATALOG['psychiatric'];
const WEIGHTS = weightVectorForElement('psychiatric');

const PSYCHIATRIC_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('psychiatric'))
  .map(s => s.id);

import { PLANET_IDS } from '@/lib/constants/grahas';
const MOON_ID    = PLANET_IDS.MOON;    // manas affliction
const MERCURY_ID = PLANET_IDS.MERCURY; // cognitive break

export function scorePsychiatric(
  _k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const moonStrength    = strength.planets[MOON_ID]?.overall ?? 0;
    const mercuryStrength = strength.planets[MERCURY_ID]?.overall ?? 0;

    const fourthHouseBhavabala  = strength.houses[4]?.bhavabala ?? 0;
    const fifthHouseBhavabala   = strength.houses[5]?.bhavabala ?? 0;
    const twelfthHouseBhavabala = strength.houses[12]?.bhavabala ?? 0;

    // rahuPlacement — inverted: prominent Rahu = elevated psychotic risk
    const rahuPlacementScore  = strength.derived.rahuPlacementScore;
    const rahuResilienceScore = Math.max(0, 100 - rahuPlacementScore);

    const yogaSignatureScore = yogaSignatureContribution(
      PSYCHIATRIC_SIGNATURE_IDS, signatures,
    );

    const resilience =
      moonStrength          * w(WEIGHTS, 'moonShadbala',          'psychiatric') +
      rahuResilienceScore   * w(WEIGHTS, 'rahuPlacement',         'psychiatric') +
      mercuryStrength       * w(WEIGHTS, 'mercuryShadbala',       'psychiatric') +
      fourthHouseBhavabala  * w(WEIGHTS, 'fourthHouseBhavabala',  'psychiatric') +
      fifthHouseBhavabala   * w(WEIGHTS, 'fifthHouseBhavabala',   'psychiatric') +
      twelfthHouseBhavabala * w(WEIGHTS, 'twelfthHouseBhavabala', 'psychiatric') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',        'psychiatric');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const mercuryCombust  = strength.planets[MERCURY_ID]?.isCombust ?? false;
    const mercuryDignity  = strength.planets[MERCURY_ID]?.dignity ?? 'unknown';
    const rahuHouse       = strength.derived.rahuHouse;
    const maleficAspects  = strength.derived.aspectsOnMoon.malefic;

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Moon Strength (Manas Affliction)', hi: 'चंद्र बल (मानस पीड़ा)' },
        verdict: moonStrength >= 50 ? 'positive' : moonStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(moonStrength)}/100 (${maleficAspects} malefic aspect${maleficAspects !== 1 ? 's' : ''})`,
      },
      {
        label:   { en: 'Rahu Placement (Delusions / Paranoia)', hi: 'राहु स्थान (भ्रम / व्यामोह)' },
        verdict: rahuPlacementScore <= 40 ? 'positive' : rahuPlacementScore <= 60 ? 'neutral' : 'negative',
        value:   rahuHouse !== undefined ? `House ${rahuHouse} (score: ${rahuPlacementScore})` : 'Unknown',
      },
      {
        label:   { en: 'Mercury Strength (Cognitive Break Risk)', hi: 'बुध बल (बुद्धि-भ्रम)' },
        verdict: mercuryStrength >= 50 ? 'positive' : mercuryStrength >= 25 ? 'neutral' : 'negative',
        value:   [
          `${mercuryDignity} (${Math.round(mercuryStrength)}/100)`,
          mercuryCombust ? '(combust)' : '',
        ].filter(Boolean).join(' '),
      },
      {
        label:   { en: '4th House Bhavabala (Chitta / Mind)', hi: 'चतुर्थ भावबल (चित्त)' },
        verdict: fourthHouseBhavabala >= 50 ? 'positive' : fourthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(fourthHouseBhavabala)}/100`,
      },
      {
        label:   { en: '5th House Bhavabala (Buddhi-Bhrama)', hi: 'पंचम भावबल (बुद्धि-भ्रम)' },
        verdict: fifthHouseBhavabala >= 50 ? 'positive' : fifthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(fifthHouseBhavabala)}/100`,
      },
      {
        label:   { en: '12th House Bhavabala (Subconscious Imbalance)', hi: 'द्वादश भावबल (अवचेतन असंतुलन)' },
        verdict: twelfthHouseBhavabala >= 50 ? 'positive' : twelfthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(twelfthHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = PSYCHIATRIC_SIGNATURE_IDS
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
    console.error('[health-diagnosis/psychiatric] scorePsychiatric failed:', err);
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
