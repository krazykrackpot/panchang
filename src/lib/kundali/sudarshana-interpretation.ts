/**
 * Sudarshana Chakra — Rich Interpretation Engine
 *
 * Generates meaningful annual prognosis from the triple-reference chart.
 * Consumes planet positions from KundaliData and produces detailed
 * per-ring analysis, convergence insight, year-over-year comparison,
 * and practical focus areas.
 *
 * Reference: BPHS Ch.22 (Sudarshana Chakra Dasha)
 */

import type { PlanetPosition } from '@/types/kundali';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { PLANET_IN_HOUSE } from '@/lib/kundali/interpretations';
import { tl } from '@/lib/utils/trilingual';
import type { LocaleText } from '@/types/panchang';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DetailedRingAnalysis {
  house: number;
  signId: number;
  signName: LocaleText;
  theme: string;
  detailedTheme: string;
  lordPlanetId: number;
  lordPlanetName: string;
  lordHouse: number;
  lordAnalysis: string;
  planetsPresent: { id: number; name: string; brief: string }[];
}

export interface MonthlySubPeriod {
  month: number; // 1-12
  signId: number;
  signName: LocaleText;
  lordPlanetId: number;
  lordPlanetName: string;
  theme: string;
}

export interface DashaContext {
  mahadasha: string;
  antardasha: string;
  dashaInfluence: string;
}

export interface CycleContext {
  cycleNumber: number;
  lifeStage: string;
  cycleTheme: string;
}

export interface EnhancedInterpretation {
  age: number;
  lagna: DetailedRingAnalysis;
  chandra: DetailedRingAnalysis;
  surya: DetailedRingAnalysis;
  combined: string;
  convergenceNote: string;
  yearDelta: string;
  focusAreas: string[];
  monthlySubPeriods: MonthlySubPeriod[];
  dashaContext: DashaContext | null;
  cycleContext: CycleContext;
}

// ─── Constants ──────────────────────────────────────────────────────────────

// Sign lord mapping: signId (1-12) → planetId (0-8)
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// Map numeric planet id → PLANET_IN_HOUSE key
const PLANET_KEYS: string[] = [
  'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu',
];

export const EDUCATIONAL_NOTE =
  'The Sudarshana Chakra, described in Brihat Parashara Hora Shastra (Ch. 22), ' +
  'examines annual influences by simultaneously progressing houses from three ' +
  'reference points: Ascendant (Lagna), Moon (Chandra), and Sun (Surya). Each year ' +
  'activates the next house in a 12-year cycle from each reference, creating a ' +
  'triple-layered annual forecast. When multiple references activate the same house ' +
  'type, that life area receives intensified focus. The sign lord and planets ' +
  'occupying each activated house further color the year\'s themes.';

// Extended house descriptions for Sudarshana annual context
const HOUSE_DESC: Record<number, string> = {
  1: 'Focus turns inward to self, health, and personal identity. This is a year of new beginnings — how the world perceives you undergoes renewal. Physical vitality and self-expression take center stage.',
  2: 'Wealth, family bonds, and speech are highlighted. Financial matters demand attention — income, savings, and family resources. What you value and how you communicate it shapes this year.',
  3: 'Courage, initiative, and communication drive the year. Relationships with siblings matter. Short journeys, new skills, and bold self-expression bring growth.',
  4: 'Domestic life, emotional security, and property matters come into focus. Your connection to mother, home, and inner peace defines this period. Land, vehicles, and education may feature.',
  5: 'Creativity, intelligence, and children are central themes. Romance, speculation, and past-life merit come alive. This is a year for creative expression and joyful pursuits.',
  6: 'Health, daily routines, and overcoming obstacles dominate. Enemies or competitors may surface but can be defeated through disciplined effort. Service to others brings reward.',
  7: 'Partnerships, marriage, and one-on-one relationships take the spotlight. Business collaborations and legal matters require attention. Balancing self with others is the lesson.',
  8: 'Transformation, hidden matters, and deep change mark this year. Research, occult interests, and inheritance may surface. Challenges here lead to profound growth and renewal.',
  9: 'Fortune, higher learning, and dharma expand your horizons. Long journeys, philosophical growth, and connection with teachers or father bring blessings. A deeply auspicious activation.',
  10: 'Career, public reputation, and achievement define the year. Professional ambitions reach a peak. Government, authority, and social status are in play. Actions now have lasting consequences.',
  11: 'Gains, fulfilled desires, and social networks flourish. Long-held aspirations find fulfillment. Friends, elder siblings, and influential connections support your goals.',
  12: 'Expenses, spiritual growth, and letting go characterize this period. Foreign connections, isolation, or retreat may feature. This is a year for inner work and releasing attachments.',
};

