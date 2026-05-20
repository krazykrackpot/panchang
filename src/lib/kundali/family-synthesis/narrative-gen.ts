/**
 * Narrative Generation -- produces actionable guidance text from computed factors.
 *
 * All text is bilingual (en/hi). Tamil and Bengali fall back to en via the
 * tl() helper at render time.
 */

import type {
  ActionItem, TransitRelationshipImpact, DashaSyncAnalysis,
  SynastryHighlight, RelationshipWindow, StressPeriod,
} from './types';
import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Marriage Action Items
// ---------------------------------------------------------------------------

export function generateMarriageActionItems(
  transit: TransitRelationshipImpact,
  dashaSync: DashaSyncAnalysis,
  synastryHighlights: SynastryHighlight[],
  gunaScore?: number,
): ActionItem[] {
  const items: ActionItem[] = [];

  // Transit-based items
  if (transit.overallTone === 'supportive') {
    items.push({
      type: 'do',
      text: {
        en: 'Current transits favour your partnership. This is a good period for joint decisions, shared goals, and deepening trust.',
        hi: 'वर्तमान गोचर आपकी साझेदारी के अनुकूल हैं। यह संयुक्त निर्णयों, साझा लक्ष्यों और विश्वास बढ़ाने का अच्छा समय है।',
      },
      timing: 'This month',
      relevance: 8,
    });
  } else if (transit.overallTone === 'challenging') {
    items.push({
      type: 'avoid',
      text: {
        en: 'Transit pressure on relationship houses suggests this is not ideal for major confrontations. Practise patience and defer contentious discussions.',
        hi: 'संबंध भावों पर गोचर दबाव बताता है कि यह बड़े टकराव का समय नहीं है। धैर्य रखें और विवादास्पद चर्चाओं को टालें।',
      },
      timing: 'This month',
      relevance: 9,
    });
  }

  // Malefic transit warnings
  for (const hit of [...transit.yourTransits, ...transit.theirTransits]) {
    if (hit.planet === 'Saturn' && hit.house === 7) {
      items.push({
        type: 'watch',
        text: {
          en: 'Saturn transiting the 7th house tests commitment. Focus on reliability and shared responsibilities rather than romance.',
          hi: 'शनि 7वें भाव में गोचर कर रहा है -- प्रतिबद्धता की परीक्षा। रोमांस की बजाय विश्वसनीयता और साझा ज़िम्मेदारियों पर ध्यान दें।',
        },
        timing: 'Ongoing',
        relevance: 9,
      });
    }
    if (hit.planet === 'Rahu' && hit.house === 7) {
      items.push({
        type: 'watch',
        text: {
          en: 'Rahu in the 7th house can create restlessness or unconventional desires in the partnership. Stay grounded in shared values.',
          hi: 'राहु 7वें भाव में साझेदारी में बेचैनी या असामान्य इच्छाएँ पैदा कर सकता है। साझा मूल्यों में स्थिर रहें।',
        },
        timing: 'Ongoing',
        relevance: 8,
      });
    }
  }

  // Guna score item
  if (gunaScore !== undefined) {
    if (gunaScore >= 24) {
      items.push({
        type: 'do',
        text: {
          en: `Your Guna score of ${gunaScore}/36 is excellent. The innate compatibility supports working through any temporary transient friction.`,
          hi: `आपका गुण स्कोर ${gunaScore}/36 उत्कृष्ट है। अंतर्निहित अनुकूलता किसी भी अस्थायी घर्षण को पार करने में सहायक है।`,
        },
        relevance: 6,
      });
    }
  }

  // Dasha-based items
  if (dashaSync.inSync) {
    items.push({
      type: 'do',
      text: {
        en: 'Both your dasha periods are activating relationship houses simultaneously. This is a rare alignment -- use it for meaningful conversations, shared rituals, or relationship milestones.',
        hi: 'आपकी और उनकी दोनों दशाएँ एक साथ संबंध भावों को सक्रिय कर रही हैं। यह दुर्लभ संयोग है -- इसे सार्थक बातचीत, साझा अनुष्ठानों या रिश्ते के मील के पत्थरों के लिए उपयोग करें।',
      },
      timing: 'Current dasha period',
      relevance: 9,
    });
  }

  // Synastry-based items
  const harmonious = synastryHighlights.filter(s => s.nature === 'harmonious');
  const challenging = synastryHighlights.filter(s => s.nature === 'challenging');

  if (harmonious.length > 0) {
    const top = harmonious[0];
    items.push({
      type: 'do',
      text: {
        en: `Your ${top.yourPlanet}-${top.theirPlanet} ${top.aspect} is a source of natural harmony. Lean into activities that resonate with this energy.`,
        hi: `आपका ${top.yourPlanet}-${top.theirPlanet} ${top.aspect} प्राकृतिक सामंजस्य का स्रोत है। इस ऊर्जा से जुड़ी गतिविधियों में भाग लें।`,
      },
      relevance: 7,
    });
  }

  if (challenging.length > 0) {
    const top = challenging[0];
    items.push({
      type: 'watch',
      text: {
        en: `The ${top.yourPlanet}-${top.theirPlanet} ${top.aspect} can create friction. Awareness is the remedy -- acknowledge this dynamic rather than fighting it.`,
        hi: `${top.yourPlanet}-${top.theirPlanet} ${top.aspect} घर्षण पैदा कर सकता है। जागरूकता ही उपाय है -- इस गतिशीलता को स्वीकार करें, लड़ें नहीं।`,
      },
      relevance: 7,
    });
  }

  // Sort by relevance descending, cap at 5
  return items.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
}

