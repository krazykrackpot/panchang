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
  { en: 'Chaitra', hi: 'चैत्र', sa: 'चैत्रः', ritu: { en: 'Vasanta (Spring)', hi: 'वसन्त', sa: 'वसन्त', mai: 'वसन्त', mr: 'वसन्त', ta: 'வசந்தம் (இளவேனில்)', te: 'వసంతం (వసంత ఋతువు)', bn: 'বসন্ত', kn: 'ವಸಂತ (ವಸಂತ ಋತು)', gu: 'વસંત (વસંત ઋતુ)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'உத்தராயணம்', te: 'ఉత్తరాయణం', bn: 'উত্তরায়ণ', kn: 'ಉತ್ತರಾಯಣ', gu: 'ઉત્તરાયણ' } },
  { en: 'Vaishakha', hi: 'वैशाख', sa: 'वैशाखः', ritu: { en: 'Vasanta (Spring)', hi: 'वसन्त', sa: 'वसन्त', mai: 'वसन्त', mr: 'वसन्त', ta: 'வசந்தம் (இளவேனில்)', te: 'వసంతం (వసంత ఋతువు)', bn: 'বসন্ত', kn: 'ವಸಂತ (ವಸಂತ ಋತು)', gu: 'વસંત (વસંત ઋતુ)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'உத்தராயணம்', te: 'ఉత్తరాయణం', bn: 'উত্তরায়ণ', kn: 'ಉತ್ತರಾಯಣ', gu: 'ઉત્તરાયણ' } },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ', sa: 'ज्येष्ठः', ritu: { en: 'Grishma (Summer)', hi: 'ग्रीष्म', sa: 'ग्रीष्म', mai: 'ग्रीष्म', mr: 'ग्रीष्म', ta: 'கிரீஷ்மம் (கோடை)', te: 'గ్రీష్మం (వేసవి)', bn: 'গ্রীষ্ম', kn: 'ಗ್ರೀಷ್ಮ (ಬೇಸಿಗೆ)', gu: 'ગ્રીષ્મ (ઉનાળો)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'உத்தராயணம்', te: 'ఉత్తరాయణం', bn: 'উত্তরায়ণ', kn: 'ಉತ್ತರಾಯಣ', gu: 'ઉત્તરાયણ' } },
  { en: 'Ashadha', hi: 'आषाढ़', sa: 'आषाढः', ritu: { en: 'Grishma (Summer)', hi: 'ग्रीष्म', sa: 'ग्रीष्म', mai: 'ग्रीष्म', mr: 'ग्रीष्म', ta: 'கிரீஷ்மம் (கோடை)', te: 'గ్రీష్మం (వేసవి)', bn: 'গ্রীষ্ম', kn: 'ಗ್ರೀಷ್ಮ (ಬೇಸಿಗೆ)', gu: 'ગ્રીષ્મ (ઉનાળો)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'தக்ஷிணாயனம்', te: 'దక్షిణాయనం', bn: 'দক্ষিণায়ন', kn: 'ದಕ್ಷಿಣಾಯನ', gu: 'દક્ષિણાયન' } },
  { en: 'Shravana', hi: 'श्रावण', sa: 'श्रावणः', ritu: { en: 'Varsha (Monsoon)', hi: 'वर्षा', sa: 'वर्षा', mai: 'वर्षा', mr: 'वर्षा', ta: 'வர்ஷம் (மழைக்காலம்)', te: 'వర్షం (వర్ష ఋతువు)', bn: 'বর্ষা', kn: 'ವರ್ಷ (ಮಳೆಗಾಲ)', gu: 'વર્ષા (ચોમાસું)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'தக்ஷிணாயனம்', te: 'దక్షిణాయనం', bn: 'দক্ষিণায়ন', kn: 'ದಕ್ಷಿಣಾಯನ', gu: 'દક્ષિણાયન' } },
  { en: 'Bhadrapada', hi: 'भाद्रपद', sa: 'भाद्रपदः', ritu: { en: 'Varsha (Monsoon)', hi: 'वर्षा', sa: 'वर्षा', mai: 'वर्षा', mr: 'वर्षा', ta: 'வர்ஷம் (மழைக்காலம்)', te: 'వర్షం (వర్ష ఋతువు)', bn: 'বর্ষা', kn: 'ವರ್ಷ (ಮಳೆಗಾಲ)', gu: 'વર્ષા (ચોમાસું)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'தக்ஷிணாயனம்', te: 'దక్షిణాయనం', bn: 'দক্ষিণায়ন', kn: 'ದಕ್ಷಿಣಾಯನ', gu: 'દક્ષિણાયન' } },
  { en: 'Ashvina', hi: 'आश्विन', sa: 'आश्विनः', ritu: { en: 'Sharad (Autumn)', hi: 'शरद्', sa: 'शरद्', mai: 'शरद्', mr: 'शरद्', ta: 'சரத் (இலையுதிர்காலம்)', te: 'శరత్తు (శరద్ ఋతువు)', bn: 'শরৎ', kn: 'ಶರತ್ (ಶರದ್ ಋತು)', gu: 'શરદ (પાનખર)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'தக்ஷிணாயனம்', te: 'దక్షిణాయనం', bn: 'দক্ষিণায়ন', kn: 'ದಕ್ಷಿಣಾಯನ', gu: 'દક્ષિણાયન' } },
  { en: 'Kartika', hi: 'कार्तिक', sa: 'कार्तिकः', ritu: { en: 'Sharad (Autumn)', hi: 'शरद्', sa: 'शरद्', mai: 'शरद्', mr: 'शरद्', ta: 'சரத் (இலையுதிர்காலம்)', te: 'శరత్తు (శరద్ ఋతువు)', bn: 'শরৎ', kn: 'ಶರತ್ (ಶರದ್ ಋತು)', gu: 'શરદ (પાનખર)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'தக்ஷிணாயனம்', te: 'దక్షిణాయనం', bn: 'দক্ষিণায়ন', kn: 'ದಕ್ಷಿಣಾಯನ', gu: 'દક્ષિણાયન' } },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष', sa: 'मार्गशीर्षः', ritu: { en: 'Hemanta (Pre-Winter)', hi: 'हेमन्त', sa: 'हेमन्त', mai: 'हेमन्त', mr: 'हेमन्त', ta: 'ஹேமந்தம் (முன்பனிக்காலம்)', te: 'హేమంతం (ప్రారంభ శీతాకాలం)', bn: 'হেমন্ত', kn: 'ಹೇಮಂತ (ಚಳಿಗಾಲ ಪೂರ್ವ)', gu: 'હેમંત (પૂર્વ શિયાળો)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'தக்ஷிணாயனம்', te: 'దక్షిణాయనం', bn: 'দক্ষিণায়ন', kn: 'ದಕ್ಷಿಣಾಯನ', gu: 'દક્ષિણાયન' } },
  { en: 'Pausha', hi: 'पौष', sa: 'पौषः', ritu: { en: 'Hemanta (Pre-Winter)', hi: 'हेमन्त', sa: 'हेमन्त', mai: 'हेमन्त', mr: 'हेमन्त', ta: 'ஹேமந்தம் (முன்பனிக்காலம்)', te: 'హేమంతం (ప్రారంభ శీతాకాలం)', bn: 'হেমন্ত', kn: 'ಹೇಮಂತ (ಚಳಿಗಾಲ ಪೂರ್ವ)', gu: 'હેમંત (પૂર્વ શિયાળો)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'உத்தராயணம்', te: 'ఉత్తరాయణం', bn: 'উত্তরায়ণ', kn: 'ಉತ್ತರಾಯಣ', gu: 'ઉત્તરાયણ' } },
  { en: 'Magha', hi: 'माघ', sa: 'माघः', ritu: { en: 'Shishira (Winter)', hi: 'शिशिर', sa: 'शिशिर', mai: 'शिशिर', mr: 'शिशिर', ta: 'சிசிரம் (குளிர்காலம்)', te: 'శిశిరం (శీతాకాలం)', bn: 'শিশির (শীতকাল)', kn: 'ಶಿಶಿರ (ಚಳಿಗಾಲ)', gu: 'શિશિર (શિયાળો)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'உத்தராயணம்', te: 'ఉత్తరాయణం', bn: 'উত্তরায়ণ', kn: 'ಉತ್ತರಾಯಣ', gu: 'ઉત્તરાયણ' } },
  { en: 'Phalguna', hi: 'फाल्गुन', sa: 'फाल्गुनः', ritu: { en: 'Shishira (Winter)', hi: 'शिशिर', sa: 'शिशिर', mai: 'शिशिर', mr: 'शिशिर', ta: 'சிசிரம் (குளிர்காலம்)', te: 'శిశిరం (శీతాకాలం)', bn: 'শিশির (শীতকাল)', kn: 'ಶಿಶಿರ (ಚಳಿಗಾಲ)', gu: 'શિશિર (શિયાળો)' }, ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायण', mai: 'उत्तरायण', mr: 'उत्तरायण', ta: 'உத்தராயணம்', te: 'ఉత్తరాయణం', bn: 'উত্তরায়ণ', kn: 'ಉತ್ತರಾಯಣ', gu: 'ઉત્તરાયણ' } },
];

/**
 * Find all New Moon (Amavasya) dates in a year range.
 * Scans daily, detects when Moon-Sun elongation (0-360°) wraps through 0°.
 *
 * Raw elongation (Moon - Sun, mod 360) runs 0→360 over a synodic month:
 *   0° = New Moon (conjunction)
 *   180° = Full Moon (opposition)
 * At New Moon the elongation wraps from ~350° back to ~10° — we detect that crossing.
 */
function findNewMoons(year: number): { date: Date; jd: number }[] {
  const newMoons: { date: Date; jd: number }[] = [];
  const startJD = dateToJD(year - 1, 12, 1, 0);
  const endJD = dateToJD(year + 1, 2, 1, 0);

  let prevElong = -1;
  for (let jd = startJD; jd < endJD; jd += 1) {
    const sunL = sunLongitude(jd);
    const moonL = moonLongitude(jd);
    const elong = (moonL - sunL + 360) % 360;

    if (prevElong >= 0 && prevElong > 300 && elong < 60) {
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
      newMoons.push({ date: d, jd: nmJD });
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
 * Find all Full Moon (Purnima) dates in a year range.
 * Similar to findNewMoons but detects elongation crossing 180°.
 */
function findFullMoons(year: number): { date: Date; jd: number }[] {
  const fullMoons: { date: Date; jd: number }[] = [];
  const startJD = dateToJD(year - 1, 12, 1, 0);
  const endJD = dateToJD(year + 1, 2, 1, 0);

  let prevElong = -1;
  for (let jd = startJD; jd < endJD; jd += 1) {
    const sunL = sunLongitude(jd);
    const moonL = moonLongitude(jd);
    const elong = (moonL - sunL + 360) % 360;

    // Full Moon = elongation crosses 180° (goes from <180 to >180)
    if (prevElong >= 0 && prevElong < 180 && elong >= 180) {
      // Refine with binary search
      let lo = jd - 1, hi = jd;
      for (let i = 0; i < 15; i++) {
        const mid = (lo + hi) / 2;
        const mSun = sunLongitude(mid);
        const mMoon = moonLongitude(mid);
        const mElong = ((mMoon - mSun + 360) % 360);
        if (mElong < 180) { lo = mid; } else { hi = mid; }
      }
      const fmJD = (lo + hi) / 2;
      const d = new Date((fmJD - 2440587.5) * 86400000);
      fullMoons.push({ date: d, jd: fmJD });
    }
    prevElong = elong;
  }
  return fullMoons;
}

/**
 * Compute Purnimant Hindu months — each runs from Purnima to Purnima.
 *
 * Naming: derived from the Sun's sidereal sign at the ENDING Full Moon.
 * The Full Moon is always opposite the Sun, so the Moon's nakshatra at
 * Full Moon corresponds to a specific Sun sign. This is the classical
 * derivation: Chaitra = Sun in Pisces at Full Moon (Moon near Chitra),
 * Vaishakha = Sun in Aries (Moon near Vishakha), etc.
 *
 * Using Sun's sign rather than Moon's nakshatra avoids the unbalanced
 * nakshatra-to-month mapping problem (27 nakshatras / 12 months = 2.25,
 * which causes boundary issues with a discrete lookup table).
 *
 * Adhika: when no Sankranti (Sun sign change) occurs during a
 * Purnima-to-Purnima period, that month is intercalary (Adhika).
 */
export function computePurnimantMonths(year: number): HinduMonth[] {
  const fullMoons = findFullMoons(year);
  if (fullMoons.length < 2) return [];

  const months: HinduMonth[] = [];
  let monthCounter = 0;
  let prevMasaIdx = -1;

  for (let i = 0; i < fullMoons.length - 1; i++) {
    const { date: fmDate, jd: fmJD } = fullMoons[i];
    const { date: nextFmDate, jd: nextFmJD } = fullMoons[i + 1];

    // Detect Sankranti: scan the period for Sun entering a new sidereal sign.
    // The month is named by the Sankranti sign (the sign Sun enters).
    // If no Sankranti occurs → Adhika (intercalary), named same as the next nija month.
    const startSunSid = ((sunLongitude(fmJD) - lahiriAyanamsha(fmJD)) % 360 + 360) % 360;
    const startSign = Math.floor(startSunSid / 30) + 1;
    let sankrantiSign = -1;
    let prevSign = startSign;
    for (let jd = fmJD + 0.5; jd <= nextFmJD; jd += 1.0) {
      const sunSid = ((sunLongitude(jd) - lahiriAyanamsha(jd)) % 360 + 360) % 360;
      const sign = Math.floor(sunSid / 30) + 1;
      if (sign !== prevSign) {
        sankrantiSign = sign;
        break;
      }
      prevSign = sign;
    }

    // Month name from Sankranti sign; if no Sankranti, use the Sun's sign at end
    const endSunSid = ((sunLongitude(nextFmJD) - lahiriAyanamsha(nextFmJD)) % 360 + 360) % 360;
    const endSign = Math.floor(endSunSid / 30) + 1;
    const namingSign = sankrantiSign > 0 ? sankrantiSign : endSign;
    const masaIdx = getMasaFromSunSign(namingSign);

    // Adhika: no Sankranti in this period, OR same masaIdx as previous month
    // (the latter catches edge cases where the Sankranti scan passes but the
    // derived month name duplicates due to the 15-day offset from Amant)
    const isAdhika = sankrantiSign === -1 || masaIdx === prevMasaIdx;

    const startStr = `${fmDate.getUTCFullYear()}-${(fmDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${fmDate.getUTCDate().toString().padStart(2, '0')}`;
    const endStr = `${nextFmDate.getUTCFullYear()}-${(nextFmDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${nextFmDate.getUTCDate().toString().padStart(2, '0')}`;

    if (fmDate.getUTCFullYear() === year || nextFmDate.getUTCFullYear() === year) {
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
 * Compute Amant Hindu months with exact Gregorian dates for a given year.
 * Returns 12-13 months (13 if there's an Adhika Masa).
 */
export function computeHinduMonths(year: number): HinduMonth[] {
  const newMoons = findNewMoons(year);
  if (newMoons.length < 2) return [];

  const months: HinduMonth[] = [];
  let monthCounter = 0;
  let prevMasaIdx = -1;

  for (let i = 0; i < newMoons.length - 1; i++) {
    const { date: nmDate, jd: nmJD } = newMoons[i];
    const { date: nextNmDate, jd: nextNmJD } = newMoons[i + 1];

    // Sun's sidereal sign at the EXACT New Moon moment (not noon on the date).
    // Using the refined JD from binary search is critical — at boundary cases
    // (e.g., Jun 15 2026), noon gives Gemini but the actual New Moon at 03:00 UT
    // has Sun still in Taurus. This difference determines Adhika month detection.
    const tropSun = sunLongitude(nmJD);
    const ayanamsha = lahiriAyanamsha(nmJD);
    const sidSun = ((tropSun - ayanamsha) + 360) % 360;
    const sunSign = Math.floor(sidSun / 30) + 1; // 1-12
    const masaIdx = getMasaFromSunSign(sunSign); // 0-11

    // Adhika = Sun is in the same sidereal sign at both this and the next New Moon
    // (no Sankranti occurred during this lunar month)
    const nextTropSun = sunLongitude(nextNmJD);
    const nextAya = lahiriAyanamsha(nextNmJD);
    const nextSidSun = ((nextTropSun - nextAya) + 360) % 360;
    const nextSunSign = Math.floor(nextSidSun / 30) + 1;
    const isAdhika = sunSign === nextSunSign;

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
 * Look up the true lunar month (Amant) for a specific date.
 * Uses computeHinduMonths() and caches per-year results.
 * Returns { masaIdx, name, isAdhika, ritu, ayana } or the solar fallback.
 */
const _monthCache = new Map<number, HinduMonth[]>();

export interface LunarMasaResult {
  masaIdx: number;        // 0=Chaitra .. 11=Phalguna
  name: { en: string; hi: string; sa: string };
  isAdhika: boolean;
  ritu: LocaleText;
  ayana: LocaleText;
}

export function getLunarMasaForDate(year: number, month: number, day: number): LunarMasaResult | null {
  // Build/cache the Hindu months for this year (and adjacent year for boundary months)
  for (const y of [year - 1, year, year + 1]) {
    if (!_monthCache.has(y)) {
      _monthCache.set(y, computeHinduMonths(y));
    }
  }

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Search across current and adjacent years' months
  for (const y of [year - 1, year, year + 1]) {
    const months = _monthCache.get(y) || [];
    for (const m of months) {
      if (dateStr >= m.startDate && dateStr < m.endDate) {
        // Derive masaIdx from the month name (strip "Adhika " prefix)
        const baseName = m.en.replace(/^Adhika /, '');
        const idx = MASA_DATA.findIndex(d => d.en === baseName);
        return {
          masaIdx: idx >= 0 ? idx : 0,
          name: { en: m.en, hi: m.hi, sa: m.sa },
          isAdhika: m.isAdhika,
          ritu: m.ritu,
          ayana: m.ayana,
        };
      }
    }
  }

  return null; // Fallback: caller should use solar approximation
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
