/**
 * Marriage Dynamics -- computes the full RelationshipDynamics overlay for marriage.
 *
 * Orchestrates: Ashta Kuta, synastry, D9 cross-read, transit impact, dasha sync,
 * karmic indicators, and narrative generation.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { RelationshipDynamics, SynastryHighlight, KarmicIndicator, GunaBreakdown } from './types';
import { computeVargaCrossRead } from './varga-cross-read';
import { computeTransitRelationshipImpact } from './transit-relationship';
import { computeDashaSynchronicity } from './dasha-sync';
import {
  generateMarriageActionItems, generateMonthlyForecast,
  generateUpcomingWindows, generateStressPeriods,
} from './narrative-gen';
import { computeEnhancedSynastry } from '@/lib/comparison/synastry-engine';
import { computeAshtaKuta, type MatchInput } from '@/lib/matching/ashta-kuta';

// Planet id -> name lookup
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

/** Helper: extract nakshatra id (real shape has p.nakshatra.id, fixtures may have p.nakshatra as number). */
function getNakshatraId(p: PlanetPosition | Record<string, unknown>): number {
  const raw = p as Record<string, unknown>;
  if (typeof raw.nakshatra === 'number') return raw.nakshatra;
  if (raw.nakshatra && typeof (raw.nakshatra as Record<string, unknown>).id === 'number') {
    return (raw.nakshatra as Record<string, unknown>).id as number;
  }
  return 0;
}

/** Helper: extract pada (real shape has p.pada, fixtures may have p.nakshatraPada). */
function getPada(p: PlanetPosition | Record<string, unknown>): number | undefined {
  const raw = p as Record<string, unknown>;
  if (typeof raw.pada === 'number') return raw.pada;
  if (typeof raw.nakshatraPada === 'number') return raw.nakshatraPada;
  return undefined;
}

/** Helper: get planet name for display. */
function getPlanetName(p: PlanetPosition | Record<string, unknown>): { en: string; hi: string } | undefined {
  const raw = p as Record<string, unknown>;
  if (raw.name && typeof (raw.name as Record<string, unknown>).en === 'string') {
    return raw.name as { en: string; hi: string };
  }
  if (raw.planet && typeof ((raw.planet as Record<string, unknown>).name as Record<string, unknown>)?.en === 'string') {
    return (raw.planet as Record<string, unknown>).name as { en: string; hi: string };
  }
  return undefined;
}

/** Map SynastryAspect from the synastry engine to our SynastryHighlight format. */
function mapSynastryHighlights(chartA: KundaliData, chartB: KundaliData): SynastryHighlight[] {
  try {
    const aspects = computeEnhancedSynastry(chartA, chartB);
    const sorted = aspects.sort((a, b) => Math.abs(a.orb) - Math.abs(b.orb));

    return sorted.slice(0, 5).map(asp => {
      const pA = PLANET_NAMES_MAP[asp.planetA] ?? { en: `Planet ${asp.planetA}`, hi: `ग्रह ${asp.planetA}` };
      const pB = PLANET_NAMES_MAP[asp.planetB] ?? { en: `Planet ${asp.planetB}`, hi: `ग्रह ${asp.planetB}` };
      const nature: SynastryHighlight['nature'] = asp.isHarmonious ? 'harmonious' : 'challenging';
      const aspectName = asp.type.toLowerCase();

      return {
        yourPlanet: pA.en,
        theirPlanet: pB.en,
        aspect: aspectName,
        orb: Math.round(Math.abs(asp.orb) * 10) / 10,
        nature,
        interpretation: asp.interpretation ?? {
          en: `${pA.en} ${aspectName} ${pB.en} — ${nature} dynamic.`,
          hi: `${pA.hi} ${aspectName} ${pB.hi} — ${nature === 'harmonious' ? 'सामंजस्यपूर्ण' : 'चुनौतीपूर्ण'} गतिशीलता।`,
        },
      };
    });
  } catch (err) {
    console.warn('[marriage-dynamics] synastry computation failed:', err);
    return [];
  }
}

/** Compute Ashta Kuta Guna Milan score. */
function computeGunaScore(chartA: KundaliData, chartB: KundaliData): { score: number; breakdown?: Record<string, number> } {
  try {
    const moonA = (chartA.planets as unknown as Array<Record<string, unknown>>).find(p => getPid(p) === 1);
    const moonB = (chartB.planets as unknown as Array<Record<string, unknown>>).find(p => getPid(p) === 1);
    if (!moonA || !moonB) return { score: 0 };

    const inputA: MatchInput = {
      moonNakshatra: getNakshatraId(moonA) || Math.ceil(((moonA.longitude as number) * 27) / 360),
      moonRashi: moonA.sign as number,
      moonPada: getPada(moonA),
    };
    const inputB: MatchInput = {
      moonNakshatra: getNakshatraId(moonB) || Math.ceil(((moonB.longitude as number) * 27) / 360),
      moonRashi: moonB.sign as number,
      moonPada: getPada(moonB),
    };

    const result = computeAshtaKuta(inputA, inputB);
    const breakdown: Record<string, number> = {};
    for (const k of result.kutas) {
      breakdown[k.name.en.toLowerCase()] = k.scored;
    }

    return { score: result.totalScore, breakdown };
  } catch (err) {
    console.warn('[marriage-dynamics] guna computation failed:', err);
    return { score: 0 };
  }
}

