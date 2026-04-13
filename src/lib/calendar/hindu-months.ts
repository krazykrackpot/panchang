import type { LocaleText } from '@/types/panchang';
/**
 * Compute exact Hindu month start/end dates for a given Gregorian year.
 * Hindu months (Amant/Purnimant) are lunar — each begins on Amavasya (new moon)
 * or Purnima (full moon). We scan for New Moons and map them to Masa names
 * based on the Sun's sidereal longitude at the time of the New Moon.
 *
 * Reference: Surya Siddhanta, Indian Calendar Reform Committee (1956)
 */

import { dateToJD, sunLongitude, moonLongitude, lahiriAyanamsha } from '@/lib/ephem/astronomical';

interface HinduMonth {
  n: number;
  en: string;
  hi: string;
  sa: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;      // YYYY-MM-DD
  ritu: LocaleText;
  ayana: LocaleText;
  isAdhika: boolean;    // intercalary month
}

const MASA_DATA: { en: string; hi: string; sa: string; ritu: LocaleText; ayana: LocaleText }[] = [
  { en: 'Chaitra', hi: 'चैत्र', sa: 'चैत्रः', ritu: { en: 'Vasanta (Spring)', hi: 'वसन्त', sa: 'वसन्त', mai: 'वसन्त', mr: 'वसन्त', ta: 'Vasanta (Spring)', te: 'Vasanta (Spring)', bn: 'Vasanta (Spring)', kn: 'Vasanta (Spring)', gu: 'Vasanta (Spring)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'Uttarayana', te: 'Uttarayana', bn: 'Uttarayana', kn: 'Uttarayana', gu: 'Uttarayana' } },
  { en: 'Vaishakha', hi: 'वैशाख', sa: 'वैशाखः', ritu: { en: 'Vasanta (Spring)', hi: 'वसन्त', sa: 'वसन्त', mai: 'वसन्त', mr: 'वसन्त', ta: 'Vasanta (Spring)', te: 'Vasanta (Spring)', bn: 'Vasanta (Spring)', kn: 'Vasanta (Spring)', gu: 'Vasanta (Spring)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'Uttarayana', te: 'Uttarayana', bn: 'Uttarayana', kn: 'Uttarayana', gu: 'Uttarayana' } },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ', sa: 'ज्येष्ठः', ritu: { en: 'Grishma (Summer)', hi: 'ग्रीष्म', sa: 'ग्रीष्म', mai: 'ग्रीष्म', mr: 'ग्रीष्म', ta: 'Grishma (Summer)', te: 'Grishma (Summer)', bn: 'Grishma (Summer)', kn: 'Grishma (Summer)', gu: 'Grishma (Summer)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'Uttarayana', te: 'Uttarayana', bn: 'Uttarayana', kn: 'Uttarayana', gu: 'Uttarayana' } },
  { en: 'Ashadha', hi: 'आषाढ़', sa: 'आषाढः', ritu: { en: 'Grishma (Summer)', hi: 'ग्रीष्म', sa: 'ग्रीष्म', mai: 'ग्रीष्म', mr: 'ग्रीष्म', ta: 'Grishma (Summer)', te: 'Grishma (Summer)', bn: 'Grishma (Summer)', kn: 'Grishma (Summer)', gu: 'Grishma (Summer)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'Dakshinayana', te: 'Dakshinayana', bn: 'Dakshinayana', kn: 'Dakshinayana', gu: 'Dakshinayana' } },
  { en: 'Shravana', hi: 'श्रावण', sa: 'श्रावणः', ritu: { en: 'Varsha (Monsoon)', hi: 'वर्षा', sa: 'वर्षा', mai: 'वर्षा', mr: 'वर्षा', ta: 'Varsha (Monsoon)', te: 'Varsha (Monsoon)', bn: 'Varsha (Monsoon)', kn: 'Varsha (Monsoon)', gu: 'Varsha (Monsoon)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'Dakshinayana', te: 'Dakshinayana', bn: 'Dakshinayana', kn: 'Dakshinayana', gu: 'Dakshinayana' } },
  { en: 'Bhadrapada', hi: 'भाद्रपद', sa: 'भाद्रपदः', ritu: { en: 'Varsha (Monsoon)', hi: 'वर्षा', sa: 'वर्षा', mai: 'वर्षा', mr: 'वर्षा', ta: 'Varsha (Monsoon)', te: 'Varsha (Monsoon)', bn: 'Varsha (Monsoon)', kn: 'Varsha (Monsoon)', gu: 'Varsha (Monsoon)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'Dakshinayana', te: 'Dakshinayana', bn: 'Dakshinayana', kn: 'Dakshinayana', gu: 'Dakshinayana' } },
  { en: 'Ashvina', hi: 'आश्विन', sa: 'आश्विनः', ritu: { en: 'Sharad (Autumn)', hi: 'शरद्', sa: 'शरद्', mai: 'शरद्', mr: 'शरद्', ta: 'Sharad (Autumn)', te: 'Sharad (Autumn)', bn: 'Sharad (Autumn)', kn: 'Sharad (Autumn)', gu: 'Sharad (Autumn)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'Dakshinayana', te: 'Dakshinayana', bn: 'Dakshinayana', kn: 'Dakshinayana', gu: 'Dakshinayana' } },
  { en: 'Kartika', hi: 'कार्तिक', sa: 'कार्तिकः', ritu: { en: 'Sharad (Autumn)', hi: 'शरद्', sa: 'शरद्', mai: 'शरद्', mr: 'शरद्', ta: 'Sharad (Autumn)', te: 'Sharad (Autumn)', bn: 'Sharad (Autumn)', kn: 'Sharad (Autumn)', gu: 'Sharad (Autumn)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'Dakshinayana', te: 'Dakshinayana', bn: 'Dakshinayana', kn: 'Dakshinayana', gu: 'Dakshinayana' } },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष', sa: 'मार्गशीर्षः', ritu: { en: 'Hemanta (Pre-Winter)', hi: 'हेमन्त', sa: 'हेमन्त', mai: 'हेमन्त', mr: 'हेमन्त', ta: 'Hemanta (Pre-Winter)', te: 'Hemanta (Pre-Winter)', bn: 'Hemanta (Pre-Winter)', kn: 'Hemanta (Pre-Winter)', gu: 'Hemanta (Pre-Winter)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'Dakshinayana', te: 'Dakshinayana', bn: 'Dakshinayana', kn: 'Dakshinayana', gu: 'Dakshinayana' } },
  { en: 'Pausha', hi: 'पौष', sa: 'पौषः', ritu: { en: 'Hemanta (Pre-Winter)', hi: 'हेमन्त', sa: 'हेमन्त', mai: 'हेमन्त', mr: 'हेमन्त', ta: 'Hemanta (Pre-Winter)', te: 'Hemanta (Pre-Winter)', bn: 'Hemanta (Pre-Winter)', kn: 'Hemanta (Pre-Winter)', gu: 'Hemanta (Pre-Winter)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'Uttarayana', te: 'Uttarayana', bn: 'Uttarayana', kn: 'Uttarayana', gu: 'Uttarayana' } },
  { en: 'Magha', hi: 'माघ', sa: 'माघः', ritu: { en: 'Shishira (Winter)', hi: 'शिशिर', sa: 'शिशिर', mai: 'शिशिर', mr: 'शिशिर', ta: 'Shishira (Winter)', te: 'Shishira (Winter)', bn: 'Shishira (Winter)', kn: 'Shishira (Winter)', gu: 'Shishira (Winter)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'Uttarayana', te: 'Uttarayana', bn: 'Uttarayana', kn: 'Uttarayana', gu: 'Uttarayana' } },
  { en: 'Phalguna', hi: 'फाल्गुन', sa: 'फाल्गुनः', ritu: { en: 'Shishira (Winter)', hi: 'शिशिर', sa: 'शिशिर', mai: 'शिशिर', mr: 'शिशिर', ta: 'Shishira (Winter)', te: 'Shishira (Winter)', bn: 'Shishira (Winter)', kn: 'Shishira (Winter)', gu: 'Shishira (Winter)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'Uttarayana', te: 'Uttarayana', bn: 'Uttarayana', kn: 'Uttarayana', gu: 'Uttarayana' } },
];

/**
 * Find all New Moon (Amavasya) dates in a year range.
 * Scans daily, detects when Moon-Sun elongation crosses 0°.
 */
function findNewMoons(year: number): Date[] {
  const newMoons: Date[] = [];
  // Scan from Dec of previous year through Jan of next year
  const startJD = dateToJD(year - 1, 12, 1, 0);
  const endJD = dateToJD(year + 1, 2, 1, 0);

  let prevElong = -1;
  for (let jd = startJD; jd < endJD; jd += 1) {
    const sunL = sunLongitude(jd);
    const moonL = moonLongitude(jd);
    let elong = (moonL - sunL + 360) % 360;
    if (elong > 180) elong = 360 - elong; // normalize to 0-180

    // New Moon = elongation near 0, crossing from large to small
    if (prevElong > 90 && elong < 90 && prevElong > elong) {
      // Refine with binary search
      let lo = jd - 1, hi = jd;
      for (let i = 0; i < 15; i++) {
        const mid = (lo + hi) / 2;
        const mSun = sunLongitude(mid);
        const mMoon = moonLongitude(mid);
        const mElong = ((mMoon - mSun + 360) % 360);
        if (mElong > 180) { lo = mid; } else { hi = mid; }
      }

      const nmJD = (lo + hi) / 2;
      const d = new Date((nmJD - 2440587.5) * 86400000);
      newMoons.push(d);
    }
    prevElong = elong;
  }
  return newMoons;
}

/**
 * Determine which Hindu month a New Moon starts, based on Sun's sidereal sign.
 * The month is named after the nakshatra where the Full Moon occurs,
 * which corresponds to the Sun being in the opposite sign.
 *
 * Sun in sidereal Pisces (12) at New Moon → month is Chaitra (1)
 * Sun in sidereal Aries (1) → Vaishakha (2)
 * Sun in sidereal Taurus (2) → Jyeshtha (3)
 * ...general formula: masaIndex = (sunSign % 12)
 */
function getMasaFromSunSign(sunSiderealSign: number): number {
  // Sun in Pisces(12) = Chaitra(0), Aries(1) = Vaishakha(1), etc.
  return sunSiderealSign % 12; // 0-indexed
}

/**
 * Compute Hindu months with exact Gregorian dates for a given year.
 * Returns 12-13 months (13 if there's an Adhika Masa).
 */
export function computeHinduMonths(year: number): HinduMonth[] {
  const newMoons = findNewMoons(year);
  if (newMoons.length < 2) return [];

  const months: HinduMonth[] = [];
  let monthCounter = 0;
  let prevMasaIdx = -1;

  for (let i = 0; i < newMoons.length - 1; i++) {
    const nmDate = newMoons[i];
    const nextNmDate = newMoons[i + 1];

    // Sun's sidereal sign at this New Moon
    const jd = dateToJD(nmDate.getUTCFullYear(), nmDate.getUTCMonth() + 1, nmDate.getUTCDate(), 12);
    const tropSun = sunLongitude(jd);
    const ayanamsha = lahiriAyanamsha(jd);
    const sidSun = ((tropSun - ayanamsha) + 360) % 360;
    const sunSign = Math.floor(sidSun / 30) + 1; // 1-12
    const masaIdx = getMasaFromSunSign(sunSign); // 0-11

    // Check if this is an Adhika (intercalary) month
    // Adhika = same Sun sign as the previous month (no Sankranti during the month)
    const isAdhika = masaIdx === prevMasaIdx;

    const startStr = `${nmDate.getUTCFullYear()}-${(nmDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${nmDate.getUTCDate().toString().padStart(2, '0')}`;
    const endStr = `${nextNmDate.getUTCFullYear()}-${(nextNmDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${nextNmDate.getUTCDate().toString().padStart(2, '0')}`;

    // Only include months that fall within or overlap the target year
    if (nmDate.getUTCFullYear() === year || nextNmDate.getUTCFullYear() === year) {
      monthCounter++;
      const masaData = MASA_DATA[masaIdx] || MASA_DATA[0];
      months.push({
        n: monthCounter,
        en: isAdhika ? `Adhika ${masaData.en}` : masaData.en,
        hi: isAdhika ? `अधिक ${masaData.hi}` : masaData.hi,
        sa: isAdhika ? `अधिक${masaData.sa}` : masaData.sa,
        startDate: startStr,
        endDate: endStr,
        ritu: masaData.ritu,
        ayana: masaData.ayana,
        isAdhika,
      });
    }

    prevMasaIdx = masaIdx;
  }

  return months;
}

/**
 * Format a date string as "DD Mon" (e.g., "14 Mar" or "14 मार्च")
 */
export function formatMonthDate(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsHi = ['जन.', 'फर.', 'मार्च', 'अप्रै.', 'मई', 'जून', 'जुला.', 'अग.', 'सित.', 'अक्टू.', 'नव.', 'दिस.'];
  const months = locale === 'en' ? monthsEn : monthsHi;
  return `${d} ${months[m - 1]}`;
}