// ---------------------------------------------------------------------------
// Child Action Items
// ---------------------------------------------------------------------------

export function generateChildActionItems(
  transit: TransitRelationshipImpact,
  dashaSync: DashaSyncAnalysis,
  childName: string,
): ActionItem[] {
  const items: ActionItem[] = [];

  if (transit.overallTone === 'supportive') {
    items.push({
      type: 'do',
      text: {
        en: `Transits are favourable for your bond with ${childName}. Good time for quality activities, learning together, or introducing new experiences.`,
        hi: `${childName} के साथ आपके बंधन के लिए गोचर अनुकूल हैं। गुणवत्तापूर्ण गतिविधियों, साथ में सीखने या नए अनुभवों के लिए अच्छा समय।`,
      },
      timing: 'This month',
      relevance: 8,
    });
  } else if (transit.overallTone === 'challenging') {
    items.push({
      type: 'watch',
      text: {
        en: `${childName} may feel pressure from transit influences. Extra patience, listening, and stability will help them navigate this period.`,
        hi: `${childName} गोचर प्रभावों से दबाव महसूस कर सकते हैं। अतिरिक्त धैर्य, सुनना और स्थिरता इस अवधि में उनकी मदद करेगी।`,
      },
      timing: 'This month',
      relevance: 9,
    });
  }

  // Saturn on child's 4th house (home/emotional security)
  for (const hit of transit.theirTransits) {
    if (hit.planet === 'Saturn' && hit.house === 4) {
      items.push({
        type: 'watch',
        text: {
          en: `Saturn transiting ${childName}'s 4th house may create a need for extra emotional security. Maintain routines and offer reassurance.`,
          hi: `शनि ${childName} के 4थे भाव में -- अतिरिक्त भावनात्मक सुरक्षा की ज़रूरत हो सकती है। दिनचर्या बनाए रखें और आश्वासन दें।`,
        },
        timing: 'Ongoing',
        relevance: 8,
      });
    }
    if (hit.planet === 'Jupiter' && (hit.house === 5 || hit.house === 9)) {
      items.push({
        type: 'do',
        text: {
          en: `Jupiter blesses ${childName}'s house of learning. Encourage education, new skills, or spiritual practices during this transit.`,
          hi: `गुरु ${childName} के शिक्षा भाव को आशीर्वाद दे रहा है। इस गोचर में शिक्षा, नए कौशल या आध्यात्मिक अभ्यास को प्रोत्साहित करें।`,
        },
        timing: 'This quarter',
        relevance: 8,
      });
    }
  }

  if (dashaSync.inSync) {
    items.push({
      type: 'do',
      text: {
        en: `Your dasha periods are aligned with ${childName}'s developmental cycle. Parenting feels more natural now -- trust your instincts.`,
        hi: `आपकी दशा ${childName} के विकास चक्र के साथ संरेखित है। पालन-पोषण अभी अधिक स्वाभाविक लगता है -- अपनी सहज बुद्धि पर भरोसा करें।`,
      },
      timing: 'Current period',
      relevance: 7,
    });
  }

  return items.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
}

// ---------------------------------------------------------------------------
// Monthly Forecast
// ---------------------------------------------------------------------------

// Malefic weight for ranking: Saturn strongest, then Rahu, Ketu, Jupiter lightest
// Saturn=6, Rahu=7, Ketu=8, Jupiter=4, Venus=5
const MALEFIC_WEIGHT: Record<number, number> = { 6: 4, 7: 3, 8: 2, 4: 1, 5: 0 };

