/**
 * Main Panchang calculator
 * Computes all five elements (Panchangam): Tithi, Nakshatra, Yoga, Karana, Vara (weekday)
 */

import { dateToJD, normalizeAngle } from '../astronomy/julian';
import { getSolarPosition } from '../astronomy/solar';
import { getLunarPosition } from '../astronomy/lunar';
import { getSunTimes } from '../astronomy/sunrise';
import { getAyanamsa, tropicalToSidereal } from '../astronomy/ayanamsa';
import type { AyanamsaType } from '../astronomy/ayanamsa';
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

export function calculateTithi(sunLon: number, moonLon: number): TithiInfo {
  const diff = normalizeAngle(moonLon - sunLon);
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

export function calculateNakshatra(moonLon: number): NakshatraInfo {
  const nakshatraIndex = Math.floor(moonLon / (360 / 27)); // 0-26
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

export function calculateYoga(sunLon: number, moonLon: number): YogaInfo {
  const sum = normalizeAngle(sunLon + moonLon);
  const yogaIndex = Math.floor(sum / (360 / 27)); // 0-26
  const data = YOGA_DATA[yogaIndex];

  return {
    number: yogaIndex + 1,
    name: data.name,
    meaning: data.meaning,
    nature: data.nature,
  };
}

export function calculateKarana(sunLon: number, moonLon: number): KaranaInfo {
  const diff = normalizeAngle(moonLon - sunLon);
  const karanaNum = Math.floor(diff / 6); // 0-59

  let name: string;
  let nature: 'Movable' | 'Fixed' | 'Unstable';

  if (karanaNum === 0) {
    name = 'Kimstughna';
    nature = 'Fixed';
  } else if (karanaNum >= 57) {
    // Last 3 karanas: Shakuni, Chatushpada, Naga
    const fixedIndex = karanaNum - 57;
    name = KARANA_NAMES[7 + fixedIndex];
    nature = 'Fixed';
  } else {
    // Repeating cycle of 7 karanas
    const cycleIndex = ((karanaNum - 1) % 7);
    name = KARANA_NAMES[cycleIndex];
    nature = cycleIndex === 6 ? 'Unstable' : 'Movable'; // Vishti (Bhadra) is unstable
  }

  return {
    number: (karanaNum % 11) + 1,
    name,
    nature,
  };
}

/**
 * Calculate Rahu Kalam and other inauspicious periods
 * These are based on the day of the week and day duration
 */
export function calculateInauspiciousPeriods(
  sunrise: Date, sunset: Date, dayOfWeek: number
): { rahuKalam: RahuKalamInfo; yamagandam: RahuKalamInfo; gulikaKalam: RahuKalamInfo } {
  const dayDuration = (sunset.getTime() - sunrise.getTime()) / (1000 * 60); // minutes
  const eighthDuration = dayDuration / 8;

  // Rahu Kalam periods (8th of day) for each weekday (Sun=0 to Sat=6)
  const rahuPeriods = [8, 2, 7, 5, 6, 4, 3]; // Which 8th of the day
  // Yamagandam periods — descending 5→1 for Sun→Thu, then Fri=7, Sat=6
  // Source: Dharma Sindhu / Muhurta Chintamani
  const yamaPeriods = [5, 4, 3, 2, 1, 7, 6];
  // Gulika Kalam periods
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

export function calculatePanchang(input: PanchangInput): PanchangData {
  const { year, month, day, latitude, longitude, timezoneOffset, locationName = 'Custom Location', ayanamsaType = 'lahiri' } = input;

  // Get sunrise for this location
  const sunTimes = getSunTimes(year, month, day, latitude, longitude, timezoneOffset);

  // Calculate positions at sunrise (traditional panchang time)
  const sunriseHour = sunTimes.sunrise.getHours() + sunTimes.sunrise.getMinutes() / 60;
  const jd = dateToJD(year, month, day, sunriseHour - timezoneOffset, 0, 0);

  const ayanamsa = getAyanamsa(jd, ayanamsaType);
  const solar = getSolarPosition(jd);
  const lunar = getLunarPosition(jd);

  const sunLonSidereal = tropicalToSidereal(solar.apparentLongitude, ayanamsa);
  const moonLonSidereal = tropicalToSidereal(lunar.longitude, ayanamsa);

  const tithi = calculateTithi(sunLonSidereal, moonLonSidereal);
  const nakshatra = calculateNakshatra(moonLonSidereal);
  const yoga = calculateYoga(sunLonSidereal, moonLonSidereal);
  const karana = calculateKarana(sunLonSidereal, moonLonSidereal);

  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();

  const { rahuKalam, yamagandam, gulikaKalam } = calculateInauspiciousPeriods(
    sunTimes.sunrise, sunTimes.sunset, dayOfWeek
  );

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
