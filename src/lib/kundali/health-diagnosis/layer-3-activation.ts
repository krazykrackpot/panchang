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
// Implementation strategy:
//   - Dasha multiplier: derive from the current mahadasha lord's planet ID.
//     Elements with that planet in their primarySignificators get +0.3 contribution
//     (max 0.5 cap). Others get 0.
//   - Transit multiplier: slow-planet house-from-lagna lookup + Sade Sati component.
//     Slow planets = Jupiter (4), Saturn (6), Rahu (7), Ketu (8) per spec §7.
//     Fast planets (Sun/Moon/Mercury/Venus/Mars) are not used at this layer.
//   - Sade Sati: time-varying — isSadeSatiActiveAt() computes Saturn's current sign
//     from a real transit call and compares to natal Moon sign (spec §7.3).
//     When active: base +0.05 on every element (on top of planet-house hits).
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
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

// ─── Planet ID constants ──────────────────────────────────────────────────────
// 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu

// ─── Planet name → ID mapping for dasha lord lookup ──────────────────────────
// Extends the canonical full-name map (from grahas.ts) with two-letter
// abbreviations that dasha engines may emit (e.g. 'Su', 'Mo', 'Ma').
const PLANET_NAME_TO_ID: Record<string, number> = {
  ...CANONICAL_PLANET_NAME_TO_ID,
  Su: 0, Mo: 1, Ma: 2, Me: 3, Ju: 4, Ve: 5, Sa: 6, Ra: 7, Ke: 8,
};

// ─── Transit amplification rules ─────────────────────────────────────────────
//
// Per-element transit amplification — keyed by ElementId.
// Each rule fires when any listed slow planet (Jupiter=4, Saturn=6, Rahu=7,
// Ketu=8) transits any listed house from lagna, adding `weight` to
// transitContribution.  Multiple rules stack; total is capped at 0.5 (spec §7).
//
// House-element mappings per spec §4 and existing health-prognosis.ts patterns.
// Fast planets (Sun/Moon/Mercury/Venus/Mars) are excluded per spec §7 — at the
// daily-resolution used here, their positions shift too quickly to be meaningful
// for a prognosis layer that projects 90 days forward.
const TRANSIT_AMPLIFICATION: Partial<Record<ElementId, Array<{
  planetIds: number[];    // slow planets only: Jup=4, Sat=6, Rahu=7, Ketu=8
  inHouses: number[];     // amplifies when planet transits these houses from lagna
  weight: number;         // additive weight [0, 0.5]
}>>> = {
  vitality:     [{ planetIds: [6, 7], inHouses: [1, 8],         weight: 0.15 }],
  mental:       [{ planetIds: [6, 7], inHouses: [4],            weight: 0.20 },
                 { planetIds: [7, 8], inHouses: [5],            weight: 0.10 }],
  digestive:    [{ planetIds: [6],    inHouses: [5, 6],         weight: 0.15 }],
  cardiac:      [{ planetIds: [6, 7], inHouses: [4],            weight: 0.20 }],
  respiratory:  [{ planetIds: [6],    inHouses: [3, 4],         weight: 0.15 }],
  nervous:      [{ planetIds: [6, 7], inHouses: [1, 3],         weight: 0.15 }],
  skeletal:     [{ planetIds: [6],    inHouses: [8, 9, 10],     weight: 0.20 }],
  muscular:     [{ planetIds: [7],    inHouses: [1, 3, 6],      weight: 0.15 }],
  skin:         [{ planetIds: [6],    inHouses: [6, 8],         weight: 0.10 }],
  eyes:         [{ planetIds: [6],    inHouses: [2, 12],        weight: 0.10 }],
  reproductive: [{ planetIds: [6, 7], inHouses: [7, 8],         weight: 0.15 }],
  endocrine:    [{ planetIds: [6],    inHouses: [5],            weight: 0.10 }],
  immunity:     [{ planetIds: [6],    inHouses: [6, 8, 12],     weight: 0.10 }],
  chronic:      [{ planetIds: [6, 7, 8], inHouses: [6, 8, 12], weight: 0.20 }],
  accidents:    [{ planetIds: [7],    inHouses: [4, 8],         weight: 0.20 }],
  surgery:      [{ planetIds: [6, 8], inHouses: [8, 12],        weight: 0.15 }],
  psychiatric:  [{ planetIds: [7],    inHouses: [4, 5, 12],     weight: 0.20 }],
  addictions:   [{ planetIds: [7],    inHouses: [6, 8, 12],     weight: 0.20 }],
  sleep:        [{ planetIds: [6],    inHouses: [12],           weight: 0.20 }],
  allergies:    [{ planetIds: [7],    inHouses: [1, 6],         weight: 0.15 }],
  cancer:       [{ planetIds: [6, 7], inHouses: [6, 8],         weight: 0.20 }],
  longevity:    [{ planetIds: [6, 7], inHouses: [1, 8],         weight: 0.15 }],
};

