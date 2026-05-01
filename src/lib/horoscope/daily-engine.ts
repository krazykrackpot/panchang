import type { LocaleText } from '@/types/panchang';
/**
 * Daily Horoscope Engine — pure, deterministic computation.
 * No external API calls, no LLM. Same (moonSign + date) = same result.
 *
 * Scoring factors:
 *  1. Moon transit house from natal Moon (Chandrabala)
 *  2. Today's tithi quality
 *  3. Today's nakshatra nature
 *  4. Today's yoga auspiciousness
 *  5. Weekday lord compatibility with Moon sign lord
 *  6. Slow planet transits (Saturn, Jupiter, Rahu) relative to Moon sign
 */

import {
  dateToJD, sunLongitude, moonLongitude, toSidereal,
  getRashiNumber, getNakshatraNumber, calculateTithi,
  calculateYoga, getPlanetaryPositions, lahiriAyanamsha,
} from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import {
  TEMPLATES, INSIGHT_GOOD, INSIGHT_MIXED, INSIGHT_CHALLENGING,
  LUCKY_COLORS,
  type BilingualText, type QualityTier, type LifeArea,
} from './templates';

// ─────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────
export interface TransitSummary {
  moonTransitSign: number;    // current Moon sign 1-12
  moonTransitSignName: LocaleText;
  moonHouseFromNatal: number; // house 1-12 from natal Moon
  jupiterSign: number;        // 1-12
  jupiterSignName: LocaleText;
  jupiterHouse: number;       // house from natal Moon
  saturnSign: number;         // 1-12
  saturnSignName: LocaleText;
  saturnHouse: number;        // house from natal Moon
  rahuSign: number;           // 1-12
  rahuSignName: LocaleText;
  rahuHouse: number;          // house from natal Moon
}

export interface DailyRemedy {
  mantra: LocaleText;
  practical: LocaleText;
}

export interface DailyHoroscope {
  date: string;
  moonSign: number;          // 1-12
  moonSignName: LocaleText;
  overallScore: number;      // 1-10
  areas: {
    career:       { score: number; text: LocaleText };
    love:         { score: number; text: LocaleText };
    health:       { score: number; text: LocaleText };
    finance:      { score: number; text: LocaleText };
    spirituality: { score: number; text: LocaleText };
  };
  insight: LocaleText;
  luckyColor: LocaleText;
  luckyNumber: number;
  luckyTime: string;          // e.g. "10:00 AM - 12:00 PM"
  luckyDirection: LocaleText;
  transitSummary: TransitSummary;
  compatibility: number[];    // array of moon sign IDs (1-12) most compatible today
  remedy: DailyRemedy;
  dosAndDonts: {
    dos: LocaleText[];
    donts: LocaleText[];
  };
  // Present only when birth nakshatra was supplied (Tara Bala personalization)
  taraBala?: {
    taraGroup: number;        // 0-8 (Janma through Parama Mitra)
    taraName: string;         // e.g. "Sampat"
    isAuspicious: boolean;
    modifier: number;         // actual score delta applied (+0.5 / -0.5 / 0)
  };
}

export interface DailyEngineInput {
  moonSign: number;           // 1-12
  date: string;               // "YYYY-MM-DD"
  nakshatra?: number;         // birth nakshatra 1-27 (optional refinement)
}

