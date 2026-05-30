/**
 * Tests for the planetary dignity resolver.
 *
 * The Moon and Mercury cases are the critical regression checks for the
 * bug fix that introduced `EXALTATION_UPPER_DEG` and `isExaltedAtDegree`:
 *   - Moon was returning 'exalted' anywhere in Taurus.
 *   - Mercury was returning 'exalted' anywhere in Virgo.
 * Both now correctly fall through to Moolatrikona / own / friendship
 * once they cross out of the exaltation degree window.
 *
 * Sign indices below are 1-based per the project convention
 * (1=Aries, 2=Taurus, ..., 12=Pisces).
 *
 * Planet IDs:
 *   0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn.
 */
import { describe, it, expect } from 'vitest';
import {
  isExalted,
  isExaltedAtDegree,
  isParamaUchcha,
  EXALTATION_UPPER_DEG,
} from '@/lib/constants/dignities';
import { getPlanetDignity } from '@/lib/tippanni/dignity';

describe('EXALTATION_UPPER_DEG', () => {
  it('covers only Moon and Mercury (the two collision planets)', () => {
    expect(Object.keys(EXALTATION_UPPER_DEG).sort()).toEqual(['1', '3']);
  });

  it('sets Moon cap at 4° (= start of Moon MT in Taurus)', () => {
    expect(EXALTATION_UPPER_DEG[1]).toBe(4);
  });

  it('sets Mercury cap at 16° (= start of Mercury MT in Virgo)', () => {
    expect(EXALTATION_UPPER_DEG[3]).toBe(16);
  });
});

describe('isExalted (sign-only legacy check)', () => {
  // The sign-only helper is intentionally preserved for yoga-detection
  // call sites that genuinely want "is in the exaltation sign" regardless
  // of degree. New code should prefer isExaltedAtDegree.
  it('returns true for any degree of Moon in Taurus (sign-level only)', () => {
    expect(isExalted(1, 2)).toBe(true);
  });
});

describe('isExaltedAtDegree', () => {
  describe('Moon (Taurus 0–3° per BPHS)', () => {
    it('true at 0° Taurus', () => expect(isExaltedAtDegree(1, 2, 0)).toBe(true));
    it('true at 2.5° Taurus', () => expect(isExaltedAtDegree(1, 2, 2.5)).toBe(true));
    it('true at 3° Taurus (peak)', () => expect(isExaltedAtDegree(1, 2, 3)).toBe(true));
    it('true just under the cap at 3.99° Taurus', () => {
      expect(isExaltedAtDegree(1, 2, 3.99)).toBe(true);
    });
    it('FALSE at 4° Taurus (Moolatrikona starts here)', () => {
      expect(isExaltedAtDegree(1, 2, 4)).toBe(false);
    });
    it('FALSE at 15° Taurus (within MT)', () => {
      expect(isExaltedAtDegree(1, 2, 15)).toBe(false);
    });
    it('FALSE in Cancer (own, not exaltation sign)', () => {
      expect(isExaltedAtDegree(1, 4, 10)).toBe(false);
    });
  });

  describe('Mercury (Virgo 0–15° per BPHS)', () => {
    it('true at 0° Virgo', () => expect(isExaltedAtDegree(3, 6, 0)).toBe(true));
    it('true at 15° Virgo (peak)', () => expect(isExaltedAtDegree(3, 6, 15)).toBe(true));
    it('true just under the cap at 15.99° Virgo', () => {
      expect(isExaltedAtDegree(3, 6, 15.99)).toBe(true);
    });
    it('FALSE at 16° Virgo (Moolatrikona starts here)', () => {
      expect(isExaltedAtDegree(3, 6, 16)).toBe(false);
    });
    it('FALSE at 25° Virgo (own-sign territory)', () => {
      expect(isExaltedAtDegree(3, 6, 25)).toBe(false);
    });
    it('FALSE in Gemini (own, not exaltation sign)', () => {
      expect(isExaltedAtDegree(3, 3, 10)).toBe(false);
    });
  });

  describe('planets without an exaltation cap (full-sign exaltation)', () => {
    it('Sun is exalted anywhere in Aries', () => {
      expect(isExaltedAtDegree(0, 1, 0)).toBe(true);
      expect(isExaltedAtDegree(0, 1, 10)).toBe(true); // peak
      expect(isExaltedAtDegree(0, 1, 29)).toBe(true);
    });
    it('Mars is exalted anywhere in Capricorn', () => {
      expect(isExaltedAtDegree(2, 10, 5)).toBe(true);
      expect(isExaltedAtDegree(2, 10, 28)).toBe(true); // peak
      expect(isExaltedAtDegree(2, 10, 29.5)).toBe(true);
    });
    it('Jupiter is exalted anywhere in Cancer', () => {
      expect(isExaltedAtDegree(4, 4, 0)).toBe(true);
      expect(isExaltedAtDegree(4, 4, 5)).toBe(true); // peak
      expect(isExaltedAtDegree(4, 4, 29)).toBe(true);
    });
    it('Venus is exalted anywhere in Pisces', () => {
      expect(isExaltedAtDegree(5, 12, 0)).toBe(true);
      expect(isExaltedAtDegree(5, 12, 27)).toBe(true); // peak
      expect(isExaltedAtDegree(5, 12, 29)).toBe(true);
    });
    it('Saturn is exalted anywhere in Libra', () => {
      expect(isExaltedAtDegree(6, 7, 0)).toBe(true);
      expect(isExaltedAtDegree(6, 7, 20)).toBe(true); // peak
      expect(isExaltedAtDegree(6, 7, 29)).toBe(true);
    });
  });
});