// ─── Shared panchang cache ────────────────────────────────────────────────────
//
// Both getSlowPlanetHousesFromLagna() and isSadeSatiActiveAt() call
// computePanchang() with the same arguments for any given date.  A single
// shared cache eliminates the duplicate heavy call.
//
// Keyed by dateMs (milliseconds-since-epoch).  At the daily resolution used
// by Layer 3 projections, the same Date object (or two Dates on the same
// calendar day) produces the same key and shares the result.
//
// NOTE: lat/lng 28.61, 77.21 (Delhi) is used for planetary longitudes.
// At the daily timescale, longitudes are essentially location-independent
// (< 0.01° difference worldwide), so this default is acceptable for all users.
// The lagna-relative house mapping uses the kundali's natal ascendant sign,
// NOT this position.  Consistent with spec §7: "28.61, 77.21 (Delhi) is a
// known acceptable default."
//
// The cache stores the raw planet rashis (chart-independent) so that multiple
// charts computed on the same date share one computePanchang() call, and each
// function computes chart-specific derived values (house-from-lagna, Sade Sati
// distance) independently.  This prevents cross-chart cache pollution.
type CachedPanchang = ReturnType<typeof computePanchang>;
let _panchangCache: { dateMs: number; panchang: CachedPanchang } | null = null;

/**
 * Returns a memoised computePanchang() result for the given date.
 * Uses a fixed reference location (Delhi) for longitude computation —
 * acceptable at daily resolution (see cache comment above).
 * Falls back to null on error; callers must handle null.
 */
function getCachedPanchang(date: Date): CachedPanchang | null {
  const dateMs = date.getTime();
  if (_panchangCache?.dateMs === dateMs) return _panchangCache.panchang;

  try {
    const y  = date.getUTCFullYear();
    const mo = date.getUTCMonth() + 1;
    const d  = date.getUTCDate();
    // UTC offset for the date in 'UTC' timezone — always 0, but goes through the
    // same code path as all other panchang calls (CLAUDE.md Lesson L: use UTC).
    const tzOffset = getUTCOffsetForDate(y, mo, d, 'UTC');
    const panchang = computePanchang({
      year: y, month: mo, day: d,
      lat: 28.61, lng: 77.21, tzOffset, timezone: 'UTC',
    });
    _panchangCache = { dateMs, panchang };
    return panchang;
  } catch (err) {
    console.error('[health-diagnosis/layer-3] panchang computation failed:', err);
    return null;
  }
}

/**
 * Returns slow-planet (Jupiter/Saturn/Rahu/Ketu) positions as houses from lagna
 * for the given date.  Houses are 1-based, computed against the natal ascendant
 * sign in the kundali.
 *
 * Cache note: raw planet rashis come from getCachedPanchang() (chart-independent).
 * The house-from-lagna conversion is done here per call so that two charts with
 * different lagnas on the same date each get the correct result — no cross-chart
 * cache pollution.
 */
function getSlowPlanetHousesFromLagna(
  k: KundaliData,
  date: Date,
): Array<{ id: number; house: number }> {
  const panchang = getCachedPanchang(date);
  if (!panchang) return [];

  const lagna = k.ascendant.sign; // 1-12 natal ascendant sign

  // Slow planets only per spec §7; fast planets excluded
  const slowIds = new Set([4, 6, 7, 8]);
  return (panchang.planets ?? [])
    .filter(g => slowIds.has(g.id))
    .map(g => {
      // rashi is pre-computed by computePanchang; fall back to longitude
      const transitSign: number = (g as { rashi?: number }).rashi
        ?? Math.floor(((g as { longitude?: number }).longitude ?? 0) / 30) + 1;
      // House from lagna: house = (transitSign - lagna + 12) % 12 + 1 (1-based)
      const house = ((transitSign - lagna + 12) % 12) + 1;
      return { id: g.id, house };
    });
}

/**
 * Returns the raw transit contribution for a single element on a given date,
 * EXCLUDING the Sade Sati component.  The caller adds Sade Sati separately.
 * Returns a value in [0, 0.5].
 */
function transitMultiplier(k: KundaliData, id: ElementId, date: Date): number {
  const rules = TRANSIT_AMPLIFICATION[id];
  if (!rules || rules.length === 0) return 0;

  const positions = getSlowPlanetHousesFromLagna(k, date);
  if (positions.length === 0) return 0;

  let total = 0;
  for (const rule of rules) {
    const hit = positions.some(
      p => rule.planetIds.includes(p.id) && rule.inHouses.includes(p.house),
    );
    if (hit) total += rule.weight;
  }
  return Math.min(0.5, total);
}