// ─────────────────────────────────────────────────────────────
// Deterministic seed from date + moonSign
// ─────────────────────────────────────────────────────────────
function dateSeed(dateStr: string, moonSign: number): number {
  // Simple hash: sum of char codes * moonSign + date components
  const parts = dateStr.split('-').map(Number);
  const base = (parts[0] || 2026) * 10000 + (parts[1] || 1) * 100 + (parts[2] || 1);
  let hash = base * moonSign;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pick<T>(arr: T[], seed: number, offset: number = 0): T {
  return arr[((seed + offset) >>> 0) % arr.length];
}

// ─────────────────────────────────────────────────────────────
// Moon transit house scoring (Chandrabala)
// ─────────────────────────────────────────────────────────────
// House = (currentMoonSign - natalMoonSign + 12) % 12 + 1
// Houses 2,5,9,11 = good (+2); 1,4,7,10 = neutral (0); 3,6,8,12 = challenging (-2)
const HOUSE_SCORE: Record<number, number> = {
  1: 0, 2: 2, 3: -2, 4: 0, 5: 2, 6: -2,
  7: 0, 8: -2, 9: 2, 10: 0, 11: 2, 12: -2,
};

// ─────────────────────────────────────────────────────────────
// Tithi quality score
// ─────────────────────────────────────────────────────────────
// Tithis 1-30; Shukla Panchami(5), Purnima(15) = excellent
// Amavasya(30) = low; Ekadashi(11,26) = spiritual boost
function tithiScore(tithiNum: number): number {
  // Great tithis
  if ([2, 3, 5, 7, 10, 11, 13, 15].includes(tithiNum)) return 2;
  if ([17, 18, 20, 22, 25, 26, 28].includes(tithiNum)) return 1;
  // Challenging tithis
  if ([4, 8, 9, 14, 19, 23, 24, 29, 30].includes(tithiNum)) return -1;
  return 0;
}

// ─────────────────────────────────────────────────────────────
// Nakshatra nature score
// ─────────────────────────────────────────────────────────────
function nakshatraNatureScore(nakshatraId: number): number {
  const nak = NAKSHATRAS[nakshatraId - 1];
  if (!nak) return 0;
  const nature = nak.nature.en.toLowerCase();
  // Soft, Tender = +1; Light, Swift = +1; Fixed, Stable = 0; Movable = 0; Sharp, Fierce = -1
  if (nature.includes('soft') || nature.includes('tender') || nature.includes('light') || nature.includes('swift')) return 1;
  if (nature.includes('fierce') || nature.includes('severe') || nature.includes('sharp')) return -1;
  return 0;
}

// ─────────────────────────────────────────────────────────────
// Yoga auspiciousness score
// ─────────────────────────────────────────────────────────────
function yogaScore(yogaNum: number): number {
  const yoga = YOGAS[yogaNum - 1];
  if (!yoga) return 0;
  if (yoga.nature === 'auspicious') return 1;
  if (yoga.nature === 'inauspicious') return -1;
  return 0;
}

// ─────────────────────────────────────────────────────────────
// Weekday lord compatibility with Moon sign lord
// ─────────────────────────────────────────────────────────────
// Day lords: Sun(0), Moon(1), Mars(2), Mercury(3), Jupiter(4), Venus(5), Saturn(6)
// Sign lords: Aries=Mars, Taurus=Venus, Gemini=Mercury, etc.
const SIGN_LORD: Record<number, string> = {
  1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
  7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter',
};

const DAY_LORD: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury', 4: 'Jupiter', 5: 'Venus', 6: 'Saturn',
};

// Natural friendships in Vedic astrology
const FRIENDS: Record<string, string[]> = {
  Sun:     ['Moon', 'Mars', 'Jupiter'],
  Moon:    ['Sun', 'Mercury'],
  Mars:    ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus:   ['Mercury', 'Saturn'],
  Saturn:  ['Mercury', 'Venus'],
};

function dayLordScore(weekday: number, moonSign: number): number {
  const dayL = DAY_LORD[weekday];
  const signL = SIGN_LORD[moonSign];
  if (!dayL || !signL) return 0;
  if (dayL === signL) return 2; // own day
  if (FRIENDS[signL]?.includes(dayL)) return 1;
  if (FRIENDS[dayL]?.includes(signL)) return 1;
  return -1; // enemy or neutral-negative
}

// ─────────────────────────────────────────────────────────────
// Slow planet transit score (Saturn, Jupiter, Rahu relative to Moon sign)
// ─────────────────────────────────────────────────────────────
function slowPlanetScore(planetSiderealSign: number, natalMoonSign: number): number {
  const house = ((planetSiderealSign - natalMoonSign + 12) % 12) + 1;
  return HOUSE_SCORE[house] || 0;
}

