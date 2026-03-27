/**
 * Muhurta AI Recommender — Multi-factor scoring engine
 * Scores time windows 0-100 for any activity
 */

import {
  dateToJD, calculateTithi, calculateYoga, calculateKarana,
  sunLongitude, moonLongitude, toSidereal,
  getNakshatraNumber, getRashiNumber,
  approximateSunrise, approximateSunset, formatTime,
  getPlanetaryPositions,
} from '@/lib/ephem/astronomical';
import type { ExtendedActivity } from '@/types/muhurta-ai';
import type { Trilingual } from '@/types/panchang';

export interface PanchangSnapshot {
  tithi: number;
  nakshatra: number;
  yoga: number;
  karana: number;
  weekday: number;
  moonSign: number;
}

/**
 * Score panchang factors (0-25)
 */
export function scorePanchangFactors(
  snap: PanchangSnapshot,
  rules: ExtendedActivity,
): { score: number; factors: Trilingual[] } {
  let score = 0;
  const factors: Trilingual[] = [];

  // Tithi match: +8
  if (rules.goodTithis.includes(snap.tithi)) {
    score += 8;
    factors.push({ en: 'Auspicious Tithi', hi: 'शुभ तिथि', sa: 'शुभतिथिः' });
  }
  // Avoid tithi: -5
  if (rules.avoidTithis.includes(snap.tithi)) {
    score -= 5;
    factors.push({ en: 'Inauspicious Tithi', hi: 'अशुभ तिथि', sa: 'अशुभतिथिः' });
  }

  // Nakshatra match: +8
  if (rules.goodNakshatras.includes(snap.nakshatra)) {
    score += 8;
    factors.push({ en: 'Auspicious Nakshatra', hi: 'शुभ नक्षत्र', sa: 'शुभनक्षत्रम्' });
  }
  if (rules.avoidNakshatras.includes(snap.nakshatra)) {
    score -= 5;
    factors.push({ en: 'Inauspicious Nakshatra', hi: 'अशुभ नक्षत्र', sa: 'अशुभनक्षत्रम्' });
  }

  // Yoga auspicious (1-15 are generally auspicious): +4
  if (snap.yoga >= 1 && snap.yoga <= 15) {
    score += 4;
  }

  // Good weekday: +3
  if (rules.goodWeekdays.includes(snap.weekday)) {
    score += 3;
    factors.push({ en: 'Favorable weekday', hi: 'अनुकूल वार', sa: 'अनुकूलवारः' });
  }

  // Karana favorable (chara karanas 1-7): +2
  if (snap.karana >= 1 && snap.karana <= 7) {
    score += 2;
  }

  return { score: Math.max(0, Math.min(25, score)), factors };
}

/**
 * Score transit factors (0-25)
 */
export function scoreTransitFactors(
  jd: number,
  rules: ExtendedActivity,
): { score: number; factors: Trilingual[] } {
  let score = 0;
  const factors: Trilingual[] = [];
  const planets = getPlanetaryPositions(jd);

  // Convert to sidereal and check positions
  const benefics = [4, 5, 3]; // Jupiter, Venus, Mercury
  const malefics = [6, 2, 7]; // Saturn, Mars, Rahu
  const kendras = [1, 4, 7, 10];
  const trikonas = [1, 5, 9];

  for (const p of planets) {
    const sidLong = toSidereal(p.longitude, jd);
    const sign = getRashiNumber(sidLong);
    // Approximate house from sign (using Aries=1st for transit purposes)
    const sunSid = toSidereal(sunLongitude(jd), jd);
    const sunSign = getRashiNumber(sunSid);
    const house = ((sign - sunSign + 12) % 12) + 1;

    if (benefics.includes(p.id) && (kendras.includes(house) || trikonas.includes(house))) {
      score += 3;
      if (score <= 10) {
        const names: Record<number, Trilingual> = {
          4: { en: 'Jupiter well-placed', hi: 'गुरु शुभ स्थान', sa: 'गुरुः शुभस्थाने' },
          5: { en: 'Venus well-placed', hi: 'शुक्र शुभ स्थान', sa: 'शुक्रः शुभस्थाने' },
          3: { en: 'Mercury well-placed', hi: 'बुध शुभ स्थान', sa: 'बुधः शुभस्थाने' },
        };
        if (names[p.id]) factors.push(names[p.id]);
      }
    }

    if (malefics.includes(p.id) && !kendras.includes(house)) {
      score += 2;
    }
  }

  // No retrograde on activity-relevant planets: +5
  const retroPlanets = planets.filter(p => p.isRetrograde && benefics.includes(p.id));
  if (retroPlanets.length === 0) {
    score += 5;
    factors.push({ en: 'No benefic retrograde', hi: 'कोई शुभ ग्रह वक्री नहीं', sa: 'शुभग्रहवक्रता नास्ति' });
  }

  return { score: Math.max(0, Math.min(25, score)), factors };
}

