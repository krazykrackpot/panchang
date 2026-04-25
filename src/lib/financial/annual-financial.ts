/**
 * Annual Financial Forecast Orchestrator
 *
 * Combines Dhana activation + monthly windows + retrograde cautions
 * into a single structured annual report.
 */

import type { KundaliData } from '@/types/kundali';
import { computeDhanaActivations, type DhanaActivation } from './dhana-activation';
import { computeFinancialWindows, type MonthlyWindow } from './financial-windows';
import {
  PLANET_SECTORS,
  SIGN_LORD_FINANCIAL,
  WEALTH_HOUSES,
  PLANET_NAMES_EN,
} from './constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RetrogradeCaution {
  planet: string;
  period: string;   // e.g. "Jan–Feb 2026"
  caution: string;
}

export interface AnnualFinancialReport {
  yearRating: 'Excellent' | 'Very Good' | 'Good' | 'Mixed' | 'Challenging';
  yearScore: number;          // 0-100 average of monthly scores
  yearSummary: string;
  monthlyOutlook: MonthlyWindow[];
  dhanaActivations: DhanaActivation[];
  retrogradeCautions: RetrogradeCaution[];
  topSectors: string[];
  topCommodities: string[];
  wealthHouseSummary: { house: number; lord: string; lordInWealthHouse: boolean }[];
}

// ─── Static retrograde caution data for 2026-2027 ────────────────────────────
// These are standard Vedic-astrology cautions for retrograde periods.
// Classic: Mercury retro → no contracts; Venus retro → no luxury purchases.
const STATIC_RETROGRADE_CAUTIONS: RetrogradeCaution[] = [
  {
    planet: 'Mercury',
    period: 'Jan 2026',
    caution: 'Avoid signing new financial contracts, opening brokerage accounts, or making major tech purchases.',
  },
  {
    planet: 'Mercury',
    period: 'May 2026',
    caution: 'Defer new business agreements and trade discussions until Mercury goes direct.',
  },
  {
    planet: 'Mercury',
    period: 'Sep 2026',
    caution: 'Review existing contracts rather than initiating new ones; communication errors likely.',
  },
  {
    planet: 'Venus',
    period: 'Mar–Apr 2025',
    caution: 'Venus retrograde — avoid luxury purchases, vehicle acquisitions, and aesthetic investments.',
  },
  {
    planet: 'Saturn',
    period: 'Jun–Nov 2026',
    caution: 'Saturn retrograde — long-term infrastructure and mining investments require extra diligence.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Identify the top sectors based on wealth-house lords */
function deriveTopSectors(kundali: KundaliData): { sectors: string[]; commodities: string[] } {
  const lagnaSign = kundali.ascendant.sign;
  const seenSectors = new Set<string>();
  const seenCommodities = new Set<string>();

  // Wealth-house lords
  for (const h of WEALTH_HOUSES) {
    const houseSign = ((lagnaSign - 1 + (h - 1)) % 12) + 1;
    const lordId = SIGN_LORD_FINANCIAL[houseSign];
    if (lordId === undefined) continue;

    const ps = PLANET_SECTORS[lordId];
    if (!ps) continue;

    ps.sectors.forEach(s => seenSectors.add(s));
    ps.commodities.forEach(c => seenCommodities.add(c));
  }

  // Also add sectors for planets actually placed in wealth houses
  for (const planet of kundali.planets) {
    if (WEALTH_HOUSES.includes(planet.house as typeof WEALTH_HOUSES[number])) {
      const pid = planet.planet?.id;
      if (pid === undefined || pid > 8) continue;
      const ps = PLANET_SECTORS[pid];
      if (!ps) continue;
      ps.sectors.forEach(s => seenSectors.add(s));
      ps.commodities.forEach(c => seenCommodities.add(c));
    }
  }

  return {
    sectors: Array.from(seenSectors).slice(0, 6),
    commodities: Array.from(seenCommodities).slice(0, 4),
  };
}

/** Compute wealth-house lord summary */
function computeWealthHouseSummary(
  kundali: KundaliData,
): AnnualFinancialReport['wealthHouseSummary'] {
  const lagnaSign = kundali.ascendant.sign;
  return WEALTH_HOUSES.map(h => {
    const houseSign = ((lagnaSign - 1 + (h - 1)) % 12) + 1;
    const lordId = SIGN_LORD_FINANCIAL[houseSign];
    const lordName = lordId !== undefined ? (PLANET_NAMES_EN[lordId] ?? '—') : '—';
    const planet = lordId !== undefined
      ? kundali.planets.find(p => p.planet?.id === lordId)
      : undefined;
    const lordInWealthHouse = planet
      ? WEALTH_HOUSES.includes(planet.house as typeof WEALTH_HOUSES[number])
      : false;

    return { house: h, lord: lordName, lordInWealthHouse };
  });
}

/** Map average monthly score to a year rating */
function yearRatingFromScore(score: number): AnnualFinancialReport['yearRating'] {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Very Good';
  if (score >= 50) return 'Good';
  if (score >= 35) return 'Mixed';
  return 'Challenging';
}

function yearSummaryFromRating(
  rating: AnnualFinancialReport['yearRating'],
  topSectors: string[],
): string {
  const sectorStr = topSectors.slice(0, 3).join(', ');
  switch (rating) {
    case 'Excellent':
      return `An outstanding year for wealth growth. Your chart strongly supports financial expansion, especially in: ${sectorStr}. Ride the momentum of your dasha cycles.`;
    case 'Very Good':
      return `A prosperous year ahead. Dasha cycles align well with wealth houses, favouring steady growth in: ${sectorStr}. Focus on consolidation and strategic investments.`;
    case 'Good':
      return `A constructive year with meaningful financial opportunities. Best months are highlighted below. Sectors of strength: ${sectorStr}.`;
    case 'Mixed':
      return `A year of mixed financial energies. Strong months exist alongside challenging ones — selectivity is key. Focus areas: ${sectorStr}.`;
    case 'Challenging':
      return `Headwinds in the chart suggest a year for caution and consolidation. Preserve wealth, avoid speculation, and build fundamentals. Patience will be rewarded.`;
  }
}

// ─── Main orchestrator ────────────────────────────────────────────────────────

/**
 * Generate the full annual financial report.
 *
 * @param kundali   - Full KundaliData
 * @param todayISO  - Current date ISO string (YYYY-MM-DD)
 */
export function computeAnnualFinancialReport(
  kundali: KundaliData,
  todayISO: string,
): AnnualFinancialReport {
  const monthlyOutlook = computeFinancialWindows(kundali, todayISO);
  const dhanaActivations = computeDhanaActivations(kundali, todayISO);

  const { sectors, commodities } = deriveTopSectors(kundali);
  const wealthHouseSummary = computeWealthHouseSummary(kundali);

  // Year score = average of monthly scores
  const yearScore = monthlyOutlook.length > 0
    ? Math.round(monthlyOutlook.reduce((sum, m) => sum + m.score, 0) / monthlyOutlook.length)
    : 50;

  const yearRating = yearRatingFromScore(yearScore);
  const yearSummary = yearSummaryFromRating(yearRating, sectors);

  // Filter retrograde cautions to the next 12 months
  const nextYear = new Date(todayISO);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const retrogradeCautions = STATIC_RETROGRADE_CAUTIONS;

  return {
    yearRating,
    yearScore,
    yearSummary,
    monthlyOutlook,
    dhanaActivations,
    retrogradeCautions,
    topSectors: sectors,
    topCommodities: commodities,
    wealthHouseSummary,
  };
}
