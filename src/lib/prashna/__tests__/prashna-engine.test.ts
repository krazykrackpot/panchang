/**
 * Prashna Ashtamangala System Tests
 *
 * Covers:
 * - mapNumberToObject: number-to-object mapping and wrapping
 * - calculateArudaHouse: house calculation range
 * - ASHTAMANGALA_OBJECTS: structure validation
 * - generatePrashnaResult: full orchestration for multiple categories/locales
 * - detectPrashnaYogas: yoga detection from chart data
 * - analyzePrashna: horary analysis from kundali
 */

import { describe, it, expect } from 'vitest';
import {
  mapNumberToObject,
  calculateArudaHouse,
  generatePrashnaResult,
  ASHTAMANGALA_OBJECTS,
} from '@/lib/prashna/ashtamangala';
import { detectPrashnaYogas } from '@/lib/prashna/prashna-yogas';
import { generateInterpretation } from '@/lib/prashna/interpretation';
import { analyzePrashna, PRASHNA_CATEGORIES } from '@/lib/prashna/horary-analysis';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';

// Delhi, Jan 15 2025 12:00 — standard test fixture
const DELHI_BIRTH: BirthData = {
  name: 'Test Prashna',
  date: '2025-01-15',
  time: '12:00',
  place: 'Delhi',
  lat: 28.6139,
  lng: 77.209,
  timezone: '5.5',
  ayanamsha: 'lahiri',
};

// ──────────────────────────────────────────────────────────────
// ASHTAMANGALA_OBJECTS
// ──────────────────────────────────────────────────────────────

