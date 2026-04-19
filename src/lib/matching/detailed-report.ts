/**
 * Detailed Compatibility Report Engine
 *
 * Extends the 36-point Ashta Kuta matching with:
 *  - Manglik (Kuja Dosha) analysis with severity & cancellations
 *  - Nadi Dosha deep analysis with cancellations
 *  - Cross-chart planetary aspects
 *  - 7th house (marriage house) analysis
 *  - Venus (love/romance planet) analysis
 *  - Rules-based narrative summary (no LLM)
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { MatchResult } from './ashta-kuta';

// ── Types ────────────────────────────────────────────────────

export interface DetailedMatchReport {
  ashtaKuta: MatchResult;

  manglikAnalysis: {
    chart1HasManglik: boolean;
    chart2HasManglik: boolean;
    chart1Severity: 'none' | 'mild' | 'moderate' | 'severe';
    chart2Severity: 'none' | 'mild' | 'moderate' | 'severe';
    cancellations: string[];
    summary: string;
  };

  nadiAnalysis: {
    chart1Nadi: 'aadi' | 'madhya' | 'antya';
    chart2Nadi: 'aadi' | 'madhya' | 'antya';
    doshaPresent: boolean;
    cancellations: string[];
    healthImplications: string;
  };

  crossChartAspects: CrossChartAspect[];

  seventhHouseAnalysis: {
    chart1: SeventhHouseInfo;
    chart2: SeventhHouseInfo;
    compatibility: string;
  };

  venusAnalysis: {
    chart1VenusSign: number;
    chart2VenusSign: number;
    chart1VenusHouse: number;
    chart2VenusHouse: number;
    compatibility: string;
  };

  narrativeSummary: {
    strengths: string[];
    challenges: string[];
    advice: string[];
    overallNarrative: string;
  };
}

export interface CrossChartAspect {
  planet1: { id: number; name: string; chart: 'chart1' | 'chart2' };
  planet2: { id: number; name: string; chart: 'chart1' | 'chart2' };
  aspectType: 'conjunction' | 'opposition' | 'trine' | 'square';
  interpretation: string;
}

export interface SeventhHouseInfo {
  sign: number;
  lord: number;
  lordHouse: number;
  planetsIn7th: number[];
  interpretation: string;
}

// ── Constants ────────────────────────────────────────────────

const PLANET_NAMES: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

// Rashi lord mapping (planet id for each rashi 1-12)
// 0=Sun,1=Moon,2=Mars,3=Mercury,4=Jupiter,5=Venus,6=Saturn
const RASHI_LORD: number[] = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4];

// Manglik houses (from Lagna): 1, 2, 4, 7, 8, 12
const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];

// Mars sign data for own/exalted checks
// Mars owns Aries (1) and Scorpio (8); exalted in Capricorn (10)
const MARS_OWN_SIGNS = [1, 8];
const MARS_EXALTED_SIGN = 10;

// Nadi pattern: traditional zigzag assignment
// The ashta-kuta.ts already has NAKSHATRA_NADI with the zigzag pattern.
// We re-derive using the cyclic pattern from the spec, but actually the
// traditional nadi mapping is the zigzag pattern, not simple modulo.
// Re-use the same mapping as ashta-kuta.ts for consistency.
const NAKSHATRA_NADI: number[] = [
  0, 1, 2, // Ashwini=Aadi, Bharani=Madhya, Krittika=Antya
  2, 1, 0, // Rohini=Antya, Mrigashira=Madhya, Ardra=Aadi
  0, 1, 2, // Punarvasu=Aadi, Pushya=Madhya, Ashlesha=Antya
  2, 1, 0, // Magha=Antya, P.Phalguni=Madhya, U.Phalguni=Aadi
  0, 1, 2, // Hasta=Aadi, Chitra=Madhya, Swati=Antya
  2, 1, 0, // Vishakha=Antya, Anuradha=Madhya, Jyeshtha=Aadi
  0, 1, 2, // Mula=Aadi, P.Ashadha=Madhya, U.Ashadha=Antya
  2, 1, 0, // Shravana=Antya, Dhanishtha=Madhya, Shatabhisha=Aadi
  0, 1, 2, // P.Bhadrapada=Aadi, U.Bhadrapada=Madhya, Revati=Antya
];

const NADI_NAMES: Record<number, 'aadi' | 'madhya' | 'antya'> = {
  0: 'aadi', 1: 'madhya', 2: 'antya',
};

// ── Helpers ──────────────────────────────────────────────────

function getPlanet(chart: KundaliData, planetId: number): PlanetPosition | undefined {
  return chart.planets.find(p => p.planet.id === planetId);
}

function getLongitude(chart: KundaliData, planetId: number): number {
  const p = getPlanet(chart, planetId);
  return p ? p.longitude : 0;
}

/**
 * Compute angular difference between two longitudes (0-360),
 * returning the shortest arc (0-180).
 */
