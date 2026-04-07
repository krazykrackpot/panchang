// yogas-complete.ts — Comprehensive Vedic Yoga Detection Library (150+ yogas)
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

const GRAHA_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const GRAHA_HI = ['सूर्य', 'चन्द्रमा', 'मंगल', 'बुध', 'बृहस्पति', 'शुक्र', 'शनि', 'राहु', 'केतु'];

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

  // 2. Kala Sarpa Yoga — with 12 sub-types based on Rahu's house
  const rahuLon = rahu.longitude;
  const ketuLon = ketu.longitude;
  const sevenPlanets = planets.filter(p => p.id >= 0 && p.id <= 6);
  const allBetween = sevenPlanets.every(p => isLongBetween(p.longitude, rahuLon, ketuLon));
  const allBetweenReverse = sevenPlanets.every(p => isLongBetween(p.longitude, ketuLon, rahuLon));
  const ksPresent = allBetween || allBetweenReverse;

  const KSY_TYPES: Record<number, { en: string; hi: string; sa: string; themeEn: string; themeHi: string }> = {
    1:  { en: 'Anant',       hi: 'अनन्त',       sa: 'अनन्तः',       themeEn: 'Self-identity, health, and beginnings blocked by karmic debt',       themeHi: 'कर्मऋण से स्वास्थ्य और पहचान में बाधा' },
    2:  { en: 'Kulika',      hi: 'कुलिक',       sa: 'कुलिकः',       themeEn: 'Wealth, speech, and family lineage carry karmic burdens',            themeHi: 'धन, वाणी और परिवार पर कर्म का बोझ' },
    3:  { en: 'Vasuki',      hi: 'वासुकी',      sa: 'वासुकिः',      themeEn: 'Courage, siblings, and communication face karmic obstacles',          themeHi: 'साहस, भाई-बहन और संचार में बाधा' },
    4:  { en: 'Shankhapala', hi: 'शंखपाल',      sa: 'शंखपालः',      themeEn: 'Home, mother, and emotional security are karmically challenged',      themeHi: 'घर, माता और भावनात्मक सुरक्षा में कर्मिक चुनौती' },
    5:  { en: 'Padma',       hi: 'पद्म',        sa: 'पद्मः',        themeEn: 'Children, creativity, and intelligence bear karmic restrictions',      themeHi: 'संतान, रचनात्मकता और बुद्धि में कर्म की बाधा' },
    6:  { en: 'Mahapadma',   hi: 'महापद्म',     sa: 'महापद्मः',     themeEn: 'Enemies, debts, and diseases carry deep karmic patterns',             themeHi: 'शत्रु, ऋण और रोग में गहरा कर्म' },
    7:  { en: 'Takshaka',    hi: 'तक्षक',       sa: 'तक्षकः',       themeEn: 'Marriage, partnerships, and business relationships are karmically tested', themeHi: 'विवाह, साझेदारी और व्यापार में कर्म की परीक्षा' },
    8:  { en: 'Karkotak',    hi: 'कर्कोटक',     sa: 'कर्कोटकः',     themeEn: 'Longevity, hidden matters, and transformation carry karmic intensity',  themeHi: 'आयु, गुप्त विषय और परिवर्तन में कर्मिक तीव्रता' },
    9:  { en: 'Shankhachood', hi: 'शंखचूड',     sa: 'शंखचूडः',      themeEn: 'Luck, father, and dharma are challenged by past-life karma',           themeHi: 'भाग्य, पिता और धर्म में पूर्वजन्म का कर्म' },
    10: { en: 'Ghatak',      hi: 'घातक',        sa: 'घातकः',        themeEn: 'Career, reputation, and public life face karmic tests',                 themeHi: 'करियर और सार्वजनिक जीवन में कर्मिक परीक्षा' },
    11: { en: 'Vishdhar',    hi: 'विषधर',       sa: 'विषधरः',       themeEn: 'Gains, friends, and ambitions bear karmic poison that delays fulfillment', themeHi: 'लाभ, मित्र और महत्वाकांक्षा में विलंब' },
    12: { en: 'Sheshnag',    hi: 'शेषनाग',      sa: 'शेषनागः',      themeEn: 'Foreign lands, losses, and liberation carry intense karmic weight',     themeHi: 'विदेश, हानि और मोक्ष में गहरा कर्म' },
  };

  const rahuHouse = rahu.house;
  const ksSubType = ksPresent ? (KSY_TYPES[rahuHouse] ?? KSY_TYPES[1]) : null;

  results.push({
    id: 'kala_sarpa',
    name: ksPresent && ksSubType
      ? { en: `Kala Sarpa Yoga — ${ksSubType.en}`, hi: `काल सर्प योग — ${ksSubType.hi}`, sa: `कालसर्पयोगः — ${ksSubType.sa}` }
      : { en: 'Kala Sarpa Yoga', hi: 'काल सर्प योग', sa: 'कालसर्पयोगः' },
    category: 'dosha',
    isAuspicious: false,
    present: ksPresent,
    strength: ksPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'All seven planets hemmed between Rahu and Ketu',
      hi: 'सभी सात ग्रह राहु और केतु के बीच',
      sa: 'सर्वे सप्तग्रहाः राहु-केत्वोर्मध्ये स्थिताः',
    },
    description: ksPresent && ksSubType ? {
      en: `${ksSubType.en} Kala Sarpa (Rahu in house ${rahuHouse}): ${ksSubType.themeEn}. All planets hemmed between the lunar nodes intensifies karmic experiences.`,
      hi: `${ksSubType.hi} काल सर्प (राहु ${rahuHouse}वें भाव में): ${ksSubType.themeHi}। सभी ग्रह राहु-केतु अक्ष में।`,
      sa: `${ksSubType.sa} कालसर्पयोगः (राहुः ${rahuHouse}भावे): सर्वे ग्रहाः राहुकेत्वोर्मध्ये।`,
    } : {
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
  // Classical rule (BPHS Ch.41, Phaladeepika Ch.6): the lords of houses 6, 8,
  // and 12 (dusthanas) must (a) be placed IN dusthana houses AND (b) exchange
  // signs with each other.
  //
  // HISTORICAL BUG (now fixed): only the sign-exchange condition was checked.
  // The prerequisite — that each involved lord must actually be LOCATED in a
  // dusthana house (6, 8, or 12) — was missing entirely.  Without it, two
  // dusthana lords in, say, houses 1 and 5 but in each other's signs would
  // incorrectly trigger the yoga, which is a false positive.
  const sixthLord = signLord(houseSign(6));
  const eighthLord = signLord(houseSign(8));
  const twelfthLord = signLord(houseSign(12));
  const d6 = getP(planets, sixthLord);
  const d8 = getP(planets, eighthLord);
  const d12 = getP(planets, twelfthLord);
  const DUSTHANAS = new Set([6, 8, 12]);
  // Sign exchange AND both lords physically placed in dusthana houses
  const vipPresent =
    (d6.sign === houseSign(8) && d8.sign === houseSign(6) && DUSTHANAS.has(d6.house) && DUSTHANAS.has(d8.house)) ||
    (d6.sign === houseSign(12) && d12.sign === houseSign(6) && DUSTHANAS.has(d6.house) && DUSTHANAS.has(d12.house)) ||
    (d8.sign === houseSign(12) && d12.sign === houseSign(8) && DUSTHANAS.has(d8.house) && DUSTHANAS.has(d12.house));
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

// ---------------------------------------------------------------------------
// Extended Doshas (Phase 2 additions)
// ---------------------------------------------------------------------------

function detectExtendedDoshas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const hOf = (id: number) => getP(planets, id).house;
  const sOf = (id: number) => getP(planets, id).sign;

  // Pitra Dosha: Sun conjunct Rahu/Ketu, or 9th house afflicted by malefics
  const sunWithRahu = hOf(0) === hOf(7);
  const sunWithKetu = hOf(0) === hOf(8);
  const ninth = ((ascSign - 1 + 8) % 12) + 1;
  const maleficsIn9 = planets.filter(p => p.house === 9 && isMalefic(p.id)).length;
  const pitraPresent = sunWithRahu || sunWithKetu || maleficsIn9 >= 2;
  results.push({
    id: 'pitra_dosha', category: 'dosha', isAuspicious: false, present: pitraPresent,
    strength: pitraPresent ? 'Strong' : 'Weak',
    name: { en: 'Pitra Dosha', hi: 'पित्र दोष', sa: 'पितृदोषः' },
    formationRule: { en: 'Sun with Rahu/Ketu, or 9th house heavily afflicted', hi: 'सूर्य राहु/केतु के साथ, या 9वां भाव पीड़ित', sa: '' },
    description: { en: 'Ancestral karmic debt — difficulties with father, authority, or spiritual lineage. Remedy: Pitra Tarpan, Narayan Nagbali', hi: 'पूर्वजों का कार्मिक ऋण — पिता, अधिकार में कठिनाई। उपाय: पित्र तर्पण, नारायण नागबली', sa: '' },
  });

  // Shrapit Dosha: Saturn-Rahu conjunction
  const shrapitPresent = hOf(6) === hOf(7);
  results.push({
    id: 'shrapit_dosha', category: 'dosha', isAuspicious: false, present: shrapitPresent,
    strength: shrapitPresent ? 'Strong' : 'Weak',
    name: { en: 'Shrapit Dosha', hi: 'श्रापित दोष', sa: 'श्रापितदोषः' },
    formationRule: { en: 'Saturn conjunct Rahu in any house', hi: 'शनि-राहु युति किसी भी भाव में', sa: '' },
    description: { en: 'Cursed from past life — chronic obstacles, delays, karmic suffering. Remedy: Rahu-Shani shanti, Mahamrityunjaya japa', hi: 'पूर्वजन्म का शाप — दीर्घकालिक बाधाएं, विलंब। उपाय: राहु-शनि शांति, महामृत्युंजय जप', sa: '' },
  });

  // Kalathra Dosha: 7th lord in 6/8/12, or malefics in 7th
  const sign7 = ((ascSign - 1 + 6) % 12) + 1;
  const lord7 = signLord(sign7);
  const lord7House = hOf(lord7);
  const maleficsIn7 = planets.filter(p => p.house === 7 && isMalefic(p.id)).length;
  const kalathraPresent = [6,8,12].includes(lord7House) || maleficsIn7 >= 2;
  results.push({
    id: 'kalathra_dosha', category: 'dosha', isAuspicious: false, present: kalathraPresent,
    strength: kalathraPresent ? 'Strong' : 'Weak',
    name: { en: 'Kalathra Dosha', hi: 'कलत्र दोष', sa: 'कलत्रदोषः' },
    formationRule: { en: '7th lord in dusthana, or malefics in 7th house', hi: '7वें भावेश दुःस्थान में, या 7वें भाव में पाप ग्रह', sa: '' },
    description: { en: 'Marriage/partnership affliction — delays, disagreements, or separation in relationships. Venus strength can mitigate.', hi: 'विवाह/साझेदारी में कष्ट — देरी, मतभेद। शुक्र बल से शमन।', sa: '' },
  });

  // Marana Karaka Sthana: Planet in its death-like house
  const MARANA: Record<number, number> = { 0:12, 1:8, 2:7, 3:4, 4:3, 5:6, 6:1, 7:9, 8:3 };
  for (let pid = 0; pid <= 8; pid++) {
    if (hOf(pid) === MARANA[pid]) {
      const pName = planets.find(p => p.id === pid);
      results.push({
        id: `marana_karaka_${pid}`, category: 'dosha', isAuspicious: false, present: true,
        strength: 'Moderate',
        name: { en: `Marana Karaka Sthana (${['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'][pid]})`, hi: `मरण कारक स्थान`, sa: 'मरणकारकस्थानम्' },
        formationRule: { en: `Planet in its death-signifying house (${MARANA[pid]}th)`, hi: `ग्रह अपने मृत्यु-सूचक भाव (${MARANA[pid]}वें) में`, sa: '' },
        description: { en: 'Planet becomes extremely weak — like a person in a place of death. Significations of this planet suffer greatly.', hi: 'ग्रह अत्यंत दुर्बल — मृत्यु स्थान जैसा। इस ग्रह के कारकत्व बहुत पीड़ित।', sa: '' },
      });
    }
  }

  // Badhaka: Badhakesh in Lagna or aspecting Lagna
  // For movable signs: 11th lord is Badhaka; Fixed: 9th; Dual: 7th
  const signType = (ascSign - 1) % 3; // 0=movable, 1=fixed, 2=dual
  const badhakHouse = signType === 0 ? 11 : signType === 1 ? 9 : 7;
  const badhakSign = ((ascSign - 1 + badhakHouse - 1) % 12) + 1;
  const badhakLord = signLord(badhakSign);
  const badhakInLagna = hOf(badhakLord) === 1;
  results.push({
    id: 'badhaka', category: 'dosha', isAuspicious: false, present: badhakInLagna,
    strength: badhakInLagna ? 'Strong' : 'Weak',
    name: { en: 'Badhaka Dosha', hi: 'बाधक दोष', sa: 'बाधकदोषः' },
    formationRule: { en: `Badhakesh (${badhakHouse}th lord) placed in Lagna`, hi: `बाधकेश (${badhakHouse}वें भावेश) लग्न में`, sa: '' },
    description: { en: 'Badhaka lord in ascendant — mysterious obstacles, inexplicable setbacks, spiritual interference. Remedy: worship the deity of the Badhaka sign.', hi: 'बाधकेश लग्न में — रहस्यमय बाधाएं, अकथनीय विफलताएं। उपाय: बाधक राशि के देवता की पूजा।', sa: '' },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Sankhya Yogas (7) — Number of signs occupied
// ---------------------------------------------------------------------------

function detectSankhyaYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];
  const seven = planets.filter(p => p.id < 7);
  const occupiedSigns = new Set(seven.map(p => p.sign));
  const count = occupiedSigns.size;

  const SANKHYA: { count: number; id: string; name: { en: string; hi: string; sa: string }; desc: string }[] = [
    { count: 1, id: 'gola', name: { en: 'Gola Yoga', hi: 'गोल योग', sa: 'गोलयोगः' }, desc: 'All 7 planets in 1 sign — extreme concentration of energy. Very rare. Native dominates one area of life completely.' },
    { count: 2, id: 'yuga', name: { en: 'Yuga Yoga', hi: 'युग योग', sa: 'युगयोगः' }, desc: 'All planets in 2 signs — polarized energy between two life areas.' },
    { count: 3, id: 'shoola_nabhasa', name: { en: 'Shoola Yoga (Nabhasa)', hi: 'शूल योग (नभस)', sa: 'शूलयोगः' }, desc: 'Planets in 3 signs — trident-like energy, sharp and focused.' },
    { count: 4, id: 'kedara', name: { en: 'Kedara Yoga', hi: 'केदार योग', sa: 'केदारयोगः' }, desc: 'Planets in 4 signs — field of activity, productive agriculture.' },
    { count: 5, id: 'pasha', name: { en: 'Pasha Yoga', hi: 'पाश योग', sa: 'पाशयोगः' }, desc: 'Planets in 5 signs — noose/bondage, some restriction but also deep connections.' },
    { count: 6, id: 'damini', name: { en: 'Damini Yoga', hi: 'दामिनी योग', sa: 'दामिनीयोगः' }, desc: 'Planets in 6 signs — generous, charitable, lightning-like brilliance.' },
    { count: 7, id: 'veena', name: { en: 'Veena Yoga', hi: 'वीणा योग', sa: 'वीणायोगः' }, desc: 'Planets in 7 signs — musical, artistic, balanced across many areas.' },
  ];

  for (const s of SANKHYA) {
    const present = count === s.count;
    results.push({
      id: s.id, category: 'other', isAuspicious: s.count >= 4, present,
      strength: present ? 'Strong' : 'Weak',
      name: s.name,
      formationRule: { en: `All 7 planets in exactly ${s.count} sign(s)`, hi: `सभी 7 ग्रह ठीक ${s.count} राशि(यों) में`, sa: '' },
      description: { en: s.desc, hi: s.desc, sa: '' },
    });
  }
  return results;
}

// ---------------------------------------------------------------------------
// Graha Malika Yoga — Planets in consecutive houses
// ---------------------------------------------------------------------------

function detectGrahaMalikaYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const seven = planets.filter(p => p.id < 7);
  const houses = new Set(seven.map(p => p.house));

  // Check for consecutive house chain (3+ in a row)
  let maxChain = 0;
  let chainStart = 0;
  for (let start = 1; start <= 12; start++) {
    let chain = 0;
    for (let h = 0; h < 12; h++) {
      const house = ((start - 1 + h) % 12) + 1;
      if (houses.has(house)) chain++;
      else break;
    }
    if (chain > maxChain) { maxChain = chain; chainStart = start; }
  }

  const present = maxChain >= 3;
  results.push({
    id: 'graha_malika', category: 'other', isAuspicious: true, present,
    strength: maxChain >= 7 ? 'Strong' : maxChain >= 5 ? 'Moderate' : present ? 'Weak' : 'Weak',
    name: { en: 'Graha Malika Yoga', hi: 'ग्रह मालिका योग', sa: 'ग्रहमालिकायोगः' },
    formationRule: { en: `Planets in ${maxChain} consecutive houses starting from house ${chainStart}`, hi: `${maxChain} क्रमागत भावों में ग्रह, भाव ${chainStart} से`, sa: '' },
    description: { en: `Garland of planets — ${maxChain} planets in consecutive houses creates a continuous flow of energy. The starting house determines the life theme. Longer chains = more powerful.`, hi: `ग्रहों की माला — ${maxChain} क्रमागत भावों में ग्रह। प्रारम्भ भाव जीवन विषय निर्धारित करता है।`, sa: '' },
  });

  return results;
}

// ---------------------------------------------------------------------------
// More Arishta (Longevity) Yogas
// ---------------------------------------------------------------------------

function detectArishtaYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const hOf = (id: number) => getP(planets, id).house;

  // Balarishta: Moon in 6/8/12 without benefic aspect (child mortality indicator)
  const moonHouse = hOf(1);
  const moonInDusthana = [6, 8, 12].includes(moonHouse);
  const jupAspectMoon = [1, 5, 7, 9].some(off => ((moonHouse - 1 + off - 1 + 12) % 12) + 1 === hOf(4));
  results.push({
    id: 'balarishta', category: 'inauspicious', isAuspicious: false,
    present: moonInDusthana && !jupAspectMoon,
    strength: moonInDusthana && !jupAspectMoon ? 'Moderate' : 'Weak',
    name: { en: 'Balarishta Yoga', hi: 'बालारिष्ट योग', sa: 'बालारिष्टयोगः' },
    formationRule: { en: 'Moon in 6th/8th/12th without Jupiter aspect', hi: 'चन्द्र 6/8/12 में बिना गुरु दृष्टि', sa: '' },
    description: { en: 'Early life health challenges. Cancelled by Jupiter aspect, Moon in own/exalted sign, or strong Lagna lord. Most modern cases show childhood illness, not mortality.', hi: 'बचपन में स्वास्थ्य चुनौतियाँ। गुरु दृष्टि, चन्द्र स्व/उच्च, या बलवान लग्नेश से रद्द।', sa: '' },
  });

  // Alpayu Yoga: Lagna lord + 8th lord in 6/8/12 together
  const lord1 = signLord(((ascSign - 1) % 12) + 1);
  const lord8 = signLord(((ascSign - 1 + 7) % 12) + 1);
  const l1h = hOf(lord1), l8h = hOf(lord8);
  const alpayu = l1h === l8h && [6, 8, 12].includes(l1h);
  results.push({
    id: 'alpayu', category: 'inauspicious', isAuspicious: false,
    present: alpayu, strength: alpayu ? 'Strong' : 'Weak',
    name: { en: 'Alpayu Yoga', hi: 'अल्पायु योग', sa: 'अल्पायुयोगः' },
    formationRule: { en: 'Lagna lord and 8th lord conjunct in a dusthana', hi: 'लग्नेश और 8वें भावेश दुःस्थान में युत', sa: '' },
    description: { en: 'Short lifespan indicator. Severity depends on sign, aspects, and Shadbala of involved planets. Strong Jupiter or benefic on Lagna mitigates.', hi: 'अल्प आयु सूचक। राशि, दृष्टि और षड्बल पर निर्भर।', sa: '' },
  });

  // Madhyayu: 8th lord in kendra but with malefic aspect
  const l8kendra = [1, 4, 7, 10].includes(l8h);
  results.push({
    id: 'madhyayu', category: 'other', isAuspicious: false,
    present: l8kendra, strength: l8kendra ? 'Moderate' : 'Weak',
    name: { en: 'Madhyayu Yoga', hi: 'मध्यायु योग', sa: 'मध्यायुयोगः' },
    formationRule: { en: '8th lord in kendra', hi: '8वें भावेश केंद्र में', sa: '' },
    description: { en: 'Medium lifespan (60-70 years). 8th lord in kendra gives moderate longevity. If aspected by benefics, extends toward Poornayu.', hi: 'मध्यम आयु (60-70 वर्ष)। शुभ दृष्टि से पूर्णायु की ओर।', sa: '' },
  });

  return results;
}

