/**
 * Legacy Panchang calculator — prefer src/lib/ephem/panchang-calc.ts for new code.
 *
 * This module uses the older astronomy/ layer. The canonical panchang computation
 * lives in ephem/panchang-calc.ts (which uses the Meeus/Swiss Ephemeris engine).
 * Retained for the golden-panchang test suite; do not add new callers.
 *
 * @deprecated Use {@link import('@/lib/ephem/panchang-calc')} instead.
 */

import { dateToJD, normalizeAngle } from '../astronomy/julian';
import { getSolarPosition } from '../astronomy/solar';
import { getLunarPosition } from '../astronomy/lunar';
import { getSunTimes } from '../astronomy/sunrise';
import { getAyanamsha as getAyanamsa, toSidereal as _toSidereal, type AyanamshaType as AyanamsaType } from '../ephem/astronomical';
/** Adapter: Module B's toSidereal takes (lon, jd, ayanamsha?) — we have pre-computed ayanamsha. */
const tropicalToSidereal = (lon: number, ayanamsa: number) => _toSidereal(lon, 0, ayanamsa);
import {
  type PanchangData, type TithiInfo, type NakshatraInfo, type YogaInfo, type KaranaInfo, type RahuKalamInfo,
  TITHI_NAMES, TITHI_DEITIES, NAKSHATRA_DATA, YOGA_DATA, KARANA_NAMES,
} from './types';

const TITHI_DESCRIPTIONS: string[] = [
  'First day after New/Full Moon. Good for beginnings.',
  'Second lunar day. Favorable for starting journeys.',
  'Third lunar day. Auspicious for religious ceremonies.',
  'Fourth lunar day. Associated with conflict; caution advised.',
  'Fifth lunar day. Excellent for education and learning.',
  'Sixth lunar day. Good for festivities and celebrations.',
  'Seventh lunar day. Favorable for travel and movement.',
  'Eighth lunar day. Day of transformation and spiritual practice.',
  'Ninth lunar day. Auspicious for worship and devotion.',
  'Tenth lunar day. Good for administrative work.',
  'Eleventh lunar day. Sacred fasting day; spiritual merit.',
  'Twelfth lunar day. Auspicious for charity and giving.',
  'Thirteenth lunar day. Good for friendship and love.',
  'Fourteenth lunar day. Day of Shiva worship.',
  'Full Moon / New Moon. Powerful day for spiritual practices.',
];

/**
 * Calculate the current tithi from sidereal Sun and Moon longitudes.
 *
 * Tithi = one of 30 lunar days in a synodic month (Surya Siddhanta Ch. 14).
 * Each tithi spans exactly 12° of the Moon-Sun elongation (360° / 30 = 12°).
 *   tithi_number = floor((moonLon - sunLon) / 12°) + 1
 *
 * Shukla Paksha (waxing, tithis 1-15): Moon moving away from Sun (0°-180°)
 * Krishna Paksha (waning, tithis 16-30): Moon returning toward Sun (180°-360°)
 *
 * The 15th tithi of each paksha is special:
 *   Shukla 15 = Purnima (Full Moon), Krishna 15 = Amavasya (New Moon)
 *
 * @param sunLon  - Sidereal longitude of the Sun (degrees)
 * @param moonLon - Sidereal longitude of the Moon (degrees)
 */
export function calculateTithi(sunLon: number, moonLon: number): TithiInfo {
  // Moon-Sun elongation, normalised to [0°, 360°)
  const diff = normalizeAngle(moonLon - sunLon);
  // Each tithi is 12° of elongation; 0-29 maps to tithis 1-30
  const tithiNum = Math.floor(diff / 12); // 0-29
  const paksha = tithiNum < 15 ? 'Shukla' : 'Krishna';
  const descIndex = tithiNum % 15;

  return {
    number: tithiNum + 1,
    name: TITHI_NAMES[tithiNum],
    paksha,
    deity: TITHI_DEITIES[tithiNum],
    description: TITHI_DESCRIPTIONS[descIndex],
  };
}

/**
 * Calculate the current nakshatra from the Moon's sidereal longitude.
 *
 * The 27 nakshatras divide the sidereal zodiac into equal 13°20' (13.333°) arcs
 * (Surya Siddhanta Ch. 8). Each nakshatra has 4 padas of 3°20' (3.333°) each.
 *
 * The nakshatra is determined solely by the Moon's position — it indicates
 * the lunar mansion the Moon currently occupies. This is the most fundamental
 * element of the Vedic calendar and governs muhurta selection.
 *
 * Note: 360° / 27 = 13.333° per nakshatra; 360° / 108 = 3.333° per pada.
 *
 * @param moonLon - Sidereal longitude of the Moon (degrees)
 */
