import type { LocaleText } from '@/types/panchang';
/**
 * Compute exact Hindu month start/end dates for a given Gregorian year.
 * Hindu months (Amant/Purnimant) are lunar  –  each begins on Amavasya (new moon)
 * or Purnima (full moon). We scan for New Moons and map them to Masa names
 * based on the Sun's sidereal longitude at the time of the New Moon.
 *
 * Reference: Surya Siddhanta, Indian Calendar Reform Committee (1956)
 */

import { dateToJD, sunLongitude, moonLongitude, getAyanamsha, getRashiNumber } from '@/lib/ephem/astronomical';
import { sunriseUTHoursOr } from '@/lib/ephem/swiss-ephemeris';

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
  // Note: codebase standard spelling is 'Ashwina' (with W) — used in
  // 15+ places including festival-defs.ts, astronomical.ts MASA_NAMES,
  // and SOLAR_MONTH_MAP in festival-details.ts. Was previously 'Ashvina'
  // (V) here as a one-file outlier, breaking lookup in any consumer that
  // string-matches against the canonical lowercase masa name (e.g. the
  // regional calendar engine emitted 'ashvina' raw without mapping).
  // Standardised to W on 2026-06-02 (linking-topology PR).
  { en: 'Ashwina', hi: 'आश्विन', sa: 'आश्विनः', ritu: { en: 'Sharad (Autumn)', hi: 'शरद्', sa: 'शरद्', mai: 'शरद्', mr: 'शरद्', ta: 'சரத் (இலையுதிர்காலம்)', te: 'శరత్తు (శరద్ ఋతువు)', bn: 'শরৎ', kn: 'ಶರತ್ (ಶರದ್ ಋತು)', gu: 'શરદ (પાનખર)' }, ayana: { en: 'Dakshinayana', hi: 'दक्षिणायन', sa: 'दक्षिणायन', mai: 'दक्षिणायन', mr: 'दक्षिणायन', ta: 'தக்ஷிணாயனம்', te: 'దక్షిణాయనం', bn: 'দক্ষিণায়ন', kn: 'ದಕ್ಷಿಣಾಯನ', gu: 'દક્ષિણાયન' } },
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
 * At New Moon the elongation wraps from ~350° back to ~10°  –  we detect that crossing.
 */
function findNewMoons(year: number, lookbackYears = 0): { date: Date; jd: number }[] {
  const newMoons: { date: Date; jd: number }[] = [];
  const startJD = dateToJD(year - 1 - lookbackYears, 12, 1, 0);
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
  // Classical: Mesha(1)→Vaishakha(1), Meena(12)→Chaitra(0).
  // Used with sign at STARTING NM (sunSign, not nextSunSign).
  return sunSiderealSign % 12; // 0-indexed
}

/**
 * Find all Full Moon (Purnima) dates in a year range.
 * Similar to findNewMoons but detects elongation crossing 180°.
 *
 * @param year — anchor year
 * @param lookbackYears — extra years to scan BEFORE `year - 1` Dec 1.
 *   Used by `computePurnimantMonths` to feed the Adhika state machine
 *   enough prior context to handle years that follow an Adhika year
 *   (e.g. 2027 follows the 2026 Adhika Jyeshtha). Default 0 preserves
 *   existing single-year behaviour for `computeHinduMonths`.
 */
