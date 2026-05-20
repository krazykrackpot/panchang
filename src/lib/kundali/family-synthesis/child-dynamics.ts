/**
 * Child Dynamics -- computes RelationshipDynamics for a parent-child pair.
 *
 * Orchestrates: parent-child synastry, D7 cross-read, Moon connection,
 * karmic indicators, Putrakaraka analysis, transit impact, dasha sync,
 * and narrative generation.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { RelationshipDynamics, SynastryHighlight, KarmicIndicator } from './types';
import { computeVargaCrossRead } from './varga-cross-read';
import { computeTransitRelationshipImpact } from './transit-relationship';
import { computeDashaSynchronicity } from './dasha-sync';
import {
  generateChildActionItems, generateMonthlyForecast,
  generateUpcomingWindows, generateStressPeriods,
} from './narrative-gen';
import { computeEnhancedSynastry } from '@/lib/comparison/synastry-engine';

const PLANET_NAMES_MAP: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' }, 1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' }, 3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' }, 5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' }, 7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

/** Helper: extract planet id from PlanetPosition (real shape has p.planet.id, fixtures may have p.id). */
function getPid(p: PlanetPosition | Record<string, unknown>): number {
  const raw = p as Record<string, unknown>;
  if (typeof raw.id === 'number') return raw.id;
  if (raw.planet && typeof (raw.planet as Record<string, unknown>).id === 'number') {
    return (raw.planet as Record<string, unknown>).id as number;
  }
  return -1;
}

function mapSynastryHighlights(chartA: KundaliData, chartB: KundaliData): SynastryHighlight[] {
  try {
    const aspects = computeEnhancedSynastry(chartA, chartB);
    return aspects
      .sort((a, b) => Math.abs(a.orb) - Math.abs(b.orb))
      .slice(0, 5)
      .map(asp => {
        const pA = PLANET_NAMES_MAP[asp.planetA] ?? { en: `Planet ${asp.planetA}`, hi: `ग्रह ${asp.planetA}` };
        const pB = PLANET_NAMES_MAP[asp.planetB] ?? { en: `Planet ${asp.planetB}`, hi: `ग्रह ${asp.planetB}` };
        const aspectName = asp.type.toLowerCase();
        return {
          yourPlanet: pA.en,
          theirPlanet: pB.en,
          aspect: aspectName,
          orb: Math.round(Math.abs(asp.orb) * 10) / 10,
          nature: asp.isHarmonious ? 'harmonious' as const : 'challenging' as const,
          interpretation: asp.interpretation ?? {
            en: `${pA.en} ${aspectName} ${pB.en}.`,
            hi: `${pA.hi} ${aspectName} ${pB.hi}।`,
          },
        };
      });
  } catch (err) {
    console.warn('[child-dynamics] synastry computation failed:', err);
    return [];
  }
}

// Element index: 0=Fire (1,5,9), 1=Earth (2,6,10), 2=Air (3,7,11), 3=Water (4,8,12)
const ELEMENT_NAMES = {
  en: ['Fire', 'Earth', 'Air', 'Water'] as const,
  hi: ['अग्नि', 'पृथ्वी', 'वायु', 'जल'] as const,
};

