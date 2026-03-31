// yogas-complete.ts — Comprehensive Vedic Yoga Detection Library (50 yogas)
// Pure logic, no imports needed.

export interface YogaComplete {
  id: string;
  name: { en: string; hi: string; sa: string };
  category: 'dosha' | 'mahapurusha' | 'moon_based' | 'sun_based' | 'raja' | 'wealth' | 'inauspicious' | 'other';
  isAuspicious: boolean;
  present: boolean;
  strength: 'Strong' | 'Moderate' | 'Weak';
  formationRule: { en: string; hi: string; sa: string };
  description: { en: string; hi: string; sa: string };
}

interface PlanetData {
  id: number;        // 0=Sun..8=Ketu
  longitude: number; // sidereal 0-360
  house: number;     // 1-12
  sign: number;      // 1-12
  speed: number;
  isRetrograde: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  isOwnSign: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const KENDRA = [1, 4, 7, 10];
const TRIKONA = [1, 5, 9];
const DUSTHANA = [6, 8, 12];
const UPACHAYA = [3, 6, 10, 11];
const BENEFICS = [1, 3, 4, 5]; // Moon, Mercury, Jupiter, Venus
const MALEFICS = [0, 2, 6];    // Sun, Mars, Saturn

const SIGN_LORDS: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getP(planets: PlanetData[], id: number): PlanetData {
  return planets.find(p => p.id === id)!;
}

/** 1-based house offset from `fromHouse` to `toHouse` */
function houseFrom(fromHouse: number, toHouse: number): number {
  const diff = ((toHouse - fromHouse) % 12 + 12) % 12;
  return diff === 0 ? 12 : diff; // map 0 -> 12 so range is 1-12
}

// Actually we want 1-based: same house = 1
function houseOffset(fromHouse: number, toHouse: number): number {
  return ((toHouse - fromHouse + 12) % 12) + 1;
}

function inSameHouse(a: PlanetData, b: PlanetData): boolean {
  return a.house === b.house;
}

function getPlanetsInHouse(planets: PlanetData[], house: number): PlanetData[] {
  return planets.filter(p => p.house === house);
}

function signLord(sign: number): number {
  return SIGN_LORDS[sign];
}

/** Sign that is `offset` signs from `baseSign` (1-based, wrapping) */
function signFrom(baseSign: number, offset: number): number {
  return ((baseSign - 1 + offset - 1) % 12) + 1;
}

function isBenefic(id: number): boolean {
  return BENEFICS.includes(id);
}

function isMalefic(id: number): boolean {
  return MALEFICS.includes(id);
}

/** Check if longitude a is between rahu and ketu going forward */
function isLongBetween(lon: number, fromLon: number, toLon: number): boolean {
  // Check if lon is in the arc from fromLon to toLon going forward (increasing)
  if (fromLon <= toLon) {
    return lon >= fromLon && lon <= toLon;
  }
  // Arc wraps around 360
  return lon >= fromLon || lon <= toLon;
}

// ---------------------------------------------------------------------------
// Yoga detection — grouped by category
// ---------------------------------------------------------------------------

function detectDoshaYogas(planets: PlanetData[], _ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const mars = getP(planets, 2);
  const rahu = getP(planets, 7);
  const ketu = getP(planets, 8);

  // 1. Mangala Dosha
  const mangalHouses = [1, 2, 4, 7, 8, 12];
  const mangalPresent = mangalHouses.includes(mars.house);
  let mangalStrength: 'Strong' | 'Moderate' | 'Weak' = 'Weak';
  if ([7, 8].includes(mars.house)) mangalStrength = 'Strong';
  else if ([1, 4].includes(mars.house)) mangalStrength = 'Moderate';

  results.push({
    id: 'mangala_dosha',
    name: { en: 'Mangala Dosha', hi: 'मंगल दोष', sa: 'मङ्गलदोषः' },
    category: 'dosha',
    isAuspicious: false,
    present: mangalPresent,
    strength: mangalStrength,
    formationRule: {
      en: 'Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house',
      hi: 'मंगल 1, 2, 4, 7, 8 या 12वें भाव में',
      sa: 'कुजः प्रथम-द्वितीय-चतुर्थ-सप्तम-अष्टम-द्वादशभावे',
    },
    description: {
      en: 'Mars occupies marriage-sensitive houses, indicating potential challenges in marital harmony.',
      hi: 'मंगल विवाह-संबंधी भावों में। वैवाहिक जीवन में बाधा का संकेत।',
      sa: 'कुजः विवाहभावेषु। दाम्पत्यजीवने विघ्नसूचकः।',
    },
  });

  // 2. Kala Sarpa Yoga
  const rahuLon = rahu.longitude;
  const ketuLon = ketu.longitude;
  const sevenPlanets = planets.filter(p => p.id >= 0 && p.id <= 6);
  const allBetween = sevenPlanets.every(p => isLongBetween(p.longitude, rahuLon, ketuLon));
  const allBetweenReverse = sevenPlanets.every(p => isLongBetween(p.longitude, ketuLon, rahuLon));
  const ksPresent = allBetween || allBetweenReverse;

  results.push({
    id: 'kala_sarpa',
    name: { en: 'Kala Sarpa Yoga', hi: 'काल सर्प योग', sa: 'कालसर्पयोगः' },
    category: 'dosha',
    isAuspicious: false,
    present: ksPresent,
    strength: ksPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'All seven planets hemmed between Rahu and Ketu',
      hi: 'सभी सात ग्रह राहु और केतु के बीच',
      sa: 'सर्वे सप्तग्रहाः राहु-केत्वोर्मध्ये स्थिताः',
    },
    description: {
      en: 'All planets confined between the lunar nodes, creating karmic intensity and life obstacles.',
      hi: 'सभी ग्रह राहु-केतु अक्ष में। कार्मिक बाधाओं और जीवन संघर्ष का संकेत।',
      sa: 'सर्वे ग्रहाः राहुकेत्वोर्मध्ये। कार्मिकविघ्नानां जीवनसंघर्षस्य च सूचकः।',
    },
  });

  return results;
}

function detectMahapurushaYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];

  interface MpDef {
    id: string;
    planetId: number;
    nameEn: string; nameHi: string; nameSa: string;
    ownSigns: number[]; exaltSign: number;
    descEn: string; descHi: string; descSa: string;
  }

  const defs: MpDef[] = [
    {
      id: 'hansa', planetId: 4,
      nameEn: 'Hansa Yoga', nameHi: 'हंस योग', nameSa: 'हंसयोगः',
      ownSigns: [9, 12], exaltSign: 4,
      descEn: 'Jupiter in own or exalted sign in Kendra bestows wisdom, virtue, and fame.',
      descHi: 'बृहस्पति स्वराशि या उच्च में केन्द्र में। ज्ञान, धर्म और यश प्रदान करता है।',
      descSa: 'गुरुः स्वोच्चे केन्द्रे च। विद्यां धर्मं यशश्च ददाति।',
    },
    {
      id: 'malavya', planetId: 5,
      nameEn: 'Malavya Yoga', nameHi: 'मालव्य योग', nameSa: 'मालव्ययोगः',
      ownSigns: [2, 7], exaltSign: 12,
      descEn: 'Venus in own or exalted sign in Kendra gives luxury, beauty, and comforts.',
      descHi: 'शुक्र स्वराशि या उच्च में केन्द्र में। सुख, सौन्दर्य और वैभव प्रदान करता है।',
      descSa: 'शुक्रः स्वोच्चे केन्द्रे च। सुखं सौन्दर्यं वैभवं च ददाति।',
    },
    {
      id: 'shasha', planetId: 6,
      nameEn: 'Shasha Yoga', nameHi: 'शश योग', nameSa: 'शशयोगः',
      ownSigns: [10, 11], exaltSign: 7,
      descEn: 'Saturn in own or exalted sign in Kendra confers authority, discipline, and leadership.',
      descHi: 'शनि स्वराशि या उच्च में केन्द्र में। अधिकार, अनुशासन और नेतृत्व देता है।',
      descSa: 'शनिः स्वोच्चे केन्द्रे च। अधिकारम् अनुशासनं नेतृत्वं च ददाति।',
    },
    {
      id: 'ruchaka', planetId: 2,
      nameEn: 'Ruchaka Yoga', nameHi: 'रुचक योग', nameSa: 'रुचकयोगः',
      ownSigns: [1, 8], exaltSign: 10,
      descEn: 'Mars in own or exalted sign in Kendra grants courage, strength, and command.',
      descHi: 'मंगल स्वराशि या उच्च में केन्द्र में। साहस, बल और नेतृत्व प्रदान करता है।',
      descSa: 'कुजः स्वोच्चे केन्द्रे च। शौर्यं बलं नेतृत्वं च ददाति।',
    },
    {
      id: 'bhadra', planetId: 3,
      nameEn: 'Bhadra Yoga', nameHi: 'भद्र योग', nameSa: 'भद्रयोगः',
      ownSigns: [3, 6], exaltSign: 6,
      descEn: 'Mercury in own or exalted sign in Kendra bestows intellect, eloquence, and skill.',
      descHi: 'बुध स्वराशि या उच्च में केन्द्र में। बुद्धि, वाक्पटुता और कौशल देता है।',
      descSa: 'बुधः स्वोच्चे केन्द्रे च। बुद्धिं वाक्पटुतां कौशलं च ददाति।',
    },
  ];

  for (const d of defs) {
    const p = getP(planets, d.planetId);
    const inOwnOrExalted = d.ownSigns.includes(p.sign) || p.sign === d.exaltSign;
    const inKendra = KENDRA.includes(p.house);
    const present = inOwnOrExalted && inKendra;

    results.push({
      id: d.id,
      name: { en: d.nameEn, hi: d.nameHi, sa: d.nameSa },
      category: 'mahapurusha',
      isAuspicious: true,
      present,
      strength: present ? (p.isExalted ? 'Strong' : 'Moderate') : 'Weak',
      formationRule: {
        en: `${d.nameEn.replace(' Yoga', '')} planet in own/exalted sign in a Kendra house`,
        hi: `ग्रह स्वराशि या उच्च में केन्द्र भाव में`,
        sa: `ग्रहः स्वोच्चराशौ केन्द्रभावे`,
      },
      description: { en: d.descEn, hi: d.descHi, sa: d.descSa },
    });
  }

  return results;
}

function detectMoonBasedYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];
  const moon = getP(planets, 1);
  const jupiter = getP(planets, 4);

  // Planets eligible for Sunapha/Anapha/Durdhara (exclude Sun=0, Rahu=7, Ketu=8)
  const eligible = planets.filter(p => ![0, 1, 7, 8].includes(p.id));

  const secondFromMoon = eligible.filter(p => houseOffset(moon.house, p.house) === 2);
  const twelfthFromMoon = eligible.filter(p => houseOffset(moon.house, p.house) === 12);

  // 8. Gajakesari
  const jupFromMoon = houseOffset(moon.house, jupiter.house);
  const gkPresent = [1, 4, 7, 10].includes(jupFromMoon);

  results.push({
    id: 'gajakesari',
    name: { en: 'Gajakesari Yoga', hi: 'गजकेसरी योग', sa: 'गजकेसरीयोगः' },
    category: 'moon_based',
    isAuspicious: true,
    present: gkPresent,
    strength: gkPresent ? (jupiter.isExalted || jupiter.isOwnSign ? 'Strong' : 'Moderate') : 'Weak',
    formationRule: {
      en: 'Jupiter in Kendra (1,4,7,10) from Moon',
      hi: 'चन्द्र से केन्द्र में बृहस्पति',
      sa: 'चन्द्रात् केन्द्रे गुरुः',
    },
    description: {
      en: 'Jupiter in a Kendra from the Moon grants wisdom, fame, and prosperity.',
      hi: 'चन्द्र से केन्द्र में बृहस्पति। बुद्धि, यश और समृद्धि प्रदान करता है।',
      sa: 'चन्द्रात् केन्द्रे गुरुः। प्रज्ञां यशः समृद्धिं च ददाति।',
    },
  });

  // 9. Sunapha
  const sunPresent = secondFromMoon.length > 0;
  results.push({
    id: 'sunapha',
    name: { en: 'Sunapha Yoga', hi: 'सुनफा योग', sa: 'सुनफायोगः' },
    category: 'moon_based',
    isAuspicious: true,
    present: sunPresent,
    strength: sunPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Planet (excl Sun/Rahu/Ketu) in 2nd from Moon',
      hi: 'चन्द्र से दूसरे भाव में ग्रह (सूर्य/राहु/केतु को छोड़कर)',
      sa: 'चन्द्राद् द्वितीये ग्रहः (सूर्य-राहु-केतून् विना)',
    },
    description: {
      en: 'Planets in 2nd from Moon provide self-earned wealth and resourcefulness.',
      hi: 'चन्द्र से दूसरे भाव में ग्रह। स्वार्जित धन और संसाधनों का संकेत।',
      sa: 'चन्द्राद् द्वितीये ग्रहः। स्वार्जितधनं साधनसम्पत्तिं च सूचयति।',
    },
  });

  // 10. Anapha
  const anaPresent = twelfthFromMoon.length > 0;
  results.push({
    id: 'anapha',
    name: { en: 'Anapha Yoga', hi: 'अनफा योग', sa: 'अनफायोगः' },
    category: 'moon_based',
    isAuspicious: true,
    present: anaPresent,
    strength: anaPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Planet (excl Sun/Rahu/Ketu) in 12th from Moon',
      hi: 'चन्द्र से 12वें भाव में ग्रह (सूर्य/राहु/केतु को छोड़कर)',
      sa: 'चन्द्राद् द्वादशे ग्रहः (सूर्य-राहु-केतून् विना)',
    },
    description: {
      en: 'Planets in 12th from Moon bestow good personality, comfort, and renown.',
      hi: 'चन्द्र से 12वें में ग्रह। अच्छा व्यक्तित्व, सुख और प्रसिद्धि देता है।',
      sa: 'चन्द्राद् द्वादशे ग्रहः। सत्स्वभावं सुखं कीर्तिं च ददाति।',
    },
  });

  // 11. Durdhara
  const durdPresent = secondFromMoon.length > 0 && twelfthFromMoon.length > 0;
  results.push({
    id: 'durdhara',
    name: { en: 'Durdhara Yoga', hi: 'दुर्धरा योग', sa: 'दुर्धरायोगः' },
    category: 'moon_based',
    isAuspicious: true,
    present: durdPresent,
    strength: durdPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Planets in both 2nd and 12th from Moon (excl Sun/Rahu/Ketu)',
      hi: 'चन्द्र से दूसरे और 12वें दोनों भावों में ग्रह',
      sa: 'चन्द्राद् द्वितीये द्वादशे च ग्रहौ',
    },
    description: {
      en: 'Flanking planets around the Moon grant wealth, generosity, and enjoyments.',
      hi: 'चन्द्र के दोनों ओर ग्रह। धन, उदारता और भोग-सुख प्रदान करता है।',
      sa: 'चन्द्रस्य उभयतः ग्रहौ। धनम् औदार्यं भोगसुखं च ददाति।',
    },
  });

  // 12. Kemadruma
  const kemPresent = secondFromMoon.length === 0 && twelfthFromMoon.length === 0 && !KENDRA.includes(moon.house);
  results.push({
    id: 'kemadruma',
    name: { en: 'Kemadruma Yoga', hi: 'केमद्रुम योग', sa: 'केमद्रुमयोगः' },
    category: 'moon_based',
    isAuspicious: false,
    present: kemPresent,
    strength: kemPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'No planets in 2nd or 12th from Moon, Moon not in Kendra',
      hi: 'चन्द्र से दूसरे या 12वें में कोई ग्रह नहीं, चन्द्र केन्द्र में नहीं',
      sa: 'चन्द्राद् द्वितीये द्वादशे च ग्रहाभावः, चन्द्रः केन्द्रे न',
    },
    description: {
      en: 'Isolated Moon without flanking support indicates poverty, struggle, and loneliness.',
      hi: 'चन्द्र अकेला बिना सहयोग के। दरिद्रता, संघर्ष और एकाकीपन का संकेत।',
      sa: 'चन्द्रः एकाकी साहाय्यरहितः। दारिद्र्यं संघर्षम् एकाकित्वं च सूचयति।',
    },
  });

  // 13. Chandra Mangala
  const cmPresent = inSameHouse(moon, getP(planets, 2));
  results.push({
    id: 'chandra_mangala',
    name: { en: 'Chandra Mangala Yoga', hi: 'चन्द्र मंगल योग', sa: 'चन्द्रमङ्गलयोगः' },
    category: 'moon_based',
    isAuspicious: true,
    present: cmPresent,
    strength: cmPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Moon and Mars in the same house',
      hi: 'चन्द्र और मंगल एक ही भाव में',
      sa: 'चन्द्रकुजौ एकभावस्थौ',
    },
    description: {
      en: 'Moon-Mars conjunction bestows wealth through enterprise, courage, and determination.',
      hi: 'चन्द्र-मंगल युति। उद्यम से धन, साहस और दृढ़ संकल्प देता है।',
      sa: 'चन्द्रकुजयुतिः। उद्यमेन धनं शौर्यं दृढसंकल्पं च ददाति।',
    },
  });

  // 14. Shakata
  const shakatOffset = houseOffset(moon.house, jupiter.house);
  const shakatPresent = shakatOffset === 6 || shakatOffset === 8;
  results.push({
    id: 'shakata',
    name: { en: 'Shakata Yoga', hi: 'शकट योग', sa: 'शकटयोगः' },
    category: 'moon_based',
    isAuspicious: false,
    present: shakatPresent,
    strength: shakatPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Jupiter in 6th or 8th house from Moon',
      hi: 'चन्द्र से छठे या आठवें भाव में बृहस्पति',
      sa: 'चन्द्रात् षष्ठे अष्टमे वा गुरुः',
    },
    description: {
      en: 'Jupiter in 6/8 from Moon causes fluctuating fortunes and instability.',
      hi: 'चन्द्र से 6/8 में बृहस्पति। भाग्य में उतार-चढ़ाव और अस्थिरता का संकेत।',
      sa: 'चन्द्रात् षष्ठाष्टमे गुरुः। भाग्ये उत्थानपतने अस्थिरतां च सूचयति।',
    },
  });

  return results;
}

function detectSunBasedYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];
  const sun = getP(planets, 0);
  const mercury = getP(planets, 3);

  // Eligible for Veshi/Vasi: exclude Moon=1, Rahu=7, Ketu=8
  const eligible = planets.filter(p => ![0, 1, 7, 8].includes(p.id));

  const secondFromSun = eligible.filter(p => houseOffset(sun.house, p.house) === 2);
  const twelfthFromSun = eligible.filter(p => houseOffset(sun.house, p.house) === 12);

  // 15. Budhaditya
  const baPresent = sun.sign === mercury.sign;
  results.push({
    id: 'budhaditya',
    name: { en: 'Budhaditya Yoga', hi: 'बुधादित्य योग', sa: 'बुधादित्ययोगः' },
    category: 'sun_based',
    isAuspicious: true,
    present: baPresent,
    strength: baPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Sun and Mercury in the same sign',
      hi: 'सूर्य और बुध एक ही राशि में',
      sa: 'सूर्यबुधौ एकराशिस्थौ',
    },
    description: {
      en: 'Sun-Mercury conjunction bestows sharp intellect, communication skill, and analytical ability.',
      hi: 'सूर्य-बुध युति। तीक्ष्ण बुद्धि, वाक्कौशल और विश्लेषण क्षमता देता है।',
      sa: 'सूर्यबुधयुतिः। तीक्ष्णबुद्धिं वाक्कौशलं विश्लेषणशक्तिं च ददाति।',
    },
  });

  // 16. Veshi
  const veshPresent = secondFromSun.length > 0;
  results.push({
    id: 'veshi',
    name: { en: 'Veshi Yoga', hi: 'वेशी योग', sa: 'वेशीयोगः' },
    category: 'sun_based',
    isAuspicious: true,
    present: veshPresent,
    strength: veshPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Planet (excl Moon/Rahu/Ketu) in 2nd from Sun',
      hi: 'सूर्य से दूसरे भाव में ग्रह (चन्द्र/राहु/केतु को छोड़कर)',
      sa: 'सूर्याद् द्वितीये ग्रहः (चन्द्र-राहु-केतून् विना)',
    },
    description: {
      en: 'Planet in 2nd from Sun enhances status, authority, and noble qualities.',
      hi: 'सूर्य से दूसरे में ग्रह। प्रतिष्ठा, अधिकार और उत्तम गुण बढ़ाता है।',
      sa: 'सूर्याद् द्वितीये ग्रहः। प्रतिष्ठां अधिकारम् उत्तमगुणांश्च वर्धयति।',
    },
  });

  // 17. Vasi
  const vasiPresent = twelfthFromSun.length > 0;
  results.push({
    id: 'vasi',
    name: { en: 'Vasi Yoga', hi: 'वासी योग', sa: 'वासीयोगः' },
    category: 'sun_based',
    isAuspicious: true,
    present: vasiPresent,
    strength: vasiPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Planet (excl Moon/Rahu/Ketu) in 12th from Sun',
      hi: 'सूर्य से 12वें भाव में ग्रह (चन्द्र/राहु/केतु को छोड़कर)',
      sa: 'सूर्याद् द्वादशे ग्रहः (चन्द्र-राहु-केतून् विना)',
    },
    description: {
      en: 'Planet in 12th from Sun grants charitable nature, influence, and spiritual inclination.',
      hi: 'सूर्य से 12वें में ग्रह। दानशीलता, प्रभाव और आध्यात्मिक रुझान देता है।',
      sa: 'सूर्याद् द्वादशे ग्रहः। दानशीलतां प्रभावम् आध्यात्मिकरुचिं च ददाति।',
    },
  });

  // 18. Obhayachari
  const obhPresent = secondFromSun.length > 0 && twelfthFromSun.length > 0;
  results.push({
    id: 'obhayachari',
    name: { en: 'Obhayachari Yoga', hi: 'उभयचारी योग', sa: 'उभयचारीयोगः' },
    category: 'sun_based',
    isAuspicious: true,
    present: obhPresent,
    strength: obhPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Planets in both 2nd and 12th from Sun (excl Moon/Rahu/Ketu)',
      hi: 'सूर्य से दूसरे और 12वें दोनों में ग्रह',
      sa: 'सूर्याद् द्वितीये द्वादशे च ग्रहौ',
    },
    description: {
      en: 'Sun flanked by planets on both sides grants great influence, fame, and royal status.',
      hi: 'सूर्य के दोनों ओर ग्रह। महान प्रभाव, यश और राजसी स्थिति देता है।',
      sa: 'सूर्यस्य उभयतः ग्रहौ। महाप्रभावं यशः राजपदं च ददाति।',
    },
  });

  return results;
}

function detectRajaYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const moon = getP(planets, 1);
  const jupiter = getP(planets, 4);

  // Helper: sign of Nth house from ascendant
  const houseSign = (h: number) => signFrom(ascSign, h);

  // 19. Adhi Yoga
  const beneficIds = [3, 4, 5]; // Mercury, Jupiter, Venus
  const adhiCount = beneficIds.filter(id => {
    const off = houseOffset(moon.house, getP(planets, id).house);
    return [6, 7, 8].includes(off);
  }).length;
  const adhiPresent = adhiCount >= 2;
  results.push({
    id: 'adhi',
    name: { en: 'Adhi Yoga', hi: 'अधि योग', sa: 'अधियोगः' },
    category: 'raja',
    isAuspicious: true,
    present: adhiPresent,
    strength: adhiPresent ? (adhiCount === 3 ? 'Strong' : 'Moderate') : 'Weak',
    formationRule: {
      en: '2+ benefics (Jupiter, Venus, Mercury) in 6th, 7th, 8th from Moon',
      hi: 'चन्द्र से 6, 7, 8 में दो या अधिक शुभ ग्रह',
      sa: 'चन्द्रात् षष्ठ-सप्तम-अष्टमभावे द्वौ वा अधिकाः शुभग्रहाः',
    },
    description: {
      en: 'Benefics in 6/7/8 from Moon bestow leadership, polity, and widespread influence.',
      hi: 'चन्द्र से 6/7/8 में शुभ ग्रह। नेतृत्व, राजनीति और व्यापक प्रभाव देता है।',
      sa: 'चन्द्रात् षष्ठाष्टमसप्तमे शुभाः। नेतृत्वं राजनीतिं विस्तृतप्रभावं च ददाति।',
    },
  });

  // 20. Chatussagara
  const chatPresent = KENDRA.every(h => getPlanetsInHouse(planets, h).length > 0);
  results.push({
    id: 'chatussagara',
    name: { en: 'Chatussagara Yoga', hi: 'चतुःसागर योग', sa: 'चतुःसागरयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: chatPresent,
    strength: chatPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'All 4 Kendra houses (1,4,7,10) occupied by planets',
      hi: 'चारों केन्द्र भाव (1,4,7,10) में ग्रह',
      sa: 'चतुर्षु केन्द्रभावेषु ग्रहाः',
    },
    description: {
      en: 'All Kendras occupied grants fame spreading in all four directions like the four oceans.',
      hi: 'चारों केन्द्रों में ग्रह। चारों दिशाओं में यश और प्रसिद्धि।',
      sa: 'सर्वेषु केन्द्रेषु ग्रहाः। चतुर्दिक्षु यशः कीर्तिश्च।',
    },
  });

  // 21. Vasumati
  const vasPresent = BENEFICS.some(id => {
    const off = houseOffset(moon.house, getP(planets, id).house);
    return UPACHAYA.includes(off);
  });
  results.push({
    id: 'vasumati',
    name: { en: 'Vasumati Yoga', hi: 'वसुमती योग', sa: 'वसुमतीयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: vasPresent,
    strength: vasPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Benefics in Upachaya houses (3,6,10,11) from Moon',
      hi: 'चन्द्र से उपचय भावों (3,6,10,11) में शुभ ग्रह',
      sa: 'चन्द्राद् उपचयभावेषु शुभग्रहाः',
    },
    description: {
      en: 'Benefics in Upachaya from Moon bring ever-increasing wealth and prosperity.',
      hi: 'चन्द्र से उपचय में शुभ ग्रह। निरन्तर बढ़ता धन और समृद्धि।',
      sa: 'चन्द्राद् उपचये शुभाः। सततं वर्धमानं धनं समृद्धिश्च।',
    },
  });

  // 22. Rajalakshana
  const lagnaLord = signLord(ascSign);
  const ninthSign = houseSign(9);
  const ninthLord = signLord(ninthSign);
  const llP = getP(planets, lagnaLord);
  const nlP = getP(planets, ninthLord);
  const rlPresent = (KENDRA.includes(llP.house) && KENDRA.includes(nlP.house)) ||
                    (TRIKONA.includes(llP.house) && TRIKONA.includes(nlP.house));
  results.push({
    id: 'rajalakshana',
    name: { en: 'Rajalakshana Yoga', hi: 'राजलक्षण योग', sa: 'राजलक्षणयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: rlPresent,
    strength: rlPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Lagna lord and 9th lord in mutual Kendra or Trikona',
      hi: 'लग्नेश और नवमेश परस्पर केन्द्र या त्रिकोण में',
      sa: 'लग्नेशः नवमेशश्च परस्परं केन्द्रे त्रिकोणे वा',
    },
    description: {
      en: 'Lagna-9th lord connection bestows regal qualities, fortune, and dharmic leadership.',
      hi: 'लग्नेश-नवमेश संबंध। राजसी गुण, भाग्य और धार्मिक नेतृत्व देता है।',
      sa: 'लग्नेश-नवमेशसम्बन्धः। राजगुणान् भाग्यं धार्मिकनेतृत्वं च ददाति।',
    },
  });

  // 23. Amala
  const tenthHouse = 10;
  const planetsIn10 = getPlanetsInHouse(planets, tenthHouse);
  const amalaPresent = planetsIn10.length > 0 && planetsIn10.every(p => isBenefic(p.id));
  results.push({
    id: 'amala',
    name: { en: 'Amala Yoga', hi: 'अमल योग', sa: 'अमलयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: amalaPresent,
    strength: amalaPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Only benefics in 10th house from Lagna',
      hi: 'लग्न से दशम भाव में केवल शुभ ग्रह',
      sa: 'लग्नाद् दशमे केवलं शुभग्रहाः',
    },
    description: {
      en: 'Only benefics in the 10th house yield an unblemished reputation and virtuous career.',
      hi: 'दशम में केवल शुभ ग्रह। निष्कलंक प्रतिष्ठा और सद्कर्म।',
      sa: 'दशमे केवलशुभग्रहाः। निष्कलङ्कं यशः सत्कर्म च।',
    },
  });

  // 24. Parvata
  const beneficsInKendra = planets.filter(p => KENDRA.includes(p.house) && isBenefic(p.id));
  const maleficsInKendra = planets.filter(p => KENDRA.includes(p.house) && isMalefic(p.id));
  const parvPresent = beneficsInKendra.length > 0 && maleficsInKendra.length === 0;
  results.push({
    id: 'parvata',
    name: { en: 'Parvata Yoga', hi: 'पर्वत योग', sa: 'पर्वतयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: parvPresent,
    strength: parvPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Benefics in Kendra with no malefics in Kendra',
      hi: 'केन्द्र में शुभ ग्रह और कोई पाप ग्रह नहीं',
      sa: 'केन्द्रे शुभग्रहाः पापग्रहाभावश्च',
    },
    description: {
      en: 'Benefics in Kendra unopposed by malefics grant towering fame and fortune like a mountain.',
      hi: 'केन्द्र में शुभ ग्रह बिना पाप ग्रह। पर्वत सम यश और भाग्य।',
      sa: 'केन्द्रे शुभाः पापरहिताः। पर्वतवद् यशः भाग्यं च ददाति।',
    },
  });

  // 25. Kahala
  const fourthLord = signLord(houseSign(4));
  const ninthLordId = signLord(houseSign(9));
  const kahPresent = KENDRA.includes(getP(planets, fourthLord).house) &&
                     KENDRA.includes(getP(planets, ninthLordId).house) &&
                     (KENDRA.includes(llP.house) || TRIKONA.includes(llP.house));
  results.push({
    id: 'kahala',
    name: { en: 'Kahala Yoga', hi: 'कहल योग', sa: 'कहलयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: kahPresent,
    strength: kahPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: '4th and 9th lords in Kendra, Lagna lord in Kendra or Trikona',
      hi: 'चतुर्थेश और नवमेश केन्द्र में, लग्नेश केन्द्र या त्रिकोण में',
      sa: 'चतुर्थेश-नवमेशौ केन्द्रे लग्नेशः केन्द्रे त्रिकोणे वा',
    },
    description: {
      en: 'Strong placement of 4th, 9th lords and lagna lord grants courage, authority, and valour.',
      hi: 'चतुर्थेश, नवमेश और लग्नेश सुस्थित। साहस, अधिकार और पराक्रम देता है।',
      sa: 'चतुर्थेश-नवमेश-लग्नेशाः सुस्थिताः। शौर्यम् अधिकारं पराक्रमं च ददाति।',
    },
  });

  // 26. Lakshmi
  const nlP2 = getP(planets, ninthLord);
  const lkPresent = (nlP2.isOwnSign || nlP2.isExalted) && (KENDRA.includes(nlP2.house) || TRIKONA.includes(nlP2.house));
  results.push({
    id: 'lakshmi',
    name: { en: 'Lakshmi Yoga', hi: 'लक्ष्मी योग', sa: 'लक्ष्मीयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: lkPresent,
    strength: lkPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: '9th lord in own/exalted sign and in Kendra or Trikona',
      hi: 'नवमेश स्वराशि या उच्च में और केन्द्र या त्रिकोण में',
      sa: 'नवमेशः स्वोच्चराशौ केन्द्रे त्रिकोणे वा',
    },
    description: {
      en: 'Strong 9th lord in Kendra/Trikona bestows the blessings of Lakshmi — wealth and grace.',
      hi: 'नवमेश बली केन्द्र/त्रिकोण में। लक्ष्मी कृपा — धन और अनुग्रह।',
      sa: 'नवमेशः बली केन्द्रत्रिकोणे। लक्ष्म्याः कृपा — धनम् अनुग्रहश्च।',
    },
  });

  // 27. Gauri
  const moonInOwnExalted = moon.isOwnSign || moon.isExalted;
  const moonInKendra = KENDRA.includes(moon.house);
  const jupAspectsMoon = [1, 5, 7, 9].includes(houseOffset(moon.house, jupiter.house)) ||
                         KENDRA.includes(houseOffset(moon.house, jupiter.house));
  const gauriPresent = moonInOwnExalted && moonInKendra && jupAspectsMoon;
  results.push({
    id: 'gauri',
    name: { en: 'Gauri Yoga', hi: 'गौरी योग', sa: 'गौरीयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: gauriPresent,
    strength: gauriPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Moon in own/exalted sign in Kendra, aspected by Jupiter',
      hi: 'चन्द्र स्वराशि/उच्च में केन्द्र में, बृहस्पति की दृष्टि',
      sa: 'चन्द्रः स्वोच्चे केन्द्रे गुरुदृष्टियुक्तः',
    },
    description: {
      en: 'Dignified Moon in Kendra with Jupiter aspect grants beauty, devotion, and auspiciousness.',
      hi: 'चन्द्र बली केन्द्र में गुरु दृष्टि सहित। सौन्दर्य, भक्ति और शुभत्व।',
      sa: 'चन्द्रः बली केन्द्रे गुरुदृष्ट्या। सौन्दर्यं भक्तिं शुभत्वं च ददाति।',
    },
  });

  // 28. Bharati
  const secondLord = signLord(houseSign(2));
  const slP = getP(planets, secondLord);
  const jupIn2 = jupiter.house === 2;
  const jupAspects2 = houseOffset(jupiter.house, 2) === 5 || houseOffset(jupiter.house, 2) === 7 || houseOffset(jupiter.house, 2) === 9;
  const bharPresent = KENDRA.includes(slP.house) && (jupIn2 || jupAspects2);
  results.push({
    id: 'bharati',
    name: { en: 'Bharati Yoga', hi: 'भारती योग', sa: 'भारतीयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: bharPresent,
    strength: bharPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: '2nd lord in Kendra and Jupiter in/aspecting 2nd house',
      hi: 'द्वितीयेश केन्द्र में और बृहस्पति दूसरे भाव में या दृष्टि',
      sa: 'द्वितीयेशः केन्द्रे गुरुः द्वितीयभावे दृष्ट्या वा',
    },
    description: {
      en: 'Strong 2nd lord with Jupiter influence grants eloquence, learning, and scholarly fame.',
      hi: 'द्वितीयेश बली गुरु प्रभाव सहित। वाक्पटुता, विद्या और विद्वत यश।',
      sa: 'द्वितीयेशः बली गुरुप्रभावयुक्तः। वाग्वैभवं विद्यां विद्वद्यशश्च।',
    },
  });

  // 29. Shrinatha
  const seventhLord = signLord(houseSign(7));
  const tenthLord = signLord(houseSign(10));
  const shriPresent = getP(planets, seventhLord).isExalted && KENDRA.includes(getP(planets, tenthLord).house);
  results.push({
    id: 'shrinatha',
    name: { en: 'Shrinatha Yoga', hi: 'श्रीनाथ योग', sa: 'श्रीनाथयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: shriPresent,
    strength: shriPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: '7th lord exalted and 10th lord in Kendra',
      hi: 'सप्तमेश उच्च और दशमेश केन्द्र में',
      sa: 'सप्तमेशः उच्चे दशमेशः केन्द्रे च',
    },
    description: {
      en: 'Exalted 7th lord with 10th lord in Kendra grants lordship, partnerships, and eminence.',
      hi: 'सप्तमेश उच्च, दशमेश केन्द्र में। स्वामित्व, साझेदारी और प्रतिष्ठा।',
      sa: 'सप्तमेशः उच्चे दशमेशः केन्द्रे। स्वामित्वं साझेदारी प्रतिष्ठां च ददाति।',
    },
  });

  // 30. Shankha
  const fifthLord = signLord(houseSign(5));
  const sixthLord = signLord(houseSign(6));
  const fP = getP(planets, fifthLord);
  const sxP = getP(planets, sixthLord);
  const shankhaPresent = KENDRA.includes(fP.house) && KENDRA.includes(sxP.house) &&
                         (KENDRA.includes(llP.house) || llP.isOwnSign || llP.isExalted);
  results.push({
    id: 'shankha',
    name: { en: 'Shankha Yoga', hi: 'शंख योग', sa: 'शङ्खयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: shankhaPresent,
    strength: shankhaPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: '5th and 6th lords in mutual Kendra, Lagna lord strong',
      hi: 'पंचमेश और षष्ठेश केन्द्र में, लग्नेश बलवान',
      sa: 'पञ्चमेश-षष्ठेशौ केन्द्रे लग्नेशः बली',
    },
    description: {
      en: 'Shankha Yoga grants longevity, virtue, comforts, and a righteous disposition.',
      hi: 'शंख योग दीर्घायु, सद्गुण, सुख और धार्मिक प्रवृत्ति देता है।',
      sa: 'शङ्खयोगः दीर्घायुः सद्गुणान् सुखं धार्मिकप्रवृत्तिं च ददाति।',
    },
  });

  // 31. Bheri
  const bheriPresent = (nlP2.isOwnSign || nlP2.isExalted) && KENDRA.includes(getP(planets, 5).house);
  results.push({
    id: 'bheri',
    name: { en: 'Bheri Yoga', hi: 'भेरी योग', sa: 'भेरीयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: bheriPresent,
    strength: bheriPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: '9th lord in own/exalted sign and Venus in Kendra',
      hi: 'नवमेश स्वराशि/उच्च में और शुक्र केन्द्र में',
      sa: 'नवमेशः स्वोच्चे शुक्रः केन्द्रे च',
    },
    description: {
      en: 'Bheri Yoga bestows material comforts, devotion, and a virtuous family life.',
      hi: 'भेरी योग भौतिक सुख, भक्ति और सद्गृहस्थ जीवन देता है।',
      sa: 'भेरीयोगः भौतिकसुखं भक्तिं सद्गृहस्थजीवनं च ददाति।',
    },
  });

  // 32. Mahabhagya (male chart assumed)
  const sun = getP(planets, 0);
  const oddSigns = [1, 3, 5, 7, 9, 11];
  const mbPresent = oddSigns.includes(getP(planets, signLord(ascSign)).sign) &&
                    oddSigns.includes(sun.sign) &&
                    oddSigns.includes(moon.sign);
  results.push({
    id: 'mahabhagya',
    name: { en: 'Mahabhagya Yoga', hi: 'महाभाग्य योग', sa: 'महाभाग्ययोगः' },
    category: 'raja',
    isAuspicious: true,
    present: mbPresent,
    strength: mbPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Lagna lord, Sun, Moon all in odd signs (male chart)',
      hi: 'लग्नेश, सूर्य, चन्द्र सभी विषम राशि में (पुरुष कुण्डली)',
      sa: 'लग्नेशः सूर्यः चन्द्रश्च सर्वे ओजराशिषु (पुरुषजातके)',
    },
    description: {
      en: 'Great fortune yoga — Sun, Moon, and Lagna lord in odd signs grant extraordinary luck.',
      hi: 'महाभाग्य योग — सूर्य, चन्द्र, लग्नेश विषम राशि में। असाधारण भाग्य।',
      sa: 'महाभाग्ययोगः — सूर्यचन्द्रलग्नेशाः ओजराशिषु। असाधारणं भाग्यम्।',
    },
  });

  // 33. Pushkala
  const pushPresent = KENDRA.includes(llP.house) && KENDRA.includes(moon.house);
  results.push({
    id: 'pushkala',
    name: { en: 'Pushkala Yoga', hi: 'पुष्कल योग', sa: 'पुष्कलयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: pushPresent,
    strength: pushPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Lagna lord and Moon both in Kendra houses',
      hi: 'लग्नेश और चन्द्र दोनों केन्द्र भावों में',
      sa: 'लग्नेशः चन्द्रश्च उभौ केन्द्रभावेषु',
    },
    description: {
      en: 'Lagna lord and Moon in Kendra grant popularity, wealth, and a commanding presence.',
      hi: 'लग्नेश और चन्द्र केन्द्र में। लोकप्रियता, धन और प्रभावशाली व्यक्तित्व।',
      sa: 'लग्नेशः चन्द्रश्च केन्द्रे। लोकप्रियतां धनं प्रभावशालिव्यक्तित्वं च।',
    },
  });

  return results;
}

function detectWealthYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const houseSign = (h: number) => signFrom(ascSign, h);
  const lagnaLord = signLord(ascSign);
  const llP = getP(planets, lagnaLord);

  // 34. Chapa
  const fourthLord = signLord(houseSign(4));
  const tenthLord = signLord(houseSign(10));
  const chapaPresent = llP.isExalted &&
                       KENDRA.includes(getP(planets, fourthLord).house) &&
                       KENDRA.includes(getP(planets, tenthLord).house);
  results.push({
    id: 'chapa',
    name: { en: 'Chapa Yoga', hi: 'चाप योग', sa: 'चापयोगः' },
    category: 'wealth',
    isAuspicious: true,
    present: chapaPresent,
    strength: chapaPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Lagna lord exalted, 4th and 10th lords in Kendra',
      hi: 'लग्नेश उच्च, चतुर्थेश और दशमेश केन्द्र में',
      sa: 'लग्नेशः उच्चे चतुर्थेश-दशमेशौ केन्द्रे',
    },
    description: {
      en: 'Chapa Yoga grants royal wealth, landed property, and high social standing.',
      hi: 'चाप योग राजसी धन, भूसम्पत्ति और उच्च सामाजिक स्थिति देता है।',
      sa: 'चापयोगः राजधनं भूसम्पत्तिम् उच्चसामाजिकस्थितिं च ददाति।',
    },
  });

  // 35. Parijata
  const llSign = llP.sign;
  const dispositorId = signLord(llSign);
  const dispositor = getP(planets, dispositorId);
  const parijPresent = (KENDRA.includes(dispositor.house) || TRIKONA.includes(dispositor.house)) &&
                       (dispositor.isOwnSign || dispositor.isExalted);
  results.push({
    id: 'parijata',
    name: { en: 'Parijata Yoga', hi: 'पारिजात योग', sa: 'पारिजातयोगः' },
    category: 'wealth',
    isAuspicious: true,
    present: parijPresent,
    strength: parijPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Dispositor of Lagna lord in Kendra/Trikona and in own/exalted sign',
      hi: 'लग्नेश का राशि-स्वामी केन्द्र/त्रिकोण में स्वराशि या उच्च',
      sa: 'लग्नेशस्य राशीशः केन्द्रत्रिकोणे स्वोच्चराशौ च',
    },
    description: {
      en: 'Strong dispositor chain from Lagna lord grants ever-blooming prosperity like the celestial Parijata tree.',
      hi: 'लग्नेश की बलवान राशि-शृंखला। पारिजात वृक्ष सम सदैव फलदायी समृद्धि।',
      sa: 'लग्नेशस्य बलवती राशिशृङ्खला। पारिजातवृक्षवत् सदा समृद्धिः।',
    },
  });

  return results;
}

function detectInauspiciousYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const houseSign = (h: number) => signFrom(ascSign, h);
  const lagnaLord = signLord(ascSign);
  const llP = getP(planets, lagnaLord);
  const rahu = getP(planets, 7);
  const ketu = getP(planets, 8);
  const jupiter = getP(planets, 4);
  const sun = getP(planets, 0);
  const moon = getP(planets, 1);

  // 36. Vanchana Chora Bheeti
  const llInDusthana = DUSTHANA.includes(llP.house);
  const maleficIds = [0, 2, 6, 7, 8]; // Sun, Mars, Saturn, Rahu, Ketu
  const llWithMalefic = llInDusthana && planets.some(p => maleficIds.includes(p.id) && p.house === llP.house && p.id !== lagnaLord);
  results.push({
    id: 'vanchana_chora_bheeti',
    name: { en: 'Vanchana Chora Bheeti Yoga', hi: 'वञ्चना चोर भीति योग', sa: 'वञ्चनाचोरभीतियोगः' },
    category: 'inauspicious',
    isAuspicious: false,
    present: llWithMalefic,
    strength: llWithMalefic ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Lagna lord in Dusthana (6,8,12) with a malefic',
      hi: 'लग्नेश दुस्थान (6,8,12) में पाप ग्रह के साथ',
      sa: 'लग्नेशः दुस्थाने पापग्रहसहितः',
    },
    description: {
      en: 'Lagna lord afflicted in Dusthana indicates danger from deceit, theft, and fear.',
      hi: 'लग्नेश दुस्थान में पीड़ित। छल, चोरी और भय का संकेत।',
      sa: 'लग्नेशः दुस्थाने पीडितः। वञ्चनाचौर्यभयसूचकः।',
    },
  });

  // 37. Lagna Mallika (all 7 planets in 4 consecutive houses from 1)
  const sevenPlanets = planets.filter(p => p.id >= 0 && p.id <= 6);
  let mallikaPresent = false;
  for (let start = 1; start <= 12; start++) {
    const houses = [start, (start % 12) + 1, ((start + 1) % 12) + 1, ((start + 2) % 12) + 1];
    if (sevenPlanets.every(p => houses.includes(p.house))) {
      mallikaPresent = true;
      break;
    }
  }
  results.push({
    id: 'lagna_mallika',
    name: { en: 'Lagna Mallika Yoga', hi: 'लग्न मल्लिका योग', sa: 'लग्नमल्लिकायोगः' },
    category: 'inauspicious',
    isAuspicious: false,
    present: mallikaPresent,
    strength: mallikaPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'All 7 planets (Sun-Saturn) in 4 consecutive houses',
      hi: 'सभी 7 ग्रह (सूर्य-शनि) लगातार 4 भावों में',
      sa: 'सर्वे सप्तग्रहाः चतुर्षु क्रमभावेषु',
    },
    description: {
      en: 'All planets clustered in a narrow band limit life scope and create imbalance.',
      hi: 'सभी ग्रह संकीर्ण क्षेत्र में। जीवन में सीमितता और असंतुलन।',
      sa: 'सर्वे ग्रहाः संकीर्णक्षेत्रे। जीवने सीमितता असन्तुलनं च।',
    },
  });

  // 38. Daridra
  const eleventhLord = signLord(houseSign(11));
  const darPresent = DUSTHANA.includes(getP(planets, eleventhLord).house);
  results.push({
    id: 'daridra',
    name: { en: 'Daridra Yoga', hi: 'दरिद्र योग', sa: 'दरिद्रयोगः' },
    category: 'inauspicious',
    isAuspicious: false,
    present: darPresent,
    strength: darPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: '11th lord in Dusthana (6, 8, or 12)',
      hi: 'एकादशेश दुस्थान (6, 8 या 12) में',
      sa: 'एकादशेशः दुस्थाने (षष्ठ-अष्टम-द्वादशे)',
    },
    description: {
      en: '11th lord in Dusthana obstructs gains, income, and fulfillment of desires.',
      hi: 'एकादशेश दुस्थान में। लाभ, आय और इच्छापूर्ति में बाधा।',
      sa: 'एकादशेशः दुस्थाने। लाभे आये इच्छापूर्तौ च विघ्नः।',
    },
  });

  // 39. Guru Chandal
  const gcPresent = inSameHouse(jupiter, rahu);
  results.push({
    id: 'guru_chandal',
    name: { en: 'Guru Chandal Yoga', hi: 'गुरु चाण्डाल योग', sa: 'गुरुचाण्डालयोगः' },
    category: 'inauspicious',
    isAuspicious: false,
    present: gcPresent,
    strength: gcPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Jupiter and Rahu in the same house',
      hi: 'बृहस्पति और राहु एक ही भाव में',
      sa: 'गुरुराहू एकभावस्थौ',
    },
    description: {
      en: 'Jupiter-Rahu conjunction corrupts wisdom, causes unorthodox behavior and misguided counsel.',
      hi: 'गुरु-राहु युति। ज्ञान में भ्रम, अपरम्परागत व्यवहार और भ्रामक मार्गदर्शन।',
      sa: 'गुरुराहुयुतिः। प्रज्ञाभ्रंशः अपरम्परागतव्यवहारः भ्रामकमार्गदर्शनं च।',
    },
  });

  // 40. Grahan Yoga
  const sunWithNode = inSameHouse(sun, rahu) || inSameHouse(sun, ketu);
  const moonWithNode = inSameHouse(moon, rahu) || inSameHouse(moon, ketu);
  const grPresent = sunWithNode || moonWithNode;
  results.push({
    id: 'grahan',
    name: { en: 'Grahan Yoga', hi: 'ग्रहण योग', sa: 'ग्रहणयोगः' },
    category: 'inauspicious',
    isAuspicious: false,
    present: grPresent,
    strength: grPresent ? (sunWithNode && moonWithNode ? 'Strong' : 'Moderate') : 'Weak',
    formationRule: {
      en: 'Sun or Moon conjunct Rahu or Ketu',
      hi: 'सूर्य या चन्द्र राहु या केतु के साथ',
      sa: 'सूर्यः चन्द्रः वा राहु-केतुभ्यां युक्तः',
    },
    description: {
      en: 'Luminary eclipsed by a node causes identity confusion, health issues, and karmic struggle.',
      hi: 'सूर्य/चन्द्र ग्रहण। पहचान भ्रम, स्वास्थ्य समस्या और कार्मिक संघर्ष।',
      sa: 'ज्योतिषां ग्रहणम्। अस्मिताभ्रंशः स्वास्थ्यपीडा कार्मिकसंघर्षश्च।',
    },
  });

  return results;
}

function detectAdditionalAuspiciousYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const houseSign = (h: number) => signFrom(ascSign, h);
  const jupiter = getP(planets, 4);
  const venus = getP(planets, 5);
  const moon = getP(planets, 1);

  // 41. Raja Yoga (generic: Kendra lord + Trikona lord conjunct or mutual aspect)
  const kendraLords = KENDRA.map(h => signLord(houseSign(h)));
  const trikonaLords = TRIKONA.map(h => signLord(houseSign(h)));
  let rajaPresent = false;
  for (const kl of kendraLords) {
    for (const tl of trikonaLords) {
      if (kl === tl) continue; // same planet can't form yoga with itself in this check
      const klP = getP(planets, kl);
      const tlP = getP(planets, tl);
      if (inSameHouse(klP, tlP)) { rajaPresent = true; break; }
      // Mutual aspect: 7th from each other
      if (houseOffset(klP.house, tlP.house) === 7) { rajaPresent = true; break; }
    }
    if (rajaPresent) break;
  }
  results.push({
    id: 'raja_yoga',
    name: { en: 'Raja Yoga', hi: 'राज योग', sa: 'राजयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: rajaPresent,
    strength: rajaPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Kendra lord and Trikona lord conjunct or in mutual aspect',
      hi: 'केन्द्रेश और त्रिकोणेश युति या परस्पर दृष्टि में',
      sa: 'केन्द्रेशः त्रिकोणेशश्च युत्या परस्परदृष्ट्या वा',
    },
    description: {
      en: 'Union of Kendra and Trikona lords forms the most powerful Raja Yoga for authority and success.',
      hi: 'केन्द्रेश-त्रिकोणेश का मिलन। सत्ता और सफलता का सर्वश्रेष्ठ राजयोग।',
      sa: 'केन्द्रेश-त्रिकोणेशयोगः। सत्तायां सफलतायां च सर्वश्रेष्ठो राजयोगः।',
    },
  });

  // 42. Dhana Yoga
  const dhanaPresent = [2, 11].includes(jupiter.house) || [2, 11].includes(venus.house);
  results.push({
    id: 'dhana_yoga',
    name: { en: 'Dhana Yoga', hi: 'धन योग', sa: 'धनयोगः' },
    category: 'wealth',
    isAuspicious: true,
    present: dhanaPresent,
    strength: dhanaPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Jupiter or Venus in 2nd or 11th house',
      hi: 'बृहस्पति या शुक्र दूसरे या ग्यारहवें भाव में',
      sa: 'गुरुः शुक्रः वा द्वितीये एकादशे वा',
    },
    description: {
      en: 'Greater benefic in wealth houses bestows financial abundance and material prosperity.',
      hi: 'शुभ ग्रह धन भावों में। आर्थिक समृद्धि और भौतिक सम्पन्नता।',
      sa: 'शुभग्रहः धनभावे। आर्थिकसमृद्धिं भौतिकसम्पन्नतां च ददाति।',
    },
  });

  // 43. Viparita Raja Yoga
  const sixthLord = signLord(houseSign(6));
  const eighthLord = signLord(houseSign(8));
  const twelfthLord = signLord(houseSign(12));
  const d6 = getP(planets, sixthLord);
  const d8 = getP(planets, eighthLord);
  const d12 = getP(planets, twelfthLord);
  // Sign exchange among dusthana lords
  const vipPresent =
    (d6.sign === houseSign(8) && d8.sign === houseSign(6)) ||
    (d6.sign === houseSign(12) && d12.sign === houseSign(6)) ||
    (d8.sign === houseSign(12) && d12.sign === houseSign(8));
  results.push({
    id: 'viparita_raja',
    name: { en: 'Viparita Raja Yoga', hi: 'विपरीत राज योग', sa: 'विपरीतराजयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: vipPresent,
    strength: vipPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: '6th, 8th, or 12th lords exchange signs with each other',
      hi: '6, 8, या 12वें भाव के स्वामी परस्पर राशि परिवर्तन',
      sa: 'षष्ठाष्टमद्वादशेशाः परस्परं राशिपरिवर्तनं कुर्वन्ति',
    },
    description: {
      en: 'Dusthana lords exchanging signs create unexpected rise through adversity and enemies turning allies.',
      hi: 'दुस्थान स्वामियों का राशि परिवर्तन। विपरीत परिस्थितियों से अप्रत्याशित उत्थान।',
      sa: 'दुस्थानेशानां राशिपरिवर्तनम्। विपरीतस्थित्या अप्रत्याशितम् उत्थानम्।',
    },
  });

  // 44. Neechabhanga Raja Yoga
  let neechPresent = false;
  const debPlanets = planets.filter(p => p.isDebilitated && p.id <= 6);
  for (const dp of debPlanets) {
    const debLord = signLord(dp.sign); // lord of the sign where planet is debilitated
    const debLordP = getP(planets, debLord);
    if (KENDRA.includes(debLordP.house)) { neechPresent = true; break; }
    // Also check from Moon
    const moonH = moon.house;
    if (KENDRA.includes(houseOffset(moonH, debLordP.house))) { neechPresent = true; break; }
  }
  results.push({
    id: 'neechabhanga_raja',
    name: { en: 'Neechabhanga Raja Yoga', hi: 'नीचभंग राज योग', sa: 'नीचभङ्गराजयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: neechPresent,
    strength: neechPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Debilitated planet whose sign lord is in Kendra from Lagna or Moon',
      hi: 'नीच ग्रह जिसका राशि स्वामी लग्न या चन्द्र से केन्द्र में',
      sa: 'नीचग्रहस्य राशीशः लग्नात् चन्द्रात् वा केन्द्रे',
    },
    description: {
      en: 'Cancellation of debilitation transforms weakness into extraordinary strength and rise.',
      hi: 'नीच भंग — दुर्बलता असाधारण शक्ति और उत्थान में बदलती है।',
      sa: 'नीचभङ्गः — दौर्बल्यम् असाधारणशक्त्युत्थानयोः परिवर्तते।',
    },
  });

  // 45. Dharma-Karmadhipati Yoga
  const ninthLord = signLord(houseSign(9));
  const tenthLord = signLord(houseSign(10));
  const dkPresent = inSameHouse(getP(planets, ninthLord), getP(planets, tenthLord));
  results.push({
    id: 'dharma_karmadhipati',
    name: { en: 'Dharma-Karmadhipati Yoga', hi: 'धर्म-कर्माधिपति योग', sa: 'धर्मकर्माधिपतियोगः' },
    category: 'raja',
    isAuspicious: true,
    present: dkPresent,
    strength: dkPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: '9th lord and 10th lord in the same house',
      hi: 'नवमेश और दशमेश एक ही भाव में',
      sa: 'नवमेशदशमेशौ एकभावस्थौ',
    },
    description: {
      en: 'Union of dharma and karma lords grants righteous career, high status, and spiritual authority.',
      hi: 'धर्म-कर्म स्वामियों की युति। सत्कर्म, उच्च पद और आध्यात्मिक अधिकार।',
      sa: 'धर्मकर्मेशयोगः। सत्कर्म उच्चपदम् आध्यात्मिकाधिकारं च ददाति।',
    },
  });

  // 46. Saraswati Yoga
  const sarIds = [3, 4, 5]; // Mercury, Jupiter, Venus
  const sarHouses = [...KENDRA, ...TRIKONA, 2];
  const sarPresent = sarIds.every(id => sarHouses.includes(getP(planets, id).house));
  results.push({
    id: 'saraswati',
    name: { en: 'Saraswati Yoga', hi: 'सरस्वती योग', sa: 'सरस्वतीयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: sarPresent,
    strength: sarPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Jupiter, Venus, Mercury all in Kendra, Trikona, or 2nd house',
      hi: 'बृहस्पति, शुक्र, बुध सभी केन्द्र, त्रिकोण या दूसरे भाव में',
      sa: 'गुरुशुक्रबुधाः सर्वे केन्द्रे त्रिकोणे द्वितीये वा',
    },
    description: {
      en: 'All three wisdom planets well-placed grant exceptional learning, artistry, and eloquence.',
      hi: 'तीनों ज्ञान ग्रह सुस्थित। असाधारण विद्या, कला और वाक्पटुता।',
      sa: 'त्रयो ज्ञानग्रहाः सुस्थिताः। असाधारणविद्यां कलां वाक्पटुतां च ददाति।',
    },
  });

  // 47. Parivartana Yoga (sign exchange)
  let parivPresent = false;
  for (let a = 0; a <= 5; a++) {
    for (let b = a + 1; b <= 6; b++) {
      const pA = getP(planets, a);
      const pB = getP(planets, b);
      // A is in B's sign and B is in A's sign
      if (signLord(pA.sign) === b && signLord(pB.sign) === a) {
        parivPresent = true;
        break;
      }
    }
    if (parivPresent) break;
  }
  results.push({
    id: 'parivartana',
    name: { en: 'Parivartana Yoga', hi: 'परिवर्तन योग', sa: 'परिवर्तनयोगः' },
    category: 'other',
    isAuspicious: true,
    present: parivPresent,
    strength: parivPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Two planets (Sun-Saturn) exchanging signs with each other',
      hi: 'दो ग्रह (सूर्य-शनि) परस्पर राशि परिवर्तन',
      sa: 'द्वौ ग्रहौ (सूर्य-शनि) परस्परं राशिपरिवर्तनम्',
    },
    description: {
      en: 'Mutual sign exchange strengthens both planets and deeply connects the houses they rule.',
      hi: 'परस्पर राशि परिवर्तन। दोनों ग्रह सशक्त, उनके भाव गहनता से जुड़ते हैं।',
      sa: 'परस्परं राशिपरिवर्तनम्। उभौ ग्रहौ बलिनौ तद्भावयोः गाढसम्बन्धः।',
    },
  });

  return results;
}

function detectOtherYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const houseSign = (h: number) => signFrom(ascSign, h);
  const jupiter = getP(planets, 4);
  const moon = getP(planets, 1);

  // 48. Pravrajya (4+ planets in one house)
  let pravPresent = false;
  for (let h = 1; h <= 12; h++) {
    if (getPlanetsInHouse(planets, h).length >= 4) {
      pravPresent = true;
      break;
    }
  }
  results.push({
    id: 'pravrajya',
    name: { en: 'Pravrajya Yoga', hi: 'प्रव्रज्या योग', sa: 'प्रव्रज्यायोगः' },
    category: 'other',
    isAuspicious: false,
    present: pravPresent,
    strength: pravPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: '4 or more planets in a single house',
      hi: 'एक भाव में 4 या अधिक ग्रह',
      sa: 'एकस्मिन् भावे चत्वारः वा अधिकाः ग्रहाः',
    },
    description: {
      en: 'Heavy planetary concentration in one house indicates renunciation tendencies or monastic life.',
      hi: 'एक भाव में अधिक ग्रह। संन्यास प्रवृत्ति या वैराग्य जीवन का संकेत।',
      sa: 'एकभावे बहुग्रहाः। संन्यासप्रवृत्तिं वैराग्यजीवनं वा सूचयन्ति।',
    },
  });

  // 49. Kendradhipati Dosha
  let kdPresent = false;
  const naturalBenefics = [4, 5]; // Jupiter, Venus
  for (const bId of naturalBenefics) {
    const p = getP(planets, bId);
    for (const kh of KENDRA) {
      const ks = houseSign(kh);
      if (signLord(ks) === bId && p.house === kh) {
        kdPresent = true;
        break;
      }
    }
    if (kdPresent) break;
  }
  results.push({
    id: 'kendradhipati_dosha',
    name: { en: 'Kendradhipati Dosha', hi: 'केन्द्राधिपति दोष', sa: 'केन्द्राधिपतिदोषः' },
    category: 'inauspicious',
    isAuspicious: false,
    present: kdPresent,
    strength: kdPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Natural benefic (Jupiter/Venus) owns a Kendra house and is placed in that Kendra',
      hi: 'प्राकृतिक शुभ ग्रह (गुरु/शुक्र) केन्द्र का स्वामी और उसी केन्द्र में',
      sa: 'नैसर्गिकशुभग्रहः (गुरुः/शुक्रः) केन्द्राधिपतिः तस्मिन्नेव केन्द्रे स्थितः',
    },
    description: {
      en: 'Natural benefic owning a Kendra loses beneficence, becoming functionally neutral or harmful.',
      hi: 'केन्द्र स्वामी शुभ ग्रह अपनी शुभता खो देता है। कार्यात्मक रूप से तटस्थ या हानिकर।',
      sa: 'केन्द्राधिपतिः शुभग्रहः स्वशुभत्वं त्यजति। कार्यतः तटस्थः हानिकरः वा।',
    },
  });

  // 50. Shakata (extended) — same as #14 but cancelled if Jupiter in Kendra from lagna
  const shakatOffset = houseOffset(moon.house, jupiter.house);
  const shakatRaw = shakatOffset === 6 || shakatOffset === 8;
  const jupInKendraFromLagna = KENDRA.includes(jupiter.house);
  const shakatExtPresent = shakatRaw && !jupInKendraFromLagna;
  results.push({
    id: 'shakata_extended',
    name: { en: 'Shakata Yoga (Extended)', hi: 'शकट योग (विस्तृत)', sa: 'शकटयोगः (विस्तृतः)' },
    category: 'other',
    isAuspicious: false,
    present: shakatExtPresent,
    strength: shakatExtPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Jupiter in 6th/8th from Moon AND not in Kendra from Lagna (uncancelled)',
      hi: 'बृहस्पति चन्द्र से 6/8 में और लग्न से केन्द्र में नहीं (अखण्डित)',
      sa: 'गुरुः चन्द्रात् षष्ठाष्टमे लग्नात् केन्द्रे न च (अभग्नः)',
    },
    description: {
      en: 'Uncancelled Shakata causes constant ups and downs in fortune and wavering prosperity.',
      hi: 'अखण्डित शकट योग। भाग्य में निरन्तर उतार-चढ़ाव और अस्थिर समृद्धि।',
      sa: 'अभग्नः शकटयोगः। भाग्ये सततम् उत्थानपतनम् अस्थिरा समृद्धिश्च।',
    },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function detectAllYogas(planets: PlanetData[], ascendantSign: number): YogaComplete[] {
  return [
    ...detectDoshaYogas(planets, ascendantSign),
    ...detectMahapurushaYogas(planets),
    ...detectMoonBasedYogas(planets),
    ...detectSunBasedYogas(planets),
    ...detectRajaYogas(planets, ascendantSign),
    ...detectWealthYogas(planets, ascendantSign),
    ...detectInauspiciousYogas(planets, ascendantSign),
    ...detectAdditionalAuspiciousYogas(planets, ascendantSign),
    ...detectOtherYogas(planets, ascendantSign),
  ];
}