// ─────────────────────────────────────────────────────────────
// Quality tier from score
// ─────────────────────────────────────────────────────────────
function scoreToTier(score: number): QualityTier {
  if (score >= 6.5) return 'good';
  if (score >= 4) return 'mixed';
  return 'challenging';
}

// ─────────────────────────────────────────────────────────────
// Per-area modifiers (each area is influenced slightly differently)
// ─────────────────────────────────────────────────────────────
const AREA_WEIGHTS: Record<LifeArea, { house: number; tithi: number; nak: number; yoga: number; dayLord: number; slow: number }> = {
  career:       { house: 1.0, tithi: 0.5, nak: 0.4, yoga: 0.5, dayLord: 0.8, slow: 0.8 },
  love:         { house: 0.8, tithi: 0.7, nak: 0.6, yoga: 0.6, dayLord: 0.5, slow: 0.5 },
  health:       { house: 0.7, tithi: 0.4, nak: 0.5, yoga: 0.5, dayLord: 0.6, slow: 0.9 },
  finance:      { house: 1.0, tithi: 0.6, nak: 0.3, yoga: 0.7, dayLord: 0.7, slow: 1.0 },
  spirituality: { house: 0.5, tithi: 0.9, nak: 0.8, yoga: 0.9, dayLord: 0.4, slow: 0.4 },
};

// ─────────────────────────────────────────────────────────────
// Lucky time slots (deterministic from seed)
// ─────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  '6:00 AM - 8:00 AM', '8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM', '8:00 PM - 10:00 PM',
];

// ─────────────────────────────────────────────────────────────
// Lucky directions
// ─────────────────────────────────────────────────────────────
const LUCKY_DIRECTIONS: BilingualText[] = [
  { en: 'East', hi: 'पूर्व' },
  { en: 'West', hi: 'पश्चिम' },
  { en: 'North', hi: 'उत्तर' },
  { en: 'South', hi: 'दक्षिण' },
  { en: 'North-East', hi: 'ईशान' },
  { en: 'South-East', hi: 'आग्नेय' },
  { en: 'South-West', hi: 'नैऋत्य' },
  { en: 'North-West', hi: 'वायव्य' },
];

// ─────────────────────────────────────────────────────────────
// Mantras per sign lord (deterministic)
// ─────────────────────────────────────────────────────────────
const SIGN_LORD_MANTRAS: Record<string, BilingualText[]> = {
  Sun: [
    { en: 'Om Surya Namah', hi: 'ॐ सूर्य नमः' },
    { en: 'Om Adityaya Namah', hi: 'ॐ आदित्याय नमः' },
  ],
  Moon: [
    { en: 'Om Chandraya Namah', hi: 'ॐ चन्द्राय नमः' },
    { en: 'Om Som Somaya Namah', hi: 'ॐ सोम सोमाय नमः' },
  ],
  Mars: [
    { en: 'Om Mangalaya Namah', hi: 'ॐ मंगलाय नमः' },
    { en: 'Om Kram Krim Kraum Bhaumaya Namah', hi: 'ॐ क्रां क्रीं क्रौं भौमाय नमः' },
  ],
  Mercury: [
    { en: 'Om Budhaya Namah', hi: 'ॐ बुधाय नमः' },
    { en: 'Om Bram Brim Braum Budhaya Namah', hi: 'ॐ ब्रां ब्रीं ब्रौं बुधाय नमः' },
  ],
  Jupiter: [
    { en: 'Om Brihaspataye Namah', hi: 'ॐ बृहस्पतये नमः' },
    { en: 'Om Gram Grim Graum Gurave Namah', hi: 'ॐ ग्रां ग्रीं ग्रौं गुरवे नमः' },
  ],
  Venus: [
    { en: 'Om Shukraya Namah', hi: 'ॐ शुक्राय नमः' },
    { en: 'Om Dram Drim Draum Shukraya Namah', hi: 'ॐ द्रां द्रीं द्रौं शुक्राय नमः' },
  ],
  Saturn: [
    { en: 'Om Shanicharaya Namah', hi: 'ॐ शनैश्चराय नमः' },
    { en: 'Om Pram Prim Praum Shanaye Namah', hi: 'ॐ प्रां प्रीं प्रौं शनये नमः' },
  ],
};