// Modifier sentences: how a secondary planet colours the dominant transit
// Keyed by: "secondaryPlanetId-isBenefic"
const MODIFIER: Record<string, { en: string; hi: string }> = {
  '4-true':  { en: 'Jupiter\'s presence softens the edges — optimism and wisdom provide a cushion.', hi: 'गुरु की उपस्थिति कठोरता को कम करती है — आशावाद और ज्ञान सहारा देते हैं।' },
  '4-false': { en: 'Jupiter adds a restless urge to expand — guard against overcommitting.', hi: 'गुरु विस्तार की बेचैन इच्छा जोड़ता है — अत्यधिक प्रतिबद्धता से बचें।' },
  '5-true':  { en: 'Venus brings harmony and affection, smoothing rough patches.', hi: 'शुक्र सामंजस्य और स्नेह लाता है, कठिनाइयों को सहज करता है।' },
  '5-false': { en: 'Venus stirs desires and comparisons — appreciate what you have before seeking more.', hi: 'शुक्र इच्छाओं और तुलनाओं को उत्तेजित करता है — और माँगने से पहले जो है उसकी सराहना करें।' },
  '6-true':  { en: 'Saturn adds a serious undertone — responsibilities deepen but so does commitment.', hi: 'शनि गम्भीर स्वर जोड़ता है — ज़िम्मेदारियाँ गहरी होती हैं लेकिन प्रतिबद्धता भी।' },
  '6-false': { en: 'Saturn\'s weight compounds the pressure — prioritise what truly matters and let go of the rest.', hi: 'शनि का भार दबाव को बढ़ाता है — जो सच में मायने रखता है उसे प्राथमिकता दें, बाकी छोड़ दें।' },
  '7-true':  { en: 'Rahu introduces an element of surprise — stay adaptable and open to the unexpected.', hi: 'राहु आश्चर्य का तत्व लाता है — अनुकूलनीय रहें और अप्रत्याशित के लिए खुले रहें।' },
  '7-false': { en: 'Rahu amplifies restlessness and illusion — what looks appealing may not be what it seems.', hi: 'राहु बेचैनी और भ्रम को बढ़ाता है — जो आकर्षक लगे वह वैसा न हो जैसा दिखता है।' },
  '8-true':  { en: 'Ketu brings a spiritual undercurrent — detachment here is healthy, not neglectful.', hi: 'केतु आध्यात्मिक अंतर्धारा लाता है — यहाँ वैराग्य स्वस्थ है, उपेक्षा नहीं।' },
  '8-false': { en: 'Ketu adds a sense of disconnection — be mindful of emotional withdrawal becoming a habit.', hi: 'केतु विरक्ति की भावना जोड़ता है — भावनात्मक वापसी को आदत न बनने दें।' },
};

export function generateMonthlyForecast(
  transit: TransitRelationshipImpact,
  dashaSync: DashaSyncAnalysis,
  context: 'marriage' | 'children',
): LocaleText {
  const month = new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' });
  const contextEn = context === 'marriage' ? 'relationship' : 'parent-child bond';
  const contextHi = context === 'marriage' ? 'संबंध' : 'माता-पिता-संतान बंधन';

  const allHits = [...transit.yourTransits, ...transit.theirTransits];
  let en = `${month}: `;
  let hi = `${month}: `;

  if (allHits.length === 0) {
    en += `No major slow-planet transits are pressuring your ${contextEn} this month  –  a stable, low-drama period. `;
    hi += `इस माह आपके ${contextHi} पर कोई प्रमुख धीमे ग्रह दबाव नहीं  –  स्थिर, शांत अवधि। `;
  } else if (allHits.length === 1) {
    // Single transit — just use its full effect
    en += allHits[0].effect.en + ' ';
    hi += (allHits[0].effect.hi ?? allHits[0].effect.en) + ' ';
  } else {
    // Multiple transits: dominant + modifier pattern
    // Sort by malefic weight descending — strongest influence leads
    const sorted = [...allHits].sort((a, b) =>
      (MALEFIC_WEIGHT[b.planetId] ?? 0) - (MALEFIC_WEIGHT[a.planetId] ?? 0)
    );

    // Deduplicate by planetId (same planet hitting multiple houses — take first)
    const seen = new Set<number>();
    const unique = sorted.filter(h => {
      if (seen.has(h.planetId)) return false;
      seen.add(h.planetId);
      return true;
    });

    // Lead with dominant planet's full commentary
    const dominant = unique[0];
    en += dominant.effect.en + ' ';
    hi += (dominant.effect.hi ?? dominant.effect.en) + ' ';

    // Add modifier sentences for secondary planets (up to 2)
    for (const secondary of unique.slice(1, 3)) {
      const modKey = `${secondary.planetId}-${secondary.isBenefic}`;
      const mod = MODIFIER[modKey];
      if (mod) {
        en += mod.en + ' ';
        hi += mod.hi + ' ';
      }
    }
  }

  if (dashaSync.inSync) {
    en += 'Dasha alignment amplifies the bond  –  growth feels natural this period. ';
    hi += 'दशा संरेखण बंधन को बढ़ाता है  –  इस अवधि में विकास स्वाभाविक लगता है। ';
  }

  return { en: en.trim(), hi: hi.trim() };
}

