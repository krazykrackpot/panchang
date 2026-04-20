/**
 * Main Synthesiser Orchestrator — Personal Pandit Engine
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
import type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type {
  PersonalReading,
  DomainReading,
  DomainConfig,
  DomainType,
  NatalPromiseBlock,
  CurrentActivationBlock,
  RatingInfo,
  CrossDomainLink,
} from './types';

import { DOMAIN_CONFIGS } from './config';
import { scoreDomain, type ScorerInput } from './scorer';
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
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import type { DignityLevel } from '@/lib/tippanni/varga-tippanni-types-v2';

// ---------------------------------------------------------------------------
// Sign → Lord mapping (standard Vedic rulership)
// ---------------------------------------------------------------------------

/** Sign number (1-12) → planet ID of the lord. */
const SIGN_LORD: Record<number, number> = {
  1:  2, // Aries    → Mars
  2:  5, // Taurus   → Venus
  3:  3, // Gemini   → Mercury
  4:  1, // Cancer   → Moon
  5:  0, // Leo      → Sun
  6:  3, // Virgo    → Mercury
  7:  5, // Libra    → Venus
  8:  2, // Scorpio  → Mars
  9:  4, // Sagittarius → Jupiter
  10: 6, // Capricorn   → Saturn
  11: 6, // Aquarius    → Saturn
  12: 4, // Pisces      → Jupiter
};

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

// ---------------------------------------------------------------------------
// Exaltation / debilitation mapping for dignity assessment
// ---------------------------------------------------------------------------

/** Planet ID → sign of exaltation (1-based). */
const EXALTATION_SIGN: Record<number, number> = {
  0: 1,  // Sun exalted in Aries
  1: 2,  // Moon in Taurus
  2: 10, // Mars in Capricorn
  3: 6,  // Mercury in Virgo
  4: 4,  // Jupiter in Cancer
  5: 12, // Venus in Pisces
  6: 7,  // Saturn in Libra
  7: 3,  // Rahu in Gemini (traditional)
  8: 9,  // Ketu in Sagittarius
};

const DEBILITATION_SIGN: Record<number, number> = {
  0: 7,  // Sun debilitated in Libra
  1: 8,  // Moon in Scorpio
  2: 4,  // Mars in Cancer
  3: 12, // Mercury in Pisces
  4: 10, // Jupiter in Capricorn
  5: 6,  // Venus in Virgo
  6: 1,  // Saturn in Aries
  7: 9,  // Rahu in Sagittarius
  8: 3,  // Ketu in Gemini
};

// ---------------------------------------------------------------------------
// Natural friendship (simplified)
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
// Helper: build ScorerInput for a domain
// ---------------------------------------------------------------------------

