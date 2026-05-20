/**
 * Transit Relationship Impact -- how current transits affect relationship houses.
 *
 * For marriage: checks transits to 7th house (partnership), 1st (self in relationship),
 * 2nd house (family/shared resources) in both charts.
 *
 * For children: checks transits to 5th house (children), 1st (child's identity),
 * 4th house (home/nurture) in both charts.
 *
 * Only considers slow planets: Jupiter(4), Venus(5), Saturn(6), Rahu(7), Ketu(8).
 * Whole sign house system: house sign = ((ascSign - 1 + house - 1) % 12) + 1.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { TransitRelationshipImpact, TransitHit } from './types';

const RASHI_NAMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'Aries', hi: 'मेष' }, 2: { en: 'Taurus', hi: 'वृषभ' },
  3: { en: 'Gemini', hi: 'मिथुन' }, 4: { en: 'Cancer', hi: 'कर्क' },
  5: { en: 'Leo', hi: 'सिंह' }, 6: { en: 'Virgo', hi: 'कन्या' },
  7: { en: 'Libra', hi: 'तुला' }, 8: { en: 'Scorpio', hi: 'वृश्चिक' },
  9: { en: 'Sagittarius', hi: 'धनु' }, 10: { en: 'Capricorn', hi: 'मकर' },
  11: { en: 'Aquarius', hi: 'कुम्भ' }, 12: { en: 'Pisces', hi: 'मीन' },
};

const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' }, 1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' }, 3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' }, 5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' }, 7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

// Slow planets that matter for transit analysis
const SLOW_PLANET_IDS = [4, 5, 6, 7, 8]; // Jupiter, Venus, Saturn, Rahu, Ketu

// Benefic vs malefic for tone assessment
const BENEFIC_IDS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus
const MALEFIC_IDS = new Set([0, 2, 6, 7, 8]); // Sun, Mars, Saturn, Rahu, Ketu

type Context = 'marriage' | 'children';

/** Helper: extract planet id from a PlanetPosition-like object. */
function getPid(p: PlanetPosition | Record<string, unknown>): number {
  // Real PlanetPosition has p.planet.id; test fixtures may have p.id directly
  const raw = p as Record<string, unknown>;
  if (typeof raw.id === 'number') return raw.id;
  if (raw.planet && typeof (raw.planet as Record<string, unknown>).id === 'number') {
    return (raw.planet as Record<string, unknown>).id as number;
  }
  return -1;
}

/** Get the houses relevant to a relationship context. */
function getRelationshipHouses(context: Context): number[] {
  return context === 'marriage' ? [7, 1, 2] : [5, 1, 4];
}

// ---------------------------------------------------------------------------
// Planet-house transit commentary — concrete life implications
// ---------------------------------------------------------------------------

type TransitText = { beneficEn: string; beneficHi: string; maleficEn: string; maleficHi: string };