// ─── Sade Sati time-varying projection ───────────────────────────────────────

/**
 * Returns true if Saturn is within 1 sign of the natal Moon at the given date.
 *
 * Sade Sati (BPHS / Ramayana convention) is defined as Saturn transiting the
 * 12th, 1st, or 2nd house from the natal Moon sign:
 *   distance = (saturnSign - moonSign + 12) % 12 + 1
 *   → 12 = Saturn in 12th from Moon (rising phase)
 *   → 1  = Saturn in 1st from Moon (peak phase)
 *   → 2  = Saturn in 2nd from Moon (setting phase)
 *
 * Uses getCachedPanchang() so the underlying computePanchang() call is shared
 * with getSlowPlanetHousesFromLagna() when both are invoked on the same date.
 * The result is time-varying (real Saturn transit), NOT a static read of
 * kundali.sadeSati.isActive.  Falls back to the static flag only if the
 * panchang cache returns null.
 *
 * Cache note: moonSign is chart-specific but Saturn's rashi is chart-independent,
 * so getCachedPanchang() is safe to share across charts — the distance
 * computation below is performed per call.
 */
function isSadeSatiActiveAt(k: KundaliData, date: Date): boolean {
  const moon = k.planets.find(p => p.planet.id === 1);
  if (!moon) return false;
  const moonSign = moon.sign; // 1-12 natal Moon sign

  const panchang = getCachedPanchang(date);
  if (!panchang) {
    // getCachedPanchang already logged the error; fall back to natal snapshot
    return !!k.sadeSati?.isActive;
  }

  const saturn = (panchang.planets ?? []).find(g => g.id === 6);
  if (!saturn) return false;

  const saturnSign: number = (saturn as { rashi?: number }).rashi
    ?? Math.floor(((saturn as { longitude?: number }).longitude ?? 0) / 30) + 1;

  // distance: 1 = same sign as Moon, 12 = one sign before Moon
  const distance = ((saturnSign - moonSign + 12) % 12) + 1;
  return distance === 12 || distance === 1 || distance === 2;
}

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
    // Sade Sati is now time-varying — computed from Saturn's actual transit sign
    // vs natal Moon sign, NOT from the static kundali.sadeSati.isActive flag.
    const sadeSatiActive = isSadeSatiActiveAt(kundali, today);
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
      // Composed of two parts that are summed and capped at 0.5:
      //   1. Planet-house hits: slow planets (Jup/Sat/Rahu/Ketu) transiting
      //      element-specific sensitive houses from lagna.
      //   2. Sade Sati component (spec §7.3): universal +0.05 when active;
      //      +0.1 extra (total +0.15) for elevated elements (mental/skeletal/immunity).
      const planetHitContribution = transitMultiplier(kundali, id, today);
      const ssSatiBonusToday = sadeSatiActive ? 0.05 + sadeSatiBonus(id) : 0;
      const transitContribution = Math.min(0.5, planetHitContribution + ssSatiBonusToday);

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
      // Sade Sati is time-varying: isSadeSatiActiveAt() computes Saturn's sign
      // at the future date rather than reading the static natal snapshot.
      const future90 = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
      const futureMahaId  = currentDashaLordId(kundali, future90);
      const futureAntarId = currentAntarLordId(kundali, future90);
      const futureDasha   = computeDashaContribution(id, futureMahaId, futureAntarId);
      const futureSadeSatiActive  = isSadeSatiActiveAt(kundali, future90);
      const futurePlanetHit       = transitMultiplier(kundali, id, future90);
      const futureSsBonus         = futureSadeSatiActive ? 0.05 + sadeSatiBonus(id) : 0;
      const futureTransitContribution = Math.min(0.5, futurePlanetHit + futureSsBonus);

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
          const bMahaId    = currentDashaLordId(kundali, boundary);
          const bAntarId   = currentAntarLordId(kundali, boundary);
          const bDasha      = computeDashaContribution(id, bMahaId, bAntarId);
          // Sade Sati is time-varying: isSadeSatiActiveAt() computes Saturn's
          // sign at each boundary date rather than reading the static natal flag.
          const bSadeSati   = isSadeSatiActiveAt(kundali, boundary);
          const bPlanetHit  = transitMultiplier(kundali, id, boundary);
          const bSsBonus    = bSadeSati ? 0.05 + sadeSatiBonus(id) : 0;
          const bTransit    = Math.min(0.5, bPlanetHit + bSsBonus);

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
