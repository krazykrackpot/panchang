// src/lib/kundali/health-diagnosis/layer-3-activation.ts
//
// Task C3 — Layer 3 time-dependent activation composer.
//
// Applies dasha, transit, Sade Sati, and life-stage multipliers to natal
// element scores, producing:
//
//   displayedElements: DisplayedElement[]         — public, clamped [0,100]
//   internalDisplayedElements: InternalDisplayedElement[] — internal, includes
//                                                   unclampedScore for trend math
//   currentMultipliers: Record<ElementId, ElementMultipliers>
//
// Per spec §7.1:
//   displayedScore =
//       natalScore
//       × (1 + dashaContribution)      // ∈ [1.0, 1.5]
//       × (1 + transitContribution)    // ∈ [1.0, 1.5]
//       × lifeStageGate                // ∈ [0.5, 1.5]
//   Clamped to [0, 100] for the public surface.
//
// Per spec §7.2:
//   trend:              compare unclampedScore(today) vs unclampedScore(today+90d).
//   nextInflectionDate: earliest future date (≤10 years) where unclamped shifts ≥10pt.
//
// Phase A-D implementation strategy:
//   - Dasha multiplier: derive from the current mahadasha lord's planet ID.
//     Elements with that planet in their primarySignificators get +0.3 contribution
//     (max 0.5 cap). Others get 0.
//   - Transit multiplier: stubbed at 0 (Phase E: wire real transit positions).
//   - Sade Sati: read from kundali.sadeSati?.isActive.
//     When active: base +0.1 on every element; +0.2 on mental, skeletal, immunity.
//   - Life-stage gate: per-element age curve (see lifeStageGate() below).
//   - Trend: computed via the unclamped 90-day forward projection.
//   - nextInflectionDate: computed by walking dasha boundaries within 10 years.

import type { KundaliData } from '@/types/kundali';
import type {
  ElementId,
  ElementMultipliers,
  DisplayedElement,
  InternalDisplayedElement,
  NatalElement,
} from './types';
import { ELEMENT_CATALOG } from './element-catalog';
import { PLANET_NAME_TO_ID as CANONICAL_PLANET_NAME_TO_ID } from '@/lib/constants/grahas';

// ─── Planet ID constants ──────────────────────────────────────────────────────
// 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu

// ─── Planet name → ID mapping for dasha lord lookup ──────────────────────────
// Extends the canonical full-name map (from grahas.ts) with two-letter
// abbreviations that dasha engines may emit (e.g. 'Su', 'Mo', 'Ma').
const PLANET_NAME_TO_ID: Record<string, number> = {
  ...CANONICAL_PLANET_NAME_TO_ID,
  Su: 0, Mo: 1, Ma: 2, Me: 3, Ju: 4, Ve: 5, Sa: 6, Ra: 7, Ke: 8,
};

// ─── Life-stage gate curves ───────────────────────────────────────────────────

/**
 * Returns the life-stage gate multiplier [0.5, 1.5] for a given element and
 * user age.  Elements without a bespoke curve return 1.0 (constant adult gate).
 *
 * Curves per spec §7 (element-specific):
 *   skeletal:     0.6 (<25), 1.0 (25-35), 1.2 (35-60), 1.5 (>60)
 *   reproductive: 0.5 (<12), 0.8 (12-18), 1.0 (18-50), 0.7 (>50)
 *   cardiac:      0.7 (<30), 1.0 (30-50), 1.3 (>50)
 *   longevity:    0.6 (<30), 1.0 (30-60), 1.4 (>60)
 *   mental:       0.8 (<18), 1.0 (18-65), 1.1 (>65)
 *   All others:   1.0 (constant)
 *
 * @param id  ElementId
 * @param age User age in years; use 35 (neutral adult) if not provided.
 */
function lifeStageGate(id: ElementId, age: number): number {
  switch (id) {
    case 'skeletal':
      if (age < 25)  return 0.6;
      if (age < 35)  return 1.0;
      if (age < 60)  return 1.2;
      return 1.5;

    case 'reproductive':
      if (age < 12)  return 0.5;
      if (age < 18)  return 0.8;
      if (age < 50)  return 1.0;
      return 0.7;

    case 'cardiac':
      if (age < 30)  return 0.7;
      if (age < 50)  return 1.0;
      return 1.3;

    case 'longevity':
      if (age < 30)  return 0.6;
      if (age < 60)  return 1.0;
      return 1.4;

    case 'mental':
      if (age < 18)  return 0.8;
      if (age < 65)  return 1.0;
      return 1.1;

    default:
      return 1.0;
  }
}