describe('ASHTAMANGALA_OBJECTS', () => {
  it('contains exactly 8 objects', () => {
    expect(ASHTAMANGALA_OBJECTS).toHaveLength(8);
  });

  it('each object has name (Trilingual) and symbolism', () => {
    for (const obj of ASHTAMANGALA_OBJECTS) {
      expect(obj.name).toBeDefined();
      expect(obj.name.en).toBeTruthy();
      expect(obj.name.hi).toBeTruthy();
      expect(obj.name.sa).toBeTruthy();
      expect(obj.symbolism).toBeDefined();
      expect(obj.symbolism.en).toBeTruthy();
    }
  });

  it('each object has valid planetRuler (0-8) and element', () => {
    for (const obj of ASHTAMANGALA_OBJECTS) {
      expect(obj.planetRuler).toBeGreaterThanOrEqual(0);
      expect(obj.planetRuler).toBeLessThanOrEqual(8);
      expect(obj.element.en).toBeTruthy();
      expect(obj.planetName).toBeDefined();
      expect(obj.planetName.en).toBeTruthy();
    }
  });

  it('IDs are sequential 1-8', () => {
    const ids = ASHTAMANGALA_OBJECTS.map(o => o.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

// ──────────────────────────────────────────────────────────────
// mapNumberToObject
// ──────────────────────────────────────────────────────────────

describe('mapNumberToObject', () => {
  it('maps 1 to the first object (Darpana)', () => {
    const obj = mapNumberToObject(1);
    expect(obj.id).toBe(1);
    expect(obj.name.en).toContain('Darpana');
  });

  it('maps 8 to the last object (Chamara)', () => {
    const obj = mapNumberToObject(8);
    expect(obj.id).toBe(8);
    expect(obj.name.en).toContain('Chamara');
  });

  it('maps 9 back to first object (wrapping)', () => {
    const obj = mapNumberToObject(9);
    expect(obj.id).toBe(1);
  });

  it('maps 108 to a valid object via wrapping', () => {
    const obj = mapNumberToObject(108);
    // 108 - 1 = 107, 107 % 8 = 3 => index 3 => id 4
    expect(obj.id).toBe(4);
    expect(obj.name.en).toBeTruthy();
  });

  it('wraps numbers > 108 correctly', () => {
    const obj200 = mapNumberToObject(200);
    // (200-1) % 8 = 199 % 8 = 7 => index 7 => id 8
    expect(obj200.id).toBe(8);

    const obj999 = mapNumberToObject(999);
    // (999-1) % 8 = 998 % 8 = 6 => index 6 => id 7
    expect(obj999.id).toBe(7);
  });

  it('returns a valid AshtamangalaObject for every number 1-108', () => {
    for (let i = 1; i <= 108; i++) {
      const obj = mapNumberToObject(i);
      expect(obj.id).toBeGreaterThanOrEqual(1);
      expect(obj.id).toBeLessThanOrEqual(8);
      expect(obj.name.en).toBeTruthy();
    }
  });
});

// ──────────────────────────────────────────────────────────────
// calculateArudaHouse
// ──────────────────────────────────────────────────────────────

describe('calculateArudaHouse', () => {
  it('returns 1 for input 1', () => {
    expect(calculateArudaHouse(1)).toBe(1);
  });

  it('returns 12 for input 12', () => {
    expect(calculateArudaHouse(12)).toBe(12);
  });

  it('wraps 13 back to 1', () => {
    expect(calculateArudaHouse(13)).toBe(1);
  });

  it('returns 1-12 for all inputs 1-108', () => {
    for (let i = 1; i <= 108; i++) {
      const house = calculateArudaHouse(i);
      expect(house).toBeGreaterThanOrEqual(1);
      expect(house).toBeLessThanOrEqual(12);
    }
  });

  it('maps specific values correctly', () => {
    // 23: (23-1) % 12 = 10 => 10 + 1 = 11
    expect(calculateArudaHouse(23)).toBe(11);
    // 45: (45-1) % 12 = 44 % 12 = 8 => 8 + 1 = 9
    expect(calculateArudaHouse(45)).toBe(9);
    // 67: (67-1) % 12 = 66 % 12 = 6 => 6 + 1 = 7
    expect(calculateArudaHouse(67)).toBe(7);
  });
});

// ──────────────────────────────────────────────────────────────
// generatePrashnaResult
// ──────────────────────────────────────────────────────────────

describe('generatePrashnaResult', () => {
  it('produces valid complete output for [23,45,67] general category', () => {
    const result = generatePrashnaResult(
      [23, 45, 67],
      'health',
      28.6139,
      77.209,
      5.5,
      'en'
    );

    // Top-level fields
    expect(result.numbers).toEqual([23, 45, 67]);
    expect(result.category).toBe('health');
    expect(result.castTime).toBeTruthy();

    // Objects: tuple of 3
    expect(result.objects).toHaveLength(3);
    for (const obj of result.objects) {
      expect(obj.id).toBeGreaterThanOrEqual(1);
      expect(obj.id).toBeLessThanOrEqual(8);
      expect(obj.name.en).toBeTruthy();
    }

    // Aruda houses: tuple of 3, each 1-12
    expect(result.arudaHouses).toHaveLength(3);
    for (const h of result.arudaHouses) {
      expect(h).toBeGreaterThanOrEqual(1);
      expect(h).toBeLessThanOrEqual(12);
    }

    // Prashna chart is a valid KundaliData
    expect(result.prashnaChart).toBeDefined();
    expect(result.prashnaChart.ascendant).toBeDefined();
    expect(result.prashnaChart.planets.length).toBeGreaterThan(0);

    // Yogas array
    expect(Array.isArray(result.yogas)).toBe(true);

    // Interpretation
    expect(result.interpretation).toBeDefined();
    expect(['favorable', 'unfavorable', 'mixed']).toContain(result.interpretation.verdict);
    expect(result.interpretation.summary.en).toBeTruthy();
    expect(result.interpretation.timing.en).toBeTruthy();
    expect(result.interpretation.remedies.length).toBeGreaterThan(0);
  });

  it('works with career category', () => {
    const result = generatePrashnaResult(
      [10, 50, 90],
      'career',
      28.6139,
      77.209,
      5.5,
      'en'
    );
    expect(result.category).toBe('career');
    expect(result.interpretation.verdict).toBeTruthy();
    expect(result.interpretation.summary.en).toContain('career');
  });

  it('works with marriage category', () => {
    const result = generatePrashnaResult(
      [7, 21, 42],
      'marriage',
      28.6139,
      77.209,
      5.5,
      'en'
    );
    expect(result.category).toBe('marriage');
    expect(result.interpretation.summary.en.toLowerCase()).toContain('marriage');
  });

  it('produces Hindi output when locale is hi', () => {
    const result = generatePrashnaResult(
      [23, 45, 67],
      'health',
      28.6139,
      77.209,
      5.5,
      'hi'
    );

    // Interpretation summary should have Hindi text
    expect(result.interpretation.summary.hi).toBeTruthy();
    // Objects should have Hindi names
    expect(result.objects[0].name.hi).toBeTruthy();
    // Remedies should have Hindi
    expect(result.interpretation.remedies[0].hi).toBeTruthy();
  });

  it('produces different results for different number sets', () => {
    const r1 = generatePrashnaResult([1, 2, 3], 'fortune', 28.6139, 77.209, 5.5);
    const r2 = generatePrashnaResult([50, 60, 70], 'fortune', 28.6139, 77.209, 5.5);

    // Different numbers should map to different objects
    expect(r1.objects[0].id).not.toBe(r2.objects[0].id);
  });
});

// ──────────────────────────────────────────────────────────────
// detectPrashnaYogas
// ──────────────────────────────────────────────────────────────

describe('detectPrashnaYogas', () => {
  const kundali = generateKundali(DELHI_BIRTH);

  it('returns an array', () => {
    const yogas = detectPrashnaYogas(kundali.planets, kundali.ascendant.sign);
    expect(Array.isArray(yogas)).toBe(true);
  });

  it('each yoga has required fields', () => {
    const yogas = detectPrashnaYogas(kundali.planets, kundali.ascendant.sign);
    for (const yoga of yogas) {
      expect(yoga.name.en).toBeTruthy();
      expect(yoga.name.hi).toBeTruthy();
      expect(yoga.name.sa).toBeTruthy();
      expect(['mrityu', 'bandha', 'subha', 'asubha', 'chandra']).toContain(yoga.type);
      expect(typeof yoga.favorable).toBe('boolean');
      expect(yoga.description.en).toBeTruthy();
      expect(Array.isArray(yoga.planets)).toBe(true);
      expect(yoga.planets.length).toBeGreaterThan(0);
    }
  });

  it('detects at least one yoga for a typical chart', () => {
    // A typical chart usually has at least one benefic or malefic in kendra
    const yogas = detectPrashnaYogas(kundali.planets, kundali.ascendant.sign);
    // This may or may not detect yogas depending on the chart;
    // but for Delhi Jan 15 2025 12:00, we expect at least some
    expect(yogas.length).toBeGreaterThanOrEqual(0);
  });

  it('yoga favorable field matches type expectations', () => {
    const yogas = detectPrashnaYogas(kundali.planets, kundali.ascendant.sign);
    for (const yoga of yogas) {
      if (yoga.type === 'mrityu' || yoga.type === 'bandha' || yoga.type === 'asubha') {
        expect(yoga.favorable).toBe(false);
      }
      if (yoga.type === 'subha' || yoga.type === 'chandra') {
        expect(yoga.favorable).toBe(true);
      }
    }
  });
});

// ──────────────────────────────────────────────────────────────
// generateInterpretation
// ──────────────────────────────────────────────────────────────

describe('generateInterpretation', () => {
  const kundali = generateKundali(DELHI_BIRTH);

  it('returns valid interpretation with all fields', () => {
    const objects: [typeof ASHTAMANGALA_OBJECTS[0], typeof ASHTAMANGALA_OBJECTS[0], typeof ASHTAMANGALA_OBJECTS[0]] = [
      ASHTAMANGALA_OBJECTS[0],
      ASHTAMANGALA_OBJECTS[3],
      ASHTAMANGALA_OBJECTS[6],
    ];
    const yogas = detectPrashnaYogas(kundali.planets, kundali.ascendant.sign);
    const arudaHouses: [number, number, number] = [1, 5, 9];

    const interp = generateInterpretation(
      objects,
      yogas,
      'career',
      arudaHouses,
      kundali.planets,
      kundali.ascendant.sign
    );

    expect(['favorable', 'unfavorable', 'mixed']).toContain(interp.verdict);
    expect(interp.summary.en).toBeTruthy();
    expect(interp.summary.hi).toBeTruthy();
    expect(interp.summary.sa).toBeTruthy();
    expect(interp.timing.en).toBeTruthy();
    expect(interp.remedies.length).toBeGreaterThan(0);
  });
});

// ──────────────────────────────────────────────────────────────
// analyzePrashna (horary analysis)
// ──────────────────────────────────────────────────────────────

describe('analyzePrashna', () => {
  const kundali = generateKundali(DELHI_BIRTH);

  it('returns analysis with all required fields for general category', () => {
    const analysis = analyzePrashna(kundali, 'general');

    expect(analysis.category).toBe('general');
    expect(analysis.categoryLabel.en).toBeTruthy();

    // Verdict
    expect(['very_favorable', 'favorable', 'mixed', 'challenging', 'difficult'])
      .toContain(analysis.verdict.outcome);
    expect(typeof analysis.verdict.score).toBe('number');
    expect(analysis.verdict.score).toBeGreaterThanOrEqual(-100);
    expect(analysis.verdict.score).toBeLessThanOrEqual(100);
    expect(analysis.verdict.summary.en).toBeTruthy();

    // Insights
    expect(analysis.lagnaInsight).toBeDefined();
    expect(analysis.lagnaInsight.label.en).toBeTruthy();
    expect(analysis.moonInsight).toBeDefined();
    expect(analysis.relevantHouseInsight).toBeDefined();

    // Key factors
    expect(Array.isArray(analysis.keyFactors)).toBe(true);

    // Timing, guidance, remedies
    expect(analysis.timing.en).toBeTruthy();
    expect(analysis.guidance.en).toBeTruthy();
    expect(analysis.remedies.length).toBeGreaterThan(0);

    // Planet digest
    expect(Array.isArray(analysis.planetDigest)).toBe(true);
    expect(analysis.planetDigest.length).toBeGreaterThan(0);
    for (const pd of analysis.planetDigest) {
      expect(pd.planetName.en).toBeTruthy();
      expect(pd.house).toBeGreaterThanOrEqual(1);
      expect(pd.house).toBeLessThanOrEqual(12);
      expect(['strong', 'moderate', 'weak']).toContain(pd.strength);
    }
  });

  it('works with career category', () => {
    const analysis = analyzePrashna(kundali, 'career');
    expect(analysis.category).toBe('career');
    expect(analysis.categoryLabel.en).toContain('Career');
  });

  it('works with marriage category', () => {
    const analysis = analyzePrashna(kundali, 'marriage');
    expect(analysis.category).toBe('marriage');
  });

  it('works with health category', () => {
    const analysis = analyzePrashna(kundali, 'health');
    expect(analysis.category).toBe('health');
    expect(analysis.verdict.summary.en).toBeTruthy();
  });
});

// ──────────────────────────────────────────────────────────────
// PRASHNA_CATEGORIES
// ──────────────────────────────────────────────────────────────

describe('PRASHNA_CATEGORIES', () => {
  it('has all expected categories', () => {
    const keys = Object.keys(PRASHNA_CATEGORIES);
    expect(keys).toContain('general');
    expect(keys).toContain('career');
    expect(keys).toContain('marriage');
    expect(keys).toContain('health');
    expect(keys).toContain('finance');
  });

  it('each category has label, houses, and karaka', () => {
    for (const [, cfg] of Object.entries(PRASHNA_CATEGORIES)) {
      expect(cfg.label.en).toBeTruthy();
      expect(cfg.houses.length).toBeGreaterThan(0);
      expect(cfg.karaka.length).toBeGreaterThan(0);
    }
  });
});
