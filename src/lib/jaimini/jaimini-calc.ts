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
  planetName: { en: string; hi: string; sa: string };
  karaka: string;
  karakaName: { en: string; hi: string; sa: string };
  degree: number;
}

export interface ArudhaPada {
  house: number;
  sign: number;
  signName: { en: string; hi: string; sa: string };
  label: { en: string; hi: string; sa: string };
}

export interface CharaDashaEntry {
  sign: number;
  signName: { en: string; hi: string; sa: string };
  years: number;
  startDate: string;
  endDate: string;
}

export interface JaiminiData {
  charaKarakas: CharaKaraka[];
  karakamsha: { sign: number; signName: { en: string; hi: string; sa: string } };
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

const RASHI_NAMES: { en: string; hi: string; sa: string }[] = [
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

const PLANET_NAMES: Record<number, { en: string; hi: string; sa: string }> = {
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
export function calculateKarakamsha(atmakarakaLong: number): { sign: number; signName: { en: string; hi: string; sa: string } } {
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
  const ARUDHA_LABELS: { en: string; hi: string; sa: string }[] = [
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
    // Exception: if arudha falls in same sign or 7th, advance by 10 signs
    if (arudhaSign === houseSign) arudhaSign = ((houseSign - 1 + 9) % 12) + 1;
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
  planetName: { en: string; hi: string; sa: string };
  arudhaSign: number;
  arudhaSignName: { en: string; hi: string; sa: string };
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
    // Exception: if arudha = planet's own sign or 7th, advance by 10
    if (arudhaSign === planetSign) arudhaSign = ((planetSign - 1 + 9) % 12) + 1;

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
  name: { en: string; hi: string };
  present: boolean;
  description: { en: string; hi: string };
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

  // 1. AK + AmK in mutual kendra or trikona — classic Rajayoga
  if (akSign && amkSign) {
    const isMutualKendra  = mutualKendra(akSign, amkSign);
    const isMutualTrikona = mutualTrikona(akSign, amkSign);
    if (isMutualKendra || isMutualTrikona) {
      yogas.push({
        name: { en: 'AK–AmK Rajayoga', hi: 'आत्मकारक-अमात्यकारक राजयोग' },
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
  const EXALT_CAREER: Record<number, { en: string; hi: string }> = {
    0: { en: 'government service, authority, administration', hi: 'सरकारी सेवा, अधिकार, प्रशासन' },
    1: { en: 'agriculture, food, water management, psychology', hi: 'कृषि, खाद्य, जल प्रबन्धन, मनोविज्ञान' },
    2: { en: 'military, surgery, engineering, sports', hi: 'सेना, शल्य चिकित्सा, इंजीनियरिंग, खेल' },
    3: { en: 'business, communications, publishing, accountancy', hi: 'व्यापार, संचार, प्रकाशन, लेखाकारी' },
    4: { en: 'law, teaching, philosophy, banking', hi: 'कानून, शिक्षण, दर्शन, बैंकिंग' },
    5: { en: 'arts, entertainment, luxury goods, beauty', hi: 'कला, मनोरंजन, विलासिता, सौन्दर्य' },
    6: { en: 'judiciary, engineering, mining, real estate', hi: 'न्यायपालिका, इंजीनियरिंग, खनन, अचल सम्पत्ति' },
  };

  for (const p of planets.filter(p => p.planet.id <= 6)) {
    const ps = pSign(p.planet.id);
    if (!ps) continue;
    const posFromKm = fromKarakamsha(km, ps);
    const isExalted = p.isExalted || EXALTATION[p.planet.id] === ps;
    if (isExalted && (posFromKm === 1 || posFromKm === 5 || posFromKm === 9)) {
      const career = EXALT_CAREER[p.planet.id];
      yogas.push({
        name: { en: `Exalted ${PLANET_NAMES[p.planet.id].en} in Karakamsha Trikona`, hi: `कारकांश त्रिकोण में उच्च ${PLANET_NAMES[p.planet.id].hi}` },
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
  const ketuSign = pSign(8);
  if (ketuSign) {
    const ketuFromKm = fromKarakamsha(km, ketuSign);
    if (ketuFromKm === 1 || ketuFromKm === 12) {
      yogas.push({
        name: { en: 'Ketu in Karakamsha — Moksha Yoga', hi: 'कारकांश में केतु — मोक्ष योग' },
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
  const venusSign = pSign(5);
  if (venusSign) {
    const venusFromKm = fromKarakamsha(km, venusSign);
    if (venusFromKm === 1 || venusFromKm === 7) {
      yogas.push({
        name: { en: 'Venus in Karakamsha — Bhoga Yoga', hi: 'कारकांश में शुक्र — भोग योग' },
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
  const jupSign = pSign(4);
  if (jupSign) {
    const jupFromKm = fromKarakamsha(km, jupSign);
    if (jupFromKm === 1 || jupFromKm === 5 || jupFromKm === 9) {
      yogas.push({
        name: { en: 'Jupiter in Karakamsha Trikona — Dharma Yoga', hi: 'कारकांश त्रिकोण में बृहस्पति — धर्म योग' },
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
  const rahuSign = pSign(7);
  if (rahuSign) {
    const rahuFromKm = fromKarakamsha(km, rahuSign);
    if (rahuFromKm === 1) {
      yogas.push({
        name: { en: 'Rahu in Karakamsha — Videshi Yoga', hi: 'कारकांश में राहु — विदेशी योग' },
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
      name: { en: 'AK–AmK Conjunction Rajayoga', hi: 'आत्मकारक-अमात्यकारक युति राजयोग' },
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
      name: { en: 'Jupiter in 5H from Karakamsha — Guru Yoga', hi: 'कारकांश से 5वें में बृहस्पति — गुरु योग' },
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
          name: { en: 'Bhratrikaraka in 3H/11H from Karakamsha', hi: 'कारकांश से 3/11वें में भ्रातृकारक' },
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
