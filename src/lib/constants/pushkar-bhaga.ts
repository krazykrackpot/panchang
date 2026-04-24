/**
 * Pushkar Bhaga — most auspicious single degree per sign.
 * Source: Saravali / Kalaprakashika (standard Jyotish references).
 *
 * Key: 1-based sign number (1=Aries … 12=Pisces).
 * Value: degree within the sign (0–29).
 * Orb: ±0.8° is conventional for Pushkar Bhaga checks.
 */
export const PUSHKAR_BHAGA: Record<number, number> = {
  1: 21,  // Aries
  2: 14,  // Taurus
  3: 18,  // Gemini
  4: 8,   // Cancer
  5: 19,  // Leo
  6: 9,   // Virgo
  7: 24,  // Libra
  8: 11,  // Scorpio
  9: 23,  // Sagittarius
  10: 14, // Capricorn
  11: 19, // Aquarius
  12: 9,  // Pisces
};

/**
 * 24 Pushkar Navamsha positions encoded as (signIdx_0based * 9 + navamshaIdx_0based).
 * Shared between kundali-calc and muhurta scoring.
 */
export const PUSHKAR_NAVAMSHA_SET = new Set([
  0,   // Aries(0) navamsha 1(0)
  4,   // Aries(0) navamsha 5(4)
  13,  // Taurus(1) navamsha 5(4)
  17,  // Taurus(1) navamsha 9(8)
  20,  // Gemini(2) navamsha 3(2)
  24,  // Gemini(2) navamsha 7(6)
  27,  // Cancer(3) navamsha 1(0)
  33,  // Cancer(3) navamsha 7(6)
  36,  // Leo(4) navamsha 1(0)
  40,  // Leo(4) navamsha 5(4)
  47,  // Virgo(5) navamsha 3(2)
  51,  // Virgo(5) navamsha 7(6)
  54,  // Libra(6) navamsha 1(0)
  60,  // Libra(6) navamsha 7(6)
  65,  // Scorpio(7) navamsha 3(2)
  67,  // Scorpio(7) navamsha 5(4)
  76,  // Sagittarius(8) navamsha 5(4)
  80,  // Sagittarius(8) navamsha 9(8)
  83,  // Capricorn(9) navamsha 3(2)
  87,  // Capricorn(9) navamsha 7(6)
  90,  // Aquarius(10) navamsha 1(0)
  96,  // Aquarius(10) navamsha 7(6)
  101, // Pisces(11) navamsha 3(2)
  103, // Pisces(11) navamsha 5(4)
]);
