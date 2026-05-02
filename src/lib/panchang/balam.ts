/**
 * Chandrabalam & Tarabalam computation
 *
 * Chandrabalam: Moon transit house from natal Moon sign
 * Tarabalam: Nakshatra transit strength from birth nakshatra
 */

import type { LocaleText, BalamResult } from '@/types/panchang';

export const TARA_NAMES: LocaleText[] = [
  { en: 'Janma', hi: 'जन्म', sa: 'जन्मा' },
  { en: 'Sampat', hi: 'सम्पत्', sa: 'सम्पत्' },
  { en: 'Vipat', hi: 'विपत्', sa: 'विपत्' },
  { en: 'Kshema', hi: 'क्षेम', sa: 'क्षेमम्' },
  { en: 'Pratyari', hi: 'प्रत्यरि', sa: 'प्रत्यरिः' },
  { en: 'Sadhana', hi: 'साधन', sa: 'साधनम्' },
  { en: 'Vadha', hi: 'वध', sa: 'वधः' },
  { en: 'Mitra', hi: 'मित्र', sa: 'मित्रम्' },
  { en: 'Parama Mitra', hi: 'परम मित्र', sa: 'परममित्रम्' },
];

// Favorable taras (1-indexed): Sampat(2), Kshema(4), Sadhana(6), Mitra(8), Parama Mitra(9)
export const FAVORABLE_TARAS = new Set([2, 4, 6, 8, 9]);

// Chandrabalam: favorable houses from natal Moon (Muhurta Chintamani)
// Unfavorable: 1 (Janma), 2, 4, 5, 8, 12
// Favorable: 3, 6, 7, 9, 10, 11
export const FAVORABLE_HOUSES = new Set([3, 6, 7, 9, 10, 11]);

const CHANDRABALAM_DESC: Record<string, { fav: LocaleText; unfav: LocaleText }> = {
  default: {
    fav: {
      en: 'Moon transit is favorable — good for new activities',
      hi: 'चन्द्र गोचर अनुकूल — नए कार्यों के लिए शुभ',
      sa: 'चन्द्रगोचरः अनुकूलः — नूतनकार्येषु शुभः',
    },
    unfav: {
      en: 'Moon transit is unfavorable — exercise caution',
      hi: 'चन्द्र गोचर प्रतिकूल — सावधानी बरतें',
      sa: 'चन्द्रगोचरः प्रतिकूलः — सावधानतां कुर्यात्',
    },
  },
};

export function computeBalam(
  birthNakshatra: number, // 1-27
  birthRashi: number,     // 1-12
  todayNakshatra: number, // 1-27
  todayMoonRashi: number, // 1-12
): BalamResult {
  // Chandrabalam: house = ((todayMoonRashi - birthRashi + 12) % 12) + 1
  const house = ((todayMoonRashi - birthRashi + 12) % 12) + 1;
  const chandraFavorable = FAVORABLE_HOUSES.has(house);

  // Tarabalam: tara = ((todayNakshatra - birthNakshatra + 27) % 9) || 9
  const tara = ((todayNakshatra - birthNakshatra + 27) % 9) || 9;
  const taraFavorable = FAVORABLE_TARAS.has(tara);

  return {
    chandrabalam: {
      house,
      favorable: chandraFavorable,
      description: chandraFavorable ? CHANDRABALAM_DESC.default.fav : CHANDRABALAM_DESC.default.unfav,
    },
    tarabalam: {
      tara,
      taraName: TARA_NAMES[tara - 1],
      favorable: taraFavorable,
      description: taraFavorable
        ? { en: `${TARA_NAMES[tara - 1].en} Tara — auspicious for activities`, hi: `${TARA_NAMES[tara - 1].hi} तारा — कार्यों के लिए शुभ`, sa: `${TARA_NAMES[tara - 1].sa} तारा — कार्येषु शुभः` }
        : { en: `${TARA_NAMES[tara - 1].en} Tara — exercise caution`, hi: `${TARA_NAMES[tara - 1].hi} तारा — सावधानी बरतें`, sa: `${TARA_NAMES[tara - 1].sa} तारा — सावधानतां कुर्यात्` },
    },
  };
}

/**
 * Compute chandrabalam status for ALL 12 rashis given today's Moon rashi.
 * Returns array of 12 entries (index 0 = Aries/1, index 11 = Pisces/12).
 */
export function computeChandrabalamGrid(todayMoonRashi: number): { rashiId: number; house: number; favorable: boolean }[] {
  return Array.from({ length: 12 }, (_, i) => {
    const birthRashi = i + 1; // 1-12
    const house = ((todayMoonRashi - birthRashi + 12) % 12) + 1;
    return { rashiId: birthRashi, house, favorable: FAVORABLE_HOUSES.has(house) };
  });
}

/**
 * Compute tarabalam status for ALL 27 nakshatras given today's Moon nakshatra.
 * Returns array of 27 entries (index 0 = Ashwini/1, index 26 = Revati/27).
 */
export function computeTarabalamGrid(todayNakshatra: number): { nakshatraId: number; tara: number; taraName: LocaleText; favorable: boolean }[] {
  return Array.from({ length: 27 }, (_, i) => {
    const birthNak = i + 1; // 1-27
    const tara = ((todayNakshatra - birthNak + 27) % 9) || 9;
    return {
      nakshatraId: birthNak,
      tara,
      taraName: TARA_NAMES[tara - 1],
      favorable: FAVORABLE_TARAS.has(tara),
    };
  });
}