// ---------------------------------------------------------------------------
// More Dhana (Wealth) Yogas
// ---------------------------------------------------------------------------

function detectMoreDhanaYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const hOf = (id: number) => getP(planets, id).house;

  // Kubera Yoga: Jupiter in 11th with benefic in 2nd
  const jupIn11 = hOf(4) === 11;
  const beneficIn2 = planets.filter(p => p.house === 2 && isBenefic(p.id)).length > 0;
  results.push({
    id: 'kubera', category: 'wealth', isAuspicious: true,
    present: jupIn11 && beneficIn2, strength: jupIn11 && beneficIn2 ? 'Strong' : 'Weak',
    name: { en: 'Kubera Yoga', hi: 'कुबेर योग', sa: 'कुबेरयोगः' },
    formationRule: { en: 'Jupiter in 11th with benefic in 2nd', hi: 'गुरु 11वें में, शुभ ग्रह 2nd में', sa: '' },
    description: { en: 'Named after Kubera (god of wealth). Enormous wealth accumulation. Jupiter in 11th = gains through wisdom; benefic in 2nd = family wealth secured.', hi: 'कुबेर (धन के देवता) के नाम पर। अत्यधिक धन संचय।', sa: '' },
  });

  // Chandra-Mangal in 11th = wealth through business/property
  const moonMarsIn11 = hOf(1) === 11 && hOf(2) === 11;
  results.push({
    id: 'chandra_mangal_dhana', category: 'wealth', isAuspicious: true,
    present: moonMarsIn11, strength: moonMarsIn11 ? 'Strong' : 'Weak',
    name: { en: 'Chandra-Mangal Dhana Yoga', hi: 'चन्द्र-मंगल धन योग', sa: 'चन्द्रमङ्गलधनयोगः' },
    formationRule: { en: 'Moon and Mars conjunct in 11th house', hi: 'चन्द्र-मंगल 11वें भाव में', sa: '' },
    description: { en: 'Wealth through business, property, or bold enterprise. Moon provides public appeal; Mars provides drive and courage in financial matters.', hi: 'व्यापार, संपत्ति या साहसिक उद्यम से धन।', sa: '' },
  });

  // 2nd lord in 11th or 11th lord in 2nd = income-wealth axis
  const lord2 = signLord(((ascSign - 1 + 1) % 12) + 1);
  const lord11 = signLord(((ascSign - 1 + 10) % 12) + 1);
  const axisActive = hOf(lord2) === 11 || hOf(lord11) === 2;
  results.push({
    id: 'dhana_axis', category: 'wealth', isAuspicious: true,
    present: axisActive, strength: axisActive ? 'Moderate' : 'Weak',
    name: { en: 'Dhana Axis Yoga', hi: 'धनाक्ष योग', sa: 'धनाक्षयोगः' },
    formationRule: { en: '2nd lord in 11th OR 11th lord in 2nd', hi: '2वें भावेश 11वें में या 11वें भावेश 2nd में', sa: '' },
    description: { en: 'Income and accumulated wealth axis activated. Money flows between earnings and savings efficiently.', hi: 'आय और संचित धन अक्ष सक्रिय।', sa: '' },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Miscellaneous Named Yogas
// ---------------------------------------------------------------------------

function detectMiscYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const hOf = (id: number) => getP(planets, id).house;

  // Akhanda Samrajya Yoga: Jupiter in 2/5/11, lord of 2/5/11 in kendra from Moon
  const jupHouse = hOf(4);
  const akhandaPossible = [2, 5, 11].includes(jupHouse);
  results.push({
    id: 'akhanda_samrajya', category: 'raja', isAuspicious: true,
    present: akhandaPossible, strength: akhandaPossible ? 'Moderate' : 'Weak',
    name: { en: 'Akhanda Samrajya Yoga', hi: 'अखंड साम्राज्य योग', sa: 'अखण्डसाम्राज्ययोगः' },
    formationRule: { en: 'Jupiter in 2nd/5th/11th house', hi: 'गुरु 2/5/11वें भाव में', sa: '' },
    description: { en: 'Unbroken empire — sustained power and authority. Jupiter in wealth/fortune houses gives divine protection to position. Very rare in full form.', hi: 'अखंड साम्राज्य — निरंतर शक्ति और अधिकार।', sa: '' },
  });

  // Chamara Yoga: Lagna lord exalted in kendra, aspected by Jupiter
  const lord1 = signLord(ascSign);
  const l1exalted = getP(planets, lord1).isExalted;
  const l1kendra = [1, 4, 7, 10].includes(hOf(lord1));
  results.push({
    id: 'chamara', category: 'raja', isAuspicious: true,
    present: l1exalted && l1kendra, strength: l1exalted && l1kendra ? 'Strong' : 'Weak',
    name: { en: 'Chamara Yoga', hi: 'चामर योग', sa: 'चामरयोगः' },
    formationRule: { en: 'Lagna lord exalted in kendra', hi: 'लग्नेश उच्च और केंद्र में', sa: '' },
    description: { en: 'Royal fan-bearer — the native is honored by kings/authorities. Exalted Lagna lord in kendra gives exceptional life outcomes.', hi: 'राजसी चामर — जातक राजाओं/अधिकारियों द्वारा सम्मानित।', sa: '' },
  });

  // Chatussagara Yoga: all kendras occupied by planets
  const kendraOccupied = [1,4,7,10].every(h => planets.some(p => p.house === h && p.id < 7));
  results.push({
    id: 'chatussagara_full', category: 'raja', isAuspicious: true,
    present: kendraOccupied, strength: kendraOccupied ? 'Strong' : 'Weak',
    name: { en: 'Chatussagara Yoga (Full)', hi: 'चतुस्सागर योग (पूर्ण)', sa: 'चतुस्सागरयोगः' },
    formationRule: { en: 'All 4 kendras (1,4,7,10) occupied by planets', hi: 'सभी 4 केंद्र (1,4,7,10) में ग्रह', sa: '' },
    description: { en: 'Four oceans yoga — fame spreads in all four directions. The native becomes widely known and respected. Very auspicious when kendras have benefics.', hi: 'चार समुद्र योग — यश चारों दिशाओं में फैलता है।', sa: '' },
  });

  // Sunapha from Lagna: planet in 2nd from Lagna (not Sun/Moon)
  const planetsIn2 = planets.filter(p => p.house === 2 && p.id >= 2 && p.id <= 6);
  results.push({
    id: 'sunapha_lagna', category: 'other', isAuspicious: true,
    present: planetsIn2.length > 0, strength: planetsIn2.length > 0 ? 'Moderate' : 'Weak',
    name: { en: 'Sunapha from Lagna', hi: 'लग्न से सुनफा', sa: 'लग्नसुनफायोगः' },
    formationRule: { en: 'True planet (Mars-Saturn) in 2nd from Lagna', hi: 'सच्चा ग्रह (मंगल-शनि) लग्न से 2nd में', sa: '' },
    description: { en: 'Similar to Moon-based Sunapha but from Lagna. Indicates self-made wealth and good reputation through personal effort.', hi: 'चन्द्र-आधारित सुनफा जैसा लेकिन लग्न से। स्वनिर्मित धन और प्रतिष्ठा।', sa: '' },
  });

  // Anapha from Lagna: planet in 12th from Lagna
  const planetsIn12 = planets.filter(p => p.house === 12 && p.id >= 2 && p.id <= 6);
  results.push({
    id: 'anapha_lagna', category: 'other', isAuspicious: true,
    present: planetsIn12.length > 0, strength: planetsIn12.length > 0 ? 'Moderate' : 'Weak',
    name: { en: 'Anapha from Lagna', hi: 'लग्न से अनफा', sa: 'लग्नअनफायोगः' },
    formationRule: { en: 'True planet in 12th from Lagna', hi: 'सच्चा ग्रह लग्न से 12th में', sa: '' },
    description: { en: 'Attractive personality, comforts, and artistic inclination. 12th from Lagna indicates hidden strengths and foreign connections.', hi: 'आकर्षक व्यक्तित्व, सुख और कलात्मक। 12th = छुपी शक्तियाँ, विदेशी संबंध।', sa: '' },
  });

  // Nipuna/Budha-Aditya variant: Sun-Mercury in kendra
  const sunMercKendra = hOf(0) === hOf(3) && [1,4,7,10].includes(hOf(0));
  results.push({
    id: 'nipuna', category: 'other', isAuspicious: true,
    present: sunMercKendra, strength: sunMercKendra ? 'Strong' : 'Weak',
    name: { en: 'Nipuna Yoga', hi: 'निपुण योग', sa: 'निपुणयोगः' },
    formationRule: { en: 'Sun-Mercury conjunction in a kendra', hi: 'सूर्य-बुध युति केंद्र में', sa: '' },
    description: { en: 'Skilled/expert yoga. Sun-Mercury in kendra gives exceptional skill in profession, communication mastery, and administrative brilliance.', hi: 'निपुण/विशेषज्ञ योग। व्यवसाय में असाधारण कौशल, संचार निपुणता।', sa: '' },
  });

  // Shubha Kartari: Benefics in 2nd and 12th from Lagna
  const benefIn2 = planets.some(p => p.house === 2 && isBenefic(p.id));
  const benefIn12 = planets.some(p => p.house === 12 && isBenefic(p.id));
  results.push({
    id: 'shubha_kartari', category: 'other', isAuspicious: true,
    present: benefIn2 && benefIn12, strength: benefIn2 && benefIn12 ? 'Strong' : 'Weak',
    name: { en: 'Shubha Kartari Yoga', hi: 'शुभ कर्तरी योग', sa: 'शुभकर्तरीयोगः' },
    formationRule: { en: 'Benefics in both 2nd and 12th from Lagna', hi: 'लग्न से 2nd और 12th दोनों में शुभ', sa: '' },
    description: { en: 'Auspicious scissors — Lagna is hemmed between benefics, protecting the native. Excellent health, fortune, and protection from enemies.', hi: 'शुभ कैंची — लग्न शुभ ग्रहों के बीच, जातक की रक्षा। उत्कृष्ट स्वास्थ्य, भाग्य।', sa: '' },
  });

  // Papa Kartari: Malefics in 2nd and 12th from Lagna
  const malIn2 = planets.some(p => p.house === 2 && isMalefic(p.id));
  const malIn12 = planets.some(p => p.house === 12 && isMalefic(p.id));
  results.push({
    id: 'papa_kartari', category: 'inauspicious', isAuspicious: false,
    present: malIn2 && malIn12, strength: malIn2 && malIn12 ? 'Strong' : 'Weak',
    name: { en: 'Papa Kartari Yoga', hi: 'पाप कर्तरी योग', sa: 'पापकर्तरीयोगः' },
    formationRule: { en: 'Malefics in both 2nd and 12th from Lagna', hi: 'लग्न से 2nd और 12th दोनों में पाप', sa: '' },
    description: { en: 'Inauspicious scissors — Lagna hemmed between malefics. Obstacles, health issues, and struggles. Can be mitigated by strong Lagna lord or Jupiter aspect.', hi: 'पाप कैंची — लग्न पाप ग्रहों के बीच। बाधाएं, स्वास्थ्य समस्याएं। गुरु दृष्टि से शमन।', sa: '' },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Expanded Raja Yogas — per-house lord combinations
// ---------------------------------------------------------------------------

function detectExpandedRajaYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const hOf = (id: number) => getP(planets, id).house;
  const lordOf = (h: number) => signLord(((ascSign - 1 + h - 1) % 12) + 1);

  // Specific kendra-trikona pairs
  const pairs: [number, number, string][] = [
    [1, 5, 'Lagna-5th'], [1, 9, 'Lagna-9th'], [4, 5, '4th-5th'], [4, 9, '4th-9th'],
    [7, 5, '7th-5th'], [7, 9, '7th-9th'], [10, 5, '10th-5th'], [10, 9, '10th-9th'],
  ];

  for (const [kh, th, label] of pairs) {
    const kl = lordOf(kh), tl = lordOf(th);
    if (kl === tl) continue;
    const conjunct = hOf(kl) === hOf(tl);
    if (conjunct) {
      results.push({
        id: `raja_${kh}_${th}`, category: 'raja', isAuspicious: true, present: true,
        strength: [9,10].includes(kh) || [9].includes(th) ? 'Strong' : 'Moderate',
        name: { en: `Raja Yoga (${label} lords)`, hi: `राज योग (${label})`, sa: '' },
        formationRule: { en: `${kh}th lord and ${th}th lord conjunct`, hi: `${kh}वें और ${th}वें भावेश युत`, sa: '' },
        description: { en: `Kendra-Trikona connection between houses ${kh} and ${th}. Power and fortune combine.`, hi: `केंद्र-त्रिकोण संबंध। शक्ति और भाग्य का मिलन।`, sa: '' },
      });
    }
  }

  // Exchange-based Raja Yogas (Parivartana between kendra-trikona)
  for (const [kh, th] of [[4,9],[10,9],[7,5],[1,9]]) {
    const kl = lordOf(kh), tl = lordOf(th);
    if (kl === tl) continue;
    const klSign = getP(planets, kl).sign;
    const tlSign = getP(planets, tl).sign;
    const klLord = signLord(klSign);
    const tlLord = signLord(tlSign);
    if (klLord === tl && tlLord === kl) {
      results.push({
        id: `raja_exchange_${kh}_${th}`, category: 'raja', isAuspicious: true, present: true, strength: 'Strong',
        name: { en: `Raja Yoga (${kh}th-${th}th Exchange)`, hi: `राज योग (${kh}-${th} परिवर्तन)`, sa: '' },
        formationRule: { en: `${kh}th and ${th}th lords exchange signs`, hi: `${kh}वें और ${th}वें भावेश राशि परिवर्तन`, sa: '' },
        description: { en: 'Sign exchange between kendra-trikona lords — powerful Raja Yoga through mutual cooperation.', hi: 'केंद्र-त्रिकोण स्वामियों का राशि परिवर्तन — परस्पर सहयोग से शक्तिशाली राजयोग।', sa: '' },
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Kartari Yogas (Scissors) for ALL houses + Moon
// ---------------------------------------------------------------------------

function detectKartariYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];
  const moonH = getP(planets, 1).house;

  // Shubha/Papa Kartari for Moon
  const h2m = (moonH % 12) + 1;
  const h12m = ((moonH - 2 + 12) % 12) + 1;
  const b2m = planets.some(p => p.house === h2m && isBenefic(p.id));
  const b12m = planets.some(p => p.house === h12m && isBenefic(p.id));
  const m2m = planets.some(p => p.house === h2m && isMalefic(p.id));
  const m12m = planets.some(p => p.house === h12m && isMalefic(p.id));

  if (b2m && b12m) results.push({ id: 'shubha_kartari_moon', category: 'moon_based', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Shubha Kartari (Moon)', hi: 'शुभ कर्तरी (चन्द्र)', sa: '' }, formationRule: { en: 'Benefics hemming Moon from both sides', hi: 'शुभ ग्रह चन्द्र के दोनों ओर', sa: '' }, description: { en: 'Moon protected by benefics — emotional stability, mental peace, public support.', hi: 'चन्द्र शुभ ग्रहों से रक्षित — भावनात्मक स्थिरता, मानसिक शांति।', sa: '' } });
  if (m2m && m12m) results.push({ id: 'papa_kartari_moon', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Papa Kartari (Moon)', hi: 'पाप कर्तरी (चन्द्र)', sa: '' }, formationRule: { en: 'Malefics hemming Moon from both sides', hi: 'पाप ग्रह चन्द्र के दोनों ओर', sa: '' }, description: { en: 'Moon hemmed by malefics — emotional distress, mental anxiety, public opposition.', hi: 'चन्द्र पाप ग्रहों के बीच — भावनात्मक कष्ट, चिंता।', sa: '' } });

  return results;
}

// ---------------------------------------------------------------------------
// Planet-in-House specific yogas
// ---------------------------------------------------------------------------

function detectPlanetHouseYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const hOf = (id: number) => getP(planets, id).house;

  // Hamsa-like: any benefic in kendra in own/exalted (beyond Pancha Mahapurusha)
  for (const pid of [1, 3]) { // Moon, Mercury (not in Mahapurusha)
    const p = getP(planets, pid);
    if ((p.isExalted || p.isOwnSign) && [1,4,7,10].includes(p.house)) {
      const name = pid === 1 ? 'Chandra Kendra' : 'Budha Kendra';
      results.push({ id: `${name.toLowerCase().replace(' ','_')}_yoga`, category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: `${name} Yoga`, hi: `${name} योग`, sa: '' }, formationRule: { en: `${pid === 1 ? 'Moon' : 'Mercury'} in own/exalted sign in kendra`, hi: `${pid === 1 ? 'चन्द्र' : 'बुध'} स्व/उच्च राशि में केंद्र में`, sa: '' }, description: { en: `${pid === 1 ? 'Emotional strength and public favor' : 'Intellectual brilliance and communication mastery'} from luminous placement.`, hi: '', sa: '' } });
    }
  }

  // Jupiter in 1st = Guru Mangal Yoga (wisdom embodied)
  if (hOf(4) === 1) results.push({ id: 'guru_lagna', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Guru in Lagna Yoga', hi: 'गुरु लग्न योग', sa: '' }, formationRule: { en: 'Jupiter in 1st house', hi: 'गुरु लग्न में', sa: '' }, description: { en: 'Jupiter in ascendant — wisdom, divine grace, generous nature, respected in society. One of the best placements.', hi: 'गुरु लग्न में — ज्ञान, दैवी कृपा, उदार स्वभाव।', sa: '' } });

  // Venus in 7th = strong marriage indicator
  if (hOf(5) === 7) results.push({ id: 'venus_7th', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Venus in 7th Yoga', hi: 'शुक्र सप्तम योग', sa: '' }, formationRule: { en: 'Venus in 7th house', hi: 'शुक्र 7वें भाव में', sa: '' }, description: { en: 'Venus (karaka of marriage) in the house of marriage — beautiful spouse, happy married life, artistic partner.', hi: 'शुक्र (विवाह कारक) विवाह भाव में — सुंदर जीवनसाथी, सुखी वैवाहिक जीवन।', sa: '' } });

  // Saturn in 10th = Shasha-like career yoga (discipline → authority)
  if (hOf(6) === 10 && !getP(planets, 6).isDebilitated) results.push({ id: 'shani_dasham', category: 'raja', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Shani Dasham Yoga', hi: 'शनि दशम योग', sa: '' }, formationRule: { en: 'Saturn in 10th house (not debilitated)', hi: 'शनि 10वें भाव में (नीच नहीं)', sa: '' }, description: { en: 'Saturn in house of career — slow but steady rise to authority through discipline, hard work, and public service.', hi: 'शनि करियर भाव में — अनुशासन और परिश्रम से धीमी लेकिन स्थिर उन्नति।', sa: '' } });

  // Sun in 10th = Dig Bala (directional strength) + career authority
  if (hOf(0) === 10) results.push({ id: 'surya_dasham', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Surya Dasham Yoga', hi: 'सूर्य दशम योग', sa: '' }, formationRule: { en: 'Sun in 10th house (maximum Dig Bala)', hi: 'सूर्य 10वें भाव में (अधिकतम दिग्बल)', sa: '' }, description: { en: 'Sun at zenith — maximum directional strength. Government authority, leadership, fame in profession. Father may be prominent.', hi: 'सूर्य शिखर पर — अधिकतम दिग्बल। सरकारी अधिकार, नेतृत्व, व्यावसायिक यश।', sa: '' } });

  // Mars in 10th = Dig Bala + career energy
  if (hOf(2) === 10) results.push({ id: 'mangal_dasham', category: 'raja', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Mangal Dasham Yoga', hi: 'मंगल दशम योग', sa: '' }, formationRule: { en: 'Mars in 10th house', hi: 'मंगल 10वें भाव में', sa: '' }, description: { en: 'Mars with directional strength in career house — engineering, surgery, military, sports, property development careers favored.', hi: 'मंगल करियर भाव में दिग्बल — इंजीनियरिंग, शल्यक्रिया, सेना, खेल करियर।', sa: '' } });

  // Rahu in 3rd = courage amplified (unconventional)
  if (hOf(7) === 3) results.push({ id: 'rahu_third', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Rahu in 3rd Yoga', hi: 'राहु तृतीय योग', sa: '' }, formationRule: { en: 'Rahu in 3rd house (upachaya)', hi: 'राहु 3rd भाव में (उपचय)', sa: '' }, description: { en: 'Rahu in house of courage — extraordinary daring, unconventional communication, success through bold ventures. Good for media, technology.', hi: 'राहु साहस भाव में — असाधारण साहस, अपरंपरागत संचार, मीडिया/तकनीक।', sa: '' } });

  // Ketu in 12th = Moksha yoga (spiritual liberation)
  if (hOf(8) === 12) results.push({ id: 'ketu_twelfth', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Ketu in 12th (Moksha Yoga)', hi: 'केतु द्वादश (मोक्ष योग)', sa: '' }, formationRule: { en: 'Ketu in 12th house', hi: 'केतु 12वें भाव में', sa: '' }, description: { en: 'Ketu (detachment) in house of liberation — natural spiritual inclination, meditation ability, past-life spiritual merit. May indicate foreign residence.', hi: 'केतु मोक्ष भाव में — स्वाभाविक आध्यात्मिक प्रवृत्ति, ध्यान क्षमता।', sa: '' } });

  // All benefics in kendras = extremely fortunate
  const beneficsInKendras = planets.filter(p => isBenefic(p.id) && [1,4,7,10].includes(p.house)).length;
  if (beneficsInKendras >= 3) results.push({ id: 'saubhagya', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Saubhagya Yoga', hi: 'सौभाग्य योग', sa: '' }, formationRule: { en: `${beneficsInKendras} benefics in kendras`, hi: `${beneficsInKendras} शुभ ग्रह केंद्रों में`, sa: '' }, description: { en: 'Multiple benefics in angular houses — great fortune, divine protection, surrounded by goodness. Life flows smoothly.', hi: 'अनेक शुभ ग्रह केंद्रों में — महान भाग्य, दिव्य रक्षा।', sa: '' } });

  // All malefics in upachayas (3,6,10,11) = Viparita-like strength
  const maleficsInUpachaya = planets.filter(p => isMalefic(p.id) && [3,6,10,11].includes(p.house)).length;
  if (maleficsInUpachaya >= 3) results.push({ id: 'duryoga_nivaran', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Malefics in Upachaya', hi: 'पाप उपचय योग', sa: '' }, formationRule: { en: `${maleficsInUpachaya} malefics in upachaya houses (3,6,10,11)`, hi: `${maleficsInUpachaya} पाप ग्रह उपचय (3,6,10,11) में`, sa: '' }, description: { en: 'Malefics perform well in upachaya houses — challenges overcome, enemies defeated, career through struggle, growing gains with age.', hi: 'पाप ग्रह उपचय में अच्छे — शत्रु पराजित, उम्र के साथ बढ़ता लाभ।', sa: '' } });

  return results;
}

// ---------------------------------------------------------------------------
// Nabhasa Yogas (Geometric patterns — BPHS Ch.35)
// ---------------------------------------------------------------------------

function detectNabhasaYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];
  const occupiedHouses = [...new Set(planets.filter(p => p.id <= 6).map(p => p.house))].sort((a, b) => a - b);
  const occupiedSigns = [...new Set(planets.filter(p => p.id <= 6).map(p => p.sign))].sort((a, b) => a - b);

  // Yupa Yoga — all 7 planets in 1st through 4th houses
  const inQ1 = planets.filter(p => p.id <= 6 && [1, 2, 3, 4].includes(p.house)).length;
  if (inQ1 === 7) results.push({ id: 'yupa', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Yupa Yoga', hi: 'यूप योग', sa: 'यूपयोगः' }, formationRule: { en: 'All 7 planets in houses 1-4', hi: 'सभी 7 ग्रह 1-4 भावों में', sa: '' }, description: { en: 'Sacrificial post pattern — religious nature, ritual discipline, philanthropic disposition, spiritual authority.', hi: 'यज्ञस्तंभ पैटर्न — धार्मिक प्रकृति, अनुशासन, परोपकार।', sa: '' } });

  // Ishu Yoga — all 7 planets in 4th through 7th
  const inQ2 = planets.filter(p => p.id <= 6 && [4, 5, 6, 7].includes(p.house)).length;
  if (inQ2 === 7) results.push({ id: 'ishu', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Ishu Yoga', hi: 'इषु योग', sa: 'इषुयोगः' }, formationRule: { en: 'All 7 planets in houses 4-7', hi: 'सभी 7 ग्रह 4-7 भावों में', sa: '' }, description: { en: 'Arrow pattern — restless nature, travel-oriented, difficulty settling, skill in warfare or competitive fields.', hi: 'बाण पैटर्न — बेचैन स्वभाव, यात्रा-प्रवृत्ति, प्रतियोगी क्षेत्र।', sa: '' } });

  // Shakti Yoga — all 7 planets in 7th through 10th
  const inQ3 = planets.filter(p => p.id <= 6 && [7, 8, 9, 10].includes(p.house)).length;
  if (inQ3 === 7) results.push({ id: 'shakti_nabhasa', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Shakti Yoga', hi: 'शक्ति योग', sa: 'शक्तियोगः' }, formationRule: { en: 'All 7 planets in houses 7-10', hi: 'सभी 7 ग्रह 7-10 भावों में', sa: '' }, description: { en: 'Power pattern — authority, political influence, dominion over others, strong public presence.', hi: 'शक्ति पैटर्न — अधिकार, राजनीतिक प्रभाव, सार्वजनिक उपस्थिति।', sa: '' } });

  // Danda Yoga — all 7 planets in 10th through 1st
  const inQ4 = planets.filter(p => p.id <= 6 && [10, 11, 12, 1].includes(p.house)).length;
  if (inQ4 === 7) results.push({ id: 'danda', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Danda Yoga', hi: 'दण्ड योग', sa: 'दण्डयोगः' }, formationRule: { en: 'All 7 planets in houses 10-1', hi: 'सभी 7 ग्रह 10-1 भावों में', sa: '' }, description: { en: 'Staff/punishment pattern — servitude, dependence on others, harsh life circumstances, but potential for discipline and endurance.', hi: 'दण्ड पैटर्न — सेवा, कठिन परिस्थितियाँ, पर अनुशासन क्षमता।', sa: '' } });

  // Nauka Yoga — all 7 planets in 7 consecutive houses
  if (occupiedHouses.length >= 7) {
    let consecutive = true;
    const first = occupiedHouses[0];
    for (let i = 1; i < occupiedHouses.length; i++) {
      if (((first + i - 1) % 12) + 1 !== occupiedHouses[i]) { consecutive = false; break; }
    }
    if (consecutive) results.push({ id: 'nauka', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Nauka Yoga', hi: 'नौका योग', sa: 'नौकायोगः' }, formationRule: { en: 'All planets in 7 consecutive houses', hi: 'सभी ग्रह 7 क्रमागत भावों में', sa: '' }, description: { en: 'Boat pattern — wealth through navigation/trade, overseas connections, adaptability, fortune through movement.', hi: 'नौका पैटर्न — व्यापार से धन, विदेशी संबंध, अनुकूलनशीलता।', sa: '' } });
  }

  // Kedara Yoga — all planets in 4 houses
  if (occupiedHouses.length === 4) results.push({ id: 'kedara', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Kedara Yoga', hi: 'केदार योग', sa: 'केदारयोगः' }, formationRule: { en: 'All planets occupy exactly 4 houses', hi: 'सभी ग्रह केवल 4 भावों में', sa: '' }, description: { en: 'Ploughed field pattern — agricultural wealth, landed property, patient hard work yielding results, farmer-king energy.', hi: 'खेत पैटर्न — भूमि संपत्ति, कृषि धन, धैर्यपूर्ण कार्य।', sa: '' } });

  // Shula Yoga — all planets in 3 houses
  if (occupiedHouses.length === 3) results.push({ id: 'shula', category: 'other', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Shula Yoga', hi: 'शूल योग', sa: 'शूलयोगः' }, formationRule: { en: 'All planets in exactly 3 houses', hi: 'सभी ग्रह केवल 3 भावों में', sa: '' }, description: { en: 'Trident pattern — sharp focus but extremes in fortune, aggressive nature, potential for conflict, but concentrated power.', hi: 'त्रिशूल पैटर्न — तीव्र एकाग्रता पर भाग्य के उतार-चढ़ाव।', sa: '' } });

  // Yuga Yoga — all planets in 2 houses
  if (occupiedHouses.length === 2) results.push({ id: 'yuga', category: 'other', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Yuga Yoga', hi: 'युग योग', sa: 'युगयोगः' }, formationRule: { en: 'All planets in exactly 2 houses', hi: 'सभी ग्रह केवल 2 भावों में', sa: '' }, description: { en: 'Yoke pattern — extreme polarity in life, very focused but one-dimensional, can be religious or irreligious, wealthy or poor.', hi: 'युग पैटर्न — जीवन में अत्यधिक ध्रुवीयता, एक-आयामी।', sa: '' } });

  // Gola Yoga — all planets in 1 house
  if (occupiedHouses.length === 1) results.push({ id: 'gola', category: 'other', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Gola Yoga', hi: 'गोल योग', sa: 'गोलयोगः' }, formationRule: { en: 'All planets in a single house', hi: 'सभी ग्रह एक ही भाव में', sa: '' }, description: { en: 'Sphere pattern — extremely rare, all energies concentrated. Can produce either extraordinary power or great hardship depending on the sign.', hi: 'गोल पैटर्न — अत्यंत दुर्लभ, सभी ऊर्जा एकत्रित।', sa: '' } });

  // Rajju Yoga — all planets in movable signs
  const allMovable = planets.filter(p => p.id <= 6).every(p => [1, 4, 7, 10].includes(p.sign));
  if (allMovable) results.push({ id: 'rajju', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Rajju Yoga', hi: 'रज्जु योग', sa: 'रज्जुयोगः' }, formationRule: { en: 'All planets in movable (cardinal) signs', hi: 'सभी ग्रह चर राशियों में', sa: '' }, description: { en: 'Rope pattern — love of travel, restless energy, pioneering spirit, frequent changes in life, entrepreneurial.', hi: 'रज्जु पैटर्न — यात्रा प्रेम, अग्रणी भावना, बार-बार परिवर्तन।', sa: '' } });

  // Musala Yoga — all planets in fixed signs
  const allFixed = planets.filter(p => p.id <= 6).every(p => [2, 5, 8, 11].includes(p.sign));
  if (allFixed) results.push({ id: 'musala', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Musala Yoga', hi: 'मूसल योग', sa: 'मूसलयोगः' }, formationRule: { en: 'All planets in fixed signs', hi: 'सभी ग्रह स्थिर राशियों में', sa: '' }, description: { en: 'Pestle pattern — steadfast nature, wealth accumulation, stubbornness, pride, fame through persistence.', hi: 'मूसल पैटर्न — दृढ़ स्वभाव, धन संचय, हठ, प्रसिद्धि।', sa: '' } });

  // Nala Yoga — all planets in dual signs
  const allDual = planets.filter(p => p.id <= 6).every(p => [3, 6, 9, 12].includes(p.sign));
  if (allDual) results.push({ id: 'nala', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Nala Yoga', hi: 'नल योग', sa: 'नलयोगः' }, formationRule: { en: 'All planets in dual (mutable) signs', hi: 'सभी ग्रह द्विस्वभाव राशियों में', sa: '' }, description: { en: 'Reed pattern — skilled communicator, adaptable, intellectual, good at crafts and arts, but may lack consistency.', hi: 'नल पैटर्न — कुशल संवाहक, अनुकूलनीय, बुद्धिमान, कला में निपुण।', sa: '' } });

  // Chakra Yoga — planets distributed in all even houses (2,4,6,8,10,12)
  const allEvenHouses = planets.filter(p => p.id <= 6).every(p => p.house % 2 === 0);
  if (allEvenHouses) results.push({ id: 'chakra', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Chakra Yoga', hi: 'चक्र योग', sa: 'चक्रयोगः' }, formationRule: { en: 'All planets in even-numbered houses', hi: 'सभी ग्रह सम भावों में', sa: '' }, description: { en: 'Wheel pattern — commands authority like a king, magnetic personality, ability to attract followers and wealth.', hi: 'चक्र पैटर्न — राजा जैसा अधिकार, चुंबकीय व्यक्तित्व।', sa: '' } });

  // Samudra Yoga — planets in all odd houses
  const allOddHouses = planets.filter(p => p.id <= 6).every(p => p.house % 2 === 1);
  if (allOddHouses) results.push({ id: 'samudra', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Samudra Yoga', hi: 'समुद्र योग', sa: 'समुद्रयोगः' }, formationRule: { en: 'All planets in odd-numbered houses', hi: 'सभी ग्रह विषम भावों में', sa: '' }, description: { en: 'Ocean pattern — wealth like the sea, prosperous and charitable, enjoys all comforts, loved by many.', hi: 'समुद्र पैटर्न — सागर जैसा धन, समृद्ध और दानशील।', sa: '' } });

  return results;
}

// ---------------------------------------------------------------------------
// Parivartana Yoga sub-types (Mutual exchange — BPHS)
// ---------------------------------------------------------------------------

function detectParivartanaYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];

  // Build house-lord map for current ascendant
  const houseLords: Record<number, number> = {};
  for (let h = 1; h <= 12; h++) {
    const signOfHouse = ((ascSign - 1 + h - 1) % 12) + 1;
    houseLords[h] = signLord(signOfHouse);
  }

  // Find mutual exchanges: lord of house A is in house B AND lord of house B is in house A
  for (let h1 = 1; h1 <= 12; h1++) {
    for (let h2 = h1 + 1; h2 <= 12; h2++) {
      const lord1 = houseLords[h1];
      const lord2 = houseLords[h2];
      if (lord1 === lord2) continue;
      const p1 = getP(planets, lord1);
      const p2 = getP(planets, lord2);
      if (p1.house === h2 && p2.house === h1) {
        // Classify: Maha (both kendra/trikona), Khala (one is dusthana), Dainya (one is 6/8/12)
        const bothKendraTrikona = (KENDRA.includes(h1) || TRIKONA.includes(h1)) && (KENDRA.includes(h2) || TRIKONA.includes(h2));
        const hasDusthana = DUSTHANA.includes(h1) || DUSTHANA.includes(h2);

        if (bothKendraTrikona) {
          results.push({ id: `maha_parivartana_${h1}_${h2}`, category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: `Maha Parivartana Yoga (H${h1}↔H${h2})`, hi: `महा परिवर्तन योग (भ${h1}↔भ${h2})`, sa: '' }, formationRule: { en: `Lords of houses ${h1} and ${h2} exchange — both in kendra/trikona`, hi: `भाव ${h1} व ${h2} के स्वामी परस्पर — दोनों केंद्र/त्रिकोण में`, sa: '' }, description: { en: 'Maha (great) exchange between auspicious houses — powerful Raja Yoga, mutual enhancement, brings fame, authority, and fortune.', hi: 'शुभ भावों का महा परिवर्तन — शक्तिशाली राजयोग, यश, अधिकार और सौभाग्य।', sa: '' } });
        } else if (hasDusthana) {
          results.push({ id: `dainya_parivartana_${h1}_${h2}`, category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: `Dainya Parivartana (H${h1}↔H${h2})`, hi: `दैन्य परिवर्तन (भ${h1}↔भ${h2})`, sa: '' }, formationRule: { en: `Lords of houses ${h1} and ${h2} exchange — involves dusthana`, hi: `भाव ${h1} व ${h2} के स्वामी परस्पर — दुःस्थान सम्मिलित`, sa: '' }, description: { en: 'Dainya (miserable) exchange involving 6th/8th/12th — challenges from the dusthana affect the good house. Struggles with health, debts, or losses.', hi: 'दैन्य परिवर्तन 6/8/12 भाव — कठिनाइयाँ, स्वास्थ्य/ऋण/हानि।', sa: '' } });
        } else {
          results.push({ id: `khala_parivartana_${h1}_${h2}`, category: 'other', isAuspicious: false, present: true, strength: 'Weak', name: { en: `Khala Parivartana (H${h1}↔H${h2})`, hi: `खल परिवर्तन (भ${h1}↔भ${h2})`, sa: '' }, formationRule: { en: `Lords of houses ${h1} and ${h2} exchange — mixed houses`, hi: `भाव ${h1} व ${h2} के स्वामी परस्पर — मिश्रित भाव`, sa: '' }, description: { en: 'Khala (wicked) exchange — mixed results, one house benefits at the expense of the other. Uneven fortune.', hi: 'खल परिवर्तन — मिश्रित परिणाम, एक भाव लाभान्वित दूसरे की कीमत पर।', sa: '' } });
        }
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Daridra (Poverty) Yogas — BPHS Ch.41
// ---------------------------------------------------------------------------

function detectDaridraYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const houseLords: Record<number, number> = {};
  for (let h = 1; h <= 12; h++) {
    const signOfHouse = ((ascSign - 1 + h - 1) % 12) + 1;
    houseLords[h] = signLord(signOfHouse);
  }

  // Lord of 11th in 6th/8th/12th = gains obstructed
  const lord11 = getP(planets, houseLords[11]);
  if (DUSTHANA.includes(lord11.house)) {
    results.push({ id: 'daridra_11_dusthana', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Daridra Yoga (11th Lord)', hi: 'दरिद्र योग (11 स्वामी)', sa: '' }, formationRule: { en: `${GRAHA_EN[lord11.id]} (lord of 11th) in ${lord11.house}th house (dusthana)`, hi: `${GRAHA_HI[lord11.id]} (11वें का स्वामी) ${lord11.house}वें भाव में (दुःस्थान)`, sa: '' }, description: { en: `${GRAHA_EN[lord11.id]} — lord of gains — placed in house of loss/debt/enemies. Income blocked, financial struggles despite effort, money slips through fingers.`, hi: `${GRAHA_HI[lord11.id]} — लाभ का स्वामी — हानि/ऋण/शत्रु भाव में। आय अवरुद्ध, प्रयासों के बावजूद वित्तीय संघर्ष।`, sa: '' } });
  }

  // Lord of 2nd in 6th/8th/12th = family wealth diminished
  const lord2 = getP(planets, houseLords[2]);
  if (DUSTHANA.includes(lord2.house)) {
    results.push({ id: 'daridra_2_dusthana', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Daridra Yoga (2nd Lord)', hi: 'दरिद्र योग (2 स्वामी)', sa: '' }, formationRule: { en: `${GRAHA_EN[lord2.id]} (lord of 2nd) in ${lord2.house}th house (dusthana)`, hi: `${GRAHA_HI[lord2.id]} (2वें का स्वामी) ${lord2.house}वें भाव में`, sa: '' }, description: { en: `${GRAHA_EN[lord2.id]} — lord of family/wealth — placed in dusthana. Family assets dissipated, difficulty saving, poor early financial conditions.`, hi: `${GRAHA_HI[lord2.id]} — परिवार/धन का स्वामी — दुःस्थान में। पारिवारिक संपत्ति क्षीण, बचत में कठिनाई।`, sa: '' } });
  }

  // Lords of 2nd and 11th both debilitated
  if (getP(planets, houseLords[2]).isDebilitated && getP(planets, houseLords[11]).isDebilitated) {
    results.push({ id: 'daridra_double_debil', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Severe Daridra Yoga', hi: 'तीव्र दरिद्र योग', sa: '' }, formationRule: { en: 'Lords of 2nd and 11th both debilitated', hi: '2 व 11 स्वामी दोनों नीच', sa: '' }, description: { en: 'Both wealth lords debilitated — chronic financial difficulties, poverty despite intelligence, may require support from others.', hi: 'दोनों धन स्वामी नीच — दीर्घकालिक वित्तीय कठिनाइयाँ।', sa: '' } });
  }

  // Saturn + Mars conjunct in 2nd or 11th
  const sat = getP(planets, 6); const mars = getP(planets, 2);
  if (inSameHouse(sat, mars) && [2, 11].includes(sat.house)) {
    results.push({ id: 'daridra_sat_mars', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Daridra (Saturn-Mars in Wealth)', hi: 'दरिद्र (शनि-मंगल धन भाव)', sa: '' }, formationRule: { en: `Saturn + Mars conjunct in ${sat.house}th house`, hi: `शनि + मंगल ${sat.house}वें भाव में युत`, sa: '' }, description: { en: 'Two malefics combining in wealth houses — financial setbacks through aggression, accidents, or legal issues. Money earned but lost quickly.', hi: 'दो पाप ग्रह धन भावों में — आक्रामकता, दुर्घटना या कानूनी मुद्दों से वित्तीय हानि।', sa: '' } });
  }

  // Rahu in 2nd without benefic aspect
  const rahu = getP(planets, 7);
  if (rahu.house === 2 && !planets.some(p => isBenefic(p.id) && [2, 6, 8, 12].includes(houseOffset(p.house, 2)))) {
    results.push({ id: 'daridra_rahu_2nd', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Daridra (Rahu in 2nd)', hi: 'दरिद्र (राहु द्वितीय)', sa: '' }, formationRule: { en: 'Rahu in 2nd house without benefic influence', hi: 'राहु 2वें भाव में बिना शुभ प्रभाव', sa: '' }, description: { en: 'Rahu in family/wealth house — unconventional or unstable finances, deception around money, family discord, harsh speech.', hi: 'राहु धन भाव में — अस्थिर वित्त, धन के आसपास छल, पारिवारिक कलह।', sa: '' } });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Moon-based yogas from Phaladeepika & BPHS
// ---------------------------------------------------------------------------

function detectExtendedMoonYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];
  const moon = getP(planets, 1);
  const jupiter = getP(planets, 4);
  const venus = getP(planets, 5);
  const mercury = getP(planets, 3);
  const sun = getP(planets, 0);
  const mars = getP(planets, 2);
  const saturn = getP(planets, 6);

  // Shakata Yoga — Moon in 6th or 8th from Jupiter
  const moonFromJup = houseOffset(jupiter.house, moon.house);
  if (moonFromJup === 6 || moonFromJup === 8) {
    results.push({ id: 'shakata', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Shakata Yoga', hi: 'शकट योग', sa: 'शकटयोगः' }, formationRule: { en: `Moon in ${moonFromJup}th from Jupiter`, hi: `चंद्र गुरु से ${moonFromJup}वें भाव में`, sa: '' }, description: { en: 'Cart/chariot yoga — life of ups and downs like a cart wheel, fortune fluctuates. May lose wealth repeatedly and regain. Cancelled if Moon is in kendra from lagna.', hi: 'शकट योग — गाड़ी के पहिये जैसे उतार-चढ़ाव, बार-बार धन हानि और पुनर्प्राप्ति।', sa: '' } });
  }

  // Amala Yoga — benefic in 10th from Moon
  const tenthFromMoon = ((moon.house + 8) % 12) + 1;
  const beneficIn10th = planets.filter(p => p.house === tenthFromMoon && isBenefic(p.id));
  if (beneficIn10th.length > 0) {
    results.push({ id: 'amala', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Amala Yoga', hi: 'अमल योग', sa: 'अमलयोगः' }, formationRule: { en: `Benefic (${beneficIn10th.map(p => ['Sun','Moon','Mars','Mer','Jup','Ven','Sat','Rah','Ket'][p.id]).join(', ')}) in 10th from Moon`, hi: `शुभ ग्रह चंद्र से 10वें भाव में`, sa: '' }, description: { en: 'Spotless/pure yoga — unblemished reputation, ethical character, lasting fame through virtuous deeds, respected career.', hi: 'निर्मल योग — निष्कलंक प्रतिष्ठा, नैतिक चरित्र, सद्गुणों से यश।', sa: '' } });
  }

  // Pushkala Yoga — Moon in sign of ascendant lord + aspected by ascendant lord
  // Simplified: Moon conjunct ascendant lord
  // More tractable: Moon + Venus in same house
  if (inSameHouse(moon, venus)) {
    results.push({ id: 'pushkala', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Pushkala Yoga', hi: 'पुष्कल योग', sa: 'पुष्कलयोगः' }, formationRule: { en: 'Moon conjunct Venus', hi: 'चंद्र-शुक्र युति', sa: '' }, description: { en: 'Abundant yoga — emotional richness, artistic talent, beauty, popularity, sweet speech, love of luxury and comfort.', hi: 'पुष्कल योग — भावनात्मक समृद्धि, कलात्मक प्रतिभा, सौंदर्य, लोकप्रियता।', sa: '' } });
  }

  // Chandra-Mangal Yoga — Moon + Mars conjunction
  if (inSameHouse(moon, mars)) {
    results.push({ id: 'chandra_mangal', category: 'wealth', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Chandra-Mangal Yoga', hi: 'चंद्र-मंगल योग', sa: 'चन्द्रमङ्गलयोगः' }, formationRule: { en: 'Moon conjunct Mars', hi: 'चंद्र-मंगल युति', sa: '' }, description: { en: 'Wealth through courage and initiative — self-made prosperity, business acumen, emotional drive channeled into material success.', hi: 'चंद्र-मंगल योग — साहस और पहल से धन, स्वनिर्मित समृद्धि, व्यापार कौशल।', sa: '' } });
  }

  // Saraswati Yoga — Mercury, Venus, Jupiter in kendras/trikonas
  const svjInKendraTrikona = [mercury, venus, jupiter].filter(p => [...KENDRA, ...TRIKONA].includes(p.house));
  if (svjInKendraTrikona.length === 3) {
    results.push({ id: 'saraswati', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Saraswati Yoga', hi: 'सरस्वती योग', sa: 'सरस्वतीयोगः' }, formationRule: { en: 'Mercury, Venus, Jupiter all in kendras/trikonas', hi: 'बुध, शुक्र, गुरु सभी केंद्र/त्रिकोण में', sa: '' }, description: { en: 'Goddess of learning yoga — exceptional intellect, mastery of arts and sciences, eloquent speech, scholarly achievements, literary fame.', hi: 'सरस्वती योग — असाधारण बुद्धि, कला-विज्ञान में निपुणता, विद्वत्तापूर्ण उपलब्धियाँ।', sa: '' } });
  }

  // Lakshmi Yoga — Lord of 9th in kendra + strong
  // Simplified: Jupiter in kendra (Jupiter natural 9th lord significator)
  if (KENDRA.includes(jupiter.house) && (jupiter.isExalted || jupiter.isOwnSign)) {
    results.push({ id: 'lakshmi', category: 'wealth', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Lakshmi Yoga', hi: 'लक्ष्मी योग', sa: 'लक्ष्मीयोगः' }, formationRule: { en: 'Jupiter exalted/own sign in kendra', hi: 'गुरु उच्च/स्वराशि केंद्र में', sa: '' }, description: { en: 'Goddess of wealth yoga — great fortune, prosperity, noble character, spiritual wealth alongside material abundance.', hi: 'लक्ष्मी योग — महान भाग्य, समृद्धि, उदार चरित्र, भौतिक और आध्यात्मिक धन।', sa: '' } });
  }

  // Durdhura Yoga — planets (not Sun) in 2nd and 12th from Moon
  const secondFromMoon = (moon.house % 12) + 1;
  const twelfthFromMoon = ((moon.house - 2 + 12) % 12) + 1;
  const planetsIn2nd = planets.filter(p => p.id !== 0 && p.id !== 1 && p.id <= 6 && p.house === secondFromMoon);
  const planetsIn12th = planets.filter(p => p.id !== 0 && p.id !== 1 && p.id <= 6 && p.house === twelfthFromMoon);
  if (planetsIn2nd.length > 0 && planetsIn12th.length > 0) {
    results.push({ id: 'durdhura', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Durdhura Yoga', hi: 'दुर्धुरा योग', sa: 'दुर्धुरायोगः' }, formationRule: { en: 'Planets (not Sun) on both sides of Moon', hi: 'चंद्र के दोनों ओर ग्रह (सूर्य नहीं)', sa: '' }, description: { en: 'Moon flanked by planets — generous nature, wealth, vehicles, lasting fame, commands respect. Better than Sunapha alone.', hi: 'दुर्धुरा योग — उदार प्रकृति, धन, वाहन, स्थायी यश, सम्मान।', sa: '' } });
  }

  // Sunapha Yoga — planet (not Sun) in 2nd from Moon
  if (planetsIn2nd.length > 0 && planetsIn12th.length === 0) {
    results.push({ id: 'sunapha', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Sunapha Yoga', hi: 'सुनफा योग', sa: 'सुनफायोगः' }, formationRule: { en: 'Planet(s) in 2nd from Moon, none in 12th', hi: 'चंद्र से 2वें में ग्रह, 12वें में नहीं', sa: '' }, description: { en: 'Self-made wealth yoga — earns through own intelligence and effort, good reputation, comfortable life.', hi: 'सुनफा योग — स्वबुद्धि और प्रयास से धन, अच्छी प्रतिष्ठा।', sa: '' } });
  }

  // Anapha Yoga — planet (not Sun) in 12th from Moon
  if (planetsIn12th.length > 0 && planetsIn2nd.length === 0) {
    results.push({ id: 'anapha', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Anapha Yoga', hi: 'अनफा योग', sa: 'अनफायोगः' }, formationRule: { en: 'Planet(s) in 12th from Moon, none in 2nd', hi: 'चंद्र से 12वें में ग्रह, 2वें में नहीं', sa: '' }, description: { en: 'Inherited/family wealth yoga — well-dressed, good health, comfortable lifestyle from family background.', hi: 'अनफा योग — पारिवारिक पृष्ठभूमि से सुख, अच्छा स्वास्थ्य, सुविधाजनक जीवन।', sa: '' } });
  }

  // Vasumati Yoga — all benefics in upachaya houses (3, 6, 10, 11) from Moon
  const beneficIds = [3, 4, 5]; // Mercury, Jupiter, Venus
  const allBeneficsUpachayaFromMoon = beneficIds.every(bid => {
    const offset = houseOffset(moon.house, getP(planets, bid).house);
    return [3, 6, 10, 11].includes(offset);
  });
  if (allBeneficsUpachayaFromMoon) {
    results.push({ id: 'vasumati', category: 'wealth', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Vasumati Yoga', hi: 'वसुमती योग', sa: 'वसुमतीयोगः' }, formationRule: { en: 'All benefics in upachaya (3/6/10/11) from Moon', hi: 'सभी शुभ चंद्र से उपचय (3/6/10/11) में', sa: '' }, description: { en: 'Earth-goddess yoga — immense wealth accumulation, properties, business empires, growing fortune with age.', hi: 'वसुमती योग — अपार धन संचय, संपत्ति, उम्र के साथ बढ़ता भाग्य।', sa: '' } });
  }

  // Chandradhi Yoga — benefics in 6th, 7th, 8th from Moon
  const b6 = planets.filter(p => isBenefic(p.id) && houseOffset(moon.house, p.house) === 6);
  const b7 = planets.filter(p => isBenefic(p.id) && houseOffset(moon.house, p.house) === 7);
  const b8 = planets.filter(p => isBenefic(p.id) && houseOffset(moon.house, p.house) === 8);
  if (b6.length > 0 && b7.length > 0 && b8.length > 0) {
    results.push({ id: 'chandradhi', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Chandradhi Yoga', hi: 'चंद्राधि योग', sa: 'चन्द्राधियोगः' }, formationRule: { en: 'Benefics in 6th, 7th, and 8th from Moon', hi: 'शुभ ग्रह चंद्र से 6, 7, 8 में', sa: '' }, description: { en: 'Moon-supremacy yoga — minister or leader, polite and trustworthy, defeats enemies, excellent health, long life.', hi: 'चंद्राधि योग — मंत्री या नेता, विनम्र और विश्वसनीय, शत्रुओं पर विजय।', sa: '' } });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Planet-specific classical yogas
// ---------------------------------------------------------------------------

function detectClassicalPlanetYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const sun = getP(planets, 0); const moon = getP(planets, 1);
  const mars = getP(planets, 2); const mercury = getP(planets, 3);
  const jupiter = getP(planets, 4); const venus = getP(planets, 5);
  const saturn = getP(planets, 6); const rahu = getP(planets, 7);

  // Budha-Aditya Yoga — Sun + Mercury conjunction (already may exist but with stronger rules)
  if (inSameHouse(sun, mercury) && Math.abs(sun.longitude - mercury.longitude) > 5) {
    // Only when Mercury is NOT combust (>5° from Sun)
    results.push({ id: 'budha_aditya_strong', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Budha-Aditya Yoga (Strong)', hi: 'बुधादित्य योग (बलवान)', sa: '' }, formationRule: { en: 'Sun + Mercury conjunct, Mercury >5° from Sun', hi: 'सूर्य + बुध युत, बुध सूर्य से >5° दूर', sa: '' }, description: { en: 'Strong version — Mercury far enough from Sun to avoid combustion. Sharp intellect, administrative ability, fame through knowledge.', hi: 'बलवान बुधादित्य — बुध अस्त नहीं। तीक्ष्ण बुद्धि, प्रशासनिक क्षमता।', sa: '' } });
  }

  // Guru-Mangal Yoga — Jupiter + Mars conjunction
  if (inSameHouse(jupiter, mars)) {
    results.push({ id: 'guru_mangal', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Guru-Mangal Yoga', hi: 'गुरु-मंगल योग', sa: 'गुरुमङ्गलयोगः' }, formationRule: { en: 'Jupiter conjunct Mars', hi: 'गुरु-मंगल युति', sa: '' }, description: { en: 'Wisdom + action combined — courageous yet righteous, military/police leadership, land ownership, brothers prosper.', hi: 'गुरु-मंगल योग — विवेक + कर्म, साहसी पर धार्मिक, भूमि स्वामित्व।', sa: '' } });
  }

  // Nipuna Yoga — Mercury + Sun + Moon in same sign or Mercury in own/exalted sign aspected by Moon
  if (inSameHouse(mercury, moon) && inSameHouse(mercury, sun)) {
    results.push({ id: 'nipuna', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Nipuna Yoga', hi: 'निपुण योग', sa: 'निपुणयोगः' }, formationRule: { en: 'Sun + Moon + Mercury in same house', hi: 'सूर्य + चंद्र + बुध एक भाव में', sa: '' }, description: { en: 'Skilled/expert yoga — exceptional craftsman, skilled in multiple fields, quick learner, proficient communicator.', hi: 'निपुण योग — असाधारण कारीगर, बहु-क्षेत्रीय कौशल, तेज शिक्षार्थी।', sa: '' } });
  }

  // Chamara Yoga — Lagna lord exalted in kendra aspected by Jupiter
  const lagnaLord = signLord(ascSign);
  const lagnaP = getP(planets, lagnaLord);
  if (lagnaP.isExalted && KENDRA.includes(lagnaP.house)) {
    results.push({ id: 'chamara', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Chamara Yoga', hi: 'चामर योग', sa: 'चामरयोगः' }, formationRule: { en: 'Lagna lord exalted in kendra', hi: 'लग्नेश उच्च केंद्र में', sa: '' }, description: { en: 'Royal fan yoga — oratory skill, royal patronage, commanding presence, long-lived, eloquent, learned, famous.', hi: 'चामर योग — वक्तृत्व कला, राजकीय संरक्षण, आज्ञाकारी उपस्थिति।', sa: '' } });
  }

  // Akhanda Samrajya Yoga — Jupiter as lord of 2nd/5th/11th + in kendra from Moon
  const jupLordOfHouses: number[] = [];
  for (let h = 1; h <= 12; h++) {
    const signOfHouse = ((ascSign - 1 + h - 1) % 12) + 1;
    if (signLord(signOfHouse) === 4) jupLordOfHouses.push(h);
  }
  const jupInKendraFromMoon = KENDRA.includes(houseOffset(moon.house, jupiter.house));
  if (jupLordOfHouses.some(h => [2, 5, 11].includes(h)) && jupInKendraFromMoon) {
    results.push({ id: 'akhanda_samrajya', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Akhanda Samrajya Yoga', hi: 'अखंड साम्राज्य योग', sa: 'अखण्डसाम्राज्ययोगः' }, formationRule: { en: 'Jupiter lords 2nd/5th/11th and is in kendra from Moon', hi: 'गुरु 2/5/11 स्वामी + चंद्र से केंद्र में', sa: '' }, description: { en: 'Undivided empire yoga — vast authority, territory expands, power remains unchallenged, great fame across regions.', hi: 'अखंड साम्राज्य योग — विशाल अधिकार, अविवादित शक्ति, व्यापक यश।', sa: '' } });
  }

  // Kahala Yoga — Lord of 4th and Jupiter in mutual kendras + lagna lord strong
  const lord4Id = signLord(((ascSign - 1 + 3) % 12) + 1);
  const lord4 = getP(planets, lord4Id);
  if (KENDRA.includes(houseOffset(lord4.house, jupiter.house)) && (lagnaP.isExalted || lagnaP.isOwnSign)) {
    results.push({ id: 'kahala', category: 'raja', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Kahala Yoga', hi: 'कहल योग', sa: 'कहलयोगः' }, formationRule: { en: '4th lord & Jupiter in mutual kendras, lagna lord strong', hi: '4 स्वामी व गुरु परस्पर केंद्र, लग्नेश बलवान', sa: '' }, description: { en: 'Bold/audacious yoga — courageous leader, heads an army or organization, stubborn but successful, respected.', hi: 'कहल योग — साहसी नेता, संगठन प्रमुख, हठी पर सफल।', sa: '' } });
  }

  // Shankha Yoga — Lords of 5th and 6th in mutual kendras
  const lord5Id = signLord(((ascSign - 1 + 4) % 12) + 1);
  const lord6Id = signLord(((ascSign - 1 + 5) % 12) + 1);
  const lord5 = getP(planets, lord5Id);
  const lord6 = getP(planets, lord6Id);
  if (KENDRA.includes(houseOffset(lord5.house, lord6.house)) || KENDRA.includes(houseOffset(lord6.house, lord5.house))) {
    if (lagnaP.isExalted || lagnaP.isOwnSign || KENDRA.includes(lagnaP.house)) {
      results.push({ id: 'shankha', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Shankha Yoga', hi: 'शंख योग', sa: 'शंखयोगः' }, formationRule: { en: '5th and 6th lords in mutual kendras, lagna lord strong', hi: '5 व 6 स्वामी परस्पर केंद्र, लग्नेश बलवान', sa: '' }, description: { en: 'Conch yoga — long life, good character, righteous, learned, enjoys all comforts, fond of relatives.', hi: 'शंख योग — दीर्घ आयु, सच्चरित्र, धार्मिक, विद्वान।', sa: '' } });
    }
  }

  // Bheri Yoga — Lord of 9th strong + all planets in 1/2/7/12
  const lord9Id = signLord(((ascSign - 1 + 8) % 12) + 1);
  const lord9 = getP(planets, lord9Id);
  const planetsIn1_2_7_12 = planets.filter(p => p.id <= 6 && [1, 2, 7, 12].includes(p.house));
  if ((lord9.isExalted || lord9.isOwnSign) && planetsIn1_2_7_12.length >= 5) {
    results.push({ id: 'bheri', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Bheri Yoga', hi: 'भेरी योग', sa: 'भेरीयोगः' }, formationRule: { en: '9th lord strong + most planets in 1/2/7/12', hi: '9 स्वामी बलवान + अधिकांश ग्रह 1/2/7/12 में', sa: '' }, description: { en: 'Drum yoga — long life, freedom from disease, religious and charitable, wealthy, commands respect.', hi: 'भेरी योग — दीर्घ आयु, निरोगी, धार्मिक, दानशील, धनवान।', sa: '' } });
  }

  // Veshi Yoga — planet (not Moon) in 2nd from Sun
  const secondFromSun = (sun.house % 12) + 1;
  const planetIn2ndFromSun = planets.filter(p => p.id !== 1 && p.id >= 2 && p.id <= 6 && p.house === secondFromSun);
  if (planetIn2ndFromSun.length > 0) {
    const pNames = planetIn2ndFromSun.map(p => ['','','Mars','Mer','Jup','Ven','Sat'][p.id]).join(', ');
    results.push({ id: 'veshi', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Veshi Yoga', hi: 'वेशी योग', sa: 'वेशीयोगः' }, formationRule: { en: `${pNames} in 2nd from Sun`, hi: `${pNames} सूर्य से 2वें में`, sa: '' }, description: { en: 'Planet ahead of Sun — good memory, balanced temperament, truthful, charitable, steady fortune.', hi: 'वेशी योग — अच्छी स्मृति, संतुलित स्वभाव, सत्यवादी, दानी।', sa: '' } });
  }

  // Voshi Yoga — planet (not Moon) in 12th from Sun
  const twelfthFromSun = ((sun.house - 2 + 12) % 12) + 1;
  const planetIn12thFromSun = planets.filter(p => p.id !== 1 && p.id >= 2 && p.id <= 6 && p.house === twelfthFromSun);
  if (planetIn12thFromSun.length > 0) {
    const pNames = planetIn12thFromSun.map(p => ['','','Mars','Mer','Jup','Ven','Sat'][p.id]).join(', ');
    results.push({ id: 'voshi', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Voshi Yoga', hi: 'वोशी योग', sa: 'वोशीयोगः' }, formationRule: { en: `${pNames} in 12th from Sun`, hi: `${pNames} सूर्य से 12वें में`, sa: '' }, description: { en: 'Planet behind Sun — skilled, charitable, learned, good at writing and communication.', hi: 'वोशी योग — कुशल, दानी, विद्वान, लेखन में निपुण।', sa: '' } });
  }

  // Ubhayachari Yoga — planets in both 2nd and 12th from Sun (not Moon, not Rahu/Ketu)
  if (planetIn2ndFromSun.length > 0 && planetIn12thFromSun.length > 0) {
    results.push({ id: 'ubhayachari', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Ubhayachari Yoga', hi: 'उभयचारी योग', sa: 'उभयचारीयोगः' }, formationRule: { en: 'Planets in both 2nd and 12th from Sun', hi: 'सूर्य से 2वें और 12वें दोनों में ग्रह', sa: '' }, description: { en: 'Sun flanked by planets — king-like personality, eloquent speaker, extremely handsome, strong-bodied, wealthy.', hi: 'उभयचारी योग — राजा जैसा व्यक्तित्व, वक्ता, धनवान, बलवान।', sa: '' } });
  }

  // Chaturmukha Yoga — benefics in all 4 kendras
  const kendraWithBenefics = KENDRA.filter(k => planets.some(p => p.house === k && isBenefic(p.id)));
  if (kendraWithBenefics.length === 4) {
    results.push({ id: 'chaturmukha', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Chaturmukha Yoga', hi: 'चतुर्मुख योग', sa: 'चतुर्मुखयोगः' }, formationRule: { en: 'Benefic planet in each of 4 kendras (1,4,7,10)', hi: 'प्रत्येक 4 केंद्र में शुभ ग्रह', sa: '' }, description: { en: 'Four-faced (Brahma) yoga — supremely fortunate, long life over 96 years, fame spreading in all directions, devotion to dharma.', hi: 'चतुर्मुख योग — अत्यंत भाग्यशाली, 96+ वर्ष आयु, चारों दिशाओं में यश।', sa: '' } });
  }

  // Kala Amrita Yoga — all planets between Moon and Sun axis
  const moonLon = moon.longitude;
  const sunLon = sun.longitude;
  const othersIds = [2, 3, 4, 5, 6]; // Mars to Saturn
  const allBetweenMoonSun = othersIds.every(pid => {
    const lon = getP(planets, pid).longitude;
    return isLongBetween(lon, moonLon, sunLon);
  });
  const allBetweenSunMoon = othersIds.every(pid => {
    const lon = getP(planets, pid).longitude;
    return isLongBetween(lon, sunLon, moonLon);
  });
  if (allBetweenMoonSun || allBetweenSunMoon) {
    results.push({ id: 'kala_amrita', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Kala Amrita Yoga', hi: 'काल अमृत योग', sa: 'कालामृतयोगः' }, formationRule: { en: 'All planets between Sun-Moon axis', hi: 'सभी ग्रह सूर्य-चंद्र अक्ष में', sa: '' }, description: { en: 'Time-nectar yoga — all planets contained within Sun-Moon arc. Focused energy, spiritual potential, destined for meaningful achievements.', hi: 'काल अमृत योग — सभी ग्रह सूर्य-चंद्र चाप में। केंद्रित ऊर्जा, आध्यात्मिक क्षमता।', sa: '' } });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Additional Arishta (Danger/Health) Yogas
// ---------------------------------------------------------------------------

function detectMoreArishtaYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const moon = getP(planets, 1); const sun = getP(planets, 0);
  const mars = getP(planets, 2); const saturn = getP(planets, 6);
  const rahu = getP(planets, 7); const jupiter = getP(planets, 4);

  // Balarishta — Moon in 6/8/12 aspected by malefic, no benefic aspect
  if (DUSTHANA.includes(moon.house)) {
    const maleficAspects = planets.filter(p => isMalefic(p.id) && houseOffset(p.house, moon.house) === 7);
    if (maleficAspects.length > 0) {
      results.push({ id: 'balarishta_moon', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Balarishta (Moon Affliction)', hi: 'बालारिष्ट (चंद्र पीड़ा)', sa: '' }, formationRule: { en: `Moon in ${moon.house}th house aspected by malefic`, hi: `चंद्र ${moon.house}वें भाव में पाप दृष्ट`, sa: '' }, description: { en: 'Childhood danger yoga — health challenges in early life, need for extra care in infancy and childhood. Jupiter aspect can cancel.', hi: 'बालारिष्ट — बाल्यकाल में स्वास्थ्य चुनौतियाँ, शैशव में अतिरिक्त देखभाल आवश्यक।', sa: '' } });
    }
  }

  // Mrityu Yoga — Lord of 8th in lagna + afflicted
  const lord8Id = signLord(((ascSign - 1 + 7) % 12) + 1);
  const lord8 = getP(planets, lord8Id);
  if (lord8.house === 1 && (inSameHouse(lord8, getP(planets, 6)) || inSameHouse(lord8, getP(planets, 2)))) {
    results.push({ id: 'mrityu_yoga', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Mrityu Yoga', hi: 'मृत्यु योग', sa: '' }, formationRule: { en: '8th lord in lagna conjunct malefic', hi: '8 स्वामी लग्न में पाप ग्रह युत', sa: '' }, description: { en: 'Danger yoga — health vulnerabilities, accident-prone periods, needs careful attention during 8th lord dasha. Remedial measures recommended.', hi: 'मृत्यु योग — स्वास्थ्य कमजोरी, दुर्घटना प्रवण काल, उपचार अनुशंसित।', sa: '' } });
  }

  // Alpayu Yoga — malefics in 1st and 7th, no benefic aspect
  const malIn1 = planets.filter(p => p.house === 1 && isMalefic(p.id));
  const malIn7 = planets.filter(p => p.house === 7 && isMalefic(p.id));
  if (malIn1.length > 0 && malIn7.length > 0) {
    results.push({ id: 'alpayu', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Alpayu Yoga', hi: 'अल्पायु योग', sa: '' }, formationRule: { en: 'Malefics in both 1st and 7th houses', hi: 'पाप ग्रह 1 और 7 दोनों भावों में', sa: '' }, description: { en: 'Short-life indicator — malefics on ascendant axis. Health consciousness essential. Jupiter aspect or strong lagna lord can mitigate significantly.', hi: 'अल्पायु — लग्न अक्ष पर पाप ग्रह। स्वास्थ्य जागरूकता आवश्यक।', sa: '' } });
  }

  // Roga Yoga — Lord of lagna in 6th + 6th lord in lagna
  const lagnaLordId = signLord(ascSign);
  const lord6Id = signLord(((ascSign - 1 + 5) % 12) + 1);
  const lagnaP = getP(planets, lagnaLordId);
  const lord6P = getP(planets, lord6Id);
  if (lagnaP.house === 6 && lord6P.house === 1) {
    results.push({ id: 'roga', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Roga Yoga', hi: 'रोग योग', sa: '' }, formationRule: { en: 'Lagna lord in 6th and 6th lord in 1st (exchange)', hi: 'लग्नेश 6वें में व 6 स्वामी 1 में (परिवर्तन)', sa: '' }, description: { en: 'Disease yoga — constitutional health challenges, chronic conditions, but the exchange also gives ability to fight disease.', hi: 'रोग योग — शारीरिक स्वास्थ्य चुनौतियाँ, दीर्घकालिक स्थितियाँ।', sa: '' } });
  }

  // Bandhana Yoga — Rahu + Saturn + Mars all in kendra/trikona
  if ([...KENDRA, ...TRIKONA].includes(rahu.house) && [...KENDRA, ...TRIKONA].includes(saturn.house) && [...KENDRA, ...TRIKONA].includes(mars.house)) {
    if (inSameHouse(rahu, saturn) || inSameHouse(rahu, mars) || inSameHouse(saturn, mars)) {
      results.push({ id: 'bandhana', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Bandhana Yoga', hi: 'बंधन योग', sa: '' }, formationRule: { en: 'Rahu, Saturn, Mars conjunct or in kendra/trikona', hi: 'राहु, शनि, मंगल केंद्र/त्रिकोण में युत', sa: '' }, description: { en: 'Imprisonment/bondage yoga — restriction of freedom, legal entanglements, confinement. Can manifest as feeling trapped in life circumstances.', hi: 'बंधन योग — स्वतंत्रता का प्रतिबंध, कानूनी उलझन।', sa: '' } });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Conjunction-based yogas (planet pairs and triples)
// ---------------------------------------------------------------------------

function detectConjunctionYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];
  const sun = getP(planets, 0); const moon = getP(planets, 1);
  const mars = getP(planets, 2); const mercury = getP(planets, 3);
  const jupiter = getP(planets, 4); const venus = getP(planets, 5);
  const saturn = getP(planets, 6); const rahu = getP(planets, 7);
  const ketu = getP(planets, 8);

  // Shiva Yoga — Sun + Moon + Jupiter conjunction
  if (inSameHouse(sun, moon) && inSameHouse(sun, jupiter)) {
    results.push({ id: 'shiva_yoga', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Shiva Yoga', hi: 'शिव योग', sa: 'शिवयोगः' }, formationRule: { en: 'Sun + Moon + Jupiter conjunct', hi: 'सूर्य + चंद्र + गुरु युत', sa: '' }, description: { en: 'Trident energy of consciousness — supreme spiritual authority, blessed by divine grace, teacher of teachers, regal bearing with compassion.', hi: 'शिव योग — सर्वोच्च आध्यात्मिक अधिकार, दिव्य कृपा, गुरुओं के गुरु।', sa: '' } });
  }

  // Gaja Kesari Yoga (strict) — Jupiter in kendra from Moon + not combust
  const jupFromMoon = houseOffset(moon.house, jupiter.house);
  if ([1, 4, 7, 10].includes(jupFromMoon) && !jupiter.isDebilitated) {
    // Check it's not just weak conjunction — already have basic version, make this strict version
    if (jupiter.isExalted || jupiter.isOwnSign) {
      results.push({ id: 'gaja_kesari_strong', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Gaja Kesari Yoga (Strong)', hi: 'गजकेसरी योग (बलवान)', sa: '' }, formationRule: { en: 'Jupiter in kendra from Moon + exalted/own sign', hi: 'गुरु चंद्र से केंद्र + उच्च/स्वराशि', sa: '' }, description: { en: 'Strongest form of Gaja Kesari — elephant-lion power with Jupiter dignified. Exceptional leadership, wisdom, and lasting fame across generations.', hi: 'गजकेसरी बलवान — गुरु सम्मानित, असाधारण नेतृत्व, पीढ़ियों में यश।', sa: '' } });
    }
  }

  // Grahan Yoga — Sun/Moon conjunct Rahu/Ketu
  if (inSameHouse(sun, rahu) || inSameHouse(sun, ketu)) {
    results.push({ id: 'surya_grahan', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Surya Grahan Yoga', hi: 'सूर्य ग्रहण योग', sa: '' }, formationRule: { en: 'Sun conjunct Rahu/Ketu', hi: 'सूर्य राहु/केतु युत', sa: '' }, description: { en: 'Solar eclipse yoga — father/authority issues, ego challenges, government obstacles. But can give research ability and occult knowledge.', hi: 'सूर्य ग्रहण — पिता/अधिकार मुद्दे, अहंकार चुनौतियाँ, सरकारी बाधाएँ।', sa: '' } });
  }
  if (inSameHouse(moon, rahu) || inSameHouse(moon, ketu)) {
    results.push({ id: 'chandra_grahan', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Chandra Grahan Yoga', hi: 'चंद्र ग्रहण योग', sa: '' }, formationRule: { en: 'Moon conjunct Rahu/Ketu', hi: 'चंद्र राहु/केतु युत', sa: '' }, description: { en: 'Lunar eclipse yoga — emotional turbulence, mother health concerns, anxiety patterns. Strong intuition and psychic ability as positive side.', hi: 'चंद्र ग्रहण — भावनात्मक अशांति, माता स्वास्थ्य चिंता, पर तीव्र अंतर्ज्ञान।', sa: '' } });
  }

  // Guru Chandal Yoga — Jupiter + Rahu conjunction
  if (inSameHouse(jupiter, rahu)) {
    results.push({ id: 'guru_chandal', category: 'dosha', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Guru Chandal Yoga', hi: 'गुरु चांडाल योग', sa: 'गुरुचाण्डालयोगः' }, formationRule: { en: 'Jupiter conjunct Rahu', hi: 'गुरु-राहु युति', sa: '' }, description: { en: 'Teacher-outcast yoga — unorthodox beliefs, challenges with gurus/teachers, unconventional wisdom. May reject traditional religion but find spiritual truth independently.', hi: 'गुरु चांडाल — अपरंपरागत विश्वास, गुरुओं से चुनौतियाँ, स्वतंत्र आध्यात्मिक सत्य।', sa: '' } });
  }

  // Angarak Yoga — Mars + Rahu conjunction
  if (inSameHouse(mars, rahu)) {
    results.push({ id: 'angarak', category: 'dosha', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Angarak Yoga', hi: 'अंगारक योग', sa: 'अङ्गारकयोगः' }, formationRule: { en: 'Mars conjunct Rahu', hi: 'मंगल-राहु युति', sa: '' }, description: { en: 'Fire-coal yoga — explosive anger, accidents, litigation, surgery risk. But also extraordinary courage, technical brilliance, and ability to overcome impossible odds.', hi: 'अंगारक — विस्फोटक क्रोध, दुर्घटनाएँ, पर असाधारण साहस और तकनीकी प्रतिभा।', sa: '' } });
  }

  // Shani-Rahu conjunction (Shrapit Dosha variant)
  if (inSameHouse(saturn, rahu)) {
    results.push({ id: 'shani_rahu', category: 'dosha', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Shani-Rahu Yoga', hi: 'शनि-राहु योग', sa: '' }, formationRule: { en: 'Saturn conjunct Rahu', hi: 'शनि-राहु युति', sa: '' }, description: { en: 'Chronic delays, fear, anxiety. Past-life karmic debt manifesting as obstacles. But intense perseverance and eventual breakthrough after age 36.', hi: 'शनि-राहु — दीर्घकालिक विलंब, भय, चिंता, पर 36 के बाद सफलता।', sa: '' } });
  }

  // Venus-Saturn conjunction — delayed love/marriage
  if (inSameHouse(venus, saturn)) {
    results.push({ id: 'shukra_shani', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Shukra-Shani Yoga', hi: 'शुक्र-शनि योग', sa: '' }, formationRule: { en: 'Venus conjunct Saturn', hi: 'शुक्र-शनि युति', sa: '' }, description: { en: 'Delayed romance, late marriage, but deeply loyal and lasting relationships. Artistic talent with disciplined execution — craft mastery.', hi: 'शुक्र-शनि — विलंबित विवाह, पर गहरे वफादार संबंध, कला में निपुणता।', sa: '' } });
  }

  // Jupiter-Venus conjunction — Guru-Shukra Yoga
  if (inSameHouse(jupiter, venus)) {
    results.push({ id: 'guru_shukra', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Guru-Shukra Yoga', hi: 'गुरु-शुक्र योग', sa: '' }, formationRule: { en: 'Jupiter conjunct Venus', hi: 'गुरु-शुक्र युति', sa: '' }, description: { en: 'Great benefic conjunction — wealth + wisdom combined, patronage of arts, generous and beautiful life, but may indicate conflict between spiritual and material desires.', hi: 'गुरु-शुक्र — धन + ज्ञान, कला संरक्षण, उदार और सुंदर जीवन।', sa: '' } });
  }

  // Mars-Saturn conjunction — disciplined warrior
  if (inSameHouse(mars, saturn)) {
    results.push({ id: 'mars_saturn', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Yama Yoga (Mars-Saturn)', hi: 'यम योग (मंगल-शनि)', sa: '' }, formationRule: { en: 'Mars conjunct Saturn', hi: 'मंगल-शनि युति', sa: '' }, description: { en: 'God of death energy — intense discipline or destructive frustration. Can excel in surgery, engineering, military, mining. Needs physical outlet for energy.', hi: 'यम योग — तीव्र अनुशासन, शल्यक्रिया/इंजीनियरिंग/सेना में उत्कृष्ट।', sa: '' } });
  }

  // Sun-Saturn conjunction — father issues but authority
  if (inSameHouse(sun, saturn)) {
    results.push({ id: 'sun_saturn', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Pitr-Shani Yoga', hi: 'पितृ-शनि योग', sa: '' }, formationRule: { en: 'Sun conjunct Saturn', hi: 'सूर्य-शनि युति', sa: '' }, description: { en: 'Father-son tension — struggles with authority figures, delayed recognition, but eventual rise through hard work. Government career after initial obstacles.', hi: 'पितृ-शनि — अधिकारियों से संघर्ष, विलंबित मान्यता, पर कठिन परिश्रम से उत्थान।', sa: '' } });
  }

  // 5+ planets in one house — Sannyasa Yoga tendency
  for (let h = 1; h <= 12; h++) {
    const planetsInH = planets.filter(p => p.id <= 6 && p.house === h);
    if (planetsInH.length >= 4) {
      results.push({ id: `stellium_h${h}`, category: 'other', isAuspicious: true, present: true, strength: planetsInH.length >= 5 ? 'Strong' : 'Moderate', name: { en: `Stellium in House ${h}`, hi: `${h}वें भाव में स्टेलियम`, sa: '' }, formationRule: { en: `${planetsInH.length} planets in house ${h}`, hi: `${planetsInH.length} ग्रह ${h}वें भाव में`, sa: '' }, description: { en: `Heavy concentration of energy in house ${h} — this life area dominates the chart. Extraordinary focus but potential imbalance with neglected areas.`, hi: `भाव ${h} में ऊर्जा का भारी संकेंद्रण — यह जीवन क्षेत्र चार्ट पर हावी।`, sa: '' } });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Retrograde-specific yogas
// ---------------------------------------------------------------------------

function detectRetroYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];

  const retroCount = planets.filter(p => p.id >= 2 && p.id <= 6 && p.isRetrograde).length;
  if (retroCount >= 3) {
    results.push({ id: 'tri_vakri', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Tri-Vakri Yoga', hi: 'त्रि-वक्री योग', sa: '' }, formationRule: { en: `${retroCount} planets retrograde at birth`, hi: `जन्म पर ${retroCount} ग्रह वक्री`, sa: '' }, description: { en: 'Multiple retrograde planets — internalized energy, delayed results, unconventional life path. Karmic intensity from past lives.', hi: 'अनेक वक्री ग्रह — आंतरिक ऊर्जा, विलंबित परिणाम, अपरंपरागत जीवन पथ।', sa: '' } });
  }

  // Retrograde benefic in kendra = hidden strength
  for (const pid of [3, 4, 5]) {
    const p = getP(planets, pid);
    if (p.isRetrograde && [1,4,7,10].includes(p.house)) {
      results.push({ id: `vakri_${['','','','merc','jup','ven'][pid]}_kendra`, category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: `Vakri ${['','','','Mercury','Jupiter','Venus'][pid]} in Kendra`, hi: `वक्री ${['','','','बुध','गुरु','शुक्र'][pid]} केंद्र में`, sa: '' }, formationRule: { en: `Retrograde ${['','','','Mercury','Jupiter','Venus'][pid]} in house ${p.house}`, hi: '', sa: '' }, description: { en: 'Retrograde benefic in angular house — intensified inner power, unconventional but deep wisdom/beauty/skill.', hi: 'वक्री शुभ केंद्र में — तीव्र आंतरिक शक्ति।', sa: '' } });
    }
  }

  return results;
}

export function detectAllYogas(planets: PlanetData[], ascendantSign: number): YogaComplete[] {
  return [
    ...detectDoshaYogas(planets, ascendantSign),
    ...detectExtendedDoshas(planets, ascendantSign),
    ...detectMahapurushaYogas(planets),
    ...detectMoonBasedYogas(planets),
    ...detectSunBasedYogas(planets),
    ...detectRajaYogas(planets, ascendantSign),
    ...detectWealthYogas(planets, ascendantSign),
    ...detectInauspiciousYogas(planets, ascendantSign),
    ...detectAdditionalAuspiciousYogas(planets, ascendantSign),
    ...detectOtherYogas(planets, ascendantSign),
    ...detectSankhyaYogas(planets),
    ...detectGrahaMalikaYogas(planets, ascendantSign),
    ...detectArishtaYogas(planets, ascendantSign),
    ...detectMoreDhanaYogas(planets, ascendantSign),
    ...detectMiscYogas(planets, ascendantSign),
    ...detectExpandedRajaYogas(planets, ascendantSign),
    ...detectKartariYogas(planets),
    ...detectPlanetHouseYogas(planets, ascendantSign),
    ...detectRetroYogas(planets),
    ...detectConjunctionYogas(planets),
    ...detectNabhasaYogas(planets),
    ...detectParivartanaYogas(planets, ascendantSign),
    ...detectDaridraYogas(planets, ascendantSign),
    ...detectExtendedMoonYogas(planets),
    ...detectClassicalPlanetYogas(planets, ascendantSign),
    ...detectMoreArishtaYogas(planets, ascendantSign),
  ];
}