// Specific dynamics for each element pair (parent element → child element)
// 4×4 = 16 combinations, minus 4 same-element = 12 cross-element pairs
const CROSS_ELEMENT_DYNAMICS: Record<string, { en: string; hi: string }> = {
  '0-1': { // Fire parent, Earth child
    en: 'Your fiery enthusiasm meets their grounded patience. You inspire ambition; they need steady encouragement rather than intensity. Slow down to match their pace  –  they process emotions through routine and security.',
    hi: 'आपका अग्नि उत्साह उनकी पृथ्वी-जैसी धैर्य से मिलता है। आप महत्वाकांक्षा जगाते हैं; उन्हें तीव्रता की नहीं, स्थिर प्रोत्साहन की आवश्यकता है। उनकी गति से चलें  –  वे दिनचर्या और सुरक्षा से भावनाएँ संसाधित करते हैं।',
  },
  '0-2': { // Fire parent, Air child
    en: 'Both of you are active and expressive  –  conversations flow easily. But you act on impulse while they need to talk things through. Give them space to articulate before you jump to solutions.',
    hi: 'आप दोनों सक्रिय और अभिव्यक्तिशील हैं  –  संवाद सहज है। लेकिन आप आवेग से कार्य करते हैं जबकि वे बातचीत से समझना चाहते हैं। समाधान पर कूदने से पहले उन्हें बोलने का अवसर दें।',
  },
  '0-3': { // Fire parent, Water child
    en: 'Your directness can overwhelm their sensitive nature. This child absorbs your energy deeply  –  what feels casual to you may feel intense to them. Soften your tone when emotions run high.',
    hi: 'आपकी सीधी शैली उनकी संवेदनशील प्रकृति को अभिभूत कर सकती है। यह बच्चा आपकी ऊर्जा गहराई से अवशोषित करता है  –  जो आपको सामान्य लगे, उन्हें तीव्र लग सकता है। भावनाएँ उठने पर स्वर कोमल रखें।',
  },
  '1-0': { // Earth parent, Fire child
    en: 'You provide stability; they crave adventure. This child needs room to explore and fail  –  your natural caution helps keep them safe, but too much restriction dims their spark. Balance structure with freedom.',
    hi: 'आप स्थिरता देते हैं; वे रोमांच चाहते हैं। इस बच्चे को खोजने और गिरने की जगह चाहिए  –  आपकी सावधानी उन्हें सुरक्षित रखती है, लेकिन अधिक प्रतिबंध उनकी चमक धुँधली करता है। संरचना और स्वतंत्रता में संतुलन रखें।',
  },
  '1-2': { // Earth parent, Air child
    en: 'You show love through actions and providing; they show it through ideas and words. This child may seem scattered to you, but they think best when allowed to explore multiple interests. Patience with their changeability strengthens your bond.',
    hi: 'आप प्यार कर्मों और देखभाल से दिखाते हैं; वे विचारों और शब्दों से। यह बच्चा आपको बिखरा लग सकता है, लेकिन वे कई रुचियों में स्वतंत्रता से सर्वश्रेष्ठ सोचते हैं। उनकी परिवर्तनशीलता के प्रति धैर्य बंधन मजबूत करता है।',
  },
  '1-3': { // Earth parent, Water child
    en: 'A naturally harmonious pair  –  you provide the security they crave, and they bring emotional depth to your practical world. This child thrives on physical affection and consistent routine from you.',
    hi: 'एक स्वाभाविक रूप से सामंजस्यपूर्ण जोड़ी  –  आप वह सुरक्षा देते हैं जिसकी उन्हें लालसा है, और वे आपकी व्यावहारिक दुनिया में भावनात्मक गहराई लाते हैं। यह बच्चा आपसे शारीरिक स्नेह और निरंतर दिनचर्या पर फलता-फूलता है।',
  },
  '2-0': { // Air parent, Fire child
    en: 'You understand each other\'s need for independence. This child responds to intellectual stimulation  –  explain the "why" and they engage fully. Challenge: you may rationalise when they need passionate affirmation.',
    hi: 'आप दोनों एक-दूसरे की स्वतंत्रता की आवश्यकता समझते हैं। यह बच्चा बौद्धिक उत्तेजना से जुड़ता है  –  "क्यों" समझाएँ और वे पूरी तरह जुड़ जाएँगे। चुनौती: जब उन्हें भावनात्मक पुष्टि चाहिए तब आप तर्कसंगत बना सकते हैं।',
  },
  '2-1': { // Air parent, Earth child
    en: 'You live in ideas; they live in tangible reality. This child needs concrete examples, not abstract reasoning. Show them rather than tell them  –  hands-on activities build your connection better than long explanations.',
    hi: 'आप विचारों में रहते हैं; वे ठोस वास्तविकता में। इस बच्चे को अमूर्त तर्क नहीं, ठोस उदाहरण चाहिए। बताने की बजाय दिखाएँ  –  व्यावहारिक गतिविधियाँ लंबे स्पष्टीकरणों से बेहतर जुड़ाव बनाती हैं।',
  },
  '2-3': { // Air parent, Water child
    en: 'You approach feelings intellectually; they feel them viscerally. When this child is upset, they need a hug before a discussion. Resist the urge to "fix" their emotions with logic  –  just being present is what they need.',
    hi: 'आप भावनाओं को बौद्धिक रूप से देखते हैं; वे उन्हें गहराई से महसूस करते हैं। जब यह बच्चा परेशान हो, तो चर्चा से पहले गले लगाना ज़रूरी है। तर्क से भावनाएँ "ठीक" करने की इच्छा रोकें  –  बस उपस्थित रहना ही उनकी ज़रूरत है।',
  },
  '3-0': { // Water parent, Fire child
    en: 'You feel deeply; they act boldly. This child\'s fearlessness may trigger your protective instincts. They need you to believe in their courage rather than shield them. Your emotional intelligence is their anchor  –  when they burn too bright, you help them cool down.',
    hi: 'आप गहराई से महसूस करते हैं; वे साहस से कार्य करते हैं। इस बच्चे की निडरता आपकी सुरक्षात्मक प्रवृत्ति को जगा सकती है। उन्हें ढालने की बजाय उनके साहस पर विश्वास करें। आपकी भावनात्मक बुद्धिमत्ता उनका लंगर है  –  जब वे बहुत तेज चमकें, आप उन्हें शांत करते हैं।',
  },
  '3-1': { // Water parent, Earth child
    en: 'A naturally nurturing pair. You intuit what they need; they appreciate your care without needing grand gestures. This child may not express emotions openly  –  watch for subtle signs rather than expecting verbal affirmation.',
    hi: 'एक स्वाभाविक रूप से पोषणकारी जोड़ी। आप सहज रूप से समझते हैं उन्हें क्या चाहिए; वे बिना भव्य इशारों के आपकी देखभाल की सराहना करते हैं। यह बच्चा भावनाएँ खुलकर व्यक्त नहीं कर सकता  –  मौखिक पुष्टि की अपेक्षा से बेहतर है सूक्ष्म संकेत देखें।',
  },
  '3-2': { // Water parent, Air child
    en: 'You process through feeling; they process through talking. This child may seem emotionally detached, but they express care differently  –  through curiosity and sharing ideas. Don\'t mistake their need for space as rejection.',
    hi: 'आप भावना से संसाधित करते हैं; वे बातचीत से। यह बच्चा भावनात्मक रूप से अलग लग सकता है, लेकिन वे अलग तरीके से देखभाल व्यक्त करते हैं  –  जिज्ञासा और विचार साझा करके। उनकी अकेलेपन की ज़रूरत को अस्वीकृति न समझें।',
  },
};

