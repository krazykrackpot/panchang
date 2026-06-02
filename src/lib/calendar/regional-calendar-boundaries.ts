/**
 * Real per-year date boundaries for the 9 regional Hindu calendars
 * surfaced on /[locale]/regional/page.tsx.
 *
 * Replaces the previous `approxGregorian: "Apr 14 – May 14"` static
 * strings with values computed from the same engines that drive
 * the rest of the panchang:
 *
 *   • SOLAR calendars (Tamil, Malayalam, Odia, Mithila-leaning) use
 *     `computeSankrantis(year, tz)` — exact sidereal solar ingress
 *     times per Surya Siddhanta + Lahiri.
 *   • POST-SAHA BENGALI CIVIL (1966 reform, Dr. Meghnad Saha) is a
 *     deterministic 31/31/31/31/31/30/30/30/30/30/30/30+leap system
 *     anchored to the first day on or after Mesha sankranti.
 *   • LUNISOLAR calendars (Telugu/Kannada/Gujarati/Marathi) use
 *     `buildYearlyTithiTable(...).lunarMonths` for Amanta boundaries.
 *     Mithila uses `.purnimantMonths` for the Purnimanta system.
 *     Adhika Masa (intercalary 13th month) is preserved with the
 *     `isAdhika: true` flag and naturally produces a 13-entry array.
 *
 * Per-calendar reference location: each calendar uses its cultural
 * anchor city so the local-date boundary near midnight resolves
 * correctly for the audience. Picked deliberately — see
 * CALENDAR_REF_LOCATION below.
 *
 * Created 2026-06-02 as part of the linking-topology PR's Item 2
 * follow-up. The previous static strings ("Apr 14 – May 14") drifted
 * out of date every year and never reflected Adhika Masa, leaking
 * an SEO + accuracy signal that this app — which prides itself on
 * Drik-grade panchang computation — should not have been shipping.
 */

import { computeSankrantis, type SankrantiEntry } from './solar-festivals';
import { buildYearlyTithiTable, type LunarMonthInfo } from './tithi-table';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RegionalCalendarId =
  | 'tamil'
  | 'bengali'
  | 'malayalam'
  | 'odia'
  | 'telugu'
  | 'kannada'
  | 'gujarati'
  | 'marathi'
  | 'mithila';

export interface MonthBoundary {
  /** Month name in the calendar's native script + Latin transliteration
   *  (e.g. "Chithirai (சித்திரை)", "Boishakh (বৈশাখ)"). Pre-formatted
   *  for display — script + parenthesised native. */
  name: string;
  /** ISO date YYYY-MM-DD in the calendar's reference timezone */
  startDate: string;
  /** ISO date YYYY-MM-DD (inclusive end) */
  endDate: string;
  /** True for Adhika (intercalary) months — only set on lunisolar calendars
   *  in years where the sun stays inside one sign during a full lunation. */
  isAdhika?: boolean;
}

export interface RegionalNewYear {
  /** Festival name like "Pohela Boishakh", "Ugadi", "Bestu Varas" */
  name: string;
  /** Exact Gregorian date YYYY-MM-DD for the target year */
  date: string;
}

interface RefLocation {
  /** Cultural-anchor city for sankranti / amavasya boundary computation.
   *  Sankranti is a global event (single UT instant), but its LOCAL date
   *  near midnight can fall on either side depending on TZ — so pick the
   *  TZ the calendar's audience actually uses. */
  lat: number;
  lng: number;
  timezone: string;
  /** Slug shown in dev-only debug; not user-facing. */
  city: string;
}

// ─── Reference locations per calendar ─────────────────────────────────────────

/**
 * Each calendar's boundary computation runs against the city most associated
 * with that linguistic/cultural region. All 9 currently sit in `Asia/Kolkata`
 * but the lat/lng differs — which matters subtly when sankranti falls within
 * a few minutes of local midnight (the date could roll either way).
 */