function buildScorerInput(
  config: DomainConfig,
  kundali: KundaliData,
  data: ExtractedData,
): ScorerInput {
  const primaryHouses = new Set(config.primaryHouses);

  // 1. houseBhavabala: average bhavabala of primary houses, normalised 0-10
  let houseBhavabala = 5; // default
  if (kundali.bhavabala) {
    const bhavaResults = kundali.bhavabala;
    const vals = bhavaResults
      .filter(b => primaryHouses.has(b.bhava))
      .map(b => b.total);
    if (vals.length > 0) {
      const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
      // Bhavabala total is typically 300-500 rupas. Normalise to 0-10.
      houseBhavabala = Math.min(10, Math.max(0, (avg - 200) / 40));
    }
  }

  // 2. lordDignity: primary house lord's dignity
  const primaryHouse = config.primaryHouses[0];
  const lordId = SIGN_LORD[kundali.houses.find(h => h.house === primaryHouse)?.sign ?? 1] ?? 0;
  const lordPos = data.planetMap.get(lordId);
  const lordSign = lordPos?.sign ?? 1;
  const lordDignity = getDignity(lordId, lordSign);

  // 3. lordInKendra
  const lordHouse = lordPos?.house ?? 0;
  const lordInKendra = [1, 4, 7, 10].includes(lordHouse);

  // 4. Count benefic/malefic occupants in primary houses
  let beneficOccupants = 0;
  let maleficOccupants = 0;
  for (const p of kundali.planets) {
    if (primaryHouses.has(p.house)) {
      if (isBenefic(p.planet.id)) {
        beneficOccupants++;
      } else {
        maleficOccupants++;
      }
    }
  }

  // 5. Aspects: if argala exists, use it; otherwise estimate
  let beneficAspects = 0;
  let maleficAspects = 0;
  if (kundali.argala) {
    const argalaResults = kundali.argala as {
      house: number;
      aspects?: { planetId: number; type: string }[];
    }[];
    for (const ar of argalaResults) {
      if (primaryHouses.has(ar.house) && ar.aspects) {
        for (const asp of ar.aspects) {
          if (isBenefic(asp.planetId)) beneficAspects++;
          else maleficAspects++;
        }
      }
    }
  } else {
    // Estimate: Jupiter aspects houses 5, 7, 9 from its position; Saturn 3, 7, 10
    const jupPos = data.planetMap.get(4);
    const satPos = data.planetMap.get(6);
    if (jupPos) {
      const jupAspects = [5, 7, 9].map(off => ((jupPos.house - 1 + off) % 12) + 1);
      for (const h of jupAspects) {
        if (primaryHouses.has(h)) beneficAspects++;
      }
    }
    if (satPos) {
      const satAspects = [3, 7, 10].map(off => ((satPos.house - 1 + off) % 12) + 1);
      for (const h of satAspects) {
        if (primaryHouses.has(h)) maleficAspects++;
      }
    }
  }

  // 6. Relevant yoga count
  let relevantYogaCount = 0;
  if (kundali.yogasComplete) {
    const yogas = kundali.yogasComplete;
    relevantYogaCount = yogas.filter(
      y => y.present && config.relevantYogaCategories.includes(y.category),
    ).length;
  }

  // 7. Relevant dosha count
  let relevantDoshaCount = 0;
  const cancelledDoshas = 0;
  // Check from yogasComplete for dosha-category entries
  if (kundali.yogasComplete) {
    const yogas = kundali.yogasComplete;
    for (const y of yogas) {
      const nameStr = (y.name.en ?? '').toLowerCase().replace(/\s+/g, '_');
      if (config.relevantDoshas.some(d => nameStr.includes(d))) {
        if (y.present) {
          relevantDoshaCount++;
        }
      }
    }
  }

  // 8. Dasha activates house
  const dashaActivatesHouse = (() => {
    const mahaLordPos = data.planetMap.get(data.mahaLordId);
    if (!mahaLordPos) return false;

    // Check if maha lord occupies a primary house
    if (primaryHouses.has(mahaLordPos.house)) return true;

    // Check if maha lord lords a primary house
    for (const h of config.primaryHouses) {
      const houseSign = kundali.houses.find(c => c.house === h)?.sign ?? 0;
      if (SIGN_LORD[houseSign] === data.mahaLordId) return true;
    }

    return false;
  })();

  // 9. Varga delivery score — default 50
  const vargaDeliveryScore = 50;

  return {
    houseBhavabala,
    lordDignity,
    lordInKendra,
    beneficOccupants,
    maleficOccupants,
    beneficAspects,
    maleficAspects,
    relevantYogaCount,
    relevantDoshaCount,
    cancelledDoshas,
    dashaActivatesHouse,
    vargaDeliveryScore,
  };
}

// ---------------------------------------------------------------------------
// Helper: build CurrentActivationBlock for a domain
// ---------------------------------------------------------------------------