export function calculateNakshatra(moonLon: number): NakshatraInfo {
  // 27 equal divisions of 13°20' each
  const nakshatraIndex = Math.floor(moonLon / (360 / 27)); // 0-26
  // Pada: sub-division within the nakshatra (each 3°20')
  const padaAngle = moonLon - nakshatraIndex * (360 / 27);
  const pada = Math.floor(padaAngle / (360 / 108)) + 1; // 1-4
  const data = NAKSHATRA_DATA[nakshatraIndex];

  const descriptions: string[] = [
    'Swift and energetic. Excellent for healing and new ventures.',
    'Creative force. Time for patience and endurance.',
    'Sharp and purifying. Good for spiritual practices.',
    'Fertile and creative. Ideal for arts and romance.',
    'Searching and curious. Good for exploration and research.',
    'Intense and transformative. Time for deep inner work.',
    'Renewal and return. Excellent for starting over.',
    'Nourishing and supportive. Ideal for spiritual growth.',
    'Mystical and intuitive. Good for occult practices.',
    'Royal and ancestral. Time for honoring traditions.',
    'Creative enjoyment. Good for celebrations.',
    'Wealth through patronage. Favorable for contracts.',
    'Skillful and dexterous. Ideal for craftsmanship.',
    'Brilliant and creative. Good for artistic work.',
    'Independent and scattered. Good for business.',
    'Purposeful and determined. Ideal for achieving goals.',
    'Devoted and friendly. Good for building relationships.',
    'Protective and senior. Time for taking charge.',
    'Root and foundation. Good for research and investigation.',
    'Invincible. Favorable for declarations and debates.',
    'Universal and permanent. Good for lasting endeavors.',
    'Connected and learning. Ideal for knowledge pursuits.',
    'Wealthy and musical. Good for property matters.',
    'Veiling and healing. Good for meditation and healing.',
    'Scorching and passionate. Time for penance.',
    'Deep and stable. Good for charity and service.',
    'Nourishing and protective. Ideal for ending cycles.',
  ];

  return {
    number: nakshatraIndex + 1,
    name: data.name,
    deity: data.deity,
    ruler: data.ruler,
    symbol: data.symbol,
    pada: Math.min(pada, 4),
    description: descriptions[nakshatraIndex],
  };
}

/**
 * Calculate the current yoga from sidereal Sun and Moon longitudes.
 *
 * Yoga is one of the five limbs of the panchanga (Surya Siddhanta Ch. 14).
 * Unlike tithi (which uses Moon-Sun difference), yoga uses their SUM:
 *   yoga_number = floor((sunLon + moonLon) / (360/27)) + 1
 *
 * There are 27 yogas, each spanning 13°20' of the Sun+Moon sum.
 * Yoga indicates the combined solar-lunar energy and is used for muhurta
 * selection. Some yogas (e.g. Vishkambha, Vajra) are considered inauspicious;
 * others (e.g. Siddhi, Shubha) are highly auspicious.
 *
 * @param sunLon  - Sidereal longitude of the Sun (degrees)
 * @param moonLon - Sidereal longitude of the Moon (degrees)
 */
export function calculateYoga(sunLon: number, moonLon: number): YogaInfo {
  // Sum of Sun and Moon longitudes, normalised to [0°, 360°)
  const sum = normalizeAngle(sunLon + moonLon);
  // 27 equal divisions of 13°20' each
  const yogaIndex = Math.floor(sum / (360 / 27)); // 0-26
  const data = YOGA_DATA[yogaIndex];

  return {
    number: yogaIndex + 1,
    name: data.name,
    meaning: data.meaning,
    nature: data.nature,
  };
}

