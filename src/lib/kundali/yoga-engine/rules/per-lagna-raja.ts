/**
 * Per-Lagna Raja Yoga Rules
 *
 * Lagna-specific Raja Yogas formed by the strongest yogakaraka pairs for each
 * ascendant. Per BPHS Ch.34, when lords of kendras and trikonas are connected
 * (conjunction, mutual aspect, or sign exchange), Raja Yoga forms. The specific
 * pairs that produce the STRONGEST yogas differ by lagna.
 *
 * Each rule fires only when the chart's ascendant matches the specified sign.
 * Connection is defined as: conjunction (same house), mutual aspect, or
 * parivartana (sign exchange) between the two lords.
 *
 * Sources: BPHS Ch.34-35, Phaladeepika Ch.6, Saravali
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1=Aries through 12=Pisces (1-based)
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';
import { SIGN_LORDS } from '@/lib/constants/dignities';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if two planets are "connected" per Raja Yoga criteria:
 * 1. Conjunction (same house)
 * 2. Mutual aspect (each aspects the other's house)
 * 3. Sign exchange / Parivartana (each in the other's sign)
 */
function arePlanetsConnected(ctx: YogaContext, p1: number, p2: number): boolean {
  // 1. Conjunction — same house
  if (ctx.areConjunct(p1, p2)) return true;

  // 2. Mutual aspect — p1 aspects p2's house AND p2 aspects p1's house
  const h1 = ctx.planetHouse(p1);
  const h2 = ctx.planetHouse(p2);
  if (ctx.doesAspect(p1, h2) && ctx.doesAspect(p2, h1)) return true;

  // 3. Sign exchange — p1 in p2's sign AND p2 in p1's sign
  const s1 = ctx.planetSign(p1);
  const s2 = ctx.planetSign(p2);
  if (SIGN_LORDS[s1] === p2 && SIGN_LORDS[s2] === p1) return true;

  return false;
}

/**
 * Assess strength of a per-lagna Raja Yoga based on dignity and house placement.
 */
