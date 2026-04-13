/**
 * Activity Muhurat Calendar Engine
 * Finds auspicious dates for specific activities based on Tithi, Nakshatra, Vara, Yoga
 */

import {
  dateToJD, getRashiNumber, getNakshatraNumber,
  calculateTithi, calculateYoga, sunLongitude, moonLongitude,
  toSidereal, approximateSunrise, approximateSunset,
} from '@/lib/ephem/astronomical';
import type { LocaleText,} from '@/types/panchang';

export interface MuhuratDate {
  date: string;           // YYYY-MM-DD
  weekday: number;        // 0=Sun, 6=Sat
  tithi: number;
  nakshatra: number;
  yoga: number;
  moonSign: number;
  quality: 'excellent' | 'good' | 'acceptable';
}

export type MuhuratActivity =
  | 'marriage'
  | 'griha_pravesh'
  | 'mundan'
  | 'vehicle'
  | 'travel'
  | 'property'
  | 'business'
  | 'education';

interface ActivityRules {
  label: LocaleText;
  goodTithis: number[];       // 1-30
  goodNakshatras: number[];   // 1-27
  goodWeekdays: number[];     // 0-6
  avoidTithis: number[];
  avoidNakshatras: number[];
}

const ACTIVITY_RULES: Record<MuhuratActivity, ActivityRules> = {
  marriage: {
    label: { en: 'Marriage (Vivah)', hi: 'विवाह', sa: 'विवाहः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [3, 4, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
  },
  griha_pravesh: {
    label: { en: 'Griha Pravesh', hi: 'गृह प्रवेश', sa: 'गृहप्रवेशः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
  },
  mundan: {
    label: { en: 'Mundan (First Haircut)', hi: 'मुण्डन', sa: 'मुण्डनम्' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 11, 12, 13, 20, 21, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
  },
  vehicle: {
    label: { en: 'Vehicle Purchase', hi: 'वाहन खरीद', sa: 'वाहनक्रयः' },
    goodTithis: [2, 3, 5, 6, 7, 10, 11, 12, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
  },
  travel: {
    label: { en: 'Travel', hi: 'यात्रा', sa: 'यात्रा' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
  },
  property: {
    label: { en: 'Property Purchase', hi: 'भूमि/सम्पत्ति खरीद', sa: 'भूमिक्रयः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 23, 24, 26],
  },
  business: {
    label: { en: 'New Business', hi: 'नया व्यापार', sa: 'नवव्यापारः' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 19, 23, 24, 26],
  },
  education: {
    label: { en: 'Education Start', hi: 'विद्यारम्भ', sa: 'विद्यारम्भः' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [2, 3, 6, 7, 8, 11, 12, 13, 14, 20, 21, 22, 25, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 5, 9, 15, 16, 17, 18, 23, 24, 26],
  },
};

export function getActivityRules(activity: MuhuratActivity): ActivityRules {
  return ACTIVITY_RULES[activity];
}

export function getAllActivities(): { key: MuhuratActivity; label: LocaleText }[] {
  return (Object.entries(ACTIVITY_RULES) as [MuhuratActivity, ActivityRules][]).map(
    ([key, rules]) => ({ key, label: rules.label })
  );
}

/**
 * Scan a month for auspicious muhurat dates for a given activity
 */
export function findMuhuratDates(
  year: number,
  month: number,
  activity: MuhuratActivity,
  lat: number,
  lng: number,
): MuhuratDate[] {
  const rules = ACTIVITY_RULES[activity];
  const results: MuhuratDate[] = [];

  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const jd = dateToJD(year, month, day, 0.5); // ~noon IST (6 UT)
    const sunriseJD = approximateSunrise(Math.floor(jd), lat, lng);
    const sunriseJDFull = Math.floor(jd) + sunriseJD / 24;

    const tithi = calculateTithi(sunriseJDFull);
    const yoga = calculateYoga(sunriseJDFull);
    const moonSid = toSidereal(moonLongitude(sunriseJDFull), sunriseJDFull);
    const nakshatra = getNakshatraNumber(moonSid);
    const moonSign = getRashiNumber(moonSid);

    const dateObj = new Date(year, month - 1, day);
    const weekday = dateObj.getDay();

    // Check if this is an avoid date
    if (rules.avoidTithis.includes(tithi.number)) continue;
    if (rules.avoidNakshatras.includes(nakshatra)) continue;

    // Check if this is a good date
    const tithiGood = rules.goodTithis.includes(tithi.number);
    const nakshatraGood = rules.goodNakshatras.includes(nakshatra);
    const weekdayGood = rules.goodWeekdays.includes(weekday);

    let quality: 'excellent' | 'good' | 'acceptable' | null = null;

    if (tithiGood && nakshatraGood && weekdayGood) {
      quality = 'excellent';
    } else if ((tithiGood && nakshatraGood) || (tithiGood && weekdayGood) || (nakshatraGood && weekdayGood)) {
      quality = 'good';
    } else if (tithiGood || nakshatraGood) {
      quality = 'acceptable';
    }

    if (quality) {
      results.push({
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        weekday,
        tithi: tithi.number,
        nakshatra,
        yoga,
        moonSign,
        quality,
      });
    }
  }

  return results;
}