// Context-specific: keyed as "planetId-house-context"
const TRANSIT_COMMENTARY: Record<string, TransitText> = {
  // CHILDREN: houses 5, 1, 4
  '6-5-children': { beneficEn: 'Discipline and structure around parenting pay off. Your child responds well to clear expectations and consistent routines right now.', beneficHi: 'पालन-पोषण में अनुशासन और संरचना का फल मिल रहा है। स्पष्ट अपेक्षाओं और निरंतर दिनचर्या से बच्चा अच्छा प्रतिसाद दे रहा है।', maleficEn: 'Parenting feels heavier than usual. Your child may be going through a phase of resistance or withdrawal. Patience is essential — this is a maturing period, not a permanent shift.', maleficHi: 'पालन-पोषण सामान्य से भारी लग रहा है। बच्चा प्रतिरोध या अंतर्मुखता के दौर से गुज़र सकता है। धैर्य आवश्यक — यह परिपक्वता का समय है, स्थायी बदलाव नहीं।' },
  '6-1-children': { beneficEn: 'Your child is developing self-discipline and taking more responsibility. A good time to introduce structured learning or sports.', beneficHi: 'बच्चे में आत्म-अनुशासन विकसित हो रहा है और वह अधिक ज़िम्मेदारी ले रहा है। संरचित शिक्षा या खेल शुरू करने का अच्छा समय।', maleficEn: 'Your child may feel burdened or low in confidence. Avoid adding pressure — lighten their load where possible and offer reassurance that effort matters more than results.', maleficHi: 'बच्चा बोझ या कम आत्मविश्वास महसूस कर सकता है। दबाव न डालें — जहाँ संभव हो बोझ कम करें और आश्वासन दें कि प्रयास परिणाम से ज़्यादा मायने रखता है।' },
  '6-4-children': { beneficEn: 'Home routines are settling into a stable rhythm. Your child feels secure in the household structure you have built.', beneficHi: 'घर की दिनचर्या स्थिर लय में बस रही है। आपने जो पारिवारिक संरचना बनायी है उसमें बच्चा सुरक्षित महसूस कर रहा है।', maleficEn: 'Home life may feel restrictive or tense. Renovations, relocations, or changes in household routine can unsettle your child. Maintain emotional warmth even when practical matters demand attention.', maleficHi: 'घरेलू जीवन प्रतिबंधित या तनावपूर्ण लग सकता है। नवीनीकरण, स्थानांतरण, या दिनचर्या में बदलाव बच्चे को अस्थिर कर सकता है। व्यावहारिक मामलों में व्यस्त होते हुए भी भावनात्मक गर्मजोशी बनाये रखें।' },
  '4-5-children': { beneficEn: 'A wonderful period for your child\'s growth. Education, creativity, and confidence are all expanding. Encourage new interests and celebrate their achievements.', beneficHi: 'बच्चे के विकास के लिए अद्भुत समय। शिक्षा, रचनात्मकता और आत्मविश्वास सब बढ़ रहे हैं। नई रुचियों को प्रोत्साहित करें और उपलब्धियों का उत्सव मनाएं।', maleficEn: 'Your child\'s growth is expanding. Education, creativity, and confidence are developing. Guide their enthusiasm with gentle boundaries.', maleficHi: 'बच्चे का विकास हो रहा है। शिक्षा, रचनात्मकता और आत्मविश्वास विकसित हो रहे हैं। कोमल सीमाओं के साथ उनके उत्साह का मार्गदर्शन करें।' },
  '4-1-children': { beneficEn: 'Your child radiates optimism and is naturally drawn to learning. A great time for family outings, cultural experiences, or starting a new hobby together.', beneficHi: 'बच्चा आशावाद विकिरित कर रहा है और स्वाभाविक रूप से सीखने की ओर आकर्षित है। पारिवारिक भ्रमण, सांस्कृतिक अनुभव, या साथ मिलकर नई रुचि शुरू करने का उत्तम समय।', maleficEn: 'Your child is feeling expansive and curious. Channel their energy into meaningful activities to avoid restlessness.', maleficHi: 'बच्चा विस्तारशील और जिज्ञासु महसूस कर रहा है। बेचैनी से बचने के लिए उनकी ऊर्जा को सार्थक गतिविधियों में लगाएं।' },
  '4-4-children': { beneficEn: 'Home feels warm and abundant. Family gatherings or celebrations bring joy. Your child thrives in this emotionally nourishing atmosphere.', beneficHi: 'घर गर्म और समृद्ध लगता है। पारिवारिक मिलन या उत्सव खुशी लाते हैं। इस भावनात्मक रूप से पोषक वातावरण में बच्चा फलता-फूलता है।', maleficEn: 'Home environment is generally positive. Small domestic changes bring fresh energy to the household.', maleficHi: 'घर का वातावरण सामान्यतः सकारात्मक है। छोटे घरेलू बदलाव परिवार में ताज़ी ऊर्जा लाते हैं।' },
  '7-5-children': { beneficEn: 'Unconventional interests emerge in your child. They may surprise you with new passions. Stay open rather than controlling.', beneficHi: 'बच्चे में अपरंपरागत रुचियाँ उभर रही हैं। वे नये जुनून से आश्चर्यचकित कर सकते हैं। नियंत्रण करने के बजाय खुले रहें।', maleficEn: 'Your child may be drawn to unfamiliar influences or rebel against established norms. This is a phase of testing boundaries — stay engaged without being overbearing.', maleficHi: 'बच्चा अपरिचित प्रभावों की ओर आकर्षित हो सकता है या स्थापित नियमों के विरुद्ध विद्रोह कर सकता है। यह सीमाओं की परीक्षा का दौर है — अत्यधिक दबाव डाले बिना जुड़े रहें।' },
  '7-4-children': { beneficEn: 'Changes in home dynamics bring fresh perspectives. New routines feel stimulating rather than unsettling.', beneficHi: 'घरेलू गतिशीलता में बदलाव ताज़ा दृष्टिकोण लाते हैं। नई दिनचर्या उत्तेजक लगती है।', maleficEn: 'Restlessness in the home environment. Your child may feel unsettled by changes in routine. Maintain a sense of normalcy through familiar rituals.', maleficHi: 'घरेलू वातावरण में बेचैनी। दिनचर्या में बदलाव से बच्चा अस्थिर महसूस कर सकता है। परिचित अनुष्ठानों से सामान्यता बनाये रखें।' },
  '8-5-children': { beneficEn: 'A contemplative period for your bond. Your child may show interest in deeper questions. Honour their need for quiet time.', beneficHi: 'आपके बंधन के लिए चिंतनशील अवधि। बच्चा गहरे प्रश्नों में रुचि दिखा सकता है। उनकी शांत समय की आवश्यकता का सम्मान करें।', maleficEn: 'Emotional detachment or confusion in your child\'s behaviour. They may seem distant. This is usually temporary — stay available without forcing closeness.', maleficHi: 'बच्चे के व्यवहार में भावनात्मक अलगाव या भ्रम। वे दूर लग सकते हैं। यह प्रायः अस्थायी है — निकटता बलपूर्वक बनाये बिना उपलब्ध रहें।' },

  // MARRIAGE: houses 7, 1, 2
  '6-7-marriage': { beneficEn: 'Commitment deepens through shared responsibilities. This period rewards couples who invest in long-term planning — finances, property, or family goals.', beneficHi: 'साझा ज़िम्मेदारियों से प्रतिबद्धता गहरी होती है। यह अवधि दीर्घकालिक योजना में निवेश करने वाले जोड़ों को पुरस्कृत करती है।', maleficEn: 'The partnership feels heavy or duty-bound. Conversations may revolve around obligations rather than affection. Carve out time for connection beyond logistics — a walk together, anything that reminds you why you chose each other.', maleficHi: 'साझेदारी भारी या कर्तव्य-बद्ध लगती है। बातचीत स्नेह के बजाय दायित्वों के इर्द-गिर्द हो सकती है। कार्यव्यवस्था से परे जुड़ाव के लिए समय निकालें।' },
  '6-1-marriage': { beneficEn: 'Personal discipline strengthens your role as a partner. You are showing up more consistently, and your spouse notices.', beneficHi: 'व्यक्तिगत अनुशासन साथी के रूप में आपकी भूमिका को मज़बूत करता है। आप अधिक निरंतरता से उपस्थित हो रहे हैं।', maleficEn: 'You may feel weighed down by personal responsibilities, leaving less energy for the relationship. Communicate what you are carrying — your partner may interpret your preoccupation as emotional distance.', maleficHi: 'व्यक्तिगत ज़िम्मेदारियों से बोझिल महसूस हो सकता है। बताएं कि आप क्या उठा रहे हैं — आपका साथी आपकी व्यस्तता को भावनात्मक दूरी समझ सकता है।' },
  '6-2-marriage': { beneficEn: 'Financial planning and shared savings are going well. Joint investments or budget discipline pay dividends.', beneficHi: 'वित्तीय योजना और साझा बचत अच्छी चल रही है। संयुक्त निवेश या बजट अनुशासन लाभांश दे रहा है।', maleficEn: 'Financial stress or disagreements about money may surface. Avoid blame — approach budgets as a team problem, not a personal failing.', maleficHi: 'वित्तीय तनाव या पैसों को लेकर असहमति सामने आ सकती है। दोष न दें — बजट को टीम समस्या के रूप में देखें।' },
  '4-7-marriage': { beneficEn: 'A genuinely expansive period for the relationship. Mutual respect, shared laughter, and a sense of gratitude colour your interactions. Enjoy it.', beneficHi: 'संबंध के लिए सच में विस्तारशील अवधि। पारस्परिक सम्मान, साझा हँसी, और कृतज्ञता की भावना आपकी बातचीत को रंगीन बनाती है।', maleficEn: 'Growth energy in the partnership. Even small gestures of appreciation feel amplified right now.', maleficHi: 'साझेदारी में विकास ऊर्जा। छोटे सराहना के इशारे भी अभी प्रवर्धित लगते हैं।' },
  '4-2-marriage': { beneficEn: 'Financial growth or windfalls benefit the household. A good time for joint investments or upgrading the family home.', beneficHi: 'वित्तीय वृद्धि या अप्रत्याशित आय परिवार को लाभ पहुँचाती है। संयुक्त निवेश का अच्छा समय।', maleficEn: 'Shared finances are flowing more freely. Be mindful of overspending during this optimistic period.', maleficHi: 'साझा वित्त अधिक स्वतंत्र रूप से बह रहा है। इस आशावादी अवधि में अधिक खर्च से सावधान रहें।' },
  '7-7-marriage': { beneficEn: 'An exciting but unpredictable phase. New experiences as a couple — travel, social circles, or unconventional ideas — energise the bond.', beneficHi: 'एक रोमांचक लेकिन अप्रत्याशित चरण। जोड़े के रूप में नये अनुभव बंधन को ऊर्जा देते हैं।', maleficEn: 'Restlessness or dissatisfaction may surface. One of you may feel the grass is greener elsewhere. This is Rahu\'s illusion — focus on what is real rather than what is imagined.', maleficHi: 'बेचैनी या असंतोष सामने आ सकता है। यह राहु का भ्रम है — कल्पना के बजाय जो वास्तविक है उस पर ध्यान दें।' },
  '7-2-marriage': { beneficEn: 'Unusual financial opportunities or changes in income patterns. Stay pragmatic about speculative ventures.', beneficHi: 'असामान्य वित्तीय अवसर या आय पैटर्न में बदलाव। सट्टेबाज़ी उद्यमों के बारे में व्यावहारिक रहें।', maleficEn: 'Financial surprises or irregularities. Avoid impulsive joint spending or risky investments.', maleficHi: 'वित्तीय आश्चर्य या अनियमितताएं। आवेगी संयुक्त खर्च या जोखिमभरे निवेश से बचें।' },
  '8-7-marriage': { beneficEn: 'Spiritual deepening in the relationship. Conversations about meaning and purpose bring you closer.', beneficHi: 'संबंध में आध्यात्मिक गहराई। अर्थ और उद्देश्य के बारे में बातचीत आपको करीब लाती है।', maleficEn: 'A sense of emotional disconnection or apathy. You may go through the motions without feeling present. This is temporary — talk about what feels missing.', maleficHi: 'भावनात्मक विरक्ति या उदासीनता की भावना। यह अस्थायी है — बात करें कि क्या कमी महसूस हो रही है।' },
};