// Practical remedies pool per overall tier
const PRACTICAL_REMEDIES: Record<QualityTier, BilingualText[]> = {
  good: [
    { en: 'Donate food to the needy to amplify today\'s positive energy.', hi: 'सकारात्मक ऊर्जा बढ़ाने के लिए ज़रूरतमंदों को भोजन दान करें।' },
    { en: 'Offer water to a Tulsi plant before sunrise to strengthen your aura.', hi: 'अपनी आभा को मज़बूत करने के लिए सूर्योदय से पहले तुलसी को जल अर्पित करें।' },
    { en: 'Wear your lucky color today to maximize the day\'s auspicious energy.', hi: 'आज अपना शुभ रंग पहनें ताकि दिन की शुभ ऊर्जा अधिकतम हो।' },
  ],
  mixed: [
    { en: 'Light a ghee diya in the evening to stabilize the day\'s mixed energy.', hi: 'दिन की मिश्रित ऊर्जा को स्थिर करने के लिए शाम को घी का दीया जलाएं।' },
    { en: 'Chant the recommended mantra 11 times during your lucky time slot.', hi: 'शुभ समय में सुझाए गए मंत्र का 11 बार जप करें।' },
    { en: 'Take a few minutes for deep breathing meditation to center yourself.', hi: 'अपने आप को केंद्रित करने के लिए कुछ मिनट गहरी साँस ध्यान करें।' },
  ],
  challenging: [
    { en: 'Avoid starting new ventures today. Focus on completing existing tasks.', hi: 'आज नए कार्य शुरू करने से बचें। मौजूदा कार्यों को पूरा करने पर ध्यान दें।' },
    { en: 'Feed black sesame seeds to birds to mitigate challenging planetary energy.', hi: 'चुनौतीपूर्ण ग्रह ऊर्जा को कम करने के लिए पक्षियों को काले तिल खिलाएं।' },
    { en: 'Spend time near water — a river, lake, or even a fountain — to calm restless energy.', hi: 'बेचैन ऊर्जा को शांत करने के लिए पानी के पास समय बिताएं — नदी, झील या फव्वारा।' },
  ],
};