function analyzeMoonConnection(parent: KundaliData, child: KundaliData): { en: string; hi: string } {
  const planetsP = parent.planets as unknown as Array<Record<string, unknown>>;
  const planetsC = child.planets as unknown as Array<Record<string, unknown>>;
  const moonP = planetsP.find(p => getPid(p) === 1);
  const moonC = planetsC.find(p => getPid(p) === 1);

  if (!moonP || !moonC) {
    return { en: 'Moon connection data not available.', hi: 'चंद्र संबंध डेटा उपलब्ध नहीं है।' };
  }

  const moonSignP = moonP.sign as number;
  const moonSignC = moonC.sign as number;

  // Element: Fire=0 (signs 1,5,9), Earth=1 (2,6,10), Air=2 (3,7,11), Water=3 (4,8,12)
  const elementP = ((moonSignP - 1) % 4);
  const elementC = ((moonSignC - 1) % 4);

  if (moonSignP === moonSignC) {
    return {
      en: 'Your Moons share the same sign  –  a natural emotional resonance. You intuitively understand this child\'s feelings.',
      hi: 'आपके चंद्रमा एक ही राशि में हैं  –  प्राकृतिक भावनात्मक अनुनाद। आप सहज रूप से इस बच्चे की भावनाओं को समझते हैं।',
    };
  }

  if (elementP === elementC) {
    const elemEn = ELEMENT_NAMES.en[elementP];
    const elemHi = ELEMENT_NAMES.hi[elementP];
    return {
      en: `Both Moons are in ${elemEn} signs  –  you share an emotional wavelength. Communication feels natural and misunderstandings resolve quickly.`,
      hi: `दोनों चंद्रमा ${elemHi} राशियों में हैं  –  आप एक भावनात्मक तरंगदैर्ध्य साझा करते हैं। संवाद स्वाभाविक है और गलतफहमियाँ जल्दी दूर होती हैं।`,
    };
  }

  // Cross-element: use specific pair dynamics
  const key = `${elementP}-${elementC}`;
  const specific = CROSS_ELEMENT_DYNAMICS[key];
  if (specific) return specific;

  // Fallback (should never reach here, but safety)
  return {
    en: `Your Moon (${ELEMENT_NAMES.en[elementP]}) and theirs (${ELEMENT_NAMES.en[elementC]}) process emotions differently. Understanding these differences strengthens your bond.`,
    hi: `आपका चंद्र (${ELEMENT_NAMES.hi[elementP]}) और उनका (${ELEMENT_NAMES.hi[elementC]}) भावनाओं को अलग-अलग संसाधित करते हैं। इन अंतरों को समझना बंधन मजबूत करता है।`,
  };
}

