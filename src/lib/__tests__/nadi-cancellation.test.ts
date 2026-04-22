import { describe, it, expect } from 'vitest';
import { computeNadi, type MatchInput } from '@/lib/matching/ashta-kuta';

describe('Nadi Dosha — extended cancellations', () => {
  it('returns 0 for same nadi without pada info (dosha present)', () => {
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1 }; // Ashwini, Aadi
    const girl: MatchInput = { moonNakshatra: 7, moonRashi: 4 }; // Punarvasu, Aadi
    expect(computeNadi(boy, girl)).toBe(0);
  });

  it('N4: returns 8 for same nakshatra + same pada (complete override)', () => {
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 2 };
    const girl: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 2 };
    expect(computeNadi(boy, girl)).toBe(8);
  });

  it('N4: same nak different pada does NOT override', () => {
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 1 };
    const girl: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 3 };
    expect(computeNadi(boy, girl)).toBe(0);
  });

  it('returns 8 when nadi differs (no dosha)', () => {
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 1 }; // Aadi
    const girl: MatchInput = { moonNakshatra: 2, moonRashi: 1, moonPada: 1 }; // Madhya
    expect(computeNadi(boy, girl)).toBe(8);
  });

  it('backward compatible without moonPada', () => {
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1 };
    const girl: MatchInput = { moonNakshatra: 7, moonRashi: 4 };
    expect(computeNadi(boy, girl)).toBe(0); // same nadi, no pada → dosha
  });
});
