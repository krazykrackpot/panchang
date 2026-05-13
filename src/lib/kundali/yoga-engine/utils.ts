/**
 * Shared utility functions for yoga engine rule files.
 *
 * Centralises helpers that were previously duplicated across
 * chandra.ts, surya.ts, and dhana.ts (Lesson Q: constants/helpers in one place).
 */

/**
 * Get the house that is N houses from a reference house.
 * Uses 1-based forward counting: offset 1 = same house, offset 2 = next house, etc.
 */
export function houseFrom(refHouse: number, offset: number): number {
  return ((refHouse - 1 + offset - 1) % 12) + 1;
}