/**
 * Score timing factors (0-25) — hora, choghadiya, rahu kaal
 */
export function scoreTimingFactors(
  jd: number,
  hourOfDay: number,
  weekday: number,
  sunriseUT: number,
  sunsetUT: number,
  tzOffset: number,
  rules: ExtendedActivity,
): { score: number; factors: Trilingual[] } {
  let score = 0;
  const factors: Trilingual[] = [];

  // Hora calculation
  const dayDuration = sunsetUT - sunriseUT;
  const nightDuration = 24 - dayDuration;
  const HORA_SEQUENCE = [0, 5, 3, 1, 6, 4, 2]; // Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars
  const HORA_DAY_START = [0, 3, 6, 2, 5, 1, 4];

  const localHour = hourOfDay - tzOffset;
  const isDay = localHour >= sunriseUT && localHour < sunsetUT;
  const horaDuration = isDay ? dayDuration / 12 : nightDuration / 12;
  const base = isDay ? sunriseUT : sunsetUT;
  const horaIndex = Math.floor((localHour - base) / horaDuration);
  const startIdx = HORA_DAY_START[weekday];
  const totalIdx = isDay ? horaIndex : horaIndex + 12;
  const seqIdx = (startIdx + Math.max(0, totalIdx)) % 7;
  const horaPlanet = HORA_SEQUENCE[seqIdx];

  // Matching hora: +12
  if (rules.goodHoras.includes(horaPlanet)) {
    score += 12;
    factors.push({ en: 'Favorable Hora', hi: 'अनुकूल होरा', sa: 'अनुकूलहोरा' });
  }

  // Choghadiya check (simplified — amrit/shubh/labh are good)
  const CHOG_TYPES = ['udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog'];
  const CHOG_DAY_START = [0, 4, 1, 5, 2, 6, 3];
  const daySlotDuration = dayDuration / 8;
  if (isDay) {
    const slotIdx = Math.floor((localHour - sunriseUT) / daySlotDuration);
    const typeIdx = (CHOG_DAY_START[weekday] + Math.max(0, slotIdx)) % 7;
    const chogType = CHOG_TYPES[typeIdx];
    if (['amrit', 'shubh', 'labh'].includes(chogType)) {
      score += 10;
      factors.push({ en: 'Auspicious Choghadiya', hi: 'शुभ चौघड़िया', sa: 'शुभचौघड़िया' });
    }
  }

  // Outside Rahu Kaal: +3
  const rahuOrder = [8, 2, 7, 5, 6, 4, 3];
  const rahuDuration = dayDuration / 8;
  const rahuStart = sunriseUT + (rahuOrder[weekday] - 1) * rahuDuration;
  const rahuEnd = rahuStart + rahuDuration;
  if (localHour < rahuStart || localHour > rahuEnd) {
    score += 3;
  } else {
    score -= 5;
    factors.push({ en: 'Rahu Kaal active', hi: 'राहुकाल चल रहा है', sa: 'राहुकालः प्रवर्तते' });
  }

  return { score: Math.max(0, Math.min(25, score)), factors };
}

/**
 * Get panchang snapshot for a given JD
 */
export function getPanchangSnapshot(jd: number, lat: number, lng: number): PanchangSnapshot {
  const sunriseJD = jd; // approximate
  const tithiResult = calculateTithi(sunriseJD);
  const moonSid = toSidereal(moonLongitude(sunriseJD), sunriseJD);
  const nakshatra = getNakshatraNumber(moonSid);
  const yoga = calculateYoga(sunriseJD);
  const karana = calculateKarana(sunriseJD);
  const moonSign = getRashiNumber(moonSid);

  // Weekday from JD
  const weekday = Math.floor(jd + 1.5) % 7;

  return {
    tithi: tithiResult.number,
    nakshatra,
    yoga,
    karana,
    weekday,
    moonSign,
  };
}
