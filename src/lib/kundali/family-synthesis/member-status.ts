/**
 * Family Member Status Engine
 *
 * Computes a current-state summary for a family member: running dasha,
 * Sade Sati phase, key transit alerts, and an overall "attention level."
 * Consumed by the Family Command Center dashboard card.
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type AttentionLevel = 'critical' | 'watch' | 'stable' | 'favorable';

export interface DoshaFlags {
  manglik: boolean;
  manglikCancelled: boolean;
  kaalSarpa: boolean;
  kaalSarpaType: string | null;  // e.g., "Takshaka"
  moolaNakshatra: boolean;
  moolaNakshatraName: string | null;
}

export interface MemberStatus {
  name: string;
  relationship: string;
  chartId: string;

  /** Current Vimshottari dasha snapshot */
  currentDasha: {
    mahaLord: string;       // planet name e.g. "Moon"
    antarLord: string;
    mahaEnd: string;        // YYYY-MM-DD
    antarEnd: string;
    /** true when maha OR antar changes within 60 days */
    isDashaTransition: boolean;
  };

  /** Sade Sati status based on transit Saturn vs natal Moon */
  sadeSati: {
    isActive: boolean;
    phase: 'rising' | 'peak' | 'setting' | null;
    moonSign: number;       // 1-12
  };

  /** Notable transit alerts (Jupiter, Saturn on natal planets) */
  transitAlerts: {
    description: string;
    severity: 'positive' | 'neutral' | 'challenging';
  }[];

  /** Key dosha indicators (lightweight detection from natal chart) */
  doshaFlags: DoshaFlags;

  /** Composite attention rating */
  attention: AttentionLevel;
  attentionReason: string;
}

// ---------------------------------------------------------------------------
// Input params
// ---------------------------------------------------------------------------

