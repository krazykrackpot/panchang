/**
 * Personal Financial Windows — scores each month of the next 12 months
 * based on dasha lords, their relation to wealth houses, dignity, and
 * retrograde periods.
 *
 * Score 0-100, normalised.
 * Classical basis: BPHS Ch.41-43, Sarvartha Chintamani.
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';
import {
  SIGN_LORD_FINANCIAL,
  EXALTATION_SIGN,
  WEALTH_HOUSES,
  PLANET_NAMES_EN,
} from './constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MonthlyWindow {
  month: number;            // 1-12
  year: number;
  score: number;            // 0-100 (normalised)
  rawScore: number;         // before normalisation
  grade: 'excellent' | 'good' | 'average' | 'caution';
  activities: string[];
  cautions: string[];
  dashaPlanet: string;      // active maha dasha planet (English)
  antarPlanet: string;      // active antar dasha planet (English)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDashaName(entry: DashaEntry): string {
  return (entry.planetName as { en?: string })?.en ?? entry.planet ?? '';
}

/** Planet ID by English name */
const PLANET_ID_BY_NAME: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

/** Mercury retrograde rough schedule — approximation.
 *  Mercury goes retrograde ~3 times/year for ~3 weeks each.
 *  We flag months that overlap a retrograde window (rough dates for 2026-2028).
 *  This is a static approximation; a full ephemeris is not available here.
 *  NOTE: These are calendar-level estimates. For precise dates, use the
 *  retrograde engine in /lib/ephem/astronomical.ts.
 */
const MERCURY_RETRO_MONTHS: { year: number; month: number }[] = [
  // 2026
  { year: 2026, month: 1 }, { year: 2026, month: 5 }, { year: 2026, month: 9 },
  // 2027
  { year: 2027, month: 1 }, { year: 2027, month: 5 }, { year: 2027, month: 9 },
  // 2028
  { year: 2028, month: 2 }, { year: 2028, month: 6 }, { year: 2028, month: 10 },
];

function isMercuryRetroMonth(year: number, month: number): boolean {
  return MERCURY_RETRO_MONTHS.some(r => r.year === year && r.month === month);
}

/** Is a date within the given dasha window? */
function isDateInWindow(date: Date, entry: DashaEntry): boolean {
  return date >= new Date(entry.startDate) && date < new Date(entry.endDate);
}

/** Find active maha and antar dasha on a given date */
function findActiveDashas(
  dashas: DashaEntry[],
  date: Date,
): { maha: DashaEntry | null; antar: DashaEntry | null } {
  const maha = dashas.find(d => d.level === 'maha' && isDateInWindow(date, d)) ?? null;
  if (!maha) return { maha: null, antar: null };

  const antar = (maha.subPeriods ?? []).find(
    d => d.level === 'antar' && isDateInWindow(date, d),
  ) ?? null;

  return { maha, antar };
}

/** Compute wealth-house relation score for a planet ID */
function wealthScore(
  planetId: number,
  kundali: KundaliData,
): { rulesWealthHouse: boolean; inWealthHouse: boolean; isExalted: boolean } {
  const lagnaSign = kundali.ascendant.sign;

  // Does this planet lord a wealth house?
  let rulesWealthHouse = false;
  for (const h of WEALTH_HOUSES) {
    const houseSign = ((lagnaSign - 1 + (h - 1)) % 12) + 1;
    if (SIGN_LORD_FINANCIAL[houseSign] === planetId) {
      rulesWealthHouse = true;
      break;
    }
  }

  // Is this planet placed in a wealth house?
  const planetData = kundali.planets.find(p => p.planet?.id === planetId);
  const inWealthHouse = planetData
    ? WEALTH_HOUSES.includes(planetData.house as typeof WEALTH_HOUSES[number])
    : false;

  // Is this planet exalted?
  const isExalted = planetData?.isExalted ?? (
    planetData ? planetData.sign === (EXALTATION_SIGN[planetId] ?? -1) : false
  );

  return { rulesWealthHouse, inWealthHouse, isExalted };
}

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Score each of the next 12 months (from `todayISO`) on financial auspiciousness.
 */
