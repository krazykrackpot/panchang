/**
 * National Forecast Engine for Mundane Astrology
 *
 * Given a nation chart + current date:
 * 1. Generates the nation's kundali using generateKundali()
 * 2. Computes current transits (Saturn, Jupiter, Rahu/Ketu, Mars, Sun) over the natal chart
 * 3. Scores each mundane house (1-10) based on transit benefics/malefics
 * 4. Returns a per-domain forecast
 *
 * Classical basis: Raphael's Mundane Astrology, Baigent/Campion/Harvey Ch.11-14
 */

import { generateKundali } from '@/lib/ephem/kundali-calc';
import {
  dateToJD,
  getPlanetaryPositions,
  toSidereal,
  lahiriAyanamsha,
  normalizeDeg,
} from '@/lib/ephem/astronomical';
import {
  MUNDANE_HOUSES,
  PLANET_MUNDANE_NATURE,
  SATURN_BENEFICIAL_HOUSES,
  DOMAIN_LABELS,
  TRANSIT_PLANET_NAMES,
} from './constants';
import type { NationChart } from './nation-charts';

export interface TransitEvent {
  planetId: number;
  planetName: string;
  transitLng: number;      // current transit longitude (sidereal)
  natalHouse: number;      // which natal house this planet is transiting
  nature: 'benefic' | 'malefic' | 'neutral';
  description: string;     // brief thematic description
}

export interface DomainForecast {
  house: number;
  domain: string;
  label: { en: string; hi: string; ta: string; bn: string };
  score: number;           // 1-10 (10 = excellent)
  tone: 'excellent' | 'good' | 'neutral' | 'caution' | 'challenging';
  transits: TransitEvent[];
  summary: { en: string; hi: string; ta: string; bn: string };
}

export interface NationalForecastResult {
  nationId: string;
  nationName: { en: string; hi: string; ta: string; bn: string };
  forecastDate: string;    // ISO date for which forecast is generated
  lagnaSign: number;       // natal lagna (1-12)
  lagnaSignName: string;
  natalPlanets: Array<{
    planetId: number;
    planetName: string;
    sign: number;
    house: number;
    longitude: number;
  }>;
  currentTransits: TransitEvent[];
  domainForecasts: DomainForecast[];
  overallScore: number;    // average of all domain scores
  overallOutlook: { en: string; hi: string; ta: string; bn: string };
  disclaimer: string;
}

// Planet transit descriptions over mundane houses (house → planet → effect)
const TRANSIT_DESCRIPTIONS: Record<number, Partial<Record<number, string>>> = {
  1:  { 4: 'Jupiter transiting 1st — national prosperity and public morale uplift', 6: 'Saturn transiting 1st — period of austerity and national testing', 2: 'Mars transiting 1st — tension in national affairs', 7: 'Rahu transiting 1st — foreign influence, public confusion' },
  2:  { 4: 'Jupiter over 2nd — economic expansion, treasury gains', 6: 'Saturn over 2nd — fiscal austerity, reduced revenue', 2: 'Mars over 2nd — economic conflicts, sudden expenditure', 7: 'Rahu over 2nd — speculative boom and bust, foreign funds' },
  3:  { 4: 'Jupiter over 3rd — communications flourish, diplomatic progress', 6: 'Saturn over 3rd — infrastructure delays, press restrictions', 2: 'Mars over 3rd — transport accidents, media conflicts' },
  4:  { 4: 'Jupiter over 4th — agricultural prosperity, land value gains', 6: 'Saturn over 4th — drought risk, land disputes, housing stress', 2: 'Mars over 4th — natural calamities, opposition unrest' },
  5:  { 4: 'Jupiter over 5th — markets rise, cultural renaissance', 6: 'Saturn over 5th — market corrections, entertainment sector stress', 2: 'Mars over 5th — speculative volatility' },
  6:  { 4: 'Jupiter over 6th — improved public health, military strength', 6: 'Saturn over 6th — chronic health issues, labour unrest (but stabilising)', 2: 'Mars over 6th — military action, epidemic risk' },
  7:  { 4: 'Jupiter over 7th — diplomatic gains, favourable treaties', 6: 'Saturn over 7th — strained diplomacy, slow negotiations', 2: 'Mars over 7th — border tensions, conflict risk', 7: 'Rahu over 7th — unconventional foreign partnerships' },
  8:  { 4: 'Jupiter over 8th — managed debt, resilience in crises', 6: 'Saturn over 8th — debt burden, tax reforms, mortality concerns', 2: 'Mars over 8th — accidents, natural disasters, sudden losses', 7: 'Rahu over 8th — hidden crises, pandemic risk' },
  9:  { 4: 'Jupiter over 9th — judicial reforms, educational expansion, international respect', 6: 'Saturn over 9th — legal delays, religious tensions', 2: 'Mars over 9th — legal conflicts, religious controversies' },
  10: { 4: 'Jupiter over 10th — strong government leadership, international prestige', 6: 'Saturn over 10th — leadership challenges, government accountability scrutiny', 2: 'Mars over 10th — government boldness or aggression', 0: 'Sun over 10th — heightened focus on government and leadership' },
  11: { 4: 'Jupiter over 11th — parliamentary gains, income expansion', 6: 'Saturn over 11th — delayed reforms but eventual gains', 2: 'Mars over 11th — conflicts within legislature' },
  12: { 4: 'Jupiter over 12th — hidden blessings, spiritual national revival', 6: 'Saturn over 12th — foreign expenditure drain, isolation', 2: 'Mars over 12th — espionage concerns, foreign military threat', 7: 'Rahu over 12th — foreign debt, covert operations' },
};