// ─── Sade Sati per-element bonus ──────────────────────────────────────────────

/**
 * Returns the extra Sade Sati contribution for an element (on top of the
 * base +0.1 that every element gets when Sade Sati is active).
 *
 * Elements with elevated Sade Sati sensitivity per spec §7:
 *   mental, skeletal, immunity → +0.2 total (base +0.1 + this +0.1 = 0.2)
 *   All others                  → base +0.1 only (this returns 0)
 *
 * Result is added to transitContribution (Sade Sati lives inside transit, per §7).
 */
function sadeSatiBonus(id: ElementId): number {
  if (id === 'mental' || id === 'skeletal' || id === 'immunity') return 0.1;
  return 0;
}

// ─── Dasha lord planet ID extractor ──────────────────────────────────────────

/**
 * Resolve the planet ID of the current mahadasha lord from KundaliData.
 *
 * Walks kundali.dashas to find the entry where today falls between
 * startDate and endDate.  Returns the planet's numeric ID (0-8) or
 * undefined if no dasha is active or parsing fails.
 *
 * Date parsing: new Date(isoString) — safe for ISO dates (CLAUDE.md Lesson L:
 * only the new Date(y,m,d,h,m) constructor is unsafe; parsing ISO strings is fine).
 */
function currentDashaLordId(kundali: KundaliData, today: Date): number | undefined {
  try {
    for (const d of kundali.dashas ?? []) {
      const start = new Date(d.startDate).getTime();
      const end   = new Date(d.endDate).getTime();
      if (today.getTime() >= start && today.getTime() < end) {
        // d.planet is a string (e.g. 'Sun', 'Mo', 'Ra')
        const pid = PLANET_NAME_TO_ID[d.planet] ?? PLANET_NAME_TO_ID[
          (d.planetName as { en?: string })?.en ?? ''
        ];
        return pid; // may be undefined if name not in map
      }
    }
  } catch (err) {
    console.error('[health-diagnosis/layer-3-activation] currentDashaLordId failed:', err);
  }
  return undefined;
}

/**
 * Resolve the planet ID of the current antardasha lord from the active
 * mahadasha's subPeriods array.
 */
function currentAntarLordId(kundali: KundaliData, today: Date): number | undefined {
  try {
    for (const maha of kundali.dashas ?? []) {
      const mahaStart = new Date(maha.startDate).getTime();
      const mahaEnd   = new Date(maha.endDate).getTime();
      if (today.getTime() >= mahaStart && today.getTime() < mahaEnd) {
        for (const antar of maha.subPeriods ?? []) {
          const antarStart = new Date(antar.startDate).getTime();
          const antarEnd   = new Date(antar.endDate).getTime();
          if (today.getTime() >= antarStart && today.getTime() < antarEnd) {
            const pid = PLANET_NAME_TO_ID[antar.planet] ?? PLANET_NAME_TO_ID[
              (antar.planetName as { en?: string })?.en ?? ''
            ];
            return pid;
          }
        }
      }
    }
  } catch (err) {
    console.error('[health-diagnosis/layer-3-activation] currentAntarLordId failed:', err);
  }
  return undefined;
}

// ─── Dasha contribution helper ────────────────────────────────────────────────

/**
 * Compute the dashaContribution for a single element given the current
 * mahadasha and antardasha lords.
 *
 * Rule:
 *   If mahadasha lord is in element's primarySignificators.planets → +0.3
 *   If antardasha lord is in element's primarySignificators.planets → +0.2
 *   Combined cap: 0.5 (spec §7 bound)
 *
 * @returns Value in [0, 0.5]
 */
function computeDashaContribution(
  id: ElementId,
  mahaLordId: number | undefined,
  antarLordId: number | undefined,
): number {
  const sigPlanets = new Set(ELEMENT_CATALOG[id].primarySignificators.planets);
  let contribution = 0;

  if (mahaLordId !== undefined && sigPlanets.has(mahaLordId)) {
    contribution += 0.3;
  }
  if (antarLordId !== undefined && sigPlanets.has(antarLordId)) {
    contribution += 0.2;
  }

  return Math.min(0.5, contribution);
}

