import type { LocaleText } from '@/types/panchang';
/**
 * Functional Nature of Planets per Lagna
 * Source: Laghu Parashari, BPHS Ch. 34
 *
 * For each lagna, classifies each planet as:
 *   yogaKaraka | funcBenefic | neutral | funcMalefic | maraka | badhak
 *
 * Also identifies Badhak (obstructor) and Marakas (death inflictors).
 */

export type FunctionalNature = 'yogaKaraka' | 'funcBenefic' | 'neutral' | 'funcMalefic' | 'maraka' | 'badhak';

export interface PlanetFunctionalNature {
  planetId: number;
  planetName: LocaleText;
  nature: FunctionalNature;
  houseRulership: number[];   // which houses this planet lords
  label: LocaleText;
  note?: LocaleText;
}

export interface FunctionalNatureResult {
  lagna: number;
  planets: PlanetFunctionalNature[];
  yogaKaraka: number | null;      // planetId
  badhakLord: number | null;      // planetId
  marakaLords: number[];          // planet ids (2H + 7H lords)
  badhakHouse: number;            // 7, 9, or 11
}

const PLANET_NAMES: Record<number, LocaleText> = {
  0: { en: 'Sun',     hi: 'सूर्य',    sa: 'सूर्यः'    },
  1: { en: 'Moon',    hi: 'चन्द्र',   sa: 'चन्द्रः'   },
  2: { en: 'Mars',    hi: 'मंगल',     sa: 'मङ्गलः'    },
  3: { en: 'Mercury', hi: 'बुध',      sa: 'बुधः'      },
  4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' },
  5: { en: 'Venus',   hi: 'शुक्र',    sa: 'शुक्रः'    },
  6: { en: 'Saturn',  hi: 'शनि',      sa: 'शनिः'      },
  7: { en: 'Rahu',    hi: 'राहु',     sa: 'राहुः'     },
  8: { en: 'Ketu',    hi: 'केतु',     sa: 'केतुः'     },
};

// Sign lord: sign 1-12 → planet id
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// Lagna type for Badhak
const MOVABLE_LAGNAS = new Set([1, 4, 7, 10]); // Badhak = 11H lord
const FIXED_LAGNAS   = new Set([2, 5, 8, 11]); // Badhak = 9H lord
// Dual lagnas (3,6,9,12): Badhak = 7H lord

function getBadhakHouse(lagna: number): number {
  if (MOVABLE_LAGNAS.has(lagna)) return 11;
  if (FIXED_LAGNAS.has(lagna))   return 9;
  return 7;
}

// Get house number (1-12) for sign offset from lagna
function houseOfSign(lagna: number, sign: number): number {
  return ((sign - lagna + 12) % 12) + 1;
}

// Get sign of house H from lagna (1-indexed)
function signOfHouse(lagna: number, house: number): number {
  return ((lagna - 1 + house - 1) % 12) + 1;
}

// Get all houses a planet lords for a given lagna
function getHouseRulership(planetId: number, lagna: number): number[] {
  const houses: number[] = [];
  for (let sign = 1; sign <= 12; sign++) {
    if (SIGN_LORD[sign] === planetId) {
      houses.push(houseOfSign(lagna, sign));
    }
  }
  return houses.sort((a, b) => a - b);
}

