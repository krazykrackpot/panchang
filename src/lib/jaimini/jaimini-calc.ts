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
        name: { en: 'AK–AmK Rajayoga', hi: 'आत्मकारक-अमात्यकारक राजयोग', sa: 'आत्मकारक-अमात्यकारक राजयोग', mai: 'आत्मकारक-अमात्यकारक राजयोग', mr: 'आत्मकारक-अमात्यकारक राजयोग', ta: 'AK–AmK Rajayoga', te: 'AK–AmK Rajayoga', bn: 'AK–AmK Rajayoga', kn: 'AK–AmK Rajayoga', gu: 'AK–AmK Rajayoga' },
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
        name: { en: 'Ketu in Karakamsha — Moksha Yoga', hi: 'कारकांश में केतु — मोक्ष योग', sa: 'कारकांश में केतु — मोक्ष योग', mai: 'कारकांश में केतु — मोक्ष योग', mr: 'कारकांश में केतु — मोक्ष योग', ta: 'Ketu in Karakamsha — Moksha Yoga', te: 'Ketu in Karakamsha — Moksha Yoga', bn: 'Ketu in Karakamsha — Moksha Yoga', kn: 'Ketu in Karakamsha — Moksha Yoga', gu: 'Ketu in Karakamsha — Moksha Yoga' },
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
        name: { en: 'Venus in Karakamsha — Bhoga Yoga', hi: 'कारकांश में शुक्र — भोग योग', sa: 'कारकांश में शुक्र — भोग योग', mai: 'कारकांश में शुक्र — भोग योग', mr: 'कारकांश में शुक्र — भोग योग', ta: 'Venus in Karakamsha — Bhoga Yoga', te: 'Venus in Karakamsha — Bhoga Yoga', bn: 'Venus in Karakamsha — Bhoga Yoga', kn: 'Venus in Karakamsha — Bhoga Yoga', gu: 'Venus in Karakamsha — Bhoga Yoga' },
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
        name: { en: 'Jupiter in Karakamsha Trikona — Dharma Yoga', hi: 'कारकांश त्रिकोण में बृहस्पति — धर्म योग', sa: 'कारकांश त्रिकोण में बृहस्पति — धर्म योग', mai: 'कारकांश त्रिकोण में बृहस्पति — धर्म योग', mr: 'कारकांश त्रिकोण में बृहस्पति — धर्म योग', ta: 'Jupiter in Karakamsha Trikona — Dharma Yoga', te: 'Jupiter in Karakamsha Trikona — Dharma Yoga', bn: 'Jupiter in Karakamsha Trikona — Dharma Yoga', kn: 'Jupiter in Karakamsha Trikona — Dharma Yoga', gu: 'Jupiter in Karakamsha Trikona — Dharma Yoga' },
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
        name: { en: 'Rahu in Karakamsha — Videshi Yoga', hi: 'कारकांश में राहु — विदेशी योग', sa: 'कारकांश में राहु — विदेशी योग', mai: 'कारकांश में राहु — विदेशी योग', mr: 'कारकांश में राहु — विदेशी योग', ta: 'Rahu in Karakamsha — Videshi Yoga', te: 'Rahu in Karakamsha — Videshi Yoga', bn: 'Rahu in Karakamsha — Videshi Yoga', kn: 'Rahu in Karakamsha — Videshi Yoga', gu: 'Rahu in Karakamsha — Videshi Yoga' },
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
      name: { en: 'AK–AmK Conjunction Rajayoga', hi: 'आत्मकारक-अमात्यकारक युति राजयोग', sa: 'आत्मकारक-अमात्यकारक युति राजयोग', mai: 'आत्मकारक-अमात्यकारक युति राजयोग', mr: 'आत्मकारक-अमात्यकारक युति राजयोग', ta: 'AK–AmK Conjunction Rajayoga', te: 'AK–AmK Conjunction Rajayoga', bn: 'AK–AmK Conjunction Rajayoga', kn: 'AK–AmK Conjunction Rajayoga', gu: 'AK–AmK Conjunction Rajayoga' },
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
      name: { en: 'Jupiter in 5H from Karakamsha — Guru Yoga', hi: 'कारकांश से 5वें में बृहस्पति — गुरु योग', sa: 'कारकांश से 5वें में बृहस्पति — गुरु योग', mai: 'कारकांश से 5वें में बृहस्पति — गुरु योग', mr: 'कारकांश से 5वें में बृहस्पति — गुरु योग', ta: 'Jupiter in 5H from Karakamsha — Guru Yoga', te: 'Jupiter in 5H from Karakamsha — Guru Yoga', bn: 'Jupiter in 5H from Karakamsha — Guru Yoga', kn: 'Jupiter in 5H from Karakamsha — Guru Yoga', gu: 'Jupiter in 5H from Karakamsha — Guru Yoga' },
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
          name: { en: 'Bhratrikaraka in 3H/11H from Karakamsha', hi: 'कारकांश से 3/11वें में भ्रातृकारक', sa: 'कारकांश से 3/11वें में भ्रातृकारक', mai: 'कारकांश से 3/11वें में भ्रातृकारक', mr: 'कारकांश से 3/11वें में भ्रातृकारक', ta: 'Bhratrikaraka in 3H/11H from Karakamsha', te: 'Bhratrikaraka in 3H/11H from Karakamsha', bn: 'Bhratrikaraka in 3H/11H from Karakamsha', kn: 'Bhratrikaraka in 3H/11H from Karakamsha', gu: 'Bhratrikaraka in 3H/11H from Karakamsha' },
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
    [0, sunSign, { en: 'Sun in 2H from Karakamsha — Government Service', hi: 'कारकांश से 2H में सूर्य — सरकारी सेवा', sa: 'कारकांश से 2H में सूर्य — सरकारी सेवा', mai: 'कारकांश से 2H में सूर्य — सरकारी सेवा', mr: 'कारकांश से 2H में सूर्य — सरकारी सेवा', ta: 'Sun in 2H from Karakamsha — Government Service', te: 'Sun in 2H from Karakamsha — Government Service', bn: 'Sun in 2H from Karakamsha — Government Service', kn: 'Sun in 2H from Karakamsha — Government Service', gu: 'Sun in 2H from Karakamsha — Government Service' },
      { en: 'Sun in the 2nd from Karakamsha: this soul earns through government, authority, politics, or public administration. A natural administrator who finds livelihood in positions of power.', hi: 'कारकांश से 2H में सूर्य: इस आत्मा की आजीविका सरकार, अधिकार, राजनीति या प्रशासन से। स्वाभाविक प्रशासक।', sa: 'कारकांश से 2H में सूर्य: इस आत्मा की आजीविका सरकार, अधिकार, राजनीति या प्रशासन से। स्वाभाविक प्रशासक।', mai: 'कारकांश से 2H में सूर्य: इस आत्मा की आजीविका सरकार, अधिकार, राजनीति या प्रशासन से। स्वाभाविक प्रशासक।', mr: 'कारकांश से 2H में सूर्य: इस आत्मा की आजीविका सरकार, अधिकार, राजनीति या प्रशासन से। स्वाभाविक प्रशासक।', ta: 'Sun in the 2nd from Karakamsha: this soul earns through government, authority, politics, or public administration. A natural administrator who finds livelihood in positions of power.', te: 'Sun in the 2nd from Karakamsha: this soul earns through government, authority, politics, or public administration. A natural administrator who finds livelihood in positions of power.', bn: 'Sun in the 2nd from Karakamsha: this soul earns through government, authority, politics, or public administration. A natural administrator who finds livelihood in positions of power.', kn: 'Sun in the 2nd from Karakamsha: this soul earns through government, authority, politics, or public administration. A natural administrator who finds livelihood in positions of power.', gu: 'Sun in the 2nd from Karakamsha: this soul earns through government, authority, politics, or public administration. A natural administrator who finds livelihood in positions of power.' }],
    [1, moonSign, { en: 'Moon in 2H from Karakamsha — Trade & Public Dealings', hi: 'कारकांश से 2H में चंद्र — व्यापार', sa: 'कारकांश से 2H में चंद्र — व्यापार', mai: 'कारकांश से 2H में चंद्र — व्यापार', mr: 'कारकांश से 2H में चंद्र — व्यापार', ta: 'Moon in 2H from Karakamsha — Trade & Public Dealings', te: 'Moon in 2H from Karakamsha — Trade & Public Dealings', bn: 'Moon in 2H from Karakamsha — Trade & Public Dealings', kn: 'Moon in 2H from Karakamsha — Trade & Public Dealings', gu: 'Moon in 2H from Karakamsha — Trade & Public Dealings' },
      { en: 'Moon in the 2nd from Karakamsha: income from trade, public service, hospitality, or agriculture. Emotionally driven livelihood — wealth fluctuates with public mood.', hi: 'कारकांश से 2H में चंद्र: व्यापार, जन सेवा, आतिथ्य या कृषि से आजीविका।', sa: 'कारकांश से 2H में चंद्र: व्यापार, जन सेवा, आतिथ्य या कृषि से आजीविका।', mai: 'कारकांश से 2H में चंद्र: व्यापार, जन सेवा, आतिथ्य या कृषि से आजीविका।', mr: 'कारकांश से 2H में चंद्र: व्यापार, जन सेवा, आतिथ्य या कृषि से आजीविका।', ta: 'Moon in the 2nd from Karakamsha: income from trade, public service, hospitality, or agriculture. Emotionally driven livelihood — wealth fluctuates with public mood.', te: 'Moon in the 2nd from Karakamsha: income from trade, public service, hospitality, or agriculture. Emotionally driven livelihood — wealth fluctuates with public mood.', bn: 'Moon in the 2nd from Karakamsha: income from trade, public service, hospitality, or agriculture. Emotionally driven livelihood — wealth fluctuates with public mood.', kn: 'Moon in the 2nd from Karakamsha: income from trade, public service, hospitality, or agriculture. Emotionally driven livelihood — wealth fluctuates with public mood.', gu: 'Moon in the 2nd from Karakamsha: income from trade, public service, hospitality, or agriculture. Emotionally driven livelihood — wealth fluctuates with public mood.' }],
    [2, marsSign, { en: 'Mars in 2H from Karakamsha — Craft & Military', hi: 'कारकांश से 2H में मंगल — शिल्प एवं सेना', sa: 'कारकांश से 2H में मंगल — शिल्प एवं सेना', mai: 'कारकांश से 2H में मंगल — शिल्प एवं सेना', mr: 'कारकांश से 2H में मंगल — शिल्प एवं सेना', ta: 'Mars in 2H from Karakamsha — Craft & Military', te: 'Mars in 2H from Karakamsha — Craft & Military', bn: 'Mars in 2H from Karakamsha — Craft & Military', kn: 'Mars in 2H from Karakamsha — Craft & Military', gu: 'Mars in 2H from Karakamsha — Craft & Military' },
      { en: 'Mars in the 2nd from Karakamsha: this soul earns through fire, metal, the military, surgery, cooking, or craft. Skilled hands and physical courage are the primary earning tools.', hi: 'कारकांश से 2H में मंगल: अग्नि, धातु, सेना, शल्य, पाक कला या शिल्प से आजीविका।', sa: 'कारकांश से 2H में मंगल: अग्नि, धातु, सेना, शल्य, पाक कला या शिल्प से आजीविका।', mai: 'कारकांश से 2H में मंगल: अग्नि, धातु, सेना, शल्य, पाक कला या शिल्प से आजीविका।', mr: 'कारकांश से 2H में मंगल: अग्नि, धातु, सेना, शल्य, पाक कला या शिल्प से आजीविका।', ta: 'Mars in the 2nd from Karakamsha: this soul earns through fire, metal, the military, surgery, cooking, or craft. Skilled hands and physical courage are the primary earning tools.', te: 'Mars in the 2nd from Karakamsha: this soul earns through fire, metal, the military, surgery, cooking, or craft. Skilled hands and physical courage are the primary earning tools.', bn: 'Mars in the 2nd from Karakamsha: this soul earns through fire, metal, the military, surgery, cooking, or craft. Skilled hands and physical courage are the primary earning tools.', kn: 'Mars in the 2nd from Karakamsha: this soul earns through fire, metal, the military, surgery, cooking, or craft. Skilled hands and physical courage are the primary earning tools.', gu: 'Mars in the 2nd from Karakamsha: this soul earns through fire, metal, the military, surgery, cooking, or craft. Skilled hands and physical courage are the primary earning tools.' }],
    [3, mercSign, { en: 'Mercury in 2H from Karakamsha — Scholarship & Trade', hi: 'कारकांश से 2H में बुध — शिक्षा एवं वाणिज्य', sa: 'कारकांश से 2H में बुध — शिक्षा एवं वाणिज्य', mai: 'कारकांश से 2H में बुध — शिक्षा एवं वाणिज्य', mr: 'कारकांश से 2H में बुध — शिक्षा एवं वाणिज्य', ta: 'Mercury in 2H from Karakamsha — Scholarship & Trade', te: 'Mercury in 2H from Karakamsha — Scholarship & Trade', bn: 'Mercury in 2H from Karakamsha — Scholarship & Trade', kn: 'Mercury in 2H from Karakamsha — Scholarship & Trade', gu: 'Mercury in 2H from Karakamsha — Scholarship & Trade' },
      { en: 'Mercury in the 2nd from Karakamsha: income from writing, accounting, trade, mathematics, or astrology. Mercury here gives multiple income streams through intellectual work.', hi: 'कारकांश से 2H में बुध: लेखन, लेखा, व्यापार, गणित या ज्योतिष से आजीविका।', sa: 'कारकांश से 2H में बुध: लेखन, लेखा, व्यापार, गणित या ज्योतिष से आजीविका।', mai: 'कारकांश से 2H में बुध: लेखन, लेखा, व्यापार, गणित या ज्योतिष से आजीविका।', mr: 'कारकांश से 2H में बुध: लेखन, लेखा, व्यापार, गणित या ज्योतिष से आजीविका।', ta: 'Mercury in the 2nd from Karakamsha: income from writing, accounting, trade, mathematics, or astrology. Mercury here gives multiple income streams through intellectual work.', te: 'Mercury in the 2nd from Karakamsha: income from writing, accounting, trade, mathematics, or astrology. Mercury here gives multiple income streams through intellectual work.', bn: 'Mercury in the 2nd from Karakamsha: income from writing, accounting, trade, mathematics, or astrology. Mercury here gives multiple income streams through intellectual work.', kn: 'Mercury in the 2nd from Karakamsha: income from writing, accounting, trade, mathematics, or astrology. Mercury here gives multiple income streams through intellectual work.', gu: 'Mercury in the 2nd from Karakamsha: income from writing, accounting, trade, mathematics, or astrology. Mercury here gives multiple income streams through intellectual work.' }],
    [6, satSign, { en: 'Saturn in 2H from Karakamsha — Agriculture & Industry', hi: 'कारकांश से 2H में शनि — कृषि एवं उद्योग', sa: 'कारकांश से 2H में शनि — कृषि एवं उद्योग', mai: 'कारकांश से 2H में शनि — कृषि एवं उद्योग', mr: 'कारकांश से 2H में शनि — कृषि एवं उद्योग', ta: 'Saturn in 2H from Karakamsha — Agriculture & Industry', te: 'Saturn in 2H from Karakamsha — Agriculture & Industry', bn: 'Saturn in 2H from Karakamsha — Agriculture & Industry', kn: 'Saturn in 2H from Karakamsha — Agriculture & Industry', gu: 'Saturn in 2H from Karakamsha — Agriculture & Industry' },
      { en: 'Saturn in the 2nd from Karakamsha: livelihood through farming, mining, construction, or heavy industry. Wealth comes slowly through persistent, systematic effort.', hi: 'कारकांश से 2H में शनि: कृषि, खनन, निर्माण या भारी उद्योग से आजीविका। धन धीरे-धीरे आता है।', sa: 'कारकांश से 2H में शनि: कृषि, खनन, निर्माण या भारी उद्योग से आजीविका। धन धीरे-धीरे आता है।', mai: 'कारकांश से 2H में शनि: कृषि, खनन, निर्माण या भारी उद्योग से आजीविका। धन धीरे-धीरे आता है।', mr: 'कारकांश से 2H में शनि: कृषि, खनन, निर्माण या भारी उद्योग से आजीविका। धन धीरे-धीरे आता है।', ta: 'Saturn in the 2nd from Karakamsha: livelihood through farming, mining, construction, or heavy industry. Wealth comes slowly through persistent, systematic effort.', te: 'Saturn in the 2nd from Karakamsha: livelihood through farming, mining, construction, or heavy industry. Wealth comes slowly through persistent, systematic effort.', bn: 'Saturn in the 2nd from Karakamsha: livelihood through farming, mining, construction, or heavy industry. Wealth comes slowly through persistent, systematic effort.', kn: 'Saturn in the 2nd from Karakamsha: livelihood through farming, mining, construction, or heavy industry. Wealth comes slowly through persistent, systematic effort.', gu: 'Saturn in the 2nd from Karakamsha: livelihood through farming, mining, construction, or heavy industry. Wealth comes slowly through persistent, systematic effort.' }],
    [7, rahuSign, { en: 'Rahu in 2H from Karakamsha — Foreign Trade & Technology', hi: 'कारकांश से 2H में राहु — विदेशी व्यापार', sa: 'कारकांश से 2H में राहु — विदेशी व्यापार', mai: 'कारकांश से 2H में राहु — विदेशी व्यापार', mr: 'कारकांश से 2H में राहु — विदेशी व्यापार', ta: 'Rahu in 2H from Karakamsha — Foreign Trade & Technology', te: 'Rahu in 2H from Karakamsha — Foreign Trade & Technology', bn: 'Rahu in 2H from Karakamsha — Foreign Trade & Technology', kn: 'Rahu in 2H from Karakamsha — Foreign Trade & Technology', gu: 'Rahu in 2H from Karakamsha — Foreign Trade & Technology' },
      { en: 'Rahu in the 2nd from Karakamsha: income from foreign trade, import-export, metals, technology, or unconventional industries. Wealth through crossing cultural or geographic boundaries.', hi: 'कारकांश से 2H में राहु: विदेशी व्यापार, धातु, प्रौद्योगिकी से आजीविका।', sa: 'कारकांश से 2H में राहु: विदेशी व्यापार, धातु, प्रौद्योगिकी से आजीविका।', mai: 'कारकांश से 2H में राहु: विदेशी व्यापार, धातु, प्रौद्योगिकी से आजीविका।', mr: 'कारकांश से 2H में राहु: विदेशी व्यापार, धातु, प्रौद्योगिकी से आजीविका।', ta: 'Rahu in the 2nd from Karakamsha: income from foreign trade, import-export, metals, technology, or unconventional industries. Wealth through crossing cultural or geographic boundaries.', te: 'Rahu in the 2nd from Karakamsha: income from foreign trade, import-export, metals, technology, or unconventional industries. Wealth through crossing cultural or geographic boundaries.', bn: 'Rahu in the 2nd from Karakamsha: income from foreign trade, import-export, metals, technology, or unconventional industries. Wealth through crossing cultural or geographic boundaries.', kn: 'Rahu in the 2nd from Karakamsha: income from foreign trade, import-export, metals, technology, or unconventional industries. Wealth through crossing cultural or geographic boundaries.', gu: 'Rahu in the 2nd from Karakamsha: income from foreign trade, import-export, metals, technology, or unconventional industries. Wealth through crossing cultural or geographic boundaries.' }],
    [8, ketuSign, { en: 'Ketu in 2H from Karakamsha — Spiritual Vocation', hi: 'कारकांश से 2H में केतु — आध्यात्मिक वृत्ति', sa: 'कारकांश से 2H में केतु — आध्यात्मिक वृत्ति', mai: 'कारकांश से 2H में केतु — आध्यात्मिक वृत्ति', mr: 'कारकांश से 2H में केतु — आध्यात्मिक वृत्ति', ta: 'Ketu in 2H from Karakamsha — Spiritual Vocation', te: 'Ketu in 2H from Karakamsha — Spiritual Vocation', bn: 'Ketu in 2H from Karakamsha — Spiritual Vocation', kn: 'Ketu in 2H from Karakamsha — Spiritual Vocation', gu: 'Ketu in 2H from Karakamsha — Spiritual Vocation' },
      { en: 'Ketu in the 2nd from Karakamsha: spiritual practitioner, healer, renunciant, or someone who monetizes ancient knowledge — astrology, medicine, or sacred arts.', hi: 'कारकांश से 2H में केतु: आध्यात्मिक साधक, वैद्य, संन्यासी या प्राचीन ज्ञान से आजीविका।', sa: 'कारकांश से 2H में केतु: आध्यात्मिक साधक, वैद्य, संन्यासी या प्राचीन ज्ञान से आजीविका।', mai: 'कारकांश से 2H में केतु: आध्यात्मिक साधक, वैद्य, संन्यासी या प्राचीन ज्ञान से आजीविका।', mr: 'कारकांश से 2H में केतु: आध्यात्मिक साधक, वैद्य, संन्यासी या प्राचीन ज्ञान से आजीविका।', ta: 'Ketu in the 2nd from Karakamsha: spiritual practitioner, healer, renunciant, or someone who monetizes ancient knowledge — astrology, medicine, or sacred arts.', te: 'Ketu in the 2nd from Karakamsha: spiritual practitioner, healer, renunciant, or someone who monetizes ancient knowledge — astrology, medicine, or sacred arts.', bn: 'Ketu in the 2nd from Karakamsha: spiritual practitioner, healer, renunciant, or someone who monetizes ancient knowledge — astrology, medicine, or sacred arts.', kn: 'Ketu in the 2nd from Karakamsha: spiritual practitioner, healer, renunciant, or someone who monetizes ancient knowledge — astrology, medicine, or sacred arts.', gu: 'Ketu in the 2nd from Karakamsha: spiritual practitioner, healer, renunciant, or someone who monetizes ancient knowledge — astrology, medicine, or sacred arts.' }],
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
    [0, sunSign, { en: 'Sun in 5H from Karakamsha — Leadership Intelligence', hi: 'कारकांश से 5H में सूर्य — नेतृत्व बुद्धि', sa: 'कारकांश से 5H में सूर्य — नेतृत्व बुद्धि', mai: 'कारकांश से 5H में सूर्य — नेतृत्व बुद्धि', mr: 'कारकांश से 5H में सूर्य — नेतृत्व बुद्धि', ta: 'Sun in 5H from Karakamsha — Leadership Intelligence', te: 'Sun in 5H from Karakamsha — Leadership Intelligence', bn: 'Sun in 5H from Karakamsha — Leadership Intelligence', kn: 'Sun in 5H from Karakamsha — Leadership Intelligence', gu: 'Sun in 5H from Karakamsha — Leadership Intelligence' },
      { en: 'Sun in the 5th from Karakamsha: commanding intellect, governmental or political intelligence, natural authority in teaching or advisory roles. Children may hold positions of authority.', hi: 'कारकांश से 5H में सूर्य: सरकारी बुद्धि, राजनीतिक बौद्धिकता, शिक्षण में स्वाभाविक अधिकार।', sa: 'कारकांश से 5H में सूर्य: सरकारी बुद्धि, राजनीतिक बौद्धिकता, शिक्षण में स्वाभाविक अधिकार।', mai: 'कारकांश से 5H में सूर्य: सरकारी बुद्धि, राजनीतिक बौद्धिकता, शिक्षण में स्वाभाविक अधिकार।', mr: 'कारकांश से 5H में सूर्य: सरकारी बुद्धि, राजनीतिक बौद्धिकता, शिक्षण में स्वाभाविक अधिकार।', ta: 'Sun in the 5th from Karakamsha: commanding intellect, governmental or political intelligence, natural authority in teaching or advisory roles. Children may hold positions of authority.', te: 'Sun in the 5th from Karakamsha: commanding intellect, governmental or political intelligence, natural authority in teaching or advisory roles. Children may hold positions of authority.', bn: 'Sun in the 5th from Karakamsha: commanding intellect, governmental or political intelligence, natural authority in teaching or advisory roles. Children may hold positions of authority.', kn: 'Sun in the 5th from Karakamsha: commanding intellect, governmental or political intelligence, natural authority in teaching or advisory roles. Children may hold positions of authority.', gu: 'Sun in the 5th from Karakamsha: commanding intellect, governmental or political intelligence, natural authority in teaching or advisory roles. Children may hold positions of authority.' }],
    [1, moonSign, { en: 'Moon in 5H from Karakamsha — Public & Agricultural Intelligence', hi: 'कारकांश से 5H में चंद्र — सार्वजनिक बुद्धि', sa: 'कारकांश से 5H में चंद्र — सार्वजनिक बुद्धि', mai: 'कारकांश से 5H में चंद्र — सार्वजनिक बुद्धि', mr: 'कारकांश से 5H में चंद्र — सार्वजनिक बुद्धि', ta: 'Moon in 5H from Karakamsha — Public & Agricultural Intelligence', te: 'Moon in 5H from Karakamsha — Public & Agricultural Intelligence', bn: 'Moon in 5H from Karakamsha — Public & Agricultural Intelligence', kn: 'Moon in 5H from Karakamsha — Public & Agricultural Intelligence', gu: 'Moon in 5H from Karakamsha — Public & Agricultural Intelligence' },
      { en: 'Moon in the 5th from Karakamsha: intuitive intelligence suited to public life, agriculture, and food-related work. Excellent memory, emotionally perceptive children.', hi: 'कारकांश से 5H में चंद्र: सार्वजनिक जीवन, कृषि के लिए सहज बुद्धि। उत्कृष्ट स्मृति।', sa: 'कारकांश से 5H में चंद्र: सार्वजनिक जीवन, कृषि के लिए सहज बुद्धि। उत्कृष्ट स्मृति।', mai: 'कारकांश से 5H में चंद्र: सार्वजनिक जीवन, कृषि के लिए सहज बुद्धि। उत्कृष्ट स्मृति।', mr: 'कारकांश से 5H में चंद्र: सार्वजनिक जीवन, कृषि के लिए सहज बुद्धि। उत्कृष्ट स्मृति।', ta: 'Moon in the 5th from Karakamsha: intuitive intelligence suited to public life, agriculture, and food-related work. Excellent memory, emotionally perceptive children.', te: 'Moon in the 5th from Karakamsha: intuitive intelligence suited to public life, agriculture, and food-related work. Excellent memory, emotionally perceptive children.', bn: 'Moon in the 5th from Karakamsha: intuitive intelligence suited to public life, agriculture, and food-related work. Excellent memory, emotionally perceptive children.', kn: 'Moon in the 5th from Karakamsha: intuitive intelligence suited to public life, agriculture, and food-related work. Excellent memory, emotionally perceptive children.', gu: 'Moon in the 5th from Karakamsha: intuitive intelligence suited to public life, agriculture, and food-related work. Excellent memory, emotionally perceptive children.' }],
    [3, mercSign, { en: 'Mercury in 5H from Karakamsha — Mathematical & Oratorical Genius', hi: 'कारकांश से 5H में बुध — गणितीय प्रतिभा', sa: 'कारकांश से 5H में बुध — गणितीय प्रतिभा', mai: 'कारकांश से 5H में बुध — गणितीय प्रतिभा', mr: 'कारकांश से 5H में बुध — गणितीय प्रतिभा', ta: 'Mercury in 5H from Karakamsha — Mathematical & Oratorical Genius', te: 'Mercury in 5H from Karakamsha — Mathematical & Oratorical Genius', bn: 'Mercury in 5H from Karakamsha — Mathematical & Oratorical Genius', kn: 'Mercury in 5H from Karakamsha — Mathematical & Oratorical Genius', gu: 'Mercury in 5H from Karakamsha — Mathematical & Oratorical Genius' },
      { en: 'Mercury in the 5th from Karakamsha: exceptional mathematical ability, oratory, writing, and linguistic intelligence. A natural astrologer, writer, or mathematician. Gifted communicator children.', hi: 'कारकांश से 5H में बुध: असाधारण गणितीय क्षमता, वक्तृत्व, लेखन। स्वाभाविक ज्योतिषी या गणितज्ञ।', sa: 'कारकांश से 5H में बुध: असाधारण गणितीय क्षमता, वक्तृत्व, लेखन। स्वाभाविक ज्योतिषी या गणितज्ञ।', mai: 'कारकांश से 5H में बुध: असाधारण गणितीय क्षमता, वक्तृत्व, लेखन। स्वाभाविक ज्योतिषी या गणितज्ञ।', mr: 'कारकांश से 5H में बुध: असाधारण गणितीय क्षमता, वक्तृत्व, लेखन। स्वाभाविक ज्योतिषी या गणितज्ञ।', ta: 'Mercury in the 5th from Karakamsha: exceptional mathematical ability, oratory, writing, and linguistic intelligence. A natural astrologer, writer, or mathematician. Gifted communicator children.', te: 'Mercury in the 5th from Karakamsha: exceptional mathematical ability, oratory, writing, and linguistic intelligence. A natural astrologer, writer, or mathematician. Gifted communicator children.', bn: 'Mercury in the 5th from Karakamsha: exceptional mathematical ability, oratory, writing, and linguistic intelligence. A natural astrologer, writer, or mathematician. Gifted communicator children.', kn: 'Mercury in the 5th from Karakamsha: exceptional mathematical ability, oratory, writing, and linguistic intelligence. A natural astrologer, writer, or mathematician. Gifted communicator children.', gu: 'Mercury in the 5th from Karakamsha: exceptional mathematical ability, oratory, writing, and linguistic intelligence. A natural astrologer, writer, or mathematician. Gifted communicator children.' }],
    [6, satSign, { en: 'Saturn in 5H from Karakamsha — Research & Depth Intelligence', hi: 'कारकांश से 5H में शनि — शोध बुद्धि', sa: 'कारकांश से 5H में शनि — शोध बुद्धि', mai: 'कारकांश से 5H में शनि — शोध बुद्धि', mr: 'कारकांश से 5H में शनि — शोध बुद्धि', ta: 'Saturn in 5H from Karakamsha — Research & Depth Intelligence', te: 'Saturn in 5H from Karakamsha — Research & Depth Intelligence', bn: 'Saturn in 5H from Karakamsha — Research & Depth Intelligence', kn: 'Saturn in 5H from Karakamsha — Research & Depth Intelligence', gu: 'Saturn in 5H from Karakamsha — Research & Depth Intelligence' },
      { en: 'Saturn in the 5th from Karakamsha: slow but deep intelligence — excels in research, philosophy, occult sciences, and systematic study. Children may arrive late or be few but significant.', hi: 'कारकांश से 5H में शनि: धीर लेकिन गहरी बुद्धि, शोध, दर्शन, गुप्त विज्ञान में उत्कृष्टता।', sa: 'कारकांश से 5H में शनि: धीर लेकिन गहरी बुद्धि, शोध, दर्शन, गुप्त विज्ञान में उत्कृष्टता।', mai: 'कारकांश से 5H में शनि: धीर लेकिन गहरी बुद्धि, शोध, दर्शन, गुप्त विज्ञान में उत्कृष्टता।', mr: 'कारकांश से 5H में शनि: धीर लेकिन गहरी बुद्धि, शोध, दर्शन, गुप्त विज्ञान में उत्कृष्टता।', ta: 'Saturn in the 5th from Karakamsha: slow but deep intelligence — excels in research, philosophy, occult sciences, and systematic study. Children may arrive late or be few but significant.', te: 'Saturn in the 5th from Karakamsha: slow but deep intelligence — excels in research, philosophy, occult sciences, and systematic study. Children may arrive late or be few but significant.', bn: 'Saturn in the 5th from Karakamsha: slow but deep intelligence — excels in research, philosophy, occult sciences, and systematic study. Children may arrive late or be few but significant.', kn: 'Saturn in the 5th from Karakamsha: slow but deep intelligence — excels in research, philosophy, occult sciences, and systematic study. Children may arrive late or be few but significant.', gu: 'Saturn in the 5th from Karakamsha: slow but deep intelligence — excels in research, philosophy, occult sciences, and systematic study. Children may arrive late or be few but significant.' }],
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
    [0, sunSign, { en: 'Sun in 7H from Karakamsha — Prominent Spouse', hi: 'कारकांश से 7H में सूर्य — प्रतिष्ठित जीवनसाथी', sa: 'कारकांश से 7H में सूर्य — प्रतिष्ठित जीवनसाथी', mai: 'कारकांश से 7H में सूर्य — प्रतिष्ठित जीवनसाथी', mr: 'कारकांश से 7H में सूर्य — प्रतिष्ठित जीवनसाथी', ta: 'Sun in 7H from Karakamsha — Prominent Spouse', te: 'Sun in 7H from Karakamsha — Prominent Spouse', bn: 'Sun in 7H from Karakamsha — Prominent Spouse', kn: 'Sun in 7H from Karakamsha — Prominent Spouse', gu: 'Sun in 7H from Karakamsha — Prominent Spouse' },
      { en: 'Sun in the 7th from Karakamsha: an authoritative, prominent spouse — government servant, executive, or someone with natural command. The relationship brings social status.', hi: 'कारकांश से 7H में सूर्य: प्रतिष्ठित जीवनसाथी — सरकारी अधिकारी या कार्यकारी।', sa: 'कारकांश से 7H में सूर्य: प्रतिष्ठित जीवनसाथी — सरकारी अधिकारी या कार्यकारी।', mai: 'कारकांश से 7H में सूर्य: प्रतिष्ठित जीवनसाथी — सरकारी अधिकारी या कार्यकारी।', mr: 'कारकांश से 7H में सूर्य: प्रतिष्ठित जीवनसाथी — सरकारी अधिकारी या कार्यकारी।', ta: 'Sun in the 7th from Karakamsha: an authoritative, prominent spouse — government servant, executive, or someone with natural command. The relationship brings social status.', te: 'Sun in the 7th from Karakamsha: an authoritative, prominent spouse — government servant, executive, or someone with natural command. The relationship brings social status.', bn: 'Sun in the 7th from Karakamsha: an authoritative, prominent spouse — government servant, executive, or someone with natural command. The relationship brings social status.', kn: 'Sun in the 7th from Karakamsha: an authoritative, prominent spouse — government servant, executive, or someone with natural command. The relationship brings social status.', gu: 'Sun in the 7th from Karakamsha: an authoritative, prominent spouse — government servant, executive, or someone with natural command. The relationship brings social status.' }],
    [1, moonSign, { en: 'Moon in 7H from Karakamsha — Beautiful & Emotional Spouse', hi: 'कारकांश से 7H में चंद्र — सुन्दर जीवनसाथी', sa: 'कारकांश से 7H में चंद्र — सुन्दर जीवनसाथी', mai: 'कारकांश से 7H में चंद्र — सुन्दर जीवनसाथी', mr: 'कारकांश से 7H में चंद्र — सुन्दर जीवनसाथी', ta: 'Moon in 7H from Karakamsha — Beautiful & Emotional Spouse', te: 'Moon in 7H from Karakamsha — Beautiful & Emotional Spouse', bn: 'Moon in 7H from Karakamsha — Beautiful & Emotional Spouse', kn: 'Moon in 7H from Karakamsha — Beautiful & Emotional Spouse', gu: 'Moon in 7H from Karakamsha — Beautiful & Emotional Spouse' },
      { en: 'Moon in the 7th from Karakamsha: an attractive, emotionally rich spouse. The partner is nurturing, publicly loved, and possibly connected to trade or public life.', hi: 'कारकांश से 7H में चंद्र: आकर्षक, भावनात्मक रूप से समृद्ध जीवनसाथी।', sa: 'कारकांश से 7H में चंद्र: आकर्षक, भावनात्मक रूप से समृद्ध जीवनसाथी।', mai: 'कारकांश से 7H में चंद्र: आकर्षक, भावनात्मक रूप से समृद्ध जीवनसाथी।', mr: 'कारकांश से 7H में चंद्र: आकर्षक, भावनात्मक रूप से समृद्ध जीवनसाथी।', ta: 'Moon in the 7th from Karakamsha: an attractive, emotionally rich spouse. The partner is nurturing, publicly loved, and possibly connected to trade or public life.', te: 'Moon in the 7th from Karakamsha: an attractive, emotionally rich spouse. The partner is nurturing, publicly loved, and possibly connected to trade or public life.', bn: 'Moon in the 7th from Karakamsha: an attractive, emotionally rich spouse. The partner is nurturing, publicly loved, and possibly connected to trade or public life.', kn: 'Moon in the 7th from Karakamsha: an attractive, emotionally rich spouse. The partner is nurturing, publicly loved, and possibly connected to trade or public life.', gu: 'Moon in the 7th from Karakamsha: an attractive, emotionally rich spouse. The partner is nurturing, publicly loved, and possibly connected to trade or public life.' }],
    [2, marsSign, { en: 'Mars in 7H from Karakamsha — Athletic or Volatile Spouse', hi: 'कारकांश से 7H में मंगल — ऊर्जावान जीवनसाथी', sa: 'कारकांश से 7H में मंगल — ऊर्जावान जीवनसाथी', mai: 'कारकांश से 7H में मंगल — ऊर्जावान जीवनसाथी', mr: 'कारकांश से 7H में मंगल — ऊर्जावान जीवनसाथी', ta: 'Mars in 7H from Karakamsha — Athletic or Volatile Spouse', te: 'Mars in 7H from Karakamsha — Athletic or Volatile Spouse', bn: 'Mars in 7H from Karakamsha — Athletic or Volatile Spouse', kn: 'Mars in 7H from Karakamsha — Athletic or Volatile Spouse', gu: 'Mars in 7H from Karakamsha — Athletic or Volatile Spouse' },
      { en: 'Mars in the 7th from Karakamsha: a physically strong, courageous, or militaristic spouse. The marriage may involve friction — both parties are spirited and independent.', hi: 'कारकांश से 7H में मंगल: शारीरिक रूप से मजबूत, साहसी जीवनसाथी। विवाह में घर्षण संभव।', sa: 'कारकांश से 7H में मंगल: शारीरिक रूप से मजबूत, साहसी जीवनसाथी। विवाह में घर्षण संभव।', mai: 'कारकांश से 7H में मंगल: शारीरिक रूप से मजबूत, साहसी जीवनसाथी। विवाह में घर्षण संभव।', mr: 'कारकांश से 7H में मंगल: शारीरिक रूप से मजबूत, साहसी जीवनसाथी। विवाह में घर्षण संभव।', ta: 'Mars in the 7th from Karakamsha: a physically strong, courageous, or militaristic spouse. The marriage may involve friction — both parties are spirited and independent.', te: 'Mars in the 7th from Karakamsha: a physically strong, courageous, or militaristic spouse. The marriage may involve friction — both parties are spirited and independent.', bn: 'Mars in the 7th from Karakamsha: a physically strong, courageous, or militaristic spouse. The marriage may involve friction — both parties are spirited and independent.', kn: 'Mars in the 7th from Karakamsha: a physically strong, courageous, or militaristic spouse. The marriage may involve friction — both parties are spirited and independent.', gu: 'Mars in the 7th from Karakamsha: a physically strong, courageous, or militaristic spouse. The marriage may involve friction — both parties are spirited and independent.' }],
    [3, mercSign, { en: 'Mercury in 7H from Karakamsha — Intelligent & Communicative Spouse', hi: 'कारकांश से 7H में बुध — बुद्धिमान जीवनसाथी', sa: 'कारकांश से 7H में बुध — बुद्धिमान जीवनसाथी', mai: 'कारकांश से 7H में बुध — बुद्धिमान जीवनसाथी', mr: 'कारकांश से 7H में बुध — बुद्धिमान जीवनसाथी', ta: 'Mercury in 7H from Karakamsha — Intelligent & Communicative Spouse', te: 'Mercury in 7H from Karakamsha — Intelligent & Communicative Spouse', bn: 'Mercury in 7H from Karakamsha — Intelligent & Communicative Spouse', kn: 'Mercury in 7H from Karakamsha — Intelligent & Communicative Spouse', gu: 'Mercury in 7H from Karakamsha — Intelligent & Communicative Spouse' },
      { en: 'Mercury in the 7th from Karakamsha: a witty, educated, and communicative spouse. The relationship thrives on intellectual exchange and shared learning.', hi: 'कारकांश से 7H में बुध: चतुर, शिक्षित, संवादशील जीवनसाथी।', sa: 'कारकांश से 7H में बुध: चतुर, शिक्षित, संवादशील जीवनसाथी।', mai: 'कारकांश से 7H में बुध: चतुर, शिक्षित, संवादशील जीवनसाथी।', mr: 'कारकांश से 7H में बुध: चतुर, शिक्षित, संवादशील जीवनसाथी।', ta: 'Mercury in the 7th from Karakamsha: a witty, educated, and communicative spouse. The relationship thrives on intellectual exchange and shared learning.', te: 'Mercury in the 7th from Karakamsha: a witty, educated, and communicative spouse. The relationship thrives on intellectual exchange and shared learning.', bn: 'Mercury in the 7th from Karakamsha: a witty, educated, and communicative spouse. The relationship thrives on intellectual exchange and shared learning.', kn: 'Mercury in the 7th from Karakamsha: a witty, educated, and communicative spouse. The relationship thrives on intellectual exchange and shared learning.', gu: 'Mercury in the 7th from Karakamsha: a witty, educated, and communicative spouse. The relationship thrives on intellectual exchange and shared learning.' }],
    [6, satSign, { en: 'Saturn in 7H from Karakamsha — Mature or Delayed Marriage', hi: 'कारकांश से 7H में शनि — परिपक्व विवाह', sa: 'कारकांश से 7H में शनि — परिपक्व विवाह', mai: 'कारकांश से 7H में शनि — परिपक्व विवाह', mr: 'कारकांश से 7H में शनि — परिपक्व विवाह', ta: 'Saturn in 7H from Karakamsha — Mature or Delayed Marriage', te: 'Saturn in 7H from Karakamsha — Mature or Delayed Marriage', bn: 'Saturn in 7H from Karakamsha — Mature or Delayed Marriage', kn: 'Saturn in 7H from Karakamsha — Mature or Delayed Marriage', gu: 'Saturn in 7H from Karakamsha — Mature or Delayed Marriage' },
      { en: 'Saturn in the 7th from Karakamsha: marriage may be delayed or to an older/more serious partner. The relationship deepens with age and is built on mutual duty and reliability.', hi: 'कारकांश से 7H में शनि: विवाह में विलंब या अधिक परिपक्व जीवनसाथी। संबंध कर्तव्य पर बनता है।', sa: 'कारकांश से 7H में शनि: विवाह में विलंब या अधिक परिपक्व जीवनसाथी। संबंध कर्तव्य पर बनता है।', mai: 'कारकांश से 7H में शनि: विवाह में विलंब या अधिक परिपक्व जीवनसाथी। संबंध कर्तव्य पर बनता है।', mr: 'कारकांश से 7H में शनि: विवाह में विलंब या अधिक परिपक्व जीवनसाथी। संबंध कर्तव्य पर बनता है।', ta: 'Saturn in the 7th from Karakamsha: marriage may be delayed or to an older/more serious partner. The relationship deepens with age and is built on mutual duty and reliability.', te: 'Saturn in the 7th from Karakamsha: marriage may be delayed or to an older/more serious partner. The relationship deepens with age and is built on mutual duty and reliability.', bn: 'Saturn in the 7th from Karakamsha: marriage may be delayed or to an older/more serious partner. The relationship deepens with age and is built on mutual duty and reliability.', kn: 'Saturn in the 7th from Karakamsha: marriage may be delayed or to an older/more serious partner. The relationship deepens with age and is built on mutual duty and reliability.', gu: 'Saturn in the 7th from Karakamsha: marriage may be delayed or to an older/more serious partner. The relationship deepens with age and is built on mutual duty and reliability.' }],
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
    [4, jupSign, { en: 'Jupiter in 8H from Karakamsha — Longevity & Wisdom', hi: 'कारकांश से 8H में बृहस्पति — दीर्घायु', sa: 'कारकांश से 8H में बृहस्पति — दीर्घायु', mai: 'कारकांश से 8H में बृहस्पति — दीर्घायु', mr: 'कारकांश से 8H में बृहस्पति — दीर्घायु', ta: 'Jupiter in 8H from Karakamsha — Longevity & Wisdom', te: 'Jupiter in 8H from Karakamsha — Longevity & Wisdom', bn: 'Jupiter in 8H from Karakamsha — Longevity & Wisdom', kn: 'Jupiter in 8H from Karakamsha — Longevity & Wisdom', gu: 'Jupiter in 8H from Karakamsha — Longevity & Wisdom' },
      { en: 'Jupiter in the 8th from Karakamsha: long life, deep spiritual transformation, and wisdom through crisis. The soul learns profound lessons through loss and regeneration.', hi: 'कारकांश से 8H में बृहस्पति: दीर्घायु, गहरा आध्यात्मिक परिवर्तन, संकट से ज्ञान।', sa: 'कारकांश से 8H में बृहस्पति: दीर्घायु, गहरा आध्यात्मिक परिवर्तन, संकट से ज्ञान।', mai: 'कारकांश से 8H में बृहस्पति: दीर्घायु, गहरा आध्यात्मिक परिवर्तन, संकट से ज्ञान।', mr: 'कारकांश से 8H में बृहस्पति: दीर्घायु, गहरा आध्यात्मिक परिवर्तन, संकट से ज्ञान।', ta: 'Jupiter in the 8th from Karakamsha: long life, deep spiritual transformation, and wisdom through crisis. The soul learns profound lessons through loss and regeneration.', te: 'Jupiter in the 8th from Karakamsha: long life, deep spiritual transformation, and wisdom through crisis. The soul learns profound lessons through loss and regeneration.', bn: 'Jupiter in the 8th from Karakamsha: long life, deep spiritual transformation, and wisdom through crisis. The soul learns profound lessons through loss and regeneration.', kn: 'Jupiter in the 8th from Karakamsha: long life, deep spiritual transformation, and wisdom through crisis. The soul learns profound lessons through loss and regeneration.', gu: 'Jupiter in the 8th from Karakamsha: long life, deep spiritual transformation, and wisdom through crisis. The soul learns profound lessons through loss and regeneration.' }],
    [2, marsSign, { en: 'Mars in 8H from Karakamsha — Surgery & Transformation', hi: 'कारकांश से 8H में मंगल — शल्य व परिवर्तन', sa: 'कारकांश से 8H में मंगल — शल्य व परिवर्तन', mai: 'कारकांश से 8H में मंगल — शल्य व परिवर्तन', mr: 'कारकांश से 8H में मंगल — शल्य व परिवर्तन', ta: 'Mars in 8H from Karakamsha — Surgery & Transformation', te: 'Mars in 8H from Karakamsha — Surgery & Transformation', bn: 'Mars in 8H from Karakamsha — Surgery & Transformation', kn: 'Mars in 8H from Karakamsha — Surgery & Transformation', gu: 'Mars in 8H from Karakamsha — Surgery & Transformation' },
      { en: 'Mars in the 8th from Karakamsha: the soul works with the body through surgery, wounds, or martial transformation. A powerful indicator for surgeons, military officers, or those who transmute physical crisis.', hi: 'कारकांश से 8H में मंगल: शल्य चिकित्सा, घाव या मार्शल परिवर्तन। सर्जन या सैन्य अधिकारी का संकेत।', sa: 'कारकांश से 8H में मंगल: शल्य चिकित्सा, घाव या मार्शल परिवर्तन। सर्जन या सैन्य अधिकारी का संकेत।', mai: 'कारकांश से 8H में मंगल: शल्य चिकित्सा, घाव या मार्शल परिवर्तन। सर्जन या सैन्य अधिकारी का संकेत।', mr: 'कारकांश से 8H में मंगल: शल्य चिकित्सा, घाव या मार्शल परिवर्तन। सर्जन या सैन्य अधिकारी का संकेत।', ta: 'Mars in the 8th from Karakamsha: the soul works with the body through surgery, wounds, or martial transformation. A powerful indicator for surgeons, military officers, or those who transmute physical crisis.', te: 'Mars in the 8th from Karakamsha: the soul works with the body through surgery, wounds, or martial transformation. A powerful indicator for surgeons, military officers, or those who transmute physical crisis.', bn: 'Mars in the 8th from Karakamsha: the soul works with the body through surgery, wounds, or martial transformation. A powerful indicator for surgeons, military officers, or those who transmute physical crisis.', kn: 'Mars in the 8th from Karakamsha: the soul works with the body through surgery, wounds, or martial transformation. A powerful indicator for surgeons, military officers, or those who transmute physical crisis.', gu: 'Mars in the 8th from Karakamsha: the soul works with the body through surgery, wounds, or martial transformation. A powerful indicator for surgeons, military officers, or those who transmute physical crisis.' }],
    [6, satSign, { en: 'Saturn in 8H from Karakamsha — Endurance & Research', hi: 'कारकांश से 8H में शनि — सहनशक्ति एवं शोध', sa: 'कारकांश से 8H में शनि — सहनशक्ति एवं शोध', mai: 'कारकांश से 8H में शनि — सहनशक्ति एवं शोध', mr: 'कारकांश से 8H में शनि — सहनशक्ति एवं शोध', ta: 'Saturn in 8H from Karakamsha — Endurance & Research', te: 'Saturn in 8H from Karakamsha — Endurance & Research', bn: 'Saturn in 8H from Karakamsha — Endurance & Research', kn: 'Saturn in 8H from Karakamsha — Endurance & Research', gu: 'Saturn in 8H from Karakamsha — Endurance & Research' },
      { en: 'Saturn in the 8th from Karakamsha: this soul endures chronic hardship and emerges stronger. Proficiency in research, mining, deep investigation, and occult sciences. Long life through sheer endurance.', hi: 'कारकांश से 8H में शनि: दीर्घकालिक कष्ट सहने के बाद मजबूती। खनन, गहरी जांच, गुप्त विज्ञान में प्रवीणता।', sa: 'कारकांश से 8H में शनि: दीर्घकालिक कष्ट सहने के बाद मजबूती। खनन, गहरी जांच, गुप्त विज्ञान में प्रवीणता।', mai: 'कारकांश से 8H में शनि: दीर्घकालिक कष्ट सहने के बाद मजबूती। खनन, गहरी जांच, गुप्त विज्ञान में प्रवीणता।', mr: 'कारकांश से 8H में शनि: दीर्घकालिक कष्ट सहने के बाद मजबूती। खनन, गहरी जांच, गुप्त विज्ञान में प्रवीणता।', ta: 'Saturn in the 8th from Karakamsha: this soul endures chronic hardship and emerges stronger. Proficiency in research, mining, deep investigation, and occult sciences. Long life through sheer endurance.', te: 'Saturn in the 8th from Karakamsha: this soul endures chronic hardship and emerges stronger. Proficiency in research, mining, deep investigation, and occult sciences. Long life through sheer endurance.', bn: 'Saturn in the 8th from Karakamsha: this soul endures chronic hardship and emerges stronger. Proficiency in research, mining, deep investigation, and occult sciences. Long life through sheer endurance.', kn: 'Saturn in the 8th from Karakamsha: this soul endures chronic hardship and emerges stronger. Proficiency in research, mining, deep investigation, and occult sciences. Long life through sheer endurance.', gu: 'Saturn in the 8th from Karakamsha: this soul endures chronic hardship and emerges stronger. Proficiency in research, mining, deep investigation, and occult sciences. Long life through sheer endurance.' }],
    [1, moonSign, { en: 'Moon in 8H from Karakamsha — Psychic Depth', hi: 'कारकांश से 8H में चंद्र — मानसिक गहराई', sa: 'कारकांश से 8H में चंद्र — मानसिक गहराई', mai: 'कारकांश से 8H में चंद्र — मानसिक गहराई', mr: 'कारकांश से 8H में चंद्र — मानसिक गहराई', ta: 'Moon in 8H from Karakamsha — Psychic Depth', te: 'Moon in 8H from Karakamsha — Psychic Depth', bn: 'Moon in 8H from Karakamsha — Psychic Depth', kn: 'Moon in 8H from Karakamsha — Psychic Depth', gu: 'Moon in 8H from Karakamsha — Psychic Depth' },
      { en: 'Moon in the 8th from Karakamsha: heightened psychic sensitivity, hidden knowledge, and emotional depth that borders on mysticism. This soul works with the unseen and the hidden.', hi: 'कारकांश से 8H में चंद्र: तीव्र मानसिक संवेदनशीलता, छुपा ज्ञान, गूढ़ता की सीमा पर भावनात्मक गहराई।', sa: 'कारकांश से 8H में चंद्र: तीव्र मानसिक संवेदनशीलता, छुपा ज्ञान, गूढ़ता की सीमा पर भावनात्मक गहराई।', mai: 'कारकांश से 8H में चंद्र: तीव्र मानसिक संवेदनशीलता, छुपा ज्ञान, गूढ़ता की सीमा पर भावनात्मक गहराई।', mr: 'कारकांश से 8H में चंद्र: तीव्र मानसिक संवेदनशीलता, छुपा ज्ञान, गूढ़ता की सीमा पर भावनात्मक गहराई।', ta: 'Moon in the 8th from Karakamsha: heightened psychic sensitivity, hidden knowledge, and emotional depth that borders on mysticism. This soul works with the unseen and the hidden.', te: 'Moon in the 8th from Karakamsha: heightened psychic sensitivity, hidden knowledge, and emotional depth that borders on mysticism. This soul works with the unseen and the hidden.', bn: 'Moon in the 8th from Karakamsha: heightened psychic sensitivity, hidden knowledge, and emotional depth that borders on mysticism. This soul works with the unseen and the hidden.', kn: 'Moon in the 8th from Karakamsha: heightened psychic sensitivity, hidden knowledge, and emotional depth that borders on mysticism. This soul works with the unseen and the hidden.', gu: 'Moon in the 8th from Karakamsha: heightened psychic sensitivity, hidden knowledge, and emotional depth that borders on mysticism. This soul works with the unseen and the hidden.' }],
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
    [0, sunSign, { en: 'Sun in 10H from Karakamsha — Political Authority', hi: 'कारकांश से 10H में सूर्य — राजनीतिक अधिकार', sa: 'कारकांश से 10H में सूर्य — राजनीतिक अधिकार', mai: 'कारकांश से 10H में सूर्य — राजनीतिक अधिकार', mr: 'कारकांश से 10H में सूर्य — राजनीतिक अधिकार', ta: 'Sun in 10H from Karakamsha — Political Authority', te: 'Sun in 10H from Karakamsha — Political Authority', bn: 'Sun in 10H from Karakamsha — Political Authority', kn: 'Sun in 10H from Karakamsha — Political Authority', gu: 'Sun in 10H from Karakamsha — Political Authority' },
      { en: 'Sun in the 10th from Karakamsha: the soul is destined for political or governmental authority. High public office, administration, or leadership is the karma-purpose of this lifetime.', hi: 'कारकांश से 10H में सूर्य: आत्मा राजनीतिक या सरकारी अधिकार के लिए नियत है।', sa: 'कारकांश से 10H में सूर्य: आत्मा राजनीतिक या सरकारी अधिकार के लिए नियत है।', mai: 'कारकांश से 10H में सूर्य: आत्मा राजनीतिक या सरकारी अधिकार के लिए नियत है।', mr: 'कारकांश से 10H में सूर्य: आत्मा राजनीतिक या सरकारी अधिकार के लिए नियत है।', ta: 'Sun in the 10th from Karakamsha: the soul is destined for political or governmental authority. High public office, administration, or leadership is the karma-purpose of this lifetime.', te: 'Sun in the 10th from Karakamsha: the soul is destined for political or governmental authority. High public office, administration, or leadership is the karma-purpose of this lifetime.', bn: 'Sun in the 10th from Karakamsha: the soul is destined for political or governmental authority. High public office, administration, or leadership is the karma-purpose of this lifetime.', kn: 'Sun in the 10th from Karakamsha: the soul is destined for political or governmental authority. High public office, administration, or leadership is the karma-purpose of this lifetime.', gu: 'Sun in the 10th from Karakamsha: the soul is destined for political or governmental authority. High public office, administration, or leadership is the karma-purpose of this lifetime.' }],
    [4, jupSign, { en: 'Jupiter in 10H from Karakamsha — Teacher & Advisor', hi: 'कारकांश से 10H में बृहस्पति — गुरु एवं सलाहकार', sa: 'कारकांश से 10H में बृहस्पति — गुरु एवं सलाहकार', mai: 'कारकांश से 10H में बृहस्पति — गुरु एवं सलाहकार', mr: 'कारकांश से 10H में बृहस्पति — गुरु एवं सलाहकार', ta: 'Jupiter in 10H from Karakamsha — Teacher & Advisor', te: 'Jupiter in 10H from Karakamsha — Teacher & Advisor', bn: 'Jupiter in 10H from Karakamsha — Teacher & Advisor', kn: 'Jupiter in 10H from Karakamsha — Teacher & Advisor', gu: 'Jupiter in 10H from Karakamsha — Teacher & Advisor' },
      { en: 'Jupiter in the 10th from Karakamsha: the professional karma is that of teacher, priest, philosopher, or advisor. This soul fulfills its purpose by guiding others toward wisdom.', hi: 'कारकांश से 10H में बृहस्पति: गुरु, पुजारी, दार्शनिक या सलाहकार का कर्म।', sa: 'कारकांश से 10H में बृहस्पति: गुरु, पुजारी, दार्शनिक या सलाहकार का कर्म।', mai: 'कारकांश से 10H में बृहस्पति: गुरु, पुजारी, दार्शनिक या सलाहकार का कर्म।', mr: 'कारकांश से 10H में बृहस्पति: गुरु, पुजारी, दार्शनिक या सलाहकार का कर्म।', ta: 'Jupiter in the 10th from Karakamsha: the professional karma is that of teacher, priest, philosopher, or advisor. This soul fulfills its purpose by guiding others toward wisdom.', te: 'Jupiter in the 10th from Karakamsha: the professional karma is that of teacher, priest, philosopher, or advisor. This soul fulfills its purpose by guiding others toward wisdom.', bn: 'Jupiter in the 10th from Karakamsha: the professional karma is that of teacher, priest, philosopher, or advisor. This soul fulfills its purpose by guiding others toward wisdom.', kn: 'Jupiter in the 10th from Karakamsha: the professional karma is that of teacher, priest, philosopher, or advisor. This soul fulfills its purpose by guiding others toward wisdom.', gu: 'Jupiter in the 10th from Karakamsha: the professional karma is that of teacher, priest, philosopher, or advisor. This soul fulfills its purpose by guiding others toward wisdom.' }],
    [6, satSign, { en: 'Saturn in 10H from Karakamsha — Builder Through Discipline', hi: 'कारकांश से 10H में शनि — अनुशासन से निर्माता', sa: 'कारकांश से 10H में शनि — अनुशासन से निर्माता', mai: 'कारकांश से 10H में शनि — अनुशासन से निर्माता', mr: 'कारकांश से 10H में शनि — अनुशासन से निर्माता', ta: 'Saturn in 10H from Karakamsha — Builder Through Discipline', te: 'Saturn in 10H from Karakamsha — Builder Through Discipline', bn: 'Saturn in 10H from Karakamsha — Builder Through Discipline', kn: 'Saturn in 10H from Karakamsha — Builder Through Discipline', gu: 'Saturn in 10H from Karakamsha — Builder Through Discipline' },
      { en: 'Saturn in the 10th from Karakamsha: the soul rises through persistent, disciplined work. Late career success, heavy karmic responsibilities, but ultimately a lasting legacy through sheer endurance.', hi: 'कारकांश से 10H में शनि: निरंतर, अनुशासित कार्य से उत्थान। देर से करियर सफलता, स्थायी विरासत।', sa: 'कारकांश से 10H में शनि: निरंतर, अनुशासित कार्य से उत्थान। देर से करियर सफलता, स्थायी विरासत।', mai: 'कारकांश से 10H में शनि: निरंतर, अनुशासित कार्य से उत्थान। देर से करियर सफलता, स्थायी विरासत।', mr: 'कारकांश से 10H में शनि: निरंतर, अनुशासित कार्य से उत्थान। देर से करियर सफलता, स्थायी विरासत।', ta: 'Saturn in the 10th from Karakamsha: the soul rises through persistent, disciplined work. Late career success, heavy karmic responsibilities, but ultimately a lasting legacy through sheer endurance.', te: 'Saturn in the 10th from Karakamsha: the soul rises through persistent, disciplined work. Late career success, heavy karmic responsibilities, but ultimately a lasting legacy through sheer endurance.', bn: 'Saturn in the 10th from Karakamsha: the soul rises through persistent, disciplined work. Late career success, heavy karmic responsibilities, but ultimately a lasting legacy through sheer endurance.', kn: 'Saturn in the 10th from Karakamsha: the soul rises through persistent, disciplined work. Late career success, heavy karmic responsibilities, but ultimately a lasting legacy through sheer endurance.', gu: 'Saturn in the 10th from Karakamsha: the soul rises through persistent, disciplined work. Late career success, heavy karmic responsibilities, but ultimately a lasting legacy through sheer endurance.' }],
    [2, marsSign, { en: 'Mars in 10H from Karakamsha — Military & Technical Karma', hi: 'कारकांश से 10H में मंगल — सैन्य एवं तकनीकी कर्म', sa: 'कारकांश से 10H में मंगल — सैन्य एवं तकनीकी कर्म', mai: 'कारकांश से 10H में मंगल — सैन्य एवं तकनीकी कर्म', mr: 'कारकांश से 10H में मंगल — सैन्य एवं तकनीकी कर्म', ta: 'Mars in 10H from Karakamsha — Military & Technical Karma', te: 'Mars in 10H from Karakamsha — Military & Technical Karma', bn: 'Mars in 10H from Karakamsha — Military & Technical Karma', kn: 'Mars in 10H from Karakamsha — Military & Technical Karma', gu: 'Mars in 10H from Karakamsha — Military & Technical Karma' },
      { en: 'Mars in the 10th from Karakamsha: the soul fulfills its dharma through the military, police, engineering, or competitive sports. Action and precision are the professional hallmarks.', hi: 'कारकांश से 10H में मंगल: सेना, पुलिस, इंजीनियरिंग या प्रतिस्पर्धी खेल में कर्म पूर्ति।', sa: 'कारकांश से 10H में मंगल: सेना, पुलिस, इंजीनियरिंग या प्रतिस्पर्धी खेल में कर्म पूर्ति।', mai: 'कारकांश से 10H में मंगल: सेना, पुलिस, इंजीनियरिंग या प्रतिस्पर्धी खेल में कर्म पूर्ति।', mr: 'कारकांश से 10H में मंगल: सेना, पुलिस, इंजीनियरिंग या प्रतिस्पर्धी खेल में कर्म पूर्ति।', ta: 'Mars in the 10th from Karakamsha: the soul fulfills its dharma through the military, police, engineering, or competitive sports. Action and precision are the professional hallmarks.', te: 'Mars in the 10th from Karakamsha: the soul fulfills its dharma through the military, police, engineering, or competitive sports. Action and precision are the professional hallmarks.', bn: 'Mars in the 10th from Karakamsha: the soul fulfills its dharma through the military, police, engineering, or competitive sports. Action and precision are the professional hallmarks.', kn: 'Mars in the 10th from Karakamsha: the soul fulfills its dharma through the military, police, engineering, or competitive sports. Action and precision are the professional hallmarks.', gu: 'Mars in the 10th from Karakamsha: the soul fulfills its dharma through the military, police, engineering, or competitive sports. Action and precision are the professional hallmarks.' }],
    [3, mercSign, { en: 'Mercury in 10H from Karakamsha — Commerce & Writing Karma', hi: 'कारकांश से 10H में बुध — वाणिज्य एवं लेखन कर्म', sa: 'कारकांश से 10H में बुध — वाणिज्य एवं लेखन कर्म', mai: 'कारकांश से 10H में बुध — वाणिज्य एवं लेखन कर्म', mr: 'कारकांश से 10H में बुध — वाणिज्य एवं लेखन कर्म', ta: 'Mercury in 10H from Karakamsha — Commerce & Writing Karma', te: 'Mercury in 10H from Karakamsha — Commerce & Writing Karma', bn: 'Mercury in 10H from Karakamsha — Commerce & Writing Karma', kn: 'Mercury in 10H from Karakamsha — Commerce & Writing Karma', gu: 'Mercury in 10H from Karakamsha — Commerce & Writing Karma' },
      { en: 'Mercury in the 10th from Karakamsha: the soul fulfills its karma through business, writing, communication, or financial services. Versatile professional who succeeds through intelligence and adaptability.', hi: 'कारकांश से 10H में बुध: व्यापार, लेखन, संचार या वित्तीय सेवाओं से कर्म पूर्ति।', sa: 'कारकांश से 10H में बुध: व्यापार, लेखन, संचार या वित्तीय सेवाओं से कर्म पूर्ति।', mai: 'कारकांश से 10H में बुध: व्यापार, लेखन, संचार या वित्तीय सेवाओं से कर्म पूर्ति।', mr: 'कारकांश से 10H में बुध: व्यापार, लेखन, संचार या वित्तीय सेवाओं से कर्म पूर्ति।', ta: 'Mercury in the 10th from Karakamsha: the soul fulfills its karma through business, writing, communication, or financial services. Versatile professional who succeeds through intelligence and adaptability.', te: 'Mercury in the 10th from Karakamsha: the soul fulfills its karma through business, writing, communication, or financial services. Versatile professional who succeeds through intelligence and adaptability.', bn: 'Mercury in the 10th from Karakamsha: the soul fulfills its karma through business, writing, communication, or financial services. Versatile professional who succeeds through intelligence and adaptability.', kn: 'Mercury in the 10th from Karakamsha: the soul fulfills its karma through business, writing, communication, or financial services. Versatile professional who succeeds through intelligence and adaptability.', gu: 'Mercury in the 10th from Karakamsha: the soul fulfills its karma through business, writing, communication, or financial services. Versatile professional who succeeds through intelligence and adaptability.' }],
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
    [4, 5, jupSign, venusSign, { en: 'Jupiter + Venus in Karakamsha Trikona — Srinatha Yoga', hi: 'कारकांश त्रिकोण में बृहस्पति + शुक्र — श्रीनाथ योग', sa: 'कारकांश त्रिकोण में बृहस्पति + शुक्र — श्रीनाथ योग', mai: 'कारकांश त्रिकोण में बृहस्पति + शुक्र — श्रीनाथ योग', mr: 'कारकांश त्रिकोण में बृहस्पति + शुक्र — श्रीनाथ योग', ta: 'Jupiter + Venus in Karakamsha Trikona — Srinatha Yoga', te: 'Jupiter + Venus in Karakamsha Trikona — Srinatha Yoga', bn: 'Jupiter + Venus in Karakamsha Trikona — Srinatha Yoga', kn: 'Jupiter + Venus in Karakamsha Trikona — Srinatha Yoga', gu: 'Jupiter + Venus in Karakamsha Trikona — Srinatha Yoga' },
      { en: 'Jupiter and Venus together in a trikona from Karakamsha — Srinatha Yoga. This rare combination blesses the soul with great wealth, luxury, wisdom, and dharmic prosperity. A life of material and spiritual abundance simultaneously.', hi: 'कारकांश त्रिकोण में बृहस्पति और शुक्र — श्रीनाथ योग। दुर्लभ संयोग — धन, विलासिता, ज्ञान और धार्मिक समृद्धि।', sa: 'कारकांश त्रिकोण में बृहस्पति और शुक्र — श्रीनाथ योग। दुर्लभ संयोग — धन, विलासिता, ज्ञान और धार्मिक समृद्धि।', mai: 'कारकांश त्रिकोण में बृहस्पति और शुक्र — श्रीनाथ योग। दुर्लभ संयोग — धन, विलासिता, ज्ञान और धार्मिक समृद्धि।', mr: 'कारकांश त्रिकोण में बृहस्पति और शुक्र — श्रीनाथ योग। दुर्लभ संयोग — धन, विलासिता, ज्ञान और धार्मिक समृद्धि।', ta: 'Jupiter and Venus together in a trikona from Karakamsha — Srinatha Yoga. This rare combination blesses the soul with great wealth, luxury, wisdom, and dharmic prosperity. A life of material and spiritual abundance simultaneously.', te: 'Jupiter and Venus together in a trikona from Karakamsha — Srinatha Yoga. This rare combination blesses the soul with great wealth, luxury, wisdom, and dharmic prosperity. A life of material and spiritual abundance simultaneously.', bn: 'Jupiter and Venus together in a trikona from Karakamsha — Srinatha Yoga. This rare combination blesses the soul with great wealth, luxury, wisdom, and dharmic prosperity. A life of material and spiritual abundance simultaneously.', kn: 'Jupiter and Venus together in a trikona from Karakamsha — Srinatha Yoga. This rare combination blesses the soul with great wealth, luxury, wisdom, and dharmic prosperity. A life of material and spiritual abundance simultaneously.', gu: 'Jupiter and Venus together in a trikona from Karakamsha — Srinatha Yoga. This rare combination blesses the soul with great wealth, luxury, wisdom, and dharmic prosperity. A life of material and spiritual abundance simultaneously.' }],
    [0, 4, sunSign, jupSign, { en: 'Sun + Jupiter in Karakamsha — Solar Dharma Yoga', hi: 'कारकांश में सूर्य + बृहस्पति — सौर धर्म योग', sa: 'कारकांश में सूर्य + बृहस्पति — सौर धर्म योग', mai: 'कारकांश में सूर्य + बृहस्पति — सौर धर्म योग', mr: 'कारकांश में सूर्य + बृहस्पति — सौर धर्म योग', ta: 'Sun + Jupiter in Karakamsha — Solar Dharma Yoga', te: 'Sun + Jupiter in Karakamsha — Solar Dharma Yoga', bn: 'Sun + Jupiter in Karakamsha — Solar Dharma Yoga', kn: 'Sun + Jupiter in Karakamsha — Solar Dharma Yoga', gu: 'Sun + Jupiter in Karakamsha — Solar Dharma Yoga' },
      { en: 'Sun and Jupiter together in Karakamsha or its trikona: the soul is destined for dharmic leadership — a king, high priest, or great teacher who leads by example and wisdom.', hi: 'कारकांश में सूर्य और बृहस्पति: धार्मिक नेतृत्व के लिए नियत आत्मा — राजा, महायाजक या महान शिक्षक।', sa: 'कारकांश में सूर्य और बृहस्पति: धार्मिक नेतृत्व के लिए नियत आत्मा — राजा, महायाजक या महान शिक्षक।', mai: 'कारकांश में सूर्य और बृहस्पति: धार्मिक नेतृत्व के लिए नियत आत्मा — राजा, महायाजक या महान शिक्षक।', mr: 'कारकांश में सूर्य और बृहस्पति: धार्मिक नेतृत्व के लिए नियत आत्मा — राजा, महायाजक या महान शिक्षक।', ta: 'Sun and Jupiter together in Karakamsha or its trikona: the soul is destined for dharmic leadership — a king, high priest, or great teacher who leads by example and wisdom.', te: 'Sun and Jupiter together in Karakamsha or its trikona: the soul is destined for dharmic leadership — a king, high priest, or great teacher who leads by example and wisdom.', bn: 'Sun and Jupiter together in Karakamsha or its trikona: the soul is destined for dharmic leadership — a king, high priest, or great teacher who leads by example and wisdom.', kn: 'Sun and Jupiter together in Karakamsha or its trikona: the soul is destined for dharmic leadership — a king, high priest, or great teacher who leads by example and wisdom.', gu: 'Sun and Jupiter together in Karakamsha or its trikona: the soul is destined for dharmic leadership — a king, high priest, or great teacher who leads by example and wisdom.' }],
    [0, 2, sunSign, marsSign, { en: 'Sun + Mars in Karakamsha — Warrior King Yoga', hi: 'कारकांश में सूर्य + मंगल — योद्धा-राजा योग', sa: 'कारकांश में सूर्य + मंगल — योद्धा-राजा योग', mai: 'कारकांश में सूर्य + मंगल — योद्धा-राजा योग', mr: 'कारकांश में सूर्य + मंगल — योद्धा-राजा योग', ta: 'Sun + Mars in Karakamsha — Warrior King Yoga', te: 'Sun + Mars in Karakamsha — Warrior King Yoga', bn: 'Sun + Mars in Karakamsha — Warrior King Yoga', kn: 'Sun + Mars in Karakamsha — Warrior King Yoga', gu: 'Sun + Mars in Karakamsha — Warrior King Yoga' },
      { en: 'Sun and Mars together in or near Karakamsha: the soul of a commander — military leader, executive authority, or surgeon who wields both power and precision. Aggressive self-assertion in service of dharma.', hi: 'कारकांश में सूर्य और मंगल: सेनापति की आत्मा — सैन्य नेता, कार्यकारी या सर्जन।', sa: 'कारकांश में सूर्य और मंगल: सेनापति की आत्मा — सैन्य नेता, कार्यकारी या सर्जन।', mai: 'कारकांश में सूर्य और मंगल: सेनापति की आत्मा — सैन्य नेता, कार्यकारी या सर्जन।', mr: 'कारकांश में सूर्य और मंगल: सेनापति की आत्मा — सैन्य नेता, कार्यकारी या सर्जन।', ta: 'Sun and Mars together in or near Karakamsha: the soul of a commander — military leader, executive authority, or surgeon who wields both power and precision. Aggressive self-assertion in service of dharma.', te: 'Sun and Mars together in or near Karakamsha: the soul of a commander — military leader, executive authority, or surgeon who wields both power and precision. Aggressive self-assertion in service of dharma.', bn: 'Sun and Mars together in or near Karakamsha: the soul of a commander — military leader, executive authority, or surgeon who wields both power and precision. Aggressive self-assertion in service of dharma.', kn: 'Sun and Mars together in or near Karakamsha: the soul of a commander — military leader, executive authority, or surgeon who wields both power and precision. Aggressive self-assertion in service of dharma.', gu: 'Sun and Mars together in or near Karakamsha: the soul of a commander — military leader, executive authority, or surgeon who wields both power and precision. Aggressive self-assertion in service of dharma.' }],
    [6, 2, satSign, marsSign, { en: 'Saturn + Mars in Karakamsha — Engineer & Builder Yoga', hi: 'कारकांश में शनि + मंगल — इंजीनियर योग', sa: 'कारकांश में शनि + मंगल — इंजीनियर योग', mai: 'कारकांश में शनि + मंगल — इंजीनियर योग', mr: 'कारकांश में शनि + मंगल — इंजीनियर योग', ta: 'Saturn + Mars in Karakamsha — Engineer & Builder Yoga', te: 'Saturn + Mars in Karakamsha — Engineer & Builder Yoga', bn: 'Saturn + Mars in Karakamsha — Engineer & Builder Yoga', kn: 'Saturn + Mars in Karakamsha — Engineer & Builder Yoga', gu: 'Saturn + Mars in Karakamsha — Engineer & Builder Yoga' },
      { en: 'Saturn and Mars together in Karakamsha: systematic application of force — civil engineering, architecture, heavy construction, or mechanical mastery. The combination of patience (Saturn) and drive (Mars) creates lasting structures.', hi: 'कारकांश में शनि और मंगल: बल का व्यवस्थित प्रयोग — सिविल इंजीनियरिंग, वास्तुकला, यांत्रिक महारत।', sa: 'कारकांश में शनि और मंगल: बल का व्यवस्थित प्रयोग — सिविल इंजीनियरिंग, वास्तुकला, यांत्रिक महारत।', mai: 'कारकांश में शनि और मंगल: बल का व्यवस्थित प्रयोग — सिविल इंजीनियरिंग, वास्तुकला, यांत्रिक महारत।', mr: 'कारकांश में शनि और मंगल: बल का व्यवस्थित प्रयोग — सिविल इंजीनियरिंग, वास्तुकला, यांत्रिक महारत।', ta: 'Saturn and Mars together in Karakamsha: systematic application of force — civil engineering, architecture, heavy construction, or mechanical mastery. The combination of patience (Saturn) and drive (Mars) creates lasting structures.', te: 'Saturn and Mars together in Karakamsha: systematic application of force — civil engineering, architecture, heavy construction, or mechanical mastery. The combination of patience (Saturn) and drive (Mars) creates lasting structures.', bn: 'Saturn and Mars together in Karakamsha: systematic application of force — civil engineering, architecture, heavy construction, or mechanical mastery. The combination of patience (Saturn) and drive (Mars) creates lasting structures.', kn: 'Saturn and Mars together in Karakamsha: systematic application of force — civil engineering, architecture, heavy construction, or mechanical mastery. The combination of patience (Saturn) and drive (Mars) creates lasting structures.', gu: 'Saturn and Mars together in Karakamsha: systematic application of force — civil engineering, architecture, heavy construction, or mechanical mastery. The combination of patience (Saturn) and drive (Mars) creates lasting structures.' }],
    [3, 5, mercSign, venusSign, { en: 'Mercury + Venus in Karakamsha — Arts & Commerce Genius', hi: 'कारकांश में बुध + शुक्र — कला एवं वाणिज्य प्रतिभा', sa: 'कारकांश में बुध + शुक्र — कला एवं वाणिज्य प्रतिभा', mai: 'कारकांश में बुध + शुक्र — कला एवं वाणिज्य प्रतिभा', mr: 'कारकांश में बुध + शुक्र — कला एवं वाणिज्य प्रतिभा', ta: 'Mercury + Venus in Karakamsha — Arts & Commerce Genius', te: 'Mercury + Venus in Karakamsha — Arts & Commerce Genius', bn: 'Mercury + Venus in Karakamsha — Arts & Commerce Genius', kn: 'Mercury + Venus in Karakamsha — Arts & Commerce Genius', gu: 'Mercury + Venus in Karakamsha — Arts & Commerce Genius' },
      { en: 'Mercury and Venus together in Karakamsha: the soul excels where art meets commerce — fashion, music industry, entertainment business, or luxury marketing. An aesthetically intelligent entrepreneur.', hi: 'कारकांश में बुध और शुक्र: कला और वाणिज्य का संगम — फैशन, संगीत उद्योग, मनोरंजन व्यवसाय।', sa: 'कारकांश में बुध और शुक्र: कला और वाणिज्य का संगम — फैशन, संगीत उद्योग, मनोरंजन व्यवसाय।', mai: 'कारकांश में बुध और शुक्र: कला और वाणिज्य का संगम — फैशन, संगीत उद्योग, मनोरंजन व्यवसाय।', mr: 'कारकांश में बुध और शुक्र: कला और वाणिज्य का संगम — फैशन, संगीत उद्योग, मनोरंजन व्यवसाय।', ta: 'Mercury and Venus together in Karakamsha: the soul excels where art meets commerce — fashion, music industry, entertainment business, or luxury marketing. An aesthetically intelligent entrepreneur.', te: 'Mercury and Venus together in Karakamsha: the soul excels where art meets commerce — fashion, music industry, entertainment business, or luxury marketing. An aesthetically intelligent entrepreneur.', bn: 'Mercury and Venus together in Karakamsha: the soul excels where art meets commerce — fashion, music industry, entertainment business, or luxury marketing. An aesthetically intelligent entrepreneur.', kn: 'Mercury and Venus together in Karakamsha: the soul excels where art meets commerce — fashion, music industry, entertainment business, or luxury marketing. An aesthetically intelligent entrepreneur.', gu: 'Mercury and Venus together in Karakamsha: the soul excels where art meets commerce — fashion, music industry, entertainment business, or luxury marketing. An aesthetically intelligent entrepreneur.' }],
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
    1:  { name: { en: 'Karakamsha in Aries — Pioneer Soul', hi: 'मेष कारकांश — पथप्रदर्शक आत्मा', sa: 'मेष कारकांश — पथप्रदर्शक आत्मा', mai: 'मेष कारकांश — पथप्रदर्शक आत्मा', mr: 'मेष कारकांश — पथप्रदर्शक आत्मा', ta: 'Karakamsha in Aries — Pioneer Soul', te: 'Karakamsha in Aries — Pioneer Soul', bn: 'Karakamsha in Aries — Pioneer Soul', kn: 'Karakamsha in Aries — Pioneer Soul', gu: 'Karakamsha in Aries — Pioneer Soul' },
          description: { en: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.', hi: 'मेष कारकांश: पथप्रदर्शन, नेतृत्व और आत्मनिर्भरता की ओर उन्मुख आत्मा। साहसी, स्वतंत्र, और क्षेत्र में अग्रदूत।', sa: 'मेष कारकांश: पथप्रदर्शन, नेतृत्व और आत्मनिर्भरता की ओर उन्मुख आत्मा। साहसी, स्वतंत्र, और क्षेत्र में अग्रदूत।', mai: 'मेष कारकांश: पथप्रदर्शन, नेतृत्व और आत्मनिर्भरता की ओर उन्मुख आत्मा। साहसी, स्वतंत्र, और क्षेत्र में अग्रदूत।', mr: 'मेष कारकांश: पथप्रदर्शन, नेतृत्व और आत्मनिर्भरता की ओर उन्मुख आत्मा। साहसी, स्वतंत्र, और क्षेत्र में अग्रदूत।', ta: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.', te: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.', bn: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.', kn: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.', gu: 'Karakamsha in Aries: the soul is oriented toward pioneering, leadership, and self-reliance. Courageous, independent, and often a trailblazer in their field. The life path involves initiating new ventures and confronting challenges directly.' } },
    2:  { name: { en: 'Karakamsha in Taurus — Wealth-Accumulating Soul', hi: 'वृष कारकांश — धन-संचयकारी आत्मा', sa: 'वृष कारकांश — धन-संचयकारी आत्मा', mai: 'वृष कारकांश — धन-संचयकारी आत्मा', mr: 'वृष कारकांश — धन-संचयकारी आत्मा', ta: 'Karakamsha in Taurus — Wealth-Accumulating Soul', te: 'Karakamsha in Taurus — Wealth-Accumulating Soul', bn: 'Karakamsha in Taurus — Wealth-Accumulating Soul', kn: 'Karakamsha in Taurus — Wealth-Accumulating Soul', gu: 'Karakamsha in Taurus — Wealth-Accumulating Soul' },
          description: { en: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.', hi: 'वृष कारकांश: स्थिरता, सौंदर्य और भौतिक सुरक्षा की आत्मा। भूमि, कला, संगीत और स्थायी धन के प्रति आकर्षण।', sa: 'वृष कारकांश: स्थिरता, सौंदर्य और भौतिक सुरक्षा की आत्मा। भूमि, कला, संगीत और स्थायी धन के प्रति आकर्षण।', mai: 'वृष कारकांश: स्थिरता, सौंदर्य और भौतिक सुरक्षा की आत्मा। भूमि, कला, संगीत और स्थायी धन के प्रति आकर्षण।', mr: 'वृष कारकांश: स्थिरता, सौंदर्य और भौतिक सुरक्षा की आत्मा। भूमि, कला, संगीत और स्थायी धन के प्रति आकर्षण।', ta: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.', te: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.', bn: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.', kn: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.', gu: 'Karakamsha in Taurus: the soul seeks stability, beauty, and material security. Strong affinity for land, art, music, and accumulated wealth. Patient builder of lasting value.' } },
    3:  { name: { en: 'Karakamsha in Gemini — Scholar Soul', hi: 'मिथुन कारकांश — विद्वान आत्मा', sa: 'मिथुन कारकांश — विद्वान आत्मा', mai: 'मिथुन कारकांश — विद्वान आत्मा', mr: 'मिथुन कारकांश — विद्वान आत्मा', ta: 'Karakamsha in Gemini — Scholar Soul', te: 'Karakamsha in Gemini — Scholar Soul', bn: 'Karakamsha in Gemini — Scholar Soul', kn: 'Karakamsha in Gemini — Scholar Soul', gu: 'Karakamsha in Gemini — Scholar Soul' },
          description: { en: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.', hi: 'मिथुन कारकांश: बौद्धिक बहुमुखिता — लेखन, शिक्षण, संचार और वाणिज्य के लिए नियत आत्मा।', sa: 'मिथुन कारकांश: बौद्धिक बहुमुखिता — लेखन, शिक्षण, संचार और वाणिज्य के लिए नियत आत्मा।', mai: 'मिथुन कारकांश: बौद्धिक बहुमुखिता — लेखन, शिक्षण, संचार और वाणिज्य के लिए नियत आत्मा।', mr: 'मिथुन कारकांश: बौद्धिक बहुमुखिता — लेखन, शिक्षण, संचार और वाणिज्य के लिए नियत आत्मा।', ta: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.', te: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.', bn: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.', kn: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.', gu: 'Karakamsha in Gemini: the soul is destined for intellectual versatility — writing, teaching, communication, and commerce. Curious, adaptable, with multiple simultaneous interests and projects.' } },
    4:  { name: { en: 'Karakamsha in Cancer — Nurturing Soul', hi: 'कर्क कारकांश — पोषण-कर्त्री आत्मा', sa: 'कर्क कारकांश — पोषण-कर्त्री आत्मा', mai: 'कर्क कारकांश — पोषण-कर्त्री आत्मा', mr: 'कर्क कारकांश — पोषण-कर्त्री आत्मा', ta: 'Karakamsha in Cancer — Nurturing Soul', te: 'Karakamsha in Cancer — Nurturing Soul', bn: 'Karakamsha in Cancer — Nurturing Soul', kn: 'Karakamsha in Cancer — Nurturing Soul', gu: 'Karakamsha in Cancer — Nurturing Soul' },
          description: { en: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.', hi: 'कर्क कारकांश: पोषण, जन सेवा और संरक्षण की आत्मा। माता, मातृभूमि और सामूहिक कल्याण से गहरा जुड़ाव।', sa: 'कर्क कारकांश: पोषण, जन सेवा और संरक्षण की आत्मा। माता, मातृभूमि और सामूहिक कल्याण से गहरा जुड़ाव।', mai: 'कर्क कारकांश: पोषण, जन सेवा और संरक्षण की आत्मा। माता, मातृभूमि और सामूहिक कल्याण से गहरा जुड़ाव।', mr: 'कर्क कारकांश: पोषण, जन सेवा और संरक्षण की आत्मा। माता, मातृभूमि और सामूहिक कल्याण से गहरा जुड़ाव।', ta: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.', te: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.', bn: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.', kn: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.', gu: 'Karakamsha in Cancer: the soul is oriented toward nurturing, public service, and protecting the vulnerable. Strong connection to mother, homeland, and the collective emotional wellbeing.' } },
    5:  { name: { en: 'Karakamsha in Leo — Royal Soul', hi: 'सिंह कारकांश — राजकीय आत्मा', sa: 'सिंह कारकांश — राजकीय आत्मा', mai: 'सिंह कारकांश — राजकीय आत्मा', mr: 'सिंह कारकांश — राजकीय आत्मा', ta: 'Karakamsha in Leo — Royal Soul', te: 'Karakamsha in Leo — Royal Soul', bn: 'Karakamsha in Leo — Royal Soul', kn: 'Karakamsha in Leo — Royal Soul', gu: 'Karakamsha in Leo — Royal Soul' },
          description: { en: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.', hi: 'सिंह कारकांश: राजकीय गुण — स्वाभाविक अधिकार, सृजनात्मक शक्ति, नेतृत्व की इच्छा। राजनीतिक या नेतृत्व भूमिकाएं।', sa: 'सिंह कारकांश: राजकीय गुण — स्वाभाविक अधिकार, सृजनात्मक शक्ति, नेतृत्व की इच्छा। राजनीतिक या नेतृत्व भूमिकाएं।', mai: 'सिंह कारकांश: राजकीय गुण — स्वाभाविक अधिकार, सृजनात्मक शक्ति, नेतृत्व की इच्छा। राजनीतिक या नेतृत्व भूमिकाएं।', mr: 'सिंह कारकांश: राजकीय गुण — स्वाभाविक अधिकार, सृजनात्मक शक्ति, नेतृत्व की इच्छा। राजनीतिक या नेतृत्व भूमिकाएं।', ta: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.', te: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.', bn: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.', kn: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.', gu: 'Karakamsha in Leo: the soul carries a regal quality — natural authority, creative power, and the desire to lead and inspire. Political, theatrical, or leadership roles fulfill this karma.' } },
    6:  { name: { en: 'Karakamsha in Virgo — Analytical Soul', hi: 'कन्या कारकांश — विश्लेषणात्मक आत्मा', sa: 'कन्या कारकांश — विश्लेषणात्मक आत्मा', mai: 'कन्या कारकांश — विश्लेषणात्मक आत्मा', mr: 'कन्या कारकांश — विश्लेषणात्मक आत्मा', ta: 'Karakamsha in Virgo — Analytical Soul', te: 'Karakamsha in Virgo — Analytical Soul', bn: 'Karakamsha in Virgo — Analytical Soul', kn: 'Karakamsha in Virgo — Analytical Soul', gu: 'Karakamsha in Virgo — Analytical Soul' },
          description: { en: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.', hi: 'कन्या कारकांश: सटीकता, सेवा और उपचार से उद्देश्य। उत्कृष्ट विश्लेषणात्मक, चिकित्सा या संपादकीय कार्य।', sa: 'कन्या कारकांश: सटीकता, सेवा और उपचार से उद्देश्य। उत्कृष्ट विश्लेषणात्मक, चिकित्सा या संपादकीय कार्य।', mai: 'कन्या कारकांश: सटीकता, सेवा और उपचार से उद्देश्य। उत्कृष्ट विश्लेषणात्मक, चिकित्सा या संपादकीय कार्य।', mr: 'कन्या कारकांश: सटीकता, सेवा और उपचार से उद्देश्य। उत्कृष्ट विश्लेषणात्मक, चिकित्सा या संपादकीय कार्य।', ta: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.', te: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.', bn: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.', kn: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.', gu: 'Karakamsha in Virgo: the soul finds purpose through precision, service, and healing. Excellent analytical, medical, or editorial work. This soul perfects whatever it touches.' } },
    7:  { name: { en: 'Karakamsha in Libra — Diplomatic Soul', hi: 'तुला कारकांश — राजनयिक आत्मा', sa: 'तुला कारकांश — राजनयिक आत्मा', mai: 'तुला कारकांश — राजनयिक आत्मा', mr: 'तुला कारकांश — राजनयिक आत्मा', ta: 'Karakamsha in Libra — Diplomatic Soul', te: 'Karakamsha in Libra — Diplomatic Soul', bn: 'Karakamsha in Libra — Diplomatic Soul', kn: 'Karakamsha in Libra — Diplomatic Soul', gu: 'Karakamsha in Libra — Diplomatic Soul' },
          description: { en: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.', hi: 'तुला कारकांश: संतुलन, न्याय और सौंदर्य की आत्मा। कूटनीतिक, कलात्मक। कानून, डिजाइन, मध्यस्थता।', sa: 'तुला कारकांश: संतुलन, न्याय और सौंदर्य की आत्मा। कूटनीतिक, कलात्मक। कानून, डिजाइन, मध्यस्थता।', mai: 'तुला कारकांश: संतुलन, न्याय और सौंदर्य की आत्मा। कूटनीतिक, कलात्मक। कानून, डिजाइन, मध्यस्थता।', mr: 'तुला कारकांश: संतुलन, न्याय और सौंदर्य की आत्मा। कूटनीतिक, कलात्मक। कानून, डिजाइन, मध्यस्थता।', ta: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.', te: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.', bn: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.', kn: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.', gu: 'Karakamsha in Libra: the soul is oriented toward balance, justice, and beauty. Diplomatic, artistic, and relationship-focused. Law, design, mediation, and partnership are the natural domains.' } },
    8:  { name: { en: 'Karakamsha in Scorpio — Investigative Soul', hi: 'वृश्चिक कारकांश — अनुसंधानी आत्मा', sa: 'वृश्चिक कारकांश — अनुसंधानी आत्मा', mai: 'वृश्चिक कारकांश — अनुसंधानी आत्मा', mr: 'वृश्चिक कारकांश — अनुसंधानी आत्मा', ta: 'Karakamsha in Scorpio — Investigative Soul', te: 'Karakamsha in Scorpio — Investigative Soul', bn: 'Karakamsha in Scorpio — Investigative Soul', kn: 'Karakamsha in Scorpio — Investigative Soul', gu: 'Karakamsha in Scorpio — Investigative Soul' },
          description: { en: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.', hi: 'वृश्चिक कारकांश: गहराई और छिपे ज्ञान से परिवर्तन। अनुसंधान, गुप्त विज्ञान, मनोविज्ञान, आत्मिक रूपांतरण।', sa: 'वृश्चिक कारकांश: गहराई और छिपे ज्ञान से परिवर्तन। अनुसंधान, गुप्त विज्ञान, मनोविज्ञान, आत्मिक रूपांतरण।', mai: 'वृश्चिक कारकांश: गहराई और छिपे ज्ञान से परिवर्तन। अनुसंधान, गुप्त विज्ञान, मनोविज्ञान, आत्मिक रूपांतरण।', mr: 'वृश्चिक कारकांश: गहराई और छिपे ज्ञान से परिवर्तन। अनुसंधान, गुप्त विज्ञान, मनोविज्ञान, आत्मिक रूपांतरण।', ta: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.', te: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.', bn: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.', kn: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.', gu: 'Karakamsha in Scorpio: the soul seeks transformation through depth and hidden knowledge. Research, investigation, occult sciences, psychology, and spiritual transformation are the soul-level drives.' } },
    9:  { name: { en: 'Karakamsha in Sagittarius — Philosopher Soul', hi: 'धनु कारकांश — दार्शनिक आत्मा', sa: 'धनु कारकांश — दार्शनिक आत्मा', mai: 'धनु कारकांश — दार्शनिक आत्मा', mr: 'धनु कारकांश — दार्शनिक आत्मा', ta: 'Karakamsha in Sagittarius — Philosopher Soul', te: 'Karakamsha in Sagittarius — Philosopher Soul', bn: 'Karakamsha in Sagittarius — Philosopher Soul', kn: 'Karakamsha in Sagittarius — Philosopher Soul', gu: 'Karakamsha in Sagittarius — Philosopher Soul' },
          description: { en: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.', hi: 'धनु कारकांश: सत्य, दर्शन और उच्च शिक्षा। शिक्षण, धर्म, कानून, तीर्थयात्रा और आध्यात्मिक खोज।', sa: 'धनु कारकांश: सत्य, दर्शन और उच्च शिक्षा। शिक्षण, धर्म, कानून, तीर्थयात्रा और आध्यात्मिक खोज।', mai: 'धनु कारकांश: सत्य, दर्शन और उच्च शिक्षा। शिक्षण, धर्म, कानून, तीर्थयात्रा और आध्यात्मिक खोज।', mr: 'धनु कारकांश: सत्य, दर्शन और उच्च शिक्षा। शिक्षण, धर्म, कानून, तीर्थयात्रा और आध्यात्मिक खोज।', ta: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.', te: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.', bn: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.', kn: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.', gu: 'Karakamsha in Sagittarius: the soul is oriented toward truth, philosophy, and higher education. Teaching, religion, law, long-distance travel, and spiritual quest are the soul-level karma.' } },
    10: { name: { en: 'Karakamsha in Capricorn — Executive Soul', hi: 'मकर कारकांश — कार्यकारी आत्मा', sa: 'मकर कारकांश — कार्यकारी आत्मा', mai: 'मकर कारकांश — कार्यकारी आत्मा', mr: 'मकर कारकांश — कार्यकारी आत्मा', ta: 'Karakamsha in Capricorn — Executive Soul', te: 'Karakamsha in Capricorn — Executive Soul', bn: 'Karakamsha in Capricorn — Executive Soul', kn: 'Karakamsha in Capricorn — Executive Soul', gu: 'Karakamsha in Capricorn — Executive Soul' },
          description: { en: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.', hi: 'मकर कारकांश: धीमे और निश्चित निर्माण — महत्वाकांक्षी, धैर्यवान। प्रशासन, इंजीनियरिंग, कॉर्पोरेट नेतृत्व।', sa: 'मकर कारकांश: धीमे और निश्चित निर्माण — महत्वाकांक्षी, धैर्यवान। प्रशासन, इंजीनियरिंग, कॉर्पोरेट नेतृत्व।', mai: 'मकर कारकांश: धीमे और निश्चित निर्माण — महत्वाकांक्षी, धैर्यवान। प्रशासन, इंजीनियरिंग, कॉर्पोरेट नेतृत्व।', mr: 'मकर कारकांश: धीमे और निश्चित निर्माण — महत्वाकांक्षी, धैर्यवान। प्रशासन, इंजीनियरिंग, कॉर्पोरेट नेतृत्व।', ta: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.', te: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.', bn: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.', kn: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.', gu: 'Karakamsha in Capricorn: the soul builds slowly and surely — ambitious, patient, and destined for late-career peak. Administration, engineering, and corporate leadership are the soul-path.' } },
    11: { name: { en: 'Karakamsha in Aquarius — Humanitarian Soul', hi: 'कुंभ कारकांश — मानवतावादी आत्मा', sa: 'कुंभ कारकांश — मानवतावादी आत्मा', mai: 'कुंभ कारकांश — मानवतावादी आत्मा', mr: 'कुंभ कारकांश — मानवतावादी आत्मा', ta: 'Karakamsha in Aquarius — Humanitarian Soul', te: 'Karakamsha in Aquarius — Humanitarian Soul', bn: 'Karakamsha in Aquarius — Humanitarian Soul', kn: 'Karakamsha in Aquarius — Humanitarian Soul', gu: 'Karakamsha in Aquarius — Humanitarian Soul' },
          description: { en: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.', hi: 'कुंभ कारकांश: सामूहिक उन्नति — विज्ञान, सामाजिक सुधार, प्रौद्योगिकी। नवाचारी, अपरंपरागत।', sa: 'कुंभ कारकांश: सामूहिक उन्नति — विज्ञान, सामाजिक सुधार, प्रौद्योगिकी। नवाचारी, अपरंपरागत।', mai: 'कुंभ कारकांश: सामूहिक उन्नति — विज्ञान, सामाजिक सुधार, प्रौद्योगिकी। नवाचारी, अपरंपरागत।', mr: 'कुंभ कारकांश: सामूहिक उन्नति — विज्ञान, सामाजिक सुधार, प्रौद्योगिकी। नवाचारी, अपरंपरागत।', ta: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.', te: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.', bn: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.', kn: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.', gu: 'Karakamsha in Aquarius: the soul works for collective betterment — science, social reform, technology, and humanitarian causes. Innovative, unconventional, and group-oriented.' } },
    12: { name: { en: 'Karakamsha in Pisces — Mystical Soul', hi: 'मीन कारकांश — रहस्यमय आत्मा', sa: 'मीन कारकांश — रहस्यमय आत्मा', mai: 'मीन कारकांश — रहस्यमय आत्मा', mr: 'मीन कारकांश — रहस्यमय आत्मा', ta: 'Karakamsha in Pisces — Mystical Soul', te: 'Karakamsha in Pisces — Mystical Soul', bn: 'Karakamsha in Pisces — Mystical Soul', kn: 'Karakamsha in Pisces — Mystical Soul', gu: 'Karakamsha in Pisces — Mystical Soul' },
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