// ---------------------------------------------------------------------------
// Family Summary
// ---------------------------------------------------------------------------

export function generateFamilySummary(
  hasSpouse: boolean,
  childrenCount: number,
  marriageTone?: TransitRelationshipImpact['overallTone'],
  anyDashaSync?: boolean,
): LocaleText {
  let en = '';
  let hi = '';

  if (hasSpouse && childrenCount > 0) {
    en = `Your family dynamics are active across ${1 + childrenCount} relationships. `;
    hi = `आपकी पारिवारिक गतिशीलता ${1 + childrenCount} संबंधों में सक्रिय है। `;
  } else if (hasSpouse) {
    en = 'Your marriage is the primary relationship dynamic this period. ';
    hi = 'इस अवधि में आपका विवाह प्राथमिक संबंध गतिशीलता है। ';
  } else if (childrenCount > 0) {
    en = `Your parenting dynamic with ${childrenCount} ${childrenCount === 1 ? 'child' : 'children'} is in focus. `;
    hi = `${childrenCount} ${childrenCount === 1 ? 'संतान' : 'संतानों'} के साथ आपकी पालन-पोषण गतिशीलता केंद्र में है। `;
  }

  if (marriageTone === 'supportive') {
    en += 'Marriage transits are supportive -- a nurturing foundation for the family. ';
    hi += 'वैवाहिक गोचर सहायक हैं -- परिवार के लिए पोषणकारी आधार। ';
  } else if (marriageTone === 'challenging') {
    en += 'Marriage transits bring some tension -- prioritise communication and patience. ';
    hi += 'वैवाहिक गोचर कुछ तनाव ला रहे हैं -- संवाद और धैर्य को प्राथमिकता दें। ';
  }

  if (anyDashaSync) {
    en += 'Dasha alignment across charts creates a window for meaningful family connection.';
    hi += 'चार्ट्स में दशा संरेखण सार्थक पारिवारिक जुड़ाव का अवसर बनाता है।';
  }

  return { en: en.trim(), hi: hi.trim() };
}

// ---------------------------------------------------------------------------
// Upcoming Windows & Stress Periods (simplified -- based on transit data)
// ---------------------------------------------------------------------------

export function generateUpcomingWindows(
  transit: TransitRelationshipImpact,
  dashaSync: DashaSyncAnalysis,
  context: 'marriage' | 'children',
): RelationshipWindow[] {
  const windows: RelationshipWindow[] = [];
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const twoMonths = new Date(now.getFullYear(), now.getMonth() + 2, 1);

  if (transit.overallTone === 'supportive') {
    windows.push({
      startDate: now.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0],
      type: 'bonding',
      description: {
        en: context === 'marriage'
          ? 'Benefic transits create a natural bonding window for your partnership.'
          : 'Positive transit energy supports quality time with your child.',
        hi: context === 'marriage'
          ? 'शुभ गोचर आपकी साझेदारी के लिए प्राकृतिक बंधन का अवसर बनाते हैं।'
          : 'सकारात्मक गोचर ऊर्जा आपके बच्चे के साथ गुणवत्ता समय का समर्थन करती है।',
      },
    });
  }

  if (dashaSync.inSync) {
    windows.push({
      startDate: now.toISOString().split('T')[0],
      endDate: twoMonths.toISOString().split('T')[0],
      type: 'milestone',
      description: {
        en: 'Dasha synchronicity makes this an auspicious period for relationship milestones.',
        hi: 'दशा समन्वय इसे संबंध के मील के पत्थरों के लिए शुभ अवधि बनाता है।',
      },
    });
  }

  return windows;
}

export function generateStressPeriods(
  transit: TransitRelationshipImpact,
): StressPeriod[] {
  const periods: StressPeriod[] = [];
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth() + 3, 1);

  // Flag stress from malefic transits on relationship houses
  const maleficHits = [...transit.yourTransits, ...transit.theirTransits].filter(
    h => ['Saturn', 'Rahu', 'Ketu', 'Mars'].includes(h.planet),
  );

  for (const hit of maleficHits) {
    periods.push({
      startDate: now.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      trigger: `${hit.planet} transiting ${hit.house}th house`,
      severity: hit.planet === 'Saturn' ? 'moderate' : hit.planet === 'Rahu' ? 'moderate' : 'mild',
      guidance: hit.effect,
    });
  }

  return periods;
}