// Classify functional nature based on house rulership
// Laghu Parashari rules:
// 1. Lagna lord = always benefic (even if 6/8/12 lord)
// 2. Pure trikona lords (5,9) = benefic
// 3. Lords of both kendra+trikona = Yoga Karaka
// 4. 6H, 8H, 12H lords = malefic (exceptions below)
// 5. 2H, 7H lords = maraka
// 6. Badhak house lord = badhak (strong malefic)
// 7. Neutral: 3H, 11H lords; kendra lords without trikona
// Exception: lagna lord always overrides dusthana malefic status
function classifyPlanet(
  planetId: number,
  lagna: number,
  badhakHouse: number,
  yogaKarakaId: number | null,
  maraka2H: number,
  maraka7H: number,
): { nature: FunctionalNature; label: LocaleText; note?: LocaleText } {
  const houses = getHouseRulership(planetId, lagna);
  const isLagnaLord = houses.includes(1);

  // Badhak
  if (houses.includes(badhakHouse) && !isLagnaLord) {
    return {
      nature: 'badhak',
      label: { en: 'Badhak (Obstructor)', hi: 'बाधक (अवरोधक)', sa: 'बाधक (अवरोधक)', mai: 'बाधक (अवरोधक)', mr: 'बाधक (अवरोधक)', ta: 'பாதக (தடையாளர்)', te: 'బాధక (అవరోధకుడు)', bn: 'বাধক (প্রতিবন্ধক)', kn: 'ಬಾಧಕ (ಅಡ್ಡಗಾಲು)', gu: 'બાધક (અવરોધક)' },
      note: { en: `Lords the ${badhakHouse}H — creates irresolvable obstacles in its dashas`, hi: `${badhakHouse}वें भाव का स्वामी — दशाओं में अपरिहार्य बाधाएँ`, sa: `${badhakHouse}वें भाव का स्वामी — दशाओं में अपरिहार्य बाधाएँ`, mai: `${badhakHouse}वें भाव का स्वामी — दशाओं में अपरिहार्य बाधाएँ`, mr: `${badhakHouse}वें भाव का स्वामी — दशाओं में अपरिहार्य बाधाएँ`, ta: `Lords the ${badhakHouse}H — creates irresolvable obstacles in its dashas`, te: `Lords the ${badhakHouse}H — creates irresolvable obstacles in its dashas`, bn: `Lords the ${badhakHouse}H — creates irresolvable obstacles in its dashas`, kn: `Lords the ${badhakHouse}H — creates irresolvable obstacles in its dashas`, gu: `Lords the ${badhakHouse}H — creates irresolvable obstacles in its dashas` },
    };
  }

  // Yoga Karaka
  if (planetId === yogaKarakaId) {
    return {
      nature: 'yogaKaraka',
      label: { en: 'Yoga Karaka (Supreme Benefic)', hi: 'योगकारक (श्रेष्ठ शुभ)', sa: 'योगकारक (श्रेष्ठ शुभ)', mai: 'योगकारक (श्रेष्ठ शुभ)', mr: 'योगकारक (श्रेष्ठ शुभ)', ta: 'யோககாரகன் (உச்ச சுபன்)', te: 'యోగకారకుడు (సర్వోత్తమ శుభుడు)', bn: 'যোগকারক (শ্রেষ্ঠ শুভ)', kn: 'ಯೋಗಕಾರಕ (ಶ್ರೇಷ್ಠ ಶುಭ)', gu: 'યોગકારક (શ્રેષ્ઠ શુભ)' },
      note: { en: 'Rules both a kendra and trikona — the most beneficial planet in the chart', hi: 'केन्द्र और त्रिकोण दोनों का स्वामी — कुण्डली का सर्वश्रेष्ठ ग्रह', sa: 'केन्द्र और त्रिकोण दोनों का स्वामी — कुण्डली का सर्वश्रेष्ठ ग्रह', mai: 'केन्द्र और त्रिकोण दोनों का स्वामी — कुण्डली का सर्वश्रेष्ठ ग्रह', mr: 'केन्द्र और त्रिकोण दोनों का स्वामी — कुण्डली का सर्वश्रेष्ठ ग्रह', ta: 'கேந்திரம் மற்றும் திரிகோணம் இரண்டையும் ஆள்கிறது — ஜாதகத்தின் மிகச் சிறந்த சுபக் கிரகம்', te: 'కేంద్ర మరియు త్రికోణ రెండింటినీ ఏలుతుంది — జాతకంలో అత్యంత శుభ గ్రహం', bn: 'কেন্দ্র ও ত্রিকোণ উভয়ের অধিপতি — কুণ্ডলীর সর্বশ্রেষ্ঠ গ্রহ', kn: 'ಕೇಂದ್ರ ಮತ್ತು ತ್ರಿಕೋಣ ಎರಡನ್ನೂ ಆಳುತ್ತದೆ — ಜಾತಕದ ಅತ್ಯಂತ ಶುಭ ಗ್ರಹ', gu: 'કેન્દ્ર અને ત્રિકોણ બંનેના સ્વામી — કુંડળીનો સર્વશ્રેષ્ઠ ગ્રહ' },
    };
  }

  // Maraka (2H and 7H lords that are not lagna lord)
  const isMaraka = (planetId === maraka2H || planetId === maraka7H) && !isLagnaLord;
  if (isMaraka) {
    const h = planetId === maraka2H && planetId === maraka7H ? '2+7H' : planetId === maraka2H ? '2H' : '7H';
    return {
      nature: 'maraka',
      label: { en: `Maraka (Death Inflictor)`, hi: `मारक ग्रह`, sa: `मारक ग्रह`, mai: `मारक ग्रह`, mr: `मारक ग्रह`, ta: `மாரகன் (மரண காரகன்)`, te: `మారకుడు (మరణ కారకుడు)`, bn: `মারক (মৃত্যু কারক)`, kn: `ಮಾರಕ (ಮೃತ್ಯು ಕಾರಕ)`, gu: `મારક (મૃત્યુ કારક)` },
      note: { en: `Lords the ${h} — health-sensitive periods in its dasha`, hi: `${h} का स्वामी — इसकी दशा में स्वास्थ्य प्रति सजग रहें`, sa: `${h} का स्वामी — इसकी दशा में स्वास्थ्य प्रति सजग रहें`, mai: `${h} का स्वामी — इसकी दशा में स्वास्थ्य प्रति सजग रहें`, mr: `${h} का स्वामी — इसकी दशा में स्वास्थ्य प्रति सजग रहें`, ta: `Lords the ${h} — health-sensitive periods in its dasha`, te: `Lords the ${h} — health-sensitive periods in its dasha`, bn: `Lords the ${h} — health-sensitive periods in its dasha`, kn: `Lords the ${h} — health-sensitive periods in its dasha`, gu: `Lords the ${h} — health-sensitive periods in its dasha` },
    };
  }

  // Lagna lord — always benefic regardless
  if (isLagnaLord) {
    // Check if it also lords trikona
    const lordsTrikona = houses.some(h => h === 5 || h === 9);
    if (lordsTrikona) {
      return {
        nature: 'funcBenefic',
        label: { en: 'Functional Benefic', hi: 'क्रियात्मक शुभ', sa: 'क्रियात्मक शुभ', mai: 'क्रियात्मक शुभ', mr: 'क्रियात्मक शुभ', ta: 'செயல்பாட்டு சுபன்', te: 'క్రియాత్మక శుభుడు', bn: 'ক্রিয়াত্মক শুভ', kn: 'ಕ್ರಿಯಾತ್ಮಕ ಶುಭ', gu: 'ક્રિયાત્મક શુભ' },
        note: { en: 'Lagna + trikona lord — doubly auspicious', hi: 'लग्न + त्रिकोण स्वामी — द्विगुण शुभ', sa: 'लग्न + त्रिकोण स्वामी — द्विगुण शुभ', mai: 'लग्न + त्रिकोण स्वामी — द्विगुण शुभ', mr: 'लग्न + त्रिकोण स्वामी — द्विगुण शुभ', ta: 'லக்னம் + திரிகோண அதிபதி — இரட்டை சுபம்', te: 'లగ్నం + త్రికోణ అధిపతి — ద్విగుణ శుభం', bn: 'লগ্ন + ত্রিকোণ স্বামী — দ্বিগুণ শুভ', kn: 'ಲಗ್ನ + ತ್ರಿಕೋಣ ಅಧಿಪತಿ — ದ್ವಿಗುಣ ಶುಭ', gu: 'લગ્ન + ત્રિકોણ સ્વામી — દ્વિગુણ શુભ' },
      };
    }
    return {
      nature: 'funcBenefic',
      label: { en: 'Functional Benefic', hi: 'क्रियात्मक शुभ', sa: 'क्रियात्मक शुभ', mai: 'क्रियात्मक शुभ', mr: 'क्रियात्मक शुभ', ta: 'செயல்பாட்டு சுபன்', te: 'క్రియాత్మక శుభుడు', bn: 'ক্রিয়াত্মক শুভ', kn: 'ಕ್ರಿಯಾತ್ಮಕ ಶುಭ', gu: 'ક્રિયાત્મક શુભ' },
      note: { en: 'Lagna lord — always auspicious regardless of other lordships', hi: 'लग्नेश — अन्य स्वामित्व से निरपेक्ष, सदा शुभ', sa: 'लग्नेश — अन्य स्वामित्व से निरपेक्ष, सदा शुभ', mai: 'लग्नेश — अन्य स्वामित्व से निरपेक्ष, सदा शुभ', mr: 'लग्नेश — अन्य स्वामित्व से निरपेक्ष, सदा शुभ', ta: 'லக்னாதிபதி — மற்ற அதிபத்தியங்களைப் பொருட்படுத்தாமல் எப்போதும் சுபம்', te: 'లగ్నాధిపతి — ఇతర అధిపత్యాలతో సంబంధం లేకుండా ఎల్లప్పుడూ శుభం', bn: 'লগ্নেশ — অন্য স্বামিত্ব নির্বিশেষে সর্বদা শুভ', kn: 'ಲಗ್ನಾಧಿಪತಿ — ಇತರ ಅಧಿಪತ್ಯಗಳ ಹೊರತಾಗಿಯೂ ಸದಾ ಶುಭ', gu: 'લગ્નેશ — અન્ય સ્વામિત્વથી નિરપેક્ષ, સદા શુભ' },
    };
  }

  // Check dusthana lordship (6,8,12)
  const dusthanas = houses.filter(h => h === 6 || h === 8 || h === 12);
  const trikonas  = houses.filter(h => h === 1 || h === 5 || h === 9);
  const kendras   = houses.filter(h => h === 4 || h === 7 || h === 10); // 1 excluded (handled)

  if (dusthanas.length > 0 && trikonas.length === 0) {
    // Pure dusthana lord
    return {
      nature: 'funcMalefic',
      label: { en: 'Functional Malefic', hi: 'क्रियात्मक अशुभ', sa: 'क्रियात्मक अशुभ', mai: 'क्रियात्मक अशुभ', mr: 'क्रियात्मक अशुभ', ta: 'செயல்பாட்டு பாபன்', te: 'క్రియాత్మక అశుభుడు', bn: 'ক্রিয়াত্মক অশুভ', kn: 'ಕ್ರಿಯಾತ್ಮಕ ಅಶುಭ', gu: 'ક્રિયાત્મક અશુભ' },
      note: { en: `Lords the ${dusthanas.join('+')  }H — difficult house(s)`, hi: `${dusthanas.join('+')}वें भाव का स्वामी — कठिन भाव`, sa: `${dusthanas.join('+')}वें भाव का स्वामी — कठिन भाव`, mai: `${dusthanas.join('+')}वें भाव का स्वामी — कठिन भाव`, mr: `${dusthanas.join('+')}वें भाव का स्वामी — कठिन भाव`, ta: `Lords the ${dusthanas.join('+')  }H — difficult house(s)`, te: `Lords the ${dusthanas.join('+')  }H — difficult house(s)`, bn: `Lords the ${dusthanas.join('+')  }H — difficult house(s)`, kn: `Lords the ${dusthanas.join('+')  }H — difficult house(s)`, gu: `Lords the ${dusthanas.join('+')  }H — difficult house(s)` },
    };
  }

  // Trikona lord without dusthana = benefic
  if (trikonas.length > 0 && dusthanas.length === 0) {
    return {
      nature: 'funcBenefic',
      label: { en: 'Functional Benefic', hi: 'क्रियात्मक शुभ', sa: 'क्रियात्मक शुभ', mai: 'क्रियात्मक शुभ', mr: 'क्रियात्मक शुभ', ta: 'செயல்பாட்டு சுபன்', te: 'క్రియాత్మక శుభుడు', bn: 'ক্রিয়াত্মক শুভ', kn: 'ಕ್ರಿಯಾತ್ಮಕ ಶುಭ', gu: 'ક્રિયાત્મક શુભ' },
      note: { en: `Lords the ${trikonas.join('+')}H trikona — auspicious`, hi: `${trikonas.join('+')}वें त्रिकोण भाव का स्वामी — शुभ`, sa: `${trikonas.join('+')}वें त्रिकोण भाव का स्वामी — शुभ`, mai: `${trikonas.join('+')}वें त्रिकोण भाव का स्वामी — शुभ`, mr: `${trikonas.join('+')}वें त्रिकोण भाव का स्वामी — शुभ`, ta: `Lords the ${trikonas.join('+')}H trikona — auspicious`, te: `Lords the ${trikonas.join('+')}H trikona — auspicious`, bn: `Lords the ${trikonas.join('+')}H trikona — auspicious`, kn: `Lords the ${trikonas.join('+')}H trikona — auspicious`, gu: `Lords the ${trikonas.join('+')}H trikona — auspicious` },
    };
  }

  // Kendra lord (not trikona, not dusthana) — Kendradhipati dosha for natural benefics
  if (kendras.length > 0 && trikonas.length === 0 && dusthanas.length === 0) {
    return {
      nature: 'neutral',
      label: { en: 'Neutral (Kendra Lord)', hi: 'तटस्थ (केन्द्राधिपति)', sa: 'तटस्थ (केन्द्राधिपति)', mai: 'तटस्थ (केन्द्राधिपति)', mr: 'तटस्थ (केन्द्राधिपति)', ta: 'நடுநிலை (கேந்திர அதிபதி)', te: 'తటస్థ (కేంద్రాధిపతి)', bn: 'তটস্থ (কেন্দ্রাধিপতি)', kn: 'ತಟಸ್ಥ (ಕೇಂದ್ರಾಧಿಪತಿ)', gu: 'તટસ્થ (કેન્દ્રાધિપતિ)' },
      note: { en: `Lords kendra ${kendras.join(',')}H — neutral to mildly mixed`, hi: `केन्द्र ${kendras.join(',')}वें भाव का स्वामी — तटस्थ`, sa: `केन्द्र ${kendras.join(',')}वें भाव का स्वामी — तटस्थ`, mai: `केन्द्र ${kendras.join(',')}वें भाव का स्वामी — तटस्थ`, mr: `केन्द्र ${kendras.join(',')}वें भाव का स्वामी — तटस्थ`, ta: `Lords kendra ${kendras.join(',')}H — neutral to mildly mixed`, te: `Lords kendra ${kendras.join(',')}H — neutral to mildly mixed`, bn: `Lords kendra ${kendras.join(',')}H — neutral to mildly mixed`, kn: `Lords kendra ${kendras.join(',')}H — neutral to mildly mixed`, gu: `Lords kendra ${kendras.join(',')}H — neutral to mildly mixed` },
    };
  }

  // 3H/11H lords
  if (houses.some(h => h === 3 || h === 11)) {
    return {
      nature: 'neutral',
      label: { en: 'Neutral', hi: 'तटस्थ', sa: 'तटस्थ', mai: 'तटस्थ', mr: 'तटस्थ', ta: 'நடுநிலை', te: 'తటస్థ', bn: 'তটস্থ', kn: 'ತಟಸ್ಥ', gu: 'તટસ્થ' },
      note: { en: `Lords the ${houses.join('+')}H — generally neutral/upachaya`, hi: `${houses.join('+')}वें भाव का स्वामी — सामान्यतः तटस्थ`, sa: `${houses.join('+')}वें भाव का स्वामी — सामान्यतः तटस्थ`, mai: `${houses.join('+')}वें भाव का स्वामी — सामान्यतः तटस्थ`, mr: `${houses.join('+')}वें भाव का स्वामी — सामान्यतः तटस्थ`, ta: `Lords the ${houses.join('+')}H — generally neutral/upachaya`, te: `Lords the ${houses.join('+')}H — generally neutral/upachaya`, bn: `Lords the ${houses.join('+')}H — generally neutral/upachaya`, kn: `Lords the ${houses.join('+')}H — generally neutral/upachaya`, gu: `Lords the ${houses.join('+')}H — generally neutral/upachaya` },
    };
  }

  return { nature: 'neutral', label: { en: 'Neutral', hi: 'तटस्थ', sa: 'तटस्थ', mai: 'तटस्थ', mr: 'तटस्थ', ta: 'நடுநிலை', te: 'తటస్థ', bn: 'তটস্থ', kn: 'ತಟಸ್ಥ', gu: 'તટસ્થ' } };
}

