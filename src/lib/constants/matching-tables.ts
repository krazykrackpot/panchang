/**
 * Shared nakshatra-based matching tables — used by both ashta-kuta.ts and dasha-koota.ts.
 * Single source of truth (Lesson Q/S: constants must live in ONE file).
 *
 * All arrays are 27-element, 0-indexed by (nakshatra_id - 1).
 */

// Gana: 0=Deva, 1=Manushya, 2=Rakshasa
// Classical grouping per BPHS matching rules:
//   Deva: Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, Revati
//   Manushya: Bharani, Rohini, Ardra, P.Phalguni, U.Phalguni, P.Ashadha, U.Ashadha, P.Bhadrapada, U.Bhadrapada
//   Rakshasa: Krittika, Ashlesha, Magha, Chitra, Vishakha, Jyeshtha, Mula, Dhanishtha, Shatabhisha
export const NAKSHATRA_GANA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0] as const;

// Yoni animal type (0-13), one per nakshatra
// 0=Horse, 1=Elephant, 2=Sheep, 3=Serpent, 4=Dog, 5=Cat, 6=Rat, 7=Cow,
// 8=Buffalo, 9=Tiger, 10=Deer, 11=Monkey, 12=Mongoose, 13=Lion
export const NAKSHATRA_YONI = [0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1] as const;

export const YONI_LABELS = ['Horse', 'Elephant', 'Sheep', 'Serpent', 'Dog', 'Cat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Deer', 'Monkey', 'Mongoose', 'Lion'] as const;

// 7 classical enemy pairs — each animal has exactly one sworn enemy
export const YONI_ENEMIES: readonly [number, number][] = [
  [0, 8],  // Horse-Buffalo
  [1, 13], // Elephant-Lion
  [3, 12], // Snake-Mongoose
  [4, 10], // Dog-Deer
  [5, 6],  // Cat-Rat
  [7, 9],  // Cow-Tiger
  [11, 2], // Monkey-Sheep
];
