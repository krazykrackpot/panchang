// src/lib/kundali/health-diagnosis/elements/vitality.ts
//
// Task B1 — Vitality / Lifespan element scorer.
//
// THIS IS THE TEMPLATE for element scorers B2-B22.  Copiers should:
//   1. Replace 'vitality' with the target ElementId throughout.
//   2. Update the weight-axis → strength-input mapping for that element's
//      weight vector (see weights.ts for axis names).
//   3. Update the factors[] array to match the most important axes.
//   4. Update the yogaSignatures lookup to include signatures with
//      elementsAffected containing the target element.
//   5. Keep the Phase A guards in place (houseLordId returns undefined,
//      planetStrengths lookup may be absent for Rahu/Ketu).
//
// Classical sources: BPHS-24, Phala-Deepika-9, Saravali-33
//
// Primary indicators (per spec §4.1):
//   Sun       — jiva-shakti (life force)
//   Lagna lord — physical constitution
//   8th lord  — Ayur sthana lord (longevity house)
//   Saturn    — Ayur karaka (life-force significator)
//   Lagna bhava — bodily frame Bhavabala
//   8th bhava  — Ayur bhava Bhavabala
//
// Score direction: HIGH RESILIENCE = LOW VULNERABILITY = GOOD prognosis.
//   vulnerabilityScore = 100 - weightedResilienceSum
//
// Weight vector axes (names must match weights.ts exactly):
//   sunShadbala          0.20
//   lagnaLordDignity     0.15
//   lagnaLordShadbala    0.10
//   eighthLordDignity    0.15
//   saturnAvastha        0.10
//   eighthHouseBhavabala 0.10
//   lagnaHouseBhavabala  0.10
//   yogaSignatures       0.10

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
} from '../scoring-utils';

// ─── Module-level statics ─────────────────────────────────────────────────────

const CATALOG_META = ELEMENT_CATALOG['vitality'];
const WEIGHTS = weightVectorForElement('vitality');

// Signatures whose elementsAffected includes 'vitality'.
// Used to populate classicalSignatures[] and compute the yogaSignatures axis.
// Currently empty in Phase A-B (no SIGNATURE_REGISTRY entries target vitality);
// extend here as new signatures are added to signatures.ts.
const VITALITY_SIGNATURE_IDS: string[] = Object.values(SIGNATURE_REGISTRY)
  .filter(s => s.elementsAffected.includes('vitality'))
  .map(s => s.id);

// ─── Planet ID constants (0-based, per KundaliData convention) ────────────────
const SUN_ID     = 0; // jiva-shakti
const SATURN_ID  = 6; // Ayur karaka; saturnAvastha axis uses baladiStrength

// ─── Main scorer ─────────────────────────────────────────────────────────────

/**
 * Score the Vitality element for a native's birth chart.
 *
 * @param k          KundaliData from generateKundali()
 * @param strength   Pre-collected strength inputs from collectStrengthInputs()
 * @param signatures Boolean map from detectAllSignatures()
 * @param locale     Display locale for factor labels (unused in Phase B — all
 *                   labels are LocaleText objects; locale param is reserved for
 *                   Phase D when narrative snippets are locale-switched).
 * @returns          NatalElement with vulnerability score, rating, factors, and
 *                   matched classical signatures.
 */
