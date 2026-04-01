/**
 * Comprehensive, personalized Sade Sati analysis engine.
 * Produces detailed, individualized interpretations based on
 * Moon sign, ascendant, natal Saturn, dasha, and Ashtakavarga.
 */

import {
  normalizeDeg,
  toSidereal,
  lahiriAyanamsha,
  getRashiNumber,
  dateToJD,
  getPlanetaryPositions,
} from '@/lib/ephem/astronomical';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SadeSatiAnalysis {
  isActive: boolean;
  currentPhase: 'rising' | 'peak' | 'setting' | null;
  phaseProgress: number;
  cycleStart: string;
  cycleEnd: string;

  allCycles: SadeSatiCycle[];
  currentCycleIndex: number;

  overallIntensity: number;
  intensityFactors: IntensityFactor[];

  interpretation: {
    summary: { en: string; hi: string };
    phaseEffect: { en: string; hi: string };
    saturnNature: { en: string; hi: string };
    moonStrength: { en: string; hi: string };
    dashaInterplay: { en: string; hi: string };
    ashtakavargaInsight: { en: string; hi: string };
    nakshatraTransit: { en: string; hi: string };
    houseEffect: { en: string; hi: string };
  };

  remedies: {
    title: { en: string; hi: string };
    description: { en: string; hi: string };
    priority: 'essential' | 'recommended' | 'optional';
  }[];
}

export interface SadeSatiCycle {
  startYear: number;
  endYear: number;
  saturnSign: number;
  isActive: boolean;
  phases: { phase: 'rising' | 'peak' | 'setting'; startYear: number; endYear: number }[];
}

export interface IntensityFactor {
  factor: string;
  score: number;
  description: { en: string; hi: string };
}

