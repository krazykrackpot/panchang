import type { LocaleText } from '@/types/panchang';
import { EXALTATION_SIGNS, DEBILITATION_SIGNS, OWN_SIGNS, SIGN_LORDS, MARANA_KARAKA_HOUSE } from '@/lib/constants/dignities';
// yogas-complete.ts  –  Comprehensive Vedic Yoga Detection Library (150+ yogas)

export interface YogaComplete {
  id: string;
  name: LocaleText;
  category: 'dosha' | 'mahapurusha' | 'moon_based' | 'sun_based' | 'raja' | 'wealth' | 'inauspicious' | 'other';
  isAuspicious: boolean;
  present: boolean;
  strength: 'Strong' | 'Moderate' | 'Weak';
  formationRule: LocaleText;
  description: LocaleText;
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
  navamshaSign?: number;        // 1-12, D9 sign
  isPushkarNavamsha?: boolean;  // true if in a Pushkara Navamsha position
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const KENDRA = [1, 4, 7, 10];
const TRIKONA = [1, 5, 9];
const DUSTHANA = [6, 8, 12];
const UPACHAYA = [3, 6, 10, 11];
const BENEFICS = [1, 3, 4, 5]; // Moon, Mercury, Jupiter, Venus
// Natural malefics per BPHS Ch.3 — Sun, Mars, Saturn, Rahu, Ketu. Previously
// excluded the nodes, causing yoga detectors to under-count (Pitra/Kalathra
// dosha missed; Parvata over-triggered) when nodes occupied flagged houses.
// Domain-synthesis already used the broader set; aligned here. (Audit P1-38.)
const MALEFICS = [0, 2, 6, 7, 8];

// SIGN_LORDS imported from @/lib/constants/dignities (L11 — single source of truth)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getP(planets: PlanetData[], id: number): PlanetData {
  return planets.find(p => p.id === id)!;
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

/** Check if two planets aspect each other (including special aspects of Mars, Jupiter, Saturn) */
function planetsAspectEachOther(p1: PlanetData, p2: PlanetData): boolean {
  const offset12 = houseOffset(p1.house, p2.house);
  const offset21 = houseOffset(p2.house, p1.house);
  // Universal 7th aspect
  if (offset12 === 7 || offset21 === 7) return true;
  // Mars special aspects (4th, 8th FROM Mars)
  if (p1.id === 2 && [4, 8].includes(offset12)) return true;
  if (p2.id === 2 && [4, 8].includes(offset21)) return true;
  // Jupiter special aspects (5th, 9th FROM Jupiter)
  if (p1.id === 4 && [5, 9].includes(offset12)) return true;
  if (p2.id === 4 && [5, 9].includes(offset21)) return true;
  // Saturn special aspects (3rd, 10th FROM Saturn)
  if (p1.id === 6 && [3, 10].includes(offset12)) return true;
  if (p2.id === 6 && [3, 10].includes(offset21)) return true;
  return false;
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
// Yoga detection  –  grouped by category
// ---------------------------------------------------------------------------

function detectDoshaYogas(planets: PlanetData[], _ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const mars = getP(planets, 2);
  const rahu = getP(planets, 7);
  const ketu = getP(planets, 8);

  // 1. Mangala Dosha (basic detection for yoga listing)
  // Full analysis with cancellations, 3-ref-point detection:
  //   import { analyzeMangalDosha } from './mangal-dosha-engine';
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

  // 2. Kala Sarpa Yoga  –  with 12 sub-types based on Rahu's house
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
      ? { en: `Kala Sarpa Yoga  –  ${ksSubType.en}`, hi: `काल सर्प योग  –  ${ksSubType.hi}`, sa: `कालसर्पयोगः  –  ${ksSubType.sa}` }
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

  // 12. Kemadruma  –  no planets in 2nd/12th from Moon, Moon not in Kendra,
  // AND Moon not conjunct any planet (conjunction = same house, cancels Kemadruma)
  // AND Jupiter not aspecting Moon (Jupiter's special aspects: 1st/5th/7th/9th from Jupiter)
  const moonConjunct = planets.some(p => p.id !== 1 && p.house === moon.house);
  const jupFromMoonKem = houseOffset(moon.house, jupiter.house);
  const jupiterAspectsMoon = [1, 5, 7, 9].includes(jupFromMoonKem);
  const kemPresent = secondFromMoon.length === 0 && twelfthFromMoon.length === 0
    && !KENDRA.includes(moon.house) && !moonConjunct && !jupiterAspectsMoon;
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
  // Conjunction (same house) OR mutual 7th aspect
  const mars = getP(planets, 2);
  const cmConjunct = inSameHouse(moon, mars);
  const cmMutualAspect = houseOffset(moon.house, mars.house) === 7;
  const cmPresent = cmConjunct || cmMutualAspect;
  results.push({
    id: 'chandra_mangala',
    name: { en: 'Chandra Mangala Yoga', hi: 'चन्द्र मंगल योग', sa: 'चन्द्रमङ्गलयोगः' },
    category: 'moon_based',
    isAuspicious: true,
    present: cmPresent,
    strength: cmPresent ? (cmConjunct ? 'Strong' : 'Moderate') : 'Weak',
    formationRule: {
      en: 'Moon and Mars conjunct or in mutual 7th aspect',
      hi: 'चन्द्र और मंगल एक ही भाव में या परस्पर सप्तम दृष्टि',
      sa: 'चन्द्रकुजौ एकभावस्थौ सप्तमदृष्ट्या वा',
    },
    description: {
      en: 'Moon-Mars conjunction bestows wealth through enterprise, courage, and determination.',
      hi: 'चन्द्र-मंगल युति। उद्यम से धन, साहस और दृढ़ संकल्प देता है।',
      sa: 'चन्द्रकुजयुतिः। उद्यमेन धनं शौर्यं दृढसंकल्पं च ददाति।',
    },
  });

  // 14. Shakata
  // Moon in 6th, 8th, or 12th from Jupiter (all three are inauspicious placements)
  const shakatOffset = houseOffset(jupiter.house, moon.house);
  const shakatPresent = shakatOffset === 6 || shakatOffset === 8 || shakatOffset === 12;
  results.push({
    id: 'shakata',
    name: { en: 'Shakata Yoga', hi: 'शकट योग', sa: 'शकटयोगः' },
    category: 'moon_based',
    isAuspicious: false,
    present: shakatPresent,
    strength: shakatPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Moon in 6th, 8th, or 12th house from Jupiter',
      hi: 'बृहस्पति से छठे, आठवें या बारहवें भाव में चन्द्र',
      sa: 'गुरोः षष्ठे अष्टमे द्वादशे वा चन्द्रः',
    },
    description: {
      en: 'Moon in 6/8/12 from Jupiter causes fluctuating fortunes and instability.',
      hi: 'बृहस्पति से 6/8/12 में चन्द्र। भाग्य में उतार-चढ़ाव और अस्थिरता का संकेत।',
      sa: 'गुरोः षष्ठाष्टमद्वादशे चन्द्रः। भाग्ये उत्थानपतने अस्थिरतां च सूचयति।',
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
  // Combustion check: Mercury within 14° (direct) or 12° (retrograde) of Sun weakens the yoga
  const baSepDeg = Math.abs(sun.longitude - mercury.longitude);
  const baSeparation = Math.min(baSepDeg, 360 - baSepDeg);
  const baCombOrb = mercury.isRetrograde ? 12 : 14;
  const baIsCombust = baSeparation < baCombOrb;
  // Strength: combust = Weak, close but not combust = Moderate, well-separated = Strong
  let baStrength: 'Strong' | 'Moderate' | 'Weak' = 'Weak';
  if (baPresent) {
    if (baIsCombust) baStrength = 'Weak';
    else if (baSeparation < baCombOrb + 5) baStrength = 'Moderate';
    else baStrength = 'Strong';
  }
  results.push({
    id: 'budhaditya',
    name: { en: 'Budhaditya Yoga', hi: 'बुधादित्य योग', sa: 'बुधादित्ययोगः' },
    category: 'sun_based',
    isAuspicious: true,
    present: baPresent,
    strength: baStrength,
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

  // 21. Vasumati  –  ALL benefics (Mercury, Jupiter, Venus  –  exclude Moon as reference)
  // must occupy Upachaya houses (3,6,10,11) from Moon.
  // Classical rule per BPHS: benefics in upachaya FROM MOON.
  const vasBeneficIds = [3, 4, 5]; // Mercury, Jupiter, Venus (exclude Moon itself)
  const vasPresent = vasBeneficIds.every(id => {
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
  // Classical rule (BPHS Ch.36): Amala Yoga forms when a benefic planet is in
  // the 10th from the Lagna.  "AT LEAST ONE" benefic suffices  –  the yoga is
  // not cancelled by co-tenants.
  //
  // HISTORICAL BUG (now fixed): `.every(isBenefic)` required ALL planets in
  // the 10th to be benefics.  A single malefic co-tenant (e.g. Saturn in a
  // chart where Jupiter is also in the 10th) would suppress the yoga entirely.
  // The Moon-based version at line ~2035 correctly used `.filter().length > 0`
  // (equivalent to `.some()`).  Now both use the same correct criterion.
  const amalaPresent = planetsIn10.some(p => isBenefic(p.id));
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
      en: 'Strong 9th lord in Kendra/Trikona bestows the blessings of Lakshmi  –  wealth and grace.',
      hi: 'नवमेश बली केन्द्र/त्रिकोण में। लक्ष्मी कृपा  –  धन और अनुग्रह।',
      sa: 'नवमेशः बली केन्द्रत्रिकोणे। लक्ष्म्याः कृपा  –  धनम् अनुग्रहश्च।',
    },
  });

  // 27. Gauri (Phaladeepika)
  // Correct rule: Moon in own or exalted sign in the 9th house,
  // Jupiter aspects the Lagna (house 1) via conjunction or special aspects (5th, 7th, 9th FROM Jupiter),
  // and 9th lord is in own/exalted (dignity).
  const moonInOwnExalted = moon.isOwnSign || moon.isExalted;
  const moonIn9th = moon.house === 9;
  // Jupiter aspects Lagna (house 1): conjunction (houseOffset=1) or special aspects (5th, 7th, 9th FROM Jupiter)
  const jupAspectsLagna = [1, 5, 7, 9].includes(houseOffset(jupiter.house, 1));
  const ninthLordDignified = nlP2.isOwnSign || nlP2.isExalted;
  const gauriPresent = moonInOwnExalted && moonIn9th && jupAspectsLagna && ninthLordDignified;
  results.push({
    id: 'gauri',
    name: { en: 'Gauri Yoga', hi: 'गौरी योग', sa: 'गौरीयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: gauriPresent,
    strength: gauriPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Moon in own/exalted in 9th house, Jupiter aspects Lagna, 9th lord dignified',
      hi: 'चन्द्र स्वराशि/उच्च 9वें भाव में, बृहस्पति लग्न पर दृष्टि, नवमेश बली',
      sa: 'चन्द्रः स्वोच्चे नवमे गुरुः लग्नं पश्यति नवमेशः बली',
    },
    description: {
      en: 'Moon dignified in 9th with Jupiter aspecting Lagna and strong 9th lord grants beauty, devotion, and auspiciousness.',
      hi: 'चन्द्र बली 9वें में, गुरु लग्न पर दृष्टि। सौन्दर्य, भक्ति और शुभत्व।',
      sa: 'चन्द्रः बली नवमे गुरुदृष्ट्या लग्ने। सौन्दर्यं भक्तिं शुभत्वं च ददाति।',
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

  // 31. Bheri (BPHS Ch.36)
  // Correct rule: Lagna lord, Jupiter (id=4), and Venus (id=5) must all be in
  // mutual kendras (each in a kendra house from the others), AND 9th lord must be strong.
  const jupiterBheri = getP(planets, 4);
  const venusBheri = getP(planets, 5);
  // Check all three are in kendra from each other
  const llJupKendra = KENDRA.includes(houseOffset(llP.house, jupiterBheri.house));
  const llVenKendra = KENDRA.includes(houseOffset(llP.house, venusBheri.house));
  const jupVenKendra = KENDRA.includes(houseOffset(jupiterBheri.house, venusBheri.house));
  const ninthLordStrong = nlP2.isOwnSign || nlP2.isExalted;
  const bheriPresent = llJupKendra && llVenKendra && jupVenKendra && ninthLordStrong;
  results.push({
    id: 'bheri',
    name: { en: 'Bheri Yoga', hi: 'भेरी योग', sa: 'भेरीयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: bheriPresent,
    strength: bheriPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Lagna lord, Jupiter, Venus in mutual kendras; 9th lord in own/exalted',
      hi: 'लग्नेश, बृहस्पति, शुक्र परस्पर केन्द्र में; नवमेश स्वराशि/उच्च',
      sa: 'लग्नेशगुरुशुक्राः परस्परकेन्द्रे; नवमेशः स्वोच्चे',
    },
    description: {
      en: 'Bheri Yoga bestows material comforts, devotion, and a virtuous family life.',
      hi: 'भेरी योग भौतिक सुख, भक्ति और सद्गृहस्थ जीवन देता है।',
      sa: 'भेरीयोगः भौतिकसुखं भक्तिं सद्गृहस्थजीवनं च ददाति।',
    },
  });

  // 32. Mahabhagya
  // Classical BPHS rule (Ch.10.18-19):
  //   - Male:   Lagna + Sun + Moon all in ODD signs  AND  born during the day
  //   - Female: Lagna + Sun + Moon all in EVEN signs AND born at night
  //
  // P2-31 (Sprint 15) — previously checked only "all in odd signs" with
  // no day/night gate. With three independent 50/50 sign checks alone the
  // yoga fired ~12% of charts (= (1/2)^3 = 0.125) — far above the
  // Lesson-T target of <5% for a "rare" yoga.
  //
  // Adding the day/night gate via Sun's house drops the trigger rate
  // for each variant to ~6%. We detect BOTH variants (the engine has no
  // gender input) and present each conditionally with the gender caveat
  // in the description — so a user can determine which of the two
  // applies to their chart.
  //
  // Day birth = Sun above the horizon = Sun in houses 7-12.
  // Night birth = Sun below the horizon = Sun in houses 1-6.
  const sun = getP(planets, 0);
  const oddSigns = [1, 3, 5, 7, 9, 11];
  const evenSigns = [2, 4, 6, 8, 10, 12];
  const isDayBirth = sun.house >= 7 && sun.house <= 12;
  const isNightBirth = sun.house >= 1 && sun.house <= 6;
  const allOdd = oddSigns.includes(ascSign) &&
                 oddSigns.includes(sun.sign) &&
                 oddSigns.includes(moon.sign);
  const allEven = evenSigns.includes(ascSign) &&
                  evenSigns.includes(sun.sign) &&
                  evenSigns.includes(moon.sign);
  const mbMalePresent = allOdd && isDayBirth;
  const mbFemalePresent = allEven && isNightBirth;
  const mbPresent = mbMalePresent || mbFemalePresent;
  const mbVariant: 'male' | 'female' | null = mbMalePresent ? 'male' : mbFemalePresent ? 'female' : null;
  results.push({
    id: 'mahabhagya',
    name: { en: 'Mahabhagya Yoga', hi: 'महाभाग्य योग', sa: 'महाभाग्ययोगः' },
    category: 'raja',
    isAuspicious: true,
    present: mbPresent,
    strength: mbPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Male chart: Ascendant, Sun, Moon all in odd signs AND day birth (Sun in houses 7–12). Female chart: all in even signs AND night birth (Sun in houses 1–6).',
      hi: 'पुरुष कुण्डली: लग्न, सूर्य, चन्द्र सभी विषम राशि में और दिन का जन्म (सूर्य भाव 7–12 में)। स्त्री कुण्डली: सभी सम राशि में और रात्रि का जन्म (सूर्य भाव 1–6 में)।',
      sa: 'पुरुषजातके: लग्नं सूर्यः चन्द्रश्च सर्वे ओजराशिषु दिवाजन्म च। स्त्रीजातके: सर्वे युग्मराशिषु रात्रिजन्म च।',
    },
    description: {
      en: mbVariant === 'male'
        ? 'Great fortune yoga (male variant) — confirmed if this is a male chart. Sun, Moon, and Ascendant in odd signs combined with a daytime birth grant extraordinary luck.'
        : mbVariant === 'female'
        ? 'Great fortune yoga (female variant) — confirmed if this is a female chart. Sun, Moon, and Ascendant in even signs combined with a nighttime birth grant extraordinary luck.'
        : 'Great fortune yoga (Mahabhagya) — requires sign parity in Lagna/Sun/Moon plus a matched gender + day/night birth.',
      hi: mbVariant === 'male'
        ? 'महाभाग्य योग (पुरुष रूप) — पुरुष कुण्डली में पुष्टि। सूर्य, चन्द्र, लग्न विषम राशि में और दिन का जन्म असाधारण भाग्य देता है।'
        : mbVariant === 'female'
        ? 'महाभाग्य योग (स्त्री रूप) — स्त्री कुण्डली में पुष्टि। सूर्य, चन्द्र, लग्न सम राशि में और रात्रि का जन्म असाधारण भाग्य देता है।'
        : 'महाभाग्य योग — लग्न/सूर्य/चन्द्र की राशि समानता और मेल खाते लिंग + दिन/रात्रि जन्म आवश्यक।',
      sa: mbVariant === 'male'
        ? 'महाभाग्ययोगः (पुरुषरूपः) — पुरुषजातके सूर्यचन्द्रलग्नं ओजराशिषु दिवाजन्मना च असाधारणं भाग्यम्।'
        : mbVariant === 'female'
        ? 'महाभाग्ययोगः (स्त्रीरूपः) — स्त्रीजातके सर्वे युग्मराशिषु रात्रिजन्मना च असाधारणं भाग्यम्।'
        : 'महाभाग्ययोगः — लग्न/सूर्य/चन्द्रराशिसमानता लिङ्गानुरूपं दिवारात्रिजन्म च आवश्यकम्।',
    },
  });

  // 33. Pushkala (Phaladeepika)
  // Correct rule: Lagna lord and Moon-sign lord in conjunction or mutual 7th aspect,
  // AND a benefic (Jupiter/Venus/Mercury) is in the Lagna (house 1).
  const moonSignLord = signLord(moon.sign);
  const moonSignLordP = getP(planets, moonSignLord);
  const pushLordsRelated = inSameHouse(llP, moonSignLordP) ||
    houseOffset(llP.house, moonSignLordP.house) === 7;
  const beneficInLagna = planets.some(p => p.house === 1 && [3, 4, 5].includes(p.id)); // Mercury, Jupiter, Venus
  const pushPresent = pushLordsRelated && beneficInLagna;
  results.push({
    id: 'pushkala',
    name: { en: 'Pushkala Yoga', hi: 'पुष्कल योग', sa: 'पुष्कलयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: pushPresent,
    strength: pushPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Lagna lord and Moon-sign lord conjunct/mutual aspect, benefic in Lagna',
      hi: 'लग्नेश और चन्द्र-राशि-स्वामी युति/परस्पर दृष्टि, लग्न में शुभ ग्रह',
      sa: 'लग्नेशः चन्द्रराशीशश्च युत्या दृष्ट्या वा, लग्ने शुभग्रहः',
    },
    description: {
      en: 'Lagna lord and Moon-sign lord related with a benefic in Lagna grants popularity, wealth, and a commanding presence.',
      hi: 'लग्नेश-चन्द्रराशीश सम्बन्ध और लग्न में शुभ ग्रह। लोकप्रियता, धन और प्रभावशाली व्यक्तित्व।',
      sa: 'लग्नेश-चन्द्रराशीशयोः सम्बन्धः लग्ने शुभग्रहश्च। लोकप्रियतां धनं प्रभावशालिव्यक्तित्वं च।',
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

  // 37. Graha Sanghata (Planetary Cluster) — all 7 planets in ≤4 consecutive houses
  // NOTE: This is NOT a Malika yoga. Malika = chain of occupied consecutive houses.
  // This is a Sanghata-type Nabhasa yoga — tight clustering of all planets.
  const sevenPlanets = planets.filter(p => p.id >= 0 && p.id <= 6);
  let sanghataPresent = false;
  let sanghataStart = 0;
  let sanghataSpan = 0;
  for (let start = 1; start <= 12; start++) {
    const houses = [start, (start % 12) + 1, ((start + 1) % 12) + 1, ((start + 2) % 12) + 1];
    if (sevenPlanets.every(p => houses.includes(p.house))) {
      sanghataPresent = true;
      sanghataStart = start;
      // Compute actual number of occupied houses within the 4-house window
      const usedHouses = new Set(sevenPlanets.map(p => p.house));
      sanghataSpan = usedHouses.size;
      break;
    }
  }
  // Determine auspiciousness: kendra/trikona houses in the cluster = better
  const KENDRA_TRIKONA = [1, 4, 5, 7, 9, 10];
  const sanghataHouses = sanghataPresent
    ? [sanghataStart, (sanghataStart % 12) + 1, ((sanghataStart + 1) % 12) + 1, ((sanghataStart + 2) % 12) + 1]
    : [];
  const sanghataInKendraTrikona = sanghataHouses.filter(h => KENDRA_TRIKONA.includes(h)).length;
  const sanghataAuspicious = sanghataInKendraTrikona >= 2;
  // Find first and last planet by house order within the cluster
  const sortedCluster = [...sevenPlanets].sort((a, b) => {
    const aOff = ((a.house - sanghataStart + 12) % 12);
    const bOff = ((b.house - sanghataStart + 12) % 12);
    return aOff - bOff || a.longitude - b.longitude;
  });
  const firstP = sortedCluster[0];
  const lastP = sortedCluster[sortedCluster.length - 1];
  const PLANET_ROLES_EN: Record<number, string> = {
    0: 'vitality, authority', 1: 'emotions, nurturing', 2: 'energy, courage',
    3: 'intellect, communication', 4: 'wisdom, expansion', 5: 'relationships, creativity',
    6: 'discipline, endurance',
  };
  // The window is always 4 consecutive houses; sanghataSpan = how many of those 4 are actually occupied
  const windowEnd = ((sanghataStart - 1 + 3) % 12) + 1; // 4th house in the window
  const clusterDescEn = sanghataPresent
    ? `All 7 planets concentrated within a 4-house window (H${sanghataStart}–H${windowEnd}), occupying ${sanghataSpan} of those houses. ` +
      `${GRAHA_EN[firstP.id]} (${PLANET_ROLES_EN[firstP.id]}) in H${firstP.house} leads the cluster; ` +
      `${GRAHA_EN[lastP.id]} (${PLANET_ROLES_EN[lastP.id]}) in H${lastP.house} anchors it. ` +
      (sanghataAuspicious
        ? 'Cluster overlaps kendra/trikona houses — concentrated power channelled into auspicious life areas.'
        : 'Cluster falls largely in dusthana/upachaya houses — intense focus but life balance may suffer.')
    : 'All 7 planets clustered within 4 consecutive houses — concentrated planetary energy.';
  const clusterDescHi = sanghataPresent
    ? `सभी 7 ग्रह 4-भाव विंडो (भाव ${sanghataStart}–${windowEnd}) में संकेन्द्रित, ${sanghataSpan} भावों में। ` +
      `${GRAHA_HI[firstP.id]} भाव ${firstP.house} में अग्रणी; ${GRAHA_HI[lastP.id]} भाव ${lastP.house} में स्थिर।`
    : 'सभी 7 ग्रह 4 क्रमागत भावों में — संकेन्द्रित ग्रह ऊर्जा।';
  results.push({
    id: 'graha_sanghata',
    name: { en: 'Graha Sanghata (Planetary Cluster)', hi: 'ग्रह संघात (ग्रह समूह)', sa: 'ग्रहसंघातयोगः' },
    category: 'other',
    isAuspicious: sanghataAuspicious,
    present: sanghataPresent,
    strength: sanghataPresent ? (sanghataSpan <= 2 ? 'Strong' : sanghataSpan <= 3 ? 'Moderate' : 'Weak') : 'Weak',
    formationRule: {
      en: sanghataPresent
        ? `All 7 planets (Sun–Saturn) within 4 consecutive houses (H${sanghataStart}–H${windowEnd})`
        : 'All 7 planets (Sun–Saturn) in 4 or fewer consecutive houses',
      hi: sanghataPresent
        ? `सभी 7 ग्रह (सूर्य-शनि) 4 क्रमागत भावों (${sanghataStart}–${windowEnd}) में`
        : 'सभी 7 ग्रह (सूर्य-शनि) 4 या कम क्रमागत भावों में',
      sa: 'सर्वे सप्तग्रहाः चतुर्षु क्रमभावेषु',
    },
    description: {
      en: clusterDescEn,
      hi: clusterDescHi,
      sa: 'सर्वे ग्रहाः संकीर्णक्षेत्रे संकेन्द्रिताः। तीव्रशक्तिः किन्तु जीवने असन्तुलनं सम्भवम्।',
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
  // Uses planetsAspectEachOther() which includes Mars (4th/8th), Jupiter (5th/9th),
  // and Saturn (3rd/10th) special aspects in addition to universal 7th aspect.
  const kendraLords = KENDRA.map(h => signLord(houseSign(h)));
  const trikonaLords = TRIKONA.map(h => signLord(houseSign(h)));
  let rajaPresent = false;
  for (const kl of kendraLords) {
    for (const tl of trikonaLords) {
      if (kl === tl) continue; // same planet can't form yoga with itself in this check
      const klP = getP(planets, kl);
      const tlP = getP(planets, tl);
      if (inSameHouse(klP, tlP)) { rajaPresent = true; break; }
      // Mutual aspect including special aspects of Mars, Jupiter, Saturn
      if (planetsAspectEachOther(klP, tlP)) { rajaPresent = true; break; }
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

  // 42. Dhana Yoga (BPHS Ch.42)
  // PRIMARY: Lord of 2nd and lord of 11th must be related (conjunction or mutual 7th aspect).
  // Also: lord of 5th conjunct lord of 9th forms a secondary Dhana Yoga.
  // SECONDARY (weaker): Jupiter or Venus in 2nd or 11th house.
  const secondLordDhana = signLord(houseSign(2));
  const eleventhLordDhana = signLord(houseSign(11));
  const secondLordP = getP(planets, secondLordDhana);
  const eleventhLordP = getP(planets, eleventhLordDhana);
  const fifthLordDhana = signLord(houseSign(5));
  const ninthLordDhana = signLord(houseSign(9));
  const fifthLordDP = getP(planets, fifthLordDhana);
  const ninthLordDP = getP(planets, ninthLordDhana);
  // Primary: 2nd lord and 11th lord conjunct or in mutual 7th aspect
  const dhanaLordRelated = inSameHouse(secondLordP, eleventhLordP) ||
    houseOffset(secondLordP.house, eleventhLordP.house) === 7;
  // Secondary: 5th lord conjunct 9th lord
  const dhana59 = inSameHouse(fifthLordDP, ninthLordDP);
  // P2-32 (Sprint 15) — the previous "tertiary" branch (Jupiter OR Venus
  // in 2nd OR 11th) fired in ~31% of random charts on its own
  // (P = 1 - (1 - 2/12)² ≈ 0.306). Combined with the primary + secondary
  // it pushed Dhana Yoga's "present" rate over 50%, breaking the Lesson-T
  // <20% threshold for a "rare" yoga. Removed from the present-detection
  // gate; benefic placement in a wealth house is now reported only as a
  // strength signal when one of the lord relationships also fires.
  const beneficInWealth = [2, 11].includes(jupiter.house) || [2, 11].includes(venus.house);
  const dhanaPresent = dhanaLordRelated || dhana59;
  const dhanaStrength: 'Strong' | 'Moderate' | 'Weak' =
    dhanaPresent && beneficInWealth ? 'Strong'
    : dhanaLordRelated || dhana59 ? 'Moderate'
    : 'Weak';
  results.push({
    id: 'dhana_yoga',
    name: { en: 'Dhana Yoga', hi: 'धन योग', sa: 'धनयोगः' },
    category: 'wealth',
    isAuspicious: true,
    present: dhanaPresent,
    strength: dhanaStrength,
    formationRule: {
      en: 'Lord of 2nd and lord of 11th conjunct or in mutual 7th aspect; OR 5th lord conjunct 9th lord. (Benefic Jupiter/Venus in 2nd or 11th boosts strength but is not required.)',
      hi: 'द्वितीयेश और एकादशेश युति या परस्पर दृष्टि में; या पंचमेश-नवमेश युति। (गुरु/शुक्र 2/11 में बल बढ़ाते हैं लेकिन आवश्यक नहीं।)',
      sa: 'द्वितीयेश-एकादशेशौ युत्या परस्परदृष्ट्या वा; पञ्चमेश-नवमेशौ युतौ। (गुरुशुक्रौ द्वितीयैकादशे बलवर्धकौ; अनिवार्यौ न।)',
    },
    description: {
      en: 'Lords of wealth houses (2nd, 11th) related by conjunction or aspect bestow financial abundance and material prosperity.',
      hi: 'धन भावों (2, 11) के स्वामी युति या दृष्टि से सम्बन्धित। आर्थिक समृद्धि और भौतिक सम्पन्नता।',
      sa: 'धनभावेशौ युत्या दृष्ट्या वा सम्बद्धौ। आर्थिकसमृद्धिं भौतिकसम्पन्नतां च ददाति।',
    },
  });

  // 43. Viparita Raja Yoga (BPHS Ch.41)
  // Correct rule: Lord of 6th/8th/12th placed in ANY other dusthana (6/8/12).
  // Three sub-types:
  //   Harsha: 6th lord in 8th or 12th
  //   Sarala: 8th lord in 6th or 12th
  //   Vimala: 12th lord in 6th or 8th
  // Sign exchange is NOT required  –  only placement in another dusthana.
  const sixthLord = signLord(houseSign(6));
  const eighthLord = signLord(houseSign(8));
  const twelfthLord = signLord(houseSign(12));
  const d6 = getP(planets, sixthLord);
  const d8 = getP(planets, eighthLord);
  const d12 = getP(planets, twelfthLord);
  // Harsha: 6th lord in 8th or 12th house
  const harsha = d6.house === 8 || d6.house === 12;
  // Sarala: 8th lord in 6th or 12th house
  const sarala = d8.house === 6 || d8.house === 12;
  // Vimala: 12th lord in 6th or 8th house
  const vimala = d12.house === 6 || d12.house === 8;
  const vipPresent = harsha || sarala || vimala;
  const vipSubTypes: string[] = [];
  if (harsha) vipSubTypes.push('Harsha');
  if (sarala) vipSubTypes.push('Sarala');
  if (vimala) vipSubTypes.push('Vimala');
  const vipStrength: 'Strong' | 'Moderate' | 'Weak' = vipSubTypes.length >= 2 ? 'Strong' : (vipPresent ? 'Moderate' : 'Weak');
  results.push({
    id: 'viparita_raja',
    name: { en: 'Viparita Raja Yoga', hi: 'विपरीत राज योग', sa: 'विपरीतराजयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: vipPresent,
    strength: vipStrength,
    formationRule: {
      en: `Dusthana lord (6th/8th/12th) in another dusthana${vipPresent ? '  –  ' + vipSubTypes.join(', ') : ''}`,
      hi: 'दुस्थान स्वामी (6/8/12) अन्य दुस्थान में',
      sa: 'दुस्थानेशः अन्यदुस्थाने स्थितः',
    },
    description: {
      en: 'Dusthana lords placed in other dusthanas create unexpected rise through adversity and enemies turning allies.',
      hi: 'दुस्थान स्वामी अन्य दुस्थान में। विपरीत परिस्थितियों से अप्रत्याशित उत्थान।',
      sa: 'दुस्थानेशाः अन्यदुस्थानेषु। विपरीतस्थित्या अप्रत्याशितम् उत्थानम्।',
    },
  });

  // 44. Neechabhanga Raja Yoga  –  5 classical cancellation rules (BPHS Ch.28)
  // Use canonical EXALTATION_SIGNS imported at the top (was duplicated here
  // as EXALT_SIGN_NB — values matched but pre-drift hazard per Lesson Q;
  // Audit P1-39).
  let neechPresent = false;
  const debPlanets = planets.filter(p => p.isDebilitated && p.id <= 6);
  for (const dp of debPlanets) {
    const debLord = signLord(dp.sign);
    const debLordP = getP(planets, debLord);
    const exaltSign = EXALTATION_SIGNS[dp.id];
    const exaltLord = exaltSign !== undefined ? signLord(exaltSign) : -1;
    const exaltLordP = exaltLord >= 0 ? getP(planets, exaltLord) : null;
    // Rule 1: Debilitation sign lord in kendra from Lagna
    if (KENDRA.includes(debLordP.house)) { neechPresent = true; break; }
    // Rule 2: Debilitation sign lord in kendra from Moon
    if (KENDRA.includes(houseOffset(moon.house, debLordP.house))) { neechPresent = true; break; }
    // Rule 3: Exaltation sign lord in kendra from Lagna
    if (exaltLordP && KENDRA.includes(exaltLordP.house)) { neechPresent = true; break; }
    // Rule 4: Mutual reception with debilitation sign lord
    const dpOwnSigns: number[] = [];
    for (let s = 1; s <= 12; s++) { if (signLord(s) === dp.id) dpOwnSigns.push(s); }
    if (dpOwnSigns.includes(debLordP.sign)) { neechPresent = true; break; }
    // Rule 5: Planet is Vargottama (same sign in D1 and D9 = strong dignity)
    // D9 uses element-based starting sign: Fire→Aries(0), Earth→Cap(9), Air→Libra(6), Water→Cancer(3)
    const d1SignIdx = dp.sign - 1; // 0-based
    const navPart = Math.floor((dp.longitude % 30) / (30 / 9)); // 0-8
    const navStart = [0, 9, 6, 3][d1SignIdx % 4]; // element-based start
    const navamshaSign = ((navStart + navPart) % 12) + 1;
    if (navamshaSign === dp.sign) { neechPresent = true; break; }
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
      hi: 'नीच भंग  –  दुर्बलता असाधारण शक्ति और उत्थान में बदलती है।',
      sa: 'नीचभङ्गः  –  दौर्बल्यम् असाधारणशक्त्युत्थानयोः परिवर्तते।',
    },
  });

  // 45. Dharma-Karmadhipati Yoga
  const ninthLord = signLord(houseSign(9));
  const tenthLord = signLord(houseSign(10));
  const lord9P = getP(planets, ninthLord);
  const lord10P = getP(planets, tenthLord);
  // Conjunction (same house) OR mutual aspect (including special aspects of Mars/Jupiter/Saturn)
  const dkConjunct = inSameHouse(lord9P, lord10P);
  const dkMutualAspect = planetsAspectEachOther(lord9P, lord10P);
  const dkPresent = dkConjunct || dkMutualAspect;
  results.push({
    id: 'dharma_karmadhipati',
    name: { en: 'Dharma-Karmadhipati Yoga', hi: 'धर्म-कर्माधिपति योग', sa: 'धर्मकर्माधिपतियोगः' },
    category: 'raja',
    isAuspicious: true,
    present: dkPresent,
    strength: dkPresent ? (dkConjunct ? 'Strong' : 'Moderate') : 'Weak',
    formationRule: {
      en: '9th lord and 10th lord conjunct or in mutual aspect',
      hi: 'नवमेश और दशमेश युति या परस्पर दृष्टि में',
      sa: 'नवमेशदशमेशौ युत्या परस्परदृष्ट्या वा',
    },
    description: {
      en: 'Union of dharma and karma lords grants righteous career, high status, and spiritual authority.',
      hi: 'धर्म-कर्म स्वामियों की युति। सत्कर्म, उच्च पद और आध्यात्मिक अधिकार।',
      sa: 'धर्मकर्मेशयोगः। सत्कर्म उच्चपदम् आध्यात्मिकाधिकारं च ददाति।',
    },
  });

  // 46. Saraswati Yoga
  // Classical rule: Mercury, Jupiter, Venus all in Kendra, Trikona, or 2nd house,
  // AND Jupiter must be in own, exalted, or friendly sign.
  const sarIds = [3, 4, 5]; // Mercury, Jupiter, Venus
  const sarHouses = [...KENDRA, ...TRIKONA, 2];
  const sarAllWellPlaced = sarIds.every(id => sarHouses.includes(getP(planets, id).house));
  // Jupiter dignity check: own signs (Sagittarius=9, Pisces=12), exalted (Cancer=4),
  // or friendly signs (Aries=1, Leo=5, Scorpio=8)
  const jupSar = getP(planets, 4);
  const jupDignifiedForSar = jupSar.isOwnSign || jupSar.isExalted || [1, 5, 8].includes(jupSar.sign);
  const sarPresent = sarAllWellPlaced && jupDignifiedForSar;
  results.push({
    id: 'saraswati',
    name: { en: 'Saraswati Yoga', hi: 'सरस्वती योग', sa: 'सरस्वतीयोगः' },
    category: 'raja',
    isAuspicious: true,
    present: sarPresent,
    strength: sarPresent ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Jupiter, Venus, Mercury in Kendra/Trikona/2nd; Jupiter in own/exalted/friendly sign',
      hi: 'बृहस्पति, शुक्र, बुध केन्द्र/त्रिकोण/2 में; बृहस्पति स्व/उच्च/मित्र राशि में',
      sa: 'गुरुशुक्रबुधाः केन्द्रत्रिकोणद्वितीये; गुरुः स्वोच्चमित्रराशौ',
    },
    description: {
      en: 'All three wisdom planets well-placed with dignified Jupiter grant exceptional learning, artistry, and eloquence.',
      hi: 'तीनों ज्ञान ग्रह सुस्थित, गुरु बली। असाधारण विद्या, कला और वाक्पटुता।',
      sa: 'त्रयो ज्ञानग्रहाः सुस्थिताः गुरुः बली। असाधारणविद्यां कलां वाक्पटुतां च ददाति।',
    },
  });

  // NOTE: Parivartana Yoga is NOT detected here.
  //
  // HISTORICAL BUG (now fixed): a generic id='parivartana' entry was pushed in
  // this function, producing a flat present/absent boolean alongside the fully
  // classified Maha/Khala/Dainya entries from detectParivartanaYogas().  The
  // two functions are concatenated in detectAllYogas(), so every chart that had
  // any sign exchange produced two entries for the same yoga.
  //
  // detectParivartanaYogas() (called from detectAllYogas) uses house-based
  // classification (Maha/Khala/Dainya) with unique IDs like
  // 'maha_parivartana_1_5'.  Those entries fully supersede the generic one.
  // The generic detection block has been removed.

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

  // 49. Kendradhipati Dosha  –  BPHS: a natural benefic that OWNS a kendra loses
  // its beneficence.  Placement in that kendra is NOT required  –  ownership alone
  // triggers the dosha.  All four natural benefics are checked: Moon (1),
  // Mercury (3), Jupiter (4), Venus (5).
  let kdPresent = false;
  const naturalBeneficsKd = [1, 3, 4, 5]; // Moon, Mercury, Jupiter, Venus
  for (const bId of naturalBeneficsKd) {
    const ownedKendras = KENDRA.filter(kh => signLord(houseSign(kh)) === bId);
    if (ownedKendras.length > 0) {
      kdPresent = true;
      break;
    }
  }
  results.push({
    id: 'kendradhipati_dosha',
    name: { en: 'Kendradhipati Dosha', hi: 'केन्द्राधिपति दोष', sa: 'केन्द्राधिपतिदोषः' },
    category: 'inauspicious',
    isAuspicious: false,
    present: kdPresent,
    strength: kdPresent ? 'Moderate' : 'Weak',
    formationRule: {
      en: 'Natural benefic (Moon/Mercury/Jupiter/Venus) owns a Kendra house',
      hi: 'प्राकृतिक शुभ ग्रह (चन्द्र/बुध/गुरु/शुक्र) केन्द्र का स्वामी',
      sa: 'नैसर्गिकशुभग्रहः (चन्द्र/बुध/गुरु/शुक्र) केन्द्राधिपतिः',
    },
    description: {
      en: 'Natural benefic owning a Kendra loses beneficence, becoming functionally neutral or harmful.',
      hi: 'केन्द्र स्वामी शुभ ग्रह अपनी शुभता खो देता है। कार्यात्मक रूप से तटस्थ या हानिकर।',
      sa: 'केन्द्राधिपतिः शुभग्रहः स्वशुभत्वं त्यजति। कार्यतः तटस्थः हानिकरः वा।',
    },
  });

  // 50. Shakata (extended)  –  same as #14 but cancelled if Jupiter in Kendra from lagna
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
    description: { en: 'Ancestral karmic debt  –  difficulties with father, authority, or spiritual lineage. Remedy: Pitra Tarpan, Narayan Nagbali', hi: 'पूर्वजों का कार्मिक ऋण  –  पिता, अधिकार में कठिनाई। उपाय: पित्र तर्पण, नारायण नागबली', sa: '' },
  });

  // Shrapit Dosha: Saturn-Rahu conjunction
  const shrapitPresent = hOf(6) === hOf(7);
  results.push({
    id: 'shrapit_dosha', category: 'dosha', isAuspicious: false, present: shrapitPresent,
    strength: shrapitPresent ? 'Strong' : 'Weak',
    name: { en: 'Shrapit Dosha', hi: 'श्रापित दोष', sa: 'श्रापितदोषः' },
    formationRule: { en: 'Saturn conjunct Rahu in any house', hi: 'शनि-राहु युति किसी भी भाव में', sa: '' },
    description: { en: 'Cursed from past life  –  chronic obstacles, delays, karmic suffering. Remedy: Rahu-Shani shanti, Mahamrityunjaya japa', hi: 'पूर्वजन्म का शाप  –  दीर्घकालिक बाधाएं, विलंब। उपाय: राहु-शनि शांति, महामृत्युंजय जप', sa: '' },
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
    description: { en: 'Marriage/partnership affliction  –  delays, disagreements, or separation in relationships. Venus strength can mitigate.', hi: 'विवाह/साझेदारी में कष्ट  –  देरी, मतभेद। शुक्र बल से शमन।', sa: '' },
  });

  // Marana Karaka Sthana: Planet in its death-like house.
  // Imported from canonical MARANA_KARAKA_HOUSE — was previously local
  // here (and DIVERGED from yoga-engine/rules/dosha.ts which had a
  // shorter table). The canonical version is Sun-Saturn only; Rahu/Ketu
  // explicitly excluded by Phaladeepika reading. (Audit P0-22.)
  for (let pid = 0; pid <= 6; pid++) {
    if (hOf(pid) === MARANA_KARAKA_HOUSE[pid]) {
      results.push({
        id: `marana_karaka_${pid}`, category: 'dosha', isAuspicious: false, present: true,
        strength: 'Moderate',
        name: { en: `Marana Karaka Sthana (${GRAHA_EN[pid]})`, hi: `मरण कारक स्थान`, sa: 'मरणकारकस्थानम्' },
        formationRule: { en: `Planet in its death-signifying house (${MARANA_KARAKA_HOUSE[pid]}th)`, hi: `ग्रह अपने मृत्यु-सूचक भाव (${MARANA_KARAKA_HOUSE[pid]}वें) में`, sa: '' },
        description: { en: 'Planet becomes extremely weak  –  like a person in a place of death. Significations of this planet suffer greatly.', hi: 'ग्रह अत्यंत दुर्बल  –  मृत्यु स्थान जैसा। इस ग्रह के कारकत्व बहुत पीड़ित।', sa: '' },
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
    description: { en: 'Badhaka lord in ascendant  –  mysterious obstacles, inexplicable setbacks, spiritual interference. Remedy: worship the deity of the Badhaka sign.', hi: 'बाधकेश लग्न में  –  रहस्यमय बाधाएं, अकथनीय विफलताएं। उपाय: बाधक राशि के देवता की पूजा।', sa: '' },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Sankhya Yogas (7)  –  Number of signs occupied
// ---------------------------------------------------------------------------

function detectSankhyaYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];
  const seven = planets.filter(p => p.id < 7);
  const occupiedSigns = new Set(seven.map(p => p.sign));
  const count = occupiedSigns.size;

  const SANKHYA: { count: number; id: string; name: LocaleText; desc: string }[] = [
    { count: 1, id: 'gola', name: { en: 'Gola Yoga', hi: 'गोल योग', sa: 'गोलयोगः' }, desc: 'All 7 planets in 1 sign  –  extreme concentration of energy. Very rare. Native dominates one area of life completely.' },
    { count: 2, id: 'yuga', name: { en: 'Yuga Yoga', hi: 'युग योग', sa: 'युगयोगः' }, desc: 'All planets in 2 signs  –  polarized energy between two life areas.' },
    { count: 3, id: 'shoola_nabhasa', name: { en: 'Shoola Yoga (Nabhasa)', hi: 'शूल योग (नभस)', sa: 'शूलयोगः' }, desc: 'Planets in 3 signs  –  trident-like energy, sharp and focused.' },
    { count: 4, id: 'kedara', name: { en: 'Kedara Yoga', hi: 'केदार योग', sa: 'केदारयोगः' }, desc: 'Planets in 4 signs  –  field of activity, productive agriculture.' },
    { count: 5, id: 'pasha', name: { en: 'Pasha Yoga', hi: 'पाश योग', sa: 'पाशयोगः' }, desc: 'Planets in 5 signs  –  noose/bondage, some restriction but also deep connections.' },
    { count: 6, id: 'damini', name: { en: 'Damini Yoga', hi: 'दामिनी योग', sa: 'दामिनीयोगः' }, desc: 'Planets in 6 signs  –  generous, charitable, lightning-like brilliance.' },
    { count: 7, id: 'veena', name: { en: 'Veena Yoga', hi: 'वीणा योग', sa: 'वीणायोगः' }, desc: 'Planets in 7 signs  –  musical, artistic, balanced across many areas.' },
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
// Graha Malika Yoga  –  Planets in consecutive houses
// ---------------------------------------------------------------------------

function detectGrahaMalikaYogas(planets: PlanetData[], _ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const seven = planets.filter(p => p.id < 7);
  const occupiedHouses = new Set(seven.map(p => p.house));

  // Find the longest chain of consecutive OCCUPIED houses (each must have ≥1 planet)
  let maxChain = 0;
  let chainStart = 0;
  for (let start = 1; start <= 12; start++) {
    if (!occupiedHouses.has(start)) continue; // chain must start at an occupied house
    let chain = 0;
    for (let h = 0; h < 12; h++) {
      const house = ((start - 1 + h) % 12) + 1;
      if (occupiedHouses.has(house)) chain++;
      else break;
    }
    if (chain > maxChain) { maxChain = chain; chainStart = start; }
  }

  // Malika names by starting house (BPHS / Phaladeepika)
  const MALIKA_NAMES: Record<number, { en: string; hi: string; sa: string }> = {
    1:  { en: 'Lagna Malika',   hi: 'लग्न मालिका',   sa: 'लग्नमालिका' },
    2:  { en: 'Dhana Malika',   hi: 'धन मालिका',     sa: 'धनमालिका' },
    3:  { en: 'Vikrama Malika', hi: 'विक्रम मालिका', sa: 'विक्रममालिका' },
    4:  { en: 'Sukha Malika',   hi: 'सुख मालिका',     sa: 'सुखमालिका' },
    5:  { en: 'Putra Malika',   hi: 'पुत्र मालिका',   sa: 'पुत्रमालिका' },
    6:  { en: 'Shatru Malika',  hi: 'शत्रु मालिका',   sa: 'शत्रुमालिका' },
    7:  { en: 'Kalatra Malika', hi: 'कलत्र मालिका',   sa: 'कलत्रमालिका' },
    8:  { en: 'Randhra Malika', hi: 'रन्ध्र मालिका',  sa: 'रन्ध्रमालिका' },
    9:  { en: 'Dharma Malika',  hi: 'धर्म मालिका',     sa: 'धर्ममालिका' },
    10: { en: 'Karma Malika',   hi: 'कर्म मालिका',     sa: 'कर्ममालिका' },
    11: { en: 'Labha Malika',   hi: 'लाभ मालिका',     sa: 'लाभमालिका' },
    12: { en: 'Vyaya Malika',   hi: 'व्यय मालिका',     sa: 'व्ययमालिका' },
  };

  // Auspiciousness by starting house
  const AUSPICIOUS_STARTS = [1, 4, 5, 7, 9, 10, 11]; // kendra/trikona/labha
  const CHALLENGING_STARTS = [6, 8, 12];              // dusthana
  // Houses 2, 3 = moderate

  const present = maxChain >= 3;
  const malikaName = MALIKA_NAMES[chainStart] || MALIKA_NAMES[1];
  const isAuspicious = present ? AUSPICIOUS_STARTS.includes(chainStart) : false;
  const category: YogaComplete['category'] = present
    ? (AUSPICIOUS_STARTS.includes(chainStart) ? 'raja' : CHALLENGING_STARTS.includes(chainStart) ? 'inauspicious' : 'other')
    : 'other';

  // Planet role descriptions for first/last planet context
  const PLANET_ROLES: Record<number, string> = {
    0: 'vitality, authority', 1: 'emotions, nurturing', 2: 'energy, courage',
    3: 'intellect, communication', 4: 'wisdom, expansion', 5: 'relationships, creativity',
    6: 'discipline, endurance',
  };

  // Find first and last planet in the chain (ordered by house offset from chainStart)
  const chainHouses: number[] = [];
  for (let h = 0; h < maxChain; h++) {
    chainHouses.push(((chainStart - 1 + h) % 12) + 1);
  }
  const planetsInChain = seven
    .filter(p => chainHouses.includes(p.house))
    .sort((a, b) => {
      const aOff = ((a.house - chainStart + 12) % 12);
      const bOff = ((b.house - chainStart + 12) % 12);
      return aOff - bOff || a.longitude - b.longitude;
    });
  const firstP = planetsInChain[0];
  const lastP = planetsInChain[planetsInChain.length - 1];

  const chainEndHouse = ((chainStart - 1 + maxChain - 1) % 12) + 1;

  // Build description with first/last planet context
  let descEn: string;
  let descHi: string;
  if (present && firstP && lastP) {
    const involvedNames = planetsInChain.map(p => GRAHA_EN[p.id]).join(', ');
    descEn = `${malikaName.en} Yoga — garland of planets spanning ${maxChain} consecutive houses (H${chainStart}–H${chainEndHouse}). ` +
      `Chain starts with ${GRAHA_EN[firstP.id]} (${PLANET_ROLES[firstP.id]}) in H${firstP.house} and ends with ${GRAHA_EN[lastP.id]} (${PLANET_ROLES[lastP.id]}) in H${lastP.house}. ` +
      `The first planet colours your approach; the last planet defines how this yoga manifests. ` +
      `Involved planets: ${involvedNames}. ` +
      (maxChain >= 7 ? 'All 7 planets in an unbroken chain — extremely rare and powerful.' : maxChain >= 5 ? 'Strong chain of 5+ houses — significant life pattern.' : 'Chain of 3–4 houses — present but moderate influence.');
    const involvedHi = planetsInChain.map(p => GRAHA_HI[p.id]).join(', ');
    descHi = `${malikaName.hi} योग — ${maxChain} क्रमागत भावों (भाव ${chainStart}–${chainEndHouse}) में ग्रहों की माला। ` +
      `श्रृंखला ${GRAHA_HI[firstP.id]} (भाव ${firstP.house}) से प्रारम्भ होकर ${GRAHA_HI[lastP.id]} (भाव ${lastP.house}) पर समाप्त। ` +
      `सम्बद्ध ग्रह: ${involvedHi}।`;
  } else {
    descEn = 'Graha Malika Yoga — garland of planets in consecutive houses. Not present in this chart.';
    descHi = 'ग्रह मालिका योग — क्रमागत भावों में ग्रहों की माला। इस कुण्डली में अनुपस्थित।';
  }

  results.push({
    id: 'graha_malika',
    category,
    isAuspicious,
    present,
    strength: maxChain >= 7 ? 'Strong' : maxChain >= 5 ? 'Moderate' : present ? 'Weak' : 'Weak',
    name: {
      en: present ? `${malikaName.en} Yoga (Graha Malika)` : 'Graha Malika Yoga',
      hi: present ? `${malikaName.hi} योग (ग्रह मालिका)` : 'ग्रह मालिका योग',
      sa: present ? `${malikaName.sa}योगः (ग्रहमालिका)` : 'ग्रहमालिकायोगः',
    },
    formationRule: {
      en: present
        ? `Planets occupy ${maxChain} consecutive houses (H${chainStart}–H${chainEndHouse}) without gaps`
        : 'Planets in 3+ consecutive houses without gaps',
      hi: present
        ? `ग्रह ${maxChain} क्रमागत भावों (${chainStart}–${chainEndHouse}) में बिना अन्तराल`
        : 'ग्रह 3+ क्रमागत भावों में बिना अन्तराल',
      sa: '',
    },
    description: { en: descEn, hi: descHi, sa: '' },
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
    description: { en: 'Unbroken empire  –  sustained power and authority. Jupiter in wealth/fortune houses gives divine protection to position. Very rare in full form.', hi: 'अखंड साम्राज्य  –  निरंतर शक्ति और अधिकार।', sa: '' },
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
    description: { en: 'Royal fan-bearer  –  the native is honored by kings/authorities. Exalted Lagna lord in kendra gives exceptional life outcomes.', hi: 'राजसी चामर  –  जातक राजाओं/अधिकारियों द्वारा सम्मानित।', sa: '' },
  });

  // Chatussagara Yoga: all kendras occupied by planets
  const kendraOccupied = [1,4,7,10].every(h => planets.some(p => p.house === h && p.id < 7));
  results.push({
    id: 'chatussagara_full', category: 'raja', isAuspicious: true,
    present: kendraOccupied, strength: kendraOccupied ? 'Strong' : 'Weak',
    name: { en: 'Chatussagara Yoga (Full)', hi: 'चतुस्सागर योग (पूर्ण)', sa: 'चतुस्सागरयोगः' },
    formationRule: { en: 'All 4 kendras (1,4,7,10) occupied by planets', hi: 'सभी 4 केंद्र (1,4,7,10) में ग्रह', sa: '' },
    description: { en: 'Four oceans yoga  –  fame spreads in all four directions. The native becomes widely known and respected. Very auspicious when kendras have benefics.', hi: 'चार समुद्र योग  –  यश चारों दिशाओं में फैलता है।', sa: '' },
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
    description: { en: 'Auspicious scissors  –  Lagna is hemmed between benefics, protecting the native. Excellent health, fortune, and protection from enemies.', hi: 'शुभ कैंची  –  लग्न शुभ ग्रहों के बीच, जातक की रक्षा। उत्कृष्ट स्वास्थ्य, भाग्य।', sa: '' },
  });

  // Papa Kartari: Malefics in 2nd and 12th from Lagna
  const malIn2 = planets.some(p => p.house === 2 && isMalefic(p.id));
  const malIn12 = planets.some(p => p.house === 12 && isMalefic(p.id));
  results.push({
    id: 'papa_kartari', category: 'inauspicious', isAuspicious: false,
    present: malIn2 && malIn12, strength: malIn2 && malIn12 ? 'Strong' : 'Weak',
    name: { en: 'Papa Kartari Yoga', hi: 'पाप कर्तरी योग', sa: 'पापकर्तरीयोगः' },
    formationRule: { en: 'Malefics in both 2nd and 12th from Lagna', hi: 'लग्न से 2nd और 12th दोनों में पाप', sa: '' },
    description: { en: 'Inauspicious scissors  –  Lagna hemmed between malefics. Obstacles, health issues, and struggles. Can be mitigated by strong Lagna lord or Jupiter aspect.', hi: 'पाप कैंची  –  लग्न पाप ग्रहों के बीच। बाधाएं, स्वास्थ्य समस्याएं। गुरु दृष्टि से शमन।', sa: '' },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Expanded Raja Yogas  –  per-house lord combinations
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
        description: { en: 'Sign exchange between kendra-trikona lords  –  powerful Raja Yoga through mutual cooperation.', hi: 'केंद्र-त्रिकोण स्वामियों का राशि परिवर्तन  –  परस्पर सहयोग से शक्तिशाली राजयोग।', sa: '' },
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

  if (b2m && b12m) results.push({ id: 'shubha_kartari_moon', category: 'moon_based', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Shubha Kartari (Moon)', hi: 'शुभ कर्तरी (चन्द्र)', sa: '' }, formationRule: { en: 'Benefics hemming Moon from both sides', hi: 'शुभ ग्रह चन्द्र के दोनों ओर', sa: '' }, description: { en: 'Moon protected by benefics  –  emotional stability, mental peace, public support.', hi: 'चन्द्र शुभ ग्रहों से रक्षित  –  भावनात्मक स्थिरता, मानसिक शांति।', sa: '' } });
  if (m2m && m12m) results.push({ id: 'papa_kartari_moon', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Papa Kartari (Moon)', hi: 'पाप कर्तरी (चन्द्र)', sa: '' }, formationRule: { en: 'Malefics hemming Moon from both sides', hi: 'पाप ग्रह चन्द्र के दोनों ओर', sa: '' }, description: { en: 'Moon hemmed by malefics  –  emotional distress, mental anxiety, public opposition.', hi: 'चन्द्र पाप ग्रहों के बीच  –  भावनात्मक कष्ट, चिंता।', sa: '' } });

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
  if (hOf(4) === 1) results.push({ id: 'guru_lagna', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Guru in Lagna Yoga', hi: 'गुरु लग्न योग', sa: '' }, formationRule: { en: 'Jupiter in 1st house', hi: 'गुरु लग्न में', sa: '' }, description: { en: 'Jupiter in ascendant  –  wisdom, divine grace, generous nature, respected in society. One of the best placements.', hi: 'गुरु लग्न में  –  ज्ञान, दैवी कृपा, उदार स्वभाव।', sa: '' } });

  // Venus in 7th = strong marriage indicator
  if (hOf(5) === 7) results.push({ id: 'venus_7th', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Venus in 7th Yoga', hi: 'शुक्र सप्तम योग', sa: '' }, formationRule: { en: 'Venus in 7th house', hi: 'शुक्र 7वें भाव में', sa: '' }, description: { en: 'Venus (karaka of marriage) in the house of marriage  –  beautiful spouse, happy married life, artistic partner.', hi: 'शुक्र (विवाह कारक) विवाह भाव में  –  सुंदर जीवनसाथी, सुखी वैवाहिक जीवन।', sa: '' } });

  // Saturn in 10th = Shasha-like career yoga (discipline → authority)
  if (hOf(6) === 10 && !getP(planets, 6).isDebilitated) results.push({ id: 'shani_dasham', category: 'raja', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Shani Dasham Yoga', hi: 'शनि दशम योग', sa: '' }, formationRule: { en: 'Saturn in 10th house (not debilitated)', hi: 'शनि 10वें भाव में (नीच नहीं)', sa: '' }, description: { en: 'Saturn in house of career  –  slow but steady rise to authority through discipline, hard work, and public service.', hi: 'शनि करियर भाव में  –  अनुशासन और परिश्रम से धीमी लेकिन स्थिर उन्नति।', sa: '' } });

  // Sun in 10th = Dig Bala (directional strength) + career authority
  if (hOf(0) === 10) results.push({ id: 'surya_dasham', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Surya Dasham Yoga', hi: 'सूर्य दशम योग', sa: '' }, formationRule: { en: 'Sun in 10th house (maximum Dig Bala)', hi: 'सूर्य 10वें भाव में (अधिकतम दिग्बल)', sa: '' }, description: { en: 'Sun at zenith  –  maximum directional strength. Government authority, leadership, fame in profession. Father may be prominent.', hi: 'सूर्य शिखर पर  –  अधिकतम दिग्बल। सरकारी अधिकार, नेतृत्व, व्यावसायिक यश।', sa: '' } });

  // Mars in 10th = Dig Bala + career energy
  if (hOf(2) === 10) results.push({ id: 'mangal_dasham', category: 'raja', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Mangal Dasham Yoga', hi: 'मंगल दशम योग', sa: '' }, formationRule: { en: 'Mars in 10th house', hi: 'मंगल 10वें भाव में', sa: '' }, description: { en: 'Mars with directional strength in career house  –  engineering, surgery, military, sports, property development careers favored.', hi: 'मंगल करियर भाव में दिग्बल  –  इंजीनियरिंग, शल्यक्रिया, सेना, खेल करियर।', sa: '' } });

  // Rahu in 3rd = courage amplified (unconventional)
  if (hOf(7) === 3) results.push({ id: 'rahu_third', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Rahu in 3rd Yoga', hi: 'राहु तृतीय योग', sa: '' }, formationRule: { en: 'Rahu in 3rd house (upachaya)', hi: 'राहु 3rd भाव में (उपचय)', sa: '' }, description: { en: 'Rahu in house of courage  –  extraordinary daring, unconventional communication, success through bold ventures. Good for media, technology.', hi: 'राहु साहस भाव में  –  असाधारण साहस, अपरंपरागत संचार, मीडिया/तकनीक।', sa: '' } });

  // Ketu in 12th = Moksha yoga (spiritual liberation)
  if (hOf(8) === 12) results.push({ id: 'ketu_twelfth', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Ketu in 12th (Moksha Yoga)', hi: 'केतु द्वादश (मोक्ष योग)', sa: '' }, formationRule: { en: 'Ketu in 12th house', hi: 'केतु 12वें भाव में', sa: '' }, description: { en: 'Ketu (detachment) in house of liberation  –  natural spiritual inclination, meditation ability, past-life spiritual merit. May indicate foreign residence.', hi: 'केतु मोक्ष भाव में  –  स्वाभाविक आध्यात्मिक प्रवृत्ति, ध्यान क्षमता।', sa: '' } });

  // All benefics in kendras = extremely fortunate
  const beneficsInKendras = planets.filter(p => isBenefic(p.id) && [1,4,7,10].includes(p.house)).length;
  if (beneficsInKendras >= 3) results.push({ id: 'saubhagya', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Saubhagya Yoga', hi: 'सौभाग्य योग', sa: '' }, formationRule: { en: `${beneficsInKendras} benefics in kendras`, hi: `${beneficsInKendras} शुभ ग्रह केंद्रों में`, sa: '' }, description: { en: 'Multiple benefics in angular houses  –  great fortune, divine protection, surrounded by goodness. Life flows smoothly.', hi: 'अनेक शुभ ग्रह केंद्रों में  –  महान भाग्य, दिव्य रक्षा।', sa: '' } });

  // All malefics in upachayas (3,6,10,11) = Viparita-like strength
  const maleficsInUpachaya = planets.filter(p => isMalefic(p.id) && [3,6,10,11].includes(p.house)).length;
  if (maleficsInUpachaya >= 3) results.push({ id: 'duryoga_nivaran', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Malefics in Upachaya', hi: 'पाप उपचय योग', sa: '' }, formationRule: { en: `${maleficsInUpachaya} malefics in upachaya houses (3,6,10,11)`, hi: `${maleficsInUpachaya} पाप ग्रह उपचय (3,6,10,11) में`, sa: '' }, description: { en: 'Malefics perform well in upachaya houses  –  challenges overcome, enemies defeated, career through struggle, growing gains with age.', hi: 'पाप ग्रह उपचय में अच्छे  –  शत्रु पराजित, उम्र के साथ बढ़ता लाभ।', sa: '' } });

  return results;
}

// ---------------------------------------------------------------------------
// Nabhasa Yogas (Geometric patterns  –  BPHS Ch.35)
// ---------------------------------------------------------------------------

function detectNabhasaYogas(planets: PlanetData[]): YogaComplete[] {
  const results: YogaComplete[] = [];
  const occupiedHouses = [...new Set(planets.filter(p => p.id <= 6).map(p => p.house))].sort((a, b) => a - b);
  const occupiedSigns = [...new Set(planets.filter(p => p.id <= 6).map(p => p.sign))].sort((a, b) => a - b);

  // Yupa Yoga  –  all 7 planets in 1st through 4th houses
  const inQ1 = planets.filter(p => p.id <= 6 && [1, 2, 3, 4].includes(p.house)).length;
  if (inQ1 === 7) results.push({ id: 'yupa', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Yupa Yoga', hi: 'यूप योग', sa: 'यूपयोगः' }, formationRule: { en: 'All 7 planets in houses 1-4', hi: 'सभी 7 ग्रह 1-4 भावों में', sa: '' }, description: { en: 'Sacrificial post pattern  –  religious nature, ritual discipline, philanthropic disposition, spiritual authority.', hi: 'यज्ञस्तंभ पैटर्न  –  धार्मिक प्रकृति, अनुशासन, परोपकार।', sa: '' } });

  // Ishu Yoga  –  all 7 planets in 4th through 7th
  const inQ2 = planets.filter(p => p.id <= 6 && [4, 5, 6, 7].includes(p.house)).length;
  if (inQ2 === 7) results.push({ id: 'ishu', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Ishu Yoga', hi: 'इषु योग', sa: 'इषुयोगः' }, formationRule: { en: 'All 7 planets in houses 4-7', hi: 'सभी 7 ग्रह 4-7 भावों में', sa: '' }, description: { en: 'Arrow pattern  –  restless nature, travel-oriented, difficulty settling, skill in warfare or competitive fields.', hi: 'बाण पैटर्न  –  बेचैन स्वभाव, यात्रा-प्रवृत्ति, प्रतियोगी क्षेत्र।', sa: '' } });

  // Shakti Yoga  –  all 7 planets in 7th through 10th
  const inQ3 = planets.filter(p => p.id <= 6 && [7, 8, 9, 10].includes(p.house)).length;
  if (inQ3 === 7) results.push({ id: 'shakti_nabhasa', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Shakti Yoga', hi: 'शक्ति योग', sa: 'शक्तियोगः' }, formationRule: { en: 'All 7 planets in houses 7-10', hi: 'सभी 7 ग्रह 7-10 भावों में', sa: '' }, description: { en: 'Power pattern  –  authority, political influence, dominion over others, strong public presence.', hi: 'शक्ति पैटर्न  –  अधिकार, राजनीतिक प्रभाव, सार्वजनिक उपस्थिति।', sa: '' } });

  // Danda Yoga  –  all 7 planets in 10th through 1st
  const inQ4 = planets.filter(p => p.id <= 6 && [10, 11, 12, 1].includes(p.house)).length;
  if (inQ4 === 7) results.push({ id: 'danda', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Danda Yoga', hi: 'दण्ड योग', sa: 'दण्डयोगः' }, formationRule: { en: 'All 7 planets in houses 10-1', hi: 'सभी 7 ग्रह 10-1 भावों में', sa: '' }, description: { en: 'Staff/punishment pattern  –  servitude, dependence on others, harsh life circumstances, but potential for discipline and endurance.', hi: 'दण्ड पैटर्न  –  सेवा, कठिन परिस्थितियाँ, पर अनुशासन क्षमता।', sa: '' } });

  // Nauka Yoga  –  all 7 planets in 7 consecutive houses
  if (occupiedHouses.length >= 7) {
    let consecutive = true;
    const first = occupiedHouses[0];
    for (let i = 1; i < occupiedHouses.length; i++) {
      if (((first + i - 1) % 12) + 1 !== occupiedHouses[i]) { consecutive = false; break; }
    }
    if (consecutive) results.push({ id: 'nauka', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Nauka Yoga', hi: 'नौका योग', sa: 'नौकायोगः' }, formationRule: { en: 'All planets in 7 consecutive houses', hi: 'सभी ग्रह 7 क्रमागत भावों में', sa: '' }, description: { en: 'Boat pattern  –  wealth through navigation/trade, overseas connections, adaptability, fortune through movement.', hi: 'नौका पैटर्न  –  व्यापार से धन, विदेशी संबंध, अनुकूलनशीलता।', sa: '' } });
  }

  // Kedara Yoga  –  all planets in 4 houses
  if (occupiedHouses.length === 4) results.push({ id: 'kedara', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Kedara Yoga', hi: 'केदार योग', sa: 'केदारयोगः' }, formationRule: { en: 'All planets occupy exactly 4 houses', hi: 'सभी ग्रह केवल 4 भावों में', sa: '' }, description: { en: 'Ploughed field pattern  –  agricultural wealth, landed property, patient hard work yielding results, farmer-king energy.', hi: 'खेत पैटर्न  –  भूमि संपत्ति, कृषि धन, धैर्यपूर्ण कार्य।', sa: '' } });

  // Shula Yoga  –  all planets in 3 houses
  if (occupiedHouses.length === 3) results.push({ id: 'shula', category: 'other', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Shula Yoga', hi: 'शूल योग', sa: 'शूलयोगः' }, formationRule: { en: 'All planets in exactly 3 houses', hi: 'सभी ग्रह केवल 3 भावों में', sa: '' }, description: { en: 'Trident pattern  –  sharp focus but extremes in fortune, aggressive nature, potential for conflict, but concentrated power.', hi: 'त्रिशूल पैटर्न  –  तीव्र एकाग्रता पर भाग्य के उतार-चढ़ाव।', sa: '' } });

  // Yuga Yoga  –  all planets in 2 houses
  if (occupiedHouses.length === 2) results.push({ id: 'yuga', category: 'other', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Yuga Yoga', hi: 'युग योग', sa: 'युगयोगः' }, formationRule: { en: 'All planets in exactly 2 houses', hi: 'सभी ग्रह केवल 2 भावों में', sa: '' }, description: { en: 'Yoke pattern  –  extreme polarity in life, very focused but one-dimensional, can be religious or irreligious, wealthy or poor.', hi: 'युग पैटर्न  –  जीवन में अत्यधिक ध्रुवीयता, एक-आयामी।', sa: '' } });

  // Gola Yoga  –  all planets in 1 house
  if (occupiedHouses.length === 1) results.push({ id: 'gola', category: 'other', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Gola Yoga', hi: 'गोल योग', sa: 'गोलयोगः' }, formationRule: { en: 'All planets in a single house', hi: 'सभी ग्रह एक ही भाव में', sa: '' }, description: { en: 'Sphere pattern  –  extremely rare, all energies concentrated. Can produce either extraordinary power or great hardship depending on the sign.', hi: 'गोल पैटर्न  –  अत्यंत दुर्लभ, सभी ऊर्जा एकत्रित।', sa: '' } });

  // Rajju Yoga  –  all planets in movable signs
  const allMovable = planets.filter(p => p.id <= 6).every(p => [1, 4, 7, 10].includes(p.sign));
  if (allMovable) results.push({ id: 'rajju', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Rajju Yoga', hi: 'रज्जु योग', sa: 'रज्जुयोगः' }, formationRule: { en: 'All planets in movable (cardinal) signs', hi: 'सभी ग्रह चर राशियों में', sa: '' }, description: { en: 'Rope pattern  –  love of travel, restless energy, pioneering spirit, frequent changes in life, entrepreneurial.', hi: 'रज्जु पैटर्न  –  यात्रा प्रेम, अग्रणी भावना, बार-बार परिवर्तन।', sa: '' } });

  // Musala Yoga  –  all planets in fixed signs
  const allFixed = planets.filter(p => p.id <= 6).every(p => [2, 5, 8, 11].includes(p.sign));
  if (allFixed) results.push({ id: 'musala', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Musala Yoga', hi: 'मूसल योग', sa: 'मूसलयोगः' }, formationRule: { en: 'All planets in fixed signs', hi: 'सभी ग्रह स्थिर राशियों में', sa: '' }, description: { en: 'Pestle pattern  –  steadfast nature, wealth accumulation, stubbornness, pride, fame through persistence.', hi: 'मूसल पैटर्न  –  दृढ़ स्वभाव, धन संचय, हठ, प्रसिद्धि।', sa: '' } });

  // Nala Yoga  –  all planets in dual signs
  const allDual = planets.filter(p => p.id <= 6).every(p => [3, 6, 9, 12].includes(p.sign));
  if (allDual) results.push({ id: 'nala', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Nala Yoga', hi: 'नल योग', sa: 'नलयोगः' }, formationRule: { en: 'All planets in dual (mutable) signs', hi: 'सभी ग्रह द्विस्वभाव राशियों में', sa: '' }, description: { en: 'Reed pattern  –  skilled communicator, adaptable, intellectual, good at crafts and arts, but may lack consistency.', hi: 'नल पैटर्न  –  कुशल संवाहक, अनुकूलनीय, बुद्धिमान, कला में निपुण।', sa: '' } });

  // Chakra Yoga  –  planets distributed in all even houses (2,4,6,8,10,12)
  const allEvenHouses = planets.filter(p => p.id <= 6).every(p => p.house % 2 === 0);
  if (allEvenHouses) results.push({ id: 'chakra', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Chakra Yoga', hi: 'चक्र योग', sa: 'चक्रयोगः' }, formationRule: { en: 'All planets in even-numbered houses', hi: 'सभी ग्रह सम भावों में', sa: '' }, description: { en: 'Wheel pattern  –  commands authority like a king, magnetic personality, ability to attract followers and wealth.', hi: 'चक्र पैटर्न  –  राजा जैसा अधिकार, चुंबकीय व्यक्तित्व।', sa: '' } });

  // Samudra Yoga  –  planets in all odd houses
  const allOddHouses = planets.filter(p => p.id <= 6).every(p => p.house % 2 === 1);
  if (allOddHouses) results.push({ id: 'samudra', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Samudra Yoga', hi: 'समुद्र योग', sa: 'समुद्रयोगः' }, formationRule: { en: 'All planets in odd-numbered houses', hi: 'सभी ग्रह विषम भावों में', sa: '' }, description: { en: 'Ocean pattern  –  wealth like the sea, prosperous and charitable, enjoys all comforts, loved by many.', hi: 'समुद्र पैटर्न  –  सागर जैसा धन, समृद्ध और दानशील।', sa: '' } });

  return results;
}

// ---------------------------------------------------------------------------
// Parivartana Yoga sub-types (Mutual exchange  –  BPHS)
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
          results.push({ id: `maha_parivartana_${h1}_${h2}`, category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: `Maha Parivartana Yoga (H${h1}↔H${h2})`, hi: `महा परिवर्तन योग (भ${h1}↔भ${h2})`, sa: '' }, formationRule: { en: `Lords of houses ${h1} and ${h2} exchange  –  both in kendra/trikona`, hi: `भाव ${h1} व ${h2} के स्वामी परस्पर  –  दोनों केंद्र/त्रिकोण में`, sa: '' }, description: { en: 'Maha (great) exchange between auspicious houses  –  powerful Raja Yoga, mutual enhancement, brings fame, authority, and fortune.', hi: 'शुभ भावों का महा परिवर्तन  –  शक्तिशाली राजयोग, यश, अधिकार और सौभाग्य।', sa: '' } });
        } else if (hasDusthana) {
          results.push({ id: `dainya_parivartana_${h1}_${h2}`, category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: `Dainya Parivartana (H${h1}↔H${h2})`, hi: `दैन्य परिवर्तन (भ${h1}↔भ${h2})`, sa: '' }, formationRule: { en: `Lords of houses ${h1} and ${h2} exchange  –  involves dusthana`, hi: `भाव ${h1} व ${h2} के स्वामी परस्पर  –  दुःस्थान सम्मिलित`, sa: '' }, description: { en: 'Dainya (miserable) exchange involving 6th/8th/12th  –  challenges from the dusthana affect the good house. Struggles with health, debts, or losses.', hi: 'दैन्य परिवर्तन 6/8/12 भाव  –  कठिनाइयाँ, स्वास्थ्य/ऋण/हानि।', sa: '' } });
        } else {
          results.push({ id: `khala_parivartana_${h1}_${h2}`, category: 'other', isAuspicious: false, present: true, strength: 'Weak', name: { en: `Khala Parivartana (H${h1}↔H${h2})`, hi: `खल परिवर्तन (भ${h1}↔भ${h2})`, sa: '' }, formationRule: { en: `Lords of houses ${h1} and ${h2} exchange  –  mixed houses`, hi: `भाव ${h1} व ${h2} के स्वामी परस्पर  –  मिश्रित भाव`, sa: '' }, description: { en: 'Khala (wicked) exchange  –  mixed results, one house benefits at the expense of the other. Uneven fortune.', hi: 'खल परिवर्तन  –  मिश्रित परिणाम, एक भाव लाभान्वित दूसरे की कीमत पर।', sa: '' } });
        }
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Daridra (Poverty) Yogas  –  BPHS Ch.41
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
    results.push({ id: 'daridra_11_dusthana', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Daridra Yoga (11th Lord)', hi: 'दरिद्र योग (11 स्वामी)', sa: '' }, formationRule: { en: `${GRAHA_EN[lord11.id]} (lord of 11th) in ${lord11.house}th house (dusthana)`, hi: `${GRAHA_HI[lord11.id]} (11वें का स्वामी) ${lord11.house}वें भाव में (दुःस्थान)`, sa: '' }, description: { en: `${GRAHA_EN[lord11.id]}  –  lord of gains  –  placed in house of loss/debt/enemies. Income blocked, financial struggles despite effort, money slips through fingers.`, hi: `${GRAHA_HI[lord11.id]}  –  लाभ का स्वामी  –  हानि/ऋण/शत्रु भाव में। आय अवरुद्ध, प्रयासों के बावजूद वित्तीय संघर्ष।`, sa: '' } });
  }

  // Lord of 2nd in 6th/8th/12th = family wealth diminished
  const lord2 = getP(planets, houseLords[2]);
  if (DUSTHANA.includes(lord2.house)) {
    results.push({ id: 'daridra_2_dusthana', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Daridra Yoga (2nd Lord)', hi: 'दरिद्र योग (2 स्वामी)', sa: '' }, formationRule: { en: `${GRAHA_EN[lord2.id]} (lord of 2nd) in ${lord2.house}th house (dusthana)`, hi: `${GRAHA_HI[lord2.id]} (2वें का स्वामी) ${lord2.house}वें भाव में`, sa: '' }, description: { en: `${GRAHA_EN[lord2.id]}  –  lord of family/wealth  –  placed in dusthana. Family assets dissipated, difficulty saving, poor early financial conditions.`, hi: `${GRAHA_HI[lord2.id]}  –  परिवार/धन का स्वामी  –  दुःस्थान में। पारिवारिक संपत्ति क्षीण, बचत में कठिनाई।`, sa: '' } });
  }

  // Lords of 2nd and 11th both debilitated
  if (getP(planets, houseLords[2]).isDebilitated && getP(planets, houseLords[11]).isDebilitated) {
    results.push({ id: 'daridra_double_debil', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Severe Daridra Yoga', hi: 'तीव्र दरिद्र योग', sa: '' }, formationRule: { en: 'Lords of 2nd and 11th both debilitated', hi: '2 व 11 स्वामी दोनों नीच', sa: '' }, description: { en: 'Both wealth lords debilitated  –  chronic financial difficulties, poverty despite intelligence, may require support from others.', hi: 'दोनों धन स्वामी नीच  –  दीर्घकालिक वित्तीय कठिनाइयाँ।', sa: '' } });
  }

  // Saturn + Mars conjunct in 2nd or 11th
  const sat = getP(planets, 6); const mars = getP(planets, 2);
  if (inSameHouse(sat, mars) && [2, 11].includes(sat.house)) {
    results.push({ id: 'daridra_sat_mars', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Daridra (Saturn-Mars in Wealth)', hi: 'दरिद्र (शनि-मंगल धन भाव)', sa: '' }, formationRule: { en: `Saturn + Mars conjunct in ${sat.house}th house`, hi: `शनि + मंगल ${sat.house}वें भाव में युत`, sa: '' }, description: { en: 'Two malefics combining in wealth houses  –  financial setbacks through aggression, accidents, or legal issues. Money earned but lost quickly.', hi: 'दो पाप ग्रह धन भावों में  –  आक्रामकता, दुर्घटना या कानूनी मुद्दों से वित्तीय हानि।', sa: '' } });
  }

  // Rahu in 2nd without benefic aspect
  const rahu = getP(planets, 7);
  if (rahu.house === 2 && !planets.some(p => isBenefic(p.id) && [2, 6, 8, 12].includes(houseOffset(p.house, 2)))) {
    results.push({ id: 'daridra_rahu_2nd', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Daridra (Rahu in 2nd)', hi: 'दरिद्र (राहु द्वितीय)', sa: '' }, formationRule: { en: 'Rahu in 2nd house without benefic influence', hi: 'राहु 2वें भाव में बिना शुभ प्रभाव', sa: '' }, description: { en: 'Rahu in family/wealth house  –  unconventional or unstable finances, deception around money, family discord, harsh speech.', hi: 'राहु धन भाव में  –  अस्थिर वित्त, धन के आसपास छल, पारिवारिक कलह।', sa: '' } });
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

  // NOTE: Shakata Yoga (id='shakata') is detected in detectMoonBasedYogas().
  // It was previously duplicated here with the Moon-from-Jupiter direction
  // (complementary to Jupiter-from-Moon in the canonical version). The two
  // directions are equivalent for the same conjunction, so this duplicate
  // produced two 'shakata' entries in the merged yoga list.  REMOVED.

  // Amala Yoga  –  benefic in 10th from Moon
  const tenthFromMoon = ((moon.house + 8) % 12) + 1;
  const beneficIn10th = planets.filter(p => p.house === tenthFromMoon && isBenefic(p.id));
  if (beneficIn10th.length > 0) {
    results.push({ id: 'amala', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Amala Yoga', hi: 'अमल योग', sa: 'अमलयोगः' }, formationRule: { en: `Benefic (${beneficIn10th.map(p => ['Sun','Moon','Mars','Mer','Jup','Ven','Sat','Rah','Ket'][p.id]).join(', ')}) in 10th from Moon`, hi: `शुभ ग्रह चंद्र से 10वें भाव में`, sa: '' }, description: { en: 'Spotless/pure yoga  –  unblemished reputation, ethical character, lasting fame through virtuous deeds, respected career.', hi: 'निर्मल योग  –  निष्कलंक प्रतिष्ठा, नैतिक चरित्र, सद्गुणों से यश।', sa: '' } });
  }

  // Pushkala Yoga  –  REMOVED duplicate.
  // Correct detection is in detectRajaYogas() at id='pushkala' (Phaladeepika rule).
  // This simplified Moon+Venus version was wrong and produced duplicate entries.

  // Chandra-Mangal Yoga  –  REMOVED duplicate.
  // Correct detection (conjunction + mutual 7th aspect) is in detectMoonBasedYogas() at id='chandra_mangala'.

  // Saraswati Yoga  –  REMOVED duplicate.
  // Correct detection (with Jupiter dignity check) is in detectAdditionalAuspiciousYogas() at id='saraswati'.

  // Lakshmi Yoga  –  REMOVED duplicate.
  // The correct detection (9th lord in own/exalted in kendra/trikona) is in
  // detectRajaYogas() at id='lakshmi'. This simplified version fired whenever
  // Jupiter was exalted/own in kendra, regardless of whether Jupiter was
  // actually the 9th lord  –  producing false positives and duplicate entries.

  // Durdhura Yoga  –  REMOVED duplicate.
  // Correct detection is in detectMoonBasedYogas() at id='durdhara'.

  // Sunapha Yoga  –  REMOVED duplicate.
  // Correct detection is in detectMoonBasedYogas() at id='sunapha'.

  // Anapha Yoga  –  REMOVED duplicate.
  // Correct detection is in detectMoonBasedYogas() at id='anapha'.

  // Vasumati Yoga  –  REMOVED duplicate.
  // Correct detection is in detectRajaYogas() at id='vasumati'.

  // Chandradhi Yoga  –  benefics in 6th, 7th, 8th from Moon
  const b6 = planets.filter(p => isBenefic(p.id) && houseOffset(moon.house, p.house) === 6);
  const b7 = planets.filter(p => isBenefic(p.id) && houseOffset(moon.house, p.house) === 7);
  const b8 = planets.filter(p => isBenefic(p.id) && houseOffset(moon.house, p.house) === 8);
  if (b6.length > 0 && b7.length > 0 && b8.length > 0) {
    results.push({ id: 'chandradhi', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Chandradhi Yoga', hi: 'चंद्राधि योग', sa: 'चन्द्राधियोगः' }, formationRule: { en: 'Benefics in 6th, 7th, and 8th from Moon', hi: 'शुभ ग्रह चंद्र से 6, 7, 8 में', sa: '' }, description: { en: 'Moon-supremacy yoga  –  minister or leader, polite and trustworthy, defeats enemies, excellent health, long life.', hi: 'चंद्राधि योग  –  मंत्री या नेता, विनम्र और विश्वसनीय, शत्रुओं पर विजय।', sa: '' } });
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

  // Budha-Aditya Yoga  –  Sun + Mercury conjunction (already may exist but with stronger rules)
  if (inSameHouse(sun, mercury) && Math.abs(sun.longitude - mercury.longitude) > 5) {
    // Only when Mercury is NOT combust (>5° from Sun)
    results.push({ id: 'budha_aditya_strong', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Budha-Aditya Yoga (Strong)', hi: 'बुधादित्य योग (बलवान)', sa: '' }, formationRule: { en: 'Sun + Mercury conjunct, Mercury >5° from Sun', hi: 'सूर्य + बुध युत, बुध सूर्य से >5° दूर', sa: '' }, description: { en: 'Strong version  –  Mercury far enough from Sun to avoid combustion. Sharp intellect, administrative ability, fame through knowledge.', hi: 'बलवान बुधादित्य  –  बुध अस्त नहीं। तीक्ष्ण बुद्धि, प्रशासनिक क्षमता।', sa: '' } });
  }

  // Guru-Mangal Yoga  –  Jupiter + Mars conjunction
  if (inSameHouse(jupiter, mars)) {
    results.push({ id: 'guru_mangal', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Guru-Mangal Yoga', hi: 'गुरु-मंगल योग', sa: 'गुरुमङ्गलयोगः' }, formationRule: { en: 'Jupiter conjunct Mars', hi: 'गुरु-मंगल युति', sa: '' }, description: { en: 'Wisdom + action combined  –  courageous yet righteous, military/police leadership, land ownership, brothers prosper.', hi: 'गुरु-मंगल योग  –  विवेक + कर्म, साहसी पर धार्मिक, भूमि स्वामित्व।', sa: '' } });
  }

  // Nipuna Yoga  –  Mercury + Sun + Moon in same sign or Mercury in own/exalted sign aspected by Moon
  if (inSameHouse(mercury, moon) && inSameHouse(mercury, sun)) {
    results.push({ id: 'nipuna', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Nipuna Yoga', hi: 'निपुण योग', sa: 'निपुणयोगः' }, formationRule: { en: 'Sun + Moon + Mercury in same house', hi: 'सूर्य + चंद्र + बुध एक भाव में', sa: '' }, description: { en: 'Skilled/expert yoga  –  exceptional craftsman, skilled in multiple fields, quick learner, proficient communicator.', hi: 'निपुण योग  –  असाधारण कारीगर, बहु-क्षेत्रीय कौशल, तेज शिक्षार्थी।', sa: '' } });
  }

  // Chamara Yoga  –  Lagna lord exalted in kendra aspected by Jupiter
  const lagnaLord = signLord(ascSign);
  const lagnaP = getP(planets, lagnaLord);
  if (lagnaP.isExalted && KENDRA.includes(lagnaP.house)) {
    results.push({ id: 'chamara', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Chamara Yoga', hi: 'चामर योग', sa: 'चामरयोगः' }, formationRule: { en: 'Lagna lord exalted in kendra', hi: 'लग्नेश उच्च केंद्र में', sa: '' }, description: { en: 'Royal fan yoga  –  oratory skill, royal patronage, commanding presence, long-lived, eloquent, learned, famous.', hi: 'चामर योग  –  वक्तृत्व कला, राजकीय संरक्षण, आज्ञाकारी उपस्थिति।', sa: '' } });
  }

  // Akhanda Samrajya Yoga  –  Jupiter as lord of 2nd/5th/11th + in kendra from Moon
  const jupLordOfHouses: number[] = [];
  for (let h = 1; h <= 12; h++) {
    const signOfHouse = ((ascSign - 1 + h - 1) % 12) + 1;
    if (signLord(signOfHouse) === 4) jupLordOfHouses.push(h);
  }
  const jupInKendraFromMoon = KENDRA.includes(houseOffset(moon.house, jupiter.house));
  if (jupLordOfHouses.some(h => [2, 5, 11].includes(h)) && jupInKendraFromMoon) {
    results.push({ id: 'akhanda_samrajya', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Akhanda Samrajya Yoga', hi: 'अखंड साम्राज्य योग', sa: 'अखण्डसाम्राज्ययोगः' }, formationRule: { en: 'Jupiter lords 2nd/5th/11th and is in kendra from Moon', hi: 'गुरु 2/5/11 स्वामी + चंद्र से केंद्र में', sa: '' }, description: { en: 'Undivided empire yoga  –  vast authority, territory expands, power remains unchallenged, great fame across regions.', hi: 'अखंड साम्राज्य योग  –  विशाल अधिकार, अविवादित शक्ति, व्यापक यश।', sa: '' } });
  }

  // Kahala Yoga  –  REMOVED duplicate.
  // Correct detection is in detectRajaYogas() at id='kahala'.

  // Shankha Yoga  –  REMOVED duplicate.
  // Correct detection is in detectRajaYogas() at id='shankha'.

  // Bheri Yoga  –  REMOVED duplicate.
  // Correct detection (BPHS Ch.36: lagna lord, Jupiter, Venus in mutual kendras + 9th lord strong)
  // is in detectRajaYogas() at id='bheri'.

  // Veshi Yoga  –  already detected in the main sun-based yoga section (id: 'veshi').
  // We still compute planetIn2ndFromSun because Ubhayachari Yoga needs it below.
  const secondFromSun = (sun.house % 12) + 1;
  const planetIn2ndFromSun = planets.filter(p => p.id !== 1 && p.id >= 2 && p.id <= 6 && p.house === secondFromSun);

  // Voshi Yoga  –  planet (not Moon) in 12th from Sun
  const twelfthFromSun = ((sun.house - 2 + 12) % 12) + 1;
  const planetIn12thFromSun = planets.filter(p => p.id !== 1 && p.id >= 2 && p.id <= 6 && p.house === twelfthFromSun);
  if (planetIn12thFromSun.length > 0) {
    const pNames = planetIn12thFromSun.map(p => ['','','Mars','Mer','Jup','Ven','Sat'][p.id]).join(', ');
    results.push({ id: 'voshi', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Voshi Yoga', hi: 'वोशी योग', sa: 'वोशीयोगः' }, formationRule: { en: `${pNames} in 12th from Sun`, hi: `${pNames} सूर्य से 12वें में`, sa: '' }, description: { en: 'Planet behind Sun  –  skilled, charitable, learned, good at writing and communication.', hi: 'वोशी योग  –  कुशल, दानी, विद्वान, लेखन में निपुण।', sa: '' } });
  }

  // Ubhayachari Yoga  –  planets in both 2nd and 12th from Sun (not Moon, not Rahu/Ketu)
  if (planetIn2ndFromSun.length > 0 && planetIn12thFromSun.length > 0) {
    results.push({ id: 'ubhayachari', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Ubhayachari Yoga', hi: 'उभयचारी योग', sa: 'उभयचारीयोगः' }, formationRule: { en: 'Planets in both 2nd and 12th from Sun', hi: 'सूर्य से 2वें और 12वें दोनों में ग्रह', sa: '' }, description: { en: 'Sun flanked by planets  –  king-like personality, eloquent speaker, extremely handsome, strong-bodied, wealthy.', hi: 'उभयचारी योग  –  राजा जैसा व्यक्तित्व, वक्ता, धनवान, बलवान।', sa: '' } });
  }

  // Chaturmukha Yoga  –  benefics in all 4 kendras
  const kendraWithBenefics = KENDRA.filter(k => planets.some(p => p.house === k && isBenefic(p.id)));
  if (kendraWithBenefics.length === 4) {
    results.push({ id: 'chaturmukha', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Chaturmukha Yoga', hi: 'चतुर्मुख योग', sa: 'चतुर्मुखयोगः' }, formationRule: { en: 'Benefic planet in each of 4 kendras (1,4,7,10)', hi: 'प्रत्येक 4 केंद्र में शुभ ग्रह', sa: '' }, description: { en: 'Four-faced (Brahma) yoga  –  supremely fortunate, long life over 96 years, fame spreading in all directions, devotion to dharma.', hi: 'चतुर्मुख योग  –  अत्यंत भाग्यशाली, 96+ वर्ष आयु, चारों दिशाओं में यश।', sa: '' } });
  }

  // Kala Amrita Yoga  –  all planets between Moon and Sun axis
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
    results.push({ id: 'kala_amrita', category: 'other', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Kala Amrita Yoga', hi: 'काल अमृत योग', sa: 'कालामृतयोगः' }, formationRule: { en: 'All planets between Sun-Moon axis', hi: 'सभी ग्रह सूर्य-चंद्र अक्ष में', sa: '' }, description: { en: 'Time-nectar yoga  –  all planets contained within Sun-Moon arc. Focused energy, spiritual potential, destined for meaningful achievements.', hi: 'काल अमृत योग  –  सभी ग्रह सूर्य-चंद्र चाप में। केंद्रित ऊर्जा, आध्यात्मिक क्षमता।', sa: '' } });
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

  // Balarishta  –  Moon in 6/8/12 aspected by malefic, no benefic aspect
  if (DUSTHANA.includes(moon.house)) {
    const maleficAspects = planets.filter(p => isMalefic(p.id) && houseOffset(p.house, moon.house) === 7);
    if (maleficAspects.length > 0) {
      results.push({ id: 'balarishta_moon', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Balarishta (Moon Affliction)', hi: 'बालारिष्ट (चंद्र पीड़ा)', sa: '' }, formationRule: { en: `Moon in ${moon.house}th house aspected by malefic`, hi: `चंद्र ${moon.house}वें भाव में पाप दृष्ट`, sa: '' }, description: { en: 'Childhood danger yoga  –  health challenges in early life, need for extra care in infancy and childhood. Jupiter aspect can cancel.', hi: 'बालारिष्ट  –  बाल्यकाल में स्वास्थ्य चुनौतियाँ, शैशव में अतिरिक्त देखभाल आवश्यक।', sa: '' } });
    }
  }

  // Mrityu Yoga  –  Lord of 8th in lagna + afflicted
  const lord8Id = signLord(((ascSign - 1 + 7) % 12) + 1);
  const lord8 = getP(planets, lord8Id);
  if (lord8.house === 1 && (inSameHouse(lord8, getP(planets, 6)) || inSameHouse(lord8, getP(planets, 2)))) {
    results.push({ id: 'mrityu_yoga', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Mrityu Yoga', hi: 'मृत्यु योग', sa: '' }, formationRule: { en: '8th lord in lagna conjunct malefic', hi: '8 स्वामी लग्न में पाप ग्रह युत', sa: '' }, description: { en: 'Danger yoga  –  health vulnerabilities, accident-prone periods, needs careful attention during 8th lord dasha. Remedial measures recommended.', hi: 'मृत्यु योग  –  स्वास्थ्य कमजोरी, दुर्घटना प्रवण काल, उपचार अनुशंसित।', sa: '' } });
  }

  // Alpayu Yoga  –  malefics in 1st and 7th, no benefic aspect
  const malIn1 = planets.filter(p => p.house === 1 && isMalefic(p.id));
  const malIn7 = planets.filter(p => p.house === 7 && isMalefic(p.id));
  if (malIn1.length > 0 && malIn7.length > 0) {
    results.push({ id: 'alpayu', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Alpayu Yoga', hi: 'अल्पायु योग', sa: '' }, formationRule: { en: 'Malefics in both 1st and 7th houses', hi: 'पाप ग्रह 1 और 7 दोनों भावों में', sa: '' }, description: { en: 'Short-life indicator  –  malefics on ascendant axis. Health consciousness essential. Jupiter aspect or strong lagna lord can mitigate significantly.', hi: 'अल्पायु  –  लग्न अक्ष पर पाप ग्रह। स्वास्थ्य जागरूकता आवश्यक।', sa: '' } });
  }

  // Roga Yoga  –  Lord of lagna in 6th + 6th lord in lagna
  const lagnaLordId = signLord(ascSign);
  const lord6Id = signLord(((ascSign - 1 + 5) % 12) + 1);
  const lagnaP = getP(planets, lagnaLordId);
  const lord6P = getP(planets, lord6Id);
  if (lagnaP.house === 6 && lord6P.house === 1) {
    results.push({ id: 'roga', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Roga Yoga', hi: 'रोग योग', sa: '' }, formationRule: { en: 'Lagna lord in 6th and 6th lord in 1st (exchange)', hi: 'लग्नेश 6वें में व 6 स्वामी 1 में (परिवर्तन)', sa: '' }, description: { en: 'Disease yoga  –  constitutional health challenges, chronic conditions, but the exchange also gives ability to fight disease.', hi: 'रोग योग  –  शारीरिक स्वास्थ्य चुनौतियाँ, दीर्घकालिक स्थितियाँ।', sa: '' } });
  }

  // Bandhana Yoga  –  Rahu + Saturn + Mars all in kendra/trikona
  if ([...KENDRA, ...TRIKONA].includes(rahu.house) && [...KENDRA, ...TRIKONA].includes(saturn.house) && [...KENDRA, ...TRIKONA].includes(mars.house)) {
    if (inSameHouse(rahu, saturn) || inSameHouse(rahu, mars) || inSameHouse(saturn, mars)) {
      results.push({ id: 'bandhana', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Bandhana Yoga', hi: 'बंधन योग', sa: '' }, formationRule: { en: 'Rahu, Saturn, Mars conjunct or in kendra/trikona', hi: 'राहु, शनि, मंगल केंद्र/त्रिकोण में युत', sa: '' }, description: { en: 'Imprisonment/bondage yoga  –  restriction of freedom, legal entanglements, confinement. Can manifest as feeling trapped in life circumstances.', hi: 'बंधन योग  –  स्वतंत्रता का प्रतिबंध, कानूनी उलझन।', sa: '' } });
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

  // Shiva Yoga  –  Sun + Moon + Jupiter conjunction
  if (inSameHouse(sun, moon) && inSameHouse(sun, jupiter)) {
    results.push({ id: 'shiva_yoga', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Shiva Yoga', hi: 'शिव योग', sa: 'शिवयोगः' }, formationRule: { en: 'Sun + Moon + Jupiter conjunct', hi: 'सूर्य + चंद्र + गुरु युत', sa: '' }, description: { en: 'Trident energy of consciousness  –  supreme spiritual authority, blessed by divine grace, teacher of teachers, regal bearing with compassion.', hi: 'शिव योग  –  सर्वोच्च आध्यात्मिक अधिकार, दिव्य कृपा, गुरुओं के गुरु।', sa: '' } });
  }

  // Gaja Kesari Yoga (strict)  –  Jupiter in kendra from Moon + not combust
  const jupFromMoon = houseOffset(moon.house, jupiter.house);
  if ([1, 4, 7, 10].includes(jupFromMoon) && !jupiter.isDebilitated) {
    // Check it's not just weak conjunction  –  already have basic version, make this strict version
    if (jupiter.isExalted || jupiter.isOwnSign) {
      results.push({ id: 'gaja_kesari_strong', category: 'raja', isAuspicious: true, present: true, strength: 'Strong', name: { en: 'Gaja Kesari Yoga (Strong)', hi: 'गजकेसरी योग (बलवान)', sa: '' }, formationRule: { en: 'Jupiter in kendra from Moon + exalted/own sign', hi: 'गुरु चंद्र से केंद्र + उच्च/स्वराशि', sa: '' }, description: { en: 'Strongest form of Gaja Kesari  –  elephant-lion power with Jupiter dignified. Exceptional leadership, wisdom, and lasting fame across generations.', hi: 'गजकेसरी बलवान  –  गुरु सम्मानित, असाधारण नेतृत्व, पीढ़ियों में यश।', sa: '' } });
    }
  }

  // Grahan Yoga  –  Sun/Moon conjunct Rahu/Ketu
  if (inSameHouse(sun, rahu) || inSameHouse(sun, ketu)) {
    results.push({ id: 'surya_grahan', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Surya Grahan Yoga', hi: 'सूर्य ग्रहण योग', sa: '' }, formationRule: { en: 'Sun conjunct Rahu/Ketu', hi: 'सूर्य राहु/केतु युत', sa: '' }, description: { en: 'Solar eclipse yoga  –  father/authority issues, ego challenges, government obstacles. But can give research ability and occult knowledge.', hi: 'सूर्य ग्रहण  –  पिता/अधिकार मुद्दे, अहंकार चुनौतियाँ, सरकारी बाधाएँ।', sa: '' } });
  }
  if (inSameHouse(moon, rahu) || inSameHouse(moon, ketu)) {
    results.push({ id: 'chandra_grahan', category: 'inauspicious', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Chandra Grahan Yoga', hi: 'चंद्र ग्रहण योग', sa: '' }, formationRule: { en: 'Moon conjunct Rahu/Ketu', hi: 'चंद्र राहु/केतु युत', sa: '' }, description: { en: 'Lunar eclipse yoga  –  emotional turbulence, mother health concerns, anxiety patterns. Strong intuition and psychic ability as positive side.', hi: 'चंद्र ग्रहण  –  भावनात्मक अशांति, माता स्वास्थ्य चिंता, पर तीव्र अंतर्ज्ञान।', sa: '' } });
  }

  // Guru Chandal Yoga  –  Jupiter + Rahu conjunction
  if (inSameHouse(jupiter, rahu)) {
    results.push({ id: 'guru_chandal', category: 'dosha', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Guru Chandal Yoga', hi: 'गुरु चांडाल योग', sa: 'गुरुचाण्डालयोगः' }, formationRule: { en: 'Jupiter conjunct Rahu', hi: 'गुरु-राहु युति', sa: '' }, description: { en: 'Teacher-outcast yoga  –  unorthodox beliefs, challenges with gurus/teachers, unconventional wisdom. May reject traditional religion but find spiritual truth independently.', hi: 'गुरु चांडाल  –  अपरंपरागत विश्वास, गुरुओं से चुनौतियाँ, स्वतंत्र आध्यात्मिक सत्य।', sa: '' } });
  }

  // Angarak Yoga  –  Mars + Rahu conjunction
  if (inSameHouse(mars, rahu)) {
    results.push({ id: 'angarak', category: 'dosha', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Angarak Yoga', hi: 'अंगारक योग', sa: 'अङ्गारकयोगः' }, formationRule: { en: 'Mars conjunct Rahu', hi: 'मंगल-राहु युति', sa: '' }, description: { en: 'Fire-coal yoga  –  explosive anger, accidents, litigation, surgery risk. But also extraordinary courage, technical brilliance, and ability to overcome impossible odds.', hi: 'अंगारक  –  विस्फोटक क्रोध, दुर्घटनाएँ, पर असाधारण साहस और तकनीकी प्रतिभा।', sa: '' } });
  }

  // Shani-Rahu conjunction (Shrapit Dosha variant)
  if (inSameHouse(saturn, rahu)) {
    results.push({ id: 'shani_rahu', category: 'dosha', isAuspicious: false, present: true, strength: 'Strong', name: { en: 'Shani-Rahu Yoga', hi: 'शनि-राहु योग', sa: '' }, formationRule: { en: 'Saturn conjunct Rahu', hi: 'शनि-राहु युति', sa: '' }, description: { en: 'Chronic delays, fear, anxiety. Past-life karmic debt manifesting as obstacles. But intense perseverance and eventual breakthrough after age 36.', hi: 'शनि-राहु  –  दीर्घकालिक विलंब, भय, चिंता, पर 36 के बाद सफलता।', sa: '' } });
  }

  // Venus-Saturn conjunction  –  delayed love/marriage
  if (inSameHouse(venus, saturn)) {
    results.push({ id: 'shukra_shani', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Shukra-Shani Yoga', hi: 'शुक्र-शनि योग', sa: '' }, formationRule: { en: 'Venus conjunct Saturn', hi: 'शुक्र-शनि युति', sa: '' }, description: { en: 'Delayed romance, late marriage, but deeply loyal and lasting relationships. Artistic talent with disciplined execution  –  craft mastery.', hi: 'शुक्र-शनि  –  विलंबित विवाह, पर गहरे वफादार संबंध, कला में निपुणता।', sa: '' } });
  }

  // Jupiter-Venus conjunction  –  Guru-Shukra Yoga
  if (inSameHouse(jupiter, venus)) {
    results.push({ id: 'guru_shukra', category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: 'Guru-Shukra Yoga', hi: 'गुरु-शुक्र योग', sa: '' }, formationRule: { en: 'Jupiter conjunct Venus', hi: 'गुरु-शुक्र युति', sa: '' }, description: { en: 'Great benefic conjunction  –  wealth + wisdom combined, patronage of arts, generous and beautiful life, but may indicate conflict between spiritual and material desires.', hi: 'गुरु-शुक्र  –  धन + ज्ञान, कला संरक्षण, उदार और सुंदर जीवन।', sa: '' } });
  }

  // Mars-Saturn conjunction  –  disciplined warrior
  if (inSameHouse(mars, saturn)) {
    results.push({ id: 'mars_saturn', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Yama Yoga (Mars-Saturn)', hi: 'यम योग (मंगल-शनि)', sa: '' }, formationRule: { en: 'Mars conjunct Saturn', hi: 'मंगल-शनि युति', sa: '' }, description: { en: 'God of death energy  –  intense discipline or destructive frustration. Can excel in surgery, engineering, military, mining. Needs physical outlet for energy.', hi: 'यम योग  –  तीव्र अनुशासन, शल्यक्रिया/इंजीनियरिंग/सेना में उत्कृष्ट।', sa: '' } });
  }

  // Sun-Saturn conjunction  –  father issues but authority
  if (inSameHouse(sun, saturn)) {
    results.push({ id: 'sun_saturn', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Pitr-Shani Yoga', hi: 'पितृ-शनि योग', sa: '' }, formationRule: { en: 'Sun conjunct Saturn', hi: 'सूर्य-शनि युति', sa: '' }, description: { en: 'Father-son tension  –  struggles with authority figures, delayed recognition, but eventual rise through hard work. Government career after initial obstacles.', hi: 'पितृ-शनि  –  अधिकारियों से संघर्ष, विलंबित मान्यता, पर कठिन परिश्रम से उत्थान।', sa: '' } });
  }

  // 5+ planets in one house  –  Sannyasa Yoga tendency
  for (let h = 1; h <= 12; h++) {
    const planetsInH = planets.filter(p => p.id <= 6 && p.house === h);
    if (planetsInH.length >= 4) {
      results.push({ id: `stellium_h${h}`, category: 'other', isAuspicious: true, present: true, strength: planetsInH.length >= 5 ? 'Strong' : 'Moderate', name: { en: `Stellium in House ${h}`, hi: `${h}वें भाव में स्टेलियम`, sa: '' }, formationRule: { en: `${planetsInH.length} planets in house ${h}`, hi: `${planetsInH.length} ग्रह ${h}वें भाव में`, sa: '' }, description: { en: `Heavy concentration of energy in house ${h}  –  this life area dominates the chart. Extraordinary focus but potential imbalance with neglected areas.`, hi: `भाव ${h} में ऊर्जा का भारी संकेंद्रण  –  यह जीवन क्षेत्र चार्ट पर हावी।`, sa: '' } });
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
    results.push({ id: 'tri_vakri', category: 'other', isAuspicious: false, present: true, strength: 'Moderate', name: { en: 'Tri-Vakri Yoga', hi: 'त्रि-वक्री योग', sa: '' }, formationRule: { en: `${retroCount} planets retrograde at birth`, hi: `जन्म पर ${retroCount} ग्रह वक्री`, sa: '' }, description: { en: 'Multiple retrograde planets  –  internalized energy, delayed results, unconventional life path. Karmic intensity from past lives.', hi: 'अनेक वक्री ग्रह  –  आंतरिक ऊर्जा, विलंबित परिणाम, अपरंपरागत जीवन पथ।', sa: '' } });
  }

  // Retrograde benefic in kendra = hidden strength
  for (const pid of [3, 4, 5]) {
    const p = getP(planets, pid);
    if (p.isRetrograde && [1,4,7,10].includes(p.house)) {
      results.push({ id: `vakri_${['','','','merc','jup','ven'][pid]}_kendra`, category: 'other', isAuspicious: true, present: true, strength: 'Moderate', name: { en: `Vakri ${['','','','Mercury','Jupiter','Venus'][pid]} in Kendra`, hi: `वक्री ${['','','','बुध','गुरु','शुक्र'][pid]} केंद्र में`, sa: '' }, formationRule: { en: `Retrograde ${['','','','Mercury','Jupiter','Venus'][pid]} in house ${p.house}`, hi: '', sa: '' }, description: { en: 'Retrograde benefic in angular house  –  intensified inner power, unconventional but deep wisdom/beauty/skill.', hi: 'वक्री शुभ केंद्र में  –  तीव्र आंतरिक शक्ति।', sa: '' } });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Nabhasa Akriti Yogas  –  Geometric shape patterns (BPHS Ch.35 expanded)
// ---------------------------------------------------------------------------

function detectNabhasaAkritiYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const seven = planets.filter(p => p.id <= 6);
  const sevenHouses = seven.map(p => p.house);
  const houseSet = new Set(sevenHouses);
  const beneficPlanets = seven.filter(p => isBenefic(p.id));
  const maleficPlanets = seven.filter(p => isMalefic(p.id));

  // Mala: All benefics in 3 kendras (not all 4). Malefics only in 3, 6, 11
  const beneficHouses = new Set(beneficPlanets.map(p => p.house));
  const beneficInKendras = KENDRA.filter(k => beneficHouses.has(k));
  const maleficOnlyIn3611 = maleficPlanets.every(p => [3, 6, 11].includes(p.house));
  const malaPresent = beneficInKendras.length === 3 && maleficOnlyIn3611 && maleficPlanets.length > 0;
  results.push({
    id: 'mala_nabhasa', category: 'other', isAuspicious: true, present: malaPresent,
    strength: malaPresent ? 'Strong' : 'Weak',
    name: { en: 'Mala Yoga (Nabhasa)', hi: 'माला योग (नभस)', sa: 'मालायोगः' },
    formationRule: {
      en: 'Benefics in 3 kendras, malefics in 3rd/6th/11th only',
      hi: 'शुभ ग्रह 3 केन्द्रों में, पाप ग्रह केवल 3/6/11 में',
      sa: 'शुभग्रहाः त्रिषु केन्द्रेषु पापग्रहाः तृतीय-षष्ठ-एकादशे एव',
    },
    description: {
      en: 'Garland pattern  –  benefics adorning the angular houses grant fame, happiness, and comfort like a garland of flowers.',
      hi: 'माला योग  –  शुभ ग्रह केन्द्रों में पुष्पमाला सम यश, सुख और समृद्धि देते हैं।',
      sa: 'मालायोगः  –  शुभग्रहाः केन्द्रेषु पुष्पमालावद् यशः सुखं समृद्धिं च ददति।',
    },
  });

  // Sarpa: All malefics in 3 kendras. Benefics only in 3, 6, 11
  const maleficHouses = new Set(maleficPlanets.map(p => p.house));
  const maleficInKendras = KENDRA.filter(k => maleficHouses.has(k));
  const beneficOnlyIn3611 = beneficPlanets.every(p => [3, 6, 11].includes(p.house));
  const sarpaPresent = maleficInKendras.length === 3 && beneficOnlyIn3611 && beneficPlanets.length > 0;
  results.push({
    id: 'sarpa_nabhasa', category: 'inauspicious', isAuspicious: false, present: sarpaPresent,
    strength: sarpaPresent ? 'Strong' : 'Weak',
    name: { en: 'Sarpa Yoga (Nabhasa)', hi: 'सर्प योग (नभस)', sa: 'सर्पयोगः' },
    formationRule: {
      en: 'Malefics in 3 kendras, benefics in 3rd/6th/11th only',
      hi: 'पाप ग्रह 3 केन्द्रों में, शुभ ग्रह केवल 3/6/11 में',
      sa: 'पापग्रहाः त्रिषु केन्द्रेषु शुभग्रहाः तृतीय-षष्ठ-एकादशे एव',
    },
    description: {
      en: 'Serpent pattern  –  malefics dominating angular houses bring struggles, deception, and suffering like a coiled snake.',
      hi: 'सर्प योग  –  पाप ग्रह केन्द्रों में कुण्डलित सर्प सम संघर्ष, छल और कष्ट देते हैं।',
      sa: 'सर्पयोगः  –  पापग्रहाः केन्द्रेषु कुण्डलितसर्पवत् संघर्षं छलं कष्टं च ददति।',
    },
  });

  // Gada: All 7 planets in 2 adjacent kendras (1+4, 4+7, 7+10, 10+1)
  const gadaPairs: [number, number][] = [[1, 4], [4, 7], [7, 10], [10, 1]];
  let gadaPresent = false;
  for (const [k1, k2] of gadaPairs) {
    if (seven.every(p => p.house === k1 || p.house === k2)) {
      gadaPresent = true;
      break;
    }
  }
  results.push({
    id: 'gada_nabhasa', category: 'other', isAuspicious: true, present: gadaPresent,
    strength: gadaPresent ? 'Strong' : 'Weak',
    name: { en: 'Gada Yoga (Nabhasa)', hi: 'गदा योग (नभस)', sa: 'गदायोगः' },
    formationRule: {
      en: 'All 7 planets in 2 adjacent kendra houses',
      hi: 'सभी 7 ग्रह 2 निकटवर्ती केन्द्र भावों में',
      sa: 'सर्वे सप्तग्रहाः द्वयोः समीपस्थकेन्द्रयोः',
    },
    description: {
      en: 'Mace pattern  –  concentrated power in two kendras grants wealth, religious merit, and skill in sciences, like wielding a mighty mace.',
      hi: 'गदा योग  –  दो केन्द्रों में केन्द्रित शक्ति धन, धार्मिक पुण्य और विज्ञान कौशल देती है।',
      sa: 'गदायोगः  –  द्वयोः केन्द्रयोः केन्द्रिता शक्तिः धनं धर्मपुण्यं विज्ञानकौशलं च ददाति।',
    },
  });

  // Shayana: All 7 planets in 2 adjacent non-kendra houses
  let shayanaPresent = false;
  for (let h1 = 1; h1 <= 12; h1++) {
    const h2 = (h1 % 12) + 1;
    if (KENDRA.includes(h1) && KENDRA.includes(h2)) continue;
    if (seven.every(p => p.house === h1 || p.house === h2)) {
      shayanaPresent = true;
      break;
    }
  }
  results.push({
    id: 'shayana_nabhasa', category: 'other', isAuspicious: false, present: shayanaPresent,
    strength: shayanaPresent ? 'Moderate' : 'Weak',
    name: { en: 'Shayana Yoga (Nabhasa)', hi: 'शयन योग (नभस)', sa: 'शयनयोगः' },
    formationRule: {
      en: 'All 7 planets in 2 adjacent non-kendra houses',
      hi: 'सभी 7 ग्रह 2 निकटवर्ती गैर-केन्द्र भावों में',
      sa: 'सर्वे सप्तग्रहाः द्वयोः समीपस्थाकेन्द्रभावयोः',
    },
    description: {
      en: 'Reclining pattern  –  lazy disposition, comfort-seeking, dependent on others, idle tendencies but peaceful nature.',
      hi: 'शयन योग  –  आलसी प्रवृत्ति, सुखलोलुप, दूसरों पर निर्भर, शान्त स्वभाव।',
      sa: 'शयनयोगः  –  आलस्यप्रवृत्तिः सुखलोलुपता परावलम्बनं शान्तस्वभावश्च।',
    },
  });

  // Ardha-Chandra: All 7 planets occupy 7 consecutive houses
  let ardhaChandraPresent = false;
  for (let start = 1; start <= 12; start++) {
    const sevenConsec: number[] = [];
    for (let i = 0; i < 7; i++) sevenConsec.push(((start - 1 + i) % 12) + 1);
    if (seven.every(p => sevenConsec.includes(p.house))) {
      // Must use all 7 consecutive houses (not fewer)
      const usedHouses = new Set(seven.map(p => p.house));
      if (sevenConsec.every(h => usedHouses.has(h))) {
        ardhaChandraPresent = true;
        break;
      }
    }
  }
  results.push({
    id: 'ardha_chandra_nabhasa', category: 'other', isAuspicious: true, present: ardhaChandraPresent,
    strength: ardhaChandraPresent ? 'Strong' : 'Weak',
    name: { en: 'Ardha-Chandra Yoga (Nabhasa)', hi: 'अर्धचन्द्र योग (नभस)', sa: 'अर्धचन्द्रयोगः' },
    formationRule: {
      en: 'All 7 planets in 7 consecutive houses, each house occupied',
      hi: 'सभी 7 ग्रह 7 क्रमागत भावों में, प्रत्येक भाव में ग्रह',
      sa: 'सर्वे सप्तग्रहाः सप्तसु क्रमभावेषु प्रत्येकं ग्रहयुक्तेषु',
    },
    description: {
      en: 'Half-moon pattern  –  beautiful appearance, popular leader, natural commander, military or political eminence.',
      hi: 'अर्धचन्द्र योग  –  सुन्दर रूप, लोकप्रिय नेता, सैन्य या राजनीतिक प्रतिष्ठा।',
      sa: 'अर्धचन्द्रयोगः  –  सुन्दरं रूपं लोकप्रियनेतृत्वं सैनिकराजनैतिकप्रतिष्ठा च।',
    },
  });

  // Chhatra: All 7 planets in 7 houses starting from lagna (houses 1-7)
  const chhatraPresent = seven.every(p => p.house >= 1 && p.house <= 7) &&
    new Set(seven.map(p => p.house)).size === 7;
  results.push({
    id: 'chhatra_nabhasa', category: 'other', isAuspicious: true, present: chhatraPresent,
    strength: chhatraPresent ? 'Strong' : 'Weak',
    name: { en: 'Chhatra Yoga (Nabhasa)', hi: 'छत्र योग (नभस)', sa: 'छत्रयोगः' },
    formationRule: {
      en: 'All 7 planets in houses 1 through 7, one per house',
      hi: 'सभी 7 ग्रह भाव 1 से 7 में, प्रत्येक भाव में एक',
      sa: 'सर्वे सप्तग्रहाः प्रथमात् सप्तमपर्यन्तं प्रत्येकभावे',
    },
    description: {
      en: 'Umbrella pattern  –  royal protection, high status, charitable nature, protector of others, fame spreading far.',
      hi: 'छत्र योग  –  राजकीय संरक्षण, उच्च पद, दानशील, दूसरों का रक्षक।',
      sa: 'छत्रयोगः  –  राजसंरक्षणम् उच्चपदं दानशीलता परेषां रक्षा च।',
    },
  });

  // Chaamara (Nabhasa variant): Lord of lagna in exaltation in kendra, aspected by Jupiter
  const lagnaLord = signLord(ascSign);
  const lagnaLordP = getP(planets, lagnaLord);
  const jupiterP = getP(planets, 4);
  const jupAspectsLagnaLord = planetsAspectEachOther(jupiterP, lagnaLordP);
  const chaamaraPresent = lagnaLordP.isExalted && KENDRA.includes(lagnaLordP.house) && jupAspectsLagnaLord;
  results.push({
    id: 'chaamara_nabhasa', category: 'raja', isAuspicious: true, present: chaamaraPresent,
    strength: chaamaraPresent ? 'Strong' : 'Weak',
    name: { en: 'Chaamara Yoga (Nabhasa)', hi: 'चामर योग (नभस)', sa: 'चामरयोगः' },
    formationRule: {
      en: 'Lagna lord exalted in kendra, aspected by Jupiter',
      hi: 'लग्नेश उच्च केन्द्र में, बृहस्पति की दृष्टि',
      sa: 'लग्नेशः उच्चे केन्द्रे गुरुदृष्टियुक्तः',
    },
    description: {
      en: 'Royal fan-bearer pattern  –  honoured by rulers, eloquent orator, scholarly, long life, virtuous and famous.',
      hi: 'चामर योग  –  शासकों द्वारा सम्मानित, वक्ता, विद्वान, दीर्घायु, सद्गुणी और प्रसिद्ध।',
      sa: 'चामरयोगः  –  शासकैः सम्मानितः वाग्मी विद्वान् दीर्घायुः सद्गुणी प्रसिद्धश्च।',
    },
  });

  // Dhanush: All planets in houses 4 through 10 (7 houses from 4th to 10th)
  const dhanushPresent = seven.every(p => p.house >= 4 && p.house <= 10);
  results.push({
    id: 'dhanush_nabhasa', category: 'other', isAuspicious: true, present: dhanushPresent,
    strength: dhanushPresent ? 'Moderate' : 'Weak',
    name: { en: 'Dhanush Yoga (Nabhasa)', hi: 'धनुष योग (नभस)', sa: 'धनुषयोगः' },
    formationRule: {
      en: 'All 7 planets in houses 4 through 10',
      hi: 'सभी 7 ग्रह भाव 4 से 10 में',
      sa: 'सर्वे सप्तग्रहाः चतुर्थाद् दशमपर्यन्तम्',
    },
    description: {
      en: 'Bow pattern  –  skill in warfare and strategy, protective nature, wealth from guarding others, trusted emissary.',
      hi: 'धनुष योग  –  युद्ध और रणनीति में कुशल, रक्षात्मक स्वभाव, विश्वसनीय दूत।',
      sa: 'धनुषयोगः  –  युद्धे रणनीत्यां च कौशलं रक्षात्मकस्वभावः विश्वस्तदूतश्च।',
    },
  });

  // Nauka (Nabhasa): All 7 planets in houses 1-7
  const naukaPresent = seven.every(p => p.house >= 1 && p.house <= 7);
  results.push({
    id: 'nauka_nabhasa', category: 'other', isAuspicious: true, present: naukaPresent,
    strength: naukaPresent ? 'Moderate' : 'Weak',
    name: { en: 'Nauka Yoga (Nabhasa)', hi: 'नौका योग (नभस)', sa: 'नौकायोगः' },
    formationRule: {
      en: 'All 7 planets in houses 1 through 7',
      hi: 'सभी 7 ग्रह भाव 1 से 7 में',
      sa: 'सर्वे सप्तग्रहाः प्रथमात् सप्तमपर्यन्तम्',
    },
    description: {
      en: 'Boat pattern  –  wealth through trade, naval connections, overseas fortune, adaptable nature, gains from water-related enterprises.',
      hi: 'नौका योग  –  व्यापार से धन, विदेशी सम्पर्क, जल-सम्बन्धी उद्यम से लाभ।',
      sa: 'नौकायोगः  –  वाणिज्येन धनं विदेशसम्पर्कः जलसम्बन्धिउद्यमलाभश्च।',
    },
  });

  // Koota: All 7 planets in houses 4-10
  const kootaPresent = seven.every(p => p.house >= 4 && p.house <= 10);
  results.push({
    id: 'koota_nabhasa', category: 'other', isAuspicious: false, present: kootaPresent,
    strength: kootaPresent ? 'Moderate' : 'Weak',
    name: { en: 'Koota Yoga (Nabhasa)', hi: 'कूट योग (नभस)', sa: 'कूटयोगः' },
    formationRule: {
      en: 'All 7 planets in houses 4 through 10',
      hi: 'सभी 7 ग्रह भाव 4 से 10 में',
      sa: 'सर्वे सप्तग्रहाः चतुर्थाद् दशमपर्यन्तम्',
    },
    description: {
      en: 'Peak/fortress pattern  –  deceptive nature, cunning in dealings, potential for lying, but also strategic intelligence and survival skill.',
      hi: 'कूट योग  –  छल-प्रवृत्ति, व्यवहार में चतुराई, परन्तु रणनीतिक बुद्धि और जीवन-कौशल भी।',
      sa: 'कूटयोगः  –  छलप्रवृत्तिः व्यवहारचातुर्यं रणनीतिकबुद्धिः जीवनकौशलं च।',
    },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Expanded Daridra (Poverty) Yogas  –  BPHS supplementary
// ---------------------------------------------------------------------------

function detectExpandedDaridraYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const houseSign = (h: number) => signFrom(ascSign, h);
  const lordOf = (h: number) => signLord(houseSign(h));
  const hOf = (id: number) => getP(planets, id).house;

  // Lagna lord in 12th with malefic aspect
  const lagnaLord = lordOf(1);
  const lagnaLordP = getP(planets, lagnaLord);
  const llIn12 = lagnaLordP.house === 12;
  const llMaleficAspect = llIn12 && planets.some(p => isMalefic(p.id) && planetsAspectEachOther(p, lagnaLordP) && p.id !== lagnaLord);
  results.push({
    id: 'daridra_lagna_12', category: 'inauspicious', isAuspicious: false, present: llMaleficAspect,
    strength: llMaleficAspect ? 'Moderate' : 'Weak',
    name: { en: 'Daridra Yoga (Lagna Lord in 12th)', hi: 'दरिद्र योग (लग्नेश द्वादश में)', sa: 'दरिद्रयोगः (लग्नेशः द्वादशे)' },
    formationRule: {
      en: 'Lagna lord in 12th house with malefic aspect',
      hi: 'लग्नेश 12वें भाव में पाप ग्रह की दृष्टि सहित',
      sa: 'लग्नेशः द्वादशे पापदृष्टियुक्तः',
    },
    description: {
      en: 'Lagna lord in the house of losses with malefic influence  –  expenditure exceeds income, financial drain, difficulty retaining wealth.',
      hi: 'लग्नेश हानि भाव में पाप प्रभाव  –  व्यय आय से अधिक, धन का क्षरण।',
      sa: 'लग्नेशः व्ययभावे पापप्रभावयुक्तः  –  व्ययः आयम् अतिशेते धनक्षरणं च।',
    },
  });

  // Lord of 2nd in 12th
  const lord2 = lordOf(2);
  const lord2In12 = hOf(lord2) === 12;
  results.push({
    id: 'daridra_2nd_in_12', category: 'inauspicious', isAuspicious: false, present: lord2In12,
    strength: lord2In12 ? 'Moderate' : 'Weak',
    name: { en: 'Daridra Yoga (2nd Lord in 12th)', hi: 'दरिद्र योग (द्वितीयेश द्वादश में)', sa: 'दरिद्रयोगः (द्वितीयेशः द्वादशे)' },
    formationRule: {
      en: 'Lord of 2nd house in 12th house',
      hi: 'द्वितीय भाव का स्वामी 12वें भाव में',
      sa: 'द्वितीयेशः द्वादशभावे',
    },
    description: {
      en: 'Wealth lord in house of losses  –  family wealth dissipated, saving is difficult, money flows out as fast as it comes in.',
      hi: 'धनेश हानि भाव में  –  पारिवारिक धन का क्षय, बचत कठिन, धन उतनी ही तेजी से जाता है।',
      sa: 'धनेशः व्ययभावे  –  कुलधनक्षयः संचयकठिनता धनं यावत् आगच्छति तावत् गच्छति।',
    },
  });

  // Lord of 11th in 6th or 12th
  const lord11 = lordOf(11);
  const lord11In6or12 = [6, 12].includes(hOf(lord11));
  results.push({
    id: 'daridra_11_in_6_12', category: 'inauspicious', isAuspicious: false, present: lord11In6or12,
    strength: lord11In6or12 ? 'Moderate' : 'Weak',
    name: { en: 'Daridra Yoga (11th Lord in 6th/12th)', hi: 'दरिद्र योग (लाभेश षष्ठ/द्वादश में)', sa: 'दरिद्रयोगः (लाभेशः षष्ठे द्वादशे वा)' },
    formationRule: {
      en: 'Lord of 11th in 6th or 12th house',
      hi: 'एकादश भाव का स्वामी 6 या 12वें भाव में',
      sa: 'एकादशेशः षष्ठे द्वादशे वा',
    },
    description: {
      en: 'Gains lord in enemy/loss house  –  income through debts or spent on enemies/illness/foreign travel, unfulfilled ambitions.',
      hi: 'लाभेश शत्रु/हानि भाव में  –  ऋण से आय या शत्रुओं/रोग पर व्यय, अपूर्ण महत्त्वाकांक्षाएँ।',
      sa: 'लाभेशः शत्रुव्ययभावे  –  ऋणेन आयः शत्रुरोगव्यये वा अपूर्णमहत्त्वाकाङ्क्षाः।',
    },
  });

  // All malefics in 1st and 7th without benefic aspect
  const malIn1 = planets.filter(p => p.house === 1 && isMalefic(p.id));
  const malIn7 = planets.filter(p => p.house === 7 && isMalefic(p.id));
  const beneficAspectsAxis = planets.some(p => isBenefic(p.id) &&
    (houseOffset(p.house, 1) === 7 || houseOffset(p.house, 7) === 7));
  const allMalOnAxis = malIn1.length > 0 && malIn7.length > 0 && !beneficAspectsAxis;
  results.push({
    id: 'daridra_mal_axis', category: 'inauspicious', isAuspicious: false, present: allMalOnAxis,
    strength: allMalOnAxis ? 'Strong' : 'Weak',
    name: { en: 'Daridra Yoga (Malefics on 1-7 Axis)', hi: 'दरिद्र योग (1-7 अक्ष पर पाप)', sa: 'दरिद्रयोगः (लग्नसप्तमे पापग्रहाः)' },
    formationRule: {
      en: 'Malefics in 1st and 7th houses without benefic aspect on the axis',
      hi: 'पाप ग्रह 1 और 7 भाव में बिना शुभ दृष्टि',
      sa: 'पापग्रहाः लग्ने सप्तमे च शुभदृष्ट्यभावे',
    },
    description: {
      en: 'Malefics straddling the self-other axis  –  poverty, partnership failures, health issues, and blocked prosperity.',
      hi: 'लग्न-सप्तम अक्ष पर पाप ग्रह  –  दरिद्रता, साझेदारी विफलता, स्वास्थ्य समस्याएँ।',
      sa: 'लग्नसप्तमयोः पापग्रहाः  –  दारिद्र्यं साझेदारीविफलता स्वास्थ्यपीडा च।',
    },
  });

  // Saturn + Mars in 2nd house
  const satMarsIn2 = hOf(6) === 2 && hOf(2) === 2;
  results.push({
    id: 'daridra_sat_mars_2', category: 'inauspicious', isAuspicious: false, present: satMarsIn2,
    strength: satMarsIn2 ? 'Moderate' : 'Weak',
    name: { en: 'Daridra Yoga (Saturn-Mars in 2nd)', hi: 'दरिद्र योग (शनि-मंगल द्वितीय में)', sa: 'दरिद्रयोगः (शनिकुजौ द्वितीये)' },
    formationRule: {
      en: 'Saturn and Mars conjunct in 2nd house',
      hi: 'शनि और मंगल 2वें भाव में युत',
      sa: 'शनिकुजौ द्वितीयभावे युतौ',
    },
    description: {
      en: 'Two harsh malefics in the house of wealth  –  harsh speech, family disputes, food/financial insecurity, savings destroyed by aggression.',
      hi: 'दो कठोर पाप धन भाव में  –  कटु वाणी, पारिवारिक विवाद, वित्तीय असुरक्षा।',
      sa: 'द्वौ क्रूरपापौ धनभावे  –  कटुवाणी कुलकलहः वित्तीयासुरक्षा च।',
    },
  });

  // 12th lord in lagna
  const lord12 = lordOf(12);
  const lord12InLagna = hOf(lord12) === 1;
  results.push({
    id: 'daridra_12_in_1', category: 'inauspicious', isAuspicious: false, present: lord12InLagna,
    strength: lord12InLagna ? 'Moderate' : 'Weak',
    name: { en: 'Daridra Yoga (12th Lord in Lagna)', hi: 'दरिद्र योग (व्ययेश लग्न में)', sa: 'दरिद्रयोगः (व्ययेशः लग्ने)' },
    formationRule: {
      en: '12th lord placed in Lagna (1st house)',
      hi: 'व्यय भाव का स्वामी लग्न में',
      sa: 'व्ययेशः लग्नभावे',
    },
    description: {
      en: 'Loss lord in self house  –  expenditure dominates personality, generous to a fault, difficulty accumulating wealth, foreign residence likely.',
      hi: 'व्ययेश लग्न में  –  व्यय व्यक्तित्व पर हावी, अत्यधिक उदारता, धन संचय कठिन, विदेश निवास सम्भव।',
      sa: 'व्ययेशः लग्ने  –  व्ययः व्यक्तित्वे प्रधानः अत्युदारता धनसंचयकठिनता विदेशनिवासश्च।',
    },
  });

  // Lord of 5th in 6th/8th/12th (speculative loss)
  const lord5 = lordOf(5);
  const lord5InDusthana = DUSTHANA.includes(hOf(lord5));
  results.push({
    id: 'daridra_5_dusthana', category: 'inauspicious', isAuspicious: false, present: lord5InDusthana,
    strength: lord5InDusthana ? 'Moderate' : 'Weak',
    name: { en: 'Daridra Yoga (5th Lord in Dusthana)', hi: 'दरिद्र योग (पंचमेश दुस्थान में)', sa: 'दरिद्रयोगः (पञ्चमेशः दुस्थाने)' },
    formationRule: {
      en: 'Lord of 5th in 6th, 8th, or 12th house',
      hi: 'पंचम भाव का स्वामी 6, 8, या 12 भाव में',
      sa: 'पञ्चमेशः षष्ठे अष्टमे द्वादशे वा',
    },
    description: {
      en: 'Fortune lord in dusthana  –  losses through speculation, investments gone wrong, children-related expenses, poor returns on creative ventures.',
      hi: 'पूर्वपुण्येश दुस्थान में  –  सट्टे से हानि, निवेश विफल, संतान व्यय, सृजनात्मक प्रयासों पर खराब प्रतिफल।',
      sa: 'पूर्वपुण्येशः दुस्थाने  –  अटकलाभिः हानिः निवेशविफलता सन्तानव्ययश्च।',
    },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Sannyasa (Renunciation) Yogas
// ---------------------------------------------------------------------------

function detectSannyasaYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const houseSign = (h: number) => signFrom(ascSign, h);
  const lordOf = (h: number) => signLord(houseSign(h));
  const hOf = (id: number) => getP(planets, id).house;
  const moon = getP(planets, 1);
  const saturn = getP(planets, 6);
  const ketu = getP(planets, 8);
  const sun = getP(planets, 0);

  // Tapasvi: Moon in Capricorn(10) or Aquarius(11), aspected by Saturn
  const moonInSatSign = [10, 11].includes(moon.sign);
  const satAspectsMoon = planetsAspectEachOther(saturn, moon);
  const tapasviPresent = moonInSatSign && satAspectsMoon;
  results.push({
    id: 'tapasvi', category: 'other', isAuspicious: true, present: tapasviPresent,
    strength: tapasviPresent ? 'Moderate' : 'Weak',
    name: { en: 'Tapasvi Yoga', hi: 'तपस्वी योग', sa: 'तपस्वियोगः' },
    formationRule: {
      en: 'Moon in Capricorn/Aquarius aspected by Saturn',
      hi: 'चन्द्र मकर/कुम्भ राशि में शनि की दृष्टि सहित',
      sa: 'चन्द्रः मकरकुम्भराशौ शनिदृष्टियुक्तः',
    },
    description: {
      en: 'Ascetic yoga  –  deep austerity, detachment from material comforts, spiritual discipline, meditative temperament.',
      hi: 'तपस्वी योग  –  गहन तपस्या, भौतिक सुखों से विरक्ति, आध्यात्मिक अनुशासन, ध्यानशील स्वभाव।',
      sa: 'तपस्वियोगः  –  गभीरतपस्या भौतिकसुखेभ्यो विरक्तिः आध्यात्मिकानुशासनं ध्यानशीलस्वभावश्च।',
    },
  });

  // Parivraja: 4+ planets conjunct including the 10th lord
  const lord10 = lordOf(10);
  let parivrajaPresent = false;
  for (let h = 1; h <= 12; h++) {
    const inHouse = planets.filter(p => p.id <= 6 && p.house === h);
    if (inHouse.length >= 4 && inHouse.some(p => p.id === lord10)) {
      parivrajaPresent = true;
      break;
    }
  }
  results.push({
    id: 'parivraja', category: 'other', isAuspicious: true, present: parivrajaPresent,
    strength: parivrajaPresent ? 'Strong' : 'Weak',
    name: { en: 'Parivraja Yoga', hi: 'परिव्राज योग', sa: 'परिव्राजयोगः' },
    formationRule: {
      en: '4+ planets conjunct in one house, including the 10th lord',
      hi: '4+ ग्रह एक भाव में युत, दशमेश सहित',
      sa: 'चत्वारः वा अधिकाः ग्रहाः एकभावे दशमेशसहिताः',
    },
    description: {
      en: 'Wandering ascetic yoga  –  renunciation of worldly duties, spiritual wandering, monastic life, detachment from career and social status.',
      hi: 'परिव्राज योग  –  सांसारिक कर्तव्यों का त्याग, आध्यात्मिक भ्रमण, संन्यास जीवन।',
      sa: 'परिव्राजयोगः  –  सांसारिककर्तव्यानां त्यागः आध्यात्मिकभ्रमणं संन्यासजीवनं च।',
    },
  });

  // Sada-Sannyasa: Lord of lagna in 12th with Saturn aspect
  const lagnaLord = lordOf(1);
  const lagnaLordP = getP(planets, lagnaLord);
  const llIn12 = lagnaLordP.house === 12;
  const satAspectsLL = planetsAspectEachOther(saturn, lagnaLordP);
  const sadaSannyasaPresent = llIn12 && satAspectsLL;
  results.push({
    id: 'sada_sannyasa', category: 'other', isAuspicious: true, present: sadaSannyasaPresent,
    strength: sadaSannyasaPresent ? 'Moderate' : 'Weak',
    name: { en: 'Sada Sannyasa Yoga', hi: 'सदा संन्यास योग', sa: 'सदासंन्यासयोगः' },
    formationRule: {
      en: 'Lagna lord in 12th house aspected by Saturn',
      hi: 'लग्नेश 12वें भाव में शनि की दृष्टि सहित',
      sa: 'लग्नेशः द्वादशे शनिदृष्टियुक्तः',
    },
    description: {
      en: 'Permanent renunciation  –  lifelong spiritual seeker, detachment from possessions, pilgrimage, monastery, ashram life.',
      hi: 'सदा संन्यास  –  आजीवन आध्यात्मिक साधक, सम्पत्ति से विरक्ति, तीर्थयात्रा, आश्रम जीवन।',
      sa: 'सदासंन्यासः  –  आजीवनम् आध्यात्मिकसाधनं सम्पत्तिविरक्तिः तीर्थयात्रा आश्रमजीवनं च।',
    },
  });

  // Vairagyakarak: Ketu in lagna with Saturn's aspect
  const ketuInLagna = ketu.house === 1;
  const satAspectsKetu = planetsAspectEachOther(saturn, ketu);
  const vairagyaPresent = ketuInLagna && satAspectsKetu;
  results.push({
    id: 'vairagyakarak', category: 'other', isAuspicious: true, present: vairagyaPresent,
    strength: vairagyaPresent ? 'Moderate' : 'Weak',
    name: { en: 'Vairagyakarak Yoga', hi: 'वैराग्यकारक योग', sa: 'वैराग्यकारकयोगः' },
    formationRule: {
      en: 'Ketu in Lagna aspected by Saturn',
      hi: 'केतु लग्न में शनि की दृष्टि सहित',
      sa: 'केतुः लग्ने शनिदृष्टियुक्तः',
    },
    description: {
      en: 'Detachment-producing yoga  –  natural dispassion, spiritual inclination from birth, indifference to worldly pleasures, past-life spiritual merit.',
      hi: 'वैराग्यकारक  –  जन्म से विरक्ति, आध्यात्मिक प्रवृत्ति, सांसारिक सुखों से उदासीनता।',
      sa: 'वैराग्यकारकयोगः  –  जन्मतः विरक्तिः आध्यात्मिकप्रवृत्तिः सांसारिकसुखेषु उदासीनता।',
    },
  });

  // Moksha: 12th lord in 1st or 9th, aspected by benefic
  const lord12 = lordOf(12);
  const lord12P = getP(planets, lord12);
  const lord12In1or9 = [1, 9].includes(lord12P.house);
  const beneficAspectsLord12 = lord12In1or9 && planets.some(p => isBenefic(p.id) && planetsAspectEachOther(p, lord12P));
  results.push({
    id: 'moksha_yoga', category: 'other', isAuspicious: true, present: beneficAspectsLord12,
    strength: beneficAspectsLord12 ? 'Moderate' : 'Weak',
    name: { en: 'Moksha Yoga', hi: 'मोक्ष योग', sa: 'मोक्षयोगः' },
    formationRule: {
      en: '12th lord in 1st or 9th house, aspected by a benefic',
      hi: 'व्ययेश 1 या 9वें भाव में, शुभ ग्रह की दृष्टि सहित',
      sa: 'व्ययेशः लग्ने नवमे वा शुभदृष्टियुक्तः',
    },
    description: {
      en: 'Liberation yoga  –  spiritual liberation potential, dharmic life leading to moksha, benefic influence purifies the 12th lord energy.',
      hi: 'मोक्ष योग  –  मुक्ति की सम्भावना, मोक्ष की ओर धार्मिक जीवन, शुभ प्रभाव व्ययेश को शुद्ध करता है।',
      sa: 'मोक्षयोगः  –  मुक्तिसम्भावना धार्मिकजीवनं मोक्षप्रति शुभप्रभावः व्ययेशं शोधयति।',
    },
  });

  // Pravrajya extended: stellium (4+) includes at least one of Sun/Moon/Saturn
  let pravrajyaExtPresent = false;
  for (let h = 1; h <= 12; h++) {
    const inHouse = planets.filter(p => p.id <= 6 && p.house === h);
    if (inHouse.length >= 4 && inHouse.some(p => [0, 1, 6].includes(p.id))) {
      pravrajyaExtPresent = true;
      break;
    }
  }
  results.push({
    id: 'pravrajya_ext', category: 'other', isAuspicious: false, present: pravrajyaExtPresent,
    strength: pravrajyaExtPresent ? 'Strong' : 'Weak',
    name: { en: 'Pravrajya Yoga (Extended)', hi: 'प्रव्रज्या योग (विस्तृत)', sa: 'प्रव्रज्यायोगः (विस्तृतः)' },
    formationRule: {
      en: '4+ planets in one house including Sun, Moon, or Saturn',
      hi: 'एक भाव में 4+ ग्रह, सूर्य/चन्द्र/शनि सहित',
      sa: 'एकभावे चत्वारः वा अधिकाः ग्रहाः सूर्यचन्द्रशनिषु एकं सहिताः',
    },
    description: {
      en: 'Strong renunciation indicator  –  stellium involving a luminary or Saturn intensifies the pull towards monastic life and spiritual seeking.',
      hi: 'दृढ़ संन्यास सूचक  –  ज्योति या शनि सहित ग्रह-पुंज संन्यास और आध्यात्मिक खोज को तीव्र करता है।',
      sa: 'दृढसंन्यासः  –  ज्योतिषः शनिः वा सहितः ग्रहपुञ्जः संन्यासम् आध्यात्मिकान्वेषणं च तीव्रयति।',
    },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Named Dhana (Wealth) Yogas  –  classical specific
// ---------------------------------------------------------------------------

function detectNamedDhanaYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const houseSign = (h: number) => signFrom(ascSign, h);
  const lordOf = (h: number) => signLord(houseSign(h));
  const hOf = (id: number) => getP(planets, id).house;
  const jupiter = getP(planets, 4);
  const venus = getP(planets, 5);
  const mercury = getP(planets, 3);
  const moon = getP(planets, 1);

  // Kalanidhi: Jupiter in 2nd or 5th with Mercury and Venus (conjunct or aspect)
  const jupIn2or5 = [2, 5].includes(jupiter.house);
  const mercRelated = inSameHouse(jupiter, mercury) || planetsAspectEachOther(jupiter, mercury);
  const venRelated = inSameHouse(jupiter, venus) || planetsAspectEachOther(jupiter, venus);
  const kalanidhiPresent = jupIn2or5 && mercRelated && venRelated;
  results.push({
    id: 'kalanidhi', category: 'wealth', isAuspicious: true, present: kalanidhiPresent,
    strength: kalanidhiPresent ? 'Strong' : 'Weak',
    name: { en: 'Kalanidhi Yoga', hi: 'कलानिधि योग', sa: 'कलानिधियोगः' },
    formationRule: {
      en: 'Jupiter in 2nd/5th with Mercury and Venus related by conjunction/aspect',
      hi: 'बृहस्पति 2/5 में बुध और शुक्र से युति/दृष्टि सम्बन्ध',
      sa: 'गुरुः द्वितीये पञ्चमे वा बुधशुक्राभ्यां युत्या दृष्ट्या वा सम्बद्धः',
    },
    description: {
      en: 'Treasure of arts  –  patronage of fine arts, wealth through creative pursuits, scholarly reputation, refined taste and culture.',
      hi: 'कलानिधि  –  ललित कलाओं का संरक्षण, सृजनात्मक कार्यों से धन, विद्वत् प्रतिष्ठा।',
      sa: 'कलानिधियोगः  –  ललितकलानां संरक्षणं सृजनात्मककार्यैः धनं विद्वत्प्रतिष्ठा च।',
    },
  });

  // Mahalakshmi: Venus in own sign in 2nd or 11th, aspected by Jupiter
  const venInOwnIn2or11 = venus.isOwnSign && [2, 11].includes(venus.house);
  const jupAspectsVen = planetsAspectEachOther(jupiter, venus);
  const mahalakshmiPresent = venInOwnIn2or11 && jupAspectsVen;
  results.push({
    id: 'mahalakshmi', category: 'wealth', isAuspicious: true, present: mahalakshmiPresent,
    strength: mahalakshmiPresent ? 'Strong' : 'Weak',
    name: { en: 'Mahalakshmi Yoga', hi: 'महालक्ष्मी योग', sa: 'महालक्ष्मीयोगः' },
    formationRule: {
      en: 'Venus in own sign in 2nd/11th, aspected by Jupiter',
      hi: 'शुक्र स्वराशि में 2/11 भाव में, बृहस्पति की दृष्टि',
      sa: 'शुक्रः स्वराशौ द्वितीयैकादशे गुरुदृष्टियुक्तः',
    },
    description: {
      en: 'Blessings of Mahalakshmi  –  permanent wealth, luxury, beautiful surroundings, happy marriage, divine feminine grace.',
      hi: 'महालक्ष्मी की कृपा  –  स्थायी धन, विलासिता, सुन्दर परिवेश, सुखी विवाह।',
      sa: 'महालक्ष्म्याः कृपा  –  स्थायिधनं विलासिता सुन्दरपरिवेशः सुखविवाहश्च।',
    },
  });

  // Shankha Dhana: Lords of 5th and 6th in mutual kendras
  const lord5 = lordOf(5);
  const lord6 = lordOf(6);
  const lord5P = getP(planets, lord5);
  const lord6P = getP(planets, lord6);
  const l5InKendra = KENDRA.includes(lord5P.house);
  const l6InKendra = KENDRA.includes(lord6P.house);
  const shankhaDhanaPresent = l5InKendra && l6InKendra && lord5 !== lord6;
  results.push({
    id: 'shankha_dhana', category: 'wealth', isAuspicious: true, present: shankhaDhanaPresent,
    strength: shankhaDhanaPresent ? 'Moderate' : 'Weak',
    name: { en: 'Shankha Dhana Yoga', hi: 'शंख धन योग', sa: 'शङ्खधनयोगः' },
    formationRule: {
      en: 'Lords of 5th and 6th both in kendra houses',
      hi: 'पंचमेश और षष्ठेश दोनों केन्द्र भावों में',
      sa: 'पञ्चमेशषष्ठेशौ केन्द्रभावयोः',
    },
    description: {
      en: 'Conch-shell wealth  –  longevity with prosperity, moral character, comfortable old age, wealth that lasts generations.',
      hi: 'शंख धन  –  दीर्घायु सहित समृद्धि, नैतिक चरित्र, सुखी वृद्धावस्था।',
      sa: 'शङ्खधनयोगः  –  दीर्घायुः सह समृद्ध्या नैतिकचरित्रं सुखवृद्धावस्था च।',
    },
  });

  // Chandika: Lord of 9th in 2nd, lord of 2nd in 11th
  const lord9 = lordOf(9);
  const lord2 = lordOf(2);
  const chandikaPresent = hOf(lord9) === 2 && hOf(lord2) === 11;
  results.push({
    id: 'chandika_dhana', category: 'wealth', isAuspicious: true, present: chandikaPresent,
    strength: chandikaPresent ? 'Strong' : 'Weak',
    name: { en: 'Chandika Yoga', hi: 'चण्डिका योग', sa: 'चण्डिकायोगः' },
    formationRule: {
      en: '9th lord in 2nd house, 2nd lord in 11th house',
      hi: 'नवमेश 2वें भाव में, द्वितीयेश 11वें भाव में',
      sa: 'नवमेशः द्वितीये द्वितीयेशः एकादशे',
    },
    description: {
      en: 'Fortune flows to wealth, wealth flows to gains  –  a chain of prosperity from luck to accumulation to fulfilment.',
      hi: 'भाग्य से धन, धन से लाभ  –  समृद्धि की श्रृंखला, भाग्य से संचय से पूर्ति तक।',
      sa: 'भाग्याद् धनं धनाल्लाभः  –  समृद्धिशृङ्खला भाग्यात् संचयात् पूर्तिपर्यन्तम्।',
    },
  });

  // Shri Kanthi: Lord of 7th in 10th, lord of 10th in 9th
  const lord7 = lordOf(7);
  const lord10 = lordOf(10);
  const shriKanthiPresent = hOf(lord7) === 10 && hOf(lord10) === 9;
  results.push({
    id: 'shri_kanthi', category: 'wealth', isAuspicious: true, present: shriKanthiPresent,
    strength: shriKanthiPresent ? 'Strong' : 'Weak',
    name: { en: 'Shri Kanthi Yoga', hi: 'श्रीकान्ती योग', sa: 'श्रीकान्तीयोगः' },
    formationRule: {
      en: '7th lord in 10th house, 10th lord in 9th house',
      hi: 'सप्तमेश 10वें भाव में, दशमेश 9वें भाव में',
      sa: 'सप्तमेशः दशमे दशमेशः नवमे',
    },
    description: {
      en: 'Beautiful splendour  –  partnership success leading to career heights, career blessed by fortune, radiating prosperity.',
      hi: 'सुन्दर वैभव  –  साझेदारी से कर्म की ऊँचाइयाँ, भाग्य से आशीर्वादित करियर।',
      sa: 'श्रीकान्तीयोगः  –  साझेदारीतः कर्मोन्नतिः भाग्येन आशीर्वादितकर्म प्रसरत्समृद्धिश्च।',
    },
  });

  // Dhana from 5th: Lord of 5th in 2nd or 11th
  const lord5d = lordOf(5);
  const lord5In2or11 = [2, 11].includes(hOf(lord5d));
  results.push({
    id: 'dhana_from_5th', category: 'wealth', isAuspicious: true, present: lord5In2or11,
    strength: lord5In2or11 ? 'Moderate' : 'Weak',
    name: { en: 'Dhana Yoga (5th Lord)', hi: 'धन योग (पंचमेश)', sa: 'धनयोगः (पञ्चमेशः)' },
    formationRule: {
      en: 'Lord of 5th in 2nd or 11th house',
      hi: 'पंचमेश 2 या 11वें भाव में',
      sa: 'पञ्चमेशः द्वितीये एकादशे वा',
    },
    description: {
      en: 'Past-merit wealth  –  gains from speculation, intelligence-based income, children bring prosperity, creative ventures pay off.',
      hi: 'पूर्वपुण्य से धन  –  सट्टे से लाभ, बुद्धि-आधारित आय, संतान समृद्धि लाते हैं।',
      sa: 'पूर्वपुण्यधनम्  –  अटकलालाभः बुद्ध्याधारिताआयः सन्तानसमृद्धिश्च।',
    },
  });

  // Bhagya: Lord of 9th in 9th own sign (fortune amplifier)
  const lord9P = getP(planets, lord9);
  const bhagyaPresent = lord9P.house === 9 && lord9P.isOwnSign;
  results.push({
    id: 'bhagya_yoga', category: 'wealth', isAuspicious: true, present: bhagyaPresent,
    strength: bhagyaPresent ? 'Strong' : 'Weak',
    name: { en: 'Bhagya Yoga', hi: 'भाग्य योग', sa: 'भाग्ययोगः' },
    formationRule: {
      en: '9th lord in 9th house in own sign',
      hi: 'नवमेश 9वें भाव में स्वराशि में',
      sa: 'नवमेशः नवमे स्वराशौ',
    },
    description: {
      en: 'Supreme fortune  –  9th lord at home in the 9th amplifies luck, father prosperous, divine blessings, pilgrimage, righteous wealth.',
      hi: 'सर्वोच्च भाग्य  –  नवमेश स्वभाव में भाग्य प्रबल, पिता समृद्ध, दिव्य आशीर्वाद।',
      sa: 'भाग्ययोगः  –  नवमेशः स्वभावे भाग्यं प्रबलं पिता समृद्धः दिव्याशीर्वादश्च।',
    },
  });

  // Sunapha Dhana: Only benefics in 2nd from Moon
  const moonH = moon.house;
  const secondFromMoon = (moonH % 12) + 1;
  const planetsIn2ndFromMoon = planets.filter(p => p.house === secondFromMoon && ![0, 1, 7, 8].includes(p.id));
  const allBeneficIn2ndFromMoon = planetsIn2ndFromMoon.length > 0 && planetsIn2ndFromMoon.every(p => isBenefic(p.id));
  results.push({
    id: 'sunapha_dhana', category: 'wealth', isAuspicious: true, present: allBeneficIn2ndFromMoon,
    strength: allBeneficIn2ndFromMoon ? 'Moderate' : 'Weak',
    name: { en: 'Sunapha Dhana Yoga', hi: 'सुनफा धन योग', sa: 'सुनफाधनयोगः' },
    formationRule: {
      en: 'Only benefics (no malefics) in 2nd from Moon',
      hi: 'चन्द्र से 2वें में केवल शुभ ग्रह (पाप नहीं)',
      sa: 'चन्द्राद् द्वितीये केवलं शुभग्रहाः',
    },
    description: {
      en: 'Benefic Sunapha  –  self-earned wealth through intelligence and charm, good speech, food security, financial stability from one\'s own efforts.',
      hi: 'शुभ सुनफा  –  बुद्धि और आकर्षण से स्वार्जित धन, सुवाणी, आर्थिक स्थिरता।',
      sa: 'शुभसुनफायोगः  –  बुद्ध्या आकर्षणेन च स्वार्जितधनं सुवाणी आर्थिकस्थिरता च।',
    },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Additional Arishta/Health Yogas
// ---------------------------------------------------------------------------

function detectAdditionalArishtaYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const houseSign = (h: number) => signFrom(ascSign, h);
  const lordOf = (h: number) => signLord(houseSign(h));
  const hOf = (id: number) => getP(planets, id).house;
  const moon = getP(planets, 1);
  const sun = getP(planets, 0);

  // Balarishta extended: Moon in 6th/8th with malefic aspect, no benefic aspect
  const moonIn6or8 = [6, 8].includes(moon.house);
  const maleficAspectsMoon = moonIn6or8 && planets.some(p => isMalefic(p.id) && planetsAspectEachOther(p, moon));
  const beneficAspectsMoon = planets.some(p => isBenefic(p.id) && p.id !== 1 && planetsAspectEachOther(p, moon));
  const balarishtaExtPresent = moonIn6or8 && maleficAspectsMoon && !beneficAspectsMoon;
  results.push({
    id: 'balarishta_ext', category: 'inauspicious', isAuspicious: false, present: balarishtaExtPresent,
    strength: balarishtaExtPresent ? 'Strong' : 'Weak',
    name: { en: 'Balarishta Yoga (Extended)', hi: 'बालारिष्ट योग (विस्तृत)', sa: 'बालारिष्टयोगः (विस्तृतः)' },
    formationRule: {
      en: 'Moon in 6th/8th with malefic aspect and no benefic aspect',
      hi: 'चन्द्र 6/8 में पाप दृष्टि सहित, शुभ दृष्टि रहित',
      sa: 'चन्द्रः षष्ठे अष्टमे वा पापदृष्ट्या शुभदृष्ट्यभावे',
    },
    description: {
      en: 'Severe childhood health challenge  –  Moon afflicted in dusthana without benefic protection. Close medical attention in early years essential.',
      hi: 'गम्भीर बाल्यकाल स्वास्थ्य चुनौती  –  चन्द्र दुस्थान में पीड़ित बिना शुभ रक्षा। प्रारम्भिक वर्षों में चिकित्सा ध्यान आवश्यक।',
      sa: 'गम्भीरबाल्यस्वास्थ्यपीडा  –  चन्द्रः दुस्थाने पीडितः शुभरक्षाभावे।',
    },
  });

  // Pitru Arishta: Sun in 8th/12th afflicted by malefic
  const sunIn8or12 = [8, 12].includes(sun.house);
  const malAfflictsSun = sunIn8or12 && planets.some(p => isMalefic(p.id) && p.id !== 0 && (inSameHouse(p, sun) || planetsAspectEachOther(p, sun)));
  results.push({
    id: 'pitru_arishta', category: 'inauspicious', isAuspicious: false, present: malAfflictsSun,
    strength: malAfflictsSun ? 'Moderate' : 'Weak',
    name: { en: 'Pitru Arishta Yoga', hi: 'पितृ अरिष्ट योग', sa: 'पितृअरिष्टयोगः' },
    formationRule: {
      en: 'Sun in 8th/12th afflicted by malefic',
      hi: 'सूर्य 8/12वें भाव में पाप ग्रह से पीड़ित',
      sa: 'सूर्यः अष्टमे द्वादशे वा पापग्रहपीडितः',
    },
    description: {
      en: 'Father-danger yoga  –  early separation from father, paternal health issues, authority problems, government disputes.',
      hi: 'पितृ अरिष्ट  –  पिता से शीघ्र वियोग, पैतृक स्वास्थ्य समस्याएँ, अधिकार समस्याएँ।',
      sa: 'पितृअरिष्टयोगः  –  पित्रा शीघ्रवियोगः पैतृकस्वास्थ्यसमस्याः अधिकारसमस्याश्च।',
    },
  });

  // Matru Arishta: Moon in 8th/12th afflicted by malefic
  const moonIn8or12 = [8, 12].includes(moon.house);
  const malAfflictsMoon = moonIn8or12 && planets.some(p => isMalefic(p.id) && (inSameHouse(p, moon) || planetsAspectEachOther(p, moon)));
  results.push({
    id: 'matru_arishta', category: 'inauspicious', isAuspicious: false, present: malAfflictsMoon,
    strength: malAfflictsMoon ? 'Moderate' : 'Weak',
    name: { en: 'Matru Arishta Yoga', hi: 'मातृ अरिष्ट योग', sa: 'मातृअरिष्टयोगः' },
    formationRule: {
      en: 'Moon in 8th/12th afflicted by malefic',
      hi: 'चन्द्र 8/12वें भाव में पाप ग्रह से पीड़ित',
      sa: 'चन्द्रः अष्टमे द्वादशे वा पापग्रहपीडितः',
    },
    description: {
      en: 'Mother-danger yoga  –  maternal health concerns, emotional distance from mother, early separation, mental health challenges.',
      hi: 'मातृ अरिष्ट  –  माता के स्वास्थ्य की चिन्ता, माता से भावनात्मक दूरी, मानसिक स्वास्थ्य चुनौतियाँ।',
      sa: 'मातृअरिष्टयोगः  –  मातुः स्वास्थ्यचिन्ता मातृभावनात्मकदूरता मानसिकस्वास्थ्यपीडाश्च।',
    },
  });

  // Roga from 6th lord: 6th lord in lagna
  const lord6 = lordOf(6);
  const lord6InLagna = hOf(lord6) === 1;
  results.push({
    id: 'roga_6_in_1', category: 'inauspicious', isAuspicious: false, present: lord6InLagna,
    strength: lord6InLagna ? 'Moderate' : 'Weak',
    name: { en: 'Roga Yoga (6th Lord in Lagna)', hi: 'रोग योग (षष्ठेश लग्न में)', sa: 'रोगयोगः (षष्ठेशः लग्ने)' },
    formationRule: {
      en: '6th lord placed in Lagna (1st house)',
      hi: 'षष्ठ भाव का स्वामी लग्न में',
      sa: 'षष्ठेशः लग्नभावे',
    },
    description: {
      en: 'Disease lord in self  –  chronic health vulnerabilities, prone to illness, but also fighting spirit against disease, medical profession possible.',
      hi: 'रोगेश स्वभाव में  –  दीर्घकालिक स्वास्थ्य कमजोरियाँ, रोग प्रवणता, परन्तु रोग से लड़ने की शक्ति भी।',
      sa: 'रोगेशः लग्ने  –  दीर्घकालिकस्वास्थ्यदुर्बलता रोगप्रवणता परन्तु रोगयुद्धशक्तिरपि।',
    },
  });

  // Arishta Bhanga: Lagna lord in kendra in own/exalted sign  –  cancels arishta
  const lagnaLord = lordOf(1);
  const lagnaLordP = getP(planets, lagnaLord);
  const arishtaBhangaPresent = KENDRA.includes(lagnaLordP.house) && (lagnaLordP.isOwnSign || lagnaLordP.isExalted);
  results.push({
    id: 'arishta_bhanga', category: 'other', isAuspicious: true, present: arishtaBhangaPresent,
    strength: arishtaBhangaPresent ? 'Strong' : 'Weak',
    name: { en: 'Arishta Bhanga Yoga', hi: 'अरिष्ट भंग योग', sa: 'अरिष्टभङ्गयोगः' },
    formationRule: {
      en: 'Lagna lord in kendra in own or exalted sign',
      hi: 'लग्नेश केन्द्र में स्वराशि या उच्च राशि में',
      sa: 'लग्नेशः केन्द्रे स्वोच्चराशौ',
    },
    description: {
      en: 'Cancellation of danger  –  strong lagna lord protects against all arishta yogas, grants recovery from illness, accident survival, overcoming adversity.',
      hi: 'अरिष्ट भंग  –  बलवान लग्नेश सभी अरिष्ट योगों से रक्षा करता है, रोग से स्वस्थता, विपत्ति पर विजय।',
      sa: 'अरिष्टभङ्गः  –  बलवान् लग्नेशः सर्वारिष्टेभ्यो रक्षति रोगात् स्वस्थतां विपत्तिविजयं च ददाति।',
    },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Moon-sign Yogas  –  additional lunar combinations
// ---------------------------------------------------------------------------

function detectMoonSignYogas(planets: PlanetData[], ascSign: number): YogaComplete[] {
  const results: YogaComplete[] = [];
  const moon = getP(planets, 1);
  const jupiter = getP(planets, 4);

  // Varchasvi: Moon in own sign aspected by Jupiter
  const moonInOwn = moon.isOwnSign;
  const jupAspectsMoon = planetsAspectEachOther(jupiter, moon);
  const varchasviPresent = moonInOwn && jupAspectsMoon;
  results.push({
    id: 'varchasvi', category: 'moon_based', isAuspicious: true, present: varchasviPresent,
    strength: varchasviPresent ? 'Strong' : 'Weak',
    name: { en: 'Varchasvi Yoga', hi: 'वर्चस्वी योग', sa: 'वर्चस्वीयोगः' },
    formationRule: {
      en: 'Moon in own sign aspected by Jupiter',
      hi: 'चन्द्र स्वराशि में बृहस्पति की दृष्टि सहित',
      sa: 'चन्द्रः स्वराशौ गुरुदृष्टियुक्तः',
    },
    description: {
      en: 'Radiant lustre  –  charismatic personality, magnetic appeal, emotional intelligence, leadership through charm and wisdom.',
      hi: 'वर्चस्वी  –  करिश्माई व्यक्तित्व, चुम्बकीय आकर्षण, भावनात्मक बुद्धिमत्ता, आकर्षण और ज्ञान से नेतृत्व।',
      sa: 'वर्चस्वीयोगः  –  तेजस्विव्यक्तित्वं चुम्बकीयाकर्षणं भावनात्मकप्रज्ञा आकर्षणज्ञानाभ्यां नेतृत्वं च।',
    },
  });

  // Pushkala from Moon: Moon in friend's sign, lord of Moon sign in kendra
  // Friendly signs for Moon: Taurus(2-own), Cancer(4-own), Aries(1-Sun), Leo(5-Sun),
  // Gemini(3-Mercury), Virgo(6-Mercury)  –  Sun and Mercury are friends of Moon per BPHS
  const moonFriendSigns = [1, 2, 3, 4, 5, 6]; // Signs ruled by Sun, Moon, Mercury
  const moonInFriendSign = moonFriendSigns.includes(moon.sign);
  const moonSignLord = signLord(moon.sign);
  const moonSignLordInKendra = KENDRA.includes(getP(planets, moonSignLord).house);
  const pushkalaMoonPresent = moonInFriendSign && moonSignLordInKendra;
  results.push({
    id: 'pushkala_moon', category: 'moon_based', isAuspicious: true, present: pushkalaMoonPresent,
    strength: pushkalaMoonPresent ? 'Moderate' : 'Weak',
    name: { en: 'Pushkala Yoga (Moon)', hi: 'पुष्कल योग (चन्द्र)', sa: 'पुष्कलयोगः (चन्द्रात्)' },
    formationRule: {
      en: 'Moon in friend\'s sign, Moon-sign lord in kendra',
      hi: 'चन्द्र मित्र राशि में, चन्द्र-राशि-स्वामी केन्द्र में',
      sa: 'चन्द्रः मित्रराशौ चन्द्रराशीशः केन्द्रे',
    },
    description: {
      en: 'Nourished Moon  –  emotional wellbeing, public popularity, abundance of comforts, respected in community.',
      hi: 'पोषित चन्द्र  –  भावनात्मक कल्याण, जन लोकप्रियता, सुखों की प्रचुरता।',
      sa: 'पुष्कलचन्द्रयोगः  –  भावनात्मककल्याणं जनलोकप्रियता सुखप्रचुरता च।',
    },
  });

  // Adhi from Moon (extended): Only benefics in 6th, 7th, 8th from Moon
  const beneficIn6fm = planets.filter(p => isBenefic(p.id) && houseOffset(moon.house, p.house) === 6);
  const beneficIn7fm = planets.filter(p => isBenefic(p.id) && houseOffset(moon.house, p.house) === 7);
  const beneficIn8fm = planets.filter(p => isBenefic(p.id) && houseOffset(moon.house, p.house) === 8);
  const malIn6fm = planets.some(p => isMalefic(p.id) && houseOffset(moon.house, p.house) === 6);
  const malIn7fm = planets.some(p => isMalefic(p.id) && houseOffset(moon.house, p.house) === 7);
  const malIn8fm = planets.some(p => isMalefic(p.id) && houseOffset(moon.house, p.house) === 8);
  const adhiExtPresent = beneficIn6fm.length > 0 && beneficIn7fm.length > 0 && beneficIn8fm.length > 0 && !malIn6fm && !malIn7fm && !malIn8fm;
  results.push({
    id: 'adhi_moon_ext', category: 'moon_based', isAuspicious: true, present: adhiExtPresent,
    strength: adhiExtPresent ? 'Strong' : 'Weak',
    name: { en: 'Adhi Yoga (Pure Moon)', hi: 'अधि योग (शुद्ध चन्द्र)', sa: 'अधियोगः (शुद्धचन्द्रात्)' },
    formationRule: {
      en: 'Only benefics (no malefics) in 6th, 7th, 8th from Moon',
      hi: 'चन्द्र से 6, 7, 8 में केवल शुभ ग्रह (पाप नहीं)',
      sa: 'चन्द्रात् षष्ठ-सप्तम-अष्टमे केवलं शुभग्रहाः',
    },
    description: {
      en: 'Pure Adhi Yoga  –  uncontaminated benefic support around Moon grants ministerial position, trust of rulers, prosperity without enemies.',
      hi: 'शुद्ध अधि योग  –  चन्द्र के चारों ओर अविकृत शुभ सहायता मंत्री पद, शासकों का विश्वास, शत्रु रहित समृद्धि देता है।',
      sa: 'शुद्धाधियोगः  –  चन्द्रपरितः अविकृतशुभसाहाय्यं मन्त्रिपदं शासकविश्वासः शत्रुरहितसमृद्धिश्च।',
    },
  });

  // Amrita: Moon conjunct benefic in kendra from lagna
  const moonInKendra = KENDRA.includes(moon.house);
  const beneficConjunctMoon = moonInKendra && planets.some(p => isBenefic(p.id) && p.id !== 1 && inSameHouse(p, moon));
  results.push({
    id: 'amrita_yoga', category: 'moon_based', isAuspicious: true, present: beneficConjunctMoon,
    strength: beneficConjunctMoon ? 'Moderate' : 'Weak',
    name: { en: 'Amrita Yoga', hi: 'अमृत योग', sa: 'अमृतयोगः' },
    formationRule: {
      en: 'Moon conjunct a benefic in a kendra from Lagna',
      hi: 'चन्द्र लग्न से केन्द्र में शुभ ग्रह के साथ',
      sa: 'चन्द्रः लग्नात् केन्द्रे शुभग्रहयुक्तः',
    },
    description: {
      en: 'Nectar yoga  –  Moon strengthened by benefic conjunction in kendra grants longevity, emotional harmony, public love, and healing ability.',
      hi: 'अमृत योग  –  केन्द्र में शुभ युति से बलवान चन्द्र दीर्घायु, भावनात्मक सामंजस्य, जनप्रेम देता है।',
      sa: 'अमृतयोगः  –  केन्द्रे शुभयुत्या बलवान् चन्द्रः दीर्घायुं भावनात्मकसामञ्जस्यं जनप्रेमं च ददाति।',
    },
  });

  // Chandra-Surya: Sun and Moon in same sign (Amavasya yoga)
  const sunMoonSameSign = getP(planets, 0).sign === moon.sign;
  results.push({
    id: 'chandra_surya', category: 'moon_based', isAuspicious: false, present: sunMoonSameSign,
    strength: sunMoonSameSign ? 'Moderate' : 'Weak',
    name: { en: 'Chandra-Surya Yoga (Amavasya)', hi: 'चन्द्र-सूर्य योग (अमावस्या)', sa: 'चन्द्रसूर्ययोगः (अमावास्या)' },
    formationRule: {
      en: 'Sun and Moon in the same sign (new Moon birth)',
      hi: 'सूर्य और चन्द्र एक ही राशि में (अमावस्या जन्म)',
      sa: 'सूर्यचन्द्रौ एकराशिस्थौ (अमावास्याजन्म)',
    },
    description: {
      en: 'New Moon birth  –  Moon weakened by solar proximity, emotional struggles, introspective nature, but concentrated willpower and spiritual depth.',
      hi: 'अमावस्या जन्म  –  सौर सान्निध्य से चन्द्र दुर्बल, भावनात्मक संघर्ष, परन्तु एकाग्र इच्छाशक्ति और आध्यात्मिक गहराई।',
      sa: 'अमावास्याजन्म  –  सौरसान्निध्यात् चन्द्रदुर्बलः भावनात्मकसंघर्षः परन्तु एकाग्रइच्छाशक्तिः आध्यात्मिकगभीरता च।',
    },
  });

  return results;
}

// ---------------------------------------------------------------------------
// Navamsha (D9) Yogas
// ---------------------------------------------------------------------------

function detectNavamshaYogas(planets: PlanetData[], ascendantSign: number, ascendantLongitude?: number): YogaComplete[] {
  const results: YogaComplete[] = [];

  // Helper: compute navamsha sign from longitude (1-based, 1=Aries..12=Pisces)
  function navamshaSignFromLong(longitude: number): number {
    const navamshaIndex = Math.floor((longitude % 360) / (360 / 108)); // 108 navamshas total
    return (navamshaIndex % 12) + 1;
  }

  // 1. Vargottama Lagna  –  ascendant sign same in D1 and D9
  if (ascendantLongitude !== undefined) {
    const lagnaD9Sign = navamshaSignFromLong(ascendantLongitude);
    const isVargottamaLagna = ascendantSign === lagnaD9Sign;
    results.push({
      id: 'vargottama_lagna',
      name: {
        en: 'Vargottama Lagna',
        hi: 'वर्गोत्तम लग्न',
        sa: 'वर्गोत्तमलग्नम्',
      },
      category: 'other',
      isAuspicious: true,
      present: isVargottamaLagna,
      strength: isVargottamaLagna ? 'Strong' : 'Weak',
      formationRule: {
        en: 'Ascendant (lagna) occupies the same sign in both D1 (rashi) and D9 (navamsha)  –  the lagna\'s energy is doubled.',
        hi: 'लग्न D1 (राशि) और D9 (नवांश) दोनों में एक ही राशि में  –  लग्न की ऊर्जा दोगुनी हो जाती है।',
        sa: 'लग्नं D1 (राशौ) D9 (नवांशे) च समानराशौ  –  लग्नस्य ऊर्जा द्विगुणा भवति।',
      },
      description: {
        en: isVargottamaLagna
          ? 'The ascendant is vargottama  –  its sign is identical in rashi and navamsha. This is highly auspicious, doubling the ascendant\'s strength and giving the native strong self-identity, resilience, and life direction.'
          : 'The ascendant is not vargottama  –  D1 and D9 lagna signs differ.',
        hi: isVargottamaLagna
          ? 'लग्न वर्गोत्तम है  –  राशि और नवांश में इसकी राशि समान है। यह अत्यंत शुभ है, जो लग्न की शक्ति दोगुनी करता है।'
          : 'लग्न वर्गोत्तम नहीं है  –  D1 और D9 लग्न राशियाँ भिन्न हैं।',
        sa: isVargottamaLagna
          ? 'लग्नं वर्गोत्तमं  –  राशौ नवांशे च तस्य राशिः समाना। अत्यन्तशुभं लग्नबलं द्विगुणयति।'
          : 'लग्नं वर्गोत्तमं नास्ति  –  D1 D9 लग्नराशी भिन्ने।',
      },
    });
  }

  // 2. Pushkara Navamsha Yoga  –  3+ planets in Pushkara Navamsha
  const pushkaraCount = planets.filter(p => p.isPushkarNavamsha === true).length;
  results.push({
    id: 'pushkara_navamsha_yoga',
    name: {
      en: 'Pushkara Navamsha Yoga',
      hi: 'पुष्कर नवांश योग',
      sa: 'पुष्करनवांशयोगः',
    },
    category: 'other',
    isAuspicious: true,
    present: pushkaraCount >= 3,
    strength: pushkaraCount >= 5 ? 'Strong' : pushkaraCount >= 4 ? 'Moderate' : 'Weak',
    formationRule: {
      en: '3 or more planets in Pushkara Navamsha positions  –  the most auspicious D9 divisions.',
      hi: '3 या अधिक ग्रह पुष्कर नवांश स्थानों में  –  सबसे शुभ D9 विभाग।',
      sa: 'त्रयः वा अधिकाः ग्रहाः पुष्करनवांशस्थानेषु  –  अत्यन्तशुभं D9 विभागम्।',
    },
    description: {
      en: `${pushkaraCount} planet(s) in Pushkara Navamsha. These nourishing positions amplify planetary beneficence, granting luck, protection, and abundance in the areas governed by those planets.`,
      hi: `${pushkaraCount} ग्रह पुष्कर नवांश में। ये पोषक स्थितियाँ ग्रहों की शुभता बढ़ाती हैं, उन ग्रहों द्वारा शासित क्षेत्रों में भाग्य, सुरक्षा और समृद्धि प्रदान करती हैं।`,
      sa: `${pushkaraCount} ग्रहाः पुष्करनवांशे। एतानि पोषकस्थानानि ग्रहशुभत्वं वर्धयन्ति, तैः ग्रहैः शासितक्षेत्रेषु भाग्यं रक्षां समृद्धिं च प्रयच्छन्ति।`,
    },
  });

  // 3. Navamsha Parivartana  –  two planets exchange signs in D9
  // Planet A's D9 sign = Planet B's D1 sign AND Planet B's D9 sign = Planet A's D1 sign
  const navParivartanaPairs: string[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const a = planets[i];
      const b = planets[j];
      if (a.navamshaSign && b.navamshaSign &&
          a.navamshaSign === b.sign && b.navamshaSign === a.sign) {
        navParivartanaPairs.push(`${GRAHA_EN[a.id]}-${GRAHA_EN[b.id]}`);
      }
    }
  }
  results.push({
    id: 'navamsha_parivartana',
    name: {
      en: 'Navamsha Parivartana Yoga',
      hi: 'नवांश परिवर्तन योग',
      sa: 'नवांशपरिवर्तनयोगः',
    },
    category: 'other',
    isAuspicious: true,
    present: navParivartanaPairs.length > 0,
    strength: navParivartanaPairs.length >= 2 ? 'Strong' : 'Moderate',
    formationRule: {
      en: 'Two planets exchange signs between D1 and D9  –  planet A\'s navamsha sign is planet B\'s rashi sign and vice versa.',
      hi: 'दो ग्रह D1 और D9 के बीच राशि विनिमय करते हैं  –  ग्रह A का नवांश राशि ग्रह B का राशि है और इसके विपरीत।',
      sa: 'द्वौ ग्रहौ D1-D9-मध्ये राशिविनिमयं कुरुतः  –  ग्रहस्य A नवांशराशिः ग्रहस्य B राशिः इति विपर्ययेण च।',
    },
    description: {
      en: navParivartanaPairs.length > 0
        ? `D9 exchange between ${navParivartanaPairs.join(', ')}. This powerful exchange creates a deep karmic bond between the planets, strengthening both in their D9 significations  –  marriage, dharma, and inner purpose.`
        : 'No navamsha exchange found between any planet pair.',
      hi: navParivartanaPairs.length > 0
        ? `${navParivartanaPairs.join(', ')} के बीच D9 विनिमय। यह शक्तिशाली विनिमय ग्रहों के बीच गहरा कार्मिक बंधन बनाता है।`
        : 'किसी ग्रह जोड़ी के बीच नवांश विनिमय नहीं पाया गया।',
      sa: navParivartanaPairs.length > 0
        ? `${navParivartanaPairs.join(', ')} मध्ये D9 विनिमयः। एषः शक्तिमान् विनिमयः ग्रहयोः मध्ये गभीरं कार्मिकबन्धनं रचयति।`
        : 'कस्यापि ग्रहयुगलस्य मध्ये नवांशविनिमयः न दृष्टः।',
    },
  });

  // 4. D9 Exaltation Yoga  –  planet exalted in navamsha
  for (let i = 0; i < planets.length; i++) {
    const p = planets[i];
    if (p.navamshaSign === undefined) continue;
    const exaltSign = EXALTATION_SIGNS[p.id];
    if (exaltSign === undefined) continue; // Rahu/Ketu don't have standard exaltation
    const isD9Exalted = p.navamshaSign === exaltSign;
    results.push({
      id: `d9_exalt_${GRAHA_EN[p.id].toLowerCase()}`,
      name: {
        en: `D9 Exaltation  –  ${GRAHA_EN[p.id]}`,
        hi: `D9 उच्च  –  ${GRAHA_HI[p.id]}`,
        sa: `D9 उच्चम्  –  ${GRAHA_EN[p.id]}`,
      },
      category: 'other',
      isAuspicious: true,
      present: isD9Exalted,
      strength: isD9Exalted ? 'Moderate' : 'Weak',
      formationRule: {
        en: `${GRAHA_EN[p.id]} in its exaltation sign in Navamsha (D9)  –  deep inner strength in ${GRAHA_EN[p.id]}'s significations.`,
        hi: `${GRAHA_HI[p.id]} नवांश (D9) में अपनी उच्च राशि में  –  ${GRAHA_HI[p.id]} के कारकत्वों में गहरी आंतरिक शक्ति।`,
        sa: `${GRAHA_EN[p.id]} नवांशे (D9) स्वोच्चराशौ  –  ${GRAHA_EN[p.id]} कारकत्वेषु गभीरा आन्तरिकशक्तिः।`,
      },
      description: {
        en: isD9Exalted
          ? `${GRAHA_EN[p.id]} is exalted in D9, indicating deep soul-level strength. The planet's qualities manifest powerfully in marriage, dharma, and spiritual life.`
          : `${GRAHA_EN[p.id]} is not exalted in D9.`,
        hi: isD9Exalted
          ? `${GRAHA_HI[p.id]} D9 में उच्च है, जो गहरी आत्म-स्तरीय शक्ति दर्शाता है।`
          : `${GRAHA_HI[p.id]} D9 में उच्च नहीं है।`,
        sa: isD9Exalted
          ? `${GRAHA_EN[p.id]} D9 उच्चराशौ, गभीरां आत्मस्तरीयां शक्तिं दर्शयति।`
          : `${GRAHA_EN[p.id]} D9 उच्चराशौ नास्ति।`,
      },
    });
  }

  // 5. D9 Debilitation Yoga  –  planet debilitated in navamsha
  for (let i = 0; i < planets.length; i++) {
    const p = planets[i];
    if (p.navamshaSign === undefined) continue;
    const debSign = DEBILITATION_SIGNS[p.id];
    if (debSign === undefined) continue;
    const isD9Debilitated = p.navamshaSign === debSign;
    results.push({
      id: `d9_debil_${GRAHA_EN[p.id].toLowerCase()}`,
      name: {
        en: `D9 Debilitation  –  ${GRAHA_EN[p.id]}`,
        hi: `D9 नीच  –  ${GRAHA_HI[p.id]}`,
        sa: `D9 नीचम्  –  ${GRAHA_EN[p.id]}`,
      },
      category: 'inauspicious',
      isAuspicious: false,
      present: isD9Debilitated,
      strength: isD9Debilitated ? 'Moderate' : 'Weak',
      formationRule: {
        en: `${GRAHA_EN[p.id]} in its debilitation sign in Navamsha (D9)  –  inner weakness in ${GRAHA_EN[p.id]}'s areas.`,
        hi: `${GRAHA_HI[p.id]} नवांश (D9) में अपनी नीच राशि में  –  ${GRAHA_HI[p.id]} के क्षेत्रों में आंतरिक दुर्बलता।`,
        sa: `${GRAHA_EN[p.id]} नवांशे (D9) स्वनीचराशौ  –  ${GRAHA_EN[p.id]} क्षेत्रेषु आन्तरिकदौर्बल्यम्।`,
      },
      description: {
        en: isD9Debilitated
          ? `${GRAHA_EN[p.id]} is debilitated in D9, suggesting inner weakness or karmic challenges in ${GRAHA_EN[p.id]}'s significations  –  marriage, spirituality, and dharma may require extra conscious effort.`
          : `${GRAHA_EN[p.id]} is not debilitated in D9.`,
        hi: isD9Debilitated
          ? `${GRAHA_HI[p.id]} D9 में नीच है, जो ${GRAHA_HI[p.id]} के कारकत्वों में आंतरिक दुर्बलता या कार्मिक चुनौतियाँ सुझाता है।`
          : `${GRAHA_HI[p.id]} D9 में नीच नहीं है।`,
        sa: isD9Debilitated
          ? `${GRAHA_EN[p.id]} D9 नीचराशौ, आन्तरिकदौर्बल्यं कार्मिकप्रत्यूहान् वा ${GRAHA_EN[p.id]} कारकत्वेषु सूचयति।`
          : `${GRAHA_EN[p.id]} D9 नीचराशौ नास्ति।`,
      },
    });
  }

  // 6. Navamsha Rajayoga  –  Jupiter AND Venus both in benefic navamsha signs
  // Benefic D9 signs: Sagittarius(9), Pisces(12), Taurus(2), Libra(7), Cancer(4)
  const BENEFIC_D9_SIGNS = [9, 12, 2, 7, 4];
  const jupiter = getP(planets, 4);
  const venus = getP(planets, 5);
  const jupInBeneficD9 = jupiter.navamshaSign !== undefined && BENEFIC_D9_SIGNS.includes(jupiter.navamshaSign);
  const venInBeneficD9 = venus.navamshaSign !== undefined && BENEFIC_D9_SIGNS.includes(venus.navamshaSign);
  const navRajayoga = jupInBeneficD9 && venInBeneficD9;
  results.push({
    id: 'navamsha_rajayoga',
    name: {
      en: 'Navamsha Rajayoga',
      hi: 'नवांश राजयोग',
      sa: 'नवांशराजयोगः',
    },
    category: 'raja',
    isAuspicious: true,
    present: navRajayoga,
    strength: navRajayoga ? 'Strong' : 'Weak',
    formationRule: {
      en: 'Jupiter and Venus both in benefic navamsha signs (Sagittarius, Pisces, Taurus, Libra, or Cancer)  –  double benefic strength in D9.',
      hi: 'बृहस्पति और शुक्र दोनों शुभ नवांश राशियों (धनु, मीन, वृषभ, तुला, या कर्क) में  –  D9 में दोहरी शुभ शक्ति।',
      sa: 'बृहस्पतिशुक्रौ उभौ शुभनवांशराशिषु (धनुमीनवृषभतुलाकर्कटेषु)  –  D9 द्विगुणशुभबलम्।',
    },
    description: {
      en: navRajayoga
        ? 'Both Jupiter and Venus occupy benefic navamsha signs, creating powerful D9 Rajayoga. This blesses marriage, dharma, wealth, and spiritual growth with strong benefic support at the soul level.'
        : 'Jupiter and Venus are not both in benefic navamsha signs.',
      hi: navRajayoga
        ? 'बृहस्पति और शुक्र दोनों शुभ नवांश राशियों में हैं, शक्तिशाली D9 राजयोग बना रहे हैं।'
        : 'बृहस्पति और शुक्र दोनों शुभ नवांश राशियों में नहीं हैं।',
      sa: navRajayoga
        ? 'बृहस्पतिशुक्रौ उभौ शुभनवांशराशिषु स्थितौ, शक्तिमन्तं D9 राजयोगं रचयतः।'
        : 'बृहस्पतिशुक्रौ उभौ शुभनवांशराशिषु न स्थितौ।',
    },
  });

  // 7. Navamsha Neecha Bhanga  –  debilitated in D1 but own/exalted in D9
  for (let i = 0; i < planets.length; i++) {
    const p = planets[i];
    if (p.navamshaSign === undefined) continue;
    if (!p.isDebilitated) continue; // only applies to D1-debilitated planets
    const ownSigns = OWN_SIGNS[p.id] ?? [];
    const exaltSign = EXALTATION_SIGNS[p.id];
    const isNeechaBhanga = ownSigns.includes(p.navamshaSign) || p.navamshaSign === exaltSign;
    results.push({
      id: `d9_neecha_bhanga_${GRAHA_EN[p.id].toLowerCase()}`,
      name: {
        en: `Navamsha Neecha Bhanga  –  ${GRAHA_EN[p.id]}`,
        hi: `नवांश नीच भंग  –  ${GRAHA_HI[p.id]}`,
        sa: `नवांशनीचभङ्गः  –  ${GRAHA_EN[p.id]}`,
      },
      category: 'other',
      isAuspicious: true,
      present: isNeechaBhanga,
      strength: p.navamshaSign === exaltSign ? 'Strong' : 'Moderate',
      formationRule: {
        en: `${GRAHA_EN[p.id]} is debilitated in D1 but in own sign or exalted in D9  –  cancellation of debilitation at the soul level.`,
        hi: `${GRAHA_HI[p.id]} D1 में नीच लेकिन D9 में स्वराशि या उच्च  –  आत्म स्तर पर नीच भंग।`,
        sa: `${GRAHA_EN[p.id]} D1 नीचे परन्तु D9 स्वराशौ उच्चे वा  –  आत्मस्तरे नीचभङ्गः।`,
      },
      description: {
        en: isNeechaBhanga
          ? `${GRAHA_EN[p.id]}'s D1 debilitation is cancelled in D9  –  the planet's weakness on the surface hides deep inner strength. Over time, ${GRAHA_EN[p.id]}'s significations improve dramatically, especially in marriage and dharmic pursuits.`
          : `${GRAHA_EN[p.id]} is debilitated in D1 without D9 cancellation.`,
        hi: isNeechaBhanga
          ? `${GRAHA_HI[p.id]} की D1 नीचता D9 में रद्द हो गई है  –  सतह पर ग्रह की दुर्बलता गहरी आंतरिक शक्ति छुपाती है।`
          : `${GRAHA_HI[p.id]} D1 में नीच है बिना D9 रद्दीकरण के।`,
        sa: isNeechaBhanga
          ? `${GRAHA_EN[p.id]} D1 नीचता D9 मध्ये निरस्ता  –  पृष्ठभागे ग्रहदौर्बल्यं गभीरां आन्तरिकशक्तिं गूहति।`
          : `${GRAHA_EN[p.id]} D1 नीचे D9 निरासनं विना।`,
      },
    });
  }

  // 8. D9 Atmakaraka Strength  –  Atmakaraka in own/exalted sign in D9 (Karakamsha)
  // Atmakaraka = planet with highest longitude within its sign (max longitude % 30) among Sun-Saturn (0-6)
  const sunToSaturn = planets.filter(p => p.id >= 0 && p.id <= 6);
  let atmakaraka: PlanetData | null = null;
  let maxDegInSign = -1;
  for (const p of sunToSaturn) {
    const degInSign = p.longitude % 30;
    if (degInSign > maxDegInSign) {
      maxDegInSign = degInSign;
      atmakaraka = p;
    }
  }

  if (atmakaraka && atmakaraka.navamshaSign !== undefined) {
    const akOwnSigns = OWN_SIGNS[atmakaraka.id] ?? [];
    const akExaltSign = EXALTATION_SIGNS[atmakaraka.id];
    const akStrong = akOwnSigns.includes(atmakaraka.navamshaSign) || atmakaraka.navamshaSign === akExaltSign;
    results.push({
      id: 'd9_atmakaraka_strength',
      name: {
        en: 'D9 Atmakaraka Strength',
        hi: 'D9 आत्मकारक बल',
        sa: 'D9 आत्मकारकबलम्',
      },
      category: 'other',
      isAuspicious: true,
      present: akStrong,
      strength: atmakaraka.navamshaSign === akExaltSign ? 'Strong' : akOwnSigns.includes(atmakaraka.navamshaSign) ? 'Moderate' : 'Weak',
      formationRule: {
        en: `Atmakaraka (${GRAHA_EN[atmakaraka.id]}) in own or exalted sign in D9 (Karakamsha)  –  Jaimini considers this the most important D9 placement.`,
        hi: `आत्मकारक (${GRAHA_HI[atmakaraka.id]}) D9 (कारकांश) में स्वराशि या उच्च  –  जैमिनि इसे सबसे महत्वपूर्ण D9 स्थिति मानते हैं।`,
        sa: `आत्मकारकः (${GRAHA_EN[atmakaraka.id]}) D9 (कारकांशे) स्वराशौ उच्चे वा  –  जैमिनिः एतत् सर्वाधिकमहत्त्वपूर्णं D9 स्थानं मन्यते।`,
      },
      description: {
        en: akStrong
          ? `The Atmakaraka ${GRAHA_EN[atmakaraka.id]} is dignified in D9 (Karakamsha), indicating a strong soul purpose. The native's deepest dharma is well-supported, with clarity of life direction and spiritual maturity.`
          : `The Atmakaraka ${GRAHA_EN[atmakaraka.id]} is not in own or exalted sign in D9  –  the soul's purpose may require more conscious cultivation.`,
        hi: akStrong
          ? `आत्मकारक ${GRAHA_HI[atmakaraka.id]} D9 (कारकांश) में बलवान है, मजबूत आत्म उद्देश्य दर्शाता है।`
          : `आत्मकारक ${GRAHA_HI[atmakaraka.id]} D9 में स्वराशि या उच्च में नहीं है।`,
        sa: akStrong
          ? `आत्मकारकः ${GRAHA_EN[atmakaraka.id]} D9 (कारकांशे) बलवान्, दृढं आत्मप्रयोजनं दर्शयति।`
          : `आत्मकारकः ${GRAHA_EN[atmakaraka.id]} D9 स्वराशौ उच्चे वा नास्ति।`,
      },
    });
  }

  return results;
}

export function detectAllYogas(planets: PlanetData[], ascendantSign: number, ascendantLongitude?: number): YogaComplete[] {
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
    ...detectNabhasaAkritiYogas(planets, ascendantSign),
    ...detectExpandedDaridraYogas(planets, ascendantSign),
    ...detectSannyasaYogas(planets, ascendantSign),
    ...detectNamedDhanaYogas(planets, ascendantSign),
    ...detectAdditionalArishtaYogas(planets, ascendantSign),
    ...detectMoonSignYogas(planets, ascendantSign),
    ...detectNavamshaYogas(planets, ascendantSign, ascendantLongitude),
  ];
}
