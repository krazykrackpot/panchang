/**
 * Sarvatobhadra Chakra — Vedha (strike) Engine
 *
 * When a transiting planet occupies a nakshatra, it "strikes" every cell
 * sharing a row, column, or diagonal with that nakshatra's position in the
 * classical 9x9 grid.
 *
 * Benefic planets (Jupiter, Venus, Mercury, Moon) produce favorable vedha;
 * malefic planets (Sun, Mars, Saturn, Rahu, Ketu) produce obstructive vedha.
 */

import type { LocaleText } from '@/types/panchang';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { GRAHAS } from '@/lib/constants/grahas';
import {
  SBC_GRID,
  NAKSHATRA_POSITIONS,
  type SBCCell,
} from './sbc-grid-layout';

// --------------- public types ---------------

export interface VedhaLine {
  direction: 'row' | 'column' | 'diagonal-ne' | 'diagonal-nw';
  affectedCells: { row: number; col: number }[];
  affectedNakshatras: number[];   // nakshatra IDs hit
  affectedWeekdays: number[];     // 0-6
  affectedTithis: number[];       // 1-30
  affectedVowels: string[];
}

export interface TransitVedha {
  planetId: number;
  planetName: LocaleText;
  nakshatraId: number;
  nakshatraName: LocaleText;
  isBenefic: boolean;
  vedhaLines: VedhaLine[];
  /** Approximate duration this planet stays in this nakshatra */
  transitDuration: string;
}

// Approximate nakshatra transit duration per planet (average sidereal)
const TRANSIT_DURATIONS: Record<number, string> = {
  0: '~13 days',       // Sun
  1: '~1 day',         // Moon
  2: '~45 days',       // Mars
  3: '~12 days',       // Mercury
  4: '~13 months',     // Jupiter
  5: '~18 days',       // Venus
  6: '~13 months',     // Saturn
  7: '~7 months',      // Rahu
  8: '~7 months',      // Ketu
};

export interface SBCAnalysis {
  birthNakshatraId: number;
  transitVedhas: TransitVedha[];
  favorableDays: number[];        // weekday numbers
  unfavorableDays: number[];
  favorableNakshatras: number[];
  unfavorableNakshatras: number[];
  favorableTithis: number[];
  unfavorableTithis: number[];
  summary: string;
}

// --------------- constants ---------------

/** Benefic transit planet IDs: Moon(1), Mercury(3), Jupiter(4), Venus(5) */
const BENEFIC_PLANET_IDS = new Set([1, 3, 4, 5]);

// --------------- helpers ---------------

function collectAffected(cells: SBCCell[]): {
  nakshatras: number[];
  weekdays: number[];
  tithis: number[];
  vowels: string[];
} {
  const nakshatras: number[] = [];
  const weekdays: number[] = [];
  const tithis: number[] = [];
  const vowels: string[] = [];

  for (const c of cells) {
    switch (c.type) {
      case 'nakshatra':
        if (c.nakshatraId != null && !nakshatras.includes(c.nakshatraId)) {
          nakshatras.push(c.nakshatraId);
        }
        break;
      case 'weekday':
        if (c.weekdayNum != null && !weekdays.includes(c.weekdayNum)) {
          weekdays.push(c.weekdayNum);
        }
        break;
      case 'tithi':
        if (c.tithiNum != null && !tithis.includes(c.tithiNum)) {
          tithis.push(c.tithiNum);
        }
        break;
      case 'vowel':
        if (!vowels.includes(c.value)) {
          vowels.push(c.value);
        }
        break;
    }
  }

  return { nakshatras, weekdays, tithis, vowels };
}

// --------------- core vedha computation ---------------

/**
 * Compute all vedha lines from a given cell position in the 9x9 grid.
 * Returns cells on the same row, column, NE diagonal, and NW diagonal
 * (excluding the source cell itself).
 */