function perLagnaRajaStrength(
  ctx: YogaContext,
  result: YogaDetectionResult,
): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let strongFactors = 0;
  let weakFactors = 0;

  for (const pid of planets) {
    const dignity = ctx.dignity(pid);
    const house = ctx.planetHouse(pid);

    if (dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona') strongFactors += 2;
    else if (dignity === 'friend') strongFactors++;
    if (ctx.isKendra(house) || ctx.isTrikona(house)) strongFactors++;

    if (dignity === 'debilitated') weakFactors += 2;
    if (ctx.isDusthana(house)) weakFactors++;
    if (ctx.isCombust(pid)) weakFactors++;
  }

  if (strongFactors >= 4 && weakFactors === 0) return 'Strong';
  if (weakFactors >= 3) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-lagna Raja Yoga configuration
// ─────────────────────────────────────────────────────────────────────────────

interface LagnaRajaConfig {
  /** Ascendant sign number (1=Aries through 12=Pisces) */
  sign: number;
  /** English lagna name */
  lagnaEn: string;
  /** Hindi lagna name */
  lagnaHi: string;
  /** Sanskrit lagna name */
  lagnaSa: string;
  /** Strongest yogakaraka pair: [planetId1, planetId2] */
  pair: [number, number];
  /** English pair description (e.g. "Mars and Jupiter") */
  pairDescEn: string;
  /** Hindi pair description */
  pairDescHi: string;
  /** House lordship explanation */
  lordsEn: string;
  /** Hindi lordship explanation */
  lordsHi: string;
}

const LAGNA_CONFIGS: LagnaRajaConfig[] = [
  {
    sign: 1,
    lagnaEn: 'Aries', lagnaHi: 'मेष', lagnaSa: 'मेषम्',
    pair: [2, 4], // Mars + Jupiter
    pairDescEn: 'Mars (1st/8th lord) and Jupiter (9th/12th lord)',
    pairDescHi: 'मंगल (1/8 भावेश) और गुरु (9/12 भावेश)',
    lordsEn: 'Mars as lagna lord connecting with Jupiter as 9th lord (greatest trikona) forms a powerful dharma-karma axis',
    lordsHi: 'मंगल लग्नेश का गुरु 9वें भावेश (सबसे बड़ा त्रिकोण) से संबंध शक्तिशाली धर्म-कर्म अक्ष बनाता है',
  },
  {
    sign: 2,
    lagnaEn: 'Taurus', lagnaHi: 'वृषभ', lagnaSa: 'वृषभम्',
    pair: [6, 3], // Saturn + Mercury
    pairDescEn: 'Saturn (9th/10th lord) and Mercury (2nd/5th lord)',
    pairDescHi: 'शनि (9/10 भावेश) और बुध (2/5 भावेश)',
    lordsEn: 'Saturn as yogakaraka (9th+10th lord) connecting with Mercury (5th lord trikona) forms the strongest Raja Yoga',
    lordsHi: 'शनि योगकारक (9+10 भावेश) का बुध (5वें भावेश त्रिकोण) से संबंध सबसे शक्तिशाली राजयोग बनाता है',
  },
  {
    sign: 3,
    lagnaEn: 'Gemini', lagnaHi: 'मिथुन', lagnaSa: 'मिथुनम्',
    pair: [5, 6], // Venus + Saturn
    pairDescEn: 'Venus (5th/12th lord) and Saturn (8th/9th lord)',
    pairDescHi: 'शुक्र (5/12 भावेश) और शनि (8/9 भावेश)',
    lordsEn: 'Venus as 5th lord (trikona) connecting with Saturn as 9th lord (greatest trikona) forms a trikona-trikona Raja Yoga',
    lordsHi: 'शुक्र 5वें भावेश (त्रिकोण) का शनि 9वें भावेश (सबसे बड़ा त्रिकोण) से संबंध त्रिकोण-त्रिकोण राजयोग बनाता है',
  },
  {
    sign: 4,
    lagnaEn: 'Cancer', lagnaHi: 'कर्क', lagnaSa: 'कर्कम्',
    pair: [2, 4], // Mars + Jupiter
    pairDescEn: 'Mars (5th/10th lord — yogakaraka) and Jupiter (9th/6th lord)',
    pairDescHi: 'मंगल (5/10 भावेश — योगकारक) और गुरु (9/6 भावेश)',
    lordsEn: 'Mars as yogakaraka (5th+10th lord) connecting with Jupiter as 9th lord forms the most powerful Raja Yoga for Cancer',
    lordsHi: 'मंगल योगकारक (5+10 भावेश) का गुरु 9वें भावेश से संबंध कर्क के लिए सबसे शक्तिशाली राजयोग बनाता है',
  },
  {
    sign: 5,
    lagnaEn: 'Leo', lagnaHi: 'सिंह', lagnaSa: 'सिंहम्',
    pair: [2, 4], // Mars + Jupiter
    pairDescEn: 'Mars (4th/9th lord) and Jupiter (5th/8th lord)',
    pairDescHi: 'मंगल (4/9 भावेश) और गुरु (5/8 भावेश)',
    lordsEn: 'Mars as 9th lord (trikona) + 4th lord (kendra) connecting with Jupiter as 5th lord (trikona) — double trikona involvement',
    lordsHi: 'मंगल 9वें भावेश (त्रिकोण) + 4वें भावेश (केन्द्र) का गुरु 5वें भावेश (त्रिकोण) से संबंध — दोहरा त्रिकोण',
  },
  {
    sign: 6,
    lagnaEn: 'Virgo', lagnaHi: 'कन्या', lagnaSa: 'कन्या',
    pair: [5, 3], // Venus + Mercury
    pairDescEn: 'Venus (2nd/9th lord) and Mercury (1st/10th lord)',
    pairDescHi: 'शुक्र (2/9 भावेश) और बुध (1/10 भावेश)',
    lordsEn: 'Venus as 9th lord (trikona) connecting with Mercury as lagna+10th lord (kendra) forms the dharma-karma axis',
    lordsHi: 'शुक्र 9वें भावेश (त्रिकोण) का बुध लग्नेश+10वें भावेश (केन्द्र) से संबंध धर्म-कर्म अक्ष बनाता है',
  },
  {
    sign: 7,
    lagnaEn: 'Libra', lagnaHi: 'तुला', lagnaSa: 'तुला',
    pair: [6, 3], // Saturn + Mercury
    pairDescEn: 'Saturn (4th/5th lord) and Mercury (9th/12th lord)',
    pairDescHi: 'शनि (4/5 भावेश) और बुध (9/12 भावेश)',
    lordsEn: 'Saturn as 4th (kendra) + 5th (trikona) lord connecting with Mercury as 9th lord (trikona) — kendra-trikona axis',
    lordsHi: 'शनि 4वें (केन्द्र) + 5वें (त्रिकोण) भावेश का बुध 9वें भावेश (त्रिकोण) से संबंध — केन्द्र-त्रिकोण अक्ष',
  },
  {
    sign: 8,
    lagnaEn: 'Scorpio', lagnaHi: 'वृश्चिक', lagnaSa: 'वृश्चिकम्',
    pair: [4, 1], // Jupiter + Moon
    pairDescEn: 'Jupiter (2nd/5th lord) and Moon (9th lord)',
    pairDescHi: 'गुरु (2/5 भावेश) और चंद्र (9वें भावेश)',
    lordsEn: 'Jupiter as 5th lord (trikona) connecting with Moon as 9th lord (trikona) — the two great trines unite',
    lordsHi: 'गुरु 5वें भावेश (त्रिकोण) का चंद्र 9वें भावेश (त्रिकोण) से संबंध — दो महान त्रिकोणों का मिलन',
  },
  {
    sign: 9,
    lagnaEn: 'Sagittarius', lagnaHi: 'धनु', lagnaSa: 'धनुः',
    pair: [2, 0], // Mars + Sun
    pairDescEn: 'Mars (5th/12th lord) and Sun (9th lord)',
    pairDescHi: 'मंगल (5/12 भावेश) और सूर्य (9वें भावेश)',
    lordsEn: 'Mars as 5th lord (trikona) connecting with Sun as 9th lord (trikona) — pure trikona Raja Yoga',
    lordsHi: 'मंगल 5वें भावेश (त्रिकोण) का सूर्य 9वें भावेश (त्रिकोण) से संबंध — शुद्ध त्रिकोण राजयोग',
  },
  {
    sign: 10,
    lagnaEn: 'Capricorn', lagnaHi: 'मकर', lagnaSa: 'मकरम्',
    pair: [5, 3], // Venus + Mercury
    pairDescEn: 'Venus (5th/10th lord — yogakaraka) and Mercury (6th/9th lord)',
    pairDescHi: 'शुक्र (5/10 भावेश — योगकारक) और बुध (6/9 भावेश)',
    lordsEn: 'Venus as yogakaraka (5th+10th lord) connecting with Mercury as 9th lord forms the most powerful Raja Yoga for Capricorn',
    lordsHi: 'शुक्र योगकारक (5+10 भावेश) का बुध 9वें भावेश से संबंध मकर के लिए सबसे शक्तिशाली राजयोग बनाता है',
  },
  {
    sign: 11,
    lagnaEn: 'Aquarius', lagnaHi: 'कुम्भ', lagnaSa: 'कुम्भम्',
    pair: [5, 2], // Venus + Mars
    pairDescEn: 'Venus (4th/9th lord) and Mars (3rd/10th lord)',
    pairDescHi: 'शुक्र (4/9 भावेश) और मंगल (3/10 भावेश)',
    lordsEn: 'Venus as 9th lord (trikona) + 4th lord (kendra) connecting with Mars as 10th lord (kendra) — kendra-trikona axis',
    lordsHi: 'शुक्र 9वें भावेश (त्रिकोण) + 4वें भावेश (केन्द्र) का मंगल 10वें भावेश (केन्द्र) से संबंध — केन्द्र-त्रिकोण अक्ष',
  },
  {
    sign: 12,
    lagnaEn: 'Pisces', lagnaHi: 'मीन', lagnaSa: 'मीनम्',
    pair: [2, 1], // Mars + Moon
    pairDescEn: 'Mars (2nd/9th lord) and Moon (5th lord)',
    pairDescHi: 'मंगल (2/9 भावेश) और चंद्र (5वें भावेश)',
    lordsEn: 'Mars as 9th lord (trikona) connecting with Moon as 5th lord (trikona) — the two great trines unite for Pisces',
    lordsHi: 'मंगल 9वें भावेश (त्रिकोण) का चंद्र 5वें भावेश (त्रिकोण) से संबंध — मीन के लिए दो महान त्रिकोणों का मिलन',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Generate rules from config
// ─────────────────────────────────────────────────────────────────────────────

function buildRule(cfg: LagnaRajaConfig): YogaRule {
  const signName = cfg.lagnaEn.toLowerCase();
  const [p1, p2] = cfg.pair;

  return {
    id: `per-lagna-raja-${signName}`,
    name: {
      en: `Raja Yoga for ${cfg.lagnaEn} Lagna`,
      hi: `${cfg.lagnaHi} लग्न राजयोग`,
      sa: `${cfg.lagnaSa}लग्नराजयोगः`,
    },
    group: 'raja',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.34-35',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Only applicable for this specific ascendant
        if (ctx.ascendantSign !== cfg.sign) {
          return { present: false, involvedPlanets: [] };
        }

        // Check if the yogakaraka pair is connected
        if (!arePlanetsConnected(ctx, p1, p2)) {
          return { present: false, involvedPlanets: [] };
        }

        // Determine connection type for customData
        let connectionType = 'unknown';
        if (ctx.areConjunct(p1, p2)) {
          connectionType = 'conjunction';
        } else {
          const h1 = ctx.planetHouse(p1);
          const h2 = ctx.planetHouse(p2);
          if (ctx.doesAspect(p1, h2) && ctx.doesAspect(p2, h1)) {
            connectionType = 'mutual_aspect';
          }
          const s1 = ctx.planetSign(p1);
          const s2 = ctx.planetSign(p2);
          if (SIGN_LORDS[s1] === p2 && SIGN_LORDS[s2] === p1) {
            connectionType = 'exchange';
          }
        }

        return {
          present: true,
          involvedPlanets: [p1, p2],
          customData: { lagna: cfg.lagnaEn, connectionType },
        };
      },
    },

    assessStrength: perLagnaRajaStrength,

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 3,

    formationRule: {
      en: `${cfg.pairDescEn} connected by conjunction, mutual aspect, or sign exchange — ${cfg.lordsEn}`,
      hi: `${cfg.pairDescHi} का युति, परस्पर दृष्टि या राशि परिवर्तन से संबंध — ${cfg.lordsHi}`,
    },
    description: {
      en: `Per-lagna Raja Yoga for ${cfg.lagnaEn} ascendant: ${cfg.lordsEn}. This is the most potent Raja Yoga combination specific to ${cfg.lagnaEn} lagna per BPHS Ch.34. When these lords connect, the native rises to positions of power, authority, and material prosperity. The strength depends on both planets' dignity and house placement — exalted or own-sign planets in kendras/trikonas produce the strongest manifestation.`,
      hi: `${cfg.lagnaHi} लग्न के लिए विशिष्ट राजयोग: ${cfg.lordsHi}। BPHS अध्याय 34 के अनुसार ${cfg.lagnaHi} लग्न के लिए सबसे शक्तिशाली राजयोग संयोजन है। जब ये स्वामी जुड़ते हैं, जातक सत्ता, अधिकार और भौतिक समृद्धि के पदों पर पहुँचता है। बल दोनों ग्रहों की गरिमा और भाव स्थिति पर निर्भर करता है।`,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 12 per-lagna Raja Yoga rules — one for each ascendant sign.
 * BPHS Ch.34-35: strongest yogakaraka pairs per lagna.
 */
export const PER_LAGNA_RAJA_RULES: YogaRule[] = LAGNA_CONFIGS.map(buildRule);