export interface MemberStatusParams {
  name: string;
  relationship: string;
  chartId: string;
  kundali: KundaliData;
  /** Current transit Saturn rashi (1-12) */
  currentSaturnSign: number;
  /** Current transit Jupiter rashi (1-12) */
  currentJupiterSign: number;
  /** Reference date for "now" — use Date.UTC-constructed dates */
  today: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse ISO date string into a Date (treats as UTC midnight). */
function parseDate(s: string): Date {
  // DashaEntry stores dates as ISO strings like "2026-04-24" or full ISO
  const d = new Date(s);
  if (isNaN(d.getTime())) {
    return new Date(0); // fallback — should never happen with valid kundali data
  }
  return d;
}

/** Format a Date as YYYY-MM-DD. */
function fmtDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Days between two dates (absolute). */
function daysBetween(a: Date, b: Date): number {
  return Math.abs(b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000);
}

/**
 * Wrap-safe sign offset for Sade Sati.
 * Signs are 1-12. "Previous sign" of 1 is 12, "next sign" of 12 is 1.
 */
function prevSign(sign: number): number {
  return ((sign - 2 + 12) % 12) + 1;
}

function nextSign(sign: number): number {
  return (sign % 12) + 1;
}

// ---------------------------------------------------------------------------
// Dasha resolution
// ---------------------------------------------------------------------------

interface DashaSnapshot {
  mahaLord: string;
  antarLord: string;
  mahaEnd: Date;
  antarEnd: Date;
  isDashaTransition: boolean;
}

const TRANSITION_WINDOW_DAYS = 60;

/**
 * Walk the dasha tree to find the active maha + antar for `today`.
 * DashaEntry.subPeriods contains the antardashas.
 */
function resolveDasha(dashas: DashaEntry[], today: Date): DashaSnapshot {
  const todayMs = today.getTime();

  // Find active mahadasha
  let activeMaha: DashaEntry | undefined;
  for (const d of dashas) {
    const start = parseDate(d.startDate).getTime();
    const end = parseDate(d.endDate).getTime();
    if (start <= todayMs && todayMs < end) {
      activeMaha = d;
      break;
    }
  }

  if (!activeMaha) {
    // Fallback: pick the last dasha (future birth charts where today < first dasha start)
    activeMaha = dashas[dashas.length - 1] ?? dashas[0];
  }

  const mahaEnd = parseDate(activeMaha.endDate);

  // Find active antardasha
  let activeAntar: DashaEntry | undefined;
  if (activeMaha.subPeriods && activeMaha.subPeriods.length > 0) {
    for (const sub of activeMaha.subPeriods) {
      const start = parseDate(sub.startDate).getTime();
      const end = parseDate(sub.endDate).getTime();
      if (start <= todayMs && todayMs < end) {
        activeAntar = sub;
        break;
      }
    }
    // Fallback to last sub-period if none matched
    if (!activeAntar) {
      activeAntar = activeMaha.subPeriods[activeMaha.subPeriods.length - 1];
    }
  }

  const antarEnd = activeAntar ? parseDate(activeAntar.endDate) : mahaEnd;
  const antarLord = activeAntar ? activeAntar.planet : activeMaha.planet;

  const isDashaTransition =
    daysBetween(today, mahaEnd) <= TRANSITION_WINDOW_DAYS ||
    daysBetween(today, antarEnd) <= TRANSITION_WINDOW_DAYS;

  return {
    mahaLord: activeMaha.planet,
    antarLord,
    mahaEnd,
    antarEnd,
    isDashaTransition,
  };
}

// ---------------------------------------------------------------------------
// Sade Sati
// ---------------------------------------------------------------------------

interface SadeSatiResult {
  isActive: boolean;
  phase: 'rising' | 'peak' | 'setting' | null;
  moonSign: number;
}

function checkSadeSati(moonSign: number, saturnSign: number): SadeSatiResult {
  if (saturnSign === moonSign) {
    return { isActive: true, phase: 'peak', moonSign };
  }
  if (saturnSign === prevSign(moonSign)) {
    return { isActive: true, phase: 'rising', moonSign };
  }
  if (saturnSign === nextSign(moonSign)) {
    return { isActive: true, phase: 'setting', moonSign };
  }
  return { isActive: false, phase: null, moonSign };
}

// ---------------------------------------------------------------------------
// Transit alerts
// ---------------------------------------------------------------------------

interface TransitAlert {
  description: string;
  severity: 'positive' | 'neutral' | 'challenging';
}

function computeTransitAlerts(
  jupiterSign: number,
  saturnSign: number,
  natalSunSign: number,
  natalMoonSign: number,
  ascendantSign: number,
): TransitAlert[] {
  const alerts: TransitAlert[] = [];

  // Jupiter transits — positive
  if (jupiterSign === natalSunSign) {
    alerts.push({
      description: 'Jupiter transiting natal Sun — favorable period for recognition and authority',
      severity: 'positive',
    });
  }
  if (jupiterSign === natalMoonSign) {
    alerts.push({
      description: 'Jupiter transiting natal Moon — emotional expansion and inner growth',
      severity: 'positive',
    });
  }
  if (jupiterSign === ascendantSign) {
    alerts.push({
      description: 'Jupiter transiting Ascendant — overall growth and new opportunities',
      severity: 'positive',
    });
  }

  // Saturn transits — challenging
  if (saturnSign === natalSunSign) {
    alerts.push({
      description: 'Saturn transiting natal Sun — period of restructuring and discipline',
      severity: 'challenging',
    });
  }
  if (saturnSign === natalMoonSign) {
    alerts.push({
      description: 'Saturn transiting natal Moon — emotional restraint, patience required',
      severity: 'challenging',
    });
  }

  return alerts;
}

// ---------------------------------------------------------------------------
// Attention level
// ---------------------------------------------------------------------------

function computeAttention(
  sadeSati: SadeSatiResult,
  dashaSnapshot: DashaSnapshot,
  alerts: TransitAlert[],
): { attention: AttentionLevel; attentionReason: string } {
  const hasChallengingTransit = alerts.some(a => a.severity === 'challenging');
  const hasPositiveTransit = alerts.some(a => a.severity === 'positive');

  // Critical: Sade Sati peak + challenging transit
  if (sadeSati.phase === 'peak' && hasChallengingTransit) {
    return {
      attention: 'critical',
      attentionReason: 'Sade Sati peak combined with challenging Saturn transit',
    };
  }

  // Critical: Sade Sati peak + dasha transition
  if (sadeSati.phase === 'peak' && dashaSnapshot.isDashaTransition) {
    return {
      attention: 'critical',
      attentionReason: 'Sade Sati peak with upcoming dasha transition',
    };
  }

  // Watch: any Sade Sati phase active
  if (sadeSati.isActive) {
    return {
      attention: 'watch',
      attentionReason: `Sade Sati ${sadeSati.phase} phase active`,
    };
  }

  // Watch: dasha transition within 60 days
  if (dashaSnapshot.isDashaTransition) {
    return {
      attention: 'watch',
      attentionReason: 'Dasha transition approaching within 60 days',
    };
  }

  // Favorable: Jupiter on natal Sun/Moon/Ascendant, no Sade Sati
  if (hasPositiveTransit && !sadeSati.isActive) {
    return {
      attention: 'favorable',
      attentionReason: 'Jupiter transiting key natal position — favorable period',
    };
  }

  return {
    attention: 'stable',
    attentionReason: 'No significant transits or transitions at this time',
  };
}

// ---------------------------------------------------------------------------
// Dosha detection (lightweight, from natal chart only)
// ---------------------------------------------------------------------------

/** Kaal Sarpa sub-type names keyed by Rahu's house (1-12). */
const KS_NAMES: Record<number, string> = {
  1: 'Anant', 2: 'Kulika', 3: 'Vasuki', 4: 'Shankhapala',
  5: 'Padma', 6: 'Mahapadma', 7: 'Takshaka', 8: 'Karkotak',
  9: 'Shankhachud', 10: 'Ghatak', 11: 'Vishdhar', 12: 'Sheshnag',
};

/** 6 Ganda Mula nakshatras: junction nakshatras between elements. */
const GANDA_MULA_NAK_IDS = [1, 9, 10, 18, 19, 27];

/** Nakshatra names (English) for Ganda Mula display. */
const GANDA_MULA_NAK_NAMES: Record<number, string> = {
  1: 'Ashwini', 9: 'Ashlesha', 10: 'Magha',
  18: 'Jyeshtha', 19: 'Moola', 27: 'Revati',
};

/**
 * Check if house `h` lies between `from` and `to` going clockwise (exclusive).
 * Houses are 1-12. "Between" means strictly between, not equal to endpoints.
 */
function isBetweenHouses(h: number, from: number, to: number): boolean {
  if (from === to) return false;
  if (from < to) {
    return h > from && h < to;
  }
  // Wraps around 12→1
  return h > from || h < to;
}

function computeDoshaFlags(kundali: KundaliData): DoshaFlags {
  const planets = kundali.planets;

  // --- Manglik: Mars (id=2) in houses 1, 2, 4, 7, 8, 12 from Lagna ---
  const mars = planets.find(p => p.planet.id === 2);
  const marsHouse = mars?.house ?? 0;
  const isManglik = [1, 2, 4, 7, 8, 12].includes(marsHouse);
  // Basic cancellation: Mars in own sign (Aries=1, Scorpio=8)
  const marsInOwnSign = mars ? [1, 8].includes(mars.sign) : false;
  const manglikCancelled = isManglik && marsInOwnSign;

  // --- Kaal Sarpa: all 7 planets (Sun–Saturn, ids 0–6) between Rahu and Ketu ---
  const rahuP = planets.find(p => p.planet.id === 7);
  const ketuP = planets.find(p => p.planet.id === 8);
  let isKaalSarpa = false;
  let kaalSarpaType: string | null = null;
  if (rahuP && ketuP) {
    const others = planets.filter(p => p.planet.id >= 0 && p.planet.id <= 6);
    // Check if all 7 planets fall between Rahu→Ketu or Ketu→Rahu arc
    const allBetweenRK = others.every(p => isBetweenHouses(p.house, rahuP.house, ketuP.house));
    const allBetweenKR = others.every(p => isBetweenHouses(p.house, ketuP.house, rahuP.house));
    isKaalSarpa = allBetweenRK || allBetweenKR;
    if (isKaalSarpa) {
      kaalSarpaType = KS_NAMES[rahuP.house] ?? null;
    }
  }

  // --- Ganda Mula Nakshatra: Moon's nakshatra in junction set ---
  const moonNakId = planets.find(p => p.planet.id === 1)?.nakshatra?.id ?? 0;
  const isMoola = GANDA_MULA_NAK_IDS.includes(moonNakId);
  const moolaNakshatraName = isMoola ? (GANDA_MULA_NAK_NAMES[moonNakId] ?? null) : null;

  return {
    manglik: isManglik,
    manglikCancelled,
    kaalSarpa: isKaalSarpa,
    kaalSarpaType,
    moolaNakshatra: isMoola,
    moolaNakshatraName,
  };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Compute a snapshot of a family member's current astrological status.
 *
 * Planet positions: kundali.planets[0]=Sun, [1]=Moon, etc. (0-based planet IDs).
 * Sign numbers are 1-based (1=Aries through 12=Pisces).
 */
export function computeMemberStatus(params: MemberStatusParams): MemberStatus {
  const {
    name,
    relationship,
    chartId,
    kundali,
    currentSaturnSign,
    currentJupiterSign,
    today,
  } = params;

  // --- Natal positions ---
  // planets array: 0=Sun, 1=Moon, ... ; PlanetPosition.sign is 1-12
  const natalMoonSign = kundali.planets[1]?.sign ?? 1;
  const natalSunSign = kundali.planets[0]?.sign ?? 1;
  const ascendantSign = kundali.ascendant?.sign ?? 1;

  // --- Dasha ---
  const dashaSnapshot = resolveDasha(kundali.dashas, today);

  // --- Sade Sati ---
  const sadeSati = checkSadeSati(natalMoonSign, currentSaturnSign);

  // --- Transit alerts ---
  const transitAlerts = computeTransitAlerts(
    currentJupiterSign,
    currentSaturnSign,
    natalSunSign,
    natalMoonSign,
    ascendantSign,
  );

  // --- Dosha flags (lightweight detection from natal chart) ---
  const doshaFlags = computeDoshaFlags(kundali);

  // --- Attention level ---
  const { attention, attentionReason } = computeAttention(
    sadeSati,
    dashaSnapshot,
    transitAlerts,
  );

  return {
    name,
    relationship,
    chartId,
    currentDasha: {
      mahaLord: dashaSnapshot.mahaLord,
      antarLord: dashaSnapshot.antarLord,
      mahaEnd: fmtDate(dashaSnapshot.mahaEnd),
      antarEnd: fmtDate(dashaSnapshot.antarEnd),
      isDashaTransition: dashaSnapshot.isDashaTransition,
    },
    sadeSati,
    transitAlerts,
    doshaFlags,
    attention,
    attentionReason,
  };
}