export interface SadeSatiInput {
  moonSign: number;
  moonNakshatra?: number;
  moonDegree?: number;
  ascendantSign?: number;
  saturnSign?: number;
  saturnHouse?: number;
  saturnRetrograde?: boolean;
  ashtakavargaSaturnBindus?: number[];
  currentDasha?: { planet: string; startDate: string; endDate: string };
  currentAntar?: { planet: string; startDate: string; endDate: string };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RASHI_EN = ['', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const RASHI_HI = ['', 'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];

const NAKSHATRA_EN = ['', 'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const NAKSHATRA_HI = ['', 'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वा फाल्गुनी', 'उत्तरा फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती', 'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वा भाद्रपद', 'उत्तरा भाद्रपद', 'रेवती'];

// Nakshatras that fall in each rashi (approximate, 2.25 nakshatras per rashi)
function nakshatrasInSign(sign: number): number[] {
  // Each rashi spans 30 degrees = 2.25 nakshatras
  const startNak = Math.floor(((sign - 1) * 30) / (360 / 27)) + 1;
  const endNak = Math.floor(((sign) * 30 - 0.01) / (360 / 27)) + 1;
  const result: number[] = [];
  for (let n = startNak; n <= endNak && n <= 27; n++) result.push(n);
  return result;
}

// Moon friendship with signs (simplified)
function moonSignStrength(sign: number): 'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated' {
  if (sign === 2) return 'exalted';
  if (sign === 4) return 'own';
  if (sign === 8) return 'debilitated';
  // Friendly: ruled by Sun(Leo=5), Mars(Aries=1,Scorpio=8 already covered), Jupiter(Sag=9,Pisces=12)
  if ([1, 5, 9, 12].includes(sign)) return 'friendly';
  // Enemy: Saturn(Capricorn=10,Aquarius=11), Rahu-influenced
  if ([10, 11].includes(sign)) return 'enemy';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// Cycle detection
// ---------------------------------------------------------------------------

function buildAllCycles(moonSign: number): SadeSatiCycle[] {
  const sign12th = ((moonSign - 2 + 12) % 12) + 1; // 12th from moon
  const sign1st = moonSign;
  const sign2nd = (moonSign % 12) + 1;
  const targetSigns = [sign12th, sign1st, sign2nd];

  // Scan 1940-2070 at mid-year
  const saturnPerYear: { year: number; sign: number }[] = [];
  for (let y = 1940; y <= 2070; y++) {
    const jd = dateToJD(y, 6, 15, 12);
    const planets = getPlanetaryPositions(jd);
    const saturnTropical = planets[6]?.longitude ?? 0; // Saturn = index 6
    const saturnSid = toSidereal(saturnTropical, jd);
    const saturnRashi = getRashiNumber(normalizeDeg(saturnSid));
    saturnPerYear.push({ year: y, sign: saturnRashi });
  }

  // Group consecutive years where Saturn is in one of the 3 target signs
  const cycles: SadeSatiCycle[] = [];
  let cycleYears: { year: number; sign: number }[] = [];

  for (const entry of saturnPerYear) {
    if (targetSigns.includes(entry.sign)) {
      cycleYears.push(entry);
    } else {
      if (cycleYears.length > 0) {
        cycles.push(buildCycle(cycleYears, moonSign, sign12th, sign1st, sign2nd));
        cycleYears = [];
      }
    }
  }
  if (cycleYears.length > 0) {
    cycles.push(buildCycle(cycleYears, moonSign, sign12th, sign1st, sign2nd));
  }

  return cycles;
}

function buildCycle(
  years: { year: number; sign: number }[],
  moonSign: number,
  sign12th: number,
  sign1st: number,
  sign2nd: number
): SadeSatiCycle {
  const phases: SadeSatiCycle['phases'] = [];

  // Group by phase
  let currentPhase: 'rising' | 'peak' | 'setting' | null = null;
  let phaseStart = years[0].year;

  for (let i = 0; i < years.length; i++) {
    const s = years[i].sign;
    const phase: 'rising' | 'peak' | 'setting' = s === sign12th ? 'rising' : s === sign1st ? 'peak' : 'setting';
    if (phase !== currentPhase) {
      if (currentPhase !== null) {
        phases.push({ phase: currentPhase, startYear: phaseStart, endYear: years[i - 1].year });
      }
      currentPhase = phase;
      phaseStart = years[i].year;
    }
  }
  if (currentPhase !== null) {
    phases.push({ phase: currentPhase, startYear: phaseStart, endYear: years[years.length - 1].year });
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const isActive = years[0].year <= currentYear && currentYear <= years[years.length - 1].year;

  return {
    startYear: years[0].year,
    endYear: years[years.length - 1].year,
    saturnSign: moonSign,
    isActive,
    phases,
  };
}

// ---------------------------------------------------------------------------
// Current Saturn sign helper
// ---------------------------------------------------------------------------

export function getCurrentSaturnSign(): { sign: number; signName: { en: string; hi: string }; degree: number } {
  const now = new Date();
  const jd = dateToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), 12);
  const planets = getPlanetaryPositions(jd);
  const saturnTropical = planets[6]?.longitude ?? 0;
  const saturnSid = normalizeDeg(toSidereal(saturnTropical, jd));
  const sign = getRashiNumber(saturnSid);
  return {
    sign,
    signName: { en: RASHI_EN[sign], hi: RASHI_HI[sign] },
    degree: saturnSid % 30,
  };
}

// ---------------------------------------------------------------------------
// Intensity scoring
// ---------------------------------------------------------------------------

function scoreSaturnFunctionalNature(ascendant: number | undefined): IntensityFactor {
  if (ascendant === undefined) {
    return { factor: 'Saturn functional nature', score: 1, description: { en: 'Ascendant not provided; using neutral assessment.', hi: 'लग्न उपलब्ध नहीं; सामान्य आकलन।' } };
  }
  // Yogakaraka for Taurus and Libra
  if (ascendant === 2) return { factor: 'Saturn functional nature', score: 0, description: { en: 'Saturn is Yogakaraka for Taurus ascendant, ruling 9th and 10th houses. This Sade Sati carries a silver lining of career and fortune building.', hi: 'शनि वृषभ लग्न के लिए योगकारक हैं, 9वें और 10वें भाव के स्वामी। यह साढ़ेसाती करियर और भाग्य निर्माण का अवसर लाती है।' } };
  if (ascendant === 7) return { factor: 'Saturn functional nature', score: 0, description: { en: 'Saturn is Yogakaraka for Libra ascendant, ruling 4th and 5th houses. This Sade Sati, while testing, ultimately builds domestic happiness and creative success.', hi: 'शनि तुला लग्न के लिए योगकारक हैं, 4थे और 5वें भाव के स्वामी। यह साढ़ेसाती गृह सुख और सृजनात्मक सफलता का निर्माण करती है।' } };
  // Good houses for Capricorn and Aquarius
  if (ascendant === 10) return { factor: 'Saturn functional nature', score: 0.5, description: { en: 'Saturn rules the ascendant for Capricorn — a natural ally. Sade Sati is a period of self-reinvention rather than suffering.', hi: 'शनि मकर लग्न के स्वामी हैं — स्वाभाविक सहायक। साढ़ेसाती आत्म-नवीनीकरण का काल है, कष्ट का नहीं।' } };
  if (ascendant === 11) return { factor: 'Saturn functional nature', score: 0.5, description: { en: 'Saturn rules the ascendant for Aquarius — this gives structural resilience during Sade Sati.', hi: 'शनि कुम्भ लग्न के स्वामी हैं — साढ़ेसाती में संरचनात्मक दृढ़ता प्रदान करते हैं।' } };
  // Neutral
  if ([3, 6].includes(ascendant)) return { factor: 'Saturn functional nature', score: 1, description: { en: `Saturn is neutral for ${RASHI_EN[ascendant]} ascendant. Effects will depend on other factors.`, hi: `${RASHI_HI[ascendant]} लग्न के लिए शनि तटस्थ हैं। प्रभाव अन्य कारकों पर निर्भर करेगा।` } };
  // Malefic
  const maleficDesc: Record<number, { en: string; hi: string }> = {
    1: { en: 'Saturn rules 10th and 11th for Aries ascendant — a functional malefic. Sade Sati brings career pressure and social friction.', hi: 'शनि मेष लग्न के 10वें और 11वें भाव के स्वामी — कार्यात्मक पापी। साढ़ेसाती करियर दबाव और सामाजिक घर्षण लाती है।' },
    4: { en: 'Saturn rules 7th and 8th for Cancer ascendant — a maraka and malefic. Relationships and health need extra care.', hi: 'शनि कर्क लग्न के 7वें और 8वें भाव के स्वामी — मारक और पापी। संबंध और स्वास्थ्य पर विशेष ध्यान दें।' },
    5: { en: 'Saturn rules 6th and 7th for Leo ascendant — adversarial. Sade Sati intensifies conflicts, legal matters, and relationship tests.', hi: 'शनि सिंह लग्न के 6ठे और 7वें भाव के स्वामी — विरोधी। साढ़ेसाती संघर्ष, कानूनी मामले और संबंध परीक्षा तीव्र करती है।' },
    8: { en: 'Saturn rules 3rd and 4th for Scorpio ascendant — mixed but challenging. Domestic upheaval and sibling tensions are likely.', hi: 'शनि वृश्चिक लग्न के 3रे और 4थे भाव के स्वामी — मिश्रित लेकिन चुनौतीपूर्ण। गृह उथल-पुथल और भाई-बहन तनाव संभव।' },
    9: { en: 'Saturn rules 2nd and 3rd for Sagittarius ascendant. Financial caution and communication challenges mark this period.', hi: 'शनि धनु लग्न के 2रे और 3रे भाव के स्वामी। वित्तीय सावधानी और संवाद चुनौतियाँ इस काल की पहचान हैं।' },
    12: { en: 'Saturn rules 11th and 12th for Pisces ascendant. Gains are delayed and expenditure rises during Sade Sati.', hi: 'शनि मीन लग्न के 11वें और 12वें भाव के स्वामी। लाभ में विलंब और व्यय में वृद्धि होती है।' },
  };
  return { factor: 'Saturn functional nature', score: 2, description: maleficDesc[ascendant] ?? { en: `Saturn is functionally malefic for ${RASHI_EN[ascendant]} ascendant, increasing Sade Sati difficulty.`, hi: `${RASHI_HI[ascendant]} लग्न के लिए शनि कार्यात्मक पापी हैं, साढ़ेसाती कठिनता बढ़ाते हैं।` } };
}

function scoreMoonStrength(moonSign: number, moonNakshatra?: number): IntensityFactor {
  const strength = moonSignStrength(moonSign);
  let score: number;
  let en: string;
  let hi: string;

  switch (strength) {
    case 'exalted':
      score = 0;
      en = `Your Moon is exalted in ${RASHI_EN[moonSign]}. An exalted Moon provides exceptional emotional resilience, allowing you to weather Sade Sati with inner stability and clarity.`;
      hi = `आपका चन्द्रमा ${RASHI_HI[moonSign]} में उच्च का है। उच्च का चन्द्रमा असाधारण भावनात्मक दृढ़ता प्रदान करता है, जिससे आप साढ़ेसाती को आंतरिक स्थिरता और स्पष्टता से सह सकते हैं।`;
      break;
    case 'own':
      score = 0.5;
      en = `Your Moon is in its own sign ${RASHI_EN[moonSign]}, giving it natural strength. You handle emotional pressure better than most during Sade Sati.`;
      hi = `आपका चन्द्रमा अपनी स्वराशि ${RASHI_HI[moonSign]} में है, जो उसे स्वाभाविक बल देता है। साढ़ेसाती में आप भावनात्मक दबाव अधिकांश से बेहतर संभालते हैं।`;
      break;
    case 'friendly':
      score = 1;
      en = `Your Moon in ${RASHI_EN[moonSign]} is in a friendly sign, providing moderate emotional support through the Sade Sati period.`;
      hi = `${RASHI_HI[moonSign]} में आपका चन्द्रमा मित्र राशि में है, साढ़ेसाती काल में मध्यम भावनात्मक सहारा प्रदान करता है।`;
      break;
    case 'enemy':
      score = 1.5;
      en = `Your Moon in ${RASHI_EN[moonSign]} is in an inimical sign (Saturn-ruled). The Moon feels uncomfortable here, amplifying the emotional weight of Sade Sati.`;
      hi = `${RASHI_HI[moonSign]} में आपका चन्द्रमा शत्रु राशि (शनि-शासित) में है। चन्द्रमा यहाँ असहज अनुभव करता है, साढ़ेसाती का भावनात्मक भार बढ़ाता है।`;
      break;
    case 'debilitated':
      score = 2;
      en = `Your Moon is debilitated in ${RASHI_EN[moonSign]}. This is the most vulnerable Moon placement during Sade Sati — emotional turbulence, anxiety, and mental unrest are heightened. Strengthening the Moon through remedies is essential.`;
      hi = `आपका चन्द्रमा ${RASHI_HI[moonSign]} में नीच का है। साढ़ेसाती में यह सबसे संवेदनशील चन्द्र स्थिति है — भावनात्मक अशांति, चिंता और मानसिक अस्थिरता बढ़ती है। उपायों से चन्द्रमा को मजबूत करना आवश्यक है।`;
      break;
    default:
      score = 1;
      en = `Your Moon in ${RASHI_EN[moonSign]} has neutral strength. Sade Sati effects will be moderate and shaped by other chart factors.`;
      hi = `${RASHI_HI[moonSign]} में आपका चन्द्रमा तटस्थ बल का है। साढ़ेसाती प्रभाव मध्यम होंगे और अन्य कुंडली कारकों द्वारा आकार लेंगे।`;
  }

  // Nakshatra refinement
  if (moonNakshatra !== undefined) {
    if ([8, 4].includes(moonNakshatra)) {
      // Pushya or Rohini — strong nakshatras
      score = Math.max(0, score - 0.5);
      en += ` ${NAKSHATRA_EN[moonNakshatra]} nakshatra fortifies the Moon further, adding emotional composure.`;
      hi += ` ${NAKSHATRA_HI[moonNakshatra]} नक्षत्र चन्द्रमा को और मजबूत करता है, भावनात्मक संयम जोड़ता है।`;
    } else if ([18, 16].includes(moonNakshatra)) {
      // Jyeshtha or Vishakha — stressed nakshatras
      score = Math.min(2, score + 0.5);
      en += ` ${NAKSHATRA_EN[moonNakshatra]} nakshatra adds intensity — this nakshatra carries inherent transformative pressure that compounds during Sade Sati.`;
      hi += ` ${NAKSHATRA_HI[moonNakshatra]} नक्षत्र तीव्रता जोड़ता है — यह नक्षत्र स्वाभाविक परिवर्तनकारी दबाव रखता है जो साढ़ेसाती में बढ़ जाता है।`;
    }
  }

  return { factor: 'Moon strength', score, description: { en, hi } };
}

function scorePhase(phase: 'rising' | 'peak' | 'setting' | null): IntensityFactor {
  if (phase === null) return { factor: 'Current phase', score: 0, description: { en: 'Sade Sati is not currently active.', hi: 'साढ़ेसाती वर्तमान में सक्रिय नहीं है।' } };
  if (phase === 'rising') return { factor: 'Current phase', score: 1.0, description: { en: 'Rising phase (12th from Moon) — the opening act. Saturn transiting the 12th house from Moon brings increased expenditure, foreign connections, sleep disturbances, and a pull toward spiritual introspection.', hi: 'उदय चरण (चन्द्र से 12वाँ) — आरम्भिक चरण। शनि का चन्द्र से 12वें भाव में गोचर बढ़ते खर्च, विदेश संबंध, नींद में बाधा और आध्यात्मिक आत्मनिरीक्षण की ओर आकर्षण लाता है।' } };
  if (phase === 'peak') return { factor: 'Current phase', score: 2.0, description: { en: 'Peak phase (conjunct Moon) — the most intense period. Saturn directly over your natal Moon restructures your emotional core. Career changes, health attention, relationship tests, and profound personal maturation define this phase.', hi: 'शिखर चरण (चन्द्र पर) — सबसे तीव्र काल। शनि सीधे आपके जन्म चन्द्रमा पर आपके भावनात्मक मूल का पुनर्गठन करता है। करियर परिवर्तन, स्वास्थ्य ध्यान, संबंध परीक्षा और गहन व्यक्तिगत परिपक्वता इस चरण को परिभाषित करती है।' } };
  return { factor: 'Current phase', score: 0.8, description: { en: 'Setting phase (2nd from Moon) — the closing chapter. Saturn in the 2nd from Moon affects speech, family harmony, financial flow, and accumulated wealth. Caution in financial matters is advised. Family responsibilities increase but stabilization begins.', hi: 'अस्त चरण (चन्द्र से 2रा) — अंतिम अध्याय। शनि चन्द्र से 2रे भाव में वाणी, पारिवारिक सामंजस्य, वित्तीय प्रवाह और संचित धन को प्रभावित करता है। वित्तीय मामलों में सावधानी उचित है। पारिवारिक जिम्मेदारियाँ बढ़ती हैं लेकिन स्थिरीकरण आरम्भ होता है।' } };
}

function scoreAshtakavarga(bindus: number[] | undefined, currentSaturnSign: number): IntensityFactor {
  if (!bindus || bindus.length < 12) {
    return { factor: 'Ashtakavarga Saturn bindus', score: 1, description: { en: 'Ashtakavarga data not available; using average assessment.', hi: 'अष्टकवर्ग डेटा उपलब्ध नहीं; औसत आकलन।' } };
  }
  const b = bindus[currentSaturnSign - 1] ?? 4;
  let score: number;
  let en: string;
  let hi: string;
  if (b <= 1) {
    score = 2;
    en = `Saturn has only ${b} bindu(s) in ${RASHI_EN[currentSaturnSign]} in your Ashtakavarga. This is very low — Saturn's transit through this sign will be harsh. Expect obstacles, delays, and a feeling of restriction.`;
    hi = `आपके अष्टकवर्ग में शनि के ${RASHI_HI[currentSaturnSign]} में केवल ${b} बिन्दु हैं। यह बहुत कम है — इस राशि में शनि का गोचर कठिन होगा। बाधाएँ, विलम्ब और प्रतिबंध की अनुभूति अपेक्षित है।`;
  } else if (b <= 3) {
    score = 1.5;
    en = `Saturn has ${b} bindus in ${RASHI_EN[currentSaturnSign]} — below average. This transit carries more friction than usual. Patience and perseverance are your tools.`;
    hi = `शनि के ${RASHI_HI[currentSaturnSign]} में ${b} बिन्दु — औसत से कम। इस गोचर में सामान्य से अधिक घर्षण है। धैर्य और दृढ़ता आपके उपकरण हैं।`;
  } else if (b === 4) {
    score = 1.0;
    en = `Saturn has ${b} bindus in ${RASHI_EN[currentSaturnSign]} — average. The transit will bring standard Sade Sati effects without extreme highs or lows.`;
    hi = `शनि के ${RASHI_HI[currentSaturnSign]} में ${b} बिन्दु — औसत। गोचर मानक साढ़ेसाती प्रभाव लाएगा, अत्यधिक उतार-चढ़ाव के बिना।`;
  } else if (b <= 6) {
    score = 0.5;
    en = `Saturn has ${b} bindus in ${RASHI_EN[currentSaturnSign]} — above average. This Sade Sati is milder than typical. Saturn's transit here may actually bring some constructive outcomes.`;
    hi = `शनि के ${RASHI_HI[currentSaturnSign]} में ${b} बिन्दु — औसत से अधिक। यह साढ़ेसाती सामान्य से हल्की है। शनि का गोचर यहाँ कुछ रचनात्मक परिणाम भी ला सकता है।`;
  } else {
    score = 0;
    en = `Saturn has ${b} bindus in ${RASHI_EN[currentSaturnSign]} — excellent! This is a rare, beneficial Saturn transit. Despite being Sade Sati, this phase may bring recognition, achievement, and structural gains.`;
    hi = `शनि के ${RASHI_HI[currentSaturnSign]} में ${b} बिन्दु — उत्कृष्ट! यह एक दुर्लभ, लाभकारी शनि गोचर है। साढ़ेसाती होने के बावजूद, यह चरण मान्यता, उपलब्धि और संरचनात्मक लाभ ला सकता है।`;
  }
  return { factor: 'Ashtakavarga Saturn bindus', score, description: { en, hi } };
}

function scoreDashaInterplay(dasha: SadeSatiInput['currentDasha']): IntensityFactor {
  if (!dasha) {
    return { factor: 'Dasha interplay', score: 1, description: { en: 'Dasha data not available; using average assessment.', hi: 'दशा डेटा उपलब्ध नहीं; औसत आकलन।' } };
  }
  const planet = dasha.planet.toLowerCase();
  if (planet === 'saturn' || planet === 'shani') {
    return { factor: 'Dasha interplay', score: 2, description: { en: 'Saturn Mahadasha running during Sade Sati creates double Saturn pressure — the most demanding combination. Saturn is simultaneously the dasha lord and the transiting affliction. Discipline, karma clearing, and patience are non-negotiable.', hi: 'साढ़ेसाती के दौरान शनि महादशा चल रही है — दोहरा शनि दबाव, सबसे कठिन संयोजन। शनि एक साथ दशा स्वामी और गोचरी पीड़ा दोनों हैं। अनुशासन, कर्म शुद्धि और धैर्य अनिवार्य हैं।' } };
  }
  if (planet === 'moon' || planet === 'chandra') {
    return { factor: 'Dasha interplay', score: 1.5, description: { en: 'Moon Mahadasha during Sade Sati amplifies the emotional dimension. Mental health, family relationships, and inner peace are under direct focus. Nurturing activities and Moon-strengthening remedies are especially important.', hi: 'साढ़ेसाती में चन्द्र महादशा भावनात्मक आयाम को बढ़ाती है। मानसिक स्वास्थ्य, पारिवारिक संबंध और आंतरिक शांति सीधे केंद्र में हैं। पोषण गतिविधियाँ और चन्द्र-सुदृढ़ीकरण उपाय विशेष रूप से महत्वपूर्ण हैं।' } };
  }
  if (planet === 'mars' || planet === 'mangal') {
    return { factor: 'Dasha interplay', score: 1.5, description: { en: 'Mars Mahadasha with Sade Sati intensifies conflict, anger, and accidents. Saturn restricts while Mars pushes — this friction demands careful anger management and avoiding risky ventures.', hi: 'साढ़ेसाती के साथ मंगल महादशा संघर्ष, क्रोध और दुर्घटनाओं को तीव्र करती है। शनि रोकता है जबकि मंगल धकेलता है — इस घर्षण में सावधान क्रोध प्रबंधन और जोखिम से बचाव आवश्यक है।' } };
  }
  if (planet === 'jupiter' || planet === 'guru') {
    return { factor: 'Dasha interplay', score: 0.5, description: { en: 'Jupiter Mahadasha provides divine grace during Sade Sati. Jupiter\'s wisdom, expansion, and protection significantly mitigate Saturn\'s harshness. Spiritual practices and learning flourish even amid challenges.', hi: 'बृहस्पति महादशा साढ़ेसाती में दैवी कृपा प्रदान करती है। बृहस्पति की बुद्धि, विस्तार और सुरक्षा शनि की कठोरता को काफी कम करती है। चुनौतियों के बीच भी आध्यात्मिक अभ्यास और ज्ञान फलते-फूलते हैं।' } };
  }
  if (planet === 'venus' || planet === 'shukra') {
    return { factor: 'Dasha interplay', score: 0.5, description: { en: 'Venus Mahadasha softens Sade Sati. Comforts, relationships, and creative outlets provide emotional cushioning. While Saturn tests, Venus ensures you do not lose life\'s pleasures entirely.', hi: 'शुक्र महादशा साढ़ेसाती को नरम करती है। सुख-सुविधाएँ, संबंध और सृजनात्मक माध्यम भावनात्मक कुशन प्रदान करते हैं। जहाँ शनि परीक्षा लेता है, शुक्र सुनिश्चित करता है कि जीवन के सुख पूर्णतः न छूटें।' } };
  }
  // Mercury, Rahu, Ketu, Sun
  return { factor: 'Dasha interplay', score: 1, description: { en: `${dasha.planet} Mahadasha during Sade Sati creates a mixed influence. The effects depend heavily on ${dasha.planet}'s natal placement and its relationship with Saturn in your chart.`, hi: `साढ़ेसाती में ${dasha.planet} महादशा मिश्रित प्रभाव बनाती है। प्रभाव मुख्यतः ${dasha.planet} की जन्म स्थिति और आपकी कुंडली में शनि से उसके संबंध पर निर्भर करता है।` } };
}

function scoreNatalSaturn(input: SadeSatiInput): IntensityFactor {
  if (input.saturnHouse === undefined && input.saturnRetrograde === undefined) {
    return { factor: 'Natal Saturn condition', score: 0.5, description: { en: 'Natal Saturn data not available; using average assessment.', hi: 'जन्म शनि डेटा उपलब्ध नहीं; औसत आकलन।' } };
  }
  let score = 0;
  let en = '';
  let hi = '';

  if (input.saturnRetrograde) {
    score += 0.5;
    en += 'Natal Saturn is retrograde — a karmic intensifier. Retrograde Saturn natives experience Sade Sati as deep karmic reckoning, revisiting past-life patterns. ';
    hi += 'जन्म शनि वक्री है — कार्मिक तीव्रक। वक्री शनि जातक साढ़ेसाती को गहन कार्मिक निपटारे के रूप में अनुभव करते हैं, पूर्व जन्म के पैटर्न पुनर्विचार होते हैं। ';
  }

  if (input.saturnHouse !== undefined) {
    const dusthanas = [6, 8, 12];
    const kendras = [1, 4, 7, 10];
    if (dusthanas.includes(input.saturnHouse)) {
      score += 0.5;
      en += `Natal Saturn in the ${input.saturnHouse}th house (dusthana) paradoxically can give Viparita Raja Yoga effects — gains through crises. Sade Sati may be difficult but transformative.`;
      hi += `जन्म शनि ${input.saturnHouse}वें भाव (दुस्थान) में विपरीत राजयोग प्रभाव दे सकता है — संकटों से लाभ। साढ़ेसाती कठिन लेकिन परिवर्तनकारी हो सकती है।`;
    } else if (kendras.includes(input.saturnHouse)) {
      en += `Natal Saturn in the ${input.saturnHouse}th house (kendra) gives structured handling of Sade Sati. You have an inherent capacity to organize under pressure.`;
      hi += `जन्म शनि ${input.saturnHouse}वें भाव (केंद्र) में साढ़ेसाती का संरचित संचालन देता है। आपमें दबाव में व्यवस्थित होने की सहज क्षमता है।`;
    } else {
      score += 0.25;
      en += `Natal Saturn in the ${input.saturnHouse}th house provides moderate resilience during Sade Sati.`;
      hi += `जन्म शनि ${input.saturnHouse}वें भाव में साढ़ेसाती में मध्यम दृढ़ता प्रदान करता है।`;
    }
  }

  return { factor: 'Natal Saturn condition', score: Math.min(score, 1), description: { en: en.trim(), hi: hi.trim() } };
}

// ---------------------------------------------------------------------------
// Interpretation generators
// ---------------------------------------------------------------------------

function intensityLabel(score: number): { en: string; hi: string } {
  if (score <= 3) return { en: 'Mild', hi: 'हल्की' };
  if (score <= 5) return { en: 'Moderate', hi: 'मध्यम' };
  if (score <= 7) return { en: 'Challenging', hi: 'चुनौतीपूर्ण' };
  return { en: 'Intense', hi: 'तीव्र' };
}

function generateInactiveSummary(input: SadeSatiInput, allCycles: SadeSatiCycle[], currentCycleIndex: number): { en: string; hi: string } {
  const moonEn = RASHI_EN[input.moonSign];
  const moonHi = RASHI_HI[input.moonSign];
  const ascEn = input.ascendantSign ? RASHI_EN[input.ascendantSign] : null;
  const ascHi = input.ascendantSign ? RASHI_HI[input.ascendantSign] : null;

  // Find next cycle
  const now = new Date().getFullYear();
  const nextCycle = allCycles.find(c => c.startYear > now);
  // Find most recent past cycle
  const pastCycles = allCycles.filter(c => c.endYear < now);
  const lastCycle = pastCycles.length > 0 ? pastCycles[pastCycles.length - 1] : null;

  let en = `Sade Sati is not currently active for your Moon in ${moonEn}. `;
  let hi = `${moonHi} राशि के चन्द्रमा के लिए साढ़ेसाती वर्तमान में सक्रिय नहीं है। `;

  if (lastCycle) {
    en += `Your last Sade Sati ended in ${lastCycle.endYear}. `;
    hi += `आपकी पिछली साढ़ेसाती ${lastCycle.endYear} में समाप्त हुई। `;
  }

  if (nextCycle) {
    en += `The next Sade Sati cycle for ${moonEn} Moon begins approximately in ${nextCycle.startYear} and runs until about ${nextCycle.endYear}. `;
    hi += `${moonHi} चन्द्र के लिए अगला साढ़ेसाती चक्र लगभग ${nextCycle.startYear} में आरम्भ होगा और ${nextCycle.endYear} तक चलेगा। `;
  }

  en += `This is a period free from Saturn's direct transit pressure on your Moon — use it for building foundations that will withstand the next cycle.`;
  hi += `यह शनि के चन्द्रमा पर प्रत्यक्ष गोचर दबाव से मुक्त अवधि है — अगले चक्र के लिए मजबूत नींव बनाने में इसका उपयोग करें।`;

  if (ascEn) {
    en += ` With ${ascEn} ascendant, your natal Saturn relationship will shape how you experience future Sade Sati cycles.`;
    hi += ` ${ascHi} लग्न के साथ, आपका जन्मकालिक शनि संबंध भविष्य की साढ़ेसाती के अनुभव को आकार देगा।`;
  }

  return { en, hi };
}

function generateSummary(input: SadeSatiInput, phase: 'rising' | 'peak' | 'setting' | null, intensity: number): { en: string; hi: string } {
  const label = intensityLabel(intensity);
  const moonEn = RASHI_EN[input.moonSign];
  const moonHi = RASHI_HI[input.moonSign];
  const ascEn = input.ascendantSign ? RASHI_EN[input.ascendantSign] : null;
  const ascHi = input.ascendantSign ? RASHI_HI[input.ascendantSign] : null;

  const phaseEn = phase === 'rising' ? 'rising (12th from Moon)' : phase === 'peak' ? 'peak (over natal Moon)' : phase === 'setting' ? 'setting (2nd from Moon)' : 'not active';
  const phaseHi = phase === 'rising' ? 'उदय (चन्द्र से 12वाँ)' : phase === 'peak' ? 'शिखर (जन्म चन्द्र पर)' : phase === 'setting' ? 'अस्त (चन्द्र से 2रा)' : 'सक्रिय नहीं';

  let en = '';
  let hi = '';

  if (phase === null) {
    en = `Sade Sati is not currently active for your Moon in ${moonEn}. `;
    hi = `${moonHi} राशि के चन्द्रमा के लिए साढ़ेसाती वर्तमान में सक्रिय नहीं है। `;
  } else {
    en = `Your Sade Sati is in the ${phaseEn} phase. With Moon in ${moonEn}`;
    hi = `आपकी साढ़ेसाती ${phaseHi} चरण में है। ${moonHi} राशि में चन्द्रमा`;
    if (ascEn) {
      en += ` and ${ascEn} ascendant`;
      hi += ` और ${ascHi} लग्न`;
    }
    en += `, the overall intensity is assessed as ${label.en} (${intensity.toFixed(1)}/10). `;
    hi += ` के साथ, समग्र तीव्रता ${label.hi} (${intensity.toFixed(1)}/10) आँकी गई है। `;
  }

  // Add personalized nuance
  if (input.ascendantSign && [2, 7].includes(input.ascendantSign)) {
    en += `With ${ascEn} ascendant, Saturn is your Yogakaraka — this Sade Sati is more a period of structured growth than suffering.`;
    hi += `${ascHi} लग्न के साथ, शनि आपके योगकारक हैं — यह साढ़ेसाती कष्ट से अधिक संरचित विकास का काल है।`;
  } else if (intensity >= 7) {
    en += 'This is a demanding period requiring conscious effort, discipline, and spiritual grounding. The challenges, while intense, are Saturn\'s way of forging resilience.';
    hi += 'यह एक कठिन काल है जिसमें सचेत प्रयास, अनुशासन और आध्यात्मिक आधार आवश्यक है। चुनौतियाँ, भले ही तीव्र हों, शनि का दृढ़ता गढ़ने का तरीका है।';
  } else if (intensity <= 3) {
    en += 'This is a relatively gentle Sade Sati. Focus on self-improvement and you may find this period brings unexpected growth.';
    hi += 'यह अपेक्षाकृत सौम्य साढ़ेसाती है। आत्म-सुधार पर ध्यान दें और आप पाएँगे कि यह काल अप्रत्याशित विकास लाता है।';
  } else {
    en += 'Balance effort with acceptance. Saturn rewards those who work honestly without resisting the lessons.';
    hi += 'प्रयास और स्वीकृति में संतुलन रखें। शनि उन्हें पुरस्कृत करता है जो ईमानदारी से काम करते हैं और सबक से नहीं भागते।';
  }

  return { en, hi };
}

function generatePhaseEffect(phase: 'rising' | 'peak' | 'setting' | null): { en: string; hi: string } {
  if (phase === null) return { en: 'Sade Sati is not currently active. Review the timeline for upcoming and past cycles.', hi: 'साढ़ेसाती वर्तमान में सक्रिय नहीं है। आगामी और पिछले चक्रों के लिए समयरेखा देखें।' };
  if (phase === 'rising') return {
    en: 'Saturn transiting the 12th from your Moon activates the house of losses, foreign travel, and spiritual retreat. Expenditure increases, sleep may be disturbed, and a sense of isolation or withdrawal emerges. However, this is also the house of moksha — spiritual awareness deepens, meditation becomes more potent, and foreign opportunities may arise. Subconscious patterns surface for resolution.',
    hi: 'शनि आपके चन्द्र से 12वें भाव में गोचर कर हानि, विदेश यात्रा और आध्यात्मिक एकांत के भाव को सक्रिय करता है। खर्च बढ़ता है, नींद में बाधा हो सकती है, और अलगाव या वापसी की भावना उभरती है। हालाँकि, यह मोक्ष का भाव भी है — आध्यात्मिक जागरूकता गहरी होती है, ध्यान अधिक शक्तिशाली बनता है, और विदेशी अवसर उत्पन्न हो सकते हैं।'
  };
  if (phase === 'peak') return {
    en: 'Saturn directly over your natal Moon — the most intense phase. Your emotional core undergoes restructuring. Career may shift, health demands attention (especially mental health), and relationships face their deepest tests. This is Saturn\'s direct classroom: every challenge carries a lesson. Those who respond with discipline and humility emerge stronger. Major life decisions made during this phase tend to have lasting impact.',
    hi: 'शनि सीधे आपके जन्म चन्द्र पर — सबसे तीव्र चरण। आपका भावनात्मक मूल पुनर्गठित होता है। करियर बदल सकता है, स्वास्थ्य ध्यान माँगता है (विशेषकर मानसिक स्वास्थ्य), और संबंध गहनतम परीक्षा का सामना करते हैं। यह शनि की सीधी कक्षा है: हर चुनौती एक सबक लेकर आती है। अनुशासन और विनम्रता से प्रतिक्रिया देने वाले मजबूत होकर उभरते हैं।'
  };
  return {
    en: 'Saturn in the 2nd from Moon affects speech, family dynamics, and accumulated wealth. Financial caution is advised — avoid speculative investments and large unnecessary expenditures. Family responsibilities increase, and you may need to support elders. Speech becomes more measured and serious. The positive side: financial discipline established now creates lasting stability. This is the closing chapter — relief approaches.',
    hi: 'शनि चन्द्र से 2रे भाव में वाणी, पारिवारिक गतिशीलता और संचित धन को प्रभावित करता है। वित्तीय सावधानी उचित है — सट्टा निवेश और बड़े अनावश्यक खर्चों से बचें। पारिवारिक जिम्मेदारियाँ बढ़ती हैं, और आपको बड़ों का सहारा बनना पड़ सकता है। वाणी अधिक संयमित और गंभीर हो जाती है। सकारात्मक पक्ष: अभी स्थापित वित्तीय अनुशासन स्थायी स्थिरता बनाता है।'
  };
}

function generateSaturnNature(ascendant: number | undefined): { en: string; hi: string } {
  if (ascendant === undefined) return { en: 'Ascendant data not provided. Saturn\'s functional role depends on the rising sign — provide your birth time for a more precise analysis.', hi: 'लग्न डेटा उपलब्ध नहीं। शनि की कार्यात्मक भूमिका उदय राशि पर निर्भर करती है — अधिक सटीक विश्लेषण के लिए अपना जन्म समय प्रदान करें।' };

  const map: Record<number, { en: string; hi: string }> = {
    1: { en: 'For Aries ascendant, Saturn rules the 10th (karma) and 11th (gains) houses. While not a natural enemy, Saturn\'s transits bring career restructuring and changes in income patterns. Professional discipline is tested.', hi: 'मेष लग्न के लिए, शनि 10वें (कर्म) और 11वें (लाभ) भावों का स्वामी है। स्वाभाविक शत्रु न होते हुए भी, शनि का गोचर करियर पुनर्गठन और आय पैटर्न में बदलाव लाता है।' },
    2: { en: 'Saturn is Yogakaraka for Taurus ascendant, ruling the 9th (fortune, dharma) and 10th (career, status) houses. This Sade Sati, while testing, ultimately builds your career and dharmic path. Unlike many, your Sade Sati has a silver lining of professional advancement and spiritual growth.', hi: 'शनि वृषभ लग्न के लिए योगकारक है, 9वें (भाग्य, धर्म) और 10वें (करियर, प्रतिष्ठा) भावों का स्वामी। यह साढ़ेसाती, परीक्षा लेते हुए भी, अंततः आपके करियर और धार्मिक पथ का निर्माण करती है। अनेकों से भिन्न, आपकी साढ़ेसाती में व्यावसायिक उन्नति और आध्यात्मिक विकास की रजत रेखा है।' },
    3: { en: 'For Gemini ascendant, Saturn rules the 8th (transformation) and 9th (fortune) houses. A mixed portfolio — Saturn brings deep transformation alongside fortune-building. Expect sudden changes that ultimately align you with your dharma.', hi: 'मिथुन लग्न के लिए, शनि 8वें (परिवर्तन) और 9वें (भाग्य) भावों का स्वामी है। मिश्रित विभाग — शनि भाग्य-निर्माण के साथ गहन परिवर्तन लाता है।' },
    4: { en: 'For Cancer ascendant, Saturn rules the 7th (partnerships) and 8th (longevity, hidden matters) houses. As both a maraka and 8th lord, Sade Sati significantly tests relationships and may bring health concerns. Marital dynamics undergo pressure.', hi: 'कर्क लग्न के लिए, शनि 7वें (साझेदारी) और 8वें (आयु, गूढ़ विषय) भावों का स्वामी है। मारक और अष्टम स्वामी दोनों के रूप में, साढ़ेसाती संबंधों की कड़ी परीक्षा लेती है और स्वास्थ्य चिंताएँ ला सकती है।' },
    5: { en: 'For Leo ascendant, Saturn rules the 6th (enemies, disease) and 7th (marriage) houses. Saturn is adversarial — Sade Sati intensifies conflicts, legal matters, health issues, and relationship tests. Professional rivals may become more active.', hi: 'सिंह लग्न के लिए, शनि 6ठे (शत्रु, रोग) और 7वें (विवाह) भावों का स्वामी है। शनि विरोधी है — साढ़ेसाती संघर्ष, कानूनी मामले, स्वास्थ्य समस्या और संबंध परीक्षा तीव्र करती है।' },
    6: { en: 'For Virgo ascendant, Saturn rules the 5th (intelligence, children) and 6th (service, health) houses. Effects on education, creativity, and health are prominent. Children-related matters need attention.', hi: 'कन्या लग्न के लिए, शनि 5वें (बुद्धि, संतान) और 6ठे (सेवा, स्वास्थ्य) भावों का स्वामी है। शिक्षा, सृजनात्मकता और स्वास्थ्य पर प्रभाव प्रमुख हैं।' },
    7: { en: 'Saturn is Yogakaraka for Libra ascendant, ruling the 4th (home, happiness) and 5th (intelligence, progeny) houses. This Sade Sati, while testing, ultimately builds domestic stability and intellectual/creative achievements. Your Saturn is fundamentally benefic.', hi: 'शनि तुला लग्न के लिए योगकारक है, 4थे (गृह, सुख) और 5वें (बुद्धि, संतान) भावों का स्वामी। यह साढ़ेसाती, परीक्षा लेते हुए भी, अंततः गृह स्थिरता और बौद्धिक/सृजनात्मक उपलब्धियों का निर्माण करती है।' },
    8: { en: 'For Scorpio ascendant, Saturn rules the 3rd (courage, siblings) and 4th (home, mother) houses. Domestic upheaval, property matters, and sibling tensions are likely during Sade Sati. Inner courage is tested.', hi: 'वृश्चिक लग्न के लिए, शनि 3रे (साहस, भाई-बहन) और 4थे (गृह, माता) भावों का स्वामी है। साढ़ेसाती में गृह उथल-पुथल, संपत्ति मामले और भाई-बहन तनाव संभव हैं।' },
    9: { en: 'For Sagittarius ascendant, Saturn rules the 2nd (wealth, family) and 3rd (effort, communication) houses. Financial restructuring and changes in family dynamics define this Sade Sati. Communication becomes more deliberate.', hi: 'धनु लग्न के लिए, शनि 2रे (धन, परिवार) और 3रे (प्रयास, संवाद) भावों का स्वामी है। वित्तीय पुनर्गठन और पारिवारिक गतिशीलता में बदलाव इस साढ़ेसाती को परिभाषित करते हैं।' },
    10: { en: 'For Capricorn ascendant, Saturn rules the 1st (self) and 2nd (wealth) houses. As lagna lord, Saturn is your chart ruler — Sade Sati is a period of self-reinvention. You handle it better than most signs due to Saturn\'s natural affinity with you.', hi: 'मकर लग्न के लिए, शनि 1ले (स्व) और 2रे (धन) भावों का स्वामी है। लग्नेश के रूप में, शनि आपकी कुंडली का शासक है — साढ़ेसाती आत्म-नवीनीकरण का काल है।' },
    11: { en: 'For Aquarius ascendant, Saturn rules the 1st (self) and 12th (liberation) houses. As both lagna lord and 12th lord, Sade Sati triggers self-transformation with spiritual undertones. Foreign connections may strengthen.', hi: 'कुम्भ लग्न के लिए, शनि 1ले (स्व) और 12वें (मोक्ष) भावों का स्वामी है। लग्नेश और द्वादश स्वामी दोनों के रूप में, साढ़ेसाती आध्यात्मिक रंग के साथ आत्म-परिवर्तन प्रेरित करती है।' },
    12: { en: 'For Pisces ascendant, Saturn rules the 11th (gains) and 12th (losses) houses. Income patterns change and expenditure rises. Gains are delayed but not denied — Saturn demands patience before rewarding.', hi: 'मीन लग्न के लिए, शनि 11वें (लाभ) और 12वें (हानि) भावों का स्वामी है। आय पैटर्न बदलते हैं और व्यय बढ़ता है। लाभ विलम्बित होता है लेकिन अस्वीकृत नहीं — शनि पुरस्कृत करने से पहले धैर्य माँगता है।' },
  };
  return map[ascendant] ?? { en: 'Saturn\'s role varies by ascendant. Provide birth time for specific analysis.', hi: 'शनि की भूमिका लग्नानुसार भिन्न होती है। विशिष्ट विश्लेषण के लिए जन्म समय दें।' };
}

function generateMoonStrength(moonSign: number, moonNakshatra?: number): { en: string; hi: string } {
  const strength = moonSignStrength(moonSign);
  const strengthEn: Record<string, string> = { exalted: 'exalted', own: 'in its own sign', friendly: 'in a friendly sign', neutral: 'of neutral strength', enemy: 'in an inimical sign', debilitated: 'debilitated' };
  const strengthHi: Record<string, string> = { exalted: 'उच्च का', own: 'स्वराशि में', friendly: 'मित्र राशि में', neutral: 'तटस्थ बल का', enemy: 'शत्रु राशि में', debilitated: 'नीच का' };

  let en = `Your Moon in ${RASHI_EN[moonSign]} is ${strengthEn[strength]}.`;
  let hi = `आपका चन्द्रमा ${RASHI_HI[moonSign]} में ${strengthHi[strength]} है।`;

  if (moonNakshatra && moonNakshatra >= 1 && moonNakshatra <= 27) {
    en += ` ${NAKSHATRA_EN[moonNakshatra]} nakshatra natives tend to have ${moonNakshatra === 8 ? 'nurturing, emotionally stable' : moonNakshatra === 4 ? 'creative, grounded' : moonNakshatra === 18 ? 'intense, penetrating' : 'distinctive'} temperaments.`;
    hi += ` ${NAKSHATRA_HI[moonNakshatra]} नक्षत्र जातकों में ${moonNakshatra === 8 ? 'पोषणकारी, भावनात्मक रूप से स्थिर' : moonNakshatra === 4 ? 'सृजनात्मक, ठोस' : moonNakshatra === 18 ? 'तीव्र, भेदक' : 'विशिष्ट'} स्वभाव होता है।`;
  }

  if (strength === 'debilitated') {
    en += ' During Sade Sati, this means emotional turbulence is amplified. Anxiety, overthinking, and a sense of powerlessness may arise. Moon-strengthening remedies are essential — pearl, Monday fasting, Shiva worship.';
    hi += ' साढ़ेसाती में इसका अर्थ है भावनात्मक अशांति बढ़ जाती है। चिंता, अतिविचार और शक्तिहीनता की भावना उत्पन्न हो सकती है। चन्द्र-सुदृढ़ीकरण उपाय आवश्यक हैं — मोती, सोमवार व्रत, शिव पूजा।';
  } else if (strength === 'exalted') {
    en += ' During Sade Sati, your exalted Moon acts as an emotional anchor. While external pressures exist, your inner stability helps you navigate them constructively.';
    hi += ' साढ़ेसाती में, आपका उच्च चन्द्रमा भावनात्मक लंगर के रूप में कार्य करता है। बाहरी दबाव होने पर भी, आपकी आंतरिक स्थिरता आपको रचनात्मक रूप से नेविगेट करने में सहायता करती है।';
  } else {
    en += ' During Sade Sati, you will experience moderate emotional fluctuation. Meditation and routine provide stability.';
    hi += ' साढ़ेसाती में, आप मध्यम भावनात्मक उतार-चढ़ाव अनुभव करेंगे। ध्यान और दिनचर्या स्थिरता प्रदान करती है।';
  }

  return { en, hi };
}

function generateDashaInterplay(dasha: SadeSatiInput['currentDasha']): { en: string; hi: string } {
  if (!dasha) return { en: 'Dasha data not provided. The running Mahadasha significantly modifies Sade Sati effects — provide your birth details for complete analysis.', hi: 'दशा डेटा उपलब्ध नहीं। चल रही महादशा साढ़ेसाती प्रभावों को महत्वपूर्ण रूप से संशोधित करती है — पूर्ण विश्लेषण के लिए अपना जन्म विवरण प्रदान करें।' };
  const planet = dasha.planet;
  return {
    en: `You are currently running ${planet} Mahadasha (${dasha.startDate} to ${dasha.endDate}). The combination of ${planet} dasha with Sade Sati creates a specific karmic dynamic that shapes how you experience Saturn's transit. Focus on the significations of ${planet} — they will be the primary arena of Sade Sati's effects.`,
    hi: `वर्तमान में ${planet} महादशा चल रही है (${dasha.startDate} से ${dasha.endDate})। ${planet} दशा और साढ़ेसाती का संयोजन एक विशिष्ट कार्मिक गतिशीलता बनाता है जो शनि के गोचर के अनुभव को आकार देता है। ${planet} के कारकत्वों पर ध्यान दें — वे साढ़ेसाती के प्रभावों का प्राथमिक क्षेत्र होंगे।`
  };
}

function generateAshtakavargaInsight(bindus: number[] | undefined, currentSaturnSign: number): { en: string; hi: string } {
  if (!bindus || bindus.length < 12) return { en: 'Ashtakavarga data not available. The Bhinnashtakavarga of Saturn indicates which signs will be easy or difficult for Saturn\'s transit. Provide your full birth chart for this analysis.', hi: 'अष्टकवर्ग डेटा उपलब्ध नहीं। शनि का भिन्नाष्टकवर्ग बताता है कि शनि के गोचर के लिए कौन सी राशियाँ सरल या कठिन होंगी। इस विश्लेषण के लिए अपनी पूर्ण जन्म कुंडली प्रदान करें।' };
  const b = bindus[currentSaturnSign - 1] ?? 4;
  return {
    en: `Saturn has ${b} bindu${b !== 1 ? 's' : ''} in ${RASHI_EN[currentSaturnSign]} in your Ashtakavarga. ${b <= 2 ? 'This is significantly below the 4-bindu average, indicating a harsh transit period. Extra caution and remedial measures are strongly advised.' : b <= 3 ? 'Slightly below average — some friction expected but manageable with awareness.' : b === 4 ? 'Average score — standard Sade Sati effects apply.' : b <= 6 ? 'Above average — this transit may bring constructive restructuring rather than pure hardship.' : 'Excellent score — this is a rare beneficial Saturn transit. Despite Sade Sati, expect recognition and achievement.'}`,
    hi: `आपके अष्टकवर्ग में शनि के ${RASHI_HI[currentSaturnSign]} में ${b} बिन्दु हैं। ${b <= 2 ? 'यह 4-बिन्दु औसत से काफी कम है, कठिन गोचर काल का संकेत। अतिरिक्त सावधानी और उपचारात्मक उपाय अत्यधिक अनुशंसित हैं।' : b <= 3 ? 'औसत से थोड़ा कम — कुछ घर्षण अपेक्षित लेकिन जागरूकता से संभालने योग्य।' : b === 4 ? 'औसत स्कोर — मानक साढ़ेसाती प्रभाव लागू।' : b <= 6 ? 'औसत से ऊपर — यह गोचर शुद्ध कष्ट के बजाय रचनात्मक पुनर्गठन ला सकता है।' : 'उत्कृष्ट स्कोर — यह एक दुर्लभ लाभकारी शनि गोचर है। साढ़ेसाती के बावजूद, मान्यता और उपलब्धि अपेक्षित।'}`
  };
}

function generateNakshatraTransit(moonSign: number, moonNakshatra?: number): { en: string; hi: string } {
  const sign12th = ((moonSign - 2 + 12) % 12) + 1;
  const sign2nd = (moonSign % 12) + 1;
  const allNaks: number[] = [...nakshatrasInSign(sign12th), ...nakshatrasInSign(moonSign), ...nakshatrasInSign(sign2nd)];
  const uniqueNaks = [...new Set(allNaks)].filter(n => n >= 1 && n <= 27);

  const nakNamesEn = uniqueNaks.map(n => NAKSHATRA_EN[n]).join(', ');
  const nakNamesHi = uniqueNaks.map(n => NAKSHATRA_HI[n]).join(', ');

  let en = `Saturn will transit through the nakshatras: ${nakNamesEn} during this Sade Sati.`;
  let hi = `इस साढ़ेसाती में शनि ${nakNamesHi} नक्षत्रों से गोचर करेगा।`;

  if (moonNakshatra && moonNakshatra >= 1 && moonNakshatra <= 27) {
    en += ` The most sensitive period is when Saturn crosses your birth nakshatra ${NAKSHATRA_EN[moonNakshatra]}. During that transit, Saturn's lessons become deeply personal — touching the core of your emotional and psychological makeup.`;
    hi += ` सबसे संवेदनशील काल वह होगा जब शनि आपके जन्म नक्षत्र ${NAKSHATRA_HI[moonNakshatra]} को पार करेगा। उस गोचर में, शनि के सबक गहरे व्यक्तिगत होते हैं — आपके भावनात्मक और मनोवैज्ञानिक मूल को स्पर्श करते हैं।`;
  }

  return { en, hi };
}

function generateHouseEffect(input: SadeSatiInput): { en: string; hi: string } {
  if (!input.ascendantSign) {
    return {
      en: 'Without ascendant data, house-level analysis is not possible. Sade Sati affects the 12th, 1st, and 2nd houses from Moon, but the specific life areas depend on which houses these correspond to from your ascendant.',
      hi: 'लग्न डेटा के बिना, भाव-स्तरीय विश्लेषण संभव नहीं है। साढ़ेसाती चन्द्र से 12वें, 1ले और 2रे भावों को प्रभावित करती है, लेकिन विशिष्ट जीवन क्षेत्र इस पर निर्भर करते हैं कि ये आपके लग्न से कौन से भाव हैं।'
    };
  }

  // Houses from ascendant where Moon sits
  const moonHouse = ((input.moonSign - input.ascendantSign + 12) % 12) + 1;
  const h12 = moonHouse === 1 ? 12 : moonHouse - 1;
  const h1 = moonHouse;
  const h2 = moonHouse === 12 ? 1 : moonHouse + 1;

  const houseSignifications: Record<number, { en: string; hi: string }> = {
    1: { en: 'self, personality, health, appearance', hi: 'स्व, व्यक्तित्व, स्वास्थ्य, रूप' },
    2: { en: 'wealth, family, speech, food', hi: 'धन, परिवार, वाणी, भोजन' },
    3: { en: 'siblings, courage, short travels, communication', hi: 'भाई-बहन, साहस, लघु यात्रा, संवाद' },
    4: { en: 'home, mother, vehicles, comfort, education', hi: 'गृह, माता, वाहन, सुख, शिक्षा' },
    5: { en: 'intelligence, children, creativity, romance', hi: 'बुद्धि, संतान, सृजनात्मकता, प्रेम' },
    6: { en: 'enemies, disease, service, debts', hi: 'शत्रु, रोग, सेवा, ऋण' },
    7: { en: 'marriage, partnerships, business, public image', hi: 'विवाह, साझेदारी, व्यापार, सार्वजनिक छवि' },
    8: { en: 'longevity, transformation, occult, sudden events', hi: 'आयु, परिवर्तन, गूढ़, अचानक घटनाएँ' },
    9: { en: 'fortune, father, dharma, higher learning, long travel', hi: 'भाग्य, पिता, धर्म, उच्च शिक्षा, दीर्घ यात्रा' },
    10: { en: 'career, status, authority, karma', hi: 'करियर, प्रतिष्ठा, अधिकार, कर्म' },
    11: { en: 'gains, income, friendships, aspirations', hi: 'लाभ, आय, मित्रता, आकांक्षाएँ' },
    12: { en: 'losses, foreign lands, spirituality, liberation', hi: 'हानि, विदेश, आध्यात्मिकता, मोक्ष' },
  };

  const s12 = houseSignifications[h12] ?? { en: '', hi: '' };
  const s1 = houseSignifications[h1] ?? { en: '', hi: '' };
  const s2 = houseSignifications[h2] ?? { en: '', hi: '' };

  return {
    en: `From your ${RASHI_EN[input.ascendantSign]} ascendant, Saturn transiting the ${h12}th, ${h1}th, and ${h2}th houses activates: The ${h12}th house transit affects ${s12.en}. The ${h1}th house transit (peak phase) affects ${s1.en}. The ${h2}th house transit affects ${s2.en}. These are the life areas that undergo Saturn's restructuring during your Sade Sati.`,
    hi: `आपके ${RASHI_HI[input.ascendantSign]} लग्न से, शनि ${h12}वें, ${h1}वें और ${h2}वें भावों में गोचर कर सक्रिय करता है: ${h12}वें भाव का गोचर ${s12.hi} को प्रभावित करता है। ${h1}वें भाव का गोचर (शिखर चरण) ${s1.hi} को प्रभावित करता है। ${h2}वें भाव का गोचर ${s2.hi} को प्रभावित करता है। ये वे जीवन क्षेत्र हैं जो साढ़ेसाती में शनि के पुनर्गठन से गुजरते हैं।`
  };
}

// ---------------------------------------------------------------------------
// Remedies
// ---------------------------------------------------------------------------

function generateRemedies(input: SadeSatiInput, intensity: number, phase: 'rising' | 'peak' | 'setting' | null): SadeSatiAnalysis['remedies'] {
  const remedies: SadeSatiAnalysis['remedies'] = [];

  // Essential — always include
  remedies.push({
    title: { en: 'Hanuman Chalisa', hi: 'हनुमान चालीसा' },
    description: { en: 'Recite Hanuman Chalisa daily, especially on Saturdays and Tuesdays. Hanuman is the supreme remedy for Saturn affliction. Even reciting once daily provides significant protection during Sade Sati.', hi: 'प्रतिदिन हनुमान चालीसा का पाठ करें, विशेषकर शनिवार और मंगलवार को। हनुमान शनि पीड़ा का सर्वोत्तम उपाय हैं। दिन में एक बार पाठ भी साढ़ेसाती में महत्वपूर्ण सुरक्षा प्रदान करता है।' },
    priority: 'essential',
  });

  remedies.push({
    title: { en: 'Service to the Underprivileged', hi: 'वंचितों की सेवा' },
    description: { en: 'Serve the elderly, disabled, workers, and the underprivileged — these are Saturn\'s people. Regular acts of selfless service directly pacify Saturn. Volunteer at old-age homes, feed the hungry, and treat service workers with respect and generosity.', hi: 'बुजुर्गों, विकलांगों, श्रमिकों और वंचितों की सेवा करें — ये शनि के लोग हैं। नियमित निःस्वार्थ सेवा सीधे शनि को शांत करती है। वृद्धाश्रमों में स्वयंसेवा करें, भूखों को खिलाएँ, और सेवा कर्मियों के साथ सम्मान और उदारता से व्यवहार करें।' },
    priority: 'essential',
  });

  remedies.push({
    title: { en: 'Sesame Oil Lamp at Shani Temple', hi: 'शनि मंदिर में तिल तेल का दीपक' },
    description: { en: 'Light a sesame oil lamp at a Shani temple every Saturday evening. Offer black sesame seeds (til), mustard oil, and iron items. Visit consistently — Saturn values discipline over grand one-time gestures.', hi: 'प्रत्येक शनिवार सायं शनि मंदिर में तिल तेल का दीपक जलाएँ। काले तिल, सरसों का तेल और लोहे की वस्तुएँ अर्पित करें। नियमित रूप से जाएँ — शनि भव्य एकबारगी कृत्यों से अधिक अनुशासन को महत्व देता है।' },
    priority: 'essential',
  });

  // Recommended — based on intensity and specific factors
  if (intensity > 5) {
    remedies.push({
      title: { en: 'Blue Sapphire (Neelam) Consultation', hi: 'नीलम रत्न परामर्श' },
      description: { en: 'With high intensity Sade Sati, consult a qualified astrologer about wearing Blue Sapphire (Neelam). This powerful Saturn gemstone can dramatically reduce suffering but must be tested first — it does not suit everyone. A trial period of 3-7 days is standard before committing.', hi: 'उच्च तीव्रता साढ़ेसाती में, नीलम पहनने के बारे में योग्य ज्योतिषी से परामर्श करें। यह शक्तिशाली शनि रत्न कष्ट को नाटकीय रूप से कम कर सकता है लेकिन पहले परीक्षण आवश्यक है — यह सबको नहीं सूट करता। प्रतिबद्ध होने से पहले 3-7 दिन का परीक्षण काल मानक है।' },
      priority: 'recommended',
    });
  }

  const moonStr = moonSignStrength(input.moonSign);
  if (moonStr === 'debilitated' || moonStr === 'enemy') {
    remedies.push({
      title: { en: 'Strengthen the Moon', hi: 'चन्द्रमा को मजबूत करें' },
      description: { en: 'Your Moon needs strengthening during Sade Sati. Wear a natural pearl set in silver on the little finger (Monday morning). Worship Lord Shiva on Mondays with milk abhisheka. Fast on Mondays (or eat only once). Drink water from a silver glass.', hi: 'साढ़ेसाती में आपके चन्द्रमा को मजबूत करने की आवश्यकता है। सोमवार सुबह चाँदी में जड़ा प्राकृतिक मोती कनिष्ठा उँगली में पहनें। सोमवार को दुग्ध अभिषेक के साथ भगवान शिव की पूजा करें। सोमवार को व्रत रखें (या एक बार भोजन करें)। चाँदी के गिलास से जल पिएँ।' },
      priority: 'recommended',
    });
  }

  const dashaP = input.currentDasha?.planet?.toLowerCase();
  if (dashaP === 'saturn' || dashaP === 'shani') {
    remedies.push({
      title: { en: 'Shani Chalisa & Iron Donation', hi: 'शनि चालीसा और लोहे का दान' },
      description: { en: 'With Saturn Mahadasha active during Sade Sati, recite Shani Chalisa on Saturdays. Donate iron items, black cloth, mustard oil, and black sesame to the needy. Consider donating a buffalo or its equivalent value to charity.', hi: 'साढ़ेसाती में शनि महादशा सक्रिय होने पर, शनिवार को शनि चालीसा का पाठ करें। जरूरतमंदों को लोहे की वस्तुएँ, काला कपड़ा, सरसों का तेल और काले तिल दान करें। भैंस या उसके समकक्ष मूल्य दान पर विचार करें।' },
      priority: 'recommended',
    });
  }

  if (phase === 'setting') {
    remedies.push({
      title: { en: 'Financial Caution & Food Donation', hi: 'वित्तीय सावधानी और अन्नदान' },
      description: { en: 'Saturn in the 2nd from Moon affects wealth and sustenance. Avoid speculation and risky investments. Donate food regularly — especially on Saturdays. Feed workers and laborers. This directly addresses the 2nd house themes of sustenance and wealth.', hi: 'चन्द्र से 2रे भाव में शनि धन और जीविका को प्रभावित करता है। सट्टा और जोखिमपूर्ण निवेश से बचें। नियमित रूप से अन्नदान करें — विशेषकर शनिवार को। श्रमिकों और मजदूरों को भोजन कराएँ। यह 2रे भाव के जीविका और धन विषयों को सीधे संबोधित करता है।' },
      priority: 'recommended',
    });
  }

  // Optional
  remedies.push({
    title: { en: 'Saturn Mantra Japa', hi: 'शनि मंत्र जप' },
    description: { en: 'Chant "Om Sham Shanaischaraya Namah" 108 times on Saturdays using a rudraksha or iron mala. Begin at sunset on Saturday. Maintain this practice consistently throughout the Sade Sati period for cumulative benefit.', hi: '"ॐ शं शनैश्चराय नमः" शनिवार को 108 बार रुद्राक्ष या लोहे की माला पर जप करें। शनिवार सूर्यास्त पर आरम्भ करें। संचयी लाभ के लिए पूरी साढ़ेसाती काल में यह अभ्यास नियमित रखें।' },
    priority: 'optional',
  });

  remedies.push({
    title: { en: 'Feed Crows', hi: 'कौओं को खिलाएँ' },
    description: { en: 'Feed crows every Saturday with cooked rice mixed with sesame seeds and ghee. The crow is Saturn\'s vahana (vehicle). This simple act is considered a direct offering to Saturn and helps balance his energy in your life.', hi: 'प्रत्येक शनिवार कौओं को तिल और घी मिला पका चावल खिलाएँ। कौआ शनि का वाहन है। यह सरल कृत्य शनि को सीधा अर्पण माना जाता है और आपके जीवन में उनकी ऊर्जा को संतुलित करने में सहायता करता है।' },
    priority: 'optional',
  });

  remedies.push({
    title: { en: 'Pilgrimage to Saturn Temples', hi: 'शनि मंदिरों की तीर्थ यात्रा' },
    description: { en: 'Visit Shani Shingnapur (Maharashtra) or Thirunallar (Tamil Nadu) — two of the most powerful Saturn temples in India. If not possible, visit any local Shani temple regularly. Consistency matters more than distance traveled.', hi: 'शनि शिंगणापुर (महाराष्ट्र) या तिरुनल्लार (तमिलनाडु) जाएँ — भारत के दो सबसे शक्तिशाली शनि मंदिर। यदि संभव न हो, तो नियमित रूप से किसी स्थानीय शनि मंदिर जाएँ। तय की गई दूरी से अधिक नियमितता मायने रखती है।' },
    priority: 'optional',
  });

  return remedies;
}

// ---------------------------------------------------------------------------
// Main analysis function
// ---------------------------------------------------------------------------

export function analyzeSadeSati(input: SadeSatiInput): SadeSatiAnalysis {
  const allCycles = buildAllCycles(input.moonSign);
  const now = new Date();
  const currentYear = now.getFullYear();

  // Find current cycle
  let currentCycleIndex = -1;
  let currentPhase: 'rising' | 'peak' | 'setting' | null = null;
  let phaseProgress = 0;

  for (let i = 0; i < allCycles.length; i++) {
    const cycle = allCycles[i];
    if (cycle.startYear <= currentYear && currentYear <= cycle.endYear) {
      currentCycleIndex = i;
      cycle.isActive = true;
      // Determine phase — use month-level precision for progress
      for (const p of cycle.phases) {
        if (p.startYear <= currentYear && currentYear <= p.endYear) {
          currentPhase = p.phase;
          // Phase starts ~Jan of startYear and ends ~Dec of endYear
          const phaseStartMonth = p.startYear * 12;
          const phaseEndMonth = (p.endYear + 1) * 12; // end of endYear
          const currentMonth = currentYear * 12 + now.getMonth();
          const totalMonths = phaseEndMonth - phaseStartMonth;
          const elapsedMonths = currentMonth - phaseStartMonth;
          phaseProgress = totalMonths > 0 ? Math.min(100, Math.max(0, (elapsedMonths / totalMonths) * 100)) : 50;
          break;
        }
      }
      break;
    }
  }

  const isActive = currentCycleIndex >= 0;
  const cycleStart = isActive ? String(allCycles[currentCycleIndex].startYear) : '';
  const cycleEnd = isActive ? String(allCycles[currentCycleIndex].endYear) : '';

  // Get current Saturn sign for BAV lookup
  const saturnInfo = getCurrentSaturnSign();

  // Intensity scoring — only meaningful when active
  let intensityFactors: IntensityFactor[] = [];
  let overallIntensity = 0;

  if (isActive) {
    const f1 = scoreSaturnFunctionalNature(input.ascendantSign);
    const f2 = scoreMoonStrength(input.moonSign, input.moonNakshatra);
    const f3 = scorePhase(currentPhase);
    const f4 = scoreAshtakavarga(input.ashtakavargaSaturnBindus, saturnInfo.sign);
    const f5 = scoreDashaInterplay(input.currentDasha);
    const f6 = scoreNatalSaturn(input);
    intensityFactors = [f1, f2, f3, f4, f5, f6];
    overallIntensity = Math.min(10, intensityFactors.reduce((sum, f) => sum + f.score, 0));
  }

  // Interpretation — transit-specific sections only shown when active
  const noTransit = { en: '', hi: '' };
  const interpretation = {
    summary: isActive
      ? generateSummary(input, currentPhase, overallIntensity)
      : generateInactiveSummary(input, allCycles, currentCycleIndex),
    phaseEffect: isActive ? generatePhaseEffect(currentPhase) : noTransit,
    saturnNature: generateSaturnNature(input.ascendantSign),
    moonStrength: generateMoonStrength(input.moonSign, input.moonNakshatra),
    dashaInterplay: isActive ? generateDashaInterplay(input.currentDasha) : noTransit,
    ashtakavargaInsight: isActive ? generateAshtakavargaInsight(input.ashtakavargaSaturnBindus, saturnInfo.sign) : noTransit,
    nakshatraTransit: isActive ? generateNakshatraTransit(input.moonSign, input.moonNakshatra) : noTransit,
    houseEffect: isActive ? generateHouseEffect(input) : noTransit,
  };

  // Remedies — only generate active remedies when Sade Sati is active
  const remedies = isActive ? generateRemedies(input, overallIntensity, currentPhase) : [];

  return {
    isActive,
    currentPhase,
    phaseProgress,
    cycleStart,
    cycleEnd,
    allCycles,
    currentCycleIndex,
    overallIntensity,
    intensityFactors,
    interpretation,
    remedies,
  };
}
