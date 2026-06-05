/**
 * Canonical natural-friendship table (Naisargika Maitri).
 *
 * Source: BPHS Ch.3 + Uttara Kalamrita Ch.3. Values cross-checked against
 * Lahiri's Indian Ephemeris and standard Parashari texts.
 *
 * Planet IDs follow the project convention (0-based):
 *   0 = Sun, 1 = Moon, 2 = Mars, 3 = Mercury, 4 = Jupiter,
 *   5 = Venus, 6 = Saturn, 7 = Rahu, 8 = Ketu
 *
 * Rahu mirrors Saturn (same friends/enemies/neutral set), Ketu mirrors
 * Mars — a Parashari convention used by both gemstone selection and
 * dignity scoring.
 *
 * P2-33 (Sprint 15) — replaces three previously-divergent definitions in:
 *   - src/lib/remedies/gemstone-data.ts (PLANET_FRIENDSHIPS)
 *   - src/lib/tippanni/dignity.ts (NATURAL_FRIENDSHIP)
 *   - src/lib/kundali/panchavargeya-bala.ts (FRIENDSHIP_MAP)
 * panchavargeya had Rahu→Saturn miscoded as `friend` and Ketu→Mars
 * miscoded as `friend` (it mirrored the host planet *as itself*, not the
 * host's friend list). Fixed by re-routing all three consumers through
 * this file. Lesson Q (canonical constants).
 */

export interface PlanetFriendshipEntry {
  friends: number[];
  enemies: number[];
  neutral: number[];
}

export const PLANET_FRIENDSHIPS: Record<number, PlanetFriendshipEntry> = {
  0: { friends: [1, 2, 4], enemies: [5, 6], neutral: [3] },         // Sun
  1: { friends: [0, 3], enemies: [], neutral: [2, 4, 5, 6] },       // Moon (no natural enemies — BPHS)
  2: { friends: [0, 1, 4], enemies: [3], neutral: [5, 6] },         // Mars
  3: { friends: [0, 5], enemies: [1], neutral: [2, 4, 6] },         // Mercury
  4: { friends: [0, 1, 2], enemies: [3, 5], neutral: [6] },         // Jupiter (Saturn is NEUTRAL, not enemy)
  5: { friends: [3, 6], enemies: [0, 1], neutral: [2, 4] },         // Venus
  6: { friends: [3, 5], enemies: [0, 1, 2], neutral: [4] },         // Saturn
  7: { friends: [3, 5], enemies: [0, 1, 2], neutral: [4] },         // Rahu (mirrors Saturn)
  8: { friends: [0, 1, 4], enemies: [3], neutral: [5, 6] },         // Ketu (mirrors Mars)
};

/**
 * Compatibility alias preserved for `src/lib/tippanni/dignity.ts` consumers
 * that historically referenced `NATURAL_FRIENDSHIP`. New code should import
 * `PLANET_FRIENDSHIPS` directly.
 */
export const NATURAL_FRIENDSHIP = PLANET_FRIENDSHIPS;

/**
 * Returns the canonical friend / enemy Set<number> for a planet ID. Convenience
 * helper for consumers (avasthas, vimshopaka, domain-synthesis) that historically
 * kept their own `Set<number>` copies of these tables. Closes Round 2 audit
 * COMP-1 / COMP-5 (Lesson Q — single source of truth).
 */
export function friendsAsSet(planetId: number): Set<number> {
  return new Set(PLANET_FRIENDSHIPS[planetId]?.friends ?? []);
}

export function enemiesAsSet(planetId: number): Set<number> {
  return new Set(PLANET_FRIENDSHIPS[planetId]?.enemies ?? []);
}

/**
 * English planet names indexed by ID — used to derive the name-keyed views
 * below. Kept local rather than imported from GRAHAS to avoid a circular
 * import (GRAHAS is in @/lib/constants/grahas which sometimes imports
 * from here transitively).
 */
const PLANET_NAME_BY_ID: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter',
  5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

/**
 * Name-keyed views of the canonical friendship/enmity tables. Built once
 * at module load from PLANET_FRIENDSHIPS so name-based consumers (weekday
 * lord scoring in horoscope/daily-engine, dasha-sandhi intensity logic)
 * stay in lock-step with the ID-based tables. Keys: 'Sun', 'Moon',
 * 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'.
 */
export const FRIENDS_BY_NAME: Record<string, string[]> = Object.fromEntries(
  Object.entries(PLANET_FRIENDSHIPS).map(([id, entry]) => [
    PLANET_NAME_BY_ID[Number(id)],
    entry.friends.map((fid) => PLANET_NAME_BY_ID[fid]),
  ]),
);

export const ENEMIES_BY_NAME: Record<string, string[]> = Object.fromEntries(
  Object.entries(PLANET_FRIENDSHIPS).map(([id, entry]) => [
    PLANET_NAME_BY_ID[Number(id)],
    entry.enemies.map((eid) => PLANET_NAME_BY_ID[eid]),
  ]),
);

/**
 * Tatkalika (temporary) friend houses — planets that are 2/3/4/10/11/12
 * houses from the reference planet are tatkalika friends; everything else
 * is a tatkalika enemy. Used by dignity scoring (BPHS Ch.3).
 *
 * Audit P5a #24 — was inlined as a local `tempFriendHouses` array in
 * `src/lib/tippanni/dignity.ts:149`; now imported from this canonical
 * file so any future revision lands in one place.
 */
export const TATKALIKA_FRIEND_HOUSES: readonly number[] = [2, 3, 4, 10, 11, 12];
