// src/lib/kundali/health-diagnosis/elements/allergies.ts
//
// Task B20 — Allergies / Autoimmune element scorer (opt-in, Inferential badge).
// defaultVisible: false — opt-in only. badge: 'inferential'.
//
// Classical sources: Saravali (modern Jyotish synthesis, flagged inferential)
//
// Primary indicators (per spec §4.20):
//   Rahu      — foreign-substance reaction karaka [Bhrigu-Samhita]
//   Mercury   — sensitivity of skin and nerves
//   Ketu      — autoimmune (body attacking itself)
//   6th house — immune disease house
//   1st house — overall sensitivity tone
//
// Weight vector axes (names must match weights.ts exactly):
//   rahuPlacement       0.30  (inverted)
//   mercuryShadbala     0.20
//   ketuPlacement       0.15  (inverted)
//   sixthHouseBhavabala 0.20
//   lagnaHouseBhavabala 0.05
//   yogaSignatures      0.10

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

const CATALOG_META = ELEMENT_CATALOG['allergies'];
const WEIGHTS = weightVectorForElement('allergies');

const ALLERGIES_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('allergies'))
  .map(s => s.id);

const MERCURY_ID = 3; // sensitivity

export function scoreAllergies(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const mercuryStrength = strength.planets[MERCURY_ID]?.overall ?? 0;

    const sixthHouseBhavabala = strength.houses[6]?.bhavabala ?? 0;
    const lagnaHouseBhavabala = strength.houses[1]?.bhavabala ?? 0;

    // rahuPlacement — inverted: prominent Rahu = more allergy/autoimmune risk
    const rahuPlacementScore  = strength.derived.rahuPlacementScore;
    const rahuResilienceScore = Math.max(0, 100 - rahuPlacementScore);

    // ketuPlacement — inverted: prominent Ketu = more autoimmune risk
    const ketuPlacementScore  = strength.derived.ketuPlacementScore;
    const ketuResilienceScore = Math.max(0, 100 - ketuPlacementScore);

    const yogaSignatureScore =
      ALLERGIES_SIGNATURE_IDS.length > 0
        ? ALLERGIES_SIGNATURE_IDS.reduce(
            (acc, id) => acc + (signatures[id] ? 100 : 0),
            0,
          ) / ALLERGIES_SIGNATURE_IDS.length
        : 0;

    const resilience =
      rahuResilienceScore * w(WEIGHTS, 'rahuPlacement',       'allergies') +
      mercuryStrength     * w(WEIGHTS, 'mercuryShadbala',     'allergies') +
      ketuResilienceScore * w(WEIGHTS, 'ketuPlacement',       'allergies') +
      sixthHouseBhavabala * w(WEIGHTS, 'sixthHouseBhavabala', 'allergies') +
      lagnaHouseBhavabala * w(WEIGHTS, 'lagnaHouseBhavabala', 'allergies') +
      yogaSignatureScore  * w(WEIGHTS, 'yogaSignatures',      'allergies');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const rahuHouse = strength.derived.rahuHouse;
    const ketuHouse = strength.derived.ketuHouse;
    const mercuryCombust = strength.planets[MERCURY_ID]?.isCombust ?? false;

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Rahu Placement (Foreign Substance Reaction)', hi: 'राहु स्थान (विदेशी पदार्थ प्रतिक्रिया)' },
        verdict: rahuPlacementScore <= 40 ? 'positive' : rahuPlacementScore <= 60 ? 'neutral' : 'negative',
        value:   rahuHouse !== undefined ? `House ${rahuHouse} (score: ${rahuPlacementScore})` : 'Unknown',
      },
      {
        label:   { en: 'Mercury Strength (Skin/Nerve Sensitivity)', hi: 'बुध बल (त्वचा संवेदनशीलता)' },
        verdict: mercuryStrength >= 50 ? 'positive' : mercuryStrength >= 25 ? 'neutral' : 'negative',
        value:   mercuryCombust
          ? `${Math.round(mercuryStrength)}/100 (combust)`
          : `${Math.round(mercuryStrength)}/100`,
      },
      {
        label:   { en: 'Ketu Placement (Autoimmune Signal)', hi: 'केतु स्थान (स्व-प्रतिरक्षा)' },
        verdict: ketuPlacementScore <= 40 ? 'positive' : ketuPlacementScore <= 60 ? 'neutral' : 'negative',
        value:   ketuHouse !== undefined ? `House ${ketuHouse} (score: ${ketuPlacementScore})` : 'Unknown',
      },
      {
        label:   { en: '6th House Bhavabala (Immune Disease)', hi: 'षष्ठ भावबल (रोग प्रतिरक्षा)' },
        verdict: sixthHouseBhavabala >= 50 ? 'positive' : sixthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sixthHouseBhavabala)}/100`,
      },
      {
        label:   { en: '1st House Bhavabala (Sensitivity Tone)', hi: 'प्रथम भावबल (संवेदनशीलता)' },
        verdict: lagnaHouseBhavabala >= 50 ? 'positive' : lagnaHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(lagnaHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = ALLERGIES_SIGNATURE_IDS
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
    console.error('[health-diagnosis/allergies] scoreAllergies failed:', err);
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