// What each planet brings when it occupies or lords an activated house
const PLANET_THEMES: Record<number, string> = {
  0: 'brings authority, recognition, and vitality — expect leadership opportunities and matters of self-esteem to surface.',
  1: 'brings emotional sensitivity, public connection, and nurturing energy — intuition guides decisions and relationships deepen.',
  2: 'brings energy, courage, and assertiveness — initiative pays off but impulsive actions need checking.',
  3: 'brings intellect, communication skills, and adaptability — learning, trade, and analytical thinking are favored.',
  4: 'brings wisdom, expansion, and good fortune — growth through ethics, education, and spiritual pursuits.',
  5: 'brings harmony, refinement, and material comfort — relationships, creativity, and aesthetic pleasures are enhanced.',
  6: 'brings discipline, endurance, and karmic lessons — patience is required but lasting structures are built.',
  7: 'brings intensity, sudden changes, and unconventional paths — desires amplify and unexpected opportunities arise.',
  8: 'brings detachment, spiritual insight, and liberation themes — past karmic patterns may surface for resolution.',
};

const HOUSE_THEMES_SHORT: Record<number, string> = {
  1: 'Self, personality, new beginnings',
  2: 'Wealth, family, speech',
  3: 'Courage, siblings, short journeys',
  4: 'Home, mother, comfort, vehicles',
  5: 'Children, intelligence, creativity',
  6: 'Health, enemies, service',
  7: 'Marriage, partnerships, business',
  8: 'Transformation, longevity, hidden matters',
  9: 'Fortune, dharma, higher learning',
  10: 'Career, status, public life',
  11: 'Gains, social circle, aspirations',
  12: 'Expenses, moksha, foreign lands',
};

// Focus area labels per house
const HOUSE_FOCUS: Record<number, string> = {
  1: 'Personal health and self-improvement',
  2: 'Financial planning and family relationships',
  3: 'Communication skills and new initiatives',
  4: 'Home environment and emotional well-being',
  5: 'Creative projects and children/education',
  6: 'Health routines and overcoming challenges',
  7: 'Partnerships and collaborative ventures',
  8: 'Inner transformation and financial restructuring',
  9: 'Higher education and spiritual growth',
  10: 'Career advancement and public visibility',
  11: 'Networking and fulfilling aspirations',
  12: 'Spiritual practice and introspection',
};

// ─── Builder Functions ──────────────────────────────────────────────────────

export function buildDetailedRingAnalysis(
  referenceLabel: string,
  referenceSign: number,
  activatedHouse: number,
  planets: PlanetPosition[],
): DetailedRingAnalysis {
  const signId = ((referenceSign - 1 + (activatedHouse - 1)) % 12) + 1;
  const rashi = RASHIS[signId - 1];
  const lordPlanetId = SIGN_LORD[signId];
  const lordGraha = GRAHAS[lordPlanetId];
  const lordPlanetName = lordGraha?.name?.en ?? 'Unknown';

  // Find which house the lord planet occupies from this reference
  const lordPosition = planets.find(p => p.planet.id === lordPlanetId);
  const lordSign = lordPosition?.sign ?? signId;
  const lordHouse = ((lordSign - referenceSign + 12) % 12) + 1;

  // Lord analysis
  const lordTheme = HOUSE_THEMES_SHORT[lordHouse] ?? '';
  const lordAnalysis = `${lordPlanetName} ${PLANET_THEMES[lordPlanetId] ?? ''} ` +
    `Placed in the ${ordinal(lordHouse)} house (${lordTheme}), ` +
    `it channels this year's ${HOUSE_THEMES_SHORT[activatedHouse]?.toLowerCase() ?? ''} ` +
    `themes through ${lordTheme.toLowerCase()}.`;

  // Planets occupying the activated sign
  const planetsInSign = planets.filter(p => p.sign === signId);
  const planetsPresent = planetsInSign.map(p => {
    const key = PLANET_KEYS[p.planet.id] ?? '';
    const brief = PLANET_IN_HOUSE[key]?.[activatedHouse] ?? '';
    // Take first sentence only for brevity
    const firstSentence = brief.split('. ')[0] + '.';
    return {
      id: p.planet.id,
      name: tl(p.planet.name, 'en'),
      brief: firstSentence,
    };
  });

  // Compose a sign-specific detailed theme so rings with the same house
  // number but different signs produce DIFFERENT text (not "Gains..." 3×).
  const signElement = tl(rashi.element, 'en');
  const signQuality = tl(rashi.quality, 'en');
  const signNameEn = tl(rashi.name, 'en');
  const baseTheme = HOUSE_DESC[activatedHouse] ?? '';
  const signSpecific = `Through ${signNameEn} (${signElement}, ${signQuality}), ` +
    `this activation is colored by ${lordPlanetName}'s influence — ` +
    `${PLANET_THEMES[lordPlanetId] ?? ''}` +
    (planetsPresent.length > 0
      ? ` Planets present in this sign (${planetsPresent.map(p => p.name).join(', ')}) add their own flavor to the year's themes.`
      : '');

  return {
    house: activatedHouse,
    signId,
    signName: rashi.name,
    theme: HOUSE_THEMES_SHORT[activatedHouse] ?? 'Mixed influences',
    detailedTheme: baseTheme + ' ' + signSpecific,
    lordPlanetId,
    lordPlanetName,
    lordHouse,
    lordAnalysis,
    planetsPresent,
  };
}