export function computeFinancialWindows(
  kundali: KundaliData,
  todayISO: string,
): MonthlyWindow[] {
  const today = new Date(todayISO);
  const results: MonthlyWindow[] = [];

  // Raw scores before normalisation
  const rawScores: number[] = [];

  for (let i = 0; i < 12; i++) {
    // Mid-month date for scoring
    const d = new Date(Date.UTC(today.getFullYear(), today.getMonth() + i, 15));
    const month = d.getUTCMonth() + 1;
    const year = d.getUTCFullYear();

    const { maha, antar } = findActiveDashas(kundali.dashas ?? [], d);

    const mahaName = maha ? getDashaName(maha) : '';
    const antarName = antar ? getDashaName(antar) : '';

    const mahaId = PLANET_ID_BY_NAME[mahaName] ?? -1;
    const antarId = PLANET_ID_BY_NAME[antarName] ?? -1;

    let score = 0;
    const activities: string[] = [];
    const cautions: string[] = [];

    // ── Maha dasha lord scoring ──────────────────────────────────────────────
    if (mahaId >= 0) {
      const { rulesWealthHouse, inWealthHouse, isExalted } = wealthScore(mahaId, kundali);
      if (rulesWealthHouse) {
        score += 20;
        activities.push(`${mahaName} lords a wealth house — general prosperity signified`);
      }
      if (inWealthHouse) {
        score += 15;
        activities.push(`${mahaName} is placed in a wealth house — focus on savings & gains`);
      }
      if (isExalted) {
        score += 10;
        activities.push(`${mahaName} is exalted — strong financial significations`);
      }
    }

    // ── Antardasha lord scoring ──────────────────────────────────────────────
    if (antarId >= 0) {
      const { rulesWealthHouse, inWealthHouse, isExalted } = wealthScore(antarId, kundali);
      if (rulesWealthHouse) {
        score += 15;
        activities.push(`${antarName} antardasha lords a wealth house — good for investments`);
      }
      if (inWealthHouse) {
        score += 10;
        activities.push(`${antarName} placed in wealth house — monitor income streams`);
      }
      if (isExalted) {
        score += 8;
      }
    }

    // ── Jupiter / Venus bonus (natural karakas for wealth) ───────────────────
    if (mahaId === 4 || antarId === 4) {
      score += 12;
      activities.push('Jupiter period — excellent for banking, loans, expansion');
    }
    if (mahaId === 5 || antarId === 5) {
      score += 8;
      activities.push('Venus period — favourable for luxury purchases, partnerships');
    }

    // ── Mercury retrograde penalty ───────────────────────────────────────────
    if (isMercuryRetroMonth(year, month)) {
      score -= 10;
      cautions.push('Mercury retrograde — avoid signing new contracts or major financial agreements');
    }

    // ── Saturn/Rahu/Ketu malefic penalty ────────────────────────────────────
    if (mahaId === 6 || antarId === 6) {
      score -= 5;
      cautions.push('Saturn period — avoid risky speculation; stick to long-term fixed assets');
    }
    if (mahaId === 7 || antarId === 7) {
      score -= 5;
      cautions.push('Rahu period — be cautious with foreign currency, crypto, and speculative investments');
    }
    if (mahaId === 8 || antarId === 8) {
      score -= 8;
      cautions.push('Ketu period — losses possible; avoid major financial commitments');
    }
    if (mahaId === 2 || antarId === 2) {
      score -= 3;
      cautions.push('Mars period — risk of impulsive spending; think twice before major purchases');
    }

    // ── Ensure at least a baseline activity suggestion ───────────────────────
    if (activities.length === 0) {
      const planetName = mahaName || 'Current';
      activities.push(`${planetName} period — review existing investments and maintain discipline`);
    }

    rawScores.push(score);
    results.push({
      month,
      year,
      score: 0,    // filled after normalisation
      rawScore: score,
      grade: 'average',   // filled after normalisation
      activities,
      cautions,
      dashaPlanet: mahaName,
      antarPlanet: antarName,
    });
  }

  // ── Normalise scores to 0-100 ────────────────────────────────────────────
  const minRaw = Math.min(...rawScores);
  const maxRaw = Math.max(...rawScores);
  const range = maxRaw - minRaw;

  for (let i = 0; i < results.length; i++) {
    const normalised = range === 0
      ? 50
      : Math.round(((rawScores[i] - minRaw) / range) * 100);

    const clamped = Math.max(0, Math.min(100, normalised));
    results[i].score = clamped;
    results[i].grade =
      clamped >= 75 ? 'excellent' :
      clamped >= 50 ? 'good' :
      clamped >= 30 ? 'average' : 'caution';
  }

  return results;
}

// ─── Re-export PLANET_NAMES_EN so consumers can use it ───────────────────────
export { PLANET_NAMES_EN };