/** Detect karmic indicators (Rahu-Ketu contacts, Saturn aspects). */
function detectKarmicIndicators(chartA: KundaliData, chartB: KundaliData): KarmicIndicator[] {
  const indicators: KarmicIndicator[] = [];
  const planetsA = chartA.planets as unknown as Array<Record<string, unknown>>;
  const planetsB = chartB.planets as unknown as Array<Record<string, unknown>>;

  const rahuA = planetsA.find(p => getPid(p) === 7);
  const ketuA = planetsA.find(p => getPid(p) === 8);
  const rahuB = planetsB.find(p => getPid(p) === 7);
  const ketuB = planetsB.find(p => getPid(p) === 8);

  // Rahu-Ketu axis overlap (same sign axis)
  if (rahuA && rahuB && ((rahuA.sign as number) === (rahuB.sign as number) || (rahuA.sign as number) === (ketuB?.sign as number))) {
    indicators.push({
      type: 'rahu_ketu_axis',
      description: {
        en: 'Your Rahu-Ketu axes overlap, indicating a deep karmic bond. This relationship carries past-life significance.',
        hi: 'आपकी राहु-केतु अक्ष ओवरलैप करती हैं, जो गहरे कर्म बंधन का संकेत है। इस संबंध में पूर्व जन्म का महत्व है।',
      },
      strength: 9,
    });
  }

  // Nodal contact with personal planets (Sun, Moon, Venus)
  const personalPlanetIds = [0, 1, 5];
  for (const pid of personalPlanetIds) {
    const pA = planetsA.find(p => getPid(p) === pid);
    if (pA && rahuB && (pA.sign as number) === (rahuB.sign as number)) {
      const name = getPlanetName(pA);
      indicators.push({
        type: 'nodal_contact',
        description: {
          en: `Your ${name?.en ?? 'planet'} conjuncts their Rahu — a magnetic attraction with a karmic quality.`,
          hi: `आपका ${name?.hi ?? 'ग्रह'} उनके राहु से युति — कर्मिक गुणवत्ता के साथ चुंबकीय आकर्षण।`,
        },
        strength: 7,
      });
    }
  }

  // Saturn cross-aspects (on each other's Moon or Venus)
  const satA = planetsA.find(p => getPid(p) === 6);
  const satB = planetsB.find(p => getPid(p) === 6);
  const moonB = planetsB.find(p => getPid(p) === 1);
  const venusA = planetsA.find(p => getPid(p) === 5);

  if (satA && moonB && (satA.sign as number) === (moonB.sign as number)) {
    indicators.push({
      type: 'saturn_aspect',
      description: {
        en: 'Your Saturn on their Moon creates a stabilising but sometimes restrictive emotional dynamic.',
        hi: 'आपका शनि उनके चंद्रमा पर — भावनात्मक गतिशीलता को स्थिर लेकिन कभी-कभी प्रतिबंधात्मक बनाता है।',
      },
      strength: 6,
    });
  }

  if (satB && venusA && (satB.sign as number) === (venusA.sign as number)) {
    indicators.push({
      type: 'saturn_aspect',
      description: {
        en: 'Their Saturn on your Venus tests romantic expression but builds enduring commitment.',
        hi: 'उनका शनि आपके शुक्र पर — रोमांटिक अभिव्यक्ति की परीक्षा लेकिन स्थायी प्रतिबद्धता बनाता है।',
      },
      strength: 6,
    });
  }

  return indicators;
}

/** Generate Darakaraka analysis text. */
function analyzeDarakaraka(chartA: KundaliData, chartB: KundaliData): { en: string; hi: string } {
  // DK = Darakaraka from Jaimini charaKarakas
  const dkA = chartA.jaimini?.charaKarakas?.find(k => k.karaka === 'DK');
  const dkB = chartB.jaimini?.charaKarakas?.find(k => k.karaka === 'DK');

  if (dkA && dkB) {
    const nameA = dkA.planetName?.en ?? 'DK';
    const nameB = dkB.planetName?.en ?? 'DK';
    return {
      en: `Your Darakaraka (${nameA}) and their Darakaraka (${nameB}) reveal complementary partnership needs.`,
      hi: `आपका दारकारक (${nameA}) और उनका दारकारक (${nameB}) पूरक साझेदारी आवश्यकताओं को प्रकट करते हैं।`,
    };
  }

  return {
    en: 'Darakaraka analysis reveals the nature of your partnership needs based on Jaimini principles.',
    hi: 'दारकारक विश्लेषण जैमिनी सिद्धांतों के आधार पर आपकी साझेदारी आवश्यकताओं की प्रकृति को प्रकट करता है।',
  };
}