// General planet-house (no context): fallback
const TRANSIT_COMMENTARY_GENERAL: Record<string, TransitText> = {
  '6-1': { beneficEn: 'Personal discipline and maturity are strengthening.', beneficHi: 'व्यक्तिगत अनुशासन और परिपक्वता मज़बूत हो रही है।', maleficEn: 'A period of added responsibility and slower progress. Patience brings reward.', maleficHi: 'अतिरिक्त ज़िम्मेदारी और धीमी प्रगति का समय। धैर्य पुरस्कार लाता है।' },
  '4-1': { beneficEn: 'Optimism, growth, and new opportunities are opening up.', beneficHi: 'आशावाद, विकास, और नये अवसर खुल रहे हैं।', maleficEn: 'Expansion energy is present. Channel it into meaningful pursuits.', maleficHi: 'विस्तार ऊर्जा उपस्थित है। इसे सार्थक लक्ष्यों में लगाएं।' },
  '7-1': { beneficEn: 'Unusual drive and ambition. Fresh perspectives energise you.', beneficHi: 'असामान्य प्रेरणा और महत्वाकांक्षा। ताज़ा दृष्टिकोण ऊर्जा देते हैं।', maleficEn: 'Inner restlessness and desire for change. Think before acting on impulse.', maleficHi: 'आंतरिक बेचैनी और बदलाव की इच्छा। आवेग पर कार्य करने से पहले सोचें।' },
  '8-1': { beneficEn: 'Inner clarity through detachment. Spiritual inclination grows.', beneficHi: 'वैराग्य से आंतरिक स्पष्टता। आध्यात्मिक झुकाव बढ़ रहा है।', maleficEn: 'A period of letting go. What feels like loss is making space for what matters.', maleficHi: 'छोड़ने का समय। जो हानि लगती है वह मायने रखने वाली चीज़ों के लिए जगह बना रही है।' },
};

