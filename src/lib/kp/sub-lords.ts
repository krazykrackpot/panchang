/**
 * KP Sub-Lord Boundary Table
 *
 * Pre-computes the sub-lord boundary table across the 360-degree zodiac
 * (27 nakshatras x 9 star-lord portions x 9 sub-lord portions = 2187 entries).
 * Each of 27 nakshatras (13deg 20min = 13.3333deg) is divided into 9
 * star-lord portions proportional to Vimshottari dasha years, and each
 * of those is further subdivided into 9 sub-lord portions by the same
 * proportional ratios.
 *
 * The nakshatra lord sequence (repeating every 9):
 *   Ketu(7), Venus(20), Sun(6), Moon(10), Mars(7),
 *   Rahu(18), Jupiter(16), Saturn(19), Mercury(17)
 * Total = 120 years.
 */

import { GRAHAS } from '@/lib/constants/grahas';
import type { Trilingual } from '@/types/panchang';
import type { SubLordInfo } from '@/types/kp';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Vimshottari dasha years in nakshatra-lord order */
const VIMSHOTTARI_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // total 120

/** Planet IDs in nakshatra-lord order */
const NAKSHATRA_LORD_IDS = [8, 5, 0, 1, 2, 7, 4, 6, 3]; // Ke Ve Su Mo Ma Ra Ju Sa Me

const TOTAL_DASHA_YEARS = 120;
const NAKSHATRA_SPAN = 360 / 27; // 13.3333... degrees

/** Sign lord planet IDs indexed by sign number (1=Aries .. 12=Pisces) */
const SIGN_LORD_IDS: Record<number, number> = {
  1: 2,  // Aries    -> Mars
  2: 5,  // Taurus   -> Venus
  3: 3,  // Gemini   -> Mercury
  4: 1,  // Cancer   -> Moon
  5: 0,  // Leo      -> Sun
  6: 3,  // Virgo    -> Mercury
  7: 5,  // Libra    -> Venus
  8: 2,  // Scorpio  -> Mars
  9: 4,  // Sagittarius -> Jupiter
  10: 6, // Capricorn   -> Saturn
  11: 6, // Aquarius    -> Saturn
  12: 4, // Pisces      -> Jupiter
};

// ---------------------------------------------------------------------------
// Table entry type
// ---------------------------------------------------------------------------

export interface SubLordTableEntry {
  start: number;
  end: number;
  signLord: number;
  starLord: number;
  subLord: number;
}

// ---------------------------------------------------------------------------
// Build the sub-lord table at module load time
// ---------------------------------------------------------------------------

function buildSubLordTable(): SubLordTableEntry[] {
  const table: SubLordTableEntry[] = [];

  for (let nk = 0; nk < 27; nk++) {
    const nakshatraStart = nk * NAKSHATRA_SPAN;

    // The star-lord sequence for this nakshatra starts at offset = nk % 9
    // (because the lord sequence repeats every 9 nakshatras and the first
    // nakshatra's lord IS the first lord in the rotation for that cycle)
    const starLordOffset = nk % 9;

    let starCursor = nakshatraStart;

    for (let s = 0; s < 9; s++) {
      const starIdx = (starLordOffset + s) % 9;
      const starSpan = (VIMSHOTTARI_YEARS[starIdx] / TOTAL_DASHA_YEARS) * NAKSHATRA_SPAN;
      const starEnd = starCursor + starSpan;
      const starLordId = NAKSHATRA_LORD_IDS[starIdx];

      // Sub-lord divisions inside this star-lord portion
      let subCursor = starCursor;
      for (let u = 0; u < 9; u++) {
        const subIdx = (starIdx + u) % 9;
        const subSpan = (VIMSHOTTARI_YEARS[subIdx] / TOTAL_DASHA_YEARS) * starSpan;
        const subEnd = subCursor + subSpan;
        const subLordId = NAKSHATRA_LORD_IDS[subIdx];

        // Determine sign lord from degree
        const midDeg = (subCursor + subEnd) / 2;
        const signNum = Math.floor(midDeg / 30) + 1;
        const signLordId = SIGN_LORD_IDS[signNum] ?? 0;

        table.push({
          start: subCursor,
          end: subEnd,
          signLord: signLordId,
          starLord: starLordId,
          subLord: subLordId,
        });

        subCursor = subEnd;
      }

      starCursor = starEnd;
    }
  }

  return table;
}

/** Pre-computed sub-lord boundary table (2187 entries covering 360 degrees) */
export const SUB_LORD_TABLE: SubLordTableEntry[] = buildSubLordTable();

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

function grahaName(id: number): Trilingual {
  return GRAHAS[id]?.name ?? { en: '', hi: '', sa: '' };
}

/**
 * Look up the sign lord, star lord, and sub lord for any sidereal degree.
 * Uses binary search over the pre-computed boundary table.
 */
export function getSubLordForDegree(degree: number): SubLordInfo {
  // Normalise to [0, 360)
  const deg = ((degree % 360) + 360) % 360;

  // Binary search
  let lo = 0;
  let hi = SUB_LORD_TABLE.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const entry = SUB_LORD_TABLE[mid];

    if (deg < entry.start) {
      hi = mid - 1;
    } else if (deg >= entry.end) {
      lo = mid + 1;
    } else {
      // Found
      return {
        degree: deg,
        signLord: { id: entry.signLord, name: grahaName(entry.signLord) },
        starLord: { id: entry.starLord, name: grahaName(entry.starLord) },
        subLord: { id: entry.subLord, name: grahaName(entry.subLord) },
      };
    }
  }

  // Edge case: degree exactly 360 -> wrap to first entry
  const first = SUB_LORD_TABLE[0];
  return {
    degree: deg,
    signLord: { id: first.signLord, name: grahaName(first.signLord) },
    starLord: { id: first.starLord, name: grahaName(first.starLord) },
    subLord: { id: first.subLord, name: grahaName(first.subLord) },
  };
}
