/**
 * Hindu Festival Calendar Engine
 *
 * Computes approximate dates for major Hindu festivals and Vrat days
 * for a given year using astronomical calculations.
 *
 * Festivals are tied to Tithi, Nakshatra, or solar events.
 */

import { dateToJD, sunLongitude, moonLongitude, toSidereal, calculateTithi, normalizeDeg, approximateSunrise, approximateSunset, formatTime } from '@/lib/ephem/astronomical';
import { generateEclipseCalendar } from '@/lib/calendar/eclipses';
import { getHinduMonth, getEkadashiName } from '@/lib/constants/festival-details';
import type { Trilingual } from '@/types/panchang';

export interface FestivalEntry {
  name: Trilingual;
  date: string;        // YYYY-MM-DD
  tithi?: string;      // e.g. "Chaitra Shukla 9"
  type: 'major' | 'vrat' | 'regional' | 'eclipse';
  category: 'festival' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham' | 'sankranti' | 'eclipse';
  description: Trilingual;
  slug?: string;       // Key for looking up rich details in FESTIVAL_DETAILS
  // Parana (fast-breaking) info
  paranaDate?: string;            // YYYY-MM-DD (often next day)
  paranaStart?: string;           // HH:MM — start of recommended window
  paranaEnd?: string;             // HH:MM — end of recommended window
  paranaNote?: Trilingual;        // Instructions for breaking fast
  paranaSunrise?: string;         // HH:MM — sunrise on parana day
  paranaHariVasaraEnd?: string;   // HH:MM — end of Hari Vasara (1/4 daytime)
  paranaDwadashiEnd?: string;     // HH:MM — when Dwadashi tithi ends
  paranaEarlyEnd?: boolean;       // true if Dwadashi ends before Hari Vasara
  paranaMadhyahnaStart?: string;  // HH:MM — start of Madhyahna (midday, avoid parana)
  paranaMadhyahnaEnd?: string;    // HH:MM — end of Madhyahna
  // Eclipse info
  eclipseType?: 'solar' | 'lunar';
  eclipseMagnitude?: string; // 'total' | 'partial' | 'annular' | 'penumbral'
  eclipseMaxTime?: string;   // HH:MM approx
  sutakStart?: string;       // HH:MM
  sutakEnd?: string;         // HH:MM
  sutakApplicable?: boolean;
  eclipsePhases?: { name: Trilingual; time: string }[];
}

/**
 * Find the Gregorian date when a specific tithi occurs.
 * Scans from a start date forward until the target tithi is found at sunrise.
 */
function findTithiDate(year: number, month: number, targetTithi: number, lat: number = 28.6): string {
  // Start scanning from the 1st of the given month
  for (let day = 1; day <= 31; day++) {
    try {
      const jd = dateToJD(year, month, day, 6); // ~sunrise UT for India
      const { number } = calculateTithi(jd);
      if (number === targetTithi) {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
    } catch {
      break; // invalid date
    }
  }
  return `${year}-${month.toString().padStart(2, '0')}-15`; // fallback
}

/**
 * Find Purnima (tithi 15) dates for each month.
 */
function findPurnimaDate(year: number, month: number): string {
  return findTithiDate(year, month, 15);
}

/**
 * Find Amavasya (tithi 30) dates for each month.
 */
function findAmavasyaDate(year: number, month: number): string {
  return findTithiDate(year, month, 30);
}

/**
 * Find Ekadashi (tithi 11 and 26) dates.
 * Shukla Ekadashi = tithi 11, Krishna Ekadashi = tithi 26
 */
function findEkadashiDates(year: number, month: number): { shukla: string; krishna: string } {
  return {
    shukla: findTithiDate(year, month, 11),
    krishna: findTithiDate(year, month, 26),
  };
}

/**
 * Find Chaturthi (tithi 4 — Shukla, tithi 19 — Krishna) dates.
 */
function findChaturthiDate(year: number, month: number): string {
  return findTithiDate(year, month, 19); // Sankashti = Krishna Chaturthi
}

/**
 * Find Pradosham (tithi 13 — trayodashi) dates.
 */
function findPradoshamDates(year: number, month: number): { shukla: string; krishna: string } {
  return {
    shukla: findTithiDate(year, month, 13),
    krishna: findTithiDate(year, month, 28),
  };
}

/**
 * Find Sankranti date (Sun enters a new sidereal sign).
 */
function findSankrantiDate(year: number, targetSign: number): string {
  // Scan day by day to find when Sun's sidereal longitude crosses into target sign
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 28; day++) {
      const jd = dateToJD(year, month, day, 6);
      const sunSid = normalizeDeg(toSidereal(sunLongitude(jd), jd));
      const sign = Math.floor(sunSid / 30) + 1;
      if (sign === targetSign) {
        // Check if previous day was different sign
        const jdPrev = dateToJD(year, month, day - 1, 6);
        const prevSid = normalizeDeg(toSidereal(sunLongitude(jdPrev), jdPrev));
        const prevSign = Math.floor(prevSid / 30) + 1;
        if (prevSign !== targetSign) {
          return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        }
      }
    }
  }
  return `${year}-01-14`; // fallback
}

// ──────────────────────────────────────────────────────────────
// Parana (fast-breaking) computation helpers
// ──────────────────────────────────────────────────────────────

const DEFAULT_LAT = 28.6139; // New Delhi (fallback only)
const DEFAULT_LON = 77.209;
const DEFAULT_TZ = 5.5;

