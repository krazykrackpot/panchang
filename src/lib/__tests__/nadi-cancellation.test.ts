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

  it('N4: same nak different pada does NOT override (when lords differ)', () => {
    // Krittika (nak 3, Antya nadi) spans Aries (lord Mars=2) and Taurus (lord Venus=5)
    // Pada 1 is in Aries, Pada 3 is in Taurus — different lords, not trine → dosha stands
    const boy: MatchInput = { moonNakshatra: 3, moonRashi: 1, moonPada: 1 };
    const girl: MatchInput = { moonNakshatra: 3, moonRashi: 2, moonPada: 3 };
    expect(computeNadi(boy, girl)).toBe(0);
  });

  it('ekadhipati cancellation: same rashi lord cancels nadi dosha', () => {
    // Ashwini (nak 1, Aadi) in Aries (lord Mars) and Punarvasu (nak 7, Aadi) in Aries (lord Mars)
    // Same nadi + same lord → ekadhipati cancellation
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 1 };
    const girl: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 3 };
    expect(computeNadi(boy, girl)).toBe(8);
  });

  it('trine cancellation: Moon signs in 1-5-9 relationship cancels nadi dosha', () => {
    // Ashwini (nak 1, Aadi) rashi 1 and Punarvasu (nak 7, Aadi) rashi 5
    // signDiff = 4 → trine cancellation
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1 };
    const girl: MatchInput = { moonNakshatra: 7, moonRashi: 5 };
    expect(computeNadi(boy, girl)).toBe(8);
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