// Fallback house labels — keyed by context + house number
const HOUSE_LABELS: Record<Context, Record<number, { en: string; hi: string }>> = {
  marriage: {
    7: { en: 'partnership', hi: 'साझेदारी' },
    1: { en: 'self-expression', hi: 'आत्म-अभिव्यक्ति' },
    2: { en: 'shared finances', hi: 'साझा वित्त' },
  },
  children: {
    5: { en: 'your bond with children', hi: 'बच्चों के साथ आपके बंधन' },
    1: { en: 'their sense of identity', hi: 'उनकी पहचान की भावना' },
    4: { en: 'home and emotional security', hi: 'घर और भावनात्मक सुरक्षा' },
  },
};

/** Build specific transit commentary for monthly forecast. */
function buildTransitEffect(
  pid: number, house: number, context: Context, isBenefic: boolean,
  pName: { en: string; hi: string }, rName: { en: string; hi: string },
): { en: string; hi: string } {
  const ctxKey = `${pid}-${house}-${context}`;
  const specific = TRANSIT_COMMENTARY[ctxKey];
  if (specific) {
    return {
      en: `${pName.en} in ${rName.en}: ${isBenefic ? specific.beneficEn : specific.maleficEn}`,
      hi: `${pName.hi} ${rName.hi} में: ${isBenefic ? specific.beneficHi : specific.maleficHi}`,
    };
  }
  const genKey = `${pid}-${house}`;
  const general = TRANSIT_COMMENTARY_GENERAL[genKey];
  if (general) {
    return {
      en: `${pName.en} in ${rName.en}: ${isBenefic ? general.beneficEn : general.maleficEn}`,
      hi: `${pName.hi} ${rName.hi} में: ${isBenefic ? general.beneficHi : general.maleficHi}`,
    };
  }
  // Last resort — lookup map (oblique Hindi for postpositions)
  const label = HOUSE_LABELS[context]?.[house] ?? { en: 'this area', hi: 'इस क्षेत्र' };
  return {
    en: isBenefic ? `${pName.en} in ${rName.en} is easing ${label.en} this period.` : `${pName.en} in ${rName.en} is testing ${label.en} this period — stay patient and present.`,
    hi: isBenefic ? `${pName.hi} ${rName.hi} में इस अवधि में ${label.hi} को सहज बना रहा है।` : `${pName.hi} ${rName.hi} में इस अवधि में ${label.hi} की परीक्षा ले रहा है — धैर्य और उपस्थिति बनाये रखें।`,
  };
}

