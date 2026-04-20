/**
 * Life Overview Generator
 *
 * Produces a 2-3 sentence "elevator pitch" of the native's chart —
 * the kind of opening summary a pandit would give before diving into details.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs:  1-based (1=Aries … 12=Pisces)
 */

import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Input type
// ---------------------------------------------------------------------------

export interface OverviewInput {
  /** 1-based rashi number (1=Aries … 12=Pisces) */
  ascendantSign: number;
  /** Atmakaraka planet id (0=Sun … 8=Ketu) */
  atmakarakaPlanetId: number;
  /** House number (1-12) that is the strongest in the chart */
  strongestHouseNumber: number;
  /** Vimshottari maha-dasha lord id */
  currentMahadashaLordId: number;
  /** Native's age in years */
  nativeAge: number;
}

// ---------------------------------------------------------------------------
// Static lookup maps (hoisted to module level — never inline in render paths)
// ---------------------------------------------------------------------------

/** Soul-archetype associated with each Atmakaraka */
const AK_ARCHETYPE_EN: Record<number, string> = {
  0: 'a leader',
  1: 'a nurturer',
  2: 'a warrior',
  3: 'a communicator',
  4: 'a teacher',
  5: 'an artist',
  6: 'a builder',
  7: 'a visionary seeker',
  8: 'a seeker',
};

const AK_ARCHETYPE_HI: Record<number, string> = {
  0: 'एक नेता',
  1: 'एक पालक',
  2: 'एक योद्धा',
  3: 'एक संचारक',
  4: 'एक गुरु',
  5: 'एक कलाकार',
  6: 'एक निर्माता',
  7: 'एक दृष्टा',
  8: 'एक साधक',
};

/** Dasha lord energy — how the planet colors a Mahadasha PERIOD (distinct from AK soul-purpose) */
const DASHA_LORD_EN: Record<number, string> = {
  0: 'authority, visibility, and self-realization',
  1: 'emotional depth, public connection, and nurturing',
  2: 'courage, action, and conquering obstacles',
  3: 'intellect, trade, and communication',
  4: 'expansion, wisdom, and spiritual growth',
  5: 'relationships, luxury, and creative expression',
  6: 'discipline, karmic reckoning, and endurance',
  7: 'obsessive ambition, foreign connections, and worldly pursuit',
  8: 'detachment, spiritual liberation, and past-life resolution',
};

const DASHA_LORD_HI: Record<number, string> = {
  0: 'अधिकार, प्रसिद्धि और आत्म-साक्षात्कार',
  1: 'भावनात्मक गहराई, जनसंपर्क और पालन-पोषण',
  2: 'साहस, कर्म और बाधाओं पर विजय',
  3: 'बुद्धि, व्यापार और संवाद',
  4: 'विस्तार, ज्ञान और आध्यात्मिक विकास',
  5: 'संबंध, विलासिता और सृजनात्मक अभिव्यक्ति',
  6: 'अनुशासन, कार्मिक निपटान और धैर्य',
  7: 'तीव्र महत्वाकांक्षा, विदेशी संबंध और सांसारिक पीछा',
  8: 'वैराग्य, आध्यात्मिक मुक्ति और पूर्वजन्म समाधान',
};

/** Core essence of each ascendant sign */
const SIGN_ESSENCE_EN: Record<number, string> = {
  1:  'pioneering fire',
  2:  'grounded stability',
  3:  'curious versatility',
  4:  'nurturing depth',
  5:  'radiant confidence',
  6:  'refined service',
  7:  'balanced harmony',
  8:  'transformative intensity',
  9:  'expansive wisdom',
  10: 'disciplined ambition',
  11: 'humanitarian vision',
  12: 'boundless compassion',
};

const SIGN_ESSENCE_HI: Record<number, string> = {
  1:  'अग्रणी अग्नि',
  2:  'स्थिर दृढ़ता',
  3:  'जिज्ञासु विविधता',
  4:  'पोषण की गहराई',
  5:  'उज्ज्वल आत्मविश्वास',
  6:  'परिष्कृत सेवा',
  7:  'संतुलित सद्भाव',
  8:  'परिवर्तनकारी तीव्रता',
  9:  'विस्तृत ज्ञान',
  10: 'अनुशासित महत्वाकांक्षा',
  11: 'मानवतावादी दृष्टि',
  12: 'असीम करुणा',
};

