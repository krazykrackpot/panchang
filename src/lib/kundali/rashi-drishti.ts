/**
 * Rashi Drishti (Jaimini Sign Aspects)
 *
 * Jaimini's sign-based aspects differ from Graha Drishti (planet aspects):
 * - Movable signs (1,4,7,10) aspect all Fixed signs EXCEPT the adjacent one
 * - Fixed signs (2,5,8,11) aspect all Movable signs EXCEPT the adjacent one
 * - Dual signs (3,6,9,12) aspect all other Dual signs
 *
 * Reference: Jaimini Sutras, Upadesa Sutras
 */

import type { LocaleText } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';

export interface RashiDrishtiResult {
  sign: number;           // 1-12
  signName: LocaleText;
  quality: 'movable' | 'fixed' | 'dual';
  aspects: number[];      // signs this sign aspects (1-12)
  aspectedBy: number[];   // signs that aspect this sign (1-12)
}

const MOVABLE = new Set([1, 4, 7, 10]);
const FIXED = new Set([2, 5, 8, 11]);
const DUAL = new Set([3, 6, 9, 12]);

/**
 * Determine the Jaimini quality category of a sign.
 */
function getSignQuality(sign: number): 'movable' | 'fixed' | 'dual' {
  if (MOVABLE.has(sign)) return 'movable';
  if (FIXED.has(sign)) return 'fixed';
  return 'dual';
}

/**
 * Check if two signs are adjacent (next to each other in the zodiac).
 * Adjacent means exactly 1 sign apart (mod 12).
 */
function isAdjacent(a: number, b: number): boolean {
  const diff = Math.abs(a - b);
  return diff === 1 || diff === 11;
}

/**
 * Get which signs a given sign aspects per Jaimini Rashi Drishti rules.
 *
 * @param sign 1-based sign id (1=Aries ... 12=Pisces)
 * @returns Array of 1-based sign ids that this sign aspects
 */
export function getSignAspects(sign: number): number[] {
  const quality = getSignQuality(sign);
  const aspects: number[] = [];

  if (quality === 'movable') {
    // Aspects all Fixed signs except the adjacent one
    for (const fixed of FIXED) {
      if (!isAdjacent(sign, fixed)) {
        aspects.push(fixed);
      }
    }
  } else if (quality === 'fixed') {
    // Aspects all Movable signs except the adjacent one
    for (const movable of MOVABLE) {
      if (!isAdjacent(sign, movable)) {
        aspects.push(movable);
      }
    }
  } else {
    // Dual: aspects all other Dual signs
    for (const dual of DUAL) {
      if (dual !== sign) {
        aspects.push(dual);
      }
    }
  }

  return aspects.sort((a, b) => a - b);
}

/**
 * Compute Rashi Drishti for all 12 signs.
 * Returns aspects (forward) and aspectedBy (reverse lookup) for each sign.
 */
export function computeRashiDrishti(): RashiDrishtiResult[] {
  // First pass: compute aspects for each sign
  const aspectsMap = new Map<number, number[]>();
  for (let s = 1; s <= 12; s++) {
    aspectsMap.set(s, getSignAspects(s));
  }

  // Second pass: compute aspectedBy (reverse lookup)
  const aspectedByMap = new Map<number, number[]>();
  for (let s = 1; s <= 12; s++) {
    aspectedByMap.set(s, []);
  }
  for (let s = 1; s <= 12; s++) {
    const targets = aspectsMap.get(s)!;
    for (const t of targets) {
      aspectedByMap.get(t)!.push(s);
    }
  }

  // Build results
  return RASHIS.map((rashi) => {
    const sign = rashi.id;
    return {
      sign,
      signName: rashi.name,
      quality: getSignQuality(sign),
      aspects: aspectsMap.get(sign)!,
      aspectedBy: aspectedByMap.get(sign)!.sort((a, b) => a - b),
    };
  });
}