/** Get the sign occupying a house (whole sign from ascendant). */
function houseToSign(ascSign: number, house: number): number {
  return ((ascSign - 1 + house - 1) % 12) + 1;
}

/** Check which slow transit planets are hitting relationship houses in a chart. */
function findTransitHits(
  chart: KundaliData,
  transitPlanets: PlanetPosition[],
  context: Context,
): TransitHit[] {
  const houses = getRelationshipHouses(context);
  const hits: TransitHit[] = [];

  for (const tp of transitPlanets) {
    const pid = getPid(tp);
    if (!SLOW_PLANET_IDS.includes(pid)) continue;

    for (const house of houses) {
      const houseSign = houseToSign(chart.ascendant.sign, house);
      if (tp.sign === houseSign) {
        const pName = PLANET_NAMES[pid] ?? { en: `Planet ${pid}`, hi: `ग्रह ${pid}` };
        const rName = RASHI_NAMES[houseSign] ?? { en: `Sign ${houseSign}`, hi: `राशि ${houseSign}` };

        const isBenefic = BENEFIC_IDS.has(pid);
        const effect = buildTransitEffect(pid, house, context, isBenefic, pName, rName);

        hits.push({
          planet: pName.en,
          planetId: pid,
          house,
          sign: rName.en,
          isBenefic,
          effect,
        });
      }
    }
  }

  return hits;
}