describe('isParamaUchcha (within ±1° of exact exaltation degree)', () => {
  // Peaks per dignities.ts:
  //   Sun 10° Aries, Moon 3° Taurus, Mars 28° Capricorn,
  //   Mercury 15° Virgo, Jupiter 5° Cancer, Venus 27° Pisces,
  //   Saturn 20° Libra.
  it('Sun at 10° Aries', () => expect(isParamaUchcha(0, 1, 10)).toBe(true));
  it('Sun at 9.5° Aries (within 1° orb)', () => expect(isParamaUchcha(0, 1, 9.5)).toBe(true));
  it('Sun at 11° Aries (within 1° orb)', () => expect(isParamaUchcha(0, 1, 11)).toBe(true));
  it('Sun at 8.99° Aries (out of orb)', () => expect(isParamaUchcha(0, 1, 8.99)).toBe(false));
  it('Sun at 11.01° Aries (out of orb)', () => expect(isParamaUchcha(0, 1, 11.01)).toBe(false));

  it('Moon at 3° Taurus (peak)', () => expect(isParamaUchcha(1, 2, 3)).toBe(true));
  it('Moon at 2.5° Taurus (within orb)', () => expect(isParamaUchcha(1, 2, 2.5)).toBe(true));
  it('Moon at 3.99° Taurus (within orb AND still in exalt window)', () => {
    // Edge case: 1° orb above peak would be 4°, which is the MT cap.
    // The orb check is `<=`, so 3.99 is in. 4.0 fails because
    // isExaltedAtDegree fails first.
    expect(isParamaUchcha(1, 2, 3.99)).toBe(true);
  });
  it('Moon at 4° Taurus (out of exalt window altogether)', () => {
    expect(isParamaUchcha(1, 2, 4)).toBe(false);
  });

  it('Mercury at 15° Virgo (peak)', () => expect(isParamaUchcha(3, 6, 15)).toBe(true));
  it('Mercury at 14.5° Virgo (within orb)', () => expect(isParamaUchcha(3, 6, 14.5)).toBe(true));
  it('Mercury at 16° Virgo (out of exalt window)', () => {
    expect(isParamaUchcha(3, 6, 16)).toBe(false);
  });

  it('Saturn at 20° Libra (peak)', () => expect(isParamaUchcha(6, 7, 20)).toBe(true));
  it('Saturn at 21° Libra (within orb)', () => expect(isParamaUchcha(6, 7, 21)).toBe(true));
  it('Saturn at 22° Libra (out of orb)', () => expect(isParamaUchcha(6, 7, 22)).toBe(false));

  it('Mars at 28° Capricorn (peak)', () => expect(isParamaUchcha(2, 10, 28)).toBe(true));
  it('Venus at 27° Pisces (peak)', () => expect(isParamaUchcha(5, 12, 27)).toBe(true));
  it('Jupiter at 5° Cancer (peak)', () => expect(isParamaUchcha(4, 4, 5)).toBe(true));

  it('any non-exaltation sign returns false', () => {
    expect(isParamaUchcha(0, 5, 10)).toBe(false); // Sun in Leo (own, not exalt)
  });
});

