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
  const sameSigns = moonSignP === moonSignC;

  // Compatible = same element (fire 1,5,9 / earth 2,6,10 / air 3,7,11 / water 4,8,12)
  const elementP = ((moonSignP - 1) % 4);
  const elementC = ((moonSignC - 1) % 4);
  const compatibleElement = elementP === elementC;

  if (sameSigns) {
    return {
      en: 'Your Moons share the same sign — a natural emotional resonance. You intuitively understand this child\'s feelings.',
      hi: 'आपके चंद्रमा एक ही राशि में हैं — प्राकृतिक भावनात्मक अनुनाद। आप सहज रूप से इस बच्चे की भावनाओं को समझते हैं।',
    };
  }
  if (compatibleElement) {
    return {
      en: 'Your Moons are in compatible signs, supporting emotional understanding between parent and child.',
      hi: 'आपके चंद्रमा अनुकूल राशियों में हैं, माता-पिता और बच्चे के बीच भावनात्मक समझ का समर्थन करते हैं।',
    };
  }

  return {
    en: 'Your Moons are in different elements — emotional expression styles may differ. Conscious effort in understanding helps bridge this gap.',
    hi: 'आपके चंद्रमा अलग-अलग तत्वों में हैं — भावनात्मक अभिव्यक्ति शैली भिन्न हो सकती है। समझने में सचेत प्रयास इस अंतर को पाटने में मदद करता है।',
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
        en: 'Your Rahu on their Moon — you play a pivotal role in this child\'s emotional growth and life direction.',
        hi: 'आपका राहु उनके चंद्रमा पर — आप इस बच्चे की भावनात्मक वृद्धि और जीवन दिशा में महत्वपूर्ण भूमिका निभाते हैं।',
      },
      strength: 8,
    });
  }

  // Child's Rahu on parent's Sun
  if (rahuC && sunP && (rahuC.sign as number) === (sunP.sign as number)) {
    indicators.push({
      type: 'nodal_contact',
      description: {
        en: 'Their Rahu on your Sun — this child pushes you to grow in ways you didn\'t expect.',
        hi: 'उनका राहु आपके सूर्य पर — यह बच्चा आपको अप्रत्याशित तरीकों से बढ़ने के लिए प्रेरित करता है।',
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

  // Build current dynamic narrative
  const toneEn = transitImpact.overallTone === 'supportive' ? 'nurturing'
    : transitImpact.overallTone === 'challenging' ? 'requiring patience'
    : transitImpact.overallTone === 'mixed' ? 'mixed' : 'steady';
  const toneHi = transitImpact.overallTone === 'supportive' ? 'पोषणकारी'
    : transitImpact.overallTone === 'challenging' ? 'धैर्य की आवश्यकता'
    : transitImpact.overallTone === 'mixed' ? 'मिश्रित' : 'स्थिर';

  let enDynamic = `Your bond with ${childName} is in a ${toneEn} phase. `;
  let hiDynamic = `${childName} के साथ आपका बंधन ${toneHi} चरण में है। `;
  enDynamic += moonConnection.en + ' ';
  hiDynamic += moonConnection.hi + ' ';
  if (dashaSynchronicity.inSync) {
    enDynamic += `Your dasha periods are aligned with ${childName}'s developmental cycle.`;
    hiDynamic += `आपकी दशाएँ ${childName} के विकास चक्र के साथ संरेखित हैं।`;
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
