/**
 * Personal Compatibility — Birth chart integration for Muhurta AI
 * Provides personalized scoring based on birth data
 */

import {
  dateToJD, moonLongitude, toSidereal,
  getRashiNumber, getNakshatraNumber,
} from '@/lib/ephem/astronomical';
import type { BirthData } from '@/types/kundali';
import type { Trilingual } from '@/types/panchang';

// Tarabalam — Moon's transit nakshatra counted from birth nakshatra
const TARA_RESULTS: Record<number, { favorable: boolean; name: Trilingual }> = {
  1: { favorable: true, name: { en: 'Janma', hi: 'जन्म', sa: 'जन्म' } },
  2: { favorable: false, name: { en: 'Sampat', hi: 'सम्पत्', sa: 'सम्पत्' } },
  3: { favorable: true, name: { en: 'Vipat', hi: 'विपत्', sa: 'विपत्' } },
  4: { favorable: true, name: { en: 'Kshema', hi: 'क्षेम', sa: 'क्षेमः' } },
  5: { favorable: false, name: { en: 'Pratyari', hi: 'प्रत्यरि', sa: 'प्रत्यरिः' } },
  6: { favorable: true, name: { en: 'Sadhaka', hi: 'साधक', sa: 'साधकः' } },
  7: { favorable: false, name: { en: 'Vadha', hi: 'वध', sa: 'वधः' } },
  8: { favorable: true, name: { en: 'Mitra', hi: 'मित्र', sa: 'मित्रम्' } },
  9: { favorable: true, name: { en: 'Atimitra', hi: 'अतिमित्र', sa: 'अतिमित्रम्' } },
};

// Chandrabalam — Moon's transit sign counted from birth Moon sign
const CHANDRABALAM_GOOD_HOUSES = [1, 3, 6, 7, 10, 11]; // Good positions

export function computePersonalScore(
  birthData: BirthData,
  targetJD: number,
): { score: number; factors: Trilingual[] } {
  let score = 0;
  const factors: Trilingual[] = [];

  // Parse birth data
  const [year, month, day] = birthData.date.split('-').map(Number);
  const [hour, minute] = birthData.time.split(':').map(Number);
  const tz = parseFloat(birthData.timezone) || 5.5;
  const birthJD = dateToJD(year, month, day, hour + minute / 60 - tz);

  // Birth Moon position
  const birthMoonSid = toSidereal(moonLongitude(birthJD), birthJD);
  const birthMoonSign = getRashiNumber(birthMoonSid);
  const birthMoonNak = getNakshatraNumber(birthMoonSid);

  // Transit Moon position
  const transitMoonSid = toSidereal(moonLongitude(targetJD), targetJD);
  const transitMoonSign = getRashiNumber(transitMoonSid);
  const transitMoonNak = getNakshatraNumber(transitMoonSid);

  // Chandrabalam
  const chandraHouse = ((transitMoonSign - birthMoonSign + 12) % 12) + 1;
  if (CHANDRABALAM_GOOD_HOUSES.includes(chandraHouse)) {
    score += 8;
    factors.push({ en: 'Good Chandrabalam', hi: 'शुभ चन्द्रबल', sa: 'शुभचन्द्रबलम्' });
  }

  // Tarabalam
  const taraNum = ((transitMoonNak - birthMoonNak + 27) % 27) + 1;
  const taraCycle = ((taraNum - 1) % 9) + 1;
  const tara = TARA_RESULTS[taraCycle];
  if (tara?.favorable) {
    score += 8;
    factors.push({
      en: `Good Tarabalam (${tara.name.en})`,
      hi: `शुभ तारबल (${tara.name.hi})`,
      sa: `शुभतारबलम् (${tara.name.sa})`,
    });
  }

  // Dasha compatibility (simplified — check if transit Moon is in a friendly sign)
  // Friendly pairs: Sun-Moon, Mars-Jupiter, Venus-Saturn, Mercury-all
  const friendlyPairs: Record<number, number[]> = {
    0: [1, 2, 4], 1: [0, 3, 4], 2: [0, 1, 4],
    3: [0, 1, 4, 5, 6], 4: [0, 1, 2],
    5: [3, 6], 6: [3, 5],
  };
  // Simplified: if transit moon sign lord is friendly to birth moon sign lord
  const SIGN_LORDS = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]; // 0-indexed signs
  const transitSignLord = SIGN_LORDS[transitMoonSign - 1];
  const birthSignLord = SIGN_LORDS[birthMoonSign - 1];
  if (friendlyPairs[birthSignLord]?.includes(transitSignLord)) {
    score += 6;
    factors.push({ en: 'Friendly sign lords', hi: 'मित्र राशिपति', sa: 'मित्रराशिपतिः' });
  }

  // Ashtakavarga bindu (simplified): +3 if transit moon in good sign
  if ([2, 5, 9, 11].includes(chandraHouse)) {
    score += 3;
  }

  return { score: Math.max(0, Math.min(25, score)), factors };
}
