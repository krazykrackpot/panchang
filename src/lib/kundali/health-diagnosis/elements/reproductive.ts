// src/lib/kundali/health-diagnosis/elements/reproductive.ts
//
// Task B11 — Reproductive / Sexual Health element scorer.
//
// Classical sources: BPHS-4, BPHS-12, BPHS-24, Charaka-Shukravaha-Srotas, Sarvartha-Chintamani
//
// Primary indicators (per spec §4.11):
//   Venus     — shukra karaka [BPHS-4]
//   Mars      — menstruation / vigour
//   Moon      — hormonal cycles
//   Jupiter   — fertility (putra-karaka)
//   7th house — genitals [BPHS-12]
//   8th house — chronic reproductive disease
//
// Weight vector axes (names must match weights.ts exactly):
//   venusShadbala          0.25
//   marsShadbala           0.15
//   moonShadbala           0.10
//   jupiterShadbala        0.10
//   seventhHouseBhavabala  0.20
//   eighthHouseBhavabala   0.05
//   yogaSignatures         0.15

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

const CATALOG_META = ELEMENT_CATALOG['reproductive'];
const WEIGHTS = weightVectorForElement('reproductive');

const REPRODUCTIVE_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('reproductive'))
  .map(s => s.id);

const MOON_ID    = 1; // hormonal cycles
const MARS_ID    = 2; // menstruation / vigour
const JUPITER_ID = 4; // fertility
const VENUS_ID   = 5; // shukra karaka

export function scoreReproductive(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const venusStrength   = strength.planets[VENUS_ID]?.overall ?? 0;
    const marsStrength    = strength.planets[MARS_ID]?.overall ?? 0;
    const moonStrength    = strength.planets[MOON_ID]?.overall ?? 0;
    const jupiterStrength = strength.planets[JUPITER_ID]?.overall ?? 0;

    const seventhHouseBhavabala = strength.houses[7]?.bhavabala ?? 0;
    const eighthHouseBhavabala  = strength.houses[8]?.bhavabala ?? 0;

    const yogaSignatureScore =
      REPRODUCTIVE_SIGNATURE_IDS.length > 0
        ? REPRODUCTIVE_SIGNATURE_IDS.reduce(
            (acc, id) => acc + (signatures[id] ? 100 : 0),
            0,
          ) / REPRODUCTIVE_SIGNATURE_IDS.length
        : 0;

    const resilience =
      venusStrength         * w(WEIGHTS, 'venusShadbala',          'reproductive') +
      marsStrength          * w(WEIGHTS, 'marsShadbala',           'reproductive') +
      moonStrength          * w(WEIGHTS, 'moonShadbala',           'reproductive') +
      jupiterStrength       * w(WEIGHTS, 'jupiterShadbala',        'reproductive') +
      seventhHouseBhavabala * w(WEIGHTS, 'seventhHouseBhavabala',  'reproductive') +
      eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala',   'reproductive') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',         'reproductive');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const venusCombust  = strength.planets[VENUS_ID]?.isCombust ?? false;
    const venusDignity  = strength.planets[VENUS_ID]?.dignity ?? 'unknown';

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Venus Strength (Shukra Karaka)', hi: 'शुक्र बल (शुक्र कारक)' },
        verdict: venusStrength >= 50 ? 'positive' : venusStrength >= 25 ? 'neutral' : 'negative',
        value:   venusCombust
          ? `${venusDignity} (${Math.round(venusStrength)}/100, combust)`
          : `${venusDignity} (${Math.round(venusStrength)}/100)`,
      },
      {
        label:   { en: 'Mars Strength (Menstruation / Vigour)', hi: 'मंगल बल (रजोधर्म / ऊर्जा)' },
        verdict: marsStrength >= 50 ? 'positive' : marsStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(marsStrength)}/100`,
      },
      {
        label:   { en: 'Jupiter Strength (Fertility)', hi: 'बृहस्पति बल (प्रजनन शक्ति)' },
        verdict: jupiterStrength >= 50 ? 'positive' : jupiterStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(jupiterStrength)}/100`,
      },
      {
        label:   { en: '7th House Bhavabala (Genitals)', hi: 'सप्तम भावबल (जननांग)' },
        verdict: seventhHouseBhavabala >= 50 ? 'positive' : seventhHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(seventhHouseBhavabala)}/100`,
      },
      {
        label:   { en: 'Moon Strength (Hormonal Cycles)', hi: 'चंद्र बल (हार्मोन चक्र)' },
        verdict: moonStrength >= 50 ? 'positive' : moonStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(moonStrength)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = REPRODUCTIVE_SIGNATURE_IDS
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
    console.error('[health-diagnosis/reproductive] scoreReproductive failed:', err);
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