/**
 * Calculate the current karana from sidereal Sun and Moon longitudes.
 *
 * Karana = half-tithi. Each tithi (12°) contains two karanas of 6° each,
 * giving 60 karanas per synodic month (Surya Siddhanta Ch. 14).
 *
 * There are 11 named karanas total:
 *   - 4 Fixed (Sthira): Kimstughna (1st), Shakuni (58th), Chatushpada (59th), Naga (60th)
 *   - 7 Movable (Chara): Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti
 *     These 7 repeat in order for karanas 2-57 (8 complete cycles)
 *   - Vishti (Bhadra) is classified as "Unstable" and is considered inauspicious
 *     for muhurta purposes (Lesson BB)
 *
 * The fixed karanas occupy positions 1, 58, 59, 60 in the cycle; the remaining
 * 56 positions are filled by the 7 movable karanas repeating 8 times.
 *
 * @param sunLon  - Sidereal longitude of the Sun (degrees)
 * @param moonLon - Sidereal longitude of the Moon (degrees)
 */
export function calculateKarana(sunLon: number, moonLon: number): KaranaInfo {
  // Moon-Sun elongation determines both tithi and karana
  const diff = normalizeAngle(moonLon - sunLon);
  // Each karana spans 6° of elongation; 60 karanas per lunation
  const karanaNum = Math.floor(diff / 6); // 0-59

  let name: string;
  let nature: 'Movable' | 'Fixed' | 'Unstable';

  if (karanaNum === 0) {
    // First karana of the cycle — Kimstughna (fixed, occurs only once)
    name = 'Kimstughna';
    nature = 'Fixed';
  } else if (karanaNum >= 57) {
    // Last 3 karanas: Shakuni (58th), Chatushpada (59th), Naga (60th) — all fixed
    // These sthira karanas are considered inauspicious for new undertakings
    const fixedIndex = karanaNum - 57;
    name = KARANA_NAMES[7 + fixedIndex];
    nature = 'Fixed';
  } else {
    // Karanas 2-57: repeating cycle of 7 movable karanas (8 full cycles)
    const cycleIndex = ((karanaNum - 1) % 7);
    name = KARANA_NAMES[cycleIndex];
    // Vishti (Bhadra, index 6) is classified as Unstable/inauspicious
    nature = cycleIndex === 6 ? 'Unstable' : 'Movable';
  }

  return {
    number: (karanaNum % 11) + 1,
    name,
    nature,
  };
}

/**
 * Calculate Rahu Kalam, Yamagandam, and Gulika Kalam for a given day.
 *
 * These are three inauspicious time windows derived from dividing the
 * daytime (sunrise to sunset) into 8 equal parts (Muhurta Chintamani, Dharma Sindhu).
 * Each weekday has a fixed assignment of which eighth is ruled by Rahu, Yama, and Gulika.
 *
 * The periods are location-dependent because they scale with actual day length:
 * longer days (summer) produce longer inauspicious windows, and vice versa.
 *
 * Classical sources for the weekday assignments:
 *   - Rahu Kalam: widely standardised (Muhurta Chintamani)
 *   - Yamagandam: Dharma Sindhu
 *   - Gulika Kalam: computed from Saturn's hora sequence
 *
 * @param sunrise   - Local sunrise time
 * @param sunset    - Local sunset time
 * @param dayOfWeek - 0=Sunday through 6=Saturday (Lesson O: matches Date.getDay())
 */
export function calculateInauspiciousPeriods(
  sunrise: Date, sunset: Date, dayOfWeek: number
): { rahuKalam: RahuKalamInfo; yamagandam: RahuKalamInfo; gulikaKalam: RahuKalamInfo } {
  // Total daytime in minutes, divided into 8 equal segments
  const dayDuration = (sunset.getTime() - sunrise.getTime()) / (1000 * 60); // minutes
  const eighthDuration = dayDuration / 8;

  // Rahu Kalam: which 8th of the day is ruled by Rahu (1-indexed).
  // Mnemonic: "Mother Saw Father Wearing The Turban Suddenly" (Mon=2, Sat=7, Fri=4, Wed=5, Thu=6, Tue=3, Sun=8)
  // Array indexed by JS dayOfWeek: [Sun=0, Mon=1, ..., Sat=6]
  const rahuPeriods = [8, 2, 7, 5, 6, 4, 3];
  // Yamagandam: ruled by Yama (god of death). Descending sequence Sun→Thu (5,4,3,2,1), Fri=7, Sat=6
  // Source: Dharma Sindhu / Muhurta Chintamani
  const yamaPeriods = [5, 4, 3, 2, 1, 7, 6];
  // Gulika Kalam: ruled by Saturn's son Gulika. Descending from Sun→Sat (7,6,5,4,3,2,1)
  const gulikaPeriods = [7, 6, 5, 4, 3, 2, 1];

  const makePeriod = (periodNum: number, label: string): RahuKalamInfo => {
    const startMinutes = (periodNum - 1) * eighthDuration;
    const start = new Date(sunrise.getTime() + startMinutes * 60 * 1000);
    const end = new Date(start.getTime() + eighthDuration * 60 * 1000);
    return { start, end, label };
  };

  return {
    rahuKalam: makePeriod(rahuPeriods[dayOfWeek], 'Rahu Kalam'),
    yamagandam: makePeriod(yamaPeriods[dayOfWeek], 'Yamagandam'),
    gulikaKalam: makePeriod(gulikaPeriods[dayOfWeek], 'Gulika Kalam'),
  };
}