// ─── Score formula helpers ────────────────────────────────────────────────────

/**
 * Apply Layer 3 multipliers to a natal score, returning the UNCLAMPED value.
 * The caller clamps to [0, 100] for the public DisplayedElement.
 */
function applyMultipliers(
  natalScore: number,
  m: ElementMultipliers,
): number {
  return (
    natalScore
    * (1 + m.dashaContribution)
    * (1 + m.transitContribution)
    * m.lifeStageGate
  );
}

// ─── Main composer ────────────────────────────────────────────────────────────

export interface Layer3Result {
  currentMultipliers: Record<ElementId, ElementMultipliers>;
  /** Public surface — displayedScore clamped to [0, 100], no unclampedScore. */
  displayedElements: DisplayedElement[];
  /**
   * Internal surface — carries unclampedScore for trend math and tests.
   * NOT included in the public HealthDiagnosis contract.
   */
  internalDisplayedElements: InternalDisplayedElement[];
}

/**
 * Compose Layer 3 time-dependent activation for a set of natal elements.
 *
 * @param kundali         KundaliData from generateKundali()
 * @param natalElements   Scored NatalElement[] from composeLayer1()
 * @param today           Reference date for activation (default: now)
 * @param age             User age in years (default: 35 = neutral adult)
 * @returns               Layer3Result with multipliers, public + internal arrays
 */