function findFullMoons(year: number, lookbackYears = 0): { date: Date; jd: number }[] {
  const fullMoons: { date: Date; jd: number }[] = [];
  const startJD = dateToJD(year - 1 - lookbackYears, 12, 1, 0);
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
 * Compute Purnimant Hindu months  –  each runs from Purnima to Purnima.
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
 * Adhika detection: a New Moon falls within each Purnimant period. If the
 * Sun's sidereal sign at that New Moon is the same as at the following New
 * Moon, no Sankranti occurred during the lunar month → Adhika. This is the
 * SAME astronomical criterion as Amant, applied independently to each
 * Purnimant period.
 */
// Cache by `${year}:${timezone}`. The astronomical computation is
// timezone-independent (uses UT conjunctions), but the rendered
// startDate/endDate strings DO depend on timezone — a Full Moon at
// 22:00 UTC on Dec 24 reads as Dec 24 in UTC but Dec 25 in Asia/Kolkata.
// Cache key includes timezone so consumers that pass different TZs
// don't collide. Cache lives for the process lifetime; size bounded
// by (years × timezones), typically <20 entries.
// Gemini PR #355 round-1 MEDIUM (caching) + round-2 HIGH (TZ alignment).
const purnimantCache = new Map<string, HinduMonth[]>();

/**
 * @param year — anchor year
 * @param timezone — IANA timezone for startDate/endDate emission.
 *   Default 'UTC' preserves prior behaviour for callers that don't
 *   care about TZ. tithi-table passes its caller's TZ (typically
 *   Asia/Kolkata) so the dates align with raw sunriseDate entries.
 */
export function computePurnimantMonths(year: number, timezone: string = 'UTC'): HinduMonth[] {
  const cacheKey = `${year}:${timezone}`;
  if (purnimantCache.has(cacheKey)) return purnimantCache.get(cacheKey)!;
  // Look back 3 years to clear any in-flight post-Adhika sequential
  // shift before reaching the target year. Adhika Masa repeats every
  // ~32 months, so 3 years (36 months) is always enough to start with
  // a clean state machine. Bug confirmed against Drik Panchang for
  // year 2027 (which follows 2026 Adhika Jyeshtha): without this
  // lookback, the first ~7 entries are off-by-one (e.g. Dec 24 2026 →
  // Jan 22 2027 was labelled "Magha" but Drik confirms "Pausha").
  const PURNIMANT_LOOKBACK_YEARS = 3;
  const fullMoons = findFullMoons(year, PURNIMANT_LOOKBACK_YEARS);
  const newMoons = findNewMoons(year, PURNIMANT_LOOKBACK_YEARS);
  if (fullMoons.length < 2 || newMoons.length < 2) return [];

  // Step 1: For each Purnimant period, detect Adhika using the New Moon criterion.
  // Also find the Sankranti sign for naming.
  interface RawMonth {
    fmDate: Date; nextFmDate: Date; fmJD: number; nextFmJD: number;
    isAdhika: boolean; adhikaMasaIdx: number; sankrantiSign: number;
  }
  const raw: RawMonth[] = [];

  for (let i = 0; i < fullMoons.length - 1; i++) {
    const { date: fmDate, jd: fmJD } = fullMoons[i];
    const { date: nextFmDate, jd: nextFmJD } = fullMoons[i + 1];

    // Sankranti detection
    const startSunSid = ((sunLongitude(fmJD) - getAyanamsha(fmJD)) % 360 + 360) % 360;
    let prevSign = getRashiNumber(startSunSid);
    let sankrantiSign = -1;
    for (let jd = fmJD + 0.5; jd <= nextFmJD; jd += 1.0) {
      const sunSid = ((sunLongitude(jd) - getAyanamsha(jd)) % 360 + 360) % 360;
      const sign = getRashiNumber(sunSid);
      if (sign !== prevSign) { sankrantiSign = sign; break; }
      prevSign = sign;
    }
    if (sankrantiSign === -1) {
      const endSunSid = ((sunLongitude(nextFmJD) - getAyanamsha(nextFmJD)) % 360 + 360) % 360;
      sankrantiSign = Math.floor(endSunSid / 30) + 1;
    }

    // Adhika detection: NM within this period, same Sun sign at both NMs
    let isAdhika = false;
    let adhikaMasaIdx = -1;
    for (let n = 0; n < newMoons.length - 1; n++) {
      const { jd: nmJD } = newMoons[n];
      const { jd: nextNmJD } = newMoons[n + 1];
      if (nmJD > fmJD && nmJD < nextFmJD) {
        const nmSunSid = ((sunLongitude(nmJD) - getAyanamsha(nmJD)) % 360 + 360) % 360;
        const nmSign = Math.floor(nmSunSid / 30) + 1;
        const nextNmSunSid = ((sunLongitude(nextNmJD) - getAyanamsha(nextNmJD)) % 360 + 360) % 360;
        const nextNmSign = Math.floor(nextNmSunSid / 30) + 1;
        if (nmSign === nextNmSign) {
          isAdhika = true;
          adhikaMasaIdx = getMasaFromSunSign(nmSign);
        }
        break;
      }
    }

    raw.push({ fmDate, nextFmDate, fmJD, nextFmJD, isAdhika, adhikaMasaIdx, sankrantiSign });
  }

  // Step 2: Assign month names. When Adhika occurs, the Adhika and the next month
  // (nija) share the same name. The Sankranti naming resumes after the nija month.
  const months: HinduMonth[] = [];
  let monthCounter = 0;
  let nijaNeeded = -1; // if >= 0, the next month must be this masaIdx (nija after Adhika)
  let sequentialIdx = -1; // if >= 0, post-Adhika sequential naming (Adhika absorbed one Sankranti)

  for (const r of raw) {
    let masaIdx: number;
    let isAdhika = false;

    if (nijaNeeded >= 0) {
      // This month is the nija (regular) after the Adhika  –  same name
      masaIdx = nijaNeeded;
      // After nija, resume sequential naming from (nijaIdx + 1)
      sequentialIdx = (nijaNeeded + 1) % 12;
      nijaNeeded = -1;
    } else if (r.isAdhika) {
      // This month is Adhika  –  name from the NM Sun sign
      masaIdx = r.adhikaMasaIdx >= 0 ? r.adhikaMasaIdx : getMasaFromSunSign(r.sankrantiSign);
      isAdhika = true;
      nijaNeeded = masaIdx; // next month must be nija with same name
    } else if (sequentialIdx >= 0) {
      // Post-Adhika: use sequential naming (Adhika absorbed one Sankranti)
      masaIdx = sequentialIdx;
      sequentialIdx = (sequentialIdx + 1) % 12;
    } else {
      // Pre-Adhika: normal Sankranti-based naming
      masaIdx = getMasaFromSunSign(r.sankrantiSign);
    }

    const startStr = fmtDateInTimezone(r.fmDate, timezone);
    const endStr = fmtDateInTimezone(r.nextFmDate, timezone);

    if (r.fmDate.getUTCFullYear() === year || r.nextFmDate.getUTCFullYear() === year) {
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
  }

  purnimantCache.set(cacheKey, months);
  return months;
}

/**
 * Format a JS Date as YYYY-MM-DD in the specified IANA timezone. Used
 * by `computePurnimantMonths` to emit boundary dates aligned with the
 * caller's local timezone. UTC fast-path avoids the Intl call.
 */
function fmtDateInTimezone(date: Date, timezone: string): string {
  if (timezone === 'UTC') {
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value ?? '';
  const m = parts.find(p => p.type === 'month')?.value ?? '';
  const d = parts.find(p => p.type === 'day')?.value ?? '';
  return `${y}-${m}-${d}`;
}

/**
 * Shift an ISO date string (YYYY-MM-DD) by `delta` calendar days.
 * Used by Amanta month builders to derive Pratipada (= NM day + 1) from
 * the NM's local-date string. Works in calendar-date space (not Date
 * arithmetic) so DST transitions don't shift the result by an hour.
 */
export function addDaysToISO(iso: string, delta: number): string {
  const d = new Date(iso + 'T12:00:00Z');  // noon UTC avoids DST edges
  d.setUTCDate(d.getUTCDate() + delta);
  return `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`;
}

/**
 * Layer of an Adhika "sandwich" in Purnimanta display.
 *   • top     = Krishna Paksha of the surrounding nija month (Purnima → Amavasya)
 *   • filling = the Adhika month itself, sized to the Amanta NM-to-NM lunation
 *   • bottom  = Shukla Paksha of the surrounding nija month (Amavasya → Purnima)
 */
export type PurnimantSandwichLayer = 'top' | 'filling' | 'bottom';

/** Purnimant month with optional sandwich-layer marker for Adhika display. */
export interface ExpandedPurnimantMonth extends Omit<HinduMonth, 'n'> {
  n: number | '';
  sandwichLayer?: PurnimantSandwichLayer;
}

/**
 * Purnimant Hindu months with Adhika "sandwich" expansion.
 *
 * In Purnimanta convention, the Adhika lunation is the SAME astronomical
 * event as in Amanta (NM-to-NM where Sun stays in one sidereal sign for
 * the entire lunation, i.e. no sankranti). The two systems differ only
 * in how they LABEL the surrounding month — but the TITHIS marked Adhika
 * must be identical, because there is only one Adhika lunation per ~32
 * months in the sky.
 *
 * To enforce that identity, this helper expands the Adhika + next nija
 * Purnimant rows into THREE display layers:
 *
 *   1. <Month> Krishna   (Purnima → Amavasya — first half of the nija
 *                          month per Purnimanta convention)
 *   2. Adhika <Month>    (Amavasya → Amavasya — AMANTA NM-to-NM dates,
 *                          same as the Adhika row in the Amanta calendar)
 *   3. <Month> Shukla    (Amavasya → Purnima — second half of the nija
 *                          month)
 *
 * The Adhika row's dates come from `computeHinduMonths` (Amanta) so a
 * tithi flagged Adhika in one system is flagged Adhika in the other.
 * This is the canonical convention used by Drik Panchang, Maithili
 * panji, and most Bhojpuri/UP/Bihar regional calendars.
 *
 * Single source of truth for Adhika date ranges in Purnimanta display —
 * DO NOT reinvent this in consumer pages. /calendars/masa and the
 * /regional Mithila card both call this helper.
 */
export function computePurnimantMonthsWithAdhikaSandwich(
  year: number,
  timezone: string = 'UTC',
): ExpandedPurnimantMonth[] {
  const purnimant = computePurnimantMonths(year, timezone);
  const amant = computeHinduMonths(year, timezone);

  const out: ExpandedPurnimantMonth[] = [];
  const skipNext = new Set<number>();

  for (let idx = 0; idx < purnimant.length; idx++) {
    if (skipNext.has(idx)) continue;
    const m = purnimant[idx];
    const nextM = purnimant[idx + 1];

    if (m.isAdhika && nextM && !nextM.isAdhika) {
      const baseName = m.en.replace('Adhika ', '');
      // Sanskrit joins the prefix without a space (अधिकज्येष्ठः) while
      // Hindi inserts one (अधिक ज्येष्ठ); match either with `^अधिक\s*`
      // so the top/bottom sandwich layers don't inherit the Adhika prefix.
      const baseHi = m.hi.replace(/^अधिक\s*/, '');
      const baseSa = m.sa.replace(/^अधिक\s*/, '');
      const amAdhika = amant.find((a) => a.isAdhika);
      const adhikaStart = amAdhika?.startDate || m.startDate;
      const adhikaEnd = amAdhika?.endDate || m.endDate;

      // Inclusive [start, end] boundaries so `<=` lookup never double-claims
      // a day: top ends the day BEFORE Adhika Pratipada (= Vaishakha
      // Amavasya); bottom starts the day AFTER Adhika's second Amavasya
      // (= Nija Pratipada). The filling owns both Adhika boundary days.
      out.push({
        n: '',
        en: `${baseName} Krishna`,
        hi: `${baseHi} कृष्ण`,
        sa: `${baseSa} कृष्ण`,
        startDate: m.startDate,
        endDate: addDaysToISO(adhikaStart, -1),
        ritu: m.ritu,
        ayana: m.ayana,
        isAdhika: false,
        sandwichLayer: 'top',
      });
      out.push({
        n: '',
        en: m.en,
        hi: m.hi,
        sa: m.sa,
        startDate: adhikaStart,
        endDate: adhikaEnd,
        ritu: m.ritu,
        ayana: m.ayana,
        isAdhika: true,
        sandwichLayer: 'filling',
      });
      out.push({
        n: '',
        en: `${baseName} Shukla`,
        hi: `${baseHi} शुक्ल`,
        sa: `${baseSa} शुक्ल`,
        startDate: addDaysToISO(adhikaEnd, 1),
        endDate: nextM.endDate,
        ritu: nextM.ritu,
        ayana: nextM.ayana,
        isAdhika: false,
        sandwichLayer: 'bottom',
      });
      skipNext.add(idx + 1);
    } else {
      out.push({ ...m });
    }
  }

  return out;
}

/**
 * Enforcement: verify Amant and Purnimant agree on the number of Adhika months.
 * Both systems view the same astronomical reality  –  if they disagree, there's a bug.
 */
export function verifyMasaConsistency(year: number): { ok: boolean; message: string } {
  const amant = computeHinduMonths(year);
  const purnimant = computePurnimantMonths(year);
  const amAdhika = amant.filter(m => m.isAdhika);
  const puAdhika = purnimant.filter(m => m.isAdhika);

  if (amAdhika.length !== puAdhika.length) {
    return { ok: false, message: `Adhika count mismatch for ${year}: Amant=${amAdhika.length} (${amAdhika.map(m => m.en).join(',')}), Purnimant=${puAdhika.length} (${puAdhika.map(m => m.en).join(',')})` };
  }

  // Both should name the Adhika month the same (the underlying lunar month is the same)
  if (amAdhika.length > 0 && puAdhika.length > 0) {
    const amName = amAdhika[0].en.replace('Adhika ', '');
    const puName = puAdhika[0].en.replace('Adhika ', '');
    if (amName !== puName) {
      return { ok: false, message: `Adhika name mismatch for ${year}: Amant="${amAdhika[0].en}", Purnimant="${puAdhika[0].en}"` };
    }
  }

  return { ok: true, message: `${year}: ${amAdhika.length} Adhika month(s), Amant and Purnimant agree.` };
}

// Default India-anchored coordinates for Hindu month computation. Used
// when callers don't specify a location. Delhi was chosen because it's
// the most commonly-used reference city for pan-Indian Hindu calendars
// and panchang publications. Any location inside India produces the
// same lunar month boundaries to within sub-minute precision (lat/lon
// only affects sunrise time used for tithi panchang-day attribution).
const DEFAULT_INDIA_LAT = 28.6139;     // Delhi
const DEFAULT_INDIA_LON = 77.2090;
const DEFAULT_INDIA_TIMEZONE = 'Asia/Kolkata';

// Canonical lowercase masa order used by tithi-table's `lunarMonths[].name`
// — must match `MASA_DATA` order (Chaitra=0, Vaishakha=1, ..., Phalguna=11).
const CANONICAL_MASA_ORDER = [
  'chaitra', 'vaishakha', 'jyeshtha', 'ashadha',
  'shravana', 'bhadrapada', 'ashwina', 'kartika',
  'margashirsha', 'pausha', 'magha', 'phalguna',
] as const;

/**
 * Find the panchang-day sunriseDate for a moment T given lat/lon/timezone.
 *
 *   • If T falls AFTER sunrise of T's calendar day → panchang day = T's
 *     date (Amavasya is at the day's sunrise just ended).
 *   • If T falls BEFORE sunrise of T's calendar day → panchang day = T - 1.
 *
 * Matches the convention used by `tithi-table.ts` for `nm.sunriseDate`,
 * so Amanta month boundaries from `computeHinduMonths` align with
 * `tithi-table.lunarMonths` to the day.
 */
function panchangDayForJD(jd: number, lat: number, lon: number, timezone: string): string {
  const { year: y, month: m, day: d } = jdToGregorianUTC(jd);
  const srUT = sunriseUTHoursOr(dateToJD(y, m, d, 12), lat, lon, 0, 6).value;
  const srJd = dateToJD(y, m, d, srUT);
  const dateJd = jd < srJd ? jd - 1 : jd;
  return jdToLocalDateStrFromJD(dateJd, timezone);
}

function jdToGregorianUTC(jd: number): { year: number; month: number; day: number } {
  const jdInt = Math.floor(jd + 0.5);
  const a = jdInt + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const dd = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * dd) / 4);
  const mm = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * mm + 2) / 5) + 1,
    month: mm + 3 - 12 * Math.floor(mm / 10),
    year: 100 * b + dd - 4800 + Math.floor(mm / 10),
  };
}

