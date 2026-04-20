/**
 * Dasha Comparison Engine
 * Computes a dual-dasha timeline overlay for two kundali charts,
 * classifying periods by quality and alignment.
 */

import type { DashaEntry } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import { GRAHAS } from '@/lib/constants/grahas';

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type PeriodQuality = 'favorable' | 'neutral' | 'challenging';

export interface DashaPeriodInfo {
  planet: string;
  planetName: LocaleText;
  quality: PeriodQuality;
}

export interface DashaComparisonEntry {
  startDate: string;        // ISO
  endDate: string;
  chart1Period: DashaPeriodInfo;
  chart2Period: DashaPeriodInfo;
  alignment: 'aligned' | 'mixed' | 'tension';
  interpretation: string;
}

export interface AlignmentWindow {
  start: string;
  end: string;
  type: 'aligned' | 'tension';
}

export interface DashaComparisonResult {
  entries: DashaComparisonEntry[];
  alignmentWindows: AlignmentWindow[];
  summary: string;
}

/* ─── Planet Name → ID Lookup ───────────────────────────────────────────── */

const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

/* ─── Period Quality Classification ─────────────────────────────────────── */

/**
 * Classify a Mahadasha period by natural planet benefic/malefic nature.
 * Simplified approach: natural benefics → favorable, natural malefics → challenging.
 * A full analysis would check functional benefic/malefic for the specific lagna,
 * but that adds complexity beyond the scope of this timeline overlay.
 */
export function classifyPeriod(planet: string, _ascSign: number): PeriodQuality {
  // Natural benefics
  const BENEFICS = ['Jupiter', 'Venus'];
  // Natural malefics
  const MALEFICS = ['Saturn', 'Rahu', 'Ketu'];

  if (BENEFICS.includes(planet)) return 'favorable';
  if (MALEFICS.includes(planet)) return 'challenging';

  // Sun, Moon, Mars, Mercury — context-dependent, classify as neutral
  return 'neutral';
}

/* ─── Alignment Logic ───────────────────────────────────────────────────── */

function computeAlignment(q1: PeriodQuality, q2: PeriodQuality): 'aligned' | 'mixed' | 'tension' {
  if (q1 === 'favorable' && q2 === 'favorable') return 'aligned';
  if (q1 === 'challenging' && q2 === 'challenging') return 'tension';
  if (
    (q1 === 'favorable' && q2 === 'challenging') ||
    (q1 === 'challenging' && q2 === 'favorable')
  ) return 'tension';
  // One or both neutral → mixed
  return 'mixed';
}

/* ─── Interpretation ────────────────────────────────────────────────────── */

function getInterpretation(
  p1: string,
  p2: string,
  alignment: 'aligned' | 'mixed' | 'tension',
): string {
  if (alignment === 'aligned') {
    return `Both partners experience ${p1} and ${p2} periods simultaneously — a time of mutual growth, shared optimism, and aligned goals.`;
  }
  if (alignment === 'tension') {
    return `${p1} and ${p2} running together creates contrasting energies — one partner may feel restricted while the other pushes forward. Patience and communication are key.`;
  }
  return `A mixed period with ${p1} and ${p2} — neither strongly aligned nor in opposition. Everyday dynamics dominate over planetary influence.`;
}

/* ─── Flatten Maha Dashas into Segments ─────────────────────────────────── */

interface FlatSegment {
  planet: string;
  planetName: LocaleText;
  start: string; // ISO
  end: string;
}

function flattenMahaDashas(dashas: DashaEntry[], startYear: number, endYear: number): FlatSegment[] {
  const windowStart = `${startYear}-01-01T00:00:00.000Z`;
  const windowEnd = `${endYear}-12-31T23:59:59.999Z`;
  const segments: FlatSegment[] = [];

  for (const d of dashas) {
    if (d.level !== 'maha') continue;
    // Skip periods entirely outside our window
    if (d.endDate < windowStart || d.startDate > windowEnd) continue;

    const clampedStart = d.startDate < windowStart ? windowStart : d.startDate;
    const clampedEnd = d.endDate > windowEnd ? windowEnd : d.endDate;

    segments.push({
      planet: d.planet,
      planetName: d.planetName,
      start: clampedStart,
      end: clampedEnd,
    });
  }

  // Sort by start date
  segments.sort((a, b) => a.start.localeCompare(b.start));
  return segments;
}

/* ─── Main Comparison Function ──────────────────────────────────────────── */