// ─────────────────────────────────────────────────────────────
// Do's and Don'ts based on overall tier + seed variation
// ─────────────────────────────────────────────────────────────
const DOS_POOL: Record<QualityTier, BilingualText[]> = {
  good: [
    { en: 'Start new projects or ventures you have been planning.', hi: 'नई परियोजनाएँ या योजनाएँ शुरू करें जो आप सोच रहे थे।' },
    { en: 'Make important financial decisions or investments.', hi: 'महत्वपूर्ण वित्तीय निर्णय या निवेश करें।' },
    { en: 'Have meaningful conversations with loved ones.', hi: 'प्रियजनों से सार्थक बातचीत करें।' },
    { en: 'Express gratitude and acknowledge others\' contributions.', hi: 'कृतज्ञता व्यक्त करें और दूसरों के योगदान को स्वीकार करें।' },
    { en: 'Sign contracts or finalize deals if pending.', hi: 'यदि लंबित हैं तो अनुबंधों पर हस्ताक्षर करें या सौदे पक्के करें।' },
  ],
  mixed: [
    { en: 'Focus on routine tasks and clearing your backlog.', hi: 'नियमित कार्यों और बकाया काम पर ध्यान दें।' },
    { en: 'Organize your workspace and plan for the week ahead.', hi: 'अपने कार्यक्षेत्र को व्यवस्थित करें और आगामी सप्ताह की योजना बनाएँ।' },
    { en: 'Spend quality time with family in the evening.', hi: 'शाम को परिवार के साथ अच्छा समय बिताएँ।' },
    { en: 'Practice patience in all professional interactions.', hi: 'सभी पेशेवर बातचीत में धैर्य रखें।' },
    { en: 'Review finances but postpone major transactions.', hi: 'वित्त की समीक्षा करें लेकिन बड़े लेन-देन को टालें।' },
  ],
  challenging: [
    { en: 'Practice extra caution while traveling.', hi: 'यात्रा करते समय अतिरिक्त सावधानी बरतें।' },
    { en: 'Meditate or do yoga to maintain inner calm.', hi: 'आंतरिक शांति बनाए रखने के लिए ध्यान या योग करें।' },
    { en: 'Finish pending work rather than starting anything new.', hi: 'कुछ नया शुरू करने की बजाय लंबित कार्य पूरे करें।' },
    { en: 'Be mindful of your words in conversations.', hi: 'बातचीत में अपने शब्दों के प्रति सजग रहें।' },
    { en: 'Spend time in nature to recharge your energy.', hi: 'अपनी ऊर्जा को पुनर्जीवित करने के लिए प्रकृति में समय बिताएँ।' },
  ],
};

const DONTS_POOL: Record<QualityTier, BilingualText[]> = {
  good: [
    { en: 'Don\'t let overconfidence lead to carelessness.', hi: 'अति-आत्मविश्वास को लापरवाही में न बदलने दें।' },
    { en: 'Don\'t ignore health routines even on a good day.', hi: 'अच्छे दिन में भी स्वास्थ्य दिनचर्या की अनदेखी न करें।' },
    { en: 'Don\'t make impulsive purchases despite positive energy.', hi: 'सकारात्मक ऊर्जा के बावजूद आवेगपूर्ण खरीदारी न करें।' },
  ],
  mixed: [
    { en: 'Don\'t take on more commitments than you can handle.', hi: 'जितना संभाल सकते हैं उससे अधिक प्रतिबद्धताएँ न लें।' },
    { en: 'Don\'t engage in arguments — save debates for another day.', hi: 'बहस में न पड़ें — वाद-विवाद दूसरे दिन के लिए रखें।' },
    { en: 'Don\'t lend or borrow money today if avoidable.', hi: 'यदि संभव हो तो आज पैसे उधार न दें या लें।' },
  ],
  challenging: [
    { en: 'Don\'t start any important new project today.', hi: 'आज कोई भी महत्वपूर्ण नई परियोजना शुरू न करें।' },
    { en: 'Don\'t make hasty decisions about relationships.', hi: 'रिश्तों के बारे में जल्दबाज़ी में निर्णय न लें।' },
    { en: 'Don\'t invest in speculative assets today.', hi: 'आज सट्टेबाज़ी वाली संपत्तियों में निवेश न करें।' },
    { en: 'Don\'t confront authority figures — diplomacy is key.', hi: 'अधिकारियों से टकराव न करें — कूटनीति ज़रूरी है।' },
  ],
};

// ─────────────────────────────────────────────────────────────
// Compatibility: friendly signs for Moon transit house
// Signs whose lord is friendly with Moon's current transit sign lord
// ─────────────────────────────────────────────────────────────
function getCompatibleSigns(moonSign: number, currentMoonSign: number, seed: number): number[] {
  // Signs in trine (5, 9) and same element are most compatible
  const trines = [
    ((moonSign - 1 + 4) % 12) + 1,  // 5th from natal
    ((moonSign - 1 + 8) % 12) + 1,  // 9th from natal
  ];
  // Signs whose lord is friend of current Moon sign lord
  const currentLord = SIGN_LORD[currentMoonSign];
  const friendlySigns = Object.entries(SIGN_LORD)
    .filter(([, lord]) => FRIENDS[currentLord]?.includes(lord) || lord === currentLord)
    .map(([id]) => Number(id))
    .filter(id => id !== moonSign);

  // Combine and deduplicate, pick top 3
  const all = [...new Set([...trines, ...friendlySigns])].filter(id => id !== moonSign);
  // Deterministic shuffle using seed
  all.sort((a, b) => ((a * seed) % 17) - ((b * seed) % 17));
  return all.slice(0, 3);
}

