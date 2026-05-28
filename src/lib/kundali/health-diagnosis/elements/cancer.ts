// src/lib/kundali/health-diagnosis/elements/cancer.ts
//
// Task B21 — Cancer Diathesis element scorer (opt-in, mixed badge, requiresDisclaimer: true).
//
// Classical sources: Saravali-5, Bhrigu-Samhita, Sarvartha-Chintamani
//
// Primary indicators (per spec §4.21):
//   Saturn    — chronic cellular degeneration [Saravali]
//   Rahu      — unnatural growth
//   Mars      — acute malignant transition
//   8th house — malignancy house
//   6th house — disease house
//
// IMPORTANT boundary (per spec §4.14 and §4.21):
//   The Saturn-Rahu malignancy interpretation (saturn_rahu_malignancy signature)
//   appears in THIS element ONLY — not in 'chronic'. The chronic element uses
//   the chronicity axis only. This element is opt-in gated.
//
// Weight vector axes (names must match weights.ts exactly):
//   saturnShadbala       0.20
//   rahuPlacement        0.20  (inverted)
//   marsShadbala         0.15
//   eighthHouseBhavabala 0.20
//   sixthHouseBhavabala  0.10
//   lagnaHouseBhavabala  0.05
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
  yogaSignatureContribution,
} from '../scoring-utils';
import { PLANET_IDS } from '@/lib/constants/grahas';

const CATALOG_META = ELEMENT_CATALOG['cancer'];
const WEIGHTS = weightVectorForElement('cancer');

const CANCER_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('cancer'))
  .map(s => s.id);

const MARS_ID   = PLANET_IDS.MARS;   // acute malignant transition
const SATURN_ID = PLANET_IDS.SATURN; // chronic cellular degeneration

export function scoreCancer(
  _k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const saturnStrength = strength.planets[SATURN_ID]?.overall ?? 0;
    const marsStrength   = strength.planets[MARS_ID]?.overall ?? 0;

    const eighthHouseBhavabala = strength.houses[8]?.bhavabala ?? 0;
    const sixthHouseBhavabala  = strength.houses[6]?.bhavabala ?? 0;
    const lagnaHouseBhavabala  = strength.houses[1]?.bhavabala ?? 0;

    // rahuPlacement — inverted: prominent Rahu = unnatural growth risk
    const rahuPlacementScore  = strength.derived.rahuPlacementScore;
    const rahuResilienceScore = Math.max(0, 100 - rahuPlacementScore);

    const yogaSignatureScore = yogaSignatureContribution(
      CANCER_SIGNATURE_IDS, signatures,
    );

    const resilience =
      saturnStrength        * w(WEIGHTS, 'saturnShadbala',       'cancer') +
      rahuResilienceScore   * w(WEIGHTS, 'rahuPlacement',        'cancer') +
      marsStrength          * w(WEIGHTS, 'marsShadbala',         'cancer') +
      eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala', 'cancer') +
      sixthHouseBhavabala   * w(WEIGHTS, 'sixthHouseBhavabala',  'cancer') +
      lagnaHouseBhavabala   * w(WEIGHTS, 'lagnaHouseBhavabala',  'cancer') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'cancer');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const saturnDignity = strength.planets[SATURN_ID]?.dignity ?? 'unknown';
    const rahuHouse     = strength.derived.rahuHouse;

    // Check if Saturn-Rahu malignancy signature is present (specific to this element)
    const saturnRahuPresent = signatures['saturn_rahu_malignancy'] === true;

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Saturn Strength (Chronic Cellular Degeneration)', hi: 'शनि बल (कोशिका अपकर्ष)' },
        verdict: saturnStrength >= 50 ? 'positive' : saturnStrength >= 25 ? 'neutral' : 'negative',
        value:   `${saturnDignity} (${Math.round(saturnStrength)}/100)`,
      },
      {
        label:   { en: 'Rahu Placement (Unnatural Growth)', hi: 'राहु स्थान (अप्राकृतिक वृद्धि)' },
        verdict: rahuPlacementScore <= 40 ? 'positive' : rahuPlacementScore <= 60 ? 'neutral' : 'negative',
        value:   rahuHouse !== undefined ? `House ${rahuHouse} (score: ${rahuPlacementScore})` : 'Unknown',
      },
      {
        label:   { en: 'Saturn-Rahu Malignancy Diathesis', hi: 'शनि-राहु कर्क योग' },
        verdict: saturnRahuPresent ? 'negative' : 'positive',
        value:   saturnRahuPresent ? 'Present (conjunction or 7th aspect)' : 'Absent',
      },
      {
        label:   { en: '8th House Bhavabala (Malignancy House)', hi: 'अष्टम भावबल (कर्क रोग भाव)' },
        verdict: eighthHouseBhavabala >= 50 ? 'positive' : eighthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(eighthHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Mars Strength (Acute Malignant Transition)', hi: 'मंगल बल (तीव्र घातक परिवर्तन)' },
        verdict: marsStrength >= 50 ? 'positive' : marsStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(marsStrength)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = CANCER_SIGNATURE_IDS
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
      badge:               CATALOG_META.badge, // 'mixed'
      natalScore:          Math.round(vuln),
      rating,
      factors,
      classicalSignatures,
      requiresDisclaimer:  CATALOG_META.requiresDisclaimer, // true
    };
  } catch (err) {
    console.error('[health-diagnosis/cancer] scoreCancer failed:', err);
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
