// src/lib/kundali/health-diagnosis/elements/cardiac.ts
//
// Task B4 — Cardiac / Circulatory System element scorer.
//
// Classical sources: BPHS-24, Saravali-5, Charaka
//
// Primary indicators (per spec §4.4):
//   Sun       — the heart itself [BPHS-4]
//   Mars      — blood pressure, acute events
//   Moon      — rasa dhatu / blood plasma
//   4th house — hridaya (heart) house [BPHS-12]
//
// Weight vector axes (names must match weights.ts exactly):
//   sunShadbala          0.25
//   fourthHouseBhavabala 0.20
//   marsShadbala         0.15
//   moonShadbala         0.10
//   yogaSignatures       0.15
//   lagnaLordShadbala    0.05
//   lagnaLordDignity     0.05
//   eighthHouseBhavabala 0.05

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

const CATALOG_META = ELEMENT_CATALOG['cardiac'];
const WEIGHTS = weightVectorForElement('cardiac');

const CARDIAC_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('cardiac'))
  .map(s => s.id);

// ─── Planet IDs (canonical — imported from @/lib/constants/grahas) ───────────
import { PLANET_IDS } from '@/lib/constants/grahas';
const SUN_ID  = PLANET_IDS.SUN;  // heart karaka
const MOON_ID = PLANET_IDS.MOON; // rasa dhatu
const MARS_ID = PLANET_IDS.MARS; // blood pressure

// ─── Main scorer ─────────────────────────────────────────────────────────────

export function scoreCardiac(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const sunStrength  = strength.planets[SUN_ID]?.overall ?? 0;
    const marsStrength = strength.planets[MARS_ID]?.overall ?? 0;
    const moonStrength = strength.planets[MOON_ID]?.overall ?? 0;

    const fourthHouseBhavabala = strength.houses[4]?.bhavabala ?? 0;
    const eighthHouseBhavabala = strength.houses[8]?.bhavabala ?? 0;

    const lagnaLordId = houseLordId(k, 1);
    const lagnaLordDignityScore =
      lagnaLordId !== undefined
        ? dignityToScore(strength.planets[lagnaLordId]?.dignity ?? 'unknown')
        : 0;
    const lagnaLordShadbala =
      lagnaLordId !== undefined
        ? (strength.planets[lagnaLordId]?.overall ?? 0)
        : 0;

    const yogaSignatureScore = yogaSignatureContribution(
      CARDIAC_SIGNATURE_IDS, signatures,
    );

    const resilience =
      sunStrength            * w(WEIGHTS, 'sunShadbala',          'cardiac') +
      fourthHouseBhavabala   * w(WEIGHTS, 'fourthHouseBhavabala', 'cardiac') +
      marsStrength           * w(WEIGHTS, 'marsShadbala',         'cardiac') +
      moonStrength           * w(WEIGHTS, 'moonShadbala',         'cardiac') +
      yogaSignatureScore     * w(WEIGHTS, 'yogaSignatures',       'cardiac') +
      lagnaLordShadbala      * w(WEIGHTS, 'lagnaLordShadbala',    'cardiac') +
      lagnaLordDignityScore  * w(WEIGHTS, 'lagnaLordDignity',     'cardiac') +
      eighthHouseBhavabala   * w(WEIGHTS, 'eighthHouseBhavabala', 'cardiac');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Sun Strength (Heart Karaka)', hi: 'सूर्य बल (हृदय कारक)' },
        verdict: sunStrength >= 50 ? 'positive' : sunStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sunStrength)}/100`,
      },
      {
        label:   { en: '4th House Bhavabala (Hridaya / Heart)', hi: 'चतुर्थ भावबल (हृदय)' },
        verdict: fourthHouseBhavabala >= 50 ? 'positive' : fourthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(fourthHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Mars Strength (Blood Pressure)', hi: 'मंगल बल (रक्तचाप)' },
        verdict: marsStrength >= 50 ? 'positive' : marsStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(marsStrength)}/100`,
      },
      {
        label:   { en: 'Moon Strength (Rasa Dhatu / Blood Plasma)', hi: 'चंद्र बल (रस धातु)' },
        verdict: moonStrength >= 50 ? 'positive' : moonStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(moonStrength)}/100`,
      },
      {
        label:   { en: '8th House Bhavabala (Chronic Heart Disease)', hi: 'अष्टम भावबल' },
        verdict: eighthHouseBhavabala >= 50 ? 'positive' : eighthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(eighthHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = CARDIAC_SIGNATURE_IDS
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
    console.error('[health-diagnosis/cardiac] scoreCardiac failed:', err);
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