function angularDiff(lon1: number, lon2: number): number {
  const diff = Math.abs(lon1 - lon2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function getHouseOfPlanet(chart: KundaliData, planetId: number): number {
  const p = getPlanet(chart, planetId);
  return p ? p.house : 0;
}

function getSignOfPlanet(chart: KundaliData, planetId: number): number {
  const p = getPlanet(chart, planetId);
  return p ? p.sign : 0;
}

function getPlanetsInHouse(chart: KundaliData, house: number): number[] {
  return chart.planets
    .filter(p => p.house === house && p.planet.id <= 8)
    .map(p => p.planet.id);
}

function get7thSign(ascSign: number): number {
  return ((ascSign - 1 + 6) % 12) + 1;
}

// ── Manglik Analysis ─────────────────────────────────────────

export type ManglikSeverity = 'none' | 'mild' | 'moderate' | 'severe';

function getManglikSeverity(marsHouse: number): ManglikSeverity {
  if (marsHouse === 7 || marsHouse === 8) return 'severe';
  if (marsHouse === 4 || marsHouse === 12) return 'moderate';
  if (marsHouse === 1 || marsHouse === 2) return 'mild';
  return 'none';
}

function analyzeManglik(chart: KundaliData): {
  hasManglik: boolean;
  severity: ManglikSeverity;
  marsHouse: number;
  marsSign: number;
} {
  const marsHouse = getHouseOfPlanet(chart, 2); // Mars = planet id 2
  const marsSign = getSignOfPlanet(chart, 2);
  const isManglik = MANGLIK_HOUSES.includes(marsHouse);
  const severity = isManglik ? getManglikSeverity(marsHouse) : 'none';
  return { hasManglik: isManglik, severity, marsHouse, marsSign };
}

function getManglikCancellations(
  chart1: KundaliData,
  chart2: KundaliData,
  m1: ReturnType<typeof analyzeManglik>,
  m2: ReturnType<typeof analyzeManglik>,
): string[] {
  const cancellations: string[] = [];

  // Mutual cancellation: both charts have Manglik
  if (m1.hasManglik && m2.hasManglik) {
    cancellations.push('Both partners have Manglik dosha — mutual cancellation applies.');
  }

  // Jupiter aspect on Mars (Jupiter aspects houses 5, 7, 9 from its position)
  // Check if Jupiter aspects Mars in either chart
  for (const [chart, m, label] of [
    [chart1, m1, 'Partner 1'] as const,
    [chart2, m2, 'Partner 2'] as const,
  ]) {
    if (!m.hasManglik) continue;
    const jupHouse = getHouseOfPlanet(chart, 4); // Jupiter = 4
    const marsHouse = m.marsHouse;
    // Jupiter's special aspects: 5th, 7th, 9th from its position
    const jupAspects = [
      jupHouse,
      ((jupHouse - 1 + 4) % 12) + 1, // 5th
      ((jupHouse - 1 + 6) % 12) + 1, // 7th
      ((jupHouse - 1 + 8) % 12) + 1, // 9th
    ];
    if (jupAspects.includes(marsHouse)) {
      cancellations.push(`${label}: Jupiter aspects Mars — reduces Manglik severity.`);
    }

    // Mars in own sign or exalted
    if (MARS_OWN_SIGNS.includes(m.marsSign)) {
      cancellations.push(`${label}: Mars is in its own sign — Manglik effect reduced.`);
    }
    if (m.marsSign === MARS_EXALTED_SIGN) {
      cancellations.push(`${label}: Mars is exalted in Capricorn — Manglik effect reduced.`);
    }

    // Venus in 7th house
    const venusHouse = getHouseOfPlanet(chart, 5);
    if (venusHouse === 7) {
      cancellations.push(`${label}: Venus in 7th house — mitigates Manglik dosha.`);
    }
  }

  return cancellations;
}

// ── Nadi Analysis ────────────────────────────────────────────

function getNadiFromNakshatra(nakshatraId: number): 'aadi' | 'madhya' | 'antya' {
  const idx = NAKSHATRA_NADI[nakshatraId - 1];
  return NADI_NAMES[idx] ?? 'aadi';
}

function analyzeNadi(chart1: KundaliData, chart2: KundaliData): DetailedMatchReport['nadiAnalysis'] {
  const moon1 = getPlanet(chart1, 1); // Moon = 1
  const moon2 = getPlanet(chart2, 1);
  const nak1 = moon1?.nakshatra?.id ?? 1;
  const nak2 = moon2?.nakshatra?.id ?? 1;

  const nadi1 = getNadiFromNakshatra(nak1);
  const nadi2 = getNadiFromNakshatra(nak2);
  const doshaPresent = nadi1 === nadi2;

  const cancellations: string[] = [];
  if (doshaPresent) {
    // Cancellation 1: Different rashi lords
    const rashi1 = moon1?.sign ?? 1;
    const rashi2 = moon2?.sign ?? 1;
    const lord1 = RASHI_LORD[rashi1 - 1];
    const lord2 = RASHI_LORD[rashi2 - 1];
    if (lord1 !== lord2) {
      cancellations.push('Moon signs have different lords — Nadi Dosha is partially cancelled.');
    }

    // Cancellation 2: Same nakshatra but different padas
    if (nak1 === nak2) {
      const pada1 = moon1?.pada ?? 1;
      const pada2 = moon2?.pada ?? 1;
      if (pada1 !== pada2) {
        cancellations.push('Same nakshatra but different padas — Nadi Dosha mitigated.');
      }
    }
  }

  const healthImplications = doshaPresent && cancellations.length === 0
    ? 'Nadi Dosha present without cancellations — traditional texts caution about health compatibility and progeny. Consult an experienced jyotishi for remedial measures.'
    : doshaPresent
      ? 'Nadi Dosha present but with mitigating factors. The severity is reduced by the cancellations noted.'
      : 'No Nadi Dosha — health and progeny compatibility is favorable.';

  return { chart1Nadi: nadi1, chart2Nadi: nadi2, doshaPresent, cancellations, healthImplications };
}

// ── Cross-Chart Aspects ──────────────────────────────────────

interface AspectCheck {
  planet1Id: number;
  planet1Chart: 'chart1' | 'chart2';
  planet2Id: number;
  planet2Chart: 'chart1' | 'chart2';
  interpretation: Record<string, string>; // aspectType -> interpretation
}

const ASPECT_CHECKS: AspectCheck[] = [
  // Chart1 Venus ↔ Chart2 Moon (emotional compatibility)
  {
    planet1Id: 5, planet1Chart: 'chart1',
    planet2Id: 1, planet2Chart: 'chart2',
    interpretation: {
      conjunction: 'Venus-Moon conjunction across charts indicates strong emotional and romantic harmony. Deep mutual affection is likely.',
      opposition: 'Venus-Moon opposition creates magnetic attraction but emotional tension. Compromise and patience needed in emotional expression.',
      trine: 'Venus-Moon trine across charts is highly favorable for emotional bonding. Natural empathy and romantic understanding.',
      square: 'Venus-Moon square suggests emotional friction. Different love languages may require conscious effort to bridge.',
    },
  },
  // Chart1 Sun ↔ Chart2 Moon (ego vs emotions)
  {
    planet1Id: 0, planet1Chart: 'chart1',
    planet2Id: 1, planet2Chart: 'chart2',
    interpretation: {
      conjunction: 'Sun-Moon conjunction across charts creates a powerful bond. Identity and emotions align naturally.',
      opposition: 'Sun-Moon opposition generates complementary energy — attraction of opposites. Balance ego and sensitivity.',
      trine: 'Sun-Moon trine fosters mutual respect and emotional warmth. Leadership and nurturing complement each other.',
      square: 'Sun-Moon square can create ego clashes with emotional needs. Mindful communication is essential.',
    },
  },
  // Chart2 Venus ↔ Chart1 Moon (reverse emotional compat)
  {
    planet1Id: 5, planet1Chart: 'chart2',
    planet2Id: 1, planet2Chart: 'chart1',
    interpretation: {
      conjunction: 'Venus-Moon conjunction across charts indicates deep romantic resonance and emotional understanding.',
      opposition: 'Venus-Moon opposition suggests attraction with emotional polarity. Both partners feel drawn yet challenged.',
      trine: 'Venus-Moon trine is one of the most favorable aspects for lasting love and emotional compatibility.',
      square: 'Venus-Moon square indicates differing emotional needs and aesthetic preferences. Growth comes through understanding.',
    },
  },
  // Chart1 Saturn ↔ Chart2 Moon (restriction vs feelings)
  {
    planet1Id: 6, planet1Chart: 'chart1',
    planet2Id: 1, planet2Chart: 'chart2',
    interpretation: {
      conjunction: 'Saturn-Moon conjunction can bring stability but also emotional heaviness. The Saturn partner may seem cold or restrictive.',
      opposition: 'Saturn-Moon opposition creates a duty-vs-feeling dynamic. Commitment is strong but emotional warmth may be lacking.',
      trine: 'Saturn-Moon trine brings emotional maturity and enduring support. A stabilizing and grounding influence.',
      square: 'Saturn-Moon square is challenging — emotional suppression and feelings of being criticized. Needs conscious awareness.',
    },
  },
  // Chart2 Saturn ↔ Chart1 Moon
  {
    planet1Id: 6, planet1Chart: 'chart2',
    planet2Id: 1, planet2Chart: 'chart1',
    interpretation: {
      conjunction: 'Saturn-Moon conjunction may create emotional restraint in the relationship. Structure can help but warmth is needed.',
      opposition: 'Saturn-Moon opposition across charts tests emotional resilience. Duty and feelings must find balance.',
      trine: 'Saturn-Moon trine provides a stable emotional foundation. Mature love that deepens with time.',
      square: 'Saturn-Moon square indicates potential emotional friction. One partner may feel controlled or emotionally limited.',
    },
  },
  // Chart1 Mars ↔ Chart2 Venus (passion)
  {
    planet1Id: 2, planet1Chart: 'chart1',
    planet2Id: 5, planet2Chart: 'chart2',
    interpretation: {
      conjunction: 'Mars-Venus conjunction across charts is a classic indicator of strong physical attraction and passionate connection.',
      opposition: 'Mars-Venus opposition generates intense attraction. Desire runs high but may need balancing with tenderness.',
      trine: 'Mars-Venus trine is excellent for physical and romantic compatibility. Mutual desire flows naturally.',
      square: 'Mars-Venus square creates passionate but turbulent attraction. Arguments may arise from differing desires.',
    },
  },
  // Chart2 Mars ↔ Chart1 Venus (reverse passion)
  {
    planet1Id: 2, planet1Chart: 'chart2',
    planet2Id: 5, planet2Chart: 'chart1',
    interpretation: {
      conjunction: 'Mars-Venus conjunction from the second chart confirms mutual physical and romantic magnetism.',
      opposition: 'Mars-Venus opposition indicates intense attraction with the potential for power dynamics in intimacy.',
      trine: 'Mars-Venus trine fosters a harmonious blend of passion and romance between partners.',
      square: 'Mars-Venus square suggests passionate tension. The energy is strong but needs channeling constructively.',
    },
  },
];

function detectAspect(lon1: number, lon2: number): 'conjunction' | 'opposition' | 'trine' | 'square' | null {
  const diff = angularDiff(lon1, lon2);
  if (diff <= 10) return 'conjunction';
  if (Math.abs(diff - 180) <= 10) return 'opposition';
  if (Math.abs(diff - 120) <= 8) return 'trine';
  if (Math.abs(diff - 90) <= 8) return 'square';
  return null;
}

function analyzeCrossChartAspects(chart1: KundaliData, chart2: KundaliData): CrossChartAspect[] {
  const aspects: CrossChartAspect[] = [];
  const charts = { chart1, chart2 };

  for (const check of ASPECT_CHECKS) {
    const c1 = charts[check.planet1Chart];
    const c2 = charts[check.planet2Chart];
    const lon1 = getLongitude(c1, check.planet1Id);
    const lon2 = getLongitude(c2, check.planet2Id);

    const aspectType = detectAspect(lon1, lon2);
    if (!aspectType) continue;

    const interp = check.interpretation[aspectType] ?? '';
    aspects.push({
      planet1: { id: check.planet1Id, name: PLANET_NAMES[check.planet1Id] ?? '', chart: check.planet1Chart },
      planet2: { id: check.planet2Id, name: PLANET_NAMES[check.planet2Id] ?? '', chart: check.planet2Chart },
      aspectType,
      interpretation: interp,
    });
  }

  return aspects;
}

// ── 7th House Analysis ───────────────────────────────────────

function analyze7thHouse(chart: KundaliData, label: string): SeventhHouseInfo {
  const ascSign = chart.ascendant.sign;
  const sign7 = get7thSign(ascSign);
  const lord = RASHI_LORD[sign7 - 1];
  const lordHouse = getHouseOfPlanet(chart, lord);
  const planetsIn7th = getPlanetsInHouse(chart, 7);

  // Generate interpretation
  const parts: string[] = [];
  parts.push(`${label}'s 7th house is ${getSignName(sign7)}, ruled by ${PLANET_NAMES[lord] ?? 'Unknown'}.`);

  if (lordHouse === 1) parts.push('The 7th lord in the 1st house indicates a partner-focused personality.');
  else if (lordHouse === 7) parts.push('The 7th lord in its own house strengthens marriage prospects.');
  else if (lordHouse === 4 || lordHouse === 10) parts.push(`The 7th lord in house ${lordHouse} is well-placed for domestic harmony.`);
  else if (lordHouse === 6 || lordHouse === 8 || lordHouse === 12) parts.push(`The 7th lord in house ${lordHouse} (dusthana) may indicate challenges in partnership.`);

  if (planetsIn7th.length === 0) {
    parts.push('No planets in the 7th house — the lord\'s placement becomes more significant.');
  } else {
    const names = planetsIn7th.map(id => PLANET_NAMES[id] ?? '').filter(Boolean);
    parts.push(`Planets in 7th: ${names.join(', ')}.`);
    if (planetsIn7th.includes(5)) parts.push('Venus in 7th favors a loving and harmonious marriage.');
    if (planetsIn7th.includes(4)) parts.push('Jupiter in 7th blesses the marriage with wisdom and growth.');
    if (planetsIn7th.includes(6)) parts.push('Saturn in 7th may delay marriage but brings long-term stability.');
    if (planetsIn7th.includes(2)) parts.push('Mars in 7th indicates passion but also potential conflict (Manglik).');
    if (planetsIn7th.includes(7)) parts.push('Rahu in 7th may bring unconventional partnerships.');
    if (planetsIn7th.includes(8)) parts.push('Ketu in 7th may indicate detachment or spiritual approach to marriage.');
  }

  return { sign: sign7, lord, lordHouse, planetsIn7th, interpretation: parts.join(' ') };
}

function getSignName(sign: number): string {
  const names = ['', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return names[sign] ?? '';
}

function get7thHouseCompatibility(h1: SeventhHouseInfo, h2: SeventhHouseInfo): string {
  const parts: string[] = [];

  // Check if 7th lords are friends
  const GRAHA_MAITRI: Record<number, Set<number>> = {
    0: new Set([1, 2, 4]), // Sun friends
    1: new Set([0, 3]),     // Moon friends
    2: new Set([0, 1, 4]),  // Mars friends
    3: new Set([0, 5]),     // Mercury friends
    4: new Set([0, 1, 2]),  // Jupiter friends
    5: new Set([3, 6]),     // Venus friends
    6: new Set([3, 5]),     // Saturn friends
  };

  const l1 = h1.lord;
  const l2 = h2.lord;
  if (l1 === l2) {
    parts.push('Both 7th houses share the same lord — a unifying factor for marriage compatibility.');
  } else if (GRAHA_MAITRI[l1]?.has(l2)) {
    parts.push('The 7th house lords are mutual friends — supportive for partnership harmony.');
  } else {
    parts.push('The 7th house lords are neutral or unfriendly — extra effort needed to align partnership expectations.');
  }

  // Mutual planets
  if (h1.planetsIn7th.includes(5) && h2.planetsIn7th.includes(5)) {
    parts.push('Both charts have Venus in the 7th house — strong romantic and aesthetic compatibility.');
  }
  if (h1.planetsIn7th.includes(4) || h2.planetsIn7th.includes(4)) {
    parts.push('Jupiter\'s presence in a 7th house brings blessings and wisdom to the partnership.');
  }

  return parts.join(' ') || 'Standard 7th house compatibility — consult the overall kuta score for the broader picture.';
}

// ── Venus Analysis ───────────────────────────────────────────

function analyzeVenus(chart1: KundaliData, chart2: KundaliData): DetailedMatchReport['venusAnalysis'] {
  const v1Sign = getSignOfPlanet(chart1, 5);
  const v2Sign = getSignOfPlanet(chart2, 5);
  const v1House = getHouseOfPlanet(chart1, 5);
  const v2House = getHouseOfPlanet(chart2, 5);

  const parts: string[] = [];

  // Same sign
  if (v1Sign === v2Sign) {
    parts.push(`Both Venus placements in ${getSignName(v1Sign)} — shared romantic values and aesthetic sensibilities.`);
  }

  // Compatible elements
  const elementOf = (s: number): string => {
    const elements = ['', 'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water'];
    return elements[s] ?? '';
  };
  const e1 = elementOf(v1Sign);
  const e2 = elementOf(v2Sign);
  if (e1 === e2 && v1Sign !== v2Sign) {
    parts.push(`Venus signs share the ${e1} element — natural compatibility in love expression.`);
  } else if ((e1 === 'fire' && e2 === 'air') || (e1 === 'air' && e2 === 'fire') ||
             (e1 === 'earth' && e2 === 'water') || (e1 === 'water' && e2 === 'earth')) {
    parts.push('Venus signs are in complementary elements — supportive romantic energy.');
  } else if (v1Sign !== v2Sign) {
    parts.push('Venus signs are in neutral or challenging elements — different love languages may need bridging.');
  }

  // House placements
  if (v1House === 7) parts.push('Partner 1\'s Venus in the 7th house strongly favors marriage.');
  if (v2House === 7) parts.push('Partner 2\'s Venus in the 7th house strongly favors marriage.');
  if (v1House === 5 || v2House === 5) parts.push('Venus in the 5th house (romance) bodes well for courtship and creativity together.');
  if (v1House === 12 || v2House === 12) parts.push('Venus in the 12th house indicates spiritual love and bedroom harmony.');

  // Venus combust or retrograde
  const v1p = getPlanet(chart1, 5);
  const v2p = getPlanet(chart2, 5);
  if (v1p?.isCombust) parts.push('Partner 1\'s Venus is combust — romantic expression may be subdued.');
  if (v2p?.isCombust) parts.push('Partner 2\'s Venus is combust — romantic expression may be subdued.');
  if (v1p?.isRetrograde) parts.push('Partner 1\'s retrograde Venus suggests past-life romantic patterns resurfacing.');
  if (v2p?.isRetrograde) parts.push('Partner 2\'s retrograde Venus suggests introspective love approach.');

  return {
    chart1VenusSign: v1Sign,
    chart2VenusSign: v2Sign,
    chart1VenusHouse: v1House,
    chart2VenusHouse: v2House,
    compatibility: parts.join(' ') || 'Venus analysis shows standard compatibility — refer to the Ashta Kuta Yoni and Graha Maitri scores for more detail.',
  };
}

// ── Narrative Summary ────────────────────────────────────────

function generateNarrative(
  ashtaKuta: MatchResult,
  manglik: DetailedMatchReport['manglikAnalysis'],
  nadi: DetailedMatchReport['nadiAnalysis'],
  aspects: CrossChartAspect[],
  seventh: DetailedMatchReport['seventhHouseAnalysis'],
  venus: DetailedMatchReport['venusAnalysis'],
): DetailedMatchReport['narrativeSummary'] {
  const strengths: string[] = [];
  const challenges: string[] = [];
  const advice: string[] = [];

  // From Ashta Kuta
  const pct = ashtaKuta.percentage;
  if (pct >= 75) {
    strengths.push(`Excellent Ashta Kuta score of ${ashtaKuta.totalScore}/36 (${pct}%) — strong foundational compatibility.`);
  } else if (pct >= 50) {
    strengths.push(`Solid Ashta Kuta score of ${ashtaKuta.totalScore}/36 (${pct}%) — good basic compatibility.`);
  } else {
    challenges.push(`Low Ashta Kuta score of ${ashtaKuta.totalScore}/36 (${pct}%) — foundational compatibility needs attention.`);
  }

  // High individual kutas
  for (const k of ashtaKuta.kutas) {
    const kutaPct = k.maxPoints > 0 ? k.scored / k.maxPoints : 0;
    if (kutaPct >= 0.75 && k.maxPoints >= 4) {
      strengths.push(`Strong ${k.name.en} kuta (${k.scored}/${k.maxPoints}) — ${k.description.en.toLowerCase()}.`);
    }
    if (kutaPct === 0 && k.maxPoints >= 4) {
      challenges.push(`Zero ${k.name.en} kuta — ${k.description.en.toLowerCase()} needs conscious effort.`);
    }
  }

  // Manglik
  if (!manglik.chart1HasManglik && !manglik.chart2HasManglik) {
    strengths.push('Neither partner has Manglik dosha — no Mars-related marriage obstacle.');
  } else if (manglik.cancellations.length > 0) {
    strengths.push('Manglik dosha present but has cancellation factors that reduce its impact.');
  } else if (manglik.chart1HasManglik || manglik.chart2HasManglik) {
    const severity = manglik.chart1HasManglik ? manglik.chart1Severity : manglik.chart2Severity;
    challenges.push(`Manglik dosha (${severity} severity) detected without cancellation — traditional remedies recommended.`);
  }

  // Nadi
  if (!nadi.doshaPresent) {
    strengths.push('No Nadi Dosha — health and progeny compatibility is favorable.');
  } else if (nadi.cancellations.length > 0) {
    strengths.push('Nadi Dosha present but mitigated by cancellation factors.');
  } else {
    challenges.push('Nadi Dosha (same Nadi type) without cancellations — warrants careful consideration and remedies.');
  }

  // Cross-chart aspects
  const favorable = aspects.filter(a => a.aspectType === 'trine' || a.aspectType === 'conjunction');
  const challenging = aspects.filter(a => a.aspectType === 'square' || a.aspectType === 'opposition');
  if (favorable.length >= 2) {
    strengths.push(`${favorable.length} favorable cross-chart aspects detected — natural energetic resonance between the charts.`);
  }
  if (challenging.length >= 2) {
    challenges.push(`${challenging.length} challenging cross-chart aspects — may create friction that requires conscious effort.`);
  }

  // Venus
  if (venus.chart1VenusSign === venus.chart2VenusSign) {
    strengths.push('Venus in the same sign for both partners — shared love language and romantic harmony.');
  }

  // Advice
  if (challenges.length === 0) {
    advice.push('This is a highly compatible match. Focus on maintaining open communication and mutual respect.');
    advice.push('Periodic puja or devotional practices together will further strengthen the bond.');
  } else if (challenges.length <= 2) {
    advice.push('The few challenges identified can be addressed through awareness and mutual understanding.');
    if (nadi.doshaPresent || (manglik.chart1HasManglik !== manglik.chart2HasManglik && manglik.cancellations.length === 0)) {
      advice.push('Consider consulting an experienced jyotishi for appropriate remedial measures (mantra, puja, gemstone).');
    }
    advice.push('Regular dialogue about expectations and emotional needs will bridge any gaps.');
  } else {
    advice.push('Several challenges exist — this match benefits from careful consideration and professional astrological counsel.');
    advice.push('If proceeding, invest in pre-marital counseling and establish strong communication patterns early.');
    advice.push('Remedial measures (Nadi dosha shanti, Mangal dosha puja) are recommended.');
  }

  // Overall narrative (3 paragraphs)
  const para1 = pct >= 50
    ? `The compatibility between these two charts shows a ${ashtaKuta.verdict === 'excellent' ? 'highly promising' : ashtaKuta.verdict === 'good' ? 'solid' : 'moderate'} foundation with an Ashta Kuta score of ${ashtaKuta.totalScore} out of 36 (${pct}%). ${manglik.chart1HasManglik || manglik.chart2HasManglik ? 'Manglik dosha is present, though ' + (manglik.cancellations.length > 0 ? 'cancellation factors reduce its significance.' : 'it warrants attention.') : 'No Manglik dosha complicates the picture.'} ${nadi.doshaPresent ? 'Nadi Dosha requires consideration, ' + (nadi.cancellations.length > 0 ? 'but mitigating factors provide relief.' : 'and remedial measures are advised.') : 'The absence of Nadi Dosha is a positive indicator for health and progeny.'}`
    : `The Ashta Kuta analysis shows a score of ${ashtaKuta.totalScore}/36 (${pct}%), placing this match in the ${ashtaKuta.verdict.replace('_', ' ')} category. While lower scores do not rule out a successful marriage, they indicate areas that need conscious attention. ${manglik.chart1HasManglik || manglik.chart2HasManglik ? 'The presence of Manglik dosha adds another dimension to consider.' : ''} ${nadi.doshaPresent ? 'Nadi Dosha is also present, which traditional texts treat seriously.' : ''}`;

  const para2 = aspects.length > 0
    ? `Cross-chart aspect analysis reveals ${aspects.length} significant planetary connections between the two horoscopes. ${favorable.length > 0 ? `The ${favorable.map(a => `${a.planet1.name}-${a.planet2.name} ${a.aspectType}`).join(', ')} ${favorable.length === 1 ? 'aspect is' : 'aspects are'} particularly favorable for emotional and romantic bonding.` : ''} ${challenging.length > 0 ? `The ${challenging.map(a => `${a.planet1.name}-${a.planet2.name} ${a.aspectType}`).join(', ')} ${challenging.length === 1 ? 'aspect' : 'aspects'} may create tension that requires patience.` : ''} The 7th house analysis adds further nuance to the partnership dynamics.`
    : 'The cross-chart aspect analysis shows no major tight aspects between the two horoscopes, suggesting an independent dynamic where each partner operates in their own rhythm. The 7th house analysis provides insight into each person\'s approach to marriage.';

  const para3 = `In summary, ${strengths.length > challenges.length ? 'the strengths of this match outweigh the challenges' : challenges.length > strengths.length ? 'there are more areas of concern than strength in this pairing' : 'this match has an even balance of strengths and challenges'}. ${advice[0] ?? ''} Remember that Vedic astrology provides guidance, not destiny — conscious effort, mutual respect, and devotion can overcome any astrological indication.`;

  return {
    strengths: strengths.slice(0, 5),
    challenges: challenges.slice(0, 4),
    advice,
    overallNarrative: [para1, para2, para3].join('\n\n'),
  };
}

// ── Main Export ───────────────────────────────────────────────

export function generateDetailedReport(
  chart1: KundaliData,
  chart2: KundaliData,
  matchResult: MatchResult,
): DetailedMatchReport {
  // Manglik
  const m1 = analyzeManglik(chart1);
  const m2 = analyzeManglik(chart2);
  const manglikCancellations = getManglikCancellations(chart1, chart2, m1, m2);

  const manglikSummary = !m1.hasManglik && !m2.hasManglik
    ? 'Neither partner has Manglik dosha. No Mars-related obstacles to marriage.'
    : m1.hasManglik && m2.hasManglik
      ? `Both partners have Manglik dosha (Partner 1: ${m1.severity}, Partner 2: ${m2.severity}). Mutual cancellation applies — this is considered favorable.`
      : m1.hasManglik
        ? `Partner 1 has Manglik dosha (${m1.severity} severity). Partner 2 does not.${manglikCancellations.length > 0 ? ' Cancellation factors identified.' : ' No cancellation factors found — remedies recommended.'}`
        : `Partner 2 has Manglik dosha (${m2.severity} severity). Partner 1 does not.${manglikCancellations.length > 0 ? ' Cancellation factors identified.' : ' No cancellation factors found — remedies recommended.'}`;

  const manglikAnalysis: DetailedMatchReport['manglikAnalysis'] = {
    chart1HasManglik: m1.hasManglik,
    chart2HasManglik: m2.hasManglik,
    chart1Severity: m1.severity,
    chart2Severity: m2.severity,
    cancellations: manglikCancellations,
    summary: manglikSummary,
  };

  // Nadi
  const nadiAnalysis = analyzeNadi(chart1, chart2);

  // Cross-chart aspects
  const crossChartAspects = analyzeCrossChartAspects(chart1, chart2);

  // 7th house
  const h1 = analyze7thHouse(chart1, 'Partner 1');
  const h2 = analyze7thHouse(chart2, 'Partner 2');
  const seventhHouseAnalysis = {
    chart1: h1,
    chart2: h2,
    compatibility: get7thHouseCompatibility(h1, h2),
  };

  // Venus
  const venusAn = analyzeVenus(chart1, chart2);

  // Narrative
  const narrativeSummary = generateNarrative(
    matchResult, manglikAnalysis, nadiAnalysis,
    crossChartAspects, seventhHouseAnalysis, venusAn,
  );

  return {
    ashtaKuta: matchResult,
    manglikAnalysis,
    nadiAnalysis,
    crossChartAspects,
    seventhHouseAnalysis,
    venusAnalysis: venusAn,
    narrativeSummary,
  };
}

// Re-export for tests
export { getNadiFromNakshatra, getManglikSeverity, detectAspect, analyzeManglik };