export function composeLayer3(
  kundali: KundaliData,
  natalElements: NatalElement[],
  today: Date = new Date(),
  age: number = 35,
): Layer3Result {
  try {
    // ── 1. Resolve shared context ─────────────────────────────────────────────
    const sadeSatiActive = kundali.sadeSati?.isActive ?? false;
    const mahaLordId  = currentDashaLordId(kundali, today);
    const antarLordId = currentAntarLordId(kundali, today);

    // ── 2. Build multipliers and display scores for each element ───────────────
    const multipliers: Partial<Record<ElementId, ElementMultipliers>> = {};
    const displayedElements: DisplayedElement[] = [];
    const internalDisplayedElements: InternalDisplayedElement[] = [];

    for (const el of natalElements) {
      const id = el.id;

      // Dasha contribution [0, 0.5]
      const dashaContribution = computeDashaContribution(id, mahaLordId, antarLordId);

      // Transit contribution [0, 0.5]
      // Phase A-D: Sade Sati only (real transits wired in Phase E).
      // Base: +0.1 for all elements when Sade Sati active.
      // Elevated elements: +0.1 extra (total +0.2) for mental/skeletal/immunity.
      // TODO (Phase E): add real planetary transit contributions here.
      const transitBase = sadeSatiActive ? 0.1 + sadeSatiBonus(id) : 0;
      const transitContribution = Math.min(0.5, transitBase);

      // Life-stage gate [0.5, 1.5]
      const gate = lifeStageGate(id, age);

      const m: ElementMultipliers = {
        dashaContribution,
        transitContribution,
        sadeSatiActive,
        lifeStageGate: gate,
      };
      multipliers[id] = m;

      // Unclamped displayed score (per spec §7.1 formula)
      const unclampedScore = applyMultipliers(el.natalScore, m);

      // Clamped displayed score for public surface
      const displayedScore = Math.round(Math.max(0, Math.min(100, unclampedScore)));

      // ── 3. Trend computation — uses UNCLAMPED scores (spec §7.2) ────────────
      // Project 90 days forward and recompute unclamped score at that date.
      const future90 = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
      const futureMahaId  = currentDashaLordId(kundali, future90);
      const futureAntarId = currentAntarLordId(kundali, future90);
      const futureDasha   = computeDashaContribution(id, futureMahaId, futureAntarId);
      // TODO (Phase E — Sade Sati time-varying): this reads today's static isActive flag,
      // not a future-date projection. When Phase E wires real transit ingress dates,
      // replace with a function taking the future date and returning whether Saturn
      // is within 1 sign of natal Moon at that date.
      const futureSadeSatiActive = kundali.sadeSati?.isActive ?? false;
      const futureTransitBase = futureSadeSatiActive ? 0.1 + sadeSatiBonus(id) : 0;
      const futureTransitContribution = Math.min(0.5, futureTransitBase);

      const futureM: ElementMultipliers = {
        dashaContribution:   futureDasha,
        transitContribution: futureTransitContribution,
        sadeSatiActive:      futureSadeSatiActive,
        lifeStageGate:       lifeStageGate(id, age),
      };
      const futureUnclamped = applyMultipliers(el.natalScore, futureM);

      const delta = futureUnclamped - unclampedScore;
      let trend: DisplayedElement['trend'];
      if (delta <= -10) {
        trend = 'improving';  // score going DOWN = less vulnerability = improving
      } else if (delta >= 10) {
        trend = 'worsening';  // score going UP = more vulnerability = worsening
      } else {
        trend = 'stable';
      }

      // ── 4. nextInflectionDate — walk dasha boundaries within 10 years ────────
      let nextInflectionDate: string | null = null;
      try {
        const tenYearsMs = 10 * 365.25 * 24 * 60 * 60 * 1000;
        const cutoff = new Date(today.getTime() + tenYearsMs);

        // Collect future dasha boundaries, deduplicating via timestamp Set
        // (mahadasha end === next mahadasha start, so the same instant appears twice without dedup)
        const boundaryTimes = new Set<number>();
        const todayTime  = today.getTime();
        const cutoffTime = cutoff.getTime();

        for (const d of kundali.dashas ?? []) {
          const ds = new Date(d.startDate).getTime();
          const de = new Date(d.endDate).getTime();
          if (ds > todayTime && ds <= cutoffTime) boundaryTimes.add(ds);
          if (de > todayTime && de <= cutoffTime) boundaryTimes.add(de);
          for (const antar of d.subPeriods ?? []) {
            const as_ = new Date(antar.startDate).getTime();
            const ae  = new Date(antar.endDate).getTime();
            if (as_ > todayTime && as_ <= cutoffTime) boundaryTimes.add(as_);
            if (ae  > todayTime && ae  <= cutoffTime) boundaryTimes.add(ae);
          }
        }

        const boundaries = Array.from(boundaryTimes)
          .sort((a, b) => a - b)
          .map(t => new Date(t));

        for (const boundary of boundaries) {
          const bMahaId  = currentDashaLordId(kundali, boundary);
          const bAntarId = currentAntarLordId(kundali, boundary);
          const bDasha   = computeDashaContribution(id, bMahaId, bAntarId);
          // TODO (Phase E — Sade Sati time-varying): this reads today's static isActive flag,
          // not a future-date projection. When Phase E wires real transit ingress dates,
          // replace with a function taking the future date and returning whether Saturn
          // is within 1 sign of natal Moon at that date.
          const bSadeSati = kundali.sadeSati?.isActive ?? false;
          const bTransitBase = bSadeSati ? 0.1 + sadeSatiBonus(id) : 0;
          const bTransit = Math.min(0.5, bTransitBase);

          const bM: ElementMultipliers = {
            dashaContribution:   bDasha,
            transitContribution: bTransit,
            sadeSatiActive:      bSadeSati,
            lifeStageGate:       lifeStageGate(id, age),
          };
          const bUnclamped = applyMultipliers(el.natalScore, bM);

          if (Math.abs(bUnclamped - unclampedScore) >= 10) {
            nextInflectionDate = boundary.toISOString().slice(0, 10); // YYYY-MM-DD
            break;
          }
        }
      } catch (inflectionErr) {
        console.error(`[health-diagnosis/layer-3-activation] nextInflectionDate for "${id}" failed:`, inflectionErr);
        nextInflectionDate = null;
      }

      // ── 5. Assemble display entries ──────────────────────────────────────────
      const publicEntry: DisplayedElement = {
        id,
        displayedScore,
        trend,
        nextInflectionDate,
      };
      const internalEntry: InternalDisplayedElement = {
        ...publicEntry,
        unclampedScore,
      };

      displayedElements.push(publicEntry);
      internalDisplayedElements.push(internalEntry);
    }

    return {
      currentMultipliers: multipliers as Record<ElementId, ElementMultipliers>,
      displayedElements,
      internalDisplayedElements,
    };
  } catch (err) {
    console.error('[health-diagnosis/layer-3-activation] composeLayer3 failed:', err);
    return {
      currentMultipliers: {} as Record<ElementId, ElementMultipliers>,
      displayedElements: [],
      internalDisplayedElements: [],
    };
  }
}
