/**
 * Graha Drishti (Planetary Aspects)
 *
 * Computes the set of houses that a planet aspects (Sanskrit: drishti,
 * "looks upon") from its current placement.
 *
 * Every graha aspects the 7th house from itself (the opposite house)
 * with full strength. Mars, Jupiter, Saturn, Rahu, and Ketu have
 * additional special aspects per BPHS Ch.3:
 *
 *   Mars (Mangala):    +4th, +8th
 *   Jupiter (Guru):    +5th, +9th
 *   Saturn (Shani):    +3rd, +10th
 *   Rahu / Ketu:       +5th, +9th  (per BPHS — Tajika and other schools
 *                                   disagree; see SPECIAL_ASPECTS comment)
 *
 * Sun, Moon, Mercury, Venus have no special aspects beyond the 7th.
 *
 * Aspect counting is **inclusive of the planet's own house as 1**:
 *   Saturn in house 11 with 3rd aspect → houses 11, 12, 1 → 1.
 *   Indexing wraps mod 12 so house 13 → 1, house 0 → 12.
 *
 * Spec: `docs/design/drishti-overlay-spec.md` §3 + §6.1.
 *
 * Planet IDs (project convention):
 *   0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus,
 *   6=Saturn, 7=Rahu, 8=Ketu.
 */

/**
 * Special aspect offsets beyond the universal 7th. Map of planet ID → list
 * of offsets, where each offset is the n-th house counted from the planet's
 * own house (with the own house = 1).
 *
 * Rahu / Ketu aspects are encoded per BPHS Ch.3 (5th and 9th, mirroring
 * Jupiter's specials). Tajika sources and some modern Parashari astrologers
 * disagree — they either grant Rahu/Ketu no aspect, or use the aspects of
 * the sign-lord under which Rahu/Ketu sits. If a future user preference
 * needs to override the school, expose this table as a configurable input.
 */
const SPECIAL_ASPECTS: Record<number, readonly number[]> = {
  2: [4, 8],    // Mars
  4: [5, 9],    // Jupiter
  6: [3, 10],   // Saturn
  7: [5, 9],    // Rahu (per BPHS)
  8: [5, 9],    // Ketu
};

/**
 * Returns the houses (1–12) that the planet aspects from its given
 * placement. The list always includes the 7th-house aspect; special
 * aspects are appended for planets that have them.
 *
 * Throws RangeError when `planetHouse` is outside 1–12 — caller bug.
 * Unknown planet IDs are treated as "no specials" (returns just the 7th
 * aspect), which is safe for planets without entries in SPECIAL_ASPECTS
 * (Sun, Moon, Mercury, Venus).
 */
export function getPlanetAspects(
  planetId: number,
  planetHouse: number,
): number[] {
  if (!Number.isInteger(planetHouse) || planetHouse < 1 || planetHouse > 12) {
    throw new RangeError(`planetHouse must be 1–12, received ${planetHouse}`);
  }
  const offsets = [7, ...(SPECIAL_ASPECTS[planetId] ?? [])];
  return offsets.map(n => wrapHouse(planetHouse + n - 1));
}

/**
 * Wraps a 0-based house counter back into the 1–12 range. The aspect
 * formula `planetHouse + n - 1` lands in 1..23; this folds 13..23 back
 * to 1..11.
 */
function wrapHouse(h: number): number {
  return ((h - 1) % 12) + 1;
}
