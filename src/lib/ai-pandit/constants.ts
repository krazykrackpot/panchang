/**
 * AI Pandit — Module-local Constants
 *
 * Shared lookups used across context-builder, narrative-scanner, and
 * tradition-guardrails. Defined ONCE to prevent drift (CLAUDE.md Lesson Q).
 *
 * BPHS canonical values imported from @/lib/constants/dignities for dignities.
 * Friendship tables imported from the synthesiser pattern (CLAUDE.md Lesson S).
 */

/** Maps English planet name (as in DashaEntry.planet, ShadBala.planet) to planet ID. */
export const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
  // Lowercase for scanner matching
  sun: 0, moon: 1, mars: 2, mercury: 3, jupiter: 4,
  venus: 5, saturn: 6, rahu: 7, ketu: 8,
  // Hindi for scanner matching
  'सूर्य': 0, 'चन्द्र': 1, 'चंद्र': 1, 'मंगल': 2, 'बुध': 3,
  'बृहस्पति': 4, 'गुरु': 4, 'शुक्र': 5, 'शनि': 6,
  'राहु': 7, 'केतु': 8,
};

/** BPHS minimum required Shadbala in Shashtiamsas per planet. */
export const SHADBALA_MIN_REQUIRED: Record<number, number> = {
  0: 390, 1: 360, 2: 300, 3: 420, 4: 390, 5: 330, 6: 300,
};

/**
 * Natural friendships (simplified, BPHS Ch.3).
 * Imported pattern from domain-synthesis/synthesizer.ts — canonical values
 * verified Apr 2026 per CLAUDE.md Lesson S.
 */
export const FRIENDS: Record<number, Set<number>> = {
  0: new Set([1, 2, 4]),        // Sun: Moon, Mars, Jupiter
  1: new Set([0, 3]),            // Moon: Sun, Mercury
  2: new Set([0, 1, 4]),        // Mars: Sun, Moon, Jupiter
  3: new Set([0, 5]),            // Mercury: Sun, Venus
  4: new Set([0, 1, 2]),        // Jupiter: Sun, Moon, Mars
  5: new Set([3, 6]),            // Venus: Mercury, Saturn
  6: new Set([3, 5]),            // Saturn: Mercury, Venus
  7: new Set([]),
  8: new Set([]),
};

export const ENEMIES: Record<number, Set<number>> = {
  0: new Set([5, 6]),            // Sun: Venus, Saturn
  1: new Set([]),                // Moon: none
  2: new Set([3]),               // Mars: Mercury
  3: new Set([1]),               // Mercury: Moon
  4: new Set([3, 5]),            // Jupiter: Mercury, Venus
  5: new Set([0, 1]),            // Venus: Sun, Moon
  6: new Set([0, 1, 2]),        // Saturn: Sun, Moon, Mars
  7: new Set([0, 1]),
  8: new Set([1]),
};
