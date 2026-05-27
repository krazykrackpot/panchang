// src/lib/kundali/health-diagnosis/elements/muscular.ts
//
// Task B8 — Muscular / Inflammation element scorer.
//
// Classical sources: BPHS-4, BPHS-24, Charaka-Raktapitta
//
// Primary indicators (per spec §4.8):
//   Mars      — mamsa karaka [BPHS-4]
//   Sun       — heat / vitality
//   Rahu      — unexplained inflammation
//   3rd house — muscular strength of arms
//   6th house — acute inflammation / disease house
//
// Weight vector axes (names must match weights.ts exactly):
//   marsShadbala        0.30
//   sunShadbala         0.15
//   rahuPlacement       0.10  (inverted)
//   thirdHouseBhavabala 0.15
//   sixthHouseBhavabala 0.15
//   yogaSignatures      0.15

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

const CATALOG_META = ELEMENT_CATALOG['muscular'];
const WEIGHTS = weightVectorForElement('muscular');

const MUSCULAR_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('muscular'))
  .map(s => s.id);

const SUN_ID  = 0;
const MARS_ID = 2; // mamsa karaka

export function scoreMuscular(
  _k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const marsStrength = strength.planets[MARS_ID]?.overall ?? 0;
    const sunStrength  = strength.planets[SUN_ID]?.overall ?? 0;

    const thirdHouseBhavabala = strength.houses[3]?.bhavabala ?? 0;
    const sixthHouseBhavabala = strength.houses[6]?.bhavabala ?? 0;

    // rahuPlacement — inverted: higher placement = more unexplained inflammation risk
    const rahuPlacementScore  = strength.derived.rahuPlacementScore;
    const rahuResilienceScore = Math.max(0, 100 - rahuPlacementScore);

    const yogaSignatureScore = yogaSignatureContribution(
      MUSCULAR_SIGNATURE_IDS, signatures,
    );

    const resilience =
      marsStrength          * w(WEIGHTS, 'marsShadbala',         'muscular') +
      sunStrength           * w(WEIGHTS, 'sunShadbala',          'muscular') +
      rahuResilienceScore   * w(WEIGHTS, 'rahuPlacement',        'muscular') +
      thirdHouseBhavabala   * w(WEIGHTS, 'thirdHouseBhavabala',  'muscular') +
      sixthHouseBhavabala   * w(WEIGHTS, 'sixthHouseBhavabala',  'muscular') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'muscular');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const marsIsRetrograde = strength.planets[MARS_ID]?.isRetrograde ?? false;
    const marsIsCombust    = strength.planets[MARS_ID]?.isCombust ?? false;
    const rahuHouse        = strength.derived.rahuHouse;

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Mars Strength (Mamsa Karaka)', hi: 'मंगल बल (मांस कारक)' },
        verdict: marsStrength >= 50 ? 'positive' : marsStrength >= 25 ? 'neutral' : 'negative',
        value:   [
          `${Math.round(marsStrength)}/100`,
          marsIsRetrograde ? '(retrograde)' : '',
          marsIsCombust ? '(combust)' : '',
        ].filter(Boolean).join(' '),
      },
      {
        label:   { en: 'Sun Strength (Heat / Vitality)', hi: 'सूर्य बल (ताप / जीवन शक्ति)' },
        verdict: sunStrength >= 50 ? 'positive' : sunStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sunStrength)}/100`,
      },
      {
        label:   { en: 'Rahu Placement (Unexplained Inflammation)', hi: 'राहु स्थान (अव्यक्त सूजन)' },
        verdict: rahuPlacementScore <= 40 ? 'positive' : rahuPlacementScore <= 60 ? 'neutral' : 'negative',
        value:   rahuHouse !== undefined ? `House ${rahuHouse}` : 'Unknown',
      },
      {
        label:   { en: '3rd House Bhavabala (Muscular Strength)', hi: 'तृतीय भावबल (मांसपेशी बल)' },
        verdict: thirdHouseBhavabala >= 50 ? 'positive' : thirdHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(thirdHouseBhavabala)}/100`,
      },
      {
        label:   { en: '6th House Bhavabala (Inflammation / Disease)', hi: 'षष्ठ भावबल (सूजन / रोग)' },
        verdict: sixthHouseBhavabala >= 50 ? 'positive' : sixthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sixthHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = MUSCULAR_SIGNATURE_IDS
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
    console.error('[health-diagnosis/muscular] scoreMuscular failed:', err);
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
