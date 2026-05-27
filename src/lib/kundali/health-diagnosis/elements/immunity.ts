// src/lib/kundali/health-diagnosis/elements/immunity.ts
//
// Task B13 — Immunity / Ojas element scorer.
//
// Classical sources: Charaka-Sutra, Jaimini, BPHS
//
// Primary indicators (per spec §4.13):
//   Jupiter   — ojas karaka [Charaka-Sutra]
//   Sun       — agni → ojas
//   Lagna lord — sharira-bala (body's defence)
//   1st house — body's defence frame
//   8th house — depletion (strong 8th = good; weak = vulnerable)
//
// Weight vector axes (names must match weights.ts exactly):
//   jupiterShadbala     0.30
//   sunShadbala         0.15
//   lagnaLordDignity    0.15
//   lagnaLordShadbala   0.10
//   lagnaHouseBhavabala 0.10
//   eighthHouseBhavabala 0.10
//   yogaSignatures      0.10

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

const CATALOG_META = ELEMENT_CATALOG['immunity'];
const WEIGHTS = weightVectorForElement('immunity');

const IMMUNITY_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('immunity'))
  .map(s => s.id);

const SUN_ID     = 0; // agni → ojas
const JUPITER_ID = 4; // ojas karaka

export function scoreImmunity(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const jupiterStrength = strength.planets[JUPITER_ID]?.overall ?? 0;
    const sunStrength     = strength.planets[SUN_ID]?.overall ?? 0;

    const lagnaLordId = houseLordId(k, 1);
    const lagnaLordDignityScore =
      lagnaLordId !== undefined
        ? dignityToScore(strength.planets[lagnaLordId]?.dignity ?? 'unknown')
        : 0;
    const lagnaLordShadbala =
      lagnaLordId !== undefined
        ? (strength.planets[lagnaLordId]?.overall ?? 0)
        : 0;

    const lagnaHouseBhavabala  = strength.houses[1]?.bhavabala ?? 0;
    const eighthHouseBhavabala = strength.houses[8]?.bhavabala ?? 0;

    const yogaSignatureScore = yogaSignatureContribution(
      IMMUNITY_SIGNATURE_IDS, signatures,
    );

    const resilience =
      jupiterStrength       * w(WEIGHTS, 'jupiterShadbala',      'immunity') +
      sunStrength           * w(WEIGHTS, 'sunShadbala',          'immunity') +
      lagnaLordDignityScore * w(WEIGHTS, 'lagnaLordDignity',     'immunity') +
      lagnaLordShadbala     * w(WEIGHTS, 'lagnaLordShadbala',    'immunity') +
      lagnaHouseBhavabala   * w(WEIGHTS, 'lagnaHouseBhavabala',  'immunity') +
      eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala', 'immunity') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'immunity');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const jupiterDignity = strength.planets[JUPITER_ID]?.dignity ?? 'unknown';
    const jupiterInDusthana =
      [6, 8, 12].includes(k.planets.find(p => p.planet.id === JUPITER_ID)?.house ?? 0);

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Jupiter Strength (Ojas Karaka)', hi: 'बृहस्पति बल (ओज कारक)' },
        verdict: jupiterStrength >= 50 ? 'positive' : jupiterStrength >= 25 ? 'neutral' : 'negative',
        value:   jupiterInDusthana
          ? `${jupiterDignity} (${Math.round(jupiterStrength)}/100 — dusthana placement)`
          : `${jupiterDignity} (${Math.round(jupiterStrength)}/100)`,
      },
      {
        label:   { en: 'Sun Strength (Agni → Ojas)', hi: 'सूर्य बल (अग्नि → ओज)' },
        verdict: sunStrength >= 50 ? 'positive' : sunStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sunStrength)}/100`,
      },
      {
        label:   { en: 'Lagna Lord Dignity (Sharira-Bala)', hi: 'लग्नेश गरिमा (शरीर बल)' },
        verdict: lagnaLordDignityScore >= 65 ? 'positive' : lagnaLordDignityScore >= 40 ? 'neutral' : 'negative',
        value:   lagnaLordId !== undefined
          ? `${strength.planets[lagnaLordId]?.dignity ?? 'unknown'} (${Math.round(lagnaLordDignityScore)}/100)`
          : 'unknown',
      },
      {
        label:   { en: '1st House Bhavabala (Defence Frame)', hi: 'प्रथम भावबल (रक्षा तंत्र)' },
        verdict: lagnaHouseBhavabala >= 50 ? 'positive' : lagnaHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(lagnaHouseBhavabala)}/100`,
      },
      {
        label:   { en: '8th House Bhavabala (Vitality Depletion)', hi: 'अष्टम भावबल (ओज ह्रास)' },
        verdict: eighthHouseBhavabala >= 50 ? 'positive' : eighthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(eighthHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = IMMUNITY_SIGNATURE_IDS
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
    console.error('[health-diagnosis/immunity] scoreImmunity failed:', err);
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