export function buildConvergenceNote(
  lagna: DetailedRingAnalysis,
  chandra: DetailedRingAnalysis,
  surya: DetailedRingAnalysis,
): string {
  const houses = [lagna.house, chandra.house, surya.house];
  const parts: string[] = [];

  // Check for same house number
  if (lagna.house === chandra.house && chandra.house === surya.house) {
    parts.push(
      `All three references — Lagna, Chandra, and Surya — activate the ${ordinal(lagna.house)} house simultaneously. ` +
      `This rare triple convergence creates an exceptionally powerful focus on ${HOUSE_THEMES_SHORT[lagna.house]?.toLowerCase() ?? 'this life area'}. ` +
      `Events in this domain will be unmistakably prominent this year.`
    );
  } else if (lagna.house === chandra.house) {
    parts.push(`Lagna and Chandra both activate the ${ordinal(lagna.house)} house, creating a strong convergence on ${HOUSE_THEMES_SHORT[lagna.house]?.toLowerCase() ?? 'this area'}. Your actions and emotions align around these themes.`);
  } else if (lagna.house === surya.house) {
    parts.push(`Lagna and Surya both activate the ${ordinal(lagna.house)} house, linking your personal trajectory with your professional identity around ${HOUSE_THEMES_SHORT[lagna.house]?.toLowerCase() ?? 'this area'}.`);
  } else if (chandra.house === surya.house) {
    parts.push(`Chandra and Surya both activate the ${ordinal(chandra.house)} house, uniting emotional needs with core identity themes around ${HOUSE_THEMES_SHORT[chandra.house]?.toLowerCase() ?? 'this area'}.`);
  }

  // Kendra/Trikona/Dusthana classification
  const kendraCoverage = houses.filter(h => [1, 4, 7, 10].includes(h)).length;
  const trikonaCoverage = houses.filter(h => [1, 5, 9].includes(h)).length;
  const dusthanaCoverage = houses.filter(h => [6, 8, 12].includes(h)).length;
  const upachayaCoverage = houses.filter(h => [3, 6, 10, 11].includes(h)).length;

  if (kendraCoverage >= 2) {
    parts.push('Strong kendra (angular house) activation indicates a year of stability, achievement, and tangible results in the material world.');
  }
  if (trikonaCoverage >= 2) {
    parts.push('Multiple trikona (trinal house) activation signals auspicious developments — fortune, dharma, and creative expression are divinely supported.');
  }
  if (dusthanaCoverage >= 2) {
    parts.push('Multiple dusthana (6/8/12) activation suggests a period of inner transformation. Challenges may arise, but they serve as catalysts for growth and spiritual development.');
  }
  if (upachayaCoverage >= 2 && dusthanaCoverage < 2) {
    parts.push('Upachaya (growth house) activation means conditions improve progressively through effort. Results build momentum as the year progresses.');
  }

  return parts.join(' ') || 'The three references activate different life areas, creating a balanced spread of focus across multiple domains this year.';
}

