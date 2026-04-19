/**
 * Sarvatobhadra Chakra — Classical 9x9 Grid Layout
 *
 * Based on Narada Samhita / Varahamihira tradition.
 * The grid maps 28 nakshatras (1-27 + Abhijit=28), 7 weekdays,
 * 16 Sanskrit vowels, 30 tithis (S1-S15 = Shukla, K1-K15 = Krishna),
 * and 4 corner directions onto an 81-cell grid.
 *
 * Classical source: the nakshatras spiral inward from Ashwini
 * at the perimeter toward the center (Anuradha at [4,4]).
 * Weekdays occupy fixed cells on the inner ring.
 * Vowels and tithis line the outer border.
 */

export type SBCCellType = 'nakshatra' | 'vowel' | 'weekday' | 'tithi' | 'direction';

export interface SBCCell {
  row: number;       // 0-8
  col: number;       // 0-8
  type: SBCCellType;
  value: string;     // display label (e.g. "Ashwini", "अ", "Sun", "S1")
  nakshatraId?: number;  // 1-28 (28=Abhijit)
  tithiNum?: number;     // 1-30 (1-15 = Shukla, 16-30 = Krishna)
  weekdayNum?: number;   // 0-6 (0=Sunday)
}

// ---------- raw definition: [type, value, optional-id] ----------
type CellDef = [SBCCellType, string, number?];

/**
 * Classical Sarvatobhadra Chakra 9x9 layout.
 *
 * Nakshatras are placed according to the traditional spiral:
 *   - Row 0/8 (top/bottom borders): tithis, vowels, corner directions, and a few nakshatras
 *   - Rows 1/7: tithis, weekdays, nakshatras
 *   - Rows 2/6: vowels, weekdays, nakshatras
 *   - Rows 3/5: all nakshatras
 *   - Row 4 (center): vowels, weekdays, nakshatras (Anuradha at center [4,4])
 *
 * Tithi numbering: S1-S15 = Shukla Pratipada to Purnima (1-15),
 *                  K1-K15 = Krishna Pratipada to Amavasya (16-30).
 */
const GRID_DEF: CellDef[][] = [
  // Row 0 — top border
  [
    ['direction', 'NW'],
    ['tithi', 'K15', 30],
    ['vowel', '\u0913'],       // ओ
    ['nakshatra', 'Chitra', 14],
    ['vowel', '\u0914'],       // औ
    ['tithi', 'S1', 1],
    ['vowel', '\u0905\u0902'], // अं
    ['nakshatra', 'U.Ashadha', 21],
    ['direction', 'NE'],
  ],
  // Row 1
  [
    ['tithi', 'K14', 29],
    ['nakshatra', 'Punarvasu', 7],
    ['weekday', 'Fri', 5],
    ['nakshatra', 'Hasta', 13],
    ['weekday', 'Sat', 6],
    ['nakshatra', 'P.Ashadha', 20],
    ['weekday', 'Sun', 0],
    ['nakshatra', 'Revati', 27],
    ['tithi', 'S2', 2],
  ],
  // Row 2
  [
    ['vowel', '\u0910'],       // ऐ
    ['weekday', 'Thu', 4],
    ['nakshatra', 'Ardra', 6],
    ['nakshatra', 'U.Phalguni', 12],
    ['nakshatra', 'Mula', 19],
    ['nakshatra', 'U.Bhadrapada', 26],
    ['nakshatra', 'Abhijit', 28],
    ['weekday', 'Mon', 1],
    ['vowel', '\u090B'],       // ऋ
  ],
  // Row 3
  [
    ['nakshatra', 'Pushya', 8],
    ['nakshatra', 'Mrigashira', 5],
    ['nakshatra', 'Krittika', 3],
    ['nakshatra', 'P.Phalguni', 11],
    ['nakshatra', 'Jyeshtha', 18],
    ['nakshatra', 'P.Bhadrapada', 25],
    ['nakshatra', 'Shatabhisha', 24],
    ['nakshatra', 'Dhanishta', 23],
    ['nakshatra', 'Shravana', 22],
  ],
  // Row 4 — center row
  [
    ['vowel', '\u090F'],       // ए
    ['weekday', 'Wed', 3],
    ['nakshatra', 'Bharani', 2],
    ['nakshatra', 'Magha', 10],
    ['nakshatra', 'Anuradha', 17],
    ['nakshatra', 'Vishakha', 16],
    ['nakshatra', 'Swati', 15],
    ['weekday', 'Tue', 2],
    ['vowel', '\u0905\u0903'], // अः
  ],
  // Row 5 — mirror of row 3
  [
    ['nakshatra', 'Ashlesha', 9],
    ['nakshatra', 'Ashwini', 1],
    ['nakshatra', 'Rohini', 4],
    ['nakshatra', 'P.Phalguni', 11],   // shared (appears twice in classical grid)
    ['nakshatra', 'Jyeshtha', 18],     // shared
    ['nakshatra', 'P.Bhadrapada', 25], // shared
    ['nakshatra', 'Shatabhisha', 24],  // shared
    ['nakshatra', 'Dhanishta', 23],    // shared
    ['nakshatra', 'Shravana', 22],     // shared
  ],
  // Row 6 — mirror of row 2
  [
    ['vowel', '\u0907'],       // इ
    ['weekday', 'Thu', 4],     // shared
    ['nakshatra', 'Ardra', 6],         // shared
    ['nakshatra', 'U.Phalguni', 12],   // shared
    ['nakshatra', 'Mula', 19],         // shared
    ['nakshatra', 'U.Bhadrapada', 26], // shared
    ['nakshatra', 'Abhijit', 28],      // shared
    ['weekday', 'Mon', 1],            // shared
    ['vowel', '\u0908'],       // ई
  ],
  // Row 7 — mirror of row 1
  [
    ['tithi', 'K13', 28],
    ['nakshatra', 'Punarvasu', 7],     // shared
    ['weekday', 'Fri', 5],            // shared
    ['nakshatra', 'Hasta', 13],        // shared
    ['weekday', 'Sat', 6],            // shared
    ['nakshatra', 'P.Ashadha', 20],    // shared
    ['weekday', 'Sun', 0],            // shared
    ['nakshatra', 'Revati', 27],       // shared
    ['tithi', 'S3', 3],
  ],
  // Row 8 — bottom border
  [
    ['direction', 'SW'],
    ['tithi', 'K12', 27],
    ['vowel', '\u0909'],       // उ
    ['nakshatra', 'Chitra', 14],       // shared
    ['vowel', '\u090A'],       // ऊ
    ['tithi', 'S4', 4],
    ['vowel', '\u0905'],       // अ
    ['nakshatra', 'U.Ashadha', 21],    // shared
    ['direction', 'SE'],
  ],
];