export function computeVedha(
  sourcePos: { row: number; col: number },
  grid: SBCCell[][] = SBC_GRID,
): VedhaLine[] {
  const { row: sr, col: sc } = sourcePos;
  const lines: VedhaLine[] = [];

  // --- same row ---
  const rowCells = grid[sr].filter((_, c) => c !== sc);
  const rowAffected = collectAffected(rowCells);
  lines.push({
    direction: 'row',
    affectedCells: rowCells.map(c => ({ row: c.row, col: c.col })),
    affectedNakshatras: rowAffected.nakshatras,
    affectedWeekdays: rowAffected.weekdays,
    affectedTithis: rowAffected.tithis,
    affectedVowels: rowAffected.vowels,
  });

  // --- same column ---
  const colCells: SBCCell[] = [];
  for (let r = 0; r < 9; r++) {
    if (r !== sr) colCells.push(grid[r][sc]);
  }
  const colAffected = collectAffected(colCells);
  lines.push({
    direction: 'column',
    affectedCells: colCells.map(c => ({ row: c.row, col: c.col })),
    affectedNakshatras: colAffected.nakshatras,
    affectedWeekdays: colAffected.weekdays,
    affectedTithis: colAffected.tithis,
    affectedVowels: colAffected.vowels,
  });

  // --- NE-SW diagonal (row decreases as col increases) ---
  const neCells: SBCCell[] = [];
  // walk NE
  for (let r = sr - 1, c = sc + 1; r >= 0 && c < 9; r--, c++) {
    neCells.push(grid[r][c]);
  }
  // walk SW
  for (let r = sr + 1, c = sc - 1; r < 9 && c >= 0; r++, c--) {
    neCells.push(grid[r][c]);
  }
  const neAffected = collectAffected(neCells);
  lines.push({
    direction: 'diagonal-ne',
    affectedCells: neCells.map(c => ({ row: c.row, col: c.col })),
    affectedNakshatras: neAffected.nakshatras,
    affectedWeekdays: neAffected.weekdays,
    affectedTithis: neAffected.tithis,
    affectedVowels: neAffected.vowels,
  });

  // --- NW-SE diagonal (row decreases as col decreases) ---
  const nwCells: SBCCell[] = [];
  // walk NW
  for (let r = sr - 1, c = sc - 1; r >= 0 && c >= 0; r--, c--) {
    nwCells.push(grid[r][c]);
  }
  // walk SE
  for (let r = sr + 1, c = sc + 1; r < 9 && c < 9; r++, c++) {
    nwCells.push(grid[r][c]);
  }
  const nwAffected = collectAffected(nwCells);
  lines.push({
    direction: 'diagonal-nw',
    affectedCells: nwCells.map(c => ({ row: c.row, col: c.col })),
    affectedNakshatras: nwAffected.nakshatras,
    affectedWeekdays: nwAffected.weekdays,
    affectedTithis: nwAffected.tithis,
    affectedVowels: nwAffected.vowels,
  });

  return lines;
}

/**
 * Full Sarvatobhadra Chakra analysis.
 *
 * @param birthNakshatraId  The birth nakshatra (1-27)
 * @param transits          Current planetary positions as nakshatra IDs
 * @returns                 Complete SBC analysis with favorable/unfavorable breakdowns
 */