export function buildYearDelta(
  currentAge: number,
  currentLagna: DetailedRingAnalysis,
  currentChandra: DetailedRingAnalysis,
  currentSurya: DetailedRingAnalysis,
): string {
  if (currentAge <= 1) return '';
  const prevLagnaHouse = ((currentLagna.house - 2 + 12) % 12) + 1;
  const prevChandraHouse = ((currentChandra.house - 2 + 12) % 12) + 1;
  const prevSuryaHouse = ((currentSurya.house - 2 + 12) % 12) + 1;

  const parts: string[] = [];
  parts.push(`Last year (age ${currentAge - 1}), the Lagna ring activated the ${ordinal(prevLagnaHouse)} house (${HOUSE_THEMES_SHORT[prevLagnaHouse]?.toLowerCase() ?? ''}).`);
  parts.push(`This year's shift to the ${ordinal(currentLagna.house)} house marks a natural progression from ${HOUSE_THEMES_SHORT[prevLagnaHouse]?.toLowerCase() ?? ''} to ${HOUSE_THEMES_SHORT[currentLagna.house]?.toLowerCase() ?? ''}.`);

  if (prevChandraHouse !== prevLagnaHouse || currentChandra.house !== currentLagna.house) {
    parts.push(`The emotional landscape (Chandra) moves from the ${ordinal(prevChandraHouse)} to the ${ordinal(currentChandra.house)} house — ${HOUSE_THEMES_SHORT[currentChandra.house]?.toLowerCase() ?? ''} now shapes your emotional world.`);
  }

  return parts.join(' ');
}

export function deriveFocusAreas(
  lagna: DetailedRingAnalysis,
  chandra: DetailedRingAnalysis,
  surya: DetailedRingAnalysis,
): string[] {
  // Collect unique focus areas from activated houses, capped at 4
  const seen = new Set<string>();
  const areas: string[] = [];
  for (const ring of [lagna, chandra, surya]) {
    const focus = HOUSE_FOCUS[ring.house];
    if (focus && !seen.has(focus)) {
      seen.add(focus);
      areas.push(focus);
    }
  }

  // Add lord-related focus if the lord is in a different house
  for (const ring of [lagna]) {
    if (ring.lordHouse !== ring.house) {
      const lordFocus = HOUSE_FOCUS[ring.lordHouse];
      if (lordFocus && !seen.has(lordFocus) && areas.length < 4) {
        seen.add(lordFocus);
        areas.push(lordFocus);
      }
    }
  }

  return areas.slice(0, 4);
}

export function buildEnhancedCombined(
  lagna: DetailedRingAnalysis,
  chandra: DetailedRingAnalysis,
  surya: DetailedRingAnalysis,
  age: number,
): string {
  const parts: string[] = [];
  parts.push(`At age ${age}, from Lagna: ${ordinal(lagna.house)} house (${lagna.theme}) in ${tl(lagna.signName, 'en')}, ruled by ${lagna.lordPlanetName}.`);
  parts.push(`From Chandra: ${ordinal(chandra.house)} house (${chandra.theme}) in ${tl(chandra.signName, 'en')}, ruled by ${chandra.lordPlanetName}.`);
  parts.push(`From Surya: ${ordinal(surya.house)} house (${surya.theme}) in ${tl(surya.signName, 'en')}, ruled by ${surya.lordPlanetName}.`);
  return parts.join(' ');
}

// ─── Monthly sub-periods (BPHS Ch.22) ──────────────────────────────────────
// Each annual period divides into 12 sub-months starting from the activated sign.
// Month 1 = activated sign, Month 2 = next sign, etc.

export function buildMonthlySubPeriods(
  lagnaAnalysis: DetailedRingAnalysis,
): MonthlySubPeriod[] {
  const periods: MonthlySubPeriod[] = [];
  for (let m = 0; m < 12; m++) {
    const signId = ((lagnaAnalysis.signId - 1 + m) % 12) + 1;
    const rashi = RASHIS[signId - 1];
    const lordId = SIGN_LORD[signId];
    const lordGraha = GRAHAS[lordId];
    periods.push({
      month: m + 1,
      signId,
      signName: rashi.name,
      lordPlanetId: lordId,
      lordPlanetName: lordGraha?.name?.en ?? 'Unknown',
      theme: HOUSE_THEMES_SHORT[((m) % 12) + 1] ?? '',
    });
  }
  return periods;
}

