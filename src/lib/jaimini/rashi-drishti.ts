// rashi-drishti.ts — Jaimini Rashi Drishti (Sign Aspect) System
// Source: Jaimini Sutras Ch. 1
//
// Rules (signs are 1-based):
// MOVABLE signs (1=Ar, 4=Ca, 7=Li, 10=Cp) aspect all FIXED signs
//   except the one immediately adjacent (next in zodiac order)
// FIXED signs (2=Ta, 5=Le, 8=Sc, 11=Aq) aspect all MOVABLE signs
//   except the one immediately adjacent
// DUAL signs (3=Ge, 6=Vi, 9=Sa, 12=Pi) aspect all other DUAL signs
//   except the one immediately adjacent

const MOVABLE = new Set([1, 4, 7, 10]);
const FIXED   = new Set([2, 5, 8, 11]);
const DUAL    = new Set([3, 6, 9, 12]);

function nextSign(sign: number): number {
  return (sign % 12) + 1;
}

// Returns the set of signs that `fromSign` aspects via rashi drishti
export function getRashiDrishti(fromSign: number): Set<number> {
  const aspects = new Set<number>();

  if (MOVABLE.has(fromSign)) {
    // Aspects all FIXED signs except the adjacent one
    FIXED.forEach(s => {
      if (s !== nextSign(fromSign)) aspects.add(s);
    });
  } else if (FIXED.has(fromSign)) {
    // Aspects all MOVABLE signs except the adjacent one (going backwards)
    // "Adjacent" here means the movable sign just behind it in the zodiac
    const prevMovable = fromSign === 1 ? 10 : [1,4,7,10].filter(m => m < fromSign).at(-1) ?? 1;
    MOVABLE.forEach(s => {
      if (s !== prevMovable) aspects.add(s);
    });
  } else if (DUAL.has(fromSign)) {
    // Aspects all DUAL signs except the adjacent one
    DUAL.forEach(s => {
      if (s !== fromSign && s !== nextSign(fromSign)) aspects.add(s);
    });
  }

  return aspects;
}

// Pre-compute: for all 12 signs, which signs do they aspect?
export const RASHI_DRISHTI_MAP: Map<number, Set<number>> = new Map(
  Array.from({ length: 12 }, (_, i) => i + 1).map(s => [s, getRashiDrishti(s)])
);

// Convenience: does sign A aspect sign B?
export function hasRashiDrishti(fromSign: number, toSign: number): boolean {
  return RASHI_DRISHTI_MAP.get(fromSign)?.has(toSign) ?? false;
}

// Returns all pairs of signs in mutual aspect (both aspect each other)
export function getMutualRashiDrishti(): { sign1: number; sign2: number }[] {
  const mutual: { sign1: number; sign2: number }[] = [];
  for (let s1 = 1; s1 <= 12; s1++) {
    for (let s2 = s1 + 1; s2 <= 12; s2++) {
      if (hasRashiDrishti(s1, s2) && hasRashiDrishti(s2, s1)) {
        mutual.push({ sign1: s1, sign2: s2 });
      }
    }
  }
  return mutual;
}