export interface PanchangInput {
  year: number;
  month: number;
  day: number;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  locationName?: string;
  ayanamsaType?: AyanamsaType;
}

/**
 * Calculate full panchang data for a given date and location.
 *
 * The panchang (five limbs) is computed at the moment of local sunrise,
 * following the traditional convention that the Hindu day begins at sunrise
 * (not midnight). The five limbs are:
 *   1. Tithi    — lunar day (Moon-Sun elongation / 12°)
 *   2. Nakshatra — lunar mansion (Moon's sidereal position / 13°20')
 *   3. Yoga     — Sun+Moon combination ((sunLon + moonLon) / 13°20')
 *   4. Karana   — half-tithi (Moon-Sun elongation / 6°)
 *   5. Vara     — weekday (computed from the civil date)
 *
 * All longitudes are converted from tropical to sidereal using the
 * specified ayanamsha (default: Lahiri/Chitrapaksha).
 */
export function calculatePanchang(input: PanchangInput): PanchangData {
  const { year, month, day, latitude, longitude, timezoneOffset, locationName = 'Custom Location', ayanamsaType = 'lahiri' } = input;

  // Step 1: Compute local sunrise — the panchang day starts at sunrise
  const sunTimes = getSunTimes(year, month, day, latitude, longitude, timezoneOffset);

  // Step 2: Compute Julian Day at the moment of sunrise (in UT)
  // sunriseHour is in local time; subtracting timezoneOffset converts to UT
  const sunriseHour = sunTimes.sunrise.getHours() + sunTimes.sunrise.getMinutes() / 60;
  const jd = dateToJD(year, month, day, sunriseHour - timezoneOffset, 0, 0);

  // Step 3: Get ayanamsha for tropical → sidereal conversion
  const ayanamsa = getAyanamsa(jd, ayanamsaType);

  // Step 4: Compute tropical positions from the Meeus-based engines
  const solar = getSolarPosition(jd);
  const lunar = getLunarPosition(jd);

  // Step 5: Convert to sidereal (Vedic) longitudes by subtracting ayanamsha
  const sunLonSidereal = tropicalToSidereal(solar.apparentLongitude, ayanamsa);
  const moonLonSidereal = tropicalToSidereal(lunar.longitude, ayanamsa);

  // Step 6: Compute the five panchanga elements from sidereal longitudes
  const tithi = calculateTithi(sunLonSidereal, moonLonSidereal);
  const nakshatra = calculateNakshatra(moonLonSidereal);
  const yoga = calculateYoga(sunLonSidereal, moonLonSidereal);
  const karana = calculateKarana(sunLonSidereal, moonLonSidereal);

  // Vara (weekday) — derived from the civil calendar date
  // Lesson O: dayOfWeek uses JS convention: 0=Sunday, 1=Monday, ..., 6=Saturday
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();

  // Step 7: Compute inauspicious periods (Rahu Kalam, Yamagandam, Gulika)
  const { rahuKalam, yamagandam, gulikaKalam } = calculateInauspiciousPeriods(
    sunTimes.sunrise, sunTimes.sunset, dayOfWeek
  );

  // Moon phase angle (elongation) for display purposes
  const moonPhase = normalizeAngle(moonLonSidereal - sunLonSidereal);

  return {
    date,
    tithi,
    nakshatra,
    yoga,
    karana,
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    rahuKalam,
    yamagandam,
    gulikaKalam,
    sunLongitude: sunLonSidereal,
    moonLongitude: moonLonSidereal,
    moonPhase,
    ayanamsa,
    location: {
      name: locationName,
      latitude,
      longitude,
      timezone: timezoneOffset,
    },
  };
}
