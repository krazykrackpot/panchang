// src/lib/kundali/health-diagnosis/elements/surgery.ts
//
// Task B16 — Surgery / Hospitalisation element scorer.
//
// Classical sources: BPHS-24, Saravali
//
// Primary indicators (per spec §4.16):
//   Mars      — the surgeon / the knife
//   Saturn    — chronic hospitalisation
//   8th house — surgical event itself
//   12th house — hospitalisation / confinement
//
// Weight vector axes (names must match weights.ts exactly):
//   marsShadbala          0.25
//   saturnShadbala        0.15
//   eighthHouseBhavabala  0.25
//   twelfthHouseBhavabala 0.20
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
} from '../scoring-utils';

const CATALOG_META = ELEMENT_CATALOG['surgery'];
const WEIGHTS = weightVectorForElement('surgery');

const SURGERY_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('surgery'))
  .map(s => s.id);

const MARS_ID   = 2; // surgeon / knife
const SATURN_ID = 6; // chronic hospitalisation

export function scoreSurgery(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const marsStrength   = strength.planets[MARS_ID]?.overall ?? 0;
    const saturnStrength = strength.planets[SATURN_ID]?.overall ?? 0;

    const eighthHouseBhavabala  = strength.houses[8]?.bhavabala ?? 0;
    const twelfthHouseBhavabala = strength.houses[12]?.bhavabala ?? 0;

    const yogaSignatureScore =
      SURGERY_SIGNATURE_IDS.length > 0
        ? SURGERY_SIGNATURE_IDS.reduce(
            (acc, id) => acc + (signatures[id] ? 100 : 0),
            0,
          ) / SURGERY_SIGNATURE_IDS.length
        : 0;

    const resilience =
      marsStrength          * w(WEIGHTS, 'marsShadbala',          'surgery') +
      saturnStrength        * w(WEIGHTS, 'saturnShadbala',        'surgery') +
      eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala',  'surgery') +
      twelfthHouseBhavabala * w(WEIGHTS, 'twelfthHouseBhavabala', 'surgery') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',        'surgery');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const marsDignity = strength.planets[MARS_ID]?.dignity ?? 'unknown';

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Mars Strength (Surgeon / Knife)', hi: 'मंगल बल (शल्य कारक)' },
        verdict: marsStrength >= 50 ? 'positive' : marsStrength >= 25 ? 'neutral' : 'negative',
        value:   `${marsDignity} (${Math.round(marsStrength)}/100)`,
      },
      {
        label:   { en: 'Saturn Strength (Chronic Hospitalisation)', hi: 'शनि बल (दीर्घकालिक चिकित्सालय)' },
        verdict: saturnStrength >= 50 ? 'positive' : saturnStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(saturnStrength)}/100`,
      },
      {
        label:   { en: '8th House Bhavabala (Surgical Event)', hi: 'अष्टम भावबल (शल्य घटना)' },
        verdict: eighthHouseBhavabala >= 50 ? 'positive' : eighthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(eighthHouseBhavabala)}/100`,
      },
      {
        label:   { en: '12th House Bhavabala (Hospitalisation)', hi: 'द्वादश भावबल (चिकित्सालय भर्ती)' },
        verdict: twelfthHouseBhavabala >= 50 ? 'positive' : twelfthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(twelfthHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = SURGERY_SIGNATURE_IDS
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
    console.error('[health-diagnosis/surgery] scoreSurgery failed:', err);
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
