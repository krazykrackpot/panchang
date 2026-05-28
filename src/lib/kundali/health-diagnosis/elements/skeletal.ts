// src/lib/kundali/health-diagnosis/elements/skeletal.ts
//
// Task B7 — Bones / Joints / Skeletal element scorer.
//
// Classical sources: BPHS-4, BPHS-24, Charaka, Saravali
//
// Primary indicators (per spec §4.7):
//   Saturn    — asthi karaka [BPHS-4]
//   Sun       — skeletal frame vitality, calcium absorption
//   10th house — knees / spine [BPHS-12]
//   8th house  — chronic joint issues
//
// Weight vector axes (names must match weights.ts exactly):
//   saturnShadbala       0.25
//   saturnAvastha        0.15
//   sunShadbala          0.15
//   tenthHouseBhavabala  0.20
//   eighthHouseBhavabala 0.10
//   yogaSignatures       0.15

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

// ─── Module-level statics ─────────────────────────────────────────────────────

const CATALOG_META = ELEMENT_CATALOG['skeletal'];
const WEIGHTS = weightVectorForElement('skeletal');

const SKELETAL_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('skeletal'))
  .map(s => s.id);

// ─── Planet IDs (canonical — imported from @/lib/constants/grahas) ───────────
import { PLANET_IDS } from '@/lib/constants/grahas';
const SUN_ID    = PLANET_IDS.SUN;    // skeletal frame vitality
const SATURN_ID = PLANET_IDS.SATURN; // asthi karaka

// ─── Main scorer ─────────────────────────────────────────────────────────────

export function scoreSkeletal(
  _k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  try {
    const sunStrength    = strength.planets[SUN_ID]?.overall ?? 0;
    const saturnStrength = strength.planets[SATURN_ID]?.overall ?? 0;

    // saturnAvastha — Baladi avastha of Saturn (0-100)
    const saturnAvastha = strength.planets[SATURN_ID]?.baladiStrength ?? 0;

    const tenthHouseBhavabala  = strength.houses[10]?.bhavabala ?? 0;
    const eighthHouseBhavabala = strength.houses[8]?.bhavabala ?? 0;

    const yogaSignatureScore = yogaSignatureContribution(
      SKELETAL_SIGNATURE_IDS, signatures,
    );

    const resilience =
      saturnStrength        * w(WEIGHTS, 'saturnShadbala',       'skeletal') +
      saturnAvastha         * w(WEIGHTS, 'saturnAvastha',        'skeletal') +
      sunStrength           * w(WEIGHTS, 'sunShadbala',          'skeletal') +
      tenthHouseBhavabala   * w(WEIGHTS, 'tenthHouseBhavabala',  'skeletal') +
      eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala', 'skeletal') +
      yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'skeletal');

    const vuln   = vulnerabilityScore(resilience);
    const rating = ratingFromScore(vuln);

    const saturnDignity = strength.planets[SATURN_ID]?.dignity ?? 'unknown';

    const factors: ScoringFactor[] = [
      {
        label:   { en: 'Saturn Strength (Asthi Karaka)', hi: 'शनि बल (अस्थि कारक)' },
        verdict: saturnStrength >= 50 ? 'positive' : saturnStrength >= 25 ? 'neutral' : 'negative',
        value:   `${saturnDignity} (${Math.round(saturnStrength)}/100)`,
      },
      {
        label:   { en: 'Saturn Avastha (Baladi State)', hi: 'शनि अवस्था (बलादि)' },
        verdict: saturnAvastha >= 60 ? 'positive' : saturnAvastha >= 30 ? 'neutral' : 'negative',
        value:   `${Math.round(saturnAvastha)}/100`,
      },
      {
        label:   { en: 'Sun Strength (Skeletal Frame Vitality)', hi: 'सूर्य बल (अस्थि ढांचा)' },
        verdict: sunStrength >= 50 ? 'positive' : sunStrength >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(sunStrength)}/100`,
      },
      {
        label:   { en: '10th House Bhavabala (Knees / Spine)', hi: 'दशम भावबल (घुटने / मेरुदंड)' },
        verdict: tenthHouseBhavabala >= 50 ? 'positive' : tenthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(tenthHouseBhavabala)}/100`,
      },
      {
        label:   { en: '8th House Bhavabala (Chronic Joint Issues)', hi: 'अष्टम भावबल (दीर्घकालिक जोड़)' },
        verdict: eighthHouseBhavabala >= 50 ? 'positive' : eighthHouseBhavabala >= 25 ? 'neutral' : 'negative',
        value:   `${Math.round(eighthHouseBhavabala)}/100`,
      },
    ];

    const classicalSignatures: ClassicalSignature[] = SKELETAL_SIGNATURE_IDS
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
    console.error('[health-diagnosis/skeletal] scoreSkeletal failed:', err);
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