/** Determine overall tone from benefic/malefic ratio. */
function assessTone(
  yourHits: TransitHit[],
  theirHits: TransitHit[],
  transitPlanets: PlanetPosition[],
): TransitRelationshipImpact['overallTone'] {
  const allHits = [...yourHits, ...theirHits];
  if (allHits.length === 0) return 'neutral';

  let beneficCount = 0;
  let maleficCount = 0;
  for (const hit of allHits) {
    const tp = transitPlanets.find(p => PLANET_NAMES[getPid(p)]?.en === hit.planet);
    if (tp && BENEFIC_IDS.has(getPid(tp))) beneficCount++;
    if (tp && MALEFIC_IDS.has(getPid(tp))) maleficCount++;
  }

  if (beneficCount > maleficCount + 1) return 'supportive';
  if (maleficCount > beneficCount + 1) return 'challenging';
  if (beneficCount > 0 && maleficCount > 0) return 'mixed';
  if (beneficCount > 0) return 'supportive';
  if (maleficCount > 0) return 'challenging';
  return 'neutral';
}

/**
 * Compute how current transits impact the relationship between two charts.
 */
export function computeTransitRelationshipImpact(
  chartA: KundaliData,
  chartB: KundaliData,
  transitPlanets: PlanetPosition[],
  context: Context,
): TransitRelationshipImpact {
  const yourTransits = findTransitHits(chartA, transitPlanets, context);
  const theirTransits = findTransitHits(chartB, transitPlanets, context);
  const overallTone = assessTone(yourTransits, theirTransits, transitPlanets);

  // Generate narrative
  const totalHits = yourTransits.length + theirTransits.length;
  const contextLabel = context === 'marriage' ? 'relationship' : 'parent-child bond';
  const contextLabelHi = context === 'marriage' ? 'संबंध' : 'माता-पिता-संतान बंधन';

  let en: string;
  let hi: string;

  if (totalHits === 0) {
    en = `No major slow-planet transits are currently activating ${contextLabel} houses in either chart. A calm, neutral period.`;
    hi = `इस समय किसी भी चार्ट में ${contextLabelHi} भावों पर कोई प्रमुख धीमे ग्रह गोचर सक्रिय नहीं है। शांत, तटस्थ अवधि।`;
  } else {
    const toneEn = overallTone === 'supportive' ? 'favourable' : overallTone === 'challenging' ? 'demanding' : overallTone === 'mixed' ? 'mixed' : 'stable';
    const toneHi = overallTone === 'supportive' ? 'अनुकूल' : overallTone === 'challenging' ? 'चुनौतीपूर्ण' : overallTone === 'mixed' ? 'मिश्रित' : 'स्थिर';
    en = `Current transits create a ${toneEn} environment for your ${contextLabel}. `;
    hi = `वर्तमान गोचर आपके ${contextLabelHi} के लिए ${toneHi} वातावरण बना रहे हैं। `;

    // Add top hit summaries
    const topHits = [...yourTransits, ...theirTransits].slice(0, 3);
    for (const hit of topHits) {
      en += hit.effect.en + ' ';
      hi += (hit.effect.hi ?? hit.effect.en) + ' ';
    }
  }

  return {
    overallTone,
    yourTransits,
    theirTransits,
    narrative: { en: en.trim(), hi: hi.trim() },
  };
}