// ─────────────────────────────────────────────────────────────
// Tara Bala scoring
// ─────────────────────────────────────────────────────────────
// Tara number = (currentNakshatra - birthNakshatra + 27) % 27, 0-indexed tara group = floor(tara / 3)
// Groups (0=Janma, 2=Vipath, 4=Pratyari, 6=Naidhana) are inauspicious → -5 score modifier
// Groups (1=Sampat, 3=Kshema, 5=Sadhaka, 7=Mitra, 8=Parama Mitra) are auspicious → +5 modifier
const INAUSPICIOUS_TARA_GROUPS = new Set([0, 2, 4, 6]);
const AUSPICIOUS_TARA_GROUPS   = new Set([1, 3, 5, 7, 8]);
const TARA_NAMES = ['Janma', 'Sampat', 'Vipath', 'Kshema', 'Pratyari', 'Sadhaka', 'Naidhana', 'Mitra', 'Parama Mitra'];

function taraBalaModifier(currentNakshatra: number, birthNakshatra: number): number {
  // Both are 1-indexed (1-27); convert to 0-indexed for the formula
  const tara = (currentNakshatra - birthNakshatra + 27) % 27;
  const group = Math.floor(tara / 3);
  if (AUSPICIOUS_TARA_GROUPS.has(group))   return  5;
  if (INAUSPICIOUS_TARA_GROUPS.has(group)) return -5;
  return 0;
}

