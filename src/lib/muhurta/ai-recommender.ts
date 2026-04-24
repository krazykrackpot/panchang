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
import type { LocaleText,} from '@/types/panchang';

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
): { score: number; factors: LocaleText[] } {
  let score = 0;
  const factors: LocaleText[] = [];

  // Normalize tithi to paksha-relative (1-15) for rule matching
  // Tithi 1-15 = Shukla, 16-30 = Krishna. Rules use 1-15 names.
  const pakshaRelTithi = snap.tithi > 15 ? snap.tithi - 15 : snap.tithi;
  const isKrishnaPaksha = snap.tithi > 15;

  // Tithi match: +8 (Shukla tithis favored; Krishna generally less auspicious)
  if (rules.goodTithis.includes(pakshaRelTithi) && !isKrishnaPaksha) {
    score += 8;
    factors.push({ en: 'Auspicious Tithi', hi: 'शुभ तिथि', sa: 'शुभतिथिः' });
  } else if (rules.goodTithis.includes(pakshaRelTithi) && isKrishnaPaksha) {
    score += 3; // Krishna variant of a good tithi — reduced benefit
  }
  // Avoid tithi: -5 (applies to both pakshas)
  if (rules.avoidTithis.includes(pakshaRelTithi)) {
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

  // Yoga: check against specific inauspicious yogas per Brihat Samhita
  // Inauspicious: Vishkambha(1), Atiganda(6), Shula(9), Ganda(10), Vyaghata(13), Vajra(15),
  //               Vyatipata(17), Parigha(19), Vaidhriti(27)
  const INAUSPICIOUS_YOGAS = new Set([1, 6, 9, 10, 13, 15, 17, 19, 27]);
  if (!INAUSPICIOUS_YOGAS.has(snap.yoga)) {
    score += 4;
  } else {
    score -= 3;
    factors.push({ en: 'Inauspicious Yoga', hi: 'अशुभ योग', sa: 'अशुभयोगः' });
  }

  // Good weekday: +3
  if (rules.goodWeekdays.includes(snap.weekday)) {
    score += 3;
    factors.push({ en: 'Favorable weekday', hi: 'अनुकूल वार', sa: 'अनुकूलवारः' });
  }

  // Karana favorable (chara karanas 1-6): +2. Vishti/Bhadra (7) is most inauspicious.
  if (snap.karana >= 1 && snap.karana <= 6) {
    score += 2;
  } else if (snap.karana === 7) {
    score -= 5;
    factors.push({ en: 'Vishti (Bhadra) Karana — inauspicious', hi: 'विष्टि (भद्रा) करण — अशुभ', sa: 'विष्टिकरणम् — अशुभम्' });
  }

  return { score: Math.max(0, Math.min(25, score)), factors };
}

/**
 * Score transit factors (0-25)
 */
export function scoreTransitFactors(
  jd: number,
  rules: ExtendedActivity,
): { score: number; factors: LocaleText[] } {
  let score = 0;
  const factors: LocaleText[] = [];
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
        const names: Record<number, LocaleText> = {
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

  // P2-11: Pushkar Navamsha and Pushkar Bhaga (Moon only — most impactful for muhurta)
  const moonPlanet = planets.find(p => p.id === 1);
  if (moonPlanet) {
    const moonSid = toSidereal(moonPlanet.longitude, jd);
    const moonSign = getRashiNumber(moonSid); // 1-based
    const degInSign = moonSid % 30;
    const navamshaIdx = Math.floor(degInSign / (30 / 9)); // 0-8
    const signIdx = moonSign - 1; // 0-based
    // 24 Pushkar Navamsha positions
    const PUSHKAR_NAV = new Set([0,4,13,17,20,24,27,33,36,40,47,51,54,60,65,67,76,80,83,87,90,96,101,103]);
    if (PUSHKAR_NAV.has(signIdx * 9 + navamshaIdx)) {
      score += 8;
      factors.push({ en: 'Moon in Pushkar Navamsha — supremely auspicious', hi: 'चन्द्र पुष्कर नवांश में — अत्यंत शुभ', sa: 'चन्द्रः पुष्करनवांशे — अत्यन्तशुभम्' });
    }
    // Pushkar Bhaga — one sacred degree per sign (Kalaprakashika)
    const PUSHKAR_BHAGA: Record<number, number> = { 1:21, 2:14, 3:18, 4:8, 5:19, 6:9, 7:24, 8:11, 9:23, 10:14, 11:19, 12:9 };
    const pb = PUSHKAR_BHAGA[moonSign];
    if (pb !== undefined && Math.abs(degInSign - pb) <= 0.8) {
      score += 10;
      factors.push({ en: `Moon at Pushkar Bhaga in ${['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'][moonSign-1]} — peak muhurta strength`, hi: `चन्द्र पुष्कर भाग पर — मुहूर्त का उच्चतम बल`, sa: `चन्द्रः पुष्करभागे — मुहूर्तशक्तिः परमा` });
    }
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
): { score: number; factors: LocaleText[] } {
  let score = 0;
  const factors: LocaleText[] = [];

  // Hora calculation
  const dayDuration = sunsetUT - sunriseUT;
  const nightDuration = 24 - dayDuration;
  const HORA_SEQUENCE = [0, 5, 3, 1, 6, 4, 2]; // Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars
  const HORA_DAY_START = [0, 3, 6, 2, 5, 1, 4];

  // hourOfDay is already local time (from time-window-scanner midH).
  // sunriseUT/sunsetUT are in UT hours. Convert to local for comparison.
  const sunriseLocal = sunriseUT + tzOffset;
  const sunsetLocal = sunsetUT + tzOffset;
  const isDay = hourOfDay >= sunriseLocal && hourOfDay < sunsetLocal;
  const horaDuration = isDay ? dayDuration / 12 : nightDuration / 12;
  const base = isDay ? sunriseLocal : sunsetLocal;
  const horaIndex = Math.floor((hourOfDay - base) / horaDuration);
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
  // Must match panchang-calc.ts: Sun=Udveg(0), Mon=Amrit(3), Tue=Rog(6), Wed=Labh(2), Thu=Shubh(5), Fri=Char(1), Sat=Kaal(4)
  const CHOG_DAY_START = [0, 3, 6, 2, 5, 1, 4];
  const daySlotDuration = dayDuration / 8;
  if (isDay) {
    const slotIdx = Math.floor((hourOfDay - sunriseLocal) / daySlotDuration);
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
  const rahuStartLocal = sunriseLocal + (rahuOrder[weekday] - 1) * rahuDuration;
  const rahuEndLocal = rahuStartLocal + rahuDuration;
  if (hourOfDay < rahuStartLocal || hourOfDay > rahuEndLocal) {
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