export const CALENDAR_REF_LOCATION: Record<RegionalCalendarId, RefLocation> = {
  tamil:     { city: 'Chennai',      lat: 13.0827, lng: 80.2707, timezone: 'Asia/Kolkata' },
  bengali:   { city: 'Kolkata',      lat: 22.5726, lng: 88.3639, timezone: 'Asia/Kolkata' },
  malayalam: { city: 'Kochi',        lat:  9.9312, lng: 76.2673, timezone: 'Asia/Kolkata' },
  odia:      { city: 'Bhubaneswar',  lat: 20.2961, lng: 85.8245, timezone: 'Asia/Kolkata' },
  telugu:    { city: 'Hyderabad',    lat: 17.3850, lng: 78.4867, timezone: 'Asia/Kolkata' },
  kannada:   { city: 'Bangalore',    lat: 12.9716, lng: 77.5946, timezone: 'Asia/Kolkata' },
  gujarati:  { city: 'Ahmedabad',    lat: 23.0225, lng: 72.5714, timezone: 'Asia/Kolkata' },
  marathi:   { city: 'Mumbai',       lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata' },
  mithila:   { city: 'Darbhanga',    lat: 26.1542, lng: 85.8918, timezone: 'Asia/Kolkata' },
};

// ─── Month-name tables per calendar ──────────────────────────────────────────

/**
 * Month names per calendar — pre-formatted as
 *   "<Latin transliteration> (<native script>)".
 * The order matches the calendar's own year (month index 0 = first month).
 *
 * Why split out from REGIONAL_CALENDARS in /regional/page.tsx? The page
 * also stores festival lists, descriptions, etc. — keeping all that in the
 * page file. Only the name strings are needed by the boundary engine so we
 * duplicate JUST these arrays here. Keeping the page's REGIONAL_CALENDARS
 * intact means the existing JSX still owns its content; this file only
 * provides the dates.
 */
const MONTH_NAMES: Record<RegionalCalendarId, string[]> = {
  // Solar calendars — month index i corresponds to signId (i + offset)
  tamil: [
    'Chithirai (சித்திரை)',  'Vaikasi (வைகாசி)',   'Aani (ஆனி)',           'Aadi (ஆடி)',
    'Aavani (ஆவணி)',         'Purattasi (புரட்டாசி)', 'Aippasi (ஐப்பசி)',   'Karthigai (கார்த்திகை)',
    'Margazhi (மார்கழி)',    'Thai (தை)',             'Maasi (மாசி)',       'Panguni (பங்குனி)',
  ],
  bengali: [
    'Boishakh (বৈশাখ)',  'Joishtho (জ্যৈষ্ঠ)', 'Asharh (আষাঢ়)',   'Shrabon (শ্রাবণ)',
    'Bhadro (ভাদ্র)',    'Ashwin (আশ্বিন)',     'Kartik (কার্তিক)', 'Ogrohayon (অগ্রহায়ণ)',
    'Poush (পৌষ)',       'Magh (মাঘ)',          'Falgun (ফাল্গুন)',  'Choitro (চৈত্র)',
  ],
  malayalam: [
    'Chingam (ചിങ്ങം)',     'Kanni (കന്നി)',         'Thulam (തുലാം)',          'Vrischikam (വൃശ്ചികം)',
    'Dhanu (ധനു)',          'Makaram (മകരം)',       'Kumbham (കുംഭം)',         'Meenam (മീനം)',
    'Medam (മേടം)',         'Edavam (ഇടവം)',        'Mithunam (മിഥുനം)',       'Karkidakam (കര്‍ക്കിടകം)',
  ],
  odia: [
    'Baisakha (ବୈଶାଖ)',   'Jyeshtha (ଜ୍ୟେଷ୍ଠ)',   'Ashadha (ଆଷାଢ଼)',    'Shrabana (ଶ୍ରାବଣ)',
    'Bhadra (ଭାଦ୍ର)',     'Ashwina (ଆଶ୍ୱିନ)',     'Kartika (କାର୍ତ୍ତିକ)', 'Margashira (ମାର୍ଗଶିର)',
    'Pausha (ପୌଷ)',       'Magha (ମାଘ)',          'Phalguna (ଫାଲ୍ଗୁନ)',  'Chaitra (ଚୈତ୍ର)',
  ],

  // Lunisolar Amanta (Telugu/Kannada/Gujarati/Marathi)
  telugu: [
    'Chaitra (చైత్రము)',     'Vaishakha (వైశాఖము)',  'Jyeshtha (జ్యేష్ఠము)', 'Ashadha (ఆషాఢము)',
    'Shravana (శ్రావణము)',  'Bhadrapada (భాద్రపదము)', 'Ashvija (ఆశ్వయుజము)', 'Karthika (కార్తీకము)',
    'Margashira (మార్గశీర్షము)', 'Pushya (పుష్యము)', 'Magha (మాఘము)',          'Phalguna (ఫాల్గుణము)',
  ],
  kannada: [
    'Chaitra (ಚೈತ್ರ)',       'Vaishakha (ವೈಶಾಖ)',     'Jyeshtha (ಜ್ಯೇಷ್ಠ)', 'Ashadha (ಆಷಾಢ)',
    'Shravana (ಶ್ರಾವಣ)',     'Bhadrapada (ಭಾದ್ರಪದ)',   'Ashvija (ಆಶ್ವಯುಜ)',  'Karthika (ಕಾರ್ತೀಕ)',
    'Margashira (ಮಾರ್ಗಶಿರ)', 'Pushya (ಪುಷ್ಯ)',          'Magha (ಮಾಘ)',          'Phalguna (ಫಾಲ್ಗುಣ)',
  ],
  gujarati: [
    // Year starts at Kartik (Vikram Samvat convention)
    'Kartik (કારતક)',    'Magshar (માગશર)',  'Posh (પોષ)',     'Maha (મહા)',
    'Fagan (ફાગણ)',      'Chaitra (ચૈત્ર)',   'Vaishakh (વૈશાખ)', 'Jeth (જેઠ)',
    'Ashadh (અષાઢ)',     'Shravan (શ્રાવણ)',  'Bhadarvo (ભાદરવો)', 'Aso (આસો)',
  ],
  marathi: [
    'Chaitra (चैत्र)',       'Vaishakh (वैशाख)',    'Jyeshtha (ज्येष्ठ)', 'Ashadh (आषाढ)',
    'Shravan (श्रावण)',      'Bhadrapad (भाद्रपद)', 'Ashwin (आश्विन)',     'Kartik (कार्तिक)',
    'Margashirsha (मार्गशीर्ष)', 'Paush (पौष)',     'Magh (माघ)',          'Phalgun (फाल्गुन)',
  ],

  // Lunisolar Purnimanta (Mithila)
  mithila: [
    'Chaitra (चैत)',     'Baisakh (बैसाख)',    'Jeth (जेठ)',         'Asadh (असाढ)',
    'Saon (साओन)',       'Bhado (भादो)',       'Asin (आसिन)',        'Katik (कातिक)',
    'Agahan (अगहन)',     'Pus (पूस)',          'Magh (माघ)',         'Phagun (फागुन)',
  ],
};

// ─── Solar-month signId-to-monthIndex mappings ──────────────────────────────

/**
 * For solar calendars: which Rashi sign does month index 0 (first month
 * of the year) correspond to?
 *
 *   tamil/bengali/odia   → Mesha (1)  → year starts mid-April
 *   malayalam            → Simha (5)  → year starts mid-August (Chingam)
 *
 * Subsequent months map to (firstSign + monthIdx - 1) wrapped over 12.
 */
const SOLAR_FIRST_SIGN: Record<'tamil' | 'bengali' | 'malayalam' | 'odia', number> = {
  tamil: 1,
  bengali: 1,
  malayalam: 5,
  odia: 1,
};

// ─── Lunisolar first-masa mappings ──────────────────────────────────────────

/**
 * For lunisolar calendars: which masa name corresponds to month index 0?
 * The tithi-table engine names months using the canonical lowercase list
 * (see MONTH_ORDER in festival-details.ts — 'ashwina'/'kartika' WITH the
 * trailing 'a', not 'ashwin'/'kartik').
 *
 *   telugu/kannada/marathi  → chaitra
 *   gujarati                → kartika  (Vikram Samvat, year starts day after Diwali)
 *   mithila                 → chaitra  (Purnimanta)
 */
const LUNISOLAR_FIRST_MASA: Record<'telugu' | 'kannada' | 'gujarati' | 'marathi' | 'mithila', string> = {
  telugu: 'chaitra',
  kannada: 'chaitra',
  gujarati: 'kartika',
  marathi: 'chaitra',
  mithila: 'chaitra',
};

/**
 * Canonical masa order as used by the tithi-table engine. Lowercase,
 * trailing 'a' on ashwina/kartika (NOT ashwin/kartik). Single source of
 * truth is `MONTH_ORDER` in `src/lib/constants/festival-details.ts`;
 * mirrored here to avoid pulling in the entire festival-details module.
 */
const CANONICAL_MASA = [
  'chaitra', 'vaishakha', 'jyeshtha', 'ashadha',
  'shravana', 'bhadrapada', 'ashwina', 'kartika',
  'margashirsha', 'pausha', 'magha', 'phalguna',
] as const;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Compute the 12 (or 13 if Adhika Masa) month boundaries for a regional
 * calendar in a given Gregorian year.
 *
 * Returns entries in the CALENDAR's own year order — not Gregorian order.
 * E.g. for Tamil 2026 the returned array starts with Chithirai (mid-April
 * 2026) and ends with Panguni (mid-March 2027); for Malayalam it starts
 * with Chingam (mid-August 2026) and ends with Karkidakam (mid-July 2027).
 *
 * @param calendarId — which regional calendar
 * @param year — Gregorian year that contains the calendar's NEW YEAR start
 */
export function computeRegionalMonthBoundaries(
  calendarId: RegionalCalendarId,
  year: number,
): MonthBoundary[] {
  switch (calendarId) {
    case 'tamil':
    case 'malayalam':
    case 'odia':
      return computeSolarBoundaries(calendarId, year);

    case 'bengali':
      return computeBengaliSahaBoundaries(year);

    case 'telugu':
    case 'kannada':
    case 'gujarati':
    case 'marathi':
      return computeLunisolarBoundaries(calendarId, year, 'amanta');

    case 'mithila':
      return computeLunisolarBoundaries(calendarId, year, 'purnimanta');
  }
}

/**
 * Compute the new-year festival date for a regional calendar in a given
 * Gregorian year. Pohela Boishakh, Ugadi, Vishu, Bestu Varas, etc.
 */
export function getRegionalNewYearDate(
  calendarId: RegionalCalendarId,
  year: number,
): RegionalNewYear {
  const newYearNames: Record<RegionalCalendarId, string> = {
    tamil:     'Puthandu (புத்தாண்டு)',
    bengali:   'Pohela Boishakh (পহেলা বৈশাখ)',
    malayalam: 'Vishu (വിഷു)',  // Cultural new year — Medam 1 (Mesha sankranti, mid-Apr),
                                //   NOT the calendar year start (Chingam, mid-Aug)
    odia:      'Pana Sankranti (ପଣା ସଂକ୍ରାନ୍ତି)',
    telugu:    'Ugadi (ఉగాది)',
    kannada:   'Yugadi (ಯುಗಾದಿ)',
    gujarati:  'Bestu Varas (બેસ્તુ વરસ)',  // Day after Diwali Amavasya — same as Kartik 1
    marathi:   'Gudi Padwa (गुढी पाडवा)',
    mithila:   'Naya Barsh / Jur Sital (नया वर्ष / जुर सीतल)',  // Vaisakh 2 in Mithila
                                                              //   tradition ≈ Mesha sankranti
  };

  // For most calendars the new year falls on the first month's start date.
  // Two exceptions where the cultural new year diverges from the calendar
  // year's first month:
  //   • Malayalam: calendar year starts at Chingam (mid-Aug), but Vishu
  //     (the cultural new year) is celebrated on Medam 1 (mid-April,
  //     Mesha sankranti).
  //   • Mithila: Purnimanta Chaitra starts in early-March, but Jur Sital
  //     (the cultural new year) is celebrated around Mesha sankranti.
  // Both override to Mesha sankranti for the target year.
  if (calendarId === 'malayalam' || calendarId === 'mithila') {
    const ref = CALENDAR_REF_LOCATION[calendarId];
    const sankrantis = computeSankrantis(year, ref.timezone);
    const mesha = sankrantis.find(s => s.signId === 1);
    if (mesha) {
      return { name: newYearNames[calendarId], date: mesha.date };
    }
  }

  const boundaries = computeRegionalMonthBoundaries(calendarId, year);
  const firstMonth = boundaries[0];
  if (!firstMonth) {
    // Engine returned empty — possible upstream failure (missing
    // sankranti for the year, tithi-table degenerate, etc.). Surface
    // via console so we notice in vercel logs rather than crashing
    // the page with a TypeError on .startDate (Gemini PR #354 HIGH).
    //
    // Why log+empty instead of throw: this function is called server-
    // side by SSR pages. A thrown Error propagates to a 500 response,
    // breaking the entire page render for what may be just one missing
    // date display. The empty-string return degrades gracefully — the
    // new-year date field shows blank but the rest of the calendar
    // surface still renders. console.error ensures the failure is
    // detectable in production logs.
    console.error(`[regional-boundaries] empty boundary list for ${calendarId} ${year}; new-year date unavailable`);
    return { name: newYearNames[calendarId], date: '' };
  }
  return {
    name: newYearNames[calendarId],
    date: firstMonth.startDate,
  };
}

/**
 * Given today's date and a calendar's boundary list, return the index of
 * the month that contains today (or null if today is outside any boundary
 * in the list — should not happen for boundaries covering the current year).
 */
export function getCurrentMonthIndex(
  boundaries: MonthBoundary[],
  todayISO: string,
): number | null {
  for (let i = 0; i < boundaries.length; i++) {
    if (todayISO >= boundaries[i].startDate && todayISO <= boundaries[i].endDate) {
      return i;
    }
  }
  return null;
}

// ─── Implementations ─────────────────────────────────────────────────────────

/**
 * Solar boundary: each month begins on the day of its sankranti (sun
 * enters the next sign) and ends the day before the NEXT chronological
 * sankranti.
 *
 * Critical: the calendar year (e.g. Tamil Apr 2026 → Apr 2027) spans
 * TWO Gregorian years and uses 13 chronologically-consecutive sankrantis.
 * `computeSankrantis(year, tz)` only returns sankrantis whose local date
 * falls within `year` — so for the Tamil year starting April 2026 we
 * need sankrantis from BOTH `2026` and `2027`, walked in chronological
 * order. Earlier bug: indexing sankrantis by signId conflated 2026's
 * Makar Sankranti (Jan 14 2026) with 2027's (Jan 14 2027), causing
 * Margazhi-end to point back at January of the SAME Gregorian year
 * instead of the following one.
 */
function computeSolarBoundaries(
  calendarId: 'tamil' | 'malayalam' | 'odia',
  year: number,
): MonthBoundary[] {
  const ref = CALENDAR_REF_LOCATION[calendarId];
  const firstSign = SOLAR_FIRST_SIGN[calendarId];
  const monthNames = MONTH_NAMES[calendarId];

  // Walk both years chronologically. Sort by JD to guarantee strict
  // chronological order across the year boundary.
  const allSankrantis: SankrantiEntry[] = [
    ...computeSankrantis(year, ref.timezone),
    ...computeSankrantis(year + 1, ref.timezone),
  ].sort((a, b) => a.jd - b.jd);

  // Find the first sankranti of the calendar's start sign within target
  // Gregorian year (i.e. NOT a leftover from year-1 cycling).
  const startIdx = allSankrantis.findIndex(
    s => s.signId === firstSign && parseInt(s.date.substring(0, 4), 10) === year,
  );
  if (startIdx === -1) {
    console.error(`[regional-boundaries] no sankranti for sign=${firstSign} in ${calendarId} ${year}`);
    return [];
  }

  // Need 13 consecutive sankrantis: 12 month starts + 1 final boundary
  // (the next-year first sankranti, used to compute the LAST month's
  // end date as one-day-before-that).
  if (startIdx + 12 >= allSankrantis.length) {
    console.error(`[regional-boundaries] insufficient sankranti coverage for ${calendarId} ${year}`);
    return [];
  }

  const boundaries: MonthBoundary[] = [];
  for (let i = 0; i < 12; i++) {
    const startEntry = allSankrantis[startIdx + i];
    const nextEntry = allSankrantis[startIdx + i + 1];
    boundaries.push({
      name: monthNames[i],
      startDate: startEntry.date,
      endDate: subtractOneDay(nextEntry.date),
    });
  }

  return boundaries;
}

/**
 * Post-Saha (1966) Bengali civil calendar: anchored to Mesha sankranti
 * (typically April 14 or 15), then deterministic
 *   31 31 31 31 31 30 30 30 30 30 30 30 (= 365 days)
 * with Choitro (month 12) gaining a 31st day in Bengali leap years
 * (≈ when the Gregorian year is also a leap year).
 *
 * This is the modern reformed civil calendar used by the Government of
 * West Bengal / Bangladesh — NOT the older Bishuddha Siddhanta sidereal
 * panjika used for religious dates (those still come from the panchang
 * engine on /panchang and /festivals).
 */
function computeBengaliSahaBoundaries(year: number): MonthBoundary[] {
  const ref = CALENDAR_REF_LOCATION.bengali;
  const sankrantis = computeSankrantis(year, ref.timezone);
  const meshaSankranti = sankrantis.find(s => s.signId === 1);
  if (!meshaSankranti) {
    // Fallback — historically Apr 14 in modern India
    return sahaBengaliFromFallbackStart(year, `${year}-04-14`);
  }
  return sahaBengaliFromFallbackStart(year, meshaSankranti.date);
}

function sahaBengaliFromFallbackStart(year: number, boishakhStartISO: string): MonthBoundary[] {
  // Bengali leap-year detection: Gregorian leap year carries through. The
  // exact rule per the Saha reform is that the year is a Bengali leap when
  // (yearOfMeshaSankranti + 1) is a Gregorian leap year — which is when
  // Choitro gains an extra day. Simpler proxy: check if Gregorian year+1
  // is a leap year.
  const choitroYear = year + 1;
  const isBengaliLeap = isGregorianLeap(choitroYear);

  // First 5 months: 31 days. Last 7: 30 days (Choitro = 31 in leap years).
  const dayCounts = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, isBengaliLeap ? 31 : 30];

  const monthNames = MONTH_NAMES.bengali;
  const boundaries: MonthBoundary[] = [];
  let cursor = new Date(boishakhStartISO + 'T00:00:00Z');
  for (let i = 0; i < 12; i++) {
    const startDate = isoFromUTC(cursor);
    const endCursor = new Date(cursor);
    endCursor.setUTCDate(endCursor.getUTCDate() + dayCounts[i] - 1);
    const endDate = isoFromUTC(endCursor);

    boundaries.push({ name: monthNames[i], startDate, endDate });

    cursor = new Date(endCursor);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return boundaries;
}

/**
 * Lunisolar Amanta (Telugu/Kannada/Gujarati/Marathi) or Purnimanta
 * (Mithila) boundaries.
 *
 * Pulls from `buildYearlyTithiTable(year, lat, lng, tz).lunarMonths` or
 * `.purnimantMonths` — both already have Adhika Masa logic baked in. The
 * table returns ALL months that touch `year` (so the array may include
 * trailing months from year-1 or leading months from year+1 depending on
 * lunar phase alignment with Gregorian Jan 1).
 *
 * We trim to the 12 (or 13 with Adhika) months starting from the
 * calendar's first-masa (chaitra for most, kartik for Gujarati).
 */
function computeLunisolarBoundaries(
  calendarId: 'telugu' | 'kannada' | 'gujarati' | 'marathi' | 'mithila',
  year: number,
  system: 'amanta' | 'purnimanta',
): MonthBoundary[] {
  const ref = CALENDAR_REF_LOCATION[calendarId];
  const firstMasa = LUNISOLAR_FIRST_MASA[calendarId];
  const monthNames = MONTH_NAMES[calendarId];

  // Pull both year and year+1's tithi tables so we always have the full
  // calendar year (which may span Jan 1). Months that span the Dec-Jan
  // boundary appear in BOTH tables — dedupe by startDate before walking.
  const table1 = buildYearlyTithiTable(year, ref.lat, ref.lng, ref.timezone);
  const table2 = buildYearlyTithiTable(year + 1, ref.lat, ref.lng, ref.timezone);

  const rawMonths = system === 'amanta'
    ? [...table1.lunarMonths, ...table2.lunarMonths]
    : [...table1.purnimantMonths, ...table2.purnimantMonths];

  const seen = new Set<string>();
  const months: LunarMonthInfo[] = [];
  for (const m of rawMonths) {
    const key = `${m.startDate}:${m.name}:${m.isAdhika}`;
    if (seen.has(key)) continue;
    seen.add(key);
    months.push(m);
  }
  months.sort((a, b) => a.startDate.localeCompare(b.startDate));

  // Find the first occurrence of the calendar's start month in or after
  // the target Gregorian year. For Telugu/Marathi/Mithila: first Chaitra
  // of YYYY. For Gujarati: first Kartik of YYYY (which falls in Oct/Nov).
  //
  // Critical: do NOT filter out Adhika here. In years where the year
  // starts with an Adhika month (e.g. Telugu 2029 starts with Adhika
  // Chaitra Mar 15 → Apr 13, then nija Chaitra Apr 14), filtering out
  // Adhika would skip straight to nija Chaitra and drop the Adhika
  // entry from the year entirely. Gemini PR #354 round-4 HIGH.
  const startIdx = months.findIndex(m =>
    m.name === firstMasa && parseInt(m.startDate.substring(0, 4), 10) === year,
  );
  if (startIdx === -1) {
    console.error(`[regional-boundaries] no ${firstMasa} found in ${calendarId} ${year}`);
    return [];
  }

  // Take 12 or 13 entries (more if Adhika Masa interjects). We stop when
  // we hit the NEXT firstMasa (non-adhika) which marks the next year.
  //
  // The `i - startIdx > 1` guard (NOT `i > startIdx`) skips one extra
  // entry past startIdx. This matters when the year starts with Adhika:
  // startIdx points to "Adhika Chaitra", startIdx+1 is "nija Chaitra"
  // (same name, marks the current year — must NOT trigger the break),
  // and only startIdx+2 onwards could legitimately be the NEXT year's
  // Chaitra. Gemini PR #354 round-4 HIGH.
  const result: LunarMonthInfo[] = [];
  for (let i = startIdx; i < months.length; i++) {
    const m = months[i];
    if (i - startIdx > 1 && m.name === firstMasa && !m.isAdhika) break;
    result.push(m);
    if (result.length >= 13) break;  // Safety bound — should never exceed 13
  }

  return result.map((m) => {
    // Adhika months use the SAME canonical masa name as the following
    // nija month per canonical convention (e.g. tithi-table emits
    // 'jyeshtha' with isAdhika:true followed by 'jyeshtha' with
    // isAdhika:false). Since the canonical name is already correct on
    // m.name, we just look up the calendar-specific display name and
    // prepend "Adhika " when isAdhika is set.
    const baseName = capitaliseMasaToCalendarName(m.name, monthNames, firstMasa);
    return {
      name: m.isAdhika ? `Adhika ${baseName}` : baseName,
      startDate: m.startDate,
      endDate: m.endDate,
      ...(m.isAdhika ? { isAdhika: true } : {}),
    };
  });
}

/**
 * Map the tithi-table's canonical masa name (e.g. 'chaitra', 'vaishakha')
 * to the calendar-specific display name (e.g. Maithili 'जेठ', Tamil
 * 'ஆனி'). The canonical name on `masaName` is already correct for both
 * Adhika and nija months (tithi-table emits 'jyeshtha' with the
 * isAdhika flag for the Adhika entry, and 'jyeshtha' again with
 * isAdhika:false for the nija). The caller adds the "Adhika " prefix
 * separately.
 */
function capitaliseMasaToCalendarName(
  masaName: string,
  monthNames: string[],
  firstMasa: string,
): string {
  // Offset between calendar's first month and chaitra in canonical order
  const firstMasaIdx = CANONICAL_MASA.indexOf(firstMasa as typeof CANONICAL_MASA[number]);
  const targetIdx = CANONICAL_MASA.indexOf(masaName as typeof CANONICAL_MASA[number]);
  if (firstMasaIdx === -1 || targetIdx === -1) return masaName;

  // monthNames[0] = firstMasa; monthNames[1] = next canonical masa; etc.
  const displayIdx = (targetIdx - firstMasaIdx + 12) % 12;
  return monthNames[displayIdx] ?? masaName;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function subtractOneDay(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return isoFromUTC(d);
}

function isoFromUTC(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function isGregorianLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