/** Life theme associated with the strongest natal house */
const HOUSE_THEME_EN: Record<number, string> = {
  1:  'self-expression and identity',
  2:  'wealth and family values',
  3:  'communication and courage',
  4:  'home, roots, and inner peace',
  5:  'creativity and intelligence',
  6:  'service, health, and overcoming obstacles',
  7:  'partnerships and worldly interactions',
  8:  'transformation and hidden knowledge',
  9:  'higher wisdom and fortune',
  10: 'career and public impact',
  11: 'gains, networks, and aspirations',
  12: 'liberation and surrender',
};

const HOUSE_THEME_HI: Record<number, string> = {
  1:  'आत्म-अभिव्यक्ति और पहचान',
  2:  'धन और पारिवारिक मूल्य',
  3:  'संचार और साहस',
  4:  'घर, जड़ें और आंतरिक शांति',
  5:  'रचनात्मकता और बुद्धि',
  6:  'सेवा, स्वास्थ्य और बाधाओं पर विजय',
  7:  'साझेदारी और सांसारिक व्यवहार',
  8:  'रूपांतरण और गुप्त ज्ञान',
  9:  'उच्च ज्ञान और भाग्य',
  10: 'करियर और सार्वजनिक प्रभाव',
  11: 'लाभ, नेटवर्क और आकांक्षाएं',
  12: 'मुक्ति और समर्पण',
};

/** Life phase labels by age bracket */
function getPhaseEn(age: number): string {
  if (age < 35)  return 'building';
  if (age < 50)  return 'consolidation';
  if (age < 65)  return 'harvest';
  return 'legacy';
}

function getPhaseHi(age: number): string {
  if (age < 35)  return 'निर्माण';
  if (age < 50)  return 'सुदृढ़ीकरण';
  if (age < 65)  return 'कटाई';
  return 'विरासत';
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

/**
 * Generates a 2-3 sentence life overview (en + hi) for the native.
 *
 * @example
 * const overview = generateLifeOverview({
 *   ascendantSign: 1,
 *   atmakarakaPlanetId: 4,
 *   strongestHouseNumber: 10,
 *   currentMahadashaLordId: 6,
 *   nativeAge: 38,
 * });
 */
export function generateLifeOverview(input: OverviewInput): LocaleText {
  const {
    ascendantSign,
    atmakarakaPlanetId,
    strongestHouseNumber,
    currentMahadashaLordId,
    nativeAge,
  } = input;

  // Resolve archetypes, falling back gracefully for out-of-range ids
  const akEn    = AK_ARCHETYPE_EN[atmakarakaPlanetId]    ?? 'a seeker';
  const akHi    = AK_ARCHETYPE_HI[atmakarakaPlanetId]    ?? 'एक साधक';
  const signEn  = SIGN_ESSENCE_EN[ascendantSign]          ?? 'cosmic energy';
  const signHi  = SIGN_ESSENCE_HI[ascendantSign]          ?? 'ब्रह्मांडीय ऊर्जा';
  const houseEn = HOUSE_THEME_EN[strongestHouseNumber]    ?? 'life experience';
  const houseHi = HOUSE_THEME_HI[strongestHouseNumber]    ?? 'जीवन अनुभव';
  const phaseEn = getPhaseEn(nativeAge);
  const phaseHi = getPhaseHi(nativeAge);
  const dashaEn = DASHA_LORD_EN[currentMahadashaLordId] ?? 'transformative energy';
  const dashaHi = DASHA_LORD_HI[currentMahadashaLordId] ?? 'परिवर्तनकारी ऊर्जा';

  const en =
    `You are fundamentally ${akEn}, with ${signEn} as your core nature. ` +
    `Your greatest strength lies in ${houseEn}. ` +
    `This is your ${phaseEn} phase — your current Mahadasha themes are ${dashaEn}.`;

  const hi =
    `आप मूलतः ${akHi} हैं, और ${signHi} आपकी मूल प्रकृति है। ` +
    `आपकी सबसे बड़ी शक्ति ${houseHi} में निहित है। ` +
    `यह आपका ${phaseHi} चरण है — आपकी वर्तमान महादशा के विषय हैं ${dashaHi}।`;

  return { en, hi };
}