describe('getPlanetDignity — regression for Moon/Mercury exaltation masking', () => {
  describe('Moon (Taurus)', () => {
    it("0° Taurus → 'exalted'", () => expect(getPlanetDignity(1, 2, 0)).toBe('exalted'));
    it("3° Taurus (peak) → 'exalted'", () => expect(getPlanetDignity(1, 2, 3)).toBe('exalted'));
    it("4° Taurus → 'moolatrikona' (was 'exalted' before fix)", () => {
      expect(getPlanetDignity(1, 2, 4)).toBe('moolatrikona');
    });
    it("15° Taurus → 'moolatrikona' (was 'exalted' before fix)", () => {
      expect(getPlanetDignity(1, 2, 15)).toBe('moolatrikona');
    });
    it("20° Taurus → 'moolatrikona' (boundary inclusive)", () => {
      // MT inclusive 4–20. 20° = MT.
      expect(getPlanetDignity(1, 2, 20)).toBe('moolatrikona');
    });
    it("25° Taurus → 'neutral' (Moon doesn't own Taurus; Venus is neutral)", () => {
      expect(getPlanetDignity(1, 2, 25)).toBe('neutral');
    });
    it("Cancer at any degree → 'own' (Moon owns Cancer)", () => {
      expect(getPlanetDignity(1, 4, 0)).toBe('own');
      expect(getPlanetDignity(1, 4, 15)).toBe('own');
      expect(getPlanetDignity(1, 4, 29)).toBe('own');
    });
  });

  describe('Mercury (Virgo)', () => {
    it("0° Virgo → 'exalted'", () => expect(getPlanetDignity(3, 6, 0)).toBe('exalted'));
    it("15° Virgo (peak) → 'exalted'", () => expect(getPlanetDignity(3, 6, 15)).toBe('exalted'));
    it("16° Virgo → 'moolatrikona' (was 'exalted' before fix)", () => {
      expect(getPlanetDignity(3, 6, 16)).toBe('moolatrikona');
    });
    it("18° Virgo → 'moolatrikona' (was 'exalted' before fix)", () => {
      expect(getPlanetDignity(3, 6, 18)).toBe('moolatrikona');
    });
    it("25° Virgo → 'own' (was 'exalted' before fix)", () => {
      expect(getPlanetDignity(3, 6, 25)).toBe('own');
    });
    it("Gemini at any degree → 'own'", () => {
      expect(getPlanetDignity(3, 3, 12)).toBe('own');
    });
  });
});

describe('getPlanetDignity — other planets unchanged by the fix', () => {
  it("Sun at 25° Aries → 'exalted' (full-sign, no degree gating)", () => {
    expect(getPlanetDignity(0, 1, 25)).toBe('exalted');
  });
  it("Sun at 15° Leo → 'moolatrikona' (Leo 0–20°)", () => {
    expect(getPlanetDignity(0, 5, 15)).toBe('moolatrikona');
  });
  it("Sun at 25° Leo → 'own' (above MT)", () => {
    expect(getPlanetDignity(0, 5, 25)).toBe('own');
  });
  it("Mars at 28° Capricorn (peak) → 'exalted'", () => {
    expect(getPlanetDignity(2, 10, 28)).toBe('exalted');
  });
  it("Jupiter at 7° Sagittarius → 'moolatrikona' (Sag 0–10°)", () => {
    expect(getPlanetDignity(4, 9, 7)).toBe('moolatrikona');
  });
  it("Jupiter at 20° Sagittarius → 'own'", () => {
    expect(getPlanetDignity(4, 9, 20)).toBe('own');
  });
  it("Venus at 3° Libra → 'moolatrikona' (Libra 0–5°)", () => {
    expect(getPlanetDignity(5, 7, 3)).toBe('moolatrikona');
  });
  it("Saturn at 15° Aquarius → 'moolatrikona' (Aqu 0–20°)", () => {
    expect(getPlanetDignity(6, 11, 15)).toBe('moolatrikona');
  });
  it("Saturn at 7° Aries → 'debilitated'", () => {
    expect(getPlanetDignity(6, 1, 7)).toBe('debilitated');
  });
  it("Rahu / Ketu always 'neutral' under this resolver (separate system)", () => {
    expect(getPlanetDignity(7, 3, 10)).toBe('neutral');
    expect(getPlanetDignity(8, 9, 10)).toBe('neutral');
  });
});
