// src/lib/kundali/health-diagnosis/elements/eyes.ts
//
// Task B10 — Eyes & Vision element scorer.
//
// Classical sources: BPHS-12, BPHS-24, Sarvartha-Chintamani-4, Saravali-5
//
// Primary indicators (per spec §4.10):
//   Sun       — right eye (males), left eye (females) [BPHS-12]
//   Moon      — opposite eye
//   Venus     — eye lustre
//   Mercury   — optic nerve
//   2nd house — right eye [BPHS-12]
//   12th house — left eye
//   6th house — eye diseases generally
//
// Weight vector axes (names must match weights.ts exactly):
//   sunShadbala            0.20
//   moonShadbala           0.20
//   secondHouseBhavabala   0.15
//   twelfthHouseBhavabala  0.15
//   sixthHouseBhavabala    0.10
//   yogaSignatures         0.15
//   venusShadbala          0.05

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

const CATALOG_META = ELEMENT_CATALOG['eyes'];
const WEIGHTS = weightVectorForElement('eyes');

const EYES_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('eyes'))
  .map(s => s.id);

const SUN_ID   = 0; // right/left eye
const MOON_ID  = 1; // opposite eye
const VENUS_ID = 5; // eye lustre

export function scoreEyes(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const sunStrength   = strength.planets[SUN_ID]?.overall ?? 0;
    const moonStrength  = strength.planets[MOON_ID]?.overall ?? 0;
    const venusStrength = strength.planets[VENUS_ID]?.overall ?? 0;

    const secondHouseBhavabala  = strength.houses[2]?.bhavabala ?? 0;
    const sixthHouseBhavabala   = strength.houses[6]?.bhavabala ?? 0;
    const twelfthHouseBhavabala = strength.houses[12]?.bhavabala ?? 0;

    const yogaSignatureScore =
      EYES_SIGNATURE_IDS.length > 0
        ? EYES_SIGNATURE_IDS.reduce(
            (acc, id) => acc + (signatures[id] ? 100 : 0),
            0,
          ) / EYES_SIGNATURE_IDS.length
        : 0;

    const resilience =
      sunStrength           * w(WEIGHTS, 'sunShadbala',            'eyes') +
      moonStrength          * w(WEIGHTS, 'moonShadbala',           'eyes') +
      secondHouseBhavabala  * w(WEIGHTS, 'secondHouseBhavabala',   'eyes') +
      twelfthHouseBhavabala * w(WEIGHTS, 'twelfthHouseBhavabala',  'eyes') +
      sixthHouseBhavabala   * w(WEIGHTS, 'sixthHouseBhavabala',    'eyes') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',         'eyes') +
      venusStrength         * w(WEIGHTS, 'venusShadbala',          'eyes');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const sunCombust  = strength.planets[SUN_ID]?.isCombust ?? false;
    const moonCombust = strength.planets[MOON_ID]?.isCombust ?? false;

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Sun Strength (Right/Left Eye)', hi: 'सूर्य बल (नेत्र)' },
        verdict: sunStrength >= 50 ? 'positive' : sunStrength >= 25 ? 'neutral' : 'negative',
        value:   sunCombust ? `${Math.round(sunStrength)}/100 (combust)` : `${Math.round(sunStrength)}/100`,
      },
      {
        label:   { en: 'Moon Strength (Opposite Eye)', hi: 'चंद्र बल (विपरीत नेत्र)' },
        verdict: moonStrength >= 50 ? 'positive' : moonStrength >= 25 ? 'neutral' : 'negative',
        value:   moonCombust ? `${Math.round(moonStrength)}/100 (combust)` : `${Math.round(moonStrength)}/100`,
      },
      {
        label:   { en: '2nd House Bhavabala (Right Eye)', hi: 'द्वितीय भावबल (दायां नेत्र)' },
        verdict: secondHouseBhavabala >= 50 ? 'positive' : secondHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(secondHouseBhavabala)}/100`,
      },
      {
        label:   { en: '12th House Bhavabala (Left Eye)', hi: 'द्वादश भावबल (बायां नेत्र)' },
        verdict: twelfthHouseBhavabala >= 50 ? 'positive' : twelfthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(twelfthHouseBhavabala)}/100`,
      },
      {
        label:   { en: '6th House Bhavabala (Eye Diseases)', hi: 'षष्ठ भावबल (नेत्र रोग)' },
        verdict: sixthHouseBhavabala >= 50 ? 'positive' : sixthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sixthHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Venus Strength (Eye Lustre)', hi: 'शुक्र बल (नेत्र कांति)' },
        verdict: venusStrength >= 50 ? 'positive' : venusStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(venusStrength)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = EYES_SIGNATURE_IDS
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
    console.error('[health-diagnosis/eyes] scoreEyes failed:', err);
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
