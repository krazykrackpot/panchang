import type { LocaleText } from '@/types/panchang';
/**
 * Jaimini Astrology System
 * - Chara Karakas (variable significators based on degree)
 * - Karakamsha (navamsha sign of Atmakaraka)
 * - Arudha Padas (A1-A12)
 * - Chara Dasha (sign-based dasha)
 * Reference: Jaimini Sutras, BPHS Ch.32-34
 */

import { normalizeDeg } from '@/lib/ephem/astronomical';
import type { PlanetPosition } from '@/types/kundali';

export interface CharaKaraka {
  planet: number;
  planetName: LocaleText;
  karaka: string;
  karakaName: LocaleText;
  degree: number;
}

export interface ArudhaPada {
  house: number;
  sign: number;
  signName: LocaleText;
  label: LocaleText;
}

export interface CharaDashaEntry {
  sign: number;
  signName: LocaleText;
  years: number;
  startDate: string;
  endDate: string;
}

export interface JaiminiData {
  charaKarakas: CharaKaraka[];
  karakamsha: { sign: number; signName: LocaleText };
  arudhaPadas: ArudhaPada[];
  charaDasha: CharaDashaEntry[];
  rajayogas?: JaiminiRajayoga[];
}

const KARAKA_ORDER = [
  { key: 'AK', name: { en: 'Atmakaraka (Self)', hi: 'आत्मकारक', sa: 'आत्मकारकः' } },
  { key: 'AmK', name: { en: 'Amatyakaraka (Minister)', hi: 'अमात्यकारक', sa: 'अमात्यकारकः' } },
  { key: 'BK', name: { en: 'Bhratrikaraka (Siblings)', hi: 'भ्रातृकारक', sa: 'भ्रातृकारकः' } },
  { key: 'MK', name: { en: 'Matrikaraka (Mother)', hi: 'मातृकारक', sa: 'मातृकारकः' } },
  { key: 'PK', name: { en: 'Putrakaraka (Children)', hi: 'पुत्रकारक', sa: 'पुत्रकारकः' } },
  { key: 'GK', name: { en: 'Gnatikaraka (Relatives)', hi: 'ज्ञातिकारक', sa: 'ज्ञातिकारकः' } },
  { key: 'DK', name: { en: 'Darakaraka (Spouse)', hi: 'दारकारक', sa: 'दारकारकः' } },
];

