// src/lib/kundali/health-diagnosis/elements/respiratory.ts
//
// Task B5 — Respiratory System element scorer.
//
// Classical sources: BPHS-12, BPHS-24, Saravali-5, Ashtanga-Hridayam
//
// Primary indicators (per spec §4.5):
//   Mercury   — pulmonary vessels [Saravali-5]
//   Saturn    — chronic obstructive conditions
//   Jupiter   — immunity protection
//   3rd house — chest/lungs [BPHS-12]
//   4th house — pleural cavity
//   Lagna lord — overall constitution
//
// Weight vector axes (names must match weights.ts exactly):
//   mercuryShadbala      0.25
//   saturnShadbala       0.15
//   thirdHouseBhavabala  0.20
//   fourthHouseBhavabala 0.10
//   jupiterShadbala      0.10
//   yogaSignatures       0.15
//   lagnaLordDignity     0.05

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
  yogaSignatureContribution,
} from '../scoring-utils';

// ─── Module-level statics ─────────────────────────────────────────────────────

const CATALOG_META = ELEMENT_CATALOG['respiratory'];
const WEIGHTS = weightVectorForElement('respiratory');

const RESPIRATORY_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('respiratory'))
  .map(s => s.id);

// ─── Planet ID constants (0-based) ────────────────────────────────────────────
const MERCURY_ID = 3; // pulmonary vessels
const JUPITER_ID = 4; // immunity
const SATURN_ID  = 6; // chronic conditions

// ─── Main scorer ─────────────────────────────────────────────────────────────

export function scoreRespiratory(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const mercuryStrength = strength.planets[MERCURY_ID]?.overall ?? 0;
    const saturnStrength  = strength.planets[SATURN_ID]?.overall ?? 0;
    const jupiterStrength = strength.planets[JUPITER_ID]?.overall ?? 0;

    // thirdHouseBhavabala — chest/lungs house [BPHS-12]
    const thirdHouseBhavabala  = strength.houses[3]?.bhavabala ?? 0;
    const fourthHouseBhavabala = strength.houses[4]?.bhavabala ?? 0;

    const lagnaLordId = houseLordId(k, 1);
    const lagnaLordDignityScore =
      lagnaLordId !== undefined
        ? dignityToScore(strength.planets[lagnaLordId]?.dignity ?? 'unknown')
        : 0;

    const yogaSignatureScore = yogaSignatureContribution(
      RESPIRATORY_SIGNATURE_IDS, signatures,
    );

    const resilience =
      mercuryStrength       * w(WEIGHTS, 'mercuryShadbala',      'respiratory') +
      saturnStrength        * w(WEIGHTS, 'saturnShadbala',       'respiratory') +
      thirdHouseBhavabala   * w(WEIGHTS, 'thirdHouseBhavabala',  'respiratory') +
      fourthHouseBhavabala  * w(WEIGHTS, 'fourthHouseBhavabala', 'respiratory') +
      jupiterStrength       * w(WEIGHTS, 'jupiterShadbala',      'respiratory') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'respiratory') +
      lagnaLordDignityScore * w(WEIGHTS, 'lagnaLordDignity',     'respiratory');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const mercuryCombust = strength.planets[MERCURY_ID]?.isCombust ?? false;

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Mercury Strength (Pulmonary Vessels)', hi: 'बुध बल (फुफ्फुस वाहिनी)' },
        verdict: mercuryStrength >= 50 ? 'positive' : mercuryStrength >= 25 ? 'neutral' : 'negative',
        value:   mercuryCombust
          ? `${Math.round(mercuryStrength)}/100 (combust)`
          : `${Math.round(mercuryStrength)}/100`,
      },
      {
        label:   { en: 'Saturn Strength (Chronic Obstructive Risk)', hi: 'शनि बल (अवरोधक रोग)' },
        verdict: saturnStrength >= 50 ? 'positive' : saturnStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(saturnStrength)}/100`,
      },
      {
        label:   { en: '3rd House Bhavabala (Chest / Lungs)', hi: 'तृतीय भावबल (वक्ष / फेफड़े)' },
        verdict: thirdHouseBhavabala >= 50 ? 'positive' : thirdHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(thirdHouseBhavabala)}/100`,
      },
      {
        label:   { en: '4th House Bhavabala (Pleural Cavity)', hi: 'चतुर्थ भावबल (फुफ्फुस गुहा)' },
        verdict: fourthHouseBhavabala >= 50 ? 'positive' : fourthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(fourthHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Jupiter Strength (Immunity Protection)', hi: 'बृहस्पति बल (रोग प्रतिरोध)' },
        verdict: jupiterStrength >= 50 ? 'positive' : jupiterStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(jupiterStrength)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = RESPIRATORY_SIGNATURE_IDS
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
    console.error('[health-diagnosis/respiratory] scoreRespiratory failed:', err);
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
