/**
 * Main Synthesiser Orchestrator  –  Personal Pandit Engine
 *
 * Wires all domain synthesis modules into a single entry point that
 * produces a complete PersonalReading from a KundaliData object.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs:  1-based (1=Aries … 12=Pisces)
 */

import type { KundaliData, PlanetPosition, DashaEntry } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import type {
  PersonalReading,
  DomainReading,
  DomainConfig,
  DomainType,
  NatalPromiseBlock,
  CurrentActivationBlock,
  Rating,
  RatingInfo,
  ScoringFactor,
  CrossDomainLink,
} from './types';

import { DOMAIN_CONFIGS } from './config';
import {
  TIER_NAMES as SCORER_TIER_NAMES,
  TIER_LABELS_MAP as SCORER_TIER_LABELS_MAP,
  TIER_SCORES_MAP as SCORER_TIER_SCORES_MAP,
  TIER_COLORS_MAP as SCORER_TIER_COLORS_MAP,
} from './scorer';
import {
  narrateHouseLord,
  narrateOccupants,
  narrateYogas,
  narrateDoshas,
  narrateDashaActivation,
  composeDomainNarrative,
  type OccupantInfo,
} from './narrator';
import { computeDomainTimeline } from './timeline';
import { selectDomainRemedies, type RemedyInput } from './remedies';
import { synthesizeCurrentPeriod, type CurrentPeriodInput } from './current-period';
import { generateLifeOverview, type OverviewInput } from './life-overview';
import { detectCrossDomainLinks, type CrossDomainInput } from './cross-domain';
import { computeCurrentTransits, type TransitEntry } from './transit-activation';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import {
  SIGN_LORDS as SIGN_LORD,
  EXALTATION_SIGNS as EXALTATION_SIGN,
  DEBILITATION_SIGNS as DEBILITATION_SIGN,
} from '@/lib/constants/dignities';
import type { DignityLevel } from '@/lib/tippanni/varga-tippanni-types-v2';

// ---------------------------------------------------------------------------
// Natural benefic / malefic classification
// ---------------------------------------------------------------------------

/** Natural benefics: Jupiter (4), Venus (5), Moon (1), Mercury (3). */
const NATURAL_BENEFICS = new Set([1, 3, 4, 5]);

/** Natural malefics: Sun (0), Mars (2), Saturn (6), Rahu (7), Ketu (8). */
const NATURAL_MALEFICS = new Set([0, 2, 6, 7, 8]);

function isBenefic(pid: number): boolean {
  return NATURAL_BENEFICS.has(pid);
}

// Exaltation / debilitation imported from @/lib/constants/dignities (see import block above)

// ---------------------------------------------------------------------------
// Natural friendship (simplified)
// Simplified natural friendship tables — canonical source: @/lib/tippanni/dignity
// Kept inline to avoid circular imports. Must match canonical BPHS Ch.3 values.
// Lesson Q acknowledged: if the canonical source changes, update here too.
// ---------------------------------------------------------------------------

const FRIENDS: Record<number, Set<number>> = {
  0: new Set([1, 2, 4]),
  1: new Set([0, 3]),
  2: new Set([0, 1, 4]),
  3: new Set([0, 5]),
  4: new Set([0, 1, 2]),
  5: new Set([3, 6]),
  6: new Set([3, 5]),
  7: new Set([]),
  8: new Set([]),
};

const ENEMIES: Record<number, Set<number>> = {
  0: new Set([5, 6]),
  1: new Set([]),
  2: new Set([3]),
  3: new Set([1]),
  4: new Set([3, 5]),
  5: new Set([0, 1]),
  6: new Set([0, 1, 2]),
  7: new Set([0, 1]),
  8: new Set([1]),
};