function findYogaKaraka(lagna: number): number | null {
  // Yoga Karaka: planet that lords both a kendra (4,7,10) AND a trikona (5,9) simultaneously
  // Lagna (1H) is both kendra and trikona — lagna lord excluded from YK designation
  for (let pid = 0; pid <= 6; pid++) {
    const houses = getHouseRulership(pid, lagna);
    if (houses.includes(1)) continue; // Lagna lord = always benefic, not YK
    const hasKendra   = houses.some(h => h === 4 || h === 7 || h === 10);
    const hasTrikona  = houses.some(h => h === 5 || h === 9);
    if (hasKendra && hasTrikona) return pid;
  }
  return null;
}

export function calculateFunctionalNature(lagna: number): FunctionalNatureResult {
  const badhakHouse = getBadhakHouse(lagna);
  const badhakSign  = signOfHouse(lagna, badhakHouse);
  const badhakLord  = SIGN_LORD[badhakSign];

  const maraka2Sign = signOfHouse(lagna, 2);
  const maraka7Sign = signOfHouse(lagna, 7);
  const maraka2H    = SIGN_LORD[maraka2Sign];
  const maraka7H    = SIGN_LORD[maraka7Sign];

  // If 2H and 7H have the same lord, appears once
  const marakaLords = Array.from(new Set([maraka2H, maraka7H]));

  const yogaKarakaId = findYogaKaraka(lagna);

  const planets: PlanetFunctionalNature[] = [];
  for (let pid = 0; pid <= 6; pid++) {
    const houses = getHouseRulership(pid, lagna);
    const { nature, label, note } = classifyPlanet(pid, lagna, badhakHouse, yogaKarakaId, maraka2H, maraka7H);
    planets.push({
      planetId: pid,
      planetName: PLANET_NAMES[pid],
      nature,
      houseRulership: houses,
      label,
      note,
    });
  }

  // Rahu (7) and Ketu (8): shadow planets — no sign lordship, always functional malefics.
  // Per BPHS / Laghu Parashari: they inherit the signification of their sign dispositors
  // and behave as functional malefics regardless of lagna.
  planets.push({
    planetId: 7,
    planetName: PLANET_NAMES[7],
    nature: 'funcMalefic',
    houseRulership: [], // shadow planets own no signs
    label: { en: 'Functional Malefic (Shadow Planet)', hi: 'क्रियात्मक अशुभ (छाया ग्रह)', sa: 'क्रियात्मक अशुभ (छाया ग्रह)', mai: 'क्रियात्मक अशुभ (छाया ग्रह)', mr: 'क्रियात्मक अशुभ (छाया ग्रह)', ta: 'செயல்பாட்டு பாபன் (நிழல் கிரகம்)', te: 'క్రియాత్మక అశుభుడు (ఛాయా గ్రహం)', bn: 'ক্রিয়াত্মক অশুভ (ছায়া গ্রহ)', kn: 'ಕ್ರಿಯಾತ್ಮಕ ಅಶುಭ (ಛಾಯಾ ಗ್ರಹ)', gu: 'ક્રિયાત્મક અશુભ (છાયા ગ્રહ)' },
    note: {
      en: 'Rahu (North Node): amplifies the themes of its sign lord; acts as a malefic in all lagnas',
      hi: 'राहु (उत्तर नोड): अपने राशि स्वामी के विषयों को प्रबल करता है; सभी लग्नों में अशुभ',
    },
  });
  planets.push({
    planetId: 8,
    planetName: PLANET_NAMES[8],
    nature: 'funcMalefic',
    houseRulership: [], // shadow planets own no signs
    label: { en: 'Functional Malefic (Shadow Planet)', hi: 'क्रियात्मक अशुभ (छाया ग्रह)', sa: 'क्रियात्मक अशुभ (छाया ग्रह)', mai: 'क्रियात्मक अशुभ (छाया ग्रह)', mr: 'क्रियात्मक अशुभ (छाया ग्रह)', ta: 'செயல்பாட்டு பாபன் (நிழல் கிரகம்)', te: 'క్రియాత్మక అశుభుడు (ఛాయా గ్రహం)', bn: 'ক্রিয়াত্মক অশুভ (ছায়া গ্রহ)', kn: 'ಕ್ರಿಯಾತ್ಮಕ ಅಶುಭ (ಛಾಯಾ ಗ್ರಹ)', gu: 'ક્રિયાત્મક અશુભ (છાયા ગ્રહ)' },
    note: {
      en: 'Ketu (South Node): brings detachment and moksha-seeking energy; acts as a malefic in all lagnas',
      hi: 'केतु (दक्षिण नोड): वैराग्य और मोक्ष की ऊर्जा; सभी लग्नों में अशुभ',
    },
  });

  // Sort: yogaKaraka first, then funcBenefic, neutral, funcMalefic, maraka, badhak
  const ORDER: Record<FunctionalNature, number> = {
    yogaKaraka: 0, funcBenefic: 1, neutral: 2, funcMalefic: 3, maraka: 4, badhak: 5,
  };
  // Primary: by nature (yogaKaraka first ... badhak last); secondary: by planetId for stability
  planets.sort((a, b) => ORDER[a.nature] - ORDER[b.nature] || a.planetId - b.planetId);

  return {
    lagna,
    planets,
    yogaKaraka: yogaKarakaId,
    badhakLord: SIGN_LORD[badhakSign] ?? null,
    marakaLords,
    badhakHouse,
  };
}
