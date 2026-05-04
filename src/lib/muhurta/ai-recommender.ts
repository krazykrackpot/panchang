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
import { PUSHKAR_BHAGA, PUSHKAR_NAVAMSHA_SET } from '@/lib/constants/pushkar-bhaga';
import { RAHU_ORDER } from '@/lib/constants/inauspicious-orders';

export interface PanchangSnapshot {
  tithi: number;
  nakshatra: number;
  yoga: number;
  karana: number;
  weekday: number;
  moonSign: number;
  moonSid: number;  // Moon's sidereal longitude (degrees) — needed for Varjyam check
}

export interface PanchangSubScores {
  tithi: number;
  nakshatra: number;
  yoga: number;
  karana: number;
  weekday: number;
  panchaka: number;
}

/**
 * Score panchang factors (0-25)
 */
export function scorePanchangFactors(
  snap: PanchangSnapshot,
  rules: ExtendedActivity,
): { score: number; factors: LocaleText[]; subScores: PanchangSubScores } {
  let tithiScore = 0;
  let nakshatraScore = 0;
  let yogaScore = 0;
  let karanaScore = 0;
  let weekdayScore = 0;
  let panchakaScore = 0;
  const factors: LocaleText[] = [];

  // Normalize tithi to paksha-relative (1-15) for rule matching
  // Tithi 1-15 = Shukla, 16-30 = Krishna. Rules use 1-15 names.
  const pakshaRelTithi = snap.tithi > 15 ? snap.tithi - 15 : snap.tithi;
  const isKrishnaPaksha = snap.tithi > 15;

  // Tithi scoring — Muhurta Chintamani lists auspicious tithis (2,3,5,7,10,11,13)
  // without a paksha qualifier, but Shukla Paksha is universally preferred for
  // samskaras (waxing Moon = growth). Krishna Paksha tithis are allowed by some
  // traditions (South Indian, Prokerala) but penalised. See docs/muhurta-rules.md.
  if (rules.goodTithis.includes(pakshaRelTithi) && !isKrishnaPaksha) {
    tithiScore += 8;
    factors.push({ en: 'Auspicious Tithi (Shukla)', hi: 'शुभ तिथि (शुक्ल)', sa: 'शुभतिथिः (शुक्ले)' });
  } else if (rules.goodTithis.includes(pakshaRelTithi) && isKrishnaPaksha) {
    tithiScore += 1; // Krishna variant — allowed but strongly deprioritised
    factors.push({ en: 'Krishna Paksha — reduced auspiciousness', hi: 'कृष्ण पक्ष — न्यून शुभत्व', sa: 'कृष्णपक्षः — न्यूनशुभत्वम्' });
  } else if (isKrishnaPaksha && !rules.goodTithis.includes(pakshaRelTithi)) {
    tithiScore -= 3; // Krishna + non-good tithi = double penalty
  }
  // Avoid tithi: -5 (applies to both pakshas — Rikta tithis 4,9,14 etc.)
  if (rules.avoidTithis.includes(pakshaRelTithi)) {
    tithiScore -= 5;
    factors.push({ en: 'Inauspicious Tithi', hi: 'अशुभ तिथि', sa: 'अशुभतिथिः' });
  }

  // Nakshatra match: +8
  if (rules.goodNakshatras.includes(snap.nakshatra)) {
    nakshatraScore += 8;
    factors.push({ en: 'Auspicious Nakshatra', hi: 'शुभ नक्षत्र', sa: 'शुभनक्षत्रम्' });
  }
  if (rules.avoidNakshatras.includes(snap.nakshatra)) {
    nakshatraScore -= 5;
    factors.push({ en: 'Inauspicious Nakshatra', hi: 'अशुभ नक्षत्र', sa: 'अशुभनक्षत्रम्' });
  }

  // 9 Ashubh Yogas per Muhurta Chintamani Ch. 6 (Vivah Prakarana).
  // Each has specific ill effects for marriage. MC notes a Visha Ghati nuance
  // and lagna antidote, so this is a soft penalty, not a hard veto.
  // See docs/muhurta-rules.md for full citations.
  const INAUSPICIOUS_YOGAS = new Set([1, 6, 9, 10, 13, 15, 17, 19, 27]);
  if (!INAUSPICIOUS_YOGAS.has(snap.yoga)) {
    yogaScore += 4;
  } else {
    yogaScore -= 3;
    factors.push({ en: 'Inauspicious Yoga', hi: 'अशुभ योग', sa: 'अशुभयोगः' });
  }

  // Weekday scoring — Muhurta Chintamani recommends Mon/Wed/Thu/Fri for most
  // samskaras. Drik Panchang states weekdays are "given less importance" for
  // marriage selection, so this is a moderate factor, not a hard veto.
  // Tuesday is the most strongly avoided (Mars = conflict). Saturday (Saturn = delay)
  // is also inauspicious. Sunday is neutral-to-mild. See docs/muhurta-rules.md.
  if (rules.goodWeekdays.includes(snap.weekday)) {
    weekdayScore += 3;
    factors.push({ en: 'Favorable weekday', hi: 'अनुकूल वार', sa: 'अनुकूलवारः' });
  } else if (snap.weekday === 2) {
    // Tuesday — most strongly avoided across texts (Mangalvar = Mars)
    weekdayScore -= 4;
    factors.push({ en: 'Tuesday — generally avoided', hi: 'मंगलवार — सामान्यतः वर्ज्य', sa: 'मङ्गलवारः — सामान्यतः वर्ज्यः' });
  } else if (snap.weekday === 6) {
    // Saturday — Saturn's day, avoided for auspicious beginnings
    weekdayScore -= 3;
    factors.push({ en: 'Saturday — less auspicious', hi: 'शनिवार — अल्प शुभ', sa: 'शनिवारः — अल्पशुभः' });
  } else if (snap.weekday === 0) {
    // Sunday — mild penalty, some texts allow
    weekdayScore -= 1;
  }

  // Karana favorable (chara karanas 1-6): +2. Vishti/Bhadra (7) is most inauspicious.
  if (snap.karana >= 1 && snap.karana <= 6) {
    karanaScore += 2;
  } else if (snap.karana === 7) {
    karanaScore -= 5;
    factors.push({ en: 'Vishti (Bhadra) Karana — inauspicious', hi: 'विष्टि (भद्रा) करण — अशुभ', sa: 'विष्टिकरणम् — अशुभम्' });
  } else if ([8, 9, 10].includes(snap.karana)) {
    // Sthira karanas: Shakuni(8), Chatushpada(9), Naga(10) — inauspicious
    karanaScore -= 3;
    factors.push({ en: 'Sthira Karana — inauspicious', hi: 'स्थिर करण — अशुभ', sa: 'स्थिरकरणम् — अशुभम्' });
  } else if (snap.karana === 11) {
    // Kimstughna — auspicious sthira karana
    karanaScore += 2;
    factors.push({ en: 'Kimstughna Karana — auspicious', hi: 'किंस्तुघ्न करण — शुभ', sa: 'किंस्तुघ्नकरणम् — शुभम्' });
  }

  // Panchaka — inauspicious when Moon is in nakshatras 23-27
  // (Dhanishtha, Shatabhisha, Purva Bhadrapada, Uttara Bhadrapada, Revati)
  if (snap.nakshatra >= 23 && snap.nakshatra <= 27) {
    panchakaScore -= 5;
    factors.push({ en: 'Panchaka active — Moon in inauspicious nakshatra zone', hi: 'पंचक सक्रिय — चन्द्र अशुभ नक्षत्र क्षेत्र में', sa: 'पञ्चकं प्रवर्तते — चन्द्रः अशुभनक्षत्रक्षेत्रे' });
  }

  const subScores: PanchangSubScores = {
    tithi: tithiScore,
    nakshatra: nakshatraScore,
    yoga: yogaScore,
    karana: karanaScore,
    weekday: weekdayScore,
    panchaka: panchakaScore,
  };

  const rawScore = tithiScore + nakshatraScore + yogaScore + karanaScore + weekdayScore + panchakaScore;
  return { score: Math.max(0, Math.min(25, rawScore)), factors, subScores };
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
    // 24 Pushkar Navamsha positions (shared constant from constants/pushkar-bhaga.ts)
    if (PUSHKAR_NAVAMSHA_SET.has(signIdx * 9 + navamshaIdx)) {
      score += 8;
      factors.push({ en: 'Moon in Pushkar Navamsha — supremely auspicious', hi: 'चन्द्र पुष्कर नवांश में — अत्यंत शुभ', sa: 'चन्द्रः पुष्करनवांशे — अत्यन्तशुभम्' });
    }
    // Pushkar Bhaga (shared constant from constants/pushkar-bhaga.ts — Saravali / Kalaprakashika)
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
  const rahuDuration = dayDuration / 8;
  const rahuStartLocal = sunriseLocal + (RAHU_ORDER[weekday] - 1) * rahuDuration;
  const rahuEndLocal = rahuStartLocal + rahuDuration;
  if (hourOfDay < rahuStartLocal || hourOfDay > rahuEndLocal) {
    score += 3;
  } else {
    score -= 5;
    factors.push({ en: 'Rahu Kaal active', hi: 'राहुकाल चल रहा है', sa: 'राहुकालः प्रवर्तते' });
  }

  // Abhijit Muhurta — 8th daytime muhurta (around midday)
  // Universally auspicious EXCEPT Wednesdays (Muhurta Chintamani, Dharma Sindhu).
  // "On Budha-vara (Wednesday), Abhijit Muhurta is inauspicious and should be avoided."
  const dayMuhurtaDuration = (sunsetLocal - sunriseLocal) / 15;
  const abhijitStartLocal = sunriseLocal + 7 * dayMuhurtaDuration;
  const abhijitEndLocal = abhijitStartLocal + dayMuhurtaDuration;
  const isWednesday = weekday === 3; // 0=Sunday convention

  if (!isWednesday && hourOfDay >= abhijitStartLocal && hourOfDay < abhijitEndLocal) {
    score += 8;
    factors.push({ en: 'Abhijit Muhurta — universally auspicious', hi: 'अभिजित् मुहूर्त — सर्वशुभ', sa: 'अभिजित्मुहूर्तः — सर्वशुभः' });
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

  // Weekday from JD — Math.floor(jd + 1.5) % 7 gives 0=Sunday,
  // matching Date.getUTCDay() and all hora/choghadiya/Rahu Kaal lookup tables.
  const weekday = Math.floor(jd + 1.5) % 7; // 0=Sunday

  return {
    tithi: tithiResult.number,
    nakshatra,
    yoga,
    karana,
    weekday,
    moonSign,
    moonSid,
  };
}