function jdToLocalDateStrFromJD(jd: number, timezone: string): string {
  const utcMs = (jd - 2440587.5) * 86400000;
  return fmtDateInTimezone(new Date(utcMs), timezone);
}

/**
 * Find the precise JD at which Sun-Moon elongation reaches `targetDeg`
 * (relative to NM at 0°) within ±1 day of a starting JD.
 * Used to find the END of Pratipada (elongation = 12°) for kshaya detection.
 */
function findElongationCrossing(startJd: number, targetDeg: number, withinDays = 1.5): number {
  let lo = startJd;
  let hi = startJd + withinDays;
  for (let iter = 0; iter < 30; iter++) {
    const mid = (lo + hi) / 2;
    const elong = ((moonLongitude(mid) - sunLongitude(mid)) + 360) % 360;
    if (elong < targetDeg) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Find the panchang day of the Shukla Pratipada that follows the NM at
 * `nmJd`. Two cases:
 *
 *   • Non-kshaya (typical): there's a sunrise S between nmJd and the
 *     end of Pratipada (elongation 12°). Pratipada panchang day = date of S.
 *   • Kshaya: Pratipada starts and ends entirely between two sunrises
 *     (no sunrise inside it). Per Drik convention, attribute it to the
 *     panchang day OF THE NM ITSELF (= Amavasya's panchang day).
 *
 * This is the kshaya-aware equivalent of `nm.sunriseDate + 1`.
 */
function pratipadaPanchangDay(nmJd: number, lat: number, lon: number, timezone: string): string {
  const pratipadaEndJd = findElongationCrossing(nmJd, 12, 1.5);
  // Walk forward day-by-day; check each sunrise against [nmJd, pratipadaEndJd]
  for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
    const probeJd = nmJd + dayOffset;
    const { year: y, month: m, day: d } = jdToGregorianUTC(probeJd);
    const srUT = sunriseUTHoursOr(dateToJD(y, m, d, 12), lat, lon, 0, 6).value;
    const srJd = dateToJD(y, m, d, srUT);
    if (srJd >= nmJd && srJd < pratipadaEndJd) {
      // Non-kshaya: this sunrise falls inside Pratipada.
      return jdToLocalDateStrFromJD(srJd, timezone);
    }
  }
  // Kshaya: no sunrise inside Pratipada. Attribute to NM's panchang day.
  return panchangDayForJD(nmJd, lat, lon, timezone);
}

/**
 * Compute Amant Hindu months with exact Gregorian dates for a given year.
 * Returns 12-13 months (13 if there's an Adhika Masa).
 *
 * Month boundaries follow the classical Amanta convention:
 *   • startDate = Shukla Pratipada panchang day (kshaya-aware — if
 *     Pratipada tithi never reaches a sunrise, attributed to the
 *     Amavasya day itself per Drik convention).
 *   • endDate = next Amavasya panchang day (sunriseDate of next NM).
 *
 * Coordinates default to Delhi + Asia/Kolkata, the standard reference
 * for pan-Indian Hindu calendars. Different lat/lon shift the panchang
 * day for the Amavasya/Pratipada boundary by at most ±1 day.
 */
export function computeHinduMonths(
  year: number,
  timezone: string = DEFAULT_INDIA_TIMEZONE,
  lat: number = DEFAULT_INDIA_LAT,
  lon: number = DEFAULT_INDIA_LON,
): HinduMonth[] {
  const newMoons = findNewMoons(year);
  if (newMoons.length < 2) return [];

  const months: HinduMonth[] = [];
  let monthCounter = 0;

  for (let i = 0; i < newMoons.length - 1; i++) {
    const { jd: nmJD } = newMoons[i];
    const { jd: nextNmJD } = newMoons[i + 1];

    // Sun's sidereal sign at the EXACT New Moon moment.
    const tropSun = sunLongitude(nmJD);
    const ayanamsha = getAyanamsha(nmJD);
    const sidSun = ((tropSun - ayanamsha) + 360) % 360;
    const sunSign = Math.floor(sidSun / 30) + 1;

    // Adhika = Sun is in the same sidereal sign at both this and the next NM.
    const nextTropSun = sunLongitude(nextNmJD);
    const nextAya = getAyanamsha(nextNmJD);
    const nextSidSun = ((nextTropSun - nextAya) + 360) % 360;
    const nextSunSign = Math.floor(nextSidSun / 30) + 1;
    const isAdhika = sunSign === nextSunSign;

    const masaIdx = getMasaFromSunSign(sunSign);

    // Pratipada panchang day (kshaya-aware) and next Amavasya panchang day.
    const startStr = pratipadaPanchangDay(nmJD, lat, lon, timezone);
    const endStr = panchangDayForJD(nextNmJD, lat, lon, timezone);

    // Only include months that overlap the target year.
    const startYear = parseInt(startStr.substring(0, 4), 10);
    const endYear = parseInt(endStr.substring(0, 4), 10);
    if (startYear === year || endYear === year) {
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
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Inclusive on both ends: endDate is the Amavasya panchang day, which
  // classically belongs to the current Amanta month (Krishna 30 is the
  // last tithi of Krishna paksha). Strict `<` exclusion produced 6-8
  // null-lookup gap days per year (every Amavasya whose next-month
  // Pratipada attribution lands +1 day), silently falling back to the
  // solar `getMasa` approximation. Drik Panchang Delhi cross-checked
  // 2026-02-17/04-17/07-14/08-12/09-11/10-10/11-09/12-08 — every gap
  // day belongs to the prior month under inclusive containment.
  const searchYear = (y: number): LunarMasaResult | null => {
    if (!_monthCache.has(y)) {
      _monthCache.set(y, computeHinduMonths(y));
    }
    const months = _monthCache.get(y)!;
    for (const m of months) {
      if (dateStr >= m.startDate && dateStr <= m.endDate) {
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
    return null;
  };

  // Mirror getPurnimantMasaForDate (Gemini #432): lunar months are
  // anchored to the local-day boundary, so a date can only span into the
  // adjacent calendar year near the year edges. Try `year` first; only
  // widen to year-1 (when month === 1) or year+1 (when month === 12).
  // Falls back to `null` so the caller can apply the solar approximation.
  const here = searchYear(year);
  if (here) return here;
  if (month === 1) return searchYear(year - 1);
  if (month === 12) return searchYear(year + 1);
  return null;
}

/**
 * Look up the Purnimanta lunar month for a specific date.
 *
 * Single source of truth shared with `/calendars/masa`: uses the same
 * `computePurnimantMonthsWithAdhikaSandwich` engine. Without this lookup
 * the panchang page would hand-roll its own Adhika rules and drift away
 * from the masa page (Lesson M).
 *
 * The sandwich engine labels the two paksha-shaped slices that border an
 * Adhika lunation as "<Masa> Krishna" / "<Masa> Shukla". The panchang
 * page already shows paksha separately, so this helper strips that
 * suffix and returns just the masa name.
 */
const _purnimantMonthCache = new Map<number, ExpandedPurnimantMonth[]>();

export function getPurnimantMasaForDate(year: number, month: number, day: number): LunarMasaResult | null {
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Inclusive containment (see getLunarMasaForDate for rationale). The
  // sandwich helper has already bumped top.endDate and bottom.startDate
  // off the filling so the Adhika boundary days unambiguously resolve
  // to the filling layer.
  const searchYear = (y: number): LunarMasaResult | null => {
    if (!_purnimantMonthCache.has(y)) {
      _purnimantMonthCache.set(y, computePurnimantMonthsWithAdhikaSandwich(y, DEFAULT_INDIA_TIMEZONE));
    }
    const months = _purnimantMonthCache.get(y)!;
    for (const m of months) {
      if (dateStr >= m.startDate && dateStr <= m.endDate) {
        // Strip " Krishna"/" Shukla" suffix that sandwich top/bottom layers
        // add — the panchang page renders paksha as a separate field.
        const displayEn = m.en.replace(/ (Krishna|Shukla)$/, '');
        const displayHi = m.hi.replace(/ (कृष्ण|शुक्ल)$/, '');
        const displaySa = m.sa.replace(/ (कृष्ण|शुक्ल)$/, '');
        const baseName = displayEn.replace(/^Adhika /, '');
        const idx = MASA_DATA.findIndex(d => d.en === baseName);
        return {
          masaIdx: idx >= 0 ? idx : 0,
          name: { en: displayEn, hi: displayHi, sa: displaySa },
          isAdhika: m.isAdhika,
          ritu: m.ritu,
          ayana: m.ayana,
        };
      }
    }
    return null;
  };

  // Lunar months are anchored to the local-day boundary, so a date
  // can only span into the adjacent calendar year near the year edges.
  // Try `year` first; only widen to year-1/year+1 if Jan/Dec miss.
  const here = searchYear(year);
  if (here) return here;
  if (month === 1) return searchYear(year - 1);
  if (month === 12) return searchYear(year + 1);
  return null;
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