export function scoreVitality(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: string,
): NatalElement {
  // ── 1. Resolve axis values ──────────────────────────────────────────────────

  // sunShadbala — Sun's overall strength (0-100)
  const sunStrength = strength.planets[SUN_ID]?.overall ?? 0;

  // lagnaLordDignity & lagnaLordShadbala
  // houseLordId returns number | undefined — guard explicitly (CLAUDE.md Phase A rule).
  const lagnaLordId = houseLordId(k, 1);
  const lagnaLordDignityScore =
    lagnaLordId !== undefined
      ? dignityToScore(strength.planets[lagnaLordId]?.dignity ?? 'unknown')
      : 0; // unknown lagna lord → weakest possible score (not neutral)
  const lagnaLordShadbala =
    lagnaLordId !== undefined
      ? (strength.planets[lagnaLordId]?.overall ?? 0)
      : 0;

  // eighthLordDignity — per Phala-Deepika-9: strong 8th lord = long life
  const eighthLordId = houseLordId(k, 8);
  const eighthLordDignityScore =
    eighthLordId !== undefined
      ? dignityToScore(strength.planets[eighthLordId]?.dignity ?? 'unknown')
      : 0; // unknown 8th lord → weakest score

  // saturnAvastha — Baladi avastha of Saturn (0-100).
  // Yuva (Adult) avastha = 100 → maximum vitality contribution.
  // Mrita (Dead) avastha = 5   → minimal contribution.
  const saturnAvastha = strength.planets[SATURN_ID]?.baladiStrength ?? 0;

  // House Bhabalas
  const eighthHouseBhavabala = strength.houses[8]?.bhavabala ?? 0;
  const lagnaHouseBhavabala  = strength.houses[1]?.bhavabala ?? 0;

  // yogaSignatures — aggregate score from signatures affecting vitality.
  // For each matched signature: contributes 100; unmatched: 0.
  // Average over all relevant signatures, or 0 if none registered yet.
  const yogaSignatureScore =
    VITALITY_SIGNATURE_IDS.length > 0
      ? VITALITY_SIGNATURE_IDS.reduce(
          (acc, id) => acc + (signatures[id] ? 100 : 0),
          0,
        ) / VITALITY_SIGNATURE_IDS.length
      : 0; // no vitality-specific signatures registered in Phase A-B

  // ── 2. Weighted resilience sum ──────────────────────────────────────────────
  // Each axis is multiplied by its weight from weights.ts.
  // Sum represents overall resilience in [0, ~100].

  const resilience =
    sunStrength           * w(WEIGHTS, 'sunShadbala',          'vitality') +
    lagnaLordDignityScore * w(WEIGHTS, 'lagnaLordDignity',     'vitality') +
    lagnaLordShadbala     * w(WEIGHTS, 'lagnaLordShadbala',    'vitality') +
    eighthLordDignityScore * w(WEIGHTS, 'eighthLordDignity',   'vitality') +
    saturnAvastha         * w(WEIGHTS, 'saturnAvastha',        'vitality') +
    eighthHouseBhavabala  * w(WEIGHTS, 'eighthHouseBhavabala', 'vitality') +
    lagnaHouseBhavabala   * w(WEIGHTS, 'lagnaHouseBhavabala',  'vitality') +
    yogaSignatureScore    * w(WEIGHTS, 'yogaSignatures',       'vitality');

  // ── 3. Convert to vulnerability + rating ────────────────────────────────────

  const vuln   = vulnerabilityScore(resilience);
  const rating = ratingFromScore(vuln);

  // ── 4. Factors array (one entry per significant axis) ────────────────────────
  // At least 4 entries required (definition of done checklist).

  const factors: ScoringFactor[] = [
    {
      label:   { en: 'Sun Strength (Jiva-Shakti)', hi: 'सूर्य बल (जीव-शक्ति)' },
      verdict: sunStrength >= 50 ? 'positive' : sunStrength >= 25 ? 'neutral' : 'negative',
      value:   `${Math.round(sunStrength)}/100`,
    },
    {
      label:   { en: 'Lagna Lord Dignity', hi: 'लग्नेश गरिमा' },
      verdict: lagnaLordDignityScore >= 65 ? 'positive' : lagnaLordDignityScore >= 40 ? 'neutral' : 'negative',
      value:   lagnaLordId !== undefined
        ? `${strength.planets[lagnaLordId]?.dignity ?? 'unknown'} (${Math.round(lagnaLordDignityScore)}/100)`
        : 'unknown',
    },
    {
      label:   { en: '8th Lord Dignity (Longevity House)', hi: 'अष्टमेश गरिमा (आयुर्भाव)' },
      verdict: eighthLordDignityScore >= 65 ? 'positive' : eighthLordDignityScore >= 40 ? 'neutral' : 'negative',
      value:   eighthLordId !== undefined
        ? `${strength.planets[eighthLordId]?.dignity ?? 'unknown'} (${Math.round(eighthLordDignityScore)}/100)`
        : 'unknown',
    },
    {
      label:   { en: 'Saturn Avastha (Ayur Karaka)', hi: 'शनि अवस्था (आयु कारक)' },
      verdict: saturnAvastha >= 60 ? 'positive' : saturnAvastha >= 30 ? 'neutral' : 'negative',
      value:   `${Math.round(saturnAvastha)}/100`,
    },
    {
      label:   { en: 'Lagna Bhavabala (Constitution)', hi: 'लग्न भावबल (शरीर)' },
      verdict: lagnaHouseBhavabala >= 50 ? 'positive' : lagnaHouseBhavabala >= 25 ? 'neutral' : 'negative',
      value:   `${Math.round(lagnaHouseBhavabala)}/100`,
    },
    {
      label:   { en: '8th House Bhavabala (Vitality House)', hi: 'अष्टम भावबल (आयुर्भाव)' },
      verdict: eighthHouseBhavabala >= 50 ? 'positive' : eighthHouseBhavabala >= 25 ? 'neutral' : 'negative',
      value:   `${Math.round(eighthHouseBhavabala)}/100`,
    },
  ];

  // ── 5. Classical signatures — only those that matched ────────────────────────
  const classicalSignatures: ClassicalSignature[] = VITALITY_SIGNATURE_IDS
    .filter(id => signatures[id] === true)
    .map(id => ({
      id,
      name:   SIGNATURE_REGISTRY[id].name,
      source: SIGNATURE_REGISTRY[id].source,
    }));

  // ── 6. Assemble NatalElement ─────────────────────────────────────────────────

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
}