function buildCurrentActivation(
  config: DomainConfig,
  kundali: KundaliData,
  data: ExtractedData,
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

  // Simplified transit influences — slow planets in domain houses
  const transitInfluences: CurrentActivationBlock['transitInfluences'] = [];
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

  const overallActivationScore = Math.min(10,
    dashaActivationScore + transitInfluences.length * 1.5,
  );

  const mahaName = GRAHAS[data.mahaLordId]?.name ?? { en: 'Unknown' };
  const antarName = GRAHAS[data.antarLordId]?.name ?? { en: 'Unknown' };

  const summary: LocaleText = isDashaActive
    ? {
        en: `${mahaName.en}-${antarName.en} dasha is actively energising your ${config.name.en} domain.`,
        hi: `${mahaName.hi ?? mahaName.en}-${antarName.hi ?? antarName.en} दशा आपके ${config.name.hi ?? config.name.en} क्षेत्र को सक्रिय रूप से ऊर्जित कर रही है।`,
      }
    : {
        en: `Current dasha is not directly activating your ${config.name.en} domain — effects remain background-level.`,
        hi: `वर्तमान दशा आपके ${config.name.hi ?? config.name.en} क्षेत्र को सीधे सक्रिय नहीं कर रही — प्रभाव पृष्ठभूमि स्तर पर हैं।`,
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
      lordQualities.push({
        lordId,
        houseInD1: lordPos.house,
        signInD1: lordPos.sign,
        dignity: getDignity(lordId, lordPos.sign),
        score: natalRating.score,
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

  // Varga confirmations — placeholder
  const vargaConfirmations: NatalPromiseBlock['vargaConfirmations'] = config.divisionalCharts.map(
    chartId => ({
      chartId,
      score: 50,
      keyInsight: { en: `${chartId} analysis pending deeper integration.`, hi: `${chartId} विश्लेषण गहन एकीकरण प्रतीक्षित।` },
    }),
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
        lordPlanetName: graha?.name ?? { en: 'Unknown' },
        lordHouse: primaryLordPos.house,
        lordSign: primaryLordPos.sign,
        lordSignName: rashi?.name ?? { en: 'Unknown' },
        dignity: getDignity(primaryLordId, primaryLordPos.sign),
        isRetrograde: primaryLordPos.isRetrograde,
        primaryHouse: primaryH,
        nativeAge,
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
// Helper: build a single domain reading
// ---------------------------------------------------------------------------

function buildDomainReading(
  config: DomainConfig,
  kundali: KundaliData,
  data: ExtractedData,
  crossLinks: CrossDomainLink[],
  nativeAge?: number,
): DomainReading {
  // 1. Score
  const scorerInput = buildScorerInput(config, kundali, data);
  const natalRating = scoreDomain(config, scorerInput);

  // 2. Natal promise block
  const natalPromise = buildNatalPromise(config, kundali, data, natalRating, nativeAge);

  // 3. Current activation
  const currentActivation = buildCurrentActivation(config, kundali, data);

  // 4. Overall rating: blend natal + activation
  const blendedScore = natalRating.score * 0.7 + currentActivation.overallActivationScore * 0.3;
  const clampedBlend = Math.round(Math.min(10, Math.max(0, blendedScore)) * 10) / 10;
  const overallRating: RatingInfo = {
    ...natalRating,
    score: clampedBlend,
    rating: clampedBlend >= 7.5 ? 'uttama'
      : clampedBlend >= 5.0 ? 'madhyama'
      : clampedBlend >= 3.0 ? 'adhama'
      : 'atyadhama',
  };

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
  // Include links relevant to this domain — exclude self-references (Wealth ↔ Wealth)
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
  const mahaName = GRAHAS[data.mahaLordId]?.name ?? { en: 'Unknown' };
  const antarName = GRAHAS[data.antarLordId]?.name ?? { en: 'Unknown' };
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
): PersonalReading {
  const data = extractData(kundali);

  // 1. Cross-domain links (computed once, shared across domains)
  const crossDomainInput: CrossDomainInput = {
    houseLords: data.houseLords,
    planetHouses: data.planetHouses,
  };
  const crossDomainLinks = detectCrossDomainLinks(crossDomainInput);

  // 2. Build all 8 domain readings
  const domains: DomainReading[] = DOMAIN_CONFIGS.map(config =>
    buildDomainReading(config, kundali, data, crossDomainLinks, nativeAge),
  );

  // 3. Current period
  const currentPeriodInput: CurrentPeriodInput = {
    dashas: kundali.dashas,
    planets: kundali.planets,
    moonSign: data.moonSign,
    currentDate: data.currentDate,
    sadeSatiStatus: kundali.sadeSati
      ? { active: (kundali.sadeSati as { isActive?: boolean }).isActive ?? false }
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

  return buildDomainReading(config, kundali, data, crossDomainLinks, nativeAge);
}
