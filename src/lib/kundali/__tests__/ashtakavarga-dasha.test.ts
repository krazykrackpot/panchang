import { describe, it, expect } from 'vitest';
import { predictDashaFromAshtakavarga } from '../ashtakavarga-dasha';
import type { DashaEntry } from '@/types/kundali';

// Helper to create a maha dasha entry
function makeDasha(planet: string, level: 'maha' | 'antar' | 'pratyantar' = 'maha'): DashaEntry {
  return {
    planet,
    planetName: { en: planet, hi: planet, sa: planet },
    startDate: '2026-01-01',
    endDate: '2032-01-01',
    level,
  };
}

describe('predictDashaFromAshtakavarga', () => {
  // A BAV row with total = 42 (highly favorable)
  const highRow = [5, 4, 3, 4, 3, 5, 4, 3, 4, 3, 2, 2]; // sum = 42

  // A BAV row with total = 15 (challenging)
  const lowRow = [1, 2, 1, 0, 2, 1, 1, 2, 1, 1, 2, 1]; // sum = 15

  // A BAV row with total = 32 (favorable)
  const midRow = [3, 3, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3]; // sum = 32

  // Full 7×12 table — index 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
  const reducedBpi: number[][] = [
    highRow,  // Sun — 42
    midRow,   // Moon — 32
    lowRow,   // Mars — 15
    midRow,   // Mercury — 32
    highRow,  // Jupiter — 42
    midRow,   // Venus — 32
    lowRow,   // Saturn — 15
  ];

  const pinda = [120, 95, 50, 95, 130, 100, 55];

  it('planet with BAV total 42 → highly_favorable', () => {
    const dashas = [makeDasha('Sun')];
    const results = predictDashaFromAshtakavarga(dashas, reducedBpi, pinda);

    expect(results).toHaveLength(1);
    expect(results[0].bavTotal).toBe(42);
    expect(results[0].prediction).toBe('highly_favorable');
    expect(results[0].planetId).toBe(0);
    expect(results[0].pindaScore).toBe(120);
  });

  it('planet with BAV total 15 → challenging', () => {
    const dashas = [makeDasha('Mars')];
    const results = predictDashaFromAshtakavarga(dashas, reducedBpi, pinda);

    expect(results).toHaveLength(1);
    expect(results[0].bavTotal).toBe(15);
    expect(results[0].prediction).toBe('challenging');
  });

  it('planet with BAV total 32 → favorable', () => {
    const dashas = [makeDasha('Moon')];
    const results = predictDashaFromAshtakavarga(dashas, reducedBpi, pinda);

    expect(results).toHaveLength(1);
    expect(results[0].bavTotal).toBe(32);
    expect(results[0].prediction).toBe('favorable');
  });

  it('Rahu dasha uses Saturn BAV row (index 6)', () => {
    const dashas = [makeDasha('Rahu')];
    const results = predictDashaFromAshtakavarga(dashas, reducedBpi, pinda);

    expect(results).toHaveLength(1);
    expect(results[0].planetId).toBe(7); // Rahu
    // Saturn's row total = 15 → challenging
    expect(results[0].bavTotal).toBe(15);
    expect(results[0].prediction).toBe('challenging');
    expect(results[0].pindaScore).toBe(55); // Saturn's pinda
  });

  it('Ketu dasha uses Mars BAV row (index 2)', () => {
    const dashas = [makeDasha('Ketu')];
    const results = predictDashaFromAshtakavarga(dashas, reducedBpi, pinda);

    expect(results).toHaveLength(1);
    expect(results[0].planetId).toBe(8); // Ketu
    // Mars's row total = 15 → challenging
    expect(results[0].bavTotal).toBe(15);
    expect(results[0].pindaScore).toBe(50); // Mars's pinda
  });

  it('returns only maha-level predictions (filters out antar/pratyantar)', () => {
    const dashas = [
      makeDasha('Sun', 'maha'),
      makeDasha('Moon', 'antar'),
      makeDasha('Mars', 'pratyantar'),
      makeDasha('Jupiter', 'maha'),
    ];
    const results = predictDashaFromAshtakavarga(dashas, reducedBpi, pinda);

    expect(results).toHaveLength(2);
    expect(results[0].planet).toBe('Sun');
    expect(results[1].planet).toBe('Jupiter');
  });

  it('correctly identifies strong and weak signs', () => {
    const dashas = [makeDasha('Sun')];
    const results = predictDashaFromAshtakavarga(dashas, reducedBpi, pinda);

    // highRow = [5, 4, 3, 4, 3, 5, 4, 3, 4, 3, 2, 2]
    // Strong (>= 4): indices 0,1,3,5,6,8 → signs 1,2,4,6,7,9
    expect(results[0].strongSigns).toEqual([1, 2, 4, 6, 7, 9]);
    // Weak (<= 1): none in highRow
    expect(results[0].weakSigns).toEqual([]);
  });

  it('weak signs correctly identified for low BAV row', () => {
    const dashas = [makeDasha('Mars')];
    const results = predictDashaFromAshtakavarga(dashas, reducedBpi, pinda);

    // lowRow = [1, 2, 1, 0, 2, 1, 1, 2, 1, 1, 2, 1]
    // Weak (<= 1): indices 0,2,3,5,6,8,9,11 → signs 1,3,4,6,7,9,10,12
    expect(results[0].weakSigns).toEqual([1, 3, 4, 6, 7, 9, 10, 12]);
  });

  it('includes description text for each prediction level', () => {
    const dashas = [makeDasha('Sun'), makeDasha('Mars')];
    const results = predictDashaFromAshtakavarga(dashas, reducedBpi, pinda);

    expect(results[0].description).toContain('highly favorable');
    expect(results[1].description).toContain('challenging');
  });
});