/** Get which house a transit planet occupies relative to natal lagna */
function getTransitHouse(transitLng: number, lagnaLng: number): number {
  const relLng = normalizeDeg(transitLng - lagnaLng);
  return Math.floor(relLng / 30) + 1;
}

/** Score a house based on the transiting planets (1-10) */
function scoreHouse(house: number, transits: TransitEvent[]): number {
  let score = 5; // baseline neutral

  for (const t of transits) {
    if (t.natalHouse !== house) continue;

    const pid = t.planetId;
    const nature = t.nature;

    // Special case: Saturn in 3/6/11 is beneficial in mundane
    if (pid === 6 && (SATURN_BENEFICIAL_HOUSES as readonly number[]).includes(house)) {
      score += 1.5;
    } else if (nature === 'benefic') {
      score += pid === 4 ? 2 : 1; // Jupiter +2, others +1
    } else if (nature === 'malefic') {
      score -= pid === 6 || pid === 7 ? 2 : 1.5; // Saturn/Rahu -2, Mars -1.5
    }
  }

  return Math.max(1, Math.min(10, Math.round(score)));
}

function scoreTone(score: number): DomainForecast['tone'] {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 5) return 'neutral';
  if (score >= 3) return 'caution';
  return 'challenging';
}

function buildSummary(
  domain: string,
  tone: DomainForecast['tone'],
  transits: TransitEvent[],
): { en: string; hi: string; ta: string; bn: string } {
  const domainLabel = DOMAIN_LABELS[domain];

  const tonePhrases: Record<DomainForecast['tone'], { en: string; hi: string; ta: string; bn: string }> = {
    excellent: { en: 'strongly favoured', hi: 'अत्यन्त अनुकूल', ta: 'மிகவும் சாதகமாக', bn: 'অত্যন্ত অনুকূল' },
    good:      { en: 'generally favourable', hi: 'सामान्यतः अनुकूल', ta: 'பொதுவாக சாதகமாக', bn: 'সাধারণত অনুকূল' },
    neutral:   { en: 'mixed influences', hi: 'मिश्रित प्रभाव', ta: 'கலவையான தாக்கங்கள்', bn: 'মিশ্র প্রভাব' },
    caution:   { en: 'under pressure', hi: 'दबाव में', ta: 'அழுத்தத்தில்', bn: 'চাপের মধ্যে' },
    challenging: { en: 'significantly stressed', hi: 'गम्भीर दबाव में', ta: 'கடுமையான அழுத்தத்தில்', bn: 'গুরুতর চাপে' },
  };

  const tp = tonePhrases[tone];
  const key = transits.map((t) => TRANSIT_PLANET_NAMES[t.planetId]?.en ?? 'Unknown').join(', ') || 'No major transits';

  return {
    en: `${domainLabel.en} is ${tp.en}. Active transits: ${key}.`,
    hi: `${domainLabel.hi} ${tp.hi} है। सक्रिय गोचर: ${key}।`,
    ta: `${domainLabel.ta} ${tp.ta} உள்ளது. செயலில் உள்ள கோச்சாரங்கள்: ${key}.`,
    bn: `${domainLabel.bn} ${tp.bn} রয়েছে। সক্রিয় গোচর: ${key}।`,
  };
}