function detectChildKarmicIndicators(parent: KundaliData, child: KundaliData): KarmicIndicator[] {
  const indicators: KarmicIndicator[] = [];
  const planetsP = parent.planets as unknown as Array<Record<string, unknown>>;
  const planetsC = child.planets as unknown as Array<Record<string, unknown>>;

  const rahuP = planetsP.find(p => getPid(p) === 7);
  const rahuC = planetsC.find(p => getPid(p) === 7);
  const moonC = planetsC.find(p => getPid(p) === 1);
  const sunP = planetsP.find(p => getPid(p) === 0);

  // Parent's Rahu on child's Moon
  if (rahuP && moonC && (rahuP.sign as number) === (moonC.sign as number)) {
    indicators.push({
      type: 'nodal_contact',
      description: {
        en: 'Your Rahu on their Moon  –  you play a pivotal role in this child\'s emotional growth and life direction.',
        hi: 'आपका राहु उनके चंद्रमा पर  –  आप इस बच्चे की भावनात्मक वृद्धि और जीवन दिशा में महत्वपूर्ण भूमिका निभाते हैं।',
      },
      strength: 8,
    });
  }

  // Child's Rahu on parent's Sun
  if (rahuC && sunP && (rahuC.sign as number) === (sunP.sign as number)) {
    indicators.push({
      type: 'nodal_contact',
      description: {
        en: 'Their Rahu on your Sun  –  this child pushes you to grow in ways you didn\'t expect.',
        hi: 'उनका राहु आपके सूर्य पर  –  यह बच्चा आपको अप्रत्याशित तरीकों से बढ़ने के लिए प्रेरित करता है।',
      },
      strength: 7,
    });
  }

  return indicators;
}

