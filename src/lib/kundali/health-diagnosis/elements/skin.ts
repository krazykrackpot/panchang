// src/lib/kundali/health-diagnosis/elements/skin.ts
//
// Task B9 — Skin & Hair element scorer.
//
// Classical sources: BPHS-24, Saravali-5
//
// Primary indicators (per spec §4.9):
//   Mercury   — twak karaka (skin texture/sensitivity) [Saravali-5]
//   Venus     — lustre, hair quality
//   Saturn    — chronic skin disease
//   Mars      — acne / eruptions
//   6th house — skin diseases generally [BPHS-24]
//   8th house — chronic skin disease
//
// Weight vector axes (names must match weights.ts exactly):
//   mercuryShadbala      0.20
//   venusShadbala        0.20
//   saturnShadbala       0.15
//   marsShadbala         0.10
//   sixthHouseBhavabala  0.15
//   eighthHouseBhavabala 0.10
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

const CATALOG_META = ELEMENT_CATALOG['skin'];
const WEIGHTS = weightVectorForElement('skin');

const SKIN_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('skin'))
  .map(s => s.id);

const MARS_ID    = 2; // acne / eruptions
const MERCURY_ID = 3; // twak karaka
const VENUS_ID   = 5; // lustre, hair quality
const SATURN_ID  = 6; // chronic skin disease

export function scoreSkin(
  _k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const mercuryStrength = strength.planets[MERCURY_ID]?.overall ?? 0;
    const venusStrength   = strength.planets[VENUS_ID]?.overall ?? 0;
    const saturnStrength  = strength.planets[SATURN_ID]?.overall ?? 0;
    const marsStrength    = strength.planets[MARS_ID]?.overall ?? 0;

    const sixthHouseBhavabala  = strength.houses[6]?.bhavabala ?? 0;
    const eighthHouseBhavabala = strength.houses[8]?.bhavabala ?? 0;

    const yogaSignatureScore = yogaSignatureContribution(
      SKIN_SIGNATURE_IDS, signatures,
    );

    const resilience =
      mercuryStrength       * w(WEIGHTS, 'mercuryShadbala',      'skin') +
      venusStrength         * w(WEIGHTS, 'venusShadbala',        'skin') +
      saturnStrength        * w(WEIGHTS, 'saturnShadbala',       'skin') +
      marsStrength          * w(WEIGHTS, 'marsShadbala',         'skin') +
      sixthHouseBhavabala   * w(WEIGHTS, 'sixthHouseBhavabala',  'skin') +
      eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala', 'skin') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'skin');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const mercuryCombust = strength.planets[MERCURY_ID]?.isCombust ?? false;
    const venusDignity   = strength.planets[VENUS_ID]?.dignity ?? 'unknown';

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Mercury Strength (Twak Karaka / Skin)', hi: 'बुध बल (त्वक् कारक)' },
        verdict: mercuryStrength >= 50 ? 'positive' : mercuryStrength >= 25 ? 'neutral' : 'negative',
        value:   mercuryCombust
          ? `${Math.round(mercuryStrength)}/100 (combust — sensitivity risk)`
          : `${Math.round(mercuryStrength)}/100`,
      },
      {
        label:   { en: 'Venus Strength (Lustre / Hair Quality)', hi: 'शुक्र बल (कांति / केश)' },
        verdict: venusStrength >= 50 ? 'positive' : venusStrength >= 25 ? 'neutral' : 'negative',
        value:   `${venusDignity} (${Math.round(venusStrength)}/100)`,
      },
      {
        label:   { en: 'Saturn Strength (Chronic Skin Disease)', hi: 'शनि बल (दीर्घकालिक त्वचा रोग)' },
        verdict: saturnStrength >= 50 ? 'positive' : saturnStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(saturnStrength)}/100`,
      },
      {
        label:   { en: 'Mars Strength (Acne / Eruptions)', hi: 'मंगल बल (मुहांसे / उद्भेद)' },
        verdict: marsStrength >= 50 ? 'positive' : marsStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(marsStrength)}/100`,
      },
      {
        label:   { en: '6th House Bhavabala (Skin Diseases)', hi: 'षष्ठ भावबल (त्वचा रोग)' },
        verdict: sixthHouseBhavabala >= 50 ? 'positive' : sixthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sixthHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = SKIN_SIGNATURE_IDS
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
    console.error('[health-diagnosis/skin] scoreSkin failed:', err);
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