// ─── Vimshottari Dasha overlay ─────────────────────────────────────────────
// Cross-references the running Mahadasha/Antardasha with the Sudarshana year.

import type { DashaEntry } from '@/types/kundali';

export function buildDashaContext(
  dashas: DashaEntry[],
  birthYear: number,
  age: number,
): DashaContext | null {
  if (!dashas || dashas.length === 0) return null;

  const targetYear = birthYear + age;
  const targetDate = `${targetYear}-06-15`; // mid-year approximation

  // Find active Mahadasha
  const maha = dashas.find(d =>
    d.level === 'maha' && d.startDate <= targetDate && d.endDate >= targetDate
  );
  if (!maha) return null;

  // Find active Antardasha within the Mahadasha
  const antar = maha.subPeriods?.find(d =>
    d.startDate <= targetDate && d.endDate >= targetDate
  );

  const mahaName = maha.planet;
  const antarName = antar?.planet ?? '';

  // Compose how the dasha colors the Sudarshana year
  const DASHA_INFLUENCE: Record<string, string> = {
    Sun: 'Authority, government, father, and self-identity dominate the karmic backdrop.',
    Moon: 'Emotions, mother, public life, and mental well-being shape the underlying current.',
    Mars: 'Energy, courage, property, and sibling matters provide the karmic drive.',
    Mercury: 'Intellect, communication, trade, and learning form the operating framework.',
    Jupiter: 'Wisdom, expansion, children, and dharma create a supportive foundation.',
    Venus: 'Relationships, luxury, creativity, and material comforts color the period.',
    Saturn: 'Discipline, karma, delays, and endurance define the underlying lessons.',
    Rahu: 'Ambition, unconventional paths, foreign connections, and sudden changes intensify.',
    Ketu: 'Spirituality, detachment, past karma, and liberation themes arise.',
  };

  const dashaInfluence = antarName
    ? `${mahaName}-${antarName} dasha is running. ${DASHA_INFLUENCE[mahaName] ?? ''} The ${antarName} sub-period adds its own layer — this combination makes age ${age} uniquely different from the same house activation in other 12-year cycles.`
    : `${mahaName} Mahadasha is running. ${DASHA_INFLUENCE[mahaName] ?? ''}`;

  return { mahadasha: mahaName, antardasha: antarName, dashaInfluence };
}

// ─── Cycle + age context ───────────────────────────────────────────────────
// Tracks which 12-year cycle and life stage, so the same house reads
// differently at age 5 vs 29 vs 53.

const LIFE_STAGES: { maxAge: number; stage: string; theme: string }[] = [
  { maxAge: 12, stage: 'Foundation', theme: 'Patterns are being set. Family, environment, and early conditioning shape the personality. Results are experienced through parents and guardians.' },
  { maxAge: 24, stage: 'Growth', theme: 'Identity formation, education, and first independent choices. Ambitions crystallize. Peer relationships and learning define this cycle.' },
  { maxAge: 36, stage: 'Establishment', theme: 'Career building, partnerships, and family creation. The seeds planted now determine the harvest of later cycles. Effort yields proportional results.' },
  { maxAge: 48, stage: 'Maturation', theme: 'Deepening expertise, leadership, and consolidation of gains. Past karmic patterns become visible. Course corrections carry high impact.' },
  { maxAge: 60, stage: 'Harvest', theme: 'Reaping the results of earlier efforts. Social influence peaks. Mentorship roles emerge. Health and legacy planning become important.' },
  { maxAge: 72, stage: 'Wisdom', theme: 'Reflection, teaching, and gradual withdrawal from active striving. Spiritual dimensions of life gain prominence. Giving back to community.' },
  { maxAge: 120, stage: 'Liberation', theme: 'Focus shifts to moksha, inner peace, and legacy. Material attachments naturally loosen. Spiritual practices yield profound results.' },
];

export function buildCycleContext(age: number): CycleContext {
  const cycleNumber = Math.floor(age / 12) + 1;
  const stage = LIFE_STAGES.find(s => age <= s.maxAge) ?? LIFE_STAGES[LIFE_STAGES.length - 1];
  return {
    cycleNumber,
    lifeStage: stage.stage,
    cycleTheme: `Cycle ${cycleNumber} (${stage.stage}): ${stage.theme}`,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
