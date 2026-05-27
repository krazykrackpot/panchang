// src/lib/kundali/health-diagnosis/elements/sleep.ts
//
// Task B19 — Sleep & Dreams element scorer.
//
// Classical sources: BPHS-12, Saravali
//
// Primary indicators (per spec §4.19):
//   Moon      — sleep itself [BPHS]
//   Saturn    — sleep disruption
//   Ketu      — dream activity / nightmares
//   Mercury   — mental chatter blocking sleep
//   12th house — shayya sukha (bed comfort / sleep) [BPHS-12]
//
// Weight vector axes (names must match weights.ts exactly):
//   moonShadbala          0.20
//   moonPakshaBala        0.15  (waning Moon = sleep difficulty)
//   saturnShadbala        0.15
//   twelfthHouseBhavabala 0.25
//   yogaSignatures        0.15
//   mercuryShadbala       0.10

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

const CATALOG_META = ELEMENT_CATALOG['sleep'];
const WEIGHTS = weightVectorForElement('sleep');

const SLEEP_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('sleep'))
  .map(s => s.id);

const MOON_ID    = 1; // sleep
const MERCURY_ID = 3; // mental chatter
const SATURN_ID  = 6; // sleep disruption

export function scoreSleep(
  _k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const moonStrength    = strength.planets[MOON_ID]?.overall ?? 0;
    const mercuryStrength = strength.planets[MERCURY_ID]?.overall ?? 0;
    const saturnStrength  = strength.planets[SATURN_ID]?.overall ?? 0;

    // moonPakshaBala — waning Moon (lower score) = more sleep difficulty
    const moonPakshaBala = strength.derived.moonPakshaBala;

    const twelfthHouseBhavabala = strength.houses[12]?.bhavabala ?? 0;

    const yogaSignatureScore = yogaSignatureContribution(
      SLEEP_SIGNATURE_IDS, signatures,
    );

    const resilience =
      moonStrength          * w(WEIGHTS, 'moonShadbala',          'sleep') +
      moonPakshaBala        * w(WEIGHTS, 'moonPakshaBala',        'sleep') +
      saturnStrength        * w(WEIGHTS, 'saturnShadbala',        'sleep') +
      twelfthHouseBhavabala * w(WEIGHTS, 'twelfthHouseBhavabala', 'sleep') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',        'sleep') +
      mercuryStrength       * w(WEIGHTS, 'mercuryShadbala',       'sleep');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const ketuHouse = strength.derived.ketuHouse;
    const ketuIn12  = ketuHouse === 12;

    const factors: ScoringFactor[] = [
      {
        label:   { en: '12th House Bhavabala (Shayya Sukha / Sleep)', hi: 'द्वादश भावबल (शय्या सुख)' },
        verdict: twelfthHouseBhavabala >= 50 ? 'positive' : twelfthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(twelfthHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Moon Strength (Sleep Karaka)', hi: 'चंद्र बल (निद्रा कारक)' },
        verdict: moonStrength >= 50 ? 'positive' : moonStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(moonStrength)}/100`,
      },
      {
        label:   { en: 'Moon Paksha Bala (Waxing/Waning)', hi: 'चंद्र पक्ष बल (निद्रा)' },
        verdict: moonPakshaBala >= 60 ? 'positive' : moonPakshaBala >= 30 ? 'neutral' : 'negative',
        value:   `${Math.round(moonPakshaBala)}/100`,
      },
      {
        label:   { en: 'Saturn Strength (Sleep Disruption)', hi: 'शनि बल (निद्रा व्यवधान)' },
        verdict: saturnStrength >= 50 ? 'positive' : saturnStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(saturnStrength)}/100`,
      },
      {
        label:   { en: 'Ketu in 12th (Nightmare / Dream-State)', hi: 'केतु द्वादश (स्वप्न / दु:स्वप्न)' },
        verdict: ketuIn12 ? 'negative' : 'neutral',
        value:   ketuHouse !== undefined ? `Ketu in house ${ketuHouse}` : 'Ketu position unknown',
      },
      {
        label:   { en: 'Mercury Strength (Mental Chatter)', hi: 'बुध बल (मानसिक चर्चा)' },
        verdict: mercuryStrength >= 50 ? 'positive' : mercuryStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(mercuryStrength)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = SLEEP_SIGNATURE_IDS
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
    console.error('[health-diagnosis/sleep] scoreSleep failed:', err);
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