/**
 * Compute the national mundane forecast for a given nation + today's date.
 */
export function computeNationalForecast(
  nation: NationChart,
  forecastDateISO?: string,
): NationalForecastResult {
  const dateISO = forecastDateISO ?? new Date().toISOString().slice(0, 10);

  // ── 1. Generate nation's natal kundali ──────────────────────────────────────
  const kundali = generateKundali({
    name: nation.name.en,
    date: nation.date,
    time: nation.time,
    place: nation.capitalCity,
    lat: nation.lat,
    lng: nation.lng,
    timezone: nation.timezone,
    ayanamsha: 'lahiri',
  });

  const lagnaSign = kundali.ascendant.sign;
  const lagnaLng = kundali.ascendant.degree; // sidereal

  // Natal planets summary (for display)
  const natalPlanets = kundali.planets.slice(0, 9).map((p) => ({
    planetId: p.planet.id as number,
    planetName: (p.planet as { id: number; name?: { en: string } }).name?.en ?? `Planet ${p.planet.id}`,
    sign: Math.floor(normalizeDeg(p.longitude) / 30) + 1,
    house: p.house,
    longitude: Math.round(p.longitude * 100) / 100,
  }));

  // ── 2. Compute current transit positions ────────────────────────────────────
  const [fy, fm, fd] = dateISO.split('-').map(Number);
  const transitJd = dateToJD(fy, fm, fd, 12); // noon UT
  const transitPlanets = getPlanetaryPositions(transitJd);
  const ayanamsha = lahiriAyanamsha(transitJd);

  // We track: Sun(0), Mars(2), Jupiter(4), Saturn(6), Rahu(7), Ketu(8)
  const TRACKED_PLANETS = [0, 2, 4, 6, 7, 8];

  const currentTransits: TransitEvent[] = [];

  for (const pid of TRACKED_PLANETS) {
    const tp = transitPlanets.find((p) => p.id === pid);
    if (!tp) continue;

    const siderealLng = toSidereal(normalizeDeg(tp.longitude), transitJd, ayanamsha);
    const natalHouse = getTransitHouse(siderealLng, lagnaLng);

    let nature = PLANET_MUNDANE_NATURE[pid];
    // Saturn in 3/6/11 is beneficial
    if (pid === 6 && (SATURN_BENEFICIAL_HOUSES as readonly number[]).includes(natalHouse)) {
      nature = 'benefic';
    }

    const descMap = TRANSIT_DESCRIPTIONS[natalHouse] ?? {};
    const description = descMap[pid] ?? `${TRANSIT_PLANET_NAMES[pid]?.en} transiting house ${natalHouse}`;

    currentTransits.push({
      planetId: pid,
      planetName: TRANSIT_PLANET_NAMES[pid]?.en ?? `Planet ${pid}`,
      transitLng: siderealLng,
      natalHouse,
      nature,
      description,
    });
  }

  // ── 3. Score each domain ────────────────────────────────────────────────────
  const domainForecasts: DomainForecast[] = MUNDANE_HOUSES.map((houseInfo) => {
    const relevantTransits = currentTransits.filter(
      (t) => t.natalHouse === houseInfo.house,
    );
    const score = scoreHouse(houseInfo.house, currentTransits);
    const tone = scoreTone(score);
    const summary = buildSummary(houseInfo.domain, tone, relevantTransits);

    return {
      house: houseInfo.house,
      domain: houseInfo.domain,
      label: DOMAIN_LABELS[houseInfo.domain] ?? { en: houseInfo.domain, hi: houseInfo.domain, ta: houseInfo.domain, bn: houseInfo.domain },
      score,
      tone,
      transits: relevantTransits,
      summary,
    };
  });

  // ── 4. Overall score and outlook ────────────────────────────────────────────
  const overallScore = Math.round(
    domainForecasts.reduce((sum, d) => sum + d.score, 0) / domainForecasts.length
  );

  const overallTone = scoreTone(overallScore);
  const outlookMap: Record<DomainForecast['tone'], { en: string; hi: string; ta: string; bn: string }> = {
    excellent: {
      en: `${nation.name.en} enters a highly auspicious period. Jupiter's grace supports national growth and international prestige.`,
      hi: `${nation.name.hi} एक अत्यन्त शुभ काल में प्रवेश कर रहा है। बृहस्पति की कृपा राष्ट्रीय विकास का समर्थन करती है।`,
      ta: `${nation.name.ta} மிகவும் சாதகமான காலத்தில் நுழைகிறது. குருவின் அனுக்கிரகம் தேசிய வளர்ச்சியை ஆதரிக்கிறது.`,
      bn: `${nation.name.bn} একটি অত্যন্ত শুভ সময়ে প্রবেশ করছে। বৃহস্পতির কৃপায় জাতীয় উন্নতি সমর্থিত।`,
    },
    good: {
      en: `${nation.name.en} is in a broadly favourable period with some areas requiring attention.`,
      hi: `${nation.name.hi} एक सामान्यतः अनुकूल काल में है, कुछ क्षेत्रों में ध्यान आवश्यक है।`,
      ta: `${nation.name.ta} பொதுவாக சாதகமான காலத்தில் உள்ளது, சில பகுதிகளில் கவனம் தேவை.`,
      bn: `${nation.name.bn} সাধারণত অনুকূল সময়ে রয়েছে, কিছু ক্ষেত্রে মনোযোগ প্রয়োজন।`,
    },
    neutral: {
      en: `${nation.name.en} faces mixed cosmic influences — stability in some domains, pressure in others.`,
      hi: `${nation.name.hi} मिश्रित ब्रह्मांडीय प्रभावों का सामना कर रहा है — कुछ क्षेत्रों में स्थिरता, कुछ में दबाव।`,
      ta: `${nation.name.ta} கலவையான கோடான தாக்கங்களை எதிர்கொள்கிறது — சில துறைகளில் நிலைப்பாடு, சிலவற்றில் அழுத்தம்.`,
      bn: `${nation.name.bn} মিশ্র মহাজাগতিক প্রভাবের মুখোমুখি — কিছু ক্ষেত্রে স্থিতিশীলতা, কিছুতে চাপ।`,
    },
    caution: {
      en: `${nation.name.en} faces notable pressures in this period. Saturn and malefic influences call for careful governance.`,
      hi: `${nation.name.hi} इस काल में उल्लेखनीय दबावों का सामना कर रहा है। शनि और पाप ग्रहों का प्रभाव सावधान प्रशासन की माँग करता है।`,
      ta: `${nation.name.ta} இக்காலத்தில் குறிப்பிடத்தக்க அழுத்தங்களை எதிர்கொள்கிறது. சனி மற்றும் பாப கிரகங்கள் கவனமான ஆட்சியை தேவைப்படுத்துகின்றன.`,
      bn: `${nation.name.bn} এই সময়ে উল্লেখযোগ্য চাপের মুখোমুখি। শনি ও পাপ গ্রহের প্রভাবে সতর্ক শাসনব্যবস্থা প্রয়োজন।`,
    },
    challenging: {
      en: `${nation.name.en} is in a challenging period. Multiple malefic transits indicate tests for governance, economy, and national unity.`,
      hi: `${nation.name.hi} एक कठिन काल में है। अनेक पाप गोचर शासन, अर्थव्यवस्था और राष्ट्रीय एकता की परीक्षा का संकेत देते हैं।`,
      ta: `${nation.name.ta} சவாலான காலத்தில் உள்ளது. பல பாப கோச்சாரங்கள் ஆட்சி, பொருளாதாரம் மற்றும் தேசிய ஒற்றுமைக்கு சோதனைகளை குறிக்கின்றன.`,
      bn: `${nation.name.bn} একটি কঠিন সময়ে রয়েছে। একাধিক পাপ গোচর শাসন, অর্থনীতি ও জাতীয় ঐক্যের পরীক্ষা নির্দেশ করে।`,
    },
  };

  return {
    nationId: nation.id,
    nationName: nation.name,
    forecastDate: dateISO,
    lagnaSign,
    lagnaSignName: kundali.ascendant.signName?.en ?? `Sign ${lagnaSign}`,
    natalPlanets,
    currentTransits,
    domainForecasts,
    overallScore,
    overallOutlook: outlookMap[overallTone],
    disclaimer:
      'Mundane astrology is a traditional framework for understanding collective trends. ' +
      'Forecasts reflect planetary symbolism, not literal predictions. ' +
      'This is for educational and self-awareness purposes only.',
  };
}