const RASHI_NAMES: LocaleText[] = [
  { en: 'Aries', hi: 'मेष', sa: 'मेषः' },
  { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः' },
  { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' },
  { en: 'Cancer', hi: 'कर्क', sa: 'कर्कः' },
  { en: 'Leo', hi: 'सिंह', sa: 'सिंहः' },
  { en: 'Virgo', hi: 'कन्या', sa: 'कन्या' },
  { en: 'Libra', hi: 'तुला', sa: 'तुला' },
  { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकः' },
  { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः' },
  { en: 'Capricorn', hi: 'मकर', sa: 'मकरः' },
  { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः' },
  { en: 'Pisces', hi: 'मीन', sa: 'मीनः' },
];

const PLANET_NAMES: Record<number, LocaleText> = {
  0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
  1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
  2: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' },
  3: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
  4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' },
  5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
  6: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
  7: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' },
  8: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
};

// Sign lord mapping (1-12)
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

/**
 * Calculate Chara Karakas — planets sorted by degree within sign (highest = AK)
 * Only 7 planets: Sun through Saturn (exclude Rahu/Ketu)
 */
export function calculateCharaKarakas(planets: PlanetPosition[]): CharaKaraka[] {
  const sevenPlanets = planets.filter(p => p.planet.id >= 0 && p.planet.id <= 6);
  // Sort by degree within sign (descending — highest degree = Atmakaraka)
  const sorted = sevenPlanets
    .map(p => ({
      planet: p.planet.id,
      degree: p.longitude % 30,
    }))
    .sort((a, b) => b.degree - a.degree);

  return sorted.map((p, i) => ({
    planet: p.planet,
    planetName: PLANET_NAMES[p.planet],
    karaka: KARAKA_ORDER[i]?.key || 'DK',
    karakaName: KARAKA_ORDER[i]?.name || KARAKA_ORDER[6].name,
    degree: Math.round(p.degree * 100) / 100,
  }));
}

/**
 * Calculate Karakamsha — the navamsha sign occupied by Atmakaraka
 */
export function calculateKarakamsha(atmakarakaLong: number): { sign: number; signName: LocaleText } {
  // Navamsha: divide each sign into 9 parts (3°20' each)
  const navamshaIndex = Math.floor((atmakarakaLong % 360) / (360 / 108)); // 108 navamshas
  const navamshaSign = (navamshaIndex % 12) + 1;
  return { sign: navamshaSign, signName: RASHI_NAMES[navamshaSign - 1] };
}

/**
 * Calculate Arudha Padas (A1-A12)
 * Arudha of house H = count from lord's position to H, then same count from lord
 */
export function calculateArudhaPadas(ascSign: number, planets: PlanetPosition[]): ArudhaPada[] {
  const padas: ArudhaPada[] = [];
  const ARUDHA_LABELS: LocaleText[] = [
    { en: 'Arudha Lagna (AL)', hi: 'आरूढ़ लग्न', sa: 'आरूढलग्नम्' },
    { en: 'Dhana Pada (A2)', hi: 'धन पद', sa: 'धनपदम्' },
    { en: 'Vikrama Pada (A3)', hi: 'विक्रम पद', sa: 'विक्रमपदम्' },
    { en: 'Matri Pada (A4)', hi: 'मातृ पद', sa: 'मातृपदम्' },
    { en: 'Mantra Pada (A5)', hi: 'मन्त्र पद', sa: 'मन्त्रपदम्' },
    { en: 'Shatru Pada (A6)', hi: 'शत्रु पद', sa: 'शत्रुपदम्' },
    { en: 'Dara Pada (A7)', hi: 'दार पद', sa: 'दारपदम्' },
    { en: 'Mrityu Pada (A8)', hi: 'मृत्यु पद', sa: 'मृत्युपदम्' },
    { en: 'Pitri Pada (A9)', hi: 'पितृ पद', sa: 'पितृपदम्' },
    { en: 'Karma Pada (A10)', hi: 'कर्म पद', sa: 'कर्मपदम्' },
    { en: 'Labha Pada (A11)', hi: 'लाभ पद', sa: 'लाभपदम्' },
    { en: 'Upapada (UL)', hi: 'उपपद', sa: 'उपपदम्' },
  ];

  for (let h = 0; h < 12; h++) {
    const houseSign = ((ascSign - 1 + h) % 12) + 1; // sign of house h+1
    const lord = SIGN_LORD[houseSign];
    // Find lord's sign position
    const lordPlanet = planets.find(p => p.planet.id === lord);
    const lordSign = lordPlanet ? Math.floor(lordPlanet.longitude / 30) + 1 : houseSign;
    // Count from house sign to lord sign
    const countForward = ((lordSign - houseSign + 12) % 12);
    // Arudha = count same distance from lord sign
    let arudhaSign = ((lordSign - 1 + countForward) % 12) + 1;

    // Exception rule (BPHS Ch.29 / Jaimini Sutras 1.2.5-7):
    // If the computed arudha falls in the SAME sign as the house, OR in the
    // 7th sign from the house, it must be advanced by 10 more signs.
    //
    // 7th from houseSign (1-based, wraps at 12):
    //   seventh = ((houseSign - 1 + 6) % 12) + 1
    //
    // HISTORICAL BUG (now fixed): only the "same sign" case was handled.
    // The "7th from house" exception was noted in a comment but never
    // implemented, causing incorrect arudha signs whenever the formula
    // naturally placed the arudha in the 7th from the house sign.
    const seventhFromHouse = ((houseSign - 1 + 6) % 12) + 1;
    if (arudhaSign === houseSign || arudhaSign === seventhFromHouse) {
      arudhaSign = ((arudhaSign - 1 + 9) % 12) + 1; // advance 10 signs (= +9 mod 12)
    }
    padas.push({
      house: h + 1,
      sign: arudhaSign,
      signName: RASHI_NAMES[arudhaSign - 1],
      label: ARUDHA_LABELS[h],
    });
  }
  return padas;
}

/**
 * Chara Dasha — sign-based dasha system
 * Duration based on sign lord's distance from sign
 */
export function calculateCharaDasha(ascSign: number, planets: PlanetPosition[], birthDate: Date): CharaDashaEntry[] {
  const dashas: CharaDashaEntry[] = [];
  let currentDate = new Date(birthDate);

  // Odd signs: count zodiacally from sign; Even signs: count reverse
  const isOddSign = (s: number) => s % 2 === 1;

  for (let i = 0; i < 12; i++) {
    const sign = ((ascSign - 1 + i) % 12) + 1;
    const lord = SIGN_LORD[sign];
    const lordPlanet = planets.find(p => p.planet.id === lord);
    const lordSign = lordPlanet ? Math.floor(lordPlanet.longitude / 30) + 1 : sign;

    let years: number;
    if (isOddSign(sign)) {
      years = ((lordSign - sign + 12) % 12);
    } else {
      years = ((sign - lordSign + 12) % 12);
    }
    if (years === 0) years = 12;

    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + years);

    dashas.push({
      sign,
      signName: RASHI_NAMES[sign - 1],
      years,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
    currentDate = new Date(endDate);
  }
  return dashas;
}

/**
 * Calculate Graha Arudhas — planet-based arudhas (projected image of each planet)
 * Formula: Count from planet's sign to its lord's sign, then same distance from lord
 */
export interface GrahaArudha {
  planetId: number;
  planetName: LocaleText;
  arudhaSign: number;
  arudhaSignName: LocaleText;
}

export function calculateGrahaArudhas(planets: PlanetPosition[]): GrahaArudha[] {
  const arudhas: GrahaArudha[] = [];

  for (const p of planets) {
    if (p.planet.id >= 7) continue; // Skip Rahu/Ketu
    const planetSign = Math.floor(p.longitude / 30) + 1;
    const lord = SIGN_LORD[planetSign];
    const lordPlanet = planets.find(pl => pl.planet.id === lord);
    const lordSign = lordPlanet ? Math.floor(lordPlanet.longitude / 30) + 1 : planetSign;

    const countForward = ((lordSign - planetSign + 12) % 12);
    let arudhaSign = ((lordSign - 1 + countForward) % 12) + 1;
    // Same exception as Bhava Arudhas: advance by 10 if computed arudha falls
    // in the planet's own sign OR in the 7th from it (BPHS Ch.29 / Jaimini 1.2.5-7).
    const seventhFromPlanetSign = ((planetSign - 1 + 6) % 12) + 1;
    if (arudhaSign === planetSign || arudhaSign === seventhFromPlanetSign) {
      arudhaSign = ((arudhaSign - 1 + 9) % 12) + 1;
    }

    arudhas.push({
      planetId: p.planet.id,
      planetName: PLANET_NAMES[p.planet.id],
      arudhaSign,
      arudhaSignName: RASHI_NAMES[arudhaSign - 1],
    });
  }

  return arudhas;
}

// ─────────────────────────────────────────────────────────────────────────────
// Jaimini Rajayogas from Karakamsha
// Source: Jaimini Sutras Ch. 2, Jataka Parijata, Uttara Kalamrita
// ─────────────────────────────────────────────────────────────────────────────

export interface JaiminiRajayoga {
  name: LocaleText;
  present: boolean;
  description: LocaleText;
  strength: 'strong' | 'moderate' | 'mild';
}

// Return 1-12 position of planet relative to karakamsha sign
function fromKarakamsha(karakamshaSign: number, planetSign: number): number {
  return ((planetSign - karakamshaSign + 12) % 12) + 1;
}

// Mutual kendra: two signs are in kendra relationship (1,4,7,10 from each other)
function mutualKendra(s1: number, s2: number): boolean {
  const diff = Math.abs(s1 - s2);
  return diff === 0 || diff === 3 || diff === 6 || diff === 9;
}

// Mutual trikona: 1,5,9 from each other
function mutualTrikona(s1: number, s2: number): boolean {
  const diff = Math.abs(s1 - s2);
  return diff === 0 || diff === 4 || diff === 8;
}

export function calculateJaiminiRajayogas(
  planets: PlanetPosition[],
  karakamsha: { sign: number },
  charaKarakas: CharaKaraka[],
): JaiminiRajayoga[] {
  const yogas: JaiminiRajayoga[] = [];
  const km = karakamsha.sign;

  // Helper: find planet sign
  const pSign = (id: number) => {
    const p = planets.find(pl => pl.planet.id === id);
    return p ? Math.floor(p.longitude / 30) + 1 : null;
  };

  // Get AK and AmK planet ids
  const ak  = charaKarakas[0]?.planet ?? -1;
  const amk = charaKarakas[1]?.planet ?? -1;
  const bk  = charaKarakas[2]?.planet ?? -1;

  const akSign  = ak  >= 0 ? pSign(ak)  : null;
  const amkSign = amk >= 0 ? pSign(amk) : null;

  // All planet signs (used in combos below)
  const sunSign = pSign(0);
  const moonSign = pSign(1);
  const marsSign = pSign(2);
  const mercSign = pSign(3);
  const jupSign = pSign(4);
  const venusSign = pSign(5);
  const satSign = pSign(6);
  const rahuSign = pSign(7);
  const ketuSign = pSign(8);

  // 1. AK + AmK in mutual kendra or trikona — classic Rajayoga
  if (akSign && amkSign) {
    const isMutualKendra  = mutualKendra(akSign, amkSign);
    const isMutualTrikona = mutualTrikona(akSign, amkSign);
    if (isMutualKendra || isMutualTrikona) {
      yogas.push({
        name: { en: 'AK–AmK Rajayoga', hi: 'आत्मकारक-अमात्यकारक राजयोग', sa: 'आत्मकारक-अमात्यकारक राजयोग', mai: 'आत्मकारक-अमात्यकारक राजयोग', mr: 'आत्मकारक-अमात्यकारक राजयोग', ta: 'ஆத்மகாரக-அமாத்யகாரக ராஜயோகம்', te: 'ఆత్మకారక-అమాత్యకారక రాజయోగం', bn: 'আত্মকারক-অমাত্যকারক রাজযোগ', kn: 'ಆತ್ಮಕಾರಕ-ಅಮಾತ್ಯಕಾರಕ ರಾಜಯೋಗ', gu: 'આત્મકારક-અમાત્યકારક રાજયોગ' },
        present: true,
        strength: isMutualTrikona ? 'strong' : 'moderate',
        description: {
          en: `Atmakaraka (${PLANET_NAMES[ak].en}) and Amatyakaraka (${PLANET_NAMES[amk].en}) are in mutual ${isMutualTrikona ? 'trikona' : 'kendra'} — the soul and career significators align, indicating outstanding career achievement and recognition.`,
          hi: `आत्मकारक (${PLANET_NAMES[ak].hi}) और अमात्यकारक (${PLANET_NAMES[amk].hi}) परस्पर ${isMutualTrikona ? 'त्रिकोण' : 'केन्द्र'} में हैं — आत्मा और कैरियर कारक संरेखित हैं, उत्कृष्ट सफलता का योग।`,
        },
      });
    }
  }

  // 2. Exalted planet in Karakamsha (Swamsha) — career specialty
  const EXALTATION: Record<number, number> = { 0:1, 1:2, 2:10, 3:6, 4:4, 5:12, 6:7 };
  const EXALT_CAREER: Record<number, LocaleText> = {
    0: { en: 'government service, authority, administration', hi: 'सरकारी सेवा, अधिकार, प्रशासन', sa: 'सरकारी सेवा, अधिकार, प्रशासन', mai: 'सरकारी सेवा, अधिकार, प्रशासन', mr: 'सरकारी सेवा, अधिकार, प्रशासन', ta: 'அரசுப் பணி, அதிகாரம், நிர்வாகம்', te: 'ప్రభుత్వ సేవ, అధికారం, పరిపాలన', bn: 'সরকারি চাকরি, কর্তৃত্ব, প্রশাসন', kn: 'ಸರ್ಕಾರಿ ಸೇವೆ, ಅಧಿಕಾರ, ಆಡಳಿತ', gu: 'સરકારી સેવા, અધિકાર, વહીવટ' },
    1: { en: 'agriculture, food, water management, psychology', hi: 'कृषि, खाद्य, जल प्रबन्धन, मनोविज्ञान', sa: 'कृषि, खाद्य, जल प्रबन्धन, मनोविज्ञान', mai: 'कृषि, खाद्य, जल प्रबन्धन, मनोविज्ञान', mr: 'कृषि, खाद्य, जल प्रबन्धन, मनोविज्ञान', ta: 'விவசாயம், உணவு, நீர் மேலாண்மை, உளவியல்', te: 'వ్యవసాయం, ఆహారం, జల నిర్వహణ, మనోవిజ్ఞానం', bn: 'কৃষি, খাদ্য, জল ব্যবস্থাপনা, মনোবিজ্ঞান', kn: 'ಕೃಷಿ, ಆಹಾರ, ಜಲ ನಿರ್ವಹಣೆ, ಮನೋವಿಜ್ಞಾನ', gu: 'કૃષિ, ખાદ્ય, જળ વ્યવસ્થાપન, મનોવિજ્ઞાન' },
    2: { en: 'military, surgery, engineering, sports', hi: 'सेना, शल्य चिकित्सा, इंजीनियरिंग, खेल', sa: 'सेना, शल्य चिकित्सा, इंजीनियरिंग, खेल', mai: 'सेना, शल्य चिकित्सा, इंजीनियरिंग, खेल', mr: 'सेना, शल्य चिकित्सा, इंजीनियरिंग, खेल', ta: 'இராணுவம், அறுவை சிகிச்சை, பொறியியல், விளையாட்டு', te: 'సైన్యం, శస్త్రచికిత్స, ఇంజనీరింగ్, క్రీడలు', bn: 'সেনা, শল্যচিকিৎসা, প্রকৌশল, খেলা', kn: 'ಸೇನೆ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಎಂಜಿನಿಯರಿಂಗ್, ಕ್ರೀಡೆ', gu: 'સેના, શલ્ય ચિકિત્સા, એન્જિનિયરિંગ, રમતગમત' },
    3: { en: 'business, communications, publishing, accountancy', hi: 'व्यापार, संचार, प्रकाशन, लेखाकारी', sa: 'व्यापार, संचार, प्रकाशन, लेखाकारी', mai: 'व्यापार, संचार, प्रकाशन, लेखाकारी', mr: 'व्यापार, संचार, प्रकाशन, लेखाकारी', ta: 'வணிகம், தகவல் தொடர்பு, பதிப்பகம், கணக்கியல்', te: 'వ్యాపారం, సమాచారం, ప్రచురణ, అకౌంటింగ్', bn: 'ব্যবসা, যোগাযোগ, প্রকাশনা, হিসাবরক্ষণ', kn: 'ವ್ಯಾಪಾರ, ಸಂವಹನ, ಪ್ರಕಾಶನ, ಲೆಕ್ಕಪತ್ರ', gu: 'વ્યાપાર, સંચાર, પ્રકાશન, હિસાબી' },
    4: { en: 'law, teaching, philosophy, banking', hi: 'कानून, शिक्षण, दर्शन, बैंकिंग', sa: 'कानून, शिक्षण, दर्शन, बैंकिंग', mai: 'कानून, शिक्षण, दर्शन, बैंकिंग', mr: 'कानून, शिक्षण, दर्शन, बैंकिंग', ta: 'சட்டம், கற்பித்தல், தத்துவம், வங்கியியல்', te: 'న్యాయం, బోధన, తత్వశాస్త్రం, బ్యాంకింగ్', bn: 'আইন, শিক্ষণ, দর্শন, ব্যাংকিং', kn: 'ಕಾನೂನು, ಬೋಧನೆ, ತತ್ವಶಾಸ್ತ್ರ, ಬ್ಯಾಂಕಿಂಗ್', gu: 'કાયદો, અધ્યાપન, દર્શન, બેંકિંગ' },
    5: { en: 'arts, entertainment, luxury goods, beauty', hi: 'कला, मनोरंजन, विलासिता, सौन्दर्य', sa: 'कला, मनोरंजन, विलासिता, सौन्दर्य', mai: 'कला, मनोरंजन, विलासिता, सौन्दर्य', mr: 'कला, मनोरंजन, विलासिता, सौन्दर्य', ta: 'கலை, பொழுதுபோக்கு, ஆடம்பரப் பொருட்கள், அழகு', te: 'కళలు, వినోదం, విలాసవస్తువులు, అందం', bn: 'কলা, বিনোদন, বিলাসিতা, সৌন্দর্য', kn: 'ಕಲೆ, ಮನೋರಂಜನೆ, ವಿಲಾಸ ವಸ್ತುಗಳು, ಸೌಂದರ್ಯ', gu: 'કલા, મનોરંજન, વિલાસી વસ્તુઓ, સૌંદર્ય' },
    6: { en: 'judiciary, engineering, mining, real estate', hi: 'न्यायपालिका, इंजीनियरिंग, खनन, अचल सम्पत्ति', sa: 'न्यायपालिका, इंजीनियरिंग, खनन, अचल सम्पत्ति', mai: 'न्यायपालिका, इंजीनियरिंग, खनन, अचल सम्पत्ति', mr: 'न्यायपालिका, इंजीनियरिंग, खनन, अचल सम्पत्ति', ta: 'நீதித்துறை, பொறியியல், சுரங்கம், ரியல் எஸ்டேட்', te: 'న్యాయవ్యవస్థ, ఇంజనీరింగ్, మైనింగ్, రియల్ ఎస్టేట్', bn: 'বিচারব্যবস্থা, প্রকৌশল, খনন, রিয়েল এস্টেট', kn: 'ನ್ಯಾಯಾಂಗ, ಎಂಜಿನಿಯರಿಂಗ್, ಗಣಿಗಾರಿಕೆ, ರಿಯಲ್ ಎಸ್ಟೇಟ್', gu: 'ન્યાયતંત્ર, એન્જિનિયરિંગ, ખનન, રિયલ એસ્ટેટ' },
  };

  for (const p of planets.filter(p => p.planet.id <= 6)) {
    const ps = pSign(p.planet.id);
    if (!ps) continue;
    const posFromKm = fromKarakamsha(km, ps);
    const isExalted = p.isExalted || EXALTATION[p.planet.id] === ps;
    if (isExalted && (posFromKm === 1 || posFromKm === 5 || posFromKm === 9)) {
      const career = EXALT_CAREER[p.planet.id];
      yogas.push({
        name: { en: `Exalted ${PLANET_NAMES[p.planet.id].en} in Karakamsha Trikona`, hi: `कारकांश त्रिकोण में उच्च ${PLANET_NAMES[p.planet.id].hi}`, sa: `कारकांश त्रिकोण में उच्च ${PLANET_NAMES[p.planet.id].hi}`, mai: `कारकांश त्रिकोण में उच्च ${PLANET_NAMES[p.planet.id].hi}`, mr: `कारकांश त्रिकोण में उच्च ${PLANET_NAMES[p.planet.id].hi}`, ta: `Exalted ${PLANET_NAMES[p.planet.id].en} in Karakamsha Trikona`, te: `Exalted ${PLANET_NAMES[p.planet.id].en} in Karakamsha Trikona`, bn: `Exalted ${PLANET_NAMES[p.planet.id].en} in Karakamsha Trikona`, kn: `Exalted ${PLANET_NAMES[p.planet.id].en} in Karakamsha Trikona`, gu: `Exalted ${PLANET_NAMES[p.planet.id].en} in Karakamsha Trikona` },
        present: true,
        strength: posFromKm === 1 ? 'strong' : 'moderate',
        description: {
          en: `${PLANET_NAMES[p.planet.id].en} is exalted in ${posFromKm === 1 ? 'Karakamsha itself' : `${posFromKm}H from Karakamsha`}. Indicates excellence in ${career?.en ?? 'the signified area'}.`,
          hi: `${PLANET_NAMES[p.planet.id].hi} ${posFromKm === 1 ? 'कारकांश में ही' : `कारकांश से ${posFromKm}वें में`} उच्च है। ${career?.hi ?? 'संकेतित क्षेत्र'} में उत्कृष्टता।`,
        },
      });
    }
  }

  // 3. Ketu in Karakamsha — moksha/spiritual attainment
  if (ketuSign) {
    const ketuFromKm = fromKarakamsha(km, ketuSign);
    if (ketuFromKm === 1 || ketuFromKm === 12) {
      yogas.push({
        name: { en: 'Ketu in Karakamsha — Moksha Yoga', hi: 'कारकांश में केतु — मोक्ष योग', sa: 'कारकांश में केतु — मोक्ष योग', mai: 'कारकांश में केतु — मोक्ष योग', mr: 'कारकांश में केतु — मोक्ष योग', ta: 'காரகாம்சத்தில் கேது — மோட்ச யோகம்', te: 'కారకాంశలో కేతువు — మోక్ష యోగం', bn: 'কারকাংশে কেতু — মোক্ষ যোগ', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ಕೇತು — ಮೋಕ್ಷ ಯೋಗ', gu: 'કારકાંશમાં કેતુ — મોક્ષ યોગ' },
        present: true,
        strength: ketuFromKm === 1 ? 'strong' : 'moderate',
        description: {
          en: `Ketu in ${ketuFromKm === 1 ? 'Karakamsha itself' : '12H from Karakamsha'} indicates strong moksha tendency — spiritually oriented soul, likely path of renunciation, meditation, or liberation in this life.`,
          hi: `${ketuFromKm === 1 ? 'कारकांश में' : 'कारकांश से 12वें में'} केतु — प्रबल मोक्ष प्रवृत्ति, इस जीवन में वैराग्य, ध्यान या मुक्ति का मार्ग।`,
        },
      });
    }
  }

  // 4. Venus in Karakamsha or 7H from it — spouse beauty, vehicles, arts
  if (venusSign) {
    const venusFromKm = fromKarakamsha(km, venusSign);
    if (venusFromKm === 1 || venusFromKm === 7) {
      yogas.push({
        name: { en: 'Venus in Karakamsha — Bhoga Yoga', hi: 'कारकांश में शुक्र — भोग योग', sa: 'कारकांश में शुक्र — भोग योग', mai: 'कारकांश में शुक्र — भोग योग', mr: 'कारकांश में शुक्र — भोग योग', ta: 'காரகாம்சத்தில் சுக்கிரன் — போக யோகம்', te: 'కారకాంశలో శుక్రుడు — భోగ యోగం', bn: 'কারকাংশে শুক্র — ভোগ যোগ', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ಶುಕ್ರ — ಭೋಗ ಯೋಗ', gu: 'કારકાંશમાં શુક્ર — ભોગ યોગ' },
        present: true,
        strength: 'moderate',
        description: {
          en: `Venus in ${venusFromKm === 1 ? 'Karakamsha' : '7H from Karakamsha'} — soul oriented toward luxury, beauty, arts, and pleasure. Beautiful spouse, vehicles, and material comforts throughout life.`,
          hi: `${venusFromKm === 1 ? 'कारकांश में' : 'कारकांश से 7वें में'} शुक्र — भोग, सुन्दरता, कला और सुख की ओर उन्मुख आत्मा। सुन्दर जीवनसाथी, वाहन और भौतिक सुख।`,
        },
      });
    }
  }

  // 5. Jupiter in Karakamsha — Hamsa Yoga equivalent (wisdom, dharma)
  if (jupSign) {
    const jupFromKm = fromKarakamsha(km, jupSign);
    if (jupFromKm === 1 || jupFromKm === 5 || jupFromKm === 9) {
      yogas.push({
        name: { en: 'Jupiter in Karakamsha Trikona — Dharma Yoga', hi: 'कारकांश त्रिकोण में बृहस्पति — धर्म योग', sa: 'कारकांश त्रिकोण में बृहस्पति — धर्म योग', mai: 'कारकांश त्रिकोण में बृहस्पति — धर्म योग', mr: 'कारकांश त्रिकोण में बृहस्पति — धर्म योग', ta: 'காரகாம்ச திரிகோணத்தில் குரு — தர்ம யோகம்', te: 'కారకాంశ త్రికోణంలో గురుడు — ధర్మ యోగం', bn: 'কারকাংশ ত্রিকোণে বৃহস্পতি — ধর্ম যোগ', kn: 'ಕಾರಕಾಂಶ ತ್ರಿಕೋಣದಲ್ಲಿ ಗುರು — ಧರ್ಮ ಯೋಗ', gu: 'કારકાંશ ત્રિકોણમાં ગુરુ — ધર્મ યોગ' },
        present: true,
        strength: jupFromKm === 1 ? 'strong' : 'moderate',
        description: {
          en: `Jupiter in ${jupFromKm}H from Karakamsha — a dharmic, wise soul. Proficiency in law, teaching, philosophy, or spiritual guidance. Natural adviser and guide to others.`,
          hi: `कारकांश से ${jupFromKm}वें में बृहस्पति — धार्मिक, विवेकी आत्मा। कानून, शिक्षण, दर्शन या आध्यात्मिक मार्गदर्शन में निपुणता।`,
        },
      });
    }
  }

  // 6. Rahu in Karakamsha — foreign connections, technology, unconventional life
  if (rahuSign) {
    const rahuFromKm = fromKarakamsha(km, rahuSign);
    if (rahuFromKm === 1) {
      yogas.push({
        name: { en: 'Rahu in Karakamsha — Videshi Yoga', hi: 'कारकांश में राहु — विदेशी योग', sa: 'कारकांश में राहु — विदेशी योग', mai: 'कारकांश में राहु — विदेशी योग', mr: 'कारकांश में राहु — विदेशी योग', ta: 'காரகாம்சத்தில் ராகு — விதேசி யோகம்', te: 'కారకాంశలో రాహువు — విదేశీ యోగం', bn: 'কারকাংশে রাহু — বিদেশী যোগ', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ರಾಹು — ವಿದೇಶೀ ಯೋಗ', gu: 'કારકાંશમાં રાહુ — વિદેશી યોગ' },
        present: true,
        strength: 'moderate',
        description: {
          en: 'Rahu in Karakamsha — soul drawn to foreign lands, modern technology, unconventional paths. May rise in foreign countries or cutting-edge fields. Life path is non-traditional.',
          hi: 'कारकांश में राहु — विदेश, आधुनिक तकनीक और अपरम्परागत मार्गों की ओर आकर्षित आत्मा। विदेश में या अत्याधुनिक क्षेत्रों में उत्थान।',
        },
      });
    }
  }

  // 7. AK + AmK in 1H or in same sign — extremely strong Rajayoga
  if (akSign && amkSign && akSign === amkSign) {
    yogas.push({
      name: { en: 'AK–AmK Conjunction Rajayoga', hi: 'आत्मकारक-अमात्यकारक युति राजयोग', sa: 'आत्मकारक-अमात्यकारक युति राजयोग', mai: 'आत्मकारक-अमात्यकारक युति राजयोग', mr: 'आत्मकारक-अमात्यकारक युति राजयोग', ta: 'ஆத்மகாரக-அமாத்யகாரக சேர்க்கை ராஜயோகம்', te: 'ఆత్మకారక-అమాత్యకారక యుతి రాజయోగం', bn: 'আত্মকারক-অমাত্যকারক যুতি রাজযোগ', kn: 'ಆತ್ಮಕಾರಕ-ಅಮಾತ್ಯಕಾರಕ ಯುತಿ ರಾಜಯೋಗ', gu: 'આત્મકારક-અમાત્યકારક યુતિ રાજયોગ' },
      present: true,
      strength: 'strong',
      description: {
        en: `Atmakaraka and Amatyakaraka conjunct in ${PLANET_NAMES[ak].en}/${PLANET_NAMES[amk].en}'s sign — the soul's purpose and career are perfectly aligned. Exceptional success in chosen vocation.`,
        hi: `आत्मकारक और अमात्यकारक एक ही राशि में — आत्मा का उद्देश्य और कैरियर पूर्णतः संरेखित। चुने व्यवसाय में असाधारण सफलता।`,
      },
    });
  }

  // 8. 5H from Karakamsha analysis — children / creativity / intelligence
  const fifth: PlanetPosition[] = [];
  for (const p of planets) {
    if (p.planet.id > 8) continue;
    const ps = pSign(p.planet.id);
    if (ps && fromKarakamsha(km, ps) === 5) fifth.push(p);
  }
  if (fifth.some(p => p.planet.id === 4)) { // Jupiter in 5H from KM
    yogas.push({
      name: { en: 'Jupiter in 5H from Karakamsha — Guru Yoga', hi: 'कारकांश से 5वें में बृहस्पति — गुरु योग', sa: 'कारकांश से 5वें में बृहस्पति — गुरु योग', mai: 'कारकांश से 5वें में बृहस्पति — गुरु योग', mr: 'कारकांश से 5वें में बृहस्पति — गुरु योग', ta: 'காரகாம்சத்திலிருந்து 5-ல் குரு — குரு யோகம்', te: 'కారకాంశ నుండి 5వ భావంలో గురుడు — గురు యోగం', bn: 'কারকাংশ থেকে ৫ম ভাবে বৃহস্পতি — গুরু যোগ', kn: 'ಕಾರಕಾಂಶದಿಂದ 5ನೇ ಭಾವದಲ್ಲಿ ಗುರು — ಗುರು ಯೋಗ', gu: 'કારકાંશથી 5મા ભાવમાં ગુરુ — ગુરુ યોગ' },
      present: true,
      strength: 'moderate',
      description: {
        en: 'Jupiter in 5H from Karakamsha — highly intelligent, gifted children, excellent memory, and wisdom accumulated over many lifetimes.',
        hi: 'कारकांश से 5वें में बृहस्पति — उच्च बुद्धिमत्ता, प्रतिभाशाली सन्तान, उत्कृष्ट स्मृति और अनेक जन्मों का संचित ज्ञान।',
      },
    });
  }

  // 9. BK (3rd karaka) in good position — siblings / courage
  if (bk >= 0) {
    const bkSign = pSign(bk);
    if (bkSign) {
      const bkFromKm = fromKarakamsha(km, bkSign);
      if (bkFromKm === 3 || bkFromKm === 11) {
        yogas.push({
          name: { en: 'Bhratrikaraka in 3H/11H from Karakamsha', hi: 'कारकांश से 3/11वें में भ्रातृकारक', sa: 'कारकांश से 3/11वें में भ्रातृकारक', mai: 'कारकांश से 3/11वें में भ्रातृकारक', mr: 'कारकांश से 3/11वें में भ्रातृकारक', ta: 'காரகாம்சத்திலிருந்து 3/11-ல் பிராத்ருகாரகன்', te: 'కారకాంశ నుండి 3/11వ భావంలో భ్రాతృకారకుడు', bn: 'কারকাংশ থেকে ৩/১১ম ভাবে ভ্রাতৃকারক', kn: 'ಕಾರಕಾಂಶದಿಂದ 3/11ನೇ ಭಾವದಲ್ಲಿ ಭ್ರಾತೃಕಾರಕ', gu: 'કારકાંશથી 3/11મા ભાવમાં ભ્રાતૃકારક' },
          present: true,
          strength: 'mild',
          description: {
            en: `${PLANET_NAMES[bk].en} (Bhratrikaraka) in ${bkFromKm}H from Karakamsha — strong support from siblings, courageous, success through sustained effort and community.`,
            hi: `${PLANET_NAMES[bk].hi} (भ्रातृकारक) कारकांश से ${bkFromKm}वें में — भाई-बहनों का प्रबल सहयोग, साहसी स्वभाव, निरन्तर प्रयास से सफलता।`,
          },
        });
      }
    }
  }

  // ─── 2H from Karakamsha — Profession (Jaimini Sutras 2.1) ──────────────────
  const PROF_2H: Array<[number, number | null, LocaleText, LocaleText]> = [
    [0, sunSign, { en: 'Sun in 2H from Karakamsha — Government Service', hi: 'कारकांश से 2H में सूर्य — सरकारी सेवा', sa: 'कारकांश से 2H में सूर्य — सरकारी सेवा', mai: 'कारकांश से 2H में सूर्य — सरकारी सेवा', mr: 'कारकांश से 2H में सूर्य — सरकारी सेवा', ta: 'காரகாம்சத்திலிருந்து 2-ல் சூரியன் — அரசுப் பணி', te: 'కారకాంశ నుండి 2వ భావంలో సూర్యుడు — ప్రభుత్వ సేవ', bn: 'কারকাংশ থেকে ২য় ভাবে সূর্য — সরকারি চাকরি', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಸೂರ್ಯ — ಸರ್ಕಾರಿ ಸೇವೆ', gu: 'કારકાંશથી 2જા ભાવમાં સૂર્ય — સરકારી સેવા' },
      { en: 'Sun in the 2nd from Karakamsha: this soul earns through government, authority, politics, or public administration. A natural administrator who finds livelihood in positions of power.', hi: 'कारकांश से 2H में सूर्य: इस आत्मा की आजीविका सरकार, अधिकार, राजनीति या प्रशासन से। स्वाभाविक प्रशासक।', sa: 'कारकांश से 2H में सूर्य: इस आत्मा की आजीविका सरकार, अधिकार, राजनीति या प्रशासन से। स्वाभाविक प्रशासक।', mai: 'कारकांश से 2H में सूर्य: इस आत्मा की आजीविका सरकार, अधिकार, राजनीति या प्रशासन से। स्वाभाविक प्रशासक।', mr: 'कारकांश से 2H में सूर्य: इस आत्मा की आजीविका सरकार, अधिकार, राजनीति या प्रशासन से। स्वाभाविक प्रशासक।', ta: 'காரகாம்சத்திலிருந்து 2-ல் சூரியன்: இந்த ஆத்மா அரசு, அதிகாரம், அரசியல் அல்லது பொது நிர்வாகத்தின் மூலம் வருமானம் ஈட்டுகிறது. அதிகார பதவிகளில் வாழ்வாதாரம் காணும் இயல்பான நிர்வாகி.', te: 'కారకాంశ నుండి 2వ భావంలో సూర్యుడు: ఈ ఆత్మ ప్రభుత్వం, అధికారం, రాజకీయాలు లేదా ప్రజా పరిపాలన ద్వారా సంపాదిస్తుంది. అధికార పదవులలో జీవనోపాధి పొందే సహజ నిర్వాహకుడు.', bn: 'কারকাংশ থেকে ২য় ভাবে সূর্য: এই আত্মা সরকার, কর্তৃত্ব, রাজনীতি বা প্রশাসনের মাধ্যমে উপার্জন করে। ক্ষমতার পদে জীবিকা খুঁজে পায় এমন স্বাভাবিক প্রশাসক।', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಸೂರ್ಯ: ಈ ಆತ್ಮ ಸರ್ಕಾರ, ಅಧಿಕಾರ, ರಾಜಕೀಯ ಅಥವಾ ಸಾರ್ವಜನಿಕ ಆಡಳಿತದ ಮೂಲಕ ಗಳಿಸುತ್ತದೆ. ಅಧಿಕಾರ ಸ್ಥಾನಗಳಲ್ಲಿ ಜೀವನೋಪಾಯ ಕಂಡುಕೊಳ್ಳುವ ಸಹಜ ಆಡಳಿತಗಾರ.', gu: 'કારકાંશથી 2જા ભાવમાં સૂર્ય: આ આત્મા સરકાર, સત્તા, રાજનીતિ અથવા જાહેર વહીવટ દ્વારા કમાય છે. સત્તાના હોદ્દા પર જીવિકા મેળવનાર સ્વાભાવિક વહીવટકર્તા.' }],
    [1, moonSign, { en: 'Moon in 2H from Karakamsha — Trade & Public Dealings', hi: 'कारकांश से 2H में चंद्र — व्यापार', sa: 'कारकांश से 2H में चंद्र — व्यापार', mai: 'कारकांश से 2H में चंद्र — व्यापार', mr: 'कारकांश से 2H में चंद्र — व्यापार', ta: 'காரகாம்சத்திலிருந்து 2-ல் சந்திரன் — வணிகம் & பொது நடவடிக்கைகள்', te: 'కారకాంశ నుండి 2వ భావంలో చంద్రుడు — వ్యాపారం & ప్రజా వ్యవహారాలు', bn: 'কারকাংশ থেকে ২য় ভাবে চন্দ্র — বাণিজ্য ও জনকল্যাণ', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ — ವ್ಯಾಪಾರ & ಸಾರ್ವಜನಿಕ ವ್ಯವಹಾರ', gu: 'કારકાંશથી 2જા ભાવમાં ચંદ્ર — વ્યાપાર અને જાહેર વ્યવહાર' },
      { en: 'Moon in the 2nd from Karakamsha: income from trade, public service, hospitality, or agriculture. Emotionally driven livelihood — wealth fluctuates with public mood.', hi: 'कारकांश से 2H में चंद्र: व्यापार, जन सेवा, आतिथ्य या कृषि से आजीविका।', sa: 'कारकांश से 2H में चंद्र: व्यापार, जन सेवा, आतिथ्य या कृषि से आजीविका।', mai: 'कारकांश से 2H में चंद्र: व्यापार, जन सेवा, आतिथ्य या कृषि से आजीविका।', mr: 'कारकांश से 2H में चंद्र: व्यापार, जन सेवा, आतिथ्य या कृषि से आजीविका।', ta: 'காரகாம்சத்திலிருந்து 2-ல் சந்திரன்: வணிகம், பொது சேவை, விருந்தோம்பல் அல்லது விவசாயத்திலிருந்து வருமானம். உணர்ச்சி உந்துதல் வாழ்வாதாரம் — செல்வம் பொது மனநிலையுடன் மாறும்.', te: 'కారకాంశ నుండి 2వ భావంలో చంద్రుడు: వ్యాపారం, ప్రజా సేవ, ఆతిథ్యం లేదా వ్యవసాయం నుండి ఆదాయం. భావోద్వేగ ఆధారిత జీవనోపాధి — సంపద ప్రజల మానసిక స్థితితో హెచ్చుతగ్గులకు లోనవుతుంది.', bn: 'কারকাংশ থেকে ২য় ভাবে চন্দ্র: ব্যবসা, জনসেবা, আতিথেয়তা বা কৃষি থেকে আয়। আবেগ-চালিত জীবিকা — সম্পদ জনমতের সাথে ওঠানামা করে।', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ವ್ಯಾಪಾರ, ಸಾರ್ವಜನಿಕ ಸೇವೆ, ಆತಿಥ್ಯ ಅಥವಾ ಕೃಷಿಯಿಂದ ಆದಾಯ. ಭಾವನಾತ್ಮಕ ಚಾಲಿತ ಜೀವನೋಪಾಯ — ಸಂಪತ್ತು ಸಾರ್ವಜನಿಕ ಮನಸ್ಥಿತಿಯೊಂದಿಗೆ ಏರಿಳಿತಗೊಳ್ಳುತ್ತದೆ.', gu: 'કારકાંશથી 2જા ભાવમાં ચંદ્ર: વેપાર, જાહેર સેવા, આતિથ્ય અથવા ખેતીમાંથી આવક. ભાવનાત્મક રીતે સંચાલિત જીવિકા — સંપત્તિ જાહેર મિજાજ સાથે બદલાય છે.' }],
    [2, marsSign, { en: 'Mars in 2H from Karakamsha — Craft & Military', hi: 'कारकांश से 2H में मंगल — शिल्प एवं सेना', sa: 'कारकांश से 2H में मंगल — शिल्प एवं सेना', mai: 'कारकांश से 2H में मंगल — शिल्प एवं सेना', mr: 'कारकांश से 2H में मंगल — शिल्प एवं सेना', ta: 'காரகாம்சத்திலிருந்து 2-ல் செவ்வாய் — கைவினை & இராணுவம்', te: 'కారకాంశ నుండి 2వ భావంలో కుజుడు — శిల్పం & సైన్యం', bn: 'কারকাংশ থেকে ২য় ভাবে মঙ্গল — শিল্প ও সেনা', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಮಂಗಳ — ಶಿಲ್ಪ & ಸೇನೆ', gu: 'કારકાંશથી 2જા ભાવમાં મંગળ — શિલ્પ અને સેના' },
      { en: 'Mars in the 2nd from Karakamsha: this soul earns through fire, metal, the military, surgery, cooking, or craft. Skilled hands and physical courage are the primary earning tools.', hi: 'कारकांश से 2H में मंगल: अग्नि, धातु, सेना, शल्य, पाक कला या शिल्प से आजीविका।', sa: 'कारकांश से 2H में मंगल: अग्नि, धातु, सेना, शल्य, पाक कला या शिल्प से आजीविका।', mai: 'कारकांश से 2H में मंगल: अग्नि, धातु, सेना, शल्य, पाक कला या शिल्प से आजीविका।', mr: 'कारकांश से 2H में मंगल: अग्नि, धातु, सेना, शल्य, पाक कला या शिल्प से आजीविका।', ta: 'காரகாம்சத்திலிருந்து 2-ல் செவ்வாய்: இந்த ஆத்மா நெருப்பு, உலோகம், இராணுவம், அறுவை சிகிச்சை, சமையல் அல்லது கைவினை மூலம் வருமானம் ஈட்டுகிறது. திறமையான கைகளும் உடல் தைரியமும் முதன்மை வருமான கருவிகள்.', te: 'కారకాంశ నుండి 2వ భావంలో కుజుడు: ఈ ఆత్మ అగ్ని, లోహం, సైన్యం, శస్త్రచికిత్స, వంట లేదా చేతివృత్తి ద్వారా సంపాదిస్తుంది. నైపుణ్యమైన చేతులు మరియు శారీరక ధైర్యం ప్రాథమిక సంపాదన సాధనాలు.', bn: 'কারকাংশ থেকে ২য় ভাবে মঙ্গল: এই আত্মা আগুন, ধাতু, সেনা, শল্যচিকিৎসা, রান্না বা শিল্প দ্বারা উপার্জন করে। দক্ষ হাত ও শারীরিক সাহস প্রাথমিক উপার্জনের হাতিয়ার।', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಮಂಗಳ: ಈ ಆತ್ಮ ಅಗ್ನಿ, ಲೋಹ, ಸೇನೆ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಅಡುಗೆ ಅಥವಾ ಕರಕುಶಲ ಮೂಲಕ ಗಳಿಸುತ್ತದೆ. ಕುಶಲ ಕೈಗಳು ಮತ್ತು ದೈಹಿಕ ಧೈರ್ಯ ಪ್ರಾಥಮಿಕ ಗಳಿಕೆ ಸಾಧನಗಳು.', gu: 'કારકાંશથી 2જા ભાવમાં મંગળ: આ આત્મા અગ્નિ, ધાતુ, સેના, શલ્ય ચિકિત્સા, રાંધણ અથવા કારીગરી દ્વારા કમાય છે. કુશળ હાથ અને શારીરિક હિંમત મુખ્ય કમાણીના સાધનો છે.' }],
    [3, mercSign, { en: 'Mercury in 2H from Karakamsha — Scholarship & Trade', hi: 'कारकांश से 2H में बुध — शिक्षा एवं वाणिज्य', sa: 'कारकांश से 2H में बुध — शिक्षा एवं वाणिज्य', mai: 'कारकांश से 2H में बुध — शिक्षा एवं वाणिज्य', mr: 'कारकांश से 2H में बुध — शिक्षा एवं वाणिज्य', ta: 'காரகாம்சத்திலிருந்து 2-ல் புதன் — கல்வி & வணிகம்', te: 'కారకాంశ నుండి 2వ భావంలో బుధుడు — విద్య & వ్యాపారం', bn: 'কারকাংশ থেকে ২য় ভাবে বুধ — বিদ্যা ও বাণিজ্য', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಬುಧ — ವಿದ್ಯಾ & ವ್ಯಾಪಾರ', gu: 'કારકાંશથી 2જા ભાવમાં બુધ — વિદ્યા અને વાણિજ્ય' },
      { en: 'Mercury in the 2nd from Karakamsha: income from writing, accounting, trade, mathematics, or astrology. Mercury here gives multiple income streams through intellectual work.', hi: 'कारकांश से 2H में बुध: लेखन, लेखा, व्यापार, गणित या ज्योतिष से आजीविका।', sa: 'कारकांश से 2H में बुध: लेखन, लेखा, व्यापार, गणित या ज्योतिष से आजीविका।', mai: 'कारकांश से 2H में बुध: लेखन, लेखा, व्यापार, गणित या ज्योतिष से आजीविका।', mr: 'कारकांश से 2H में बुध: लेखन, लेखा, व्यापार, गणित या ज्योतिष से आजीविका।', ta: 'காரகாம்சத்திலிருந்து 2-ல் புதன்: எழுத்து, கணக்கியல், வணிகம், கணிதம் அல்லது ஜோதிடத்திலிருந்து வருமானம். இங்கு புதன் அறிவார்ந்த வேலையின் மூலம் பல வருமான ஓடைகளை அளிக்கிறார்.', te: 'కారకాంశ నుండి 2వ భావంలో బుధుడు: రాత, అకౌంటింగ్, వ్యాపారం, గణితం లేదా జ్యోతిషం నుండి ఆదాయం. ఇక్కడ బుధుడు మేధో కార్యం ద్వారా బహుళ ఆదాయ మార్గాలను ఇస్తాడు.', bn: 'কারকাংশ থেকে ২য় ভাবে বুধ: লেখা, হিসাবরক্ষণ, ব্যবসা, গণিত বা জ্যোতিষ থেকে আয়। এখানে বুধ বৌদ্ধিক কাজের মাধ্যমে একাধিক আয়ের ধারা দেয়।', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಬುಧ: ಬರವಣಿಗೆ, ಲೆಕ್ಕಪತ್ರ, ವ್ಯಾಪಾರ, ಗಣಿತ ಅಥವಾ ಜ್ಯೋತಿಷದಿಂದ ಆದಾಯ. ಇಲ್ಲಿ ಬುಧ ಬೌದ್ಧಿಕ ಕೆಲಸದ ಮೂಲಕ ಬಹು ಆದಾಯ ಮೂಲಗಳನ್ನು ನೀಡುತ್ತಾನೆ.', gu: 'કારકાંશથી 2જા ભાવમાં બુધ: લેખન, હિસાબ, વેપાર, ગણિત અથવા જ્યોતિષમાંથી આવક. અહીં બુધ બૌદ્ધિક કાર્ય દ્વારા અનેક આવકના માર્ગો આપે છે.' }],
    [6, satSign, { en: 'Saturn in 2H from Karakamsha — Agriculture & Industry', hi: 'कारकांश से 2H में शनि — कृषि एवं उद्योग', sa: 'कारकांश से 2H में शनि — कृषि एवं उद्योग', mai: 'कारकांश से 2H में शनि — कृषि एवं उद्योग', mr: 'कारकांश से 2H में शनि — कृषि एवं उद्योग', ta: 'காரகாம்சத்திலிருந்து 2-ல் சனி — விவசாயம் & தொழில்', te: 'కారకాంశ నుండి 2వ భావంలో శని — వ్యవసాయం & పరిశ్రమ', bn: 'কারকাংশ থেকে ২য় ভাবে শনি — কৃষি ও শিল্প', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಶನಿ — ಕೃಷಿ & ಉದ್ಯಮ', gu: 'કારકાંશથી 2જા ભાવમાં શનિ — કૃષિ અને ઉદ્યોગ' },
      { en: 'Saturn in the 2nd from Karakamsha: livelihood through farming, mining, construction, or heavy industry. Wealth comes slowly through persistent, systematic effort.', hi: 'कारकांश से 2H में शनि: कृषि, खनन, निर्माण या भारी उद्योग से आजीविका। धन धीरे-धीरे आता है।', sa: 'कारकांश से 2H में शनि: कृषि, खनन, निर्माण या भारी उद्योग से आजीविका। धन धीरे-धीरे आता है।', mai: 'कारकांश से 2H में शनि: कृषि, खनन, निर्माण या भारी उद्योग से आजीविका। धन धीरे-धीरे आता है।', mr: 'कारकांश से 2H में शनि: कृषि, खनन, निर्माण या भारी उद्योग से आजीविका। धन धीरे-धीरे आता है।', ta: 'காரகாம்சத்திலிருந்து 2-ல் சனி: விவசாயம், சுரங்கம், கட்டுமானம் அல்லது கனரக தொழிலின் மூலம் வாழ்வாதாரம். செல்வம் நிலையான, முறையான முயற்சியின் மூலம் மெதுவாக வரும்.', te: 'కారకాంశ నుండి 2వ భావంలో శని: వ్యవసాయం, మైనింగ్, నిర్మాణం లేదా భారీ పరిశ్రమ ద్వారా జీవనోపాధి. సంపద నిరంతర, క్రమబద్ధమైన ప్రయత్నం ద్వారా నెమ్మదిగా వస్తుంది.', bn: 'কারকাংশ থেকে ২য় ভাবে শনি: চাষ, খনন, নির্মাণ বা ভারী শিল্পের মাধ্যমে জীবিকা। সম্পদ ধীরে ধীরে অবিচল, পদ্ধতিগত প্রচেষ্টার মাধ্যমে আসে।', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಶನಿ: ಕೃಷಿ, ಗಣಿಗಾರಿಕೆ, ನಿರ್ಮಾಣ ಅಥವಾ ಭಾರೀ ಉದ್ಯಮದ ಮೂಲಕ ಜೀವನೋಪಾಯ. ಸಂಪತ್ತು ನಿರಂತರ, ವ್ಯವಸ್ಥಿತ ಪ್ರಯತ್ನದ ಮೂಲಕ ನಿಧಾನವಾಗಿ ಬರುತ್ತದೆ.', gu: 'કારકાંશથી 2જા ભાવમાં શનિ: ખેતી, ખનન, બાંધકામ અથવા ભારે ઉદ્યોગ દ્વારા જીવિકા. સંપત્તિ ધીરે ધીરે સતત, વ્યવસ્થિત મહેનત દ્વારા આવે છે.' }],
    [7, rahuSign, { en: 'Rahu in 2H from Karakamsha — Foreign Trade & Technology', hi: 'कारकांश से 2H में राहु — विदेशी व्यापार', sa: 'कारकांश से 2H में राहु — विदेशी व्यापार', mai: 'कारकांश से 2H में राहु — विदेशी व्यापार', mr: 'कारकांश से 2H में राहु — विदेशी व्यापार', ta: 'காரகாம்சத்திலிருந்து 2-ல் ராகு — வெளிநாட்டு வணிகம் & தொழில்நுட்பம்', te: 'కారకాంశ నుండి 2వ భావంలో రాహువు — విదేశీ వ్యాపారం & సాంకేతికత', bn: 'কারকাংশ থেকে ২য় ভাবে রাহু — বিদেশি বাণিজ্য ও প্রযুক্তি', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ರಾಹು — ವಿದೇಶಿ ವ್ಯಾಪಾರ & ತಂತ್ರಜ್ಞಾನ', gu: 'કારકાંશથી 2જા ભાવમાં રાહુ — વિદેશી વેપાર અને ટેકનોલોજી' },
      { en: 'Rahu in the 2nd from Karakamsha: income from foreign trade, import-export, metals, technology, or unconventional industries. Wealth through crossing cultural or geographic boundaries.', hi: 'कारकांश से 2H में राहु: विदेशी व्यापार, धातु, प्रौद्योगिकी से आजीविका।', sa: 'कारकांश से 2H में राहु: विदेशी व्यापार, धातु, प्रौद्योगिकी से आजीविका।', mai: 'कारकांश से 2H में राहु: विदेशी व्यापार, धातु, प्रौद्योगिकी से आजीविका।', mr: 'कारकांश से 2H में राहु: विदेशी व्यापार, धातु, प्रौद्योगिकी से आजीविका।', ta: 'காரகாம்சத்திலிருந்து 2-ல் ராகு: வெளிநாட்டு வணிகம், இறக்குமதி-ஏற்றுமதி, உலோகங்கள், தொழில்நுட்பம் அல்லது வழமையற்ற தொழில்களிலிருந்து வருமானம். கலாசார அல்லது புவியியல் எல்லைகளை கடப்பதன் மூலம் செல்வம்.', te: 'కారకాంశ నుండి 2వ భావంలో రాహువు: విదేశీ వ్యాపారం, దిగుమతి-ఎగుమతి, లోహాలు, సాంకేతికత లేదా అసాంప్రదాయ పరిశ్రమల నుండి ఆదాయం. సాంస్కృతిక లేదా భౌగోళిక సరిహద్దులు దాటడం ద్వారా సంపద.', bn: 'কারকাংশ থেকে ২য় ভাবে রাহু: বিদেশি বাণিজ্য, আমদানি-রপ্তানি, ধাতু, প্রযুক্তি বা অপ্রচলিত শিল্প থেকে আয়। সাংস্কৃতিক বা ভৌগোলিক সীমানা পার করার মাধ্যমে সম্পদ।', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ರಾಹು: ವಿದೇಶಿ ವ್ಯಾಪಾರ, ಆಮದು-ರಫ್ತು, ಲೋಹ, ತಂತ್ರಜ್ಞಾನ ಅಥವಾ ಅಸಾಂಪ್ರದಾಯಿಕ ಉದ್ಯಮಗಳಿಂದ ಆದಾಯ. ಸಾಂಸ್ಕೃತಿಕ ಅಥವಾ ಭೌಗೋಳಿಕ ಗಡಿಗಳನ್ನು ದಾಟುವ ಮೂಲಕ ಸಂಪತ್ತು.', gu: 'કારકાંશથી 2જા ભાવમાં રાહુ: વિદેશી વેપાર, આયાત-નિકાસ, ધાતુઓ, ટેકનોલોજી અથવા અપ્રચલિત ઉદ્યોગોમાંથી આવક. સાંસ્કૃતિક અથવા ભૌગોલિક સીમાઓ ઓળંગવા દ્વારા સંપત્તિ.' }],
    [8, ketuSign, { en: 'Ketu in 2H from Karakamsha — Spiritual Vocation', hi: 'कारकांश से 2H में केतु — आध्यात्मिक वृत्ति', sa: 'कारकांश से 2H में केतु — आध्यात्मिक वृत्ति', mai: 'कारकांश से 2H में केतु — आध्यात्मिक वृत्ति', mr: 'कारकांश से 2H में केतु — आध्यात्मिक वृत्ति', ta: 'காரகாம்சத்திலிருந்து 2-ல் கேது — ஆன்மீகத் தொழில்', te: 'కారకాంశ నుండి 2వ భావంలో కేతువు — ఆధ్యాత్మిక వృత్తి', bn: 'কারকাংশ থেকে ২য় ভাবে কেতু — আধ্যাত্মিক বৃত্তি', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಕೇತು — ಆಧ್ಯಾತ್ಮಿಕ ವೃತ್ತಿ', gu: 'કારકાંશથી 2જા ભાવમાં કેતુ — આધ્યાત્મિક વૃત્તિ' },
      { en: 'Ketu in the 2nd from Karakamsha: spiritual practitioner, healer, renunciant, or someone who monetizes ancient knowledge — astrology, medicine, or sacred arts.', hi: 'कारकांश से 2H में केतु: आध्यात्मिक साधक, वैद्य, संन्यासी या प्राचीन ज्ञान से आजीविका।', sa: 'कारकांश से 2H में केतु: आध्यात्मिक साधक, वैद्य, संन्यासी या प्राचीन ज्ञान से आजीविका।', mai: 'कारकांश से 2H में केतु: आध्यात्मिक साधक, वैद्य, संन्यासी या प्राचीन ज्ञान से आजीविका।', mr: 'कारकांश से 2H में केतु: आध्यात्मिक साधक, वैद्य, संन्यासी या प्राचीन ज्ञान से आजीविका।', ta: 'காரகாம்சத்திலிருந்து 2-ல் கேது: ஆன்மீக பயிற்சியாளர், மருத்துவர், துறவி, அல்லது பண்டைய ஞானத்தை பணமாக்குபவர் — ஜோதிடம், மருத்துவம் அல்லது புனிதக் கலைகள்.', te: 'కారకాంశ నుండి 2వ భావంలో కేతువు: ఆధ్యాత్మిక సాధకుడు, వైద్యుడు, సన్యాసి, లేదా ప్రాచీన జ్ఞానాన్ని ఆదాయంగా మార్చేవాడు — జ్యోతిషం, వైద్యం లేదా పవిత్ర కళలు.', bn: 'কারকাংশ থেকে ২য় ভাবে কেতু: আধ্যাত্মিক সাধক, চিকিৎসক, সন্ন্যাসী, অথবা প্রাচীন জ্ঞানকে অর্থে রূপান্তরকারী — জ্যোতিষ, চিকিৎসা বা পবিত্র শিল্প।', kn: 'ಕಾರಕಾಂಶದಿಂದ 2ನೇ ಭಾವದಲ್ಲಿ ಕೇತು: ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧಕ, ವೈದ್ಯ, ಸಂನ್ಯಾಸಿ, ಅಥವಾ ಪ್ರಾಚೀನ ಜ್ಞಾನವನ್ನು ಆದಾಯವಾಗಿ ಮಾರ್ಪಡಿಸುವವನು — ಜ್ಯೋತಿಷ, ವೈದ್ಯಕೀಯ ಅಥವಾ ಪವಿತ್ರ ಕಲೆಗಳು.', gu: 'કારકાંશથી 2જા ભાવમાં કેતુ: આધ્યાત્મિક સાધક, વૈદ્ય, સંન્યાસી, અથવા પ્રાચીન જ્ઞાનને ધનમાં ફેરવનાર — જ્યોતિષ, ચિકિત્સા અથવા પવિત્ર કળાઓ.' }],
  ];

  for (const [pid, psign, name, description] of PROF_2H) {
    if (!psign) continue;
    const pos = fromKarakamsha(km, psign);
    if (pos === 2) {
      yogas.push({ name, present: true, strength: 'moderate', description });
    }
  }

  // ─── 5H from Karakamsha — Intelligence, Children, Learning ─────────────────
  const FIFTH_KM: Array<[number, number | null, LocaleText, LocaleText]> = [
    [0, sunSign, { en: 'Sun in 5H from Karakamsha — Leadership Intelligence', hi: 'कारकांश से 5H में सूर्य — नेतृत्व बुद्धि', sa: 'कारकांश से 5H में सूर्य — नेतृत्व बुद्धि', mai: 'कारकांश से 5H में सूर्य — नेतृत्व बुद्धि', mr: 'कारकांश से 5H में सूर्य — नेतृत्व बुद्धि', ta: 'காரகாம்சத்திலிருந்து 5-ல் சூரியன் — தலைமை அறிவு', te: 'కారకాంశ నుండి 5వ భావంలో సూర్యుడు — నాయకత్వ బుద్ధి', bn: 'কারকাংশ থেকে ৫ম ভাবে সূর্য — নেতৃত্ব বুদ্ধি', kn: 'ಕಾರಕಾಂಶದಿಂದ 5ನೇ ಭಾವದಲ್ಲಿ ಸೂರ್ಯ — ನಾಯಕತ್ವ ಬುದ್ಧಿ', gu: 'કારકાંશથી 5મા ભાવમાં સૂર્ય — નેતૃત્વ બુદ્ધિ' },
      { en: 'Sun in the 5th from Karakamsha: commanding intellect, governmental or political intelligence, natural authority in teaching or advisory roles. Children may hold positions of authority.', hi: 'कारकांश से 5H में सूर्य: सरकारी बुद्धि, राजनीतिक बौद्धिकता, शिक्षण में स्वाभाविक अधिकार।', sa: 'कारकांश से 5H में सूर्य: सरकारी बुद्धि, राजनीतिक बौद्धिकता, शिक्षण में स्वाभाविक अधिकार।', mai: 'कारकांश से 5H में सूर्य: सरकारी बुद्धि, राजनीतिक बौद्धिकता, शिक्षण में स्वाभाविक अधिकार।', mr: 'कारकांश से 5H में सूर्य: सरकारी बुद्धि, राजनीतिक बौद्धिकता, शिक्षण में स्वाभाविक अधिकार।', ta: 'காரகாம்சத்திலிருந்து 5-ல் சூரியன்: ஆணையிடும் அறிவு, அரசு அல்லது அரசியல் புத்திகூர்மை, கற்பித்தல் அல்லது ஆலோசனையில் இயல்பான அதிகாரம். குழந்தைகள் அதிகார பதவிகளில் இருக்கலாம்.', te: 'కారకాంశ నుండి 5వ భావంలో సూర్యుడు: ఆజ్ఞాపించే మేధస్సు, ప్రభుత్వ లేదా రాజకీయ బుద్ధి, బోధన లేదా సలహా పాత్రలలో సహజ అధికారం. పిల్లలు అధికార పదవులు కలిగి ఉండవచ్చు.', bn: 'কারকাংশ থেকে ৫ম ভাবে সূর্য: কর্তৃত্বপূর্ণ মেধা, সরকারি বা রাজনৈতিক বুদ্ধি, শিক্ষণ বা উপদেষ্টা ভূমিকায় স্বাভাবিক কর্তৃত্ব। সন্তানরা কর্তৃত্বের পদে থাকতে পারে।', kn: 'ಕಾರಕಾಂಶದಿಂದ 5ನೇ ಭಾವದಲ್ಲಿ ಸೂರ್ಯ: ಆಜ್ಞಾಶೀಲ ಬುದ್ಧಿ, ಸರ್ಕಾರಿ ಅಥವಾ ರಾಜಕೀಯ ಬುದ್ಧಿಮತ್ತೆ, ಬೋಧನೆ ಅಥವಾ ಸಲಹೆಗಾರ ಪಾತ್ರಗಳಲ್ಲಿ ಸಹಜ ಅಧಿಕಾರ.', gu: 'કારકાંશથી 5મા ભાવમાં સૂર્ય: આદેશાત્મક બુદ્ધિ, સરકારી અથવા રાજકીય બુદ્ધિમત્તા, શિક્ષણ અથવા સલાહકાર ભૂમિકામાં સ્વાભાવિક સત્તા.' }],
    [1, moonSign, { en: 'Moon in 5H from Karakamsha — Public & Agricultural Intelligence', hi: 'कारकांश से 5H में चंद्र — सार्वजनिक बुद्धि', sa: 'कारकांश से 5H में चंद्र — सार्वजनिक बुद्धि', mai: 'कारकांश से 5H में चंद्र — सार्वजनिक बुद्धि', mr: 'कारकांश से 5H में चंद्र — सार्वजनिक बुद्धि', ta: 'காரகாம்சத்திலிருந்து 5-ல் சந்திரன் — பொது & விவசாய அறிவு', te: 'కారకాంశ నుండి 5వ భావంలో చంద్రుడు — ప్రజా & వ్యవసాయ బుద్ధి', bn: 'কারকাংশ থেকে ৫ম ভাবে চন্দ্র — জনকল্যাণ ও কৃষি বুদ্ধি', kn: 'ಕಾರಕಾಂಶದಿಂದ 5ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ — ಸಾರ್ವಜನಿಕ & ಕೃಷಿ ಬುದ್ಧಿ', gu: 'કારકાંશથી 5મા ભાવમાં ચંદ્ર — જાહેર અને કૃષિ બુદ્ધિ' },
      { en: 'Moon in the 5th from Karakamsha: intuitive intelligence suited to public life, agriculture, and food-related work. Excellent memory, emotionally perceptive children.', hi: 'कारकांश से 5H में चंद्र: सार्वजनिक जीवन, कृषि के लिए सहज बुद्धि। उत्कृष्ट स्मृति।', sa: 'कारकांश से 5H में चंद्र: सार्वजनिक जीवन, कृषि के लिए सहज बुद्धि। उत्कृष्ट स्मृति।', mai: 'कारकांश से 5H में चंद्र: सार्वजनिक जीवन, कृषि के लिए सहज बुद्धि। उत्कृष्ट स्मृति।', mr: 'कारकांश से 5H में चंद्र: सार्वजनिक जीवन, कृषि के लिए सहज बुद्धि। उत्कृष्ट स्मृति।', ta: 'காரகாம்சத்திலிருந்து 5-ல் சந்திரன்: பொது வாழ்க்கை, விவசாயம் மற்றும் உணவு தொடர்பான பணிகளுக்கு ஏற்ற உள்ளுணர்வு அறிவு. சிறந்த நினைவாற்றல், உணர்வுபூர்வ குழந்தைகள்.', te: 'కారకాంశ నుండి 5వ భావంలో చంద్రుడు: ప్రజా జీవితం, వ్యవసాయం మరియు ఆహార సంబంధ పనికి అనువైన సహజ జ్ఞానం. అద్భుతమైన జ్ఞాపకశక్తి, భావోద్వేగంగా గ్రహించే పిల్లలు.', bn: 'কারকাংশ থেকে ৫ম ভাবে চন্দ্র: জনজীবন, কৃষি ও খাদ্য-সংক্রান্ত কাজের জন্য উপযুক্ত সহজাত বুদ্ধি। চমৎকার স্মৃতিশক্তি, আবেগপ্রবণ সন্তান।', kn: 'ಕಾರಕಾಂಶದಿಂದ 5ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಸಾರ್ವಜನಿಕ ಜೀವನ, ಕೃಷಿ ಮತ್ತು ಆಹಾರ ಸಂಬಂಧಿ ಕೆಲಸಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳುವ ಅಂತಃಪ್ರಜ್ಞ ಬುದ್ಧಿ. ಅತ್ಯುತ್ತಮ ಸ್ಮರಣಶಕ್ತಿ.', gu: 'કારકાંશથી 5મા ભાવમાં ચંદ્ર: જાહેર જીવન, ખેતી અને ખાદ્ય સંબંધિત કાર્ય માટે અનુકૂળ સહજ બુદ્ધિ. ઉત્તમ સ્મરણશક્તિ.' }],
    [3, mercSign, { en: 'Mercury in 5H from Karakamsha — Mathematical & Oratorical Genius', hi: 'कारकांश से 5H में बुध — गणितीय प्रतिभा', sa: 'कारकांश से 5H में बुध — गणितीय प्रतिभा', mai: 'कारकांश से 5H में बुध — गणितीय प्रतिभा', mr: 'कारकांश से 5H में बुध — गणितीय प्रतिभा', ta: 'காரகாம்சத்திலிருந்து 5-ல் புதன் — கணித & சொற்பொழிவு மேதை', te: 'కారకాంశ నుండి 5వ భావంలో బుధుడు — గణిత & వక్తృత్వ ప్రతిభ', bn: 'কারকাংশ থেকে ৫ম ভাবে বুধ — গণিত ও বাগ্মিতা প্রতিভা', kn: 'ಕಾರಕಾಂಶದಿಂದ 5ನೇ ಭಾವದಲ್ಲಿ ಬುಧ — ಗಣಿತ & ವಾಕ್ಪಟುತ್ವ ಪ್ರತಿಭೆ', gu: 'કારકાંશથી 5મા ભાવમાં બુધ — ગણિત અને વકતૃત્વ પ્રતિભા' },
      { en: 'Mercury in the 5th from Karakamsha: exceptional mathematical ability, oratory, writing, and linguistic intelligence. A natural astrologer, writer, or mathematician. Gifted communicator children.', hi: 'कारकांश से 5H में बुध: असाधारण गणितीय क्षमता, वक्तृत्व, लेखन। स्वाभाविक ज्योतिषी या गणितज्ञ।', sa: 'कारकांश से 5H में बुध: असाधारण गणितीय क्षमता, वक्तृत्व, लेखन। स्वाभाविक ज्योतिषी या गणितज्ञ।', mai: 'कारकांश से 5H में बुध: असाधारण गणितीय क्षमता, वक्तृत्व, लेखन। स्वाभाविक ज्योतिषी या गणितज्ञ।', mr: 'कारकांश से 5H में बुध: असाधारण गणितीय क्षमता, वक्तृत्व, लेखन। स्वाभाविक ज्योतिषी या गणितज्ञ।', ta: 'காரகாம்சத்திலிருந்து 5-ல் புதன்: அசாதாரண கணித திறன், பேச்சாற்றல், எழுத்து மற்றும் மொழி அறிவு. இயல்பான ஜோதிடர், எழுத்தாளர் அல்லது கணிதவியலாளர்.', te: 'కారకాంశ నుండి 5వ భావంలో బుధుడు: అసాధారణ గణిత సామర్థ్యం, వక్తృత్వం, రచన మరియు భాషా బుద్ధి. సహజ జ్యోతిష్కుడు, రచయిత లేదా గణిత శాస్త్రజ్ఞుడు.', bn: 'কারকাংশ থেকে ৫ম ভাবে বুধ: অসাধারণ গণিত ক্ষমতা, বাগ্মিতা, লেখা ও ভাষাগত বুদ্ধি। স্বাভাবিক জ্যোতিষী, লেখক বা গণিতবিদ।', kn: 'ಕಾರಕಾಂಶದಿಂದ 5ನೇ ಭಾವದಲ್ಲಿ ಬುಧ: ಅಸಾಧಾರಣ ಗಣಿತ ಸಾಮರ್ಥ್ಯ, ವಾಕ್ಪಟುತ್ವ, ಬರವಣಿಗೆ ಮತ್ತು ಭಾಷಾ ಬುದ್ಧಿ. ಸಹಜ ಜ್ಯೋತಿಷಿ, ಬರಹಗಾರ ಅಥವಾ ಗಣಿತಜ್ಞ.', gu: 'કારકાંશથી 5મા ભાવમાં બુધ: અસાધારણ ગણિત ક્ષમતા, વકતૃત્વ, લેખન અને ભાષા બુદ્ધિ. સ્વાભાવિક જ્યોતિષી, લેખક અથવા ગણિતશાસ્ત્રી.' }],
    [6, satSign, { en: 'Saturn in 5H from Karakamsha — Research & Depth Intelligence', hi: 'कारकांश से 5H में शनि — शोध बुद्धि', sa: 'कारकांश से 5H में शनि — शोध बुद्धि', mai: 'कारकांश से 5H में शनि — शोध बुद्धि', mr: 'कारकांश से 5H में शनि — शोध बुद्धि', ta: 'காரகாம்சத்திலிருந்து 5-ல் சனி — ஆராய்ச்சி & ஆழ அறிவு', te: 'కారకాంశ నుండి 5వ భావంలో శని — పరిశోధన & లోతైన బుద్ధి', bn: 'কারকাংশ থেকে ৫ম ভাবে শনি — গবেষণা ও গভীর বুদ্ধি', kn: 'ಕಾರಕಾಂಶದಿಂದ 5ನೇ ಭಾವದಲ್ಲಿ ಶನಿ — ಸಂಶೋಧನೆ & ಆಳ ಬುದ್ಧಿ', gu: 'કારકાંશથી 5મા ભાવમાં શનિ — સંશોધન અને ગહન બુદ્ધિ' },
      { en: 'Saturn in the 5th from Karakamsha: slow but deep intelligence — excels in research, philosophy, occult sciences, and systematic study. Children may arrive late or be few but significant.', hi: 'कारकांश से 5H में शनि: धीर लेकिन गहरी बुद्धि, शोध, दर्शन, गुप्त विज्ञान में उत्कृष्टता।', sa: 'कारकांश से 5H में शनि: धीर लेकिन गहरी बुद्धि, शोध, दर्शन, गुप्त विज्ञान में उत्कृष्टता।', mai: 'कारकांश से 5H में शनि: धीर लेकिन गहरी बुद्धि, शोध, दर्शन, गुप्त विज्ञान में उत्कृष्टता।', mr: 'कारकांश से 5H में शनि: धीर लेकिन गहरी बुद्धि, शोध, दर्शन, गुप्त विज्ञान में उत्कृष्टता।', ta: 'காரகாம்சத்திலிருந்து 5-ல் சனி: மெதுவான ஆனால் ஆழமான அறிவு — ஆராய்ச்சி, தத்துவம், மறைபொருள் விஞ்ஞானம் மற்றும் முறையான படிப்பில் சிறந்தது. குழந்தைகள் தாமதமாக அல்லது குறைவாக ஆனால் முக்கியமானவர்களாக வரலாம்.', te: 'కారకాంశ నుండి 5వ భావంలో శని: నెమ్మదైన కానీ లోతైన బుద్ధి — పరిశోధన, తత్వశాస్త్రం, గూఢ శాస్త్రాలు మరియు క్రమబద్ధ అధ్యయనంలో ప్రావీణ్యం.', bn: 'কারকাংশ থেকে ৫ম ভাবে শনি: ধীর কিন্তু গভীর বুদ্ধি — গবেষণা, দর্শন, গুপ্ত বিজ্ঞান ও পদ্ধতিগত অধ্যয়নে শ্রেষ্ঠ। সন্তান দেরিতে বা কম কিন্তু গুরুত্বপূর্ণ হতে পারে।', kn: 'ಕಾರಕಾಂಶದಿಂದ 5ನೇ ಭಾವದಲ್ಲಿ ಶನಿ: ನಿಧಾನ ಆದರೆ ಆಳವಾದ ಬುದ್ಧಿ — ಸಂಶೋಧನೆ, ತತ್ವಶಾಸ್ತ್ರ, ಗೂಢ ವಿಜ್ಞಾನ ಮತ್ತು ವ್ಯವಸ್ಥಿತ ಅಧ್ಯಯನದಲ್ಲಿ ಶ್ರೇಷ್ಠ.', gu: 'કારકાંશથી 5મા ભાવમાં શનિ: ધીમી પણ ઊંડી બુદ્ધિ — સંશોધન, દર્શન, ગૂઢ વિજ્ઞાન અને વ્યવસ્થિત અભ્યાસમાં શ્રેષ્ઠ.' }],
  ];

  for (const [pid, psign, name, description] of FIFTH_KM) {
    if (!psign) continue;
    const pos = fromKarakamsha(km, psign);
    if (pos === 5) {
      yogas.push({ name, present: true, strength: 'moderate', description });
    }
    void pid;
  }

  // ─── 7H from Karakamsha — Spouse Characteristics ────────────────────────────
  const SEVENTH_KM: Array<[number, number | null, LocaleText, LocaleText]> = [
    [0, sunSign, { en: 'Sun in 7H from Karakamsha — Prominent Spouse', hi: 'कारकांश से 7H में सूर्य — प्रतिष्ठित जीवनसाथी', sa: 'कारकांश से 7H में सूर्य — प्रतिष्ठित जीवनसाथी', mai: 'कारकांश से 7H में सूर्य — प्रतिष्ठित जीवनसाथी', mr: 'कारकांश से 7H में सूर्य — प्रतिष्ठित जीवनसाथी', ta: 'காரகாம்சத்திலிருந்து 7-ல் சூரியன் — புகழ்பெற்ற வாழ்க்கைத் துணை', te: 'కారకాంశ నుండి 7వ భావంలో సూర్యుడు — ప్రముఖ జీవిత భాగస్వామి', bn: 'কারকাংশ থেকে ৭ম ভাবে সূর্য — প্রতিষ্ঠিত জীবনসঙ্গী', kn: 'ಕಾರಕಾಂಶದಿಂದ 7ನೇ ಭಾವದಲ್ಲಿ ಸೂರ್ಯ — ಪ್ರಮುಖ ಜೀವನ ಸಂಗಾತಿ', gu: 'કારકાંશથી 7મા ભાવમાં સૂર્ય — પ્રતિષ્ઠિત જીવનસાથી' },
      { en: 'Sun in the 7th from Karakamsha: an authoritative, prominent spouse — government servant, executive, or someone with natural command. The relationship brings social status.', hi: 'कारकांश से 7H में सूर्य: प्रतिष्ठित जीवनसाथी — सरकारी अधिकारी या कार्यकारी।', sa: 'कारकांश से 7H में सूर्य: प्रतिष्ठित जीवनसाथी — सरकारी अधिकारी या कार्यकारी।', mai: 'कारकांश से 7H में सूर्य: प्रतिष्ठित जीवनसाथी — सरकारी अधिकारी या कार्यकारी।', mr: 'कारकांश से 7H में सूर्य: प्रतिष्ठित जीवनसाथी — सरकारी अधिकारी या कार्यकारी।', ta: 'காரகாம்சத்திலிருந்து 7-ல் சூரியன்: அதிகாரமுள்ள, புகழ்பெற்ற வாழ்க்கைத் துணை — அரசு ஊழியர், நிர்வாகி அல்லது இயல்பான ஆணைக்குரியவர். உறவு சமூக அந்தஸ்தை தருகிறது.', te: 'కారకాంశ నుండి 7వ భావంలో సూర్యుడు: అధికారయుతమైన, ప్రముఖ జీవిత భాగస్వామి — ప్రభుత్వ ఉద్యోగి, కార్యనిర్వాహకుడు. సంబంధం సామాజిక హోదాను తెస్తుంది.', bn: 'কারকাংশ থেকে ৭ম ভাবে সূর্য: কর্তৃত্বপূর্ণ, প্রতিষ্ঠিত জীবনসঙ্গী — সরকারি কর্মচারী, নির্বাহী বা স্বাভাবিক আধিপত্যবিশিষ্ট। সম্পর্ক সামাজিক মর্যাদা আনে।', kn: 'ಕಾರಕಾಂಶದಿಂದ 7ನೇ ಭಾವದಲ್ಲಿ ಸೂರ್ಯ: ಅಧಿಕಾರಯುಕ್ತ, ಪ್ರಮುಖ ಜೀವನ ಸಂಗಾತಿ — ಸರ್ಕಾರಿ ನೌಕರ, ಕಾರ್ಯನಿರ್ವಾಹಕ. ಸಂಬಂಧ ಸಾಮಾಜಿಕ ಸ್ಥಾನಮಾನ ತರುತ್ತದೆ.', gu: 'કારકાંશથી 7મા ભાવમાં સૂર્ય: સત્તાધારી, પ્રતિષ્ઠિત જીવનસાથી — સરકારી કર્મચારી, કાર્યકારી. સંબંધ સામાજિક દરજ્જો લાવે છે.' }],
    [1, moonSign, { en: 'Moon in 7H from Karakamsha — Beautiful & Emotional Spouse', hi: 'कारकांश से 7H में चंद्र — सुन्दर जीवनसाथी', sa: 'कारकांश से 7H में चंद्र — सुन्दर जीवनसाथी', mai: 'कारकांश से 7H में चंद्र — सुन्दर जीवनसाथी', mr: 'कारकांश से 7H में चंद्र — सुन्दर जीवनसाथी', ta: 'காரகாம்சத்திலிருந்து 7-ல் சந்திரன் — அழகான & உணர்வுள்ள வாழ்க்கைத் துணை', te: 'కారకాంశ నుండి 7వ భావంలో చంద్రుడు — అందమైన & భావోద్వేగ జీవిత భాగస్వామి', bn: 'কারকাংশ থেকে ৭ম ভাবে চন্দ্র — সুন্দর ও আবেগপূর্ণ জীবনসঙ্গী', kn: 'ಕಾರಕಾಂಶದಿಂದ 7ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ — ಸುಂದರ & ಭಾವನಾತ್ಮಕ ಜೀವನ ಸಂಗಾತಿ', gu: 'કારકાંશથી 7મા ભાવમાં ચંદ્ર — સુંદર અને ભાવનાત્મક જીવનસાથી' },
      { en: 'Moon in the 7th from Karakamsha: an attractive, emotionally rich spouse. The partner is nurturing, publicly loved, and possibly connected to trade or public life.', hi: 'कारकांश से 7H में चंद्र: आकर्षक, भावनात्मक रूप से समृद्ध जीवनसाथी।', sa: 'कारकांश से 7H में चंद्र: आकर्षक, भावनात्मक रूप से समृद्ध जीवनसाथी।', mai: 'कारकांश से 7H में चंद्र: आकर्षक, भावनात्मक रूप से समृद्ध जीवनसाथी।', mr: 'कारकांश से 7H में चंद्र: आकर्षक, भावनात्मक रूप से समृद्ध जीवनसाथी।', ta: 'காரகாம்சத்திலிருந்து 7-ல் சந்திரன்: கவர்ச்சிகரமான, உணர்வுபூர்வமாக செழிப்பான வாழ்க்கைத் துணை. துணைவர் பராமரிப்பு செய்யும், பொதுமக்களால் விரும்பப்படும், வணிகம் அல்லது பொது வாழ்க்கையுடன் இணைக்கப்பட்டிருக்கலாம்.', te: 'కారకాంశ నుండి 7వ భావంలో చంద్రుడు: ఆకర్షణీయమైన, భావోద్వేగంగా సమృద్ధి గల జీవిత భాగస్వామి. భాగస్వామి పోషించేవాడు, ప్రజలచే ప్రేమించబడిన.', bn: 'কারকাংশ থেকে ৭ম ভাবে চন্দ্র: আকর্ষণীয়, আবেগপূর্ণভাবে সমৃদ্ধ জীবনসঙ্গী। সঙ্গী পালনকারী, জনপ্রিয় এবং সম্ভবত বাণিজ্য বা জনজীবনের সাথে যুক্ত।', kn: 'ಕಾರಕಾಂಶದಿಂದ 7ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಆಕರ್ಷಕ, ಭಾವನಾತ್ಮಕವಾಗಿ ಸಮೃದ್ಧ ಜೀವನ ಸಂಗಾತಿ. ಸಂಗಾತಿ ಪೋಷಕ, ಜನಪ್ರಿಯ.', gu: 'કારકાંશથી 7મા ભાવમાં ચંદ્ર: આકર્ષક, ભાવનાત્મક રીતે સમૃદ્ધ જીવનસાથી. સાથી પાલનકર્તા, લોકપ્રિય.' }],
    [2, marsSign, { en: 'Mars in 7H from Karakamsha — Athletic or Volatile Spouse', hi: 'कारकांश से 7H में मंगल — ऊर्जावान जीवनसाथी', sa: 'कारकांश से 7H में मंगल — ऊर्जावान जीवनसाथी', mai: 'कारकांश से 7H में मंगल — ऊर्जावान जीवनसाथी', mr: 'कारकांश से 7H में मंगल — ऊर्जावान जीवनसाथी', ta: 'காரகாம்சத்திலிருந்து 7-ல் செவ்வாய் — வலிமையான வாழ்க்கைத் துணை', te: 'కారకాంశ నుండి 7వ భావంలో కుజుడు — శారీరకంగా బలమైన జీవిత భాగస్వామి', bn: 'কারকাংশ থেকে ৭ম ভাবে মঙ্গল — শক্তিশালী জীবনসঙ্গী', kn: 'ಕಾರಕಾಂಶದಿಂದ 7ನೇ ಭಾವದಲ್ಲಿ ಮಂಗಳ — ಶಕ್ತಿಯುತ ಜೀವನ ಸಂಗಾತಿ', gu: 'કારકાંશથી 7મા ભાવમાં મંગળ — શક્તિશાળી જીવનસાથી' },
      { en: 'Mars in the 7th from Karakamsha: a physically strong, courageous, or militaristic spouse. The marriage may involve friction — both parties are spirited and independent.', hi: 'कारकांश से 7H में मंगल: शारीरिक रूप से मजबूत, साहसी जीवनसाथी। विवाह में घर्षण संभव।', sa: 'कारकांश से 7H में मंगल: शारीरिक रूप से मजबूत, साहसी जीवनसाथी। विवाह में घर्षण संभव।', mai: 'कारकांश से 7H में मंगल: शारीरिक रूप से मजबूत, साहसी जीवनसाथी। विवाह में घर्षण संभव।', mr: 'कारकांश से 7H में मंगल: शारीरिक रूप से मजबूत, साहसी जीवनसाथी। विवाह में घर्षण संभव।', ta: 'காரகாம்சத்திலிருந்து 7-ல் செவ்வாய்: உடல் வலிமையான, தைரியமான வாழ்க்கைத் துணை. திருமணத்தில் உராய்வு இருக்கலாம் — இருவரும் உற்சாகமான மற்றும் சுதந்திரமான.', te: 'కారకాంశ నుండి 7వ భావంలో కుజుడు: శారీరకంగా బలమైన, ధైర్యమైన జీవిత భాగస్వామి. వివాహంలో ఘర్షణ ఉండవచ్చు — ఇద్దరూ ఉత్సాహవంతులు మరియు స్వతంత్రులు.', bn: 'কারকাংশ থেকে ৭ম ভাবে মঙ্গল: শারীরিকভাবে শক্তিশালী, সাহসী জীবনসঙ্গী। বিবাহে ঘর্ষণ হতে পারে — উভয়ই উদ্যমী ও স্বাধীন।', kn: 'ಕಾರಕಾಂಶದಿಂದ 7ನೇ ಭಾವದಲ್ಲಿ ಮಂಗಳ: ದೈಹಿಕವಾಗಿ ಬಲಿಷ್ಠ, ಧೈರ್ಯಶಾಲಿ ಜೀವನ ಸಂಗಾತಿ. ವಿವಾಹದಲ್ಲಿ ಘರ್ಷಣೆ ಇರಬಹುದು.', gu: 'કારકાંશથી 7મા ભાવમાં મંગળ: શારીરિક રીતે મજબૂત, બહાદુર જીવનસાથી. લગ્નમાં ઘર્ષણ હોઈ શકે — બંને ઉત્સાહી અને સ્વતંત્ર.' }],
    [3, mercSign, { en: 'Mercury in 7H from Karakamsha — Intelligent & Communicative Spouse', hi: 'कारकांश से 7H में बुध — बुद्धिमान जीवनसाथी', sa: 'कारकांश से 7H में बुध — बुद्धिमान जीवनसाथी', mai: 'कारकांश से 7H में बुध — बुद्धिमान जीवनसाथी', mr: 'कारकांश से 7H में बुध — बुद्धिमान जीवनसाथी', ta: 'காரகாம்சத்திலிருந்து 7-ல் புதன் — புத்திசாலி & தகவல் தொடர்பு வல்ல வாழ்க்கைத் துணை', te: 'కారకాంశ నుండి 7వ భావంలో బుధుడు — తెలివైన & సంభాషణా నిపుణ జీవిత భాగస్వామి', bn: 'কারকাংশ থেকে ৭ম ভাবে বুধ — বুদ্ধিমান ও সংবাদশীল জীবনসঙ্গী', kn: 'ಕಾರಕಾಂಶದಿಂದ 7ನೇ ಭಾವದಲ್ಲಿ ಬುಧ — ಬುದ್ಧಿವಂತ & ಸಂವಹನಶೀಲ ಜೀವನ ಸಂಗಾತಿ', gu: 'કારકાંશથી 7મા ભાવમાં બુધ — બુદ્ધિશાળી અને સંવાદશીલ જીવનસાથી' },
      { en: 'Mercury in the 7th from Karakamsha: a witty, educated, and communicative spouse. The relationship thrives on intellectual exchange and shared learning.', hi: 'कारकांश से 7H में बुध: चतुर, शिक्षित, संवादशील जीवनसाथी।', sa: 'कारकांश से 7H में बुध: चतुर, शिक्षित, संवादशील जीवनसाथी।', mai: 'कारकांश से 7H में बुध: चतुर, शिक्षित, संवादशील जीवनसाथी।', mr: 'कारकांश से 7H में बुध: चतुर, शिक्षित, संवादशील जीवनसाथी।', ta: 'காரகாம்சத்திலிருந்து 7-ல் புதன்: புத்திசாலி, படித்த, தகவல் தொடர்பு வல்ல வாழ்க்கைத் துணை. உறவு அறிவார்ந்த பரிமாற்றம் மற்றும் பகிரப்பட்ட கற்றலில் செழிக்கிறது.', te: 'కారకాంశ నుండి 7వ భావంలో బుధుడు: తెలివైన, విద్యావంతుడైన, సంభాషణా నిపుణుడైన జీవిత భాగస్వామి. సంబంధం మేధో వినిమయం మరియు సమష్టి అభ్యాసంపై వర్ధిల్లుతుంది.', bn: 'কারকাংশ থেকে ৭ম ভাবে বুধ: চতুর, শিক্ষিত ও যোগাযোগদক্ষ জীবনসঙ্গী। সম্পর্ক বৌদ্ধিক বিনিময় ও যৌথ শিক্ষায় সমৃদ্ধ হয়।', kn: 'ಕಾರಕಾಂಶದಿಂದ 7ನೇ ಭಾವದಲ್ಲಿ ಬುಧ: ಚತುರ, ವಿದ್ಯಾವಂತ, ಸಂವಹನಶೀಲ ಜೀವನ ಸಂಗಾತಿ. ಸಂಬಂಧ ಬೌದ್ಧಿಕ ವಿನಿಮಯದಲ್ಲಿ ಅಭಿವೃದ್ಧಿ ಹೊಂದುತ್ತದೆ.', gu: 'કારકાંશથી 7મા ભાવમાં બુધ: ચતુર, શિક્ષિત, સંવાદકુશળ જીવનસાથી. સંબંધ બૌદ્ધિક આદાનપ્રદાનમાં ખીલે છે.' }],
    [6, satSign, { en: 'Saturn in 7H from Karakamsha — Mature or Delayed Marriage', hi: 'कारकांश से 7H में शनि — परिपक्व विवाह', sa: 'कारकांश से 7H में शनि — परिपक्व विवाह', mai: 'कारकांश से 7H में शनि — परिपक्व विवाह', mr: 'कारकांश से 7H में शनि — परिपक्व विवाह', ta: 'காரகாம்சத்திலிருந்து 7-ல் சனி — முதிர்ந்த அல்லது தாமதமான திருமணம்', te: 'కారకాంశ నుండి 7వ భావంలో శని — పరిణతి లేదా ఆలస్యమైన వివాహం', bn: 'কারকাংশ থেকে ৭ম ভাবে শনি — পরিণত বা বিলম্বিত বিবাহ', kn: 'ಕಾರಕಾಂಶದಿಂದ 7ನೇ ಭಾವದಲ್ಲಿ ಶನಿ — ಪ್ರೌಢ ಅಥವಾ ವಿಳಂಬ ವಿವಾಹ', gu: 'કારકાંશથી 7મા ભાવમાં શનિ — પરિપક્વ અથવા વિલંબિત વિવાહ' },
      { en: 'Saturn in the 7th from Karakamsha: marriage may be delayed or to an older/more serious partner. The relationship deepens with age and is built on mutual duty and reliability.', hi: 'कारकांश से 7H में शनि: विवाह में विलंब या अधिक परिपक्व जीवनसाथी। संबंध कर्तव्य पर बनता है।', sa: 'कारकांश से 7H में शनि: विवाह में विलंब या अधिक परिपक्व जीवनसाथी। संबंध कर्तव्य पर बनता है।', mai: 'कारकांश से 7H में शनि: विवाह में विलंब या अधिक परिपक्व जीवनसाथी। संबंध कर्तव्य पर बनता है।', mr: 'कारकांश से 7H में शनि: विवाह में विलंब या अधिक परिपक्व जीवनसाथी। संबंध कर्तव्य पर बनता है।', ta: 'காரகாம்சத்திலிருந்து 7-ல் சனி: திருமணம் தாமதமாகலாம் அல்லது மூத்த/தீவிரமான துணையுடன் இருக்கலாம். உறவு வயதுடன் ஆழமாகிறது, பரஸ்பர கடமை மற்றும் நம்பகத்தன்மையின் மீது கட்டமைக்கப்பட்டது.', te: 'కారకాంశ నుండి 7వ భావంలో శని: వివాహం ఆలస్యం కావచ్చు లేదా పెద్దవారు/తీవ్రమైన భాగస్వామితో. సంబంధం వయస్సుతో లోతుగా మారుతుంది, పరస్పర కర్తవ్యం మరియు నమ్మకంపై నిర్మించబడింది.', bn: 'কারকাংশ থেকে ৭ম ভাবে শনি: বিবাহ বিলম্বিত হতে পারে বা বয়স্ক/গুরুতর সঙ্গীর সাথে হতে পারে। সম্পর্ক বয়সের সাথে গভীর হয়, পারস্পরিক কর্তব্য ও নির্ভরযোগ্যতার উপর প্রতিষ্ঠিত।', kn: 'ಕಾರಕಾಂಶದಿಂದ 7ನೇ ಭಾವದಲ್ಲಿ ಶನಿ: ವಿವಾಹ ವಿಳಂಬವಾಗಬಹುದು ಅಥವಾ ಹಿರಿಯ/ಗಂಭೀರ ಸಂಗಾತಿಯೊಂದಿಗೆ. ಸಂಬಂಧ ವಯಸ್ಸಿನೊಂದಿಗೆ ಆಳವಾಗುತ್ತದೆ.', gu: 'કારકાંશથી 7મા ભાવમાં શનિ: લગ્ન વિલંબિત થઈ શકે અથવા વડીલ/ગંભીર સાથી સાથે. સંબંધ ઉંમર સાથે ગાઢ બને છે.' }],
  ];

  for (const [pid, psign, name, description] of SEVENTH_KM) {
    if (!psign) continue;
    const pos = fromKarakamsha(km, psign);
    if (pos === 7) {
      yogas.push({ name, present: true, strength: 'moderate', description });
    }
    void pid;
  }

  // ─── 8H from Karakamsha — Longevity & Transformation ────────────────────────
  const EIGHTH_KM: Array<[number, number | null, LocaleText, LocaleText]> = [
    [4, jupSign, { en: 'Jupiter in 8H from Karakamsha — Longevity & Wisdom', hi: 'कारकांश से 8H में बृहस्पति — दीर्घायु', sa: 'कारकांश से 8H में बृहस्पति — दीर्घायु', mai: 'कारकांश से 8H में बृहस्पति — दीर्घायु', mr: 'कारकांश से 8H में बृहस्पति — दीर्घायु', ta: 'காரகாம்சத்திலிருந்து 8-ல் குரு — நீண்ட ஆயுள் & ஞானம்', te: 'కారకాంశ నుండి 8వ భావంలో గురుడు — దీర్ఘాయుష్షు & జ్ఞానం', bn: 'কারকাংশ থেকে ৮ম ভাবে বৃহস্পতি — দীর্ঘায়ু ও জ্ঞান', kn: 'ಕಾರಕಾಂಶದಿಂದ 8ನೇ ಭಾವದಲ್ಲಿ ಗುರು — ದೀರ್ಘಾಯುಷ್ಯ & ಜ್ಞಾನ', gu: 'કારકાંશથી 8મા ભાવમાં ગુરુ — દીર્ઘાયુ અને જ્ઞાન' },
      { en: 'Jupiter in the 8th from Karakamsha: long life, deep spiritual transformation, and wisdom through crisis. The soul learns profound lessons through loss and regeneration.', hi: 'कारकांश से 8H में बृहस्पति: दीर्घायु, गहरा आध्यात्मिक परिवर्तन, संकट से ज्ञान।', sa: 'कारकांश से 8H में बृहस्पति: दीर्घायु, गहरा आध्यात्मिक परिवर्तन, संकट से ज्ञान।', mai: 'कारकांश से 8H में बृहस्पति: दीर्घायु, गहरा आध्यात्मिक परिवर्तन, संकट से ज्ञान।', mr: 'कारकांश से 8H में बृहस्पति: दीर्घायु, गहरा आध्यात्मिक परिवर्तन, संकट से ज्ञान।', ta: 'காரகாம்சத்திலிருந்து 8-ல் குரு: நீண்ட ஆயுள், ஆழ்ந்த ஆன்மீக மாற்றம் மற்றும் நெருக்கடியின் மூலம் ஞானம். ஆத்மா இழப்பு மற்றும் புதுப்பித்தல் மூலம் ஆழமான பாடங்களைக் கற்றுக்கொள்கிறது.', te: 'కారకాంశ నుండి 8వ భావంలో గురుడు: దీర్ఘాయుష్షు, లోతైన ఆధ్యాత్మిక పరివర్తన, సంక్షోభం ద్వారా జ్ఞానం. ఆత్మ నష్టం మరియు పునరుత్పత్తి ద్వారా లోతైన పాఠాలు నేర్చుకుంటుంది.', bn: 'কারকাংশ থেকে ৮ম ভাবে বৃহস্পতি: দীর্ঘায়ু, গভীর আধ্যাত্মিক রূপান্তর এবং সংকটের মাধ্যমে জ্ঞান। আত্মা ক্ষতি ও পুনর্জন্মের মাধ্যমে গভীর পাঠ শেখে।', kn: 'ಕಾರಕಾಂಶದಿಂದ 8ನೇ ಭಾವದಲ್ಲಿ ಗುರು: ದೀರ್ಘಾಯುಷ್ಯ, ಆಳವಾದ ಆಧ್ಯಾತ್ಮಿಕ ಪರಿವರ್ತನೆ, ಬಿಕ್ಕಟ್ಟಿನ ಮೂಲಕ ಜ್ಞಾನ.', gu: 'કારકાંશથી 8મા ભાવમાં ગુરુ: દીર્ઘાયુ, ઊંડું આધ્યાત્મિક પરિવર્તન અને કટોકટી દ્વારા જ્ઞાન.' }],
    [2, marsSign, { en: 'Mars in 8H from Karakamsha — Surgery & Transformation', hi: 'कारकांश से 8H में मंगल — शल्य व परिवर्तन', sa: 'कारकांश से 8H में मंगल — शल्य व परिवर्तन', mai: 'कारकांश से 8H में मंगल — शल्य व परिवर्तन', mr: 'कारकांश से 8H में मंगल — शल्य व परिवर्तन', ta: 'காரகாம்சத்திலிருந்து 8-ல் செவ்வாய் — அறுவை சிகிச்சை & மாற்றம்', te: 'కారకాంశ నుండి 8వ భావంలో కుజుడు — శస్త్రచికిత్స & పరివర్తన', bn: 'কারকাংশ থেকে ৮ম ভাবে মঙ্গল — শল্যচিকিৎসা ও রূপান্তর', kn: 'ಕಾರಕಾಂಶದಿಂದ 8ನೇ ಭಾವದಲ್ಲಿ ಮಂಗಳ — ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ & ರೂಪಾಂತರ', gu: 'કારકાંશથી 8મા ભાવમાં મંગળ — શલ્ય ચિકિત્સા અને પરિવર્તન' },
      { en: 'Mars in the 8th from Karakamsha: the soul works with the body through surgery, wounds, or martial transformation. A powerful indicator for surgeons, military officers, or those who transmute physical crisis.', hi: 'कारकांश से 8H में मंगल: शल्य चिकित्सा, घाव या मार्शल परिवर्तन। सर्जन या सैन्य अधिकारी का संकेत।', sa: 'कारकांश से 8H में मंगल: शल्य चिकित्सा, घाव या मार्शल परिवर्तन। सर्जन या सैन्य अधिकारी का संकेत।', mai: 'कारकांश से 8H में मंगल: शल्य चिकित्सा, घाव या मार्शल परिवर्तन। सर्जन या सैन्य अधिकारी का संकेत।', mr: 'कारकांश से 8H में मंगल: शल्य चिकित्सा, घाव या मार्शल परिवर्तन। सर्जन या सैन्य अधिकारी का संकेत।', ta: 'காரகாம்சத்திலிருந்து 8-ல் செவ்வாய்: ஆத்மா அறுவை சிகிச்சை, காயங்கள் அல்லது போர் மாற்றத்தின் மூலம் உடலுடன் செயல்படுகிறது. அறுவை சிகிச்சை நிபுணர்கள், இராணுவ அதிகாரிகளுக்கு வலுவான குறிப்பான்.', te: 'కారకాంశ నుండి 8వ భావంలో కుజుడు: ఆత్మ శస్త్రచికిత్స, గాయాలు లేదా సైనిక పరివర్తన ద్వారా శరీరంతో పనిచేస్తుంది. సర్జన్లు, సైనిక అధికారులకు శక్తివంతమైన సూచిక.', bn: 'কারকাংশ থেকে ৮ম ভাবে মঙ্গল: আত্মা শল্যচিকিৎসা, ক্ষত বা সামরিক রূপান্তরের মাধ্যমে শরীরের সাথে কাজ করে। সার্জন, সামরিক অফিসারদের জন্য শক্তিশালী নির্দেশক।', kn: 'ಕಾರಕಾಂಶದಿಂದ 8ನೇ ಭಾವದಲ್ಲಿ ಮಂಗಳ: ಆತ್ಮ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಗಾಯ ಅಥವಾ ಸೈನಿಕ ರೂಪಾಂತರದ ಮೂಲಕ ದೇಹದೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ.', gu: 'કારકાંશથી 8મા ભાવમાં મંગળ: આત્મા શલ્ય ચિકિત્સા, ઘા અથવા લશ્કરી પરિવર્તન દ્વારા શરીર સાથે કાર્ય કરે છે.' }],
    [6, satSign, { en: 'Saturn in 8H from Karakamsha — Endurance & Research', hi: 'कारकांश से 8H में शनि — सहनशक्ति एवं शोध', sa: 'कारकांश से 8H में शनि — सहनशक्ति एवं शोध', mai: 'कारकांश से 8H में शनि — सहनशक्ति एवं शोध', mr: 'कारकांश से 8H में शनि — सहनशक्ति एवं शोध', ta: 'காரகாம்சத்திலிருந்து 8-ல் சனி — சகிப்புத்தன்மை & ஆராய்ச்சி', te: 'కారకాంశ నుండి 8వ భావంలో శని — సహనశక్తి & పరిశోధన', bn: 'কারকাংশ থেকে ৮ম ভাবে শনি — সহনশক্তি ও গবেষণা', kn: 'ಕಾರಕಾಂಶದಿಂದ 8ನೇ ಭಾವದಲ್ಲಿ ಶನಿ — ಸಹನಶಕ್ತಿ & ಸಂಶೋಧನೆ', gu: 'કારકાંશથી 8મા ભાવમાં શનિ — સહનશક્તિ અને સંશોધન' },
      { en: 'Saturn in the 8th from Karakamsha: this soul endures chronic hardship and emerges stronger. Proficiency in research, mining, deep investigation, and occult sciences. Long life through sheer endurance.', hi: 'कारकांश से 8H में शनि: दीर्घकालिक कष्ट सहने के बाद मजबूती। खनन, गहरी जांच, गुप्त विज्ञान में प्रवीणता।', sa: 'कारकांश से 8H में शनि: दीर्घकालिक कष्ट सहने के बाद मजबूती। खनन, गहरी जांच, गुप्त विज्ञान में प्रवीणता।', mai: 'कारकांश से 8H में शनि: दीर्घकालिक कष्ट सहने के बाद मजबूती। खनन, गहरी जांच, गुप्त विज्ञान में प्रवीणता।', mr: 'कारकांश से 8H में शनि: दीर्घकालिक कष्ट सहने के बाद मजबूती। खनन, गहरी जांच, गुप्त विज्ञान में प्रवीणता।', ta: 'காரகாம்சத்திலிருந்து 8-ல் சனி: இந்த ஆத்மா நீண்டகால கஷ்டத்தை சகித்து வலிமையாக வெளிவருகிறது. ஆராய்ச்சி, சுரங்கம், ஆழ்ந்த விசாரணை மற்றும் மறைபொருள் அறிவியலில் திறன்.', te: 'కారకాంశ నుండి 8వ భావంలో శని: ఈ ఆత్మ దీర్ఘకాలిక కష్టాలను సహించి బలంగా తేలుతుంది. పరిశోధన, మైనింగ్, లోతైన విచారణ మరియు గూఢ శాస్త్రాలలో ప్రావీణ్యం.', bn: 'কারকাংশ থেকে ৮ম ভাবে শনি: এই আত্মা দীর্ঘমেয়াদী কষ্ট সহ্য করে শক্তিশালী হয়ে ওঠে। গবেষণা, খনন, গভীর তদন্ত ও গুপ্ত বিজ্ঞানে দক্ষতা।', kn: 'ಕಾರಕಾಂಶದಿಂದ 8ನೇ ಭಾವದಲ್ಲಿ ಶನಿ: ಈ ಆತ್ಮ ದೀರ್ಘಕಾಲಿಕ ಕಷ್ಟವನ್ನು ಸಹಿಸಿ ಬಲಿಷ್ಠವಾಗಿ ಹೊರಬರುತ್ತದೆ. ಸಂಶೋಧನೆ, ಗಣಿಗಾರಿಕೆ, ಆಳ ತನಿಖೆಯಲ್ಲಿ ಪ್ರಾವೀಣ್ಯ.', gu: 'કારકાંશથી 8મા ભાવમાં શનિ: આ આત્મા લાંબા ગાળાના કષ્ટ સહન કરીને મજબૂત બને છે. સંશોધન, ખનન, ઊંડી તપાસ અને ગૂઢ વિજ્ઞાનમાં કુશળતા.' }],
    [1, moonSign, { en: 'Moon in 8H from Karakamsha — Psychic Depth', hi: 'कारकांश से 8H में चंद्र — मानसिक गहराई', sa: 'कारकांश से 8H में चंद्र — मानसिक गहराई', mai: 'कारकांश से 8H में चंद्र — मानसिक गहराई', mr: 'कारकांश से 8H में चंद्र — मानसिक गहराई', ta: 'காரகாம்சத்திலிருந்து 8-ல் சந்திரன் — மன ஆழம்', te: 'కారకాంశ నుండి 8వ భావంలో చంద్రుడు — మానసిక లోతు', bn: 'কারকাংশ থেকে ৮ম ভাবে চন্দ্র — মানসিক গভীরতা', kn: 'ಕಾರಕಾಂಶದಿಂದ 8ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ — ಮಾನಸಿಕ ಆಳ', gu: 'કારકાંશથી 8મા ભાવમાં ચંદ્ર — માનસિક ગહનતા' },
      { en: 'Moon in the 8th from Karakamsha: heightened psychic sensitivity, hidden knowledge, and emotional depth that borders on mysticism. This soul works with the unseen and the hidden.', hi: 'कारकांश से 8H में चंद्र: तीव्र मानसिक संवेदनशीलता, छुपा ज्ञान, गूढ़ता की सीमा पर भावनात्मक गहराई।', sa: 'कारकांश से 8H में चंद्र: तीव्र मानसिक संवेदनशीलता, छुपा ज्ञान, गूढ़ता की सीमा पर भावनात्मक गहराई।', mai: 'कारकांश से 8H में चंद्र: तीव्र मानसिक संवेदनशीलता, छुपा ज्ञान, गूढ़ता की सीमा पर भावनात्मक गहराई।', mr: 'कारकांश से 8H में चंद्र: तीव्र मानसिक संवेदनशीलता, छुपा ज्ञान, गूढ़ता की सीमा पर भावनात्मक गहराई।', ta: 'காரகாம்சத்திலிருந்து 8-ல் சந்திரன்: உயர்ந்த மன உணர்திறன், மறைக்கப்பட்ட ஞானம் மற்றும் ஞானத்தின் எல்லையில் உணர்ச்சி ஆழம். இந்த ஆத்மா கண்ணுக்குத் தெரியாத மற்றும் மறைக்கப்பட்ட விஷயங்களுடன் செயல்படுகிறது.', te: 'కారకాంశ నుండి 8వ భావంలో చంద్రుడు: అధిక మానసిక సున్నితత్వం, దాచిన జ్ఞానం, మర్మమయ సరిహద్దులో భావోద్వేగ లోతు. ఈ ఆత్మ కనిపించని మరియు దాగిన విషయాలతో పనిచేస్తుంది.', bn: 'কারকাংশ থেকে ৮ম ভাবে চন্দ্র: উচ্চমাত্রার মানসিক সংবেদনশীলতা, গুপ্ত জ্ঞান এবং রহস্যবাদের সীমায় আবেগের গভীরতা। এই আত্মা অদৃশ্য ও লুকানো বিষয়ের সাথে কাজ করে।', kn: 'ಕಾರಕಾಂಶದಿಂದ 8ನೇ ಭಾವದಲ್ಲಿ ಚಂದ್ರ: ಹೆಚ್ಚಿದ ಮಾನಸಿಕ ಸಂವೇದನೆ, ಅಡಗಿರುವ ಜ್ಞಾನ, ರಹಸ್ಯವಾದದ ಗಡಿಯಲ್ಲಿ ಭಾವನಾತ್ಮಕ ಆಳ.', gu: 'કારકાંશથી 8મા ભાવમાં ચંદ્ર: ઉચ્ચ માનસિક સંવેદનશીલતા, છુપાયેલું જ્ઞાન, રહસ્યવાદની સીમા પર ભાવનાત્મક ઊંડાણ.' }],
  ];

  for (const [pid, psign, name, description] of EIGHTH_KM) {
    if (!psign) continue;
    const pos = fromKarakamsha(km, psign);
    if (pos === 8) {
      yogas.push({ name, present: true, strength: 'moderate', description });
    }
    void pid;
  }

  // ─── 10H from Karakamsha — Karma & Profession ────────────────────────────────
  const TENTH_KM: Array<[number, number | null, LocaleText, LocaleText]> = [
    [0, sunSign, { en: 'Sun in 10H from Karakamsha — Political Authority', hi: 'कारकांश से 10H में सूर्य — राजनीतिक अधिकार', sa: 'कारकांश से 10H में सूर्य — राजनीतिक अधिकार', mai: 'कारकांश से 10H में सूर्य — राजनीतिक अधिकार', mr: 'कारकांश से 10H में सूर्य — राजनीतिक अधिकार', ta: 'காரகாம்சத்திலிருந்து 10-ல் சூரியன் — அரசியல் அதிகாரம்', te: 'కారకాంశ నుండి 10వ భావంలో సూర్యుడు — రాజకీయ అధికారం', bn: 'কারকাংশ থেকে ১০ম ভাবে সূর্য — রাজনৈতিক কর্তৃত্ব', kn: 'ಕಾರಕಾಂಶದಿಂದ 10ನೇ ಭಾವದಲ್ಲಿ ಸೂರ್ಯ — ರಾಜಕೀಯ ಅಧಿಕಾರ', gu: 'કારકાંશથી 10મા ભાવમાં સૂર્ય — રાજકીય સત્તા' },
      { en: 'Sun in the 10th from Karakamsha: the soul is destined for political or governmental authority. High public office, administration, or leadership is the karma-purpose of this lifetime.', hi: 'कारकांश से 10H में सूर्य: आत्मा राजनीतिक या सरकारी अधिकार के लिए नियत है।', sa: 'कारकांश से 10H में सूर्य: आत्मा राजनीतिक या सरकारी अधिकार के लिए नियत है।', mai: 'कारकांश से 10H में सूर्य: आत्मा राजनीतिक या सरकारी अधिकार के लिए नियत है।', mr: 'कारकांश से 10H में सूर्य: आत्मा राजनीतिक या सरकारी अधिकार के लिए नियत है।', ta: 'காரகாம்சத்திலிருந்து 10-ல் சூரியன்: ஆத்மா அரசியல் அல்லது அரசு அதிகாரத்திற்கு விதிக்கப்பட்டது. உயர் பொதுப் பதவி, நிர்வாகம் அல்லது தலைமை இந்த வாழ்க்கையின் கர்ம நோக்கம்.', te: 'కారకాంశ నుండి 10వ భావంలో సూర్యుడు: ఆత్మ రాజకీయ లేదా ప్రభుత్వ అధికారం కోసం నిర్దేశించబడింది. ఉన్నత ప్రజా పదవి, పరిపాలన లేదా నాయకత్వం ఈ జన్మ కర్మ ఉద్దేశ్యం.', bn: 'কারকাংশ থেকে ১০ম ভাবে সূর্য: আত্মা রাজনৈতিক বা সরকারি কর্তৃত্বের জন্য নির্ধারিত। উচ্চ জনপদ, প্রশাসন বা নেতৃত্ব এই জীবনের কর্ম-উদ্দেশ্য।', kn: 'ಕಾರಕಾಂಶದಿಂದ 10ನೇ ಭಾವದಲ್ಲಿ ಸೂರ್ಯ: ಆತ್ಮ ರಾಜಕೀಯ ಅಥವಾ ಸರ್ಕಾರಿ ಅಧಿಕಾರಕ್ಕೆ ನಿಯೋಜಿತವಾಗಿದೆ.', gu: 'કારકાંશથી 10મા ભાવમાં સૂર્ય: આત્મા રાજકીય અથવા સરકારી સત્તા માટે નિર્ધારિત છે.' }],
    [4, jupSign, { en: 'Jupiter in 10H from Karakamsha — Teacher & Advisor', hi: 'कारकांश से 10H में बृहस्पति — गुरु एवं सलाहकार', sa: 'कारकांश से 10H में बृहस्पति — गुरु एवं सलाहकार', mai: 'कारकांश से 10H में बृहस्पति — गुरु एवं सलाहकार', mr: 'कारकांश से 10H में बृहस्पति — गुरु एवं सलाहकार', ta: 'காரகாம்சத்திலிருந்து 10-ல் குரு — ஆசிரியர் & ஆலோசகர்', te: 'కారకాంశ నుండి 10వ భావంలో గురుడు — గురువు & సలహాదారుడు', bn: 'কারকাংশ থেকে ১০ম ভাবে বৃহস্পতি — শিক্ষক ও উপদেষ্টা', kn: 'ಕಾರಕಾಂಶದಿಂದ 10ನೇ ಭಾವದಲ್ಲಿ ಗುರು — ಶಿಕ್ಷಕ & ಸಲಹೆಗಾರ', gu: 'કારકાંશથી 10મા ભાવમાં ગુરુ — શિક્ષક અને સલાહકાર' },
      { en: 'Jupiter in the 10th from Karakamsha: the professional karma is that of teacher, priest, philosopher, or advisor. This soul fulfills its purpose by guiding others toward wisdom.', hi: 'कारकांश से 10H में बृहस्पति: गुरु, पुजारी, दार्शनिक या सलाहकार का कर्म।', sa: 'कारकांश से 10H में बृहस्पति: गुरु, पुजारी, दार्शनिक या सलाहकार का कर्म।', mai: 'कारकांश से 10H में बृहस्पति: गुरु, पुजारी, दार्शनिक या सलाहकार का कर्म।', mr: 'कारकांश से 10H में बृहस्पति: गुरु, पुजारी, दार्शनिक या सलाहकार का कर्म।', ta: 'காரகாம்சத்திலிருந்து 10-ல் குரு: தொழில் கர்மா ஆசிரியர், பூசாரி, தத்துவஞானி அல்லது ஆலோசகர். இந்த ஆத்மா மற்றவர்களை ஞானத்தை நோக்கி வழிநடத்துவதன் மூலம் தனது நோக்கத்தை நிறைவேற்றுகிறது.', te: 'కారకాంశ నుండి 10వ భావంలో గురుడు: వృత్తి కర్మ గురువు, పూజారి, తత్వవేత్త లేదా సలహాదారుడు. ఈ ఆత్మ ఇతరులను జ్ఞానం వైపు నడిపించడం ద్వారా తన ఉద్దేశ్యాన్ని నెరవేరుస్తుంది.', bn: 'কারকাংশ থেকে ১০ম ভাবে বৃহস্পতি: পেশাগত কর্ম শিক্ষক, পুরোহিত, দার্শনিক বা উপদেষ্টার। এই আত্মা অন্যদের জ্ঞানের দিকে পরিচালিত করে তার উদ্দেশ্য পূর্ণ করে।', kn: 'ಕಾರಕಾಂಶದಿಂದ 10ನೇ ಭಾವದಲ್ಲಿ ಗುರು: ವೃತ್ತಿ ಕರ್ಮ ಶಿಕ್ಷಕ, ಪುರೋಹಿತ, ತತ್ವಜ್ಞಾನಿ ಅಥವಾ ಸಲಹೆಗಾರ.', gu: 'કારકાંશથી 10મા ભાવમાં ગુરુ: વ્યાવસાયિક કર્મ શિક્ષક, પૂજારી, દાર્શનિક અથવા સલાહકારનું છે.' }],
    [6, satSign, { en: 'Saturn in 10H from Karakamsha — Builder Through Discipline', hi: 'कारकांश से 10H में शनि — अनुशासन से निर्माता', sa: 'कारकांश से 10H में शनि — अनुशासन से निर्माता', mai: 'कारकांश से 10H में शनि — अनुशासन से निर्माता', mr: 'कारकांश से 10H में शनि — अनुशासन से निर्माता', ta: 'காரகாம்சத்திலிருந்து 10-ல் சனி — ஒழுக்கத்தின் மூலம் கட்டுமானகர்', te: 'కారకాంశ నుండి 10వ భావంలో శని — క్రమశిక్షణ ద్వారా నిర్మాత', bn: 'কারকাংশ থেকে ১০ম ভাবে শনি — শৃঙ্খলার মাধ্যমে নির্মাতা', kn: 'ಕಾರಕಾಂಶದಿಂದ 10ನೇ ಭಾವದಲ್ಲಿ ಶನಿ — ಶಿಸ್ತಿನ ಮೂಲಕ ನಿರ್ಮಾತ', gu: 'કારકાંશથી 10મા ભાવમાં શનિ — અનુશાસનથી નિર્માતા' },
      { en: 'Saturn in the 10th from Karakamsha: the soul rises through persistent, disciplined work. Late career success, heavy karmic responsibilities, but ultimately a lasting legacy through sheer endurance.', hi: 'कारकांश से 10H में शनि: निरंतर, अनुशासित कार्य से उत्थान। देर से करियर सफलता, स्थायी विरासत।', sa: 'कारकांश से 10H में शनि: निरंतर, अनुशासित कार्य से उत्थान। देर से करियर सफलता, स्थायी विरासत।', mai: 'कारकांश से 10H में शनि: निरंतर, अनुशासित कार्य से उत्थान। देर से करियर सफलता, स्थायी विरासत।', mr: 'कारकांश से 10H में शनि: निरंतर, अनुशासित कार्य से उत्थान। देर से करियर सफलता, स्थायी विरासत।', ta: 'காரகாம்சத்திலிருந்து 10-ல் சனி: ஆத்மா நிலையான, ஒழுக்கமான உழைப்பின் மூலம் உயர்கிறது. தாமதமான தொழில் வெற்றி, கனமான கர்ம பொறுப்புகள், ஆனால் இறுதியில் சகிப்புத்தன்மையின் மூலம் நிலையான மரபு.', te: 'కారకాంశ నుండి 10వ భావంలో శని: ఆత్మ నిరంతర, క్రమశిక్షణతో కూడిన పని ద్వారా ఎదుగుతుంది. ఆలస్యంగా వృత్తి విజయం, భారీ కర్మ బాధ్యతలు, కానీ చివరికి సహనశక్తి ద్వారా శాశ్వత వారసత్వం.', bn: 'কারকাংশ থেকে ১০ম ভাবে শনি: আত্মা অবিচল, শৃঙ্খলাবদ্ধ কাজের মাধ্যমে উত্থান করে। দেরিতে কর্মজীবনে সাফল্য, ভারী কার্মিক দায়িত্ব, কিন্তু শেষ পর্যন্ত সহনশীলতার মাধ্যমে স্থায়ী উত্তরাধিকার।', kn: 'ಕಾರಕಾಂಶದಿಂದ 10ನೇ ಭಾವದಲ್ಲಿ ಶನಿ: ಆತ್ಮ ನಿರಂತರ, ಶಿಸ್ತಿನ ಕೆಲಸದ ಮೂಲಕ ಏಳುತ್ತದೆ.', gu: 'કારકાંશથી 10મા ભાવમાં શનિ: આત્મા સતત, અનુશાસિત કાર્ય દ્વારા ઉન્નત થાય છે.' }],
    [2, marsSign, { en: 'Mars in 10H from Karakamsha — Military & Technical Karma', hi: 'कारकांश से 10H में मंगल — सैन्य एवं तकनीकी कर्म', sa: 'कारकांश से 10H में मंगल — सैन्य एवं तकनीकी कर्म', mai: 'कारकांश से 10H में मंगल — सैन्य एवं तकनीकी कर्म', mr: 'कारकांश से 10H में मंगल — सैन्य एवं तकनीकी कर्म', ta: 'காரகாம்சத்திலிருந்து 10-ல் செவ்வாய் — இராணுவ & தொழில்நுட்ப கர்மா', te: 'కారకాంశ నుండి 10వ భావంలో కుజుడు — సైనిక & సాంకేతిక కర్మ', bn: 'কারকাংশ থেকে ১০ম ভাবে মঙ্গল — সামরিক ও প্রযুক্তিগত কর্ম', kn: 'ಕಾರಕಾಂಶದಿಂದ 10ನೇ ಭಾವದಲ್ಲಿ ಮಂಗಳ — ಸೈನಿಕ & ತಾಂತ್ರಿಕ ಕರ್ಮ', gu: 'કારકાંશથી 10મા ભાવમાં મંગળ — સૈન્ય અને ટેકનિકલ કર્મ' },
      { en: 'Mars in the 10th from Karakamsha: the soul fulfills its dharma through the military, police, engineering, or competitive sports. Action and precision are the professional hallmarks.', hi: 'कारकांश से 10H में मंगल: सेना, पुलिस, इंजीनियरिंग या प्रतिस्पर्धी खेल में कर्म पूर्ति।', sa: 'कारकांश से 10H में मंगल: सेना, पुलिस, इंजीनियरिंग या प्रतिस्पर्धी खेल में कर्म पूर्ति।', mai: 'कारकांश से 10H में मंगल: सेना, पुलिस, इंजीनियरिंग या प्रतिस्पर्धी खेल में कर्म पूर्ति।', mr: 'कारकांश से 10H में मंगल: सेना, पुलिस, इंजीनियरिंग या प्रतिस्पर्धी खेल में कर्म पूर्ति।', ta: 'காரகாம்சத்திலிருந்து 10-ல் செவ்வாய்: ஆத்மா இராணுவம், காவல், பொறியியல் அல்லது போட்டி விளையாட்டுகளின் மூலம் தனது தர்மத்தை நிறைவேற்றுகிறது. செயல் மற்றும் துல்லியம் தொழில்முறை அடையாளங்கள்.', te: 'కారకాంశ నుండి 10వ భావంలో కుజుడు: ఆత్మ సైన్యం, పోలీసు, ఇంజనీరింగ్ లేదా పోటీ క్రీడల ద్వారా తన ధర్మాన్ని నెరవేరుస్తుంది.', bn: 'কারকাংশ থেকে ১০ম ভাবে মঙ্গল: আত্মা সেনা, পুলিশ, প্রকৌশল বা প্রতিযোগিতামূলক খেলার মাধ্যমে তার ধর্ম পূর্ণ করে।', kn: 'ಕಾರಕಾಂಶದಿಂದ 10ನೇ ಭಾವದಲ್ಲಿ ಮಂಗಳ: ಆತ್ಮ ಸೇನೆ, ಪೊಲೀಸ್, ಎಂಜಿನಿಯರಿಂಗ್ ಅಥವಾ ಸ್ಪರ್ಧಾತ್ಮಕ ಕ್ರೀಡೆಗಳ ಮೂಲಕ ತನ್ನ ಧರ್ಮವನ್ನು ಪೂರೈಸುತ್ತದೆ.', gu: 'કારકાંશથી 10મા ભાવમાં મંગળ: આત્મા સેના, પોલીસ, એન્જિનિયરિંગ અથવા સ્પર્ધાત્મક રમતગમત દ્વારા તેનો ધર્મ પૂર્ણ કરે છે.' }],
    [3, mercSign, { en: 'Mercury in 10H from Karakamsha — Commerce & Writing Karma', hi: 'कारकांश से 10H में बुध — वाणिज्य एवं लेखन कर्म', sa: 'कारकांश से 10H में बुध — वाणिज्य एवं लेखन कर्म', mai: 'कारकांश से 10H में बुध — वाणिज्य एवं लेखन कर्म', mr: 'कारकांश से 10H में बुध — वाणिज्य एवं लेखन कर्म', ta: 'காரகாம்சத்திலிருந்து 10-ல் புதன் — வணிகம் & எழுத்து கர்மா', te: 'కారకాంశ నుండి 10వ భావంలో బుధుడు — వాణిజ్యం & రచన కర్మ', bn: 'কারকাংশ থেকে ১০ম ভাবে বুধ — বাণিজ্য ও লেখন কর্ম', kn: 'ಕಾರಕಾಂಶದಿಂದ 10ನೇ ಭಾವದಲ್ಲಿ ಬುಧ — ವಾಣಿಜ್ಯ & ಬರವಣಿಗೆ ಕರ್ಮ', gu: 'કારકાંશથી 10મા ભાવમાં બુધ — વાણિજ્ય અને લેખન કર્મ' },
      { en: 'Mercury in the 10th from Karakamsha: the soul fulfills its karma through business, writing, communication, or financial services. Versatile professional who succeeds through intelligence and adaptability.', hi: 'कारकांश से 10H में बुध: व्यापार, लेखन, संचार या वित्तीय सेवाओं से कर्म पूर्ति।', sa: 'कारकांश से 10H में बुध: व्यापार, लेखन, संचार या वित्तीय सेवाओं से कर्म पूर्ति।', mai: 'कारकांश से 10H में बुध: व्यापार, लेखन, संचार या वित्तीय सेवाओं से कर्म पूर्ति।', mr: 'कारकांश से 10H में बुध: व्यापार, लेखन, संचार या वित्तीय सेवाओं से कर्म पूर्ति।', ta: 'காரகாம்சத்திலிருந்து 10-ல் புதன்: ஆத்மா வணிகம், எழுத்து, தகவல் தொடர்பு அல்லது நிதி சேவைகளின் மூலம் தனது கர்மாவை நிறைவேற்றுகிறது. புத்திசாலித்தனம் மற்றும் தகவமைப்பு மூலம் வெற்றிபெறும் பல்திறன் தொழிலாளர்.', te: 'కారకాంశ నుండి 10వ భావంలో బుధుడు: ఆత్మ వ్యాపారం, రచన, సమాచారం లేదా ఆర్థిక సేవల ద్వారా తన కర్మను నెరవేరుస్తుంది.', bn: 'কারকাংশ থেকে ১০ম ভাবে বুধ: আত্মা ব্যবসা, লেখা, যোগাযোগ বা আর্থিক সেবার মাধ্যমে তার কর্ম পূর্ণ করে।', kn: 'ಕಾರಕಾಂಶದಿಂದ 10ನೇ ಭಾವದಲ್ಲಿ ಬುಧ: ಆತ್ಮ ವ್ಯಾಪಾರ, ಬರವಣಿಗೆ, ಸಂವಹನ ಅಥವಾ ಹಣಕಾಸು ಸೇವೆಗಳ ಮೂಲಕ ತನ್ನ ಕರ್ಮವನ್ನು ಪೂರೈಸುತ್ತದೆ.', gu: 'કારકાંશથી 10મા ભાવમાં બુધ: આત્મા વ્યાપાર, લેખન, સંવાદ અથવા નાણાકીય સેવાઓ દ્વારા તેનું કર્મ પૂર્ણ કરે છે.' }],
  ];

  for (const [pid, psign, name, description] of TENTH_KM) {
    if (!psign) continue;
    const pos = fromKarakamsha(km, psign);
    if (pos === 10) {
      yogas.push({ name, present: true, strength: 'moderate', description });
    }
    void pid;
  }

  // ─── Multi-planet combos in Karakamsha trikona ──────────────────────────────
  const MULTI_COMBOS: Array<[number, number, number | null, number | null, LocaleText, LocaleText]> = [
    [4, 5, jupSign, venusSign, { en: 'Jupiter + Venus in Karakamsha Trikona — Srinatha Yoga', hi: 'कारकांश त्रिकोण में बृहस्पति + शुक्र — श्रीनाथ योग', sa: 'कारकांश त्रिकोण में बृहस्पति + शुक्र — श्रीनाथ योग', mai: 'कारकांश त्रिकोण में बृहस्पति + शुक्र — श्रीनाथ योग', mr: 'कारकांश त्रिकोण में बृहस्पति + शुक्र — श्रीनाथ योग', ta: 'காரகாம்ச திரிகோணத்தில் குரு + சுக்கிரன் — ஸ்ரீநாத யோகம்', te: 'కారకాంశ త్రికోణంలో గురుడు + శుక్రుడు — శ్రీనాథ యోగం', bn: 'কারকাংশ ত্রিকোণে বৃহস্পতি + শুক্র — শ্রীনাথ যোগ', kn: 'ಕಾರಕಾಂಶ ತ್ರಿಕೋಣದಲ್ಲಿ ಗುರು + ಶುಕ್ರ — ಶ್ರೀನಾಥ ಯೋಗ', gu: 'કારકાંશ ત્રિકોણમાં ગુરુ + શુક્ર — શ્રીનાથ યોગ' },
      { en: 'Jupiter and Venus together in a trikona from Karakamsha — Srinatha Yoga. This rare combination blesses the soul with great wealth, luxury, wisdom, and dharmic prosperity. A life of material and spiritual abundance simultaneously.', hi: 'कारकांश त्रिकोण में बृहस्पति और शुक्र — श्रीनाथ योग। दुर्लभ संयोग — धन, विलासिता, ज्ञान और धार्मिक समृद्धि।', sa: 'कारकांश त्रिकोण में बृहस्पति और शुक्र — श्रीनाथ योग। दुर्लभ संयोग — धन, विलासिता, ज्ञान और धार्मिक समृद्धि।', mai: 'कारकांश त्रिकोण में बृहस्पति और शुक्र — श्रीनाथ योग। दुर्लभ संयोग — धन, विलासिता, ज्ञान और धार्मिक समृद्धि।', mr: 'कारकांश त्रिकोण में बृहस्पति और शुक्र — श्रीनाथ योग। दुर्लभ संयोग — धन, विलासिता, ज्ञान और धार्मिक समृद्धि।', ta: 'காரகாம்ச திரிகோணத்தில் குரு மற்றும் சுக்கிரன் சேர்ந்து — ஸ்ரீநாத யோகம். இந்த அரிய கூட்டணி ஆத்மாவுக்கு பெரும் செல்வம், ஆடம்பரம், ஞானம் மற்றும் தர்ம செழிப்பை அருளுகிறது.', te: 'కారకాంశ త్రికోణంలో గురుడు మరియు శుక్రుడు కలిసి — శ్రీనాథ యోగం. ఈ అరుదైన కలయిక ఆత్మకు గొప్ప సంపద, విలాసం, జ్ఞానం మరియు ధార్మిక సమృద్ధిని అనుగ్రహిస్తుంది.', bn: 'কারকাংশ ত্রিকোণে বৃহস্পতি ও শুক্র একত্রে — শ্রীনাথ যোগ। এই বিরল সমন্বয় আত্মাকে মহান ধন, বিলাস, জ্ঞান ও ধর্মীয় সমৃদ্ধি দিয়ে আশীর্বাদ করে।', kn: 'ಕಾರಕಾಂಶ ತ್ರಿಕೋಣದಲ್ಲಿ ಗುರು ಮತ್ತು ಶುಕ್ರ ಒಟ್ಟಿಗೆ — ಶ್ರೀನಾಥ ಯೋಗ. ಈ ಅಪರೂಪದ ಸಂಯೋಜನೆ ಆತ್ಮಕ್ಕೆ ಮಹಾ ಸಂಪತ್ತು, ವಿಲಾಸ, ಜ್ಞಾನ ಮತ್ತು ಧಾರ್ಮಿಕ ಸಮೃದ್ಧಿಯನ್ನು ಅನುಗ್ರಹಿಸುತ್ತದೆ.', gu: 'કારકાંશ ત્રિકોણમાં ગુરુ અને શુક્ર સાથે — શ્રીનાથ યોગ. આ દુર્લભ સંયોજન આત્માને મહાન ધન, વૈભવ, જ્ઞાન અને ધાર્મિક સમૃદ્ધિ આપે છે.' }],
    [0, 4, sunSign, jupSign, { en: 'Sun + Jupiter in Karakamsha — Solar Dharma Yoga', hi: 'कारकांश में सूर्य + बृहस्पति — सौर धर्म योग', sa: 'कारकांश में सूर्य + बृहस्पति — सौर धर्म योग', mai: 'कारकांश में सूर्य + बृहस्पति — सौर धर्म योग', mr: 'कारकांश में सूर्य + बृहस्पति — सौर धर्म योग', ta: 'காரகாம்சத்தில் சூரியன் + குரு — சூரிய தர்ம யோகம்', te: 'కారకాంశలో సూర్యుడు + గురుడు — సౌర ధర్మ యోగం', bn: 'কারকাংশে সূর্য + বৃহস্পতি — সৌর ধর্ম যোগ', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ಸೂರ್ಯ + ಗುರು — ಸೌರ ಧರ್ಮ ಯೋಗ', gu: 'કારકાંશમાં સૂર્ય + ગુરુ — સૌર ધર્મ યોગ' },
      { en: 'Sun and Jupiter together in Karakamsha or its trikona: the soul is destined for dharmic leadership — a king, high priest, or great teacher who leads by example and wisdom.', hi: 'कारकांश में सूर्य और बृहस्पति: धार्मिक नेतृत्व के लिए नियत आत्मा — राजा, महायाजक या महान शिक्षक।', sa: 'कारकांश में सूर्य और बृहस्पति: धार्मिक नेतृत्व के लिए नियत आत्मा — राजा, महायाजक या महान शिक्षक।', mai: 'कारकांश में सूर्य और बृहस्पति: धार्मिक नेतृत्व के लिए नियत आत्मा — राजा, महायाजक या महान शिक्षक।', mr: 'कारकांश में सूर्य और बृहस्पति: धार्मिक नेतृत्व के लिए नियत आत्मा — राजा, महायाजक या महान शिक्षक।', ta: 'காரகாம்சத்தில் அல்லது அதன் திரிகோணத்தில் சூரியன் மற்றும் குரு சேர்ந்து: ஆத்மா தர்ம தலைமைக்கு விதிக்கப்பட்டது — உதாரணமும் ஞானமும் மூலம் வழிநடத்தும் மன்னர், உயர் பூசாரி அல்லது மகா ஆசிரியர்.', te: 'కారకాంశలో లేదా దాని త్రికోణంలో సూర్యుడు మరియు గురుడు కలిసి: ఆత్మ ధార్మిక నాయకత్వం కోసం నిర్దేశించబడింది — ఉదాహరణ మరియు జ్ఞానం ద్వారా నడిపించే రాజు, ఉన్నత పూజారి లేదా గొప్ప గురువు.', bn: 'কারকাংশে বা তার ত্রিকোণে সূর্য ও বৃহস্পতি একত্রে: আত্মা ধর্মীয় নেতৃত্বের জন্য নির্ধারিত — উদাহরণ ও জ্ঞান দিয়ে পরিচালনা করা রাজা, মহাযাজক বা মহান শিক্ষক।', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ಅಥವಾ ಅದರ ತ್ರಿಕೋಣದಲ್ಲಿ ಸೂರ್ಯ ಮತ್ತು ಗುರು ಒಟ್ಟಿಗೆ: ಆತ್ಮ ಧಾರ್ಮಿಕ ನಾಯಕತ್ವಕ್ಕೆ ನಿಯೋಜಿತ.', gu: 'કારકાંશમાં અથવા તેના ત્રિકોણમાં સૂર્ય અને ગુરુ સાથે: આત્મા ધાર્મિક નેતૃત્વ માટે નિર્ધારિત છે.' }],
    [0, 2, sunSign, marsSign, { en: 'Sun + Mars in Karakamsha — Warrior King Yoga', hi: 'कारकांश में सूर्य + मंगल — योद्धा-राजा योग', sa: 'कारकांश में सूर्य + मंगल — योद्धा-राजा योग', mai: 'कारकांश में सूर्य + मंगल — योद्धा-राजा योग', mr: 'कारकांश में सूर्य + मंगल — योद्धा-राजा योग', ta: 'காரகாம்சத்தில் சூரியன் + செவ்வாய் — யுத்த மன்னர் யோகம்', te: 'కారకాంశలో సూర్యుడు + కుజుడు — యోధ రాజు యోగం', bn: 'কারকাংশে সূর্য + মঙ্গল — যোদ্ধা রাজা যোগ', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ಸೂರ್ಯ + ಮಂಗಳ — ಯೋಧ ರಾಜ ಯೋಗ', gu: 'કારકાંશમાં સૂર્ય + મંગળ — યોદ્ધા રાજા યોગ' },
      { en: 'Sun and Mars together in or near Karakamsha: the soul of a commander — military leader, executive authority, or surgeon who wields both power and precision. Aggressive self-assertion in service of dharma.', hi: 'कारकांश में सूर्य और मंगल: सेनापति की आत्मा — सैन्य नेता, कार्यकारी या सर्जन।', sa: 'कारकांश में सूर्य और मंगल: सेनापति की आत्मा — सैन्य नेता, कार्यकारी या सर्जन।', mai: 'कारकांश में सूर्य और मंगल: सेनापति की आत्मा — सैन्य नेता, कार्यकारी या सर्जन।', mr: 'कारकांश में सूर्य और मंगल: सेनापति की आत्मा — सैन्य नेता, कार्यकारी या सर्जन।', ta: 'காரகாம்சத்தில் அல்லது அருகில் சூரியன் மற்றும் செவ்வாய் சேர்ந்து: தளபதியின் ஆத்மா — இராணுவ தலைவர், நிர்வாக அதிகாரி அல்லது சக்தியும் துல்லியமும் கொண்ட அறுவை சிகிச்சை நிபுணர்.', te: 'కారకాంశలో లేదా దగ్గరలో సూర్యుడు మరియు కుజుడు కలిసి: సేనాపతి ఆత్మ — సైనిక నాయకుడు, కార్యనిర్వాహక అధికారం, లేదా శక్తి మరియు ఖచ్చితత్వం రెండింటినీ ప్రయోగించే సర్జన్.', bn: 'কারকাংশে বা কাছে সূর্য ও মঙ্গল একত্রে: সেনাপতির আত্মা — সামরিক নেতা, নির্বাহী কর্তৃপক্ষ, বা শক্তি ও নির্ভুলতা উভয় ধারণকারী সার্জন।', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ಅಥವಾ ಸಮೀಪದಲ್ಲಿ ಸೂರ್ಯ ಮತ್ತು ಮಂಗಳ ಒಟ್ಟಿಗೆ: ಸೇನಾಪತಿಯ ಆತ್ಮ — ಸೈನಿಕ ನಾಯಕ, ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರ.', gu: 'કારકાંશમાં અથવા નજીક સૂર્ય અને મંગળ સાથે: સેનાપતિની આત્મા — લશ્કરી નેતા, કાર્યકારી સત્તા.' }],
    [6, 2, satSign, marsSign, { en: 'Saturn + Mars in Karakamsha — Engineer & Builder Yoga', hi: 'कारकांश में शनि + मंगल — इंजीनियर योग', sa: 'कारकांश में शनि + मंगल — इंजीनियर योग', mai: 'कारकांश में शनि + मंगल — इंजीनियर योग', mr: 'कारकांश में शनि + मंगल — इंजीनियर योग', ta: 'காரகாம்சத்தில் சனி + செவ்வாய் — பொறியாளர் & கட்டுமான யோகம்', te: 'కారకాంశలో శని + కుజుడు — ఇంజనీర్ & నిర్మాత యోగం', bn: 'কারকাংশে শনি + মঙ্গল — প্রকৌশলী ও নির্মাতা যোগ', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ಶನಿ + ಮಂಗಳ — ಎಂಜಿನಿಯರ್ & ನಿರ್ಮಾತ ಯೋಗ', gu: 'કારકાંશમાં શનિ + મંગળ — એન્જિનિયર અને નિર્માતા યોગ' },
      { en: 'Saturn and Mars together in Karakamsha: systematic application of force — civil engineering, architecture, heavy construction, or mechanical mastery. The combination of patience (Saturn) and drive (Mars) creates lasting structures.', hi: 'कारकांश में शनि और मंगल: बल का व्यवस्थित प्रयोग — सिविल इंजीनियरिंग, वास्तुकला, यांत्रिक महारत।', sa: 'कारकांश में शनि और मंगल: बल का व्यवस्थित प्रयोग — सिविल इंजीनियरिंग, वास्तुकला, यांत्रिक महारत।', mai: 'कारकांश में शनि और मंगल: बल का व्यवस्थित प्रयोग — सिविल इंजीनियरिंग, वास्तुकला, यांत्रिक महारत।', mr: 'कारकांश में शनि और मंगल: बल का व्यवस्थित प्रयोग — सिविल इंजीनियरिंग, वास्तुकला, यांत्रिक महारत।', ta: 'காரகாம்சத்தில் சனி மற்றும் செவ்வாய் சேர்ந்து: சக்தியின் முறையான பயன்பாடு — சிவில் பொறியியல், கட்டிடக்கலை, கனரக கட்டுமானம் அல்லது இயந்திர திறன். பொறுமையும் (சனி) உந்துதலும் (செவ்வாய்) நிலையான கட்டமைப்புகளை உருவாக்குகின்றன.', te: 'కారకాంశలో శని మరియు కుజుడు కలిసి: బలం యొక్క క్రమబద్ధ అనువర్తనం — సివిల్ ఇంజనీరింగ్, వాస్తుశిల్పం, భారీ నిర్మాణం లేదా యాంత్రిక నైపుణ్యం.', bn: 'কারকাংশে শনি ও মঙ্গল একত্রে: বলের সুশৃঙ্খল প্রয়োগ — সিভিল ইঞ্জিনিয়ারিং, স্থাপত্য, ভারী নির্মাণ বা যান্ত্রিক দক্ষতা।', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ಶನಿ ಮತ್ತು ಮಂಗಳ ಒಟ್ಟಿಗೆ: ಬಲದ ವ್ಯವಸ್ಥಿತ ಅನ್ವಯ — ಸಿವಿಲ್ ಎಂಜಿನಿಯರಿಂಗ್, ವಾಸ್ತುಶಿಲ್ಪ, ಭಾರಿ ನಿರ್ಮಾಣ.', gu: 'કારકાંશમાં શનિ અને મંગળ સાથે: બળનો વ્યવસ્થિત ઉપયોગ — સિવિલ એન્જિનિયરિંગ, સ્થાપત્ય, ભારે બાંધકામ.' }],
    [3, 5, mercSign, venusSign, { en: 'Mercury + Venus in Karakamsha — Arts & Commerce Genius', hi: 'कारकांश में बुध + शुक्र — कला एवं वाणिज्य प्रतिभा', sa: 'कारकांश में बुध + शुक्र — कला एवं वाणिज्य प्रतिभा', mai: 'कारकांश में बुध + शुक्र — कला एवं वाणिज्य प्रतिभा', mr: 'कारकांश में बुध + शुक्र — कला एवं वाणिज्य प्रतिभा', ta: 'காரகாம்சத்தில் புதன் + சுக்கிரன் — கலை & வணிக மேதை', te: 'కారకాంశలో బుధుడు + శుక్రుడు — కళ & వాణిజ్య ప్రతిభ', bn: 'কারকাংশে বুধ + শুক্র — কলা ও বাণিজ্য প্রতিভা', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ಬುಧ + ಶುಕ್ರ — ಕಲೆ & ವಾಣಿಜ್ಯ ಪ್ರತಿಭೆ', gu: 'કારકાંશમાં બુધ + શુક્ર — કલા અને વાણિજ્ય પ્રતિભા' },
      { en: 'Mercury and Venus together in Karakamsha: the soul excels where art meets commerce — fashion, music industry, entertainment business, or luxury marketing. An aesthetically intelligent entrepreneur.', hi: 'कारकांश में बुध और शुक्र: कला और वाणिज्य का संगम — फैशन, संगीत उद्योग, मनोरंजन व्यवसाय।', sa: 'कारकांश में बुध और शुक्र: कला और वाणिज्य का संगम — फैशन, संगीत उद्योग, मनोरंजन व्यवसाय।', mai: 'कारकांश में बुध और शुक्र: कला और वाणिज्य का संगम — फैशन, संगीत उद्योग, मनोरंजन व्यवसाय।', mr: 'कारकांश में बुध और शुक्र: कला और वाणिज्य का संगम — फैशन, संगीत उद्योग, मनोरंजन व्यवसाय।', ta: 'காரகாம்சத்தில் புதன் மற்றும் சுக்கிரன் சேர்ந்து: கலையும் வணிகமும் சந்திக்கும் இடத்தில் ஆத்மா சிறக்கிறது — பேஷன், இசைத் தொழில், பொழுதுபோக்கு வணிகம் அல்லது ஆடம்பர சந்தைப்படுத்தல்.', te: 'కారకాంశలో బుధుడు మరియు శుక్రుడు కలిసి: కళ మరియు వాణిజ్యం కలిసే చోట ఆత్మ ప్రావీణ్యం — ఫ్యాషన్, సంగీత పరిశ్రమ, వినోద వ్యాపారం లేదా విలాస మార్కెటింగ్.', bn: 'কারকাংশে বুধ ও শুক্র একত্রে: যেখানে শিল্প ও বাণিজ্য মিলিত হয় সেখানে আত্মা শ্রেষ্ঠ — ফ্যাশন, সঙ্গীত শিল্প, বিনোদন ব্যবসা বা বিলাস বিপণন।', kn: 'ಕಾರಕಾಂಶದಲ್ಲಿ ಬುಧ ಮತ್ತು ಶುಕ್ರ ಒಟ್ಟಿಗೆ: ಕಲೆ ಮತ್ತು ವಾಣಿಜ್ಯ ಸೇರುವಲ್ಲಿ ಆತ್ಮ ಶ್ರೇಷ್ಠ — ಫ್ಯಾಶನ್, ಸಂಗೀತ ಉದ್ಯಮ, ಮನೋರಂಜನೆ ವ್ಯಾಪಾರ.', gu: 'કારકાંશમાં બુધ અને શુક્ર સાથે: જ્યાં કળા અને વાણિજ્ય મળે ત્યાં આત્મા શ્રેષ્ઠ — ફેશન, સંગીત ઉદ્યોગ, મનોરંજન વ્યાપાર.' }],
  ];

  for (const [pid1, pid2, psign1, psign2, name, description] of MULTI_COMBOS) {
    if (!psign1 || !psign2) continue;
    const pos1 = fromKarakamsha(km, psign1);
    const pos2 = fromKarakamsha(km, psign2);
    // Both in same trikona (1,5,9) from KM
    const trikona = new Set([1, 5, 9]);
    if (trikona.has(pos1) && trikona.has(pos2)) {
      yogas.push({ name, present: true, strength: 'strong', description });
    }
    void pid1; void pid2;
  }

  // ─── Karakamsha Sign Profiles (12 signs) — soul's primary orientation ────────
  const KM_SIGN_PROFILES: Record<number, { name: LocaleText; description: LocaleText }> = {
    1:  { name: { en: 'Karakamsha in Aries — Pioneer Soul', hi: 'मेष कारकांश — पथप्रदर्शक आत्मा', sa: 'मेष कारकांश — पथप्रदर्शक आत्मा', mai: 'मेष कारकांश — पथप्रदर्शक आत्मा', mr: 'मेष कारकांश — पथप्रदर्शक आत्मा', ta: 'மேஷ காரகாம்சம் — முன்னோடி ஆத்மா', te: 'మేష కారకాంశ — అగ్రగామి ఆత్మ', bn: 'মেষ কারকাংশ — পথপ্রদর্শক আত্মা', kn: 'ಮೇಷ ಕಾರಕಾಂಶ — ಮುಂಚೂಣಿ ಆತ್ಮ', gu: 'મેષ કારકાંશ — પથપ્રદર્શક આત્મા' },
          description: { en: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.', hi: 'मेष कारकांश: पथप्रदर्शन, नेतृत्व और आत्मनिर्भरता की ओर उन्मुख आत्मा। साहसी, स्वतंत्र, और क्षेत्र में अग्रदूत।', sa: 'मेष कारकांश: पथप्रदर्शन, नेतृत्व और आत्मनिर्भरता की ओर उन्मुख आत्मा। साहसी, स्वतंत्र, और क्षेत्र में अग्रदूत।', mai: 'मेष कारकांश: पथप्रदर्शन, नेतृत्व और आत्मनिर्भरता की ओर उन्मुख आत्मा। साहसी, स्वतंत्र, और क्षेत्र में अग्रदूत।', mr: 'मेष कारकांश: पथप्रदर्शन, नेतृत्व और आत्मनिर्भरता की ओर उन्मुख आत्मा। साहसी, स्वतंत्र, और क्षेत्र में अग्रदूत।', ta: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.', te: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.', bn: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.', kn: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.', gu: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.' } },
    2:  { name: { en: 'Karakamsha in Taurus — Wealth-Accumulating Soul', hi: 'वृष कारकांश — धन-संचयकारी आत्मा', sa: 'वृष कारकांश — धन-संचयकारी आत्मा', mai: 'वृष कारकांश — धन-संचयकारी आत्मा', mr: 'वृष कारकांश — धन-संचयकारी आत्मा', ta: 'ரிஷப காரகாம்சம் — செல்வம் சேர்க்கும் ஆத்மா', te: 'వృషభ కారకాంశ — ధన సంచయ ఆత్మ', bn: 'বৃষ কারকাংশ — ধনসঞ্চয়কারী আত্মা', kn: 'ವೃಷಭ ಕಾರಕಾಂಶ — ಸಂಪತ್ತು ಸಂಗ್ರಹ ಆತ್ಮ', gu: 'વૃષભ કારકાંશ — ધનસંચયકારી આત્મા' },
          description: { en: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.', hi: 'वृष कारकांश: स्थिरता, सौंदर्य और भौतिक सुरक्षा की आत्मा। भूमि, कला, संगीत और स्थायी धन के प्रति आकर्षण।', sa: 'वृष कारकांश: स्थिरता, सौंदर्य और भौतिक सुरक्षा की आत्मा। भूमि, कला, संगीत और स्थायी धन के प्रति आकर्षण।', mai: 'वृष कारकांश: स्थिरता, सौंदर्य और भौतिक सुरक्षा की आत्मा। भूमि, कला, संगीत और स्थायी धन के प्रति आकर्षण।', mr: 'वृष कारकांश: स्थिरता, सौंदर्य और भौतिक सुरक्षा की आत्मा। भूमि, कला, संगीत और स्थायी धन के प्रति आकर्षण।', ta: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.', te: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.', bn: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.', kn: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.', gu: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.' } },
    3:  { name: { en: 'Karakamsha in Gemini — Scholar Soul', hi: 'मिथुन कारकांश — विद्वान आत्मा', sa: 'मिथुन कारकांश — विद्वान आत्मा', mai: 'मिथुन कारकांश — विद्वान आत्मा', mr: 'मिथुन कारकांश — विद्वान आत्मा', ta: 'மிதுன காரகாம்சம் — அறிஞர் ஆத்மா', te: 'మిథున కారకాంశ — విద్వాంసుడి ఆత్మ', bn: 'মিথুন কারকাংশ — বিদ্বান আত্মা', kn: 'ಮಿಥುನ ಕಾರಕಾಂಶ — ವಿದ್ವಾಂಸ ಆತ್ಮ', gu: 'મિથુન કારકાંશ — વિદ્વાન આત્મા' },
          description: { en: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.', hi: 'मिथुन कारकांश: बौद्धिक बहुमुखिता — लेखन, शिक्षण, संचार और वाणिज्य के लिए नियत आत्मा।', sa: 'मिथुन कारकांश: बौद्धिक बहुमुखिता — लेखन, शिक्षण, संचार और वाणिज्य के लिए नियत आत्मा।', mai: 'मिथुन कारकांश: बौद्धिक बहुमुखिता — लेखन, शिक्षण, संचार और वाणिज्य के लिए नियत आत्मा।', mr: 'मिथुन कारकांश: बौद्धिक बहुमुखिता — लेखन, शिक्षण, संचार और वाणिज्य के लिए नियत आत्मा।', ta: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.', te: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.', bn: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.', kn: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.', gu: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.' } },
    4:  { name: { en: 'Karakamsha in Cancer — Nurturing Soul', hi: 'कर्क कारकांश — पोषण-कर्त्री आत्मा', sa: 'कर्क कारकांश — पोषण-कर्त्री आत्मा', mai: 'कर्क कारकांश — पोषण-कर्त्री आत्मा', mr: 'कर्क कारकांश — पोषण-कर्त्री आत्मा', ta: 'கடக காரகாம்சம் — பராமரிக்கும் ஆத்மா', te: 'కర్కాటక కారకాంశ — పోషించే ఆత్మ', bn: 'কর্কট কারকাংশ — পালনকারী আত্মা', kn: 'ಕರ್ಕಾಟಕ ಕಾರಕಾಂಶ — ಪೋಷಿಸುವ ಆತ್ಮ', gu: 'કર્ક કારકાંશ — પાલનકારી આત્મા' },
          description: { en: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.', hi: 'कर्क कारकांश: पोषण, जन सेवा और संरक्षण की आत्मा। माता, मातृभूमि और सामूहिक कल्याण से गहरा जुड़ाव।', sa: 'कर्क कारकांश: पोषण, जन सेवा और संरक्षण की आत्मा। माता, मातृभूमि और सामूहिक कल्याण से गहरा जुड़ाव।', mai: 'कर्क कारकांश: पोषण, जन सेवा और संरक्षण की आत्मा। माता, मातृभूमि और सामूहिक कल्याण से गहरा जुड़ाव।', mr: 'कर्क कारकांश: पोषण, जन सेवा और संरक्षण की आत्मा। माता, मातृभूमि और सामूहिक कल्याण से गहरा जुड़ाव।', ta: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.', te: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.', bn: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.', kn: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.', gu: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.' } },
    5:  { name: { en: 'Karakamsha in Leo — Royal Soul', hi: 'सिंह कारकांश — राजकीय आत्मा', sa: 'सिंह कारकांश — राजकीय आत्मा', mai: 'सिंह कारकांश — राजकीय आत्मा', mr: 'सिंह कारकांश — राजकीय आत्मा', ta: 'சிம்ம காரகாம்சம் — அரச ஆத்மா', te: 'సింహ కారకాంశ — రాజ ఆత్మ', bn: 'সিংহ কারকাংশ — রাজকীয় আত্মা', kn: 'ಸಿಂಹ ಕಾರಕಾಂಶ — ರಾಜ ಆತ್ಮ', gu: 'સિંહ કારકાંશ — રાજસી આત્મા' },
          description: { en: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.', hi: 'सिंह कारकांश: राजकीय गुण — स्वाभाविक अधिकार, सृजनात्मक शक्ति, नेतृत्व की इच्छा। राजनीतिक या नेतृत्व भूमिकाएं।', sa: 'सिंह कारकांश: राजकीय गुण — स्वाभाविक अधिकार, सृजनात्मक शक्ति, नेतृत्व की इच्छा। राजनीतिक या नेतृत्व भूमिकाएं।', mai: 'सिंह कारकांश: राजकीय गुण — स्वाभाविक अधिकार, सृजनात्मक शक्ति, नेतृत्व की इच्छा। राजनीतिक या नेतृत्व भूमिकाएं।', mr: 'सिंह कारकांश: राजकीय गुण — स्वाभाविक अधिकार, सृजनात्मक शक्ति, नेतृत्व की इच्छा। राजनीतिक या नेतृत्व भूमिकाएं।', ta: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.', te: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.', bn: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.', kn: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.', gu: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.' } },
    6:  { name: { en: 'Karakamsha in Virgo — Analytical Soul', hi: 'कन्या कारकांश — विश्लेषणात्मक आत्मा', sa: 'कन्या कारकांश — विश्लेषणात्मक आत्मा', mai: 'कन्या कारकांश — विश्लेषणात्मक आत्मा', mr: 'कन्या कारकांश — विश्लेषणात्मक आत्मा', ta: 'கன்னி காரகாம்சம் — பகுப்பாய்வு ஆத்மா', te: 'కన్య కారకాంశ — విశ్లేషణాత్మక ఆత్మ', bn: 'কন্যা কারকাংশ — বিশ্লেষণাত্মক আত্মা', kn: 'ಕನ್ಯಾ ಕಾರಕಾಂಶ — ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಆತ್ಮ', gu: 'કન્યા કારકાંશ — વિશ્લેષણાત્મક આત્મા' },
          description: { en: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.', hi: 'कन्या कारकांश: सटीकता, सेवा और उपचार से उद्देश्य। उत्कृष्ट विश्लेषणात्मक, चिकित्सा या संपादकीय कार्य।', sa: 'कन्या कारकांश: सटीकता, सेवा और उपचार से उद्देश्य। उत्कृष्ट विश्लेषणात्मक, चिकित्सा या संपादकीय कार्य।', mai: 'कन्या कारकांश: सटीकता, सेवा और उपचार से उद्देश्य। उत्कृष्ट विश्लेषणात्मक, चिकित्सा या संपादकीय कार्य।', mr: 'कन्या कारकांश: सटीकता, सेवा और उपचार से उद्देश्य। उत्कृष्ट विश्लेषणात्मक, चिकित्सा या संपादकीय कार्य।', ta: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.', te: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.', bn: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.', kn: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.', gu: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.' } },
    7:  { name: { en: 'Karakamsha in Libra — Diplomatic Soul', hi: 'तुला कारकांश — राजनयिक आत्मा', sa: 'तुला कारकांश — राजनयिक आत्मा', mai: 'तुला कारकांश — राजनयिक आत्मा', mr: 'तुला कारकांश — राजनयिक आत्मा', ta: 'துலா காரகாம்சம் — இராஜதந்திர ஆத்மா', te: 'తుల కారకాంశ — దౌత్య ఆత్మ', bn: 'তুলা কারকাংশ — কূটনীতিক আত্মা', kn: 'ತುಲಾ ಕಾರಕಾಂಶ — ಕೂಟನೀತಿಜ್ಞ ಆತ್ಮ', gu: 'તુલા કારકાંશ — રાજદ્વારી આત્મા' },
          description: { en: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.', hi: 'तुला कारकांश: संतुलन, न्याय और सौंदर्य की आत्मा। कूटनीतिक, कलात्मक। कानून, डिजाइन, मध्यस्थता।', sa: 'तुला कारकांश: संतुलन, न्याय और सौंदर्य की आत्मा। कूटनीतिक, कलात्मक। कानून, डिजाइन, मध्यस्थता।', mai: 'तुला कारकांश: संतुलन, न्याय और सौंदर्य की आत्मा। कूटनीतिक, कलात्मक। कानून, डिजाइन, मध्यस्थता।', mr: 'तुला कारकांश: संतुलन, न्याय और सौंदर्य की आत्मा। कूटनीतिक, कलात्मक। कानून, डिजाइन, मध्यस्थता।', ta: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.', te: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.', bn: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.', kn: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.', gu: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.' } },
    8:  { name: { en: 'Karakamsha in Scorpio — Investigative Soul', hi: 'वृश्चिक कारकांश — अनुसंधानी आत्मा', sa: 'वृश्चिक कारकांश — अनुसंधानी आत्मा', mai: 'वृश्चिक कारकांश — अनुसंधानी आत्मा', mr: 'वृश्चिक कारकांश — अनुसंधानी आत्मा', ta: 'விருச்சிக காரகாம்சம் — ஆராய்ச்சி ஆத்மா', te: 'వృశ్చిక కారకాంశ — అన్వేషణాత్మక ఆత్మ', bn: 'বৃশ্চিক কারকাংশ — অনুসন্ধানী আত্মা', kn: 'ವೃಶ್ಚಿಕ ಕಾರಕಾಂಶ — ಅನ್ವೇಷಣಾತ್ಮಕ ಆತ್ಮ', gu: 'વૃશ્ચિક કારકાંશ — અનુસંધાની આત્મા' },
          description: { en: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.', hi: 'वृश्चिक कारकांश: गहराई और छिपे ज्ञान से परिवर्तन। अनुसंधान, गुप्त विज्ञान, मनोविज्ञान, आत्मिक रूपांतरण।', sa: 'वृश्चिक कारकांश: गहराई और छिपे ज्ञान से परिवर्तन। अनुसंधान, गुप्त विज्ञान, मनोविज्ञान, आत्मिक रूपांतरण।', mai: 'वृश्चिक कारकांश: गहराई और छिपे ज्ञान से परिवर्तन। अनुसंधान, गुप्त विज्ञान, मनोविज्ञान, आत्मिक रूपांतरण।', mr: 'वृश्चिक कारकांश: गहराई और छिपे ज्ञान से परिवर्तन। अनुसंधान, गुप्त विज्ञान, मनोविज्ञान, आत्मिक रूपांतरण।', ta: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.', te: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.', bn: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.', kn: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.', gu: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.' } },
    9:  { name: { en: 'Karakamsha in Sagittarius — Philosopher Soul', hi: 'धनु कारकांश — दार्शनिक आत्मा', sa: 'धनु कारकांश — दार्शनिक आत्मा', mai: 'धनु कारकांश — दार्शनिक आत्मा', mr: 'धनु कारकांश — दार्शनिक आत्मा', ta: 'தனுசு காரகாம்சம் — தத்துவ ஆத்மா', te: 'ధనుస్సు కారకాంశ — తత్వవేత్త ఆత్మ', bn: 'ধনু কারকাংশ — দার্শনিক আত্মা', kn: 'ಧನು ಕಾರಕಾಂಶ — ತತ್ವಜ್ಞಾನಿ ಆತ್ಮ', gu: 'ધન કારકાંશ — દાર્શનિક આત્મા' },
          description: { en: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.', hi: 'धनु कारकांश: सत्य, दर्शन और उच्च शिक्षा। शिक्षण, धर्म, कानून, तीर्थयात्रा और आध्यात्मिक खोज।', sa: 'धनु कारकांश: सत्य, दर्शन और उच्च शिक्षा। शिक्षण, धर्म, कानून, तीर्थयात्रा और आध्यात्मिक खोज।', mai: 'धनु कारकांश: सत्य, दर्शन और उच्च शिक्षा। शिक्षण, धर्म, कानून, तीर्थयात्रा और आध्यात्मिक खोज।', mr: 'धनु कारकांश: सत्य, दर्शन और उच्च शिक्षा। शिक्षण, धर्म, कानून, तीर्थयात्रा और आध्यात्मिक खोज।', ta: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.', te: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.', bn: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.', kn: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.', gu: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.' } },
    10: { name: { en: 'Karakamsha in Capricorn — Executive Soul', hi: 'मकर कारकांश — कार्यकारी आत्मा', sa: 'मकर कारकांश — कार्यकारी आत्मा', mai: 'मकर कारकांश — कार्यकारी आत्मा', mr: 'मकर कारकांश — कार्यकारी आत्मा', ta: 'மகர காரகாம்சம் — நிர்வாக ஆத்மா', te: 'మకర కారకాంశ — కార్యనిర్వాహక ఆత్మ', bn: 'মকর কারকাংশ — কার্যনির্বাহী আত্মা', kn: 'ಮಕರ ಕಾರಕಾಂಶ — ಕಾರ್ಯನಿರ್ವಾಹಕ ಆತ್ಮ', gu: 'મકર કારકાંશ — કાર્યકારી આત્મા' },
          description: { en: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.', hi: 'मकर कारकांश: धीमे और निश्चित निर्माण — महत्वाकांक्षी, धैर्यवान। प्रशासन, इंजीनियरिंग, कॉर्पोरेट नेतृत्व।', sa: 'मकर कारकांश: धीमे और निश्चित निर्माण — महत्वाकांक्षी, धैर्यवान। प्रशासन, इंजीनियरिंग, कॉर्पोरेट नेतृत्व।', mai: 'मकर कारकांश: धीमे और निश्चित निर्माण — महत्वाकांक्षी, धैर्यवान। प्रशासन, इंजीनियरिंग, कॉर्पोरेट नेतृत्व।', mr: 'मकर कारकांश: धीमे और निश्चित निर्माण — महत्वाकांक्षी, धैर्यवान। प्रशासन, इंजीनियरिंग, कॉर्पोरेट नेतृत्व।', ta: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.', te: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.', bn: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.', kn: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.', gu: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.' } },
    11: { name: { en: 'Karakamsha in Aquarius — Humanitarian Soul', hi: 'कुंभ कारकांश — मानवतावादी आत्मा', sa: 'कुंभ कारकांश — मानवतावादी आत्मा', mai: 'कुंभ कारकांश — मानवतावादी आत्मा', mr: 'कुंभ कारकांश — मानवतावादी आत्मा', ta: 'கும்ப காரகாம்சம் — மனிதநேய ஆத்மா', te: 'కుంభ కారకాంశ — మానవతావాద ఆత్మ', bn: 'কুম্ভ কারকাংশ — মানবতাবাদী আত্মা', kn: 'ಕುಂಭ ಕಾರಕಾಂಶ — ಮಾನವತಾವಾದಿ ಆತ್ಮ', gu: 'કુંભ કારકાંશ — માનવતાવાદી આત્મા' },
          description: { en: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.', hi: 'कुंभ कारकांश: सामूहिक उन्नति — विज्ञान, सामाजिक सुधार, प्रौद्योगिकी। नवाचारी, अपरंपरागत।', sa: 'कुंभ कारकांश: सामूहिक उन्नति — विज्ञान, सामाजिक सुधार, प्रौद्योगिकी। नवाचारी, अपरंपरागत।', mai: 'कुंभ कारकांश: सामूहिक उन्नति — विज्ञान, सामाजिक सुधार, प्रौद्योगिकी। नवाचारी, अपरंपरागत।', mr: 'कुंभ कारकांश: सामूहिक उन्नति — विज्ञान, सामाजिक सुधार, प्रौद्योगिकी। नवाचारी, अपरंपरागत।', ta: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.', te: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.', bn: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.', kn: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.', gu: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.' } },
    12: { name: { en: 'Karakamsha in Pisces — Mystical Soul', hi: 'मीन कारकांश — रहस्यमय आत्मा', sa: 'मीन कारकांश — रहस्यमय आत्मा', mai: 'मीन कारकांश — रहस्यमय आत्मा', mr: 'मीन कारकांश — रहस्यमय आत्मा', ta: 'மீன காரகாம்சம் — ரகசிய ஆத்மா', te: 'మీన కారకాంశ — మర్మమయ ఆత్మ', bn: 'মীন কারকাংশ — রহস্যময় আত্মা', kn: 'ಮೀನ ಕಾರಕಾಂಶ — ರಹಸ್ಯಮಯ ಆತ್ಮ', gu: 'મીન કારકાંશ — રહસ્યમય આત્મા' },
          description: { en: 'Karakamsha in Pisces: the soul is oriented toward transcendence — mysticism, compassion, and dissolution of the ego. Spiritual service, healing, and moksha-pursuit are the life-purpose.', hi: 'मीन कारकांश: अतिक्रमण — रहस्यवाद, करुणा, अहंकार का विसर्जन। आध्यात्मिक सेवा और मोक्ष।', sa: 'मीन कारकांश: अतिक्रमण — रहस्यवाद, करुणा, अहंकार का विसर्जन। आध्यात्मिक सेवा और मोक्ष।', mai: 'मीन कारकांश: अतिक्रमण — रहस्यवाद, करुणा, अहंकार का विसर्जन। आध्यात्मिक सेवा और मोक्ष।', mr: 'मीन कारकांश: अतिक्रमण — रहस्यवाद, करुणा, अहंकार का विसर्जन। आध्यात्मिक सेवा और मोक्ष।', ta: 'Karakamsha in Pisces: the soul is oriented toward transcendence — mysticism, compassion, and dissolution of the ego. Spiritual service, healing, and moksha-pursuit are the life-purpose.', te: 'Karakamsha in Pisces: the soul is oriented toward transcendence — mysticism, compassion, and dissolution of the ego. Spiritual service, healing, and moksha-pursuit are the life-purpose.', bn: 'Karakamsha in Pisces: the soul is oriented toward transcendence — mysticism, compassion, and dissolution of the ego. Spiritual service, healing, and moksha-pursuit are the life-purpose.', kn: 'Karakamsha in Pisces: the soul is oriented toward transcendence — mysticism, compassion, and dissolution of the ego. Spiritual service, healing, and moksha-pursuit are the life-purpose.', gu: 'Karakamsha in Pisces: the soul is oriented toward transcendence — mysticism, compassion, and dissolution of the ego. Spiritual service, healing, and moksha-pursuit are the life-purpose.' } },
  };

  const kmProfile = KM_SIGN_PROFILES[km];
  if (kmProfile) {
    yogas.push({ name: kmProfile.name, present: true, strength: 'mild', description: kmProfile.description });
  }

  // Filter: only return present yogas
  return yogas.filter(y => y.present);
}

/**
 * Full Jaimini analysis
 */
export function calculateJaimini(planets: PlanetPosition[], ascSign: number, birthDate: Date): JaiminiData & { grahaArudhas: GrahaArudha[] } {
  const charaKarakas = calculateCharaKarakas(planets);
  const ak = charaKarakas[0]; // Atmakaraka
  const akPlanet = planets.find(p => p.planet.id === ak.planet);
  const karakamsha = calculateKarakamsha(akPlanet?.longitude || 0);
  const arudhaPadas = calculateArudhaPadas(ascSign, planets);
  const charaDasha = calculateCharaDasha(ascSign, planets, birthDate);
  const grahaArudhas = calculateGrahaArudhas(planets);
  const rajayogas = calculateJaiminiRajayogas(planets, karakamsha, charaKarakas);

  return { charaKarakas, karakamsha, arudhaPadas, charaDasha, grahaArudhas, rajayogas };
}
