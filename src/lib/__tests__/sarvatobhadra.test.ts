import { describe, it, expect } from 'vitest';
import {
  SBC_GRID,
  NAKSHATRA_POSITIONS,
  WEEKDAY_POSITIONS,
  TITHI_POSITIONS,
} from '@/lib/chakra/sbc-grid-layout';
import type { SBCCell } from '@/lib/chakra/sbc-grid-layout';
import {
  computeVedha,
  analyzeSarvatobhadra,
} from '@/lib/chakra/sarvatobhadra';

// ---------- Grid Layout Tests ----------

describe('SBC Grid Layout', () => {
  it('has exactly 9 rows and 9 columns (81 cells)', () => {
    expect(SBC_GRID).toHaveLength(9);
    for (const row of SBC_GRID) {
      expect(row).toHaveLength(9);
    }
  });

  it('every cell has valid row/col indices matching its position', () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = SBC_GRID[r][c];
        expect(cell.row).toBe(r);
        expect(cell.col).toBe(c);
      }
    }
  });

  it('contains all 27 standard nakshatras', () => {
    const ids = new Set<number>();
    for (const row of SBC_GRID) {
      for (const cell of row) {
        if (cell.type === 'nakshatra' && cell.nakshatraId != null) {
          ids.add(cell.nakshatraId);
        }
      }
    }
    for (let i = 1; i <= 27; i++) {
      expect(ids.has(i)).toBe(true);
    }
  });

  it('contains Abhijit (nakshatra 28)', () => {
    const ids = new Set<number>();
    for (const row of SBC_GRID) {
      for (const cell of row) {
        if (cell.type === 'nakshatra' && cell.nakshatraId === 28) {
          ids.add(28);
        }
      }
    }
    expect(ids.has(28)).toBe(true);
  });

  it('NAKSHATRA_POSITIONS covers all 28 nakshatras', () => {
    for (let i = 1; i <= 28; i++) {
      const positions = NAKSHATRA_POSITIONS.get(i);
      expect(positions).toBeDefined();
      expect(positions!.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('has all 7 weekdays in the grid', () => {
    for (let d = 0; d < 7; d++) {
      const positions = WEEKDAY_POSITIONS.get(d);
      expect(positions).toBeDefined();
      expect(positions!.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('has tithis placed in the grid', () => {
    expect(TITHI_POSITIONS.size).toBeGreaterThan(0);
    // At minimum, S1 (1) and K15 (30) are in the grid
    expect(TITHI_POSITIONS.has(1)).toBe(true);
    expect(TITHI_POSITIONS.has(30)).toBe(true);
  });

  it('has 4 direction cells at corners', () => {
    const corners = [
      SBC_GRID[0][0],
      SBC_GRID[0][8],
      SBC_GRID[8][0],
      SBC_GRID[8][8],
    ];
    for (const cell of corners) {
      expect(cell.type).toBe('direction');
    }
  });

  it('has vowel cells on the borders', () => {
    const vowelCells: SBCCell[] = [];
    for (const row of SBC_GRID) {
      for (const cell of row) {
        if (cell.type === 'vowel') vowelCells.push(cell);
      }
    }
    expect(vowelCells.length).toBeGreaterThanOrEqual(8);
    // All vowels should be on borders (row 0, 8, col 0, 8)
    for (const v of vowelCells) {
      const onBorder = v.row === 0 || v.row === 8 || v.col === 0 || v.col === 8 ||
        v.row === 2 || v.row === 4 || v.row === 6; // vowels also on inner row edges
      expect(onBorder).toBe(true);
    }
  });
});

// ---------- Vedha Computation Tests ----------

describe('computeVedha', () => {
  it('returns 4 vedha lines (row, col, 2 diagonals)', () => {
    const lines = computeVedha({ row: 4, col: 4 });
    expect(lines).toHaveLength(4);
    const dirs = lines.map(l => l.direction);
    expect(dirs).toContain('row');
    expect(dirs).toContain('column');
    expect(dirs).toContain('diagonal-ne');
    expect(dirs).toContain('diagonal-nw');
  });

  it('row vedha has 8 cells (excluding source)', () => {
    const lines = computeVedha({ row: 4, col: 4 });
    const rowLine = lines.find(l => l.direction === 'row')!;
    expect(rowLine.affectedCells).toHaveLength(8);
    // All cells on the same row
    for (const cell of rowLine.affectedCells) {
      expect(cell.row).toBe(4);
    }
  });

  it('column vedha has 8 cells (excluding source)', () => {
    const lines = computeVedha({ row: 4, col: 4 });
    const colLine = lines.find(l => l.direction === 'column')!;
    expect(colLine.affectedCells).toHaveLength(8);
    for (const cell of colLine.affectedCells) {
      expect(cell.col).toBe(4);
    }
  });

  it('center cell (4,4) has diagonals spanning full grid', () => {
    const lines = computeVedha({ row: 4, col: 4 });
    const neDiag = lines.find(l => l.direction === 'diagonal-ne')!;
    const nwDiag = lines.find(l => l.direction === 'diagonal-nw')!;
    // From center, diagonals go 4 cells each direction = 8 cells each
    expect(neDiag.affectedCells).toHaveLength(8);
    expect(nwDiag.affectedCells).toHaveLength(8);
  });

  it('corner cell (0,0) has shorter diagonals', () => {
    const lines = computeVedha({ row: 0, col: 0 });
    const neDiag = lines.find(l => l.direction === 'diagonal-ne')!;
    // From (0,0), NE direction: no cells (already at top-left)
    // NW-SE (row+1,col+1): 8 cells on main diagonal
    const nwDiag = lines.find(l => l.direction === 'diagonal-nw')!;
    expect(nwDiag.affectedCells.length).toBe(8); // (1,1) through (8,8)
    // NE-SW from (0,0): no NE cells, SW direction means row+1,col-1 which goes negative
    expect(neDiag.affectedCells.length).toBe(0);
  });

  it('vedha from Anuradha (center) includes weekday cells', () => {
    // Anuradha is at (4,4) — center of the grid
    const lines = computeVedha({ row: 4, col: 4 });
    const allWeekdays = lines.flatMap(l => l.affectedWeekdays);
    // The center row and column should include some weekday cells
    expect(allWeekdays.length).toBeGreaterThan(0);
  });
});

// ---------- Benefic/Malefic Classification ----------

describe('analyzeSarvatobhadra', () => {
  it('classifies Jupiter transit as benefic', () => {
    const result = analyzeSarvatobhadra(1, [
      { planetId: 4, nakshatraId: 7 }, // Jupiter in Punarvasu
    ]);
    expect(result.transitVedhas).toHaveLength(1);
    expect(result.transitVedhas[0].isBenefic).toBe(true);
  });

  it('classifies Saturn transit as malefic', () => {
    const result = analyzeSarvatobhadra(1, [
      { planetId: 6, nakshatraId: 17 }, // Saturn in Anuradha
    ]);
    expect(result.transitVedhas).toHaveLength(1);
    expect(result.transitVedhas[0].isBenefic).toBe(false);
  });

  it('classifies Venus as benefic, Mars as malefic', () => {
    const result = analyzeSarvatobhadra(1, [
      { planetId: 5, nakshatraId: 2 },  // Venus in Bharani (benefic)
      { planetId: 2, nakshatraId: 14 },  // Mars in Chitra (malefic)
    ]);
    expect(result.transitVedhas).toHaveLength(2);
    const venus = result.transitVedhas.find(v => v.planetId === 5)!;
    const mars = result.transitVedhas.find(v => v.planetId === 2)!;
    expect(venus.isBenefic).toBe(true);
    expect(mars.isBenefic).toBe(false);
  });

  it('classifies Moon(1) and Mercury(3) as benefic', () => {
    const result = analyzeSarvatobhadra(10, [
      { planetId: 1, nakshatraId: 4 },   // Moon in Rohini
      { planetId: 3, nakshatraId: 9 },   // Mercury in Ashlesha
    ]);
    for (const v of result.transitVedhas) {
      expect(v.isBenefic).toBe(true);
    }
  });

  it('classifies Sun(0), Rahu(7), Ketu(8) as malefic', () => {
    const result = analyzeSarvatobhadra(10, [
      { planetId: 0, nakshatraId: 12 },  // Sun in U.Phalguni
      { planetId: 7, nakshatraId: 6 },   // Rahu in Ardra
      { planetId: 8, nakshatraId: 24 },  // Ketu in Shatabhisha
    ]);
    for (const v of result.transitVedhas) {
      expect(v.isBenefic).toBe(false);
    }
  });

  it('returns favorable/unfavorable weekdays', () => {
    const result = analyzeSarvatobhadra(1, [
      { planetId: 4, nakshatraId: 7 },   // Jupiter in Punarvasu (benefic)
      { planetId: 6, nakshatraId: 17 },  // Saturn in Anuradha (malefic)
    ]);
    // Both transits have vedha lines that hit weekday cells
    const allDays = [...result.favorableDays, ...result.unfavorableDays];
    expect(allDays.length).toBeGreaterThan(0);
    // Malefic days should not appear in favorable
    for (const d of result.unfavorableDays) {
      expect(result.favorableDays).not.toContain(d);
    }
  });

  it('handles multiple planets in same nakshatra', () => {
    const result = analyzeSarvatobhadra(1, [
      { planetId: 4, nakshatraId: 7 },  // Jupiter in Punarvasu
      { planetId: 5, nakshatraId: 7 },  // Venus in Punarvasu
    ]);
    expect(result.transitVedhas).toHaveLength(2);
    // Both are benefic
    expect(result.transitVedhas.every(v => v.isBenefic)).toBe(true);
  });

  it('handles empty transits gracefully', () => {
    const result = analyzeSarvatobhadra(1, []);
    expect(result.transitVedhas).toHaveLength(0);
    expect(result.favorableDays).toHaveLength(0);
    expect(result.unfavorableDays).toHaveLength(0);
    expect(result.summary).toContain('No transits');
  });

  it('generates a meaningful summary string', () => {
    const result = analyzeSarvatobhadra(1, [
      { planetId: 4, nakshatraId: 7 },   // Jupiter in Punarvasu
    ]);
    expect(result.summary.length).toBeGreaterThan(10);
    expect(typeof result.summary).toBe('string');
  });

  it('includes birth nakshatra ID in result', () => {
    const result = analyzeSarvatobhadra(15, [
      { planetId: 6, nakshatraId: 17 },
    ]);
    expect(result.birthNakshatraId).toBe(15);
  });

  it('handles Abhijit (nakshatra 28) in transit', () => {
    const result = analyzeSarvatobhadra(1, [
      { planetId: 4, nakshatraId: 28 },  // Jupiter in Abhijit
    ]);
    expect(result.transitVedhas).toHaveLength(1);
    expect(result.transitVedhas[0].nakshatraId).toBe(28);
    expect(result.transitVedhas[0].nakshatraName.en).toBe('Abhijit');
  });

  it('malefic override: conflicting day is removed from favorable', () => {
    // Find a weekday that would be hit by both a benefic and malefic transit
    const result = analyzeSarvatobhadra(1, [
      { planetId: 4, nakshatraId: 7 },   // Jupiter (benefic)
      { planetId: 6, nakshatraId: 7 },   // Saturn (malefic) — same nakshatra
    ]);
    // Days hit by Saturn should not be in favorableDays
    for (const d of result.unfavorableDays) {
      expect(result.favorableDays).not.toContain(d);
    }
  });
});
