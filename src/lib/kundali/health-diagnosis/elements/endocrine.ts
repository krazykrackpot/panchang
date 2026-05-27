// src/lib/kundali/health-diagnosis/elements/endocrine.ts
//
// Task B12 — Endocrine / Hormonal element scorer (Inferential badge).
//
// Classical sources: Jataka-Parijata-5, Saravali-5
//
// Primary indicators (per spec §4.12):
//   Jupiter   — pancreas / medha karaka [Jataka-Parijata-5]
//   Venus     — hormonal balance
//   Moon      — cyclical hormones
//   5th house — pancreas (Jupiter's karaka house)
//
// NOTE: This element has 'inferential' badge — modern Jyotish synthesis
// with weaker classical grounding. The tests must assert badge === 'inferential'.
//
// Weight vector axes (names must match weights.ts exactly):
//   jupiterShadbala     0.30
//   venusShadbala       0.20
//   moonShadbala        0.15
//   fifthHouseBhavabala 0.20
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

const CATALOG_META = ELEMENT_CATALOG['endocrine'];
const WEIGHTS = weightVectorForElement('endocrine');

const ENDOCRINE_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('endocrine'))
  .map(s => s.id);

const MOON_ID    = 1; // cyclical hormones
const JUPITER_ID = 4; // pancreas / medha karaka
const VENUS_ID   = 5; // hormonal balance

export function scoreEndocrine(
  _k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const jupiterStrength = strength.planets[JUPITER_ID]?.overall ?? 0;
    const venusStrength   = strength.planets[VENUS_ID]?.overall ?? 0;
    const moonStrength    = strength.planets[MOON_ID]?.overall ?? 0;

    const fifthHouseBhavabala = strength.houses[5]?.bhavabala ?? 0;

    const yogaSignatureScore = yogaSignatureContribution(
      ENDOCRINE_SIGNATURE_IDS, signatures,
    );

    const resilience =
      jupiterStrength     * w(WEIGHTS, 'jupiterShadbala',     'endocrine') +
      venusStrength       * w(WEIGHTS, 'venusShadbala',       'endocrine') +
      moonStrength        * w(WEIGHTS, 'moonShadbala',        'endocrine') +
      fifthHouseBhavabala * w(WEIGHTS, 'fifthHouseBhavabala', 'endocrine') +
      yogaSignatureScore  * w(WEIGHTS, 'yogaSignatures',      'endocrine');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const jupiterDignity   = strength.planets[JUPITER_ID]?.dignity ?? 'unknown';
    const jupiterDebilited = jupiterDignity === 'debilitated';

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Jupiter Strength (Pancreas / Medha Karaka)', hi: 'बृहस्पति बल (अग्न्याशय / मेधा कारक)' },
        verdict: jupiterStrength >= 50 ? 'positive' : jupiterStrength >= 25 ? 'neutral' : 'negative',
        value:   jupiterDebilited
          ? `${jupiterDignity} (${Math.round(jupiterStrength)}/100 — diabetes signal)`
          : `${jupiterDignity} (${Math.round(jupiterStrength)}/100)`,
      },
      {
        label:   { en: 'Venus Strength (Hormonal Balance)', hi: 'शुक्र बल (हार्मोन संतुलन)' },
        verdict: venusStrength >= 50 ? 'positive' : venusStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(venusStrength)}/100`,
      },
      {
        label:   { en: 'Moon Strength (Cyclical Hormones)', hi: 'चंद्र बल (चक्रीय हार्मोन)' },
        verdict: moonStrength >= 50 ? 'positive' : moonStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(moonStrength)}/100`,
      },
      {
        label:   { en: '5th House Bhavabala (Pancreatic Function)', hi: 'पंचम भावबल (अग्न्याशय कार्य)' },
        verdict: fifthHouseBhavabala >= 50 ? 'positive' : fifthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(fifthHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = ENDOCRINE_SIGNATURE_IDS
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
      badge:               CATALOG_META.badge, // 'inferential'
      natalScore:          Math.round(vuln),
      rating,
      factors,
      classicalSignatures,
      requiresDisclaimer:  CATALOG_META.requiresDisclaimer,
    };
  } catch (err) {
    console.error('[health-diagnosis/endocrine] scoreEndocrine failed:', err);
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