/** Get next day string from a YYYY-MM-DD date */
function nextDay(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`;
}

/** Approximate moonrise time for a given tithi number.
 *  Moon rises ~50 min later each day. At Purnima (tithi 15) = sunset.
 *  At Amavasya (tithi 30) = sunrise. Tithi 1 = sunrise + ~50min.
 *  For Krishna paksha tithis (16-30): moonrise is after sunset.
 */
function approxMoonrise(tithiNum: number, sunriseUT: number, sunsetUT: number): number {
  if (tithiNum <= 15) {
    // Shukla paksha: moonrise between sunrise and sunset+few hours
    // Tithi 1 → sunrise + ~50min; Tithi 15 → ~sunset
    const fraction = (tithiNum - 1) / 14;
    return sunriseUT + fraction * (sunsetUT - sunriseUT);
  } else {
    // Krishna paksha: moonrise between sunset and next sunrise
    // Tithi 16 → sunset + ~50min; Tithi 30 → ~next sunrise
    const fraction = (tithiNum - 16) / 14;
    const nightDuration = 24 - (sunsetUT - sunriseUT);
    return sunsetUT + fraction * nightDuration;
  }
}

/**
 * Compute Ekadashi parana window with precise Dwadashi end, Hari Vasara, and Madhyahna times.
 *
 * Rules (from Dharma Sindhu / Nirnaya Sindhu):
 * 1. Parana is done on Dwadashi (the day after Ekadashi)
 * 2. Must be done AFTER sunrise
 * 3. Must AVOID Hari Vasara = first 1/4 of Dwadashi tithi duration (not 1/4 of daytime)
 * 4. Must AVOID Madhyahna = the middle 1/5th of daytime (approx. local noon ± ~1.2 hours)
 * 5. Parana MUST be completed BEFORE Dwadashi tithi ends
 * 6. If Dwadashi ends before Hari Vasara ends, break fast before Dwadashi ends (exception)
 * 7. If the only available window falls in Madhyahna, break fast after Madhyahna ends
 *    but before Dwadashi ends
 */
function computeEkadashiParana(ekadashiDate: string, lat = DEFAULT_LAT, lon = DEFAULT_LON, tz = DEFAULT_TZ): {
  paranaDate: string; paranaStart: string; paranaEnd: string; paranaNote: Trilingual;
  paranaSunrise: string; paranaHariVasaraEnd: string; paranaDwadashiEnd: string; paranaEarlyEnd: boolean;
  paranaMadhyahnaStart?: string; paranaMadhyahnaEnd?: string;
} {
  const paranaDate = nextDay(ekadashiDate);
  const [y, m, d] = paranaDate.split('-').map(Number);
  const jdRef = dateToJD(y, m, d, 6);
  const sunriseUT = approximateSunrise(jdRef, lat, lon);
  const sunsetUT = approximateSunset(jdRef, lat, lon);

  // Determine which Dwadashi tithi to track (12 for Shukla, 27 for Krishna)
  const [ey, em, ed] = ekadashiDate.split('-').map(Number);
  const ekJd = dateToJD(ey, em, ed, approximateSunrise(dateToJD(ey, em, ed, 6), lat, lon));
  const ekTithi = calculateTithi(ekJd).number;
  const dwadashiNum = ekTithi <= 15 ? 12 : 27;

  const baseJd = dateToJD(y, m, d, sunriseUT);

  // ─── Binary search helper: find exact hour (relative to baseJd) where tithi transitions ───
  function findTithiTransition(startH: number, endH: number, fromTithi: number, toTithi: number): number | null {
    // Coarse scan first (10-min steps)
    let foundRange: [number, number] | null = null;
    for (let h = startH; h <= endH; h += 10 / 60) {
      const t = calculateTithi(baseJd + h / 24).number;
      if (t === toTithi) {
        foundRange = [h - 10 / 60, h];
        break;
      }
    }
    if (!foundRange) return null;
    // Binary search to 1-minute precision
    let lo = foundRange[0], hi = foundRange[1];
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2;
      const t = calculateTithi(baseJd + mid / 24).number;
      if (t === toTithi) hi = mid; else lo = mid;
    }
    return hi;
  }

  // ─── Find Dwadashi START ───
  const tithiAtSunrise = calculateTithi(baseJd).number;
  let dwadashiStartH: number = 0;

  if (tithiAtSunrise === dwadashiNum) {
    // Dwadashi already active at sunrise — scan backward to find when it started
    // Use 10-min steps backward, then binary search
    let foundStart = false;
    for (let h = -10 / 60; h >= -40; h -= 10 / 60) {
      if (calculateTithi(baseJd + h / 24).number !== dwadashiNum) {
        // Transition found between h and h + 10/60
        let lo = h, hi = h + 10 / 60;
        for (let i = 0; i < 12; i++) {
          const mid = (lo + hi) / 2;
          if (calculateTithi(baseJd + mid / 24).number !== dwadashiNum) lo = mid; else hi = mid;
        }
        dwadashiStartH = hi;
        foundStart = true;
        break;
      }
    }
    if (!foundStart) dwadashiStartH = -30; // started >40h ago (very rare, use reasonable fallback)
  } else {
    // Dwadashi hasn't started yet — scan forward
    const transition = findTithiTransition(0, 24, tithiAtSunrise, dwadashiNum);
    dwadashiStartH = transition ?? 6; // fallback: ~6h after sunrise
  }

  // ─── Find Dwadashi END ───
  // Scan forward from Dwadashi start (or sunrise, whichever is later) to find when it ends
  const scanFrom = Math.max(dwadashiStartH + 0.5, 0);
  let dwadashiEndH: number | null = null;
  for (let h = scanFrom; h <= 48; h += 10 / 60) {
    const t = calculateTithi(baseJd + h / 24).number;
    if (t !== dwadashiNum) {
      // Binary search between h - 10/60 and h
      let lo = h - 10 / 60, hi = h;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (calculateTithi(baseJd + mid / 24).number === dwadashiNum) lo = mid; else hi = mid;
      }
      dwadashiEndH = lo;
      break;
    }
  }
  if (dwadashiEndH === null) dwadashiEndH = dwadashiStartH + 24; // fallback: assume ~24h duration

  const dwadashiStartUT = sunriseUT + dwadashiStartH;
  const dwadashiEndUT   = sunriseUT + dwadashiEndH;
  const dwadashiDuration = dwadashiEndUT - dwadashiStartUT;

  // ─── Hari Vasara = first 1/4 of Dwadashi tithi duration ───
  const hariVasaraEndUT = dwadashiStartUT + dwadashiDuration / 4;

  // Did Hari Vasara already end before parana day sunrise?
  const hariVasaraAlreadyOver = hariVasaraEndUT <= sunriseUT;

  // ─── Madhyahna = middle 1/5th of daytime ───
  const dayLength = sunsetUT - sunriseUT;
  const madhyahnaStartUT = sunriseUT + dayLength * (2 / 5);
  const madhyahnaEndUT   = sunriseUT + dayLength * (3 / 5);

  // ─── Format times ───
  const ft = (ut: number) => formatTime(((ut % 24) + 24) % 24, tz);
  const sunriseStr = ft(sunriseUT);
  const hvEndStr = hariVasaraAlreadyOver ? '' : ft(hariVasaraEndUT); // don't show misleading time
  const dwEndStr = ft(dwadashiEndUT);
  const madhStartStr = ft(madhyahnaStartUT);
  const madhEndStr = ft(madhyahnaEndUT);

  // ─── Determine recommended parana window ───
  // Three constraints:
  // (A) After Hari Vasara ends (or after sunrise if HV already over)
  // (B) Outside Madhyahna
  // (C) Before Dwadashi tithi ends

  // Effective earliest start (after HV or sunrise)
  const earliestUT = hariVasaraAlreadyOver ? sunriseUT : Math.max(hariVasaraEndUT, sunriseUT);

  // Check if Dwadashi ends before we can even start (rare edge case)
  const earlyEnd = dwadashiEndUT <= earliestUT;

  let recStartUT: number;
  let recEndUT: number;
  let madhyahnaConflict = false;

  if (earlyEnd) {
    // Dwadashi ends before Hari Vasara or sunrise — must break fast ASAP after sunrise
    recStartUT = sunriseUT;
    recEndUT = dwadashiEndUT;
  } else {
    // Normal: from earliest start to Dwadashi end
    recStartUT = earliestUT;
    recEndUT = dwadashiEndUT;

    // Now exclude Madhyahna from the window
    if (recStartUT < madhyahnaEndUT && recEndUT > madhyahnaStartUT) {
      if (recStartUT < madhyahnaStartUT) {
        // Pre-Madhyahna window exists — prefer it
        recEndUT = Math.min(recEndUT, madhyahnaStartUT);
      } else if (madhyahnaEndUT < recEndUT) {
        // Must wait until after Madhyahna
        recStartUT = madhyahnaEndUT;
        madhyahnaConflict = true;
      } else {
        // Entire window is within Madhyahna AND Dwadashi ends during Madhyahna
        // Dwadashi constraint overrides — break before Dwadashi ends (rare)
        madhyahnaConflict = true;
      }
    }
  }

  const recStartStr = ft(recStartUT);
  const recEndStr = ft(recEndUT);
  const hvDisplayStr = hariVasaraAlreadyOver
    ? (sunriseStr) // show sunrise since HV is already over
    : ft(hariVasaraEndUT);

  // ─── Build notes ───
  const hvStatus = hariVasaraAlreadyOver
    ? { en: 'Hari Vasara ended before sunrise — no restriction.', hi: 'हरि वासर सूर्योदय से पहले समाप्त — कोई प्रतिबन्ध नहीं।', sa: 'हरिवासरः सूर्योदयात् पूर्वं समाप्तः — प्रतिबन्धः नास्ति।' }
    : { en: `Hari Vasara ends: ${hvDisplayStr} — do not break fast before this.`, hi: `हरि वासर समाप्ति: ${hvDisplayStr} — इससे पहले पारण न करें।`, sa: `हरिवासरान्तः: ${hvDisplayStr} — अस्मात् पूर्वं पारणं न कुर्यात्।` };

  return {
    paranaDate,
    paranaStart: recStartStr,
    paranaEnd: recEndStr,
    paranaSunrise: sunriseStr,
    paranaHariVasaraEnd: hvDisplayStr,
    paranaDwadashiEnd: dwEndStr,
    paranaEarlyEnd: earlyEnd,
    paranaMadhyahnaStart: madhStartStr,
    paranaMadhyahnaEnd: madhEndStr,
    paranaNote: {
      en: [
        `Recommended Parana: ${recStartStr} to ${recEndStr}`,
        '',
        `Sunrise: ${sunriseStr}`,
        hvStatus.en,
        `Madhyahna: ${madhStartStr} to ${madhEndStr} — avoid parana during midday.`,
        `Dwadashi ends: ${dwEndStr} — must break fast before this.`,
        '',
        earlyEnd
          ? `⚠ Dwadashi ends early — break fast as soon as possible after sunrise, before ${dwEndStr}.`
          : madhyahnaConflict
          ? `Best time: After Madhyahna ends (${madhEndStr}), before Dwadashi ends (${dwEndStr}).`
          : hariVasaraAlreadyOver
          ? `Best time: After sunrise (${sunriseStr}), before Madhyahna (${madhStartStr}).`
          : `Best time: After Hari Vasara ends (${hvDisplayStr}), before Madhyahna (${madhStartStr}).`,
      ].join('\n'),
      hi: [
        `अनुशंसित पारण: ${recStartStr} से ${recEndStr}`,
        '',
        `सूर्योदय: ${sunriseStr}`,
        hvStatus.hi,
        `मध्याह्न: ${madhStartStr} से ${madhEndStr} — दोपहर में पारण से बचें।`,
        `द्वादशी समाप्ति: ${dwEndStr} — इससे पहले पारण अवश्य करें।`,
        '',
        earlyEnd
          ? `⚠ द्वादशी शीघ्र समाप्त हो रही है — सूर्योदय के बाद ${dwEndStr} से पहले यथाशीघ्र पारण करें।`
          : madhyahnaConflict
          ? `सर्वोत्तम समय: मध्याह्न समाप्ति (${madhEndStr}) के बाद, द्वादशी समाप्ति (${dwEndStr}) से पहले।`
          : hariVasaraAlreadyOver
          ? `सर्वोत्तम समय: सूर्योदय (${sunriseStr}) के बाद, मध्याह्न (${madhStartStr}) से पहले।`
          : `सर्वोत्तम समय: हरि वासर समाप्ति (${hvDisplayStr}) के बाद, मध्याह्न (${madhStartStr}) से पहले।`,
      ].join('\n'),
      sa: [
        `अनुशंसितपारणम्: ${recStartStr} तः ${recEndStr}`,
        '',
        `सूर्योदयः: ${sunriseStr}`,
        hvStatus.sa,
        `मध्याह्नः: ${madhStartStr} तः ${madhEndStr} — अस्मिन् पारणं वर्जयेत्।`,
        `द्वादशीतिथ्यन्तः: ${dwEndStr} — अस्मात् पूर्वं पारणम् अवश्यम्।`,
      ].join('\n'),
    },
  };
}

/**
 * Compute Purnima parana: after moonrise (≈ sunset on Purnima day).
 * If fasting from sunrise to moonrise, break at moonrise or next sunrise.
 */
function computePurnimaParana(purnimaDate: string, lat = DEFAULT_LAT, lon = DEFAULT_LON, tz = DEFAULT_TZ): {
  paranaDate: string; paranaStart: string; paranaEnd: string; paranaNote: Trilingual;
} {
  const [y, m, d] = purnimaDate.split('-').map(Number);
  const jd = dateToJD(y, m, d, 6);
  const sunriseUT = approximateSunrise(jd, lat, lon);
  const sunsetUT = approximateSunset(jd, lat, lon);
  const moonriseUT = approxMoonrise(15, sunriseUT, sunsetUT);

  return {
    paranaDate: purnimaDate,
    paranaStart: formatTime(moonriseUT, tz),
    paranaEnd: formatTime(sunsetUT + 1, tz),
    paranaNote: {
      en: `Break fast after moonrise (~${formatTime(moonriseUT, tz)}). Sight the full moon, offer Arghya, then partake of prasad.`,
      hi: `चन्द्रोदय (~${formatTime(moonriseUT, tz)}) के बाद पारण करें। पूर्ण चन्द्र दर्शन करें, अर्घ्य दें, फिर प्रसाद ग्रहण करें।`,
      sa: `चन्द्रोदयानन्तरं (~${formatTime(moonriseUT, tz)}) पारणं कुर्यात्। पूर्णचन्द्रं दृष्ट्वा अर्घ्यं दत्त्वा प्रसादं गृह्णीयात्।`,
    },
  };
}

/**
 * Compute Chaturthi (Sankashti) parana: after moonrise on the same day.
 * Krishna Chaturthi = tithi 19, moonrise is late evening.
 */
function computeChaturthiParana(chaturthiDate: string, lat = DEFAULT_LAT, lon = DEFAULT_LON, tz = DEFAULT_TZ): {
  paranaDate: string; paranaStart: string; paranaEnd: string; paranaNote: Trilingual;
} {
  const [y, m, d] = chaturthiDate.split('-').map(Number);
  const jd = dateToJD(y, m, d, 6);
  const sunriseUT = approximateSunrise(jd, lat, lon);
  const sunsetUT = approximateSunset(jd, lat, lon);
  const moonriseUT = approxMoonrise(19, sunriseUT, sunsetUT);

  return {
    paranaDate: chaturthiDate,
    paranaStart: formatTime(moonriseUT % 24, tz),
    paranaEnd: formatTime((moonriseUT + 1) % 24, tz),
    paranaNote: {
      en: `Fast from sunrise until moonrise (~${formatTime(moonriseUT % 24, tz)}). Sight the moon, offer prayers to Lord Ganesha, then break fast with prasad. If moon is not visible due to clouds, extend fast until next day.`,
      hi: `सूर्योदय से चन्द्रोदय (~${formatTime(moonriseUT % 24, tz)}) तक उपवास। चन्द्र दर्शन करें, गणेश जी को प्रार्थना करें, फिर प्रसाद से पारण करें। बादलों से चन्द्र न दिखे तो अगले दिन तक व्रत बढ़ाएँ।`,
      sa: `सूर्योदयात् चन्द्रोदयपर्यन्तम् (~${formatTime(moonriseUT % 24, tz)}) उपवासः। चन्द्रं दृष्ट्वा गणेशं प्रार्थ्य प्रसादेन पारणम्।`,
    },
  };
}

/**
 * Compute Amavasya parana: next morning after sunrise.
 */
function computeAmavasyaParana(amavasyaDate: string, lat = DEFAULT_LAT, lon = DEFAULT_LON, tz = DEFAULT_TZ): {
  paranaDate: string; paranaStart: string; paranaEnd: string; paranaNote: Trilingual;
} {
  const paranaDate = nextDay(amavasyaDate);
  const [y, m, d] = paranaDate.split('-').map(Number);
  const jd = dateToJD(y, m, d, 6);
  const sunriseUT = approximateSunrise(jd, lat, lon);

  return {
    paranaDate,
    paranaStart: formatTime(sunriseUT, tz),
    paranaEnd: formatTime(sunriseUT + 3, tz),
    paranaNote: {
      en: `Break fast next morning after sunrise (~${formatTime(sunriseUT, tz)}). Perform Tarpan for ancestors first, then partake of food.`,
      hi: `अगली सुबह सूर्योदय (~${formatTime(sunriseUT, tz)}) के बाद पारण करें। पहले पितरों का तर्पण करें, फिर भोजन करें।`,
      sa: `प्रातः सूर्योदयानन्तरं (~${formatTime(sunriseUT, tz)}) पारणम्। प्रथमं पितृतर्पणं कृत्वा भोजनम्।`,
    },
  };
}

/**
 * Compute Pradosham parana: after twilight puja (sunset + ~2.5 hours).
 */
function computePradoshamParana(pradoshamDate: string, lat = DEFAULT_LAT, lon = DEFAULT_LON, tz = DEFAULT_TZ): {
  paranaDate: string; paranaStart: string; paranaEnd: string; paranaNote: Trilingual;
} {
  const [y, m, d] = pradoshamDate.split('-').map(Number);
  const jd = dateToJD(y, m, d, 6);
  const sunsetUT = approximateSunset(jd, lat, lon);
  const pujaEndUT = sunsetUT + 2.5;

  return {
    paranaDate: pradoshamDate,
    paranaStart: formatTime(pujaEndUT % 24, tz),
    paranaEnd: formatTime((pujaEndUT + 1) % 24, tz),
    paranaNote: {
      en: `Worship Lord Shiva during Pradosha Kaal (1.5h before and after sunset). Break fast after completing evening puja (~${formatTime(pujaEndUT % 24, tz)}).`,
      hi: `प्रदोष काल (सूर्यास्त के 1.5 घण्टे पहले और बाद) में शिव पूजा करें। संध्या पूजा पूर्ण करने के बाद (~${formatTime(pujaEndUT % 24, tz)}) पारण करें।`,
      sa: `प्रदोषकाले शिवपूजनं कुर्यात्। सन्ध्यापूजानन्तरं (~${formatTime(pujaEndUT % 24, tz)}) पारणम्।`,
    },
  };
}

/**
 * Generate the full festival calendar for a year.
 */
export function generateFestivalCalendar(year: number, lat = DEFAULT_LAT, lon = DEFAULT_LON, tz = DEFAULT_TZ): FestivalEntry[] {
  const festivals: FestivalEntry[] = [];

  // ── Major Festivals ──

  // Makar Sankranti (Sun enters Capricorn / sign 10)
  festivals.push({
    name: { en: 'Makar Sankranti', hi: 'मकर संक्रान्ति', sa: 'मकरसंक्रान्तिः' },
    date: findSankrantiDate(year, 10),
    type: 'major',
    category: 'sankranti',
    description: { en: 'Sun enters Capricorn — harvest festival', hi: 'सूर्य मकर राशि में — फसल का त्योहार', sa: 'सूर्यः मकरराशौ प्रविशति — शस्योत्सवः' },
    slug: 'makar-sankranti',
  });

  // Vasant Panchami (Magha Shukla 5)
  festivals.push({
    name: { en: 'Vasant Panchami', hi: 'वसन्त पञ्चमी', sa: 'वसन्तपञ्चमी' },
    date: findTithiDate(year, 1, 5),
    tithi: 'Magha Shukla 5',
    type: 'major',
    category: 'festival',
    description: { en: 'Festival of Saraswati — beginning of spring', hi: 'सरस्वती का त्योहार — वसन्त ऋतु का आरम्भ', sa: 'सरस्वतीपूजनम् — वसन्तर्तोः आरम्भः' },
    slug: 'vasant-panchami',
  });

  // Maha Shivaratri (Phalguna Krishna 14 → tithi 29)
  festivals.push({
    name: { en: 'Maha Shivaratri', hi: 'महाशिवरात्रि', sa: 'महाशिवरात्रिः' },
    date: findTithiDate(year, 2, 29),
    tithi: 'Phalguna Krishna 14',
    type: 'major',
    category: 'festival',
    description: { en: 'Great Night of Lord Shiva — fasting and all-night worship', hi: 'भगवान शिव की महारात्रि — उपवास और रात्रि जागरण', sa: 'शिवस्य महारात्रिः — उपवासः रात्रिजागरणं च' },
    slug: 'maha-shivaratri',
  });

  // Holi (Phalguna Purnima → tithi 15 in March)
  festivals.push({
    name: { en: 'Holi', hi: 'होली', sa: 'होलिका' },
    date: findPurnimaDate(year, 3),
    tithi: 'Phalguna Purnima',
    type: 'major',
    category: 'festival',
    description: { en: 'Festival of Colors — celebrating spring and good over evil', hi: 'रंगों का त्योहार — वसन्त और सत्य की विजय', sa: 'रङ्गोत्सवः — वसन्तस्य सत्यविजयस्य च उत्सवः' },
    slug: 'holi',
  });

  // Ram Navami (Chaitra Shukla 9)
  festivals.push({
    name: { en: 'Ram Navami', hi: 'रामनवमी', sa: 'रामनवमी' },
    date: findTithiDate(year, 4, 9),
    tithi: 'Chaitra Shukla 9',
    type: 'major',
    category: 'festival',
    description: { en: 'Birthday of Lord Rama', hi: 'भगवान राम का जन्मोत्सव', sa: 'श्रीरामजन्मोत्सवः' },
    slug: 'ram-navami',
  });

  // Hanuman Jayanti (Chaitra Purnima)
  festivals.push({
    name: { en: 'Hanuman Jayanti', hi: 'हनुमान जयन्ती', sa: 'हनुमज्जयन्ती' },
    date: findPurnimaDate(year, 4),
    tithi: 'Chaitra Purnima',
    type: 'major',
    category: 'festival',
    description: { en: 'Birthday of Lord Hanuman', hi: 'हनुमान जी का जन्मोत्सव', sa: 'हनुमतः जन्मोत्सवः' },
    slug: 'hanuman-jayanti',
  });

  // Guru Purnima (Ashadha Purnima)
  festivals.push({
    name: { en: 'Guru Purnima', hi: 'गुरु पूर्णिमा', sa: 'गुरुपूर्णिमा' },
    date: findPurnimaDate(year, 7),
    tithi: 'Ashadha Purnima',
    type: 'major',
    category: 'festival',
    description: { en: 'Day of the Guru — honoring teachers and Sage Vyasa', hi: 'गुरु का दिन — शिक्षकों और व्यास ऋषि का सम्मान', sa: 'गुरोः दिनम् — आचार्याणां व्यासमुनेश्च सम्मानम्' },
    slug: 'guru-purnima',
  });

  // Raksha Bandhan (Shravana Purnima)
  festivals.push({
    name: { en: 'Raksha Bandhan', hi: 'रक्षाबन्धन', sa: 'रक्षाबन्धनम्' },
    date: findPurnimaDate(year, 8),
    tithi: 'Shravana Purnima',
    type: 'major',
    category: 'festival',
    description: { en: 'Bond of protection — sisters tie rakhi on brothers\' wrists', hi: 'रक्षा का बन्धन — भाई-बहन का त्योहार', sa: 'रक्षायाः बन्धनम् — भ्रातृभगिन्योः उत्सवः' },
    slug: 'raksha-bandhan',
  });

  // Krishna Janmashtami (Bhadrapada Krishna 8 → tithi 23)
  festivals.push({
    name: { en: 'Janmashtami', hi: 'जन्माष्टमी', sa: 'जन्माष्टमी' },
    date: findTithiDate(year, 8, 23),
    tithi: 'Bhadrapada Krishna 8',
    type: 'major',
    category: 'festival',
    description: { en: 'Birthday of Lord Krishna', hi: 'भगवान कृष्ण का जन्मोत्सव', sa: 'श्रीकृष्णजन्मोत्सवः' },
    slug: 'janmashtami',
  });

  // Ganesh Chaturthi (Bhadrapada Shukla 4)
  festivals.push({
    name: { en: 'Ganesh Chaturthi', hi: 'गणेश चतुर्थी', sa: 'गणेशचतुर्थी' },
    date: findTithiDate(year, 9, 4),
    tithi: 'Bhadrapada Shukla 4',
    type: 'major',
    category: 'festival',
    description: { en: 'Birthday of Lord Ganesha', hi: 'भगवान गणेश का जन्मोत्सव', sa: 'श्रीगणेशजन्मोत्सवः' },
    slug: 'ganesh-chaturthi',
  });

  // Navaratri start (Ashwina Shukla 1)
  festivals.push({
    name: { en: 'Navaratri (Sharad)', hi: 'शारदीय नवरात्रि', sa: 'शारदीयनवरात्रिः' },
    date: findTithiDate(year, 10, 1),
    tithi: 'Ashwina Shukla 1',
    type: 'major',
    category: 'festival',
    description: { en: 'Nine nights of Goddess Durga worship', hi: 'देवी दुर्गा की नौ रातें', sa: 'दुर्गादेव्याः नवरात्रयः' },
    slug: 'navaratri',
  });

  // Dussehra / Vijayadashami (Ashwina Shukla 10)
  festivals.push({
    name: { en: 'Dussehra', hi: 'दशहरा', sa: 'विजयादशमी' },
    date: findTithiDate(year, 10, 10),
    tithi: 'Ashwina Shukla 10',
    type: 'major',
    category: 'festival',
    description: { en: 'Victory of good over evil — Rama\'s victory over Ravana', hi: 'बुराई पर अच्छाई की विजय — राम की रावण पर विजय', sa: 'अधर्मोपरि धर्मस्य विजयः — रामस्य रावणोपरि विजयः' },
    slug: 'dussehra',
  });

  // Diwali (Kartika Amavasya → tithi 30 in Oct/Nov)
  festivals.push({
    name: { en: 'Diwali', hi: 'दीपावली', sa: 'दीपावलिः' },
    date: findAmavasyaDate(year, 10),
    tithi: 'Kartika Amavasya',
    type: 'major',
    category: 'festival',
    description: { en: 'Festival of Lights — Lakshmi Puja and celebration of light over darkness', hi: 'दीपों का त्योहार — लक्ष्मी पूजा', sa: 'दीपानाम् उत्सवः — लक्ष्मीपूजनम्' },
    slug: 'diwali',
  });

  // ── Vrat Days (monthly recurring) — with Parana (fast-breaking) times ──
  for (let m = 1; m <= 12; m++) {
    // Purnima
    const purnimaDate = findPurnimaDate(year, m);
    festivals.push({
      name: { en: 'Purnima Vrat', hi: 'पूर्णिमा व्रत', sa: 'पूर्णिमाव्रतम्' },
      date: purnimaDate,
      type: 'vrat',
      category: 'purnima',
      description: { en: 'Full Moon fasting day', hi: 'पूर्णिमा का व्रत', sa: 'पूर्णिमायां व्रतम्' },
      slug: 'purnima',
      ...computePurnimaParana(purnimaDate, lat, lon, tz),
    });

    // Amavasya
    const amavasyaDate = findAmavasyaDate(year, m);
    festivals.push({
      name: { en: 'Amavasya', hi: 'अमावस्या', sa: 'अमावास्या' },
      date: amavasyaDate,
      type: 'vrat',
      category: 'amavasya',
      description: { en: 'New Moon — ancestral offerings', hi: 'अमावस्या — पितृ तर्पण', sa: 'अमावास्या — पितृतर्पणम्' },
      slug: 'amavasya',
      ...computeAmavasyaParana(amavasyaDate, lat, lon, tz),
    });

    // Ekadashi (Shukla & Krishna) — resolve named Ekadashi from Sun's sidereal position
    const ekadashi = findEkadashiDates(year, m);

    // Determine Hindu month from Sun's sidereal sign on the Ekadashi date
    const shuklaDateParts = ekadashi.shukla.split('-').map(Number);
    const shuklaJd = dateToJD(shuklaDateParts[0], shuklaDateParts[1], shuklaDateParts[2], 6);
    const shuklaSunSid = normalizeDeg(toSidereal(sunLongitude(shuklaJd), shuklaJd));
    const shuklaSign = Math.floor(shuklaSunSid / 30) + 1;
    const shuklaHinduMonth = getHinduMonth(shuklaSign);
    const shuklaEkadashiDetail = getEkadashiName(shuklaHinduMonth, 'shukla');

    const krishnaDateParts = ekadashi.krishna.split('-').map(Number);
    const krishnaJd = dateToJD(krishnaDateParts[0], krishnaDateParts[1], krishnaDateParts[2], 6);
    const krishnaSunSid = normalizeDeg(toSidereal(sunLongitude(krishnaJd), krishnaJd));
    const krishnaSign = Math.floor(krishnaSunSid / 30) + 1;
    const krishnaHinduMonth = getHinduMonth(krishnaSign);
    const krishnaEkadashiDetail = getEkadashiName(krishnaHinduMonth, 'krishna');

    festivals.push({
      name: shuklaEkadashiDetail?.name || { en: 'Shukla Ekadashi', hi: 'शुक्ल एकादशी', sa: 'शुक्लैकादशी' },
      date: ekadashi.shukla,
      type: 'vrat',
      category: 'ekadashi',
      description: shuklaEkadashiDetail
        ? shuklaEkadashiDetail.benefit
        : { en: 'Fasting for Lord Vishnu — Shukla Paksha', hi: 'विष्णु व्रत — शुक्ल पक्ष', sa: 'विष्णुव्रतम् — शुक्लपक्षे' },
      slug: 'ekadashi',
      ...computeEkadashiParana(ekadashi.shukla, lat, lon, tz),
    });
    festivals.push({
      name: krishnaEkadashiDetail?.name || { en: 'Krishna Ekadashi', hi: 'कृष्ण एकादशी', sa: 'कृष्णैकादशी' },
      date: ekadashi.krishna,
      type: 'vrat',
      category: 'ekadashi',
      description: krishnaEkadashiDetail
        ? krishnaEkadashiDetail.benefit
        : { en: 'Fasting for Lord Vishnu — Krishna Paksha', hi: 'विष्णु व्रत — कृष्ण पक्ष', sa: 'विष्णुव्रतम् — कृष्णपक्षे' },
      slug: 'ekadashi',
      ...computeEkadashiParana(ekadashi.krishna, lat, lon, tz),
    });

    // Sankashti Chaturthi
    const chaturthiDate = findChaturthiDate(year, m);
    festivals.push({
      name: { en: 'Sankashti Chaturthi', hi: 'संकष्टी चतुर्थी', sa: 'सङ्कष्टिचतुर्थी' },
      date: chaturthiDate,
      type: 'vrat',
      category: 'chaturthi',
      description: { en: 'Fasting for Lord Ganesha — moonrise ends fast', hi: 'गणेश व्रत — चन्द्रोदय पर व्रत समाप्त', sa: 'गणेशव्रतम् — चन्द्रोदये व्रतसमाप्तिः' },
      slug: 'chaturthi',
      ...computeChaturthiParana(chaturthiDate, lat, lon, tz),
    });

    // Pradosham
    const pradosham = findPradoshamDates(year, m);
    festivals.push({
      name: { en: 'Shukla Pradosham', hi: 'शुक्ल प्रदोष', sa: 'शुक्लप्रदोषः' },
      date: pradosham.shukla,
      type: 'vrat',
      category: 'pradosham',
      description: { en: 'Twilight worship of Lord Shiva — Shukla Trayodashi', hi: 'शिव की संध्याकालीन पूजा — शुक्ल त्रयोदशी', sa: 'शिवस्य सन्ध्याकालपूजनम् — शुक्लत्रयोदश्यां' },
      slug: 'pradosham',
      ...computePradoshamParana(pradosham.shukla, lat, lon, tz),
    });
    festivals.push({
      name: { en: 'Krishna Pradosham', hi: 'कृष्ण प्रदोष', sa: 'कृष्णप्रदोषः' },
      date: pradosham.krishna,
      type: 'vrat',
      category: 'pradosham',
      description: { en: 'Twilight worship of Lord Shiva — Krishna Trayodashi', hi: 'शिव की संध्याकालीन पूजा — कृष्ण त्रयोदशी', sa: 'शिवस्य सन्ध्याकालपूजनम् — कृष्णत्रयोदश्यां' },
      slug: 'pradosham',
      ...computePradoshamParana(pradosham.krishna, lat, lon, tz),
    });
  }

  // ── Eclipse entries with Sutak period and phases ──
  const eclipseEvents = generateEclipseCalendar(year);
  for (const eclipse of eclipseEvents) {
    const [ey, em, ed] = eclipse.date.split('-').map(Number);
    const eclipseJd = dateToJD(ey, em, ed, 6);
    const sunriseUT = approximateSunrise(eclipseJd, lat, lon);
    const sunsetUT = approximateSunset(eclipseJd, lat, lon);

    // Approximate eclipse max time
    let maxTimeUT: number;
    if (eclipse.type === 'solar') {
      maxTimeUT = (sunriseUT + sunsetUT) / 2; // ~local noon
    } else {
      maxTimeUT = sunsetUT + 5; // Full Moon opposition ~midnight IST
    }

    // Eclipse duration estimates based on magnitude (half-duration in hours)
    let halfDur: number;
    if (eclipse.type === 'solar') {
      halfDur = eclipse.magnitude === 'total' ? 1.5 : eclipse.magnitude === 'annular' ? 1.5 : 1.25;
    } else {
      halfDur = eclipse.magnitude === 'total' ? 2.75 : eclipse.magnitude === 'partial' ? 2.0 : 1.75;
    }

    const eStartUT = maxTimeUT - halfDur;
    const eEndUT = maxTimeUT + halfDur;

    // Sutak: Solar = 12h before start, Lunar = 9h before start
    // Not applicable for penumbral lunar eclipses
    const isSutakApplicable = !(eclipse.type === 'lunar' && eclipse.magnitude === 'penumbral');
    const sutakHrs = eclipse.type === 'solar' ? 12 : 9;
    const sutakStartUT = eStartUT - sutakHrs;

    // Build phase timeline
    const phases: { name: Trilingual; time: string }[] = [];
    const ft = (ut: number) => formatTime(((ut % 24) + 24) % 24, tz);

    if (eclipse.type === 'solar') {
      phases.push({ name: { en: 'First Contact (Sparsha)', hi: 'प्रथम स्पर्श', sa: 'स्पर्शः' }, time: ft(eStartUT) });
      if (eclipse.magnitude === 'total') {
        phases.push({ name: { en: 'Totality Begins', hi: 'पूर्ण ग्रहण आरम्भ', sa: 'पूर्णग्रहणारम्भः' }, time: ft(maxTimeUT - 0.02) });
      }
      phases.push({ name: { en: 'Maximum Eclipse', hi: 'अधिकतम ग्रहण', sa: 'परमग्रहणम्' }, time: ft(maxTimeUT) });
      if (eclipse.magnitude === 'total') {
        phases.push({ name: { en: 'Totality Ends', hi: 'पूर्ण ग्रहण समाप्त', sa: 'पूर्णग्रहणान्तः' }, time: ft(maxTimeUT + 0.02) });
      }
      phases.push({ name: { en: 'Last Contact (Moksha)', hi: 'अन्तिम स्पर्श (मोक्ष)', sa: 'मोक्षः' }, time: ft(eEndUT) });
    } else {
      if (eclipse.magnitude !== 'penumbral') {
        phases.push({ name: { en: 'Penumbral Phase Begins', hi: 'उपच्छाया आरम्भ', sa: 'उपच्छायारम्भः' }, time: ft(eStartUT - 0.75) });
      }
      phases.push({
        name: eclipse.magnitude === 'penumbral'
          ? { en: 'Penumbral Eclipse Begins', hi: 'उपच्छाया ग्रहण आरम्भ', sa: 'उपच्छायाग्रहणारम्भः' }
          : { en: 'Partial Phase Begins', hi: 'आंशिक ग्रहण आरम्भ', sa: 'आंशिकग्रहणारम्भः' },
        time: ft(eStartUT),
      });
      if (eclipse.magnitude === 'total') {
        phases.push({ name: { en: 'Total Phase Begins', hi: 'पूर्ण ग्रहण आरम्भ', sa: 'पूर्णग्रहणारम्भः' }, time: ft(maxTimeUT - 0.75) });
      }
      phases.push({ name: { en: 'Maximum Eclipse', hi: 'अधिकतम ग्रहण', sa: 'परमग्रहणम्' }, time: ft(maxTimeUT) });
      if (eclipse.magnitude === 'total') {
        phases.push({ name: { en: 'Total Phase Ends', hi: 'पूर्ण ग्रहण समाप्त', sa: 'पूर्णग्रहणान्तः' }, time: ft(maxTimeUT + 0.75) });
      }
      phases.push({
        name: eclipse.magnitude === 'penumbral'
          ? { en: 'Penumbral Eclipse Ends', hi: 'उपच्छाया ग्रहण समाप्त', sa: 'उपच्छायाग्रहणान्तः' }
          : { en: 'Partial Phase Ends', hi: 'आंशिक ग्रहण समाप्त', sa: 'आंशिकग्रहणान्तः' },
        time: ft(eEndUT),
      });
      if (eclipse.magnitude !== 'penumbral') {
        phases.push({ name: { en: 'Penumbral Phase Ends', hi: 'उपच्छाया समाप्त', sa: 'उपच्छायान्तः' }, time: ft(eEndUT + 0.75) });
      }
    }

    festivals.push({
      name: eclipse.typeName,
      date: eclipse.date,
      type: 'eclipse',
      category: 'eclipse',
      description: eclipse.description,
      slug: 'eclipse',
      eclipseType: eclipse.type,
      eclipseMagnitude: eclipse.magnitude,
      eclipseMaxTime: ft(maxTimeUT),
      sutakStart: isSutakApplicable ? ft(sutakStartUT) : undefined,
      sutakEnd: isSutakApplicable ? ft(eEndUT) : undefined,
      sutakApplicable: isSutakApplicable,
      eclipsePhases: phases,
    });
  }

  // Sort by date
  festivals.sort((a, b) => a.date.localeCompare(b.date));

  return festivals;
}