export function compareDashas(
  chart1Dashas: DashaEntry[],
  chart2Dashas: DashaEntry[],
  chart1AscSign: number,
  chart2AscSign: number,
  startYear: number,
  endYear: number,
): DashaComparisonResult {
  if (!chart1Dashas.length || !chart2Dashas.length) {
    console.warn('[dasha-comparison] One or both charts have no dasha data — chart1:', chart1Dashas.length, 'chart2:', chart2Dashas.length);
    return { entries: [], alignmentWindows: [], summary: 'Dasha data unavailable for one or both charts.' };
  }

  const seg1 = flattenMahaDashas(chart1Dashas, startYear, endYear);
  const seg2 = flattenMahaDashas(chart2Dashas, startYear, endYear);

  if (!seg1.length || !seg2.length) {
    return { entries: [], alignmentWindows: [], summary: '' };
  }

  // Collect all boundary dates and sort them
  const boundaries = new Set<string>();
  for (const s of [...seg1, ...seg2]) {
    boundaries.add(s.start);
    boundaries.add(s.end);
  }
  const sortedBoundaries = Array.from(boundaries).sort();

  // Build entries for each interval between consecutive boundaries
  const entries: DashaComparisonEntry[] = [];

  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    const intervalStart = sortedBoundaries[i];
    const intervalEnd = sortedBoundaries[i + 1];

    // Find which maha dasha is active for each chart at the midpoint of this interval
    const midIso = intervalStart; // start is sufficient for lookup
    const active1 = seg1.find(s => s.start <= midIso && s.end > midIso);
    const active2 = seg2.find(s => s.start <= midIso && s.end > midIso);

    if (!active1 || !active2) continue;

    const q1 = classifyPeriod(active1.planet, chart1AscSign);
    const q2 = classifyPeriod(active2.planet, chart2AscSign);
    const alignment = computeAlignment(q1, q2);

    entries.push({
      startDate: intervalStart,
      endDate: intervalEnd,
      chart1Period: { planet: active1.planet, planetName: active1.planetName, quality: q1 },
      chart2Period: { planet: active2.planet, planetName: active2.planetName, quality: q2 },
      alignment,
      interpretation: getInterpretation(active1.planet, active2.planet, alignment),
    });
  }

  // Build alignment windows — group consecutive entries with the same alignment type
  // Only track 'aligned' and 'tension' windows (skip mixed)
  const alignmentWindows: AlignmentWindow[] = [];
  let currentWindow: AlignmentWindow | null = null;

  for (const entry of entries) {
    if (entry.alignment === 'aligned' || entry.alignment === 'tension') {
      if (currentWindow && currentWindow.type === entry.alignment && currentWindow.end === entry.startDate) {
        // Extend the current window
        currentWindow.end = entry.endDate;
      } else {
        // Start a new window
        if (currentWindow) alignmentWindows.push(currentWindow);
        currentWindow = { start: entry.startDate, end: entry.endDate, type: entry.alignment };
      }
    } else {
      // Mixed breaks the window
      if (currentWindow) {
        alignmentWindows.push(currentWindow);
        currentWindow = null;
      }
    }
  }
  if (currentWindow) alignmentWindows.push(currentWindow);

  // Summary
  const alignedCount = entries.filter(e => e.alignment === 'aligned').length;
  const tensionCount = entries.filter(e => e.alignment === 'tension').length;
  const totalSegments = entries.length;

  let summary = '';
  if (totalSegments === 0) {
    summary = 'No overlapping dasha periods found in the selected time range.';
  } else {
    const alignedPct = Math.round((alignedCount / totalSegments) * 100);
    const tensionPct = Math.round((tensionCount / totalSegments) * 100);

    if (alignedPct >= 50) {
      summary = `Strong alignment: ${alignedPct}% of the period shows harmonious dasha overlap. A supportive time for shared endeavors and growth.`;
    } else if (tensionPct >= 50) {
      summary = `Challenging period: ${tensionPct}% of the timeline shows tension between dashas. Patience, communication, and mutual understanding will be important.`;
    } else {
      summary = `Mixed dynamics: ${alignedPct}% aligned, ${tensionPct}% tension. The relationship will experience varied phases — adaptability is key.`;
    }
  }

  return { entries, alignmentWindows, summary };
}

/* ─── Helper: Get planet color from GRAHAS ──────────────────────────────── */

export function getPlanetColor(planetName: string): string {
  const id = PLANET_NAME_TO_ID[planetName];
  if (id !== undefined && GRAHAS[id]) {
    return GRAHAS[id].color;
  }
  console.warn(`[dasha-comparison] Unknown planet "${planetName}" — using fallback gold`);
  return '#d4a853'; // fallback gold
}

export function getPlanetId(planetName: string): number {
  return PLANET_NAME_TO_ID[planetName] ?? -1;
}