export function analyzeSarvatobhadra(
  birthNakshatraId: number,
  transits: { planetId: number; nakshatraId: number }[],
): SBCAnalysis {
  const transitVedhas: TransitVedha[] = [];

  // Sets for accumulating favorable/unfavorable items
  const favorableDaysSet = new Set<number>();
  const unfavorableDaysSet = new Set<number>();
  const favorableNaksSet = new Set<number>();
  const unfavorableNaksSet = new Set<number>();
  const favorableTithiSet = new Set<number>();
  const unfavorableTithiSet = new Set<number>();

  // Birth nakshatra positions — we check if vedha lines cross these
  const birthPositions = NAKSHATRA_POSITIONS.get(birthNakshatraId) ?? [];

  for (const transit of transits) {
    const positions = NAKSHATRA_POSITIONS.get(transit.nakshatraId);
    if (!positions || positions.length === 0) continue;

    const planet = GRAHAS.find(g => g.id === transit.planetId);
    const nakshatra =
      transit.nakshatraId === 28
        ? { name: { en: 'Abhijit', hi: 'अभिजित्', sa: 'अभिजित्' } as LocaleText }
        : NAKSHATRAS.find(n => n.id === transit.nakshatraId);

    if (!planet || !nakshatra) continue;

    const isBenefic = BENEFIC_PLANET_IDS.has(transit.planetId);

    // Compute vedha from each position of this nakshatra in the grid
    // (some nakshatras appear in multiple cells due to classical symmetry)
    const allVedhaLines: VedhaLine[] = [];
    for (const pos of positions) {
      const lines = computeVedha(pos);
      allVedhaLines.push(...lines);
    }

    // Deduplicate vedha lines by direction (merge affected items)
    const mergedByDir = new Map<string, VedhaLine>();
    for (const line of allVedhaLines) {
      const existing = mergedByDir.get(line.direction);
      if (!existing) {
        mergedByDir.set(line.direction, { ...line });
      } else {
        // Merge affected cells and items
        for (const cell of line.affectedCells) {
          if (!existing.affectedCells.some(c => c.row === cell.row && c.col === cell.col)) {
            existing.affectedCells.push(cell);
          }
        }
        for (const n of line.affectedNakshatras) {
          if (!existing.affectedNakshatras.includes(n)) existing.affectedNakshatras.push(n);
        }
        for (const w of line.affectedWeekdays) {
          if (!existing.affectedWeekdays.includes(w)) existing.affectedWeekdays.push(w);
        }
        for (const t of line.affectedTithis) {
          if (!existing.affectedTithis.includes(t)) existing.affectedTithis.push(t);
        }
        for (const v of line.affectedVowels) {
          if (!existing.affectedVowels.includes(v)) existing.affectedVowels.push(v);
        }
      }
    }

    const vedhaLines = Array.from(mergedByDir.values());

    transitVedhas.push({
      planetId: transit.planetId,
      planetName: planet.name,
      nakshatraId: transit.nakshatraId,
      nakshatraName: nakshatra.name,
      isBenefic,
      vedhaLines,
      transitDuration: TRANSIT_DURATIONS[transit.planetId] ?? '~unknown',
    });

    // Check if the birth nakshatra is affected by this transit's vedha
    const birthIsAffected = vedhaLines.some(line =>
      line.affectedNakshatras.includes(birthNakshatraId),
    );

    // Classical SBC rule (per-planet): if ANY of this planet's vedha lines
    // passes through the birth nakshatra, the planet has vedha on the native.
    // All weekdays/tithis/nakshatras in ANY of this planet's lines are then
    // classified as favorable (benefic) or unfavorable (malefic).
    //
    // Note: with many planets having vedha, all 7 weekdays CAN be unfavorable
    // — this is a valid classical outcome. The UI should show which planets
    // cause each classification so the user can weight by transit duration
    // (Saturn vedha lasting 13 months matters far more than Moon vedha lasting 1 day).
    if (birthIsAffected) {
      for (const line of vedhaLines) {
        const dayTarget = isBenefic ? favorableDaysSet : unfavorableDaysSet;
        const nakTarget = isBenefic ? favorableNaksSet : unfavorableNaksSet;
        const tithiTarget = isBenefic ? favorableTithiSet : unfavorableTithiSet;

        for (const d of line.affectedWeekdays) dayTarget.add(d);
        for (const t of line.affectedTithis) tithiTarget.add(t);
        for (const n of line.affectedNakshatras) nakTarget.add(n);
      }
    }
  }

  // Resolve conflicts: if a day appears in both sets, the malefic overrides
  for (const d of unfavorableDaysSet) favorableDaysSet.delete(d);
  for (const n of unfavorableNaksSet) favorableNaksSet.delete(n);
  for (const t of unfavorableTithiSet) favorableTithiSet.delete(t);

  // Build summary
  const beneficCount = transitVedhas.filter(v => v.isBenefic).length;
  const maleficCount = transitVedhas.filter(v => !v.isBenefic).length;

  // Check if birth nakshatra is directly struck
  const birthStruckBy = transitVedhas.filter(v =>
    v.vedhaLines.some(l => l.affectedNakshatras.includes(birthNakshatraId)),
  );
  const birthBeneficStrikes = birthStruckBy.filter(v => v.isBenefic).length;
  const birthMaleficStrikes = birthStruckBy.filter(v => !v.isBenefic).length;

  // Identify which planets cause vedha (with names for the summary)
  const beneficStrikers = birthStruckBy.filter(v => v.isBenefic).map(v => `${v.planetName.en} (${TRANSIT_DURATIONS[v.planetId]})`);
  const maleficStrikers = birthStruckBy.filter(v => !v.isBenefic).map(v => `${v.planetName.en} (${TRANSIT_DURATIONS[v.planetId]})`);

  let summary: string;
  if (transitVedhas.length === 0) {
    summary = 'No transits provided for analysis.';
  } else if (birthStruckBy.length === 0) {
    summary = `No transit planet currently has vedha on your birth nakshatra. This is a neutral period — the current planetary positions do not directly affect you through the SBC grid.`;
  } else if (birthMaleficStrikes === 0 && birthBeneficStrikes > 0) {
    summary = `Birth nakshatra receives ${birthBeneficStrikes} benefic vedha from: ${beneficStrikers.join(', ')}. Overall favorable period — positive influences dominate.`;
  } else if (birthMaleficStrikes > 0 && birthBeneficStrikes === 0) {
    summary = `Birth nakshatra receives ${birthMaleficStrikes} malefic vedha from: ${maleficStrikers.join(', ')}. Caution advised — slow-transit planets (Saturn, Rahu) carry more weight than fast ones (Sun).`;
  } else {
    summary = `Mixed vedha on birth nakshatra: ${birthBeneficStrikes} benefic (${beneficStrikers.join(', ')}) and ${birthMaleficStrikes} malefic (${maleficStrikers.join(', ')}). Slow planets (Jupiter ~13mo, Saturn ~13mo) outweigh fast planets (Moon ~1d, Sun ~13d) in practical impact.`;
  }

  return {
    birthNakshatraId,
    transitVedhas,
    favorableDays: Array.from(favorableDaysSet).sort((a, b) => a - b),
    unfavorableDays: Array.from(unfavorableDaysSet).sort((a, b) => a - b),
    favorableNakshatras: Array.from(favorableNaksSet).sort((a, b) => a - b),
    unfavorableNakshatras: Array.from(unfavorableNaksSet).sort((a, b) => a - b),
    favorableTithis: Array.from(favorableTithiSet).sort((a, b) => a - b),
    unfavorableTithis: Array.from(unfavorableTithiSet).sort((a, b) => a - b),
    summary,
  };
}