function analyzePutrakaraka(parent: KundaliData): { en: string; hi: string } {
  const pk = parent.jaimini?.charaKarakas?.find(k => k.karaka === 'PK');

  if (pk) {
    const name = pk.planetName?.en ?? 'PK';
    return {
      en: `Your Putrakaraka (${name}) guides the nature of your parenting style and what you seek to nurture in your children.`,
      hi: `आपका पुत्रकारक (${name}) आपकी पालन-पोषण शैली और आप अपने बच्चों में क्या पोषित करना चाहते हैं, इसका मार्गदर्शन करता है।`,
    };
  }

  return {
    en: 'Putrakaraka analysis reveals your innate parenting strengths based on Jaimini principles.',
    hi: 'पुत्रकारक विश्लेषण जैमिनी सिद्धांतों के आधार पर आपकी जन्मजात पालन-पोषण शक्तियों को प्रकट करता है।',
  };
}

/**
 * Compute complete child dynamics between parent and child charts.
 */
export function computeChildDynamics(
  parentChart: KundaliData,
  childChart: KundaliData,
  childName: string,
  transitPlanets: PlanetPosition[],
): RelationshipDynamics {
  const synastryHighlights = mapSynastryHighlights(parentChart, childChart);
  const vargaCrossRead = computeVargaCrossRead(parentChart, childChart, 'D7');
  const karmicIndicators = detectChildKarmicIndicators(parentChart, childChart);
  const moonConnection = analyzeMoonConnection(parentChart, childChart);
  const karakaAnalysis = analyzePutrakaraka(parentChart);

  const transitImpact = computeTransitRelationshipImpact(parentChart, childChart, transitPlanets, 'children');
  const dashaSynchronicity = computeDashaSynchronicity(parentChart, childChart, 'children');
  const upcomingWindows = generateUpcomingWindows(transitImpact, dashaSynchronicity, 'children');
  const stressPeriods = generateStressPeriods(transitImpact);

  const actionItems = generateChildActionItems(transitImpact, dashaSynchronicity, childName);
  const monthlyForecast = generateMonthlyForecast(transitImpact, dashaSynchronicity, 'children');

  // Build current dynamic narrative — specific, not generic
  let enDynamic = `Your bond with ${childName}: `;
  let hiDynamic = `${childName} के साथ आपका बंधन: `;

  // Lead with the most specific signal: transit details
  const totalHits = transitImpact.yourTransits.length + transitImpact.theirTransits.length;
  if (totalHits > 0) {
    const topHit = transitImpact.yourTransits[0] ?? transitImpact.theirTransits[0];
    enDynamic += topHit.effect.en + ' ';
    hiDynamic += (topHit.effect.hi ?? topHit.effect.en) + ' ';
  }

  // Moon element connection — specific per element pair
  enDynamic += moonConnection.en + ' ';
  hiDynamic += moonConnection.hi + ' ';

  // Dasha sync adds concrete actionable insight
  if (dashaSynchronicity.inSync) {
    enDynamic += `Your dasha periods are aligned with ${childName}'s developmental cycle  –  parenting decisions come more naturally now.`;
    hiDynamic += `आपकी दशाएँ ${childName} के विकास चक्र के साथ संरेखित हैं  –  पालन-पोषण के निर्णय अभी अधिक स्वाभाविक आते हैं।`;
  } else if (totalHits === 0) {
    enDynamic += `No major planetary pressure on this bond right now  –  a stable period for building connection.`;
    hiDynamic += `इस बंधन पर अभी कोई बड़ा ग्रह दबाव नहीं  –  जुड़ाव बनाने का स्थिर समय।`;
  }

  return {
    synastryHighlights,
    gunaScore: undefined, // Not applicable for parent-child
    gunaBreakdown: undefined,
    vargaCrossRead,
    karmicIndicators,
    karakaAnalysis,
    transitImpact,
    dashaSynchronicity,
    upcomingWindows,
    stressPeriods,
    currentDynamic: { en: enDynamic.trim(), hi: hiDynamic.trim() },
    actionItems,
    monthlyForecast,
  };
}
