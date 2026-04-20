import { describe, it, expect } from 'vitest';
import {
  compareDashas,
  classifyPeriod,
  getPlanetColor,
  getPlanetId,
} from '@/lib/matching/dasha-comparison';
import type { DashaEntry } from '@/types/kundali';

/* ─── Helper: Build a mock Maha Dasha entry ──────────────────────────── */

function makeMaha(planet: string, start: string, end: string): DashaEntry {
  return {
    planet,
    planetName: { en: planet },
    startDate: start,
    endDate: end,
    level: 'maha',
  };
}

/* ─── classifyPeriod ─────────────────────────────────────────────────── */

describe('classifyPeriod', () => {
  it('classifies Jupiter as favorable', () => {
    expect(classifyPeriod('Jupiter', 1)).toBe('favorable');
  });

  it('classifies Venus as favorable', () => {
    expect(classifyPeriod('Venus', 1)).toBe('favorable');
  });

  it('classifies Saturn as challenging', () => {
    expect(classifyPeriod('Saturn', 1)).toBe('challenging');
  });

  it('classifies Rahu as challenging', () => {
    expect(classifyPeriod('Rahu', 1)).toBe('challenging');
  });

  it('classifies Ketu as challenging', () => {
    expect(classifyPeriod('Ketu', 1)).toBe('challenging');
  });

  it('classifies Sun as neutral', () => {
    expect(classifyPeriod('Sun', 1)).toBe('neutral');
  });

  it('classifies Moon as neutral', () => {
    expect(classifyPeriod('Moon', 1)).toBe('neutral');
  });

  it('classifies Mercury as neutral', () => {
    expect(classifyPeriod('Mercury', 1)).toBe('neutral');
  });

  it('classifies Mars as neutral', () => {
    expect(classifyPeriod('Mars', 1)).toBe('neutral');
  });
});

/* ─── compareDashas ──────────────────────────────────────────────────── */

describe('compareDashas', () => {
  const chart1Dashas: DashaEntry[] = [
    makeMaha('Jupiter', '2026-01-01T00:00:00.000Z', '2032-01-01T00:00:00.000Z'),
    makeMaha('Saturn', '2032-01-01T00:00:00.000Z', '2040-01-01T00:00:00.000Z'),
  ];

  const chart2Dashas: DashaEntry[] = [
    makeMaha('Venus', '2026-01-01T00:00:00.000Z', '2030-01-01T00:00:00.000Z'),
    makeMaha('Rahu', '2030-01-01T00:00:00.000Z', '2040-01-01T00:00:00.000Z'),
  ];

  it('returns empty result for empty dashas', () => {
    const result = compareDashas([], [], 1, 1, 2026, 2036);
    expect(result.entries).toHaveLength(0);
    expect(result.alignmentWindows).toHaveLength(0);
    expect(result.summary).toContain('unavailable');
  });

  it('produces entries covering the full date range without gaps', () => {
    const result = compareDashas(chart1Dashas, chart2Dashas, 1, 1, 2026, 2036);
    expect(result.entries.length).toBeGreaterThan(0);

    // Check no gaps: each entry's end should equal the next entry's start
    for (let i = 0; i < result.entries.length - 1; i++) {
      expect(result.entries[i].endDate).toBe(result.entries[i + 1].startDate);
    }
  });

  it('detects aligned window when both charts run favorable planets', () => {
    const result = compareDashas(chart1Dashas, chart2Dashas, 1, 1, 2026, 2036);
    // Jupiter (favorable) + Venus (favorable) from 2026-2030 should be aligned
    const alignedEntries = result.entries.filter(e => e.alignment === 'aligned');
    expect(alignedEntries.length).toBeGreaterThan(0);

    // First entry should be aligned (Jupiter + Venus)
    const firstEntry = result.entries[0];
    expect(firstEntry.chart1Period.planet).toBe('Jupiter');
    expect(firstEntry.chart2Period.planet).toBe('Venus');
    expect(firstEntry.alignment).toBe('aligned');
  });

  it('detects tension window when one favorable + one challenging', () => {
    const result = compareDashas(chart1Dashas, chart2Dashas, 1, 1, 2026, 2036);
    // Jupiter (favorable) + Rahu (challenging) from 2030-2032 should be tension
    const tensionEntries = result.entries.filter(e => e.alignment === 'tension');
    expect(tensionEntries.length).toBeGreaterThan(0);
  });

  it('creates alignment windows from consecutive entries', () => {
    const result = compareDashas(chart1Dashas, chart2Dashas, 1, 1, 2026, 2036);
    expect(result.alignmentWindows.length).toBeGreaterThan(0);

    // There should be an aligned window for Jupiter+Venus period
    const alignedWindows = result.alignmentWindows.filter(w => w.type === 'aligned');
    expect(alignedWindows.length).toBeGreaterThanOrEqual(1);
  });

  it('produces non-empty summary', () => {
    const result = compareDashas(chart1Dashas, chart2Dashas, 1, 1, 2026, 2036);
    expect(result.summary).toBeTruthy();
    expect(result.summary.length).toBeGreaterThan(10);
  });

  it('respects the year window — excludes periods outside range', () => {
    // Only look at 2026-2028 — should only see Jupiter + Venus
    const result = compareDashas(chart1Dashas, chart2Dashas, 1, 1, 2026, 2028);
    for (const entry of result.entries) {
      expect(entry.chart1Period.planet).toBe('Jupiter');
      expect(entry.chart2Period.planet).toBe('Venus');
    }
  });

  it('handles single-planet dashas for both charts', () => {
    const single1: DashaEntry[] = [makeMaha('Saturn', '2026-01-01T00:00:00.000Z', '2040-01-01T00:00:00.000Z')];
    const single2: DashaEntry[] = [makeMaha('Ketu', '2026-01-01T00:00:00.000Z', '2040-01-01T00:00:00.000Z')];
    const result = compareDashas(single1, single2, 1, 1, 2026, 2036);
    // Both challenging → tension
    expect(result.entries.length).toBeGreaterThan(0);
    expect(result.entries[0].alignment).toBe('tension');
  });
});

/* ─── Utility helpers ────────────────────────────────────────────────── */

describe('getPlanetColor', () => {
  it('returns the correct color for Jupiter', () => {
    const color = getPlanetColor('Jupiter');
    expect(color).toBe('#f39c12');
  });

  it('returns fallback gold for unknown planet', () => {
    const color = getPlanetColor('Pluto');
    expect(color).toBe('#d4a853');
  });
});

describe('getPlanetId', () => {
  it('returns correct id for known planets', () => {
    expect(getPlanetId('Sun')).toBe(0);
    expect(getPlanetId('Saturn')).toBe(6);
    expect(getPlanetId('Ketu')).toBe(8);
  });

  it('returns -1 for unknown planet', () => {
    expect(getPlanetId('Unknown')).toBe(-1);
  });
});