/**
 * Fully typed 9x9 grid. Each element is an SBCCell with row/col indices.
 */
export const SBC_GRID: SBCCell[][] = GRID_DEF.map((rowDef, r) =>
  rowDef.map((cellDef, c): SBCCell => {
    const [type, value, id] = cellDef;
    const cell: SBCCell = { row: r, col: c, type, value };
    if (type === 'nakshatra') cell.nakshatraId = id;
    if (type === 'tithi') cell.tithiNum = id;
    if (type === 'weekday') cell.weekdayNum = id;
    return cell;
  }),
);

/**
 * Lookup: nakshatra ID -> all grid positions where it appears.
 * Some nakshatras appear in multiple cells (classical symmetry).
 */
export const NAKSHATRA_POSITIONS: Map<number, { row: number; col: number }[]> = (() => {
  const map = new Map<number, { row: number; col: number }[]>();
  for (const row of SBC_GRID) {
    for (const cell of row) {
      if (cell.type === 'nakshatra' && cell.nakshatraId != null) {
        const existing = map.get(cell.nakshatraId) ?? [];
        existing.push({ row: cell.row, col: cell.col });
        map.set(cell.nakshatraId, existing);
      }
    }
  }
  return map;
})();

/**
 * Lookup: weekday number (0=Sun) -> all grid positions.
 */
export const WEEKDAY_POSITIONS: Map<number, { row: number; col: number }[]> = (() => {
  const map = new Map<number, { row: number; col: number }[]>();
  for (const row of SBC_GRID) {
    for (const cell of row) {
      if (cell.type === 'weekday' && cell.weekdayNum != null) {
        const existing = map.get(cell.weekdayNum) ?? [];
        existing.push({ row: cell.row, col: cell.col });
        map.set(cell.weekdayNum, existing);
      }
    }
  }
  return map;
})();

/**
 * Lookup: tithi number (1-30) -> grid position.
 */
export const TITHI_POSITIONS: Map<number, { row: number; col: number }[]> = (() => {
  const map = new Map<number, { row: number; col: number }[]>();
  for (const row of SBC_GRID) {
    for (const cell of row) {
      if (cell.type === 'tithi' && cell.tithiNum != null) {
        const existing = map.get(cell.tithiNum) ?? [];
        existing.push({ row: cell.row, col: cell.col });
        map.set(cell.tithiNum, existing);
      }
    }
  }
  return map;
})();