// ─────────────────────────────────────────────────────────────
// Main engine
// ─────────────────────────────────────────────────────────────
export function generateDailyHoroscope(input: DailyEngineInput): DailyHoroscope {
  const { moonSign, date } = input;
  const seed = dateSeed(date, moonSign);

  // Parse date
  const [year, month, day] = date.split('-').map(Number);
  const jd = dateToJD(year, month, day, 6); // ~6 AM for "today"

  // Current transit Moon
  const moonTropical = moonLongitude(jd);
  const moonSidereal = toSidereal(moonTropical, jd);
  const currentMoonSign = getRashiNumber(moonSidereal);
  const currentNakshatraId = getNakshatraNumber(moonSidereal);

  // Tithi & Yoga
  const tithiResult = calculateTithi(jd);
  const yogaNum = calculateYoga(jd);

  // Weekday — local timezone is correct: weekday is a calendar concept, not astronomical.
  // Same date = same weekday regardless of server timezone. (See Lesson L/O in CLAUDE.md)
  const dateObj = new Date(year, month - 1, day);
  const weekday = dateObj.getDay(); // 0=Sun

  // Planetary positions (tropical -> sidereal for slow planets)
  const planets = getPlanetaryPositions(jd);
  const ayanamsha = lahiriAyanamsha(jd);

  const getSiderealSign = (planetId: number): number => {
    const p = planets.find(pl => pl.id === planetId);
    if (!p) return 1;
    const sid = ((p.longitude - ayanamsha) % 360 + 360) % 360;
    return Math.floor(sid / 30) + 1;
  };

  // Raw factor scores
  const houseFromMoon = ((currentMoonSign - moonSign + 12) % 12) + 1;
  const rawHouse = HOUSE_SCORE[houseFromMoon] || 0;
  const rawTithi = tithiScore(tithiResult.number);
  const rawNak = nakshatraNatureScore(currentNakshatraId);
  const rawYoga = yogaScore(yogaNum);
  const rawDayLord = dayLordScore(weekday, moonSign);

  // Slow planets: Jupiter(4), Saturn(6), Rahu(7)
  const jupSign = getSiderealSign(4);
  const satSign = getSiderealSign(6);
  const rahSign = getSiderealSign(7);
  const rawSlow = (
    slowPlanetScore(jupSign, moonSign) +
    slowPlanetScore(satSign, moonSign) +
    slowPlanetScore(rahSign, moonSign)
  ) / 3; // average

  // Compute per-area scores (normalized to 1-10)
  const areas: Record<LifeArea, { score: number; text: BilingualText }> = {} as typeof areas;
  const AREA_NAMES: LifeArea[] = ['career', 'love', 'health', 'finance', 'spirituality'];

  for (let i = 0; i < AREA_NAMES.length; i++) {
    const area = AREA_NAMES[i];
    const w = AREA_WEIGHTS[area];

    // Weighted sum: each raw factor is in [-2, 2] range
    const weighted =
      rawHouse * w.house +
      rawTithi * w.tithi +
      rawNak * w.nak +
      rawYoga * w.yoga +
      rawDayLord * w.dayLord +
      rawSlow * w.slow;

    // Max possible weighted sum for normalization
    const maxPossible = 2 * (w.house + w.tithi + w.nak + w.yoga + w.dayLord + w.slow);

    // Normalize to 1-10 (5.5 is neutral center)
    const normalized = 5.5 + (weighted / maxPossible) * 4.5;
    const score = Math.max(1, Math.min(10, Math.round(normalized * 10) / 10));

    // Pick text template
    const tier = scoreToTier(score);
    const pool = TEMPLATES[area][tier];
    const text = pick(pool, seed, i * 7);

    areas[area] = { score, text };
  }

  // Overall score: weighted average of area scores
  const overallRaw = (
    areas.career.score * 0.25 +
    areas.love.score * 0.20 +
    areas.health.score * 0.20 +
    areas.finance.score * 0.20 +
    areas.spirituality.score * 0.15
  );

  // Tara Bala refinement: when birth nakshatra is provided, apply ±5 modifier
  // to the raw per-area scores (on 1-100 scale → ±0.5 on 1-10 scale).
  // Modifier is applied before final clamp so it can shift borderline days.
  const taraMod = input.nakshatra ? taraBalaModifier(currentNakshatraId, input.nakshatra) / 10 : 0;
  const overallScore = Math.max(1, Math.min(10, Math.round((overallRaw + taraMod) * 10) / 10));

  // Overall tier for insight
  const overallTier = scoreToTier(overallScore);
  const insightPool = overallTier === 'good' ? INSIGHT_GOOD : overallTier === 'mixed' ? INSIGHT_MIXED : INSIGHT_CHALLENGING;
  const insight = pick(insightPool, seed, 31);

  // Lucky color based on Moon sign lord + day variation
  const luckyColor = pick(LUCKY_COLORS, seed, moonSign * 3 + weekday);

  // Lucky number: 1-9 based on seed
  const luckyNumber = (seed % 9) + 1;

  // Lucky time
  const luckyTime = pick(TIME_SLOTS, seed, moonSign + weekday);

  // Rashi name
  const rashi = RASHIS[moonSign - 1];
  const moonSignName = rashi
    ? { en: rashi.name.en, hi: rashi.name.hi }
    : { en: 'Unknown', hi: 'अज्ञात', sa: 'अज्ञात', mai: 'अज्ञात', mr: 'अज्ञात', ta: 'அறியாத', te: 'తెలియని', bn: 'অজানা', kn: 'ಅಜ್ಞಾತ', gu: 'અજ્ઞાત' };

  // Build Tara Bala metadata when birth nakshatra was supplied
  let taraBala: DailyHoroscope['taraBala'];
  if (input.nakshatra) {
    const tara = (currentNakshatraId - input.nakshatra + 27) % 27;
    const group = Math.floor(tara / 3);
    taraBala = {
      taraGroup: group,
      taraName: TARA_NAMES[group] ?? 'Janma',
      isAuspicious: AUSPICIOUS_TARA_GROUPS.has(group),
      modifier: taraMod,
    };
  }

  // Lucky direction (deterministic from seed + moonSign)
  const luckyDirection = pick(LUCKY_DIRECTIONS, seed, moonSign * 5 + weekday * 3);

  // Transit summary: where slow planets currently sit relative to natal Moon
  const jupRashi = RASHIS[jupSign - 1];
  const satRashi = RASHIS[satSign - 1];
  const rahRashi = RASHIS[rahSign - 1];
  const moonTransitRashi = RASHIS[currentMoonSign - 1];

  const transitSummary: TransitSummary = {
    moonTransitSign: currentMoonSign,
    moonTransitSignName: moonTransitRashi
      ? { en: moonTransitRashi.name.en, hi: moonTransitRashi.name.hi }
      : { en: 'Unknown', hi: 'अज्ञात' },
    moonHouseFromNatal: houseFromMoon,
    jupiterSign: jupSign,
    jupiterSignName: jupRashi
      ? { en: jupRashi.name.en, hi: jupRashi.name.hi }
      : { en: 'Unknown', hi: 'अज्ञात' },
    jupiterHouse: ((jupSign - moonSign + 12) % 12) + 1,
    saturnSign: satSign,
    saturnSignName: satRashi
      ? { en: satRashi.name.en, hi: satRashi.name.hi }
      : { en: 'Unknown', hi: 'अज्ञात' },
    saturnHouse: ((satSign - moonSign + 12) % 12) + 1,
    rahuSign: rahSign,
    rahuSignName: rahRashi
      ? { en: rahRashi.name.en, hi: rahRashi.name.hi }
      : { en: 'Unknown', hi: 'अज्ञात' },
    rahuHouse: ((rahSign - moonSign + 12) % 12) + 1,
  };

  // Compatibility: signs most aligned today
  const compatibility = getCompatibleSigns(moonSign, currentMoonSign, seed);

  // Remedy: mantra for sign lord + practical tip based on overall tier
  const signLord = SIGN_LORD[moonSign] || 'Sun';
  const mantraPool = SIGN_LORD_MANTRAS[signLord] || SIGN_LORD_MANTRAS['Sun'];
  const mantra = pick(mantraPool, seed, moonSign);
  const practical = pick(PRACTICAL_REMEDIES[overallTier], seed, weekday * 3);
  const remedy: DailyRemedy = { mantra, practical };

  // Do's and Don'ts (2-3 each, deterministic)
  const dosPool = DOS_POOL[overallTier];
  const dontsPool = DONTS_POOL[overallTier];
  const dos: LocaleText[] = [
    pick(dosPool, seed, 0),
    pick(dosPool, seed, 7),
  ];
  // Add a third "do" for good days
  if (overallTier === 'good') dos.push(pick(dosPool, seed, 13));
  const donts: LocaleText[] = [
    pick(dontsPool, seed, 1),
    pick(dontsPool, seed, 11),
  ];

  return {
    date,
    moonSign,
    moonSignName,
    overallScore,
    areas: {
      career:       { score: areas.career.score,       text: { en: areas.career.text.en,       hi: areas.career.text.hi } },
      love:         { score: areas.love.score,         text: { en: areas.love.text.en,         hi: areas.love.text.hi } },
      health:       { score: areas.health.score,       text: { en: areas.health.text.en,       hi: areas.health.text.hi } },
      finance:      { score: areas.finance.score,      text: { en: areas.finance.text.en,      hi: areas.finance.text.hi } },
      spirituality: { score: areas.spirituality.score, text: { en: areas.spirituality.text.en, hi: areas.spirituality.text.hi } },
    },
    insight,
    luckyColor,
    luckyNumber,
    luckyTime,
    luckyDirection,
    transitSummary,
    compatibility,
    remedy,
    dosAndDonts: { dos, donts },
    ...(taraBala ? { taraBala } : {}),
  };
}