/**
 * Compute complete marriage dynamics between two charts.
 */
export function computeMarriageDynamics(
  userChart: KundaliData,
  spouseChart: KundaliData,
  transitPlanets: PlanetPosition[],
): RelationshipDynamics {
  // Cross-chart analysis
  const synastryHighlights = mapSynastryHighlights(userChart, spouseChart);
  const { score: gunaScore, breakdown } = computeGunaScore(userChart, spouseChart);
  const vargaCrossRead = computeVargaCrossRead(userChart, spouseChart, 'D9');
  const karmicIndicators = detectKarmicIndicators(userChart, spouseChart);
  const karakaAnalysis = analyzeDarakaraka(userChart, spouseChart);

  // Temporal dynamics
  const transitImpact = computeTransitRelationshipImpact(userChart, spouseChart, transitPlanets, 'marriage');
  const dashaSynchronicity = computeDashaSynchronicity(userChart, spouseChart, 'marriage');
  const upcomingWindows = generateUpcomingWindows(transitImpact, dashaSynchronicity, 'marriage');
  const stressPeriods = generateStressPeriods(transitImpact);

  // Narrative
  const actionItems = generateMarriageActionItems(transitImpact, dashaSynchronicity, synastryHighlights, gunaScore);
  const monthlyForecast = generateMonthlyForecast(transitImpact, dashaSynchronicity, 'marriage');

  // Current dynamic narrative
  const currentDynamic = buildCurrentDynamic(transitImpact, dashaSynchronicity, gunaScore, vargaCrossRead.compatibility);

  // Build guna breakdown from kuta names
  const gunaBreakdown: GunaBreakdown | undefined = breakdown ? {
    varna: breakdown['varna'] ?? 0,
    vashya: breakdown['vashya'] ?? 0,
    tara: breakdown['tara'] ?? 0,
    yoni: breakdown['yoni'] ?? 0,
    grahaMaitri: breakdown['graha maitri'] ?? breakdown['grahamaitri'] ?? 0,
    gana: breakdown['gana'] ?? 0,
    bhakut: breakdown['bhakut'] ?? 0,
    nadi: breakdown['nadi'] ?? 0,
  } : undefined;

  return {
    synastryHighlights,
    gunaScore,
    gunaBreakdown,
    vargaCrossRead,
    karmicIndicators,
    karakaAnalysis,
    transitImpact,
    dashaSynchronicity,
    upcomingWindows,
    stressPeriods,
    currentDynamic,
    actionItems,
    monthlyForecast,
  };
}

function buildCurrentDynamic(
  transit: { overallTone: string; narrative: { en: string; hi?: string } },
  dashaSync: { inSync: boolean; yourDasha: string; theirDasha: string },
  gunaScore: number,
  vargaCompat: number,
): { en: string; hi: string } {
  const gunaLabel = gunaScore >= 28 ? 'excellent' : gunaScore >= 21 ? 'good' : gunaScore >= 14 ? 'average' : 'challenging';
  const gunaLabelHi = gunaScore >= 28 ? 'उत्कृष्ट' : gunaScore >= 21 ? 'अच्छी' : gunaScore >= 14 ? 'औसत' : 'चुनौतीपूर्ण';

  let en = `Your marriage rests on ${gunaLabel} foundational compatibility (${gunaScore}/36 Guna Milan) `;
  en += `with a ${vargaCompat >= 7 ? 'strong' : vargaCompat >= 5 ? 'moderate' : 'developing'} Navamsha connection. `;
  en += transit.narrative.en + ' ';
  if (dashaSync.inSync) {
    en += `Your ${dashaSync.yourDasha} and their ${dashaSync.theirDasha} dashas are synchronised — both charts resonate in the partnership domain.`;
  }

  let hi = `आपका विवाह ${gunaLabelHi} मूलभूत अनुकूलता (${gunaScore}/36 गुण मिलान) पर आधारित है `;
  hi += `${vargaCompat >= 7 ? 'मज़बूत' : vargaCompat >= 5 ? 'मध्यम' : 'विकासशील'} नवांश संबंध के साथ। `;
  hi += (transit.narrative.hi ?? transit.narrative.en) + ' ';
  if (dashaSync.inSync) {
    hi += `आपकी ${dashaSync.yourDasha} और उनकी ${dashaSync.theirDasha} दशाएँ समन्वित हैं।`;
  }

  return { en: en.trim(), hi: hi.trim() };
}