// NOTE: This simplified dignity function treats moolatrikona as 'own' (same tier).
// Full moolatrikona with degree ranges is in yoga-engine/context.ts computeDignity().
// For domain scoring, the tier difference between own and moolatrikona is zero.
function getDignity(planetId: number, signNum: number): DignityLevel {
  if (EXALTATION_SIGN[planetId] === signNum) return 'exalted';
  if (DEBILITATION_SIGN[planetId] === signNum) return 'debilitated';

  const signLord = SIGN_LORD[signNum];
  if (signLord === planetId) return 'own';

  if (FRIENDS[planetId]?.has(signLord)) return 'friend';
  if (ENEMIES[planetId]?.has(signLord)) return 'enemy';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// Helper: extract structured data from KundaliData
// ---------------------------------------------------------------------------

interface ExtractedData {
  ascendantSign: number;
  moonSign: number;
  moonPos: PlanetPosition | undefined;
  houseLords: { house: number; lordId: number }[];
  planetHouses: { planetId: number; house: number }[];
  planetMap: Map<number, PlanetPosition>;
  currentDate: Date;
  activeMahaDasha: DashaEntry | undefined;
  activeAntarDasha: DashaEntry | undefined;
  mahaLordId: number;
  antarLordId: number;
}

function extractData(kundali: KundaliData): ExtractedData {
  const ascendantSign = kundali.ascendant.sign;

  // Moon sign
  const moonPos = kundali.planets.find(p => p.planet.id === 1);
  const moonSign = moonPos?.sign ?? 1;

  // House lords: derive from house cusp sign → sign lord
  const houseLords: { house: number; lordId: number }[] = [];
  for (const cusp of kundali.houses) {
    const lordId = SIGN_LORD[cusp.sign];
    if (lordId !== undefined) {
      houseLords.push({ house: cusp.house, lordId });
    }
  }

  // Planet → house mapping
  const planetHouses: { planetId: number; house: number }[] = [];
  const planetMap = new Map<number, PlanetPosition>();
  for (const p of kundali.planets) {
    planetHouses.push({ planetId: p.planet.id, house: p.house });
    planetMap.set(p.planet.id, p);
  }

  // Current date
  const currentDate = new Date();

  // Find active mahadasha and antardasha
  const now = currentDate.getTime();
  let activeMahaDasha: DashaEntry | undefined;
  let activeAntarDasha: DashaEntry | undefined;

  for (const maha of kundali.dashas) {
    if (maha.level !== 'maha') continue;
    const ms = new Date(maha.startDate).getTime();
    const me = new Date(maha.endDate).getTime();
    if (now >= ms && now < me) {
      activeMahaDasha = maha;
      if (maha.subPeriods) {
        for (const antar of maha.subPeriods) {
          const as = new Date(antar.startDate).getTime();
          const ae = new Date(antar.endDate).getTime();
          if (now >= as && now < ae) {
            activeAntarDasha = antar;
            break;
          }
        }
      }
      break;
    }
  }

  const PLANET_NAME_TO_ID: Record<string, number> = {
    Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
    Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
  };

  const mahaLordId = activeMahaDasha
    ? (PLANET_NAME_TO_ID[activeMahaDasha.planet] ?? 0)
    : 0;
  const antarLordId = activeAntarDasha
    ? (PLANET_NAME_TO_ID[activeAntarDasha.planet] ?? mahaLordId)
    : mahaLordId;

  return {
    ascendantSign,
    moonSign,
    moonPos,
    houseLords,
    planetHouses,
    planetMap,
    currentDate,
    activeMahaDasha,
    activeAntarDasha,
    mahaLordId,
    antarLordId,
  };
}

// ---------------------------------------------------------------------------
// Helper: compute varga delivery score from divisional charts
// ---------------------------------------------------------------------------

/**
 * Dignity score mapping for varga analysis.
 * Exalted = 90, own = 75, friend = 60, neutral = 50, enemy = 30, debilitated = 15.
 */
const VARGA_DIGNITY_SCORES: Record<DignityLevel, number> = {
  exalted: 90,
  own: 75,
  friend: 60,
  neutral: 50,
  enemy: 30,
  debilitated: 15,
};

/**
 * Computes a varga delivery score (0–100) for a domain by checking
 * how well the primary house lord is placed in each relevant divisional chart.
 *
 * For each relevant varga (from config.divisionalCharts), finds the primary
 * lord's sign in that chart and assesses its dignity. Averages across all
 * relevant vargas. Falls back to 50 when divisional chart data is unavailable.
 */
function computeVargaDeliveryScore(
  config: DomainConfig,
  kundali: KundaliData,
  data: ExtractedData,
): number {
  // If no divisional chart data exists, return neutral default
  if (!kundali.divisionalCharts || config.divisionalCharts.length === 0) {
    return 50;
  }

  // Find the primary house lord (lord of the first primary house)
  const primaryHouse = config.primaryHouses[0];
  const primaryHouseSign = kundali.houses.find(h => h.house === primaryHouse)?.sign ?? 1;
  const primaryLordId = SIGN_LORD[primaryHouseSign] ?? 0;

  const scores: number[] = [];

  for (const chartId of config.divisionalCharts) {
    const chart = kundali.divisionalCharts[chartId];
    if (!chart || !chart.houses) continue;

    // Find which house the primary lord occupies in this varga chart
    let lordSign: number | null = null;
    for (let houseIdx = 0; houseIdx < chart.houses.length; houseIdx++) {
      const planetsInHouse = chart.houses[houseIdx];
      if (planetsInHouse && planetsInHouse.includes(primaryLordId)) {
        // House index is 0-based; sign = ascendant sign + house offset
        const signOffset = (chart.ascendantSign + houseIdx - 1) % 12;
        lordSign = signOffset === 0 ? 12 : (signOffset % 12 || 12);
        // Simpler: use whole-sign from ascendant
        lordSign = ((chart.ascendantSign - 1 + houseIdx) % 12) + 1;
        break;
      }
    }

    if (lordSign !== null) {
      const dignity = getDignity(primaryLordId, lordSign);
      scores.push(VARGA_DIGNITY_SCORES[dignity]);
    }
  }

  // Average the scores; fall back to 50 if no charts were usable
  if (scores.length === 0) return 50;
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}

// ---------------------------------------------------------------------------
// Helper: retrograde-aware transit description
// ---------------------------------------------------------------------------

/**
 * Generates domain-specific transit description text that accounts for
 * retrograde motion. When a planet is retrograde, language shifts from
 * "new opportunity" to "revisit/review" framing with domain-specific nuance.
 */
function retroAwareTransitDescription(
  planetId: number,
  transitHouse: number,
  isRetro: boolean,
  planetName: LocaleText,
  domainId: DomainType,
): LocaleText {
  const nameEn = planetName.en;
  const nameHi = planetName.hi ?? nameEn;

  if (!isRetro) {
    return {
      en: `${nameEn} transiting ${transitHouse}th house  –  fresh energy and forward momentum.`,
      hi: `${nameHi} ${transitHouse}वें भाव में गोचर  –  नई ऊर्जा और आगे की गति।`,
    };
  }

  // Retrograde: domain-specific framing
  switch (domainId) {
    case 'career':
      return {
        en: `${nameEn} (R) transiting ${transitHouse}th house  –  delays possible but deepens mastery; revisit past professional matters.`,
        hi: `${nameEn} (वक्री) ${transitHouse}वें भाव में गोचर  –  विलम्ब संभव परन्तु दक्षता गहरी होती है; पुराने व्यावसायिक मामलों की पुनर्समीक्षा करें।`,
      };
    case 'marriage':
      return {
        en: `${nameEn} (R) transiting ${transitHouse}th house  –  past connections may resurface; reflect before committing to new bonds.`,
        hi: `${nameEn} (वक्री) ${transitHouse}वें भाव में गोचर  –  पुराने सम्बन्ध पुनः उभर सकते हैं; नये बन्धनों से पहले चिन्तन करें।`,
      };
    case 'wealth':
      return {
        en: `${nameEn} (R) transiting ${transitHouse}th house  –  review financial commitments; avoid impulsive investments.`,
        hi: `${nameEn} (वक्री) ${transitHouse}वें भाव में गोचर  –  वित्तीय प्रतिबद्धताओं की समीक्षा करें; आवेगी निवेश से बचें।`,
      };
    case 'health':
      return {
        en: `${nameEn} (R) transiting ${transitHouse}th house  –  revisit old health concerns; focus on recovery over new regimens.`,
        hi: `${nameEn} (वक्री) ${transitHouse}वें भाव में गोचर  –  पुरानी स्वास्थ्य चिन्ताओं पर पुनर्विचार करें; नई दिनचर्या से अधिक स्वस्थता पर ध्यान दें।`,
      };
    case 'education':
      return {
        en: `${nameEn} (R) transiting ${transitHouse}th house  –  excellent for revising and consolidating knowledge; new courses may face delays.`,
        hi: `${nameEn} (वक्री) ${transitHouse}वें भाव में गोचर  –  ज्ञान की पुनरावृत्ति और संगठन के लिए उत्तम; नये पाठ्यक्रमों में विलम्ब संभव।`,
      };
    case 'spiritual':
      return {
        en: `${nameEn} (R) transiting ${transitHouse}th house  –  introspection intensifies; revisit spiritual practices for deeper insight.`,
        hi: `${nameEn} (वक्री) ${transitHouse}वें भाव में गोचर  –  आत्मनिरीक्षण तीव्र होता है; गहन अन्तर्दृष्टि हेतु साधना पुनः आरम्भ करें।`,
      };
    default:
      return {
        en: `${nameEn} (R) transiting ${transitHouse}th house  –  a period of review and reassessment rather than new initiatives.`,
        hi: `${nameEn} (वक्री) ${transitHouse}वें भाव में गोचर  –  नई पहल के बजाय पुनर्मूल्यांकन का समय।`,
      };
  }
}

// ---------------------------------------------------------------------------
// Helper: build CurrentActivationBlock for a domain
// ---------------------------------------------------------------------------

function buildCurrentActivation(
  config: DomainConfig,
  kundali: KundaliData,
  data: ExtractedData,
  transitData?: TransitEntry[],
): CurrentActivationBlock {
  const primaryHouses = new Set(config.primaryHouses);

  // Check if dasha lords activate this domain
  const mahaPos = data.planetMap.get(data.mahaLordId);
  const antarPos = data.planetMap.get(data.antarLordId);

  const mahaActivates = (() => {
    if (!mahaPos) return false;
    if (primaryHouses.has(mahaPos.house)) return true;
    for (const h of config.primaryHouses) {
      const houseSign = kundali.houses.find(c => c.house === h)?.sign ?? 0;
      if (SIGN_LORD[houseSign] === data.mahaLordId) return true;
    }
    return false;
  })();

  const antarActivates = (() => {
    if (!antarPos) return false;
    if (primaryHouses.has(antarPos.house)) return true;
    for (const h of config.primaryHouses) {
      const houseSign = kundali.houses.find(c => c.house === h)?.sign ?? 0;
      if (SIGN_LORD[houseSign] === data.antarLordId) return true;
    }
    return false;
  })();

  const isDashaActive = mahaActivates || antarActivates;
  const dashaActivationScore = (mahaActivates ? 5 : 0) + (antarActivates ? 3 : 0);

  // Transit influences  –  slow planets in domain houses (using real current positions)
  const transitInfluences: CurrentActivationBlock['transitInfluences'] = [];
  if (transitData && transitData.length > 0) {
    // Use real current transit positions with retrograde-aware descriptions
    for (const t of transitData) {
      if (primaryHouses.has(t.transitHouse)) {
        const nature = isBenefic(t.planetId) ? 'benefic' as const : 'malefic' as const;
        const planetName = GRAHAS[t.planetId]?.name ?? { en: 'Planet' };
        const desc = retroAwareTransitDescription(
          t.planetId, t.transitHouse, t.isRetrograde, planetName, config.id,
        );
        transitInfluences.push({
          planetId: t.planetId,
          transitHouse: t.transitHouse,
          nature,
          intensity: t.isRetrograde ? 'high' : 'medium',
          description: desc,
        });
      }
    }
  } else {
    // Fallback: use natal positions if transit computation failed
    const slowPlanets = [4, 6, 7, 8]; // Jupiter, Saturn, Rahu, Ketu
    for (const pid of slowPlanets) {
      const p = data.planetMap.get(pid);
      if (!p) continue;
      if (primaryHouses.has(p.house)) {
        const nature = isBenefic(pid) ? 'benefic' as const : 'malefic' as const;
        transitInfluences.push({
          planetId: pid,
          transitHouse: p.house,
          nature,
          intensity: 'medium',
          description: {
            en: `${p.planet.name.en} in ${p.house}th house`,
            hi: `${p.planet.name.hi ?? p.planet.name.en} ${p.house}वें भाव में`,
          },
        });
      }
    }
  }

  const overallActivationScore = Math.min(10,
    dashaActivationScore + transitInfluences.length * 1.5,
  );

  const mahaName = GRAHAS[data.mahaLordId]?.name ?? { en: '(unresolved graha)' };
  const antarName = GRAHAS[data.antarLordId]?.name ?? { en: '(unresolved graha)' };

  const summary: LocaleText = isDashaActive
    ? {
        en: `${mahaName.en}-${antarName.en} dasha is actively energising your ${config.name.en} domain.`,
        hi: `${mahaName.hi ?? mahaName.en}-${antarName.hi ?? antarName.en} दशा आपके ${config.name.hi ?? config.name.en} क्षेत्र को सक्रिय रूप से ऊर्जित कर रही है।`,
      }
    : {
        en: `Current dasha is not directly activating your ${config.name.en} domain  –  effects remain background-level.`,
        hi: `वर्तमान दशा आपके ${config.name.hi ?? config.name.en} क्षेत्र को सीधे सक्रिय नहीं कर रही  –  प्रभाव पृष्ठभूमि स्तर पर हैं।`,
      };

  return {
    isDashaActive,
    mahaDashaLordId: data.mahaLordId,
    antarDashaLordId: data.antarLordId,
    dashaActivationScore,
    transitInfluences,
    overallActivationScore,
    summary,
  };
}

// ---------------------------------------------------------------------------
// Helper: build NatalPromiseBlock
// ---------------------------------------------------------------------------

function buildNatalPromise(
  config: DomainConfig,
  kundali: KundaliData,
  data: ExtractedData,
  natalRating: RatingInfo,
  nativeAge?: number,
): NatalPromiseBlock {
  // House scores
  const houseScores: Record<number, number> = {};
  for (const h of config.primaryHouses) {
    if (kundali.bhavabala) {
      const bhava = kundali.bhavabala.find(b => b.bhava === h);
      houseScores[h] = bhava ? Math.min(10, Math.max(0, (bhava.total - 200) / 40)) : 5;
    } else {
      houseScores[h] = 5;
    }
  }

  // Lord qualities
  const lordQualities: NatalPromiseBlock['lordQualities'] = [];
  for (const h of config.primaryHouses) {
    const houseSign = kundali.houses.find(c => c.house === h)?.sign ?? 1;
    const lordId = SIGN_LORD[houseSign] ?? 0;
    const lordPos = data.planetMap.get(lordId);
    if (lordPos) {
      // Per-lord score based on individual dignity (not the domain's overall score)
      const lordDignity = getDignity(lordId, lordPos.sign);
      const DIGNITY_SCORES: Record<string, number> = { exalted: 10, own: 8, friend: 6, neutral: 5, enemy: 3, debilitated: 1 };
      const lordScore = DIGNITY_SCORES[lordDignity] ?? 5;
      lordQualities.push({
        lordId,
        houseInD1: lordPos.house,
        signInD1: lordPos.sign,
        dignity: lordDignity,
        score: lordScore,
      });
    }
  }

  // Supporting yogas
  const supportingYogas: NatalPromiseBlock['supportingYogas'] = [];
  if (kundali.yogasComplete) {
    const yogas = kundali.yogasComplete;
    for (const y of yogas) {
      if (
        y.present &&
        config.relevantYogaCategories.includes(y.category)
      ) {
        const strengthNum = y.strength === 'Strong' ? 80 : y.strength === 'Moderate' ? 50 : 25;
        supportingYogas.push({
          name: y.name,
          category: y.category,
          strength: strengthNum,
        });
      }
    }
  }

  // Active afflictions (doshas from yogasComplete)
  const activeAfflictions: NatalPromiseBlock['activeAfflictions'] = [];
  if (kundali.yogasComplete) {
    const yogas = kundali.yogasComplete;
    for (const y of yogas) {
      const nameStr = (y.name.en ?? '').toLowerCase().replace(/\s+/g, '_');
      if (
        y.present &&
        y.category === 'dosha' &&
        config.relevantDoshas.some(d => nameStr.includes(d))
      ) {
        const severity: 'severe' | 'moderate' | 'mild' =
          y.strength === 'Strong' ? 'severe' : y.strength === 'Moderate' ? 'moderate' : 'mild';
        activeAfflictions.push({
          name: y.name,
          severity,
        });
      }
    }
  }

  // Varga confirmations  –  computed from divisional charts when available
  const primaryH_ = config.primaryHouses[0];
  const primarySign_ = kundali.houses.find(c => c.house === primaryH_)?.sign ?? 1;
  const primaryLordId_ = SIGN_LORD[primarySign_] ?? 0;

  const vargaConfirmations: NatalPromiseBlock['vargaConfirmations'] = config.divisionalCharts.map(
    chartId => {
      if (!kundali.divisionalCharts) {
        return {
          chartId,
          score: 50,
          keyInsight: { en: `${chartId} data unavailable.`, hi: `${chartId} डेटा अनुपलब्ध।` },
        };
      }
      const chart = kundali.divisionalCharts[chartId];
      if (!chart || !chart.houses) {
        return {
          chartId,
          score: 50,
          keyInsight: { en: `${chartId} data unavailable.`, hi: `${chartId} डेटा अनुपलब्ध।` },
        };
      }

      // Find lord's sign in this varga
      let lordSign: number | null = null;
      for (let i = 0; i < chart.houses.length; i++) {
        if (chart.houses[i] && chart.houses[i].includes(primaryLordId_)) {
          lordSign = ((chart.ascendantSign - 1 + i) % 12) + 1;
          break;
        }
      }

      if (lordSign === null) {
        return {
          chartId,
          score: 50,
          keyInsight: { en: `Lord not found in ${chartId}.`, hi: `${chartId} में स्वामी नहीं मिला।` },
        };
      }

      const dignity = getDignity(primaryLordId_, lordSign);
      const score = VARGA_DIGNITY_SCORES[dignity];
      const dignityLabels: Record<string, { en: string; hi: string }> = {
        exalted:      { en: 'exalted  –  strong confirmation',       hi: 'उच्च  –  दृढ़ पुष्टि' },
        own:          { en: 'in own sign  –  good confirmation',      hi: 'स्वराशि  –  अच्छी पुष्टि' },
        friend:       { en: 'in friendly sign  –  supportive',        hi: 'मित्र राशि  –  सहायक' },
        neutral:      { en: 'in neutral sign  –  mixed signals',      hi: 'सम राशि  –  मिश्रित संकेत' },
        enemy:        { en: 'in enemy sign  –  weak confirmation',    hi: 'शत्रु राशि  –  कमज़ोर पुष्टि' },
        debilitated:  { en: 'debilitated  –  contradicts promise',    hi: 'नीच  –  प्रतिज्ञा के विपरीत' },
      };
      const label = dignityLabels[dignity] ?? dignityLabels.neutral;
      return {
        chartId,
        score,
        keyInsight: {
          en: `Lord ${dignity} in ${chartId}  –  ${label.en}.`,
          hi: `${chartId} में स्वामी ${label.hi}।`,
        },
      };
    },
  );

  // Build narrative from narrator functions
  const narrativeBlocks: LocaleText[] = [];

  // House lord narrative for the primary house
  const primaryH = config.primaryHouses[0];
  const primarySign = kundali.houses.find(c => c.house === primaryH)?.sign ?? 1;
  const primaryLordId = SIGN_LORD[primarySign] ?? 0;
  const primaryLordPos = data.planetMap.get(primaryLordId);
  if (primaryLordPos) {
    const graha = GRAHAS[primaryLordId];
    const rashi = RASHIS[primaryLordPos.sign - 1];
    narrativeBlocks.push(
      narrateHouseLord({
        lordPlanetId: primaryLordId,
        lordPlanetName: graha?.name ?? { en: '(unresolved graha)' },
        lordHouse: primaryLordPos.house,
        lordSign: primaryLordPos.sign,
        lordSignName: rashi?.name ?? { en: '(unresolved sign)' },
        dignity: getDignity(primaryLordId, primaryLordPos.sign),
        isRetrograde: primaryLordPos.isRetrograde,
        primaryHouse: primaryH,
        nativeAge,
        domainName: config.name.en,
        sourceHouseMeaning: HOUSE_CONTEXT[config.id]?.[primaryH] ?? undefined,
        targetHouseMeaning: HOUSE_CONTEXT[config.id]?.[primaryLordPos.house] ?? undefined,
      }),
    );
  }

  // Occupants narrative for primary house
  for (const h of config.primaryHouses) {
    const occupants: OccupantInfo[] = [];
    for (const p of kundali.planets) {
      if (p.house === h) {
        occupants.push({
          planetId: p.planet.id,
          name: p.planet.name,
          isBenefic: isBenefic(p.planet.id),
        });
      }
    }
    if (occupants.length > 0) {
      narrativeBlocks.push(narrateOccupants({ house: h, occupants, nativeAge }));
    }
  }

  // Yogas narrative
  if (supportingYogas.length > 0) {
    narrativeBlocks.push(
      narrateYogas({
        yogas: supportingYogas.map(y => ({
          name: y.name.en,
          isAuspicious: true,
          strength: y.strength >= 70 ? 'strong' : y.strength >= 40 ? 'moderate' : 'mild',
          impact: y.name,
        })),
        nativeAge,
      }),
    );
  }

  // Doshas narrative
  if (activeAfflictions.length > 0) {
    narrativeBlocks.push(
      narrateDoshas({
        doshas: activeAfflictions.map(a => ({
          name: a.name.en,
          severity: a.severity,
          cancelled: false,
          impact: a.name,
        })),
        nativeAge,
      }),
    );
  }

  const summary = narrativeBlocks.length > 0
    ? composeDomainNarrative(narrativeBlocks)
    : {
        en: `${config.name.en} analysis based on natal chart positions.`,
        hi: `${config.name.hi ?? config.name.en} जन्म कुंडली स्थितियों पर आधारित विश्लेषण।`,
      };

  return {
    rating: natalRating,
    houseScores,
    lordQualities,
    supportingYogas,
    activeAfflictions,
    vargaConfirmations,
    summary,
  };
}

// ---------------------------------------------------------------------------
// Helper: identify weak planets for remedies
// ---------------------------------------------------------------------------

function identifyWeakPlanets(
  config: DomainConfig,
  kundali: KundaliData,
  data: ExtractedData,
): RemedyInput['weakPlanets'] {
  const weakPlanets: RemedyInput['weakPlanets'] = [];
  const relevantPlanetIds = new Set(config.primaryPlanets);

  // Add lords of primary houses
  for (const h of config.primaryHouses) {
    const houseSign = kundali.houses.find(c => c.house === h)?.sign ?? 1;
    const lordId = SIGN_LORD[houseSign];
    if (lordId !== undefined) relevantPlanetIds.add(lordId);
  }

  for (const pid of relevantPlanetIds) {
    const pos = data.planetMap.get(pid);
    if (!pos) continue;

    const isDebilitated = pos.isDebilitated;

    // Get shadbala rupa
    const sb = kundali.shadbala.find(s => {
      const planetNameId: Record<string, number> = {
        Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
        Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
      };
      return (planetNameId[s.planet] ?? -1) === pid;
    });
    const shadbalaRupa = sb ? sb.totalStrength / 60 : 1.0; // Convert shashtiamsas to rupas

    // Check if this planet lords a domain house
    let isLordOfDomainHouse = false;
    for (const h of config.primaryHouses) {
      const houseSign = kundali.houses.find(c => c.house === h)?.sign ?? 0;
      if (SIGN_LORD[houseSign] === pid) {
        isLordOfDomainHouse = true;
        break;
      }
    }

    // Only include if actually weak
    if (isDebilitated || shadbalaRupa < 1.0 || pos.isCombust) {
      weakPlanets.push({
        planetId: pid,
        isDebilitated,
        isLordOfDomainHouse,
        shadbalaRupa,
      });
    }
  }

  return weakPlanets;
}

// ---------------------------------------------------------------------------
// Multi-significator holistic evaluation
// ---------------------------------------------------------------------------

/**
 * Maps each domain's primary houses to their classical meaning in context.
 * Used in factor breakdown to explain WHY a house matters for a domain.
 * Example: for health, 1st house = body & constitution, 6th = disease & immunity.
 *
 * NOTE: Values are English-only strings that go into `ScoringFactor.value` (plain string).
 * Future i18n gap: to localise these, `ScoringFactor.value` would need to become `LocaleText`.
 */
const HOUSE_CONTEXT: Record<string, Record<number, string>> = {
  health:    {
    1: 'body & constitution',          // Hindi: शरीर एवं संविधान
    6: 'disease & immunity',           // Hindi: रोग एवं प्रतिरक्षा
    8: 'longevity',                    // Hindi: दीर्घायु
  },
  wealth:    {
    2: 'accumulated wealth',           // Hindi: संचित धन
    11: 'gains & income',             // Hindi: लाभ एवं आय
  },
  career:    {
    10: 'career & status',            // Hindi: कैरियर एवं प्रतिष्ठा
    6: 'service & competition',        // Hindi: सेवा एवं प्रतिस्पर्धा
  },
  marriage:  {
    7: 'marriage & partnerships',      // Hindi: विवाह एवं साझेदारी
  },
  children:  {
    5: 'children & progeny',           // Hindi: संतान एवं सन्तति
  },
  family:    {
    4: 'mother & home',                // Hindi: माता एवं गृह
    9: 'father & dharma',             // Hindi: पिता एवं धर्म
  },
  spiritual: {
    9: 'dharma & guru',                // Hindi: धर्म एवं गुरु
    12: 'moksha & renunciation',      // Hindi: मोक्ष एवं त्याग
  },
  education: {
    4: 'foundational education',       // Hindi: आधारभूत शिक्षा
    5: 'intelligence & higher learning', // Hindi: बुद्धि एवं उच्च शिक्षा
  },
};

/**
 * Maps each domain's natural karakas (significator planets) to their role description.
 * A karaka is a planet that naturally signifies a life area regardless of house lordship.
 * Example: Jupiter (4) is the natural putra karaka for the children domain.
 *
 * NOTE: Values are English-only strings — same i18n gap as HOUSE_CONTEXT above.
 */
const KARAKA_ROLE: Record<string, Record<number, string>> = {
  health:    {
    0: 'vitality karaka',              // Hindi: जीवनशक्ति कारक
    1: 'mental health',                // Hindi: मानसिक स्वास्थ्य
    2: 'energy & immunity',            // Hindi: ऊर्जा एवं प्रतिरक्षा
    6: 'chronic conditions',           // Hindi: दीर्घकालिक रोग
  },
  wealth:    {
    4: 'expansion karaka',             // Hindi: विस्तार कारक
    5: 'luxury karaka',                // Hindi: विलासिता कारक
    3: 'commerce karaka',              // Hindi: वाणिज्य कारक
  },
  career:    {
    0: 'authority karaka',             // Hindi: अधिकार कारक
    6: 'profession karaka',            // Hindi: व्यवसाय कारक
    3: 'business karaka',              // Hindi: व्यापार कारक
    2: 'drive & ambition',             // Hindi: उत्साह एवं महत्वाकांक्षा
  },
  marriage:  {
    5: 'relationship karaka',          // Hindi: सम्बन्ध कारक
    4: 'husband karaka',               // Hindi: पति कारक
    1: 'emotional bond',               // Hindi: भावनात्मक बन्धन
  },
  children:  {
    4: 'putra karaka',                 // Hindi: पुत्र कारक
    5: 'fertility karaka',             // Hindi: प्रजनन कारक
    1: 'nurturing karaka',             // Hindi: पालन कारक
  },
  family:    {
    1: 'mother karaka',                // Hindi: मातृ कारक
    0: 'father karaka',                // Hindi: पितृ कारक
    2: 'property & siblings',          // Hindi: सम्पत्ति एवं भ्रातृ
  },
  spiritual: {
    8: 'liberation karaka',            // Hindi: मोक्ष कारक
    4: 'wisdom karaka',                // Hindi: ज्ञान कारक
    1: 'inner mind',                   // Hindi: अन्तर्मन
  },
  education: {
    3: 'intellect karaka',             // Hindi: बुद्धि कारक
    4: 'wisdom karaka',                // Hindi: ज्ञान कारक
  },
};

/**
 * Maps planet dignity + kendra placement to a 0–3 tier index.
 *
 * BPHS-aligned mapping:
 * - Exalted / Own sign → tier 3 (uttama) — planet at full strength
 * - Friend's sign in kendra → tier 3, otherwise tier 2 — kendra amplifies moderate dignity
 * - Neutral sign → tier 2 (madhyama) — neither helped nor harmed
 * - Enemy sign → tier 1 (adhama) — friction but not destroyed
 * - Debilitated → tier 0 (atyadhama) — severely weakened
 *
 * Avastha modifiers are applied separately after this base tier.
 */
/**
 * Maps dignity + kendra to a base tier (0-3). Avastha modifier applied separately.
 *
 * Classical reasoning:
 * - Debilitated = tier 1 (Adhama), NOT tier 0. A debilitated planet is WEAK, not DEAD.
 *   Atyadhama (tier 0) should only result from compounding: debilitated + Mrita avastha
 *   (the -2 modifier brings 1 down to 0). A debilitated planet in Yuva avastha (+1)
 *   reaches tier 2 (Madhyama) — classically correct, the strong avastha partially
 *   compensates for the weak dignity.
 * - Enemy sign = tier 1 (uncomfortable but functional)
 * - Neutral = tier 2 (neither helped nor harmed)
 * - Friend / own / exalted = tier 2-3 (strong placements)
 */
function dignityToTier(dignity: DignityLevel, inKendra: boolean): number {
  if (dignity === 'exalted') return 3;
  if (dignity === 'own') return 3;
  if (dignity === 'friend') return inKendra ? 3 : 2;
  if (dignity === 'neutral') return 2;
  if (dignity === 'enemy') return 1;
  return 1; // debilitated — Adhama base. Mrita avastha (-2) → Atyadhama. Yuva (+1) → Madhyama.
}

/** Returns a tier modifier based on Baladi avastha strength (0–100). */
function avasthaModifier(baladiStrength: number): number {
  if (baladiStrength >= 90) return 1;   // Yuva: +1
  if (baladiStrength <= 10) return -2;  // Mrita: -2
  if (baladiStrength <= 25) return -1;  // Bala: -1
  return 0;                             // Kumara/Vriddha: neutral
}

function baladiName(strength: number): string {
  if (strength >= 90) return 'Yuva (Adult)';
  if (strength >= 45) return 'Vriddha (Old)';
  if (strength >= 35) return 'Kumara (Youth)';
  if (strength >= 15) return 'Bala (Infant)';
  return 'Mrita (Dead)';
}

/**
 * Hindi ordinal helper — handles irregular forms for 1st through 4th.
 * "1ला" (pahlā), "2रा" (dūsrā), "3रा" (tīsrā), "4था" (chauthā),
 * all others use "वें" (vẽ) suffix.
 */
function ordinalHi(n: number): string {
  if (n === 1) return '1ले';
  if (n === 2) return '2रे';
  if (n === 3) return '3रे';
  if (n === 4) return '4थे';
  return `${n}वें`;
}

// Tier constants: single source of truth in scorer.ts (see Lesson Q — no duplicate constants)
const TIER_NAMES = SCORER_TIER_NAMES;
const TIER_LABELS_MAP = SCORER_TIER_LABELS_MAP;
const TIER_SCORES_MAP = SCORER_TIER_SCORES_MAP;
const TIER_COLORS_MAP = SCORER_TIER_COLORS_MAP;

const DIGNITY_LABEL: Record<DignityLevel, string> = {
  exalted: 'exalted', own: 'own sign', friend: 'friendly sign',
  neutral: 'neutral sign', enemy: 'enemy sign', debilitated: 'debilitated',
};

/**
 * Evaluate all significators for a domain holistically.
 *
 * Classical Jyotish reads a domain through multiple lenses — not just the
 * primary house lord, but also natural karakas and house occupants. This
 * function scores each significator individually, then computes a weighted
 * average to produce the final tier.
 *
 * Weighting rationale:
 * - House lords (weight 2): The lord IS the house — its dignity and placement
 *   are the primary determinant per BPHS.
 * - Natural karakas (weight 1): Karakas indicate inherent potential (e.g.
 *   Jupiter for children) but don't "own" the house.
 * - Occupants (weight 1): Planets sitting in a house colour its expression but
 *   are secondary to the lord's condition.
 *
 * Each significator gets a 0–3 tier (atyadhama → uttama) based on dignity,
 * kendra placement, and Baladi avastha. The weighted average is rounded to the
 * nearest tier for the final rating.
 */
function evaluateSignificatorsHolistic(
  config: DomainConfig,
  kundali: KundaliData,
  data: ExtractedData,
  evaluatedYogas?: import('@/lib/kundali/yoga-engine/types').EvaluatedYoga[],
): RatingInfo {
  const factors: ScoringFactor[] = [];
  const tierValues: { tier: number; weight: number }[] = [];

  const houseContexts = HOUSE_CONTEXT[config.id] ?? {};
  const karakaRoles = KARAKA_ROLE[config.id] ?? {};

  // ── Evaluate each primary house lord (weight: 2) ──
  // House lords are weighted double because BPHS treats the lord as the primary
  // determinant of a house's potential. A strong lord can compensate for malefic
  // occupants; a weak lord undermines even benefic aspects.
  for (const h of config.primaryHouses) {
    const hSign = kundali.houses.find(c => c.house === h)?.sign ?? 1;
    const lordId = SIGN_LORD[hSign] ?? 0;
    const lordPos = data.planetMap.get(lordId);
    if (!lordPos) continue;

    const graha = GRAHAS[lordId];
    const lordName = graha?.name?.en ?? `Planet ${lordId}`;
    const dignity = getDignity(lordId, lordPos.sign);
    const inKendra = [1, 4, 7, 10].includes(lordPos.house);
    const context = houseContexts[h] ?? `${h}th house`;

    // Base tier from dignity
    let tier = dignityToTier(dignity, inKendra);

    // Avastha modifier
    let avasthaNote = '';
    if (kundali.avasthas) {
      const av = kundali.avasthas.find(a => a.planetId === lordId);
      if (av) {
        const mod = avasthaModifier(av.baladi.strength);
        tier = Math.max(0, Math.min(3, tier + mod));
        if (mod !== 0) {
          avasthaNote = mod < 0
            ? `, ${baladiName(av.baladi.strength)} — reduces delivery`
            : `, ${baladiName(av.baladi.strength)} — strengthens delivery`;
        }
      }
    }

    tier = Math.max(0, Math.min(3, tier));
    tierValues.push({ tier, weight: 2 });

    const kendraNote = inKendra ? ' + angular house' : '';
    const verdictForTier = tier >= 3 ? 'positive' : tier >= 2 ? 'neutral' : 'negative';

    const rashi = RASHIS[lordPos.sign - 1];
    const signName = rashi?.name?.en ?? `sign ${lordPos.sign}`;
    const inHouseNote = ` in ${ordinalEn(lordPos.house)} house (${signName})`;

    factors.push({
      label: { en: `${ordinalEn(h)} Lord ${lordName}`, hi: `${ordinalHi(h)} भाव स्वामी ${graha?.name?.hi ?? lordName}` },
      verdict: verdictForTier,
      value: `${DIGNITY_LABEL[dignity]}${inHouseNote}${kendraNote}${avasthaNote} — ${context}`,
    });
  }

  // ── Evaluate each natural karaka (weight: 1) ──
  // Natural karakas indicate inherent capacity for a life area — e.g. Jupiter
  // is the natural putra karaka regardless of which house it lords. Their
  // condition modifies the domain promise but with less weight than house lords.
  for (const pid of config.primaryPlanets) {
    // Skip if this planet is already evaluated as a house lord (avoid double-counting)
    const alreadyEvaluated = config.primaryHouses.some(h => {
      const hSign = kundali.houses.find(c => c.house === h)?.sign ?? 1;
      return (SIGN_LORD[hSign] ?? -1) === pid;
    });
    if (alreadyEvaluated) continue;

    const pos = data.planetMap.get(pid);
    if (!pos) continue;

    const graha = GRAHAS[pid];
    const pName = graha?.name?.en ?? `Planet ${pid}`;
    const dignity = getDignity(pid, pos.sign);
    const inKendra = [1, 4, 7, 10].includes(pos.house);
    const role = karakaRoles[pid] ?? 'significator';

    let tier = dignityToTier(dignity, inKendra);

    // Issue 7: Avastha evaluation for karakas — same logic as house lords.
    // A karaka in Mrita avastha has reduced capacity to deliver its significations
    // even if dignified (e.g. Jupiter exalted but Mrita still hampers putra results).
    let avasthaNote = '';
    if (kundali.avasthas) {
      const av = kundali.avasthas.find(a => a.planetId === pid);
      if (av) {
        const mod = avasthaModifier(av.baladi.strength);
        tier = Math.max(0, Math.min(3, tier + mod));
        if (mod !== 0) {
          avasthaNote = mod < 0
            ? `, ${baladiName(av.baladi.strength)} — reduces delivery`
            : `, ${baladiName(av.baladi.strength)} — strengthens delivery`;
        }
      }
    }

    tier = Math.max(0, Math.min(3, tier));
    tierValues.push({ tier, weight: 1 });

    const verdictForTier = tier >= 3 ? 'positive' : tier >= 2 ? 'neutral' : 'negative';

    factors.push({
      label: { en: `${pName} (${role})`, hi: `${graha?.name?.hi ?? pName} (${role})` },
      verdict: verdictForTier,
      value: `${DIGNITY_LABEL[dignity]}${inKendra ? ' + angular house' : ''}${avasthaNote}`,
    });
  }

  // ── Evaluate occupants of primary houses (weight: 1 each) ──
  // Planets SITTING IN the primary houses influence the domain directly.
  // Classical Jyotish: malefic occupants create friction but don't destroy a house;
  // benefics help but don't make it perfect. Hence madhyama (tier 2) for benefics
  // and adhama (tier 1) for malefics — NOT the extremes of uttama/atyadhama.
  const primaryHouseSet = new Set(config.primaryHouses);
  const evaluatedIds = new Set<number>(); // avoid double-listing lords/karakas
  // Collect IDs already shown as lords or karakas
  for (const h of config.primaryHouses) {
    const hSign = kundali.houses.find(c => c.house === h)?.sign ?? 1;
    evaluatedIds.add(SIGN_LORD[hSign] ?? -1);
  }
  for (const pid of config.primaryPlanets) evaluatedIds.add(pid);

  for (const p of kundali.planets) {
    if (!primaryHouseSet.has(p.house)) continue;
    if (evaluatedIds.has(p.planet.id)) continue; // already shown as lord or karaka

    const graha = GRAHAS[p.planet.id];
    const pNameStr = graha?.name?.en ?? `Planet ${p.planet.id}`;
    const benefic = isBenefic(p.planet.id);
    const hContext = houseContexts[p.house] ?? `${p.house}th house`;

    // Occupant tier: benefic = madhyama boost (tier 2), malefic = adhama drag (tier 1).
    // Weight 0.5 (not 1): occupants colour a house's expression but the lord's condition
    // is far more determinative. Without this, 2 malefic occupants can tank an otherwise
    // strong domain from uttama to madhyama, which is not how classical Jyotish reads charts.
    const occupantTier = benefic ? 2 : 1;
    tierValues.push({ tier: occupantTier, weight: 0.5 });

    factors.push({
      label: { en: `${pNameStr} in ${ordinalEn(p.house)} house`, hi: `${graha?.name?.hi ?? pNameStr} ${ordinalHi(p.house)} भाव में` },
      verdict: benefic ? 'positive' : 'negative',
      value: benefic
        ? `benefic occupant — enriches ${hContext}`
        : `malefic occupant — creates friction in ${hContext}`,
    });
  }

  // ── Evaluate relevant yogas and doshas ──
  // If new engine results are available, use domain-mapped yogas (precise).
  // Otherwise fall back to old category-matching (approximate).
  if (evaluatedYogas && evaluatedYogas.length > 0) {
    // New engine: each yoga specifies exactly which domains it affects
    const domainId = config.id as string;
    const domainYogas = evaluatedYogas.filter(y =>
      y.present && !y.cancellationStatus?.anyCancelled &&
      (y.affectedDomains === 'all' || (y.affectedDomains as string[]).includes(domainId)),
    );
    const auspiciousYogas = domainYogas.filter(y => y.isAuspicious);
    const inauspiciousYogas = domainYogas.filter(y => !y.isAuspicious);

    // Strength → tier mapping
    const YOGA_STR_TIER: Record<string, number> = { Strong: 3, Moderate: 2, Weak: 1 };

    if (auspiciousYogas.length > 0) {
      // Phase 4-5: Yoga tier varies by strength (not always tier 3).
      // Strong yoga = tier 3, Moderate = tier 2, Weak = tier 1.
      // Diminishing returns: first 3 at full weight, rest at half.
      for (let i = 0; i < auspiciousYogas.length; i++) {
        const y = auspiciousYogas[i];
        const tier = YOGA_STR_TIER[y.strength] ?? 2;
        const w = i < 3 ? y.domainImpactWeight : y.domainImpactWeight * 0.5;
        tierValues.push({ tier, weight: w });
      }
      // Phase 5: Context-aware summaries with cancellation + strength reporting
      const details = auspiciousYogas.map(y => {
        const baseSummary = (y.description.en ?? '').split(/[.।]/)[0].trim();
        const parts: string[] = [baseSummary];
        // Strength qualifier
        if (y.strength === 'Strong') parts.push('(strong)');
        else if (y.strength === 'Weak') parts.push('(weak — limited effect)');
        // Cancellation reporting
        if (y.cancellationStatus?.details.some(d => d.effect === 'weaken' && d.cancelled) && !y.cancellationStatus.anyCancelled) {
          const reasons = y.cancellationStatus.details
            .filter(d => d.effect === 'weaken' && d.cancelled)
            .map(d => d.reason).join('; ');
          if (reasons) parts.push(`— weakened: ${reasons}`);
        }
        return { id: y.id, name: y.name.en, summary: parts.join(' ') };
      });
      const names = details.slice(0, 3).map(d => d.name);
      const more = details.length > 3 ? ` (+${details.length - 3} more)` : '';
      factors.push({
        label: { en: 'Active Yogas', hi: 'सक्रिय योग' },
        verdict: 'positive',
        value: `${names.join(', ')}${more}`,
        yogaDetails: details,
      });
    }

    if (inauspiciousYogas.length > 0) {
      // Phase 4-5: Split into active vs cancelled doshas FIRST.
      // Cancelled doshas should NOT contribute to tierValues at all.
      const activeDoshas = inauspiciousYogas.filter(y => !y.cancellationStatus?.anyCancelled);
      const cancelledDoshas = inauspiciousYogas.filter(y => y.cancellationStatus?.anyCancelled);

      // Only active (non-cancelled) doshas affect the score.
      // Strong/Moderate dosha = tier 0, Weak = tier 1 (mild).
      for (let i = 0; i < activeDoshas.length; i++) {
        const y = activeDoshas[i];
        const tier = y.strength === 'Weak' ? 1 : 0;
        const w = i < 2 ? y.domainImpactWeight : y.domainImpactWeight * 0.5;
        tierValues.push({ tier, weight: w });
      }

      // Phase 5: Context-aware summaries for active doshas
      const activeDetails = activeDoshas.map(y => {
        const baseSummary = (y.description.en ?? '').split(/[.।]/)[0].trim();
        const parts: string[] = [baseSummary];
        if (y.cancellationStatus?.details.some(d => d.effect === 'weaken' && d.cancelled)) {
          const reasons = y.cancellationStatus.details
            .filter(d => d.effect === 'weaken' && d.cancelled)
            .map(d => d.reason).join('; ');
          if (reasons) parts.push(`— partially mitigated: ${reasons}`);
        }
        if (y.strength === 'Weak') parts.push('(mild)');
        return { id: y.id, name: y.name.en, summary: parts.join(' ') };
      });

      if (activeDetails.length > 0) {
        const names = activeDetails.slice(0, 2).map(d => d.name);
        const more = activeDetails.length > 2 ? ` (+${activeDetails.length - 2} more)` : '';
        factors.push({
          label: { en: 'Active Doshas', hi: 'सक्रिय दोष' },
          verdict: 'negative',
          value: `${names.join(', ')}${more}`,
          yogaDetails: activeDetails,
        });
      }

      // Note cancelled doshas as positive (they're neutralised)
      if (cancelledDoshas.length > 0) {
        const cancelNames = cancelledDoshas.map(y => y.name.en);
        factors.push({
          label: { en: 'Cancelled Doshas', hi: 'निरस्त दोष' },
          verdict: 'positive',
          value: `${cancelNames.join(', ')} — conditions for cancellation are met`,
        });
      }
    }
  } else if (kundali.yogasComplete) {
    // Fallback: old category-matching approach
    const activeYogas = kundali.yogasComplete.filter(
      y => y.present && config.relevantYogaCategories.includes(y.category),
    );
    if (activeYogas.length > 0) {
      for (const y of activeYogas.slice(0, 3)) {
        tierValues.push({ tier: 3, weight: 1 });
      }
      const yogaNames = activeYogas.slice(0, 3).map(y => y.name.en ?? 'Yoga');
      const moreCount = activeYogas.length > 3 ? ` (+${activeYogas.length - 3} more)` : '';
      factors.push({
        label: { en: 'Active Yogas', hi: 'सक्रिय योग' },
        verdict: 'positive',
        value: `${yogaNames.join(', ')}${moreCount}`,
      });
    }

    const activeDoshas = kundali.yogasComplete.filter(y => {
      const nameStr = (y.name.en ?? '').toLowerCase().replace(/\s+/g, '_');
      return y.present && config.relevantDoshas.some(d => nameStr.includes(d));
    });
    if (activeDoshas.length > 0) {
      for (const d of activeDoshas.slice(0, 2)) {
        tierValues.push({ tier: 0, weight: 1 });
      }
      const doshaNames = activeDoshas.slice(0, 2).map(d => d.name.en ?? 'Dosha');
      const moreCount = activeDoshas.length > 2 ? ` (+${activeDoshas.length - 2} more)` : '';
      factors.push({
        label: { en: 'Active Doshas', hi: 'सक्रिय दोष' },
        verdict: 'negative',
        value: `${doshaNames.join(', ')}${moreCount}`,
      });
    }
  }

  // ── Holistic tier: lord-anchored + yoga boost / dosha penalty ──
  // Classical approach: the PRIMARY house lord's tier is THE verdict.
  // Yogas upgrade it, doshas downgrade it, other significators inform but don't override.
  //
  // Why not weighted average? With 6+ significators, the average always regresses
  // to madhyama regardless of chart strength. A chart with 11 auspicious yogas
  // and one debilitated karaka would score madhyama — which no Jyotishi would say.
  //
  // The lord-anchored approach mirrors how a Jyotishi actually reads:
  // "Your 2nd lord is strong — AND you have 11 wealth yogas — this is excellent."

  // Step 1: Primary lord tier — use the FIRST lord entry (config.primaryHouses[0]).
  // Not the max — the primary house lord is THE anchor per classical reading order.
  // A strong secondary lord is noted in the commentary but doesn't override a weak primary.
  const lordTiers = tierValues.filter(v => v.weight >= 2);
  const primaryLordTier = lordTiers.length > 0 ? lordTiers[0].tier : 2;

  // Step 2: Yoga boost / dosha penalty.
  // Yoga entries: tier >= 1 and weight < 2 (lords have weight >= 2).
  // Only count Strong/Moderate yogas (tier >= 2) for the boost — Weak yogas don't boost.
  // Dosha entries: tier <= 1 and weight < 2.
  const yogaEntries = tierValues.filter(v => v.tier >= 2 && v.weight < 2);
  const doshaEntries = tierValues.filter(v => v.tier <= 1 && v.weight < 2);
  const yogaBoost = yogaEntries.length >= 3 ? 1 : 0;    // 3+ strong/moderate yogas → +1 tier
  const doshaPenalty = doshaEntries.length >= 2 ? 1 : 0; // 2+ active doshas → -1 tier

  // Step 3: Combine.
  // Dosha penalty cannot push below Adhama (tier 1). Atyadhama is reserved
  // for cases where the lord's OWN dignity + avastha compounds to tier 0
  // (e.g. debilitated + Mrita = 1 + (-2) = -1 → clamped to 0).
  // External doshas (Kaal Sarpa, Grahan, etc.) add challenges but don't
  // make a domain "critical" — that comes from the lord's inherent weakness.
  const boosted = primaryLordTier + yogaBoost;
  const penalised = boosted - doshaPenalty;
  const finalTierIndex = Math.max(
    primaryLordTier === 0 ? 0 : 1, // floor: Adhama unless lord itself is tier 0
    Math.min(3, penalised),
  );
  const finalTier = TIER_NAMES[finalTierIndex];

  return {
    rating: finalTier,
    score: TIER_SCORES_MAP[finalTier],
    label: TIER_LABELS_MAP[finalTier],
    color: TIER_COLORS_MAP[finalTier],
    factors,
  };
}

function ordinalEn(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

// ---------------------------------------------------------------------------
// Helper: build a single domain reading
// ---------------------------------------------------------------------------

function buildDomainReading(
  config: DomainConfig,
  kundali: KundaliData,
  data: ExtractedData,
  crossLinks: CrossDomainLink[],
  nativeAge?: number,
  transitData?: TransitEntry[],
  evaluatedYogas?: import('@/lib/kundali/yoga-engine/types').EvaluatedYoga[],
): DomainReading {
  // 1. Multi-significator holistic scoring.
  // Each domain is assessed through ALL its primary house lords AND natural
  // karakas. A Jyotishi evaluates every significator, not just one.
  const natalRating = evaluateSignificatorsHolistic(config, kundali, data, evaluatedYogas);

  // 2. Natal promise block
  const natalPromise = buildNatalPromise(config, kundali, data, natalRating, nativeAge);

  // 3. Current activation (using real transit data when available)
  const currentActivation = buildCurrentActivation(config, kundali, data, transitData);

  // 4. Overall rating = natal promise (permanent, chart-based).
  // Current activation (dasha, transits, Sade Sati) is shown SEPARATELY
  // in the UI as "Current Period" — it never modifies the natal rating.
  //
  // Rationale: classical Jyotish reads the chart in layers — natal promise
  // first ("your chart shows strong education"), then temporal overlay
  // ("but during Saturn Mahadasha..."). Blending them into one rating
  // creates contradictions where the narrative describes a strong placement
  // but the badge says "Challenging" due to a transient transit.
  const overallRating: RatingInfo = { ...natalRating };

  // 5. Timeline triggers
  const timelineTriggers = computeDomainTimeline({
    domainConfig: config,
    kundali,
    currentDate: data.currentDate,
  });

  // 6. Remedies
  const weakPlanets = identifyWeakPlanets(config, kundali, data);
  const remedies = selectDomainRemedies({
    domainConfig: config,
    weakPlanets,
  });

  // 7. Cross-domain links for this domain
  // Include links relevant to this domain  –  exclude self-references (Wealth ↔ Wealth)
  const domainCrossLinks = crossLinks.filter(
    l => l.linkedDomain !== config.id,
  );

  // 8. Headline: first sentence of natal summary
  const summaryEn = natalPromise.summary.en;
  const firstSentence = summaryEn.split(/(?<=\.)\s/)[0] ?? summaryEn;
  const summaryHi = natalPromise.summary.hi ?? natalPromise.summary.en;
  const firstSentenceHi = summaryHi.split(/(?<=।)\s/)[0] ?? summaryHi;
  const headline: LocaleText = {
    en: firstSentence,
    hi: firstSentenceHi,
  };

  // 9. Dasha activation narrative
  const mahaName = GRAHAS[data.mahaLordId]?.name ?? { en: '(unresolved graha)' };
  const antarName = GRAHAS[data.antarLordId]?.name ?? { en: '(unresolved graha)' };
  const dashaBlock = narrateDashaActivation({
    mahaLordId: data.mahaLordId,
    mahaLordName: mahaName,
    antarLordId: data.antarLordId,
    antarLordName: antarName,
    activatesDomain: currentActivation.isDashaActive,
    relationship: '',
    nativeAge,
  });

  // Full detailed narrative
  const detailedNarrative = composeDomainNarrative([
    natalPromise.summary,
    currentActivation.summary,
    dashaBlock,
  ]);

  return {
    domain: config.id,
    overallRating,
    natalPromise,
    currentActivation,
    timelineTriggers,
    remedies,
    crossDomainLinks: domainCrossLinks,
    headline,
    detailedNarrative,
  };
}

// ---------------------------------------------------------------------------
// Helper: find strongest house
// ---------------------------------------------------------------------------

function findStrongestHouse(kundali: KundaliData): number {
  if (kundali.bhavabala) {
    const bhava = kundali.bhavabala as unknown as { house: number; total: number }[];
    if (bhava.length > 0) {
      const sorted = [...bhava].sort((a, b) => b.total - a.total);
      return sorted[0].house;
    }
  }
  // Fallback: house with most benefic occupants
  const houseBenefics: Record<number, number> = {};
  for (const p of kundali.planets) {
    if (isBenefic(p.planet.id)) {
      houseBenefics[p.house] = (houseBenefics[p.house] ?? 0) + 1;
    }
  }
  let best = 1;
  let bestCount = 0;
  for (const [h, c] of Object.entries(houseBenefics)) {
    if (c > bestCount) {
      bestCount = c;
      best = Number(h);
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Helper: find Atmakaraka
// ---------------------------------------------------------------------------

function findAtmakaraka(kundali: KundaliData): number {
  // Jaimini AK if available
  if (kundali.jaimini?.charaKarakas) {
    const ak = kundali.jaimini.charaKarakas.find(k => k.karaka === 'AK');
    if (ak) return ak.planet;
  }

  // Fallback: planet with highest degree in its sign (excluding Rahu/Ketu)
  let maxDeg = -1;
  let akId = 0;
  for (const p of kundali.planets) {
    if (p.planet.id === 7 || p.planet.id === 8) continue; // skip nodes
    const degInSign = p.longitude % 30;
    if (degInSign > maxDeg) {
      maxDeg = degInSign;
      akId = p.planet.id;
    }
  }
  return akId;
}

// ---------------------------------------------------------------------------
// Main public function
// ---------------------------------------------------------------------------

/**
 * Orchestrates all domain synthesis modules to produce a complete
 * PersonalReading from a KundaliData object.
 *
 * Works with minimal KundaliData (planets, houses, chart, dashas, ascendant, shadbala).
 * Optional enrichments (bhavabala, yogasComplete, argala, jaimini) improve depth.
 *
 * @param kundali - Full or partial KundaliData
 * @param locale  - Display locale (unused in engine; narratives are bilingual en+hi)
 * @param nativeAge - Age of the native in years
 * @returns Complete PersonalReading with 8 domain readings + current period
 */
export function synthesizeReading(
  kundali: KundaliData,
  _locale?: string,
  nativeAge?: number,
  /** New yoga engine results — if provided, used for domain-mapped yoga/dosha scoring */
  evaluatedYogas?: import('@/lib/kundali/yoga-engine/types').EvaluatedYoga[],
): PersonalReading {
  const data = extractData(kundali);

  // 1. Cross-domain links (computed once, shared across domains)
  const crossDomainInput: CrossDomainInput = {
    houseLords: data.houseLords,
    planetHouses: data.planetHouses,
  };
  const crossDomainLinks = detectCrossDomainLinks(crossDomainInput);

  // 1b. Compute current transits (lightweight, no lat/lng needed)
  let transitData: TransitEntry[] | undefined;
  try {
    transitData = computeCurrentTransits(data.ascendantSign);
  } catch (err) {
    console.error('[synthesizer] transit computation failed:', err);
    transitData = undefined;
  }

  // 2. Build all 8 domain readings
  const domains: DomainReading[] = DOMAIN_CONFIGS.map(config =>
    buildDomainReading(config, kundali, data, crossDomainLinks, nativeAge, transitData, evaluatedYogas),
  );

  // 3. Current period
  const currentPeriodInput: CurrentPeriodInput = {
    dashas: kundali.dashas,
    planets: kundali.planets,
    moonSign: data.moonSign,
    currentDate: data.currentDate,
    sadeSatiStatus: kundali.sadeSati
      ? {
          active: (kundali.sadeSati as { isActive?: boolean }).isActive ?? false,
          phase: (kundali.sadeSati as { currentPhase?: string }).currentPhase ?? undefined,
        }
      : undefined,
  };
  const currentPeriod = synthesizeCurrentPeriod(currentPeriodInput);

  // 4. Life overview → topInsight
  const akId = findAtmakaraka(kundali);
  const strongestHouse = findStrongestHouse(kundali);
  const age = nativeAge ?? 30; // default age for overview
  const overviewInput: OverviewInput = {
    ascendantSign: data.ascendantSign,
    atmakarakaPlanetId: akId,
    strongestHouseNumber: strongestHouse,
    currentMahadashaLordId: data.mahaLordId,
    nativeAge: age,
  };
  const topInsight = generateLifeOverview(overviewInput);

  // 5. Assemble PersonalReading
  return {
    kundaliId: kundali.birthData?.name ?? 'unknown',
    computedAt: new Date().toISOString(),
    domains,
    currentPeriod,
    topInsight,
  };
}

// ---------------------------------------------------------------------------
// Single domain deep dive (lazy loading per addendum A8)
// ---------------------------------------------------------------------------

/**
 * Computes a full reading for a SINGLE domain. Use for lazy-loading
 * deep dive views without computing all 8 domains.
 *
 * @param kundali  - Full or partial KundaliData
 * @param domainId - Which domain to compute
 * @param locale   - Display locale (unused; narratives bilingual)
 * @param nativeAge - Age of native
 * @returns Single DomainReading or null if domainId not found
 */
export function synthesizeDomainDeepDive(
  kundali: KundaliData,
  domainId: DomainType,
  _locale?: string,
  nativeAge?: number,
  evaluatedYogas?: import('@/lib/kundali/yoga-engine/types').EvaluatedYoga[],
): DomainReading | null {
  const config = DOMAIN_CONFIGS.find(c => c.id === domainId);
  if (!config) return null;

  const data = extractData(kundali);

  // Cross-domain links for context
  const crossDomainInput: CrossDomainInput = {
    houseLords: data.houseLords,
    planetHouses: data.planetHouses,
  };
  const crossDomainLinks = detectCrossDomainLinks(crossDomainInput);

  // Compute current transits for the deep dive
  let transitData: TransitEntry[] | undefined;
  try {
    transitData = computeCurrentTransits(data.ascendantSign);
  } catch (err) {
    console.error('[synthesizer] transit computation failed for deep dive:', err);
    transitData = undefined;
  }

  return buildDomainReading(config, kundali, data, crossDomainLinks, nativeAge, transitData, evaluatedYogas);
}
